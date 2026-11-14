"use strict";
// WALK PROBE — username CodyProbe2 (store-hunt probe; its save was
// written grounded + still + clean quit). Question: does this body
// walk >12 blocks by raw bearing-walk, or freeze like the clones?
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const DIR = "/home/caseydigennaro/craftmind-league/pulse/";
const LOG = DIR + "prep-probe-cp2.log";
const log = (s) => { const line = new Date().toISOString() + " " + s; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CodyProbe2", auth: "offline" });
bot.on("error", (e) => log("ERR " + e.message));
bot.on("kicked", (r) => log("KICKED " + r));
bot.on("death", () => log("DIED at " + bot.entity.position));
bot.once("spawn", async () => {
  log("spawned at " + bot.entity.position);
  for (let i = 0; i < 20; i++) { await sleep(500); if (bot.entity.onGround && Math.abs(bot.entity.velocity.y) < 0.01) break; }
  const start = bot.entity.position.clone();
  log("settled at " + start + " hp " + bot.health);
  // bearing-walk east toward (44,-88) in 2s bursts, logging displacement
  const tx = 44, tz = -88;
  for (let i = 0; i < 10; i++) {
    const p = bot.entity.position;
    const d = Math.hypot(p.x - (tx + 0.5), p.z - (tz + 0.5));
    log("burst " + i + " pos " + p + " distToTarget " + d.toFixed(1) + " totalDisp " + start.distanceTo(p).toFixed(2));
    if (d <= 2.5) break;
    try { await bot.lookAt(new Vec3(tx + 0.5, p.y + 1.2, tz + 0.5), true); } catch (e) {}
    bot.clearControlStates();
    bot.setControlState("forward", true); bot.setControlState("sprint", true); bot.setControlState("jump", true);
    await sleep(2000);
    bot.clearControlStates(); await sleep(200);
  }
  const end = bot.entity.position;
  log("PROBE RESULT startDisp total=" + start.distanceTo(end).toFixed(2) + " endPos " + end);
  await sleep(5000); // stand still — write a clean save
  log("quitting cleanly at " + bot.entity.position);
  bot.quit();
  process.exit(0);
});
setTimeout(() => { log("TIMEOUT"); try { bot.quit(); } catch (e) {} process.exit(1); }, 120000);
