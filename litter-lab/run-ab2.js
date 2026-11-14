"use strict";
// run-ab2.js — Litter Lab SUCCESSOR A/B protocol (pre-registered in
// README.md Amendment 3): N=5 runs per arm, order
// A2 B2 B2 A2 A2 B2 B2 A2 A2 B2, same frozen course (course.json),
// 300 s budget per run, completion = driver arrival test (horizontal
// <=1.6 of end, |dy| <=2.5) inside budget. Arm A2 = status-quo
// Movements + stall-breaker + stall budget 2 (configuration-identical
// to arm A of run-ab.js). Arm B2 = litter Movements (dig-through)
// + stall-breaker restored + stall budget 8 (pre-registered).
// Return legs unscored with the arm that just ran (full arm config).
// A death = the run is incomplete; >2 deaths pauses the protocol.
// Results go to results/runs2.jsonl (the first A/B's runs.jsonl is
// not touched). Amendment 4: descendToGround gains a dig-down descent
// for leaf perches (post-death recovery repair, unscored), and
// LITTER_START_RUN resumes the ABBA at a later index (run 1 of this
// experiment stands as recorded; the resumption starts at run 2).
const fs = require("fs");
const path = require("path");
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3");
const { gotoPos, sleep, rawDrive } = require("./driver");
const { makeStatusQuoMovements, makeLitterMovements } = require("./movements");

const USER = process.env.LITTER_USER;
if (!USER) { console.log("no LITTER_USER"); process.exit(2); }
const course = JSON.parse(fs.readFileSync(path.join(__dirname, "course.json"), "utf8"));
const OUT = path.join(__dirname, "results", "runs2.jsonl");
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const ORDER = ["A2", "B2", "B2", "A2", "A2", "B2", "B2", "A2", "A2", "B2"];
const BUDGET_MS = 300000;
const ARMS = {
  A2: { movements: () => makeStatusQuoMovements(bot), mode: "A", stallBudget: 2 },
  B2: { movements: () => makeLitterMovements(bot), mode: "B2", stallBudget: 8 },
};

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

// Dig-down canopy descent (Amendment 4 repair, unscored positioning
// only): when the probe stands on leaves, dig the leaf block beneath,
// drop one level, repeat until standing on grass/dirt/stone. This is
// the canopy-descent pattern Lineage B and Lineage C both verified on
// 2026-11-07; the goto-based descent below cannot step a bot down
// from a leaf perch (measured: 4 failed attempts, run 1 recovery).
async function digDownDescent() {
  for (let step = 0; step < 20; step++) {
    const p = bot.entity.position;
    const below = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
    if (below && ["grass_block", "dirt", "stone"].includes(below.name)) return true;
    if (!(below && below.name && below.name.endsWith("_leaves"))) return false;
    try {
      await Promise.race([bot.dig(below), sleep(6000).then(() => { throw new Error("dig-down cap"); })]);
    } catch { try { bot.stopDigging(); } catch {} }
    await sleep(450);
  }
  const p = bot.entity.position;
  const below = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
  return !!(below && ["grass_block", "dirt", "stone"].includes(below.name));
}

