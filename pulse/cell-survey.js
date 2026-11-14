"use strict";
// CELL SURVEY - operator probe (not a citizen). Stationary at spawn;
// reads column profiles over Cody's home-cell box: ground top, litter
// cap, log columns. Same conventions as pulse/prep-survey.js.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/cell-survey.json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CellSurvey", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const X0 = 33, X1 = 50, Z0 = -108, Z1 = -86;
function column(x, z) {
  let groundTop = null, groundName = null, litterY = null, loaded = false;
  const logs = [];
  for (let y = 95; y > 45; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (!b) continue;
    loaded = true;
    if (b.name === "leaf_litter" && litterY === null) litterY = y;
    if (/_(log|wood)$/.test(b.name)) logs.push(y);
    if (b.boundingBox === "block" && !/_leaves$/.test(b.name) && !/_(log|wood)$/.test(b.name) && groundTop === null) {
      groundTop = y; groundName = b.name;
    }
    if (groundTop !== null && y < groundTop - 2) break;
  }
  return { top: groundTop, name: groundName, litterY, logs, loaded };
}
bot.once("spawn", async () => {
  await sleep(5000);
  const cells = {};
  let unloaded = 0;
  const litterCells = [];
  for (let x = X0; x <= X1; x++) for (let z = Z0; z <= Z1; z++) {
    const c = column(x, z);
    if (!c.loaded || c.top === null) { unloaded++; continue; }
    cells[x + "," + z] = c;
    if (c.litterY !== null) litterCells.push({ x, z, top: c.top, litterY: c.litterY, cap: c.litterY === c.top + 1 });
  }
  fs.writeFileSync(OUT, JSON.stringify({ ts: new Date().toISOString(), box: { X0, X1, Z0, Z1 }, unloaded, cells, litterCells }, null, 1));
  console.log("survey written; unloaded", unloaded, "litter cells", litterCells.length);
  bot.quit();
  process.exit(0);
});
