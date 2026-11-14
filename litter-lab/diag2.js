"use strict";
// diag2.js — raw physics watch: stand still and log pushes; then hold
// forward with yaw set directly (no pathfinder) in three directions.
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3");
const { gotoPos, sleep } = require("./driver");
const { makeStatusQuoMovements } = require("./movements");

const USER = "DiagProbe" + Math.floor(1000 + Math.random() * 9000);
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline" });
bot.loadPlugin(pathfinder);
bot.on("error", (e) => console.log("[DIAG2] error", e && e.message));
bot.on("kicked", (r) => console.log("[DIAG2] kicked", r));
bot.on("death", () => console.log("[DIAG2] DIED at", fmt(bot.entity.position)));
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);

function nearestHostile() {
  let best = null;
  for (const e of Object.values(bot.entities)) {
    if (!e || !e.position || e === bot.entity) continue;
    const n = (e.name || "").toLowerCase();
    if (["zombie", "skeleton", "spider", "creeper", "cave_spider", "witch", "enderman"].includes(n)) {
      const d = e.position.distanceTo(bot.entity.position);
      if (!best || d < best.d) best = { name: e.name, d: +d.toFixed(1), at: fmt(e.position) };
    }
  }
  return best;
}

async function watch(label, ms) {
  const s = bot.entity.position.clone();
  let maxJump = 0, last = s.clone(), minHp = bot.health;
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    await sleep(200);
    const p = bot.entity.position;
    const step = p.distanceTo(last);
    if (step > maxJump) maxJump = step;
    last = p.clone();
    if (bot.health < minHp) minHp = bot.health;
  }
  console.log("[DIAG2]", label, "start", fmt(s), "end", fmt(bot.entity.position),
    "net", s.distanceTo(bot.entity.position).toFixed(2), "maxSampleStep", maxJump.toFixed(2),
    "minHp", minHp, "hostile", JSON.stringify(nearestHostile()));
}

async function drive(label, yawDeg, ms, jump) {
  const yaw = yawDeg * Math.PI / 180;
  await bot.look(yaw, 0, true);
  await sleep(150);
  const s = bot.entity.position.clone();
  if (jump) bot.setControlState("jump", true);
  bot.setControlState("forward", true);
  await sleep(ms);
  bot.setControlState("forward", false);
  bot.setControlState("jump", false);
  await sleep(300);
  const e = bot.entity.position;
  console.log("[DIAG2] drive", label, "from", fmt(s), "to", fmt(e),
    "delta", (e.x - s.x).toFixed(2) + "," + (e.z - s.z).toFixed(2),
    "hp", bot.health, "hostile", JSON.stringify(nearestHostile()));
}

async function main() {
  await new Promise((res) => bot.once("spawn", res));
  console.log("[DIAG2] spawned", USER, "at", fmt(bot.entity.position), "hp", bot.health);
  bot.pathfinder.setMovements(makeStatusQuoMovements(bot));
  await sleep(2500);
  // descend if needed
  const p = bot.entity.position;
  const below = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
  console.log("[DIAG2] below:", below && below.name);
  if (!below || !["grass_block", "dirt", "stone"].includes(below.name)) {
    // find a ground column within 12 and go
    let best = null;
    for (let dx = -12; dx <= 12; dx++) for (let dz = -12; dz <= 12; dz++) {
      const cx = Math.floor(p.x) + dx, cz = Math.floor(p.z) + dz;
      for (let y = Math.floor(p.y) + 6; y >= Math.floor(p.y) - 26; y--) {
        const b = bot.blockAt(new Vec3(cx, y, cz));
        if (!b) break;
        if (b.boundingBox === "block") {
          if (["grass_block", "dirt", "stone"].includes(b.name)) { const d = Math.hypot(dx, dz); if (!best || d < best.d) best = { x: cx + 0.5, y: y + 1, z: cz + 0.5, d }; }
          break;
        }
      }
    }
    if (best) { console.log("[DIAG2] descending to", JSON.stringify(best)); await gotoPos(bot, best.x, best.y, best.z, { range: 1.2, timeoutMs: 90000, mode: "A", counters: { stallBreaker: 0, replans: 0 } }); }
  }
  console.log("[DIAG2] settled at", fmt(bot.entity.position));
  await watch("STAND-STILL 15s", 15000);
  await drive("EAST", -90, 3000, false);
  await drive("WEST", 90, 3000, false);
  await drive("NORTH", 180, 3000, false);
  await drive("EAST+JUMP", -90, 3000, true);
  await watch("STAND-STILL-2 10s", 10000);
  console.log("[DIAG2] DONE hp", bot.health, "food", bot.food);
  bot.quit();
  process.exit(0);
}
main().catch((e) => { console.log("[DIAG2] FATAL", e && e.stack || e); process.exit(1); });
setTimeout(() => { console.log("[DIAG2] GLOBAL TIMEOUT"); process.exit(3); }, 280000);
