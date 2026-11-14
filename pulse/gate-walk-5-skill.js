"use strict";
// GATE-WALK-5 — diagnostic skill, NOT curriculum. Gate 0 re-run after
// the gate-walk-4 route-keeping FAIL (2026-11-07, ledger kind "gate",
// gate "locomotion-0-rerun-2"). Written by the operator (substrate
// verification), never promoted, never in active.json.
//
// WHAT FAILED IN GATE-WALK-4 (class: infrastructure, trial stack x
// navigation): leg 1 was ONE 20-block prims.gotoNear to (69,66,-84).
// gotoNear commits to a pathfinder line; the line it chose left the
// surveyed z=-84 corridor by ~5 blocks, the stall watchdog handed the
// remainder to the helm on UNSURVEYED ground at (53.7,66,-78.7), and
// the helm's lateral step-search wandered there until the 82 s
// timeout: 6.42 blocks XZ displacement, wedged off-corridor. The
// helm-only return leg succeeded. The body was never the problem.
//
// THE FIX (this skill): the route is walked as SHORT WAYPOINTED LEGS
// pinned to the surveyed corridor — waypoints every ~5 blocks at the
// surveyed columns of the z=-84 line (block-scan profile from
// gate-survey.js, ground tops x49..69:
// [65,65,64,65,66,66,67,67,67,67,67,67,67,67,67,67,66,64,64,64,65],
// max up-step +1, no +2 wall). Every leg is driven by the manual helm
// (prims.walkTo) — the pathfinder is not used at all, so no
// off-corridor line can be committed to. CORRIDOR DISCIPLINE IS THE
// POINT: after every leg the body's z is checked against the corridor
// (line centre z=-83.5, tolerance +/-2 -> z must stay in
// [-85.5,-81.5]). A leg that stalls or breaches gets ONE declared
// dig-step retry (re-centre onto the line first if it breached, then
// re-attempt the same waypoint); a leg that fails its retry ends the
// gate as FAILED — the skill reports the leg rather than wandering
// off-corridor looking for a way around.
//
// HELM ALLOWANCE (declared, same as gate-walk-4): the dig-step is
// ARMED for the whole gate (prims.setDigStep(true)); the helm may dig
// one block out of a +2 step or the leaf litter capping a +1, per its
// own declared rules, and every use is counted per leg via
// prims.digStepStats() deltas and in the result. Dig counts are
// ATTEMPTS (phantom-dig finding: spawn protection can cancel a dig
// while the promise resolves); locomotion is judged by displacement
// only. The route sits outside the spawn-protection square, so digs
// here may take effect — inside the declared allowance.
//
// PASS CRITERIA (all required): every eastbound leg ok (waypoint
// reached within range, corridor intact at leg end), and every
// westbound return leg ok, ending within 1.6 blocks XZ of the start.
module.exports = {
  meta: { name: "gate-walk-5", stage: "S1", summary: "locomotion gate 0 re-run: waypointed corridor legs on the surveyed z=-84 line, dig-step declared" },
  run: async (ctx) => {
    const { bot, prims, log } = ctx;
    const fmt = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
    const LINE_Z = -83.5; // centre of the surveyed z=-84 row
    const CORR = 2.0;     // corridor half-width: |z - LINE_Z| must stay <= 2
    const TOPS = { 53: 66, 58: 67, 63: 67, 69: 64 }; // surveyed ground tops
    const EAST = [53.5, 58.5, 63.5, 69.5].map((x) => ({ x, y: TOPS[Math.floor(x)] + 1, z: LINE_Z }));
    const HOME = { x: 49.5, y: 66, z: LINE_Z };
    const WEST = EAST.slice(0, 3).reverse().concat([HOME]);
    const LEG_MS = 25000, RECENTRE_MS = 12000;
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
      };
    }

    async function leg(label, wp) {
      const rec = { label, target: { x: wp.x, y: wp.y, z: wp.z }, attempts: [] };
      let a = await attempt(wp, LEG_MS);
      rec.attempts.push(a);
      if (!(a.ok && !a.corridorBreach)) {
        // ONE declared dig-step retry. If the body left the corridor,
        // re-centre onto the line at its current longitude first; the
        // retry itself runs with the dig-step armed (it has been armed
        // since the skill started) — this is the retry the allowance
        // pays for. No second retry: a leg that fails here fails the
        // gate, on the record, instead of wandering.
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
      if (log) log("gate5 leg", label, "ok=" + rec.ok, "attempts=" + rec.attempts.length, "end=" + JSON.stringify(a.to), "digUses=" + rec.attempts.reduce((s, t) => s + t.digUses, 0));
      if (!rec.ok) failed = true;
      return rec.ok;
    }

    prims.setDigStep(true);
    try {
      const start = bot.entity.position.clone();
      const onGroundAtStart = !!bot.entity.onGround;
      for (let i = 0; i < EAST.length && !failed; i++) {
        if (Date.now() - t0 > 540000) { failed = true; break; }
        await leg("E" + (i + 1), EAST[i]);
      }
      const mid = bot.entity.position.clone();
      for (let i = 0; i < WEST.length && !failed; i++) {
        if (Date.now() - t0 > 540000) { failed = true; break; }
        await leg("W" + (i + 1), WEST[i]);
      }
      const end = bot.entity.position.clone();
      const dig = prims.digStepStats();
      const homeDist = Math.hypot(end.x - start.x, end.z - start.z);
      const pass = !failed && homeDist <= 1.6;
      return {
        done: true,
        gate5: {
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
