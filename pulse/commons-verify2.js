"use strict";
// Verify the SITE cells are still untouched (chest not placed).
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "ChestScan", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  await sleep(5000);
  const R = {};
  for (const [x, y, z] of [[63, 68, -82], [64, 68, -82], [64, 68, -83], [63, 67, -82]]) {
    const b = bot.blockAt(new Vec3(x, y, z));
    R[x + "," + y + "," + z] = b ? b.name : "unloaded";
  }
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 60000);
