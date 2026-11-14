# Litter Lab — the leaf-litter tax, measured as a scored A/B experiment

## Problem (measured by earlier crews, 2026-11-07)

`leaf_litter` is collision-free in prismarine-data (`shapes: []`,
`boundingBox: "empty"` in all 16 states) but collides on this Paper build
(26.1.2, Orin) at fractional pile heights — perches measured at stand
+0.12 / +0.42 / +0.9, varying per cell. mineflayer's physics and A* both
treat a litter cell as air, so the pathfinder plans walk-throughs the
server refuses: the follow loop face-stops, churns in
`path_reset reason: stuck`, and the citizens crawl at ~0.1–0.26 blocks/s
in dense litter even with the declared stall-breaker mitigations.
Evidence trails: `~/craftmind-league/repair-cody/`, and the dated
2026-11-07 substrate addenda in `lineage-b/README.md` and
`lineage-c/README.md`.

Litter block facts (registry): id 1115, diggable, hardness 0, states =
`facing` × `segment_amount` (1–4). The survey below tests whether pile
height is a function of `segment_amount`.

## Pre-registration (written BEFORE any scored run, 2026-11-07)

### Arms

**Arm A — status quo (Lineage C substrate, verbatim).** A frozen copy of
Lineage C's travel stack as deployed on 2026-11-07:

- Movements: `new Movements(bot)` with `canDig = true`,
  `allow1by1towers = false`, `maxDropDown = 10`, no exclusions
  (`allowParkour` / `allowSprinting` at library defaults, both true).
- Driver: `gotoPos` copied verbatim from `lineage-c/executors.js` —
  hops of ≤6 blocks, per-hop `gotoWatched` with a 12 s no-movement
  watchdog (25 s intermediate / 45 s final hop budgets), break after
  2 stalls, and the declared stall-breaker `unstickToward` (back-off →
  run-up jump → dig face blocks incl. litter → run-up jump) fired when
  a hop ends without ≥0.8 blocks of progress.
- Note on the commissioning brief's wording: it calls arm A "walk-only".
  Lineage C's movements in fact run `canDig = true` since the 2026-11-07
  substrate repair (the walk-only era is what the repair replaced);
  "walk-only" survives only as `allow1by1towers = false`. Arm A here is
  the stack as it actually stands tonight — that is the status quo a
  candidate must beat.

**Arm B — candidate (litter-aware Movements config).** Same driver
skeleton (`gotoWatched` verbatim, same hop chain, same watchdog, same
budgets) with exactly two changes:

1. Movements come from the lab's factory `makeLitterMovements(bot)`
   (design frozen in the amendment below, after the survey).
2. The manual stall-breaker is REMOVED. When a hop ends without
   ≥0.8 blocks of progress the driver counts one **replan** and simply
   re-issues the hop (fresh A* against current world state). If the
   candidate config needs a human-style face-dig ritual to move, it
   has failed at its job; the watchdog still bounds every hop, and the
   2-stall break still terminates a wedged run as a failure.

The candidate must be a Movements CONFIGURATION the lineages could
adopt (factory + cost/flag tweaks on stock mineflayer-pathfinder),
not a new pathfinder.

Design hypothesis (to be confirmed/tuned against the survey before the
freeze): in `movements.js`, `getBlock` marks a cell `safe` when its
boundingBox is `empty`; a `safe` feet cell is never a break candidate,
so A* prices a litter crossing at plain move cost 1 and plans a
walk-through. Adding leaf_litter's type to `movements.blocksToAvoid`
flips `safe` to false for litter cells, which routes them through
`safeOrBreak`: with `canDig = true` and litter diggable at hardness 0,
A* can then plan **dig-through moves** (move cost + dig labour
≈ 1 + (1 + 3·digTime/1000)·digCost) — the stall-breaker's manual dig,
but planned up front instead of discovered after a 12 s stall.
A mild `exclusionAreasStep` cost on litter (if the freeze adopts one)
prices a preference for clean cells when a short detour exists,
without the cost-100 wall that zeroed Lineage C's bowl trial (every
local route there crosses litter; a forbidden cell is a no-route).

### Course

One fixed ~40-block traverse through dense litter terrain near spawn,
start/end coordinates frozen in a dated amendment to this README after
the survey and BEFORE the first scored run. Selection constraints:
≥12 blocks (horizontal) from Cody's ground (~46, 65, -83) and anchor
(24, 67, -111), Vega's canopy (29, 75, -104), her target (46, 70, -101)
and anchor (63, 67, -72), Geist's ground (~5, 64, -85) and anchor
(-16, 56, -78); ≥30 blocks from world spawn (spawn-protection=16 plus
scatter). The citizens are LIVE and attempting the exam — no probe
runs through their work areas, and citizen positions are re-checked
from their state feeds before the freeze.

### Run protocol

- N = 5 scored runs per arm, order **A B B A A B B A A B** (ABBA —
  alternation that also balances the course-mutation trend, since
  arm A's stall-breaker and arm B's dig-through plans both remove
  litter cells as they pass; litter cells dug are recorded per run
  as a covariate).
