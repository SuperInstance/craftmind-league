'use strict';
// map-standin.js — operator census stand-in (NOT a citizen): joins
// the Orin world as CensusProbe (world spawn, far west — the same
// country Cody woke in on day 4), idles 90 s so the headed
// cameraman client chunk-loads the home district into its view,
// then quits. Reads nothing, writes nothing; it exists so the
// operator map probe (map-day5.js, joining after) sees real blocks
// instead of air. Files removed from the Orin after the probes.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'CensusProbe', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
bot.once('spawn', async () => {
  const p = bot.entity.position;
  console.log('CensusProbe holding at', p.x.toFixed(1), p.y.toFixed(1), p.z.toFixed(1));
  setTimeout(() => { try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }, 90000);
});
