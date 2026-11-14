# CHRONICLE SEAL — DAYS 11–17 (2026-11-09)

Lane: chronicle seals, the booth filing's named follow-up (BOOTH-IMPL-20261109.md §3).
Authorisation: Casey's "build it all" + parent sequencing. No live citizen work was
done in this lane; Vega/Geist untouched; the day-17 ramp filing and the world were
not touched.

## §1 What was sealed

The seal ran as an append-only extension (`chronicle/seal-11-17.js`, preserved in
the chronicle directory as this lane's source — curation in the script, sealing
deterministic). Re-running build.js was NOT used: it would re-seal every existing
row with a fresh `written_utc`, a rewrite of history. The extension loaded the
stores verbatim, verified both hash chains end-to-end before writing, refused on
any pre-existing target id, and appended with continuing seq + chain
(writer `chronicle-seal-11-17` v1.0.0, written_utc 2026-11-10T15:27:02.098Z).

Result: `{ beats_appended: 75, beats_total: 136, tension_appended: 7, tension_total: 17 }`.

Beats per day: **day 11: 21 · day 12: 11 · day 13: 9 · day 14: 11 · day 15: 8 ·
day 16: 6 · day 17: 9** (75 total). Both acts of day 11 are sealed — the Gate B
stop (b:D11:001–007, incl. the floor repair it forced) and the played relaunch
(b:D11:008–021). The safety-reading-path repair carries its own beat (b:D14:001)
ahead of day 14's deaths. Provisioning death #136 is its own beat (b:D15:003),
fault_owner `world` with the charter share stated in its what/observations (the
store's sealed fault vocabulary has no "charter" value; precedent mapped it so).
Day 17's beats record a no-launch day: four rehearsal arms at 0/3 (b:D17:002–004),
the gate holding as the day's shape (b:D17:001), and **no citizen narration on any
day-17 beat — he never woke; the absence is stated in b:D17:001, never filled**.

Append-only integrity, verified from outside after the run: the pre-seal
`beats.jsonl` (77,797 B, sha256 1efc0e68…) is a byte-exact prefix of the sealed
file (202,276 B, sha256 d1b248e2…); same for `tension-series.jsonl` (11,046 B,
57ad57a9… → 14,858 B, e4305e5c…). `viewings.jsonl` is byte-identical (999c814a…).
`places.json` gained exactly one stable name — **the bowl at home's edge** —
and build.js's PLACES table was patched with the identical definition so a
future full build reproduces it (build.js NOT re-run).

Corrections ride as new rows, per discipline: b:D11:005 `corrects` the stop
record's "cap-renewal job does not exist" claim (the job is a goal-owned cron;
renewal #9 fired branch (a)); b:D14:007 `corrects` the day-13 record's
"respawn point" phrasing (the .dat Pos is the login position; respawns scatter).

## §2 The hp-field flag — discipline preserved

The days 1–5 trace `hp` two-readings disagreement is carried verbatim in the
existing rows and asserted by neither; this seal adds nothing that touches it.
Every hp value in the new beats is labelled at its source as a **driver-state
read** (trace cycle rows / harness reads) — day 15's transit bottom (8.97,
b:D15:002), death #136's health sequence (harness reads, b:D15:003), day 16's
"hp 20 in every cycle row" (b:D16:003) — never upgraded to an NBT claim.

## §3 Tension series — days 11–17

Seven rows appended: `t:D11:absent` … `t:D17:absent`, each carrying the standing
verdict verbatim in substance ("NOT-PROMOTED — offline instrument, no consumer").
No series was ever computed for days 11–17 — `tension/out/` holds TSVs +
manifests for days 1–5, 9, 10 only — so there is no canonical series to carry;
the established absent-row form is used. Each day's `why` states its case: days
11–16 have traces (a series is computable by the tension lane; none exists to
carry); **day 17's row states the no-launch day in its data fields** — Cody was
never woken, no citizen trace exists, no series can be computed at all. No
reader-facing surface may present T as a day's drama measure; nothing here does.

## §4 Checker verdict (term 5)

`node compile.js` was run first: both compiled dossiers are byte-identical to
their pre-seal bytes (cold-reader-day3 sha256 941b8a13…, director-days9-10
a869726f…) — they cite only ≤day-10 rows, which did not move. `dossiers/index.json`
changed (d8197f72… → c169675d…) because it records store shas, which legitimately
moved; the previously-on `manifest.json` store shas are likewise stale as of this
seal — both are provenance records of their build moment, stated here, not
regenerated in this lane.

`node check.js` over the extended stores: **34 PASS / 0 FAIL** — hash chains +
gapless seq verified at 136 beats / 5 viewings / 17 tension rows; ids unique
across the address space (158); every beat ≥1 evidence; every beat ≥2
observations or a labelled gap; kinds within the study's set; `what` ≤320
(max exactly 320); day-9 C4 exclusion, NOT-PROMOTED on every tension row,
days 6/7/8 absences and days 1–5 hp-artefact gates all still pass; both dossiers'
citations resolve with their gate labels intact. One coverage note, stated not
smoothed: check.js's presence loop still asserts citizen days 1–10 only; days
11–17 presence is this lane's own verified count (§1) plus the chain/seq/
uniqueness checks above, which cover every row. check.js was not edited.

