'use strict';
// PIT TEST — healthy bot into Cody's pit (51.685,65,-81.319), then the
// exact east jump+forward push that Cody fails.
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'GateBare', auth: 'offline', plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(3) + ',' + p.y.toFixed(3) + ',' + p.z.toFixed(3);
bot.once('spawn', async () => {
  await sleep(2000);
  console.log('[PIT] spawned', fmt(bot.entity.position));
  const r = await prims.gotoNear(bot, 51.69, 65, -81.32, 0.7, 60000);
  console.log('[PIT] gotoNear into pit:', JSON.stringify(r), 'at', fmt(bot.entity.position), 'onGround', bot.entity.onGround);
  const s = bot.entity.position.clone();
  try { await bot.lookAt(s.offset(6, 0, 0), true); } catch {}
  bot.setControlState('jump', true);
  bot.setControlState('forward', true);
  await sleep(4000);
  bot.clearControlStates();
  const e = bot.entity.position;
  console.log('[PIT] east jump+forward 4s: start', fmt(s), 'end', fmt(e), 'dx', (e.x - s.x).toFixed(3));
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[PIT] error', e.message));
setTimeout(() => { console.log('[PIT] TIMEOUT'); process.exit(1); }, 120000);
