"use strict";
// DIAG6: vertical escape from the pit at (36.06,64,-95.69).
// Phase 1: dig the block under the feet (proven to work), then KEEP
// digging the floor block as the body drops, up to 6 times - report the
// position after each. Phase 2: from the new floor, walk S then E, 4 s
// each - did dropping change the pin?
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const P = () => { const p = bot.entity.position; return [ +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2) ]; };
bot.once("spawn", async () => {
  const R = { digs: [] };
  await sleep(7000);
  R.start = P();
  for (let i = 0; i < 6; i++) {
    const p = bot.entity.position;
    const under = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
    if (!under || under.name === "air") { R.digs.push({ i, under: "air", pos: P() }); break; }
    const nm = under.name;
    try { await bot.dig(under); } catch (e) { R.digs.push({ i, under: nm, err: e.message }); break; }
    await sleep(1300);
    R.digs.push({ i, dug: nm, pos: P() });
  }
  // walk attempts from the new position
  R.legs = [];
  for (const [name, dx, dz, sj] of [["S", 0, 1, false], ["S-sj", 0, 1, true], ["E-sj", 1, 0, true]]) {
    const q = bot.entity.position;
    try { await bot.lookAt(new Vec3(q.x + dx * 10, q.y + 1, q.z + dz * 10), true); } catch (e) {}
    if (sj) { bot.setControlState("sprint", true); bot.setControlState("jump", true); }
    bot.setControlState("forward", true);
    await sleep(4000);
    bot.clearControlStates(); await sleep(300);
    R.legs.push({ dir: name, end: P() });
  }
  R.inv = bot.inventory.items().map(i => i.name + "x" + i.count);
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 110000);
