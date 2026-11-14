"use strict";
// DIAG8: fresh identity "CommonsSmith" - where does it land, and does it
// MOVE? Raw west walk 12 s sampled; then sprint-jump south 8 s sampled.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsSmith", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const P = () => { const p = bot.entity.position; return [ +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2) ]; };
async function leg(dx, dz, secs, sj, R, name) {
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(p.x + dx * 10, p.y + 1, p.z + dz * 10), true); } catch (e) {}
  if (sj) { bot.setControlState("sprint", true); bot.setControlState("jump", true); }
  bot.setControlState("forward", true);
  R[name] = [];
  for (let i = 0; i < secs * 2; i++) { await sleep(500); R[name].push(P()); }
  bot.clearControlStates(); await sleep(300);
}
bot.once("spawn", async () => {
  const R = {};
  await sleep(7000);
  R.start = P(); R.health = bot.health;
  await leg(-1, 0, 10, false, R, "westWalk");
  await leg(0, 1, 8, true, R, "southSJ");
  R.final = P();
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 70000);
