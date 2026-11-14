"use strict";
// GATE SURVEY v3 — operator probe: staging + route rehearsal.
// v1 chose the route from block scans (z=-84, x48->68, max up-step +1,
// three +1 climbs). v2 proved cross-country navigation to the route
// start is itself blocked by the litter terrain — so v3 stages with
// the trial stack's helm and the DECLARED dig-step allowance ARMED
// (staging digs are counted and reported separately), then rehearses
// the route exactly as the gate will run it: UNARMED prims.gotoNear
// east + prims.walkTo west. If the unarmed rehearsal fails, an ARMED
// traverse follows for comparison.
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

bot.once("spawn", async () => {
  try {
    console.log("[SURVEY3]", USER, "spawn", fmt(bot.entity.position));
    await sleep(3000);
    // ── PHASE 1: staging, dig-step ARMED ──
    prims.setDigStep(true);
    for (const [lx, ly, lz] of [[36, 68, -100], [40, 68, -94], [44, 67, -88], [48.5, 67, -83.5]]) {
      const r = await prims.gotoNear(bot, lx, ly, lz, 1.6, 60000);
      console.log("[SURVEY3] stage leg", lx, lz, JSON.stringify(r), "at", fmt(bot.entity.position));
      if (!r.ok) break;
    }
    const st = prims.digStepStats();
    console.log("[SURVEY3] STAGING-DIGS uses", st.uses, "log", JSON.stringify(st.log));
    prims.setDigStep(false);
    await sleep(800);
    const S = bot.entity.position.clone();
    console.log("[SURVEY3] AT-START", fmt(S), "onGround", bot.entity.onGround);
    // ── PHASE 2: rehearsal, UNARMED (the gate's own configuration) ──
    const t1 = Date.now();
    const g1 = await prims.gotoNear(bot, 68.5, 66, -83.5, 1.5, 90000);
    const M = bot.entity.position.clone();
    console.log("[SURVEY3] REHEARSAL gotoNear east", JSON.stringify(g1), "ms", Date.now() - t1, "mid", fmt(M), "dispXZ", Math.hypot(M.x - S.x, M.z - S.z).toFixed(2), "climbY", (M.y - S.y).toFixed(2));
    let g2 = null;
    if (g1.ok) {
      const t2 = Date.now();
      g2 = await prims.walkTo(bot, S.x, S.y, S.z, 1.5, 90000);
      console.log("[SURVEY3] REHEARSAL walkTo west", JSON.stringify(g2), "ms", Date.now() - t2, "end", fmt(bot.entity.position));
    }
    // ── PHASE 3: armed traverse, only if the unarmed one failed ──
    if (!g1.ok || (g2 && !g2.ok)) {
      prims.setDigStep(true);
      const before = prims.digStepStats().uses;
      const t3 = Date.now();
      const h1 = await prims.gotoNear(bot, 68.5, 66, -83.5, 1.5, 90000);
      const M3 = bot.entity.position.clone();
      console.log("[SURVEY3] ARMED gotoNear east", JSON.stringify(h1), "ms", Date.now() - t3, "mid", fmt(M3), "dispXZ", Math.hypot(M3.x - S.x, M3.z - S.z).toFixed(2));
      let h2 = null;
      if (h1.ok) {
        const t4 = Date.now();
        h2 = await prims.walkTo(bot, S.x, S.y, S.z, 1.5, 90000);
        console.log("[SURVEY3] ARMED walkTo west", JSON.stringify(h2), "ms", Date.now() - t4, "end", fmt(bot.entity.position));
      }
      const st3 = prims.digStepStats();
      console.log("[SURVEY3] ARMED-TRAVERSE-DIGS uses-delta", st3.uses - before, "log", JSON.stringify(st3.log.slice(before)));
      prims.setDigStep(false);
    }
    console.log("[SURVEY3] DONE");
  } catch (e) { console.log("[SURVEY3] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[SURVEY3] error", e.message));
bot.on("kicked", (r) => console.log("[SURVEY3] kicked", String(r)));
setTimeout(() => { console.log("[SURVEY3] TIMEOUT"); process.exit(1); }, 720000);
