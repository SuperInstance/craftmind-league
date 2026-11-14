'use strict';
// BARE-CODY PHYSICS PROBE — is physicsTick firing? what does his own
// client see under him? gamemode? jump-only test.
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const { Vec3 } = require(NM + '/vec3');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Cody', auth: 'offline', plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => p.x.toFixed(3) + ',' + p.y.toFixed(3) + ',' + p.z.toFixed(3);
let ticks = 0;
bot.on('physicsTick', () => { ticks++; });
bot.once('spawn', async () => {
  await sleep(2000);
  console.log('[BC3] pos', fmt(bot.entity.position));
  console.log('[BC3] gameMode', bot.game && bot.game.gameMode, 'physicsTicks in 2s:', ticks);
  const below = bot.blockAt(bot.entity.position.offset(0, -1, 0));
  const atFeet = bot.blockAt(bot.entity.position);
  const atHead = bot.blockAt(bot.entity.position.offset(0, 1, 0));
  console.log('[BC3] block below:', below ? below.name + ' bb=' + below.boundingBox : String(below));
  console.log('[BC3] block at feet:', atFeet ? atFeet.name + ' bb=' + atFeet.boundingBox : String(atFeet));
  console.log('[BC3] block at head:', atHead ? atHead.name : String(atHead));
  console.log('[BC3] chunk loaded check (blockAt 5 east):', (() => { const b = bot.blockAt(new Vec3(56, 66, -84)); return b ? b.name : String(b); })());
  ticks = 0;
  bot.setControlState('jump', true);
  await sleep(1500);
  bot.setControlState('jump', false);
  console.log('[BC3] after jump-only 1.5s: pos', fmt(bot.entity.position), 'physicsTicks:', ticks, 'onGround', bot.entity.onGround);
  ticks = 0;
  try { await bot.lookAt(bot.entity.position.offset(0, 0, 6), true); } catch {}
  bot.setControlState('forward', true);
  await sleep(2000);
  bot.clearControlStates();
  console.log('[BC3] after south-forward 2s: pos', fmt(bot.entity.position), 'physicsTicks:', ticks);
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[BC3] error', e.message));
setTimeout(() => { console.log('[BC3] TIMEOUT'); process.exit(1); }, 60000);
