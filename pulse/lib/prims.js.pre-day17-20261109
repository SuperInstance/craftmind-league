'use strict';
/**
 * prims.js — SEEDED PRIMITIVES for the Pulse.  ★ DECLARED SEEDED CODE ★
 *
 * Hand-written substrate (the mineflayer layer of the stack): small,
 * timeout-guarded, never-throwing helpers that smith-authored skills
 * compose. These are NOT smith products — they are the workbench the
 * smith writes on top of, declared loudly in pulse/README.md.
 *
 * Contract: every async function resolves a result object and never
 * throws:  { ok: true, ... } | { ok: false, error: '...' }
 * Lines beginning with `// prim:` are extracted verbatim into the
 * smith's API surface by smith.js — keep them accurate.
 */
const path = require('path');
const CM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const { goals, Movements } = require(path.join(CM, 'mineflayer-pathfinder'));
const { Vec3 } = require(path.join(CM, 'vec3'));

const _mc = {};
function mcData(bot) {
  if (!_mc[bot.version]) _mc[bot.version] = require(path.join(CM, 'minecraft-data'))(bot.version);
  return _mc[bot.version];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// prim: sleep(ms) -> Promise that resolves after ms
// prim: inv(bot) -> { itemName: count } — inventory snapshot
function inv(bot) {
  const out = {};
  for (const it of bot.inventory.items()) out[it.name] = (out[it.name] || 0) + it.count;
  return out;
}

// prim: countItem(bot, name) -> number of `name` in inventory (0 if none)
function countItem(bot, name) {
  return inv(bot)[name] || 0;
}

// prim: hasItem(bot, name, n=1) -> boolean
function hasItem(bot, name, n = 1) {
  return (inv(bot)[name] || 0) >= n;
}

// ── dig-step allowance (DECLARED, gate-scoped; added 2026-11-07) ─────
// Default OFF. Gate 0's wall was terrain, not body: a +2 step — and a
// +1 step capped with leaf_litter (this Paper build collides with
// litter at fractional pile heights even though prismarine-data calls
// it collision-free) — is unclimbable by walking, by jump, and by the
// walk-only pathfinder, for ANY body (proven by fresh-entity control).
// When a gate skill enables this (setDigStep(true)), walkTo's helm may
// dig ONE block out of such a step: the top block of a +2, or the
// litter capping a +1. Digging a step is a locomotion primitive the
// seeded set already declares (digBlock); the walk-only travel config
// was a choice, not a law. Every use is counted and logged here, and
// the gate skill reads digStepStats() into its result, so gate
// evidence always shows the count — the gate never silently becomes
// a digging test. Trials run with the default (off) unless a skill
// explicitly enables it in its own source.
const _digStep = { enabled: false, uses: 0, log: [], evals: [] };

// prim: setDigStep(on) -> boolean — DECLARED gate allowance: arm/disarm the helm's dig-step in walkTo (dig one block out of an unclimbable +2 step, or the leaf_litter capping a +1). Default off.
function setDigStep(on) {
  _digStep.enabled = !!on;
  return _digStep.enabled;
}

// prim: digStepStats() -> {enabled, uses, log:[{ts, at, block, reason}], evals:[...]} — every dig-step the helm has taken in this process, plus its recent step evaluations (front cell, measured step, decision); gate evidence reads this verbatim
function digStepStats() {
  return { enabled: _digStep.enabled, uses: _digStep.uses, log: _digStep.log.slice(), evals: _digStep.evals.slice() };
}

const DIGGABLE_STEP = /^(grass_block|dirt|coarse_dirt|rooted_dirt|leaf_litter|stone|gravel|sand|mud)$/;

// Evaluate ONE front cell (fx, fz) and dig its step if it qualifies.
// Returns true only if a block was actually dug.
async function digStepCell(bot, fx, fz, myTop) {
  const pos = bot.entity.position;
  let fb = null;
  for (let y = Math.min(250, myTop + 6); y > myTop - 6; y--) {
    const b = bot.blockAt(new Vec3(fx, y, fz));
    if (b && b.boundingBox === 'block' && !/_leaves$/.test(b.name)) { fb = y; break; }
  }
  if (fb === null) return false;
  const step = (fb + 1) - myTop;
  const above = bot.blockAt(new Vec3(fx, fb + 1, fz));
  const ev = { ts: new Date().toISOString(), front: { x: fx, z: fz }, top: fb, step, above: above ? above.name : null, action: 'none' };
  let digPos = null, reason = null;
  if (step === 2 && !(above && above.boundingBox === 'block' && above.name !== 'leaf_litter')) {
    digPos = new Vec3(fx, fb, fz); reason = 'plus2-top-block';
  } else if (step === 1 && above && above.name === 'leaf_litter') {
    digPos = new Vec3(fx, fb + 1, fz); reason = 'litter-on-plus1';
  }
  if (digPos) {
    const blk = bot.blockAt(digPos);
    if (blk && DIGGABLE_STEP.test(blk.name) && pos.distanceTo(digPos) <= 4.5) {
      try { await bot.lookAt(digPos.offset(0.5, 0.5, 0.5), true); } catch {}
      try {
        await Promise.race([
          bot.dig(blk, 'ignore'),
          sleep((bot.digTime ? bot.digTime(blk) : 3000) + 8000).then(() => { throw new Error('dig-step timeout'); }),
        ]);
        // VERIFY the dig took effect: bot.dig's promise resolves even
        // when the server cancels the break. Measured limit of this
        // check (dig tests, 2026-11-07): when spawn protection cancels
        // a dig, mineflayer's local world model can keep the block
        // removed for the REST OF THE SESSION while the server never
        // changed it — the block is simply back at the next login. So
        // this re-read catches only some cancellations; gate evidence
        // therefore judges locomotion by server-reported displacement,
        // never by dig counts. A dig this check catches as cancelled
        // is recorded in evals but is NOT a use.
        await sleep(400);
        const after = bot.blockAt(digPos);
        if (after && after.name === blk.name) {
          ev.action = 'dig-cancelled';
          _digStep.evals.push(ev); if (_digStep.evals.length > 50) _digStep.evals.shift();
          return false;
        }
        _digStep.uses++;
        _digStep.log.push({ ts: new Date().toISOString(), at: { x: digPos.x, y: digPos.y, z: digPos.z }, block: blk.name, reason });
        ev.action = 'dug:' + blk.name + ':' + reason;
        _digStep.evals.push(ev); if (_digStep.evals.length > 50) _digStep.evals.shift();
        return true;
      } catch (e) {
        try { bot.stopDigging(); } catch {}
        ev.action = 'dig-failed';
      }
    } else {
      ev.action = 'not-diggable';
    }
  }
  _digStep.evals.push(ev); if (_digStep.evals.length > 50) _digStep.evals.shift();
  return false;
}

// Attempt dig-steps toward `target`. The body is 0.6 wide: when it
// straddles a row boundary it collides with the step in BOTH rows
// (measured 2026-11-07: a single-row dig opened the row the body
// barely touched and the intact row still held it). Every front cell
// the body touches is evaluated; each dug block is its own counted
// use. Conservative by construction: only a +2 step (dig its top
// block -> +1) or a +1 step capped with leaf_litter (dig the litter);
// walls (a solid block above a +2 = step >= 3) and clean +1s are
// never dug.
async function digStepToward(bot, target) {
  const pos = bot.entity.position;
  const myTop = Math.round(pos.y);
  const dx = target.x - pos.x, dz = target.z - pos.z;
  if (Math.abs(dx) < 0.3 && Math.abs(dz) < 0.3) return false;
  const alongX = Math.abs(dx) >= Math.abs(dz);
  const sgn = alongX ? Math.sign(dx) : Math.sign(dz);
  const rows = new Set();
  if (alongX) { rows.add(Math.floor(pos.z - 0.31)); rows.add(Math.floor(pos.z + 0.31)); }
  else { rows.add(Math.floor(pos.x - 0.31)); rows.add(Math.floor(pos.x + 0.31)); }
  let dugAny = false;
  for (const r of rows) {
    const fx = alongX ? Math.floor(pos.x) + sgn : r;
    const fz = alongX ? r : Math.floor(pos.z) + sgn;
    if (await digStepCell(bot, fx, fz, myTop)) dugAny = true;
  }
  return dugAny;
}

// ── helm v3.3 helpers (declared 2026-11-07) ─────────────────────────
// columnTopAt: ground top (highest solid block, *_leaves excluded) of
// column (fx, fz), scanned around yHint. Same convention as
// digStepCell's scan; null when nothing solid is in range.
function columnTopAt(bot, fx, fz, yHint) {
  for (let y = Math.min(250, yHint + 6); y > yHint - 6; y--) {
    const b = bot.blockAt(new Vec3(fx, y, fz));
    if (b && b.boundingBox === 'block' && !/_leaves$/.test(b.name)) return y;
  }
  return null;
}

// frontStepUp: the step height (front ground top + 1, minus current
// feet level) of the WORST front cell the 0.6-wide body touches, in
// the facing direction toward target. Returns 1 only for a clean,
// head-clear +1 in every touched row (a litter cap reads as the
// ground under it — litter is not a 'block' bounding box — and a
// solid at head height over the step makes it a wall, not a step).
function frontStepUp(bot, target) {
  const pos = bot.entity.position;
  const dx = target.x - pos.x, dz = target.z - pos.z;
  if (Math.abs(dx) < 0.3 && Math.abs(dz) < 0.3) return 0;
  const alongX = Math.abs(dx) >= Math.abs(dz);
  const sgn = alongX ? Math.sign(dx) : Math.sign(dz);
  const feetY = Math.round(pos.y);
  const rows = new Set();
  if (alongX) { rows.add(Math.floor(pos.z - 0.31)); rows.add(Math.floor(pos.z + 0.31)); }
  else { rows.add(Math.floor(pos.x - 0.31)); rows.add(Math.floor(pos.x + 0.31)); }
  let worst = null;
  for (const r of rows) {
    const fx = alongX ? Math.floor(pos.x) + sgn : r;
    const fz = alongX ? r : Math.floor(pos.z) + sgn;
    const fb = columnTopAt(bot, fx, fz, feetY);
    if (fb === null) continue;
    const s = (fb + 1) - feetY;
    if (s === 1) {
      const head = bot.blockAt(new Vec3(fx, fb + 2, fz));
      if (head && head.boundingBox === 'block') return 0; // wall, not a step
    }
    if (worst === null || s > worst) worst = s;
  }
  return worst === null ? 0 : worst;
}

// frontFaceDist: distance from the body's front edge to the nearest
// STEP FACE in the facing direction toward target, across every row
// the 0.6-wide body touches (helm v3.5). A face is the first column
// in a row whose ground top rises above the body's feet level — the
// column the body would collide with next; the scan reads up to 3
// columns ahead. Returns {dist, step} for the NEAREST face, or null
// when no row rises within scan range. Same column convention as
// frontStepUp (leaves excluded; litter reads as the ground under it).
function frontFaceDist(bot, target) {
  const pos = bot.entity.position;
  const dx = target.x - pos.x, dz = target.z - pos.z;
  if (Math.abs(dx) < 0.3 && Math.abs(dz) < 0.3) return null;
  const alongX = Math.abs(dx) >= Math.abs(dz);
  const sgn = alongX ? Math.sign(dx) : Math.sign(dz);
  const feetY = Math.round(pos.y);
  const rows = new Set();
  if (alongX) { rows.add(Math.floor(pos.z - 0.31)); rows.add(Math.floor(pos.z + 0.31)); }
  else { rows.add(Math.floor(pos.x - 0.31)); rows.add(Math.floor(pos.x + 0.31)); }
  let bestFace = null;
  for (const r of rows) {
    for (let k = 1; k <= 3; k++) {
      const fx = alongX ? Math.floor(pos.x) + sgn * k : r;
      const fz = alongX ? r : Math.floor(pos.z) + sgn * k;
      const fb = columnTopAt(bot, fx, fz, feetY);
      if (fb === null) continue;
      const step = (fb + 1) - feetY;
      if (step <= 0) continue;
      // First rising column in this row: its near edge is the face.
      const plane = alongX ? (sgn > 0 ? fx : fx + 1) : (sgn > 0 ? fz : fz + 1);
      const edge = alongX ? (sgn > 0 ? pos.x + 0.3 : pos.x - 0.3) : (sgn > 0 ? pos.z + 0.3 : pos.z - 0.3);
      const dist = Math.abs(plane - edge);
      if (bestFace === null || dist < bestFace.dist) bestFace = { dist: +dist.toFixed(2), step };
      break;
    }
  }
  return bestFace;
}

// ── helm v3.4/v3.5/v3.6 recovery records (declared 2026-11-07) ──────────
// The most recent walkTo's wedge-release firings and stall-arbiter
// history, kept at module level so gate evidence can read the
// records even when a caller does not thread walkTo's return value
// through.
const _helm = { lastWedge: { cycles: 0, log: [] }, lastArbiter: { grants: 0, log: [] } };

// prim: wedgeStats() -> {cycles, log:[{kind, n?, at, windowProg?, before, after, dispCycle?, onGroundBefore, onGroundAfter, faceDistAtJump?, jumpKeyed?, releaseMode?, altDelta?, taps?, improvedBest?}]} — the WEDGE-RELEASE record of the most recent walkTo: every release cycle the helm fired (or the long backoff, the high-freeze hold, the best-in-sequence extension, or the exhaustion marker), with the trigger window's PROGRESS deficit (helm v3.5: distance-to-target improvement over the window; v3.4 logged raw displacement as windowDisp), the face distance at each jump start, and the body's position before/after the cycle; gate evidence reads this verbatim
function wedgeStats() {
  return { cycles: _helm.lastWedge.cycles, log: _helm.lastWedge.log.slice() };
}

// prim: arbiterStats() -> {grants, log:[{kind, recovery?, at, reason?, dist?, stuckForMs?, heldMs?, anchorD?, altDelta?}]} — the STALL ARBITER record of the most recent walkTo (helm v3.5): every ownership grant and release of a stall, with the granting distance/stuck time and the release reason (progress | exhausted | episode | no-shelf); gate evidence reads this verbatim
function arbiterStats() {
  return { grants: _helm.lastArbiter.grants, log: _helm.lastArbiter.log.slice() };
}

// prim: walkTo(bot, x, y, z, range=1.5, timeoutMs=45000) -> {ok, wedge?, arbiter?} — MANUAL HELM v3.6: steer by control states; set-and-hold facing (re-face ~2 s), MOMENTUM STEP-UP (while still moving, a detected clean +1 in the front row is jumped with forward held, so close-spaced +1s chain instead of face-planting), stall jump bursts, and the v3.5 STALL ARBITER: the four episodic stall recoveries — the WEDGE-RELEASE protocol, the GUARDED lateral step-search (never onto a step gained within the last 20 s, never up or down off the shelf), the backoff+settle, and the declared dig-step — are granted the stall ONE AT A TIME and an owner holds it until it resolves (target progress) or exhausts (its full cycle budget spent); while an owner holds the stall every other episodic recovery is suppressed and may not move the body at all, so the v3.4 duel (the backoff's limit oscillation masking the wedge trigger) is impossible by construction, not tuning. The trigger is PROGRESS-KEYED: distance-to-target failing to improve by >= 0.2 blocks over a 3 s window while forward intent is held — oscillation toward/away from a face nets ~zero progress and cannot mask it (v3.4 keyed on raw displacement, which a friendly recovery faked). The wedge cycle is release-first as v3.4 (backward pulse 0.5 s, settle, re-face) but its forward+jump phase is FACE-KEYED: the jump starts when the front-row column scan puts the face ~0.8-1.0 blocks ahead, so the apex carries the body onto the step; the face distance at every jump start is logged, and when no face is in scan range the cycle keeps the v3.4 hold timing. Wedge budget as v3.4: 3 cycles, one long backoff (or, at a high freeze, an extended hold — see (D) below), a final cycle, and — when the final cycle improved the episode's best progress — ONE extension cycle (E); then spent for the walk. Jump pulses (momentum step-up, stall bursts) are drive, not recovery — they never displace the body horizontally — and run only in unowned time or inside the current owner's drive window. Grants/releases are returned on the result ({arbiter}) and in arbiterStats(). HELM v3.6 adds: (D) at a HIGH freeze (the body holding >= +0.9 of gained altitude over the walk's standing level — e.g. frozen mid-air at a step top) the wedge cycle's release is POSITION-PRESERVING: no backward pulse and no long backoff (an extended hold instead), then short forward TAP drives from the hold — backward motion at altitude spends bought height (traverse-verify-3's long backoff slid the body 4.4 blocks west and surrendered both climbed steps); every cycle logs releaseMode ('backoff' | 'hold-tap') and altDelta. (E) Wedge exhaustion is judged on BEST-IN-SEQUENCE: spent only if no cycle of the episode improved the episode's best cycle-end progress (distance minimum / altitude maximum) and the final cycle made no net progress against its own start; a working final cycle earns ONE extension cycle. (F) DIG-GRANT CAP: at most one dig grant per stall episode unless a dig actually executed under dig's last ownership (digStepStats uses incremented since that grant), so a permanently-ripe-but-never-executed dig cannot alternate with the backoff and starve the guarded probe. Robust where the pathfinder stalls (see gotoNear note). ONLY when the declared dig-step allowance is armed (setDigStep): dig one block out of an unclimbable step (see digStepToward); every use is counted in digStepStats().
async function walkTo(bot, x, y, z, range = 1.5, timeoutMs = 45000) {
  if (!bot.entity) return { ok: false, error: 'no entity' };
  const target = new Vec3(x, y, z);
  const t0 = Date.now();
  const fmtP = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
  // STALL ACCOUNTING (helm v3.2 repair, declared 2026-11-07):
  // lastProgressAt moves ONLY on real distance improvement. Until
  // tonight the jump-burst and probe branches reset it as a throttle,
  // which silently capped stuckFor at ~1.9 s and made every escalation
  // keyed above that (lateral probes >6 s, everything downstream)
  // DEAD CODE — dig tests measured a helm that could only ever push
  // and jump in place. Escalations are now throttled by their own
  // lastXxxAt clocks; if an escalation works, `best` improves and the
  // stall clock resets honestly. (v3.5 keeps this accounting for the
  // drive primitives; the episodic recoveries are scheduled by the
  // arbiter below, keyed on the progress anchor.)
  let lastProgressAt = Date.now();
  let best = bot.entity.position.distanceTo(target);
  let bestAt = Date.now();
  let lastJumpAt = 0;
  let lastProbeAt = 0;
  let lastDigAt = 0;
  let lastBackoffAt = 0;
  let backoffs = 0;
  let lastFaceAt = 0;
  let side = 1;
  let probes = 0;
  // Helm v3.3 state: momentum step-up clock, plus peak-height
  // bookkeeping for the probe guard.
  let lastStepUpAt = 0;
  let startFeetY = null;
  let peakFeetY = null;
  let peakGainedAt = 0;
  // ── HELM v3.5 ARBITER STATE (declared 2026-11-07) ───────────────
  // Traverse-verify-2 measured the v3.4 failure precisely: the
  // wedge-release released the frozen-fall wedge it was built for
  // (leg E1, one cycle), then at the x54 face the v3.3 backoff's
  // limit oscillation (~2.7-block excursions, 7-10 s period) kept
  // 3 s net displacement >= 0.3 and silenced the displacement
  // trigger for ~65 s of both attempts — the recoveries duelled and
  // masked each other. v3.5 therefore changes WHO may act, WHEN the
  // stall is declared, and WHEN the jump starts:
  //  (A) SINGLE STALL OWNERSHIP: an arbiter grants a stall to
  //      exactly one episodic recovery at a time. The owner holds
  //      it until it resolves (progress: distance-to-target improves
  //      by >= 0.2 against the anchor) or exhausts (its full cycle
  //      budget: wedge = 3 cycles + long backoff + final cycle;
  //      dig = one episode + a 5 s conversion window; probe = one
  //      episode; backoff = one episode + a 3 s conversion window).
  //      While an owner holds, the other episodic recoveries are
  //      not evaluated for movement AT ALL — a duelling limit cycle
  //      is impossible by construction. Fairness: a recovery that
  //      exhausted cannot be re-granted until another recovery has
  //      owned the stall since, or 10 s pass.
  //  (B) PROGRESS-KEYED TRIGGER: the stall statistic is the
  //      distance to the current waypoint (progAnchorD/progAnchorAt
  //      — the distance at the last >= 0.2 improvement, and when).
  //      A stall is intent held + the anchor unmoved for 3 s.
  //      Oscillation toward/away from the face improves the
  //      distance by ~0 and can no longer mask the trigger.
  //  (C) FACE-KEYED JUMP TIMING: inside the wedge cycle, see
  //      wedgeCycleRun.
  // ── HELM v3.6 (declared 2026-11-07), answering traverse-verify-3:
  //  (D) POSITION-PRESERVING RELEASE AT HIGH FREEZES: v3.5's three
  //      mechanisms all fired as designed at leg E2 and the wall
  //      moved UP — the body froze MID-AIR at the litter-capped
  //      step top (feet ~68.1, ~1.25 over the x53 plateau), where
  //      the short cycles only bobbed and the 1.5 s long backoff
  //      let the body fall and slide 4.4 blocks west, surrendering
  //      both climbed steps. When a stall is detected with the
  //      body holding >= +0.9 of gained altitude over the walk's
  //      standing level, the wedge's backoff components are
  //      replaced by HOLD-AND-TAP: no back pulse, no long backoff
  //      (an extended hold instead); short forward taps from the
  //      hold. Ground-level stalls keep the v3.5 cycle untouched.
  //      Every cycle logs releaseMode + altDelta.
  //  (E) EXHAUSTION JUDGED ON BEST-IN-SEQUENCE: the wedge is
  //      spent only if no cycle of the episode improved the
  //      episode's best cycle-end progress (distance minimum or
  //      altitude maximum) AND the final cycle made no net
  //      progress against its own start; otherwise the final
  //      cycle earns ONE extension cycle. (Traverse-verify-3's
  //      final cycle re-bought 4.003 blocks and was declared
  //      exhausted 0.75 short of the pre-backoff anchor — at its
  //      moment of success.)
  //  (F) DIG-GRANT CAP: dig may be granted at most once per stall
  //      episode unless a dig actually executed under its last
  //      ownership (digStepStats uses incremented since that
  //      grant). Traverse-verify-3: after wedge exhaustion, dig's
  //      permanently-true ripeness alternated with the backoff
  //      for ~45-57 s and starved the guarded probe, with
  //      digUses 0 — the body was never at the face under dig
  //      ownership anyway.
  let intentAt = 0;
  let progAnchorD = best;
  let progAnchorAt = Date.now();
  let stallOwner = null; // {name, grantedAt, phase: 'act'|'await'|'convert', deadline}
  const arbiterLog = [];
  let arbiterGrants = 0;
  let grantSeq = 0;
  const exhaustMark = {}; // name -> {seq, at}
  // Wedge-release budget (walk-scoped, as v3.4).
  let wedgeCycles = 0;
  let wedgeLongDone = false;
  let wedgeSpent = false;
  const wedgeLog = [];
  // ── HELM v3.6 STATE (declared 2026-11-07) ───────────────────────
  // startStandY: the feet level the body first STANDS on in this
  // walk — the standing level a freeze's altitude is measured
  // against (fix D). wedgeEpBest*: the wedge episode's best
  // cycle-end progress so far (fix E). wedgeExtended: the
  // episode's one best-in-sequence extension has been granted.
  // digGrantsThisStall / digUsesAtLastDigGrant: the dig-grant
  // cap's stall-episode bookkeeping (fix F) — an episode runs
  // from one progress event to the next.
  let startStandY = null;
  let wedgeEpBestEndD = null;
  let wedgeEpBestEndY = null;
  let wedgeExtended = false;
  let digGrantsThisStall = 0;
  let digUsesAtLastDigGrant = null;

  const res = () => ({ wedge: { cycles: wedgeCycles, log: wedgeLog }, arbiter: { grants: arbiterGrants, log: arbiterLog } });

  // ── HELM v3.6 HELPERS (declared 2026-11-07) ─────────────────────
  // altDeltaNow: the body's current altitude over the walk's
  // standing level (startStandY — the first feet level the body
  // actually stood on this walk; startFeetY until then).
  // highFreezeNow: the body is holding at least one full step of
  // gained altitude (>= +0.9) — the traverse-verify-3 freeze shape.
  function altDeltaNow() {
    const base = startStandY !== null ? startStandY : startFeetY;
    return base === null ? 0 : bot.entity.position.y - base;
  }
  function highFreezeNow() { return altDeltaNow() >= 0.9; }
  // A progress event ends the current stall episode: the dig-grant
  // cap (fix F) re-arms for the next stall.
  function resetStallEpisode() {
    digGrantsThisStall = 0;
    digUsesAtLastDigGrant = null;
  }
  function releaseOwner(reason, dNow) {
    if (!stallOwner) return;
    arbiterLog.push({ kind: 'release', recovery: stallOwner.name, at: new Date().toISOString(), reason, heldMs: Date.now() - stallOwner.grantedAt, dist: +(dNow !== undefined ? dNow : bot.entity.position.distanceTo(target)).toFixed(2) });
    if (reason !== 'progress') exhaustMark[stallOwner.name] = { seq: grantSeq, at: Date.now() };
    if (reason === 'progress') resetStallEpisode();
    stallOwner = null;
  }
  function fair(name) {
    const m = exhaustMark[name];
    if (!m) return true;
    return grantSeq > m.seq || (Date.now() - m.at) > 10000;
  }
  function atFreshGainNow() {
    const p = bot.entity.position;
    return bot.entity.onGround && peakFeetY !== null &&
      p.y >= peakFeetY - 0.05 && peakFeetY >= (startFeetY || 0) + 0.9 &&
      (Date.now() - peakGainedAt) < 20000;
  }
  function pickRecovery() {
    // Priority: the wedge-release first (it is the only recovery
    // designed against the frozen-fall stream); then the dig-step
    // when its v3.4 ripeness is met (best unmoved ~6 s); then the
    // guarded probe; then the backoff — traverse-verify-2's duellist
    // goes last and can no longer mask anyone.
    if (!wedgeSpent) return 'wedge';
    // DIG-GRANT CAP (helm v3.6, fix F): at most one dig grant per
    // stall episode, re-armed only when a dig actually executed
    // under dig's last ownership (digStepStats uses incremented
    // since that grant). Traverse-verify-3: dig's ripeness is
    // permanently true in a hard stall, so dig and backoff
    // alternated for ~45-57 s after wedge exhaustion and the
    // guarded probe starved — with digUses 0 throughout.
    if (_digStep.enabled && (Date.now() - bestAt > 6000) && fair('dig') && (digGrantsThisStall === 0 || (digUsesAtLastDigGrant !== null && _digStep.uses > digUsesAtLastDigGrant))) return 'dig';
    if (probes < 8 && bot.entity.onGround && !atFreshGainNow() && fair('probe')) return 'probe';
    if (fair('backoff')) return 'backoff';
    return null;
  }
  function grantOwner(name, dNow, stuckFor) {
    grantSeq++; arbiterGrants++;
    stallOwner = { name, grantedAt: Date.now(), phase: 'act', deadline: 0 };
    arbiterLog.push({ kind: 'grant', recovery: name, at: new Date().toISOString(), dist: +dNow.toFixed(2), stuckForMs: stuckFor, anchorD: +progAnchorD.toFixed(2), altDelta: +altDeltaNow().toFixed(2) });
    // v3.6 bookkeeping: a wedge grant opens a fresh episode for
    // best-in-sequence exhaustion (fix E); a dig grant spends one
    // of the stall episode's capped dig grants (fix F).
    if (name === 'wedge') { wedgeEpBestEndD = null; wedgeEpBestEndY = null; wedgeExtended = false; }
    if (name === 'dig') { digGrantsThisStall++; digUsesAtLastDigGrant = _digStep.uses; }
  }
  // Shared progress judgement for owner steps: a >= 0.2-block
  // improvement against the anchor releases the owner early.
  function judgeProgress() {
    const dNow = bot.entity.position.distanceTo(target);
    if (dNow <= progAnchorD - 0.2) {
      progAnchorD = dNow; progAnchorAt = Date.now();
      releaseOwner('progress', dNow);
      return true;
    }
    return false;
  }

  // ── owner step: ONE wedge-release cycle (v3.6: face-keyed + hold-and-tap + best-in-sequence) ──────
  async function wedgeCycleRun() {
    // RELEASE MODE (helm v3.6, fix D): evaluated fresh at every
    // cycle. At a HIGH freeze — the body holding >= +0.9 of gained
    // altitude over the walk's standing level (traverse-verify-3:
    // frozen mid-air at the litter-capped step top) — every
    // backward component is position-destroying: the v3.5 long
    // backoff let the body fall and slide 4.4 blocks west,
    // surrendering both climbed steps. High cycles therefore run
    // HOLD-AND-TAP: no back pulse, no long backoff; the body holds
    // position while the stream settles, then takes short forward
    // taps. Ground-level stalls keep the v3.4/v3.5 release-first
    // cycle and the long backoff, which cost nothing there. The
    // mode and the altitude delta at the trigger are logged on
    // every cycle record.
    const high = highFreezeNow();
    if (wedgeCycles === 3 && !wedgeLongDone) {
      wedgeLongDone = true;
      if (high) {
        const lb = { kind: 'hold-extended', releaseMode: 'hold-tap', altDelta: +altDeltaNow().toFixed(2), at: new Date().toISOString(), before: fmtP(bot.entity.position), windowProg: +(progAnchorD - bot.entity.position.distanceTo(target)).toFixed(3) };
        bot.setControlState('forward', false);
        bot.setControlState('sprint', false);
        bot.setControlState('jump', false);
        bot.setControlState('back', false);
        await sleep(1200); // hold position; let the stream settle at altitude
        lb.after = fmtP(bot.entity.position);
        wedgeLog.push(lb);
        lastFaceAt = 0;
      } else {
        const lb = { kind: 'long-backoff', releaseMode: 'backoff', altDelta: +altDeltaNow().toFixed(2), at: new Date().toISOString(), before: fmtP(bot.entity.position), windowProg: +(progAnchorD - bot.entity.position.distanceTo(target)).toFixed(3) };
        bot.setControlState('forward', false);
        bot.setControlState('sprint', false);
        bot.setControlState('jump', false);
        bot.setControlState('back', true);
        await sleep(1500);
        bot.setControlState('back', false);
        await sleep(500); // settle
        lb.after = fmtP(bot.entity.position);
        wedgeLog.push(lb);
        lastFaceAt = 0;
      }
    }
    wedgeCycles++;
    const cyc = {
      kind: wedgeCycles <= 3 ? 'cycle' : (wedgeCycles === 4 ? 'final-cycle' : 'extension-cycle'), n: wedgeCycles,
      at: new Date().toISOString(), windowProg: +(progAnchorD - bot.entity.position.distanceTo(target)).toFixed(3),
      stuckForMs: Date.now() - lastProgressAt,
      before: fmtP(bot.entity.position), onGroundBefore: !!bot.entity.onGround,
      releaseMode: high ? 'hold-tap' : 'backoff', altDelta: +altDeltaNow().toFixed(2),
    };
    if (high) {
      // HOLD (helm v3.6): no backward pulse at altitude — hold
      // position with every drive state dropped while the stream
      // settles; the gained height is the asset and is not spent.
      bot.setControlState('forward', false);
      bot.setControlState('sprint', false);
      bot.setControlState('jump', false);
      bot.setControlState('back', false);
      await sleep(400); // hold, no input at all
    } else {
      // Release-first: drop every drive state, pulse backward 0.5 s
      // (forward pressure is what the stream holds against; releasing
      // lets it settle and the body regain ground truth), settle.
      bot.setControlState('forward', false);
      bot.setControlState('sprint', false);
      bot.setControlState('jump', false);
      bot.setControlState('back', true);
      await sleep(500);
      bot.setControlState('back', false);
      await sleep(250); // settle, no input at all
    }
    try { await bot.lookAt(new Vec3(x, bot.entity.position.y + 1.62, z), true); } catch {}
    // FACE-KEYED FORWARD+JUMP PHASE (helm v3.5): v3.4 held the jump
    // through the whole 1.0 s drive; at the x54 face the apex then
    // landed ~1.5 blocks WEST of the face and the body arrived back
    // at feet level (traverse-verify-2). Now the phase drives
    // forward WITHOUT the jump, polling frontFaceDist at 40 ms, and
    // starts the jump when the face is ~0.8-1.0 blocks ahead, so
    // the apex carries the body onto the step. A face already at
    // contact distance starts the jump at once. If no face enters
    // scan range within 350 ms, the cycle falls back to the v3.4
    // hold timing for the rest of the phase. The face distance at
    // the jump start is logged (faceDistAtJump; jumpKeyed=false
    // marks the fallback).
    let faceAtJump = null, jumpKeyed = false, faceSeen = false, lastFd = null;
    if (high) {
      // TAPS (helm v3.6): at altitude the cycle's drive is a series
      // of SHORT forward taps (up to 3, ~350 ms each) instead of
      // one 1.0 s drive — each tap is face-keyed like the ground
      // phase (the jump starts when the scanned face is ~0.8-1.0
      // ahead, fallback at the tap's end), and the body returns to
      // a hold between taps, so a tap that does not take the cap
      // cannot build the momentum that slides it off its gains.
      let tapsRun = 0;
      for (let tap = 0; tap < 3; tap++) {
        bot.setControlState('forward', true);
        intentAt = Date.now();
        const tapT0 = Date.now();
        let tapped = false;
        while (Date.now() - tapT0 < 300) {
          let fd = null;
          try { fd = frontFaceDist(bot, target); } catch {}
          if (fd) { faceSeen = true; lastFd = fd; }
          if (fd && fd.dist <= 1.0) { faceAtJump = fd.dist; jumpKeyed = true; tapped = true; break; }
          await sleep(40);
        }
        bot.setControlState('jump', true);
        if (!tapped && faceAtJump === null) faceAtJump = lastFd ? lastFd.dist : null;
        while (Date.now() - tapT0 < 350) await sleep(40);
        bot.setControlState('jump', false);
        bot.setControlState('forward', false);
        tapsRun++;
        if (bot.entity.position.distanceTo(target) <= progAnchorD - 0.2) break; // progress — the tail judges it
        if (tap < 2) await sleep(150); // hold between taps
      }
      cyc.taps = tapsRun;
    } else {
      bot.setControlState('forward', true);
      intentAt = Date.now();
      const phaseT0 = Date.now();
      while (Date.now() - phaseT0 < 1000) {
        let fd = null;
        try { fd = frontFaceDist(bot, target); } catch {}
        if (fd) { faceSeen = true; lastFd = fd; }
        if (fd && fd.dist <= 1.0) { faceAtJump = fd.dist; jumpKeyed = true; break; }
        if (!faceSeen && Date.now() - phaseT0 >= 350) break;
        await sleep(40);
      }
      bot.setControlState('jump', true);
      const jumpOnAt = Date.now();
      if (!jumpKeyed) faceAtJump = lastFd ? lastFd.dist : null;
      const holdUntil = Math.max(phaseT0 + 1000, jumpOnAt + 400);
      while (Date.now() < holdUntil) await sleep(40);
      bot.setControlState('jump', false);
    }
    cyc.faceDistAtJump = faceAtJump;
    cyc.jumpKeyed = jumpKeyed;
    cyc.after = fmtP(bot.entity.position);
    cyc.onGroundAfter = !!bot.entity.onGround;
    cyc.dispCycle = +Math.hypot(cyc.after.x - cyc.before.x, cyc.after.y - cyc.before.y, cyc.after.z - cyc.before.z).toFixed(3);
    // BEST-IN-SEQUENCE bookkeeping (helm v3.6, fix E): this cycle's
    // end state against the episode's best end state BEFORE it, and
    // against the cycle's own start (a cycle still progressing at
    // budget end was working, whatever the older anchor says).
    const cycStartD = Math.hypot(cyc.before.x - x, cyc.before.y - y, cyc.before.z - z);
    const cycEndD = Math.hypot(cyc.after.x - x, cyc.after.y - y, cyc.after.z - z);
    const improvedBest = wedgeEpBestEndD === null || cycEndD < wedgeEpBestEndD - 0.05 ||
      (wedgeEpBestEndY !== null && cyc.after.y > wedgeEpBestEndY + 0.10) || cycEndD <= cycStartD - 0.2;
    cyc.improvedBest = improvedBest;
    if (wedgeEpBestEndD === null || cycEndD < wedgeEpBestEndD) wedgeEpBestEndD = cycEndD;
    if (wedgeEpBestEndY === null || cyc.after.y > wedgeEpBestEndY) wedgeEpBestEndY = cyc.after.y;
    wedgeLog.push(cyc);
    lastFaceAt = 0;
    if (judgeProgress()) return;
    if (wedgeCycles >= 4) {
      // EXHAUSTION JUDGED ON BEST-IN-SEQUENCE (helm v3.6, fix E):
      // the wedge is spent only if NO cycle of this episode
      // improved the episode's best progress and the final cycle
      // was not itself progressing — traverse-verify-3's wedge was
      // declared exhausted at the end of its best run-up (4.003
      // blocks re-bought) because the run-up ended 0.75 short of
      // the pre-backoff anchor. A final cycle that improved the
      // best (or was still moving) earns ONE extension cycle.
      if (improvedBest && !wedgeExtended) {
        wedgeExtended = true;
        wedgeLog.push({ kind: 'extension', at: new Date().toISOString(), note: 'final cycle improved the episode best-in-sequence (or was still progressing at budget end); ONE extension cycle granted (helm v3.6)', endD: +cycEndD.toFixed(2) });
        stallOwner.phase = 'await';
        stallOwner.deadline = Date.now() + 3000; // a fresh progress window
        return;
      }
      wedgeSpent = true;
      wedgeLog.push({ kind: 'exhausted', at: new Date().toISOString(), note: 'wedge-release spent for this walk (3 cycles + long backoff/hold + final cycle, no best-in-sequence improvement at budget end); the arbiter moves to the next recovery' });
      releaseOwner('exhausted');
      return;
    }
    stallOwner.phase = 'await';
    stallOwner.deadline = Date.now() + 3000; // a fresh progress window
  }

  // ── owner step: ONE dig-step episode + conversion window ────────
  // Dig-step (declared allowance, only when armed): `best` has not
  // improved for ~6 s, so the step on this line is unclimbable (+2,
  // or litter-capped +1). Dig one block out of it; the use is
  // counted in digStepStats(). The 5 s conversion window after the
  // episode is ordinary driving under the dig's ownership, so the
  // body can climb through what was dug before anyone else acts.
  async function digEpisodeRun() {
    lastDigAt = Date.now();
    try { await digStepToward(bot, target); } catch {}
    lastFaceAt = 0;
    if (judgeProgress()) return;
    stallOwner.phase = 'convert';
    stallOwner.deadline = Date.now() + 5000;
  }

  // ── owner step: ONE guarded lateral probe episode ───────────────
  // Lateral step-search: jumps have not restored progress, so the
  // step on this line is likely +2 (unclimbable). Probe sideways
  // for a staircase, then re-face the target.
  //
  // PROBE GUARD (helm v3.3, declared 2026-11-07) — a probe must
  // never spend a gained step. gate-walk-5 leg E1: the body gained
  // the first +1 (52.4, 67, on the line), stalled against the
  // second, and the probe walked it north OFF the step it had just
  // bought. Two rules gate every probe:
  //  (1) FRESH-GAIN SUPPRESSION: while the body stands at a feet
  //      level this walkTo gained (>= +0.9 over its start) within
  //      the last 20 s, no probe fires at all.
  //  (2) SHELF RULE: a probe may only move onto same-level ground —
  //      the shelf the body already stands on — never up (that is
  //      the jump's job), never down (that spends height). Both
  //      cells the probe would cross are checked.
  // If no side qualifies, the episode ends ('no-shelf') and the
  // arbiter moves on.
  async function probeEpisodeRun() {
    lastProbeAt = Date.now();
    const pos = bot.entity.position;
    const feetY = Math.round(pos.y);
    let probed = false;
    if (!atFreshGainNow() && bot.entity.onGround) {
      const dx = x - pos.x, dz = z - pos.z;
      const len = Math.hypot(dx, dz) || 1;
      const ux = -dz / len, uz = dx / len; // unit lateral vector
      for (const s of [side, -side]) {
        const t1 = columnTopAt(bot, Math.floor(pos.x + ux * s * 1.0), Math.floor(pos.z + uz * s * 1.0), feetY);
        const t2 = columnTopAt(bot, Math.floor(pos.x + ux * s * 2.0), Math.floor(pos.z + uz * s * 2.0), feetY);
        if (t1 !== null && t2 !== null && (t1 + 1) === feetY && (t2 + 1) === feetY) {
          side = -s;
          probes++;
          try { await bot.lookAt(new Vec3(pos.x + ux * s * 4, pos.y + 1.62, pos.z + uz * s * 4), true); } catch {}
          bot.setControlState('forward', true);
          bot.setControlState('sprint', false);
          await sleep(1100);
          bot.setControlState('forward', false);
          lastFaceAt = 0;
          probed = true;
          break;
        }
      }
    }
    if (!judgeProgress()) releaseOwner(probed ? 'episode' : 'no-shelf');
  }

  // ── owner step: ONE backoff+settle episode + conversion window ──
  // Backoff + settle (Lineage C's measured stall-breaker, adopted):
  // a body face-planted on a step sits in the server's correction
  // stream — onGround false, exact-integer y, zero net motion under
  // EVERY forward driver. Forward pressure is what holds it there.
  // Back off the face, let onGround re-establish, then the loop's
  // ordinary forward+jump becomes a run-up, which takes steps
  // in-place bursts cannot. In v3.5 the run-up happens inside the
  // backoff's own 3 s conversion window — under its ownership, so
  // it can no longer oscillate against the wedge trigger.
  async function backoffEpisodeRun() {
    lastBackoffAt = Date.now();
    backoffs++;
    bot.setControlState('forward', false);
    bot.setControlState('sprint', false);
    bot.setControlState('jump', false);
    bot.setControlState('back', true);
    await sleep(650);
    bot.setControlState('back', false);
    await sleep(500); // settle
    lastFaceAt = 0;
    if (judgeProgress()) return;
    stallOwner.phase = 'convert';
    stallOwner.deadline = Date.now() + 3000;
  }

  async function runOwnerAct() {
    if (!stallOwner) return;
    if (stallOwner.name === 'wedge') await wedgeCycleRun();
    else if (stallOwner.name === 'dig') await digEpisodeRun();
    else if (stallOwner.name === 'probe') await probeEpisodeRun();
    else if (stallOwner.name === 'backoff') await backoffEpisodeRun();
  }

  try {
    while (Date.now() - t0 < timeoutMs) {
      if (!bot.entity) return { ok: false, error: 'entity gone' };
      const pos = bot.entity.position;
      const d = pos.distanceTo(target);
      if (d <= range + 0.4) return { ok: true, ...res() };
      if (d < best - 0.05) { best = d; lastProgressAt = Date.now(); bestAt = Date.now(); }
      // Probe-guard bookkeeping (v3.3): remember the highest GROUNDED
      // feet level this walk has bought, and when it was bought. A
      // jump apex must not count — only levels the body has stood on.
      if (startFeetY === null) { startFeetY = pos.y; peakFeetY = pos.y; peakGainedAt = t0; }
      if (startStandY === null && bot.entity.onGround) startStandY = pos.y; // v3.6: the standing level fix D measures altitude against
      if (bot.entity.onGround && pos.y > peakFeetY + 0.05) { peakFeetY = pos.y; peakGainedAt = Date.now(); }
      // PROGRESS (helm v3.5): a >= 0.2-block improvement against the
      // anchor is the one event that releases an owner early; it
      // also re-arms the stall clock.
      if (d <= progAnchorD - 0.2) {
        progAnchorD = d; progAnchorAt = Date.now();
        if (stallOwner) releaseOwner('progress', d);
        resetStallEpisode(); // v3.6: a progress event ends the stall episode (dig cap re-arms)
      }
      if (Date.now() - lastFaceAt > 2000) {
        lastFaceAt = Date.now();
        try { await bot.lookAt(new Vec3(x, pos.y + 1.62, z), true); } catch {}
        bot.setControlState('forward', true);
        bot.setControlState('sprint', d > 6);
        intentAt = Date.now();
      }
      const stuckFor = Date.now() - lastProgressAt;
      // ── ARBITER: owner deadlines ──────────────────────────────
      if (stallOwner && stallOwner.phase === 'await' && stallOwner.name === 'wedge' && Date.now() >= stallOwner.deadline) {
        stallOwner.phase = 'act';
        await wedgeCycleRun();
        continue;
      }
      if (stallOwner && stallOwner.phase === 'convert' && Date.now() >= stallOwner.deadline) {
        releaseOwner('exhausted', d);
      }
      // ── ARBITER: grant on stall detection ─────────────────────
      if (!stallOwner) {
        const intended = (Date.now() - intentAt) <= 3500;
        if (intended && Date.now() - progAnchorAt >= 3000) {
          const pick = pickRecovery();
          if (pick) {
            grantOwner(pick, d, stuckFor);
            await runOwnerAct();
            continue;
          }
        }
      }
      // Drive primitives (momentum step-up, stall jump bursts) are
      // not stall recoveries — they never displace the body
      // horizontally, so they cannot duel or mask a progress-keyed
      // trigger — but they run only in unowned time or inside the
      // current owner's drive window ('await'/'convert'), never
      // while another recovery's scripted episode owns the body.
      const ownerDriving = !stallOwner || stallOwner.phase === 'await' || stallOwner.phase === 'convert';
      // MOMENTUM STEP-UP (helm v3.3, declared 2026-11-07): gate-walk-5
      // died on two clean +1s within three columns — the old helm met
      // every face at zero momentum because it jumped only AFTER
      // stalling. While the body is still moving (progress inside the
      // stall window) and grounded, a detected clean +1 in the front
      // row is jumped WITH the run: forward stays held through the
      // pulse, the landing keeps its speed, and the next +1 is met the
      // same way — steps chain. The stall jump below remains the
      // zero-momentum fallback for faces met at a standstill.
      if (ownerDriving && stuckFor <= 1500 && bot.entity.onGround && Date.now() - lastStepUpAt > 300) {
        let step = 0;
        try { step = frontStepUp(bot, target); } catch {}
        if (step === 1) {
          lastStepUpAt = Date.now();
          bot.setControlState('jump', true);
          await sleep(380);
          bot.setControlState('jump', false);
          lastFaceAt = 0; // re-face after the step-up
          continue;
        }
      }
      if (ownerDriving && stuckFor > 1500 && Date.now() - lastJumpAt > 1500) {
        lastJumpAt = Date.now();
        bot.setControlState('jump', true);
        await sleep(350);
        bot.setControlState('jump', false);
        lastFaceAt = 0; // re-face after a jump
      }
      await sleep(200);
    }
    return { ok: false, error: 'walkTo timeout (' + timeoutMs + 'ms) to ' + x + ',' + y + ',' + z + '; at ' + bot.entity.position, ...res() };
  } finally {
    _helm.lastWedge = { cycles: wedgeCycles, log: wedgeLog.slice() };
    _helm.lastArbiter = { grants: arbiterGrants, log: arbiterLog.slice() };
    try { bot.clearControlStates(); } catch {}
  }
}

// Walk-only travel movements (Lineage B's measured fix, 2026-11-06):
// the stock pathfinder times out on even ~9-block hops in wooded/slope
// terrain around spawn with digging enabled. Travel never digs.
function travelMovements(bot) {
  if (bot.__pulseTravelMv) return bot.__pulseTravelMv;
  const mv = new Movements(bot, mcData(bot));
  mv.canDig = false;
  mv.allow1by1towers = false;
  bot.__pulseTravelMv = mv;
  return mv;
}

// prim: gotoNear(bot, x, y, z, range=1.5, timeoutMs=45000) -> {ok} — go to within `range` of a point. Tries the pathfinder (walk-only movements; goal pre-cleared via setGoal(null) — pathfinder.stop() poisons the next goto, Lineage B) under a STALL WATCHDOG: if the distance-to-target does not improve for ~7 s, the pathfinder is abandoned and walkTo's manual helm (jump + lateral step-search) takes the remainder. (Gate evidence 2026-11-06: the old design committed to the pathfinder after >=1 block of early progress and burned a 75 s timeout parked against a +2 terrace step; the staircase one block to the side was never tried.)
async function gotoNear(bot, x, y, z, range = 1.5, timeoutMs = 45000) {
  if (!bot.entity) return { ok: false, error: 'no entity' };
  const target = new Vec3(x, y, z);
  const startDist = bot.entity.position.distanceTo(target);
  if (startDist <= range + 0.6) return { ok: true };
  const t0 = Date.now();
  let pfLive = false;
  try {
    bot.pathfinder.setMovements(travelMovements(bot));
    bot.pathfinder.setGoal(null); // pre-clear: consume any pending stop state
    bot.pathfinder.setGoal(new goals.GoalNear(x, y, z, range));
    pfLive = true;
  } catch (e) { pfLive = false; }
  if (pfLive) {
    let best = startDist;
    let lastImprove = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      if (!bot.entity) return { ok: false, error: 'entity gone' };
      const d = bot.entity.position.distanceTo(target);
      if (d <= range + 0.6) {
        try { bot.pathfinder.setGoal(null); } catch {}
        return { ok: true, via: 'pathfinder' };
      }
      if (d < best - 0.05) { best = d; lastImprove = Date.now(); }
      if (Date.now() - lastImprove > 7000) break; // stall watchdog
      await sleep(400);
    }
    try { bot.pathfinder.setGoal(null); } catch {}
    try { bot.clearControlStates(); } catch {}
    const remain = Math.max(5000, timeoutMs - (Date.now() - t0));
    const w = await walkTo(bot, x, y, z, range, remain);
    return w.ok ? { ok: true, via: 'helm-fallback' } : w;
  }
  return walkTo(bot, x, y, z, range, timeoutMs);
}