- One probe bot (fresh name `LitterLab<digits>`, replaced under a new
  fresh name if it dies). Scored leg = course start → course end,
  driven as a single arm-driver call, budget **300 s**
  (the citizens' 90 s figure is a per-action budget; 40 blocks at the
  measured 0.1–0.26 blocks/s needs more — same budget both arms).
- **Completed** = the driver's own arrival test: horizontal distance
  to course end ≤ range + 0.6 with range = 1 (i.e. ≤1.6 blocks) and
  |Δy| ≤ 2.5, inside the budget.
- Return legs (end → start) are unscored, driven with the arm that
  just ran, budget 300 s. If a return leg fails, the next scored run
  starts from wherever the bot stands ONLY if it is within 3 blocks
  of course start; otherwise the positioning is completed unscored
  with arm A's driver before the run clock starts.
- A run in which the bot dies is **incomplete**, cause class recorded
  (world / infrastructure / agent). If deaths exceed 2 across the
  experiment, scored running pauses and the protocol is revisited in
  an amendment (night-mob exposure is the expected cause).
- In-game time-of-day is recorded at each run start. No server
  restarts, no time commands — the lab takes the world as it finds it.
- Metrics per run: completed Y/N, wall time (s), stall-breaker
  firings (arm A) / replans (arm B), final displacement (horizontal
  distance start→end, blocks) and final distance-to-goal, litter
  cells dug (block-change count of leaf_litter within the course
  bounding box during the run), time-of-day at start.

### Adoption rule (binding, from the commission)

Adopt the candidate ONLY if it beats arm A on **completion rate AND
median wall time** (median over each arm's 5 runs; a run that does
not complete counts its full 300 s budget as its wall time for the
median). Adoption = patch the Movements configuration in the
`lineage-b/` and `lineage-c/` substrates to the lab factory's
configuration, with dated addenda in both lineage READMEs declaring
the change and these numbers, plus a dated note in `pulse/README.md`
for the Pulse's prims (pulse code itself is NOT edited — its crew is
mid-run). Substrate file changes take effect on each citizen's next
natural relaunch; if a citizen has not relaunched, adoption is
reported as "lands on next relaunch" for that citizen.
If B loses or ties on either leg: keep the status quo, publish the
numbers here, and say so plainly.

### Survey (step 1 of the commission, runs before the course freeze)

A fresh-named probe bot samples ≥20 litter cells in the spawn forest.
Per cell: coordinates, floor block, litter `segment_amount` (from the
live block state), **perch height** (bot stands on the cell; perch =
bot y − floor top y), and a **pass/hold test** (from clean ground one
cell away, hold `forward` toward the cell for 2.5 s, no jump:
crossed / perched-on-top / face-stopped, with displacement). The full
sample table is published in an amendment below, and the course +
candidate parameters are frozen in the same amendment.

---

## Amendment 1 — survey results, course freeze, candidate freeze (2026-11-07, BEFORE any scored run)

### Survey as run

