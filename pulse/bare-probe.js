"use strict";
// BARE-BOT BISECTION (operator probe 6). No framework: bare mineflayer
// + pathfinder plugin only. Same goal shape as the wander replica.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder, Movements, goals } = require(NM + "/mineflayer-pathfinder");
const OUT = "/home/caseydigennaro/craftmind-league/pulse/char-probe6-result.json";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CharBare", auth: "offline" });
bot.loadPlugin(pathfinder);
const R = { ts: new Date().toISOString(), updates: [], samples: [] };
function pos() { const p = bot.entity.position; return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }; }
bot.on("path_update", (r) => { R.updates.push({ status: r.status, pathLen: r.path ? r.path.length : null }); });
bot.once("spawn", async () => {
  R.spawnPos = pos();
  await sleep(8000); // let chunks stream in
  bot.pathfinder.setMovements(new Movements(bot));
  const p = bot.entity.position;
  R.goal = { x: Math.floor(p.x), y: Math.floor(p.y), z: Math.floor(p.z) - 4 };
  bot.pathfinder.setGoal(new goals.GoalNear(R.goal.x, R.goal.y, R.goal.z, 1));
  for (let i = 0; i < 7; i++) { R.samples.push(pos()); await sleep(5000); }
  R.endPos = pos();
  R.onGround = bot.entity.onGround;
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log("BARE DONE", JSON.stringify(R.endPos), "updates", R.updates.length);
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => { console.log("ERR", e && e.message); });
setTimeout(() => { console.log("TIMEOUT"); process.exit(2); }, 90000);
