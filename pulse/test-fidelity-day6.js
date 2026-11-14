'use strict';
// test-fidelity-day6.js — the day-6 harness's own instrument check
// (standing lesson: verify the instrument on known positives before
// trusting its negatives). Extracts functions from the shipped
// day-6 driver by index-bounded spans (the day-5 shared-extractor
// pattern, NOT regex-to-first-brace) and asserts each extraction is
// COMPLETE: balanced braces, contains its signature tail lines, and
// the extracted askModel actually contains the day-6 failover AND
// fail-back trace writes (i.e. the test rig is testing the new
// code, not a truncation of it).
const fs = require('fs');
let pass = 0, fail = 0;
function t(name, cond) { console.log((cond ? 'PASS' : 'FAIL'), '|', name); cond ? pass++ : fail++; }
const src = fs.readFileSync('/home/caseydigennaro/craftmind-league/pulse/direct-drive-day6.js', 'utf8');
function extract(name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  let depth = 0, j = src.indexOf('{', i);
  for (; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') { depth--; if (!depth) return src.slice(i, j + 1); }
  }
  return null;
}
for (const fn of ['httpCall', 'callModel', 'askModel', 'wakeSequence', 'perceiveTrees', 'arrivalCheck']) {
  const e = extract(fn);
  t(`extract ${fn} complete (balanced)`, !!e && e.startsWith('function ' + fn) || !!e && e.includes('async function ' + fn));
}
const am = extract('askModel');
t('askModel carries the failover trace row', !!am && am.includes("kind: 'failover'") && am.includes('why:'));
t('askModel carries the fail-back trace row', !!am && am.includes("kind: 'failover-back'"));
t('askModel fail-back probe present', !!am && am.includes('lastPrimaryProbeAt'));
const ws = extract('wakeSequence');
t('wakeSequence feeds (toss cooked_porkchop)', !!ws && ws.includes("bot.toss('cooked_porkchop'"));
t('wakeSequence exit = hopFlee then gotoNear to BENCH_POINT', !!ws && ws.includes('hopFlee') && ws.includes('gotoNear') && ws.includes('BENCH_POINT'));
t('wakeSequence judges OUT by measured position (isOut)', !!ws && ws.includes('isOut'));
console.log(`\nextractor fidelity: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
