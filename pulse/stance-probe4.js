'use strict';
/* STANCE PROBE 3 — GENUINE FRESH BODY 'StanceProbe4', run in VERIFIED DAYLIGHT
 * (orchestrator time-sets first; script re-checks joined-pos: a genuine spawn
 * with the pool aside lands in the spawn apron; a clone placement is reported
 * as such). Battery: rest signature, travel to pad, chain down to the stance,
 * stance steps both methods, yaw telemetry. */
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const { Vec3 } = require(NM + '/vec3');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'StanceProbe4', auth: 'offline',
  plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r3 = (n) => Math.round(n * 1000) / 1000;
const OUT = PULSE + '/stance-probe4-result.json';
const R = { mode: 'genuine-fresh-daylight', username: 'StanceProbe4', ts: new Date().toISOString(), events: [], legs: [], rests: [], attempts: [] };
const trace = [];
let forcedMoves = [], t0 = Date.now(), startHealth = null, aborted = false, abortReason = null;
bot.on('forcedMove', () => forcedMoves.push(Date.now() - t0));
bot.on('error', (e) => R.events.push({ ev: 'error', msg: String(e && e.message) }));
bot.on('kicked', (r) => R.events.push({ ev: 'kicked', msg: String(r) }));
bot.on('death', () => { R.events.push({ ev: 'DEATH', at: new Date().toISOString() }); aborted = true; abortReason = 'death'; });
bot.on('health', () => { if (startHealth != null && bot.health < startHealth) R.events.push({ ev: 'damage', hp: bot.health }); });
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
    forcedMoves: forcedMoves.filter((t) => t >= a && t <= b).length };
}
function pos() { const p = bot.entity.position; return { x: r3(p.x), y: r3(p.y), z: r3(p.z) }; }
function cellOf(p) { return [Math.floor(p.x), Math.floor(p.z)]; }
function feetY(cx, cz) { const g = prims.groundY(bot, cx, cz); return g == null ? null : g + 1; }
async function rest(tag, ms) {
  const a = Date.now() - t0; await sleep(ms); const b = Date.now() - t0;
  const s = sliceSummary(a, b); s.tag = tag; s.at = pos(); s.cell = cellOf(bot.entity.position);
  R.rests.push(s); console.log('[SP4] rest', tag, JSON.stringify(s)); return s;
}
async function attemptGoto(tag, cx, cz, range = 0.6, timeout = 9000) {
  const fy = feetY(cx, cz); const start = pos(); const fm0 = forcedMoves.length;
  let res = null, err = null;
  try { res = await prims.gotoNear(bot, cx + 0.5, fy == null ? start.y : fy, cz + 0.5, range, timeout); } catch (e) { err = String(e && e.message); }
  const end = pos();
  const rec = { tag, method: 'gotoNear', targetCell: [cx, cz], targetFeetY: fy, start, startCell: cellOf(start), end, endCell: cellOf(end),
    dispH: r3(Math.hypot(end.x - start.x, end.z - start.z)), result: res, err, forcedMoves: forcedMoves.length - fm0 };
  R.attempts.push(rec); console.log('[SP4] goto', tag, JSON.stringify({ end: rec.end, dispH: rec.dispH, ok: res && res.ok, via: res && res.via, fm: rec.forcedMoves }));
  try { bot.pathfinder.setGoal(null); } catch {}
  try { bot.clearControlStates(); } catch {}
  await sleep(600); return rec;
}
async function attemptRaw(tag, cx, cz, seconds = 4) {
  const fy = feetY(cx, cz); const start = pos(); const fm0 = forcedMoves.length;
  try { await bot.lookAt(new Vec3(cx + 0.5, (fy == null ? start.y : fy) + 1.4, cz + 0.5), true); } catch {}
  await sleep(250);
  const facing = { yaw: r3(bot.entity.yaw), pitch: r3(bot.entity.pitch) };
  bot.setControlState('jump', true); bot.setControlState('forward', true);
  await sleep(seconds * 1000);
  bot.clearControlStates();
  const end = pos();
  const rec = { tag, method: 'rawDrive-fwd+jump', targetCell: [cx, cz], facing, start, startCell: cellOf(start), end, endCell: cellOf(end),
    dispH: r3(Math.hypot(end.x - start.x, end.z - start.z)), forcedMoves: forcedMoves.length - fm0 };
  R.attempts.push(rec); console.log('[SP4] raw', tag, JSON.stringify({ end: rec.end, dispH: rec.dispH, fm: rec.forcedMoves, facing }));
  await sleep(600); return rec;
}
function nearestHostile() {
  let best = null, bd = 1e9;
  for (const id in bot.entities) {
    const e = bot.entities[id];
    if (!e || !e.position || !bot.entity) continue;
    const n = (e.name || e.displayName || "").toLowerCase();
    if (["zombie","skeleton","creeper","spider","husk","drowned","stray","witch","pillager"].includes(n)) {
      const d = e.position.distanceTo(bot.entity.position);
      if (d < bd) { bd = d; best = { name: e.name, dist: r3(d) }; }
    }
  }
  return best;
}
async function leg(tag, cx, cz, range = 1.2, timeout = 45000) {
  const start = pos(); const fm0 = forcedMoves.length; const fy = feetY(cx, cz);
  let res = null, err = null;
  try { res = await prims.gotoNear(bot, cx + 0.5, fy == null ? start.y : fy, cz + 0.5, range, timeout); } catch (e) { err = String(e && e.message); }
  const end = pos();
  const rec = { tag, targetCell: [cx, cz], ok: !!(res && res.ok), via: res && res.via, err, start, end,
    dispH: r3(Math.hypot(end.x - start.x, end.z - start.z)), forcedMoves: forcedMoves.length - fm0, hostile: nearestHostile(), hp: bot.health };
  R.legs.push(rec); console.log('[SP4] leg', tag, JSON.stringify(rec));
  try { bot.pathfinder.setGoal(null); } catch {}
  return rec;
}
function finish(code) {
  try {
    R.final = { pos: bot.entity ? pos() : null, health: bot.health, food: bot.food, aborted, abortReason, totalForcedMoves: forcedMoves.length };
    fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  } catch (e) { console.log('[SP4] write err', e.message); }
  console.log('[SP4] DONE', JSON.stringify(R.final));
  try { bot.quit(); } catch {}
  setTimeout(() => process.exit(code), 800);
}
bot.once('spawn', async () => {
  t0 = Date.now(); forcedMoves = [];
  startHealth = bot.health;
  R.spawn = { pos: pos(), health: bot.health, food: bot.food, uuid: bot.uuid || (bot.player && bot.player.uuid) || null };
  try { fs.writeFileSync(PULSE + '/stance-probe4-spawned.flag', JSON.stringify(R.spawn)); } catch {}
  console.log('[SP4] spawn', JSON.stringify(R.spawn));
  await sleep(3000);
  R.settled = { pos: pos(), health: bot.health, food: bot.food };
  await rest('freshgen-at-spawn', 4000);
  if (!aborted) await leg('travel-pad', 64, -93, 1.5, 60000);
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
    await rest('freshgen-at-stance', 4000);
    await attemptGoto('G-A1-goto-W+1', 71, -102);
    if (!aborted) await attemptRaw('G-A2-raw-W+1', 71, -102);
    if (!aborted) await attemptGoto('G-A3-goto-N+1', 71, -101);
    if (!aborted) await attemptRaw('G-A4-raw-N+1', 71, -101);
    if (!aborted) await attemptGoto('G-A5-goto-back-S', 71, -102);
    if (!aborted) await attemptGoto('G-A6-goto-E-stance', 72, -102);
    if (!aborted) await attemptGoto('G-A7-goto-E-dipfloor', 73, -102);
    if (!aborted) await attemptGoto('G-A8-goto-W+1-from-73', 72, -102);
    if (!aborted) await attemptRaw('G-A9-raw-W+1-from-73', 72, -102);
    if (!aborted) await attemptGoto('G-A10-goto-S-73-101', 73, -101);
    if (!aborted) await attemptRaw('G-A11-raw-W-flat-73-101', 72, -101);
    if (!aborted) await rest('freshgen-end', 2000);
  }
  finish(aborted ? 3 : 0);
});
setTimeout(() => { R.events.push({ ev: 'global-timeout' }); finish(2); }, 720000);
