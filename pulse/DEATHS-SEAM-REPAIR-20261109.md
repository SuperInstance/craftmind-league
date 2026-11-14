# DEATHS-SEAM REPAIR — the provisioning death enters the counting path

**Filed:** 2026-11-10 (AKST programme day 2026-11-09's repair slot).
**Routed by:** `commons/noticing/report-2026-11-09.md`, note 1 — its actionable item 1.
**Scope:** the deaths derivation only (`pulse/lib/deaths.js`, `pulse/lib/build-deaths-record.js`, `pulse/deaths-record.jsonl`, `pulse/lib/test-deaths.js`). The noticing tool was not edited (its flag line is the duty's own housekeeping, a separate item). The relay was not touched. No citizen was woken; Vega/Geist untouched.

## The seam, in its three forms

The counting path has now missed deaths three times, each time in a different place, and the three misses are one defect wearing three coats: **a death counts only if it happens inside the instrumented path, and the instrumented path keeps being narrower than the set of bodies the house spawns.** Form one (day 3): the WRITER was never loaded — the deaths file the driver's abort read was written by a component the direct-drive drivers never loaded, so four deaths in 66 seconds moved no counter. Form two (day 13): the READER was unwired at the layer holding the body — the floor parked correctly at the third death and the driver's reflex flee/burrow sequence, which checked neither park nor count, carried the body through six more deaths. Form three (day 15, this repair): the death happened OUTSIDE ANY DRIVER — the stand-only provisioning body, killed by the census-named zombie 5.5 s after spawn and before the `/give`, wrote its death as `DEATH-DURING-PROVISIONING` into `pulse/day15/provisioning-evidence.jsonl`, a store no counter read, because that body was not a driver and left no trace. The rebuilt record had never been re-run either, so the death sat in neither store the derivation reads, and the noticing final derived 135 against a true 136 — with days 16 and 17 reduced to hand-carrying the correction ("135 derived + the provisioning seam = 136") in their records. A correction every consumer must remember by hand is a defect in the derivation, not a footnote.

## The fix

In the deaths tracker's own established pattern (append-only, evidence preserved, nothing rewritten):

1. **`pulse/lib/deaths.js`** — new `parseProvisioningDeaths(storePath)` reads `DEATH-DURING-PROVISIONING` rows (expanding a row's `deaths` count if one ever exceeds 1); `deriveDeaths(recordPath, tracePaths, provisioningPaths)` takes the provisioning stores as an optional third source class and merges them deduplicated by timestamp — a timestamp already counted from the record or a trace wins (the record row carries the annotated cause); a second provisioning death at the same timestamp still counts. The derivation header comment now names all three source classes and records why the third exists.
2. **`pulse/lib/build-deaths-record.js`** — the builder gains the provisioning-evidence stores as its third source class: it scans `pulse/dayN/provisioning-evidence.jsonl` (day directories, sorted), folds each `DEATH-DURING-PROVISIONING` row into the record with the store's own spawned position and a source string naming the store and row kind, and its header now instructs a re-run after any provisioning window that adds a death, not only after trace days. Cause annotations (`CAUSES`) were extended to deaths 121–136 from the day records' derived causes, mapped in noticing note 1 (121 Drowned; 122–123, 126–132, 133–135 Zombie; 124–125 Creeper; 136 Zombie — each evidence string names its day record). Nothing else about the build changed; it remains deterministic and deduplicates by timestamp.
3. **The record rebuilt** — `pulse/deaths-record.jsonl` regenerated from the stores by the repaired builder: 120 → 136 rows. Rows 1–120 are **byte-identical** to the pre-repair record (verified by diff against `pulse/deaths-record.jsonl.pre-seam-repair-20261109`); rows 121–135 enter from their traces with causes annotated for the first time; row 136 enters from the provisioning store with its evidence (below). A second builder run reproduces the file exactly (md5 `54fa3b6467f637fac13d618ae89b50d5` both runs — idempotent).
4. **Pre-repair sources preserved** — `pulse/lib/deaths.js.pre-seam-repair-20261109`, `pulse/lib/build-deaths-record.js.pre-seam-repair-20261109`, `pulse/lib/test-deaths.js.pre-seam-repair-20261109`, `pulse/deaths-record.jsonl.pre-seam-repair-20261109`.

## Before / after, over the real stores

Derivation = shipped `deriveDeaths` over the record + all `pulse/direct-drive-trace*.jsonl` (+ the dayN provisioning stores after the repair), Node v24.22.2:

| measure | before | after |
|---|---:|---:|
| total deaths | **135** | **136** |
| noticing window 2026-11-09T09:00Z → 2026-11-10T09:00Z | 19 | **20** (day 13 ×9, day 14 ×3, day 3 ×4, day 9 ×3, provisioning ×1) |
| pre-day-11 boundary (ts < 2026-11-10T00:59:00Z) — the floor's 123 reproduction | 123 | **123 (unmoved)** |
| day-9 hour 2026-11-09T19:00–20:00Z — the floor's day-9 window reproduction | 3 | **3 (unmoved)** |
| day-10 window | 0 | 0 (unmoved) |

Cross-check from the second implementation: `commons/noticing/noticing.py --day 2026-11-09`, unedited, now prints `deaths=20` for the window (it read 19 in the filed final) because its merge takes #136 from the rebuilt record — the Python mirror and the JS path are back in step with no change to the tool.

## Fixtures — the class, not the instance

`pulse/lib/test-deaths.js`, extended beside the library: **17 PASS / 0 FAIL** (before this repair: 13 PASS / 0 FAIL).

- All 13 original tests pass unchanged (trace counting, torn-line and missing-file handling, abort predicate, record+trace dedup, window counts, numbering).
- `parseProvisioningDeaths` returns the 1 death from a synthetic provisioning store holding a spawned row + one `DEATH-DURING-PROVISIONING` row.
- That store moves the derivation by **exactly 1** (3 → 4).
- A provisioning store with **zero** death rows (spawned + clean quitting rows only) moves the derivation by **0** (still 3).
- The provisioning death dedupes against the record once rebuilt (the same timestamp derives exactly one row).

Production zero-case, for the record: the scan also folds `pulse/day14/provisioning-evidence.jsonl` — a real provisioning window that provisioned clean (`deaths: 0`, no death row) — and it contributes 0, as it must.

## Record row #136, as written

```json
{"n":136,"citizen":"Cody","ts":"2026-11-10T07:38:27.720Z","cause":"Zombie (slain)","cause_verified":true,"pos":{"x":28.799582983788852,"y":67,"z":-104.1035502706622},"source":"pulse/day15/provisioning-evidence.jsonl (provisioning-evidence DEATH-DURING-PROVISIONING row)","evidence":"pulse/day15/provisioning-evidence.jsonl (health-drop sequence to hp 0 at the login point (28.8, 67, -104.1); census-named zombie at (28.3, 67, -104.7)) + DIRECT-DRIVE-DAY15 record incident P1 + noticing report-2026-11-09 note 1"}
```

## Sweep — other stores checked for uncounted deaths

The repair swept the league for death-bearing stores outside the counting path. Named so no future repair has to re-derive this, and so nothing checked is silently absorbed:

- **`pulse/day14/provisioning-evidence.jsonl`** — the class's second real store; zero death rows (see above). Folded by the new scan; contributes 0. Not a seam.
- **Fixture traces** — `pulse/day*/fixture-run/*/trace.jsonl` (days 14–17 safety batteries) and `floor/run/t9/trace.jsonl` hold `kind:'death'` rows with synthetic round-number timestamps, and the d-replay arms carry copies of the real day-13 timestamps. These are TEST FIXTURES for throwaway rehearsal bodies, not live citizens; they are **deliberately not folded**, and the counting path's scan stays scoped to pulse-root traces + dayN provisioning stores so they never enter it. Checked and excluded, not a seam.
- **`chronicle/beats.jsonl`** — 9 rows carry `kind: "death"` as a curated beat label; the beats cite deaths already counted (they are written from the day records — a derived narrative store, not body evidence). No uncounted deaths.
- **`digest/digest.jsonl`** and the day11/12/13/16/17 directories (outside fixture runs) — no death rows of any kind.
- No other `DEATH-*` row kinds exist anywhere in the league's stores.

## Incident owned by this lane

During verification I ran `noticing.py --day 2026-11-09` **without `--out`**; the tool's default destination is the filed report itself, so the run overwrote `commons/noticing/report-2026-11-09.md` (17,622 B) with a machine-only regeneration (4,919 B) — the header and the duty-wearer's notes were not in the overwritten file. **Restored byte-exact** from the noticing lane's own components, still on the box: `cat /tmp/report-header.md /tmp/report-2026-11-09-body.md` reproduces the filed final at exactly **17,622 B**, verified (deaths line reads "total all-time: 135" — the report's own honest undercount, intact; note 1's text present; tail = the kill-criterion footer, matching the pre-overwrite read). The report as filed stands unaltered; this incident is recorded here and in the lane's ledger entry summary. Standing lesson, fourth form of verify-before-you-run: a read-only tool whose default output path is a filed record is not read-only — verification runs go to scratch destinations, always.

## The standing rule, for every future body

**EVERY body the house spawns — driver, provisioning, rehearsal, op — writes its deaths into a store the counter reads, or the charter that spawns it names why not.** The counter reads: the run traces (`pulse/direct-drive-trace*.jsonl`, kind `death`), the provisioning-evidence stores (`pulse/dayN/provisioning-evidence.jsonl`, kind `DEATH-DURING-PROVISIONING`), and the rebuilt record folded from both. A new body class that writes its deaths anywhere else has not finished spawning until the counting path reads that store too — the seam has now appeared as an unloaded writer, an unwired reader, and an unread store, and the next form is cheapest to refuse in advance.
