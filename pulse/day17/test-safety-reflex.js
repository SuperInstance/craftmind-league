'use strict';
/**
 * test-safety-reflex.js — DAY-14 FIXTURE for the safety reading
 * path (SAFETY-READING-PATH-REPAIR; day-13 incident H1). Offline;
 * no server, no world, no citizen.
 *
 * What is exercised is the SHIPPED code, not a copy:
 *   - pulse/day15/safety-check.js — required directly (the module
 *     the day-14 driver requires), reading through the REAL
 *     day15/gate-client.js -> floor/gate.js against fixture floor
 *     state dirs, and the REAL pulse/lib/deaths.js counter over
 *     fixture trace files.
 *   - reflexSafety — EXTRACTED from the day-14 driver source
 *     (REFLEX-SAFETY-BEGIN..END, the dig-guard pattern) and run
 *     with fixture trace/log sinks.
 *   - pulse/day15/hopflee.js — required directly; only its world
 *     physics is stubbed (prims via require.cache: flat ground,
 *     scripted gotoNear), so the hop loop, its boundary order and
 *     the safety hook are the shipped ones.
 * Wiring assertions on the driver source pin the integration:
 * the span alone would prove nothing if the driver never called
 * it (the day-13 lesson, applied to the repair itself).
 *
 * Cases: (a) park landing at a hop boundary; (b) death-count
 * crossing mid-sequence; (c) clean sequence, no false abort;
 * (d) the day-13 burst replayed on its recorded timeline;
 * (e) snapshot cost over the real day-13 trace.
 */
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const RUN = path.join(HERE, 'fixture-run');
fs.rmSync(RUN, { recursive: true, force: true });
fs.mkdirSync(RUN, { recursive: true });

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? ' — ' + extra : '')); }
}

