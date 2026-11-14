# EXTRACTION INVESTIGATION — WHY NOTHING CLIMBS OUT OF A SELF-DUG SHAFT
## Day 12's shaft (stance y63→y58, climb 0/32, pillar places never mounted,
## self-extraction ~c321) anatomised from trace + code; the +4-wall spike and
## triple-020 read against the new geometry; a throwaway-body rehearsal on the
## prov-scratch rig (shaft replica) testing the scripted notch exit.
## Filed 2026-11-10 by the extraction-investigation lane. OFFLINE + replica
## only: Cody was not woken, no citizen save was read or written, the live
## world was never joined. Evidence: pulse/direct-drive-trace-day12-20261110.jsonl,
## pulse/day12/direct-drive-day12.js, pulse/lib/prims.js, ~/pin-scratch/wall-spike/
## WALL-SPIKE-20261109.md, ~/pin-scratch/extraction-results.jsonl (this lane).

## 0. THE ONE-PARAGRAPH ANSWER
Day 12 was not a new failure. It was three old, separately-measured failures
stacked in one hole: (1) the `climb` verb is broken BY CONSTRUCTION — its
placement targets the cell two blocks below the body's feet, inside solid
ground, so it has never succeeded in 124 attempts across eight days; (2) the
`place` verb works but can only build BESIDE the body, and stepping onto what
it builds is the same +1 step the goto machinery performs at most once from a
settled stance; (3) `goto`'s movers declare arrival on 3D distance tolerance
and engage a +1 face only inside a long leg — which is why every altitude gain
of the day came from long legs and dug openings, never from a verb used as
designed. The seam stance then supplied the hole: performed as filed it digs
at the body's own level, and the model chased the seam downward column by
column (his c16 say: "keep cutting down"), converting an open hollow into a
1-wide shaft 5 deep in eight digs. Prevention (a capped, lateral seam) is
cheap and proven in its parts; a scripted deep-shaft exit does NOT compose on
this stack (this lane's rehearsal, §4); the only candidate that could make
deep shafts exitable is a new driver-level step-up compound, unbuilt.

## 1. WHY EACH MECHANISM FAILED IN THE SHAFT (trace + code)

### 1a. CLIMB — 0/32 on day 12, 0/46 days 10–12, 0/124 in every held trace
Every one of day 12's 32 climbs returned the identical detail: "pillar
failed (nothing placed under you)" (32/32; days 10–12: 45 of 46, the 46th
being a no-blocks refusal). Across ALL held traces (days 1,2,3,5,9,10,11,12)
climb was attempted 124 times with zero genuine successes — the single
ok-flagged climb in the corpus (day 5 c263) reported "feet now y=63.0" for a
body already standing at y63.0, a false success filed at the time.

The code (day12 driver, execCmd `climb`, identical in the day-11 copy):
```
below = Vec3(floor(feet.x), floor(feet.y)-1, floor(feet.z))   // the SUPPORT block
jump held 420 ms
bot.placeBlock(bot.blockAt(below), new Vec3(0,-1,0))
```
placeBlock(ref, face) places into ref+face. ref is the block the body stands
ON (feet.y-1); face (0,-1,0) is that block's BOTTOM face, so the target cell
is feet.y-2 — inside the solid ground the support block rests on, in every
geometry where the body stands on anything. The server refuses; `placed`
stays false; gained stays 0. The jump timing is therefore moot: the verb
would fail standing still on flat grass. The correct tower form (ref =
support, face (0,+1,0), placed while airborne into the vacated feet cell)
was independently tried by the wall-spike's micro-place proof with lookAt
added and 12 jump timings swept: 12/12 refused — mid-jump, placeBlock
resolves its reference through the client block model to a cell off the
body's column (WALL-SPIKE-20261109 §2A). CONCLUSION: climb has never worked
under ANY geometry on this stack, in either its shipped form (face-sign
defect, deterministic) or its corrected form (reference-resolution defect,
measured). It is not a verb; it is a 420 ms pause with a jump. R6 of the
furnace asset already prices it as non-existent; the trace now shows why.

