'use strict';
/**
 * test-dig-guard-day14.js — DAY-14 FIXTURE for the REVISED driver
 * dig-guard (charter §2; the extraction amendment's day-13
 * disposition R1/R2). Offline; no server, no world. It extracts
 * the guard span (DIG-GUARD-BEGIN..END) from the REAL day-14 driver
 * source and exercises digGuardDig with stubbed bot/prims/trace/
 * log, so the code under test is the code that ships — not a copy.
 * It also asserts the wiring: in the driver's dig branch, the
 * guard is consulted BEFORE prims.digBlock executes the dig.
 *
 * R1 (disarm only at home ground): count-closed away from home
 * files ONE dig-guard-disarm-deferred row and the guard STAYS
 * ARMED; count-closed inside the home box (x 57..68, z -99..-89)
 * disarms with reason 'count-closed-at-home'.
 * R2 (arm on falls): a downward discontinuity > 2 blocks between
 * dig considerations (re-)arms the guard at the landing level,
 * reason 'fall', fellFrom carried; drops of <= 2 never arm.
 */
const fs = require('fs');
const path = require('path');
const SRC = fs.readFileSync(path.join(__dirname, 'direct-drive-day14.js'), 'utf8');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? ' — ' + extra : '')); }
}

const b = SRC.indexOf('// DIG-GUARD-BEGIN');
const e = SRC.indexOf('// DIG-GUARD-END');
check('guard span present in driver source', b >= 0 && e > b);
const span = SRC.slice(b, e);
check('span carries the day-14 revision (fall check + home box)', span.includes('digGuardFallCheck') && span.includes('DIG_GUARD_HOME'));

function freshGuard() {
  const rows = [];
  let invNow = { cobblestone: 0 };
  const prims = { inv: () => ({ ...invNow }) };
  const factory = new Function('prims', 'trace', 'log',
    span + '\nreturn { digGuard, digGuardCap, digGuardRefuses, digGuardDig, digGuardFallCheck, digGuardAtHome, STONE_BLOCKS };');
  const G = factory(prims, (r) => rows.push(r), () => {});
  return { G, rows, setInv: (o) => { invNow = o; } };
}
const botAt = (x, y, z) => ({ entity: { position: { x, y, z } } });

// ── group A: the day-13 core, at the day-14 hollow stance ─────────
{
  const { G, rows, setInv } = freshGuard();
  const dig = (bot, x, y, z, name) => G.digGuardDig(bot, { x, y, z }, name ? { name } : null);
  setInv({ cobblestone: 1 });
  let r = dig(botAt(70.4, 64.0, -87.4), 70, 63, -88, 'stone');
  check('A arm: first stone dig permitted', r.refuse === false);
  check('A arm: entry = stance feet level (64)', G.digGuard.entry === 64, 'entry=' + G.digGuard.entry);
  check('A arm: row dig-guard-arm/stone-phase-entry filed', rows.some((t) => t.kind === 'dig-guard-arm' && t.reason === 'stone-phase-entry' && t.entry === 64));
  check('A arm: cap = entry-2 (62)', G.digGuardCap() === 62);
  r = dig(botAt(70.4, 63.0, -87.4), 70, 61, -88, 'stone');
  check('A at-cap: dig with top == cap (62) permitted', r.refuse === false);
  rows.length = 0;
  r = dig(botAt(70.4, 62.0, -87.4), 70, 60, -88, 'stone');
  check('A below-cap: dig with top 61 < cap 62 refused', r.refuse === true);
  check('A below-cap: detail names entry + cap', /refused/.test(r.detail) && /level 64/.test(r.detail) && /level 62/.test(r.detail));
  check('A below-cap: row dig-guard filed (target, entry, cap, count)', rows.some((t) => t.kind === 'dig-guard' && t.refused.y === 60 && t.entry === 64 && t.cap === 62 && t.refusedCount === 1));
  r = dig(botAt(70.4, 62.0, -87.4), 71, 61, -88, 'stone');
  check('A lateral: dig at the capped level (top 62) permitted', r.refuse === false);
  r = dig(botAt(70.4, 62.0, -87.4), 70, 59, -88, 'dirt');
  check('A armed: dirt dig below cap also refused', r.refuse === true);
}