// prim: findBlocks(bot, names[], maxDistance=32, count=8) -> [Vec3] — positions of the nearest blocks whose name is in `names`
function findBlocks(bot, names, maxDistance = 32, count = 8) {
  const data = mcData(bot);
  const ids = names.map((n) => data.blocksByName[n]?.id).filter((v) => v !== undefined);
  if (!ids.length) return [];
  return bot.findBlocks({ matching: ids, maxDistance, count }) || [];
}

// prim: digBlock(bot, pos, timeoutMs=25000) -> {ok, block} — walk into reach if needed, equip a sensible tool, face and dig the block at pos (a Vec3)
async function digBlock(bot, pos, timeoutMs = 25000) {
  const block = bot.blockAt(pos);
  if (!block || block.name === 'air') return { ok: false, error: 'no block at ' + pos };
  if (bot.entity.position.distanceTo(pos) > 4.2) {
    const g = await gotoNear(bot, pos.x, pos.y, pos.z, 2.5, timeoutMs);
    if (!g.ok) return g;
  }
  const fresh = bot.blockAt(pos);
  if (!fresh || fresh.name === 'air') return { ok: false, error: 'block vanished at ' + pos };
  // Naive tool choice: pickaxe for stone-like, axe for wood-like.
  try {
    const invNames = Object.keys(inv(bot));
    const want = /stone|cobble|ore|rock|deepslate|granite|diorite|andesite/.test(fresh.name)
      ? ['iron_pickaxe', 'stone_pickaxe', 'wooden_pickaxe', 'golden_pickaxe']
      : /log|wood|planks/.test(fresh.name)
        ? ['iron_axe', 'stone_axe', 'wooden_axe']
        : [];
    const toolName = want.find((n) => invNames.includes(n));
    if (toolName) {
      const tool = bot.inventory.items().find((i) => i.name === toolName);
      if (tool) await bot.equip(tool, 'hand');
    }
  } catch {}
  try {
    await bot.lookAt(pos.offset(0.5, 0.5, 0.5), true);
  } catch {}
  // MEASURED (probe2, 2026-11-06): the callback form bot.dig(block, cb)
  // never fires on this mineflayer/Paper stack, and the default 'raycast'
  // direction hangs in common geometries (feet-level trunk log). The
  // promise form bot.dig(block, 'ignore') completes in exactly
  // bot.digTime(); reach is already enforced above (gotoNear / <=4.2).
  const budget = Math.max(timeoutMs, (bot.digTime ? bot.digTime(fresh) : 3000) + 12000);
  try {
    await Promise.race([
      bot.dig(fresh, 'ignore'),
      sleep(budget).then(() => { throw new Error('dig timeout on ' + fresh.name); }),
    ]);
    return { ok: true, block: fresh.name };
  } catch (e) {
    try { bot.stopDigging(); } catch {}
    return { ok: false, error: String((e && e.message) || e) };
  }
}

