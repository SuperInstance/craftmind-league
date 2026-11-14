'use strict';
/**
 * test-park-notify.js — fixture test for op-day11.js's park-notify
 * handler (charter §5 / readiness §12 item 7). A STUB FLOOR issues
 * {cmd:"park-notify"} through the floor's own FileOpChannel against
 * a fixture-mode op-day11 process (OP_FIXTURE=1 — no bot, no game
 * login). Asserts, from stores the handler cannot fake:
 *   1. the channel result for the park-notify id is ok + recorded;
 *   2. the park-notify log gained exactly one row carrying the id,
 *      the reason, and a ts;
 *   3. a ping still receipts afterwards (the handler quit nobody);
 *   4. the op process is still alive at the end (park-notify is
 *      record-only: it moves nothing and quits nobody).
 * Writes its full output to test-park-notify-output.txt beside the
 * fixture files. Exit 0 = PASS.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { FileOpChannel } = require('/home/caseydigennaro/craftmind-league/floor/opchannel.js');

const NODE = process.execPath;
const DIR = __dirname;
// Fixture files live under the floor's state area, never under pulse/:
// pulse/ member files can wedge the fleet's murex tooling (a 0-byte
// pulse/.wtest file once froze the whole league directory read).
const FX = '/home/caseydigennaro/craftmind-league/floor/run/day11/park-fixture';
const REQ = path.join(FX, 'op-req.jsonl');
const RES = path.join(FX, 'op-res.jsonl');
const PARKLOG = path.join(FX, 'park-notify.jsonl');
const OUT = '/home/caseydigennaro/craftmind-league/pulse/day11/test-park-notify-output.txt';

const lines = [];
const say = (s) => { lines.push(s); console.log(s); };

async function main() {
  fs.rmSync(FX, { recursive: true, force: true });
  fs.mkdirSync(FX, { recursive: true });
  fs.writeFileSync(REQ, ''); fs.writeFileSync(RES, '');

  const op = spawn(NODE, ['/home/caseydigennaro/craftmind-league/pulse/op-day11.js', REQ, RES, PARKLOG],
    { env: { ...process.env, OP_FIXTURE: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let opOut = '';
  op.stdout.on('data', (d) => { opOut += d.toString(); });
  op.stderr.on('data', (d) => { opOut += d.toString(); });
  await new Promise((r) => setTimeout(r, 1200));

  const ch = new FileOpChannel(REQ, RES, { timeoutMs: 8000 });
  const r1 = await ch.issue({ cmd: 'park-notify', id: 'stub-floor-park-1', reason: 'MAX_DEATHS' });
  say('park-notify result: ' + JSON.stringify(r1));
  const r2 = await ch.issue({ cmd: 'ping', id: 'stub-floor-ping-1' });
  say('ping-after-park result: ' + JSON.stringify(r2));

  const parkRows = fs.readFileSync(PARKLOG, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  say('park-notify log rows: ' + JSON.stringify(parkRows));
  const alive = op.exitCode === null;
  say('op process alive after park-notify: ' + alive);
  say('op console contained PARK-NOTIFY alert: ' + /PARK-NOTIFY \*\* PARK \*\*/.test(opOut));

  const pass = r1.ok === true && r1.recorded === true
    && parkRows.length === 1 && parkRows[0].id === 'stub-floor-park-1'
    && parkRows[0].reason === 'MAX_DEATHS' && !!parkRows[0].ts
    && r2.ok === true && alive;
  say(pass ? 'PASS test-park-notify' : 'FAIL test-park-notify');
  fs.writeFileSync(OUT, lines.join('\n') + '\n--- op console ---\n' + opOut);
  try { op.kill('SIGKILL'); } catch {}
  process.exit(pass ? 0 : 1);
}
main().catch((e) => { say('ERROR ' + (e && e.stack || e)); fs.writeFileSync(OUT, lines.join('\n') + '\n'); process.exit(1); });
