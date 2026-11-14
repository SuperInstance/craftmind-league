# THE CHRONICLE — THREE ARTEFACTS, ONE ADDRESS SPACE (2026-11-09)

Built per the Claude Code study (a) as adopted by the synthesis addendum:
the chronicle is not one document but three artefacts sharing one address
space, with per-reader dossiers compiled from them. This lane built the
three stores, populated them from the recorded days (pre-series + citizen
days 1–10), compiled two dossiers as proof, and ran the citation
spot-check the study's append discipline demands. Offline throughout; no
world contact; no consumer wiring (no Previously On, no booth, no
Director feed — later build-order steps).

**Reproduce / verify** (on the Thor):
```
cd ~/craftmind-league/chronicle
node build.js     # rebuilds the three stores from the curated source in build.js
node compile.js   # recompiles the dossiers + dossiers/index.json
node check.js     # the citation spot-check -> check-results.json (34 PASS / 0 FAIL)
```
(Node v24.22.2 via the fleet nvm path. `build.js` is the curated source of
the beat/viewing rows — curation is a human act; the sealing, chaining,
compiling and checking are the deterministic parts.)

---

## §1 The address space

One namespace, three stores, IDs that carry their evidence class in their
name (study A.2): `b:` beats, `t:` tension series, `w:` viewings. A
citation that resolves to the wrong store fails the check by construction.

| Store | File | Rows | Writer | Truth condition |
|---|---|---|---|---|
| (i) Beat log | `beats.jsonl` (77,797 B) | 61 | curator (this build) | does the claim resolve to world evidence? |
| (ii) Tension series | `tension-series.jsonl` (11,046 B) | 10 | deterministic process (the tension lane) | is it a correct function of its input at score version tension-1.0.0? |
| (iii) Viewing log | `viewings.jsonl` (4,850 B) | 5 | a human, transcribed | did the watcher say this? |

Shared envelope on every row (study A.2): `seq` (per-store, gapless),
`prev_sha256` (hash chain within the store — verified by check.js),
`written_utc`, `writer {process, version}`, `anchor {citizen_day,
wall_utc}`. Corrections are new rows with `supersedes`; nothing is ever
rewritten. Only the tension series regenerates, and it does so in its own
lane as a new score version — this build **references** the canonical
series (`tension/out/<day>.tsv` + manifest, with `input_sha256`,
`code_sha256`, `row_count` and the recompute command carried on each
chronicle row); it does not copy the rows. A beat of kind `day_shape` may
cite a `t:` row: the summary is chronicle, the series is not.

**Beat fields** (study A.2, with three documented extensions):
`kind` (the study's 11: death | first | scenario_placed |
scenario_response | near_miss | recurrence | floor_act | crew_fault |
thread_open | thread_close | day_shape), `subject`, `place` (stable name
from the crew-side names table, shipped as `places.json`), `what` (plain
text, past tense), `evidence[]` (≥1 of {src, ref, sha} — sha is the
SHA-256 prefix of the cited store file, filled at build time),
`motive_ref`, `fault_owner`, `thread`, `status`, `supersedes`.
Extensions, each forced by a commission term the study predates:
- `narration` — the citizen's own words at the beat, verbatim, kept
  beside the claim (the field manual's pairing discipline: every stored
  beat keeps its narration plus ≥2 independent observations).
- `observations[]` + `observations_gap` — the ≥2 independent observations
  of the same beat (trace + server log + .dat parse + census, never two
  reads of one store); where fewer than two exist, the gap is labelled
  instead of padded. Check.js enforces the rule on all 61 beats.
- `corrects` — names a non-chronicle account a beat corrects (two beats
  carry it: b:D09:008, b:D10:006).
Deviations from the study, stated plainly: (1) the study's `what` cap is
≤200 chars; seven correction-bearing beats could not carry their claim
inside it, so the enforced cap here is ≤320 and the deviation is on the
record rather than silent. (2) `fault_owner` is `null` on beats that
record no fault (the study's enum has no null; a beat about a harvest is
not a fault looking for an owner). (3) Ordinals ("death 121") are
computed by query over the deaths record + traces via `lib/deaths.js`,
never authored — the study's rule, applied where it bites (§4.6).

**Viewing fields** (study A.2): `watcher`, `watched[]`, `condition`,
`exposure {saw_tension, read_beats}`, `landed[]`, `bored[]` (verbatim,
no paraphrase), `elicited`, `duels[]`. There is deliberately no numeric
rating. One entry (w:PRE:001) is a *filed rendering*, not a transcript —
the dated log records Casey's episode verdict in reported speech — and
the row says so in its note rather than passing the words off as a quote.

