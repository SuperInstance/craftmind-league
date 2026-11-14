'use strict';
/**
 * build-deaths-record.js — rebuilds pulse/deaths-record.jsonl, the league's
 * true death record, from the stores that actually hold the deaths:
 *
 *   1. pulse/archive/deaths-frozen-116-20261109.jsonl — the legacy tracker.
 *      Its 116 rows are genuine (written by pulse-plugin.js in the resident
 *      era) but it froze there: the direct-drive drivers never loaded that
 *      plugin, so day 3's four deaths never landed in it.
 *   2. pulse/direct-drive-trace-*.jsonl — the run traces. The shipped
 *      drivers append kind:'death' rows from the bot's server-driven
 *      'death' event; day 3's trace holds deaths 117-120, day 9's trace
 *      121-123, day 13's 124-132, day 14's 133-135.
 *   3. pulse/dayN/provisioning-evidence.jsonl — the provisioning-evidence
 *      stores (deaths-seam repair, 2026-11-09). The stand-only provisioning
 *      body is not a driver and leaves no trace; its death rows carry
 *      kind 'DEATH-DURING-PROVISIONING'. Day 15's store holds death 136,
 *      which sat outside the counting path until this class was folded in
 *      (noticing report-2026-11-09, note 1). Day 14's store is scanned too
 *      and contributes zero — a provisioning window with no death row is
 *      not a death.
 *
 * Causes for 115-136 are annotated from the Orin server log / league
 * ledger / day records (115-116: server log + ledger line 269; 117-120:
 * server log lines; 121-135: the day records' derived causes, mapped in
 * noticing report-2026-11-09 note 1; 136: the day-15 provisioning record,
 * incident P1). Causes for 1-114 were never recorded by the tracker and
 * are marked as such — never invented.
 *
 * Re-run this after any future direct-drive day that adds trace deaths
 * OR any provisioning window that adds a provisioning death; it is
 * deterministic and deduplicates rows by timestamp.
 * Usage: node pulse/lib/build-deaths-record.js
 */
const fs = require('fs');
const path = require('path');

const PULSE = path.join(__dirname, '..');
const ARCHIVE = path.join(PULSE, 'archive', 'deaths-frozen-116-20261109.jsonl');
const OUT = path.join(PULSE, 'deaths-record.jsonl');

// Verified cause annotations, keyed by timestamp prefix (UTC).
const CAUSES = {
  '2026-11-09T04:57:29': { cause: 'Creeper (blown up)', evidence: 'Orin server log death line + ledger line 269 (relaunch-resume-cody-incident-20261109)' },
  '2026-11-09T04:57:38': { cause: 'Zombie (slain)', evidence: 'Orin server log death line + ledger line 269' },
  '2026-11-09T09:59:05': { cause: 'Phantom (slain)', evidence: 'direct-drive trace day3 + Orin server log 09:59:05 "Cody was slain by Phantom" + DIRECT-DRIVE-DAY3 incident 1' },
  '2026-11-09T09:59:43': { cause: 'Skeleton (shot)', evidence: 'direct-drive trace day3 + Orin server log 09:59:43 "Cody was shot by Skeleton"' },
  '2026-11-09T10:00:00': { cause: 'Spider (slain)', evidence: 'direct-drive trace day3 + Orin server log 10:00:00 "Cody was slain by Spider"' },
  '2026-11-09T10:00:11': { cause: 'Spider (slain)', evidence: 'direct-drive trace day3 + Orin server log 10:00:11 "Cody was slain by Spider"' },
  '2026-11-09T19:14:42': { cause: 'Drowned', evidence: 'DIRECT-DRIVE-DAY9 record (death at 19:14:42Z drowned in his own pit) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-09T19:23:13': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY9 record (two zombie deaths at world spawn in the unheld night) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-09T19:23:22': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY9 record (two zombie deaths at world spawn in the unheld night) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:07:06': { cause: 'Creeper (blown up)', evidence: 'DIRECT-DRIVE-DAY13 record (death 1, creeper at the hole exit) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:07:49': { cause: 'Creeper (blown up)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: creeper x1, zombie x7) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:09:22': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: zombie x7 in rain gloom at the respawn point) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:09:33': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: zombie x7 in rain gloom at the respawn point) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:09:53': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: zombie x7 in rain gloom at the respawn point) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:10:29': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: zombie x7 in rain gloom at the respawn point) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:10:41': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: zombie x7 in rain gloom at the respawn point) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:10:58': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: zombie x7 in rain gloom at the respawn point) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:11:50': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY13 record (deaths 2-9: zombie x7 in rain gloom at the respawn point) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T06:57:39': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY14 record (deaths 133-135, all Zombie, derived) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T07:06:14': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY14 record (deaths 133-135, all Zombie, derived) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T07:08:01': { cause: 'Zombie (slain)', evidence: 'DIRECT-DRIVE-DAY14 record (deaths 133-135, all Zombie, derived) + noticing report-2026-11-09 note 1 mapping' },
  '2026-11-10T07:38:27': { cause: 'Zombie (slain)', evidence: 'pulse/day15/provisioning-evidence.jsonl (health-drop sequence to hp 0 at the login point (28.8, 67, -104.1); census-named zombie at (28.3, 67, -104.7)) + DIRECT-DRIVE-DAY15 record incident P1 + noticing report-2026-11-09 note 1' },
};

