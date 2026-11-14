'use strict';
/**
 * test-gate-wiring.js — offline fixture battery for the day-11 gate
 * wiring (floor gap #1). Runs the REAL floor (floor/floor.js, stub op
 * channel) and drives it through the REAL gate-client the day-11
 * driver copy uses (this directory's gate-client.js, in its simulate
 * mode — the same init/heartbeat/check call pattern, at the same call
 * sites' shape: start check, then a gate check before every cycle's
 * command).
 *
 *   A  lease granted -> cycles flow (5/5 execute)
 *   B  park mid-run (STOP file -> floor PARK + revoke) -> the driver
 *      stops within one cycle of the park landing; no command
 *      executes after it
 *   C  lease expired (floor dead, TTL passed) -> driver refuses to
 *      start, zero cycles attempted
 *   D  no lease at all -> driver refuses to start (lease-absent)
 *
 * No world contact: the floor runs against fixture stores only.
 * Evidence (state dirs, floor logs, simulator results) is kept under
 * fixture-run/<phase>-<ts>/ beside this file.
 *
 * usage: node test-gate-wiring.js   (exit 0 iff 4/4 PASS)
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const HERE = __dirname;
const LEAGUE = '/home/caseydigennaro/craftmind-league';
const FLOOR_JS = path.join(LEAGUE, 'floor', 'floor.js');
const GATE_CLI = path.join(HERE, 'gate-client.js');
const NODE = process.execPath;
const DRIVER_ID = 'cody-driver';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function readJson(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } }
function readRows(f) {
  try { return fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)); } catch { return []; }
}
async function waitFor(fn, timeoutMs, label) {
  const t0 = Date.now();
  for (;;) {
    const v = fn();
    if (v) return v;
    if (Date.now() - t0 > timeoutMs) throw new Error('timeout waiting for ' + label);
    await sleep(100);
  }
}

function makeFixture(phase) {
  const dir = path.join(HERE, 'fixture-run', `${phase}-${Date.now()}`);
  const state = path.join(dir, 'state');
  fs.mkdirSync(state, { recursive: true });
  const trace = path.join(dir, 'trace.jsonl');
  fs.writeFileSync(trace, '');
  const snapshot = path.join(dir, 'snapshot.json');
  fs.writeFileSync(snapshot, JSON.stringify({ inventory: { cooked_porkchop: 32 }, ts: new Date().toISOString() }));
  const contract = {
    citizen: 'Cody', constitution: 'floor.v0',
    day_window: ['2026-11-09T00:00:00Z', '2026-11-12T00:00:00Z'],
    daylight: 'free', driver_id: DRIVER_ID,
    feed: { count: 8, item: 'cooked_porkchop', op: { item: 'cooked_porkchop', count: 32 } },
    max_deaths: 3, park_bay: null,
    sensor: { trace_path: trace },
    timers: { canary_s: 1, daylight_check_s: 240, heartbeat_lost_s: 4, lease_ttl_s: 3, poll_s: 1 },
  };
  const contractPath = path.join(dir, 'contract.json');
  fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2));
  const rig = { snapshot_path: snapshot, server_log_path: path.join(dir, 'server.log'), stub: { landDaylight: true, feedWorks: true } };
  const rigPath = path.join(dir, 'rig.json');
  fs.writeFileSync(rigPath, JSON.stringify(rig, null, 2));
  fs.writeFileSync(path.join(dir, 'server.log'), '');
  return { dir, state, contractPath, rigPath, leaseFile: path.join(state, 'lease.json') };
}

function spawnFloor(fx) {
  const logFd = fs.openSync(path.join(fx.dir, 'floor.log'), 'a');
  const proc = spawn(NODE, [FLOOR_JS, '--contract', fx.contractPath, '--state', fx.state, '--channel', 'stub', '--rig', fx.rigPath],
    { stdio: ['ignore', logFd, logFd] });
  return proc;
}
function runSim(state, cycles, intervalMs, resultsPath) {
  const proc = spawn(NODE, [GATE_CLI, 'simulate', state, DRIVER_ID, String(cycles), String(intervalMs), resultsPath],
    { stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '';
  proc.stdout.on('data', (d) => { out += d; });
  proc.stderr.on('data', (d) => { out += d; });
  const done = new Promise((resolve) => proc.on('exit', (code) => resolve({ code, out })));
  return { proc, done };
}
const leaseLive = (fx) => {
  const l = readJson(fx.leaseFile);
  return (l && !l.revoked && !l.parked && l.expires_ms > Date.now()) ? l : null;
};

const results = [];
function report(name, pass, detail) {
  results.push(pass);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name} — ${detail}`);
}

async function phaseA() {
  const fx = makeFixture('A');
  const floor = spawnFloor(fx);
  try {
    await waitFor(() => leaseLive(fx), 20000, 'A lease');
    const resultsPath = path.join(fx.dir, 'sim-results.jsonl');
    const sim = runSim(fx.state, 5, 200, resultsPath);
    const { code, out } = await sim.done;
    const rows = readRows(resultsPath);
    const cyc = rows.filter((r) => r.phase === 'cycle');
    const ok = code === 0 && out.includes('COMPLETED cycles=5') && cyc.length === 5 && cyc.every((r) => r.ok);
    report('A lease granted -> cycles flow', ok, `exit=${code}; cycle rows=${cyc.length}, all ok=${cyc.every((r) => r.ok)}; evidence=${fx.dir}`);
  } finally { try { floor.kill('SIGTERM'); } catch {} }
}

async function phaseB() {
  const fx = makeFixture('B');
  const floor = spawnFloor(fx);
  try {
    await waitFor(() => leaseLive(fx), 20000, 'B lease');
    const resultsPath = path.join(fx.dir, 'sim-results.jsonl');
    const sim = runSim(fx.state, 60, 250, resultsPath);
    await waitFor(() => readRows(resultsPath).filter((r) => r.phase === 'cycle' && r.ok).length >= 4, 10000, 'B cycles flowing');
    fs.writeFileSync(path.join(fx.state, 'STOP'), 'fixture phase B\n'); // human_stop -> floor PARK + revoke
    const { code, out } = await sim.done;
    const lease = readJson(fx.leaseFile);
    const rows = readRows(resultsPath);
    const cyc = rows.filter((r) => r.phase === 'cycle');
    const rej = cyc.find((r) => !r.ok);
    const okAfterPark = cyc.filter((r) => r.ok && lease && r.ts_ms > lease.park_ts_ms + 250); // +1 cycle interval of slack
    const ok = code === 0 && /GATE-PARK cycle=\d+ reason=(parked|lease-revoked)/.test(out)
      && !!rej && ['parked', 'lease-revoked'].includes(rej.reason)
      && lease && lease.parked === true && lease.revoked === true
      && cyc.filter((r) => r.ok).length < 60 && okAfterPark.length === 0;
    report('B park mid-run -> stops within one cycle', ok,
      `exit=${code}; executed=${cyc.filter((r) => r.ok).length}/60; rejection=${rej ? `cycle ${rej.cycle} reason=${rej.reason}` : 'NONE'}; ok-after-park(+1 cycle)=${okAfterPark.length}; lease parked=${lease && lease.parked} revoked=${lease && lease.revoked}; evidence=${fx.dir}`);
  } finally { try { floor.kill('SIGTERM'); } catch {} }
}

async function phaseC() {
  const fx = makeFixture('C');
  const floor = spawnFloor(fx);
  try {
    const lease = await waitFor(() => leaseLive(fx), 20000, 'C lease');
    floor.kill('SIGTERM');
    await waitFor(() => Date.now() > lease.expires_ms + 400, 15000, 'C lease expiry');
    const resultsPath = path.join(fx.dir, 'sim-results.jsonl');
    const sim = runSim(fx.state, 3, 200, resultsPath);
    const { code, out } = await sim.done;
    const rows = readRows(resultsPath);
    const cyc = rows.filter((r) => r.phase === 'cycle');
    const ok = code === 3 && out.includes('START-REFUSED reason=lease-expired') && cyc.length === 0;
    report('C lease expired -> driver refuses to start', ok, `exit=${code}; refusal=${out.trim().split('\n')[0]}; cycle rows=${cyc.length}; evidence=${fx.dir}`);
  } finally { try { floor.kill('SIGTERM'); } catch {} }
}

async function phaseD() {
  const fx = makeFixture('D'); // no floor ever runs: the state dir stays leaseless
  const resultsPath = path.join(fx.dir, 'sim-results.jsonl');
  const sim = runSim(fx.state, 3, 200, resultsPath);
  const { code, out } = await sim.done;
  const rows = readRows(resultsPath);
  const ok = code === 3 && out.includes('START-REFUSED reason=lease-absent') && rows.filter((r) => r.phase === 'cycle').length === 0;
  report('D no lease -> driver refuses to start', ok, `exit=${code}; refusal=${out.trim().split('\n')[0]}; evidence=${fx.dir}`);
}

(async () => {
  for (const ph of [phaseA, phaseB, phaseC, phaseD]) {
    try { await ph(); } catch (e) { report(ph.name, false, 'ERROR ' + e.message); }
  }
  const n = results.filter(Boolean).length;
  console.log(`\nGATE-WIRING FIXTURE: ${n}/4 PASS`);
  process.exit(n === 4 ? 0 : 1);
})();
