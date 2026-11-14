'use strict';
// test-deaths-day6.js — DAY-6 REPAIR (4) carry-over proof: the
// day-4 test (pulse/test-deaths-day4.js) re-pointed at day 5's own
// trace path + the shipped lib/deaths.js. Same 12 assertions:
// the abort reads the day-6 trace's death rows; a torn line is not
// evidence; the driver source uses lib/deaths.js against the
// day-6 trace and never reads the stale deaths.jsonl.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { countTraceDeaths, shouldAbort } = require('/home/caseydigennaro/craftmind-league/pulse/lib/deaths.js');
let pass = 0, fail = 0;
function t(name, cond) { console.log((cond ? 'PASS' : 'FAIL'), '|', name); cond ? pass++ : fail++; }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dd5-deaths-'));
const trace = path.join(tmp, 'trace.jsonl');
const rows = [
  { kind: 'spawn' }, { kind: 'cycle', cycle: 1 },
  { kind: 'death', n: 1 }, { kind: 'cycle', cycle: 2 },
  { kind: 'death', n: 2 },
];
fs.writeFileSync(trace, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
fs.writeFileSync(path.join(tmp, 'empty.jsonl'), '');
t('empty file counts 0', countTraceDeaths(path.join(tmp, 'empty.jsonl')) === 0);
t('counts exactly the death rows (2)', countTraceDeaths(trace) === 2);
t('no abort at 2 deaths', !shouldAbort(countTraceDeaths(trace)));
fs.appendFileSync(trace, JSON.stringify({ kind: 'death', n: 3 }) + '\n');
t('third death counted (3)', countTraceDeaths(trace) === 3);
t('ABORT fires at 3 deaths', shouldAbort(countTraceDeaths(trace)));
fs.appendFileSync(trace, '{"kind":"death","n":4' + '\n'); // torn line
t('torn line ignored (still 3)', countTraceDeaths(trace) === 3);
t('missing file counts 0', countTraceDeaths(path.join(tmp, 'nope.jsonl')) === 0);
t('no abort at 0', !shouldAbort(0));
const driver = fs.readFileSync('/home/caseydigennaro/craftmind-league/pulse/direct-drive-day6.js', 'utf8');
t('driver requires lib/deaths.js', /lib', 'deaths\.js'\)|lib\/deaths\.js/.test(driver));
t('driver counts from its day-6 trace', driver.includes("direct-drive-trace-day6-20261109.jsonl") && driver.includes('countTraceDeaths(TRACE_PATH)'));
t('driver aborts via shouldAbort', driver.includes('shouldAbort(deathsThisRun)'));
t('driver never reads the stale deaths.jsonl', !/readFileSync\([^)]*deaths\.jsonl/.test(driver) && !driver.includes("path.join(PULSE, 'deaths.jsonl')"));
console.log(`\ndeaths carry-over: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
