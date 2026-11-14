'use strict';
// STAGE PROBE (Day-2 lane, operator instrument — not a citizen):
// joins from world spawn, rides the cameraman's /execute tp shuttle to
// the anchor country (operator move of a probe), reads a full terrain
// census around the anchor, walks candidate stage sites on its own feet
// (prim walkers), then quits. Read/write split: reads + walks only.
// Writes: pulse/stage-probe-result.json on the Thor.
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const Vec3 = require(NM + '/vec3').Vec3;
const prims = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const OUT = '/home/caseydigennaro/craftmind-league/pulse/stage-probe-result.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'StageProbe', auth: 'offline' });
bot.on('error', (e) => console.log('ERR', e && e.message));
bot.on('kicked', (r) => console.log('KICKED', String(r)));
function column(x, z) {
  let top = null, name = null, litter = null, waterY = null;
  const logs = [];
  for (let y = 95; y > 45; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (!b) continue;
    if (b.name === 'water' && waterY === null) waterY = y;
    if (b.name === 'leaf_litter' && litter === null) litter = y;
    if (/_(log|wood)$/.test(b.name)) logs.push(y);
    if (b.boundingBox === 'block' && !/_leaves$/.test(b.name) && !/_(log|wood)$/.test(b.name) && b.name !== 'water' && top === null) { top = y; name = b.name; }
    if (top !== null && y < top - 2) break;
  }
  return { top, name, litter, logs, waterY };
}
bot.once('spawn', async () => {
  try {
    console.log('spawned at', bot.entity.position);
    await sleep(4000);
    // Ride the cameraman shuttle: face Cody's last country, repeatedly.
    const deadline = Date.now() + 150000;
    let moved = false;
    while (Date.now() < deadline) {
      const p = bot.entity.position;
      const dAnchor = Math.hypot(p.x - 64, p.z + 93);
      console.log('tick pos', p.x.toFixed(1), p.y.toFixed(1), p.z.toFixed(1), 'distAnchor', dAnchor.toFixed(1));
      if (dAnchor < 45) { moved = true; break; }
      await sleep(6000);
    }
    if (!moved) { fs.writeFileSync(OUT, JSON.stringify({ ok: false, why: 'shuttle never came within 45 of anchor', pos: bot.entity.position }, null, 1)); bot.quit(); process.exit(0); }
    await sleep(6000); // settle: stand still while later cuts land nearby
    // Census: x 52..80, z -112..-84 (+ a water scan wider)
    const cells = {};
    let unloaded = 0;
    for (let x = 52; x <= 80; x++) for (let z = -112; z <= -84; z++) {
      const c = column(x, z);
      if (c.top === null && c.waterY === null) { unloaded++; continue; }
      cells[x + ',' + z] = c;
    }
    // Entity read around the anchor
    const ents = [];
    for (const e of Object.values(bot.entities || {})) {
      if (e && e.position && e.name && e.name !== 'item') {
        const d = e.position.distanceTo(new Vec3(64, 67, -93));
        if (d <= 40) ents.push({ name: e.name, x: +e.position.x.toFixed(1), y: +e.position.y.toFixed(1), z: +e.position.z.toFixed(1), d: +d.toFixed(1) });
      }
    }
    const p0 = bot.entity.position;
    fs.writeFileSync(OUT, JSON.stringify({ ok: true, stage: 'census', probePos: { x: p0.x, y: p0.y, z: p0.z }, unloaded, cells, ents }, null, 1));
    console.log('census written; unloaded', unloaded, 'ents', ents.length);
    bot.quit();
    process.exit(0);
  } catch (e) { console.log('FATAL', e); try { bot.quit(); } catch {} process.exit(1); }
});