### 1b. PILLAR / PLACE-UP — 22 places, 11 ok, and never under him
Day-12 place anatomy (all cobblestone): the 11 successes placed into
NEIGHBOUR columns at or below his feet level — (72,59,-88), (71,60,-88) x3,
(71,58,-88), (72,59,-88), (70,59,-88), (71,59,-88), (71,62,-88),
(71,60,-87), and the final (71,63,-86) at c319. The 11 failures: 7x "cell
already holds ..." (re-placing into cells his own earlier places or the
wall itself occupied — the verb has no memory of its own builds) and 4x
"nothing solid touches cell" (targets in columns he had dug out). Three
structural facts: (i) place cannot target the body's own column usefully —
the feet cell is body-occupied and its neighbours are the shaft walls; every
success built a stack BESIDE him (post-day census: cobble at (71,58,-88),
(71,62,-88), (72,59,-88), (71,63,-86) — his own stone, re-placed into the
pocket walls, >=11 of the 15 he dug). (ii) Mounting the beside-stack is a
goto +1 step (see 1c): at c164-166 he stacked (71,62,-88), stepped to y60
transiently twice, and slid back to y59 both times. (iii) The place verb's
one load-bearing success of the day was not a pillar at all: c319 placed a
cobble into the dug cell (71,63,-86) at his own level, making a TREAD whose
top (y64) was the last rung of the exit (see 1d).