// prim: digColumn(bot, pos, maxLogs=8) -> {ok, dug} — harvest the log column containing pos BOTTOM-UP: scans down to the lowest log, digs upward one at a time (digBlock enforces reach), collecting drops as it goes. Canopy-chasing yields 0 (measured, Lineage B); the bottom of the trunk is the yield path.
async function digColumn(bot, pos, maxLogs = 8) {
  let base = new Vec3(pos.x, pos.y, pos.z);
  for (let i = 0; i < 24; i++) {
    const below = bot.blockAt(new Vec3(base.x, base.y - 1, base.z));
    if (below && /_log$/.test(below.name)) base = base.offset(0, -1, 0);
    else break;
  }
  let dug = 0;
  for (let i = 0; i < maxLogs; i++) {
    const p = new Vec3(base.x, base.y + i, base.z);
    const blk = bot.blockAt(p);
    if (!blk || blk.name === 'air' || !/_log$/.test(blk.name)) break;
    const r = await digBlock(bot, p);
    if (!r.ok) break;
    dug++;
    if (dug % 2 === 0) await collectDrops(bot, 7, 4000);
  }
  if (dug > 0) await collectDrops(bot, 7, 6000);
  return { ok: dug > 0, dug };
}

// prim: collectDrops(bot, radius=7, timeoutMs=12000) -> {ok, visited} — walk over dropped item entities nearby so they are picked up
async function collectDrops(bot, radius = 7, timeoutMs = 12000) {
  const t0 = Date.now();
  let visited = 0;
  let seen = 0;
  while (Date.now() - t0 < timeoutMs) {
    const drops = Object.values(bot.entities || {}).filter(
      (e) => e && (e.name === 'item' || e.kind === 'Drops') && e.position && bot.entity && e.position.distanceTo(bot.entity.position) <= radius
    );
    seen = Math.max(seen, drops.length);
    if (!drops.length) {
      if (visited > 0) break;
      await sleep(400); // drops take a moment to spawn as entities — keep waiting
      continue;
    }
    const d = drops[0];
    const g = await gotoNear(bot, d.position.x, d.position.y, d.position.z, 0.9, 6000);
    if (g.ok) visited++;
    await sleep(250);
  }
  return { ok: true, visited, seen };
}

