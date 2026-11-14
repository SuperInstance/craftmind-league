'use strict';
/* WEDGE-CELL DISCRIMINATOR - SCRATCH variant of pristine-body-walk.js.
 * Pre-registered: ledger wedge-discriminator-preregistered-20261108.
 * Runs ONLY against a LOCAL scratch server (host/port from argv); bot name
 * and phase come from argv; an operator console issues /tp and /gamemode
 * inside the SCRATCH server only to place the body. */
/* PRISTINE-BODY EXPERIMENT — the single experimental session
 * (pristine-body-preregistered-20261108). Body: PristineProbe, genuine fresh
 * spawn (cure mechanics on a new name), NEVER cloned, NEVER relocated.
 * Battery: rest signature + live hostile scan -> route-2 WEST chain verbatim
 * (triple-001 PASS cells) -> pad -> oak -> rim -> east z=-102 row -> stance
 * pair (72-73,-101/-102) -> face diagnostics P1-P5 (raw + goto, both of Codys
 * failing geometries + his passing controls) -> park at the homestead
 * shoulder. Displacement is the only truth; dig-step OFF (never armed);
 * no digging, no chat commands, no teleport. Death circuit-breaker:
 * abort at 3 deaths; abort at 2 if any death is hostile-caused; any
 * disconnect/kick/error ends the session (finish writes the result). */
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const { Vec3 } = require(NM + '/vec3');
const SCRATCH_PORT = parseInt(process.argv[2] || '25601', 10);
const BOTNAME = process.argv[3] || 'WedgeScratchA';
const PHASE = process.argv[4] || 'A1a';
const bot = mineflayer.createBot({
  host: '127.0.0.1', port: SCRATCH_PORT, username: BOTNAME, auth: 'offline', version: '26.1',
  plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder },
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r3 = (n) => Math.round(n * 1000) / 1000;
const OUT = PULSE + '/wedge-scratch-' + PHASE + '.json';
const R = { mode: 'wedge-scratch', username: BOTNAME, phase: PHASE, port: SCRATCH_PORT,
  ts: new Date().toISOString(), events: [], legs: [], rests: [], attempts: [], deaths: [] };
const trace = [];
let forcedMoves = [], t0 = Date.now(), startHealth = null;
let aborted = false, abortReason = null, finished = false, sessionBroken = null;

bot.on('forcedMove', () => forcedMoves.push(Date.now() - t0));
bot.on('error', (e) => { R.events.push({ ev: 'error', msg: String(e && e.message) }); sessionBroken = 'error: ' + String(e && e.message); aborted = true; abortReason = 'session-break'; });
bot.on('kicked', (r) => { R.events.push({ ev: 'kicked', msg: String(r) }); sessionBroken = 'kicked: ' + String(r); aborted = true; abortReason = 'session-break'; });
bot.on('end', (r) => { R.events.push({ ev: 'end', msg: String(r) }); if (!finished) { sessionBroken = sessionBroken || ('end: ' + String(r)); aborted = true; abortReason = abortReason || 'session-break'; } });
bot.on('death', () => {
  const at = posSafe();
  const h = nearestHostile();
  const rec = { at: new Date().toISOString(), pos: at, nearestHostile: h };
  R.deaths.push(rec); R.events.push({ ev: 'DEATH', ...rec });
  console.log('[PB] DEATH', JSON.stringify(rec));
});
bot.on('health', () => {
  if (startHealth != null && bot.health < startHealth) R.events.push({ ev: 'damage', hp: bot.health, hostile: nearestHostile() });
});
setInterval(() => {
  if (!bot.entity) return;
  const p = bot.entity.position, v = bot.entity.velocity || { x: 0, y: 0, z: 0 };
  trace.push({ t: Date.now() - t0, x: r3(p.x), y: r3(p.y), z: r3(p.z), vx: r3(v.x), vy: r3(v.y), vz: r3(v.z), og: !!bot.entity.onGround });
}, 100);

function sliceSummary(a, b) {
  const s = trace.filter((q) => q.t >= a && q.t <= b);
  if (!s.length) return { n: 0 };
  const rng = (arr) => r3(Math.max(...arr) - Math.min(...arr));
  const mean = (arr) => r3(arr.reduce((x, y) => x + y, 0) / arr.length);
  return { n: s.length, posRange: { x: rng(s.map((q) => q.x)), y: rng(s.map((q) => q.y)), z: rng(s.map((q) => q.z)) },
    meanVel: { x: mean(s.map((q) => q.vx)), y: mean(s.map((q) => q.vy)), z: mean(s.map((q) => q.vz)) },
    onGroundFrac: r3(s.filter((q) => q.og).length / s.length),
    forcedMoves: forcedMoves.filter((t) => t >= a && t <= b).length,
    first: { x: s[0].x, y: s[0].y, z: s[0].z }, last: { x: s[s.length - 1].x, y: s[s.length - 1].y, z: s[s.length - 1].z } };
}
function posSafe() { try { const p = bot.entity.position; return { x: r3(p.x), y: r3(p.y), z: r3(p.z) }; } catch { return null; } }
function pos() { return posSafe(); }
function cellOf(p) { return [Math.floor(p.x), Math.floor(p.z)]; }
function feetY(cx, cz) { const g = prims.groundY(bot, cx, cz); return g == null ? null : g + 1; }
const HOSTILE_NAMES = ['zombie', 'skeleton', 'creeper', 'spider', 'cave_spider', 'husk', 'drowned', 'stray', 'witch', 'pillager', 'vindicator', 'enderman', 'phantom', 'zombie_villager'];
function nearestHostile() {
  let best = null, bd = 1e9;
  try {
    for (const id in bot.entities) {
      const e = bot.entities[id];
      if (!e || !e.position || !bot.entity) continue;
      const n = (e.name || '').toLowerCase();
      if (HOSTILE_NAMES.includes(n)) {
        const d = e.position.distanceTo(bot.entity.position);
        if (d < bd) { bd = d; best = { name: e.name, dist: r3(d), pos: { x: r3(e.position.x), y: r3(e.position.y), z: r3(e.position.z) } }; }
      }
    }
  } catch {}
  return best;
}
function hostileScan(radius) {
  const out = [];
  try {
    for (const id in bot.entities) {
      const e = bot.entities[id];
      if (!e || !e.position || !bot.entity) continue;
      const n = (e.name || '').toLowerCase();
      const d = e.position.distanceTo(bot.entity.position);
      if (HOSTILE_NAMES.includes(n) && d <= radius) out.push({ name: e.name, dist: r3(d), pos: { x: r3(e.position.x), y: r3(e.position.y), z: r3(e.position.z) } });
    }
  } catch {}
  return out.sort((a, b) => a.dist - b.dist);
}
function checkBreaker() {
  const hostileDeaths = R.deaths.filter((d) => d.nearestHostile && d.nearestHostile.dist < 24).length;
  if (R.deaths.length >= 3) { aborted = true; abortReason = 'circuit-breaker-3-deaths'; }
  else if (hostileDeaths >= 1 && R.deaths.length >= 2) { aborted = true; abortReason = 'circuit-breaker-2-with-hostile'; }
  else if (hostileDeaths >= 1 && R.deaths.length >= 1 && bot.health <= 6) { aborted = true; abortReason = 'hostile-death-plus-low-hp'; }
  return aborted;
}
async function rest(tag, ms) {
  const a = Date.now() - t0; await sleep(ms); const b = Date.now() - t0;
  const s = sliceSummary(a, b); s.tag = tag; s.at = pos(); s.cell = pos() ? cellOf(pos()) : null;
  s.hp = bot.health; s.hostiles48 = hostileScan(48);
  R.rests.push(s); console.log('[PB] rest', tag, JSON.stringify({ at: s.at, og: s.onGroundFrac, fm: s.forcedMoves, host: s.hostiles48.length }));
  return s;
}
async function leg(tag, cx, cz, range = 1.2, timeout = 30000) {
  const start = pos(); const fm0 = forcedMoves.length; const fy = feetY(cx, cz);
  let res = null, err = null;
  try { res = await prims.gotoNear(bot, cx + 0.5, fy == null ? start.y : fy, cz + 0.5, range, timeout); } catch (e) { err = String(e && e.message); }
  const end = pos();
  const rec = { tag, targetCell: [cx, cz], targetFeetY: fy, ok: !!(res && res.ok), via: res && res.via, err, start, end,
    dispH: end && start ? r3(Math.hypot(end.x - start.x, end.z - start.z)) : null,
    forcedMoves: forcedMoves.length - fm0, hp: bot.health, hostile: nearestHostile() };
  R.legs.push(rec); console.log('[PB] leg', tag, JSON.stringify({ ok: rec.ok, via: rec.via, end: rec.end, dispH: rec.dispH, fm: rec.forcedMoves, hp: rec.hp }));
  try { bot.pathfinder.setGoal(null); } catch {}
  checkBreaker();
  return rec;
}
async function attemptGoto(tag, cx, cz, range = 0.6, timeout = 9000) {
  const fy = feetY(cx, cz); const start = pos(); const fm0 = forcedMoves.length; const a = Date.now() - t0;
  let res = null, err = null;
  try { res = await prims.gotoNear(bot, cx + 0.5, fy == null ? start.y : fy, cz + 0.5, range, timeout); } catch (e) { err = String(e && e.message); }
  const b = Date.now() - t0; const end = pos();
  const rec = { tag, method: 'gotoNear', targetCell: [cx, cz], targetFeetY: fy, range, timeoutMs: timeout,
    start, startCell: start ? cellOf(start) : null, end, endCell: end ? cellOf(end) : null,
    dispH: end && start ? r3(Math.hypot(end.x - start.x, end.z - start.z)) : null,
    dispY: end && start ? r3(end.y - start.y) : null,
    result: res, err, forcedMoves: forcedMoves.length - fm0, window: sliceSummary(a, b) };
  R.attempts.push(rec); console.log('[PB] goto', tag, JSON.stringify({ end: rec.end, dispH: rec.dispH, ok: res && res.ok, via: res && res.via, fm: rec.forcedMoves }));
  try { bot.pathfinder.setGoal(null); } catch {}
  try { bot.clearControlStates(); } catch {}
  await sleep(600); checkBreaker();
  return rec;
}
async function attemptRaw(tag, cx, cz, seconds = 4) {
  const fy = feetY(cx, cz); const start = pos(); const fm0 = forcedMoves.length; const a = Date.now() - t0;
  try { await bot.lookAt(new Vec3(cx + 0.5, (fy == null ? start.y : fy) + 1.4, cz + 0.5), true); } catch {}
  await sleep(250);
  const facing = { yaw: r3(bot.entity.yaw), pitch: r3(bot.entity.pitch) };
  bot.setControlState('jump', true); bot.setControlState('forward', true);
  await sleep(seconds * 1000);
  bot.clearControlStates();
  const b = Date.now() - t0; const end = pos();
  const rec = { tag, method: 'rawDrive-fwd+jump', targetCell: [cx, cz], seconds, facing,
    start, startCell: start ? cellOf(start) : null, end, endCell: end ? cellOf(end) : null,
    dispH: end && start ? r3(Math.hypot(end.x - start.x, end.z - start.z)) : null,
    dispY: end && start ? r3(end.y - start.y) : null,
    forcedMoves: forcedMoves.length - fm0, window: sliceSummary(a, b) };
  R.attempts.push(rec); console.log('[PB] raw', tag, JSON.stringify({ end: rec.end, dispH: rec.dispH, fm: rec.forcedMoves, facing }));
  await sleep(600); checkBreaker();
  return rec;
}
function finish(code) {
  if (finished) return; finished = true;
  try {
    R.final = { pos: posSafe(), health: bot.health, food: bot.food,
      inventory: bot.inventory ? bot.inventory.items().map((i) => i.name + 'x' + i.count) : [],
      deaths: R.deaths.length, aborted, abortReason, sessionBroken, totalForcedMoves: forcedMoves.length,
      digStep: (prims.digStepStats ? prims.digStepStats() : 'n/a') };
    fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  } catch (e) { console.log('[PB] write err', e.message); }
  console.log('[PB] DONE', JSON.stringify(R.final));
  try { bot.quit(); } catch {}
  setTimeout(() => process.exit(code), 800);
}

bot.once('spawn', async () => {
  t0 = Date.now(); forcedMoves = [];
  startHealth = bot.health;
  R.spawn = { pos: pos(), health: bot.health, food: bot.food, uuid: bot.uuid || null, onGround: !!bot.entity.onGround };
  try { fs.writeFileSync(PULSE + '/wedge-scratch-spawned.flag', JSON.stringify(R.spawn)); } catch {}
  console.log('[PB] spawn', JSON.stringify(R.spawn));
  await sleep(3000);
  R.settled = { pos: pos(), health: bot.health, food: bot.food };
  await rest('pristine-at-spawn', 4000);
  // WEDGE-SCRATCH PHASES (pre-registered wedge-discriminator-preregistered-20261108)
  if (PHASE === 'A1a') {
    await leg('open-39,-104', 39, -104, 1.2, 30000);
    await leg('open-36,-104', 36, -104, 1.2, 30000);
    await leg('open-33,-104', 33, -104, 1.2, 30000);
    await leg('open-31,-104', 31, -104, 1.2, 30000);
    await leg('open-chainhead', 31, -101, 1.2, 30000);
    await leg('W-32,-99', 32, -99, 1.2, 30000);
    await leg('W-34,-98', 34, -98, 1.2, 30000);
    await leg('W-37,-98', 37, -98, 1.2, 30000);
    await leg('approach-41,-85', 41, -85, 1.2, 30000);
  } else if (PHASE === 'A1b') {
    await leg('relive-hop', 41, -85, 1.2, 30000);
    await leg('relive-hop2', 45, -85, 1.2, 30000);
  } else if (PHASE === 'A2a') {
    await attemptGoto('A2-enter-from-W', 41, -85, 0.6, 15000);
    await attemptGoto('A2-cross-E', 44, -85, 0.6, 15000);
    await attemptGoto('A2-cross-W-back', 41, -85, 0.6, 15000);
  } else if (PHASE === 'A2b') {
    await attemptGoto('A2-enter-from-S', 41, -85, 0.6, 15000);
    await attemptGoto('A2-cross-N', 41, -88, 0.6, 15000);
  } else if (PHASE === 'A3') {
    await attemptGoto('A3-enter-72-101', 72, -101, 0.6, 9000);
    await attemptRaw('A3-raw-W-flat', 73, -101, 4);
    await attemptGoto('A3-goto-W-flat', 73, -101, 0.6, 9000);
    await attemptGoto('A3-return-72-101', 72, -101, 0.6, 9000);
    await attemptGoto('A3-prep-71-102', 71, -102, 0.6, 9000);
    await attemptRaw('A3-raw-N-plus1', 71, -101, 4);
    await attemptGoto('A3-goto-N-plus1', 71, -101, 0.6, 9000);
  }
  await rest('scratch-end', 2000);
  finish(aborted ? 3 : 0);
});
setTimeout(() => { R.events.push({ ev: 'global-timeout' }); aborted = true; abortReason = abortReason || 'global-timeout'; finish(2); }, 1500000);
