'use strict';
// map-day5c.js — operator census v3 (NOT a citizen): joins as
// MapProbe3 (opped by the op bot for the window, deopped after).
// Surveys a WIDE box at FINE grain: for every column, the full
// solid stack y58..80, out of which true trunk feet (a log whose
// below-cell is solid non-log ground) are derived offline. Also
// reads Cody's /data + the noplates team. CensusProbe (world
// spawn) idles concurrently to keep chunks streamed.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const prims = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const { Vec3 } = prims;
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'MapProbe3', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function cmdAwait(text, secs) {
  return new Promise((resolve) => {
    const lines = [];
    const onMsg = (jsonMsg) => { try { lines.push(jsonMsg.toString()); } catch {} };
    bot.on('message', onMsg);
    try { bot.chat(text); } catch {}
    setTimeout(() => { bot.removeListener('message', onMsg); resolve(lines); }, secs * 1000);
  });
}
bot.once('spawn', async () => {
  try {
    await sleep(2000);
    console.log('=== CODY DATA ===');
    for (const l of await cmdAwait('/data get entity Cody', 4)) console.log(l.slice(0, 1600));
    console.log('=== STACKS x20..110 z-130..-55 (name@y, top-down, solids only) ===');
    for (let z = -130; z <= -55; z++) for (let x = 20; x <= 110; x++) {
      const stack = [];
      for (let y = 80; y >= 58; y--) { const b = bot.blockAt(new Vec3(x, y, z)); if (b && b.boundingBox === 'block') stack.push(`${b.name}@${y}`); }
      if (stack.length) console.log(`(${x},${z}): ${stack.join(', ')}`);
    }
  } catch (e) { console.log('probe error:', e && e.message); }
  finally { await sleep(500); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
});