async function descendToGround() {
  {
    const p = bot.entity.position;
    const below = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
    if (below && below.name && below.name.endsWith("_leaves")) {
      console.log("[AB] on leaves at", fmt(p), "- dig-down descent");
      if (await digDownDescent()) { console.log("[AB] dig-down descent reached ground at", fmt(bot.entity.position)); return true; }
    }
  }
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
  // Amendment 8: a positioning leg longer than 10 blocks is a
  // DELIVERY leg and uses the delivery configuration (lab factory
  // Movements + stall-breaker + stall budget 8, mode "B2"); shorter
  // repositioning keeps the status-quo stack as registered. The
  // choice is made per call from the distance at entry and logged.
  const delivery = horizTo(course.start) > 10;
  const pcfg = delivery
    ? { movements: () => makeLitterMovements(bot), mode: "B2", stallBudget: 8 }
    : { movements: () => makeStatusQuoMovements(bot), mode: "A", stallBudget: 2 };
  console.log("[AB] positioning config:", delivery ? "DELIVERY (factory movements, budget 8)" : "status-quo (budget 2)", "dist", horizTo(course.start).toFixed(1));
  bot.pathfinder.setMovements(pcfg.movements());
  // Hop commute (<=15-block legs), the pattern that worked for the
  // course scan; a single 300 s gotoPos from a canopy spawn aborts.
  // Amendment 5: a hop that gains <1 block is a deterministic face
  // wedge — re-issuing the identical gotoPos from the identical spot
  // cannot change the outcome (measured, probe LitterRun4144). Take a
  // lateral sidestep (rawDrive perpendicular, run-up jump, alternating
  // sides) before retrying; hop iterations 5 -> 8 for room.
  // Amendment 7: iterations 8 -> 16 — probe LitterRun5038's commute
  // was still gaining (33.2 -> 13.8) when the cap cut it.
  let side = 1;
  for (let i = 0; i < 16; i++) {
    const p = bot.entity.position;
    const d = horizTo(course.start);
    console.log("[AB] positioning: at", fmt(p), "dist to start", d.toFixed(1));
    if (d <= 3 && Math.abs(p.y - course.start.y) <= 3) return true;
    const step = Math.min(15, d);
    const hx = p.x + ((course.start.x - p.x) / d) * step;
    const hz = p.z + ((course.start.z - p.z) / d) * step;
    const before = p.clone();
    await gotoPos(bot, hx, p.y, hz, { range: 1.5, timeoutMs: 120000, mode: pcfg.mode, stallBudget: pcfg.stallBudget, counters: { stallBreaker: 0, replans: 0 } });
    await sleep(400);
    const gained = Math.hypot(bot.entity.position.x - before.x, bot.entity.position.z - before.z);
    if (gained < 1 && horizTo(course.start) > 3) {
      const q = bot.entity.position;
      const dd = horizTo(course.start);
      const ux = (course.start.x - q.x) / dd, uz = (course.start.z - q.z) / dd;
      console.log("[AB] positioning wedge at", fmt(q), "- sidestep", side > 0 ? "left" : "right");
      await rawDrive(bot, -uz * side, ux * side, 750, true).catch(() => {});
      side = -side;
      await sleep(300);
    }
  }
  await gotoPos(bot, course.start.x, course.start.y, course.start.z, { range: 1, timeoutMs: 120000, mode: pcfg.mode, stallBudget: pcfg.stallBudget, counters: { stallBreaker: 0, replans: 0 } });
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

  const START_RUN = Math.max(1, parseInt(process.env.LITTER_START_RUN || "1", 10));
  if (START_RUN > 1) console.log("[AB] resuming at run", START_RUN, "per Amendment 4");
  for (let i = START_RUN - 1; i < ORDER.length; i++) {
    const arm = ORDER[i];
    const cfg = ARMS[arm];
    if (horizTo(course.start) > 3) {
      console.log("[AB] repositioning to start before run", i + 1);
      if (!(await positionToStart())) { console.log("[AB] ABORT: reposition failed before run", i + 1); process.exit(3); }
    }
    bot.pathfinder.setMovements(cfg.movements());
    const counters = { stallBreaker: 0, replans: 0 };
    const litterBefore = censusLitter();
    diedInRun = false;
    const startPos = bot.entity.position.clone();
    const tod = bot.time ? bot.time.timeOfDay : null;
    const t0 = Date.now();
    await gotoPos(bot, course.end.x, course.end.y, course.end.z, { range: 1, timeoutMs: BUDGET_MS, mode: cfg.mode, stallBudget: cfg.stallBudget, counters });
    const wallS = +((Date.now() - t0) / 1000).toFixed(1);
    const endPos = bot.entity.position.clone();
    const distGoal = +horizTo(course.end).toFixed(2);
    const displacement = +Math.hypot(endPos.x - startPos.x, endPos.z - startPos.z).toFixed(2);
    const litterAfter = censusLitter();
    const completed = !diedInRun && distGoal <= 1.6 && Math.abs(endPos.y - course.end.y) <= 2.5;
    logRun({
      run: i + 1, arm, proto: "amendment3", completed, wall_s: wallS,
      stallBreaker: counters.stallBreaker,
      replans: counters.replans,
      stallBudget: cfg.stallBudget,
      displacement, distGoal, litterDug: Math.max(0, litterBefore - litterAfter),
      litterBefore, timeOfDayStart: tod, died: diedInRun,
      startPos: fmt(startPos), endPos: fmt(endPos),
    });
    if (deaths > 2) { console.log("[AB] PAUSE: deaths > 2 per pre-registration"); process.exit(4); }
    if (diedInRun) { await sleep(3000); await descendToGround(); continue; }
    // Unscored return leg with the arm that just ran (full arm config).
    bot.pathfinder.setMovements(cfg.movements());
    const rc = { stallBreaker: 0, replans: 0 };
    await gotoPos(bot, course.start.x, course.start.y, course.start.z, { range: 1, timeoutMs: BUDGET_MS, mode: cfg.mode, stallBudget: cfg.stallBudget, counters: rc });
    console.log("[AB] return leg for run", i + 1, "ended at", fmt(bot.entity.position), "distToStart", horizTo(course.start).toFixed(2));
    await sleep(3000);
  }
  console.log("[AB] DONE all runs, deaths=" + deaths);
  bot.quit();
  process.exit(0);
}

main().catch((e) => { console.log("[AB] FATAL", e && e.stack || e); process.exit(1); });
setTimeout(() => { console.log("[AB] GLOBAL TIMEOUT"); process.exit(3); }, 170 * 60 * 1000);