20 cells measured (`results/survey.jsonl`; 108 records total, the other
88 being `unreachable-for-test` approach failures, kept as evidence).
Getting the sample took eight probe launches. Field lessons, for the
record: (1) in dense litter the approach cell is usually litter too —
the survey prepares its stand by digging the *approach* cell's litter
(never the test cell's; the test cell is re-verified before the test);
(2) an approachability pre-filter (a same-level stand must exist) is
the difference between sampling and burning minutes per cell — a
one-step-below approach was considered and rejected, because the bot
then faces the test cell's *floor block*, not its litter; (3) the
spawn forest is a mob kill zone tonight — the Orin server log shows
probe after probe `slain by Drowned` / `slain by Zombie` ~30 s apart
at respawn — so after any death the probe commutes west before
resuming. Pass/hold and step-on tests are raw control-state
manoeuvres, exactly as pre-registered.

### Sample table (perch = bot y − floor top y while on the cell)

| cell | floor | seg | pass/hold (2.5 s, no jump) | disp (blocks) | perch | step-on (run-up jump) |
|---|---|---|---|---|---|---|
| 5, 68, -98 | grass | 3 | face-stopped | 10.79 | — | no-land |
| 8, 68, -107 | grass | 3 | crossed | 4.39 | — | n/a |
| 10, 68, -116 | grass | 1 | face-stopped | 0 | — | cleared-with-jump |
| 8, 68, -101 | grass | 3 | face-stopped | 11.01 | — | no-land |
| 25, 68, -84 | grass | 3 | face-stopped | 1.06 | — | no-land |
| 20, 69, -91 | grass | 3 | face-stopped | 0 | — | cleared-with-jump |
| 19, 64, -75 | grass | 1 | face-stopped | 0 | — | no-land |
| 21, 64, -75 | grass | 3 | crossed | 4.59 | — | n/a |
| 24, 64, -74 | grass | 1 | face-stopped | 0 | — | cleared-with-jump |
| 29, 65, -73 | grass | 2 | face-stopped | 0 | 1.0 | landed (perch 1.0) |
| 31, 65, -71 | grass | 3 | face-stopped | 0 | — | no-land |
| 35, 65, -72 | grass | 3 | face-stopped | 0.42 | — | no-land |
| 35, 64, -69 | grass | 2 | face-stopped | 0.06 | — | cleared-with-jump |
| 34, 64, -69 | grass | 3 | face-stopped | 0.1 | — | no-land |
| 36, 64, -66 | grass | 4 | face-stopped | 1.94 | — | cleared-with-jump |
| 38, 65, -72 | grass | 4 | face-stopped | 0 | — | no-land |
| 43, 67, -70 | grass | 1 | face-stopped | 2.39 | — | no-land |
| 44, 67, -66 | grass | 2 | crossed | 10.79 | — | n/a |
| 51, 67, -66 | grass | 1 | face-stopped | 0 | — | cleared-with-jump |
| 22, 69, -91 | grass | 2 | crossed | 4.56 | — | n/a |

### What the survey establishes

- **Pass/hold: 16 face-stopped / 4 crossed / 0 perched.** By
  segment_amount — seg 1: 5 stopped / 0 crossed; seg 2: 2 / 2;
  seg 3: 7 / 2; seg 4: 2 / 0. There is **no segment_amount gradient**:
  even a single-layer pile (seg 1) stops a walking bot 5 times out of
  5. At walking speed the litter tax is ~binary, not graded by pile
  size.
- **Perch height could not be resolved by segment_amount from this
  sample** — only 1 of 20 cells yielded a perch (seg 2 → 1.0, via the
  step-on landing). The 4 crossings registered **no in-cell lift**
  (>0.04) while crossing: bots cross at pile gaps/edges where the
  collision is effectively absent, not by mounting the pile. The
  earlier crews' perches (+0.12 / +0.42 / +0.9) stand as the height
  evidence; this survey's contribution is the pass result above.
- **Deflection:** two face-stops slid laterally at full walking speed
  (disp 10.79 and 11.01 with ~zero progress toward the cell) — a
  face-stop against a wide litter patch deflects the bot sideways,
  which is one mechanism by which citizens drift off-line.
- **Step-on:** of the 16 face-stopped cells, a run-up jump cleared 6,
  landed on the pile once, and failed to land 9 times — jump mobility
  exists but is unreliable as a crossing strategy.
- Sampling caveat: cells were measured where a same-level approach
  exists (88 attempts were geometrically unreachable), so the sample
  skews toward locally flat, open micro-terrain. If anything that
  flatters passability.

### Candidate freeze

`LITTER_STEP_COST = 0`. With no segment_amount gradient to price, a
state-aware step cost buys nothing the survey can measure; the
candidate is `makeLitterMovements(bot)` exactly as coded in
`movements.js`: status-quo Movements + `leaf_litter` in
`blocksToAvoid` (dig-through planning), step cost 0, stall-breaker
removed in favour of replans.

### Course freeze

Scanned 2026-11-07 with a fresh probe (`results/scan.log`), two
candidate segments; the chosen line is segment A **reversed** (its
ground-verified end becomes the start):

- **Start: (2.5, 68, -111.5)** — column top grass_block, stand y 68.
- **End: (-31.5, 61, -93.5)** — column top sand, stand y 61 (a beach
  slope; no water in the corridor).
- Length 38.5 blocks; litter cells within ±3 of the line: **83**;
  ground profile descends 68 → 61 with a grass plateau at 66–68 and a
  canopied stretch (ground ~67–68) in the second half.
- Citizen re-check at freeze time (live state feeds): Cody
  (38.7, 66, -93.8), Vega (66.7, 67, -76.6), Geist (25.3, 68, -85.7)
  — nearest course point ≥34 blocks from every citizen, ≥30 from
  world spawn (32, -96). Frozen in `course.json`. The scored
  direction descends; return legs climb, unscored, as pre-registered.

---

## Amendment 2 — scored results and verdict (2026-11-07)

### Results (`results/runs.jsonl`, order A B B A A B B A A B as pre-registered)

| run | arm | completed | wall (s) | stall-breakers / replans | displacement (blocks) | dist-to-goal | litter dug |
|---|---|---|---|---|---|---|---|
| 1 | A | no | 124.7 | 7 | 7.89 | 32.02 | 2 |
| 2 | B | no | 61.2 | 2 | 5.17 | 32.48 | 4 |
| 3 | B | no | 37.6 | 2 | 4.87 | 32.52 | 0 |
| 4 | A | no | 110.2 | 4 | 6.67 | 31.13 | 2 |
| 5 | A | no | 158.6 | 5 | 10.21 | 27.84 | 3 |
| 6 | B | no | 38.5 | 2 | 7.05 | 30.24 | 1 |
| 7 | B | no | 39.0 | 2 | 5.61 | 30.39 | 0 |
| 8 | A | no | 103.8 | 3 | 8.41 | 27.93 | 0 |
| 9 | A | no | 131.5 | 4 | 11.62 | 27.94 | 0 |
| 10 | B | no | 26.0 | 2 | 4.85 | 34.79 | 0 |

Zero deaths across the experiment. The corridor litter census fell
319 → 306 over the ten runs (12 cells dug by scored legs; return legs
account for the rest). No run reached the 300 s budget: every run
ended by the driver's own 2-stall abandonment, arm A after 104–159 s,
arm B after 26–61 s.

### Verdict (under the binding adoption rule)

- Completion rate: **A 0/5, B 0/5 — tie.**
- Median wall time (incomplete runs count the full 300 s budget, per
  the pre-registration): **A 300 s, B 300 s — tie.**

**The candidate is NOT adopted. The status quo stays.** No substrate
files in `lineage-b/` or `lineage-c/` were changed, and no note was
added to `pulse/README.md`: there is nothing to adopt. This is a
clean negative, published as measured.

### What the numbers actually say

Neither stack can traverse this course at all. Both arms die in the
same opening band, 5–12 blocks in — the litter-topped stepped rise
west of the start plateau (the same "+2 step topped with leaf
litter" freeze geometry the Pulse Gate 0 A/B identified the same
night). The arms fail *differently*, and the difference is the
finding:

- **Arm A grinds.** Median raw wall 124.7 s, 23 stall-breaker firings
  across 5 runs, median displacement 8.41 blocks (best 11.62). Its
  entire advantage is the declared stall-breaker ritual — a recovery
  behaviour in the *driver*, not a property of its Movements.
- **Arm B gives up.** Median raw wall 38.5 s, exactly 2 replans in
  every run (the 2-stall break fires immediately), median
  displacement 5.17 blocks. Its dig-through planning did engage —
  litter was dug in 3 of 5 runs, including the single largest dig
  count of the experiment (4, run 2) — but at the step faces the
  follow loop still wedges, and with the stall-breaker removed there
  is no recovery ritual, so each attempt ends at the first hard face.

So the candidate's mechanism never got to express itself: on this
terrain the binding constraint is not A*'s price for litter cells.
It is (a) the follow loop's inability to execute climb/dig moves at
litter-topped steps, and (b) a driver that abandons the attempt
after 2 stalls. Combined with the survey (a walking bot is stopped
by even a single-layer pile, 16/20, with no segment_amount
gradient), the litter tax is best understood as a **step tax where
litter sits on the step** — and the one component measured to help
against it tonight is the stall-breaker, which the candidate design
removed.

The obvious successor experiment — arm B's dig-through Movements
*with* the stall-breaker retained, and a stall budget that lets
dig-through plans compound before abandonment — is visible in this
data but was **not** the pre-registered candidate, and is not
adopted or run under this protocol. It is recorded here as the
recommended next A/B, for whoever commissions it.

### Lab logistics notes (not part of the scored result)

The first A/B launch aborted at positioning: a single 300 s gotoPos
from a deep-canopy spawn cannot descend. `run-ab.js` was repaired
before any scored run (canopy-aware ground finder + ≤15-block hop
commute, the pattern the course scan proved) — positioning then took
under a minute. No scored run was affected.

---

---

## Amendment 3 — successor A/B: dig-through Movements WITH the stall-breaker, and a stall budget that lets dig plans compound (pre-registered 2026-11-07, BEFORE any scored run of this experiment)

Amendment 2's verdict was a tie (0/5 vs 0/5) that isolated a confound
in the candidate's design: arm B removed the stall-breaker along with
the walk-only Movements, so it tested {dig-through planning AND no
recovery} against {walk planning AND recovery}. B's mechanism engaged
(litter dug in 3 of 5 runs, including the experiment's largest dig
count) but every B run died at the first hard face, because with the
stall-breaker gone there was no recovery ritual at all. Both arms died
in the same opening band — the litter-topped stepped rise west of the
start plateau — and Amendment 2's analysis names the binding
constraints there as (a) follow-loop execution at litter-topped steps
and (b) a driver that abandons the attempt after 2 stalls. This
successor isolates exactly that confound: it keeps arm B's Movements,
restores the stall-breaker, and enlarges the stall budget so
dig-through plans get the recovery cycles they need to compound.

### Arms

**Arm A2 — status quo, unchanged.** Configuration-identical to arm A
of the first A/B, for comparability: `makeStatusQuoMovements(bot)`
(canDig = true, allow1by1towers = false, maxDropDown = 10, no
exclusions) and the lab driver's mode "A" with stall budget 2 — the
Lineage C gotoPos behaviour as deployed, including the declared
stall-breaker `unstickToward` fired when a hop ends without >=0.8
blocks of progress, and abandonment after 2 consecutive stalls.

**Arm B2 — candidate.** `makeLitterMovements(bot)` exactly as frozen
in Amendment 1 (status-quo Movements + `leaf_litter` in
`blocksToAvoid`, `LITTER_STEP_COST = 0` — dig-through planning), with
the stall-breaker RESTORED (the driver's no-progress branch fires
`unstickToward`, exactly as in arm A2) and an enlarged stall budget:

**STALL_BUDGET_B2 = 8 consecutive stalls** (pre-registered here,
before any scored run; not tuned mid-run).

Why 8: arm A's first-A/B runs recorded 3–7 stall-breaker firings per
run, spread over repeated wedge → partial-progress cycles — recovery
does compound when the driver lets it, and the 2-consecutive-stall
break is what truncates it. Eight consecutive no-progress iterations
give each wedge episode up to ~2 minutes of recovery work (one
<=12 s watchdog expiry plus one unstick ritual per iteration, the
ritual digging up to 4 face cells) plus A*'s dig-through replans —
enough for the stall-breaker's face-digs and the planned dig-throughs
together to chew through a littered step band several cells deep,
while still abandoning well inside the 300 s run budget at a truly
impassable face. It is also strictly more persistence than any arm A
run ever exhibited (its maximum was 7 firings, non-consecutive).
Budgets far above 8 would mostly re-label deadline failures: at
>=12 s per wedged iteration the 300 s deadline, not the budget,
becomes the binding constraint.

### Driver change (the only one)

`driver.js` gotoPos gains `opts.stallBudget` (default 2) used at both
stall-abandonment sites, and a mode "B2" whose no-progress branch
takes the stall-breaker path (identical to mode "A"). Mode "B" is
retained untouched, so the first A/B remains reproducible as run.
With no `stallBudget` passed, behaviour is byte-for-byte the first
A/B's. Everything else — hop size <=6, watchdogs (12 s no-movement;
25 s intermediate / 45 s final hop budgets), the 40-hop cap, the
>=0.8-block progress test, the arrival test — is unchanged and shared
by both arms.

