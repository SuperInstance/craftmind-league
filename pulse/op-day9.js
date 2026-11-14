'use strict';
// op-day9.js — DAY 7 PHASE 1/2: the STANDALONE operator
// provisioning process (Gallery, opped). Its OWN process, its OWN
// lifecycle — never shares a process with any driver (day 6's
// bossBars crash was two createBot instances in one process).
// Command channel: reads newline-delimited JSON commands from the
// request file (argv[2]); appends result JSON lines to the result
// file (argv[3]). Commands: {"cmd":"give","target":"NAME","item":"cooked_porkchop","count":32}
// {"cmd":"ping"} {"cmd":"quit"}. Server feedback printed verbatim.
const fs = require('fs');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const REQ = process.argv[2], RES = process.argv[3];
if (!REQ || !RES) { console.error('usage: op-day9.js <reqFile> <resFile>'); process.exit(2); }
if (!fs.existsSync(REQ)) fs.writeFileSync(REQ, ''); if (!fs.existsSync(RES)) fs.writeFileSync(RES, '');
const out = (o) => { fs.appendFileSync(RES, JSON.stringify({ ts: new Date().toISOString(), ...o }) + '\n'); console.log('RES', JSON.stringify(o)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: parseInt(process.env.MC_PORT || '25565', 10), username: 'Gallery', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
let lastSrv = [];
bot.on('message', (m) => { try { const s = m.toString().slice(0, 300); lastSrv.push(s); if (lastSrv.length > 12) lastSrv.shift(); console.log('SRV:', s); } catch {} });
let handled = 0, busy = false, spawned = false;
bot.once('spawn', () => { spawned = true; console.log('OP spawned as Gallery at', JSON.stringify(bot.entity.position)); });
async function handle(line) {
  let c; try { c = JSON.parse(line); } catch { return; }
  if (c.cmd === 'ping') { out({ id: c.id, ok: true, spawned, pos: bot.entity ? bot.entity.position : null }); return; }
  if (c.cmd === 'quit') { out({ id: c.id, ok: true, bye: true }); try { bot.quit(); } catch {} setTimeout(() => process.exit(0), 800); return; }
  if (c.cmd === 'give') {
    if (!spawned || !bot.entity || typeof bot.chat !== 'function') { out({ id: c.id, ok: false, error: 'op not spawned yet (spawned=' + spawned + ')' }); return; }
    lastSrv = [];
    const cmd = `/give ${c.target} ${c.item || 'cooked_porkchop'} ${c.count || 32}`;
    console.log('OP chat:', cmd);
    try { bot.chat(cmd); } catch (e) { out({ id: c.id, ok: false, error: e.message }); return; }
    await sleep(2500);
    out({ id: c.id, ok: true, gave: cmd, srv: lastSrv.slice() });
    return;
  }
  if (c.cmd === 'chat') {
    if (!spawned || !bot.entity || typeof bot.chat !== 'function') { out({ id: c.id, ok: false, error: 'op not spawned yet (spawned=' + spawned + ')' }); return; }
    if (typeof c.text !== 'string' || c.text[0] !== '/' || /[\n\r]/.test(c.text)) { out({ id: c.id, ok: false, error: 'chat cmd must be a single-line server command' }); return; }
    lastSrv = [];
    console.log('OP chat:', c.text);
    try { bot.chat(c.text); } catch (e) { out({ id: c.id, ok: false, error: e.message }); return; }
    await sleep(2500);
    out({ id: c.id, ok: true, chat: c.text, srv: lastSrv.slice() });
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
console.log('OP provision process up; req=' + REQ + ' res=' + RES);
