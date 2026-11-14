"use strict";
// DIAG7: (a) walk SOUTH from the hub (36.05,64,-92.31) - how far does the
// proven lane run? (b) from wherever it stops, harvest scan: all log
// columns within 10 blocks with their ground tops.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const P = () => { const p = bot.entity.position; return [ +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2) ]; };
bot.once("spawn", async () => {
  const R = {};
  await sleep(7000);
  R.start = P();
  // walk south up to 25 s, sampling every 2 s
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(p.x, p.y + 1, p.z - 20), true); } catch (e) {} // note: -z is north; fix below
  bot.clearControlStates();
  try { await bot.lookAt(new Vec3(p.x, p.y + 1, p.z + 20), true); } catch (e) {}
  bot.setControlState("forward", true);
  R.trail = [];
  for (let i = 0; i < 12; i++) { await sleep(2000); R.trail.push(P()); }
  bot.clearControlStates(); await sleep(300);
  R.southEnd = P();
  // harvest scan around the stopping point
  const q = bot.entity.position, cx = Math.floor(q.x), cz = Math.floor(q.z);
  R.trees = [];
  for (let x = cx - 10; x <= cx + 10; x++) for (let z = cz - 10; z <= cz + 10; z++) {
    let top = null, logs = [];
    for (let y = 55; y < 90; y++) { const b = bot.blockAt(new Vec3(x, y, z)); if (!b) continue; if (/_log$/.test(b.name)) logs.push(y); if (b.name !== "air") top = y; }
    if (logs.length) R.trees.push({ col: x + "," + z, logs, top });
  }
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 90000);
