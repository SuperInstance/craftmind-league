'use strict';
/* STANCE PROBE (stance-probe-preregistered-20261108) — controlled discrimination
 * at Cody's stance cells (72-73,-101/-102). Mode A: fresh disposable body
 * 'StanceProbe'. Mode B: bare Cody (NO character loop, no plugin changes).
 * Measures: rest signature (10 Hz pos/vel/onGround + forcedMove counts),
 * tight-hop gotoNear attempts (range 0.6, 9 s — the v3 method) and rawDrive
 * attempts (forward+jump held), all displacement-scored. Writes result JSON. */
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const { Vec3 } = require(NM + '/vec3');

const MODE = process.argv[2] || 'fresh';
const USERNAME = MODE === 'cody' ? 'Cody' : 'StanceProbe';
const OUT = PULSE + '/stance-probe-' + MODE + '-result.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r3 = (n) => Math.round(n * 1000) / 1000;

const bot = mineflayer.createBot({
  host: '192.168.0.50', port: 25565, username: USERNAME, auth: 'offline',
  plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder },
});

const R = { mode: MODE, username: USERNAME, ts: new Date().toISOString(), events: [], legs: [], rests: [], attempts: [] };
const trace = []; // {t, x,y,z, vx,vy,vz, og}
let forcedMoves = []; // timestamps (ms since start)
let t0 = Date.now();
let startHealth = null, aborted = false, abortReason = null;

bot.on('forcedMove', () => forcedMoves.push(Date.now() - t0));
bot.on('error', (e) => R.events.push({ ev: 'error', msg: String(e && e.message) }));
bot.on('kicked', (r) => R.events.push({ ev: 'kicked', msg: String(r) }));
bot.on('death', () => { R.events.push({ ev: 'DEATH', at: new Date().toISOString() }); aborted = true; abortReason = 'death'; });
bot.on('health', () => {
  if (startHealth == null) return;
  if (MODE === 'cody' && bot.health < startHealth) { aborted = true; abortReason = 'cody-damage hp ' + bot.health; }
  if (bot.health < startHealth) R.events.push({ ev: 'damage', hp: bot.health });
});

const sampler = setInterval(() => {
  if (!bot.entity) return;
  const p = bot.entity.position, v = bot.entity.velocity || { x: 0, y: 0, z: 0 };
  trace.push({ t: Date.now() - t0, x: r3(p.x), y: r3(p.y), z: r3(p.z), vx: r3(v.x), vy: r3(v.y), vz: r3(v.z), og: !!bot.entity.onGround });
}, 100);

function sliceSummary(a, b) {
  const s = trace.filter((q) => q.t >= a && q.t <= b);
  if (!s.length) return { n: 0 };
  const xs = s.map((q) => q.x), ys = s.map((q) => q.y), zs = s.map((q) => q.z);
  const rng = (arr) => r3(Math.max(...arr) - Math.min(...arr));
  const mean = (arr) => r3(arr.reduce((x, y) => x + y, 0) / arr.length);
  return {
    n: s.length, posRange: { x: rng(xs), y: rng(ys), z: rng(zs) },
    meanVel: { x: mean(s.map((q) => q.vx)), y: mean(s.map((q) => q.vy)), z: mean(s.map((q) => q.vz)) },
    onGroundFrac: r3(s.filter((q) => q.og).length / s.length),
    forcedMoves: forcedMoves.filter((t) => t >= a && t <= b).length,
    first: { x: s[0].x, y: s[0].y, z: s[0].z }, last: { x: s[s.length - 1].x, y: s[s.length - 1].y, z: s[s.length - 1].z },
  };
}
function pos() { const p = bot.entity.position; return { x: r3(p.x), y: r3(p.y), z: r3(p.z) }; }
function cellOf(p) { return [Math.floor(p.x), Math.floor(p.z)]; }
function feetY(cx, cz) { const g = prims.groundY(bot, cx, cz); return g == null ? null : g + 1; }

async function rest(tag, ms) {
  const a = Date.now() - t0; await sleep(ms); const b = Date.now() - t0;
  const s = sliceSummary(a, b); s.tag = tag; s.at = pos(); s.cell = cellOf(bot.entity.position);
  R.rests.push(s); console.log('[SP] rest', tag, JSON.stringify(s)); return s;
}

