'use strict';
/**
 * release.js — the ONLY writer of release.json. Run by the parent/operator
 * (an escalation decision, C.4), never by the floor. Releasing a park is a
 * human/parent act; the floor may observe it (RELEASE_OBSERVED) and may
 * then issue a fresh lease, but it cannot perform it (C.3 #7).
 *
 * Each release carries `seq`: the count of releases ever made in this
 * state dir (repair charter (b), FLOOR-REPAIR-20261109.md). The floor
 * consumes releases as a sequence-checked stream — a release clears
 * only a park older than itself, and a later park needs a later
 * release. A pre-repair release.json without `seq` counts as seq 1.
 *
 * usage: node release.js <stateDir> <releasedBy>
 */
const fs = require('fs');
const path = require('path');

const [stateDir, by] = process.argv.slice(2);
if (!stateDir || !by) { console.error('usage: release.js <stateDir> <releasedBy>'); process.exit(2); }
const lease = JSON.parse(fs.readFileSync(path.join(stateDir, 'lease.json'), 'utf8'));
if (!lease.parked) { console.error('no park latched; nothing to release'); process.exit(1); }
let prev = null;
try { prev = JSON.parse(fs.readFileSync(path.join(stateDir, 'release.json'), 'utf8')); } catch { /* first release in this state dir */ }
const prevSeq = prev ? (Number.isInteger(prev.seq) ? prev.seq : 1) : 0;
const rel = { released_by: by, ts_ms: Date.now(), ts: new Date().toISOString(), park_seq: lease.park_seq, seq: prevSeq + 1 };
fs.writeFileSync(path.join(stateDir, 'release.json'), JSON.stringify(rel, null, 2));
console.log(JSON.stringify(rel));
