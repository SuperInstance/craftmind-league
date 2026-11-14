'use strict';
// BARE-CODY SESSION-RACE PROBE — on each login: report onGround, try
// east jump+forward, then a jump-only ritual, then east again.
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Cody', auth: 'offline', plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(3) + ',' + p.y.toFixed(3) + ',' + p.z.toFixed(3);
async function eastPush(tag) {
  const s = bot.entity.position.clone();
  try { await bot.lookAt(s.offset(6, 0, 0), true); } catch {}
  bot.setControlState('jump', true);
  bot.setControlState('forward', true);
  await sleep(4000);
  bot.clearControlStates();
  const e = bot.entity.position;
  console.log('[BC4]', tag, 'start', fmt(s), 'end', fmt(e), 'dx', (e.x - s.x).toFixed(3), 'onGround', bot.entity.onGround);
  return e.x - s.x;
}
bot.once('spawn', async () => {
  await sleep(1500);
  console.log('[BC4] spawn pos', fmt(bot.entity.position), 'onGround', bot.entity.onGround);
  await sleep(1500);
  console.log('[BC4] settled? pos', fmt(bot.entity.position), 'onGround', bot.entity.onGround);
  await eastPush('east-1 (as-logged-in)');
  // jump-only ritual
  bot.setControlState('jump', true);
  await sleep(600);
  bot.setControlState('jump', false);
  await sleep(1200);
  console.log('[BC4] after jump ritual: pos', fmt(bot.entity.position), 'onGround', bot.entity.onGround);
  await eastPush('east-2 (after ritual)');
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[BC4] error', e.message));
setTimeout(() => { console.log('[BC4] TIMEOUT'); process.exit(1); }, 45000);
