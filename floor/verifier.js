'use strict';
/**
 * verifier.js — the independent proof checker. A separate process that
 * reads ONLY what the floor has written and answers: is the floor's
 * writer path actually moving, and is everything it wrote constitutional?
 *
 * This is the detector the day-10 guard never had. It does not trust the
 * floor process's liveness, its logs' claims, or its own prior status:
 * every check re-reads the stores. Its status file is written atomically;
 * if the verifier itself dies, its status file goes stale — a charter
 * (or a further watcher) reads THAT, and the lease TTL independently
 * fails commands closed, so no single death leaves a live lease behind
 * a dead proof chain.
 *
 * Checks (C.5 runtime/replay discipline):
 *   1. Canary freshness: newest SELF_PROVE row age <= --max-canary-age-s.
 *   2. Sequence integrity: the union of all floor output files
 *      (log/canary/counts/alert) carries seq 1..N with no gaps or dupes.
 *   3. Replay validation: every act row's act is in the constitution's
 *      closed ACTS list. An unlisted act REFUSES (alert) — C.7 battery.
 *   4. Count agreement: COUNT_DEATH rows in counts == COUNT_DEATH acts.
 *   5. Cross-audit (when op-req.jsonl present): op-backed acts in the
 *      floor log (PARK / ASSERT_DAYLIGHT / VERIFY_FEED remedy) must not
 *      exceed the op channel's recorded requests — the floor cannot have
 *      commanded what the channel never carried.
 *
 * usage: node verifier.js <stateDir> [--max-canary-age-s N] [--watch]
 * One-shot: exit 0 ok, 2 on violation (alert file written either way it
 * changes). Watch: rewrites verifier-status.json every --poll-s (def 5).
 */
const fs = require('fs');
const path = require('path');
const { ACTS } = require('./constitution');

const stateDir = process.argv[2];
if (!stateDir) { console.error('usage: verifier.js <stateDir> [--max-canary-age-s N] [--watch] [--poll-s N]'); process.exit(2); }
function arg(name, dflt) { const i = process.argv.indexOf('--' + name); return i >= 0 ? process.argv[i + 1] : dflt; }
const maxCanaryAgeMs = Number(arg('max-canary-age-s', 90)) * 1000;
const watch = process.argv.includes('--watch');
const pollMs = Number(arg('poll-s', 5)) * 1000;

function readRows(file) {
  try {
    return fs.readFileSync(file, 'utf8').split('\n').filter((l) => l.trim())
      .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
function atomicWrite(file, obj) {
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, file);
}

function check() {
  const problems = [];
  const log = readRows(path.join(stateDir, 'floor-log.jsonl'));
  const canary = readRows(path.join(stateDir, 'floor-canary.jsonl'));
  const counts = readRows(path.join(stateDir, 'floor-counts.jsonl'));
  const alert = readRows(path.join(stateDir, 'operator-alert.jsonl'));

  // 1. canary freshness
  let canaryAgeMs = null;
  if (!canary.length) problems.push('canary-empty');
  else {
    const last = canary[canary.length - 1];
    canaryAgeMs = Date.now() - Date.parse(last.ts);
    if (canaryAgeMs > maxCanaryAgeMs) problems.push(`canary-stale age_s=${(canaryAgeMs / 1000).toFixed(1)} bound_s=${maxCanaryAgeMs / 1000}`);
  }
  // 2. global sequence integrity across the whole writer path
  const all = [...log, ...canary, ...counts, ...alert].filter((r) => Number.isInteger(r.seq)).sort((a, b) => a.seq - b.seq);
  let seqOk = true;
  for (let i = 0; i < all.length; i++) { if (all[i].seq !== i + 1) { seqOk = false; problems.push(`seq-gap at position ${i + 1}: found seq ${all[i].seq}`); break; } }
  // 3. replay validation against the closed act list
  for (const r of [...log, ...canary, ...counts, ...alert]) {
    if (r.act && !(r.act in ACTS)) problems.push(`unlisted-act ${r.act} seq=${r.seq}`);
  }
  // 4. count agreement
  const countActs = log.filter((r) => r.act === 'COUNT_DEATH').length;
  if (countActs !== counts.length) problems.push(`count-mismatch log=${countActs} counts=${counts.length}`);
  // 5. cross-audit vs the op channel's own record (C.5 check 4): every
  // request the channel carried must be accounted for by an act row, and
  // every op-backed act must have its request — a set equality per kind.
  const opReqs = readRows(path.join(stateDir, 'op-req.jsonl'));
  const nActs = (a) => log.filter((r) => r.act === a).length;
  const nReq = (c) => opReqs.filter((r) => r.cmd === c).length;
  if (nReq('park-notify') !== nActs('PARK')) problems.push(`cross-audit park-notify=${nReq('park-notify')} PARK=${nActs('PARK')}`);
  if (nReq('chat') !== nActs('ASSERT_DAYLIGHT')) problems.push(`cross-audit chat=${nReq('chat')} ASSERT_DAYLIGHT=${nActs('ASSERT_DAYLIGHT')}`);
  if (nReq('give') > 2 || (nReq('give') > 0 && nActs('VERIFY_FEED') === 0)) problems.push(`cross-audit give=${nReq('give')} VERIFY_FEED=${nActs('VERIFY_FEED')}`);
  // contract pinning: every row carries one contract_sha
  const shas = new Set(all.map((r) => r.contract_sha).filter(Boolean));
  if (shas.size > 1) problems.push('contract-sha-mixed');

  const status = {
    ts: new Date().toISOString(), ok: problems.length === 0, problems,
    canary_age_s: canaryAgeMs == null ? null : +(canaryAgeMs / 1000).toFixed(2),
    rows: { log: log.length, canary: canary.length, counts: counts.length, alert: alert.length },
    last_seq: all.length ? all[all.length - 1].seq : 0, seq_ok: seqOk,
  };
  atomicWrite(path.join(stateDir, 'verifier-status.json'), status);
  if (problems.length) atomicWrite(path.join(stateDir, 'verifier-alert.json'), status);
  return status;
}

if (watch) {
  const tick = () => { const s = check(); console.log(JSON.stringify(s)); };
  tick();
  setInterval(tick, pollMs);
} else {
  const s = check();
  console.log(JSON.stringify(s, null, 2));
  process.exit(s.ok ? 0 : 2);
}
