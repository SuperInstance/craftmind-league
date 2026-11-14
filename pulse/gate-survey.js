"use strict";
// GATE SURVEY — operator probe (not a citizen, not curriculum).
// 1) Navigate to a vantage near the gate terrace.
// 2) Scan column profiles for lines z in [-87..-81], x in [44..76]:
//    solid ground top (boundingBox block, leaves excluded), plus any
//    leaf_litter sitting on the walking surface — recorded by name,
//    because this Paper build collides with litter at fractional
//    heights while prismarine-data calls it collision-free.
// 3) Score 20-block spans (x 48->68 and 49->69) per line: max up-step,
//    number of +1 climbs, litter-topped columns, unloaded nulls.
// 4) Physically traverse the best line (preferring z=-84, the corridor
//    the gate crew's scan reported as stairs +1/+1): RAW forward+jump
//    east, then prims.gotoNear east + prims.walkTo back (trial stack).
// 5) Print the terrain east of Cody's freeze cell (38.689,66,-93.691)
//    for the record.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const PULSE = "/home/caseydigennaro/craftmind-league/pulse";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const prims = require(PULSE + "/lib/prims.js");
const Vec3 = require(NM + "/vec3").Vec3;
const USER = process.env.SURVEY_USER;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);

function column(x, z) {
  // returns {top, name, litter} — top = y of highest solid block that is
  // not leaves (walking surface block), litter = y of leaf_litter found
  // within [top-1, top+2] or null
  let top = null, name = null, litter = null;
  for (let y = 95; y > 45; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (!b) continue;
    if (b.name === "leaf_litter" && litter === null) litter = y;
    if (top === null && b.boundingBox === "block" && !/_leaves$/.test(b.name)) { top = y; name = b.name; }
    if (top !== null && y < top - 2) break;
  }
  return { top, name, litter };
}

async function rawWalk(tx, tz, capMs) {
  const t0 = Date.now();
  bot.setControlState("jump", true);
  bot.setControlState("forward", true);
  let arrived = false;
  while (Date.now() - t0 < capMs) {
    const p = bot.entity.position;
    if (Math.hypot(tx - p.x, tz - p.z) < 1.2) { arrived = true; break; }
    try { await bot.lookAt(new Vec3(tx, p.y + 1.62, tz), true); } catch {}
    await sleep(450);
  }
  bot.setControlState("forward", false);
  bot.setControlState("jump", false);
  return arrived;
}

