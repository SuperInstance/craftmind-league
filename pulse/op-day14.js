'use strict';
// op-day14.js — DAY 14: the STANDALONE operator provisioning process,
// successor to op-day10.js. Its OWN process, its OWN lifecycle — never
// shares a process with any driver (day 6's bossBars crash was two
// createBot instances in one process, fleet rule).
//
// Command channel: reads newline-delimited JSON commands from the
// request file (argv[2]); appends result JSON lines to the result
// file (argv[3]). This is the channel the day-11 FLOOR's FileOpChannel
// speaks (floor/run/day11/rig-day11.json points the floor here).
//
// Commands (day-10 set, unchanged semantics):
//   {"cmd":"ping"}  {"cmd":"quit"}
//   {"cmd":"give","target":"NAME","item":"cooked_porkchop","count":32}
//   {"cmd":"chat","text":"/single-line server command"}
// Day-14 addition (charter §5, floor gap #3):
//   {"cmd":"park-notify","id":...,"reason":...}
//   RECORD-ONLY handler: appends the request (id, reason, ts) to the
//   park-notify log (argv[4], default: park-notify-day14.jsonl beside
//   the result file), prints a console alert line, responds
//   {ok:true, recorded:true}. It moves nothing and quits nobody — the
//   physical park is carried by floor gate rejection + the driver's
//   gate-stop; this handler exists so a park is an operator-visible
//   event with a receipt, not a silent state change.
//
// FIXTURE MODE: OP_FIXTURE=1 runs the command loop WITHOUT creating
// a bot (no game login): ping/give/chat/quit validate and receipt
// against a stub spawn state (give/chat report ok:false,
// error 'fixture: no bot'), park-notify runs its REAL handler.
// Used by test-park-notify.js; never for a live day.

const fs = require('fs');
const path = require('path');

const REQ = process.argv[2], RES = process.argv[3];
const PARKLOG = process.argv[4] ||
  (RES ? path.join(path.dirname(RES), 'park-notify-day14.jsonl') : 'park-notify-day14.jsonl');
if (!REQ || !RES) { console.error('usage: op-day14.js <reqFile> <resFile> [parkNotifyLog]'); process.exit(2); }
if (!fs.existsSync(REQ)) fs.writeFileSync(REQ, '');
if (!fs.existsSync(RES)) fs.writeFileSync(RES, '');

const FIXTURE = process.env.OP_FIXTURE === '1';
const out = (o) => { fs.appendFileSync(RES, JSON.stringify({ ts: new Date().toISOString(), ...o }) + '\n'); console.log('RES', JSON.stringify(o)); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let bot = null, spawned = false, lastSrv = [];
if (!FIXTURE) {
  const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
  bot = createBot({
    host: process.env.MC_HOST || '192.168.0.50', port: parseInt(process.env.MC_PORT || '25565', 10), username: 'Gallery', version: '26.1',
    plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
  });
  bot.on('error', (e) => console.log('bot error:', e && e.message));
  bot.on('kicked', (r) => console.log('kicked:', String(r)));
  bot.on('message', (m) => { try { const s = m.toString().slice(0, 300); lastSrv.push(s); if (lastSrv.length > 12) lastSrv.shift(); console.log('SRV:', s); } catch {} });
  bot.once('spawn', () => { spawned = true; console.log('OP spawned as Gallery at', JSON.stringify(bot.entity.position)); });
} else {
  console.log('OP_FIXTURE=1: command loop live, NO bot created (no game login)');
}

async function handle(line) {
  let c; try { c = JSON.parse(line); } catch { return; }
  if (c.cmd === 'park-notify') {
    // RECORD-ONLY (charter §5): log it, alert the console, receipt it.
    // No bot call, no chat, no world effect of any kind.
    const row = { ts: new Date().toISOString(), id: c.id || null, reason: c.reason || null, trigger: c.trigger || null };
    fs.appendFileSync(PARKLOG, JSON.stringify(row) + '\n');
    console.log('PARK-NOTIFY ** PARK ** id=%s reason=%s (recorded to %s; no world effect)', row.id, row.reason, PARKLOG);
    out({ id: c.id, ok: true, recorded: true });
    return;
  }
  if (c.cmd === 'ping') { out({ id: c.id, ok: true, spawned, fixture: FIXTURE, pos: bot && bot.entity ? bot.entity.position : null }); return; }
  if (c.cmd === 'quit') { out({ id: c.id, ok: true, bye: true }); if (bot) { try { bot.quit(); } catch {} } setTimeout(() => process.exit(0), 800); return; }
  if (c.cmd === 'give' || c.cmd === 'chat') {
    if (FIXTURE) { out({ id: c.id, ok: false, error: 'fixture: no bot' }); return; }
    if (!spawned || !bot.entity || typeof bot.chat !== 'function') { out({ id: c.id, ok: false, error: 'op not spawned yet (spawned=' + spawned + ')' }); return; }
    let cmdText;
    if (c.cmd === 'give') {
      cmdText = `/give ${c.target} ${c.item || 'cooked_porkchop'} ${c.count || 32}`;
    } else {
      if (typeof c.text !== 'string' || c.text[0] !== '/' || /[\n\r]/.test(c.text)) { out({ id: c.id, ok: false, error: 'chat cmd must be a single-line server command' }); return; }
      cmdText = c.text;
    }
    lastSrv = [];
    console.log('OP chat:', cmdText);
    try { bot.chat(cmdText); } catch (e) { out({ id: c.id, ok: false, error: e.message }); return; }
    await sleep(2500);
    out(c.cmd === 'give'
      ? { id: c.id, ok: true, gave: cmdText, srv: lastSrv.slice() }
      : { id: c.id, ok: true, chat: cmdText, srv: lastSrv.slice() });
    return;
  }
  out({ id: c.id, ok: false, error: 'unknown cmd ' + c.cmd });
}

let handled = 0, busy = false;
setInterval(() => {
  if (busy) return;
  let lines = [];
  try { lines = fs.readFileSync(REQ, 'utf8').split('\n').filter(Boolean); } catch {}
  if (lines.length <= handled) return;
  busy = true;
  (async () => { while (handled < lines.length) { const l = lines[handled++]; await handle(l); } busy = false; })();
}, 400);
console.log('OP day-11 process up; req=' + REQ + ' res=' + RES + ' parklog=' + PARKLOG);
