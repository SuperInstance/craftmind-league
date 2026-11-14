"use strict";
// diag.js — isolate the perch-immobility: can a bot standing ON a
// litter pile (fractional y) move (a) by raw drive, (b) by pathfinder
// with arm A movements, (c) by pathfinder with arm B movements?
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder, goals } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3");
const { gotoPos, rawDrive, sleep } = require("./driver");
const { makeStatusQuoMovements, makeLitterMovements } = require("./movements");

const USER = process.env.LITTER_USER || ("DiagProbe" + Math.floor(1000 + Math.random() * 9000));
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline" });
bot.loadPlugin(pathfinder);
bot.on("error", (e) => console.log("[DIAG] error", e && e.message));
bot.on("kicked", (r) => console.log("[DIAG] kicked", r));
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);

async function gotoPlain(x, y, z, ms) {
  const s = bot.entity.position.clone();
  let outcome = "timeout";
  const t = bot.pathfinder.goto(new goals.GoalNear(x, y, z, 1)).then(() => { outcome = "reached"; }).catch((e) => { outcome = "err:" + (e && e.message); });
  const t0 = Date.now();
  while (outcome === "timeout" && Date.now() - t0 < ms) await sleep(250);
  try { bot.pathfinder.setGoal(null); } catch {}
  await Promise.race([t, sleep(500)]);
  const d = Math.hypot(bot.entity.position.x - s.x, bot.entity.position.z - s.z);
  return { outcome, disp: +d.toFixed(2), at: fmt(bot.entity.position) };
}

async function perchOn(cellPos) {
  // approach from a side, then run-up jump onto the pile
  const dir = { dx: 1, dz: 0 };
  const ax = cellPos.x - 1, az = cellPos.z;
  await gotoPos(bot, ax + 0.2, cellPos.y, az + 0.5, { range: 0.45, timeoutMs: 60000, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
  await sleep(300);
  await rawDrive(bot, dir.dx, dir.dz, 1100, true);
  await sleep(800);
  return bot.entity.position.clone();
}

async function main() {
  await new Promise((res) => bot.once("spawn", res));
  console.log("[DIAG] spawned", USER, "at", fmt(bot.entity.position));
  bot.pathfinder.setMovements(makeStatusQuoMovements(bot));
  await sleep(2500);
  // get to ground if in canopy: drop toward a low column
  const litterId = bot.registry.blocksByName.leaf_litter.id;
  const cells = bot.findBlocks({ matching: [litterId], maxDistance: 32, count: 30 });
  console.log("[DIAG] litter cells nearby:", cells.length);
  if (!cells.length) { console.log("[DIAG] no litter — abort"); process.exit(0); }
  // pick a cell whose floor is solid and which is at/below bot level
  let cell = null;
  for (const c of cells) {
    const f = bot.blockAt(c.offset(0, -1, 0));
    if (f && f.boundingBox === "block") { cell = c; break; }
  }
  console.log("[DIAG] target cell", cell.x, cell.y, cell.z);
  const perched = await perchOn(cell);
  const frac = +(perched.y - Math.floor(perched.y)).toFixed(2);
  console.log("[DIAG] after step-on: at", fmt(perched), "fracY", frac, "standingIn", (() => { const b = bot.blockAt(new Vec3(Math.floor(perched.x), Math.floor(perched.y), Math.floor(perched.z))); return b && b.name; })(), "below", (() => { const b = bot.blockAt(new Vec3(Math.floor(perched.x), Math.floor(perched.y) - 1, Math.floor(perched.z))); return b && b.name; })());

  // TEST 1: raw drive off the pile, no jump
  const d1 = await rawDrive(bot, 1, 0, 2000, false);
  console.log("[DIAG] TEST1 rawDrive east no-jump from perch: disp", d1.toFixed(2), "at", fmt(bot.entity.position));
  await sleep(500);

  // re-perch for the pathfinder tests
  const perched2 = await perchOn(cell);
  console.log("[DIAG] re-perched at", fmt(perched2));

  // TEST 2: pathfinder arm A, 4 blocks east at same y
  bot.pathfinder.setMovements(makeStatusQuoMovements(bot));
  const me = bot.entity.position;
  const t2 = await gotoPlain(me.x + 4, Math.floor(me.y), me.z, 20000);
  console.log("[DIAG] TEST2 pathfinder armA:", JSON.stringify(t2));

  // re-perch again
  const perched3 = await perchOn(cell);
  console.log("[DIAG] re-perched at", fmt(perched3));

  // TEST 3: pathfinder arm B
  bot.pathfinder.setMovements(makeLitterMovements(bot));
  const me3 = bot.entity.position;
  const t3 = await gotoPlain(me3.x + 4, Math.floor(me3.y), me3.z, 20000);
  console.log("[DIAG] TEST3 pathfinder armB:", JSON.stringify(t3));

  console.log("[DIAG] DONE");
  bot.quit();
  process.exit(0);
}
main().catch((e) => { console.log("[DIAG] FATAL", e && e.stack || e); process.exit(1); });
setTimeout(() => { console.log("[DIAG] GLOBAL TIMEOUT"); process.exit(3); }, 300000);
