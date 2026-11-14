"use strict";
// GATE-WALK-6 — diagnostic skill, NOT curriculum. Gate 0 re-run 5
// (ledger gate "locomotion-0-rerun-4"), after gate-walk-5's FAIL
// (ledger gate "locomotion-0-rerun-3") and the traverse-verification
// FAIL that narrowed the wall (ledger kind "traverse-verify",
// traverse-result-g131742.json). Written by the operator (substrate
// verification), never promoted, never in active.json.
//
// WHAT THE LAST TWO RUNS ESTABLISHED: corridor-keeping works —
// gate-walk-5's waypointed legs contained the failure to the leg
// that failed (worst z-drift 1.67, inside the corridor) instead of
// wandering off-line. The wall is the frozen-fall correction-stream
// wedge at a clean +1 face: traverse-verify's fresh body walked the
// line at full speed for 2.2 blocks and froze at the FIRST +1 (the
// x52 face) for the full 25 s of both attempts — onGround false,
// exact-integer y, zero net motion. Every helm v3.3 recovery was
// either onGround-GATED (momentum step-up, guarded probe — never
// eligible while the stream withholds ground contact) or too slow
// (backoff needs a 10 s stall inside a 25 s leg). Cody gained this
// same step in gate-walk-5, so the wedge's grip is a draw, not a
// constant. The correction stream is a TERRAIN symptom of this
// build (standing lesson) — design against the stream, not the
// step.
//
// THE FIX (this skill + helm v3.4): same waypointed corridor legs
// as gate-walk-5 (waypoints 53.5/58.5/63.5/69.5 at z=-83.5, corridor
// |z+83.5| <= 2 enforced per leg, ONE declared dig-step retry per
// leg, prims.walkTo only — no pathfinder), with two changes:
//  (1) helm v3.4's WEDGE-RELEASE PROTOCOL is the first recovery:
//      displacement-keyed (forward intent held + net displacement
//      < 0.3 blocks over a 3 s window), never onGround-gated —
//      release-first cycle (backward pulse 0.5 s, settle, then a
//      forward+jump HOLD 1.0 s), up to 3 cycles, then one 1.5 s
//      long backoff and a final cycle. Every cycle is logged into
//      each attempt's record (wedge.cycles / wedge.log) so the gate
//      evidence shows the protocol working or failing.
//  (2) LEG WINDOWS ARE 75 s: the stream releases on its own
//      schedule, and the release protocol plus fallbacks must fit
//      inside the leg. (The 25 s leg was shorter than the wedge's
//      observed grip.)
// The route is gated ONLY after traverse-verify-2 body-verifies it
// end to end with this same helm (standing rule: no gating on an
// unverified route).
//
// HELM ALLOWANCE (declared, same as gate-walk-4/5): the dig-step is
// ARMED for the whole gate (prims.setDigStep(true)); the helm may
// dig one block out of a +2 step or the leaf litter capping a +1,
// per its own declared rules, and every use is counted per leg via
// prims.digStepStats() deltas and in the result. Dig counts are
// ATTEMPTS (phantom-dig finding); locomotion is judged by
// displacement only. Extending the dig-step to clean +1s is the
// OWNER's decision and is NOT taken here.
//
// PASS CRITERIA (all required): every eastbound leg ok (waypoint
// reached within range, corridor intact at leg end), and every
// westbound return leg ok, ending within 1.6 blocks XZ of the start.
module.exports = {
  meta: { name: "gate-walk-6", stage: "S1", summary: "locomotion gate 0 re-run 5: waypointed corridor legs on the traverse-verified z=-84 line, helm v3.4 wedge-release, 75 s legs, dig-step declared" },
  run: async (ctx) => {
    const { bot, prims, log } = ctx;
    const fmt = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
    const LINE_Z = -83.5; // centre of the surveyed z=-84 row
    const CORR = 2.0;     // corridor half-width: |z - LINE_Z| must stay <= 2
    const TOPS = { 53: 66, 58: 67, 63: 67, 69: 64 }; // surveyed ground tops
    const EAST = [53.5, 58.5, 63.5, 69.5].map((x) => ({ x, y: TOPS[Math.floor(x)] + 1, z: LINE_Z }));
    const HOME = { x: 49.5, y: 66, z: LINE_Z };
    const WEST = EAST.slice(0, 3).reverse().concat([HOME]);
    const LEG_MS = 75000, RECENTRE_MS = 12000;
    const BUDGET_MS = 1440000; // 24 min overall (8 legs x retry worst case)
    const t0 = Date.now();
    const legs = [];
    let failed = false;

    const digUses = () => prims.digStepStats().uses;

    async function attempt(wp, ms) {
      const from = bot.entity.position.clone();
      const d0 = Math.hypot(wp.x - from.x, wp.z - from.z);
      const dig0 = digUses();
      const a0 = Date.now();
      const r = await prims.walkTo(bot, wp.x, wp.y, wp.z, 1.2, ms);
      const to = bot.entity.position.clone();
      const d1 = Math.hypot(wp.x - to.x, wp.z - to.z);
      return {
        ok: !!r.ok, error: r.ok ? null : (r.error || "walkTo failed"),
        ms: Date.now() - a0, from: fmt(from), to: fmt(to),
        distBeforeXZ: +d0.toFixed(2), distAfterXZ: +d1.toFixed(2),
        progressXZ: +(d0 - d1).toFixed(2),
        zDrift: +(to.z - LINE_Z).toFixed(2),
        corridorBreach: Math.abs(to.z - LINE_Z) > CORR,
        digUses: digUses() - dig0,
        wedge: r.wedge ? { cycles: r.wedge.cycles, log: r.wedge.log } : null,
      };
    }

    async function leg(label, wp) {
      const rec = { label, target: { x: wp.x, y: wp.y, z: wp.z }, attempts: [] };
      let a = await attempt(wp, LEG_MS);
      rec.attempts.push(a);
      if (!(a.ok && !a.corridorBreach)) {
        // ONE declared dig-step retry (same discipline as gate-walk-4/5).
        if (a.corridorBreach) {
          const p = bot.entity.position;
          const rc = await attempt({ x: p.x, y: wp.y, z: LINE_Z }, RECENTRE_MS);
          rec.recentre = rc;
        }
        const b = await attempt(wp, LEG_MS);
        rec.attempts.push(b);
        a = b;
      }
      rec.ok = !!(a.ok && !a.corridorBreach);
      legs.push(rec);
      if (log) log("gate6 leg", label, "ok=" + rec.ok, "attempts=" + rec.attempts.length, "end=" + JSON.stringify(a.to), "digUses=" + rec.attempts.reduce((s, t) => s + t.digUses, 0), "wedgeCycles=" + rec.attempts.reduce((s, t) => s + ((t.wedge && t.wedge.cycles) || 0), 0));
      if (!rec.ok) failed = true;
      return rec.ok;
    }

    prims.setDigStep(true);
    try {
      const start = bot.entity.position.clone();
      const onGroundAtStart = !!bot.entity.onGround;
      for (let i = 0; i < EAST.length && !failed; i++) {
        if (Date.now() - t0 > BUDGET_MS) { failed = true; break; }
        await leg("E" + (i + 1), EAST[i]);
      }
      const mid = bot.entity.position.clone();
      for (let i = 0; i < WEST.length && !failed; i++) {
        if (Date.now() - t0 > BUDGET_MS) { failed = true; break; }
        await leg("W" + (i + 1), WEST[i]);
      }
      const end = bot.entity.position.clone();
      const dig = prims.digStepStats();
      const homeDist = Math.hypot(end.x - start.x, end.z - start.z);
      const pass = !failed && homeDist <= 1.6;
      return {
        done: true,
        gate6: {
          helm: "v3.4 (wedge-release)",
          legMs: LEG_MS,
          route: { from: { x: 49, z: -84 }, to: { x: 69, z: -84 }, corridor: { lineZ: LINE_Z, halfWidth: CORR }, profile: [65, 65, 64, 65, 66, 66, 67, 67, 67, 67, 67, 67, 67, 67, 67, 67, 66, 64, 64, 64, 65], maxUpStep: 1 },
          start: fmt(start),
          onGroundAtStart,
          legs,
          mid: fmt(mid),
          end: fmt(end),
          outDistXZ: +Math.hypot(mid.x - start.x, mid.z - start.z).toFixed(2),
          homeDistXZ: +homeDist.toFixed(2),
          elapsedMs: Date.now() - t0,
          digStep: { uses: dig.uses, log: dig.log },
          pass,
        },
      };
    } finally {
      prims.setDigStep(false);
    }
  },
};
