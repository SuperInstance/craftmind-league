'use strict';
// BARE-BOT LOCOMOTION PROBE — no framework. Tests three drivers toward
// the gate target (69,67,-83) across the x=53 terrace:
//  1. prims.gotoNear (repaired pulse prims, walk-only movements)
//  2. raw held controls: lookAt east + forward + jump held 6 s
//  3. pathfinder with near-default Movements (canDig=false only)
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const { goals, Movements } = require(NM + '/mineflayer-pathfinder');
const prims = require(PULSE + '/lib/prims.js');
const mcData = require(NM + '/minecraft-data');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'GateBare', auth: 'offline', plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(2) + ',' + p.y.toFixed(2) + ',' + p.z.toFixed(2);
let maxX = -999, logTimer = null;
function startLog(tag) {
  stopLog();
  logTimer = setInterval(() => {
    const p = bot.entity.position;
    if (p.x > maxX) maxX = p.x;
    console.log('[BARE]', tag, fmt(p), 'vel', bot.entity.velocity.x.toFixed(2) + ',' + bot.entity.velocity.y.toFixed(2) + ',' + bot.entity.velocity.z.toFixed(2), 'onGround', bot.entity.onGround);
  }, 400);
}
function stopLog() { if (logTimer) { clearInterval(logTimer); logTimer = null; } }

bot.once('spawn', async () => {
  console.log('[BARE] spawned at', fmt(bot.entity.position));
  await sleep(2500);
  console.log('[BARE] settled at', fmt(bot.entity.position));

  // Driver 1: repaired prims gotoNear across the terrace
  startLog('gotoNear');
  const r1 = await prims.gotoNear(bot, 69, 67, -83, 1.5, 60000);
  stopLog();
  console.log('[BARE] gotoNear result', JSON.stringify(r1), 'end', fmt(bot.entity.position), 'maxX', maxX.toFixed(2));

  // Driver 2: walk back west a little with raw controls, then EAST with forward+jump held
  try { await bot.lookAt(bot.entity.position.offset(-6, 0, 0), true); } catch {}
  bot.setControlState('forward', true);
  await sleep(3000);
  bot.clearControlStates();
  console.log('[BARE] after raw west 3s:', fmt(bot.entity.position));
  maxX = bot.entity.position.x;
  startLog('raw+jump');
  try { await bot.lookAt(bot.entity.position.offset(6, 0, 0), true); } catch {}
  bot.setControlState('jump', true);
  bot.setControlState('forward', true);
  await sleep(6000);
  bot.clearControlStates();
  stopLog();
  console.log('[BARE] raw east+jump 6s end', fmt(bot.entity.position), 'maxX', maxX.toFixed(2));

  // Driver 3: pathfinder default-ish movements from wherever we are
  const mv = new Movements(bot, mcData(bot.version));
  mv.canDig = false;
  bot.pathfinder.setMovements(mv);
  maxX = bot.entity.position.x;
  startLog('pf-default');
  try {
    await bot.pathfinder.goto(new goals.GoalNear(69, 67, -83, 1.5));
    console.log('[BARE] pf-default goto RESOLVED');
  } catch (e) {
    console.log('[BARE] pf-default goto FAILED:', e.message);
  }
  stopLog();
  console.log('[BARE] pf-default end', fmt(bot.entity.position), 'maxX', maxX.toFixed(2));
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[BARE] error', e.message));
bot.on('kicked', (r) => console.log('[BARE] kicked', String(r)));
setTimeout(() => { console.log('[BARE] TIMEOUT'); process.exit(1); }, 240000);