function readJsonl(p) {
  const rows = [];
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch { /* torn line: not evidence */ }
  }
  return rows;
}

const byTs = new Map();
for (const r of readJsonl(ARCHIVE)) {
  byTs.set(r.ts, {
    citizen: 'Cody', ts: r.ts, pos: r.pos || null,
    cause: null, cause_verified: false,
    source: 'archive/deaths-frozen-116-20261109.jsonl (legacy tracker row)',
    evidence: 'tracker row; cumulative counts corroborated by ledger snapshots (109 @2026-11-08T07:27Z, 114 pre-incident baseline, 116 post-incident)',
  });
}
const traceFiles = fs.readdirSync(PULSE)
  .filter((f) => /^direct-drive-trace.*\.jsonl$/.test(f)).sort();
for (const f of traceFiles) {
  for (const r of readJsonl(path.join(PULSE, f))) {
    if (r.kind !== 'death' || !r.ts) continue;
    if (byTs.has(r.ts)) continue;
    byTs.set(r.ts, {
      citizen: 'Cody', ts: r.ts, pos: null,
      cause: null, cause_verified: false,
      source: 'pulse/' + f + ' (trace kind:death row)',
      evidence: 'trace row appended by the driver from the server death event',
    });
  }
}
// Provisioning-evidence stores: one per day directory that ran a
// provisioning window. A DEATH-DURING-PROVISIONING row is a death of the
// citizen's body written by a non-driver process; its position is the
// store's own spawned row (the body the window was provisioning).
const provDirs = fs.readdirSync(PULSE, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^day\d+$/.test(d.name)).map((d) => d.name).sort();
let provDeaths = 0;
for (const d of provDirs) {
  const store = path.join(PULSE, d, 'provisioning-evidence.jsonl');
  if (!fs.existsSync(store)) continue;
  let spawnPos = null;
  for (const r of readJsonl(store)) {
    if (r.kind === 'spawned' && r.pos) spawnPos = r.pos;
    if (r.kind !== 'DEATH-DURING-PROVISIONING' || !r.ts) continue;
    const n = Number.isInteger(r.deaths) && r.deaths > 0 ? r.deaths : 1;
    for (let i = 0; i < n; i++) {
      let key = r.ts;
      if (byTs.has(key)) {
        if (i === 0) continue; // already counted from record/trace: that row wins
        key = r.ts + '#prov' + i;
      }
      byTs.set(key, {
        citizen: 'Cody', ts: r.ts, pos: spawnPos,
        cause: null, cause_verified: false,
        source: 'pulse/' + d + '/provisioning-evidence.jsonl (provisioning-evidence DEATH-DURING-PROVISIONING row)',
        evidence: 'provisioning-evidence row written by the stand-only provisioning body (health-watch observed hp reach 0); the body was not a driver and left no trace',
      });
      provDeaths++;
    }
  }
}
const rows = [...byTs.values()].sort((a, b) => (a.ts < b.ts ? -1 : 1));
rows.forEach((r, i) => {
  r.n = i + 1;
  const ann = CAUSES[r.ts.slice(0, 19)];
  if (ann) { r.cause = ann.cause; r.cause_verified = true; r.evidence = ann.evidence; }
  if (r.n <= 114) r.note = 'cause not recorded by the legacy tracker; existence and cumulative count verified, cause not invented';
});
const ordered = rows.map((r) => ({
  n: r.n, citizen: r.citizen, ts: r.ts, cause: r.cause,
  cause_verified: r.cause_verified, pos: r.pos, source: r.source,
  evidence: r.evidence, ...(r.note ? { note: r.note } : {}),
}));
fs.writeFileSync(OUT, ordered.map((r) => JSON.stringify(r)).join('\n') + '\n');
console.log(`wrote ${OUT}: ${ordered.length} deaths (n=1..${ordered.length}); provisioning-evidence deaths folded: ${provDeaths}`);
console.log('last four:', ordered.slice(-4).map((r) => `#${r.n} ${r.ts} ${r.cause}`).join(' | '));
