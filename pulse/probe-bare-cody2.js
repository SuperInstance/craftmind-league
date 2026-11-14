'use strict';
// BARE-CODY ATTRIBUTE PROBE — read live entity attributes + velocity
// behaviour while holding forward. Distinguishes client-physics-zero
// (attribute) from server snap-back.
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Cody', auth: 'offline', plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(3) + ',' + p.y.toFixed(3) + ',' + p.z.toFixed(3);
bot.once('spawn', async () => {
  await sleep(2000);
  console.log('[BC2] pos', fmt(bot.entity.position));
  console.log('[BC2] attributes:', JSON.stringify(bot.entity.attributes, null, 1));
  console.log('[BC2] effects:', JSON.stringify(bot.entity.effects || null));
  console.log('[BC2] vehicle:', String(bot.entity.vehicle));
  try { await bot.lookAt(bot.entity.position.offset(6, 0, 0), true); } catch {}
  bot.setControlState('forward', true);
  for (let i = 0; i < 10; i++) {
    await sleep(500);
    const v = bot.entity.velocity;
    console.log('[BC2] hold', i, 'pos', fmt(bot.entity.position), 'vel', v.x.toFixed(3) + ',' + v.y.toFixed(3) + ',' + v.z.toFixed(3), 'onGround', bot.entity.onGround);
  }
  bot.clearControlStates();
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[BC2] error', e.message));
setTimeout(() => { console.log('[BC2] TIMEOUT'); process.exit(1); }, 60000);
