"use strict";
// GATE SURVEY v2 — operator probe. v1's gotoNear legs could not cross
// the wooded slope (the very locomotion problem under study), though
// its block scan completed: ROUTE CHOSEN from scan data — z=-84 line,
// x48 -> x68: tops profile [66,65,65,65,66,66,67,67,67,67,67,67,67,67,
// 67,67,66,64,64,64,65], max up-step +1, three +1 climbs, litter on the
// surface at x54,55,56,58,61,63 (flat plateau columns).
// v2 navigates by RAW continuous forward+jump steering (the one mode
// proven to cross this terrain: A/B raw drives), then physically
// traverses the route: RAW east, RAW west, then the TRIAL STACK
// (prims.gotoNear east, prims.walkTo west) as a dress rehearsal.
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

async function rawNav(tx, tz, capMs, label) {
  const t0 = Date.now();
  let lastPos = bot.entity.position.clone();
  let lastMoveAt = Date.now();
  bot.setControlState("jump", true);
  bot.setControlState("forward", true);
  let arrived = false;
  while (Date.now() - t0 < capMs) {
    const p = bot.entity.position;
    if (Math.hypot(tx - p.x, tz - p.z) < 1.3) { arrived = true; break; }
    if (p.distanceTo(lastPos) > 0.3) { lastPos = p.clone(); lastMoveAt = Date.now(); }
    if (Date.now() - lastMoveAt > 20000) { console.log("[SURVEY2] rawNav", label, "STALLED 20s at", fmt(p)); break; }
    try { await bot.lookAt(new Vec3(tx, p.y + 1.62, tz), true); } catch {}
    await sleep(450);
  }
  bot.setControlState("forward", false);
  bot.setControlState("jump", false);
  console.log("[SURVEY2] rawNav", label, "arrived", arrived, "at", fmt(bot.entity.position), "ms", Date.now() - t0);
  return arrived;
}

bot.once("spawn", async () => {
  try {
    console.log("[SURVEY2]", USER, "spawn", fmt(bot.entity.position));
    await sleep(3000);
    // navigate to route start (48.5, -83.5) by raw steering waypoints
    await rawNav(40, -88, 45000, "wp1(40,-88)");
    await rawNav(48.5, -83.5, 45000, "wp2-start(48.5,-83.5)");
    await sleep(800);
    const S = bot.entity.position.clone();
    console.log("[SURVEY2] AT-START", fmt(S), "onGround", bot.entity.onGround);
    // RAW traverse east to x=68.5
    const okE = await rawNav(68.5, -83.5, 40000, "route-east");
    const E1 = bot.entity.position.clone();
    console.log("[SURVEY2] RAW-EAST arrived", okE, "end", fmt(E1), "dispXZ", Math.hypot(E1.x - S.x, E1.z - S.z).toFixed(2), "climbY", (E1.y - S.y).toFixed(2));
    // RAW back west
    const okW = await rawNav(S.x, S.z, 40000, "route-west");
    console.log("[SURVEY2] RAW-WEST arrived", okW, "at", fmt(bot.entity.position));
    await sleep(800);
    const S2 = bot.entity.position.clone();
    // TRIAL-STACK traverse: gotoNear east, walkTo west (dig-step OFF)
    const t1 = Date.now();
    const g1 = await prims.gotoNear(bot, 68.5, 66, -83.5, 1.5, 90000);
    const M = bot.entity.position.clone();
    console.log("[SURVEY2] PRIMS gotoNear east", JSON.stringify(g1), "ms", Date.now() - t1, "mid", fmt(M), "dispXZ", Math.hypot(M.x - S2.x, M.z - S2.z).toFixed(2));
    const t2 = Date.now();
    const g2 = await prims.walkTo(bot, S2.x, S2.y, S2.z, 1.5, 90000);
    console.log("[SURVEY2] PRIMS walkTo west", JSON.stringify(g2), "ms", Date.now() - t2, "end", fmt(bot.entity.position));
    console.log("[SURVEY2] DONE");
  } catch (e) { console.log("[SURVEY2] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[SURVEY2] error", e.message));
bot.on("kicked", (r) => console.log("[SURVEY2] kicked", String(r)));
setTimeout(() => { console.log("[SURVEY2] TIMEOUT"); process.exit(1); }, 480000);
