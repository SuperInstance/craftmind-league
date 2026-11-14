"use strict";
// Stationary scan of the harvest area: birch (38,-103) + oak (34,-101)
// column heights, ground items near their bases, CommonsWarden entity.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "ChestScan", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  await sleep(6000);
  const R = { pos: bot.entity.position.floored(), cols: {}, items: [], warden: null };
  for (const [cx, cz] of [[38, -103], [34, -101], [46, -101]]) {
    const col = [];
    for (let y = 60; y < 85; y++) { const b = bot.blockAt(new Vec3(cx, y, cz)); if (b && b.name !== "air") col.push(y + ":" + b.name); }
    R.cols[cx + "," + cz] = col;
  }
  for (const id in bot.entities) {
    const e = bot.entities[id];
    if (!e || !e.position) continue;
    if (e.name === "item" || (e.entityType && String(e.displayName||"").toLowerCase().includes("item"))) {
      const p = e.position;
      if (Math.abs(p.x - 38) < 14 && Math.abs(p.z + 102) < 14) R.items.push({ x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) });
    }
    if (e.username === "CommonsWarden") R.warden = { x: +e.position.x.toFixed(2), y: +e.position.y.toFixed(2), z: +e.position.z.toFixed(2) };
  }
  // item entities in mineflayer: type 'object' with metadata; fallback: scan all
  if (!R.items.length) {
    for (const id in bot.entities) { const e = bot.entities[id]; if (e && e.type === "object" && e.position) { const p = e.position; if (Math.abs(p.x - 38) < 14 && Math.abs(p.z + 102) < 14) R.items.push({ t: e.name || e.displayName || "obj", x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) }); } }
  }
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 60000);
