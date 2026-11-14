'use strict';
/**
 * test-floor.js — the fixture battery (study C.7 + the task's required
 * reproductions). Everything runs on recorded fixtures and fixture
 * processes in run/ — no world contact.
 *
 *   T0  static constitution checks (no model SDKs; release written only
 *       by release.js; command emitters only via opchannel)
 *   T1  deaths derivation on the REAL pulse stores: total 123,
 *       day-9 window = 3 (#121–#123), day-10 window = 0
 *   T2  driver killed mid-run -> lease revoked + PARK (heartbeat lost)
 *   T3  live driver spamming during PARK: all rejected; PARK undone
 *       only by external release + fresh lease
 *   T4  floor killed: lease expires, gate fails closed; verifier flags
 *       the stale canary
 *   T5  writer killed (core alive): detected — floor exits fail-closed
 *       and the independent verifier alerts; latencies measured
 *   T6  daylight: floor asserts through its OWN issuer and verifies the
 *       issuer-specific landing (no cameraman lines exist in the log);
 *       T6b: landing never comes -> 3 retries -> PARK
 *   T7  feed: declared feed verified from the snapshot store, remedy
 *       re-issue lands; T7b: never lands -> 2 re-issues -> PARK, no lease
 *   T8  replay validator refuses an unlisted act
 *   T9  three deaths injected into the trace -> counted through the
 *       floor's own writer path -> PARK at max_deaths
 *   T10 sensor path corrupted mid-run -> NOTIFY + PARK (never silence)
 *   T11 FileOpChannel round-trip against a fixture op bot
 */
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');

const HERE = __dirname;
const NODE = process.execPath;
const RUN = path.join(HERE, 'run');
const deaths = require(path.join(HERE, '..', 'pulse', 'lib', 'deaths.js'));

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
  try { return fs.readFileSync(file, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)); }
  catch { return []; }
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

