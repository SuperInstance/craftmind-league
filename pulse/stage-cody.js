"use strict";
// STAGE-CODY — operator staging (not a citizen run, not curriculum).
// Bare mineflayer login AS CODY (resident stopped first) to walk him
// from the freeze pit (38.689,66,-93.691) to the Gate 0 re-run start
// (49.5,67,-83.5) on the surveyed z=-84 route. Uses the trial stack
// (prims.gotoNear legs) with the DECLARED dig-step allowance ARMED —
// cross-country staging over litter terrain is exactly what the
// allowance exists for; every dig is printed and counted. Waypoints
// chosen from the survey scans: west out of the pit (descents), then
// NE across the flat litter rows (z=-93/-92 tops ~68), then east onto
// the terrace lines (z=-87..-84 tops 63-67, all +/-1).
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
    console.log("[STAGE] Cody spawn", fmt(bot.entity.position), "onGround", bot.entity.onGround);
    await sleep(3000);
    console.log("[STAGE] settled", fmt(bot.entity.position), "onGround", bot.entity.onGround);
    prims.setDigStep(true);
    const legs = [
      [36.5, 65, -95.5],
      [40, 68, -90],
      [45, 67, -86],
      [TARGET.x, 67, TARGET.z],
    ];
    for (const [lx, ly, lz] of legs) {
      const r = await prims.gotoNear(bot, lx, ly, lz, 1.6, 75000);
      console.log("[STAGE] leg", lx, lz, JSON.stringify(r), "at", fmt(bot.entity.position), "onGround", bot.entity.onGround);
      if (!r.ok) break;
    }
    const st = prims.digStepStats();
    console.log("[STAGE] DIGS uses", st.uses, "log", JSON.stringify(st.log));
    prims.setDigStep(false);
    await sleep(4000); // settle so the saved position is grounded
    const P = bot.entity.position;
    const dist = Math.hypot(TARGET.x - P.x, TARGET.z - P.z);
    console.log("[STAGE] FINAL", fmt(P), "onGround", bot.entity.onGround, "distToGateStart", dist.toFixed(2), dist <= 1.6 ? "STAGED" : "NOT-STAGED");
  } catch (e) { console.log("[STAGE] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[STAGE] error", e.message));
bot.on("kicked", (r) => console.log("[STAGE] kicked", String(r)));
setTimeout(() => { console.log("[STAGE] TIMEOUT"); process.exit(1); }, 420000);
