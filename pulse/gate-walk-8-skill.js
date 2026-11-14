"use strict";
// GATE-WALK-8 — diagnostic skill, NOT curriculum. Gate 0 re-run 6
// (ledger gate "locomotion-0-rerun-6"), with helm v3.6 and the
// settle beat. Written by the operator (substrate verification),
// never promoted, never in active.json.
//
// HISTORY, CORRECTED: gate-walk-7 was written in anticipation
// that traverse-verify-3 (helm v3.5) would body-verify the route;
// it did NOT — verify-3 failed at leg E2 and gate re-run 6 stood
// down. Gate-walk-7 was never run. This skill (gate-walk-8) is
// its successor for the same re-run, gated on traverse-verify-4
// body-verifying the route end to end with helm v3.6 (standing
// rule: no gating on an unverified route).
//
// WHAT THE VERIFIES ESTABLISHED: corridor-keeping works —
// waypointed legs contain a failure to the leg that failed
// instead of wandering off-line. The wall narrowed across three
// verifies to one shape: the frozen-fall correction-stream wedge
// at the close-spaced +1 pair (x52, x54) on the z=-84 line.
// Verify-1 (v3.3): every recovery onGround-gated or too slow.
// Verify-2 (v3.4): the wedge-release freed E1 in one cycle; at
// E2 the backoff's limit oscillation masked the wedge trigger
// for ~65 s per attempt, and the jump apex landed short of the
// face. Verify-3 (v3.5): arbiter + progress trigger + face-keyed
// jumps all fired as designed, and the freeze moved UP — the
// body froze MID-AIR at the litter-capped step top (feet ~68.1),
// cycles 1-3 bobbed, the long backoff slid the body 4.4 blocks
// west surrendering both steps, the final cycle's best run-up
// was judged exhausted 0.75 short of the anchor, and dig then
// alternated with backoff (digUses 0) starving the probe.
//
// HELM v3.6 (this skill + prims): (A) HOLD-AND-TAP at high
// freezes — when the body holds >= +0.9 of gained altitude over
// the walk's standing level, the wedge's backoff components are
// replaced (no back pulse, no long backoff; an extended hold
// and short forward taps), so a release never spends bought
// height; every cycle logs releaseMode + altDelta. (B) wedge
// exhaustion judged on BEST-IN-SEQUENCE, with ONE extension
// cycle for a final cycle that improved the episode's best.
// (C) the SETTLE BEAT: a leg does not close, and the next does
// not open, until the body is grounded and stable for ~1 s (8 s
// timeout records a non-settle) — verify-3's E2 began inside
// E1's closing jump arc; settle outcomes are recorded per leg.
// (D) a DIG-GRANT CAP: at most one dig grant per stall episode
// unless a dig actually executed under dig's last ownership.
//
// STRUCTURE (unchanged from gate-walk-5/6/7): waypointed corridor
// legs (waypoints 53.5/58.5/63.5/69.5 at z=-83.5, corridor
// |z+83.5| <= 2 enforced per leg, ONE declared dig-step retry
// per leg, prims.walkTo only — no pathfinder, 75 s legs). Every
// attempt records its wedge log AND arbiter log.
//
// HELM ALLOWANCE (declared, same as gate-walk-4/5): the dig-step
// is ARMED for the whole gate (prims.setDigStep(true)); the helm
// may dig one block out of a +2 step or the leaf litter capping a
// +1, per its own declared rules, and every use is counted per
// leg via prims.digStepStats() deltas and in the result. Dig
// counts are ATTEMPTS (phantom-dig finding); locomotion is
// judged by displacement only. Extending the dig-step to clean
// +1s is the OWNER's decision and is NOT taken here.
//
// PASS CRITERIA (all required): every eastbound leg ok (waypoint
// reached within range, corridor intact at leg end), and every
// westbound return leg ok, ending within 1.6 blocks XZ of the
// start.
module.exports = {
  meta: { name: "gate-walk-8", stage: "S1", summary: "locomotion gate 0 re-run 6: waypointed corridor legs on the traverse-verified z=-84 line, helm v3.6 (hold-and-tap, best-in-sequence, dig cap) + settle beat, 75 s legs, dig-step declared" },
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
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
        arbiter: r.arbiter ? { grants: r.arbiter.grants, log: r.arbiter.log } : null,
      };
    }

    // ── SETTLE BEAT (helm v3.6 harness rule, declared 2026-11-07) ──
    // A leg does not close — and the next does not open — until the
    // body is grounded and stable (onGround, |velocity| ~ 0) for a
    // ~1 s beat, or an 8 s timeout records that it never settled.
    // Traverse-verify-3's leg E2 began inside E1's closing jump
    // arc; no leg may begin inside the previous leg's arc. Settle
    // outcomes are recorded on the leg records and in the result.
    async function settleBeat(tag) {
      const s0 = Date.now();
      let stableSince = null, settled = false;
      while (Date.now() - s0 < 8000) {
        const e = bot.entity, v = e.velocity;
        if (e.onGround && Math.hypot(v.x, v.z) < 0.03 && Math.abs(v.y) < 0.15) {
          if (stableSince === null) stableSince = Date.now();
          if (Date.now() - stableSince >= 1000) { settled = true; break; }
        } else stableSince = null;
        await sleep(100);
      }
      const rec = { tag, settled, ms: Date.now() - s0, at: fmt(bot.entity.position), onGround: !!bot.entity.onGround };
      if (log) log("gate8 settle", JSON.stringify(rec));
      return rec;
    }

    async function leg(label, wp) {
      const rec = { label, target: { x: wp.x, y: wp.y, z: wp.z }, attempts: [] };
      rec.settlePre = await settleBeat(label + ":pre");
      let a = await attempt(wp, LEG_MS);
      rec.attempts.push(a);
      if (!(a.ok && !a.corridorBreach)) {
        // ONE declared dig-step retry (same discipline as gate-walk-4/5).
        rec.settleRetry = await settleBeat(label + ":retry");
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
      if (log) log("gate8 leg", label, "ok=" + rec.ok, "attempts=" + rec.attempts.length, "end=" + JSON.stringify(a.to), "digUses=" + rec.attempts.reduce((s, t) => s + t.digUses, 0), "wedgeCycles=" + rec.attempts.reduce((s, t) => s + ((t.wedge && t.wedge.cycles) || 0), 0));
      if (!rec.ok) failed = true;
      return rec.ok;
    }

    prims.setDigStep(true);
    try {
      const startSettle = await settleBeat("start");
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
      const endSettle = await settleBeat("end");
      const end = bot.entity.position.clone();
      const dig = prims.digStepStats();
      const homeDist = Math.hypot(end.x - start.x, end.z - start.z);
      const pass = !failed && homeDist <= 1.6;
      return {
        done: true,
        gate8: {
          helm: "v3.6 (arbiter + hold-and-tap + best-in-sequence + dig cap; settle beat)",
          startSettle,
          endSettle,
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
