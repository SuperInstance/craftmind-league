'use strict';
// RESTORE-2 Cody: raw drives only (E then N) toward handback cell (72,-102).
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const { Vec3 } = require(NM + '/vec3');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Cody', auth: 'offline',
  plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const R = { ts: new Date().toISOString(), drives: [] };
let startHealth = null, damaged = false, fm = 0;
bot.on('forcedMove', () => fm++);
bot.on('health', () => { if (startHealth != null && bot.health < startHealth) damaged = true; });
function pos() { const p = bot.entity.position; return { x: +p.x.toFixed(3), y: +p.y.toFixed(3), z: +p.z.toFixed(3) }; }
async function raw(tag, cx, cz, seconds) {
  const s = pos(); const fm0 = fm;
  const fy = (prims.groundY(bot, cx, cz) || 63) + 1;
  try { await bot.lookAt(new Vec3(cx + 0.5, fy + 1.4, cz + 0.5), true); } catch {}
  await sleep(200);
  bot.setControlState('jump', true); bot.setControlState('forward', true);
  await sleep(seconds * 1000);
  bot.clearControlStates();
  const rec = { tag, target: [cx, cz], from: s, to: pos(), fm: fm - fm0 };
  R.drives.push(rec); console.log('[R2]', JSON.stringify(rec));
  await sleep(600);
}
bot.once('spawn', async () => {
  startHealth = bot.health;
  R.spawn = { pos: pos(), health: bot.health, food: bot.food };
  console.log('[R2] spawn', JSON.stringify(R.spawn));
  await sleep(2500);
  if (!damaged) await raw('east+1', 72, -103, 4);
  if (!damaged) await raw('north-flat', 72, -102, 4);
  await sleep(1000);
  R.final = { pos: pos(), health: bot.health, food: bot.food, damaged };
  fs.writeFileSync(PULSE + '/stance-probe-restore2-result.json', JSON.stringify(R, null, 1));
  console.log('[R2] DONE', JSON.stringify(R.final));
  bot.quit(); setTimeout(() => process.exit(0), 800);
});
bot.on('error', (e) => console.log('[R2] error', e.message));
setTimeout(() => { console.log('[R2] TIMEOUT'); try { bot.quit(); } catch {} process.exit(2); }, 90000);
