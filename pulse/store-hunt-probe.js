"use strict";
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const OUT = "/home/caseydigennaro/craftmind-league/pulse/store-hunt-result.json";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function join(username, holdMs) {
  return new Promise((resolve) => {
    const rec = { username, ts: new Date().toISOString() };
    const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username, auth: "offline" });
    bot.once("spawn", async () => {
      const p = bot.entity.position;
      rec.spawn = { x: p.x, y: p.y, z: p.z, health: bot.health, food: bot.food, onGround: bot.entity.onGround };
      await sleep(holdMs);
      const q = bot.entity.position;
      rec.after = { x: q.x, y: q.y, z: q.z, health: bot.health, food: bot.food, onGround: bot.entity.onGround };
      try { bot.quit(); } catch (e) {}
      setTimeout(() => resolve(rec), 1500);
    });
    bot.on("error", (e) => { rec.error = String(e && e.message || e); resolve(rec); });
    setTimeout(() => { rec.timeout = true; try { bot.quit(); } catch (e) {} resolve(rec); }, 45000);
  });
}
(async () => {
  const R = [];
  R.push(await join("CodyProbe2", 6000));
  await sleep(4000);
  R.push(await join("Cody", 20000));
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  console.log("HUNT DONE", JSON.stringify(R.map(r => ({ u: r.username, spawn: r.spawn, after: r.after, error: r.error }))));
  process.exit(0);
})();