### Course and citizen clearance

Same frozen course as Amendment 1 (`course.json`, unmodified):
start (2.5, 68, -111.5) → end (-31.5, 61, -93.5), scored direction
descending, return legs unscored. Citizen positions re-checked from
the live state feeds at the writing of this amendment (2026-11-07
~09:34 UTC), horizontal distance to the nearest point of the course
segment: Cody (36.7, 64, -95.3) — 37.8 blocks; Vega (63.3, 67, -73.5)
— 71.7 blocks; Geist (25.3, 68, -85.7) — 34.4 blocks. All >=30
blocks clear; positions are re-verified from the feeds immediately
before the launch and any change is recorded in Amendment 4.

### Run protocol

Identical to the first A/B unless stated here:

- N = 5 scored runs per arm, order **A2 B2 B2 A2 A2 B2 B2 A2 A2 B2**
  (the same ABBA alternation, relabelled), one fresh-named probe bot
  (`LitterRun<digits>`, replaced under a new fresh name if it dies).
- Scored leg = course start → course end as a single driver call,
  budget **300 s**; arm configuration (Movements + mode + stall
  budget) set per the arm for both the scored leg and its unscored
  return leg. Positioning and descent use the status-quo stack,
  unscored, exactly as `run-ab.js` did.
- **Completed** = the driver's arrival test: horizontal distance to
  course end <=1.6 blocks and |dy| <=2.5, inside the budget, probe
  alive.
