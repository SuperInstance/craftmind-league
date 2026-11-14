'use strict';
// STAGE PROBE DAY 3 (operator instrument — not a citizen): rides the
// cameraman tp-shuttle toward the anchor, then reads: (1) every pen
// ring cell (x61..64 / z-102..-99) with the block at y66,y67,y68;
// (2) the wheat plot cells incl. wheat ages; (3) entity census within
// 40 of the anchor and within 30 of pen centre (62.5,67,-100.5);
// (4) the table/planks cells at home. Read-only. Writes
// pulse/stage-probe-day3-result.json.
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const Vec3 = require(NM + '/vec3').Vec3;
const OUT = '/home/caseydigennaro/craftmind-league/pulse/stage-probe-day3-result.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'StageProbe', auth: 'offline' });
bot.on('error', (e) => console.log('ERR', e && e.message));
bot.on('kicked', (r) => console.log('KICKED', String(r)));
function cell(x, y, z) {
  const b = bot.blockAt(new Vec3(x, y, z));
  if (!b) return null;
  let age = null;
  if (b.name === 'wheat') { try { age = b.getProperties ? b.getProperties().age : null; } catch {} }
  return { name: b.name, age };
}
bot.once('spawn', async () => {
  try {
    await sleep(4000);
    const deadline = Date.now() + 150000;
    let moved = false;
    while (Date.now() < deadline) {
      const p = bot.entity.position;
      if (Math.hypot(p.x - 64, p.z + 93) < 45) { moved = true; break; }
      await sleep(6000);
    }
    if (!moved) { fs.writeFileSync(OUT, JSON.stringify({ ok: false, why: 'shuttle never came within 45 of anchor' })); bot.quit(); process.exit(0); }
    await sleep(6000);
    const pen = {};
    for (let x = 60; x <= 65; x++) for (let z = -103; z <= -98; z++) {
      pen[x + ',' + z] = { y66: cell(x, 66, z), y67: cell(x, 67, z), y68: cell(x, 68, z) };
    }
    const plot = {};
    for (let x = 64; x <= 68; x++) for (let z = -98; z <= -94; z++) {
      plot[x + ',' + z] = { y66: cell(x, 66, z), y67: cell(x, 67, z) };
    }
    const home = { table: cell(64, 67, -94), planks: cell(63, 67, -94), anchorTop: cell(64, 67, -93) };
    const ents = [];
    for (const e of Object.values(bot.entities || {})) {
      if (e && e.position && e.name && e.name !== 'item') {
        const dA = e.position.distanceTo(new Vec3(64, 67, -93));
        const dP = e.position.distanceTo(new Vec3(62.5, 67, -100.5));
        if (dA <= 45) ents.push({ name: e.name, x: +e.position.x.toFixed(1), y: +e.position.y.toFixed(1), z: +e.position.z.toFixed(1), dAnchor: +dA.toFixed(1), dPen: +dP.toFixed(1) });
      }
    }
    fs.writeFileSync(OUT, JSON.stringify({ ok: true, pen, plot, home, ents }, null, 1));
    console.log('day3 census written; ents', ents.length);
    bot.quit(); process.exit(0);
  } catch (e) { console.log('FATAL', e); try { bot.quit(); } catch {} process.exit(1); }
});
