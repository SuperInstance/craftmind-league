"use strict";
// TRIAL-GROUND PREP — NIGHT CLEAR v5 (operator floor bot, not a citizen).
// v4's discriminator settled the movement question on this build: the
// mineflayer-pathfinder moves these operator bots ~1 block then freezes
// (flat open floor, nothing to be nose-against), while RAW control-state
// bearing-walk moves the same body freely. v5 therefore moves ONLY by
// bearing-walk: face target, hold forward+sprint+jump, poll displacement;
// a no-progress watchdog sidesteps along faces (alternating sides) and
// jump-recovers. No pathfinder goals anywhere.
// Dig rules unchanged from the declaration: leaf_litter only, name
// verified at dig time, measured distance <= 4.4, bot claims NOTHING —
// the independent stationary rescan is the only judge.
// Cody homestead exclusion (x59..69, z-98..-88) is not in the target
// list; the south pair is approached along z<=-100.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const DIR = "/home/caseydigennaro/craftmind-league/pulse/";
const LOG = DIR + "prep-clear6.log";
const RESULT = DIR + "prep-clear6-result.json";
const log = (s) => { const line = new Date().toISOString() + " " + s; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TARGETS = [
  [70,-92,67],[72,-92,67],[73,-92,66],[74,-92,66],[74,-90,67],[75,-92,66],[75,-90,66],[76,-90,66],[77,-92,66],[79,-92,66],
  [77,-88,67],[80,-87,67],[77,-86,67],[80,-86,67],[77,-85,67],[79,-85,67],[78,-86,67],[79,-84,67],[80,-84,67],[77,-83,67],[78,-84,67],[78,-83,67],[76,-82,67],[77,-82,67],[78,-82,67],[79,-82,67],[80,-82,68],
  [68,-99,67],[66,-99,67]
];
const STAGES = [[46,-100],[56,-99],[64,-100],[70,-97]];
const state = { deaths: 0, dug: [], skipped: [], startedAt: new Date().toISOString(), botName: "PrepCrew8" };
function saveResult(extra) { fs.writeFileSync(RESULT, JSON.stringify(Object.assign({}, state, extra || {}, { updatedAt: new Date().toISOString() }), null, 1)); }
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "PrepCrew8", auth: "offline" });
bot.on("death", () => { state.deaths++; log("prep bot DIED (#" + state.deaths + ") at " + bot.entity.position); saveResult(); });
bot.on("error", (e) => log("ERR " + e.message));
bot.on("kicked", (r) => log("KICKED " + r));
function surroundings(tag) {
  const p = bot.entity.position; const fx = Math.floor(p.x), fy = Math.floor(p.y), fz = Math.floor(p.z);
  const nm = (x, y, z) => { const b = bot.blockAt(new Vec3(x, y, z)); return b ? b.name : "null"; };
  log(tag + " pos " + p + " feet=" + nm(fx, fy, fz) + " head=" + nm(fx, fy + 1, fz) + " below=" + nm(fx, fy - 1, fz) +
    " | feetLvl N=" + nm(fx, fy, fz - 1) + " S=" + nm(fx, fy, fz + 1) + " E=" + nm(fx + 1, fy, fz) + " W=" + nm(fx - 1, fy, fz));
}
const distTo = (x, z) => Math.hypot(bot.entity.position.x - (x + 0.5), bot.entity.position.z - (z + 0.5));
async function walkBurst(x, z, dirKey, ms) {
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(x + 0.5, p.y + 1.2, z + 0.5), true); } catch (e) {}
  bot.clearControlStates();
  bot.setControlState("forward", true); bot.setControlState("sprint", true); bot.setControlState("jump", true);
  if (dirKey) bot.setControlState(dirKey, true);
  await sleep(ms);
  bot.clearControlStates(); await sleep(120);
}
// Primary mover. Returns true when within range of (x,z).
async function goTo(x, z, range, budgetMs) {
  const deadline = Date.now() + (budgetMs || 60000);
  let lastPos = bot.entity.position.clone(); let lastMoveAt = Date.now(); let side = "left"; let stuckEvents = 0;
  while (Date.now() < deadline) {
    if (distTo(x, z) <= range) return true;
    const before = bot.entity.position.clone();
    await walkBurst(x, z, null, 1600);
    const moved = before.distanceTo(bot.entity.position);
    if (moved > 0.3) { lastPos = bot.entity.position.clone(); lastMoveAt = Date.now(); continue; }
    if (Date.now() - lastMoveAt > 4500) {
      stuckEvents++;
      log("stuck #" + stuckEvents + " en route to (" + x + "," + z + ") botAt " + bot.entity.position + " d=" + distTo(x, z).toFixed(1) + " sidestep " + side);
      if (stuckEvents === 1) surroundings("STUCK-DUMP");
      await walkBurst(x, z, side, 1500);
      side = side === "left" ? "right" : "left";
      lastPos = bot.entity.position.clone(); lastMoveAt = Date.now();
      if (stuckEvents >= 6) { log("giving up leg to (" + x + "," + z + ")"); return false; }
    }
  }
  return distTo(x, z) <= range + 1.5;
}
async function digTarget(tx, tz, ly) {
  const target = new Vec3(tx, ly, tz);
  let blk = bot.blockAt(target);
  if (!blk) { state.skipped.push({ x: tx, z: tz, reason: "unloaded-at-dig-time" }); log("skip (" + tx + "," + tz + ") unloaded"); return; }
  if (blk.name !== "leaf_litter") { state.skipped.push({ x: tx, z: tz, reason: "not-litter-at-dig-time:" + blk.name }); log("skip (" + tx + "," + tz + ") block=" + blk.name); return; }
  let d = bot.entity.position.distanceTo(target.offset(0.5, 0.5, 0.5));
  if (d > 4.4) {
    const ok = await goTo(tx, tz, 1.8, 40000);
    blk = bot.blockAt(target);
    if (!blk || blk.name !== "leaf_litter") { state.skipped.push({ x: tx, z: tz, reason: "lost-litter-on-approach" }); log("skip (" + tx + "," + tz + ") lost on approach ok=" + ok); return; }
    d = bot.entity.position.distanceTo(target.offset(0.5, 0.5, 0.5));
    if (d > 4.4) { state.skipped.push({ x: tx, z: tz, reason: "cannot-get-in-reach d=" + d.toFixed(1) }); log("unreachable (" + tx + "," + tz + ") d=" + d.toFixed(1)); return; }
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
  if (bot.entity.position.y >= 74) {
    log("canopy landing — bearing-walk escape toward (33,-100)");
    const okE = await goTo(33, -100, 3, 40000);
    log("escape ok=" + okE + " botAt " + bot.entity.position);
    surroundings("POST-ESCAPE-DUMP");
  }
  for (const [sx, sz] of STAGES) {
    const ok = await goTo(sx, sz, 2.2, 90000);
    log("stage (" + sx + "," + sz + ") ok=" + ok + " botAt " + bot.entity.position + " hp " + bot.health);
    if (bot.health <= 5) { log("health low, aborting stages"); break; }
  }
  for (const [tx, tz, ly] of TARGETS) {
    if (bot.health <= 4) { log("health critical, stopping work"); break; }
    if (distTo(tx, tz) > 4.2) {
      const ok = await goTo(tx, tz, 2.2, 70000);
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
setTimeout(() => { log("GLOBAL TIMEOUT"); saveResult({ done: false, timeout: true }); try { bot.quit(); } catch (e) {} setTimeout(() => process.exit(1), 2000); }, 1800000);
