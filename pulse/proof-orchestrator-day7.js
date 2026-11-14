'use strict';
// proof-orchestrator-day7.js — DAY 7 PHASE 1 orchestrator.
// Spawns, as SEPARATE OS processes:
//   - the target bot (ProvTarget; starved at food 0 on the rig)
//   - the driver-pattern bot (ProvMate; heartbeat = survival proof)
//   - the op provisioning service (Gallery) — AFTER target+mate
// Drives 3 identical give->verify->eat trials through the channel,
// verifying from stores the op process cannot write:
//   - the target's OWN status file (its client state)
//   - the server log (the give lines themselves)
//   - RCON data get entity ProvTarget foodLevel + Inventory NBT
// Writes the consolidated proof evidence JSON (argv[2]).
const fs = require('fs');
const { spawn, execFileSync } = require('child_process');
const EVID = process.argv[2];
const D = '/home/caseydigennaro/craftmind-league/pulse';
const W = '/tmp/day7proof';
const SRVLOG = '/tmp/day7proof-server.log';
const childPids = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();
const ev = { started: now(), trials: [], mate: {}, notes: [] };
const flush = () => fs.writeFileSync(EVID, JSON.stringify(ev, null, 1));
fs.mkdirSync(W, { recursive: true });
function rcon(cmd) {
  const pw = 'day7proof-local';
  const port = 25876;
  const script = `import socket,struct,sys
s=socket.create_connection(('127.0.0.1',${port}),timeout=10)
def pkt(i,t,b):
 d=struct.pack('<ii',i,t)+b.encode()+b'\\x00\\x00'; return struct.pack('<i',len(d))+d
def rd():
 ln=struct.unpack('<i',s.recv(4))[0]; buf=b''
 while len(buf)<ln: buf+=s.recv(ln-len(buf))
 return buf[8:-2].decode('utf8','replace')
s.sendall(pkt(1,3,${JSON.stringify('PWPLACEHOLDER')})); rd()
s.sendall(pkt(2,2,${JSON.stringify('CMDPLACEHOLDER')})); print(rd())`;
  return execFileSync('python3', ['-c', script.replace('PWPLACEHOLDER', pw).replace('CMDPLACEHOLDER', cmd)], { encoding: 'utf8', timeout: 15000 }).trim();
}
function tailStatus() {
  try { const L = fs.readFileSync(W + '/target-status.jsonl', 'utf8').trim().split('\n'); return JSON.parse(L[L.length - 1]); } catch { return null; }
}
function readRes(id) {
  try { return fs.readFileSync(W + '/op-res.jsonl', 'utf8').trim().split('\n').map((l) => JSON.parse(l)).find((r) => r.id === id) || null; } catch { return null; }
}
function sendReq(o) { fs.appendFileSync(W + '/op-req.jsonl', JSON.stringify(o) + '\n'); }
async function waitFor(fn, ms, what) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = fn(); if (v) return v; await sleep(700); } throw new Error('timeout waiting for ' + what); }
function procsAlive() {
  const out = execFileSync('bash', ['-c', "pgrep -af 'proof-|op-provision' | grep -v pgrep | wc -l"], { encoding: 'utf8' }).trim();
  return parseInt(out, 10);
}
(async () => {
  const env = { ...process.env, MC_HOST: '127.0.0.1', MC_PORT: '25875' };
  console.log('[orch] starting target + mate');
  const target = spawn('node', [D + '/proof-target-day7.js', W + '/target-status.jsonl'], { cwd: D, env, stdio: ['pipe', fs.openSync(W + '/target.log', 'w'), 'inherit'] });
  const mate = spawn('node', [D + '/proof-driverpattern-day7.js', W + '/mate-hb.jsonl'], { cwd: D, env: { ...env, MATE_MS: '900000' }, stdio: ['ignore', fs.openSync(W + '/mate.log', 'w'), 'inherit'] });
  ev.pids = { target: target.pid, mate: mate.pid };
  childPids.push(target.pid, mate.pid);
  await waitFor(() => { const s = tailStatus(); return s && s.tag === 'spawn' ? s : null; }, 90000, 'target spawn');
  console.log('[orch] target spawned; starting op service');
  const op = spawn('node', [D + '/op-provision-day7.js', W + '/op-req.jsonl', W + '/op-res.jsonl'], { cwd: D, env, stdio: ['ignore', fs.openSync(W + '/op.log', 'w'), 'inherit'] });
  ev.pids.op = op.pid; childPids.push(op.pid); flush();
  let ping = null;
  for (let i = 0; i < 75 && !(ping && ping.spawned); i++) { const id = 'ping' + i; sendReq({ id, cmd: 'ping' }); await sleep(1200); ping = readRes(id) || ping; }
  if (!ping || !ping.spawned) throw new Error('op service never reached spawned state: ' + JSON.stringify(ping));
  ev.opPing = ping; console.log('[orch] op up+spawned:', JSON.stringify(ping));
  try { ev.difficultySet = rcon('difficulty normal'); } catch (e) { ev.difficultySet = 'ERR ' + e.message; }
  console.log('[orch] rig difficulty for drain phase:', ev.difficultySet);
  const logMark = () => fs.statSync(SRVLOG).size;
  for (let t = 1; t <= 3; t++) {
    const T = { trial: t, t0: now() };
    const mark = logMark();
    // Precondition: drain the target to food <= 12 via server-side
    // hunger effect at NORMAL (PEACEFUL never drains saturation —
    // measured day 7), verified from the target's OWN status file.
    T.drain = [];
    for (let d = 0; d < 40; d++) {
      target.stdin.write('status\n');
      await sleep(1100);
      const s = tailStatus();
      if (s && typeof s.food === 'number' && s.food <= 12) { T.drain.push({ food: s.food, drained: true }); break; }
      try { rcon('effect give ProvTarget minecraft:hunger 15 20'); } catch (e) { T.drain.push({ rconErr: e.message }); }
      T.drain.push({ food: s ? s.food : null });
      await sleep(2200);
    }
    target.stdin.write('status\n');
    await sleep(1200);
    T.before = tailStatus();
    T.preconditionMet = !!(T.before && typeof T.before.food === 'number' && T.before.food <= 12);
    sendReq({ id: 'give' + t, cmd: 'give', target: 'ProvTarget', item: 'cooked_porkchop', count: 8 });
    T.giveRes = await waitFor(() => readRes('give' + t), 30000, 'give res ' + t);
    await sleep(1500);
    target.stdin.write('status\n');
    await sleep(1500);
    T.afterGive = tailStatus();
    try { T.rconFood = rcon('data get entity ProvTarget foodLevel'); } catch (e) { T.rconFood = 'ERR ' + e.message; }
    try { T.rconInvHasPork = /cooked_porkchop/.test(rcon('data get entity ProvTarget Inventory')); } catch (e) { T.rconInvHasPork = 'ERR ' + e.message; }
    const logTail = fs.readFileSync(SRVLOG, 'utf8').slice(mark);
    T.serverGiveLine = logTail.split('\n').filter((l) => /ProvTarget/.test(l) && /give|Gave/i.test(l));
    target.stdin.write('eat\n');
    await sleep(4000);
    T.afterEat = await waitFor(() => { const s = tailStatus(); return s && s.tag === 'after-eat' ? s : null; }, 20000, 'after-eat ' + t).catch(() => tailStatus());
    T.pass = !!(T.preconditionMet && T.giveRes && T.giveRes.ok === true && T.afterGive && (T.afterGive.inv.cooked_porkchop || 0) >= 8 && T.rconInvHasPork === true && T.afterEat && T.afterEat.food > (T.before ? T.before.food : 0));
    ev.trials.push(T); flush();
    console.log(`[orch] trial ${t}: pass=${T.pass} before.food=${T.before && T.before.food} afterGive.inv=${JSON.stringify(T.afterGive && T.afterGive.inv)} afterEat.food=${T.afterEat && T.afterEat.food} rconInv=${T.rconInvHasPork}`);
    await sleep(1000);
  }
  try { ev.mate.heartbeats = fs.readFileSync(W + '/mate-hb.jsonl', 'utf8').trim().split('\n').length; } catch { ev.mate.heartbeats = 0; }
  ev.mate.aliveAtEnd = mate.exitCode === null; ev.targetAliveAtEnd = target.exitCode === null; ev.opAliveAtEnd = op.exitCode === null;
  ev.procsAliveAtEnd = procsAlive();
  try { ev.difficultyRestored = rcon('difficulty peaceful'); } catch (e) { ev.difficultyRestored = 'ERR ' + e.message; }
  ev.finished = now();
  ev.pass = ev.trials.length === 3 && ev.trials.every((t) => t.pass) && ev.mate.aliveAtEnd;
  flush();
  console.log('[orch] PROOF PASS =', ev.pass);
  sendReq({ id: 'q', cmd: 'quit' });
  target.stdin.write('quit\n');
  await sleep(2500);
  try { mate.kill(); } catch {}
  try { target.kill(); } catch {}
  process.exit(ev.pass ? 0 : 3);
})().catch((e) => { ev.fatal = e.message; ev.finished = now(); try { ev.difficultyRestored = rcon('difficulty peaceful'); } catch {} flush(); for (const p of childPids) { try { process.kill(p); } catch {} } console.error('[orch] FATAL', e); process.exit(4); });