- A run in which the probe dies is **incomplete**, cause class
  recorded (world / infrastructure / agent). If deaths exceed 2
  across the experiment, scored running pauses and the protocol is
  revisited in an amendment. Zero deaths is the target; a run
  configuration that starts killing probes is aborted and reported.
- Metrics per run (recorded in `results/runs2.jsonl`): completed Y/N,
  wall time (s), stall-breaker firings, replans, final displacement,
  final distance-to-goal, litter cells dug (corridor census diff),
  time-of-day at start, died Y/N, stall budget of the arm.

### Adoption rule (binding, from the commission)

Adopt B2's configuration ONLY if B2 beats A2 on **completion rate
AND median wall time** (median over each arm's 5 runs; a run that
does not complete counts its full 300 s budget as its wall time for
the median). On adoption:

- The **Movements change** is patched into the `lineage-b/` and
  `lineage-c/` substrates identically, to the lab factory's
  configuration: canDig = true, allow1by1towers = false,
  maxDropDown = 10, `leaf_litter` added to `blocksToAvoid`,
  `LITTER_STEP_COST` 0 (no litter step exclusion). For Lineage B this
  also removes the cost-100 `exclusionAreasStep` litter exclusion in
  `vega.js` — the two substrates' travel Movements become identical,
  which is the point of patching identically. The patch lands in
  `lineage-c/geist.js` (travel Movements block) and
  `lineage-b/vega.js` (spawn Movements block), each with a dated
  addendum in its lineage README declaring the change and these
  numbers. Substrate changes take effect on each citizen's next
  natural relaunch; if a citizen has not relaunched, adoption is
  reported as "lands on next relaunch" for that citizen.
- The **stall budget** is driver-side, and it lives in different
  places per lineage — stated here so adoption applies it where it
  actually lives: in Lineage C it is the `++stalls >= 2` threshold at
  the two abandonment sites in `lineage-c/executors.js` gotoPos,
  which becomes `>= 8`; Lineage B has no stall counter — its
  abandonment is the 3-attempt loop bound in `lineage-b/helpers.js`
  goto (unstickToward already fires between attempts there), which
  becomes 8 attempts, with the honest caveat recorded that B's
  callers' per-skill timeout (90 s default) remains an outer bound
  C does not have in the same form.
