"use strict";
// BARE LOGIN #2 (server-restart-discriminator-20261107): bare mineflayer bot AS Cody,
// pathfinder plugin loaded ONLY for CharBare-pattern parity (no goals set,
// no framework, no respawn cache, no character loop). Records the spawn
// event + vitals samples, then quits cleanly. No movement is commanded:
// the spawn placement IS the measurement.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder } = require(NM + "/mineflayer-pathfinder");
const OUT = "/home/caseydigennaro/craftmind-league/pulse/bare-login3-result.json";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "Cody", auth: "offline" });
bot.loadPlugin(pathfinder);
const R = { ts: new Date().toISOString(), test: "server-restart-discriminator-20261107", samples: [] };
function snap(tag) {
  const p = bot.entity ? bot.entity.position : null;
  return { tag, pos: p ? { x: +p.x.toFixed(3), y: +p.y.toFixed(3), z: +p.z.toFixed(3) } : null,
           health: bot.health != null ? +bot.health.toFixed(2) : null,
           food: bot.food != null ? bot.food : null,
           onGround: bot.entity ? bot.entity.onGround : null };
}
bot.once("spawn", async () => {
  R.spawn = snap("spawn");
  for (const w of [4000, 4000, 4000, 4000, 4000]) { await sleep(w); R.samples.push(snap("t+" + (R.samples.length * 4 + 4) + "s")); }
  R.final = snap("final");
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log("BARE2 DONE", JSON.stringify(R.final));
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => { console.log("ERR", e && e.message); });
setTimeout(() => { console.log("TIMEOUT"); try { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); } catch (e) {} process.exit(2); }, 90000);
