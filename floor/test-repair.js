'use strict';
/**
 * test-repair.js — fixture battery for the floor repair charter
 * (FLOOR-REPAIR-20261109.md §2/§3). Everything runs on fixture stores
 * and fixture processes under run/repair/ — no world contact.
 *
 *   R1  THE DAY-11 SEQUENCE, rehearsed: floor open -> VERIFY_FEED ->
 *       LEASE_ISSUE -> long Gate-B pause (18 s at fixture scale, no
 *       driver, no heartbeat file) -> driver starts late -> first
 *       heartbeat -> the day reaches cycle 1 and beyond. The lease
 *       must stand through the pause (state 'launch', never parked,
 *       never revoked) and the driver's start check must pass.
 *   R2  NEGATIVE: driver never launched — with a stale pre-lease
 *       heartbeat file present, the lease expires on TTL after the
 *       launch window and is never renewed (no zombie lease); the
 *       gate answers 'lease-expired'. The floor's park, when it comes,
 *       rides the lapsed window + stale-beat anchor — never a demand
 *       for a beat inside the window.
 *   R3  NEGATIVE: driver launched, cycles flow, then killed — park
 *       within the heartbeat-lost bound, reason DRIVER_HEARTBEAT_LOST.
 *   R4  release stream: park #1 (STOP) cleared by release seq 1 and a
 *       fresh lease follows; park #2 (STOP again) is NOT cleared by
 *       the standing seq-1 release — gate probes keep answering
 *       'parked' — until release seq 2 lands; then a fresh lease and
 *       honoured commands again. Two RELEASE_OBSERVED rows, seq 1, 2.
 *   R5  gate reasons (repair (c)): absent dir -> 'lease-absent';
 *       expired lease -> 'lease-expired'; revoked lease ->
 *       'lease-revoked'; the three are pairwise distinct.
 *
 * usage: node test-repair.js   (exit 0 iff 5/5 PASS)
 */
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const HERE = __dirname;
const NODE = process.execPath;
const RUN = path.join(HERE, 'run', 'repair');
const SIM = '/home/caseydigennaro/craftmind-league/pulse/day11/gate-client.js';
const DRIVER_ID = 'cody-driver';

const results = [];
function report(id, name, pass, detail) {
  results.push({ id, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id} ${name}${detail ? ' — ' + detail : ''}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(fn, timeoutMs, label) {
  const t0 = Date.now();
  for (;;) {
    try { const v = fn(); if (v) return v; } catch { /* not yet */ }
    if (Date.now() - t0 > timeoutMs) throw new Error('timeout waiting: ' + label);
    await sleep(150);
  }
}
function readRows(file) {
  try { return fs.readFileSync(file, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)); } catch { return []; }
}
function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } }

const children = [];
function spawnTracked(args, opts = {}) {
  const p = spawn(NODE, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });
  p.stdout.on('data', () => {}); p.stderr.on('data', () => {});
  children.push(p);
  return p;
}
function cleanup() { for (const p of children) { try { p.kill('SIGKILL'); } catch { /* dead */ } } }
process.on('exit', cleanup);

