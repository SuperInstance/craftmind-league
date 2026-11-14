"use strict";
// TRIAL-GROUND PREP — NIGHT CLEAR (operator floor bot, not a citizen).
// Lessons baked in from v1/v2/v3 (all on the ledger):
//  - v2 PHANTOM DIGS: digs sent from ~43 blocks "cleared" in the local
//    model while the server changed nothing (rescan 294 -> 294). RULE:
//    dig only at measured distance <= 4.4, and this bot claims NOTHING —
//    success is judged solely by the independent after-scan.
//  - v3 GOTO HANG: bot.pathfinder.goto() promise never resolved from a
//    stationary start. RULE: never await goto; set the goal and poll
//    displacement on a watchdog; break wedges with setGoal(null) +
//    control-state recovery, retry, then move on.
//  - Dig ONLY leaf_litter, verified by name at dig time. Never terrain,
//    never a log, never canopy.
//  - Cody's homestead (pad x62..66, z-95..-91 + 3 margin) is EXCLUDED:
//    no target inside x59..69, z-98..-88 is in the list below, and the
//    south pair is approached along z<=-100, never through the apron.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const DIR = "/home/caseydigennaro/craftmind-league/pulse/";
const LOG = DIR + "prep-clear3.log";
const RESULT = DIR + "prep-clear3-result.json";
const log = (s) => { const line = new Date().toISOString() + " " + s; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// [x, z, litterY] from prep-scan-night-before.json (fresh scan, 07:2xZ)
const TARGETS = [
  [70,-92,67],[72,-92,67],[73,-92,66],[74,-92,66],[74,-90,67],[75,-92,66],[75,-90,66],[76,-90,66],[77,-92,66],[79,-92,66],
  [77,-88,67],[80,-87,67],[77,-86,67],[80,-86,67],[77,-85,67],[79,-85,67],[78,-86,67],[79,-84,67],[80,-84,67],[77,-83,67],[78,-84,67],[78,-83,67],[76,-82,67],[77,-82,67],[78,-82,67],[79,-82,67],[80,-82,68],
  [68,-99,67],[66,-99,67]
];
const STAGES_EAST = [[40,-99],[50,-99],[60,-100],[68,-100],[72,-96]];
const state = { deaths: 0, dug: [], skipped: [], startedAt: new Date().toISOString(), botName: "PrepCrew7" };
function saveResult(extra) {
  fs.writeFileSync(RESULT, JSON.stringify(Object.assign({}, state, extra || {}, { updatedAt: new Date().toISOString() }), null, 1));
}
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "PrepCrew7", auth: "offline", plugins: { pathfinder: pf.pathfinder } });
bot.on("death", () => { state.deaths++; log("prep bot DIED (#" + state.deaths + ") at " + bot.entity.position); saveResult(); });
bot.on("error", (e) => log("ERR " + e.message));
bot.on("kicked", (r) => log("KICKED " + r));

async function recover() {
  try { bot.pathfinder.setGoal(null); } catch (e) {}
  bot.clearControlStates();
  bot.setControlState("jump", true); bot.setControlState("forward", true);
  await sleep(600); bot.clearControlStates(); await sleep(400);
}
// Watchdog goto: poll displacement; break wedges; never trust a promise.
async function goTo(x, y, z, range, budgetMs) {
  const deadline = Date.now() + (budgetMs || 60000);
  let lastPos = bot.entity.position.clone(); let lastMoveAt = Date.now(); let wedges = 0;
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
      await recover();
      if (wedges >= 3) { bot.pathfinder.setGoal(null); return false; }
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
    const changed = !after || after.name !== "leaf_litter";
    state.dug.push({ x: tx, z: tz, litterY: ly, d: +d.toFixed(1), localVerify: changed });
    log("dug (" + tx + "," + tz + ") d=" + d.toFixed(1) + " localAfter=" + (after ? after.name : "null"));
  } catch (e) {
    state.skipped.push({ x: tx, z: tz, reason: "dig-error:" + e.message });
    log("dig err (" + tx + "," + tz + "): " + e.message);
  }
  saveResult();
}
bot.once("spawn", async () => {
  log("spawned at " + bot.entity.position);
  // settle: wait for ground + stillness (clone placement can be mid-air)
  for (let i = 0; i < 20; i++) { await sleep(500); if (bot.entity.onGround && Math.abs(bot.entity.velocity.y) < 0.01) break; }
  log("settled at " + bot.entity.position + " hp " + bot.health + " food " + bot.food);
  const mv = new pf.Movements(bot);
  mv.canDig = false; mv.allowParkour = true; mv.allowSprinting = true; mv.maxDropDown = 24;
  bot.pathfinder.setMovements(mv);
  for (const [sx, sz] of STAGES_EAST) {
    const ok = await goTo(sx, 67, sz, 2, 75000);
    log("stage (" + sx + "," + sz + ") ok=" + ok + " botAt " + bot.entity.position);
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
setTimeout(() => { log("GLOBAL TIMEOUT"); saveResult({ done: false, timeout: true }); try { bot.quit(); } catch (e) {} process.exit(1); }, 1500000);
