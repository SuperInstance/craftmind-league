'use strict';
// map-survey6.js — day-6 operator census of the home bench west of
// the pit: is (60,63,-92) a real standable bench cell on the LIVE
// world (spike rig said stand y63)? Reads the column stack around
// x56..64, z-95..-89 from a throwaway probe body spawned near home.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const { Vec3 } = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const bot = createBot({ host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'SurveyProbe6', version: '26.1', plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'] });
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once('spawn', async () => {
  await sleep(2500);
  const p = bot.entity.position;
  console.log('probe spawn:', p.x.toFixed(1), p.y.toFixed(1), p.z.toFixed(1));
  for (let x = 57; x <= 66; x++) {
    for (let z = -95; z <= -89; z++) {
      let top = null;
      for (let y = 75; y >= 55; y--) {
        const b = bot.blockAt(new Vec3(x, y, z));
        if (b && b.boundingBox === 'block') { top = { y, name: b.name }; break; }
      }
      console.log(`col (${x},${z}): top=${top ? top.name + '@y' + top.y : 'none'}`);
    }
  }
  try { bot.quit(); } catch {}
  setTimeout(() => process.exit(0), 800);
});
