# FURNACE SKILL — COMPILATION RECORD (2026-11-09)

**Asset:** `furnace-sequence.v1.json` (v1.0.0) in `~/craftmind-league/skills/`
**Status:** ADMITTED-WITH-UNPROVEN-TAIL
**Compiled:** 2026-11-09, offline only — no world contact, no driver code changed. The asset is data a day charter may adopt.

The wave-2 study's headline was that the deliberation ledger is a thermometer and the compilation mechanism is a skill library: assets written rarely, reused forever. This is asset #1, compiled from the chain Cody attempted on days 2, 3, 9 and 10 and never landed in ten days.

---

## 1. SOURCES (provenance)

| Source | What it contributed |
|---|---|
| `pulse/direct-drive-trace-day10-20261109.jsonl` — sha256 `ad763427…caad` (303 cycles) | The load-bearing source: both drop-loss episodes with per-cycle positions, the craft-recovery sequence, the movement-tax rates (goto 49/136, climb 0/13, dig 58/83, craft 15/22, place 3/6, felltree 13/33) |
| `pulse/direct-drive-trace-day3-20261109.jsonl` — sha256 `e5f03ff6…ae2f` (237 cycles) | The unnamed craft failure repeated identically 8 times; the silent loop the asset's R5 exists to kill |
| `pulse/direct-drive-trace-day9-20261109.jsonl` — sha256 `7a0b4efd…2049` (28 cycles) | The cherry_planks phantom (cycles 9, 11) and a correctly named stick shortage (cycle 7) — the two failure dialects side by side |
| `pulse/direct-drive-trace-day2-20261109.jsonl` — sha256 `59b3b53b…759` (293 cycles) | Cobble in hand, furnace intended twice (cycles 44, 289), never attempted; the crafting table standing at (64,67,−94) since this day |
| `pulse/DIRECT-DRIVE-DAY10-20261109.md` — sha256 `e272bfdb…a30b` | The close verdict, action curve, and the close .dat inventory parse — the store Cody cannot write, and the asset's ground truth for what he actually held |

Pre-existing library locations were surveyed and rejected as homes: `pulse/library/` is archived S1 run scripts and `lineage-b/library/` is ad-hoc task scripts; neither carries an admission rule or provenance shape. `~/craftmind-league/skills/` was created for compiled assets, with the admission rule in its `README.md`.

## 2. WHAT THE TRACES SHOW (the extraction)

**The plan order was never the problem.** Day 10's record: his plan order was correct from cycle 1 to 303; `fault_owner: harness`. The chain fails at three measured points, and the asset is built from exactly those three:

**(a) Dug ≠ held — the count-from-belief failure (day 10, twice).**
- *Episode 1 (cycles 264–274):* Cody stood **fixed at (89.7, 67, −105.5) for ten straight cycles** and dug a seam at y64 — three blocks below his feet, one to three blocks lateral: dirt at (90,66..64,−104), then stone at (90..92, 64, −104..−106), eight stone digs, every result `ok`. His says counted the digs as inventory ("Two cobble so far… Seven. One more…"). At cycle 274 he declared *"Eight cobble! That's a furnace in the bag"* and walked home. He never descended into the seam row, and no `collect` was issued (the day's only collects are cycles 63 and 301). **The 8 drops stayed in the row.**
- *Episode 2 (cycles 296–302):* At surface stone (71–72, −88) he dug from a stance at y65, then stepped down to y63 — but kept digging *below* his feet: (72,62) from y65, (72,61) and (72,60) from y63. His own words at cycle 300: *"I've stepped down into a little hollow here."* At cycle 301 the state read showed **1 cobble held** against 5 dug; `collect` reported *"gathered drops (visited 0, saw 3)"* — it visited none of the three drops it saw. Cycle 302 dug one more stone into the same hollow.
- *The arithmetic the day-10 record understates:* the record's close counts episode 2 only ("dug five cobblestone… he closed holding 1 cobble"). The trace shows **14 stone blocks dug in the final 40 cycles** (8 in episode 1; 6 in episode 2 — cycles 296, 297, 298, 299, 300, 302) and the close .dat holds **cobblestone ×1**. Thirteen of fourteen drops never entered his inventory. The record's `fault_owner: harness` verdict stands; its count was generous.

**(b) The craft failures speak two dialects, and only one names the cure.**
- *Named:* "missing ingredients — stick — you hold 1 of 2 (short 1)" (day 10 cycle 201; day 9 cycle 7). Actionable as spoken.
- *Phantom:* "missing ingredients — **cherry_planks** — you hold 0 of 3 (short 3)" (day 9 cycles 9, 11; day 10 cycles 281, 283, 284). The resolver keys some recipes to cherry_planks Cody has never held (day 9's table fight is the same anomaly). Chasing the named ingredient is impossible; the observed recovery is to re-craft planks and retry — day 10 cycles 285→286→287 (planks ok → stick ok → pickaxe ok), though the same move failed once at 282→283. Filed in the asset as a heuristic with a hard stop, not a proven rule.
- *Unnamed:* "no craftable recipe for furnace at table" (day 3 cycles 8, 68, 80, 82, 96, 145, 146, 234 — **eight identical retries**). Day 3 held at most 4 cobble (his own say, cycle 81) against the 8 required, and the error never said so. The loop, not the recipe, is the defect: R5/F3 forces a state read and a self-named shortage after the first failure, and forbids a second identical retry without an intervening state change.

**(c) The movement tax.** Day 10 paid it all day (goto 36% arrival, climb 0/13 — the pillar never once worked). Two mitigations are Cody's own, adopted into the asset: short-hop gotos on relief (cycles 275–280: four arrivals in six legs vs 36% overall) and the exclusion of climb from the plan entirely. Pickaxe wear is priced: five pickaxes crafted across day 10 (cycles 45, 190, 203, 257, 287), so the asset holds planks/sticks in reserve rather than spending to zero.

## 3. OFFLINE VALIDATION — REPLAY AGAINST DAY 10, CYCLES 264–303

Method: at each cycle, the asset's rules (R1–R6) are applied to the trace row (command, result, position). A cycle is marked CONFORM (the asset would have done the same), DIVERGE (the asset forbids or replaces the action), or MOOT (the cycle exists only because of an earlier divergence).

| Cycles | What Cody did | Asset ruling | Consequence under the asset |
|---|---|---|---|
| 264–265 | Dug dirt at (90,66..65,−104) from stance (89.7,67,−105.5) | CONFORM — prospecting the adjacent column downward is permitted | — |
| 266 | Dug first stone (90,64,−104), still from y67 | **DIVERGE (R2)** — before opening the seam laterally, step INTO the seam row (goto the seam-floor cell, feet at seam level) | Every later drop in this episode falls at the body's feet instead of 3 below them |
| 267–273 | Dug the seam row at y64 (7 more stone; 8 total), stance never moved | **DIVERGE (R2/R1)** — same root cause; the asset advances cell-to-cell along the row (S8), body passing over drop cells, counting by read-back | The 8 drops are recovered as he works the row (positive arm UNPROVEN — see §4) |
| 274 | Declared "Eight cobble!" and left for home | **DIVERGE (R1)** — dig-ok results increment nothing; the read-back here would have shown ~0–1 held, triggering recovery gotos over the drop cells, not departure | Outcome change #1: episode 1 closes at 8 cobble **held**, not 8 believed |
| 275–280 | Return home by short hops (4 of 6 legs arrived) | CONFORM — this is the asset's own R6 technique, adopted from these rows | — |
| 281 | `craft stick` failed (cherry_planks phantom) | **DIVERGE (S0 + R5/F2)** — S0's assess would have skipped the stick/pickaxe detour entirely (he closed the day holding 5 pickaxes); had the craft run, F2 prices the recovery at ~3 cycles (recraft planks → retry once) | ~4–7 cycles saved; the detour never happens |
| 282–287 | Planks ok → pickaxe FAIL (phantom) → stick FAIL (phantom) → planks ok → stick ok → pickaxe ok | PARTIAL CONFORM at 285–287 — this *is* the F2 recovery pattern, observed here once (and contradicted at 282→283; hence heuristic status) | Evidence for F2 as filed |
| 288–291 | Dug the home shoulder (63,66..63,−91) from a fixed y67 stance; dirt, dirt, dirt, no block | **DIVERGE (R2 + moot)** — under the asset there is no second stone hunt (cobble already held by read-back); the dig also repeats episode 1's forbidden geometry exactly | 4 cycles never spent; no second hollow dug |
| 292–295 | Moved east to the pocket lip; one stale-aim dig failed ("no block at (71,63,−89)") | MOOT under the asset | — |
| 296–297 | Dug stone at (71,63,−88), (72,63,−88); stance descended to y65 | PARTIAL CONFORM — digging at the seam's level as he steps toward it | — |
| 298–300 | Dug (72,62) from y65, then (72,61), (72,60) from y63 — chasing the seam downward | **DIVERGE (R3)** — work one level: stand on the y63 floor row and dig the row at foot level; never dig 2–3 below the feet from a stance | Outcome change #2 (standalone): episode 2's drops fall at his feet on one level instead of into a deepening hollow |
| 301 | `collect` — "visited 0, saw 3"; inventory stayed 1 | **DIVERGE (R4)** — collect is not a recovery verb (0 visits in 2 of 2 day-10 uses); recovery = goto onto the three seen drop cells | The 3 seen drops are stepped on, not surveyed |
| 302 | Dug one more stone (70,62,−88) into the same hollow | **DIVERGE (R3)** — one more drop into the geometry that already ate four | — |
| 303 | Final goto home failed (7.6 short, 2.6 below); window closed | MOOT — under the asset the window does not end here | The day ends ~25 cycles earlier in the chain: at the table, cobble 8/8 by read-back, **craft furnace attempted for the first time ever with full materials** |

### Replay verdict

**YES — the asset saves the drops, in both episodes.** Both losses are pure instances of the two geometries the asset forbids (digging a seam row from a stance above it; chasing a descending seam below the feet), and both recoveries run through the body's feet on the drop cells, the one gathering mechanism day 10 evidences positively (felltree's "gathered drops" as the body moves). Day 10's ending changes from *cobble 1/8 held, furnace never attempted with materials* to *cobble 8/8 held by read-back, with ~25 cycles of window left and the furnace craft attempted*.

**What the replay cannot show:** whether the craft then succeeds. No held trace contains a `craft furnace` attempt with ≥8 cobblestone in inventory (day 3's eight attempts held ≤4). The honest changed ending is therefore "the furnace craft is REACHED with full materials" — the asset changes everything up to the one step no day has ever arrived at. On the admission test (would it have changed the day's outcome?) the asset passes and is **ADMITTED-WITH-UNPROVEN-TAIL** rather than filed NOT YET AN ASSET.

## 4. UNPROVEN STEPS (marked in the asset, named here)

1. **S7/S8 — the seam stance's positive arm.** The negative arm is proven twice (both day-10 episodes lost exactly the drops the stance forbids). No held trace shows a body standing in a seam row gathering its own dig drops. Day 11's first job is to prove or break this.
2. **S10 — `craft furnace` with ≥8 cobble held.** Never attempted in any held trace. Day 3's failures were all at ≤4 cobble and prove nothing about the full-materials case, in either direction.
3. **S11 — `place furnace`, and its read-back.** The place verb is proven for other blocks (day 2 cobble/table; day 10 place 3/6); a placed furnace has never been read back anywhere.
4. **R5/F2 — the phantom-recovery heuristic.** One observed recovery (day 10, 285→287), one contradiction (282→283). Filed as heuristic with a hard stop, deliberately not promoted to rule.
5. **R4's corollary.** `collect` is disproven as a recovery verb as issued (visited 0 in 2/2 uses) — but whether collect behaves differently when issued already standing on the drop cells is untested. The asset routes around it rather than depending on the answer.

## 5. WHAT DAY 11 MUST DO (the second use — a skill is capital only when reused)

1. **Adopt the asset as the day's named plan** for the furnace chain (as data in the charter, not a driver change), with S0's assess first: Cody wakes holding oak_log ×18, birch_log ×10, planks ×8, sticks ×7, pickaxes ×5, cobble ×1 — the asset should skip straight to the stone phase.
2. **Recover before digging.** The day-10 drops are still in the world: 8 in the seam row at (90–92, y64, −104..−106) and 4+ in the hollow at (71–72, −88). S6/S7 make entering the seam the recovery — the read-back after entering is S7/S8's positive-arm test, run on drops that already exist before a single new dig.
3. **Log read-back cobble after the seam phase**, whatever it shows. ≥8 by read-back promotes the stance from hypothesis to evidence; <8 with the stance held breaks it, and the failure files into v1.1 of the asset, not around it.
4. **Attempt S10/S11 for the first time ever with full materials**, and verify from the stores he cannot write: furnace in the parsed .dat after the craft; the placed block in a fresh region read after the place. A day ending at "crafted, not placed" files exactly that — partial credit, never rounded up.
5. **Append the use** to the asset's `uses[]` with the day-11 trace pointer and outcome. Promotion to PROVEN requires this second use to end at a verified placed furnace; any other ending revises the asset, in the open.

---

*Filed 2026-11-09. Sources verified by hash at compile time; the replay was run against trace rows (command, result, position), never against the day record's summary alone — which is how the record's understated drop count (5 of 14) was caught.*
