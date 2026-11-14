'use strict';
// map-day5b.js — operator map probe v2 (NOT a citizen): joins the
// Orin world as MapProbe2 AFTER an attended op action (/op via
// RCON-equivalent: runop) has opped it; reads Cody's server-side
// data via /data get entity Cody (Pos incl.), the noplates team
// readback, and re-surveys the tree table + pit cross-section.
// CensusProbe (world spawn, day-4 wake country) idles concurrently
// to keep the home chunks streamed to the headed client.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const prims = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const { Vec3 } = prims;
const LOG_RE = /_log$/;
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'MapProbe2', version: '26.1',
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
    console.log('=== CODY DATA (server /data get entity Cody) ===');
    for (const l of await cmdAwait('/data get entity Cody', 4)) console.log(l.slice(0, 1500));
    console.log('=== NOPLATES (server /team list noplates) ===');
    for (const l of await cmdAwait('/team list noplates', 3)) console.log(l.slice(0, 400));
    // tree table: crown-inclusive columns AND true trunk bases
    const cols = new Map();
    for (let x = 30; x <= 100; x++) for (let z = -125; z <= -60; z++) {
      let topSolid = null;
      for (let y = 80; y >= 58; y--) { const b = bot.blockAt(new Vec3(x, y, z)); if (b && b.boundingBox === 'block') { topSolid = y; break; } }
      if (topSolid === null || topSolid < 64) continue;
      // walk down the column from the top: collect the contiguous
      // log run whose base we can see, plus the ground top.
      for (let y = topSolid; y >= 58; y--) {
        const b = bot.blockAt(new Vec3(x, y, z));
        if (b && LOG_RE.test(b.name)) {
          const k = x + ',' + z;
          const c = cols.get(k) || { x, z, name: b.name, min: 999, max: -1, groundTop: topSolid };
          c.min = Math.min(c.min, y); c.max = Math.max(c.max, y);
          cols.set(k, c);
        }
      }
    }
    console.log('=== TREE TABLE v2 (log columns near home; base = lowest log seen) ===');
    const arr = [...cols.values()].map((c) => ({ ...c, dPit: Math.hypot(c.x + 0.5 - 65.31, c.z + 0.5 + 92.52) }));
    arr.sort((a, b) => a.dPit - b.dPit);
    for (const c of arr.slice(0, 40)) console.log(`col (${c.x},${c.z}) ${c.name} logs y${c.min}..${c.max} base=(${c.x},${c.min},${c.z}) distFromPit ${c.dPit.toFixed(1)}`);
    console.log('tree columns total:', arr.length);
    console.log('=== COLUMN STACKS near pit/home (x 58..72, z -99..-88): full stack per column ===');
    for (let z = -99; z <= -88; z++) for (let x = 58; x <= 72; x++) {
      const stack = [];
      for (let y = 76; y >= 58; y--) { const b = bot.blockAt(new Vec3(x, y, z)); if (b && b.boundingBox === 'block') stack.push(`${b.name.replace('_block', '')}@${y}`); }
      if (stack.length) console.log(`(${x},${z}): ${stack.slice(0, 7).join(', ')}`);
    }
  } catch (e) { console.log('probe error:', e && e.message); }
  finally { await sleep(500); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); }
});
