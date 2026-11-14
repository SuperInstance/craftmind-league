'use strict';
/**
 * test-deaths-day4.js — DRY PROOF of repair (1): the 3-death abort.
 *
 * Writes a synthetic trace, counts deaths with the SHIPPED counter
 * (pulse/lib/deaths.js), and checks the abort predicate at 2 and 3.
 * Then statically verifies the installed driver wires the bot's
 * server-driven 'death' event to that counter and the main loop to
 * the predicate, and that NOTHING in the driver still reads
 * deaths.jsonl. Exit 0 = proof holds; exit 1 = it does not.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { countTraceDeaths, shouldAbort } = require('/home/caseydigennaro/craftmind-league/pulse/lib/deaths.js');

let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + ' — ' + name);
  if (!cond) failures++;
}

const scratch = path.join(os.tmpdir(), 'dd4-deaths-drytest.jsonl');
fs.writeFileSync(scratch, '');
const row = (o) => fs.appendFileSync(scratch, JSON.stringify(o) + '\n');
row({ kind: 'spawn', pos: { x: 0, y: 64, z: 0 } });
row({ kind: 'cycle', cycle: 1, cmd: 'goto 1 64 1' });
check('0 death rows -> count 0', countTraceDeaths(scratch) === 0);
check('0 deaths -> no abort', !shouldAbort(countTraceDeaths(scratch)));
row({ kind: 'death', n: 1 });
row({ kind: 'cycle', cycle: 2, cmd: 'wait 5' });
row({ kind: 'death', n: 2 });
check('2 death rows -> count 2', countTraceDeaths(scratch) === 2);
check('2 deaths -> no abort (the day continues)', !shouldAbort(countTraceDeaths(scratch)));
row({ kind: 'floor-escape', msg: 'synthetic' });
row({ kind: 'death', n: 3 });
check('3 death rows -> count 3', countTraceDeaths(scratch) === 3);
check('3 deaths -> ABORT FIRES', shouldAbort(countTraceDeaths(scratch)));
fs.appendFileSync(scratch, '{"kind":"death","n":4'); // torn line, no newline close
check('torn trailing line is not counted as evidence', countTraceDeaths(scratch) === 3);
check('missing file -> count 0 (fresh day)', countTraceDeaths(scratch + '.absent') === 0);

const driverSrc = fs.readFileSync('/home/caseydigennaro/craftmind-league/pulse/direct-drive.js', 'utf8');
check("driver counts via lib/deaths countTraceDeaths", /countTraceDeaths/.test(driverSrc));
check("driver's death handler feeds the counter from the bot 'death' event", /bot\.on\('death'[\s\S]{0,300}deathsThisRun\+\+/.test(driverSrc));
check('main loop aborts on shouldAbort(deathsThisRun)', /shouldAbort\(deathsThisRun\)/.test(driverSrc));
check('driver never reads deaths.jsonl for counting', !/readFileSync\(DEATHS_PATH/.test(driverSrc) && !/deathsNow/.test(driverSrc));

fs.unlinkSync(scratch);
console.log(failures === 0 ? 'DRY PROOF: HOLDS' : `DRY PROOF: ${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
