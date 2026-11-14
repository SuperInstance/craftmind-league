"use strict";
// TRIAL-GROUND PREP — NIGHT CLEAR v4 (operator floor bot, not a citizen).
// Carries all v1-v3 lessons (see prep-clear3.js header) plus the v3-night
// lessons: (a) a session killed while standing on canopy leaves writes a
// poisoned save — never end a session airborne/on leaves; (b) clone
// landings can be the spawn-canopy (23.5,78,-92.5): escape by RAW
// bearing-walk (control states, real physics), not the pathfinder graph;
// (c) route south of the trap tree along the z=-100 row.
// Dig rules unchanged: leaf_litter only, name-verified at dig time,
// distance <= 4.4, this bot claims NOTHING — the independent rescan judges.
// Cody homestead exclusion (x59..69, z-98..-88) is not in the target list;
// the south pair is approached along z<=-100.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const DIR = "/home/caseydigennaro/craftmind-league/pulse/";
const LOG = DIR + "prep-clear4.log";
const RESULT = DIR + "prep-clear4-result.json";
const log = (s) => { const line = new Date().toISOString() + " " + s; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TARGETS = [
  [70,-92,67],[72,-92,67],[73,-92,66],[74,-92,66],[74,-90,67],[75,-92,66],[75,-90,66],[76,-90,66],[77,-92,66],[79,-92,66],
  [77,-88,67],[80,-87,67],[77,-86,67],[80,-86,67],[77,-85,67],[79,-85,67],[78,-86,67],[79,-84,67],[80,-84,67],[77,-83,67],[78,-84,67],[78,-83,67],[76,-82,67],[77,-82,67],[78,-82,67],[79,-82,67],[80,-82,68],
  [68,-99,67],[66,-99,67]
];
const STAGES = [[36,-101],[46,-99],[56,-99],[64,-100],[70,-97]];
const state = { deaths: 0, dug: [], skipped: [], startedAt: new Date().toISOString(), botName: "PrepCrew8" };
function saveResult(extra) { fs.writeFileSync(RESULT, JSON.stringify(Object.assign({}, state, extra || {}, { updatedAt: new Date().toISOString() }), null, 1)); }
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "PrepCrew8", auth: "offline", plugins: { pathfinder: pf.pathfinder } });
bot.on("death", () => { state.deaths++; log("prep bot DIED (#" + state.deaths + ") at " + bot.entity.position); saveResult(); });
bot.on("error", (e) => log("ERR " + e.message));
bot.on("kicked", (r) => log("KICKED " + r));
function surroundings(tag) {
  const p = bot.entity.position; const fx = Math.floor(p.x), fy = Math.floor(p.y), fz = Math.floor(p.z);
  const nm = (x, y, z) => { const b = bot.blockAt(new Vec3(x, y, z)); return b ? b.name : "null"; };
  log(tag + " pos " + p + " feet=" + nm(fx, fy, fz) + " head=" + nm(fx, fy + 1, fz) + " below=" + nm(fx, fy - 1, fz) +
    " | feetLvl N=" + nm(fx, fy, fz - 1) + " S=" + nm(fx, fy, fz + 1) + " E=" + nm(fx + 1, fy, fz) + " W=" + nm(fx - 1, fy, fz) +
    " | belowLvl N=" + nm(fx, fy - 1, fz - 1) + " S=" + nm(fx, fy - 1, fz + 1) + " E=" + nm(fx + 1, fy - 1, fz) + " W=" + nm(fx - 1, fy - 1, fz));
}
async function recover() {
  try { bot.pathfinder.setGoal(null); } catch (e) {}
  bot.clearControlStates();
  // strafe-cycle unstick: jump+forward, jump+left, jump+right, jump+back
  for (const dir of ["forward", "left", "right", "back"]) {
    bot.clearControlStates(); bot.setControlState("jump", true); bot.setControlState(dir, true);
    await sleep(450);
  }
  bot.clearControlStates(); await sleep(300);
}
// Raw bearing-walk: face the target, hold forward+sprint+jump, poll.
async function bearingWalk(x, z, range, budgetMs) {
  const deadline = Date.now() + (budgetMs || 20000);
  while (Date.now() < deadline) {
    const p = bot.entity.position;
    const d = Math.hypot(p.x - (x + 0.5), p.z - (z + 0.5));
    if (d <= range) { bot.clearControlStates(); return true; }
    try { await bot.lookAt(new Vec3(x + 0.5, p.y + 1.2, z + 0.5), true); } catch (e) {}
    bot.setControlState("forward", true); bot.setControlState("sprint", true); bot.setControlState("jump", true);
    await sleep(1800);
    bot.clearControlStates(); await sleep(150);
  }
  bot.clearControlStates();
  const p = bot.entity.position;
  return Math.hypot(p.x - (x + 0.5), p.z - (z + 0.5)) <= range + 1.5;
}
async function goTo(x, y, z, range, budgetMs) {
  const deadline = Date.now() + (budgetMs || 60000);
  let lastPos = bot.entity.position.clone(); let lastMoveAt = Date.now(); let wedges = 0; let dumped = false;
  bot.pathfinder.setGoal(new pf.goals.GoalNear(x, y, z, range));
  while (Date.now() < deadline) {
    await sleep(1500);
    const p = bot.entity.position;
    const d = Math.hypot(p.x - (x + 0.5), p.z - (z + 0.5));
    if (d <= range + 0.9 && Math.abs(p.y - y) <= 3.5) { bot.pathfinder.setGoal(null); return true; }
    if (p.distanceTo(lastPos) > 0.3) { lastPos = p.clone(); lastMoveAt = Date.now(); }
    else if (Date.now() - lastMoveAt > 12000) {
      wedges++;
      log("wedge #" + wedges + " en route to (" + x + "," + z + ") botAt " + p + " d=" + d.toFixed(1));
      if (!dumped) { surroundings("WEDGE-DUMP"); dumped = true; }
      await recover();
      if (wedges >= 2) {
        // fall back to raw bearing-walk for this leg
        log("bearing-walk fallback to (" + x + "," + z + ")");
        const okB = await bearingWalk(x, z, range + 0.5, 25000);
        log("bearing-walk result ok=" + okB + " botAt " + bot.entity.position);
        return okB;
      }
      bot.pathfinder.setGoal(new pf.goals.GoalNear(x, y, z, range));
      lastPos = bot.entity.position.clone(); lastMoveAt = Date.now();
    }
  }
  bot.pathfinder.setGoal(null);
  const p = bot.entity.position;
  return Math.hypot(p.x - (x + 0.5), p.z - (z + 0.5)) <= range + 2.0;
}
async function digTarget(tx, tz, ly) {
  const target = new Vec3(tx, ly, tz);
  let blk = bot.blockAt(target);
  if (!blk) { state.skipped.push({ x: tx, z: tz, reason: "unloaded-at-dig-time" }); return; }
  if (blk.name !== "leaf_litter") { state.skipped.push({ x: tx, z: tz, reason: "not-litter-at-dig-time:" + blk.name }); log("skip (" + tx + "," + tz + ") block=" + blk.name); return; }
  let d = bot.entity.position.distanceTo(target.offset(0.5, 0.5, 0.5));
  if (d > 4.4) {
    const ok = await goTo(tx, ly, tz, 1, 30000);
    blk = bot.blockAt(target);
    if (!blk || blk.name !== "leaf_litter") { state.skipped.push({ x: tx, z: tz, reason: "lost-litter-on-approach" }); return; }
    d = bot.entity.position.distanceTo(target.offset(0.5, 0.5, 0.5));
    if (d > 4.4) { state.skipped.push({ x: tx, z: tz, reason: "cannot-get-in-reach d=" + d.toFixed(1) + " ok=" + ok }); log("unreachable (" + tx + "," + tz + ") d=" + d.toFixed(1)); return; }
  }
  try { await bot.lookAt(target.offset(0.5, 0.5, 0.5), true); } catch (e) {}
  try {
    await bot.dig(bot.blockAt(target));
    const after = bot.blockAt(target);
    state.dug.push({ x: tx, z: tz, litterY: ly, d: +d.toFixed(1), localVerify: !after || after.name !== "leaf_litter" });
    log("dug (" + tx + "," + tz + ") d=" + d.toFixed(1) + " localAfter=" + (after ? after.name : "null"));
  } catch (e) {
    state.skipped.push({ x: tx, z: tz, reason: "dig-error:" + e.message });
    log("dig err (" + tx + "," + tz + "): " + e.message);
  }
  saveResult();
}
bot.once("spawn", async () => {
  log("spawned at " + bot.entity.position);
  for (let i = 0; i < 20; i++) { await sleep(500); if (bot.entity.onGround && Math.abs(bot.entity.velocity.y) < 0.01) break; }
  log("settled at " + bot.entity.position + " hp " + bot.health + " food " + bot.food);
  surroundings("SETTLE-DUMP");
  const mv = new pf.Movements(bot);
  mv.canDig = false; mv.allowParkour = true; mv.allowSprinting = true; mv.maxDropDown = 24;
  bot.pathfinder.setMovements(mv);
  // Canopy landing escape: if we settled high, bearing-walk toward the
  // spawn clearing first (raw physics walks off leaves fine).
  if (bot.entity.position.y >= 74) {
    log("canopy landing — bearing-walk escape toward (33,-100)");
    const okE = await bearingWalk(33, -100, 3, 30000);
    log("escape ok=" + okE + " botAt " + bot.entity.position);
    surroundings("POST-ESCAPE-DUMP");
  }
  for (const [sx, sz] of STAGES) {
    const ok = await goTo(sx, 67, sz, 2, 75000);
    log("stage (" + sx + "," + sz + ") ok=" + ok + " botAt " + bot.entity.position + " hp " + bot.health);
    if (bot.health <= 5) { log("health low, aborting stages"); break; }
  }
  for (const [tx, tz, ly] of TARGETS) {
    if (bot.health <= 4) { log("health critical, stopping work"); break; }
    const near = Math.hypot(bot.entity.position.x - (tx + 0.5), bot.entity.position.z - (tz + 0.5));
    if (near > 4.2) {
      const ok = await goTo(tx, ly, tz, 2, 60000);
      log("approach (" + tx + "," + tz + ") ok=" + ok + " botAt " + bot.entity.position);
    }
    await digTarget(tx, tz, ly);
  }
  state.finishedAt = new Date().toISOString();
  saveResult({ done: true });
  log("DONE dug=" + state.dug.length + " skipped=" + state.skipped.length + " deaths=" + state.deaths);
  bot.quit();
  process.exit(0);
});
setTimeout(() => { log("GLOBAL TIMEOUT"); saveResult({ done: false, timeout: true }); try { bot.quit(); } catch (e) {} setTimeout(() => process.exit(1), 2000); }, 1500000);
