'use strict';
/**
 * safety-check.js — THE ONE SAFETY READ (day-14 repair;
 * pulse/SAFETY-READING-PATH-REPAIR-20261109.md).
 *
 * WHY: day 13, incident H1. The floor parked 1.3 s after Cody's
 * third death (06:09:24.272Z, trigger deaths_today>=max_deaths) and
 * the driver's 3-death abort predicate was wired — but both checks
 * lived only at the model-cycle head, and the body was inside the
 * reflex layer's flee/burrow sequence (an 11-hop flee, then a
 * burrow hold), which read NEITHER the lease nor the death count.
 * Deaths 3–9 fired inside the one stuck cycle; the lane stopped
 * the driver by hand, six deaths past the limit. The death
 * counter's WRITING path was proven on day 4 (lib/deaths.js); its
 * READING path on the reflex layer did not exist. This module is
 * that reading path — and it is shared: the driver's start check,
 * cycle head and pre-exec check AND the reflex layer (every hop
 * boundary, every burrow stage) all read through snapshot(), so
 * the layers cannot disagree silently. There is only one read.
 *
 * SOURCES OF TRUTH (named; both are files, both already exist):
 *   PARK / LEASE — the floor's state files: <FLOOR_STATE_DIR>/
 *     lease.json (+ release.json), read through floor/gate.js via
 *     THIS DIRECTORY's gate-client.js — the same read the day-11
 *     gate wiring has used all along (gate.init() is the driver's
 *     to call, before safety.init). Any gate refusal (parked,
 *     lease-revoked, lease-expired, lease-absent, wrong-driver) is
 *     a stop with trigger 'park'; the gate's own reason rides in
 *     the verdict unaltered, so the operator reads the truth.
 *   DEATHS — the run's own trace file, counted by
 *     pulse/lib/deaths.js countTraceDeaths — the same counter the
 *     floor's COUNT_DEATH derives from and the driver's spawn seed
 *     resumes from — judged by the same shouldAbort. The driver's
 *     in-memory count is passed in and the verdict uses the GREATER
 *     of the two, so the shared read is never weaker than either
 *     check it replaces.
 *
 * PRECEDENCE: park before death-count. The floor's stop is the
 * supervisor's word — and on day 13 the park WAS the count's
 * consequence (it fired 1.3 s after death 3), so naming it names
 * the cause's instrument either way. The verdict always carries
 * the death count alongside, so nothing is hidden by the choice.
 *
 * COST: two file reads + a count per snapshot. No model call, no
 * network. Measured against the day-13 trace (186,235 B) in the
 * fixture (pulse/day14/test-safety-reflex.js): see the filing.
 */
const gate = require('./gate-client.js');
const { countTraceDeaths, shouldAbort } = require('/home/caseydigennaro/craftmind-league/pulse/lib/deaths.js');

let cfg = null; // { tracePath, deathLimit }

function init(opts) {
  cfg = {
    tracePath: (opts && opts.tracePath) || null,
    deathLimit: opts && opts.deathLimit != null ? opts.deathLimit : 3,
  };
  return cfg;
}

/**
 * snapshot(localDeaths) -> { stop, trigger, gateReason, deaths, ts_ms }
 *   stop:       boolean — the body must receive no further commands.
 *   trigger:    'park' | 'death-count' | null.
 *   gateReason: floor/gate.js's own reason when trigger is 'park'.
 *   deaths:     the greater of the trace count and the caller's
 *               in-memory count.
 */
function snapshot(localDeaths) {
  const g = gate.check('__safety__');
  const fromTrace = cfg && cfg.tracePath ? countTraceDeaths(cfg.tracePath) : 0;
  const deaths = Math.max(fromTrace, localDeaths || 0);
  if (!g.ok) return { stop: true, trigger: 'park', gateReason: g.reason, deaths, ts_ms: Date.now() };
  if (cfg && shouldAbort(deaths, cfg.deathLimit)) return { stop: true, trigger: 'death-count', gateReason: null, deaths, ts_ms: Date.now() };
  return { stop: false, trigger: null, gateReason: null, deaths, ts_ms: Date.now() };
}

module.exports = { init, snapshot };
