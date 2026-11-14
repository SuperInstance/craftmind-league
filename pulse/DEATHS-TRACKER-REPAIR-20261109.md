# DEATHS-TRACKER REPAIR — the dead instrument, retired (2026-11-09)

**Verdict: REPAIRED AND PROVEN.** The frozen `pulse/deaths.jsonl` is archived
as evidence; the league's death record is now `pulse/deaths-record.jsonl`
(120 rows, rebuilt from the stores); counting lives in one place
(`pulse/lib/deaths.js`, extended); the noticing report reads the derivation,
not the dead file; and the counter demonstrably moves (13/13 new suite,
12/12 + 12/12 + 12/12 legacy day-4/5/6 proofs still green).

## Ground truth — verified by this lane, from the stores named

| Deaths | Period | Verification |
|---|---|---|
| 1–114 | 2026-11-07T04:43:57Z → 2026-11-08T07:34:40Z | Legacy tracker rows 1–114 (the file's writer, `pulse-plugin.js`, did append in the resident era). Causes were never recorded by the tracker and are marked `cause: null, cause_verified: false` — not invented. Cumulative count corroborated by ledger snapshots: 109 @2026-11-08T07:27Z (ledger line 129), 114 = the pre-incident baseline in the relaunch record. |
| 115 | 2026-11-09T04:57:29.686Z — Creeper | Tracker row 115 + Orin server log "Cody was blown up by Creeper" + ledger line 269. Operator-caused (launch without the character loop). |
| 116 | 2026-11-09T04:57:38.916Z — Zombie | Tracker row 116 + server log + ledger line 269. Operator-caused. |
| 117 | 2026-11-09T09:59:05.967Z — Phantom | Day-3 trace `kind:'death'` row + Orin server log (latest.log, still resident): "09:59:05 Cody was slain by Phantom" — timestamps agree to the second. |
| 118 | 2026-11-09T09:59:43.370Z — Skeleton (shot) | Trace + server log "09:59:43 Cody was shot by Skeleton". |
| 119 | 2026-11-09T10:00:00.065Z — Spider | Trace + server log "10:00:00 Cody was slain by Spider". |
| 120 | 2026-11-09T10:00:11.415Z — Spider | Trace + server log "10:00:11 Cody was slain by Spider". |
| 0 | Days 4–8 | Zero `kind:'death'` rows in the day-4 trace (`direct-drive-trace.jsonl`), day-5, day-6, and day-7 traces; spawn rows throughout read `deathsWorld: 120`; day 8 never woke the citizen. |

**No disagreement with the brief's ground truth was found.** Cody's total
stands at **120**. (One nuance the brief compressed: the tracker is not a
fiction — its 116 rows are genuine. It froze because the direct-drive
drivers never loaded `pulse-plugin.js`, the component that appends to it.
Day 3's abort read the file while its writer was unloaded: a decoration.)

## What was built

1. **Archive.** `pulse/deaths.jsonl` → `pulse/archive/deaths-frozen-116-20261109.jsonl`,
   moved (not copied), sha256 `bbc4ec6b…68c5` identical before and after;
   `pulse/archive/README-deaths-frozen.md` explains what it is and forbids
   reading it as data. The path `pulse/deaths.jsonl` no longer exists.
2. **Rebuilt record.** `pulse/deaths-record.jsonl` — 120 rows, one per death:
   `{n, citizen, ts, cause, cause_verified, pos, source, evidence}` (+ a
   `note` on rows 1–114 marking the unrecorded cause). Built deterministically
   by `pulse/lib/build-deaths-record.js` from the archive + all
   `direct-drive-trace*.jsonl` files, deduplicated by timestamp, with causes
   for 115–120 annotated from the server log / ledger. Re-run the builder
   after any future day that adds trace deaths.
3. **Single source.** `pulse/lib/deaths.js` keeps its proven exports
   (`countTraceDeaths`, `shouldAbort` — day drivers unchanged in behaviour)
   and gains `parseTraceDeaths`, `deriveDeaths(recordPath, tracePaths)`
   (record + live traces, deduped by ts, numbered in ts order) and
   `deathsInWindow`. Backup: `lib/deaths.js.bak-pre-repair-20261109`.
4. **Noticing rewired.** `commons/noticing/noticing.py` now implements the
   same derivation in Python: it reads `deaths-record.jsonl`, merges trace
   death rows not yet in the record, and prints each in-window death with
   its number, timestamp and cause. The attribution caveat paragraph is
   **gone** — it retired because the instrument works. Backups:
   `noticing.py.bak-pre-repair-20261109`, `README.md.bak-pre-repair-20261109`.

## The counter moves — proofs

- **New suite** `pulse/lib/test-deaths.js`: **13 PASS / 0 FAIL** — synthetic
  traces with 0, 1, 3 deaths; torn final line ignored; missing file = 0;
  abort predicate fires at exactly 3; derivation dedupes record+trace
  (3, not 5); AKST windows partition exactly.
- **Legacy proofs still green** against the extended library:
  `test-deaths-day4.js` 12/12 (DRY PROOF: HOLDS), day-5 12/12, day-6 12/12.
- **Noticing re-runs (filed):**
  - `commons/noticing/report-2026-11-08-rerun-derived.md` — deaths section,
    before: *"2 in window … stated as attribution, not as a field read"*
    (from a file frozen at 116). After: **2 in window, #115 Creeper,
    #116 Zombie**, total all-time 120, no caveat. (Window totals also match
    the closed-window correction: 273 calls / 604.2 mind-s.)
  - `commons/noticing/report-2026-11-09-interim-derived.md` — **4 in window:
    #117 Phantom, #118 Skeleton, #119 Spider, #120 Spider**. Interim by
    filename: the Nov-9 AKST day had not closed at run time; the canonical
    report #2 remains due after close under the duty's cadence, and it will
    now read these same derived numbers.

## Grep census — remaining `deaths.jsonl` references (code files)

Rewired: **noticing.py** (now mentions the path only in a comment marking
it archived evidence; it reads the record + traces).

Named, still touching the legacy path, deliberately not rewired:
- `pulse/pulse-plugin.js` — the legacy tracker's *writer* (resident-cody
  stack) and `pulse/trial.js` — its reader (legacy trial circuit breaker,
  counts new rows since a baseline offset). They are a matched pair from
  the pre-direct-drive stack; neither is used by the direct-drive drivers
  or the noticing report. If the resident stack ever revives, its plugin
  will recreate `pulse/deaths.jsonl` with fresh rows — at that point the
  builder must be re-run or that stack retired; it cannot silently corrupt
  the derived record, which never reads that path.
- `pulse/direct-drive-day3.js` — the defective shipped driver itself
  (contains `DEATHS_PATH`/`deathsNow`); a historical record, not modified.
- `pulse/direct-drive.js`, `direct-drive-day4.js` … `day7.js` — mention
  `deaths.jsonl` only in header comments describing the defect; their code
  counts from the trace via `lib/deaths.js` (asserted by the day-4/5/6
  test suites, still green). The day-7 driver is a shipped record and was
  not modified; the next day's driver inherits through `lib/`.
- `pulse/test-deaths-day4/5/6.js` and `pulse/lib/deaths.js` — references
  are assertions/comments about the old defect, by design.

Historical documents (day records, RELAUNCH-EXECUTION, OPERATIONS §, READMEs)
still cite `deaths.jsonl` as the record *of their moment*; they are the
archive of how the defect was understood and are not rewritten.

## The one sentence

The next driver counts deaths from its own trace through `lib/deaths.js`
and the next noticing report derives them from `deaths-record.jsonl` merged
with the live traces — and both can be trusted because the suite beside the
library feeds the derivation synthetic deaths and watches the count move:
0, 1, 3, abort.
