'use strict';
// mp4bot.js — DIRECTOR REMEDIATION WINDOW bot (2026-11-09).
// Identity: MapProbe4 ONLY. One bot, one process (day-6 bossBars rule).
// Bare mineflayer + bossBar plugin disabled = the proven v3 builder shape.
// Channel: NDJSON request file -> NDJSON result file (day-7/builder pattern).
// Commands: ping / exec (verbatim server command) / quit.
const fs = require('fs');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules/mineflayer');
const REQ = process.argv[2], RES = process.argv[3];
if (!REQ || !RES) { console.error('usage: mp4bot.js <reqFile> <resFile>'); process.exit(2); }
if (!fs.existsSync(REQ)) fs.writeFileSync(REQ, '');
if (!fs.existsSync(RES)) fs.writeFileSync(RES, '');
const out = (o) => { fs.appendFileSync(RES, JSON.stringify({ ts: new Date().toISOString(), ...o }) + '\n'); console.log('RES', JSON.stringify(o)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: parseInt(process.env.MC_PORT || '25565', 10),
  username: 'MapProbe4', version: '26.1',
  plugins: { bossBar: false },
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
let lastSrv = [];
bot.on('message', (m) => { try { const s = m.toString().slice(0, 500); lastSrv.push(s); if (lastSrv.length > 14) lastSrv.shift(); console.log('SRV:', s); } catch {} });
let handled = 0, busy = false, spawned = false;
bot.once('spawn', () => { spawned = true; console.log('MP4 spawned as MapProbe4 at', JSON.stringify(bot.entity.position)); out({ id: 'spawn', ok: true, pos: bot.entity ? bot.entity.position : null }); });
async function handle(line) {
  let c; try { c = JSON.parse(line); } catch { return; }
  if (c.cmd === 'ping') { out({ id: c.id, ok: true, spawned, pos: bot.entity ? bot.entity.position : null }); return; }
  if (c.cmd === 'quit') { out({ id: c.id, ok: true, bye: true }); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); return; }
  if (c.cmd === 'exec') {
    if (!spawned || typeof bot.chat !== 'function') { out({ id: c.id, ok: false, error: 'not spawned' }); return; }
    lastSrv = [];
    try { bot.chat(String(c.text)); } catch (e) { out({ id: c.id, ok: false, error: e.message }); return; }
    await sleep(c.wait || 1200);
    out({ id: c.id, ok: true, sent: String(c.text), srv: lastSrv.slice() });
    return;
  }
  out({ id: c.id, ok: false, error: 'unknown cmd ' + c.cmd });
}
setInterval(() => {
  if (busy) return;
  let lines = [];
  try { lines = fs.readFileSync(REQ, 'utf8').split('\n').filter(Boolean); } catch {}
  if (lines.length <= handled) return;
  busy = true;
  (async () => { while (handled < lines.length) { const l = lines[handled++]; await handle(l); } busy = false; })();
}, 400);
console.log('MP4 remediation bot up; req=' + REQ + ' res=' + RES);