async function attemptGoto(tag, cx, cz, range = 0.6, timeout = 9000) {
  const fy = feetY(cx, cz);
  const start = pos(), startCell = cellOf(start);
  const fm0 = forcedMoves.length, a = Date.now() - t0;
  let res = null, err = null;
  try { res = await prims.gotoNear(bot, cx + 0.5, fy == null ? start.y : fy, cz + 0.5, range, timeout); }
  catch (e) { err = String(e && e.message); }
  const b = Date.now() - t0;
  const end = pos();
  const rec = { tag, method: 'gotoNear', targetCell: [cx, cz], targetFeetY: fy, range, timeoutMs: timeout,
    start, startCell, end, endCell: cellOf(end),
    dispH: r3(Math.hypot(end.x - start.x, end.z - start.z)), dispY: r3(end.y - start.y),
    result: res, err, forcedMoves: forcedMoves.length - fm0, window: sliceSummary(a, b) };
  R.attempts.push(rec); console.log('[SP] goto', tag, JSON.stringify({ end: rec.end, dispH: rec.dispH, ok: res && res.ok, via: res && res.via, fm: rec.forcedMoves }));
  try { bot.pathfinder.setGoal(null); } catch {}
  try { bot.clearControlStates(); } catch {}
  await sleep(600);
  return rec;
}

async function attemptRaw(tag, cx, cz, seconds = 4) {
  const fy = feetY(cx, cz);
  const start = pos(), startCell = cellOf(start);
  const fm0 = forcedMoves.length, a = Date.now() - t0;
  try { await bot.lookAt(new Vec3(cx + 0.5, (fy == null ? start.y : fy) + 1.4, cz + 0.5), true); } catch {}
  await sleep(200);
  bot.setControlState('jump', true); bot.setControlState('forward', true);
  await sleep(seconds * 1000);
  bot.clearControlStates();
  const b = Date.now() - t0;
  const end = pos();
  const rec = { tag, method: 'rawDrive-fwd+jump', targetCell: [cx, cz], seconds,
    start, startCell, end, endCell: cellOf(end),
    dispH: r3(Math.hypot(end.x - start.x, end.z - start.z)), dispY: r3(end.y - start.y),
    forcedMoves: forcedMoves.length - fm0, window: sliceSummary(a, b) };
  R.attempts.push(rec); console.log('[SP] raw', tag, JSON.stringify({ end: rec.end, dispH: rec.dispH, fm: rec.forcedMoves }));
  await sleep(600);
  return rec;
}

async function leg(tag, cx, cz, range = 1.2, timeout = 45000) {
  const start = pos(); const fm0 = forcedMoves.length;
  const fy = feetY(cx, cz);
  let res = null, err = null;
  try { res = await prims.gotoNear(bot, cx + 0.5, fy == null ? start.y : fy, cz + 0.5, range, timeout); } catch (e) { err = String(e && e.message); }
  const end = pos();
  const rec = { tag, targetCell: [cx, cz], ok: !!(res && res.ok), via: res && res.via, err, start, end,
    dispH: r3(Math.hypot(end.x - start.x, end.z - start.z)), forcedMoves: forcedMoves.length - fm0 };
  R.legs.push(rec); console.log('[SP] leg', tag, JSON.stringify(rec));
  try { bot.pathfinder.setGoal(null); } catch {}
  return rec;
}

function finish(code) {
  try {
    R.final = { pos: bot.entity ? pos() : null, health: bot.health, food: bot.food,
      inventory: bot.inventory ? bot.inventory.items().map((i) => i.name + 'x' + i.count) : [],
      aborted, abortReason, totalForcedMoves: forcedMoves.length };
    fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  } catch (e) { console.log('[SP] write err', e.message); }
  console.log('[SP] DONE', MODE, JSON.stringify(R.final));
  try { bot.quit(); } catch {}
  setTimeout(() => process.exit(code), 800);
}

