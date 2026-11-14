"use strict";
// TRIAL-GROUND PREP SURVEY - operator probe (not a citizen, not curriculum).
// Stationary at spawn; reads column profiles over the Cody work box.
// Records: ground top (solid, non-leaf, non-log), litter cap Y, trunk
// columns with their log Y ranges, and head clearance at top+1/top+2.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const USER = process.env.SURVEY_USER || "PrepSurvey";
const TAG = process.env.SCAN_TAG || "before";
const OUT = "/home/caseydigennaro/craftmind-league/pulse/prep-scan-" + TAG + ".json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const X0 = 58, X1 = 84, Z0 = -100, Z1 = -74;
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
  return { top: groundTop, name: groundName, litterY: litterY, logs: logs, loaded: loaded };
}
bot.once("spawn", async () => {
  await sleep(4000);
  const cells = {};
  let unloaded = 0, litterCells = [];
  for (let x = X0; x <= X1; x++) for (let z = Z0; z <= Z1; z++) {
    const c = column(x, z);
    if (!c.loaded || c.top === null) { unloaded++; continue; }
    cells[x + "," + z] = c;
    if (c.litterY !== null) litterCells.push({ x: x, z: z, top: c.top, litterY: c.litterY, cap: c.litterY === c.top + 1 });
  }
  const out = { tag: TAG, ts: new Date().toISOString(), box: { X0: X0, X1: X1, Z0: Z0, Z1: Z1 }, unloaded: unloaded, cells: cells, litterCells: litterCells };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log("SCAN", TAG, "cells", Object.keys(cells).length, "unloaded", unloaded, "litterCells", litterCells.length, "->", OUT);
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e.message));
setTimeout(() => { console.log("TIMEOUT"); process.exit(1); }, 120000);
