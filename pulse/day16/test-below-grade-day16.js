'use strict';
/**
 * test-below-grade-day16.js — DAY-16 FIXTURE for the BELOW-GRADE
 * GUARD (charter sec.1; day-15 record sec.6(a) — the named
 * prevention). Offline; no server, no world. It extracts the guard
 * span (BELOW-GRADE-GUARD-BEGIN..END) from the REAL day-16 driver
 * source and exercises belowGradeGuard with stubbed bot/prims/
 * trace/log, so the code under test is the code that ships — not a
 * copy. It also asserts the wiring: in the driver's goto and dig
 * branches, the guard is consulted BEFORE anything executes.
 *
 * The rule (charter sec.1): INSIDE THE HOME DISTRICT, while he
 * holds NO pickaxe, refuse (a) any goto whose target feet level is
 * >= 2 below pad level (pad feet 67 — refuse ty <= 65), and (b)
 * any dig whose target block TOP is >= 2 below the pad top
 * (pad top 66 — refuse top <= 64). Refusals trace-rowed.
 * Permitted moves at/above the bound pass. Holding a pickaxe (the
 * held-state read, incl. the live prims.inv re-read) disarms.
 * Outside the district the guard does not fire.
 */
const fs = require('fs');
const path = require('path');
const SRC = fs.readFileSync(path.join(__dirname, 'direct-drive-day16.js'), 'utf8');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? ' — ' + extra : '')); }
}

const b = SRC.indexOf('// BELOW-GRADE-GUARD-BEGIN');
const e = SRC.indexOf('// BELOW-GRADE-GUARD-END');
check('guard span present in driver source', b >= 0 && e > b);
const span = SRC.slice(b, e);
check('span carries the pad ground truth (66/67)', span.includes('BGG_PAD_TOP = 66') && span.includes('BGG_PAD_FEET = 67'));

function freshGuard() {
  const rows = [];
  let invNow = {};
  const prims = { inv: () => ({ ...invNow }) };
  const factory = new Function('prims', 'trace', 'log',
    span + '\nreturn { belowGradeGuard, woodChain, setWoodChain: (v) => { woodChain = v; }, BGG_PAD_TOP, BGG_PAD_FEET, BGG_HOME };');
  const G = factory(prims, (r) => rows.push(r), () => {});
  return { G, rows, setInv: (o) => { invNow = o; } };
}
const botAt = (x, y, z) => ({ entity: { position: { x, y, z } } });
const PAD = botAt(62.5, 67, -93); // standing on the pad, home district

// ── group A: goto bound, tool-less, in district ──────────────────
{
  const { G, rows } = freshGuard();
  let r = G.belowGradeGuard(PAD, 'goto', 61, 63, -91);
  check('A goto to feet 63 (the day-15 bowl entry) refused', r.refuse === true && r.reason === 'goto-below-pad');
  check('A refusal trace-rowed with kind/reason/target', rows.some((t) => t.kind === 'below-grade-guard' && t.reason === 'goto-below-pad' && t.refused.y === 63));
  r = G.belowGradeGuard(PAD, 'goto', 61, 65, -91);
  check('A goto to feet 65 (== pad-2) refused', r.refuse === true);
  r = G.belowGradeGuard(PAD, 'goto', 62, 66, -91);
  check('A goto to feet 66 (pad-1) permitted', r.refuse === false);
  r = G.belowGradeGuard(PAD, 'goto', 62, 67, -87);
  check('A goto at pad level permitted', r.refuse === false);
  r = G.belowGradeGuard(PAD, 'goto', 61, 70, -91);
  check('A goto ABOVE pad (the bowl exit direction) permitted', r.refuse === false);
}

// ── group B: dig bound, tool-less, in district ───────────────────
{
  const { G, rows } = freshGuard();
  let r = G.belowGradeGuard(PAD, 'dig', 63, 63, -91);
  check('B dig with top 64 (== pad top-2) refused', r.refuse === true && r.reason === 'dig-below-pad');
  check('B refusal trace-rowed', rows.some((t) => t.kind === 'below-grade-guard' && t.reason === 'dig-below-pad' && t.refused.y === 63));
  r = G.belowGradeGuard(PAD, 'dig', 63, 64, -91);
  check('B dig with top 65 (pad top-1) permitted', r.refuse === false);
  r = G.belowGradeGuard(PAD, 'dig', 61, 60, -91);
  check('B deep dig (top 61) refused', r.refuse === true);
}

// ── group C: the pickaxe disarms — BOTH read paths ───────────────
{
  const { G, setInv } = freshGuard();
  setInv({ wooden_pickaxe: 1 });
  let r = G.belowGradeGuard(PAD, 'goto', 61, 63, -91);
  check('C live held-read (prims.inv) disarms: goto 63 permitted', r.refuse === false);
  const g2 = freshGuard();
  g2.G.setWoodChain({ pickaxeInHand: true, verifiedCycle: 9 });
  r = g2.G.belowGradeGuard(PAD, 'dig', 63, 63, -91);
  check('C woodChain state disarms: dig top 64 permitted', r.refuse === false);
  setInv({ stone_pickaxe: 1 });
  r = G.belowGradeGuard(PAD, 'dig', 69, 60, -88);
  check('C a stone pickaxe also disarms (held read)', r.refuse === false);
}

// ── group D: outside the district the guard is silent ────────────
{
  const { G } = freshGuard();
  const far = botAt(30.5, 67, -100); // west of the district box
  let r = G.belowGradeGuard(far, 'goto', 30, 60, -100);
  check('D goto below bound outside district permitted (guard is home-only)', r.refuse === false);
  const bowl = botAt(61.7, 62, -91.3); // he wakes IN the bowl — inside the box
  r = G.belowGradeGuard(bowl, 'goto', 62, 67, -91);
  check('D from the bowl itself, the exit goto (up, feet 67) permitted', r.refuse === false);
}

// ── group E: wiring in the shipped driver ────────────────────────
{
  const gi = SRC.indexOf("belowGradeGuard(bot, 'goto'");
  const gp = SRC.indexOf('PIT-HAZARD GUARD');
  check('E goto branch consults the guard before the pit-guard/walker', gi > 0 && gp > gi);
  const di = SRC.indexOf("belowGradeGuard(bot, 'dig'");
  const dg = SRC.indexOf('const dg = digGuardDig');
  check('E dig branch consults the guard before the dig-guard', di > 0 && dg > di);
  check('E wood-chain held-state read is wired in the main loop', SRC.includes("kind: 'wood-chain-verified'") && SRC.includes('WOOD CHAIN VERIFIED'));
}

console.log(`\nBELOW-GRADE-DAY16 FIXTURE: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
