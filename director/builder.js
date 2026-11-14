'use strict';
// builder-day9.js — THE DIRECTOR'S BUILDER BODY (Scenario #1 build).
// A standalone op process (Gallery) in the day-7 pattern: its own process,
// its own lifecycle — never shares a process with any driver (day 6's
// bossBars crash was two createBot instances in one process).
// Command channel: newline-delimited JSON from the request file (argv[2]);
// result JSON lines appended to the result file (argv[3]).
// Commands:
//   {"cmd":"ping"}                                  -> liveness + pos
//   {"cmd":"say","text":"..."}                      -> bot.chat(text) verbatim (no leading /)
//   {"cmd":"exec","text":"/setblock ..."}           -> bot.chat(text) verbatim (server command)
//   {"cmd":"verify","x":X,"y":Y,"z":Z,"expect":"minecraft:..."} -> server-side truth via
//        /execute if block (feedback captured in `srv`) + /data get block (best-effort fields)
//   {"cmd":"quit"}
const fs = require('fs');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules/mineflayer');
const REQ = process.argv[2], RES = process.argv[3];
if (!REQ || !RES) { console.error('usage: builder-day9.js <reqFile> <resFile>'); process.exit(2); }
if (!fs.existsSync(REQ)) fs.writeFileSync(REQ, '');
if (!fs.existsSync(RES)) fs.writeFileSync(RES, '');
const out = (o) => { fs.appendFileSync(RES, JSON.stringify({ ts: new Date().toISOString(), ...o }) + '\n'); console.log('RES', JSON.stringify(o)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: parseInt(process.env.MC_PORT || '25565', 10), username: 'Gallery', version: '26.1',
  plugins: { bossBar: false },
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
let lastSrv = [];
bot.on('message', (m) => { try { const s = m.toString().slice(0, 400); lastSrv.push(s); if (lastSrv.length > 14) lastSrv.shift(); console.log('SRV:', s); } catch {} });
let handled = 0, busy = false, spawned = false;
bot.once('spawn', () => { try { bot.chat('/scoreboard objectives add chk dummy'); } catch {} setTimeout(() => { try { bot.chat('/scoreboard players set #chk chk 7'); } catch {} }, 1500); spawned = true; console.log('BUILDER spawned as Gallery at', JSON.stringify(bot.entity.position)); });
async function handle(line) {
  let c; try { c = JSON.parse(line); } catch { return; }
  if (c.cmd === 'ping') { out({ id: c.id, ok: true, spawned, pos: bot.entity ? bot.entity.position : null }); return; }
  if (c.cmd === 'quit') { out({ id: c.id, ok: true, bye: true }); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); return; }
  if (c.cmd === 'say' || c.cmd === 'exec') {
    if (!spawned || typeof bot.chat !== 'function') { out({ id: c.id, ok: false, error: 'not spawned' }); return; }
    lastSrv = [];
    try { bot.chat(String(c.text)); } catch (e) { out({ id: c.id, ok: false, error: e.message }); return; }
    await sleep(c.wait || 1200);
    out({ id: c.id, ok: true, sent: String(c.text), srv: lastSrv.slice() });
    return;
  }
  if (c.cmd === 'verify') {
    if (!spawned || typeof bot.chat !== 'function') { out({ id: c.id, ok: false, error: 'not spawned' }); return; }
    const { x, y, z, expect } = c;
    // Feedback to a bot issuer is suppressed on this server (sendCommandFeedback reaches
    // players, not this connection) — read the scoreboard FILE the server persists instead.
    // #chk is reset to 7 (sentinel) first; the store overwrites it with 0/1.
    try { bot.chat('/scoreboard players set #chk chk 7'); } catch (e) { out({ id: c.id, ok: false, error: e.message }); return; }
    await sleep(c.gap || 700);
    try { bot.chat(`/execute store result score #chk chk if block ${x} ${y} ${z} ${expect}`); } catch (e) { out({ id: c.id, ok: false, error: e.message }); return; }
    await sleep(c.gap || 700);
    try { bot.chat('/save-all flush'); } catch {}
    await sleep(c.gap || 700);
    out({ id: c.id, ok: true, fileRead: true, expect, at: [x, y, z] });
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
console.log('Director builder process up; req=' + REQ + ' res=' + RES);
