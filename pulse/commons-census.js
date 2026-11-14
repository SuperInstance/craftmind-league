"use strict";
// Stationary hostile census around the scan bot's spawn point.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "ChestScan", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  await sleep(6000);
  const me = bot.entity.position;
  const out = { me: [ +me.x.toFixed(1), +me.y.toFixed(1), +me.z.toFixed(1) ], hostiles: [], players: [] };
  for (const id in bot.entities) {
    const e = bot.entities[id];
    if (!e || !e.position) continue;
    const d = e.position.distanceTo(me);
    if (d > 48) continue;
    const rec = { name: e.name || e.username || "?", type: e.type, d: +d.toFixed(1), pos: [ +e.position.x.toFixed(1), +e.position.y.toFixed(1), +e.position.z.toFixed(1) ] };
    if (e.type === "mob") out.hostiles.push(rec);
    if (e.type === "player") out.players.push(rec);
  }
  console.log(JSON.stringify(out));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 60000);
