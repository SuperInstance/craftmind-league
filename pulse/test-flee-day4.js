'use strict';
/**
 * test-flee-day4.js — POCKET PROOF for the hop-chaining flee (day-4
 * repair (2)). A THROWAWAY body (FleeTest) is teleported into the dip
 * pocket's deepest cell (75.3, 64, -98.5) — the cell that held Cody for
 * ~60 cycles on day 3 — and the SHIPPED flee (pulse/lib/hopflee.js,
 * the same module the driver's floor calls) is fired toward home.
 * PASS = the body musters within range of home on hops alone.
 * Join order matters: the server throttles a second same-IP join made
 * within its connection-throttle window, so the test body joins FIRST
 * and the op body joins 7 s later.
 * The body is removed from the server afterwards (data/stats/
 * advancements) — it was never a citizen.
 */
const path = require('path');
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const prims = require(path.join(PULSE, 'lib', 'prims.js'));
const { hopFlee } = require(path.join(PULSE, 'lib', 'hopflee.js'));
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const bot = createBot({
    host: '192.168.0.50', port: 25565, username: 'FleeTest', version: '26.1',
    plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
  });
  bot.on('error', (e) => console.log('TEST ERR', e && e.message));
  bot.on('kicked', (r) => console.log('TEST KICKED', String(r)));
  await new Promise((r) => bot.once('spawn', r));
  await sleep(7000); // connection-throttle spacing for the second same-IP join
  const op = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Gallery', auth: 'offline', version: '26.1' });
  op.on('error', (e) => console.log('OP ERR', e && e.message));
  await new Promise((r) => op.once('spawn', r));
  op.chat('/tp FleeTest 75.3 64 -98.5');
  await sleep(3500);
  const p0 = bot.entity.position;
  console.log(`START pos=(${p0.x.toFixed(1)},${p0.y.toFixed(1)},${p0.z.toFixed(1)}) hp=${bot.health} food=${bot.food}`);
  const t0 = Date.now();
  const res = await hopFlee(bot, {
    target: { x: 64, y: 67, z: -93 },
    isClear: () => false,
    maxMs: 75000,
    hopLen: 2,
    musterRange: 3.5,
    log: (s) => console.log('[HOP]', s),
  });
  const p1 = bot.entity ? bot.entity.position : null;
  console.log('RESULT', JSON.stringify({ ...res, elapsedMs: Date.now() - t0, endPos: p1 ? { x: +p1.x.toFixed(1), y: +p1.y.toFixed(1), z: +p1.z.toFixed(1) } : null }));
  console.log(res.ok ? 'FLEE-TEST: PASS' : 'FLEE-TEST: FAIL');
  try { bot.quit(); } catch {}
  await sleep(800);
  try { op.quit(); } catch {}
  await sleep(600);
  process.exit(res.ok ? 0 : 1);
}
main().catch((e) => { console.error('FATAL', e); process.exit(2); });