bot.once('spawn', async () => {
  t0 = Date.now(); forcedMoves = [];
  startHealth = bot.health;
  R.spawn = { pos: pos(), health: bot.health, food: bot.food, uuid: bot.uuid || (bot.player && bot.player.uuid) || null };
  console.log('[SP] spawn', MODE, JSON.stringify(R.spawn));
  await sleep(3500);
  R.settled = { pos: pos(), health: bot.health, food: bot.food };
  console.log('[SP] settled', JSON.stringify(R.settled));

  if (MODE === 'fresh') {
    // Travel legs: pad first (known-good), then the committed chain DOWN to the stance.
    await leg('travel-pad', 64, -93, 1.5, 60000);
    if (!aborted) await leg('chain-oak', 66, -97, 1.2, 30000);
    if (!aborted) await leg('chain-rimW', 66, -102, 1.2, 30000);
    if (!aborted) await leg('chain-68', 68, -102, 1.2, 30000);
    if (!aborted) await leg('chain-69', 69, -102, 1.2, 30000);
    if (!aborted) await leg('chain-69n', 69, -101, 1.2, 30000);
    if (!aborted) await leg('chain-70n', 70, -101, 1.2, 30000);
    if (!aborted) await leg('chain-71n', 71, -101, 1.2, 30000);
    if (!aborted) await leg('chain-71', 71, -102, 1.2, 30000);
    if (!aborted) await leg('chain-stance', 72, -102, 0.8, 30000);
    if (!aborted) {
      await rest('fresh-at-stance', 4000);
      await attemptGoto('F-A1-goto-W+1', 71, -102);
      if (!aborted) await attemptRaw('F-A2-raw-W+1', 71, -102);
      if (!aborted) await attemptGoto('F-A3-goto-N+1', 71, -101);
      if (!aborted) await attemptRaw('F-A4-raw-N+1', 71, -101);
      if (!aborted) await attemptGoto('F-A5-goto-back-S-down', 71, -102);
      if (!aborted) await attemptGoto('F-A6-goto-E-down-stance', 72, -102);
      if (!aborted) await attemptGoto('F-A7-goto-E-down-dipfloor', 73, -102);
      if (!aborted) await attemptGoto('F-A8-goto-W+1-from-73', 72, -102);
      if (!aborted) await attemptRaw('F-A9-raw-W+1-from-73', 72, -102);
      if (!aborted) await attemptGoto('F-A10-goto-N-flat-73-101', 73, -101);
      if (!aborted) await rest('fresh-end', 2000);
    }
  } else {
    // CODY: rest signature FIRST, before any commanded movement.
    await rest('cody-at-spawn-stance', 5000);
    await attemptGoto('C-C1-goto-W+1-escape', 71, -102);
    if (!aborted) await attemptRaw('C-C2-raw-W+1-escape', 71, -102);
    if (!aborted) await attemptGoto('C-C3-goto-E-down-control', 73, -102);
    if (!aborted) await attemptRaw('C-C4-raw-E-down-control', 73, -102);
    if (!aborted) await attemptGoto('C-C5-goto-stance-cell-back', 72, -102);
    if (!aborted) await attemptGoto('C-C6-goto-N-down-control', 72, -101);
    if (!aborted) await attemptRaw('C-C7-raw-N-down-control', 72, -101);
    if (!aborted) {
      // Chain-walk attempt toward the pad (tight hops); log each hop, stop at first failure.
      const chain = [[71, -102], [71, -101], [70, -101], [69, -101], [69, -102], [67, -102], [66, -102], [66, -97], [64, -93]];
      for (const [cx, cz] of chain) {
        if (aborted) break;
        const cur = cellOf(bot.entity.position);
        if (cur[0] === cx && cur[1] === cz) { R.legs.push({ tag: 'chainwalk-skip-in-cell', targetCell: [cx, cz] }); continue; }
        const r = await attemptGoto('C-chain-' + cx + ',' + cz, cx, cz, 0.6, 9000);
        const ec = cellOf(bot.entity.position);
        if (!(ec[0] === cx && ec[1] === cz) && r.dispH < 0.5) { R.events.push({ ev: 'chainwalk-stall', atCell: [cx, cz] }); break; }
      }
    }
    if (!aborted) {
      // Return to his handback cell (72,-102) as closely as locomotion allows.
      await attemptGoto('C-return-stance', 72, -102, 0.6, 9000);
      await rest('cody-end', 2000);
    }
  }
  finish(aborted ? 3 : 0);
});

setTimeout(() => { R.events.push({ ev: 'global-timeout' }); finish(2); }, MODE === 'cody' ? 480000 : 720000);
