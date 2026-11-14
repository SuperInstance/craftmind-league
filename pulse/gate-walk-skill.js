"use strict";
// GATE-WALK — diagnostic skill, NOT curriculum. Written by the operator
// (substrate verification), never promoted, never in active.json.
// Route: Cody current clearing (49.3,66,-83.5) EAST ~20 blocks to
// (69,67,-83). Ground profile (probe-gate-scan.js): feet-level ground
// rises 65 -> 67 along the line (at least one 1-block climb, x=52->53),
// through open grass. Leg 1 uses prims.gotoNear (pathfinder-first,
// walk-only Movements, manual-helm fallback — the exact trial stack).
// Leg 2 returns with prims.walkTo (manual helm alone, jumps on stall).
module.exports = {
  meta: { name: "gate-walk", stage: "S1", summary: "locomotion gate diagnostic" },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const fmt = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
    const start = bot.entity.position.clone();
    const r1 = await prims.gotoNear(bot, 69, 67, -83, 1.5, 75000);
    const mid = bot.entity.position.clone();
    const r2 = await prims.walkTo(bot, start.x, start.y, start.z, 1.5, 75000);
    const end = bot.entity.position.clone();
    return {
      done: true,
      gate: {
        start: fmt(start),
        gotoNear: r1,
        mid: fmt(mid),
        walkTo: r2,
        end: fmt(end),
        outDistXZ: +Math.hypot(mid.x - start.x, mid.z - start.z).toFixed(2),
        climbY: +(mid.y - start.y).toFixed(2),
      },
    };
  },
};