// ── group B: R1 — disarm only at home ground ───────────────────────
{
  const { G, rows, setInv } = freshGuard();
  const dig = (bot, x, y, z, name) => G.digGuardDig(bot, { x, y, z }, name ? { name } : null);
  setInv({ cobblestone: 3 });
  dig(botAt(70.4, 64.0, -87.4), 70, 63, -88, 'stone'); // arm at the hollow, entry 64
  setInv({ cobblestone: 8 }); // the count closes OUT at the hollow
  rows.length = 0;
  let r = dig(botAt(70.4, 64.0, -87.4), 71, 63, -88, 'stone');
  check('B R1: count-closed away from home does NOT disarm', G.digGuard.disarmed === false);
  check('B R1: defer row filed once (count-closed-away-from-home)', rows.filter((t) => t.kind === 'dig-guard-disarm-deferred').length === 1 && rows.some((t) => t.kind === 'dig-guard-disarm-deferred' && t.reason === 'count-closed-away-from-home' && t.held === 8));
  dig(botAt(70.4, 64.0, -87.4), 71, 63, -87, 'stone');
  check('B R1: second consideration files no second defer row', rows.filter((t) => t.kind === 'dig-guard-disarm-deferred').length === 1);
  r = dig(botAt(70.4, 62.0, -87.4), 70, 60, -88, 'stone');
  check('B R1: the cap still binds after the deferral (top 61 refused)', r.refuse === true);
  rows.length = 0;
  r = dig(botAt(64.2, 67.0, -94.3), 64, 66, -94, 'dirt'); // a dig consideration AT HOME (the table)
  check('B R1: count-closed at home ground disarms', G.digGuard.disarmed === true);
  check('B R1: disarm row reason count-closed-at-home', rows.some((t) => t.kind === 'dig-guard-disarm' && t.reason === 'count-closed-at-home' && t.held === 8));
  r = dig(botAt(64.2, 66.0, -94.3), 64, 60, -94, 'stone');
  check('B R1: after the home disarm the old cap no longer binds', r.refuse === false);
}

// ── group C: R2 — arm on falls ─────────────────────────────────────
{
  const { G, rows, setInv } = freshGuard();
  const dig = (bot, x, y, z, name) => G.digGuardDig(bot, { x, y, z }, name ? { name } : null);
  setInv({ cobblestone: 0 });
  dig(botAt(70.4, 65.0, -87.4), 70, 64, -87, 'dirt'); // a dig consideration at the rim: no arm (dirt, no fall yet)
  check('C R2: a plain dirt dig at the rim does not arm', G.digGuard.entry === null && rows.filter((t) => t.kind === 'dig-guard-arm').length === 0);
  rows.length = 0;
  const r = dig(botAt(70.4, 59.0, -87.4), 70, 58, -87, 'dirt'); // he is now at the hole floor: drop 65 -> 59
  check('C R2: a drop > 2 arms the guard at the landing level', G.digGuard.entry === 59 && G.digGuard.disarmed === false, 'entry=' + G.digGuard.entry);
  check('C R2: arm row reason fall, fellFrom carried', rows.some((t) => t.kind === 'dig-guard-arm' && t.reason === 'fall' && t.entry === 59 && t.fellFrom === 65));
  check('C R2: the landing dig itself (top 59, cap 57) is permitted — notch work stays legal', r.refuse === false);
  const r2 = dig(botAt(70.4, 59.0, -87.4), 70, 55, -87, 'stone');
  check('C R2: deepening below the landing cap (top 56 < 57) is refused', r2.refuse === true);
}
{
  const { G, rows, setInv } = freshGuard();
  const dig = (bot, x, y, z, name) => G.digGuardDig(bot, { x, y, z }, name ? { name } : null);
  setInv({ cobblestone: 0 });
  dig(botAt(70.4, 65.0, -87.4), 70, 64, -87, 'dirt');
  dig(botAt(70.4, 63.0, -87.4), 70, 62, -87, 'dirt'); // drop of exactly 2 (walked steps)
  check('C R2: a drop of exactly 2 does NOT arm', G.digGuard.entry === null && rows.filter((t) => t.kind === 'dig-guard-arm').length === 0);
  dig(botAt(70.4, 62.0, -87.4), 70, 61, -87, 'dirt'); // another single step down
  check('C R2: stepwise descent never arms', G.digGuard.entry === null);
}

// ── group D: wiring — the guard is consulted before the dig executes ─
{
  const digBranch = SRC.indexOf("if (verb === 'dig'");
  const guardCall = SRC.indexOf('digGuardDig(bot, pos, blk)', digBranch);
  const digExec = SRC.indexOf('prims.digBlock(bot, pos, 25000)', digBranch);
  check('D wiring: dig branch calls digGuardDig before prims.digBlock', digBranch >= 0 && guardCall > digBranch && digExec > guardCall);
  check('D wiring: refusal returns before execution', SRC.indexOf('if (dg.refuse) return { ok: false, detail: dg.detail };', digBranch) > guardCall);
}

console.log(`\nDIG-GUARD-DAY14 FIXTURE: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
