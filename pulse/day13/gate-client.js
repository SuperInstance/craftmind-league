'use strict';
/**
 * gate-client.js — the driver-side half of the floor's command gate
 * (floor gap #1: "wiring G into the body runtime"). The day-11 driver
 * copy (direct-drive-day11.js, this directory) requires this module;
 * the day-10 original does not, and is untouched.
 *
 * What it does, and nothing else:
 *   - heartbeat: while the driver lives, it writes heartbeat.json
 *     {ts_ms, driver} into the floor state dir every HEARTBEAT_MS.
 *     The floor renews the lease while the heartbeat is fresh; a dead
 *     driver stops renewing, the lease expires, and the gate fails
 *     closed (floor.js + gate.js semantics, unchanged).
 *   - check(cmd): asks floor/gate.js whether a command may execute
 *     under the current lease. The driver calls it at three sites:
 *     driver start (refuse-start), cycle head, and immediately before
 *     execCmd. A rejection is a PARK: the driver stops within the
 *     cycle and issues no further commands — including no close-exit
 *     movement, which is itself a command.
 *
 * Configuration is by environment, set by the launch script:
 *   FLOOR_STATE_DIR  — the floor's state dir (lease.json lives there)
 *   FLOOR_DRIVER_ID  — must equal the contract's driver_id
 * If FLOOR_STATE_DIR is unset the gate is DISABLED and every check
 * passes: the copy then behaves exactly as the day-10 driver. A live
 * day-11 launch MUST set it (the charter's launch gates check for
 * the lease the floor issued, which is the real proof it is on).
 *
 * CLI (fixture use; the same code paths the driver calls):
 *   node gate-client.js simulate <stateDir> <driverId> <cycles>
 *        <intervalMs> <resultsPath>
 *   Simulates the driver's loop shape: start check, then per cycle a
 *   heartbeat-backed gate check before "executing" cmd-N. Exit 3 =
 *   start refused; exit 0 = completed, or parked (GATE-PARK printed
 *   with the cycle and the gate's reason).
 */
const fs = require('fs');
const path = require('path');
const { createGate } = require('/home/caseydigennaro/craftmind-league/floor/gate.js');

const HEARTBEAT_MS = 1000;

let cfg = null; // {stateDir, driverId, gate, hbTimer}

function init(env = process.env) {
  const stateDir = env.FLOOR_STATE_DIR || null;
  const driverId = env.FLOOR_DRIVER_ID || 'cody-driver';
  cfg = { stateDir, driverId, gate: stateDir ? createGate(stateDir) : null, hbTimer: null };
  return cfg;
}
function enabled() { return !!(cfg && cfg.gate); }
function startHeartbeat() {
  if (!enabled() || cfg.hbTimer) return;
  const file = path.join(cfg.stateDir, 'heartbeat.json');
  const beat = () => {
    try { fs.writeFileSync(file, JSON.stringify({ ts_ms: Date.now(), driver: cfg.driverId })); } catch { /* floor parks on staleness; nothing to do */ }
  };
  beat();
  cfg.hbTimer = setInterval(beat, HEARTBEAT_MS);
  cfg.hbTimer.unref?.();
}
function stopHeartbeat() { if (cfg && cfg.hbTimer) { clearInterval(cfg.hbTimer); cfg.hbTimer = null; } }
function check(cmd) {
  if (!enabled()) return { ok: true, disabled: true };
  return cfg.gate.exec(cfg.driverId, cmd || 'probe');
}

module.exports = { init, enabled, startHeartbeat, stopHeartbeat, check, HEARTBEAT_MS };

// ---------- fixture simulator (not used by the driver) ----------
if (require.main === module) {
  const [mode, stateDir, driverId, cyclesS, intervalS, resultsPath] = process.argv.slice(2);
  if (mode !== 'simulate' || !stateDir || !driverId || !cyclesS || !intervalS || !resultsPath) {
    console.error('usage: gate-client.js simulate <stateDir> <driverId> <cycles> <intervalMs> <resultsPath>');
    process.exit(2);
  }
  init({ FLOOR_STATE_DIR: stateDir, FLOOR_DRIVER_ID: driverId });
  startHeartbeat();
  const rec = (row) => fs.appendFileSync(resultsPath, JSON.stringify({ ts_ms: Date.now(), ...row }) + '\n');
  const start = check('__driver_start__');
  if (!start.ok) {
    rec({ phase: 'start', ok: false, reason: start.reason });
    console.log(`START-REFUSED reason=${start.reason}`);
    process.exit(3);
  }
  rec({ phase: 'start', ok: true });
  const cycles = parseInt(cyclesS, 10);
  const interval = parseInt(intervalS, 10);
  let i = 0;
  const timer = setInterval(() => {
    i++;
    const r = check('cmd-' + i);
    rec({ phase: 'cycle', cycle: i, ok: r.ok, reason: r.reason || null });
    if (!r.ok) {
      console.log(`GATE-PARK cycle=${i} reason=${r.reason}`);
      clearInterval(timer);
      process.exit(0);
    }
    console.log(`EXEC cycle=${i} ok`);
    if (i >= cycles) { clearInterval(timer); console.log(`COMPLETED cycles=${i}`); process.exit(0); }
  }, interval);
}
