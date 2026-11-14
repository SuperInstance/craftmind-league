'use strict';
// test-arrival-day5.js — DAY-5 REPAIR (3) PROOF: arrival honesty.
// The shipped arrivalCheck (extracted verbatim from
// pulse/direct-drive-day5.js at test time) is run over synthetic
// measured positions modelled on day 4's own misreport anatomy:
// (a) walker's-own-success cases where the body actually stood far
//     off-target in the pit (his feet sat at (66.3,63,-92.6) while
//     gotos elsewhere "resolved" or timed out);
// (b) the day's last goto: target (64,67,-92) from the pit floor —
//     measured end (65.31,63,-92.52) — old code reported timeout
//     text, and 119 day-4 gotos reported "arrived near" on the
//     walker's flag alone (3D early-exit, ANY y, +0.6 slack);
// (c) honest arrivals that MUST pass: at cell, at cell +1y shelf,
//     adjacent-cell step.
// PASS = every false arrival reads NOT arrived with the actual
// position, and every true arrival reads arrived.
const fs = require('fs');
const src = fs.readFileSync('/home/caseydigennaro/craftmind-league/pulse/direct-drive-day5.js', 'utf8');
const m = src.match(/function arrivalCheck[\s\S]*?\n\}/);
if (!m) { console.log('FAIL: arrivalCheck not found in shipped driver'); process.exit(1); }
const arrivalCheck = eval('(' + m[0] + ')');
const botAt = (x, y, z) => ({ entity: { position: { x, y, z } } });
let pass = 0, fail = 0;
function t(name, bot, tx, ty, tz, want) {
  const r = arrivalCheck(bot, tx, ty, tz, 1.6);
  const ok = r.arrived === want;
  console.log((ok ? 'PASS' : 'FAIL'), '|', name, '| arrived =', r.arrived, '(want', want + ')', '| pos', JSON.stringify(r.pos), 'dist', r.dist, 'dy', r.dy);
  ok ? pass++ : fail++;
}
// — false arrivals from day 4's pit anatomy (body stuck at 66.3,63,-92.6) —
t('pit body, target pad NW (64,67,-92)', botAt(66.3, 63, -92.6), 64, 67, -92, false);
t('pit body, target wheat (65,67,-95)', botAt(66.3, 63, -92.6), 65, 67, -95, false);
t('pit body, target tree crown (62,72,-90)', botAt(66.3, 63, -92.6), 62, 72, -90, false);
t('pit floor, target stair top (64,66,-92)', botAt(65.31, 63, -92.52), 64, 66, -92, false); // the day's last goto: 3 below
t('beside target but 4 below (65,63,-92)->(65,67,-92)', botAt(65.4, 63, -92.4), 65, 67, -92, false);
t('3 blocks short horizontally', botAt(68.4, 67, -92.5), 65, 67, -92, false);
// — true arrivals that must pass —
t('standing in the target cell', botAt(65.4, 67, -92.4), 65, 67, -92, true);
t('adjacent cell, same level', botAt(66.3, 67, -92.5), 65, 67, -92, true);
t('one step up from target level (+1y)', botAt(65.5, 68, -92.5), 65, 67, -92, true);
t('stair top reached (64.5,66,-92.5)->(64,66,-92)', botAt(64.5, 66, -92.5), 64, 66, -92, true);
console.log(`\narrival honesty: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
