"use strict";
// COMMONS CHEST work bot v2 - dig-in-place edition.
// Lesson from v1 + tonight's movement findings: the body pins at fixed
// micro-positions for minutes; a column 5 blocks away may be unreachable
// while digging from the current stand works. So: NEVER require travel
// before digging. Work wherever the body stands; re-scan continuously;
// craft the moment materials allow; walk only while carrying the goal.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder, Movements, goals } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/commons-chest-result2.json";
const SITE = { x: 63, y: 68, z: -82 };
const SIGN = { x: 64, y: 68, z: -82 };
const TABLE = { x: 64, y: 68, z: -83 };
const R = { ts: new Date().toISOString(), steps: [], deaths: 0, version: 2 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function save() { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); }
function step(name, data) { R.steps.push({ t: new Date().toISOString(), name, data }); console.log("STEP", name, JSON.stringify(data || {})); save(); }
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
bot.loadPlugin(pathfinder);
function pos() { const p = bot.entity.position; return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }; }
bot.on("death", () => { R.deaths++; step("death", { n: R.deaths, pos: pos() }); });
bot.on("error", (e) => console.log("ERR", e && e.message));
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
// walk with 12 s hops and raw bursts, up to budget; returns distance left
async function walkTo(tx, tz, budgetMs, wantDist) {
  const t0 = Date.now();
  while (Date.now() - t0 < budgetMs) {
    const p = pos();
    const d = Math.hypot(tx - p.x, tz - p.z);
    if (d <= (wantDist || 2)) return { ok: true, pos: p, d };
    try {
      const hx = p.x + Math.max(-6, Math.min(6, tx - p.x));
      const hz = p.z + Math.max(-6, Math.min(6, tz - p.z));
      bot.pathfinder.setGoal(new goals.GoalNear(Math.floor(hx), Math.floor(p.y), Math.floor(hz), 1));
      await sleep(12000);
      bot.pathfinder.setGoal(null);
    } catch (e) {}
    let np = pos();
    if (Math.hypot(np.x - p.x, np.z - p.z) < 0.3) {
      try {
        bot.lookAt(new Vec3(tx, np.y + 1, tz), true);
        bot.setControlState("forward", true); bot.setControlState("jump", true);
        await sleep(2500);
        bot.setControlState("forward", false); bot.setControlState("jump", false);
      } catch (e) {}
      await sleep(4000);
    }
  }
  const p = pos();
  return { ok: Math.hypot(tx - p.x, tz - p.z) <= (wantDist || 2) + 2, pos: p, d: Math.hypot(tx - p.x, tz - p.z) };
}
// Scaffold tower next to a trunk and dig it down. Assumes bot stands within
// ~1.5 blocks of the trunk column OR can reach its base cell.
async function fellColumn(cx, cz, want) {
  // find ground top beside the column
  const seek = async () => {
    // try every log block of the column from lowest up; dig any reachable
    let dugAny = false;
    for (let round = 0; round < 10 && logCount() < want; round++) {
      const blocks = [];
      for (let y = 55; y < 85; y++) {
        const b = bot.blockAt(new Vec3(cx, y, cz));
        if (b && /_log$/.test(b.name)) blocks.push(b);
      }
      if (!blocks.length) break;
      let dug = false;
      for (const b of blocks) {
        if (bot.canDigBlock(b)) {
          try {
            bot.pathfinder.setGoal(null);
            await bot.lookAt(b.position.offset(0.5, 0.5, 0.5), true);
            await bot.dig(b);
            dug = true; dugAny = true;
            await sleep(500);
            break;
          } catch (e) { console.log("dig err", e.message); }
        }
      }
      if (dug) { await sleep(900); continue; }
      // nothing reachable: tower up on dirt next to the column if we have dirt
      const dirt = bot.inventory.items().find(i => i.name === "dirt" || i.name === "cobblestone");
      const p = bot.entity.position;
      const bx = Math.floor(p.x), bz = Math.floor(p.z);
      if (dirt && Math.abs(bx - cx) + Math.abs(bz - cz) <= 2) {
        try {
          await bot.equip(dirt, "hand");
          const below = bot.blockAt(new Vec3(bx, Math.floor(p.y) - 1, bz));
          bot.setControlState("jump", true);
          await sleep(350);
          await bot.placeBlock(below, new Vec3(0, -1, 0)).catch(() => {});
          bot.setControlState("jump", false);
          await sleep(600);
        } catch (e) { await sleep(1500); }
      } else {
        // shuffle toward the column base in short bursts
        await walkTo(cx, cz, 15000, 1.2);
      }
    }
    return dugAny;
  };
  await seek();
  // collect drops: wander the base cell briefly
  await walkTo(cx, cz, 10000, 1.0);
  await sleep(800);
}
bot.once("spawn", async () => {
  try {
    await sleep(9000);
    step("landing", { pos: pos(), health: bot.health, food: bot.food });
    const mv = new Movements(bot);
    mv.canDig = true;
    bot.pathfinder.setMovements(mv);

    // PHASE A: fell the oak at (34,-101) - 6 blocks west of current stand.
    await walkTo(35, -100, 90000, 2.2);
    step("at-oak", { pos: pos() });
    await fellColumn(34, -101, 8);
    step("after-oak", { pos: pos(), logs: logCount(), inv: inv() });
    // PHASE B: top up at the second oak (46,-101) if short - it is 12 east,
    // partway toward the corridor anyway.
    if (logCount() < 6) {
      await walkTo(45, -100, 150000, 2.2);
      await fellColumn(46, -101, 8);
      step("after-oak2", { pos: pos(), logs: logCount(), inv: inv() });
    }
    if (logCount() < 5) { R.verdict = "FAIL gather: " + logCount() + " logs"; save(); bot.quit(); process.exit(3); }

    // PHASE C: travel east to the site apron carrying everything.
    const t = await walkTo(64, -80, 7 * 60 * 1000, 2.5);
    step("at-site", { ok: t.ok, pos: pos(), d: t.d });
    if (!t.ok) { R.verdict = "FAIL travel to site: d=" + t.d; save(); bot.quit(); process.exit(6); }

    // PHASE D: craft chain.
    const logTypes = [...new Set(bot.inventory.items().filter(i => /_log$/.test(i.name)).map(i => i.name.replace(/_log$/, "")))];
    for (const lt of logTypes) { const n = count(lt + "_log"); for (let i = 0; i < n; i++) await craftByName(lt + "_planks", 1, null); }
    step("planks", { inv: inv() });
    await craftByName("crafting_table", 1, null);
    const tableItem = bot.inventory.items().find(i => i.name === "crafting_table");
    await bot.equip(tableItem, "hand");
    const groundT = bot.blockAt(new Vec3(TABLE.x, TABLE.y - 1, TABLE.z));
    await bot.placeBlock(groundT, new Vec3(0, 1, 0));
    await sleep(500);
    const tableBlock = bot.blockAt(new Vec3(TABLE.x, TABLE.y, TABLE.z));
    step("table-placed", { block: tableBlock && tableBlock.name });
    await craftByName("chest", 1, tableBlock);
    await craftByName("stick", 1, tableBlock);
    const plankTypes = bot.inventory.items().filter(i => /_planks$/.test(i.name));
    plankTypes.sort((a, b) => b.count - a.count);
    const signType = plankTypes[0].name.replace(/_planks$/, "");
    await craftByName(signType + "_sign", 1, tableBlock);
    step("crafted", { inv: inv(), signType });

    // PHASE E: place chest + sign, verify.
    await walkTo(63, -80, 60000, 2);
    const chestItem = bot.inventory.items().find(i => i.name === "chest");
    await bot.equip(chestItem, "hand");
    const groundC = bot.blockAt(new Vec3(SITE.x, SITE.y - 1, SITE.z));
    await bot.placeBlock(groundC, new Vec3(0, 1, 0));
    await sleep(600);
    const chestBlock = bot.blockAt(new Vec3(SITE.x, SITE.y, SITE.z));
    step("chest-placed", { block: chestBlock && chestBlock.name });
    if (!chestBlock || chestBlock.name !== "chest") { R.verdict = "FAIL chest placement: " + (chestBlock && chestBlock.name); save(); bot.quit(); process.exit(4); }
    R.placedAt = new Date().toISOString();
    const win = await bot.openChest(chestBlock);
    R.chestContentsAtBirth = win.containerItems().map(i => ({ name: i.name, count: i.count }));
    win.close();
    step("chest-verified", { contents: R.chestContentsAtBirth });
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
    } catch (e) { step("sign-text-error", { err: e.message }); R.signTextError = e.message; }
    R.verdict = "PLACED";
    save();
    console.log("COMMONS2 DONE", JSON.stringify({ placedAt: R.placedAt, deaths: R.deaths }));
    bot.quit();
    process.exit(0);
  } catch (e) {
    R.verdict = "ERROR " + e.message;
    step("fatal", { err: e.message, pos: (() => { try { return pos(); } catch (_) { return null; } })(), inv: (() => { try { return inv(); } catch (_) { return null; } })() });
    save();
    try { bot.quit(); } catch (_) {}
    process.exit(5);
  }
});
setTimeout(() => { R.verdict = R.verdict || "TIMEOUT"; step("timeout", {}); save(); process.exit(2); }, 30 * 60 * 1000);