// ── wiring assertions on the shipped driver source ─────────────
const SRC = fs.readFileSync(path.join(HERE, 'direct-drive-day17.js'), 'utf8');
check('wiring: driver requires day17 gate-client', SRC.includes("pulse/day17/gate-client.js"));
check('wiring: driver requires day17 safety-check', SRC.includes("pulse/day17/safety-check.js"));
check('wiring: driver requires day17 hopflee', SRC.includes("path.join(PULSE, 'day17', 'hopflee.js')"));
check('wiring: safety.init at driver boot', SRC.includes('safety.init({ tracePath: TRACE_PATH })'));
check('wiring: snapshot read at >= 4 sites (start, cycle head, pre-exec, reflex span)',
  (SRC.match(/safety\.snapshot\(/g) || []).length >= 4, 'count=' + (SRC.match(/safety\.snapshot\(/g) || []).length);
check('wiring: floor flee passes the safety hook', SRC.includes("safetyCheck: (nextHop) => reflexSafety('flee-hop-' + nextHop)"));
check('wiring: floorEscape branches on fr.aborted (no burrow after an abort)', SRC.includes('if (fr.aborted)'));
check('wiring: burrow checks at dig-in', SRC.includes("reflexSafety('burrow-dig-in')"));
check('wiring: burrow checks at seal', SRC.includes("reflexSafety('burrow-seal')"));
check('wiring: burrow checks in the hold loop', SRC.includes("reflexSafety('burrow-hold')"));
check('wiring: main loop breaks on reflexAbort inside the cycle', SRC.includes('if (reflexAbort)'));
check('wiring: close-exit skipped when safetyStopped', SRC.includes('!gateParked && !safetyStopped'));
check('wiring: close exit passes the safety hook', SRC.includes("safetyCheck: (nextHop) => reflexSafety('close-hop-' + nextHop)"));
const HOPSRC = fs.readFileSync(path.join(HERE, 'hopflee.js'), 'utf8');
check('wiring: hopflee carries the safety hook', HOPSRC.includes('opts.safetyCheck') && HOPSRC.includes("why: 'safety-abort'"));
const SCSRC = fs.readFileSync(path.join(HERE, 'safety-check.js'), 'utf8');
check('wiring: safety-check reads the gate + the trace counter', SCSRC.includes("gate.check('__safety__')") && SCSRC.includes('countTraceDeaths'));

// ── the real modules, exactly as the driver loads them ─────────
const gate = require('./gate-client.js');
const safety = require('./safety-check.js');
const { countTraceDeaths } = require(path.join(PULSE, 'lib', 'deaths.js'));

// ── extract the shipped reflexSafety span (dig-guard pattern) ──
const b = SRC.indexOf('// REFLEX-SAFETY-BEGIN');
const e = SRC.indexOf('// REFLEX-SAFETY-END');
check('span: REFLEX-SAFETY span present in driver source', b >= 0 && e > b);
const span = SRC.slice(b, e);
function makeReflex(rows) {
  const factory = new Function('safety', 'trace', 'log',
    'let deathsThisRun = 0;\n' + span + '\nreturn { reflexSafety, setDeaths: (n) => { deathsThisRun = n; }, getAbort: () => reflexAbort };');
  return factory(safety, (r) => rows.push(r), () => {});
}

// ── world stub for hopflee's prims (flat ground, scripted hops) ─
const world = { commands: [], onGoto: null, gotoResult: null, isClear: null, sleepDivisor: 100 };
const stubPrims = {
  groundY: () => 63,
  sleep: (ms) => new Promise((r) => setTimeout(r, Math.max(1, Math.round(ms / world.sleepDivisor)))),
  gotoNear: async (bot, x, y, z) => {
    world.commands.push({ x, y, z });
    if (world.onGoto) await world.onGoto(world.commands.length, bot);
    else { bot.entity.position.x = x; bot.entity.position.y = y; bot.entity.position.z = z; }
    return world.gotoResult || { ok: true };
  },
};
const PRIMS_PATH = path.join(PULSE, 'lib', 'prims.js');
require.cache[PRIMS_PATH] = { id: PRIMS_PATH, filename: PRIMS_PATH, loaded: true, exports: stubPrims };
const { hopFlee } = require('./hopflee.js');

function fakeBot(x, y, z) {
  const position = { x, y, z, clone() { return { x: this.x, y: this.y, z: this.z }; } };
  return { health: 20, entity: { position } };
}
function writeLease(dir, parked, real) {
  fs.mkdirSync(dir, { recursive: true });
  const now = Date.now();
  const lease = parked
    ? { lease_id: 'lease-fixture', driver: 'cody-driver', citizen: 'Cody', issued_ms: real ? 1794288044437 : now - 1000, expires_ms: real ? 1794291024266 : now + 60000, revoked: true, parked: true, park_seq: real ? 73 : 1, park_ts_ms: real ? 1794290964272 : now, contract_sha: 'fixture', state: 'parked' }
    : { lease_id: 'lease-fixture', driver: 'cody-driver', citizen: 'Cody', issued_ms: now - 1000, expires_ms: now + 60000, revoked: false, parked: false, park_seq: null, park_ts_ms: null, contract_sha: 'fixture', state: 'live' };
  fs.writeFileSync(path.join(dir, 'lease.json'), JSON.stringify(lease, null, 1));
}
function deathRow(tracePath, ts, n) { fs.appendFileSync(tracePath, JSON.stringify({ ts, kind: 'death', n }) + '\n'); }
function caseRig(name) {
  const dir = path.join(RUN, name, 'state');
  const tracePath = path.join(RUN, name, 'trace.jsonl');
  fs.mkdirSync(path.join(RUN, name), { recursive: true });
  fs.writeFileSync(tracePath, '');
  writeLease(dir, false);
  gate.init({ FLOOR_STATE_DIR: dir, FLOOR_DRIVER_ID: 'cody-driver' });
  safety.init({ tracePath });
  world.commands = []; world.onGoto = null; world.gotoResult = null; world.isClear = null; world.sleepDivisor = 100;
  return { dir, tracePath };
}
const fleeOpts = (R) => ({
  target: { x: 64, y: 67, z: -93 },
  isClear: world.isClear || (() => false),
  maxMs: 60000,
  log: () => {},
  safetyCheck: (nextHop) => R.reflexSafety('flee-hop-' + nextHop),
});

async function main() {
  // ── (a) park landing at hop 4's boundary ──────────────────────
  {
    const { dir, tracePath } = caseRig('a-park');
    const rows = [];
    const R = makeReflex(rows);
    world.onGoto = async (hopNo) => { if (hopNo === 3) writeLease(dir, true); }; // the floor parks after hop 3 completes
    const fr = await hopFlee(fakeBot(70.3, 59, -87.3), fleeOpts(R));
    check('(a) flee aborted on the park', fr.aborted === true, JSON.stringify(fr));
    check('(a) abort names hop 4 — the first boundary after the park', fr.hop === 4, 'hop=' + fr.hop);
    check('(a) trigger is park, gate reason lease-revoked (the floor\'s own words)', fr.trigger === 'park' && fr.gateReason === 'lease-revoked', fr.trigger + '/' + fr.gateReason);
    check('(a) ZERO hop commands issued after the park (3 issued, none at hop >= 4)', world.commands.length === 3, 'commands=' + world.commands.length);
    check('(a) exactly one reflex-abort trace row, naming trigger + hop stage',
      rows.filter((r) => r.kind === 'reflex-abort').length === 1 && rows[0].trigger === 'park' && rows[0].at === 'flee-hop-4',
      JSON.stringify(rows));
    check('(a) the trace death count is untouched (0)', countTraceDeaths(tracePath) === 0);
  }

  // ── (b) death-count crossing mid-sequence ─────────────────────
  {
    const { tracePath } = caseRig('b-deaths');
    const rows = [];
    const R = makeReflex(rows);
    deathRow(tracePath, '2026-11-10T00:00:01.000Z', 1);
    deathRow(tracePath, '2026-11-10T00:00:02.000Z', 2);
    R.setDeaths(2); // the driver's in-memory count, as its death handler holds it
    world.onGoto = async (hopNo) => { if (hopNo === 2) { deathRow(tracePath, '2026-11-10T00:00:03.000Z', 3); R.setDeaths(3); } }; // death 3 lands DURING hop 2
    const fr = await hopFlee(fakeBot(70.3, 59, -87.3), fleeOpts(R));
    check('(b) flee aborted on the count crossing', fr.aborted === true, JSON.stringify(fr));
    check('(b) abort at hop 3 — the first boundary after the crossing', fr.hop === 3, 'hop=' + fr.hop);
    check('(b) trigger is death-count (lease live throughout)', fr.trigger === 'death-count', fr.trigger);
    check('(b) ZERO hop commands issued after the crossing (2 issued)', world.commands.length === 2, 'commands=' + world.commands.length);
    check('(b) reflex-abort row names trigger + count', rows.length === 1 && rows[0].kind === 'reflex-abort' && rows[0].trigger === 'death-count' && rows[0].deathsRun === 3, JSON.stringify(rows));
  }

  // ── (c) clean sequence — no false abort ───────────────────────
  {
    const { tracePath } = caseRig('c-clean');
    const rows = [];
    const R = makeReflex(rows);
    world.isClear = () => world.commands.length >= 5; // danger clears after 5 hops, as most live flees end
    // Start ~33 blocks out (the burst flee's own start): with a
    // perfect 2-block hop the body cannot muster at the target
    // before the scripted clear — run 1 of this fixture started
    // 8.5 blocks out and the flee correctly mustered at hop 3,
    // a fixture geometry defect, not a code defect.
    const fr = await hopFlee(fakeBot(30.7, 75, -102.4), { ...fleeOpts(R), target: { x: 62, y: 67, z: -89 } });
    check('(c) clean flee completes by its own exit (clear)', fr.ok === true && fr.via === 'clear', JSON.stringify(fr));
    check('(c) all 5 hops issued, none suppressed', fr.hops === 5 && world.commands.length === 5, 'hops=' + fr.hops + ' commands=' + world.commands.length);
    check('(c) no abort latched, no reflex-abort row', R.getAbort() === null && rows.length === 0);
    check('(c) snapshot agrees: no stop on a live lease with 0 deaths', (() => { const s = safety.snapshot(0); return s.stop === false && s.deaths === 0 && countTraceDeaths(tracePath) === 0; })());
  }

  // ── (d) day-13 burst, replayed on its recorded timeline ──────
  // Recorded (trace + floor state, day-13 record §H1): flee entry
  // ~06:09:03Z (cycle 212); deaths 1–2 already in the run (06:07:
  // 06.922Z, 06:07:49.818Z); death 3 at 06:09:22.954Z; the floor's
  // PARK at 06:09:24.272Z (park_seq 73); deaths 4–9 at 06:09:33.
  // 218Z … 06:11:50.070Z inside the stuck cycle. Replay at 20x:
  // each hop's goto burns the 8 s timeout the real hops hit
  // (9 of 11 returned ok=false), plus hopflee's own 250 ms.
  // Hop boundaries therefore fall at flee-entry + (k-1)*8.25 s:
  // hop 4's boundary = +24.75 s = 06:09:27.750Z — after the park
  // (06:09:24.272Z), before death 4 (06:09:33.218Z).
  {
    const { dir, tracePath } = caseRig('d-replay');
    const rows = [];
    const R = makeReflex(rows);
    deathRow(tracePath, '2026-11-10T06:07:06.922Z', 1);
    deathRow(tracePath, '2026-11-10T06:07:49.818Z', 2);
    R.setDeaths(2);
    world.sleepDivisor = 20;
    world.gotoResult = { ok: false };
    world.onGoto = async () => { await stubPrims.sleep(8000); }; // the hop grinds out its timeout, body unmoved
    let fleeRunning = true;
    const laterDeaths = [ // deaths 4–9 at their recorded offsets from flee entry — they append ONLY if the body is still being driven
      ['2026-11-10T06:09:33.218Z', 4], ['2026-11-10T06:09:53.462Z', 5], ['2026-11-10T06:10:29.772Z', 6],
      ['2026-11-10T06:10:41.085Z', 7], ['2026-11-10T06:10:58.961Z', 8], ['2026-11-10T06:11:50.070Z', 9],
    ];
    const timers = [];
    timers.push(setTimeout(() => { deathRow(tracePath, '2026-11-10T06:09:22.954Z', 3); R.setDeaths(3); }, Math.round(19954 / 20)));
    timers.push(setTimeout(() => { // the floor's park, written in its real shape (park_seq + park_ts verbatim)
      fs.writeFileSync(path.join(dir, 'lease.json'), JSON.stringify({ lease_id: 'lease-1794288044437', driver: 'cody-driver', citizen: 'Cody', issued_ms: 1794288044437, expires_ms: 1794291024266, revoked: true, parked: true, park_seq: 73, park_ts_ms: 1794290964272, contract_sha: 'ea4aae4d8d6b050ba547e36b51075493c8a314c62b7b33a73833d6817a160c2a', state: 'parked' }, null, 1));
    }, Math.round(21318 / 20)));
    for (const [ts, n] of laterDeaths) {
      const off = (Date.parse(ts) - Date.parse('2026-11-10T06:09:03.000Z')) / 20;
      timers.push(setTimeout(() => { if (fleeRunning) { deathRow(tracePath, ts, n); R.setDeaths(n); } }, Math.round(off)));
    }
    const fr = await hopFlee(fakeBot(30.7, 75, -102.4), { ...fleeOpts(R), target: { x: 62, y: 67, z: -89 }, maxMs: 110000 });
    fleeRunning = false;
    timers.forEach(clearTimeout);
    check('(d) replay: flee aborted', fr.aborted === true, JSON.stringify(fr));
    check('(d) replay: abort at hop 4 — the first hop after the park', fr.hop === 4, 'hop=' + fr.hop);
    check('(d) replay: trigger is park, with the count at 3 in the verdict', fr.trigger === 'park' && fr.deaths === 3, fr.trigger + '/' + fr.deaths);
    check('(d) replay: DEATHS STOP AT 3 (the recorded day reached 9)', countTraceDeaths(tracePath) === 3, 'count=' + countTraceDeaths(tracePath));
    check('(d) replay: no hop commands after the abort (3 issued)', world.commands.length === 3, 'commands=' + world.commands.length);
    const mappedAbort = Date.parse('2026-11-10T06:09:03.000Z') + 3 * 8250; // hop-4 boundary on the recorded cadence
    check('(d) replay: mapped abort instant 06:09:27.750Z sits after the park (06:09:24.272Z) and before death 4 (06:09:33.218Z), margin 5.468 s',
      mappedAbort > 1794290964272 && mappedAbort < Date.parse('2026-11-10T06:09:33.218Z'),
      new Date(mappedAbort).toISOString());
    check('(d) replay: the reflex-abort row names hop 4 + trigger park',
      rows.length === 1 && rows[0].kind === 'reflex-abort' && rows[0].at === 'flee-hop-4' && rows[0].trigger === 'park', JSON.stringify(rows));
  }

  // ── (e) snapshot cost over the real day-13 trace ──────────────
  {
    const { dir } = caseRig('e-cost');
    void dir;
    safety.init({ tracePath: path.join(PULSE, 'direct-drive-trace-day13-20261110.jsonl') }); // 186,235 B, 9 death rows — read-only
    const times = [];
    for (let i = 0; i < 50; i++) { const t = process.hrtime.bigint(); safety.snapshot(9); times.push(Number(process.hrtime.bigint() - t) / 1e6); }
    times.sort((x, y) => x - y);
    const median = times[Math.floor(times.length / 2)], max = times[times.length - 1];
    check('(e) snapshot cost bounded: median ' + median.toFixed(2) + ' ms, max ' + max.toFixed(2) + ' ms over the real day-13 trace (50 reads)', median < 50, 'median=' + median.toFixed(2));
    const s = safety.snapshot(9);
    check('(e) snapshot over the real trace counts its 9 deaths', s.deaths === 9, 'deaths=' + s.deaths);
  }

  console.log('---');
  console.log(`SAFETY-REFLEX FIXTURE: ${pass} PASS / ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
}

main().catch((err) => { console.error('FIXTURE ERROR:', err); process.exit(2); });
