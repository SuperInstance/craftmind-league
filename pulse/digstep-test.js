"use strict";
// DIG-STEP LIVE TEST v2 — operator probe (not a citizen, not curriculum).
// Wall: z=-103.3, columns x28-31 top out at grass y69 (stand 70) = +2
// from stand y68 west of it, leaf_litter at y70 on x29-30 (ab-fresh-3
// scan). A fresh body froze at its base (27.686,68,-103.308): 0.000 in
// raw, gotoNear and PF-direct. v1 of this test staged wrong (spawn
// scatter put the probe on the canopy east of the wall). v2 stages
// deterministically: gotoNear legs to the ground west of the wall,
// then an UNARMED walkTo east that stalls at the wall base — that
// stall position is the start line. Then the dig-step is armed and
// gotoNear runs 11 blocks east: success = past x=32 with the dig(s)
// declared in digStepStats.
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const PULSE = "/home/caseydigennaro/craftmind-league/pulse";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const prims = require(PULSE + "/lib/prims.js");
const Vec3 = require(NM + "/vec3").Vec3;
const USER = process.env.TEST_USER;
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);

bot.once("spawn", async () => {
  try {
    console.log("[DIGTEST]", USER, "spawn", fmt(bot.entity.position));
    await sleep(2500);
    // stage west of the wall at ground level
    for (const [lx, ly, lz] of [[24, 68, -103], [26.5, 68, -103.3]]) {
      const r = await prims.gotoNear(bot, lx, ly, lz, 1.2, 45000);
      console.log("[DIGTEST] stage leg", lx, lz, JSON.stringify(r), "at", fmt(bot.entity.position));
    }
    await sleep(600);
    // UNARMED walkTo east: must stall at the wall base
    const t0 = Date.now();
    const rs = await prims.walkTo(bot, 38, 68, -103.3, 1.5, 30000);
    const S = bot.entity.position.clone();
    console.log("[DIGTEST] STALL (unarmed walkTo):", JSON.stringify(rs), "ms", Date.now() - t0, "base", fmt(S), "onGround", bot.entity.onGround);
    // scan the wall columns from the base
    const bx = Math.floor(S.x), bz = Math.floor(S.z);
    for (let x = bx; x <= bx + 6; x++) {
      let col = "x=" + x + ": ";
      for (let y = Math.floor(S.y) - 1; y <= Math.floor(S.y) + 3; y++) {
        const b = bot.blockAt(new Vec3(x, y, bz));
        col += "[y" + y + " " + (b ? b.name : "?") + "] ";
      }
      console.log("[DIGTEST] WALL", col);
    }
    // ARMED run (position traced every 2 s)
    prims.setDigStep(true);
    const tracer = setInterval(() => { try { console.log("[DIGTEST] TRACE", fmt(bot.entity.position), "onGround", bot.entity.onGround); } catch {} }, 2000);
    const t1 = Date.now();
    const r = await prims.gotoNear(bot, S.x + 11, S.y, S.z, 1.5, 70000);
    clearInterval(tracer);
    const E = bot.entity.position.clone();
    console.log("[DIGTEST] ARMED gotoNear:", JSON.stringify(r), "ms", Date.now() - t1, "end", fmt(E), "dxFromBase", (E.x - S.x).toFixed(2));
    console.log("[DIGTEST] DIGSTEP-STATS", JSON.stringify(prims.digStepStats(), null, 1));
    prims.setDigStep(false);
    console.log("[DIGTEST] DONE");
  } catch (e) { console.log("[DIGTEST] EXCEPTION", (e && e.stack) || e); }
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[DIGTEST] error", e.message));
bot.on("kicked", (r) => console.log("[DIGTEST] kicked", String(r)));
setTimeout(() => { console.log("[DIGTEST] TIMEOUT"); process.exit(1); }, 300000);
