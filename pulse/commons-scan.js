"use strict";
// COMMONS SITE SCAN - stationary reader (ShoulderSurvey pattern). Reads
// block column data around the landing cell (40.5,-100.5) and the site
// (63,-82) if the chunks are visible from here.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const R = { columns: {}, site: {} };
bot.once("spawn", async () => {
  await sleep(8000);
  const p = bot.entity.position;
  R.pos = { x: p.x, y: p.y, z: p.z };
  // columns around the landing: x34..47, z-108..-93
  for (let x = 34; x <= 47; x++) for (let z = -108; z <= -93; z++) {
    const stack = [];
    for (let y = 60; y <= 80; y++) {
      const b = bot.blockAt(new Vec3(x, y, z));
      if (b && b.name !== "air") stack.push(y + ":" + b.name);
    }
    if (stack.length) R.columns[x + "," + z] = stack;
  }
  // site check
  for (const [k, v] of Object.entries({ chest: [63, 68, -82], below: [63, 67, -82], sign: [64, 68, -82], signBelow: [64, 67, -82], table: [64, 68, -83] })) {
    const b = bot.blockAt(new Vec3(v[0], v[1], v[2]));
    R.site[k] = b ? b.name : null;
  }
  console.log(JSON.stringify(R, null, 1));
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 60000);
