'use strict';
// provision-day14.js — DAY 14 Gate B PROVISIONING WINDOW (charter §4).
// A bounded, chartered operator act in the day-7/day-9 pattern: Cody's
// body joins the world under NO driver — no model, no commands, no
// chat, no movement — and simply STANDS at his respawn point while the
// operator channel (Gallery, separate process) gives him the day's
// food. Day 13 took his whole inventory; he wakes day 14 empty-handed
// (verified .dat: inventory empty, hunger 20) and the floor's feed
// remedy (/give) cannot land on an offline citizen, so the feed is
// provisioned to the joined body here, BEFORE the floor opens, and
// verified from stores the feeder cannot write:
//   (1) this harness's own read of the body's live inventory
//       (before: {} — after: what the body actually holds);
//   (2) the post-quit .dat snapshot the floor's VERIFY_FEED reads
//       (produced by feed-snapshot.py after this process exits).
// The harness watches his health every second; any damage or death
// is written to the evidence file at once (a death here would be the
// day's first incident and is the lane's to file, not to hide).
// Exit conditions: inventory shows cooked_porkchop >= 32 (success),
// or 240 s elapse (failure), or the evidence file gains a 'stop'
// flag from the lane. On exit the body quits cleanly (the server
// writes his .dat with the provisioned inventory) and the process
// ends. Usage: node provision-day14.js <evidence.jsonl>
const fs = require('fs');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const EVID = process.argv[2];
if (!EVID) { console.error('usage: provision-day14.js <evidence.jsonl>'); process.exit(2); }
const row = (o) => { const r = { ts: new Date().toISOString(), ...o }; fs.appendFileSync(EVID, JSON.stringify(r) + '\n'); console.log('PROV', JSON.stringify(r)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = (bot) => { const m = {}; for (const i of bot.inventory.items()) m[i.name] = (m[i.name] || 0) + i.count; return m; };

const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'Cody', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
let deaths = 0, hurt = 0;
bot.on('death', () => { deaths++; row({ kind: 'DEATH-DURING-PROVISIONING', deaths }); });
bot.on('health', () => { if (bot.health < 20) { hurt++; row({ kind: 'health-drop', hp: bot.health, food: bot.food }); } });
bot.on('error', (e) => row({ kind: 'bot-error', error: e && e.message }));
bot.on('kicked', (r) => row({ kind: 'kicked', reason: String(r) }));

(async () => {
  await new Promise((resolve) => bot.once('spawn', resolve));
  row({ kind: 'spawned', pos: bot.entity.position, hp: bot.health, food: bot.food, inventory: inv(bot) });
  const t0 = Date.now();
  let ok = false;
  while (Date.now() - t0 < 240000) {
    await sleep(1000);
    const cur = inv(bot);
    if ((cur.cooked_porkchop || 0) >= 32) { ok = true; row({ kind: 'provisioned', inventory: cur, hp: bot.health, food: bot.food, after_s: Math.round((Date.now() - t0) / 1000) }); break; }
    if (fs.existsSync(EVID + '.stop')) { row({ kind: 'stopped-by-lane' }); break; }
  }
  if (!ok) row({ kind: 'provisioning-window-ended', inventory: inv(bot), deaths, hurt });
  row({ kind: 'quitting', ok, deaths, hurt, inventory: inv(bot) });
  try { bot.quit(); } catch {}
  await sleep(1500);
  process.exit(ok && deaths === 0 ? 0 : 3);
})();