// prim: craftByName(bot, itemName, count=1, tablePos=null) -> {ok} — craft an item; pass the Vec3 of a placed crafting table for 3x3 recipes, null for the 2x2 grid
async function craftByName(bot, itemName, count = 1, tablePos = null) {
  const data = mcData(bot);
  const item = data.itemsByName[itemName];
  if (!item) return { ok: false, error: 'unknown item ' + itemName };
  let table = null;
  if (tablePos) {
    table = bot.blockAt(tablePos);
    if (!table || table.name !== 'crafting_table') return { ok: false, error: 'no crafting_table at ' + tablePos };
    if (bot.entity.position.distanceTo(tablePos) > 3.5) {
      const g = await gotoNear(bot, tablePos.x, tablePos.y, tablePos.z, 2.5, 30000);
      if (!g.ok) return g;
    }
  }
  const recipes = bot.recipesFor(item.id, null, 1, table);
  if (!recipes || !recipes.length) return { ok: false, error: 'no craftable recipe for ' + itemName + (table ? ' at table' : ' in 2x2 grid') };
  try {
    await bot.craft(recipes[0], count, table);
    return { ok: true, item: itemName, count };
  } catch (e) {
    return { ok: false, error: 'craft ' + itemName + ': ' + e.message };
  }
}

