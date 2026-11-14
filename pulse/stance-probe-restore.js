'use strict';
// RESTORE Cody to handback cell (72,-102) after stance-probe arm B. Bare body.
const fs = require('fs');
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const mineflayer = require(NM + '/mineflayer');
const prims = require(PULSE + '/lib/prims.js');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Cody', auth: 'offline',
  plugins: { pathfinder: require(NM + '/mineflayer-pathfinder').pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const R = { ts: new Date().toISOString(), legs: [] };
let startHealth = null, damaged = false;
bot.on('health', () => { if (startHealth != null && bot.health < startHealth) damaged = true; });
function pos() { const p = bot.entity.position; return { x: +p.x.toFixed(3), y: +p.y.toFixed(3), z: +p.z.toFixed(3) }; }
bot.once('spawn', async () => {
  startHealth = bot.health;
  R.spawn = { pos: pos(), health: bot.health, food: bot.food };
  console.log('[RS] spawn', JSON.stringify(R.spawn));
  await sleep(2500);
  for (const [cx, cz] of [[72, -103], [72, -102]]) {
    const fy = (prims.groundY(bot, cx, cz) || 63) + 1;
    const s = pos();
    let res = null;
    try { res = await prims.gotoNear(bot, cx + 0.5, fy, cz + 0.5, 0.6, 20000); } catch (e) { res = { ok: false, error: String(e && e.message) }; }
    const rec = { target: [cx, cz], ok: !!(res && res.ok), via: res && res.via, from: s, to: pos() };
    R.legs.push(rec); console.log('[RS] leg', JSON.stringify(rec));
    try { bot.pathfinder.setGoal(null); } catch {}
    if (damaged) break;
  }
  await sleep(1500);
  R.final = { pos: pos(), health: bot.health, food: bot.food, damaged };
  fs.writeFileSync(PULSE + '/stance-probe-restore-result.json', JSON.stringify(R, null, 1));
  console.log('[RS] DONE', JSON.stringify(R.final));
  bot.quit(); setTimeout(() => process.exit(0), 800);
});
bot.on('error', (e) => console.log('[RS] error', e.message));
setTimeout(() => { console.log('[RS] TIMEOUT'); try { bot.quit(); } catch {} process.exit(2); }, 120000);