### 1c. GOTO — the mover that both lied and, rarely, lifted
Shaft phase (c20-321): goto 103 issued, 19 ok — and several "ok" were
tolerance artefacts at unchanged altitude (c20 "arrived" at y59.2 for target
(72,61,-89); c21 ditto y59 for (72,60,-89)): gotoNear (prims.js) returns ok
when 3D distance <= range+0.6, and a target 1-2 above at <1 horizontal sits
inside that ball. The walk-only pathfinder config (travelMovements:
canDig=false, allow1by1towers=false) cannot route up a wall by construction;
the manual helm fallback engages a +1 face only with approach momentum
inside a longer leg. Measured day-12 altitude gains, all of them goto-family:
c80 +1 (transient), c164 +1 (transient), c239/c257/c263/c273 +1.0-1.2 each
with slide-backs, c278 +1.2 and c279 +1.0 (kept), c312 +1 (kept), c320 +3.3
(the exit, inside a felltree's walk-to). Net: ~7 kept +1 gains in ~302
cycles, every one from a LONG leg aimed past the face, none from a short hop
aimed at the step itself. This is triple-020's world at body scale: the
validator/helm family treats dense +1 faces as scenery unless momentum and
distance conspire.

### 1d. THE NOTCH THAT WORKED (~c321) — the exact verb sequence
There was no single notch; there was a compound, and its parts are separable
in the trace (cycles 277-320, stance (72.6,62,-87.3) -> open ground
(71.3,66.3,-82.3)):
1. c282 dig (71,62,-87) ok; c284 dig (71,63,-87) ok — a two-high opening cut
   in the west wall AT FOOT AND HEAD LEVEL (he had already gained y59->62
   over c273-280 by repeated long-leg gotos (68,63,-87), ~+1 per attempt).
2. c297 dig (73,63,-87) ok; c298 dig (73,64,-87) ok — the same two-high cut
   in the east wall; c299-300 gotos step into the opened columns (ok at same
   y — the openings converted walls into floor at his level).
3. c307 dig (71,62,-86) ok; c316 dig (71,63,-86) ok — the cut repeated in
   the north wall; c312 goto (68,62,-86) gained the +1 to y63 THROUGH the
   opened ground (goto reported fail; the displacement was real).
4. c319 place cobblestone (71,63,-86) ok — one block placed INTO the dug
   cell at his feet level: a tread with top y64 in the exit column.
5. c320 felltree (71,67,-76) — the verb's internal walk-to toward a far
   target carried him north over the tread and the rising ground beyond;
   server position at cycle end (71.3,66.3,-82.3): OUT. His c321 say:
   "Out of the slot at last — I'm on open ground at y65 now."
SYSTEMATISABLE FORM ("cut-and-climb"): at each level, dig the foot+head
cells of the exit column (leaving or placing a +1 tread), then take a LONG
leg aimed well past the face — never a short hop at the step — and verify
altitude from position, repeating per level. Its cost unscripted was ~280
cycles because none of it was deliberate: the digs, the tread and the final
mover were improvised across 40+ cycles of failed climbs between gains.

## 2. THE SEAM STANCE'S OWN TRAP, AND THE LATERAL VARIANT (priced)
What S7/S8 as FILED say: stand in the seam, dig the row LATERALLY at one
level, never dig 2+ below the feet (R3). What day 12 PERFORMED (c12-19):
dig the stone cell in the NEXT column at descending levels — (71,62,-89),
(71,61,-89), (71,60,-89), (71,59,-89), (71,58,-89), (72,58,-89) — stepping
into each column as it opened and dropping with it, stance y63->y58 in eight
digs, count 1->8 read back after each. The drops landed at his feet (R2
satisfied; zero lost — the asset's positive arm) precisely BECAUSE he
descended with the seam (R3 violated in spirit: he never dug 2+ below his
feet; he dug 1 below, stepped down, and repeated). The trap is geometric,
not verbal: a seam in a sloping hollow floor descends; following it at foot
level IS descending; and a 1-wide column dug at foot level in a full-height
wall is a shaft the moment it is 2+ below the surrounding grade.
THE LATERAL VARIANT (the filed S8, enforced): record the ENTRY level at S6
(day 12: y63 at the seam top, hollow floor); dig only cells whose top is at
entry level or entry-1, moving ALONG the row (the hollow pocket's stone
floor spans x69-73 at tops y59-63 per the scenario-#2 census — a lateral row
exists); when the row at that level is exhausted, STOP or re-enter at a new
point — never step down into a dug column. In the open hollow this creates
no 1-wide vertical column at all: the dig is a floor trench in open relief,
and the exit is the entry walk reversed.
PRICE (from day-12 rates): the descent reached count 8 in ~14 cycles
(c5-c19, dig ok 9/13 at the surface). The lateral row costs ~1 dig per
cobble (ok ~70% surface rate) + one short advance goto per 1-2 cells —
estimate 16-22 cycles to count 8, a premium of roughly +2-8 cycles, and it
keeps all 15-cobble upside (extraction-phase digs took him to 15 anyway).
Against the measured cost of the trap (~302 cycles c20-321, the furnace
craft, and the homecoming), the premium is not a trade-off; it is the
cheapest line in the day. The enforcement gap is the finding: R3 exists as
advice to the model; nothing in the driver refuses a dig below the seam's
entry level. The same driver already enforces the pit guard as code.

## 3. THE +4-WALL SPIKE AND TRIPLE-020, READ AGAINST THE SHAFT
The spike (day 8 + wall-spike, replica of the home pit, pad +4) proved:
hopFlee 0/2 and gotoNear 0/2 on the correctly-aimed long target; a
body-built stair climbs exactly ONE rung (8/8 step 1, 0/~10 step 2 — the
second goto resolves ok:true with fm 0 and identical end coordinates); a
dug tread is never entered from the pit floor; operator-placed (setblock)
ramps are never climbed; jump-place pillar cannot place its first block.
Triple-020 proved the carrier is surface relief geometry itself (FLATTEN
8/8; every material/biome/light arm left the veto standing). Day 12 is the
same physics from inside a SELF-DUG geometry: the shaft's walls are +1
faces in all directions at maximum density, the body its own relief author.
Two spike results did NOT transfer, and the difference is instructive: (i)
the dug tread WAS entered on day 12 (c299-300, c308) — from a stance at the
tread's own level inside an opened notch, not from a floor 4 below it;
(ii) +1 steps DID chain, slowly — because day 12's gains came from long
legs with momentum through WIDE pre-dug openings, where the spike's stair
used single treads and centre aims. The spike's law survives in narrowed
form: ONE +1 step from a settled stance engages; consecutive rung-steps
from the rung itself do not (confirmed again by this lane, section 4).

## 4. REHEARSAL — SCRIPTED CUT-AND-CLIMB ON THE SHAFT REPLICA (this lane)
Rig: prov-scratch (Paper 26.1.2-74, port 25875 — the day-7/8 rig), replica
built by RCON fills: plateau solid stone top y65; shaft 2x2 at x71-72,
z-89..-88 carved to floor top y57 (stand y58 — day 12's depth); exit
through full-height columns. Throwaway body ExtractBot only; server-side
Pos read after every level; scripts ~/pin-scratch/extraction-rehearsal*.js,
evidence ~/pin-scratch/extraction-results.jsonl. Arms:
- A (dig foot+head cells, gotoNear onto the step centre, range 1.1): 0/3 —
  the goto declared ok at 1.33 blocks 3D distance, body unrisen, z unmoved
  into the step column. The tolerance artefact, at step scale.
- A3 (same cut, prims.walkTo direct): 0/2 — same tolerance arrival (1.34).
- A2 (same cut, LONG leg: gotoNear aimed 4.5 past the step at the new
  level, range 1.6): level 1 GAINED 3/3 (58->59, end on the step column,
  fm 780-788 — the leg burns its budget against the NEXT full column, as
  day 12's did); level 2 GAINED 0/3 — digs ok, body never leaves the
  rung's edge stance (server z identical to 3 decimals across runs).
- A4 (WIDE cut: foot+head cells in the step column AND the column beyond,
  long leg): level 1 GAINED 2/2 (travelling 2 columns into the opening);
  level 2 GAINED 0/2 — same rung-stance stall.
REHEARSAL VERDICT: a scripted consecutive-rung exit does NOT compose on
this stack — 5/5 first-rung gains from a chamber floor, 0/5 second-rung
gains from the rung, across narrow and wide cuts, reproducing the
wall-spike's one-rung law in the shaft geometry. Day 12's organic exit
succeeded because its gains were never consecutive rung-steps from a
settled stance: they were separated by geometry changes (new openings, a
placed tread, a different final mover). A plan rule can exploit the
one-rung form (shallow descents only); it cannot promise a deep exit.
Cleanup: scratch server stopped; ExtractBot's scratch identity removed
(usercache grep 0; players/data .dat removed); no other body touched.

## 5. CANDIDATE FIXES, RANKED BY EVIDENCE (no live-driver change in this lane)
(a-refined) EXIT-FIRST + LEVEL CAP, as a skill rule ENFORCED by a driver
dig-guard. Before the first seam dig: record the entry level; cut the exit
notch at entry level (foot+head cells in the return wall — the c282/284
form) BEFORE descending at all; cap the descent at 2 levels below entry
(the one-rung form, 5/5 in rehearsal + 8/8 placed-rung in the wall-spike,
exits a <=2 descent via notch + long leg); dig the seam LATERALLY at the
capped level. The guard is the pit-guard pattern the same driver already
runs: refuse (with a filed trace row and a truthful result line) any seam
dig whose target is below entry-2, or any dig that would step the body
into a column >2 below entry. PROOF BURDEN: one live day — count closes,
max depth <= entry-2 in the trace, exit unassisted, furnace craft reached.
Every component is individually proven; the composition is the day-13 test.
(c) GOTO-TARGET DISCIPLINE (long legs past the face, never short hops at a
step; altitude verified from position, never from ok). Necessary in every
exit that has ever worked (day 12 gains; rehearsal A2 level 1) and already
half-filed in the driver's scene text — but ALONE it is not a fix: day 12
issued 103 shaft gotos for ~7 kept gains and ~280 cycles. Adopt as the
exit-leg rule inside (a-refined); do not charter it as the answer.
(d) A NEW VERB: a control-state STEP-UP compound (charter-level driver
change). Face the step at close range, hold forward+jump under direct
control states (no goal, no distance tolerance), verify altitude from
position each 300 ms, stop at +1 or after a bounded burn; repeat per rung.
This is the only candidate that could make ARBITRARY self-dug shafts
exitable, because it removes the two measured killers (goal-tolerance
arrival; pathfinder walk-only routing) from the step itself. It must NOT
be a jump-place pillar (refuted twice, section 1a). PROOF BURDEN (before
any citizen day): prov-scratch battery — consecutive rungs 3/3 and a full
5-deep shaft exit 3/3 with server-side position verification, plus a
no-op safety proof on open ground. Until it passes, it is a spike, not a
day plan.
(b) PLACE-CLIMB / PILLAR with held blocks: REFUTED in both forms (shipped:
face-sign defect, 124 attempts; corrected: wall-spike micro-place). Place
retains exactly one proven extraction use — the single TREAD (day-12 c319;
wall-spike rung 1) — already inside (a-refined)"'s notch. Do not re-charter
pillaring in any form.
(a-unrefined) NOTCH DISCIPLINE ALONE as a full-shaft exit (dig the notch
first, descend freely, climb out notch by notch): REFUTED as a deep exit by
section 4 (0/5 past rung 1) and by day 12's own ~280-cycle improvisation.
Its notch survives only inside the capped form above.

## 6. RECOMMENDATION FOR DAY 13 (one, named)
Adopt (a-refined): the EXIT-FIRST + LEVEL-CAP rule — filed as a DRAFT
amendment to the furnace asset alongside this investigation
(skills/furnace-sequence-EXTRACTION-AMENDMENT-20261109.md) — with the
driver dig-guard as its enforcement, chartered as a harness change in the
day-13 charter (not smuggled into the day). Day 13 re-runs the furnace at
the hollow: lateral seam at entry level, descent capped at 2, notch cut
first, exit by notch + long leg, S10/S11 finally reached with the count.
In parallel (not as a day-13 dependency): commission the (d) step-up spike
on the prov-scratch rig under its stated proof burden. fault_owner for the
extraction problem as a whole: harness (verbs + enforcement), with the
model's seam-chasing as a contributing prompt-level factor the guard now
makes moot.
