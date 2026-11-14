"use strict";
// DIAG5: localise the pin at (36.04,64,-95.69) - full 3x3 column dump at
// feet level around the body, facing block, and try: (a) walk N/S/E/W 3 s
// each from HERE, (b) dig the block under the feet and see if body drops.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const P = () => { const p = bot.entity.position; return [ +p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2) ]; };
async function burst(tx, tz, secs, sj) {
  const p = bot.entity.position;
  try { await bot.lookAt(new Vec3(tx, p.y + 1, tz), true); } catch (e) {}
  if (sj) { bot.setControlState("sprint", true); bot.setControlState("jump", true); }
  bot.setControlState("forward", true);
  await sleep(secs * 1000);
  bot.clearControlStates(); await sleep(300);
  return P();
}
bot.once("spawn", async () => {
  const R = {};
  await sleep(7000);
  R.start = P();
  const p = bot.entity.position, fx = Math.floor(p.x), fz = Math.floor(p.z), fy = Math.floor(p.y);
  R.feetY = fy; R.onGround = bot.entity.onGround;
  R.cols = {};
  for (let x = fx - 2; x <= fx + 2; x++) for (let z = fz - 2; z <= fz + 2; z++) {
    const col = [];
    for (let y = fy - 2; y <= fy + 3; y++) { const b = bot.blockAt(new Vec3(x, y, z)); if (b && b.name !== "air") col.push(y + ":" + b.name); }
    R.cols[x + "," + z] = col;
  }
  // cardinal walks from here
  R.legs = [];
  for (const [name, dx, dz] of [["W",-1,0],["E",1,0],["N",0,-1],["S",0,1],["W-sj",-1,0]]) {
    const q = bot.entity.position;
    const end = await burst(q.x + dx * 10, q.z + dz * 10, 3, name.includes("sj"));
    R.legs.push({ dir: name, end });
  }
  // dig the block under the feet
  const q = bot.entity.position;
  const under = bot.blockAt(new Vec3(Math.floor(q.x), Math.floor(q.y) - 1, Math.floor(q.z)));
  R.under = under ? { name: under.name, canDig: bot.canDigBlock(under) } : null;
  if (under && under.name !== "air") {
    try { await bot.dig(under); R.underDig = { after: (bot.blockAt(under.position) || {}).name }; } catch (e) { R.underDig = { err: e.message }; }
    await sleep(1500); R.afterUnderDig = P();
  }
  console.log(JSON.stringify(R));
  bot.quit(); process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 110000);
