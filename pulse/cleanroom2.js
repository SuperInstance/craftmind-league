'use strict';
/** cleanroom2 — bare mineflayer bot AS CODY (no framework, no pulse).
 *  Decisive bisect: entity/playerdata vs framework process. */
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const { pathfinder } = require(NM + '/mineflayer-pathfinder');
const bot = mineflayer.createBot({
  host: '192.168.0.50', port: 25565, username: 'Cody',
  auth: 'offline', plugins: [pathfinder],
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once('spawn', async () => {
  console.log('[CR2] Cody spawned at', JSON.stringify(bot.entity.position), 'gamemode', bot.game && bot.game.gameMode);
  await sleep(3000);
  const start = bot.entity.position.clone();
  await bot.lookAt(start.offset(6, 0, 0), true);
  bot.setControlState('forward', true);
  await sleep(3000);
  bot.setControlState('forward', false);
  console.log('[CR2] moved:', start.distanceTo(bot.entity.position).toFixed(2), 'now at', JSON.stringify(bot.entity.position));
  bot.quit();
  process.exit(0);
});
bot.on('error', (e) => console.log('[CR2] error', e.message));
setTimeout(() => { console.log('[CR2] TIMEOUT'); process.exit(1); }, 45000);
