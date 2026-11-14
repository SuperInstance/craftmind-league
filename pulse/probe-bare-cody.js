'use strict';
// BARE-CODY PROBE — username Cody, NO framework. If this moves, the
// framework instance is the culprit; if it wedges like the resident,
// Cody's server-side state is.
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Cody', auth: 'offline', plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(2) + ',' + p.y.toFixed(2) + ',' + p.z.toFixed(2);
bot.once('spawn', async () => {
  console.log('[BC] spawned at', fmt(bot.entity.position));
  await sleep(2500);
  console.log('[BC] settled at', fmt(bot.entity.position), 'health', bot.health, 'food', bot.food);
  const t0 = Date.now();
  const iv = setInterval(() => console.log('[BC] t+' + ((Date.now() - t0) / 1000).toFixed(0) + 's', fmt(bot.entity.position)), 2000);
  const r = await prims.gotoNear(bot, 69, 67, -83, 1.5, 60000);
  clearInterval(iv);
  console.log('[BC] gotoNear east result', JSON.stringify(r), 'end', fmt(bot.entity.position));
  // raw forward+jump east for 5 s
  try { await bot.lookAt(bot.entity.position.offset(6, 0, 0), true); } catch {}
  bot.setControlState('jump', true);
  bot.setControlState('forward', true);
  await sleep(5000);
  bot.clearControlStates();
  console.log('[BC] raw east+jump 5s end', fmt(bot.entity.position));
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[BC] error', e.message));
bot.on('kicked', (r) => console.log('[BC] kicked', String(r)));
setTimeout(() => { console.log('[BC] TIMEOUT'); process.exit(1); }, 120000);