bot.once("spawn", async () => {
  try {
    console.log("[SURVEY]", USER, "spawn", fmt(bot.entity.position));
    await sleep(3000);
    // ── navigate to vantage (60, -84) via gotoNear legs ──
    for (const [lx, lz] of [[44, -90], [52, -86], [60, -84]]) {
      const gy = (() => { const c = column(lx, lz); return c.top !== null ? c.top + 1 : bot.entity.position.y; })();
      const r = await prims.gotoNear(bot, lx, gy, lz, 1.8, 60000);
      console.log("[SURVEY] leg to", lx, lz, "->", JSON.stringify(r), "at", fmt(bot.entity.position));
    }
    await sleep(1500);
    // ── scan profiles ──
    const lines = {};
    for (let z = -87; z <= -81; z++) {
      const cols = [];
      for (let x = 44; x <= 76; x++) cols.push(column(x, z));
      lines[z] = cols;
      const tops = cols.map((c) => (c.top === null ? "?" : c.top));
      const lits = cols.map((c, i) => (c.litter !== null && c.top !== null && c.litter === c.top + 1 ? 44 + i : null)).filter((v) => v !== null);
      console.log("[SURVEY] LINE z=" + z, "tops(x44..76):", tops.join(","), "| litter-on-surface at x:", lits.join(",") || "none");
    }
    // ── score spans ──
    function scoreSpan(z, x0) {
      const cols = lines[z];
      let maxUp = -99, climbs = 0, nulls = 0, litterCols = 0;
      for (let i = 0; i <= 20; i++) {
        const c = cols[x0 - 44 + i];
        if (!c || c.top === null) { nulls++; continue; }
        if (c.litter !== null && c.litter === c.top + 1) litterCols++;
        if (i > 0) {
          const p = cols[x0 - 44 + i - 1];
          if (p && p.top !== null) {
            const s = c.top - p.top;
            if (s > maxUp) maxUp = s;
            if (s === 1) climbs++;
          }
        }
      }
      return { z, x0, x1: x0 + 20, maxUp, climbs, litterCols, nulls, endTop: cols[x0 - 44 + 20] && cols[x0 - 44 + 20].top };
    }
    const spans = [];
    for (const z of [-86, -85, -84, -83, -82]) for (const x0 of [48, 49]) spans.push(scoreSpan(z, x0));
    for (const s of spans) console.log("[SURVEY] SPAN", JSON.stringify(s));
    const good = spans.filter((s) => s.nulls === 0 && s.maxUp <= 1 && s.climbs >= 1);
    good.sort((a, b) => (Math.abs(a.z + 84) - Math.abs(b.z + 84)) || (a.litterCols - b.litterCols) || (b.climbs - a.climbs));
    const chosen = good[0] || null;
    console.log("[SURVEY] CHOSEN", JSON.stringify(chosen));
    if (chosen) {
      const cols = lines[chosen.z];
      const prof = [];
      for (let i = 0; i <= 20; i++) prof.push(cols[chosen.x0 - 44 + i].top);
      const startTop = prof[0], endTop = prof[20];
      console.log("[SURVEY] CHOSEN-PROFILE", JSON.stringify(prof));
      // go to span start
      const r0 = await prims.gotoNear(bot, chosen.x0 + 0.5, startTop + 1, chosen.z + 0.5, 1.2, 60000);
      console.log("[SURVEY] to-start", JSON.stringify(r0), "at", fmt(bot.entity.position));
      await sleep(800);
      const S = bot.entity.position.clone();
      // RAW traverse east
      const okRaw = await rawWalk(chosen.x1 + 0.5, chosen.z + 0.5, 30000);
      const E1 = bot.entity.position.clone();
      console.log("[SURVEY] RAW east arrived", okRaw, "start", fmt(S), "end", fmt(E1), "dispXZ", Math.hypot(E1.x - S.x, E1.z - S.z).toFixed(2));
      // RAW back west
      const okRawW = await rawWalk(S.x, S.z, 30000);
      console.log("[SURVEY] RAW west arrived", okRawW, "at", fmt(bot.entity.position));
      await sleep(800);
      const S2 = bot.entity.position.clone();
      // PRIMS traverse east (trial stack)
      const t1 = Date.now();
      const g1 = await prims.gotoNear(bot, chosen.x1 + 0.5, endTop + 1, chosen.z + 0.5, 1.5, 90000);
      const M = bot.entity.position.clone();
      console.log("[SURVEY] PRIMS gotoNear east", JSON.stringify(g1), "ms", Date.now() - t1, "mid", fmt(M), "dispXZ", Math.hypot(M.x - S2.x, M.z - S2.z).toFixed(2));
      const t2 = Date.now();
      const g2 = await prims.walkTo(bot, S2.x, S2.y, S2.z, 1.5, 90000);
      console.log("[SURVEY] PRIMS walkTo west", JSON.stringify(g2), "ms", Date.now() - t2, "end", fmt(bot.entity.position));
    }
    // ── Cody's freeze cell, for the record ──
    for (let z = -95; z <= -92; z++) {
      const cols = [];
      for (let x = 36; x <= 46; x++) cols.push(column(x, z));
      console.log("[SURVEY] FREEZE-ROW z=" + z, cols.map((c, i) => (36 + i) + ":" + (c.top === null ? "?" : c.top) + (c.litter !== null && c.top !== null && c.litter === c.top + 1 ? "L" : "")).join(" "));
    }
    console.log("[SURVEY] DONE");
  } catch (e) { console.log("[SURVEY] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[SURVEY] error", e.message));
bot.on("kicked", (r) => console.log("[SURVEY] kicked", String(r)));
setTimeout(() => { console.log("[SURVEY] TIMEOUT"); process.exit(1); }, 600000);
