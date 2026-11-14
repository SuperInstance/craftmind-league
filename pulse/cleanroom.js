'use strict';
/**
 * cleanroom.js — SCAFFOLD DIAGNOSTIC #4 (bisect): a BARE mineflayer bot,
 * no framework, no pulse plugin. Connects as PulseProbe, walks 6 blocks
 * east via control states, samples physics. If this moves, the resident
 * process is the problem; if it freezes too, it's stack/environment.
 */
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const { pathfinder } = require(NM + '/mineflayer-pathfinder');
const bot = mineflayer.createBot({
  host: '192.168.0.50', port: 25565, username: 'PulseProbe',
  auth: 'offline', plugins: [pathfinder],
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let physTicks = 0;
bot.on('physicTick', () => { physTicks++; });
bot.once('spawn', async () => {
  console.log('[CR] spawned at', JSON.stringify(bot.entity.position), 'gamemode', bot.game && bot.game.gameMode, 'version', bot.version);
  await sleep(3000);
  const start = bot.entity.position.clone();
  const ticksBefore = physTicks;
  bot.setControlState('forward', true);
  await bot.lookAt(start.offset(6, 0, 0), true);
  bot.setControlState('forward', true);
  for (let i = 0; i < 6; i++) {
    await sleep(500);
    console.log(`[CR] t${i} pos ${bot.entity.position.x.toFixed(3)},${bot.entity.position.y.toFixed(3)},${bot.entity.position.z.toFixed(3)} vel ${bot.entity.velocity.x.toFixed(3)},${bot.entity.velocity.y.toFixed(3)},${bot.entity.velocity.z.toFixed(3)} physTicks+${physTicks - ticksBefore}`);
  }
  bot.setControlState('forward', false);
  console.log('[CR] total moved:', start.distanceTo(bot.entity.position).toFixed(2));
  bot.quit();
  process.exit(0);
});
bot.on('error', (e) => console.log('[CR] error', e.message));
setTimeout(() => { console.log('[CR] TIMEOUT — no spawn in 40s'); process.exit(1); }, 40000);
