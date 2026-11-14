"use strict";
// scan.js — one-off course scanner for the Litter Lab (not part of
// the scored protocol). Logs in under a fresh name, descends near the
// first segment's start, then reports, for each candidate segment:
//   - litter cells within perpendicular distance <=3 of the segment
//   - column top block + stand height sampled every ~2 blocks
//   - a coarse elevation profile (min/max stand y along the segment)
// Usage: LITTER_USER=ScanLabNNNN node scan.js
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3");
const { gotoPos, sleep } = require("./driver");
const { makeStatusQuoMovements } = require("./movements");

const USER = process.env.LITTER_USER;
if (!USER) { console.log("no LITTER_USER"); process.exit(2); }

const SEGMENTS = [
  { name: "A", x1: -32, z1: -94, x2: 2, z2: -112 },
  { name: "B", x1: -34, z1: -106, x2: 6, z2: -121 },
];

const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline" });
bot.loadPlugin(pathfinder);
bot.on("error", (e) => console.log("[SCAN] bot error", e && e.message));
bot.on("kicked", (r) => console.log("[SCAN] kicked", r));
bot.on("death", () => console.log("[SCAN] death"));

function columnTop(cx, cz) {
  for (let y = 90; y >= 50; y--) {
    const b = bot.blockAt(new Vec3(cx, y, cz));
    if (!b) continue;
    if (b.boundingBox === "block") return { top: b, standY: y + 1 };
    if (b.name === "leaf_litter") {
      const f = bot.blockAt(new Vec3(cx, y - 1, cz));
      if (f && f.boundingBox === "block") return { top: b, standY: y, litterOn: f.name };
    }
  }
  return null;
}

function scanSegment(seg) {
  const litterId = bot.registry.blocksByName.leaf_litter.id;
  const len = Math.hypot(seg.x2 - seg.x1, seg.z2 - seg.z1);
  const ux = (seg.x2 - seg.x1) / len, uz = (seg.z2 - seg.z1) / len;
  let litterNear = 0, litterCells = [];
  let minY = 999, maxY = -999, water = 0, samples = 0, litterSamples = 0;
  const x0 = Math.floor(Math.min(seg.x1, seg.x2)) - 3, x1 = Math.floor(Math.max(seg.x1, seg.x2)) + 3;
  const z0 = Math.floor(Math.min(seg.z1, seg.z2)) - 3, z1 = Math.floor(Math.max(seg.z1, seg.z2)) + 3;
  for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) {
    // perpendicular distance to segment
    const t = Math.max(0, Math.min(1, ((x + 0.5 - seg.x1) * ux + (z + 0.5 - seg.z1) * uz) / len));
    const px = seg.x1 + ux * len * t, pz = seg.z1 + uz * len * t;
    const perp = Math.hypot(x + 0.5 - px, z + 0.5 - pz);
    if (perp > 3) continue;
    for (let y = 55; y <= 90; y++) {
      const b = bot.blockAt(new Vec3(x, y, z));
      if (b && b.type === litterId) { litterNear++; if (litterCells.length < 400) litterCells.push([x, y, z]); }
    }
  }
  const profile = [];
  for (let d = 0; d <= len; d += 2) {
    const cx = Math.floor(seg.x1 + ux * d), cz = Math.floor(seg.z1 + uz * d);
    const c = columnTop(cx, cz);
    samples++;
    if (!c) { profile.push(d.toFixed(0) + ":?"); continue; }
    if (c.top.name === "water") water++;
    if (c.top.name === "leaf_litter") litterSamples++;
    minY = Math.min(minY, c.standY); maxY = Math.max(maxY, c.standY);
    profile.push(d.toFixed(0) + ":" + c.top.name.replace("_block", "") + "@" + c.standY);
  }
  console.log("[SCAN] segment", seg.name, "len", len.toFixed(1),
    "litterWithin3:", litterNear, "profileSamples:", samples,
    "litterTopSamples:", litterSamples, "waterSamples:", water,
    "standYrange:", minY, "-", maxY);
  console.log("[SCAN] profile", seg.name, profile.join(" "));
  const s = columnTop(Math.floor(seg.x1), Math.floor(seg.z1));
  const e = columnTop(Math.floor(seg.x2), Math.floor(seg.z2));
  console.log("[SCAN] startCol", seg.name, JSON.stringify(s && { top: s.top.name, standY: s.standY }),
    "endCol", JSON.stringify(e && { top: e.top.name, standY: e.standY }));
  return { litterNear, minY, maxY };
}

async function descendNear(x, z) {
  // Walk with arm A toward (x,z) until within ~20 blocks (chunks loaded), then scan reads blocks directly.
  for (let i = 0; i < 6; i++) {
    const p = bot.entity.position;
    const d = Math.hypot(p.x - x, p.z - z);
    if (d <= 20) return true;
    const hx = p.x + ((x - p.x) / d) * Math.min(18, d);
    const hz = p.z + ((z - p.z) / d) * Math.min(18, d);
    await gotoPos(bot, hx, p.y, hz, { range: 1.5, timeoutMs: 90000, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
    await sleep(400);
  }
  return Math.hypot(bot.entity.position.x - x, bot.entity.position.z - z) <= 24;
}

async function main() {
  await new Promise((res) => bot.once("spawn", res));
  console.log("[SCAN] spawned as", USER, "at", bot.entity.position.toString());
  bot.pathfinder.setMovements(makeStatusQuoMovements(bot));
  await sleep(2500);
  for (const seg of SEGMENTS) {
    const ok = await descendNear(seg.x1, seg.z1);
    console.log("[SCAN] near segment", seg.name, "start:", ok, "bot at", bot.entity.position.toString());
    await sleep(600);
    scanSegment(seg);
  }
  console.log("[SCAN] DONE");
  bot.quit();
  process.exit(0);
}

main().catch((e) => { console.log("[SCAN] FATAL", e && e.stack || e); process.exit(1); });
setTimeout(() => { console.log("[SCAN] GLOBAL TIMEOUT"); process.exit(3); }, 12 * 60 * 1000);
