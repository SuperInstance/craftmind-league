"use strict";
// GATE-WALK-4 — diagnostic skill, NOT curriculum. Gate 0 re-run after
// the remedy (2026-11-07). Written by the operator (substrate
// verification), never promoted, never in active.json.
// ROUTE (surveyed on foot + block scan, gate-survey.js): the z=-84
// line, x49 -> x69. Ground tops x49..69:
// [65,65,64,65,66,66,67,67,67,67,67,67,67,67,67,67,66,64,64,64,65]
// — max up-step +1 (three +1 climbs: the gate keeps its stepped
// character), NO +2 wall (the old z=-83.5 route's freeze geometry is
// gone). Leaf litter sits on the flat plateau columns x54,55,56,58,
// 61,63 — flat litter is traversable; the dig-step allowance below
// covers a litter-capped step if one is met.
// HELM ALLOWANCE (declared): the dig-step is ARMED for this gate — if
// a leg still faces a +2 or a litter-capped +1, the helm may dig ONE
// block per step; every use is counted in the result's digStep stats
// so the gate never silently becomes a digging test. Route start
// x=49 keeps any dig outside the spawn-protection square (|dx|>=17
// from Cody's spawn point (32,70,-96)).
// Legs mirror gate-walk v1 for comparability: leg 1 prims.gotoNear
// (the trial stack), leg 2 prims.walkTo (helm alone) back to start.
module.exports = {
  meta: { name: "gate-walk-4", stage: "S1", summary: "locomotion gate 0 re-run: surveyed +1-max route, dig-step declared" },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const fmt = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
    prims.setDigStep(true);
    const start = bot.entity.position.clone();
    const onGroundAtStart = !!bot.entity.onGround;
    const r1 = await prims.gotoNear(bot, 69, 66, -84, 1.5, 90000);
    const mid = bot.entity.position.clone();
    const r2 = await prims.walkTo(bot, start.x, start.y, start.z, 1.5, 90000);
    const end = bot.entity.position.clone();
    const dig = prims.digStepStats();
    prims.setDigStep(false);
    return {
      done: true,
      gate4: {
        route: { from: { x: 49, z: -84 }, to: { x: 69, z: -84 }, profile: [65, 65, 64, 65, 66, 66, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 66, 64, 64, 64, 65], maxUpStep: 1 },
        start: fmt(start),
        onGroundAtStart,
        gotoNear: r1,
        mid: fmt(mid),
        walkTo: r2,
        end: fmt(end),
        outDistXZ: +Math.hypot(mid.x - start.x, mid.z - start.z).toFixed(2),
        climbY: +(mid.y - start.y).toFixed(2),
        digStep: { uses: dig.uses, log: dig.log },
      },
    };
  },
};
