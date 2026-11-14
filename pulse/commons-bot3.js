"use strict";
// COMMONS CHEST work bot v3 - ranged-dig edition.
// Measured facts this design rests on (commons-diag, 2026-11-08T08:29Z):
//  - bot.dig(block) completed in 3.8 s on an oak_log 7.95 blocks away with
//    canDigBlock === false (distance is not enforced on dig).
//  - The dug drop never reached inventory: collection requires the body to
//    physically walk over the drop cell.
//  - bot.pathfinder goto reports success without the body moving (the body
//    pins); raw control-state bursts DO move the body in short hops.
// Design: no pathfinder anywhere. Short raw bursts for position, ranged dig
// for all felling, walk-over passes for collection.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/commons-chest-result3.json";
const SITE = { x: 63, y: 68, z: -82 };
const SIGN = { x: 64, y: 68, z: -82 };
const TABLE = { x: 64, y: 68, z: -83 };
const R = { ts: new Date().toISOString(), steps: [], deaths: 0, version: 3 };
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
// One raw burst toward a target: look, forward (+jump if stalled), secs.
async function burst(tx, tz, secs, jumpAlways) {
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(tx, p.y + 1.2, tz), true); } catch (e) {}
  bot.setControlState("forward", true);
  if (jumpAlways) bot.setControlState("jump", true);
  await sleep(secs * 1000);
  bot.setControlState("forward", false);
  bot.setControlState("jump", false);
  await sleep(300);
  return pos();
}
// Patient hop chain: bursts with re-aim, stall detection adds jump.
async function hopTo(tx, tz, budgetMs, wantDist) {
  const t0 = Date.now();
  let lastP = pos(), stalls = 0;
  while (Date.now() - t0 < budgetMs) {
    const p = pos();
    const d = Math.hypot(tx - p.x, tz - p.z);
    if (d <= wantDist) return { ok: true, pos: p, d: +d.toFixed(2) };
    const moved = Math.hypot(p.x - lastP.x, p.z - lastP.z);
    if (moved < 0.15) stalls++; else stalls = 0;
    lastP = p;
    await burst(tx, tz, 1.6, stalls >= 1);
    if (stalls > 14) return { ok: false, pos: pos(), d: +Math.hypot(tx - p.x, tz - p.z).toFixed(2), stuck: true };
  }
  const p = pos();
  return { ok: Math.hypot(tx - p.x, tz - p.z) <= wantDist + 1.5, pos: p, d: +Math.hypot(tx - p.x, tz - p.z).toFixed(2) };
}
// Fell a column by ranged dig, lowest first; then collect drops at the base.
async function fell(cx, cz, want) {
  for (let round = 0; round < 8 && logCount() < want; round++) {
    const blocks = [];
    for (let y = 55; y < 90; y++) { const b = bot.blockAt(new Vec3(cx, y, cz)); if (b && /_log$/.test(b.name)) blocks.push(b); }
    if (!blocks.length) break;
    const target = blocks[0];
    try { await bot.lookAt(target.position.offset(0.5, 0.5, 0.5), true); } catch (e) {}
    try { await bot.dig(target); } catch (e) { step("dig-err", { at: cx + "," + cz, err: e.message }); break; }
    await sleep(400);
    // collect: hop onto/around the base cell
    await hopTo(cx + 0.5, cz + 0.5, 45000, 0.8);
    await sleep(600);
    // small sweep around the base for scattered drops
    const p = pos();
    await burst(p.x + 2, p.z, 0.8, false); await burst(p.x - 2, p.z, 0.8, false);
    await sleep(400);
    step("fell-round", { col: cx + "," + cz, logs: logCount(), pos: pos() });
  }
}
bot.once("spawn", async () => {
  try {
    await sleep(9000);
    step("landing", { pos: pos(), health: bot.health, food: bot.food, inv: inv() });
    // PHASE A: birch at (38,-103), ~2 cols from the stand.
    await fell(38, -103, 99);
    step("after-birch", { pos: pos(), logs: logCount(), inv: inv() });
    // PHASE B: oak at (34,-101) if still short.
    if (logCount() < 5) { await fell(34, -101, 8); step("after-oak", { pos: pos(), logs: logCount(), inv: inv() }); }
    // PHASE C: oak at (46,-101) - eastward, on the way - if still short.
    if (logCount() < 5) { await fell(46, -101, 8); step("after-oak2", { pos: pos(), logs: logCount(), inv: inv() }); }
    if (logCount() < 5) { R.verdict = "FAIL gather: " + logCount() + " logs"; save(); quit(3); return; }
    // PHASE D: travel east to the site apron.
    const t = await hopTo(64.5, -80.5, 8 * 60 * 1000, 2.2);
    step("at-site", { ok: t.ok, pos: pos(), d: t.d });
    if (!t.ok) { R.verdict = "FAIL travel to site: d=" + t.d; save(); quit(6); return; }
    // PHASE E: craft chain.
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
    // PHASE F: place chest + sign, verify.
    await hopTo(63.5, -80.5, 60000, 1.6);
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
    await hopTo(64.5, -80.5, 60000, 1.6);
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
    console.log("COMMONS3 DONE", JSON.stringify({ placedAt: R.placedAt, deaths: R.deaths }));
    quit(0);
  } catch (e) {
    R.verdict = "ERROR " + e.message;
    step("fatal", { err: e.message, pos: (() => { try { return pos(); } catch (_) { return null; } })(), inv: (() => { try { return inv(); } catch (_) { return null; } })() });
    save();
    quit(5);
  }
});
setTimeout(() => { R.verdict = R.verdict || "TIMEOUT"; step("timeout", {}); save(); process.exit(2); }, 32 * 60 * 1000);
