"use strict";
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { Vec3 } = require(NM + "/vec3");
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "GateObs", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  await sleep(2500);
  console.log("[OBS] blocks around stall point x50..56, z-86..-80 (non-air, y63..71):");
  for (let y = 63; y <= 71; y++) {
    let row = [];
    for (let x = 50; x <= 56; x++) for (let z = -86; z <= -80; z++) {
      const b = bot.blockAt(new Vec3(x, y, z));
      if (b && b.name !== "air") row.push(x + "," + y + "," + z + "=" + b.name);
    }
    if (row.length) console.log("[OBS] y=" + y + ": " + row.join(" | "));
  }
  const cody = bot.players["Cody"] && bot.players["Cody"].entity;
  if (!cody) { console.log("[OBS] Cody not visible"); bot.quit(); process.exit(0); }
  console.log("[OBS] sampling Cody entity 24 x 500ms:");
  let prev = cody.position.clone();
  for (let i = 0; i < 24; i++) {
    await sleep(500);
    const p = cody.position;
    console.log("[OBS]", i, p.x.toFixed(3), p.y.toFixed(3), p.z.toFixed(3), "step", prev.distanceTo(p).toFixed(3), "onGround", cody.onGround);
    prev = p.clone();
  }
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("[OBS] error", e.message));
setTimeout(() => { console.log("[OBS] TIMEOUT"); process.exit(1); }, 45000);
