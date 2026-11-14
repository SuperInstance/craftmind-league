'use strict';
// proof-driverpattern-day7.js — a single-bot DRIVER-PATTERN process
// (throwaway ProvMate) that runs alongside the op process for the
// proof's duration, heartbeating to its own file. Its survival next
// to the op process is the non-disturbance evidence.
const fs = require('fs');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const HB = process.argv[2];
const bot = createBot({
  host: process.env.MC_HOST || '127.0.0.1', port: parseInt(process.env.MC_PORT || '25875', 10), username: 'ProvMate', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('mate error:', e && e.message));
bot.on('kicked', (r) => console.log('mate kicked:', String(r)));
bot.once('spawn', () => console.log('mate spawned at', JSON.stringify(bot.entity.position)));
const iv = setInterval(() => {
  const row = { ts: new Date().toISOString(), alive: !!bot.entity, food: bot.food, hp: bot.health, pos: bot.entity ? bot.entity.position : null };
  fs.appendFileSync(HB, JSON.stringify(row) + '\n');
}, 5000);
setTimeout(() => { clearInterval(iv); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }, parseInt(process.env.MATE_MS || '240000', 10));
