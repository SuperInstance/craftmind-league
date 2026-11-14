'use strict';
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Cody', auth: 'offline' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function fmt(p){ return p.x.toFixed(3)+','+p.y.toFixed(3)+','+p.z.toFixed(3); }
async function walk(label, dx, dz, seconds, jump){
  const start = bot.entity.position.clone();
  await bot.lookAt(start.offset(dx, 0, dz), true);
  await sleep(150);
  if (jump) bot.setControlState('jump', true);
  bot.setControlState('forward', true);
  await sleep(seconds*1000);
  bot.setControlState('forward', false);
  bot.setControlState('jump', false);
  const end = bot.entity.position.clone();
  console.log('[BARE]', label, 'start', fmt(start), 'end', fmt(end), 'displacement', start.distanceTo(end).toFixed(3));
  await sleep(400);
}
bot.once('spawn', async () => {
  console.log('[BARE] spawned as Cody at', fmt(bot.entity.position), 'onGround', bot.entity.onGround, 'vehicle', String(bot.entity.vehicle));
  await sleep(2500);
  console.log('[BARE] settled pos', fmt(bot.entity.position));
  await walk('EAST +x (replicates bisect probe)', 6, 0, 3, false);
  await walk('NORTH -z (open floor per block scan)', 0, -6, 3, false);
  await walk('WEST -x', -6, 0, 3, false);
  await walk('SOUTH +z', 0, 6, 3, false);
  await walk('NORTH -z with JUMP held', 0, -6, 3, true);
  await walk('EAST +x with JUMP held', 6, 0, 3, true);
  console.log('[BARE] final pos', fmt(bot.entity.position));
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[BARE] error', e.message));
bot.on('kicked', (r) => console.log('[BARE] kicked', r));
setTimeout(() => { console.log('[BARE] TIMEOUT'); process.exit(1); }, 90000);
