'use strict';
// SPOT TEST — healthy bot stands at Cody's exact stall position and
// reports physics state; then tries to walk east from it.
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'GateBare', auth: 'offline', plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(3) + ',' + p.y.toFixed(3) + ',' + p.z.toFixed(3);
bot.once('spawn', async () => {
  await sleep(2000);
  console.log('[SPOT] spawned', fmt(bot.entity.position));
  const r = await prims.gotoNear(bot, 51.69, 66, -83.61, 0.6, 60000);
  console.log('[SPOT] gotoNear to Cody spot:', JSON.stringify(r), 'at', fmt(bot.entity.position));
  for (let i = 0; i < 6; i++) {
    await sleep(700);
    console.log('[SPOT] stand', i, fmt(bot.entity.position), 'onGround', bot.entity.onGround, 'velY', bot.entity.velocity.y.toFixed(3));
  }
  const r2 = await prims.gotoNear(bot, 69, 67, -83, 1.5, 60000);
  console.log('[SPOT] gotoNear east from spot:', JSON.stringify(r2), 'at', fmt(bot.entity.position));
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[SPOT] error', e.message));
setTimeout(() => { console.log('[SPOT] TIMEOUT'); process.exit(1); }, 150000);
