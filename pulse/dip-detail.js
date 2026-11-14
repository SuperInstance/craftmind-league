"use strict";
// DIP DETAIL — operator probe: raw block columns around Cody's cell.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/dip-detail.json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "DipDetail", auth: "offline", viewDistance: "far" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  await sleep(6000);
  const cols = {};
  for (let x = 69; x <= 76; x++) for (let z = -104; z <= -98; z++) {
    const blocks = [];
    for (let y = 72; y >= 56; y--) {
      const b = bot.blockAt(new Vec3(x, y, z));
      if (b && b.name !== "air") blocks.push({ y, name: b.name, bb: b.boundingBox });
    }
    cols[x + "," + z] = blocks.slice(0, 8);
  }
  let cody = null;
  for (const e of Object.values(bot.entities || {})) {
    if (e && e.username === "Cody" && e.position) cody = { x: e.position.x, y: e.position.y, z: e.position.z };
  }
  fs.writeFileSync(OUT, JSON.stringify({ ts: new Date().toISOString(), cody, cols }, null, 1));
  console.log("written; cody entity:", JSON.stringify(cody));
  bot.quit(); process.exit(0);
});
setTimeout(() => { console.log("TIMEOUT"); try { bot.quit(); } catch {} process.exit(2); }, 45000);
