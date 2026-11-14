"use strict";
// TRIAL-GROUND PREP v3 - operator floor bot. Lessons from v1/v2, on the
// record: v1 checked blockAt before travelling (all unloaded, skipped);
// v2 dug from 43 blocks away on a canopy and its local model reported
// phantom clears (independent rescan: 294 -> 294 litter, nothing moved).
// v3 rules: (1) travel in staged hops <= 12 blocks, framework movements
// (sprint + parkour, like Cody resident); (2) dig ONLY when the measured
// bot-to-block distance is <= 4.4; (3) this bot claims NOTHING - success
// is judged solely by the independent after-scan.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "FloorPrep2", auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LOG = "/home/caseydigennaro/craftmind-league/pulse/prep-clear2.log";
const log = (s) => { const line = new Date().toISOString() + " " + s; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const STAGES = [[40,-95],[50,-95],[60,-94],[66,-93]];
const TARGETS = [
  [66,-91,67],[66,-90,67],[67,-92,67],[68,-92,67],[69,-92,67],[70,-92,67],[72,-92,67],[73,-92,66],[74,-92,66],[74,-90,67],[75,-92,66],[75,-90,66],[76,-90,66],[77,-92,66],[79,-92,66],
  [76,-82,67],[77,-88,67],[77,-86,67],[77,-85,67],[77,-83,67],[77,-82,67],[78,-86,67],[78,-84,67],[78,-83,67],[78,-82,67],[79,-85,67],[79,-84,67],[79,-82,67],[80,-87,67],[80,-86,67],[80,-84,67],[80,-82,68],
  [64,-97,67],[64,-96,67],[64,-95,67],[65,-98,67],[65,-97,67],[65,-96,67],[65,-95,67],[66,-99,67],[66,-96,67],[66,-95,67],[67,-98,67],[67,-96,67],[67,-95,67],[68,-99,67],[68,-98,67],[68,-97,67],[68,-95,67]
];
let deaths = 0;
bot.on("death", () => { deaths++; log("prep bot died (#" + deaths + ") at " + bot.entity.position); });
async function recover() {
  bot.setControlState("jump", true); bot.setControlState("forward", true);
  await sleep(500); bot.clearControlStates(); await sleep(300);
}
async function hop(x, y, z, r) {
  for (let i = 0; i < 5; i++) {
    const before = bot.entity.position.clone();
    try { await bot.pathfinder.goto(new pf.goals.GoalNear(x, y, z, r), { timeout: 30000 }); } catch (e) {}
    const p = bot.entity.position;
    if (Math.hypot(p.x - x, p.z - z) <= r + 1.5) return true;
    if (before.distanceTo(p) < 0.3) await recover();
    await sleep(300);
  }
  const p = bot.entity.position;
  return Math.hypot(p.x - x, p.z - z) <= r + 2.5;
}
bot.once("spawn", async () => {
  log("spawned at " + bot.entity.position);
  const mv = new pf.Movements(bot);
  mv.canDig = false; mv.allowParkour = true; mv.allowSprinting = true;
  bot.pathfinder.setMovements(mv);
  for (const [sx, sz] of STAGES) {
    const ok = await hop(sx, 67, sz, 2);
    log("stage (" + sx + "," + sz + ") ok=" + ok + " botAt " + bot.entity.position);
    if (!ok) { log("STAGING FAILED - cannot reach the work plateau; stopping"); bot.quit(); process.exit(3); }
  }
  let dug = 0, outOfReach = 0, gone = 0, failed = [];
  for (const [tx, tz, ly] of TARGETS) {
    const target = new Vec3(tx, ly, tz);
    const blk = bot.blockAt(target);
    if (!blk) { failed.push([tx, tz, "unloaded"]); continue; }
    if (blk.name !== "leaf_litter") { gone++; continue; }
    const near = await hop(tx, ly, tz, 3);
    const d = bot.entity.position.distanceTo(target.offset(0.5, 0.5, 0.5));
    if (d > 4.4) { outOfReach++; failed.push([tx, tz, "reach " + d.toFixed(1)]); log("OUT OF REACH (" + tx + "," + tz + ") d=" + d.toFixed(1) + " near=" + near + " botAt " + bot.entity.position); continue; }
    try { await bot.dig(bot.blockAt(target)); dug++; log("dug (" + tx + "," + tz + ") at d=" + d.toFixed(1) + " botAt " + bot.entity.position); }
    catch (e) { failed.push([tx, tz, "digerr " + e.message]); log("dig err (" + tx + "," + tz + "): " + e.message); }
  }
  log("DONE dugAttempts=" + dug + " alreadyGone=" + gone + " outOfReach=" + outOfReach + " failed=" + JSON.stringify(failed) + " probeDeaths=" + deaths + " (success judged by independent rescan only)");
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => log("ERR " + e.message));
setTimeout(() => { log("GLOBAL TIMEOUT"); process.exit(1); }, 1500000);
