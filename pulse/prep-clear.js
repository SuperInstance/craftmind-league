"use strict";
// TRIAL-GROUND PREP v2 - operator floor bot (not a citizen, not curriculum).
// Physically digs LEAF LITTER ONLY at the declared target cells
// (ledger trial-ground-prep-20261107). v1 skipped everything: it checked
// blockAt before travelling, and distant cells are unloaded from spawn.
// v2 travels first (staged goto with wedge recovery), then checks + digs.
// Aborts any target whose block is not leaf_litter at dig time.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "FloorPrep", auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LOG = "/home/caseydigennaro/craftmind-league/pulse/prep-clear.log";
const log = (s) => { const line = new Date().toISOString() + " " + s; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const TARGETS = [
  [66,-91,67],[66,-90,67],[67,-92,67],[68,-92,67],[69,-92,67],[70,-92,67],[72,-92,67],[73,-92,66],[74,-92,66],[74,-90,67],[75,-92,66],[75,-90,66],[76,-90,66],[77,-92,66],[79,-92,66],
  [76,-82,67],[77,-88,67],[77,-86,67],[77,-85,67],[77,-83,67],[77,-82,67],[78,-86,67],[78,-84,67],[78,-83,67],[78,-82,67],[79,-85,67],[79,-84,67],[79,-82,67],[80,-87,67],[80,-86,67],[80,-84,67],[80,-82,68],
  [64,-97,67],[64,-96,67],[64,-95,67],[65,-98,67],[65,-97,67],[65,-96,67],[65,-95,67],[66,-99,67],[66,-96,67],[66,-95,67],[67,-98,67],[67,-96,67],[67,-95,67],[68,-99,67],[68,-98,67],[68,-97,67],[68,-95,67]
];
let deaths = 0;
bot.on("death", () => { deaths++; log("prep bot died (probe death #" + deaths + ") at " + bot.entity.position + " - respawning, continuing"); });
async function recover() {
  bot.setControlState("jump", true); bot.setControlState("forward", true);
  await sleep(450); bot.clearControlStates(); await sleep(250);
}
async function travelTo(tx, ly, tz) {
  for (let i = 0; i < 8; i++) {
    const before = bot.entity.position.clone();
    try { await bot.pathfinder.goto(new pf.goals.GoalNear(tx, ly, tz, 3), { timeout: 30000 }); } catch (e) {}
    const p = bot.entity.position;
    const d = Math.hypot(p.x - tx, p.z - tz);
    if (d <= 4.2) return true;
    if (before.distanceTo(p) < 0.3) { log("no displacement toward (" + tx + "," + tz + "), recovery pulse"); await recover(); }
    await sleep(300);
  }
  return Math.hypot(bot.entity.position.x - tx, bot.entity.position.z - tz) <= 4.6;
}
bot.once("spawn", async () => {
  log("spawned at " + bot.entity.position);
  const mv = new pf.Movements(bot);
  mv.canDig = false; mv.allowParkour = false; mv.allowSprinting = true;
  bot.pathfinder.setMovements(mv);
  let cleared = 0, already = 0, failed = [];
  for (const [tx, tz, ly] of TARGETS) {
    const target = new Vec3(tx, ly, tz);
    let blk = bot.blockAt(target);
    if (blk && blk.name !== "leaf_litter") { already++; continue; }
    if (!blk || blk.name === "leaf_litter") {
      const near = await travelTo(tx, ly, tz);
      blk = bot.blockAt(target);
      if (!blk) { failed.push([tx, tz, "unloaded-after-travel"]); log("FAILED (" + tx + "," + tz + ") still unloaded after travel, near=" + near + " botAt " + bot.entity.position); continue; }
      if (blk.name !== "leaf_litter") { already++; log("already clear (" + tx + "," + tz + "): " + blk.name); continue; }
      let dug = false;
      for (let a = 0; a < 3 && !dug; a++) {
        const d = bot.entity.position.distanceTo(target.offset(0.5, 0.5, 0.5));
        if (d > 4.4) { await travelTo(tx, ly, tz); }
        try { await bot.dig(bot.blockAt(target)); } catch (e) { log("dig err (" + tx + "," + tz + "): " + e.message); }
        const b3 = bot.blockAt(target);
        if (!b3 || b3.name !== "leaf_litter") dug = true; else await recover();
      }
      if (dug) { cleared++; log("cleared (" + tx + "," + tz + ") botAt " + bot.entity.position); }
      else { failed.push([tx, tz, "dig-failed"]); log("FAILED (" + tx + "," + tz + ") dig did not clear"); }
    }
  }
  log("DONE cleared=" + cleared + " alreadyClear=" + already + " failed=" + JSON.stringify(failed) + " probeDeaths=" + deaths);
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => log("ERR " + e.message));
setTimeout(() => { log("GLOBAL TIMEOUT"); process.exit(1); }, 2400000);
