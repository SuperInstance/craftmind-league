"use strict";
// COMMONS DIAG - stand at (36,-101), dump raw evidence about the oak at
// (34,-101) and the bot's dig capability. Read-only except one test dig
// attempt on the lowest trunk block, reported faithfully.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  const R = {};
  await sleep(8000);
  const p = bot.entity.position;
  R.pos = { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) };
  R.onGround = bot.entity.onGround;
  R.heldItem = bot.heldItem ? bot.heldItem.name : null;
  R.equipment = bot.inventory.slots.map((s, i) => s ? i + ":" + s.name : null).filter(Boolean);
  // every block in a 7x3x7 box around y 68..71 at x32..38, z-103..-99
  R.near = {};
  for (let x = 32; x <= 38; x++) for (let z = -103; z <= -99; z++) for (let y = 67; y <= 74; y++) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (b && b.name !== "air") R.near[x + "," + y + "," + z] = { name: b.name, canDig: bot.canDigBlock(b), dist: +b.position.distanceTo(bot.entity.position).toFixed(2) };
  }
  const low = bot.blockAt(new Vec3(34, 70, -101));
  R.lowTrunk = low ? { name: low.name, canDig: bot.canDigBlock(low), dist: +low.position.distanceTo(bot.entity.position).toFixed(2), digTime: (() => { try { return bot.digTime(low); } catch (e) { return "ERR " + e.message; } })() } : null;
  if (low && /_log$/.test(low.name)) {
    try {
      const t0 = Date.now();
      await bot.dig(low);
      R.testDig = { ok: true, ms: Date.now() - t0, after: (bot.blockAt(new Vec3(34, 70, -101)) || {}).name };
    } catch (e) { R.testDig = { ok: false, err: e.message }; }
    await sleep(1500);
    R.invAfter = bot.inventory.items().map(i => i.name + "x" + i.count);
  }
  console.log(JSON.stringify(R, null, 1));
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 90000);