const TIMERS = { lease_ttl_s: 4, heartbeat_lost_s: 3, canary_s: 1, poll_s: 0.25, daylight_check_s: 2 };
function makeState(name, over = {}, rigOver = {}) {
  const dir = path.join(RUN, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const trace = path.join(dir, 'trace.jsonl');
  fs.writeFileSync(trace, '');
  const serverLog = path.join(dir, 'server.log');
  fs.writeFileSync(serverLog, '');
  const snapshot = path.join(dir, 'snapshot.json');
  fs.writeFileSync(snapshot, JSON.stringify({ inventory: {}, ts: new Date().toISOString() }));
  const contract = {
    constitution: 'floor.v0', citizen: 'Cody', driver_id: 'cody-driver', max_deaths: 3,
    daylight: 'free', daylight_command: '/time set 1000', daylight_issuer: 'FloorOp',
    sensor: { trace_path: trace },
    day_window: ['2026-11-09T00:00:00Z', '2026-11-10T00:00:00Z'],
    feed: null, park_bay: null, timers: { ...TIMERS },
    ...over,
  };
  const contractFile = path.join(dir, 'contract.json');
  fs.writeFileSync(contractFile, JSON.stringify(contract, null, 2));
  const rig = {
    server_log_path: serverLog, snapshot_path: snapshot,
    op_req_path: path.join(dir, 'op-req-live.jsonl'), op_res_path: path.join(dir, 'op-res-live.jsonl'),
    stub: { landDaylight: true, feedWorks: true },
    ...rigOver,
  };
  const rigFile = path.join(dir, 'rig.json');
  fs.writeFileSync(rigFile, JSON.stringify(rig, null, 2));
  return { dir, trace, serverLog, snapshot, contractFile, rigFile, rig };
}
function startFloor(st, channel = 'stub') {
  return spawnTracked([path.join(HERE, 'floor.js'), '--contract', st.contractFile, '--state', st.dir, '--channel', channel, '--rig', st.rigFile]);
}
function startDriver(st) { return spawnTracked([path.join(HERE, 'test-driver.js'), st.dir, 'cody-driver']); }
const leaseOf = (st) => readJson(path.join(st.dir, 'lease.json'));
const logOf = (st) => readRows(path.join(st.dir, 'floor-log.jsonl'));

async function main() {
  fs.mkdirSync(RUN, { recursive: true });

  // ---------- T0 static ----------
  try {
    const srcs = ['floor.js', 'writer.js', 'gate.js', 'verifier.js', 'opchannel.js', 'release.js', 'constitution.js']
      .map((f) => fs.readFileSync(path.join(HERE, f), 'utf8'));
    const all = srcs.join('\n');
    const badRequire = /require\(['"](?!\.|fs|path|crypto|child_process|readline)[^'"]*['"]\)/.exec(all);
    const sdk = /(openai|anthropic|@anthropic|node-fetch|axios|mineflayer)/i.test(all);
    const floorSrc = srcs[0];
    const floorWritesRelease = /writeFileSync\([^)]*release/i.test(floorSrc) || /renameSync\([^)]*release/i.test(floorSrc);
    report('T0', 'static constitution checks', !badRequire && !sdk && !floorWritesRelease,
      `bad-require=${badRequire ? badRequire[0] : 'none'} sdk=${sdk} floor-writes-release=${floorWritesRelease}`);
  } catch (e) { report('T0', 'static constitution checks', false, String(e.message || e)); }

  // ---------- T1 deaths derivation on the real stores ----------
  try {
    const pulse = path.join(HERE, '..', 'pulse');
    const traces = fs.readdirSync(pulse).filter((f) => /^direct-drive-trace.*\.jsonl$/.test(f)).map((f) => path.join(pulse, f));
    const rows = deaths.deriveDeaths(path.join(pulse, 'deaths-record.jsonl'), traces);
    const w9 = deaths.deathsInWindow(rows, '2026-11-09T19:00:00Z', '2026-11-09T20:30:00Z');
    const w10 = deaths.deathsInWindow(rows, '2026-11-09T20:40:00Z', '2026-11-09T22:10:00Z');
    const ok = rows.length === 123 && w9.length === 3 && w9.map((r) => r.n).join(',') === '121,122,123' && w10.length === 0;
    report('T1', 'deaths derivation (real stores)', ok,
      `total=${rows.length} (want 123); day9 window=${w9.length} n=${w9.map((r) => r.n).join(',')} (want 3, 121,122,123); day10 window=${w10.length} (want 0); traces merged=${traces.length}`);
  } catch (e) { report('T1', 'deaths derivation (real stores)', false, String(e.message || e)); }

  // ---------- T2 driver killed mid-run ----------
  try {
    const st = makeState('t2');
    startFloor(st);
    await waitFor(() => leaseOf(st) && leaseOf(st).lease_id, 8000, 'lease issued');
    const drv = startDriver(st);
    const drvPid = drv.pid;
    await waitFor(() => readRows(path.join(st.dir, 'driver-results.jsonl')).filter((r) => r.ok).length >= 2, 8000, 'driver commands honoured');
    const tKill = Date.now();
    process.kill(drvPid, 'SIGKILL');
    const parkedLease = await waitFor(() => { const l = leaseOf(st); return l && l.parked && l.revoked ? l : null; }, 12000, 'park latched');
    const log = logOf(st);
    const hasPark = log.some((r) => r.act === 'PARK' && r.trigger_id === 'driver_heartbeat_lost');
    const hasRevoke = log.some((r) => r.act === 'LEASE_REVOKE');
    let probe = null;
    try { probe = JSON.parse(execFileSync(NODE, [path.join(HERE, 'gate.js'), st.dir, 'cody-driver', 'probe'], { encoding: 'utf8' })); }
    catch (e) { probe = JSON.parse(e.stdout.toString()); }
    report('T2', 'driver killed -> revoke + PARK', hasPark && hasRevoke && probe && probe.ok === false,
      `park-detection latency=${((parkedLease.park_ts_ms - tKill) / 1000).toFixed(2)}s; PARK row=${hasPark}; LEASE_REVOKE row=${hasRevoke}; post-park gate probe ok=${probe && probe.ok} reason=${probe && probe.reason}`);
    drv.kill('SIGKILL');
  } catch (e) { report('T2', 'driver killed -> revoke + PARK', false, String(e.message || e)); }

  // ---------- T3 spam during PARK + release ----------
  try {
    const st = makeState('t3');
    startFloor(st);
    await waitFor(() => leaseOf(st) && leaseOf(st).lease_id, 8000, 'lease issued');
    startDriver(st);
    await waitFor(() => readRows(path.join(st.dir, 'driver-results.jsonl')).some((r) => r.ok), 8000, 'driver honoured');
    fs.writeFileSync(path.join(st.dir, 'STOP'), 'test');
    const parkedLease = await waitFor(() => { const l = leaseOf(st); return l && l.parked ? l : null; }, 8000, 'park latched');
    await sleep(2600); // driver keeps spamming through the park
    const res = readRows(path.join(st.dir, 'driver-results.jsonl'));
    const during = res.filter((r) => Date.parse(r.ts) > parkedLease.park_ts_ms);
    const spamRejected = during.length >= 2 && during.every((r) => !r.ok);
    // The operator withdraws the standing stop first (STOP is
    // level-triggered: a release under a standing STOP re-parks within
    // a tick — the fail-safe semantics this scenario also documents),
    // then releases the park through the only writer of release.json.
    fs.rmSync(path.join(st.dir, 'STOP'), { force: true });
    execFileSync(NODE, [path.join(HERE, 'release.js'), st.dir, 'test-operator'], { encoding: 'utf8' });
    await waitFor(() => { const l = leaseOf(st); return l && !l.revoked && l.issued_ms > (readJson(path.join(st.dir, 'release.json')) || {}).ts_ms ? l : null; }, 8000, 'fresh lease after release');
    await waitFor(() => readRows(path.join(st.dir, 'driver-results.jsonl')).some((r) => r.ok && Date.parse(r.ts) > (readJson(path.join(st.dir, 'release.json')) || {}).ts_ms + 500), 8000, 'commands honoured again');
    const observed = logOf(st).some((r) => r.act === 'RELEASE_OBSERVED');
    report('T3', 'spam during PARK rejected; release is external only', spamRejected && observed,
      `attempts during park=${during.length} all rejected=${spamRejected}; RELEASE_OBSERVED=${observed}; released_by=${(readJson(path.join(st.dir, 'release.json')) || {}).released_by}`);
  } catch (e) { report('T3', 'spam during PARK rejected; release is external only', false, String(e.message || e)); }

  // ---------- T4 floor killed -> fail closed ----------
  try {
    const st = makeState('t4');
    const fl = startFloor(st);
    await waitFor(() => leaseOf(st) && leaseOf(st).lease_id, 8000, 'lease issued');
    startDriver(st);
    await waitFor(() => readRows(path.join(st.dir, 'driver-results.jsonl')).some((r) => r.ok), 8000, 'driver honoured');
    fl.kill('SIGKILL');
    const tKill = Date.now();
    await waitFor(() => {
      const res = readRows(path.join(st.dir, 'driver-results.jsonl'));
      return res.some((r) => !r.ok && r.reason === 'lease-expired' && Date.parse(r.ts) > tKill) ? true : null;
    }, 12000, 'gate fails closed on lease expiry');
    let vExit = 0; let vOut = '';
    try { vOut = execFileSync(NODE, [path.join(HERE, 'verifier.js'), st.dir, '--max-canary-age-s', '2'], { encoding: 'utf8' }); }
    catch (e) { vExit = e.status; vOut = e.stdout.toString(); }
    const v = JSON.parse(vOut);
    report('T4', 'floor killed -> lease expires, verifier flags stale canary', vExit === 2 && v.problems.some((p) => p.startsWith('canary-stale')),
      `fail-closed observed; verifier exit=${vExit} problems=${JSON.stringify(v.problems)}`);
  } catch (e) { report('T4', 'floor killed -> fail closed', false, String(e.message || e)); }

  // ---------- T5 writer killed -> detection latency ----------
  try {
    const st = makeState('t5');
    const fl = startFloor(st);
    await waitFor(() => leaseOf(st) && leaseOf(st).lease_id, 8000, 'lease issued');
    const writerPid = Number(await waitFor(() => { try { return fs.readFileSync(path.join(st.dir, 'writer.pid'), 'utf8'); } catch { return null; } }, 5000, 'writer pid'));
    const floorExit = new Promise((r) => fl.on('exit', (c) => r(c)));
    const tKill = Date.now();
    process.kill(writerPid, 'SIGKILL');
    let tAlert = null;
    const poller = setInterval(() => {
      try {
        execFileSync(NODE, [path.join(HERE, 'verifier.js'), st.dir, '--max-canary-age-s', '2'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      } catch (e) { if (e.status === 2 && !tAlert) { tAlert = Date.now(); clearInterval(poller); } }
    }, 200);
    const exitCode = await Promise.race([floorExit, sleep(9000).then(() => 'timeout')]);
    if (!tAlert) await waitFor(() => tAlert, 6000, 'verifier alert').catch(() => {});
    clearInterval(poller);
    const leaseAfter = leaseOf(st);
    report('T5', 'writer killed -> detected, fail closed', exitCode === 3 && !!tAlert && leaseAfter && leaseAfter.revoked === true,
      `floor self-detection: exit code=${exitCode} (3 = writer-path failure, lease revoked directly); verifier detection latency=${tAlert ? ((tAlert - tKill) / 1000).toFixed(2) + 's' : 'none'} at canary bound 2s`);
  } catch (e) { report('T5', 'writer killed -> detected', false, String(e.message || e)); }

  // ---------- T6 daylight via the floor's own issuer ----------
  try {
    const st = makeState('t6', { daylight: 'held' });
    startFloor(st);
    startDriver(st); // heartbeat present: daylight is the only park cause in play
    await waitFor(() => fs.readFileSync(st.serverLog, 'utf8').includes('FloorOp issued server command: /time set 1000'), 12000, 'issuer-specific landing');
    await sleep(500);
    const log = logOf(st);
    const parked = log.some((r) => r.act === 'PARK');
    report('T6', 'daylight asserted + verified via own issuer', log.some((r) => r.act === 'ASSERT_DAYLIGHT') && !parked,
      'fixture log contains no cameraman lines at all — the hold is the floor\u2019s own channel');
  } catch (e) { report('T6', 'daylight asserted + verified via own issuer', false, String(e.message || e)); }
  try {
    const st = makeState('t6b', { daylight: 'held' }, { stub: { landDaylight: false, feedWorks: true } });
    startFloor(st);
    startDriver(st); // without a heartbeat, heartbeat-loss parks first and masks the daylight retries
    const parkedLease = await waitFor(() => { const l = leaseOf(st); return l && l.parked ? l : null; }, 30000, 'park after retries');
    const asserts = logOf(st).filter((r) => r.act === 'ASSERT_DAYLIGHT').length;
    const trig = logOf(st).find((r) => r.act === 'PARK');
    report('T6b', 'daylight unrestorable -> 3 retries -> PARK', asserts === 3 && trig && trig.trigger_id === 'daylight_unrestorable',
      `assert attempts=${asserts}; park trigger=${trig && trig.trigger_id}`);
    void parkedLease;
  } catch (e) { report('T6b', 'daylight unrestorable -> PARK', false, String(e.message || e)); }

  // ---------- T7 feed verification ----------
  try {
    const feed = { item: 'cooked_porkchop', count: 8, op: { item: 'cooked_porkchop', count: 32 } };
    const st = makeState('t7', { feed });
    startFloor(st);
    await waitFor(() => leaseOf(st) && leaseOf(st).lease_id, 10000, 'lease after feed verified');
    const snap = readJson(st.snapshot);
    const gives = readRows(path.join(st.dir, 'op-req.jsonl')).filter((r) => r.cmd === 'give').length;
    report('T7', 'feed verified from snapshot; remedy landed', snap.inventory.cooked_porkchop >= 8 && gives === 1,
      `snapshot porkchops=${snap.inventory.cooked_porkchop}; give re-issues=${gives}`);
  } catch (e) { report('T7', 'feed verified', false, String(e.message || e)); }
  try {
    const feed = { item: 'cooked_porkchop', count: 8, op: { item: 'cooked_porkchop', count: 32 } };
    const st = makeState('t7b', { feed }, { stub: { landDaylight: true, feedWorks: false } });
    startFloor(st);
    await waitFor(() => logOf(st).some((r) => r.act === 'PARK' && r.trigger_id === 'feed_unverified'), 12000, 'feed park');
    const gives = readRows(path.join(st.dir, 'op-req.jsonl')).filter((r) => r.cmd === 'give').length;
    const l = leaseOf(st);
    report('T7b', 'feed never lands -> 2 re-issues -> PARK, no lease', gives === 2 && (!l || !l.lease_id),
      `give re-issues=${gives}; lease issued=${!!(l && l.lease_id)}`);
  } catch (e) { report('T7b', 'feed never lands -> PARK', false, String(e.message || e)); }

  // ---------- T8 replay validator refuses an unlisted act ----------
  try {
    const dir = path.join(RUN, 't8');
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const t = new Date().toISOString();
    fs.writeFileSync(path.join(dir, 'floor-log.jsonl'),
      JSON.stringify({ seq: 1, ts: t, act: 'OBSERVE', contract_sha: 'x' }) + '\n' +
      JSON.stringify({ seq: 2, ts: t, act: 'TELEPORT_CITIZEN', contract_sha: 'x' }) + '\n');
    fs.writeFileSync(path.join(dir, 'floor-canary.jsonl'), JSON.stringify({ seq: 3, ts: t, act: 'SELF_PROVE', contract_sha: 'x' }) + '\n');
    let vExit = 0; let vOut = '';
    try { vOut = execFileSync(NODE, [path.join(HERE, 'verifier.js'), dir], { encoding: 'utf8' }); }
    catch (e) { vExit = e.status; vOut = e.stdout.toString(); }
    const v = JSON.parse(vOut);
    report('T8', 'replay validator refuses unlisted act', vExit === 2 && v.problems.some((p) => p.includes('unlisted-act TELEPORT_CITIZEN')),
      `verifier exit=${vExit} problems=${JSON.stringify(v.problems)}`);
  } catch (e) { report('T8', 'replay validator refuses unlisted act', false, String(e.message || e)); }

  // ---------- T9 three deaths injected ----------
  try {
    const st = makeState('t9');
    startFloor(st);
    await waitFor(() => leaseOf(st) && leaseOf(st).lease_id, 8000, 'lease issued');
    startDriver(st);
    await waitFor(() => readRows(path.join(st.dir, 'driver-results.jsonl')).some((r) => r.ok), 8000, 'driver honoured');
    const base = Date.parse('2026-11-09T12:00:00Z');
    for (let i = 0; i < 3; i++) {
      fs.appendFileSync(st.trace, JSON.stringify({ kind: 'death', ts: new Date(base + i * 60000).toISOString(), citizen: 'Cody' }) + '\n');
      await sleep(600);
    }
    await waitFor(() => { const l = leaseOf(st); return l && l.parked ? l : null; }, 10000, 'park at max deaths');
    const counts = readRows(path.join(st.dir, 'floor-counts.jsonl'));
    const countActs = logOf(st).filter((r) => r.act === 'COUNT_DEATH').length;
    const trig = logOf(st).find((r) => r.act === 'PARK');
    report('T9', 'three deaths counted via writer path -> PARK', counts.length === 3 && countActs === 3 && trig && trig.trigger_id === 'deaths_today>=max_deaths',
      `counts rows=${counts.length}; COUNT_DEATH acts=${countActs}; park trigger=${trig && trig.trigger_id}`);
  } catch (e) { report('T9', 'three deaths -> PARK', false, String(e.message || e)); }

  // ---------- T10 sensor path corrupted ----------
  try {
    const st = makeState('t10');
    startFloor(st);
    await waitFor(() => leaseOf(st) && leaseOf(st).lease_id, 8000, 'lease issued');
    fs.rmSync(st.trace); fs.mkdirSync(st.trace); // the path is now a directory: unreadable as a file
    await waitFor(() => logOf(st).some((r) => r.act === 'PARK' && r.trigger_id === 'sensor_path_broken'), 10000, 'sensor park');
    const notified = logOf(st).some((r) => r.act === 'NOTIFY' && r.reason === 'SENSOR_PATH_BROKEN');
    report('T10', 'sensor path broken -> NOTIFY + PARK', notified, 'a counter that cannot read parks; it never counts silence as safety');
  } catch (e) { report('T10', 'sensor path broken -> PARK', false, String(e.message || e)); }

  // ---------- T11 FileOpChannel round-trip ----------
  try {
    const st = makeState('t11', { daylight: 'held' });
    fs.writeFileSync(st.rig.op_req_path, ''); fs.writeFileSync(st.rig.op_res_path, '');
    spawnTracked([path.join(HERE, 'fake-op.js'), st.rig.op_req_path, st.rig.op_res_path, st.serverLog, 'FloorOp']);
    startFloor(st, 'file');
    await waitFor(() => fs.readFileSync(st.serverLog, 'utf8').includes('FloorOp issued server command: /time set 1000'), 15000, 'landing via file channel');
    const res = readRows(st.rig.op_res_path);
    report('T11', 'FileOpChannel round-trip vs fixture op bot', res.length >= 1 && logOf(st).some((r) => r.act === 'ASSERT_DAYLIGHT'),
      `op results=${res.length}; channel = the fleet req/res JSONL shape`);
  } catch (e) { report('T11', 'FileOpChannel round-trip', false, String(e.message || e)); }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} PASS${failed.length ? ' — FAILURES: ' + failed.map((r) => r.id).join(', ') : ''}`);
  cleanup();
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => { console.error('battery crashed:', e); cleanup(); process.exit(2); });