**Dossiers** are deterministic compiles (no model), each written with
its sha in `dossiers/index.json` alongside the store shas it was
compiled from — the `dossier_sha` half of the study's two-phase Director
pick protocol now exists for future lanes to file blind picks against.

---

## §2 Coverage, per citizen day

| Day | Beats | What the stores support | Gaps |
|---|---|---|---|
| pre-series | 3 (b:PRE:001–003) | deaths 115/116 with verified causes + crew attribution | **deaths 1–114: causes GAP by design** — never recorded by the legacy tracker; b:PRE:001 enters the gap itself rather than reconstructing |
| 1 | 6 | extraction, first table/pickaxe, YES-AND, the starvation negative, the stale-read incident, day_shape | — |
| 2 | 5 | staging, first eating, the furnace thread opens, the pen's half-life, day_shape | the record file itself is contaminated (§4.1) — beats cite its verdict section + the trace only |
| 3 | 10 | memory-guided play, food goal, the collect failure, deaths 117–120, the blind counter, the staging defect, day_shape | — |
| 4 | 7 | counter repaired, the homecoming, 10 floor acts / 0 deaths, plant-cell wheat, the pit, the crown problem, day_shape | — |
| 5 | 5 | zero displacement (446 cycles), honest arrivals, the starvation near-miss, the unfiled failover, day_shape | — |
| 6 | 2 | **crew-side only** — the wake feed's four failures and the record-integrity note | **GAP (played day): the citizen never reached cycle 1; there was no day to chronicle.** Tension: absent (t:D06:absent) |
| 7 | 4 | the provisioning proof (3/3), the feed on the live body, the mis-aimed exit, the fed close | **GAP (played day): the day was its wake (~2 minutes); no working window exists in any store.** Tension: absent (t:D07:absent) |
| 8 | 1 | **instrument-side only** — the +4-wall finding that kept him asleep | **GAP (played day): the citizen was never woken, by design — evidence first.** Tension: absent (t:D08:absent) |
| 9 | 9 | relocation (three stores), first surface tree, cross-lane craft interference, deaths 121–123, the abort's first live proof, the camera correction, the C4 exclusion beat | death 121's cause is UNVERIFIED in every store (b:D09:004) — entered as unknown, not filled in |
| 10 | 9 | scenario placed + refusal-by-inaction, first in-hand harvests, the silent floor, the movement tax, the corrected stone count, the dead guard, day_shape, the post-day census | — |

Viewing log coverage: 5 rows — the episode verdict (2026-11-08), the
entertainment standard (2026-11-09 00:44 AKST), the second screen verdict
(day 9), the first positive verdict (day 10), and one exposure-only row
for the owed human arm (w:ARM:001). Magnus has no rows: he has not yet
watched on the record. `duels[]` is empty in every row — the duelling
instrument has no data yet.

Curator manifests (`~/curator/manifests/`, 316 + 161 rows for
2026-11-08/09) were surveyed and deliberately NOT used as observations:
their judgements are machine-scored with `novelty_note:
jepa-unverified-resident` — an instrument the programme has already
falsified once. Citing them as independent observations would launder an
unverified instrument into the evidence base. The day-3 episode artefact
is cited as exposure (w:ARM:001), not as evidence.

---

## §3 The tension series, as carried — gates labelled

The verdict rides on **every** tension row, in the row itself:
**NOT-PROMOTED — offline instrument, no consumer**
(`tension/TENSION-IMPL-20261109.md`). No reader-facing artefact in this
build presents T as a day's drama measure; dossiers receive the series
only as `day_shape` beats and gate-labelled rows.

- **Day 9 is `t:D09:excluded`** — status `excluded_by_C4`: harness share
  99.1% against a ≤20% bar; its peaks are the crew's own death window.
  The series was computed (722 s) and refused certification. b:D09:009
  carries the exclusion into the beat log so no reader meets day 9
  without it.
- **Days 1–5 carry the hp-artefact gate**, verbatim in substance from
  tension §2: the trace `hp` field on those drivers is not the server's
  health value (fractional thirds; day 2 constant at 0.1333 across all
  295 samples, its constant T = 0.696 a stuck-sensor artefact). Day 2's
  row carries that second label explicitly. (The unresolved cross-store
  disagreement about this field is filed at §4.5.)