// prim: placeOnTop(bot, itemName, refPos) -> {ok} — place the named block item on TOP of the block at refPos (a Vec3); walks into reach first
async function placeOnTop(bot, itemName, refPos) {
  const item = bot.inventory.items().find((i) => i.name === itemName);
  if (!item) return { ok: false, error: 'no ' + itemName + ' in inventory' };
  const ref = bot.blockAt(refPos);
  if (!ref || ref.name === 'air') return { ok: false, error: 'no reference block at ' + refPos };
  if (bot.entity.position.distanceTo(refPos) > 4.2) {
    const g = await gotoNear(bot, refPos.x, refPos.y, refPos.z, 2.5, 30000);
    if (!g.ok) return g;
  }
  try {
    await bot.equip(item, 'hand');
    await bot.placeBlock(bot.blockAt(refPos), new Vec3(0, 1, 0));
    return { ok: true, placed: itemName, at: { x: refPos.x, y: refPos.y + 1, z: refPos.z } };
  } catch (e) {
    return { ok: false, error: 'place ' + itemName + ': ' + e.message };
  }
}

// prim: placeAgainst(bot, itemName, refPos, face) -> {ok} — place the named block against the block at refPos; face is a Vec3 direction like (1,0,0) east, (0,0,1) south, (0,-1,0) below
async function placeAgainst(bot, itemName, refPos, face) {
  const item = bot.inventory.items().find((i) => i.name === itemName);
  if (!item) return { ok: false, error: 'no ' + itemName + ' in inventory' };
  const ref = bot.blockAt(refPos);
  if (!ref || ref.name === 'air') return { ok: false, error: 'no reference block at ' + refPos };
  if (bot.entity.position.distanceTo(refPos) > 4.2) {
    const g = await gotoNear(bot, refPos.x, refPos.y, refPos.z, 2.5, 30000);
    if (!g.ok) return g;
  }
  try {
    await bot.equip(item, 'hand');
    await bot.placeBlock(bot.blockAt(refPos), face);
    return { ok: true, placed: itemName, at: { x: refPos.x + face.x, y: refPos.y + face.y, z: refPos.z + face.z } };
  } catch (e) {
    return { ok: false, error: 'place ' + itemName + ': ' + e.message };
  }
}

