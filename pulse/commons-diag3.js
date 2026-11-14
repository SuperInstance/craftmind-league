"use strict";
// DIAG3: sprint+jump burst west from (37.31,66,-99.5): does the body pass
// x=35? "forward" held, sprint on, jump taps every 700 ms. Sampled 250 ms.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  const R = { samples: [] };
  await sleep(7000);
  const p0 = bot.entity.position.clone();
  R.start = { x: +p0.x.toFixed(2), y: +p0.y.toFixed(2), z: +p0.z.toFixed(2) };
  try { await bot.lookAt(new Vec3(p0.x - 10, p0.y + 1, p0.z), true); } catch (e) {}
  bot.setControlState("sprint", true);
  bot.setControlState("forward", true);
  const t0 = Date.now();
  const iv = setInterval(() => { bot.setControlState("jump", true); setTimeout(() => bot.setControlState("jump", false), 120); }, 700);
  while (Date.now() - t0 < 15000) { await sleep(250); const p = bot.entity.position; R.samples.push([+p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2)]); }
  clearInterval(iv);
  bot.setControlState("forward", false); bot.setControlState("sprint", false); bot.setControlState("jump", false);
  R.end = pos => pos; const pe = bot.entity.position; R.final = { x: +pe.x.toFixed(2), y: +pe.y.toFixed(2), z: +pe.z.toFixed(2) };
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 60000);