- **Terms, on every carried row**: present p_H / p_F / p_E; p_V at
  weight 0; **p_M DROPPED** (no hostiles-with-distance series exists in
  any recorded store); **p_N NULL** (daylight-held days by the study's
  rule; other days ungroundable). Combination stated on the row:
  `T = 1 − (1−p_H)(1−p_F)(1−p_E)` — a three-term noisy-OR.
- **Day 10 carries the blind-spot label**: flat zero for all 5,103 s on
  the Director's first scenario day — the study's B.1 prediction,
  confirmed on the archive; the only separation from dead air is
  `acts_per_min` (3.6/min), which is not the tension score.
- **Days 6, 7, 8 are `t:D0n:absent` rows** — the absence is addressable,
  with its reason, instead of a silent hole.
- Controls state inherited from the tension filing: promotion stopped at
  C0 (not runnable offline) and would stop again at C2 (failed, on day
  3's phase signal) and C8 (failed, AUC 0.561 vs 0.75). Nothing in the
  chronicle re-opens that verdict.

---

## §4 Where the stores contradicted the day records

Found while curating; each is carried in the beat log at the cited id,
and listed here because the parent asked for them in one place.

1. **The day-2 record's tail is not day 2.** A watcher process kept
   appending Cody's live state snapshots to
   `pulse/DIRECT-DRIVE-DAY2-20261108.md` for the rest of the programme:
   its tail (2026-11-09T23:03Z → 2026-11-10T00:03Z) shows **day 10's
   close state** — (70.3, 64, −88.6), wooden_pickaxe ×5, cooked_porkchop
   ×30, oak_log ×18, birch_log ×10 — and mid-file appends carry day-3
   states (hp 4.1 / food 15 at the dip pocket). Anyone reading the file's
   tail as day-2 evidence imports day 10 into day 2. The record's own
   verdict (filed 08:3xZ) is intact; the chronicle's day-2 beats cite
   the verdict section and the day-2 trace, never the tail.
2. **Day 9's camera account is refuted by its own addendum**
   (b:D09:008). §2/§3 of the day-9 record describe a live Survival
   camera and cuts logging through 19:25Z; the urgent-recovery addendum
   in the same file proves the relaunched client was an offline
   **Gallery** session (a third session on the op name), that
   MagnusandMouse never joined after the restart (server-log count 0),
   that zero Magnus-issued commands exist after 19:09:52Z, and that
   Magnus's save never left Spectator (`playerGameType 3`). The
   chronicle treats the addendum as the authority.
3. **Day 10's stone count understates the loss** (b:D10:006, via
   `corrects`). The day record's close counts "dug five cobblestone…
   four drops fell"; the trace shows **14 stone dug in the final 40
   cycles and 13 drops never held** (furnace-skill lane's recount,
   `skills/FURNACE-SKILL-20261109.md`, run against trace rows, never the
   record's summary). The record's fault verdict (harness) stands; only
   its arithmetic was generous.
4. **Day 6's title was written ahead of the day** (b:D06:002). The
   record is titled "OUT OF THE PIT IN THE FIRST MINUTE, FED, THEN THE
   FURNACE"; its own body records no working window, no feed, no exit.
   The places entry installed for day 6 likewise asserts "The crew
   walked you out this way on day 6's waking" — an event that never
   happened, seeded into the citizen's memory file. Read the body, not
   the title.
5. **The hp field: two readings, unresolved.** The tension lane files
   days 1–5 trace `hp` as a mis-scaled apparatus field. The day records'
   own .dat closes read the same fractional values as genuine NBT health
   (Health 0.1333 at days 1–2 close; 0.3333 at day-5 close), and the
   day-5/day-7 records describe a starvation floor of "~1 hp" beside
   recorded values of 0.33 — a /3-scaled field would make 0.3333 exactly
   1.0 hp, which reconciles them (labelled inference, mine, not a
   store's claim). The archive does not decide between "the field is
   wrong" and "the build's health is fractional"; the chronicle carries
   the tension lane's flag verbatim (b:D02:005) and asserts neither
   reading in any beat's `what`.
6. **The deaths record undercounts the world by design.** deaths-record
   holds 120 rows; deaths 121–123 exist only as day-9 trace rows,
   derived by `lib/deaths.js`. A reader of the file alone lands on 120.
   The chronicle's ordinals for 121–123 are computed by query
   (b:D09:004–006), and the file's 120-row shape is named in b:D09:004's
   observations so the trap is visible at the point of use.
7. **Agreement, for the record:** day 3's in-record death causes
   (Phantom / Skeleton / Spider / Spider) match deaths-record rows
   117–120 exactly, timestamps to the millisecond; day 2's close save
   (68.31, 67, −94.97) is day 3's wake state verbatim; day 10's derived
   total (123) matches the day-9 trace arithmetic (120 + 3). The stores
   contradict the records at the points above — not everywhere.

---

## §5 Dossier spot-check — results

`node check.js` → **34 PASS / 0 FAIL** (`check-results.json`). The checks
that matter, in the study's terms:

- **Store integrity**: hash chains + gapless seq verify on all three
  stores; 76 ids unique across the address space.
- **Beat discipline**: all 61 beats cite ≥1 evidence; all 61 keep ≥2
  independent observations or a labelled gap; kinds stay inside the
  study's set; `what` fields stay inside the (documented) 320-char cap.
- **Tension gates**: day 9's row is the C4 exclusion; every row carries
  NOT-PROMOTED; days 1–5 carry the hp-artefact gate; days 6/7/8 absences
  are rows, not holes.
- **Director dossier** (`dossiers/director-days9-10.md`, 8,494 B,
  sha256 `a869726f…b52f`): 24 claim lines, 24 citations, **all resolve
  to store rows, zero unresolved, zero bare claims**; both
  tension-citing lines carry the verdict/gate label.
- **Cold-reader dossier** (`dossiers/cold-reader-day3.md`, 2,749 B,
  sha256 `941b8a13…4ed`): 10 claim lines, all resolve; **no tension
  citations at all** (reader isolation holds). One editorial choice,
  documented: the day-3 `day_shape` beat (b:D03:010) is excluded from
  this dossier — it is apparatus meta-talk, not the day as lived; the
  crew_fault beats stay, because the blind counter is *why* the day
  ends in four deaths, and a cold reader is owed the mechanism.
- Both dossiers were also read by eye after the mechanical check; the
  Director's day-10 section reproduces the refusal beat (b:D10:002) and
  the corrected stone count (b:D10:006) without softening either.

Compiled dossiers:
- `dossiers/director-days9-10.md` — the Director's view: days 9–10 by
  salience, the scenario and furnace threads, the gated series, Casey's
  bored (day 9) and landed (day 10) lines.
- `dossiers/cold-reader-day3.md` — a first-contact reader's day 3, plus
  the one honest line about the episode cut: it does not contain the
  deaths.

---

## §6 What the later steps will need from this

- **The ledger (next build-order step)**: budgets derive from the trace,
  not the calendar — the chronicle gives the ledger its *day index*:
  which days are valid (all except the GAP days 6–8, which had no
  working window and must not enter a "last three valid days" median as
  zeros), and which days were fallback-contaminated (day 3: all 237
  cycles on the governor fallback; day 5: 59 unfiled fallback cycles,
  b:D05:004 — a fallback-brain day must never chart as a cheap day; the
  study's below-floor alarm exists for exactly this). Costs themselves
  are NOT carried here — they live in the ddbridge logs and the day
  records' cost sections; the ledger lane should structure them, citing
  beat ids for the days it prices.
- **Previously On**: reads `status: sealed` beats only, with
  `fault_owner` shown (the study's Narrator row), narration verbatim,
  and `aired` **derived on read** from the viewing log — deliberately
  not stored here. It will need one new reader row in compile.js
  (Narrator) and the day_shape → open-stakes separation kept intact:
  scenario stakes are the Director's declared predicates, never summed
  into T.
- **The booth**: its honest blocker is in the viewing log — `duels[]`
  is empty and the human arm (w:ARM:001) is still owed. Pairwise
  duelling comparisons cannot be compiled from testimony that does not
  exist; the booth build should treat w:ARM:001 as its gating input,
  not as a footnote.
- **The Director**: picks are two-phase from here on — file
  `blind_pick_sha` before reading a dossier, then the informed pick
  with the `dossier_sha` from `dossiers/index.json` and the cited ids.
  That is the only way the chronicle's kill criterion ("changes picks
  or lines") becomes measurable. The salience-consolidation pass owed
  elsewhere should read b:D10:002 and b:D10:009 first: scenario #1's
  answer is already filed.
- **The floor**: nothing required. (For symmetry: the floor's death
  counting and this build agree — both derive from the traces; the
  day-3 counter failure, b:D03:008, is the shared ancestor of both
  designs.)

*Filed 2026-11-09 by the chronicle lane. Stores, compiler, checker and
this filing all live in `~/craftmind-league/chronicle/`. The day records
were read, never edited; the two records a beat corrects are named in
the beats themselves.*
