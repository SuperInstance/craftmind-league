'use strict';
// GATE-WALK-3 — diagnostic skill, NOT curriculum. Final gate attempt on
// the corridor a bare bot demonstrably crossed tonight (spawn plateau
// NE to the east clearing, stepped ground with +1 climbs): target
// (57,68,-91), ~20 blocks from Cody's current ground. Outbound via
// prims.gotoNear (the trial stack); return via prims.walkTo only if
// the outbound leg finished with time to spare.
module.exports = {
  meta: { name: 'gate-walk-3', stage: 'S1', summary: 'locomotion gate, proven corridor' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const fmt = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
    const start = bot.entity.position.clone();
    const t0 = Date.now();
    const r1 = await prims.gotoNear(bot, 57, 68, -91, 1.5, 90000);
    const mid = bot.entity.position.clone();
    let r2 = null, end = mid;
    if (r1.ok && Date.now() - t0 < 100000) {
      r2 = await prims.walkTo(bot, start.x, start.y, start.z, 1.5, 60000);
      end = bot.entity.position.clone();
    }
    return {
      done: true,
      gate3: {
        start: fmt(start), onGroundAtStart: !!bot.entity.onGround,
        target: { x: 57, y: 68, z: -91 },
        gotoNear: r1, mid: fmt(mid), walkTo: r2, end: fmt(end),
        outDistXZ: +Math.hypot(mid.x - start.x, mid.z - start.z).toFixed(2),
      },
    };
  },
};
