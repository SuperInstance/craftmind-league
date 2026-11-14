'use strict';
/**
 * test-dig-guard.js — DAY-13 FIXTURE for the driver dig-guard
 * (charter §2). Offline; no server, no world. It extracts the guard
 * span (DIG-GUARD-BEGIN..END) from the REAL day-13 driver source and
 * exercises digGuardDig with stubbed bot/prims/trace/log, so the
 * code under test is the code that ships — not a copy. It also
 * asserts the wiring: in the driver's dig branch, the guard is
 * consulted BEFORE prims.digBlock executes the dig.
 */
const fs = require('fs');
const path = require('path');
const SRC = fs.readFileSync(path.join(__dirname, 'direct-drive-day13.js'), 'utf8');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? ' — ' + extra : '')); }
}

// ── extract the shipped guard code ────────────────────────────────
const b = SRC.indexOf('// DIG-GUARD-BEGIN');
const e = SRC.indexOf('// DIG-GUARD-END');
check('guard span present in driver source', b >= 0 && e > b);
const span = SRC.slice(b, e);

// ── stubs ──────────────────────────────────────────────────────────
let rows = [];
let invNow = { cobblestone: 1 };
const prims = { inv: () => ({ ...invNow }) };
const trace = (r) => rows.push(r);
const log = () => {};
const factory = new Function('prims', 'trace', 'log',
  span + '\nreturn { digGuard, digGuardCap, digGuardRefuses, digGuardDig, STONE_BLOCKS };');
const G = factory(prims, trace, log);
const botAt = (x, y, z) => ({ entity: { position: { x, y, z } } });
const dig = (bot, x, y, z, name) => G.digGuardDig(bot, { x, y, z }, name ? { name } : null);

// ── case 1: unarmed — a stone dig arms the guard and is permitted ──
rows = []; invNow = { cobblestone: 1 };
let r = dig(botAt(71.4, 63.0, -88.6), 71, 62, -89, 'stone');
check('arm: first stone dig permitted', r.refuse === false);
check('arm: entry recorded = stance feet level (63)', G.digGuard.entry === 63, 'entry=' + G.digGuard.entry);
check('arm: trace row dig-guard-arm filed', rows.some((t) => t.kind === 'dig-guard-arm' && t.entry === 63 && t.reason === 'stone-phase-entry'));
check('arm: cap = entry-2 (61)', G.digGuardCap() === 61);

// ── case 2: at-cap dig permitted (top == cap) ──────────────────────
r = dig(botAt(71.4, 62.0, -88.6), 71, 60, -89, 'stone');
check('at-cap: dig with top == cap (61) permitted', r.refuse === false);

// ── case 3: below-cap dig REFUSED, trace-rowed, never silent ───────
rows = [];
r = dig(botAt(71.4, 61.0, -88.6), 71, 59, -89, 'stone');
check('below-cap: dig with top 60 < cap 61 refused', r.refuse === true);
check('below-cap: refusal carries a truthful reason naming entry + cap',
  /refused/.test(r.detail) && /level 63/.test(r.detail) && /level 61/.test(r.detail));
check('below-cap: trace row dig-guard filed with target + entry + cap',
  rows.some((t) => t.kind === 'dig-guard' && t.refused && t.refused.y === 59 && t.entry === 63 && t.cap === 61 && t.refusedCount === 1));

// ── case 4: lateral dig at foot level permitted ─────────────────────
r = dig(botAt(71.4, 61.0, -88.6), 72, 60, -89, 'stone');
check('lateral: dig at the capped level (top 61) permitted', r.refuse === false);

// ── case 5: the guard binds every dig while armed (dirt too) ───────
r = dig(botAt(71.4, 61.0, -88.6), 71, 58, -89, 'dirt');
check('armed: a dirt dig below cap is also refused (the hole does not care what it is made of)', r.refuse === true);

// ── case 6: re-arm at a genuinely new stance ────────────────────────
rows = [];
r = dig(botAt(62.3, 67.0, -92.4), 62, 66, -92, 'stone');
check('new-stance: stone dig >6 blocks from the arm point re-arms', r.refuse === false &&
  rows.some((t) => t.kind === 'dig-guard-arm' && t.reason === 'new-stance' && t.entry === 67 && t.prevEntry === 63));
check('new-stance: entry now 67, cap 65', G.digGuard.entry === 67 && G.digGuardCap() === 65);
r = dig(botAt(62.3, 66.0, -92.4), 62, 63, -92, 'stone');
check('new-stance: the NEW cap binds (top 64 < 65 refused)', r.refuse === true);

// ── case 7: count closed -> disarm, filed, cap no longer binds ──────
rows = []; invNow = { cobblestone: 8 };
r = dig(botAt(62.3, 66.0, -92.4), 62, 63, -92, 'stone');
check('disarm: with read-back cobble >= 8 the same dig is permitted', r.refuse === false);
check('disarm: trace row dig-guard-disarm filed (count-closed)', rows.some((t) => t.kind === 'dig-guard-disarm' && t.reason === 'count-closed' && t.held === 8));

// ── case 8: wiring — the guard is consulted before the dig executes ─
const digBranch = SRC.indexOf("if (verb === 'dig'");
const guardCall = SRC.indexOf('digGuardDig(bot, pos, blk)', digBranch);
const digExec = SRC.indexOf('prims.digBlock(bot, pos, 25000)', digBranch);
check('wiring: dig branch calls digGuardDig before prims.digBlock', digBranch >= 0 && guardCall > digBranch && digExec > guardCall);
check('wiring: refusal returns before execution (dg.refuse early-return present)',
  SRC.indexOf('if (dg.refuse) return { ok: false, detail: dg.detail };', digBranch) > guardCall);

console.log(`\nDIG-GUARD FIXTURE: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
