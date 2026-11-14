"use strict";
// FW-NAV-PROOF v2 — harness proof skill, NOT curriculum. Gate 0 as
// RE-SCOPED (ledger gate-0-rescope-fw-nav, 2026-11-07): locomotion
// proven through the resident Craftmind framework's OWN navigation
// (bot.pathfinder.setGoal(new goals.GoalNear(...)), framework
// Movements from bot.js) — the resident wander stack. NO helm
// walkTo, NO prims.gotoNear, NO teleports, NO opped client.
//
// ATTEMPT 2 (pre-declared in ledger
// fw-nav-proof-attempt-1-and-retry-declaration): identical course,
// waypoints, judging and timeouts as attempt 1. The ONLY change is
// a harness SETTLE BEAT before the course and between legs (wait
// for onGround + ~zero horizontal velocity sustained 1.2 s, 8 s
// timeout, outcome recorded per leg) — the traverse line's own fix
// for the state-inheritance confound attempt 1 exhibited (leg 1
// closed at sprint speed, mid-settle at a column edge; leg 2's
// freeze began from that inherited state).
//
// Course (survey4 rows z=-83; feet = top + 1):
//   L1 start -> WP1 (51.5,66,-82.5): clean +1 at x46->47.
//   L2 WP1 -> WP2 (58.5,68,-82.5): clean +1s at x52->53, x53->54;
//      plateau feet 68; on-surface litter at x55,56,57.
//   L3 WP2 -> WP3 (64.5,68,-82.5): flat 68; litter x59,60,62.
//   L4 WP3 -> WP4 (69.5,67,-82.5): one -1 at x65.
// Total ~24 blocks, 4 waypoints, three +1 step-ups.
// Judging: displacement from bot.entity.position polled at 400 ms
// (state feed independently samples the same positions). Leg PASS
// = within 1.9 XZ and 1.7 Y of the waypoint; leg FAIL = 120 s
// timeout or damage (health < 20); a failed leg ends the course.
const fs = require("fs");
const path = require("path");

const RESULT_PATH = path.join(__dirname, "fw-nav-proof-result.json");
const RUN_ID = process.env.FW_PROOF_RUN_ID || "unset";

const WAYPOINTS = [
  { name: "WP1", x: 51.5, y: 66, z: -82.5 },
  { name: "WP2", x: 58.5, y: 68, z: -82.5 },
  { name: "WP3", x: 64.5, y: 68, z: -82.5 },
  { name: "WP4", x: 69.5, y: 67, z: -82.5 },
];
const LEG_TIMEOUT_MS = 120000;
const ARRIVE_DXZ = 1.9;
const ARRIVE_DY = 1.7;
const SETTLE_TIMEOUT_MS = 8000;
const SETTLE_HOLD_MS = 1200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function posOf(bot) {
  const p = bot.entity.position;
  return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) };
}
function writeResult(obj) {
  const tmp = RESULT_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 1));
  fs.renameSync(tmp, RESULT_PATH);
}

// Settle beat: grounded and ~still, sustained. Returns the outcome
// either way (a timeout is recorded, never hidden).
async function settle(bot) {
  const t0 = Date.now();
  let stillSince = null;
  let last = null;
  while (Date.now() - t0 < SETTLE_TIMEOUT_MS) {
    const e = bot.entity;
    if (!e) break;
    const v = e.velocity;
    const speedXZ = v ? Math.hypot(v.x, v.z) : 0;
    last = { onGround: !!e.onGround, speedXZ: +speedXZ.toFixed(3), pos: posOf(bot) };
    if (e.onGround && speedXZ < 0.05) {
      if (stillSince === null) stillSince = Date.now();
      if (Date.now() - stillSince >= SETTLE_HOLD_MS) {
        return { settled: true, waitedSec: +((Date.now() - t0) / 1000).toFixed(1), at: last };
      }
    } else {
      stillSince = null;
    }
    await sleep(200);
  }
  return { settled: false, waitedSec: +((Date.now() - t0) / 1000).toFixed(1), at: last };
}

module.exports = {
  meta: { name: "FW-NAV-PROOF", stage: "PROOF", summary: "Gate 0 re-scoped locomotion proof v2 (settle beat), framework pathfinder GoalNear, displacement-judged" },
  run: async (ctx) => {
    const { bot, goals, log } = ctx;
    try {
      const prev = JSON.parse(fs.readFileSync(RESULT_PATH, "utf8"));
      if (prev && prev.runId === RUN_ID && prev.status !== "running") {
        return { ok: true, skipped: true, runId: RUN_ID };
      }
    } catch {}

    const out = {
      runId: RUN_ID,
      attempt: 2,
      startedAt: new Date().toISOString(),
      status: "running",
      stack: "framework: bot.pathfinder.setGoal(goals.GoalNear) with bot.js Movements; settle beat before course and between legs; no helm, no gotoNear, no teleports",
      startPos: posOf(bot),
      courseSettle: null,
      legs: [],
      verdict: null,
    };
    writeResult(out);
    log("FW-NAV-PROOF v2", RUN_ID, "starting at", JSON.stringify(out.startPos));

    out.courseSettle = await settle(bot);
    writeResult(out);
    log("FW-NAV-PROOF course settle", JSON.stringify(out.courseSettle));

    let verdict = "PASS";
    for (const wp of WAYPOINTS) {
      const legStart = posOf(bot);
      const t0 = Date.now();
      bot.pathfinder.setGoal(new goals.GoalNear(wp.x, wp.y, wp.z, 1.5));
      let minD = Infinity;
      let arrived = false;
      let damaged = false;
      let endPos = legStart;
      while (Date.now() - t0 < LEG_TIMEOUT_MS) {
        await sleep(400);
        if (!bot.entity) break;
        endPos = posOf(bot);
        const dxz = Math.hypot(endPos.x - wp.x, endPos.z - wp.z);
        const dy = Math.abs(endPos.y - wp.y);
        if (dxz < minD) minD = dxz;
        if (bot.health !== undefined && bot.health < 20) { damaged = true; break; }
        if (dxz <= ARRIVE_DXZ && dy <= ARRIVE_DY) { arrived = true; break; }
      }
      const disp = Math.hypot(endPos.x - legStart.x, endPos.z - legStart.z);
      const leg = {
        to: wp.name, waypoint: { x: wp.x, y: wp.y, z: wp.z },
        startPos: legStart, endPos,
        displacementXZ: +disp.toFixed(2),
        minDistToWaypoint: +minD.toFixed(2),
        durationSec: +((Date.now() - t0) / 1000).toFixed(1),
        arrived, damaged,
        settleAfter: null,
        verdict: arrived ? "PASS" : "FAIL",
      };
      out.legs.push(leg);
      writeResult(out);
      log("FW-NAV-PROOF leg", wp.name, JSON.stringify(leg));
      if (!arrived) { verdict = "FAIL"; break; }
      leg.settleAfter = await settle(bot);
      writeResult(out);
    }

    try { bot.pathfinder.setGoal(null); } catch {}
    out.status = "complete";
    out.verdict = verdict;
    out.endedAt = new Date().toISOString();
    out.endPos = posOf(bot);
    out.totalDisplacementXZ = +out.legs.reduce((a, l) => a + l.displacementXZ, 0).toFixed(2);
    writeResult(out);
    log("FW-NAV-PROOF v2 verdict", verdict, "totalXZ", out.totalDisplacementXZ);
    return { ok: verdict === "PASS", verdict, legs: out.legs.length, totalDisplacementXZ: out.totalDisplacementXZ };
  },
};
