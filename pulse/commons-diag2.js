"use strict";
// DIAG2: (1) dig the grass block directly beside the body - does an
// ADJACENT dig change the world? (2) 20 s raw forward burst with position
// sampled every 500 ms - what is this body's real motion profile?
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  const R = {};
  await sleep(7000);
  const p0 = bot.entity.position.clone();
  R.start = { x: +p0.x.toFixed(2), y: +p0.y.toFixed(2), z: +p0.z.toFixed(2) };
  // adjacent dig: block at feet level one block west
  const tx = Math.floor(p0.x) - 1, ty = Math.floor(p0.y), tz = Math.floor(p0.z);
  const b = bot.blockAt(new Vec3(tx, ty, tz));
  R.adjacent = b ? { at: tx + "," + ty + "," + tz, name: b.name, canDig: bot.canDigBlock(b), dist: +b.position.distanceTo(bot.entity.position).toFixed(2) } : null;
  if (b && b.name !== "air") {
    try { const t0 = Date.now(); await bot.dig(b); R.adjDig = { ok: true, ms: Date.now() - t0, after: (bot.blockAt(new Vec3(tx, ty, tz)) || {}).name }; }
    catch (e) { R.adjDig = { ok: false, err: e.message }; }
  }
  // movement profile: face west, forward 20 s, sample
  R.samples = [];
  try { await bot.lookAt(new Vec3(p0.x - 10, p0.y + 1, p0.z), true); } catch (e) {}
  bot.setControlState("forward", true);
  for (let i = 0; i < 40; i++) { await sleep(500); const p = bot.entity.position; R.samples.push([+p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2)]); }
  bot.setControlState("forward", false);
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 90000);
