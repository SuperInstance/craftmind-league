'use strict';
// GATE-WALK-2 v2 — diagnostic skill, NOT curriculum. Terrain-adaptive
// re-run of locomotion gate 0 after a body reset: scans walkable
// ground (leaf canopy skipped) along the four cardinal lines from
// Cody's current position — retrying while chunks load — picks a
// ~20-block line containing at least one +1 upward step (no step worse
// than +2), walks it with prims.gotoNear, returns with prims.walkTo.
module.exports = {
  meta: { name: 'gate-walk-2', stage: 'S1', summary: 'locomotion gate retest' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { Vec3 } = prims;
    const fmt = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
    const start = bot.entity.position.clone();
    const groundWalk = (x, z) => {
      const top = Math.min(250, Math.floor(bot.entity.position.y) + 24);
      for (let y = top; y > bot.entity.position.y - 40; y--) {
        const b = bot.blockAt(new Vec3(x, y, z));
        if (b && b.boundingBox === 'block' && !/_leaves$/.test(b.name)) return y;
      }
      return null;
    };
    const dirs = [
      { name: 'E', dx: 1, dz: 0 }, { name: 'W', dx: -1, dz: 0 },
      { name: 'S', dx: 0, dz: 1 }, { name: 'N', dx: 0, dz: -1 },
    ];
    let best = null;
    for (let attempt = 0; attempt < 6 && !best; attempt++) {
      if (attempt > 0) await prims.sleep(8000);
      const sx = Math.floor(bot.entity.position.x), sz = Math.floor(bot.entity.position.z);
      for (const d of dirs) {
        const prof = [];
        for (let i = 0; i <= 20; i++) prof.push(groundWalk(sx + d.dx * i, sz + d.dz * i));
        if (prof.some((v) => v === null)) continue;
        let maxStep = -99, hasClimb = false;
        for (let i = 1; i < prof.length; i++) {
          const s = prof[i] - prof[i - 1];
          if (s > maxStep) maxStep = s;
          if (s === 1) hasClimb = true;
        }
        const score = (hasClimb ? 2 : 0) - (maxStep > 2 ? 5 : 0) + (prof[20] - prof[0]);
        if (!best || score > best.score) best = { dir: d, prof, maxStep, hasClimb, score, sx, sz };
      }
    }
    if (!best) return { done: true, gate2: { error: 'no scannable line after retries', start: fmt(start), onGround: !!bot.entity.onGround } };
    const tx = best.sx + best.dir.dx * 20, tz = best.sz + best.dir.dz * 20;
    const ty = best.prof[20] + 1;
    const r1 = await prims.gotoNear(bot, tx, ty, tz, 1.5, 90000);
    const mid = bot.entity.position.clone();
    const r2 = await prims.walkTo(bot, start.x, start.y, start.z, 1.5, 90000);
    const end = bot.entity.position.clone();
    return {
      done: true,
      gate2: {
        start: fmt(start), onGroundAtStart: !!bot.entity.onGround,
        dir: best.dir.name, profile: best.prof, maxStep: best.maxStep, hasClimb: best.hasClimb,
        target: { x: tx, y: ty, z: tz },
        gotoNear: r1, mid: fmt(mid), walkTo: r2, end: fmt(end),
        outDistXZ: +Math.hypot(mid.x - start.x, mid.z - start.z).toFixed(2),
      },
    };
  },
};