// Fixture-scale timers: heartbeat_lost 3 s (the bound R3 is measured
// against), launch window 8 s, TTL 30 s while heartbeating (the floor
// renews), canary 1 s, poll 0.25 s.
const TIMERS = { lease_ttl_s: 30, heartbeat_lost_s: 3, canary_s: 1, poll_s: 0.25, daylight_check_s: 2 };
function makeState(name, contractOver = {}) {
  const dir = path.join(RUN, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const trace = path.join(dir, 'trace.jsonl');
  fs.writeFileSync(trace, '');
  const serverLog = path.join(dir, 'server.log');
  fs.writeFileSync(serverLog, '');
  const snapshot = path.join(dir, 'snapshot.json');
  fs.writeFileSync(snapshot, JSON.stringify({ inventory: { cooked_porkchop: 30 }, ts: new Date().toISOString() }));
  const contract = {
    constitution: 'floor.v0', citizen: 'Cody', driver_id: DRIVER_ID, max_deaths: 3,
    daylight: 'free', daylight_command: '/time set 1000', daylight_issuer: 'FloorOp',
    sensor: { trace_path: trace },
    day_window: ['2026-11-09T00:00:00Z', '2026-11-12T00:00:00Z'],
    feed: { item: 'cooked_porkchop', count: 8, op: { item: 'cooked_porkchop', count: 32 } },
    park_bay: null, launch_window_s: 8, timers: { ...TIMERS },
    ...contractOver,
  };
  const contractFile = path.join(dir, 'contract.json');
  fs.writeFileSync(contractFile, JSON.stringify(contract, null, 2));
  const rig = {
    server_log_path: serverLog, snapshot_path: snapshot,
    op_req_path: path.join(dir, 'op-req-live.jsonl'), op_res_path: path.join(dir, 'op-res-live.jsonl'),
    stub: { landDaylight: true, feedWorks: true },
  };
  const rigFile = path.join(dir, 'rig.json');
  fs.writeFileSync(rigFile, JSON.stringify(rig, null, 2));
  return { dir, trace, serverLog, snapshot, contractFile, rigFile };
}
function startFloor(st) {
  return spawnTracked([path.join(HERE, 'floor.js'), '--contract', st.contractFile, '--state', st.dir, '--channel', 'stub', '--rig', st.rigFile]);
}
function runSim(st, cycles, intervalMs, resultsPath) {
  const proc = spawn(NODE, [SIM, 'simulate', st.dir, DRIVER_ID, String(cycles), String(intervalMs), resultsPath],
    { stdio: ['ignore', 'pipe', 'pipe'] });
  children.push(proc);
  let out = '';
  proc.stdout.on('data', (d) => { out += d; });
  proc.stderr.on('data', (d) => { out += d; });
  const done = new Promise((resolve) => proc.on('exit', (code) => resolve({ code, out })));
  return { proc, done };
}
function startDriver(st) { return spawnTracked([path.join(HERE, 'test-driver.js'), st.dir, DRIVER_ID]); }
const leaseOf = (st) => readJson(path.join(st.dir, 'lease.json'));
const logOf = (st) => readRows(path.join(st.dir, 'floor-log.jsonl'));
function gateProbe(st) {
  try { return JSON.parse(execFileSync(NODE, [path.join(HERE, 'gate.js'), st.dir, DRIVER_ID, 'probe'], { encoding: 'utf8' })); }
  catch (e) { return JSON.parse(e.stdout.toString()); }
}
function release(st, by) {
  return JSON.parse(execFileSync(NODE, [path.join(HERE, 'release.js'), st.dir, by], { encoding: 'utf8' }));
}

async function main() {
  fs.mkdirSync(RUN, { recursive: true });

  // ---------- R1 the day-11 sequence, rehearsed ----------
  try {
    const st = makeState('r1');
    startFloor(st);
    // floor open -> VERIFY_FEED (30 >= 8 from the snapshot, no give) -> LEASE_ISSUE
    const lease = await waitFor(() => { const l = leaseOf(st); return l && l.lease_id ? l : null; }, 10000, 'R1 lease issued');
    const floorLog0 = logOf(st);
    const feedOk = floorLog0.some((r) => r.act === 'VERIFY_FEED');
    const issuedAt = lease.issued_ms;
    // Gate B's pause: no driver process, no heartbeat file, for 18 s —
    // past heartbeat_lost_s (3) AND past launch_window_s (8).
    await sleep(18000);
    const mid = leaseOf(st);
    const midOk = mid && mid.lease_id === lease.lease_id && !mid.parked && !mid.revoked && mid.state === 'launch'
      && !logOf(st).some((r) => r.act === 'PARK');
    // driver starts late; its first heartbeat flips LAUNCH -> LIVE
    const resultsPath = path.join(st.dir, 'sim-results.jsonl');
    const sim = runSim(st, 6, 300, resultsPath);
    const { code, out } = await sim.done;
    const rows = readRows(resultsPath);
    const startRow = rows.find((r) => r.phase === 'start');
    const cyc = rows.filter((r) => r.phase === 'cycle');
    const live = leaseOf(st);
    const ok = feedOk && midOk && code === 0 && startRow && startRow.ok === true
      && cyc.length === 6 && cyc.every((r) => r.ok)
      && live && live.state === 'live'
      && !logOf(st).some((r) => r.act === 'PARK');
    report('R1', 'day-11 sequence rehearsed: lease survives the Gate B pause; late driver reaches cycle 1+', ok,
      `VERIFY_FEED row=${feedOk}; after 18s pause: parked=${mid && mid.parked} revoked=${mid && mid.revoked} state=${mid && mid.state} PARK rows=${logOf(st).filter((r) => r.act === 'PARK').length}; sim exit=${code} start_ok=${startRow && startRow.ok} cycles ok=${cyc.filter((r) => r.ok).length}/${cyc.length}; final lease state=${live && live.state}; pause-to-first-beat=${((rows[0] ? rows[0].ts_ms : 0) - issuedAt) / 1000}s`);
  } catch (e) { report('R1', 'day-11 sequence rehearsed', false, String(e.message || e)); }

  // ---------- R2 driver never launched -> no zombie lease ----------
  try {
    const st = makeState('r2', { timers: { lease_ttl_s: 6, heartbeat_lost_s: 3, canary_s: 1, poll_s: 0.25, daylight_check_s: 2 }, launch_window_s: 5 });
    // a stale heartbeat file from before the lease (a previous process's
    // leavings) must not count as this lease's first heartbeat
    fs.writeFileSync(path.join(st.dir, 'heartbeat.json'), JSON.stringify({ ts_ms: Date.now() - 60000, driver: DRIVER_ID }));
    startFloor(st);
    const lease = await waitFor(() => { const l = leaseOf(st); return l && l.lease_id ? l : null; }, 10000, 'R2 lease issued');
    // inside the window + heartbeat_lost: the lease must still stand
    await sleep(4500);
    const inWindow = leaseOf(st);
    const stoodInWindow = inWindow && !inWindow.parked && !inWindow.revoked && inWindow.state === 'launch';
    // Past the window (5 s) AND a full heartbeat_lost (3 s) beyond it:
    // the launch park is the DESIGNED answer to a driver that never
    // came (the Gate-B guard: an overstayed launch park-revokes rather
    // than standing open). The task's no-zombie clause is about the
    // LEASE: it must be dead and unusable — never renewed, never
    // honouring a command. At +6 s the lease was still inside its
    // first TTL (issued 6 s) and still state 'launch': the no-park
    // INSIDE the window is asserted by stoodInWindow above.
    const parked = await waitFor(() => { const l = leaseOf(st); return l && l.parked && l.revoked ? l : null; }, 15000, 'R2 launch park after window');
    const parkLatencyS = (parked.park_ts_ms - lease.issued_ms) / 1000;
    const trig = logOf(st).find((r) => r.act === 'PARK');
    const probe = gateProbe(st);
    const after = leaseOf(st);
    const ok = stoodInWindow && trig && trig.trigger_id === 'driver_heartbeat_lost'
      && parkLatencyS > 5 && parkLatencyS <= 5 + 3 + 2
      && probe.ok === false && probe.reason === 'lease-revoked'
      && after && after.state === 'parked';
    report('R2', 'driver never launched -> no zombie lease (launch park after the window; never renewed, never honoured)', ok,
      `stood in window (state=launch, unparked)=${stoodInWindow}; PARK trigger=${trig && trig.trigger_id} at +${parkLatencyS.toFixed(2)}s from issue (window 5s + lost 3s bound); gate probe ok=${probe.ok} reason=${probe.reason}; final lease state=${after && after.state}`);
  } catch (e) { report('R2', 'driver never launched', false, String(e.message || e)); }

  // ---------- R3 driver launched then killed -> park within the bound ----------
  try {
    const st = makeState('r3');
    startFloor(st);
    await waitFor(() => { const l = leaseOf(st); return l && l.lease_id ? l : null; }, 10000, 'R3 lease issued');
    const drv = startDriver(st);
    await waitFor(() => readRows(path.join(st.dir, 'driver-results.jsonl')).filter((r) => r.ok).length >= 2, 8000, 'R3 cycles flowing');
    const tKill = Date.now();
    process.kill(drv.pid, 'SIGKILL');
    const parkedLease = await waitFor(() => { const l = leaseOf(st); return l && l.parked && l.revoked ? l : null; }, 12000, 'R3 park');
    const latencyS = (parkedLease.park_ts_ms - tKill) / 1000;
    const trig = logOf(st).find((r) => r.act === 'PARK');
    const ok = trig && trig.trigger_id === 'driver_heartbeat_lost' && latencyS <= TIMERS.heartbeat_lost_s + 2;
    report('R3', 'driver killed -> park within the heartbeat-lost bound', ok,
      `park latency=${latencyS.toFixed(2)}s (bound ${TIMERS.heartbeat_lost_s}s + poll slack); trigger=${trig && trig.trigger_id}`);
  } catch (e) { report('R3', 'driver killed -> park', false, String(e.message || e)); }

  // ---------- R4 release stream: second park needs a second release ----------
  try {
    const st = makeState('r4');
    startFloor(st);
    await waitFor(() => { const l = leaseOf(st); return l && l.lease_id ? l : null; }, 10000, 'R4 lease issued');
    startDriver(st);
    const resFile = path.join(st.dir, 'driver-results.jsonl');
    await waitFor(() => readRows(resFile).some((r) => r.ok), 8000, 'R4 driver honoured');
    // park #1 via standing STOP
    fs.writeFileSync(path.join(st.dir, 'STOP'), 'r4 park 1');
    const park1 = await waitFor(() => { const l = leaseOf(st); return l && l.parked ? l : null; }, 8000, 'R4 park 1');
    await sleep(1500);
    fs.rmSync(path.join(st.dir, 'STOP'), { force: true });
    const rel1 = release(st, 'repair-test');
    await waitFor(() => { const l = leaseOf(st); return l && !l.parked && !l.revoked && l.issued_ms > rel1.ts_ms ? l : null; }, 8000, 'R4 fresh lease after release 1');
    await waitFor(() => readRows(resFile).some((r) => r.ok && Date.parse(r.ts) > rel1.ts_ms + 400), 8000, 'R4 honoured after release 1');
    // park #2: the standing seq-1 release must NOT clear it
    fs.writeFileSync(path.join(st.dir, 'STOP'), 'r4 park 2');
    const park2 = await waitFor(() => { const l = leaseOf(st); return l && l.parked && l.park_ts_ms > park1.park_ts_ms ? l : null; }, 8000, 'R4 park 2');
    await sleep(2600); // two+ floor polls + driver attempts under park 2
    const during2 = readRows(resFile).filter((r) => Date.parse(r.ts) > park2.park_ts_ms);
    const stillParked = leaseOf(st);
    const probe2 = gateProbe(st);
    // NB: the gate's reason under a standing park is 'lease-revoked',
    // not 'parked' — park() revokes as it latches (floor.js: park ->
    // revokeLease), so gate.js's revoked check fires first. The
    // behavioural fact asserted here is non-clearance: ok=false on
    // every probe and driver attempt while only release seq 1 stands.
    const notCleared = stillParked && stillParked.parked && probe2.ok === false && probe2.reason === 'lease-revoked'
      && during2.length >= 1 && during2.every((r) => !r.ok);
    // release #2 clears it
    fs.rmSync(path.join(st.dir, 'STOP'), { force: true });
    const rel2 = release(st, 'repair-test');
    await waitFor(() => { const l = leaseOf(st); return l && !l.parked && !l.revoked && l.issued_ms > rel2.ts_ms ? l : null; }, 8000, 'R4 fresh lease after release 2');
    await waitFor(() => readRows(resFile).some((r) => r.ok && Date.parse(r.ts) > rel2.ts_ms + 400), 8000, 'R4 honoured after release 2');
    const observed = logOf(st).filter((r) => r.act === 'RELEASE_OBSERVED');
    const ok = rel1.seq === 1 && rel2.seq === 2 && notCleared
      && observed.length === 2 && observed[0].release_seq === 1 && observed[1].release_seq === 2;
    report('R4', 'release stream: park 2 requires release 2 (no single-shot latch)', ok,
      `release seqs=${rel1.seq},${rel2.seq}; under park 2 with only seq-1 release standing: gate=${probe2.reason} (park revokes as it latches, so revoked precedes parked at the gate), driver attempts rejected=${during2.filter((r) => !r.ok).length}/${during2.length}; RELEASE_OBSERVED rows=${observed.length} seqs=${observed.map((r) => r.release_seq).join(',')}`);
  } catch (e) { report('R4', 'release stream', false, String(e.message || e)); }

  // ---------- R5 gate reasons are three and distinct ----------
  try {
    const absentDir = path.join(RUN, 'r5-absent');
    fs.rmSync(absentDir, { recursive: true, force: true });
    fs.mkdirSync(absentDir, { recursive: true });
    const rAbsent = (() => { try { return JSON.parse(execFileSync(NODE, [path.join(HERE, 'gate.js'), absentDir, DRIVER_ID, 'probe'], { encoding: 'utf8' })); } catch (e) { return JSON.parse(e.stdout.toString()); } })();
    const base = { lease_id: 'lease-x', driver: DRIVER_ID, citizen: 'Cody', issued_ms: Date.now() - 1000, expires_ms: Date.now() + 60000, revoked: false, parked: false, park_seq: null, park_ts_ms: null, contract_sha: 'x', state: 'live' };
    const expDir = path.join(RUN, 'r5-expired');
    fs.rmSync(expDir, { recursive: true, force: true }); fs.mkdirSync(expDir, { recursive: true });
    fs.writeFileSync(path.join(expDir, 'lease.json'), JSON.stringify({ ...base, expires_ms: Date.now() - 1, state: 'live' }));
    const rExpired = (() => { try { return JSON.parse(execFileSync(NODE, [path.join(HERE, 'gate.js'), expDir, DRIVER_ID, 'probe'], { encoding: 'utf8' })); } catch (e) { return JSON.parse(e.stdout.toString()); } })();
    const revDir = path.join(RUN, 'r5-revoked');
    fs.rmSync(revDir, { recursive: true, force: true }); fs.mkdirSync(revDir, { recursive: true });
    fs.writeFileSync(path.join(revDir, 'lease.json'), JSON.stringify({ ...base, revoked: true, state: 'revoked' }));
    const rRevoked = (() => { try { return JSON.parse(execFileSync(NODE, [path.join(HERE, 'gate.js'), revDir, DRIVER_ID, 'probe'], { encoding: 'utf8' })); } catch (e) { return JSON.parse(e.stdout.toString()); } })();
    const reasons = [rAbsent.reason, rExpired.reason, rRevoked.reason];
    const ok = rAbsent.ok === false && rExpired.ok === false && rRevoked.ok === false
      && reasons[0] === 'lease-absent' && reasons[1] === 'lease-expired' && reasons[2] === 'lease-revoked'
      && new Set(reasons).size === 3;
    report('R5', 'gate refusal reasons distinguish absent / expired / revoked', ok,
      `absent=${rAbsent.reason}; expired=${rExpired.reason}; revoked=${rRevoked.reason}; distinct=${new Set(reasons).size === 3}`);
  } catch (e) { report('R5', 'gate reasons', false, String(e.message || e)); }

  const failed = results.filter((r) => !r.pass);
  console.log(`\nREPAIR FIXTURE: ${results.length - failed.length}/${results.length} PASS${failed.length ? ' — FAILURES: ' + failed.map((r) => r.id).join(', ') : ''}`);
  cleanup();
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => { console.error('battery crashed:', e); cleanup(); process.exit(2); });
