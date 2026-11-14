'use strict';
/**
 * stage-day4.js — DAY-4 OPERATOR INSTRUMENT (not a citizen).
 *
 * Joins as the OPPED account 'Gallery' (server ops.json, level 4) so
 * stage work never touches the headed client or the cameraman's GUI
 * surface. Two modes:
 *   census — teleport self to the anchor; read pen rings, wheat
 *            cells+ages, home table cells, pocket table cell; count
 *            farm animals inside the pen and within 45 of the anchor.
 *            Writes pulse/stage-day4-census.json. Read-only in world.
 *   repair — close the outer pen ring's two unstaged south corners
 *            (60,67,-98) and (65,67,-98) with oak_fence; then, ONLY if
 *            the census counts warrant (target inside the pen: the
 *            cow pair + 2 pigs + 2 chickens), summon the shortfall of
 *            pigs/chickens at the pen centre floor; save-all; then a
 *            verify re-read of the two corners + inside stock.
 * Both modes: every command is echoed to the process log (the server
 * log carries its own verbatim copy), then quit cleanly.
 */
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const Vec3 = require(NM + '/vec3').Vec3;
const MODE = process.argv[2] || 'census';
const OUT = '/home/caseydigennaro/craftmind-league/pulse/stage-day4-census.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Gallery', auth: 'offline', version: '26.1' });
bot.on('error', (e) => console.log('ERR', e && e.message));
bot.on('kicked', (r) => console.log('KICKED', String(r)));
bot.on('message', (m) => { const s = String(m); if (/fence|summon|Saved|Teleported|op|permission/i.test(s)) console.log('SERVER MSG:', s.slice(0, 160)); });

function cell(x, y, z) {
  const b = bot.blockAt(new Vec3(x, y, z));
  if (!b) return null;
  let age = null;
  if (b.name === 'wheat') { try { age = b.getProperties ? b.getProperties().age : null; } catch {} }
  return { name: b.name, age };
}
function census() {
  const pen = {};
  for (let x = 59; x <= 66; x++) for (let z = -104; z <= -97; z++) {
    pen[x + ',' + z] = { y66: cell(x, 66, z), y67: cell(x, 67, z) };
  }
  const plot = {};
  for (let x = 64; x <= 68; x++) for (let z = -98; z <= -94; z++) {
    plot[x + ',' + z] = { y66: cell(x, 66, z), y67: cell(x, 67, z) };
  }
  const home = {
    t63: cell(63, 67, -94), t64: cell(64, 67, -94), anchor: cell(64, 67, -93),
    pocketTable: cell(77, 64, -98), pocketFloor: cell(75, 63, -98),
  };
  const inside = { pig: 0, cow: 0, chicken: 0, sheep: 0 };
  const near = [];
  for (const e of Object.values(bot.entities || {})) {
    if (!e || !e.position || !e.name || e.name === 'item') continue;
    const p = e.position;
    if (p.x >= 61 && p.x <= 65 && p.z >= -102 && p.z <= -98 && Math.abs(p.y - 67) <= 3) {
      if (inside[e.name] != null) inside[e.name]++;
    }
    const dA = p.distanceTo(new Vec3(64, 67, -93));
    if (dA <= 45 && /pig|cow|chicken|sheep|spider|skeleton/.test(e.name)) near.push({ name: e.name, x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1), dAnchor: +dA.toFixed(1) });
  }
  return { pen, plot, home, stockInsidePen: inside, nearAnchor: near, galleryPos: bot.entity.position.toString() };
}
async function cmd(body, waitMs) {
  console.log('CMD:', body);
  bot.chat('/' + body);
  await sleep(waitMs || 1400);
}

bot.once('spawn', async () => {
  try {
    await sleep(3000);
    await cmd('tp Gallery 64 68 -96', 2500); // hover just south of the anchor, everything in load range
    await sleep(2500);
    if (MODE === 'census') {
      const c = census();
      fs.writeFileSync(OUT, JSON.stringify({ ok: true, mode: MODE, ts: new Date().toISOString(), ...c }, null, 1));
      console.log('CENSUS WRITTEN stockInside=', JSON.stringify(c.stockInsidePen), 'near=', c.nearAnchor.length);
    } else if (MODE === 'repair') {
      // Re-read the census this process took moments ago? No — repairs
      // are driven by the census FILE the operator verified (the lane
      // runs census first, files it, then runs repair).
      const prior = JSON.parse(fs.readFileSync(OUT, 'utf8'));
      const s = prior.stockInsidePen || { pig: 0, cow: 0, chicken: 0 };
      // 1) close the two unstaged south corners of the OUTER ring.
      await cmd('setblock 60 67 -98 oak_fence');
      await cmd('setblock 65 67 -98 oak_fence');
      // 2) restock the shortfall to: pigs 2, chickens 2 (cows untouched).
      const pigsNeeded = Math.max(0, 2 - (s.pig || 0));
      const chickensNeeded = Math.max(0, 2 - (s.chicken || 0));
      for (let i = 0; i < pigsNeeded; i++) { await cmd('summon pig 62.5 67 -100.5'); }
      for (let i = 0; i < chickensNeeded; i++) { await cmd('summon chicken 63.5 67 -99.5'); }
      await cmd('save-all flush', 2500);
      await sleep(1500);
      const c2 = census();
      fs.writeFileSync(OUT.replace('.json', '-post.json'), JSON.stringify({ ok: true, mode: 'repair-verify', ts: new Date().toISOString(), summoned: { pigs: pigsNeeded, chickens: chickensNeeded }, ...c2 }, null, 1));
      console.log('REPAIR DONE summoned=', JSON.stringify({ pigs: pigsNeeded, chickens: chickensNeeded }), 'stockInside=', JSON.stringify(c2.stockInsidePen));
    }
    bot.quit();
    await sleep(800);
    process.exit(0);
  } catch (e) { console.log('FATAL', e); try { bot.quit(); } catch {} process.exit(1); }
});
