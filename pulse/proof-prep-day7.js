'use strict';
// proof-prep-day7.js v2 — conditioning body: joins as ProvTarget and
// STAYS online, printing pos/food every 2 s, until stdout sees QUIT
// (stdin) or COND_MS elapses. The lane drives placement + hunger via
// RCON against the LIVE body, then verifies food == 0 in the pit
// cell from this body's own reports before quitting it.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = createBot({
  host: '127.0.0.1', port: 25875, username: 'ProvTarget', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
bot.once('spawn', () => {
  console.log('PREP online');
  const iv = setInterval(() => {
    const p = bot.entity.position;
    console.log(`PREP pos ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)} food ${bot.food} hp ${bot.health}`);
  }, 2000);
  process.stdin.on('data', () => { clearInterval(iv); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 600); });
  setTimeout(() => { clearInterval(iv); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 600); }, parseInt(process.env.COND_MS || '150000', 10));
});
