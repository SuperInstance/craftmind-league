"use strict";
// DIAG4: grid escape test. From the pin cell, burst 6 s in each cardinal
// direction (walk, then sprint+jump), sampling positions. Which exits work?
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const P = () => { const p = bot.entity.position; return [ +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2) ]; };
async function burst(tx, tz, secs, style) {
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(tx, p.y + 1, tz), true); } catch (e) {}
  if (style === "sprintjump") { bot.setControlState("sprint", true); bot.setControlState("jump", true); }
  bot.setControlState("forward", true);
  await sleep(secs * 1000);
  bot.clearControlStates();
  await sleep(400);
  return P();
}
bot.once("spawn", async () => {
  const R = { legs: [] };
  await sleep(7000);
  R.start = P();
  const dirs = [ ["W", -1, 0], ["E", 1, 0], ["N", 0, -1], ["S", 0, 1] ];
  for (const [name, dx, dz] of dirs) {
    const p = bot.entity.position;
    const end = await burst(p.x + dx * 10, p.z + dz * 10, 5, "walk");
    R.legs.push({ dir: name, style: "walk", from: p.floored(), end });
  }
  for (const [name, dx, dz] of dirs) {
    const p = bot.entity.position;
    const end = await burst(p.x + dx * 10, p.z + dz * 10, 5, "sprintjump");
    R.legs.push({ dir: name, style: "sprintjump", from: p.floored(), end });
  }
  R.final = P();
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 120000);
