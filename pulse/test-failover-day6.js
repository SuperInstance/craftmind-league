'use strict';
// test-failover-day6.js — DAY-6 REPAIR (a) proof: the failover
// trace rule. Drives the SHIPPED day-6 driver's own askModel /
// httpCall / trace functions (extracted verbatim from
// direct-drive-day6.js, index-bounded spans — the day-5 shared
// extractor pattern) against two stub HTTP servers on loopback:
// a DEAD primary (connection refused) and a LIVE governor stub.
// Asserts: (1) after 3 consecutive primary failures the driver
// switches route AND a full 'failover' trace row (from/to/why/
// cycle) exists in the trace file; (2) while on fallback, the
// fail-back probe (forced by backdating lastPrimaryProbeAt)
// detects a REVIVED primary and a 'failover-back' row is written
// at that moment; (3) the returned content comes from the live
// route in both phases. Then the stub primary is killed again is
// NOT re-tested (switch semantics only move forward per probe).
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

let pass = 0, fail = 0;
function t(name, cond) { console.log((cond ? 'PASS' : 'FAIL'), '|', name); cond ? pass++ : fail++; }

const DRIVER = '/home/caseydigennaro/craftmind-league/pulse/direct-drive-day6.js';
const src = fs.readFileSync(DRIVER, 'utf8');

function extract(name) {
  const fi = src.indexOf('function ' + name + '(');
  if (fi < 0) throw new Error('not found: ' + name);
  const ai = src.lastIndexOf('async ', fi);
  const i = (ai >= 0 && fi - ai <= 8) ? ai : fi;
  let depth = 0, j = src.indexOf('{', i);
  const start = j;
  for (; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') { depth--; if (!depth) return src.slice(i, j + 1); }
  }
  throw new Error('unbalanced: ' + name);
}
function extractConst(name) {
  const i = src.indexOf('const ' + name + ' =');
  if (i < 0) throw new Error('const not found: ' + name);
  return src.slice(i, src.indexOf(';', i) + 1);
}

// trace capture: re-implement trace() against a tmp file (the
// driver's own trace() writes to TRACE_PATH; here we bind the same
// shape to a test file and verify ROW CONTENT, which is the rule).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dd6-fo-'));
const TRACE_FILE = path.join(tmp, 'trace.jsonl');
const harness = `
const fs = require('fs');
const http = require('http');
const TRACE_PATH = ${JSON.stringify(TRACE_FILE)};
function nowIso() { return new Date().toISOString(); }
function log(...a) { console.log('[DD-test]', ...a); }
function trace(rec) { fs.appendFileSync(TRACE_PATH, JSON.stringify({ ts: nowIso(), ...rec }) + '\\n'); }
const prims = { sleep: (ms) => new Promise((r) => setTimeout(r, ms)) };
${extractConst('PRIMARY')}
${extractConst('FALLBACK')}
let route = PRIMARY;
let primaryFails = 0;
let cycleNo = 42;
let lastPrimaryProbeAt = 0;
${extract('httpCall')}
${extract('callModel')}
${extract('askModel')}
module.exports = {
  askModel,
  setPrimary: (u, m) => { PRIMARY.url = u; PRIMARY.model = m; },
  setFallback: (u, m) => { FALLBACK.url = u; FALLBACK.model = m; },
  forceProbe: () => { lastPrimaryProbeAt = 0; },
  routeName: () => route.name,
};
`;
const hfile = path.join(tmp, 'harness.js');
fs.writeFileSync(hfile, harness);
const H = require(hfile);

function stubServer(tag) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let d = ''; req.on('data', (c) => { d += c; });
      req.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ choices: [{ message: { content: 'reply-from-' + tag } }], usage: { total_tokens: 1 } }));
      });
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}
const deadPort = async () => { const s = await stubServer('x'); const p = s.address().port; await new Promise((r) => s.close(r)); return p; };
const rows = () => fs.existsSync(TRACE_FILE) ? fs.readFileSync(TRACE_FILE, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];

(async () => {
  const gov = await stubServer('governor');
  const govUrl = `http://127.0.0.1:${gov.address().port}/v1/chat/completions`;
  const dead = await deadPort();
  H.setPrimary(`http://127.0.0.1:${dead}/chat/completions`, 'stub-primary');
  H.setFallback(govUrl, 'stub-governor');

  // Phase 1: primary dead. askModel retries internally; 3 failed
  // askModel calls (each = 2 attempts) trip the switch.
  let last = null;
  for (let i = 0; i < 3; i++) last = await H.askModel([{ role: 'user', content: 'hi' }], 50);
  t('content returned from fallback after switch', last && last.ok && last.content === 'reply-from-governor');
  t('route is now the fallback', H.routeName().includes('governor'));
  const fo = rows().find((r) => r.kind === 'failover');
  t('failover trace row written at switch', !!fo);
  t('failover row names from/to/why/cycle', !!fo && /deepinfra/.test(fo.from || '') && /governor/.test(fo.to || '') && typeof fo.why === 'string' && fo.why.length > 3 && fo.cycle === 42);

  // Phase 2: primary REVIVES; the fail-back probe must fire and
  // write its row the moment the primary answers again.
  const prim = await stubServer('primary');
  H.setPrimary(`http://127.0.0.1:${prim.address().port}/chat/completions`, 'stub-primary');
  H.forceProbe();
  const r2 = await H.askModel([{ role: 'user', content: 'hi again' }], 50);
  const fb = rows().find((r) => r.kind === 'failover-back');
  t('failover-back trace row written on primary recovery', !!fb);
  t('failover-back row names from/to/why', !!fb && /governor/.test(fb.from || '') && /deepinfra/.test(fb.to || '') && typeof fb.why === 'string');
  t('route is primary again', H.routeName().includes('deepinfra'));
  t('content now from primary', r2 && r2.ok && r2.content === 'reply-from-primary');

  gov.close(); prim.close();
  console.log(`\nfailover trace rule: ${pass} PASS / ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.log('ERROR', e); process.exit(1); });
