'use strict';
/**
 * test-deaths.js — the counter-must-move suite for pulse/lib/deaths.js.
 * Lives beside the library so the next driver inherits it.
 * Synthetic traces: 0, 1, 3 deaths, a torn final line, a missing file,
 * plus the derivation path (record + live traces, deduped, windowed),
 * the abort predicate, and the provisioning-evidence class (deaths-seam
 * repair, 2026-11-09: a non-driver body's death must move the count).
 * Exit 0 = all pass.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { countTraceDeaths, shouldAbort, parseTraceDeaths, parseProvisioningDeaths, deriveDeaths, deathsInWindow } = require(path.join(__dirname, 'deaths.js'));

let pass = 0, fail = 0;
function t(name, cond) { console.log((cond ? 'PASS' : 'FAIL'), '|', name); cond ? pass++ : fail++; }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'deaths-suite-'));
const trace = path.join(tmp, 'trace.jsonl');
const row = (o) => fs.appendFileSync(trace, JSON.stringify(o) + '\n');
fs.writeFileSync(trace, '');
row({ kind: 'spawn' });
t('0 death rows -> count 0', countTraceDeaths(trace) === 0);
t('0 deaths -> no abort', !shouldAbort(countTraceDeaths(trace)));
row({ kind: 'death', ts: '2026-11-09T09:59:05.967Z' });
t('1 death row -> count 1', countTraceDeaths(trace) === 1);
t('1 death -> no abort', !shouldAbort(1));
row({ kind: 'cycle', cycle: 7 });
row({ kind: 'death', ts: '2026-11-09T09:59:43.370Z' });
row({ kind: 'death', ts: '2026-11-09T10:00:00.065Z' });
t('3 death rows -> count 3', countTraceDeaths(trace) === 3);
t('3 deaths -> ABORT predicate fires', shouldAbort(countTraceDeaths(trace)));
fs.appendFileSync(trace, '{"kind":"death","ts":"2026-11-09T10:00:11.415Z"'); // torn, no close
t('torn final line ignored (still 3)', countTraceDeaths(trace) === 3);
t('missing file -> count 0', countTraceDeaths(trace + '.absent') === 0);
t('parseTraceDeaths returns the 3 timestamps', parseTraceDeaths(trace).length === 3);

// Derivation: a record holding the first two deaths + the live trace
// holding all three must dedupe to exactly 3, windowed exactly.
const record = path.join(tmp, 'record.jsonl');
fs.writeFileSync(record, [
  { n: 1, citizen: 'Cody', ts: '2026-11-09T09:59:05.967Z', cause: 'Phantom (slain)', cause_verified: true },
  { n: 2, citizen: 'Cody', ts: '2026-11-09T09:59:43.370Z', cause: 'Skeleton (shot)', cause_verified: true },
].map((r) => JSON.stringify(r)).join('\n') + '\n');
const derived = deriveDeaths(record, [trace]);
t('derivation dedupes record+trace (3, not 5)', derived.length === 3);
const w = deathsInWindow(derived, '2026-11-09T09:00:00Z', '2026-11-10T09:00:00Z');
t('window 2026-11-09 AKST holds all 3', w.length === 3);
const w0 = deathsInWindow(derived, '2026-11-08T09:00:00Z', '2026-11-09T09:00:00Z');
t('window 2026-11-08 AKST holds 0 of these', w0.length === 0);
t('derived rows numbered in ts order', derived.every((r, i) => r.n === i + 1));

// Provisioning-evidence class (deaths-seam repair, 2026-11-09): the
// stand-only provisioning body is not a driver and leaves no trace; its
// DEATH-DURING-PROVISIONING row must move the derivation by exactly 1,
// and a provisioning store with no death row must move it by 0.
const provStore = path.join(tmp, 'provisioning-evidence.jsonl');
fs.writeFileSync(provStore, [
  { ts: '2026-11-10T07:38:22.266Z', kind: 'spawned', pos: { x: 28.8, y: 67, z: -104.1 }, hp: 16.67, food: 20 },
  { ts: '2026-11-10T07:38:27.720Z', kind: 'DEATH-DURING-PROVISIONING', deaths: 1 },
].map((r) => JSON.stringify(r)).join('\n') + '\n');
t('parseProvisioningDeaths returns the 1 provisioning death', parseProvisioningDeaths(provStore).length === 1);
t('provisioning death moves derivation by exactly 1 (3 -> 4)', deriveDeaths(record, [trace], [provStore]).length === 4);
const provClean = path.join(tmp, 'provisioning-clean.jsonl');
fs.writeFileSync(provClean, [
  { ts: '2026-11-10T06:53:08.633Z', kind: 'spawned', pos: { x: 36.5, y: 73, z: -86.5 }, hp: 20, food: 20 },
  { ts: '2026-11-10T06:53:40.639Z', kind: 'quitting', ok: true, deaths: 0, hurt: 0 },
].map((r) => JSON.stringify(r)).join('\n') + '\n');
t('provisioning store with zero death rows moves derivation by 0 (still 3)', deriveDeaths(record, [trace], [provClean]).length === 3);
t('provisioning death dedupes against the record once rebuilt', deriveDeaths(record, [trace], [provStore]).filter((r) => r.ts === '2026-11-10T07:38:27.720Z').length === 1);

console.log(`\ndeaths suite: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
