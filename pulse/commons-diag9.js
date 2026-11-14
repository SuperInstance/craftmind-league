"use strict";
// DIAG9: cell survey around (35.3,73,-85.4): what is at feet/head level in
// each direction? Then dig the block under the feet twice (down the shaft).
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsSmith", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const P = () => { const p = bot.entity.position; return [ +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2) ]; };
bot.once("spawn", async () => {
  const R = {};
  await sleep(7000);
  R.start = P();
  const p = bot.entity.position, fx = Math.floor(p.x), fz = Math.floor(p.z), fy = Math.floor(p.y);
  R.feetY = fy; R.onGround = bot.entity.onGround; R.vel = bot.entity.velocity;
  R.cols = {};
  for (let x = fx - 2; x <= fx + 2; x++) for (let z = fz - 2; z <= fz + 2; z++) {
    const col = [];
    for (let y = fy - 3; y <= fy + 4; y++) { const b = bot.blockAt(new Vec3(x, y, z)); if (b && b.name !== "air") col.push(y + ":" + b.name); }
    R.cols[x + "," + z] = col;
  }
  R.digs = [];
  for (let i = 0; i < 2; i++) {
    const q = bot.entity.position;
    const under = bot.blockAt(new Vec3(Math.floor(q.x), Math.floor(q.y) - 1, Math.floor(q.z)));
    if (!under || under.name === "air") { R.digs.push({ i, under: "air", pos: P() }); break; }
    try { await bot.dig(under); } catch (e) { R.digs.push({ i, err: e.message }); break; }
    await sleep(1300);
    R.digs.push({ i, dug: under.name, pos: P() });
  }
  // after dropping: try walking south and west again briefly
  R.legs = [];
  for (const [name, dx, dz] of [["S", 0, 1], ["E", 1, 0]]) {
    const q = bot.entity.position;
    try { await bot.lookAt(new Vec3(q.x + dx * 10, q.y + 1, q.z + dz * 10), true); } catch (e) {}
    bot.setControlState("sprint", true); bot.setControlState("jump", true); bot.setControlState("forward", true);
    await sleep(3500);
    bot.clearControlStates(); await sleep(300);
    R.legs.push({ dir: name, end: P() });
  }
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 90000);
