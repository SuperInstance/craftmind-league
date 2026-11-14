"use strict";
// run-ab.js — Litter Lab scored A/B protocol (pre-registered in
// README.md): N=5 runs per arm, order A B B A A B B A A B, one fixed
// course (course.json), 300 s budget per run, completion = driver
// arrival test (horizontal <=1.6 of end, |dy| <=2.5) inside budget.
// Return legs unscored with the arm that just ran. A death = the run
// is incomplete; >2 deaths pauses the protocol.
const fs = require("fs");
const path = require("path");
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3");
const { gotoPos, sleep } = require("./driver");
const { makeStatusQuoMovements, makeLitterMovements } = require("./movements");

const USER = process.env.LITTER_USER;
if (!USER) { console.log("no LITTER_USER"); process.exit(2); }
const course = JSON.parse(fs.readFileSync(path.join(__dirname, "course.json"), "utf8"));
const OUT = path.join(__dirname, "results", "runs.jsonl");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const ORDER = ["A", "B", "B", "A", "A", "B", "B", "A", "A", "B"];
const BUDGET_MS = 300000;

const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline" });
bot.loadPlugin(pathfinder);

let deaths = 0, diedInRun = false;
bot.on("death", () => { deaths++; diedInRun = true; console.log("[AB] death #" + deaths); });

const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);
function logRun(obj) { fs.appendFileSync(OUT, JSON.stringify(obj) + "\n"); console.log("[RUN]", JSON.stringify(obj)); }

function censusLitter() {
  const litterId = bot.registry.blocksByName.leaf_litter.id;
  const x0 = Math.floor(Math.min(course.start.x, course.end.x)) - 3, x1 = Math.floor(Math.max(course.start.x, course.end.x)) + 3;
  const z0 = Math.floor(Math.min(course.start.z, course.end.z)) - 3, z1 = Math.floor(Math.max(course.start.z, course.end.z)) + 3;
  const y0 = Math.floor(Math.min(course.start.y, course.end.y)) - 3, y1 = Math.floor(Math.max(course.start.y, course.end.y)) + 4;
  let n = 0;
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (b && b.type === litterId) n++;
  }
  return n;
}

function findGroundColumn(r) {
  const p = bot.entity.position;
  let best = null;
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    const cx = Math.floor(p.x) + dx, cz = Math.floor(p.z) + dz;
    for (let y = Math.min(90, Math.floor(p.y) + 8); y >= Math.floor(p.y) - 26; y--) {
      const b = bot.blockAt(new Vec3(cx, y, cz));
      if (!b) break;
      if (b.boundingBox === "block") {
        if (["grass_block", "dirt", "stone"].includes(b.name)) {
          const d = Math.hypot(dx, dz);
          if (!best || d < best.d) best = { x: cx + 0.5, y: y + 1, z: cz + 0.5, d };
        }
        break;
      }
    }
  }
  return best;
}

// Canopy-aware ground finder: a column whose top is leaves still has
// ground under it. Returns the highest grass/dirt/stone block with
// only air/leaves above it, i.e. the true floor of the column.
function findGroundUnderCanopy(r) {
  const p = bot.entity.position;
  let best = null;
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
    const cx = Math.floor(p.x) + dx, cz = Math.floor(p.z) + dz;
    for (let y = Math.min(92, Math.floor(p.y) + 10); y >= Math.floor(p.y) - 30; y--) {
      const b = bot.blockAt(new Vec3(cx, y, cz));
      if (!b) break;
      if (b.name && b.name.endsWith("_leaves")) continue; // see through canopy
      if (b.boundingBox === "block") {
        if (["grass_block", "dirt", "stone"].includes(b.name)) {
          const d = Math.hypot(dx, dz);
          if (!best || d < best.d) best = { x: cx + 0.5, y: y + 1, z: cz + 0.5, d };
        }
        break; // ground (candidate recorded) or trunk/other solid (column unusable)
      }
    }
  }
  return best;
}

