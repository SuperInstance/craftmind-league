'use strict';
// debug-fell.js — perception debug on the live stance: prints what
// findBlocks(matching fn) returns vs findBlocks(matching ids), and
// the below-cell of the birch foot. Joins as FellTest (the op bot
// places it); read-only.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const prims = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const { Vec3 } = prims;
const LOG_RE = /_log$/;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'FellTest', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
bot.once('spawn', async () => {
  try {
    await sleep(2500);
    const p = bot.entity.position;
    console.log('stance:', p.x.toFixed(1), p.y.toFixed(1), p.z.toFixed(1));
    const byFn = bot.findBlocks({ matching: (b) => b && LOG_RE.test(b.name), maxDistance: 16, count: 256 }) || [];
    console.log('findBlocks(matching fn):', byFn.length, byFn.slice(0, 5).map((v) => `(${v.x},${v.y},${v.z})`).join(' '));
    const data = prims.mcData(bot);
    const ids = ['oak_log', 'birch_log', 'spruce_log', 'acacia_log', 'dark_oak_log'].map((n) => data.blocksByName[n] && data.blocksByName[n].id).filter((v) => v !== undefined);
    console.log('log ids:', ids.join(','));
    const byId = bot.findBlocks({ matching: ids, maxDistance: 16, count: 256 }) || [];
    console.log('findBlocks(matching ids):', byId.length, byId.slice(0, 8).map((v) => `(${v.x},${v.y},${v.z})`).join(' '));
    const foot = bot.blockAt(new Vec3(80, 66, -96));
    const below = bot.blockAt(new Vec3(80, 65, -96));
    console.log('blockAt(80,66,-96):', foot && foot.name, '| boundingBox:', foot && foot.boundingBox);
    console.log('blockAt(80,65,-96):', below && below.name, '| boundingBox:', below && below.boundingBox);
    const near = prims.findBlocks(bot, ['birch_log'], 16, 4);
    console.log('prims.findBlocks birch_log:', JSON.stringify(near));
  } catch (e) { console.log('debug error:', e && e.message); }
  finally { await sleep(500); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
});
