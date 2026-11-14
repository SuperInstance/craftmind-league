"use strict";
// SHOULDER SURVEY - operator probe (not a citizen). Stationary at spawn;
// reads column profiles over the relocate corridor: the unsurveyed west
// approach (x24..39), the surveyed chain box, and the shoulder-to-anchor
// segment (x50..66). Same conventions as pulse/cell-survey.js, plus a
// per-column stack of the top few solid blocks (to see leaf/log caps).
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/shoulder-survey.json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "ShoulderSurvey", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const X0 = 24, X1 = 66, Z0 = -106, Z1 = -88;
function column(x, z) {
  let groundTop = null, groundName = null, litterY = null, loaded = false;
  const logs = []; const leaves = [];
  for (let y = 95; y > 45; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (!b) continue;
    loaded = true;
    if (b.name === "leaf_litter" && litterY === null) litterY = y;
    if (/_leaves$/.test(b.name)) leaves.push(y);
    if (/_(log|wood)$/.test(b.name)) logs.push(y);
    if (b.boundingBox === "block" && !/_leaves$/.test(b.name) && !/_(log|wood)$/.test(b.name) && groundTop === null) {
      groundTop = y; groundName = b.name;
    }
    if (groundTop !== null && y < groundTop - 2) break;
  }
  return { top: groundTop, name: groundName, litterY, logs, leaves, loaded };
}
bot.once("spawn", async () => {
  await sleep(6000);
  const cells = {};
  let unloaded = 0;
  for (let x = X0; x <= X1; x++) for (let z = Z0; z <= Z1; z++) {
    const c = column(x, z);
    if (!c.loaded || c.top === null) { unloaded++; continue; }
    cells[x + "," + z] = c;
  }
  fs.writeFileSync(OUT, JSON.stringify({ ts: new Date().toISOString(), box: { X0, X1, Z0, Z1 }, unloaded, cells }, null, 1));
  console.log("shoulder survey written; unloaded", unloaded, "cells", Object.keys(cells).length);
  bot.quit();
  process.exit(0);
});
