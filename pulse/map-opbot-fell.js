'use strict';
// map-opbot-fell.js — op bot for the fell test: ops FellTest,
// teleports it to the surveyed stance once it has joined, deops
// after the test window.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'Gallery', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
bot.on('message', (m) => { try { console.log('SRV:', m.toString().slice(0, 220)); } catch {} });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once('spawn', async () => {
  try {
    await sleep(1500);
    bot.chat('/op FellTest');
    // FellTest joins ~7 s after this bot (driver sequencing); wait
    // for its join, then place it on the stance.
    await new Promise((resolve) => {
      const to = setTimeout(resolve, 25000);
      bot.on('playerJoined', (p) => { if (p && p.username === 'FellTest') { clearTimeout(to); resolve(); } });
    });
    await sleep(1500);
    bot.chat('/tp FellTest 77.5 66 -96.5');
    await sleep(150000); // sense-poll + perceive + fell + arrival-goto window
    bot.chat('/deop FellTest');
    await sleep(2500);
  } catch (e) { console.log('opbot error:', e && e.message); }
  finally { try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
});
