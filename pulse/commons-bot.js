"use strict";
// COMMONS CHEST work bot - bare mineflayer, no framework, no citizen code.
// Gathers its own wood near the corridor, crafts table+chest+sign, travels
// with a patient hop-chain, places chest at SITE + standing sign beside it,
// verifies from world state. Writes result JSON throughout.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder, Movements, goals } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/commons-chest-result.json";
const SITE = { x: 63, y: 68, z: -82 };       // chest block position (ground top 67)
const SIGN = { x: 64, y: 68, z: -82 };       // standing sign, east of chest
const TABLE = { x: 64, y: 68, z: -83 };      // temporary crafting table spot
const R = { ts: new Date().toISOString(), steps: [], deaths: 0 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function save() { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); }
function step(name, data) { R.steps.push({ t: new Date().toISOString(), name, data }); console.log("STEP", name, JSON.stringify(data || {})); save(); }
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
bot.loadPlugin(pathfinder);
function pos() { const p = bot.entity.position; return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }; }
bot.on("death", () => { R.deaths++; step("death", { n: R.deaths, pos: pos() }); });
bot.on("error", (e) => console.log("ERR", e && e.message));
bot.on("kicked", (r) => { step("kicked", { r: String(r) }); });

async function gotoPatient(tx, tz, range, deadlineMs) {
  const t0 = Date.now();
  let last = pos();
  let stall = 0;
  while (Date.now() - t0 < deadlineMs) {
    const p = pos();
    const d = Math.hypot(tx - p.x, tz - p.z);
    if (d <= (range || 2)) return { ok: true, pos: p };
    // hop toward target, <=6 blocks
    const hx = p.x + Math.max(-6, Math.min(6, tx - p.x));
    const hz = p.z + Math.max(-6, Math.min(6, tz - p.z));
    try {
      const g = new goals.GoalNear(Math.floor(hx), Math.floor(p.y), Math.floor(hz), 1);
      bot.pathfinder.setGoal(g);
      await sleep(9000);
      bot.pathfinder.setGoal(null);
    } catch (e) { console.log("goto err", e.message); }
    let np = pos();
    let moved = Math.hypot(np.x - last.x, np.z - last.z);
    if (moved < 0.3) {
      stall++;
      // raw burst toward target
      try {
        bot.lookAt(new Vec3(tx, np.y + 1.2, tz), true);
        bot.setControlState("forward", true);
        bot.setControlState("jump", true);
        await sleep(2200);
        bot.setControlState("forward", false);
        bot.setControlState("jump", false);
      } catch (e) {}
      await sleep(3000);
      np = pos();
      moved = Math.hypot(np.x - last.x, np.z - last.z);
      if (moved < 0.3 && stall >= 4) { last = np; stall = 0; await sleep(8000); }
    } else { stall = 0; }
    last = pos();
  }
  const p = pos();
  return { ok: Math.hypot(tx - p.x, tz - p.z) <= (range || 2) + 2, pos: p };
}

function inv() { const o = {}; for (const it of bot.inventory.items()) o[it.name] = (o[it.name] || 0) + it.count; return o; }
function count(name) { return bot.inventory.items().filter(i => i.name === name).reduce((a, i) => a + i.count, 0); }
function logCount() { return bot.inventory.items().filter(i => /_log$/.test(i.name)).reduce((a, i) => a + i.count, 0); }

async function craftByName(name, n, tableBlock) {
  const item = bot.registry.itemsByName[name];
  if (!item) throw new Error("no item " + name);
  const recipes = bot.recipesFor(item.id, null, 1, tableBlock || null);
  if (!recipes.length) throw new Error("no recipe for " + name);
  await bot.craft(recipes[0], n, tableBlock || null);
}

async function gatherLogs(need) {
  const center = bot.entity.position.clone();
  const found = bot.findBlocks({ matching: (b) => /_log$/.test(b.name), maxDistance: 48, count: 60 });
  step("gather-scan", { found: found.length, around: pos() });
  // group into columns, nearest first
  const cols = {};
  for (const f of found) { const k = f.x + "," + f.z; (cols[k] = cols[k] || []).push(f.y); }
  const colList = Object.entries(cols).map(([k, ys]) => { const [x, z] = k.split(",").map(Number); return { x, z, ys: ys.sort((a, b) => a - b), d: Math.hypot(x - center.x, z - center.z) }; }).sort((a, b) => a.d - b.d);
  for (const col of colList) {
    if (logCount() >= need) break;
    const baseY = col.ys[0];
    const go = await gotoPatient(col.x, col.z, 2.5, 60000);
    step("gather-goto", { col: col.x + "," + col.z, ok: go.ok, pos: pos(), logs: logCount() });
    for (let i = 0; i < 8 && logCount() < need; i++) {
      // find lowest log block of this column still present within reach
      let target = null;
      for (let y = baseY; y < baseY + 9; y++) {
        const b = bot.blockAt(new Vec3(col.x, y, col.z));
        if (b && /_log$/.test(b.name) && bot.canDigBlock(b)) { target = b; break; }
      }
      if (!target) break;
      try { await bot.dig(target); } catch (e) { console.log("dig err", e.message); break; }
      await sleep(600);
      // step onto drops
      await gotoPatient(col.x, col.z, 1.2, 12000);
      await sleep(800);
    }
    step("gather-col-done", { col: col.x + "," + col.z, logs: logCount(), inv: inv() });
  }
  return logCount();
}

