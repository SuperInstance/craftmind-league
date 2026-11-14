# DIRECT-DRIVE DAY 17 — NO LAUNCH: THE EXIT GATE HELD (2026-11-10)

Charter: `pulse/DAY17-CHARTER-20261109.md` (16,105 B, md5 `a4c80833...`),
ledger claim line 357. **Day 17 did not launch.** The charter's SS3 gate —
the exit rehearsed 3/3 on a throwaway body before any citizen launch —
was run in full and NO mechanism passed. Per the charter's SS9 fork, this
record files the rehearsal verdict and the lane PREPARES (does not
execute) the operator-placed ramp window filing
(`pulse/day17/RAMP-WINDOW-FILING-20261109.md`) for the parent to take to
Casey as a named act. **Cody was never woken. Deaths delta: 0 (136 ->
136). Furnace: NO — seventh day the tail is unattempted; both stores
unchanged (post-day `.dat` sha `13702eb7...` = wake sha; fresh census
region md5 `85711ca6...` reads zero furnace palette entries in the home
chunks; his table stands at (64,67,-94)).**

Action curve: **zero cycles, zero acts** — by the gate's design. The
curve this record leads with is the rehearsal curve (SS2).

---

## SS1. WAKE FACTS, RE-VERIFIED AT THE GATE (2026-11-10T11:36:02Z)