## §5 Booth re-point (term 4) — citations only, diff-verified

`booth/generate-script.js`'s PLAN citations were re-pointed from the played day
record to the sealed beats, and its "Source honesty" header rewritten to record
the re-point (the header described the pre-seal state; that was the only prose
changed anywhere). Originals preserved at `booth/pre-repoint/`. The generator
was re-run — it regenerated `script-day11.json` + `script-day11.md` and passed
its own subtitle byte-comparison against the trace (9 cues).

Diff result: **11 narrator lines changed; 18 citation entries re-pointed; entries
19 → 18** (S11's three record citations collapse onto two beats, b:D11:009 +
b:D11:017 — a citation-set change only). Kept by design: S2's `previously-on ed.1`
+ `b:D02:003` (already a beat citation) and `previously-on ed.1` inside S8.
With every `cite` array stripped, old and new `script-day11.json` are identical
as JSON; the subtitle and screen channels are identical; the .md diff touches
exactly the 11 `cites:` lines and nothing else. **Not one spoken or subtitled
byte changed.** The SCREEN credits' prose mention of the record path is episode
text, not a citation, and was left byte-identical.

## §6 Previously On — readiness (term 6; report only, NOT generated)

READY. The generator's stated input was sealed day 11–17 beats; that input now
exists: 75 new beats, all `status: sealed` (verified by direct read of the sealed
store), 27 carrying narration for the `⟦NARR:⟧` token substitution (10 of the 75
are day_shape beats, which the tension-by-proxy rule excludes from citation —
the generator's own discipline, unchanged). `previously-on/generate.js` loads
only `beats.jsonl` + `viewings.jsonl`; viewings is byte-identical, so the aired
map is unchanged (days 3/9/10 conferred; w:STD:001/w:ARM:001 confer nothing —
the owed human arm stays visibly owed). A next edition is one PLAN edit in
`chronicle/previously-on/generate.js` + `node generate.js`, exactly as
PREVIOUSLY-ON-IMPL §5 files it ("one plan-edit + one command away"). This lane
did not generate the edition, per commission.

## §7 Gaps and contradictions carried, not settled

1. **The systemd contradiction (carried in b:D11:007's observations and stated
   once at b:D17:007).** The floor-repair filing proves ddbridge systemd units on
   the repair lane's instance; days 12, 13, 14, 16, 17 each found NO systemd
   units on the serving instance and the setsid supervisors dead (relay deaths
   #8–#12 across days 11–17). The chronicle carries filing-vs-box as an open
   contradiction; closure belongs to the noticing duty's item 2, not this lane.
2. **Incident D (b:D11:020) remains unresolved** — held items became ground drops
   on day 11 with no trace row naming it; day 12's close reconciled cleanly
   (b:D12:011) but the day-11 discrepancy itself is filed, not explained.
3. **The density sub-act divergence (days 11–12).** Day 11's played record flags
   527 density sub-acts vs 31 commands; day 12's beat (b:D12:006) carries the
   ~23× over-count caveat. Density rows are not used for any action curve in
   these beats; the divergence itself is unsettled.
4. **The T1-stale floor battery (day 17).** The legacy floor battery reads 13/14
   with weather code live; T1 fails identically on pre-day-17 bytes — the
   battery's expectation aged, not the build. Carried in b:D17:005's observations.
5. **Narration bytes (a lane decision, stated).** Two day-16 narrations were
   initially drafted from the day record's paraphrase; on byte-comparison against
   the trace they were replaced with the trace's exact `say` bytes (b:D16:003
   cycle 184; b:D16:004 cycle 202 — the full say, which the record had quoted
   truncated). All 27 narration-carrying new beats were machine-verified
   byte-equal to a trace `say` row of their day before sealing.
6. **What-length discipline.** The study's `what` cap (≤320 in the sealed store's
   documented deviation) forced the new beats' `what` fields to headline length;
   the detail lives in their observations, which carry the second store classes.
   No fact was dropped to fit — it was moved down one level, where the pairing
   rule wants it.
7. **Day 17's ramp filing is named in b:D17:009 as PREPARED-not-executed.** It
   awaits Casey's named word; this lane did not touch it, the world, or any
   citizen. If it lands, its climb rehearsal 3/3 is day 18's Gate A — a future
   day's beat, not this seal's.

## §8 Stores at close (sha256)

- beats.jsonl: d1b248e285589809bce04c13be65d9db73ffb24f2e6b6b38cb0006f6d06c23e9 (136 rows)
- tension-series.jsonl: e4305e5cfd0b091439dd02ecd7539fb381f00f114c374ec8ba5a98d9a5cdfd07 (17 rows)
- viewings.jsonl: 999c814a49e75885baa8c2142093d3cb354abb3c8090e53e027cf42118cd409e (5 rows, unchanged)
- places.json: 41f14a3a04634fc7e07db107340b5f3bf149dc1caa42c7debb22144102cb563a (19 places)
- dossiers/index.json: c169675dd54c66fba7bb8ee0c52f23b6c4e7589e8c3c00fe3cb056a3d0efeccc (dossier .md files unchanged)

Seal source: `chronicle/seal-11-17.js` (this lane). Booth pre-re-point originals:
`booth/pre-repoint/`. Checker: 34 PASS / 0 FAIL over the extended stores.