bot.once("spawn", async () => {
  try {
    R.spawnAt = new Date().toISOString();
    await sleep(9000);
    R.landing = pos();
    R.landingHealth = bot.health; R.landingFood = bot.food;
    step("landing", { pos: R.landing, health: bot.health, food: bot.food });
    const mv = new Movements(bot);
    mv.canDig = true;
    bot.pathfinder.setMovements(mv);

    // Phase 1: travel to corridor staging (60,-84), outside both aprons.
    const t1 = await gotoPatient(60, -84, 3, 8 * 60 * 1000);
    step("travel-staging", { ok: t1.ok, pos: pos() });

    // Phase 2: gather own wood near the corridor.
    const logs = await gatherLogs(8);
    step("gather-done", { logs, inv: inv() });
    if (logs < 5) { R.verdict = "FAIL gather: only " + logs + " logs"; save(); bot.quit(); process.exit(3); }

    // back to site apron for crafting
    await gotoPatient(64, -83, 2.5, 120000);
    step("at-craft-spot", { pos: pos(), inv: inv() });

    // Phase 3: craft. One wood type end-to-end where type matters (sign).
    const logTypes = bot.inventory.items().filter(i => /_log$/.test(i.name)).map(i => i.name.replace(/_log$/, ""));
    for (const t of logTypes) {
      const n = count(t + "_log");
      for (let i = 0; i < n; i++) await craftByName(t + "_planks", 1, null);
    }
    step("planks", { inv: inv() });
    // crafting table (any planks)
    await craftByName("crafting_table", 1, null);
    const tableItem = bot.inventory.items().find(i => i.name === "crafting_table");
    await bot.equip(tableItem, "hand");
    const groundT = bot.blockAt(new Vec3(TABLE.x, TABLE.y - 1, TABLE.z));
    await bot.placeBlock(groundT, new Vec3(0, 1, 0));
    await sleep(500);
    const tableBlock = bot.blockAt(new Vec3(TABLE.x, TABLE.y, TABLE.z));
    step("table-placed", { block: tableBlock && tableBlock.name });
    // chest (planks, any mix ok), stick, sign (single-type planks)
    await craftByName("chest", 1, tableBlock);
    await craftByName("stick", 1, tableBlock);
    const plankTypes = bot.inventory.items().filter(i => /_planks$/.test(i.name));
    plankTypes.sort((a, b) => b.count - a.count);
    const signType = plankTypes[0].name.replace(/_planks$/, "");
    await craftByName(signType + "_sign", 1, tableBlock);
    step("crafted", { inv: inv(), signType });

    // Phase 4: place chest at SITE against ground (63,67,-82).
    await gotoPatient(63, -80, 2, 60000);
    const chestItem = bot.inventory.items().find(i => i.name === "chest");
    await bot.equip(chestItem, "hand");
    const groundC = bot.blockAt(new Vec3(SITE.x, SITE.y - 1, SITE.z));
    step("chest-ground", { ground: groundC && groundC.name, groundPos: groundC && groundC.position });
    await bot.placeBlock(groundC, new Vec3(0, 1, 0));
    await sleep(600);
    const chestBlock = bot.blockAt(new Vec3(SITE.x, SITE.y, SITE.z));
    step("chest-placed", { block: chestBlock && chestBlock.name });
    if (!chestBlock || chestBlock.name !== "chest") { R.verdict = "FAIL chest placement: " + (chestBlock && chestBlock.name); save(); bot.quit(); process.exit(4); }
    R.placedAt = new Date().toISOString();
    // verify empty
    const win = await bot.openChest(chestBlock);
    const items = win.containerItems();
    R.chestContentsAtBirth = items.map(i => ({ name: i.name, count: i.count }));
    win.close();
    step("chest-verified", { contents: R.chestContentsAtBirth });

    // Phase 5: standing sign at SIGN cell.
    const signItem = bot.inventory.items().find(i => /_sign$/.test(i.name));
    await bot.equip(signItem, "hand");
    const groundS = bot.blockAt(new Vec3(SIGN.x, SIGN.y - 1, SIGN.z));
    await bot.placeBlock(groundS, new Vec3(0, 1, 0));
    await sleep(600);
    let signBlock = bot.blockAt(new Vec3(SIGN.x, SIGN.y, SIGN.z));
    step("sign-placed", { block: signBlock && signBlock.name });
    const LINES = ["COMMONS CHEST", "take what you need,", "leave what you can", ""];
    try {
      await bot.updateSign(signBlock, LINES);
      await sleep(800);
      signBlock = bot.blockAt(new Vec3(SIGN.x, SIGN.y, SIGN.z));
      let text = null;
      try { text = signBlock.getSignText ? signBlock.getSignText() : (signBlock.signText || null); } catch (e) { text = "unreadable:" + e.message; }
      R.signText = text; R.signBlock = signBlock && signBlock.name;
      step("sign-text", { text, block: R.signBlock });
    } catch (e) {
      step("sign-text-error", { err: e.message });
      R.signTextError = e.message;
    }
    R.verdict = "PLACED";
    save();
    console.log("COMMONS DONE", JSON.stringify({ placedAt: R.placedAt, deaths: R.deaths }));
    bot.quit();
    process.exit(0);
  } catch (e) {
    R.verdict = "ERROR " + e.message;
    step("fatal", { err: e.message, stack: String(e.stack || "").slice(0, 400), pos: (() => { try { return pos(); } catch (_) { return null; } })(), inv: (() => { try { return inv(); } catch (_) { return null; } })() });
    save();
    try { bot.quit(); } catch (_) {}
    process.exit(5);
  }
});
setTimeout(() => { R.verdict = R.verdict || "TIMEOUT"; step("timeout", { pos: (() => { try { return pos(); } catch (_) { return null; } })() }); save(); process.exit(2); }, 32 * 60 * 1000);
