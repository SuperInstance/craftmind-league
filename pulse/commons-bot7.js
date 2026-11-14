"use strict";
// COMMONS CHEST work bot v7 - run-east edition (CommonsSmith body).
// Measured (diag8/9): this body's clone-spawn lands in canopy/frozen
// states, but a FALL onto real ground cures it - after the drop it ran
// 14.9 blocks east in 3.5 s. Plan: on landing, descend to real ground
// (dig under feet until the body DROPS to a solid floor with air at
// head), then work: east is the proven run direction; the site is east.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/commons-chest-result7.json";
const SITE = { x: 63, y: 68, z: -82 };
const SIGN = { x: 64, y: 68, z: -82 };
const TABLE = { x: 64, y: 68, z: -83 };
const R = { ts: new Date().toISOString(), steps: [], deaths: 0, version: 7 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function save() { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); }
function step(name, data) { R.steps.push({ t: new Date().toISOString(), name, data }); console.log("STEP", name, JSON.stringify(data || {})); save(); }
function quit(code) { try { bot.quit(); } catch (_) {} setTimeout(() => process.exit(code), 600); }
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsSmith", auth: "offline" });
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
// Descend: dig the block under the feet repeatedly; a REAL landing shows
// as the body's y dropping by >=1 and settling. Leaves are diggable.
async function descend(maxDigs) {
  for (let i = 0; i < maxDigs; i++) {
    const before = pos();
    const p = bot.entity.position;
    const under = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
    if (!under || under.name === "air") { await sleep(1200); const now = pos(); if (Math.abs(now.y - before.y) < 0.05 && bot.entity.onGround) return { ok: true, pos: now, digs: i, note: "air-under-settled" }; continue; }
    try { await bot.dig(under); } catch (e) { return { ok: false, err: e.message, pos: pos(), digs: i }; }
    await sleep(1200);
    const now = pos();
    step("descend", { i, dug: under.name, from: before.y, to: now.y });
    if (now.y < before.y - 0.5) {
      // dropped: confirm solid floor by a test burst east
      const t = await burst(now.x + 9, now.z, 2.5, 2);
      if (Math.abs(t.x - now.x) > 1.2) return { ok: true, pos: t, digs: i + 1, note: "dropped-and-runs" };
    }
  }
  return { ok: false, pos: pos(), digs: maxDigs, note: "no-drop" };
}
async function moveTo(tx, tz, budgetMs, wantDist, label) {
  const t0 = Date.now();
  let k = 0, best = 1e9, lastLog = 0;
  while (Date.now() - t0 < budgetMs) {
    const p = pos();
    const d = Math.hypot(tx - p.x, tz - p.z);
    if (d <= wantDist) { step("arrive", { label, pos: p, d: +d.toFixed(2), secs: Math.round((Date.now() - t0) / 1000) }); return { ok: true, pos: p, d }; }
    if (d < best) best = d;
    const baseAng = Math.atan2(tz - p.z, tx - p.x);
    const offs = [0, 0, 0.5, -0.5, 1.0, -1.0, 0, 1.57, -1.57];
    const ang = baseAng + offs[k % offs.length];
    await burst(p.x + Math.cos(ang) * 9, p.z + Math.sin(ang) * 9, 1.7, [2, 1, 0, 3][k % 4]);
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
    const r = await moveTo(sx, sz, Math.min(200000, budgetMs - (Date.now() - t0)), 1.1, "stand@" + cx + "," + cz);
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
      step("dig-check", { col: cx + "," + cz, y: target.position.y, after: after && after.name, logs: logCount() });
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
    // PHASE 0: get to real ground.
    const probe = await burst(pos().x + 9, pos().z, 2.5, 2);
    step("probe-east", { pos: probe, from: pos() });
    if (Math.hypot(probe.x - 27.5, probe.z + 97.5) < 0.1) { /* moved freely already */ }
    const moved = Math.abs(probe.x - (R.steps[0].data.pos.x)) > 1.2;
    if (!moved) {
      const d = await descend(8);
      step("descended", d);
      if (!d.ok) { R.verdict = "FAIL descend: " + (d.note || d.err); save(); quit(7); return; }
    }
    // PHASE A: harvest - nearest trees to wherever we stand now; scan live.
    const here = pos();
    const trees = [];
    for (let x = Math.floor(here.x) - 14; x <= Math.floor(here.x) + 30; x++) for (let z = Math.floor(here.z) - 14; z <= Math.floor(here.z) + 14; z++) {
      let n = 0; for (let y = 55; y < 90; y++) { const b = bot.blockAt(new Vec3(x, y, z)); if (b && /_log$/.test(b.name)) n++; }
      if (n >= 3) trees.push({ x, z, n, d: Math.hypot(x + 0.5 - here.x, z + 0.5 - here.z) });
    }
    trees.sort((a, b) => a.d - b.d);
    step("trees", { found: trees.slice(0, 8) });
    for (const t of trees.slice(0, 6)) {
      if (logCount() >= 5) break;
      await fellAdj(t.x, t.z, 8, 7 * 60 * 1000);
      step("tree-done", { col: t.x + "," + t.z, pos: pos(), logs: logCount(), inv: inv() });
    }
    if (logCount() < 5) { R.verdict = "FAIL gather: " + logCount() + " logs"; save(); quit(3); return; }
    // PHASE B: travel east to the site.
    const t = await moveTo(64.5, -80.5, 12 * 60 * 1000, 2.2, "site");
    step("at-site", { ok: t.ok, pos: pos() });
    if (!t.ok) { R.verdict = "FAIL travel to site"; save(); quit(6); return; }
    // PHASE C: craft + place (same as v6).
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
    console.log("COMMONS7 DONE", JSON.stringify({ placedAt: R.placedAt, deaths: R.deaths }));
    quit(0);
  } catch (e) {
    R.verdict = "ERROR " + e.message;
    step("fatal", { err: e.message, pos: (() => { try { return pos(); } catch (_) { return null; } })(), inv: (() => { try { return inv(); } catch (_) { return null; } })() });
    save();
    quit(5);
  }
});
setTimeout(() => { R.verdict = R.verdict || "TIMEOUT"; step("timeout", {}); save(); process.exit(2); }, 45 * 60 * 1000);
