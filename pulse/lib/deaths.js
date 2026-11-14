'use strict';
/**
 * deaths.js — DEATH COUNTING FROM A STORE THE MODEL CANNOT FAKE
 * (day-4 repair (1); seeded substrate).
 *
 * WHY: on day 3 the driver's 3-death abort read pulse/deaths.jsonl —
 * a file whose writer is a different component that never appended —
 * so deathsNow() returned the stale baseline all day while Cody died
 * four times in 66 seconds (ledger direct-drive-day3-deaths-incident).
 * An abort wired to an unwritten file is a decoration.
 *
 * WHAT: deaths are counted from the run's own trace file
 * (pulse/direct-drive-trace.jsonl), which the driver process appends
 * from the server's death signal (mineflayer's 'death' event fires on
 * the server's respawn packet — the model cannot mint one, and the
 * trace is append-only in the driver). The counter resumes from the
 * trace on a mid-day restart, so a relaunched driver inherits the
 * day's true death count. The abort predicate lives here too, so the
 * dry test (pulse/test-deaths-day4.js) exercises the shipped logic.
 */
const fs = require('fs');

function countTraceDeaths(tracePath) {
  let n = 0;
  let text = '';
  try { text = fs.readFileSync(tracePath, 'utf8'); } catch { return 0; }
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      const rec = JSON.parse(line);
      if (rec && rec.kind === 'death') n++;
    } catch { /* torn line: not evidence, not a death */ }
  }
  return n;
}

function shouldAbort(deathsThisRun, limit) {
  return deathsThisRun >= (limit == null ? 3 : limit);
}

/**
 * DERIVATION — the single counting path (deaths-tracker repair, 2026-11-09;
 * provisioning seam folded in by the deaths-seam repair, 2026-11-09).
 *
 * The rebuilt record (pulse/deaths-record.jsonl, built by
 * lib/build-deaths-record.js from the archived legacy tracker + the run
 * traces + the provisioning-evidence stores) is the historical record.
 * deriveDeaths() merges it with any live trace files and any
 * provisioning-evidence stores, deduplicating by timestamp, so a death
 * appended to either store class today is counted today even before the
 * record is rebuilt.
 *
 * Provisioning-evidence stores (pulse/dayN/provisioning-evidence.jsonl)
 * are written by the stand-only provisioning body — NOT a driver, so it
 * leaves no trace; its death rows carry kind 'DEATH-DURING-PROVISIONING'.
 * Death #136 (2026-11-10T07:38:27.720Z) sat in exactly that store,
 * invisible to this path, until the seam repair: the noticing final for
 * 2026-11-09 derived 135 against a true 136 (commons/noticing/
 * report-2026-11-09.md note 1). The noticing report (commons/noticing/
 * noticing.py) implements this same derivation in Python and picks the
 * death up from the rebuilt record; the two must stay in step.
 */
function parseTraceDeaths(tracePath) {
  const out = [];
  let text = '';
  try { text = fs.readFileSync(tracePath, 'utf8'); } catch { return out; }
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      const rec = JSON.parse(line);
      if (rec && rec.kind === 'death') out.push(rec);
    } catch { /* torn line: not evidence, not a death */ }
  }
  return out;
}

function parseProvisioningDeaths(storePath) {
  const out = [];
  let text = '';
  try { text = fs.readFileSync(storePath, 'utf8'); } catch { return out; }
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      const rec = JSON.parse(line);
      if (rec && rec.kind === 'DEATH-DURING-PROVISIONING' && rec.ts) {
        const n = Number.isInteger(rec.deaths) && rec.deaths > 0 ? rec.deaths : 1;
        for (let i = 0; i < n; i++) out.push(rec);
      }
    } catch { /* torn line: not evidence, not a death */ }
  }
  return out;
}

function deriveDeaths(recordPath, tracePaths, provisioningPaths) {
  const byTs = new Map();
  try {
    for (const line of fs.readFileSync(recordPath, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try { const r = JSON.parse(line); if (r && r.ts) byTs.set(r.ts, r); } catch { /* torn */ }
    }
  } catch { /* no record yet: traces alone still derive */ }
  for (const tp of tracePaths || []) {
    for (const rec of parseTraceDeaths(tp)) {
      if (rec.ts && !byTs.has(rec.ts)) {
        byTs.set(rec.ts, { citizen: 'Cody', ts: rec.ts, cause: null, cause_verified: false, source: tp });
      }
    }
  }
  for (const pp of provisioningPaths || []) {
    let k = 0;
    for (const rec of parseProvisioningDeaths(pp)) {
      // A ts already counted from the record or a trace wins (the record
      // row carries the annotated cause); a second provisioning death at
      // the same ts is a distinct death and gets its own key.
      let key = rec.ts;
      if (byTs.has(key)) {
        if ([...byTs.values()].some((r) => r.ts === rec.ts && r.source === pp)) {
          key = rec.ts + '#prov' + (++k);
        } else {
          continue;
        }
      }
      byTs.set(key, { citizen: 'Cody', ts: rec.ts, cause: null, cause_verified: false, source: pp });
    }
  }
  const rows = [...byTs.values()].sort((a, b) => (a.ts < b.ts ? -1 : 1));
  rows.forEach((r, i) => { r.n = i + 1; });
  return rows;
}

function deathsInWindow(rows, w0iso, w1iso) {
  const w0 = Date.parse(w0iso), w1 = Date.parse(w1iso);
  return rows.filter((r) => { const t = Date.parse(r.ts); return t >= w0 && t < w1; });
}

module.exports = { countTraceDeaths, shouldAbort, parseTraceDeaths, parseProvisioningDeaths, deriveDeaths, deathsInWindow };
