// join-test.js — one bot joins the Orin world, says hello, stands
// still, disconnects cleanly. Run from this directory so
// craftmind.config.js (governor wiring) resolves:
//   cd ~/craftmind-league/bots/runs/cody && node join-test.js
// Env overrides: MC_HOST (default 192.168.0.50), MC_PORT (25565),
// MC_USER (Cody), MC_VERSION (unset = framework default; set to the
// server's version if the handshake demands it).
const path = require('path');
process.chdir(__dirname);

const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');

const opts = {
  host: process.env.MC_HOST || '192.168.0.50',
  port: parseInt(process.env.MC_PORT || '25565', 10),
  username: process.env.MC_USER || 'Cody',
};
if (process.env.MC_VERSION) opts.version = process.env.MC_VERSION;

console.log('[JOIN-TEST] connecting', opts);
const bot = createBot(opts);

const giveUp = setTimeout(() => {
  console.error('[JOIN-TEST] TIMEOUT: no spawn within 90s');
  try { bot.quit(); } catch {}
  process.exit(2);
}, 90000);

bot.once('spawn', () => {
  clearTimeout(giveUp);
  const p = bot.entity.position;
  console.log(`[JOIN-TEST] spawned at ${Math.floor(p.x)},${Math.floor(p.y)},${Math.floor(p.z)}`);
  setTimeout(() => {
    bot.chat('Hello from the Thor league — Cody reporting in.');
    console.log('[JOIN-TEST] said hello in chat');
  }, 1500);
  setTimeout(() => {
    console.log('[JOIN-TEST] standing still done; quitting cleanly');
    bot.quit();
    setTimeout(() => process.exit(0), 500);
  }, 9000);
});

bot.on('error', (e) => console.error('[JOIN-TEST] error:', e && e.message));
bot.on('kicked', (r) => console.error('[JOIN-TEST] kicked:', r));
bot.on('end', (r) => console.log('[JOIN-TEST] connection ended:', r));
