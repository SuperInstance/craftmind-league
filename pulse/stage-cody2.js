"use strict";
// STAGE-CODY v2 — operator staging. v1's waypoint legs forced bad
// lines and the helm wandered downhill on its (newly alive) lateral
// probes. The measured lesson of the night: the walk-only pathfinder
// crosses this terrain fine FROM A GROUNDED START on open ground —
// GateBare crossed the whole terrace that way — it is face-planted
// starts that kill it. Cody now sits grounded at the pit's west lip
// (36.69,64,-95.62) after v1. So v2: settle until onGround, then ONE
// pathfinder-planned gotoNear to the gate start (49.5,67,-83.5); if
// that fails, a hop chain of short gotoNear legs, re-planning from
// each halt. Dig-step ARMED throughout (declared; counted).
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const PULSE = "/home/caseydigennaro/craftmind-league/pulse";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const prims = require(PULSE + "/lib/prims.js");
const Vec3 = require(NM + "/vec3").Vec3;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: "Cody", auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);
const TARGET = { x: 49.5, z: -83.5 };

bot.once("spawn", async () => {
  try {
    console.log("[STAGE2] Cody spawn", fmt(bot.entity.position), "onGround", bot.entity.onGround);
    // settle until grounded (<= 15 s)
    for (let i = 0; i < 10 && !bot.entity.onGround; i++) await sleep(1500);
    console.log("[STAGE2] settled", fmt(bot.entity.position), "onGround", bot.entity.onGround);
    prims.setDigStep(true);
    let r = await prims.gotoNear(bot, TARGET.x, 67, TARGET.z, 1.6, 120000);
    console.log("[STAGE2] direct leg", JSON.stringify(r), "at", fmt(bot.entity.position), "onGround", bot.entity.onGround);
    if (!r.ok) {
      for (const [hx, hy, hz] of [[41, 68, -92], [45, 67, -88], [TARGET.x, 67, TARGET.z]]) {
        await sleep(2500); // settle between hops
        r = await prims.gotoNear(bot, hx, hy, hz, 1.6, 60000);
        console.log("[STAGE2] hop", hx, hz, JSON.stringify(r), "at", fmt(bot.entity.position), "onGround", bot.entity.onGround);
        if (!r.ok) break;
      }
    }
    const st = prims.digStepStats();
    console.log("[STAGE2] DIGS uses", st.uses, "log", JSON.stringify(st.log), "evals", st.evals.length);
    prims.setDigStep(false);
    await sleep(4000);
    const P = bot.entity.position;
    const dist = Math.hypot(TARGET.x - P.x, TARGET.z - P.z);
    console.log("[STAGE2] FINAL", fmt(P), "onGround", bot.entity.onGround, "distToGateStart", dist.toFixed(2), dist <= 1.6 ? "STAGED" : "NOT-STAGED");
  } catch (e) { console.log("[STAGE2] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[STAGE2] error", e.message));
bot.on("kicked", (r) => console.log("[STAGE2] kicked", String(r)));
setTimeout(() => { console.log("[STAGE2] TIMEOUT"); process.exit(1); }, 480000);