- A dated note is appended to `pulse/README.md` (pulse code itself
  is NOT edited).

On loss or tie on either leg: the status quo stays, the numbers are
published here, and nothing in any substrate is touched.

---

## Amendment 4 — interim record: run 1 death, post-death recovery failure, harness repair, resumption (2026-11-07, written BEFORE any further scored run)

### What happened

- **Run 1 (A2) is recorded and stands**: incomplete, died. The probe
  started the leg at timeOfDay 16253 (deep night) and was **shot by
  Skeleton** at 09:39:30 UTC (Orin server log). Cause class: **world**
  — night-mob exposure, the cause the pre-registration names. An
  unarmoured probe grinding stationary in the opening band at night
  is exposed under either arm; this is not a run-configuration
  effect.
- Run 1's displacement (27.33), distGoal (62.96) and litterDug (22)
  are **respawn artefacts, not course measurements**: the end
  position was read at the respawn perch (30.31, 75.71, -105.51) and
  the post-death corridor census was taken from there. They are
  excluded from interpretation; the run counts only as
  incomplete / died.
- **Post-death recovery then failed (class: infrastructure).** The
  respawn left the probe on a canopy perch at y~75 near spawn.
  `descendToGround`'s four goto attempts could not step it down
  through the leaves, and `positionToStart`'s commute targets the
  bot's own y, so from a perch its arrival test (|y − start y| <= 3)
  can never be satisfied — the same canopy disease both citizen
  lineages' substrates were repaired for on 2026-11-07, present in
  the lab harness's recovery path. The runner aborted before run 2.
  Deaths so far: 1 (protocol pause threshold is >2).

### Repair (unscored positioning only — the scored protocol is unchanged)

`descendToGround` in `run-ab2.js` gains a dig-down descent for leaf
perches: when the block beneath the probe is leaves, dig the leaf
block beneath, drop one level, repeat (<=20 levels) until standing
on grass/dirt/stone — the canopy-descent pattern Lineage B and
Lineage C both verified on 2026-11-07 — before falling back to the
existing goto-based descent. Positioning and descent still use the
status-quo stack for both arms, exactly as pre-registered; the
repair is in the recovery path only and cannot favour an arm. This
mirrors the first A/B's precedent of repairing `run-ab.js`
positioning in the open and recording it (Amendment 2, logistics).

### Resumption

The ABBA sequence resumes at **run 2** under a fresh probe name
(`LITTER_START_RUN=2`); run 1's record stands as drawn, and run
numbers in `results/runs2.jsonl` remain the ABBA indices. If deaths
exceed 2 across the experiment, scored running pauses per the
pre-registration and the protocol is revisited here.

---

## Amendment 5 — interim record: resumption abort at the commute wedge, sidestep repair (2026-11-07, written BEFORE any further scored run)

The Amendment 4 resumption (probe `LitterRun4144`) aborted before
run 2, with no death: the probe spawned on the ground at
(41.5, 69, -105.5) — spawn scatter puts each fresh probe at a
different start — gained 4.2 blocks on its first commute hop, then
wedged deterministically at (37.31, 69, -105.8), 35.3 blocks from
course start. Four further hop iterations and the final direct
attempt re-issued the identical gotoPos from the identical spot and
gained nothing: a face the status-quo positioning driver's
stall-breaker cannot clear from a standstill in this geometry, where
re-issuing is not a retry but a repetition. Class: **infrastructure**
(harness logistics), the same family as Amendment 4's recovery
failure. No scored run was affected; deaths remain 1.

Repair (positioning only, arm-neutral, status-quo stack retained):
`positionToStart` now detects a wedge — a commute hop that gains
<1 block — and takes one lateral **sidestep** (rawDrive perpendicular
to the commute direction with a run-up jump, alternating sides)
before retrying, with hop iterations raised 5 → 8 to give the
sidesteps room. A lateral offset changes the face geometry, which is
the one thing a re-issue cannot do (the survey's deflection finding
is the same physics, suffered instead of used). The scored protocol,
the arm configurations, and the status-quo positioning driver and
Movements are otherwise exactly as pre-registered. The sequence
resumes at run 2 under a fresh probe name.
---

## Amendment 6 — interim record: the citizen-clearance gate (2026-11-07, written BEFORE any further scored run)

The commission's precondition for this experiment — citizen
positions verified >=30 blocks clear of the course before running —
held at the freeze (Amendment 1) and at Amendment 3's writing
(Cody 37.8, Vega 71.7, Geist 34.4). It does **not** hold now: at the
post-Amendment-5 re-check the citizens had all drifted west —
Cody (26.7, 68.5, -110.1) 24.2 blocks clear, Vega (13.8, 68, -92.3)
22.3, Geist (20.7, 69, -93.3) 25.7. Recorded for whoever reads this
next: the gate is only intermittently satisfiable by design, because
two citizens are structurally inside it at home — Cody's anchor
(24, 67, -111) is 21.5 blocks from the course start and Geist's
anchor (7, 67, -85) is ~25.5 from the segment. The original course
constraints (>=12 blocks from anchors and work areas, Amendment 1)
are still met and the corridor census is unchanged (306 at run 1),
but the >=30 position gate is a citizen-chance window, not a
property of the course.

