'use strict';
// STAGE VERIFY (Day-2 lane): read-only re-check of the staged set.
// Census of the pen/wheat columns + entity read; also confirms the
// farmland has not reverted and the wheat stands. Writes
// pulse/stage-verify-result.json.
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const Vec3 = require(NM + '/vec3').Vec3;
const OUT = '/home/caseydigennaro/craftmind-league/pulse/stage-verify-result.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'StageVerify', auth: 'offline' });
bot.on('error', (e) => console.log('ERR', e && e.message));
bot.on('kicked', (r) => console.log('KICKED', String(r)));
function columnList(x, z, yHi, yLo) {
  const out = [];
  for (let y = yHi; y >= yLo; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    out.push(y + ':' + (b ? b.name : 'null'));
  }
  return out;
}
bot.once('spawn', async () => {
  try {
    await sleep(5000);
    const cols = {};
    // pen block x60..65, z-103..-98: read y67 (fence line) + y66 ground
    for (let x = 60; x <= 65; x++) for (let z = -103; z <= -98; z++) {
      const b67 = bot.blockAt(new Vec3(x, 67, z));
      const b66 = bot.blockAt(new Vec3(x, 66, z));
      cols[x + ',' + z] = { y67: b67 ? b67.name : null, y66: b66 ? b66.name : null };
    }
    // wheat block x64..68, z-98..-94 full columns
    const wheatCols = {};
    for (let x = 64; x <= 68; x++) for (let z = -98; z <= -94; z++) {
      wheatCols[x + ',' + z] = columnList(x, z, 68, 64);
    }
    const ents = [];
    for (const e of Object.values(bot.entities || {})) {
      if (e && e.position && e.name && e.name !== 'item') {
        const d = e.position.distanceTo(new Vec3(62.5, 67, -100.5));
        if (d <= 42) ents.push({ name: e.name, x: +e.position.x.toFixed(1), y: +e.position.y.toFixed(1), z: +e.position.z.toFixed(1) });
      }
    }
    const p = bot.entity.position;
    fs.writeFileSync(OUT, JSON.stringify({ ts: new Date().toISOString(), probePos: { x: p.x, y: p.y, z: p.z }, penCols: cols, wheatCols, ents }, null, 1));
    console.log('verify written; ents', ents.length);
    bot.quit(); process.exit(0);
  } catch (e) { console.log('FATAL', e); try { bot.quit(); } catch {} process.exit(1); }
});