Feed-snapshot of Cody's save (the floor's producer, read-only):
Pos (62.559, 62, -90.692), hp 20, food 20, inventory exactly
{cooked_porkchop: 27}, `.dat` sha256 `13702eb7...` — byte-identical to
day 16's close. Deaths baseline 136 derived: `deriveDeaths` over the
rebuilt record + all 15 day traces = 135 rows + the day-15 provisioning
seam (#136). Vega's save sha `4b65ff2e...` and Geist's `8ecbd230...`
byte-identical in the live directory sweep. At this record's close
(14:23Z) the posture is verified untouched: original `cameraman.py`
pid 2209183 running on the Orin, no STOP file, Cody offline in the bowl.

## SS2. THE REHEARSAL CURVE (the day's real work)

Rig: prov-scratch Paper 26.1.2-74 (Thor `~/pin-scratch/prov-scratch`,
:25875), throwaway body BowlBot, the fleet prims the citizen driver
itself uses (`gotoNear`, `digBlock`, `placeAgainst`). Replica: the bowl
rebuilt from the fresh census (SS3) and VERIFIED CELL-BY-CELL from an
independent store before any arm ran — 24-cell table, probe =
`execute if blocks` type-equality against reference cells observed
through a marker cell (`data get block` returns NBT only for block
entities on this build; the probe was validated against known cells
before use, and its one systematic blind spot — a dirt cell matches a
grass_block reference under masked comparison — was found and fixed by
probing grass_block FIRST). Every arm run began only after a
`build-verified: 0 mismatches` row. Replica conservatisms: two census
cells whose live type is dirt where the replica's layered build puts
stone — (61,65,-91), (64,66,-91) — modelled as STONE (harder bare-handed;
the rehearsal is the conservative case).

RESULTS (success = server-side Pos feet >= 67; evidence
`~/pin-scratch/bowl-rehearsal-day17.js` (rehearsal 1, INVALID replica —
overlapping fills rebuilt the pocket solid; its 0/3s are artefacts and
are filed as such) and `~/pin-scratch/bowl-rehearsal2-day17.js` +
`bowl-rehearsal2-ABC-evidence.jsonl` + the D-series result files):

- **Arm A — place-ladder north: 0/3.** Rung 1 gained 3/3 (dig the wall's
  foot cell (61,62,-90), place the dug block, step on: server feet 63).
  Rung 2 refused 3/3: the next place reports the target already holding
  stone — the rung-1 block stands in the only cell the beside-form can
  reach, and the face above it is the wall's own stone. The
  place-ladder composes exactly one rung in this geometry: the wall-
  spike's one-rung law, reproduced in the bowl.
- **Arm B — notch-cut ladder east, pickaxe equipped: 0/3.** Level 1:
  two of four digs landed; the goto never gained (server feet stayed
  62, x pinned at 61.5-61.69 in all three runs). The A2 form's wide
  column did not open a step the walker would take.
- **Arm C — place-at-feet south (the day-16 live form): 0/3.** The
  first place refused 3/3: "nothing solid touches cell (61,62,-92)" —
  the passage column's neighbours at that level are air; there is no
  face to place against. The day-16 form needs a wall the bowl's south
  side does not have.
- **Arm D — ascending notch-stair east: 0/3, in two scripted forms.**
  Form 1 (as first scripted) dug the tread cell itself away — a code
  defect against its own filed comment, caught by the pre-dig
  diagnostics (cells foot/head/tread all stone, digs [true,true], no
  gain, body advanced 0.19 blocks). Form 2 (corrected to the comment's
  geometry: leave tread (col, col-1) standing, dig (col, col) foot
  space + (col, col+1) head space, long leg to (col+0.5, col)): the
  SAME outcome 3/3 — digs [true,true], goto refused the step, body
  advanced 0.19 blocks to x=61.688 and stopped. The corrected form's
  failure is therefore not the code defect: with foot and head space
  verifiably open and a one-step rise in front of it, the walker still
  does not take the step east. This is the extraction investigation's
  rung-2 result (0/5) reproduced a third way: **the movement stack
  grants exactly one step from a stance, and no scripted composition
  of digs and gotos chains a second one inside a pocket.**

**Verdict: no scripted exit from the bowl exists on this stack.** Four
mechanisms, twelve-plus runs, one proven atom (the single placed/dug
step — the same atom day 13's escape used, once, at the surface). The
gate did what days 15 and 16 skipped: it cost the programme an
afternoon of scratch-rig time instead of a citizen day.

## SS3. THE BOWL, CORRECTED (fresh census 2026-11-10T11:35Z; `director/census-d17-20261109/`, region md5 `85711ca6...`, entities md5 `75bdd73d...`; probe `probe_census.py`)

The day-16 charter read the floor's top as y60 at the wake cell. The
fresh census: the pocket floor CELL is (61,60,-91) stone with air
y61-64 above it under dirt 65-66 and a grass cap at 67; Cody's stance
straddles that cell and the entry-step column (62,-91) (stone top 61,
air 62-63, GRASS blocks inside the column at y64 and y66). North wall
(61,-90): stone 63, dirt 65-66, grass 67 — a +3 diggable face from the
step stance (63/64/65), not the +4/+5 the day-16 charter priced from
the pocket floor. West (60,-91) stone to 64. South (61,-92) stone top
61 (the passage). Canopy leaves cap the pocket at y72-74 (the gloom is
structural). A zombie stood IN THE POCKET at (66.6, 62, -90.3), 4.6
blocks east of the wake point, in the entities copy — had the day
launched, the Gate B live sweep (charter SS7.6) was written to catch
exactly this. Scenario #3's cobblestone still stands at (65,66,-88);
the hollow's count ground (his day-12 seam country) tops are filed in
the census probe output for the day the count resumes.

## SS4. THE GUARDS' ACCOUNTS (offline; no live day to read)

- **Relative below-grade guard** (driver `pulse/day17/direct-drive-day17.js`,
  md5 `59f8ddb5...`; day-16 bytes untouched): bound re-based on the
  verified wake state (feet 62 / wake top 61). Tool-less and below the
  pad: descent below CURRENT feet refused (`goto-below-feet`,
  `dig-at-or-below-feet`); ascent to every intermediate level
  permitted. At/above the pad, day-16's absolute form unchanged.
  Fixture `pulse/day17/test-below-grade-day17.js`: **38 PASS / 0 FAIL**
  (day-16 groups A-E carried; new group F resident-at-62; group G
  pad-resident regression pins). Disposition: fixture-proven, NOT
  live-proven — the day that would have proven it did not launch; the
  guard ships with day 18's driver copy whenever the bowl question is
  settled.
- **Dig-guard**: its account is owed a fourth day and remains owed —
  structural reason unchanged (its arming path runs through the
  pickaxe gate; no pickaxe was ever in hand). Not rounded up.
- Batteries vs the shipped day-17 bytes, filed in `pulse/day17/`:
  safety-reflex 40/0, walker-fence 18/0, dig-guard 28/0.
  `safety-check.js` byte-identical (`d60f062b...`), `gate-client.js`
  byte-identical (`6b891704...`).

## SS5. WEATHER — DECIDED AND BUILT (charter SS6, decision (b))

The floor now holds weather beside daylight: constitution act
`ASSERT_WEATHER` (pre-change bytes kept as `*.pre-day17-20261109`), an
optional `weather` contract term, and `weatherCheck` in `floor.js` —
the daylight pattern exactly (re-assert every 240 s, issuer-specific
landing verification, 64 KiB look-behind, own high-water mark, 3
attempts). ONE DEVIATION, named in the charter before the day: failure
NOTIFYs `WEATHER_HOLD_LOST` and does NOT park — the floor's park list
is closed and weather is not survival. Fixture
`floor/test-weather-day17.js`: **7 PASS / 0 FAIL** (filed at
`floor/weather-fixture-output.txt`), after the stub op channel gained
its `/weather` branch and the fixture's sensor trace was pointed at a
real file (its first run's 5 failures were the unpatched stub + a
nonexistent sensor path's parks — fixture defects, both fixed and
re-proven). Legacy floor battery with the weather code live: 13/14 —
T1 (deaths derivation) fails IDENTICALLY against the pre-day-17 floor
bytes: it is pinned to the day-11-era archive (expects 123; the
archive now derives 135+seam). Stale test, not a regression; filed so
the battery's state is read, not assumed. The hold has never run live
(no launch); it is contract-ready in `floor/run/day17/contract-day17.json`.

## SS6. INCIDENTS (headed, lane-owned first)

- **R1 (rig, recovered x5): the replica build's grass caps.** A
  grass_block set by an area fill reverts to dirt when a later fill
  covers its cell (leaf litter at y68, inside the build's own clear
  volume) — six verification aborts across the rehearsal's launches,
  each caught by the cell-by-cell verify doing its job, each fixed by
  forcing the caps per-cell after all fills (and, in the end, the
  probe-order fix for the dirt-matches-grass blind spot). The verify
  gate never let an unverified replica run an arm. Cost: most of the
  rehearsal's wall-clock.
- **R2 (lane): the scratch server died with rehearsal 2's first
  completion** (the script RCON-stops it) and two relaunches collided
  with its session lock / a still-running instance; resolved by
  single-instance discipline (check `ss -ltn :25875` before booting).
- **R3 (harness, the relay's TWELFTH death):** at this charter's Gate B
  precheck both VM supervisors were dead; the relaunch briefly ran
  duplicate supervisors bind-fighting over :8911 before settling to
  exactly one pair (supervisors 5963/5965, relay 5967). RELAY-OK PASS
  verified end-to-end FROM THOR — at the precheck. (No launch followed
  to re-verify at.) The floor-repair filing's systemd claim remains
  untrue on the serving box; the setsid pattern remains the fact.
- **R4 (lane, cosmetic):** two battery outputs' header strings still
  read "DAY16" (walker-fence, dig-guard) — the counts are against the
  day-17 bytes; the strings are the test files' own titles, unedited
  to keep the batteries byte-comparable to day 16's.

## SS7. BUDGET

Citizen brain calls: 0 (no launch). Lane cost: the rehearsal rig's
wall-clock (~3.5 h elapsed across the replica-verify iterations) and
this lane's tokens; no governor-metered citizen spend. The day-17
contract's budget (337.96 wc ceiling class) is unspent in full.

## SS8. WHAT DAY 18 INHERITS

1. The fork, prepared: `pulse/day17/RAMP-WINDOW-FILING-20261109.md` —
   the operator-placed ramp (five stone_bricks blocks up the bowl's
   east face, cells named from the census, pre-reads + dual read-back
   plan in the day-9 precedent's shape). It needs Casey's named word;
   nothing in it is executed by this lane.
2. If the ramp lands: the day-17 driver (relative guard, weather-hold
   contract, hand-over line) is launch-ready as filed; the exit
   becomes the ramp's five one-steps (the one atom the stack has
   always granted), and the day's order is unchanged from charter SS8.
3. If it does not: Cody sleeps in the bowl, fed, at 136 deaths, and
   the bowl question returns to the parent as a design problem (a
   step-up compound verb — the extraction investigation's candidate
   (3), charter-level, still unbuilt — is the only remaining
   scripted route the evidence leaves open).


---

## ADDENDUM (2026-11-10T14:40Z, same lane): arm E — the rehearsal's last honest question

After this record was filed, the lane read its own rehearsal script's
header note once more and found the notch-stair described there in a
form subtly different from both arm D forms: from the stance in column
(62,-91) at feet F, dig (63,F,-91) + (63,F+1,-91) in the east wall
column — the SAME two cells arm D's corrected form dug, relative to the
column — leaving the floor cell (63,F-1) standing, then the long leg
east. **Arm E** implemented exactly that (digs (col,F),(col,F+1),
goto (col+3.5, F+1), pickaxe in hand): **0/3.** Pre-dig diagnostics
confirm foot/head/floor all stone at (63,62/63/61); digs [true,true];
the body advanced the same 0.19 blocks to x=61.688 and stopped, 3/3.

The three east-face forms (D1, D2, E) differ in scripted detail and
agree in outcome, and B's north form agrees with them: with foot and
head space verifiably open and a one-step rise in front of it, the
walker does not take the step into the wall it just cut. The verdict in
SS2 stands, strengthened: it is not a scripting detail. Evidence:
`~/pin-scratch/day17-evidence/rehearsal2-E-results.jsonl`
(REHEARSAL2-COMPLETE, results E:[false,false,false]).