Operationalisation: a watcher (`watch-launch.py`, lab logistics)
polls the three state feeds every 60 s (feed mtime must be <150 s —
no launch on stale data) and launches the staged resumption
(fresh probe name, `LITTER_START_RUN=2`) in the first minute all
three clearances read >=30, or stands down after 90 minutes and
logs that the window never opened. Every check is logged to
`results/watch.log`. If the window never opens, runs 2–10 remain
unrun and the gate — not the arms — is the blocker, to be resolved
by the commission, not by the lab quietly relaxing it.
---

## Amendment 7 — interim record: dig-down descent verified, commute iteration cap raised (2026-11-07, written BEFORE any further scored run)

The clearance window opened at 11:17 UTC (Cody 56.7, Vega 72.9,
Geist 32.2) and the watcher launched probe `LitterRun5038`. Two
findings, one of each sign:

- **The Amendment 4 repair works.** The probe spawned in the canopy
  at (26.5, 82, -88.5); the dig-down descent fired and put it on the
  ground at (25.48, 69, -87.50) — the recovery that failed all night
  for `LitterRun3391` now works in the field.
- **The commute then died of its iteration cap, not a wedge.** With
  sidesteps firing as designed (twice), the commute progressed
  33.2 → 26.6 → 19.5 → 16.8 → 13.8 blocks and was still gaining when
  the 8-iteration loop exhausted; the final direct attempt failed
  and the runner aborted. No scored run; no death. Cumulative
  tonight: the status-quo commute is a spawn-geometry lottery
  (1 clean commute in 4 spawns) whose failures are abandonment and
  caps, not impassable terrain.

Repair (positioning only, same stack, arm-neutral): commute hop
iterations 8 → 16 in `positionToStart`. The watcher is re-armed for
the next clearance window (launch log `results/ab2d.log`); the
sequence still resumes at run 2. Approach digging by commute
stall-breakers is inside the census box's east edge only; each run's
`litterBefore` is measured fresh before its leg and reported, and
the scored terrain west of the start plateau is untouched by
commutes.
---

## Amendment 8 — interim record: delivery configuration for spawn-to-start commutes (2026-11-07, written BEFORE any further scored run)

Probe `LitterRun7580` (ground spawn (41.5, 69, -91.5), 43.8 blocks
out) aborted at the same wall: after two hops it wedged at
(35.30, 66, -98.70) and sixteen iterations of hops and alternating
sidesteps gained nothing further — a face the status-quo stack
cannot pass from the north-east at all. The delivery record tonight
is now 1 success in 5 attempts, and the failures have converged:
they are not lotteries anymore, they are the litter tax itself,
suffered by the harness over commutes (33–44 blocks) longer than
the course (38.5). The status-quo driver's 2-stall abandonment,
which the scored arms test on the course, makes it unfit as the
lab's delivery truck through the same forest. That is a logistics
finding about the harness, recorded as such; it is not scored
evidence about the arms.

**Delivery configuration (logistics only).** Any positioning leg
longer than 10 blocks — the initial spawn-to-start delivery and
post-death recovery commutes — now uses the lab factory's travel
stack: `makeLitterMovements(bot)` (dig-through planning) with the
stall-breaker and stall budget 8 (driver mode "B2"), sidesteps
retained. It is one fixed configuration, identical for every run
and both arms, and it is never used on a scored leg. Scored legs,
return legs (arm that just ran), short repositioning (<=10 blocks,
status-quo stack), the course, the budgets and the metrics are
exactly as pre-registered in Amendment 3. Rationale, stated plainly
because this deviates from Amendment 3's "positioning uses the
status-quo stack": delivery is not the thing under test, a delivery
that fails 4 times in 5 measures nothing but itself, and the
citizens' own substrates — the stacks that actually live in this
forest — are all dig-enabled with recovery rituals; the delivery
config is drawn from the lab's own factory for the same reason.
If the delivery configuration also fails, the experiment is blocked
by logistics and will be reported as such, not tuned further.

---

## Amendment 9 — scored results and verdict (2026-11-07)

### Results (`results/runs2.jsonl`, order A2 B2 B2 A2 A2 B2 B2 A2 A2 B2 as pre-registered)

