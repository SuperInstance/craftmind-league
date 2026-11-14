'use strict';
// map-opbot3.js — op bot for census v3: ops MapProbe3, deops after
// its read window (~75 s: the wide survey is a big blockAt sweep).
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'Gallery', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
bot.on('message', (m) => { try { console.log('SRV:', m.toString().slice(0, 200)); } catch {} });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once('spawn', async () => {
  try {
    await sleep(1500);
    bot.chat('/op MapProbe3');
    await sleep(80000);
    bot.chat('/deop MapProbe3');
    await sleep(2500);
  } catch (e) { console.log('opbot error:', e && e.message); }
  finally { try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
});