async function descendToGround() {
  for (let attempt = 0; attempt < 4; attempt++) {
    const p = bot.entity.position;
    const below = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
    if (below && ["grass_block", "dirt", "stone"].includes(below.name)) {
      console.log("[AB] on ground at", fmt(p), "standing on", below.name);
      return true;
    }
    const col = findGroundColumn(14) || findGroundUnderCanopy(18);
    if (!col) { console.log("[AB] descend: no ground column found near", fmt(p)); return false; }
    console.log("[AB] descending toward", col.x, col.y, col.z, "from", fmt(p));
    bot.pathfinder.setMovements(makeStatusQuoMovements(bot));
    await gotoPos(bot, col.x, col.y, col.z, { range: 1.2, timeoutMs: 90000, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
    await sleep(600);
  }
  const p = bot.entity.position;
  const below = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
  return !!(below && ["grass_block", "dirt", "stone"].includes(below.name));
}

const horizTo = (t) => Math.hypot(bot.entity.position.x - t.x, bot.entity.position.z - t.z);

async function positionToStart() {
  if (horizTo(course.start) <= 3 && Math.abs(bot.entity.position.y - course.start.y) <= 3) return true;
  bot.pathfinder.setMovements(makeStatusQuoMovements(bot));
  // Hop commute (<=15-block legs), the pattern that worked for the
  // course scan; a single 300 s gotoPos from a canopy spawn aborts.
  for (let i = 0; i < 5; i++) {
    const p = bot.entity.position;
    const d = horizTo(course.start);
    console.log("[AB] positioning: at", fmt(p), "dist to start", d.toFixed(1));
    if (d <= 3 && Math.abs(p.y - course.start.y) <= 3) return true;
    const step = Math.min(15, d);
    const hx = p.x + ((course.start.x - p.x) / d) * step;
    const hz = p.z + ((course.start.z - p.z) / d) * step;
    await gotoPos(bot, hx, p.y, hz, { range: 1.5, timeoutMs: 120000, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
    await sleep(400);
  }
  await gotoPos(bot, course.start.x, course.start.y, course.start.z, { range: 1, timeoutMs: 120000, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
  return horizTo(course.start) <= 3 && Math.abs(bot.entity.position.y - course.start.y) <= 3;
}

async function main() {
  await new Promise((res) => bot.once("spawn", res));
  console.log("[AB] spawned as", USER, "at", fmt(bot.entity.position), "timeOfDay", bot.time.timeOfDay);
  console.log("[AB] course", JSON.stringify(course));
  await sleep(2500);
  await descendToGround();
  if (!(await positionToStart())) { console.log("[AB] ABORT: cannot reach course start"); process.exit(3); }
  console.log("[AB] at course start", fmt(bot.entity.position));

  for (let i = 0; i < ORDER.length; i++) {
    const arm = ORDER[i];
    if (horizTo(course.start) > 3) {
      console.log("[AB] repositioning to start before run", i + 1);
      if (!(await positionToStart())) { console.log("[AB] ABORT: reposition failed before run", i + 1); process.exit(3); }
    }
    bot.pathfinder.setMovements(arm === "A" ? makeStatusQuoMovements(bot) : makeLitterMovements(bot));
    const counters = { stallBreaker: 0, replans: 0 };
    const litterBefore = censusLitter();
    diedInRun = false;
    const startPos = bot.entity.position.clone();
    const tod = bot.time ? bot.time.timeOfDay : null;
    const t0 = Date.now();
    await gotoPos(bot, course.end.x, course.end.y, course.end.z, { range: 1, timeoutMs: BUDGET_MS, mode: arm, counters });
    const wallS = +((Date.now() - t0) / 1000).toFixed(1);
    const endPos = bot.entity.position.clone();
    const distGoal = +horizTo(course.end).toFixed(2);
    const displacement = +Math.hypot(endPos.x - startPos.x, endPos.z - startPos.z).toFixed(2);
    const litterAfter = censusLitter();
    const completed = !diedInRun && distGoal <= 1.6 && Math.abs(endPos.y - course.end.y) <= 2.5;
    logRun({
      run: i + 1, arm, completed, wall_s: wallS,
      stallBreaker: arm === "A" ? counters.stallBreaker : undefined,
      replans: arm === "B" ? counters.replans : undefined,
      displacement, distGoal, litterDug: Math.max(0, litterBefore - litterAfter),
      litterBefore, timeOfDayStart: tod, died: diedInRun,
      startPos: fmt(startPos), endPos: fmt(endPos),
    });
    if (deaths > 2) { console.log("[AB] PAUSE: deaths > 2 per pre-registration"); process.exit(4); }
    if (diedInRun) { await sleep(3000); await descendToGround(); continue; }
    // Unscored return leg with the arm that just ran.
    const rc = { stallBreaker: 0, replans: 0 };
    await gotoPos(bot, course.start.x, course.start.y, course.start.z, { range: 1, timeoutMs: BUDGET_MS, mode: arm, counters: rc });
    console.log("[AB] return leg for run", i + 1, "ended at", fmt(bot.entity.position), "distToStart", horizTo(course.start).toFixed(2));
    await sleep(3000);
  }
  console.log("[AB] DONE all runs, deaths=" + deaths);
  bot.quit();
  process.exit(0);
}

main().catch((e) => { console.log("[AB] FATAL", e && e.stack || e); process.exit(1); });
setTimeout(() => { console.log("[AB] GLOBAL TIMEOUT"); process.exit(3); }, 100 * 60 * 1000);