| run | arm | completed | wall (s) | stall-breakers | displacement | dist-to-goal | litter dug | died |
|---|---|---|---|---|---|---|---|---|
| 1 | A2 | no | 80.8 | 3 | artefact* | artefact* | artefact* | **yes** |
| 2 | B2 | no | 302.4 | 17 | 15.69 | 24.84 | 2 | no |
| 3 | B2 | no | 142.0 | 8 | 6.41 | 31.09 | 0 | no |
| 4 | A2 | no | 45.1 | 2 | 6.39 | 31.10 | 0 | no |
| 5 | A2 | no | 45.6 | 2 | 6.46 | 31.19 | 0 | no |
| 6 | B2 | no | 138.3 | 8 | 8.30 | 31.35 | 0 | no |
| 7 | B2 | no | 150.0 | 8 | 6.48 | 31.19 | 0 | no |
| 8 | A2 | no | 45.1 | 2 | 6.59 | 31.12 | 0 | no |
| 9 | A2 | no | 46.1 | 2 | 6.50 | 31.20 | 0 | no |
| 10 | B2 | no | 139.7 | 8 | 6.73 | 31.10 | 0 | no |

\* Run 1's displacement / dist-to-goal / litter-dug are respawn
artefacts (Amendment 4): the probe was shot by Skeleton at night
(class: **world**) and the end readings were taken at the respawn
perch. It counts as incomplete / died and nothing else. It is the
experiment's only death. Corridor census (`litterBefore`): 306 at
run 1, 283 at run 2, then 279 for runs 3–10 — the drop is delivery
and approach traffic in the census box's east edge (Amendments
7–8); the scored corridor was identical for the last eight runs.

### Verdict (under the binding adoption rule, Amendment 3)

- Completion rate: **A2 0/5, B2 0/5 — tie.**
- Median wall time (incomplete runs count the full 300 s budget):
  **A2 300 s, B2 300 s — tie.**

**B2 is NOT adopted. The status quo stays.** No files in
`lineage-b/` or `lineage-c/` were changed and no note was added to
`pulse/README.md`: there is nothing to adopt. Failure class of the
verdict: **agent** (substrate) — see below. This is a clean
negative, published as measured, and it closes the confound
Amendment 2 left open.

### What the numbers actually say

- **Persistence is not penetration.** Restoring the stall-breaker
  and quadrupling the stall budget changed everything about how B2
  fails and nothing about where: median raw wall 142.0 s vs A2's
  45.6 s, stall-breaker firings 49 vs 11 (median 8 vs 2 per run),
  for median displacement 6.73 vs 6.48 blocks and median
  dist-to-goal 31.10 vs 31.16. The extra budget converts entirely
  into time and recovery rituals at the same face.
- **The face is singular and exact.** Runs 3–10 — both arms, every
  start perch the harness produced — all end at
  (-4.6 ± 0.2, 67, -109.31), ~6.5 blocks into the course: the first
  +2 litter-topped step of the rise, the Gate 0 geometry. Eight
  consecutive attempts, two configurations, one result. Combined
  with the first A/B, the binding constraint is confirmed as
  follow-loop execution at litter-topped +2 steps: A* pricing
  (Amendment 2) does not move it, and driver persistence (this
  amendment) does not move it.
- **Run 2 is the exception that locates the remaining variance.**
  From a start perch ~2.5 blocks north-east and one block higher
  than the others, B2 rode the full 300 s budget (the only run in
  either A/B to do so), fired the stall-breaker 17 times, and
  reached dist-to-goal 24.84 — the deepest penetration of the night
  by ~6 blocks. Approach geometry moved the outcome more than the
  arm configuration did; a different line past the face exists, and
  neither driver's search finds it from the standard perch.
- **The missing capability is a move primitive, not a setting.**
  The stall-breaker digs the face at feet/head height; the blocking
  litter sits on the UPPER step, outside its dig pattern, and
  dig-through planning prices cells the follow loop still cannot
  climb onto. Recorded successor candidates for a future
  commission (not run, not adopted): a stall-breaker variant that
  digs the upper step's litter before the run-up, or a place-block
  step-up at +2 faces. Both are new machinery, outside a Movements
  configuration or a budget — which is where this experiment's
  result says the problem lives.

### Logistics findings (unscored, recorded for the next crew)

- **Delivery was the night's real experiment.** Getting a probe
  from spawn scatter to the course start defeated the status-quo
  stack in 4 of 5 attempts (canopy perch, two deterministic face
  wedges, one iteration-cap exhaustion — Amendments 4, 5, 7). The
  Amendment 8 delivery configuration (factory Movements +
  stall-breaker + budget 8, delivery legs only) succeeded on its
  first attempt, exiting a canopy perch and passing the
  (16, 66, -98) face that had stopped three commutes. One attempt
  is a logistics result, not scored evidence for the arm — the
  task (a 32-block commute) is not the course — but any future lab
  work in this forest should deliver probes this way.
- **Correction to Amendment 7:** the dig-down descent's role in
  `LitterRun5038`'s recovery was overstated there. Re-reading that
  log, `digDownDescent` fired but did not complete; the following
  goto-based descent attempt put the probe on the ground. Dig-down
  stays in the harness (it can only help where digs take effect —
  several perches sit inside spawn protection, where they do not),
  but its verified contribution tonight is nil.
- **The citizen-clearance gate is structural, not incidental**
  (Amendment 6): it took ~75 minutes of watching for the first
  window (Geist's collect trip east), and it will gate any future
  course work the same way.
