'use strict';
// proof-target-day7.js — DAY 7 PHASE 1 throwaway target (ProvTarget).
// Stands at the pit-like spot (62.3,63,-91.7) on the scratch copy, at
// food 0 (starved by the rig). On command via stdin lines:
//   status -> appends a JSON status line to the status file (own
//             client state: food/health/inventory/position)
//   eat    -> equips + consumes the best held food, then statuses
//   quit
// Status lines go to the status file (argv[2]) — a store the op
// process cannot write.
const fs = require('fs');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const STATUS = process.argv[2];
const HOST = process.env.MC_HOST || '127.0.0.1', PORT = parseInt(process.env.MC_PORT || '25875', 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = createBot({
  host: HOST, port: PORT, username: 'ProvTarget', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub', 'auto-eat'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
function status(tag) {
  const p = bot.entity ? bot.entity.position : null;
  const inv = {}; for (const i of bot.inventory.items()) inv[i.name] = (inv[i.name] || 0) + i.count;
  const row = { ts: new Date().toISOString(), tag, food: bot.food, hp: bot.health, inv, pos: p ? { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) } : null };
  fs.appendFileSync(STATUS, JSON.stringify(row) + '\n');
  console.log('STATUS', tag, 'food=' + row.food, 'hp=' + row.hp, 'inv=' + JSON.stringify(inv), 'pos=' + JSON.stringify(row.pos));
  return row;
}
bot.once('spawn', () => { console.log('target spawned at', JSON.stringify(bot.entity.position), 'food', bot.food); status('spawn'); });
process.stdin.setEncoding('utf8');
let buf = '';
process.stdin.on('data', async (d) => {
  buf += d; let idx;
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim(); buf = buf.slice(idx + 1);
    if (line === 'status') status('cmd-status');
    else if (line === 'eat') {
      const items = bot.inventory.items();
      const food = items.find((i) => i.name === 'cooked_porkchop') || items.find((i) => /cooked|bread|apple|carrot|potato/.test(i.name));
      if (!food) { console.log('EAT: nothing edible held'); status('eat-none'); continue; }
      try { await bot.equip(food, 'hand'); await Promise.race([bot.consume(), sleep(6000)]); console.log('EAT: consumed', food.name); } catch (e) { console.log('EAT error:', e.message); }
      await sleep(600); status('after-eat');
    } else if (line === 'quit') { try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 500); }
  }
});
