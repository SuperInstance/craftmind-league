'use strict';
/* PRISTINE-BODY EXPERIMENT — bare discriminator join (pristine-body-preregistered-20261108).
 * Pool is ASIDE when this runs: a genuine fresh spawn is expected beside world
 * spawn. Joins, samples rest signature 6 s, writes result JSON, disconnects.
 * NO movement commands of any kind. */
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const PORT = parseInt(process.argv[2] || '47018', 10);
const bot = mineflayer.createBot({
  host: '192.168.0.50', port: 25565, username: 'PristineProbe', auth: 'offline',
  localPort: PORT,
  plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder },
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r3 = (n) => Math.round(n * 1000) / 1000;
const R = { kind: 'discriminator', username: 'PristineProbe', localPort: PORT, ts: new Date().toISOString(), events: [] };
let forced = 0;
bot.on('forcedMove', () => forced++);
bot.on('error', (e) => R.events.push({ ev: 'error', msg: String(e && e.message) }));
bot.on('kicked', (r) => R.events.push({ ev: 'kicked', msg: String(r) }));
bot.on('death', () => R.events.push({ ev: 'DEATH' }));
function pos() { const p = bot.entity.position; return { x: r3(p.x), y: r3(p.y), z: r3(p.z) }; }
bot.once('spawn', async () => {
  R.spawn = { pos: pos(), health: bot.health, food: bot.food, uuid: bot.uuid || null, onGround: !!bot.entity.onGround };
  console.log('[PB-DISC] spawn', JSON.stringify(R.spawn));
  const samples = [];
  for (let i = 0; i < 12; i++) { await sleep(500); samples.push({ pos: pos(), og: !!bot.entity.onGround, hp: bot.health }); }
  R.restSamples = samples;
  R.forcedMoves = forced;
  R.final = { pos: pos(), health: bot.health, food: bot.food, onGround: !!bot.entity.onGround };
  fs.writeFileSync(PULSE + '/pristine-body-discriminator-result.json', JSON.stringify(R, null, 1));
  console.log('[PB-DISC] DONE', JSON.stringify(R.final), 'fm=', forced);
  try { bot.quit(); } catch {}
  setTimeout(() => process.exit(0), 800);
});
setTimeout(() => { try { fs.writeFileSync(PULSE + '/pristine-body-discriminator-result.json', JSON.stringify(R, null, 1)); } catch {} console.log('[PB-DISC] TIMEOUT'); process.exit(2); }, 90000);
