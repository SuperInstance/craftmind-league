"use strict";
// ESCAPE SURVEY — operator probe (not a citizen). Stationary at spawn;
// force-loads chunks around the dip/rim sector by repeated setChunkPosition
// at Cody's cell, then reads column profiles + a full entity scan.
// Conventions mirror pulse/cell-survey.js / shoulder-survey.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/escape-survey.json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "EscapeSurvey", auth: "offline", viewDistance: "far" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const X0 = 56, X1 = 84, Z0 = -112, Z1 = -84;
const FOCUS = new Vec3(70, 66, -98); // Cody's dip cell area

function column(x, z) {
  let groundTop = null, groundName = null, litterY = null, loaded = false;
  const logs = [], leaves = [];
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
  try { bot._client.write("chunk_batch_received", { teleportId: 0 }); } catch {}
  // Force the server to stream chunks around the focus: teleport the
  // client's chunk position repeatedly (loaded-time trick used by the
  // shoulder survey lineage) and wait between passes.
  for (let pass = 0; pass < 6; pass++) {
    try { bot.setChunkPosition(FOCUS); } catch (e) { console.log("setChunkPosition err", e.message); }
    await sleep(4000);
    // probe coverage
    let got = 0, tot = 0;
    for (let x = X0; x <= X1; x += 4) for (let z = Z0; z <= Z1; z += 4) { tot++; if (bot.blockAt(new Vec3(x, 66, z))) got++; }
    console.log("pass", pass, "probe coverage", got + "/" + tot);
    if (got === tot) break;
  }
  const cells = {};
  let unloaded = 0;
  for (let x = X0; x <= X1; x++) for (let z = Z0; z <= Z1; z++) {
    const c = column(x, z);
    if (!c.loaded || c.top === null) { unloaded++; continue; }
    cells[x + "," + z] = c;
  }
  const entities = [];
  for (const e of Object.values(bot.entities || {})) {
    if (!e || !e.position || e.username === "EscapeSurvey") continue;
    entities.push({ name: e.name || e.username, type: e.type, x: +e.position.x.toFixed(1), y: +e.position.y.toFixed(1), z: +e.position.z.toFixed(1) });
  }
  fs.writeFileSync(OUT, JSON.stringify({ ts: new Date().toISOString(), box: { X0, X1, Z0, Z1 }, unloaded, cells, entities }, null, 1));
  console.log("survey written; cells", Object.keys(cells).length, "unloaded", unloaded, "entities", entities.length);
  bot.quit();
  process.exit(0);
});
setTimeout(() => { console.log("TIMEOUT"); try { bot.quit(); } catch {} process.exit(2); }, 90000);
