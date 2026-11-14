"use strict";
// TRIAL-GROUND PREP — NIGHT CLEAR v7 "PATIENT" (operator floor bot).
// What tonight proved, in order: pathfinder freezes after ~1 block;
// bearing-walk (jump held) freezes after ~3-18 blocks; the freeze is
// cell-dependent, strikes on FLAT ground (CodyProbe2 froze at
// (39.69,69,-87.5), tops 68 both sides), and releases in windows —
// Cody's resident loop commutes by retrying through wedges with
// back-offs. v7 copies that posture exactly: per-leg, cycle movement
// styles (pathfinder / bearing+jump / bearing flat / jump-pulse) in
// ~15 s attempts separated by 8 s STILL back-offs, for up to 4 minutes
// per leg. Dig the moment any target is within reach, even mid-leg.
// Dig rules unchanged: leaf_litter only, name-verified at dig time,
// distance <= 4.4, bot claims NOTHING — the rescan judges.
// Username: CodyProbe2 (save at (39.69,69,-87.5), grounded, on the
// z-87 shelf road east). Homestead exclusion respected (no targets in
// x59..69, z-98..-88; south pair approached from the east/south).
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const DIR = "/home/caseydigennaro/craftmind-league/pulse/";
const LOG = DIR + "prep-clear7.log";
const RESULT = DIR + "prep-clear7-result.json";
const log = (s) => { const line = new Date().toISOString() + " " + s; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let TARGETS = [
  [70,-92,67],[72,-92,67],[73,-92,66],[74,-92,66],[74,-90,67],[75,-92,66],[75,-90,66],[76,-90,66],[77,-92,66],[79,-92,66],
  [77,-88,67],[80,-87,67],[77,-86,67],[80,-86,67],[77,-85,67],[79,-85,67],[78,-86,67],[79,-84,67],[80,-84,67],[77,-83,67],[78,-84,67],[78,-83,67],[76,-82,67],[77,-82,67],[78,-82,67],[79,-82,67],[80,-82,68],
  [68,-99,67],[66,-99,67]
];
const STAGES = [[52,-88],[62,-90],[70,-91]];
const state = { deaths: 0, dug: [], skipped: [], startedAt: new Date().toISOString(), botName: "CodyProbe2" };
function saveResult(extra) { fs.writeFileSync(RESULT, JSON.stringify(Object.assign({}, state, extra || {}, { updatedAt: new Date().toISOString() }), null, 1)); }
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CodyProbe2", auth: "offline", plugins: { pathfinder: pf.pathfinder } });
bot.on("death", () => { state.deaths++; log("prep bot DIED (#" + state.deaths + ") at " + bot.entity.position); saveResult(); });
bot.on("error", (e) => log("ERR " + e.message));
bot.on("kicked", (r) => log("KICKED " + r));
const distTo = (x, z) => Math.hypot(bot.entity.position.x - (x + 0.5), bot.entity.position.z - (z + 0.5));
async function faceAndHold(x, z, ms, opts) {
  const o = opts || {};
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(x + 0.5, p.y + (o.pitchY != null ? o.pitchY : 1.2), z + 0.5), true); } catch (e) {}
  bot.clearControlStates();
  bot.setControlState("forward", true);
  if (o.sprint !== false) bot.setControlState("sprint", true);
  if (o.jump === "hold") bot.setControlState("jump", true);
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (o.jump === "pulse") bot.setControlState("jump", (Date.now() - t0) % 1000 < 300);
    await sleep(100);
  }
  bot.clearControlStates();
}
async function attemptBearing(x, z, ms, jumpMode) { await faceAndHold(x, z, ms, { jump: jumpMode }); }
async function attemptPathfinder(x, y, z, range, ms) {
  bot.pathfinder.setGoal(new pf.goals.GoalNear(x, y, z, range));
  await sleep(ms);
  try { bot.pathfinder.setGoal(null); } catch (e) {}
  bot.clearControlStates();
}
async function backoff(ms) { bot.clearControlStates(); try { bot.pathfinder.setGoal(null); } catch (e) {} await sleep(ms); }
// One patient leg: cycle styles until within range or budget burns.
async function leg(x, z, y, range, budgetMs, label) {
  const deadline = Date.now() + budgetMs;
  let style = 0; let best = distTo(x, z);
  log("leg start " + label + " -> (" + x + "," + z + ") d=" + best.toFixed(1) + " botAt " + bot.entity.position);
  while (Date.now() < deadline) {
    if (distTo(x, z) <= range) { log("leg ok " + label + " botAt " + bot.entity.position); return true; }
    const before = bot.entity.position.clone();
    if (style % 4 === 0) await attemptPathfinder(x, y, z, range, 15000);
    else if (style % 4 === 1) await attemptBearing(x, z, 14000, "hold");
    else if (style % 4 === 2) await attemptBearing(x, z, 12000, "pulse");
    else await attemptBearing(x, z, 10000, "none");
    const moved = before.distanceTo(bot.entity.position);
    const d = distTo(x, z);
    if (d < best) best = d;
    log("leg " + label + " style " + (style % 4) + " moved " + moved.toFixed(2) + " d=" + d.toFixed(1) + " botAt " + bot.entity.position);
    style++;
    await opportunisticDigs();
    if (distTo(x, z) <= range) { log("leg ok " + label); return true; }
    await backoff(8000);
  }
  log("leg FAILED " + label + " best d=" + best.toFixed(1) + " botAt " + bot.entity.position);
  return distTo(x, z) <= range + 1.5;
}
async function digTarget(tx, tz, ly, why) {
  const target = new Vec3(tx, ly, tz);
  const blk = bot.blockAt(target);
  if (!blk) { state.skipped.push({ x: tx, z: tz, reason: "unloaded-at-dig-time" }); return false; }
  if (blk.name !== "leaf_litter") { state.skipped.push({ x: tx, z: tz, reason: "not-litter-at-dig-time:" + blk.name }); log("skip (" + tx + "," + tz + ") block=" + blk.name); return false; }
  const d = bot.entity.position.distanceTo(target.offset(0.5, 0.5, 0.5));
  if (d > 4.4) return false;
  try { await bot.lookAt(target.offset(0.5, 0.5, 0.5), true); } catch (e) {}
  try {
    await bot.dig(bot.blockAt(target));
    const after = bot.blockAt(target);
    state.dug.push({ x: tx, z: tz, litterY: ly, d: +d.toFixed(1), via: why, localVerify: !after || after.name !== "leaf_litter" });
    log("DUG (" + tx + "," + tz + ") d=" + d.toFixed(1) + " via " + why + " localAfter=" + (after ? after.name : "null"));
  } catch (e) {
    state.skipped.push({ x: tx, z: tz, reason: "dig-error:" + e.message });
    log("dig err (" + tx + "," + tz + "): " + e.message);
    return false;
  }
  saveResult();
  return true;
}
async function opportunisticDigs() {
  for (let i = TARGETS.length - 1; i >= 0; i--) {
    const [tx, tz, ly] = TARGETS[i];
    const d = bot.entity.position.distanceTo(new Vec3(tx + 0.5, ly + 0.5, tz + 0.5));
    if (d <= 4.4) { if (await digTarget(tx, tz, ly, "opportunistic")) TARGETS.splice(i, 1); }
  }
}
bot.once("spawn", async () => {
  log("spawned at " + bot.entity.position);
  for (let i = 0; i < 20; i++) { await sleep(500); if (bot.entity.onGround && Math.abs(bot.entity.velocity.y) < 0.01) break; }
  log("settled at " + bot.entity.position + " hp " + bot.health + " food " + bot.food);
  const mv = new pf.Movements(bot);
  mv.canDig = false; mv.allowParkour = true; mv.allowSprinting = true; mv.maxDropDown = 24;
  bot.pathfinder.setMovements(mv);
  for (const [sx, sz] of STAGES) {
    if (bot.health <= 5) { log("health low, aborting"); break; }
    await leg(sx, sz, 68, 2.5, 240000, "stage");
  }
  const queue = TARGETS.slice();
  for (const [tx, tz, ly] of queue) {
    if (!TARGETS.find(t => t[0] === tx && t[1] === tz)) continue; // already dug opportunistically
    if (bot.health <= 4) { log("health critical, stopping"); break; }
    if (distTo(tx, tz) > 4.2) await leg(tx, tz, ly, 2.0, 240000, "target (" + tx + "," + tz + ")");
    const before = state.dug.length;
    if (await digTarget(tx, tz, ly, "approach")) TARGETS = TARGETS.filter(t => !(t[0] === tx && t[1] === tz));
    else if (state.dug.length === before) log("target (" + tx + "," + tz + ") not dug this pass");
  }
  state.finishedAt = new Date().toISOString();
  state.remaining = TARGETS;
  saveResult({ done: true });
  log("DONE dug=" + state.dug.length + " skipped=" + state.skipped.length + " deaths=" + state.deaths + " remaining=" + TARGETS.length);
  await backoff(3000);
  bot.quit();
  process.exit(0);
});
setTimeout(() => { log("GLOBAL TIMEOUT"); state.remaining = TARGETS; saveResult({ done: false, timeout: true }); try { bot.quit(); } catch (e) {} setTimeout(() => process.exit(1), 2000); }, 3300000);
