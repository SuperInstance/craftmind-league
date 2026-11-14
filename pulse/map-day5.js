'use strict';
// map-day5.js — operator map probe (NOT a citizen): joins the Orin
// world as MapProbe, reads the block world around home, quits.
// Prints: (T) the tree table around the pit/home (every log column:
// foot cell + species) for the trunk-proof replay; (P) the pit
// cross-section (columns x 62..68, z -92..-94, tops + block stacks);
// (S) Cody's server-side NBT (Pos/Health/foodLevel/Inventory/Deaths
// via /data get entity Cody) — the wake ground truth; (N) the
// noplates team readback. Writes nothing in the world.
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const prims = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const { Vec3 } = prims;
const LOG_RE = /_log$/;

const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'MapProbe', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function cmdAwait(text, secs) {
  return new Promise((resolve) => {
    const lines = [];
    const onMsg = (jsonMsg) => { lines.push(jsonMsg.toString()); };
    bot.on('message', onMsg);
    bot.chat(text);
    setTimeout(() => { bot.removeListener('message', onMsg); resolve(lines); }, secs * 1000);
  });
}

bot.once('spawn', async () => {
  try {
    await sleep(2500);
    const p = bot.entity.position;
    console.log('MapProbe spawned at', p.x.toFixed(1), p.y.toFixed(1), p.z.toFixed(1));
    // (S) Cody NBT from the server
    const dataLines = await cmdAwait('/data get entity Cody', 3);
    console.log('=== CODY NBT (server) ===');
    for (const l of dataLines) console.log(l.slice(0, 900));
    // (N) noplates readback
    const teamLines = await cmdAwait('/team list noplates', 3);
    console.log('=== NOPLATES ===');
    for (const l of teamLines) console.log(l.slice(0, 300));

    // (T) tree table: all log columns whose any part is within the box
    const cx0 = 30, cx1 = 100, cz0 = -125, cz1 = -60;
    const cols = new Map();
    for (let x = cx0; x <= cx1; x++) for (let z = cz0; z <= cz1; z++) {
      for (let y = 55; y <= 85; y++) {
        const b = bot.blockAt(new Vec3(x, y, z));
        if (b && LOG_RE.test(b.name)) {
          const k = x + ',' + z;
          const c = cols.get(k) || { x, z, name: b.name, min: 999, max: -1 };
          c.min = Math.min(c.min, y); c.max = Math.max(c.max, y);
          cols.set(k, c);
        }
      }
    }
    console.log('=== TREE TABLE (columns with logs, box x30..100 z-125..-60) ===');
    const hp = { x: 65.31, z: -92.52 };
    const arr = [...cols.values()].map((c) => ({ ...c, dHome: Math.hypot(c.x + 0.5 - 64.5, c.z + 0.5 + 93.5), dPit: Math.hypot(c.x + 0.5 - hp.x, c.z + 0.5 - hp.z) }));
    arr.sort((a, b) => a.dPit - b.dPit);
    for (const c of arr) console.log(`col (${c.x},${c.z}) ${c.name} logs y${c.min}..${c.max} foot=(${c.x},${c.min},${c.z}) distFromPit ${c.dPit.toFixed(1)} distFromAnchor ${c.dHome.toFixed(1)}`);
    console.log('tree columns total:', arr.length);

    // (P) pit cross-section
    console.log('=== PIT CROSS-SECTION (tops + stack, x 62..68, z -95..-90) ===');
    for (let z = -95; z <= -90; z++) {
      const row = [];
      for (let x = 62; x <= 68; x++) {
        let top = null; const stack = [];
        for (let y = 72; y >= 58; y--) {
          const b = bot.blockAt(new Vec3(x, y, z));
          if (b && b.boundingBox === 'block') { if (top === null) top = y; if (stack.length < 5) stack.push(`${b.name.replace('_block', '')}@${y}`); }
        }
        row.push(`(${x},${z}) top=${top} [${stack.join(',')}]`);
      }
      console.log(row.join(' | '));
    }
  } catch (e) {
    console.log('probe error:', e && e.message);
  } finally {
    await sleep(500);
    try { bot.quit(); } catch {}
    setTimeout(() => process.exit(0), 800);
  }
});