// prim: openChestContents(bot, chestPos) -> {ok, contents:{name:count}, total} — open the chest at chestPos, read what is inside, close it
async function openChestContents(bot, chestPos) {
  const block = bot.blockAt(chestPos);
  if (!block || !/chest/.test(block.name)) return { ok: false, error: 'no chest at ' + chestPos };
  if (bot.entity.position.distanceTo(chestPos) > 3.5) {
    const g = await gotoNear(bot, chestPos.x, chestPos.y, chestPos.z, 2.5, 30000);
    if (!g.ok) return g;
  }
  let win;
  try {
    win = await bot.openChest(bot.blockAt(chestPos));
    const contents = {};
    let total = 0;
    for (const it of win.containerItems()) { contents[it.name] = (contents[it.name] || 0) + it.count; total += it.count; }
    win.close();
    return { ok: true, contents, total };
  } catch (e) {
    try { if (win) win.close(); } catch {}
    return { ok: false, error: 'openChest: ' + e.message };
  }
}

// prim: depositInChest(bot, chestPos, exceptNames=[]) -> {ok, deposited:{name:count}} — move every inventory item NOT in exceptNames into the chest at chestPos
async function depositInChest(bot, chestPos, exceptNames = []) {
  const block = bot.blockAt(chestPos);
  if (!block || !/chest/.test(block.name)) return { ok: false, error: 'no chest at ' + chestPos };
  if (bot.entity.position.distanceTo(chestPos) > 3.5) {
    const g = await gotoNear(bot, chestPos.x, chestPos.y, chestPos.z, 2.5, 30000);
    if (!g.ok) return g;
  }
  let win;
  const deposited = {};
  try {
    win = await bot.openChest(bot.blockAt(chestPos));
    for (const it of [...bot.inventory.items()]) {
      if (exceptNames.includes(it.name)) continue;
      await win.deposit(it.type, it.metadata, it.count);
      deposited[it.name] = (deposited[it.name] || 0) + it.count;
    }
    win.close();
    return { ok: true, deposited };
  } catch (e) {
    try { if (win) win.close(); } catch {}
    return { ok: false, error: 'deposit: ' + e.message, deposited };
  }
}

// prim: say(bot, msg) -> send a short chat message (keep it rare: at most ~2 per skill run)
function say(bot, msg) {
  try { bot.chat(String(msg).slice(0, 200)); return { ok: true }; } catch (e) { return { ok: false, error: e.message }; }
}

// prim: groundY(bot, x, z) -> y of the top solid block in column x,z near the bot (null if none found)
function groundY(bot, x, z) {
  const startY = Math.min(250, Math.floor(bot.entity.position.y) + 24);
  for (let y = startY; y > bot.entity.position.y - 40; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (b && b.boundingBox === 'block') return y;
  }
  return null;
}

module.exports = {
  sleep, inv, countItem, hasItem, gotoNear, walkTo, findBlocks, digBlock, digColumn,
  collectDrops, craftByName, placeOnTop, placeAgainst,
  openChestContents, depositInChest, say, groundY,
  setDigStep, digStepStats, wedgeStats, arbiterStats,
  Vec3, goals, mcData,
};
