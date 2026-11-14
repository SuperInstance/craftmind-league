"use strict";
// COMMONS WARDEN VERIFY v3 - relog; read the world exactly as it stands.
// No digging, no placing, no crafting. Position + site blocks + contents.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const mineflayer = require(NM + "/mineflayer");
const Vec3 = require(NM + "/vec3").Vec3;
const OUT = "/home/caseydigennaro/craftmind-league/pulse/commons-chest-verify.json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "CommonsWarden", auth: "offline" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once("spawn", async () => {
  const R = { ts: new Date().toISOString() };
  await sleep(8000);
  const p = bot.entity.position;
  R.pos = { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) };
  R.health = bot.health; R.food = bot.food;
  R.inventory = bot.inventory.items().map(i => i.name + "x" + i.count);
  for (const [k, v] of Object.entries({ chest: [63, 68, -82], belowChest: [63, 67, -82], sign: [64, 68, -82], table: [64, 68, -83], siteGroundW: [62, 67, -82], siteGroundS: [63, 67, -81] })) {
    const b = bot.blockAt(new Vec3(v[0], v[1], v[2]));
    R[k] = b ? b.name : null;
  }
  const cb = bot.blockAt(new Vec3(63, 68, -82));
  if (cb && cb.name === "chest") {
    try {
      const win = await bot.openChest(cb);
      R.chestContents = win.containerItems().map(i => i.name + "x" + i.count);
      win.close();
    } catch (e) { R.chestError = e.message; }
  }
  const sb = bot.blockAt(new Vec3(64, 68, -82));
  if (sb && /sign/.test(sb.name)) {
    try { R.signText = sb.getSignText ? sb.getSignText() : (sb.signText || null); } catch (e) { R.signText = "ERR " + e.message; }
  }
  console.log(JSON.stringify(R, null, 1));
  fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("ERR", e && e.message));
setTimeout(() => process.exit(2), 60000);
