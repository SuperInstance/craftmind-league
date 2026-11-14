"use strict";
// COMMONS CHEST work bot v6 - patience edition (the Cody pattern).
// Movement law (diag2-7): this body crosses pitted spawn country only in
// bursts between pin cells; what works is relentless re-aim with rotating
// styles and aim offsets over many minutes. Digs: adjacency only, each
// verified against the world block afterwards. No pathfinder.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/commons-chest-result6.json";
const SITE = { x: 63, y: 68, z: -82 };
const SIGN = { x: 64, y: 68, z: -82 };
const TABLE = { x: 64, y: 68, z: -83 };
const R = { ts: new Date().toISOString(), steps: [], deaths: 0, version: 6 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function save() { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); }
function step(name, data) { R.steps.push({ t: new Date().toISOString(), name, data }); console.log("STEP", name, JSON.stringify(data || {})); save(); }
function quit(code) { try { bot.quit(); } catch (_) {} setTimeout(() => process.exit(code), 600); }
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
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
async function burst(tx, tz, secs, style) {
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(tx, p.y + 1, tz), true); } catch (e) {}
  if (style === 1 || style === 2) bot.setControlState("sprint", true);
  if (style === 2 || style === 3) bot.setControlState("jump", true);
  bot.setControlState("forward", true);
  await sleep(secs * 1000);
  bot.clearControlStates();
  await sleep(250);
  return pos();
}
// Patient mover: rotate styles (walk, sprint, sprintjump, jumpwalk) and aim
// offsets (0, +-0.5, +-1.0, +-1.57 rad detours) until arrival or budget end.
async function moveTo(tx, tz, budgetMs, wantDist, label) {
  const t0 = Date.now();
  let k = 0, best = 1e9, lastLog = 0;
  while (Date.now() - t0 < budgetMs) {
    const p = pos();
    const d = Math.hypot(tx - p.x, tz - p.z);
    if (d <= wantDist) { step("arrive", { label, pos: p, d: +d.toFixed(2), secs: Math.round((Date.now() - t0) / 1000) }); return { ok: true, pos: p, d }; }
    if (d < best) best = d;
    const baseAng = Math.atan2(tz - p.z, tx - p.x);
    const offs = [0, 0.5, -0.5, 1.0, -1.0, 1.57, -1.57, 0];
    const ang = baseAng + offs[k % offs.length];
    const style = k % 4;
    await burst(p.x + Math.cos(ang) * 9, p.z + Math.sin(ang) * 9, 1.7, style);
    k++;
    if (Date.now() - lastLog > 60000) { lastLog = Date.now(); step("moving", { label, pos: pos(), d: +Math.hypot(tx - pos().x, tz - pos().z).toFixed(2), best: +best.toFixed(2), tries: k }); }
  }
  const p = pos();
  step("move-fail", { label, pos: p, d: +Math.hypot(tx - p.x, tz - p.z).toFixed(2), best: +best.toFixed(2), tries: k });
  return { ok: Math.hypot(tx - p.x, tz - p.z) <= wantDist + 1.5, pos: p, d: Math.hypot(tx - p.x, tz - p.z) };
}
async function fellAdj(cx, cz, want, budgetMs) {
  const stands = [ [cx + 1.5, cz + 0.5], [cx - 0.5, cz + 0.5], [cx + 0.5, cz + 1.5], [cx + 0.5, cz - 0.5] ];
  const t0 = Date.now();
  for (const [sx, sz] of stands) {
    if (logCount() >= want || Date.now() - t0 > budgetMs) break;
    const r = await moveTo(sx, sz, Math.min(240000, budgetMs - (Date.now() - t0)), 1.1, "stand@" + cx + "," + cz);
    step("fell-stand", { col: cx + "," + cz, ok: r.ok, pos: pos() });
    if (!r.ok) continue;
    for (let round = 0; round < 10 && logCount() < want; round++) {
      const blocks = [];
      for (let y = 55; y < 90; y++) { const b = bot.blockAt(new Vec3(cx, y, cz)); if (b && /_log$/.test(b.name)) blocks.push(b); }
      if (!blocks.length) break;
      const target = blocks[0];
      const dist = target.position.distanceTo(bot.entity.position);
      if (dist > 3.5) { step("fell-out-of-reach", { col: cx + "," + cz, y: target.position.y, dist: +dist.toFixed(2), pos: pos() }); break; }
      try { await bot.lookAt(target.position.offset(0.5, 0.5, 0.5), true); await bot.dig(target); } catch (e) { step("dig-err", { err: e.message }); break; }
      await sleep(500);
      const after = bot.blockAt(new Vec3(cx, target.position.y, cz));
      const got = logCount();
      step("dig-check", { col: cx + "," + cz, y: target.position.y, after: after && after.name, logs: got });
      if (after && /_log$/.test(after.name)) break;
      await burst(cx + 0.5, cz + 0.5, 0.9, 0);
      await sleep(700);
    }
  }
}
bot.once("spawn", async () => {
  try {
    await sleep(9000);
    step("landing", { pos: pos(), health: bot.health, food: bot.food, inv: inv() });
    // nearest trees first (diag7 scan): (35,-91), (40,-88), (46,-91),
    // then (34,-101), (46,-101), (38,-103).
    for (const [cx, cz] of [[35, -91], [40, -88], [46, -91], [34, -101], [46, -101], [38, -103]]) {
      if (logCount() >= 5) break;
      await fellAdj(cx, cz, 8, 8 * 60 * 1000);
      step("tree-done", { col: cx + "," + cz, pos: pos(), logs: logCount(), inv: inv() });
    }
    if (logCount() < 5) { R.verdict = "FAIL gather: " + logCount() + " logs"; save(); quit(3); return; }
    const t = await moveTo(64.5, -80.5, 12 * 60 * 1000, 2.2, "site");
    step("at-site", { ok: t.ok, pos: pos(), d: t.d !== undefined ? +t.d.toFixed(2) : null });
    if (!t.ok) { R.verdict = "FAIL travel to site"; save(); quit(6); return; }
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
    await moveTo(63.5, -80.5, 180000, 1.6, "chest-stand");
    const chestItem = bot.inventory.items().find(i => i.name === "chest");
    await bot.equip(chestItem, "hand");
    const groundC = bot.blockAt(new Vec3(SITE.x, SITE.y - 1, SITE.z));
    await bot.placeBlock(groundC, new Vec3(0, 1, 0));
    await sleep(600);
    const chestBlock = bot.blockAt(new Vec3(SITE.x, SITE.y, SITE.z));
    step("chest-placed", { block: chestBlock && chestBlock.name });
    if (!chestBlock || chestBlock.name !== "chest") { R.verdict = "FAIL chest placement: " + (chestBlock && chestBlock.name); save(); quit(4); return; }
    R.placedAt = new Date().toISOString();
    const win = await bot.openChest(chestBlock);
    R.chestContentsAtBirth = win.containerItems().map(i => ({ name: i.name, count: i.count }));
    win.close();
    step("chest-verified", { contents: R.chestContentsAtBirth });
    await moveTo(64.5, -80.5, 180000, 1.6, "sign-stand");
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
    console.log("COMMONS6 DONE", JSON.stringify({ placedAt: R.placedAt, deaths: R.deaths }));
    quit(0);
  } catch (e) {
    R.verdict = "ERROR " + e.message;
    step("fatal", { err: e.message, pos: (() => { try { return pos(); } catch (_) { return null; } })(), inv: (() => { try { return inv(); } catch (_) { return null; } })() });
    save();
    quit(5);
  }
});
setTimeout(() => { R.verdict = R.verdict || "TIMEOUT"; step("timeout", {}); save(); process.exit(2); }, 48 * 60 * 1000);
