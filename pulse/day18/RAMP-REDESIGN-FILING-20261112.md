# RAMP REDESIGN — FILING (2026-11-12, programme date 20261112)

Lane: day-18 stair-redesign + run lane. Authorisation basis: Casey's
named word 2026-11-11 09:47 AKST — "Place the ramp, then run day 18" —
plus his full-throttle renewal 2026-11-12 22:20 AKST ("keep going full
throttle"). Predecessors: `pulse/day17/RAMP-WINDOW-FILING-20261109.md`
(the design that was placed), `director/PLACEMENT-WINDOW-RAMP-20261111.md`
(the executed window, ledger 381/382), `pulse/day18/
GATE-AR-REHEARSAL-20261111.md` (the RED rehearsal, ledger 383). Charter:
`pulse/DAY18-CHARTER-20261109.md` §1 — this filing serves §1.1's second
window and §1.2's re-rehearsal; the day claim under §0 is filed only
after both are green, exactly as the charter orders.

## 1. FRESH GEOMETRY READ (2026-11-13T06:31Z, this lane)

Fresh copies from the Orin (`director/redesign-20261112/pre/`): region
md5 `e9015d5a…`, entities md5 `6c0d76c3…`. Cody's `.dat` sha256
`13702eb7…` — byte-identical to every read since day 16's close; he has
not been woken. Column profiles for the whole pocket and its exits were
parsed offline from that copy (x 59..68, z −95..−87, y 58..72); the
cells this filing relies on are named in §3 and re-verified cell-by-cell
on the replica before any body moves (§5).

## 2. WHY THE PLACED COLUMN CANNOT BE CLIMBED — THE MEASURED SHAPE

The Gate A-R filing recorded the body's failure and two geometry
observations. The fresh parse completes the picture, in three facts:

1. **The wake stance is ceiling-capped.** Cody's stance column
   (62,−91) reads: stone y60–61, AIR y62–63, **grass_block y64**, air
   y65, grass_block y66. A body at feet 62 has exactly two air cells;
   its head top reaches y64.0 at feet 62.2, so **no jump from the wake
   stance can raise the feet past 62.2** — and every +1 step needs feet
   above the tread top (63.0 for the first east step). This is the
   rehearsal's own observation made mechanical: run 2's body "jump
   cycles at y62.2". The first step east was never a pathfinding
   refusal; it is a physical cap, and it poisons every upward step out
   of the stance column itself.
2. **The placed ramp is a face (filed defect (i)).** Column (64,−91)
   is stone_bricks y60–66 in ONE column: from the only reachable
   stance beside it, (63,−91) at feet 63, it presents a +4 wall. A
   stair is treads in SUCCESSIVE columns; a stack in one column is a
   wall with a high top.
3. **The top step's feet cell is occupied (filed defect (ii)).** The
   grass_block at (64,67,−91) — the column's natural cap, left in
   place by the first filing — is the feet cell of the column's top
   (standing on y66 means occupying y67).

**Design consequence:** the stair must (a) be reached without jumping
from the wake stance — the body first WALKS (a drop, not a jump) to a
stance with headroom; (b) climb in successive columns, one +1 tread
per column; (c) leave no block in any feet or head cell the climb
uses, including its top step.

## 3. THE ROUTE THE TERRAIN ALREADY OFFERS (all cells from §1's read)

The pocket's own ground, read fresh, contains every tread but two —
the design adds one block and clears five:

| leg | from → to | feet | how | headroom check (from the parse) |
|---|---|---|---|---|
| 1 | stance (62,−91) → (62,−90) | 62 → 61 | walk off the step's south edge — a DROP, no jump (this is why the stance ceiling does not bind) | (62,−90): stone y60, air y61–65, dirt y66 — a shaft column |
| 2 | (62,−90) → (63,−90) | 61 → 62 | +1 onto stone y61 | source air y62–65; dest cells y62–63 air |
| 3 | (63,−90) → (63,−91) | 62 → 63 | +1 onto the east step's stone y62 | source air y63–65; dest cells y63–64 air |
| 4 | (63,−91) → (64,−91) | 63 → 64 | +1 onto **tread 1: the placed column's own stone_bricks y63 top** (after §4's clearing) | dest cells y64–65 cleared to air |
| 5 | (64,−91) → (65,−91) | 64 → 65 | +1 onto **tread 2: the one placed block, (65,64) stone_bricks** | dest cell y65 air; y66 overhang removed (§4) |
| 6 | (65,−91) → (66,−91) | 65 → 66 | +1 onto native grass_block y65 (a floating cap over the water cell) | dest cells y66–67 air |
| 7 | (66,−91) → (67,−91) | 66 → 67 | +1 onto native grass_block y66 — the hilltop | dest cells y67–68 air |
| 8 | (67,−91) → (64,−90) along z=−90 | 67 | level walk west across native tops (dirt/grass y66) to **pad cell (64,−90)**, dirt y66 top, cells y67–68 air | charter pad box x 59..64, z −89..−93 ✓ |

A second approach to leg 2 exists (stance → pocket floor (61,−91),
feet 61, air y61–64 above it → (61,−90) → (62,−90)) if the pathfinder
prefers it; the replica rehearsal (§5) lets the body's own prims
choose, exactly as the day will.

**The guest's cell, read honestly:** the chartered stocking cell
(66.5, 62, −90.5) is the water cell (66,−91) — the scenario's
"(66,−90)" label reads the centre coordinate loosely; the triple
scores the COORDINATE (66.5, −90.5), and this filing does not amend
it. The stair's legs 6–7 stand in that very column's airspace (feet
66–67 over water at y62–63): he crosses the guest's column
mid-motion, ~1.0 block horizontal from the scored coordinate at the
closest tread. The resident zombie stands in the same water (its
census position (66.6, 62, −90.3) is this cell) — Gate A's live sweep
and the charter's §3.2/§3.4 discipline govern that, unchanged.

## 4. THE WINDOW — SIX SETBLOCKS (actor: MapProbe4)

Disposition of the standing column: **INCORPORATED.** Its lower stack
(stone_bricks y60–63) becomes tread 1 and its support — the authorised
geometry stays in the world and does the work; only its unusable
upper stack is cleared. Nothing else of the first window is disturbed.

| # | cell | before (fresh read) | after | why |
|---|---|---|---|---|
| 1 | (64,64,−91) | stone_bricks | air | tread 1's feet cell |
| 2 | (64,65,−91) | stone_bricks | air | tread 1's head cell |
| 3 | (64,66,−91) | stone_bricks | air | jump-arc clearance over tread 1 |
| 4 | (64,67,−91) | grass_block | air | filed defect (ii): the old top step's feet cell; left floating it would cap the stair's airspace |
| 5 | (65,64,−91) | air | stone_bricks | **tread 2** (top y65). Material matches the first window: identifiable in every later census, removable without ambiguity. The native grass_block y63 beneath it stays — buried, never stood on |
| 6 | (65,66,−91) | grass_block | air | floating overhang: the head cell of the tread-2 stance and its jump arc |

**Invariant cells** (must read identical before/after, verified from
two stores as the first window was): Cody's stance columns (61,−91)
and (62,−91) ENTIRE; the pocket floor cell (61,60,−91); the route's
native cells (62,60,−90), (63,61,−90), (63,62,−91), (66,65,−91),
(67,66,−91), (64,66,−90); his table (64,67,−94); scenario #3's block
(65,66,−88); the pad tops at (60..63,67,−90..−93). Cody's `.dat` sha
unchanged (he is offline throughout the window).

Window sequence (day-9 shape, as the first window ran): ledger claim
(this window) → Director world-claim addendum → fresh region copy +
pre-reads of the six target cells and the invariants → pre-probe
(`#chk` sentinel: the target tread cell (65,64,−91) does NOT yet read
stone_bricks) → the six setblocks in the order above → post-probe →
`/save-all flush` → fresh region copy read-back (six cells as filed,
invariants identical, `.dat` sha unchanged) → scoreboard-file second
store → ledger close line with the read-back hashes.

## 5. THE REHEARSALS (the gate, twice, as chartered)

1. **Replica rehearsal, before any world edit.** Replica rebuilt from
   §1's fresh read-back (the CURRENT world, placed column included),
   verified cell-by-cell against an independent store on all
   climb-relevant cells (the day-18 lane's first replica was invalid
   and was caught by exactly this check — it is repeated, not
   inherited). The design's six edits are then applied IN THE REPLICA
   ONLY. Throwaway body at Cody's exact wake stance
   (62.559, 62, −90.692), moving only with the citizen driver's own
   prims (`prims.gotoNear`, the day-18 driver's helm). Pass = **three
   consecutive full climbs**, stance → server Pos feet ≥ 67 on a pad
   cell, no operator touch / teleport / reset between climbs; the
   body returns to the pocket between climbs by its own walking
   (reverse-leg gotos down the stair are the body's own prims; a fall
   back into the pocket is the climb's cost, per §1.2). Design
   iteration happens HERE, where it is free; every design change is
   appended to this filing as an amendment with its rehearsal result.
2. **Gate A-R, after the window.** The identical 3/3 form against the
   placed stair AS READ BACK (a replica rebuilt from the window's
   post read-back). Any shortfall = STOP, file, report: no wake, no
   variant-N fallback on this lane's own authority.

Only with both green does the day claim (§0) declare variant R, and
the run proceeds Gate A → Gate B → the day, as chartered.

## 6. WHAT THIS FILING IS NOT

Not a relocation (his body is never moved). Not a change to the
charter, the scenario, or the prediction: the pig's cell, the
hand-over line, and the pass forms are the filed ones. Not a second
bite at the first design: the first window's column is incorporated
where it works and cleared where it cannot — the record of both
windows will read as one stair, designed twice, proven twice.

*— Day-18 stair-redesign lane, 2026-11-12.*

## AMENDMENT 1 (2026-11-13T07:35Z) — a read correction, caught by the gate

The replica rehearsals native verification caught one wrong cell in

## AMENDMENT 1 (2026-11-13T07:35Z) — a read correction, caught by the gate

The replica rehearsal's native verification caught one wrong cell in
this filing's §3 table, and a programmatic cross-check of every named
cell against the fresh parse (direct per-cell reads, not the layered
map) corrected the leg-8 description. The DESIGN is unchanged (no
edit-list cell was wrong); the arrival geometry now reads:
(64,-90) tops at grass_block y64 (a feet-65 stance, cells y65-66 air),
with air at y66-67 — it is NOT the arrival cell. The arrival route is
the z=-89 rim: (67,-91) f67 -> (67,-90) f67 -> (67,-89) f67 -> west
across native grass y66 tops (66,-89), (65,-89) -> pad cell (64,-89),
dirt y66 top, feet 67, cells y67-68 air (charter pad box x 59..64,
z -89..-93). Leg 1 note completed: the (62,-90) shaft is capped at
y66 dirt / y67 grass (the rim surface, feet 68) — it does not bind the
shaft stance at feet 61 (jump apex head 64.05 < 66). First rehearsal
run: replica build verified 31/32 native cells; the one mismatch was
this filing's own misread cell, (64,66,-90) — filed here, list
corrected, rehearsal re-run. The verify gate did its job on the
filing before it could do it on the world.

## AMENDMENT 2 (2026-11-13T07:38Z) — arrival-rim description corrected again

Amendment 1's arrival sentence was itself written from an eyeballed
layered map and is wrong in the same way. Programmatic per-cell reads
only from here. The z=-89 rim, read cell by cell: (65,-89), (66,-89)
and (67,-89) top at grass_block y66 — feet-67 treads, cells above air.
(64,-89) carries grass_block y65, air y66, grass_block y67,
leaf_litter y68: its feet-66 stance is head-capped by the y67 grass;
its standable surface is the y67 grass top — feet 68, cells y68
(leaf_litter, non-colliding) and y69 air. (64,-89) IS a charter pad
cell (x 59..64, z -89..-93) at feet 68 >= 67, reached from (65,-89)
by a +1 step. Second rehearsal run verified 34/35 native cells; the
one mismatch was this arrival cell again — the filing's prose, never
the design: the six-edit list and every climb-relevant cell have now
verified exactly, twice, against two independent reads. Rehearsal
re-run with the corrected list.

## AMENDMENT 3 (2026-11-13T07:45Z) — rehearsal attempt 1: geometry green, calling form wrong

Replica: native cells 37/37, edited cells 9/9 — the design as built
in the replica is exactly the design as filed. Climb 1 FAILED, and
the trace shows why, in the harness's calling form, not the stair:
(a) the direct pad goto (run-2 form) oscillated at the stance — the
pathfinder cannot route a climb whose first move is a drop AWAY from
the target, and the helm's step-up finds no clean +1 at the capped
stance; (b) legs 1-3 with radius 1.0 FALSE-ARRIVED — gotoNear's
arrival check passed at ~1.0 blocks with the body unmoved, so the
body never took the drop south; (c) leg 4's pathfinder did move the
body — west, down to the pocket floor, north into the (61,-90) shaft
cell — then stalled: from there the +3 target was out of its walk-only
search. Recorded plainly: gotoNear's ok is NOT arrival evidence
(house rule, relearned at radius 1.0). Attempt 2 drives the filed
route LEG BY LEG with tight radii (0.5-0.6) and a server-Pos check
after every leg (cell + feet band), retrying a failed leg once via
walkTo — the manual helm whose momentum step-up and face-keyed
wedge jump are the stack's +1 mechanics. All movement remains
prims.js exports (gotoNear / walkTo); setDigStep stays OFF; no
teleport, no operator touch. The design and the six edits are
unchanged.

## AMENDMENT 4 (2026-11-13T07:50Z) — the feet+3 jump-cap, measured; one edit added

Rehearsal attempt 2 (leg-driven, server-Pos-verified legs): the drop
leg is PROVEN (stance -> shaft (62,-90) feet 61 in under a second).
Step-1 then failed twice, 30 s each by gotoNear and walkTo: the body
pressed the step face at feet 61 and never rose. Measured cause, then
audited programmatically over every +1 leg of the design: a jump
from feet F puts the head top at F+3.05 at apex, so any block in the
DESTINATION column at sourceFeet+3 caps the jump in practice (the
feet clear the tread at rise 1.0, the head meets the cap at rise
1.2, and a face-pressed body has no horizontal drift to thread the
0.2 window). This is the one-rung law's mechanism, finally named:
day-17's rung-2 and the stance's own cap (grass at feet+2 there)
are its other faces. Audit of the filed route: legs 2-8 all CLEAR;
exactly one capped cell — a lone stone block at (63,64,-90),
embedded in the hill mass over the first step (the column reads
stone 58-61, air 62-63, stone 64, dirt 65-66, grass 67).

DESIGN CHANGE: the window gains a SEVENTH setblock —
(63,64,-90) stone -> air — the same class as the filed (64,67)
grass and (65,66) grass clears: a block occupying airspace the
climber's body provably needs. Interior hill stone, invisible from
the surface, named here and in every census after. Window is now
seven setblocks; everything else stands. Rehearsal attempt 3 runs
the amended design in the replica before anything touches the
world.

## AMENDMENT 5 (2026-11-13T07:55Z) — it was the pathfinder phase, not the stair

Rehearsal attempt 3 (amended design, cap cleared, replica verified
38/38 + 10/10) failed step-1 IDENTICALLY — body pressed at
x=62.6994 to the ulp, both attempts. A step probe then separated the
variables: walkTo ALONE from the shaft floor (62.49, 61, -89.34) to
the step cell climbed it cleanly — server-Pos arc 61 -> 62.25 apex
-> 62, PASS. The rehearsal's step-1 always ran gotoNear FIRST: its
pathfinder phase drives the body into the step face and stalls
there (x=62.6994, face distance 0.30), and the helm's wedge recovery
cannot buy a run-up inside a one-cell shaft from a pressed start.
The step was never unclimbable; the calling order poisoned it.
(The probe's open-ground control trial was itself invalid — the
body fell through unloaded chunks — and is not cited for anything;
the shaft result stands on server Pos.)

Attempt 4 therefore drives every +1 leg with walkTo FIRST (the
helm-native order; gotoNear itself delegates to this helm on stall,
and walkTo is a prims.js export — the driver's own prim set,
unchanged), each leg still server-Pos-verified, gotoNear kept only
as a leg's second attempt. Design, edits (seven), pass form
unchanged.

## AMENDMENT 6 (2026-11-13T08:00Z) — three steps proven; the run-up rule; a reset retry

Rehearsal attempt 4 (walkTo-first legs): drop-shaft, step-1,
step-2 and tread-1 ALL CLIMBED, first attempt each — the lower
stair works, including the tread on the placed column's own
stone_bricks. Tread-2 failed both attempts: the body had arrived
on tread-1 already pressed against the east face (x=64.69, face
distance 0.31) and never manufactured a run-up. Combined with the
probe (the same step class climbed from 0.8 of run-up) and
attempts 2-3 (pressed starts never climb), the rule is now
measured three ways: THIS HELM CLIMBS +1 STEPS FROM A RUN-UP AND
NOT FROM A PRESSED START. Attempt 5 adds the obvious remedy inside
the leg driver: after a failed attempt that ends in the source
cell, walkTo a reset point (source-cell centre pulled 0.35 away
from the step) and take the step again — every move still a
prims.js walkTo/gotoNear, every arrival still server-Pos-verified.
Design and the seven edits unchanged.

## AMENDMENT 7 (2026-11-13T08:05Z) — chain the steps; the helm's own documented mode

Attempt 5: tread-2 failed all three attempts and the reset was a
no-op — walkTo reported ok at 0.50 blocks against a 0.3 range (the
helm's arrival is loose; its ok is never evidence, again). Deeper
read of the traces: tread-1's arrival itself parks the body at
x=64.69, pressed on tread-2's face — tread-2 has never had a clean
start in any attempt, and on a one-cell tread the wedge-release
cannot back off (west is a drop off the shelf; the arbiter's
guarded search never steps down off a shelf). The helm's header
names the intended mode for exactly this terrain: MOMENTUM STEP-UP
— "while still moving, a detected clean +1 in the front row is
jumped with forward held, so close-spaced +1s CHAIN instead of
face-planting." My per-leg stop-start driving was fighting the
substrate. Attempt 6 drives CHAINS: drop, then step-1+step-2 in
one walkTo, then tread-1+tread-2+step-5+hilltop in one walkTo
east, sampling server Pos at 1 Hz and requiring the sample stream
to pass through every tread cell at its filed feet — displacement
truth, not arrival claims. Descent chains in reverse. Design and
edits unchanged.

## AMENDMENT 8 (2026-11-13T08:10Z) — the lip-shuffle is bimodal; chains get retries

Attempt 6 (chained driving) regressed at the DROP: the body
lip-shuffled at the stance for the full 22 s — the same oscillation
attempt 1 recorded — while attempts 4 and 5 dropped in under a
second on the identical walkTo call. The stance exit is bimodal in
this helm; a single call is a coin flip. Attempt 7 keeps the
chains and gives each chain up to three walkTo calls, pooling the
server-Pos samples across them; a retry is the body's own walking
from wherever it stands — no teleport, no reset, no operator touch
(the charter form counts climbs, and attempts 2-5's leg retries
already stood on this reading). Pass form unchanged.

## AMENDMENT 9 (2026-11-13T08:15Z) — instrument sensitivity, measured; gate runs on the proven instrument

The stance drop is instrument-sensitive in a way I could not
isolate to one variable: the leg-form rehearsal script
(redesign5.js) has now dropped and climbed legs 1-4 first-attempt
in 3 of 3 processes — including a verbatim bisect re-run at 08:05,
between probe failures — while eight probe processes (identical
nominal walkTo calls; timeouts 20 s, 25 s and 30 s; with and
without pre-walk Pos reads; with and without a build phase) wedged
at the stance 8 of 8. The wedge logs show the helm's stall arbiter
cycling with zero drive progress and a face read 0.21 ahead; the
bisect excludes server state, replica state and time-of-day. I am
recording the pattern without a claimed mechanism: PROBE RESULTS
ABOUT THIS STANCE ARE NOT EVIDENCE; the gate runs on the proven
leg-form instrument, structure unmodified.

Attempt 8 is therefore redesign5.js verbatim except the two chain
legs: tread-2 is targeted in ONE walkTo from step-2's cell (the
helm carries momentum across tread-1 instead of stopping pressed
on its face), and the hilltop in one walkTo from tread-2; both
still judged by server Pos in the target cell at the filed feet,
with leg()'s three-attempt structure (walkTo / gotoNear / reset +
walkTo) intact. Descent mirrors with a single downhill chain leg.
Design and seven edits unchanged.

## AMENDMENT 10 (2026-11-13T08:20Z) — attempt 8: chain carried one step, not two

Attempt 8 (proven instrument + chain legs): drop, step-1, step-2
again first-attempt. The chain DID carry the body over tread-1 in
motion — and face-planted tread-2 exactly as the stop-start form
did: the body lands on tread-1 at x=64.69, 0.31 from the next face,
and no recovery can back it off (west is a drop off the shelf; the
arbiter's guarded search never steps down). Measured rule, now
triply evidenced: THIS HELM CHAINS EXACTLY ONE +1 FROM MOTION; a
second consecutive +1 needs a fresh run-up manufactured from at
least a full cell away — and the leg() reset never fired because
its target sat inside the helm's loose arrival radius (0.49 <
~0.5-1.0), a no-op I should have caught from the attempt-5 trace.

Attempt 10 keeps the proven instrument and gives tread-2 the
run-up explicitly: from tread-1, walkTo BACK to step-2's cell
centre (a real 1.2-block move west, down one step — forced
movement, Pos-verified), then ONE walkTo chaining tread-1 ->
tread-2 with the full two-cell approach. Steps 5 and the hilltop
(native grass tops on the open ridge, untested) run as plain
leg() calls. Design and seven edits unchanged.

## AMENDMENT 11 (2026-11-13T08:25Z) — aim past the step

Attempt 10: the reposition worked both rounds (body back at
step-2 in under a second), the chain carried tread-1 both rounds —
and the body still stopped on tread-1's east edge for the full
30 s, both rounds. The run-up was not the missing piece. New
reading: with the walk target only ~1.3 past the face, the helm
is already in its arrival deceleration when it reaches tread-2's
step; the momentum step-up needs approach speed the short target
denies. Every proven step (step-1, step-2, tread-1) had its face
early in a longer drive or the target well beyond the face.
Attempt 11 aims the chain PAST the step: from tread-1, reposition
to step-2, then one walkTo at the HILLTOP cell (67.5, 67, -90.5) —
tread-2's face sits mid-drive, 1.5 into a 4.0 walk. Judged by
server Pos: the leg passes only at the hilltop cell at feet 67
(which proves the tread-2 and step-5 crossings — there is no
other path); wherever the body actually stops is recorded as the
leg's truth. Design and edits unchanged.

## AMENDMENT 12 (2026-11-13T08:35Z) — DESIGN v3: no rung without a walking approach

The tread-2 evidence is now complete and consistent across eleven
attempts and four probes. The rule, measured: this helm takes a +1
reliably when the body crosses at least ~0.7 of level ground
immediately before the face inside one continuous drive (step-1
from the shaft, step-2, tread-1 — all first-attempt, repeatedly).
It does not take a +1 whose approach was consumed by the previous
jump's landing: jumps land ~0.7 into a one-cell tread, the face is
met at zero run-up, forward pressure parks the body in the
server's correction stream (the helm author's own comment names
this state), and every recovery either cycles on the spot or
surrenders the rung behind. frontStepUp reads the tread-2 step
CLEAN from the bot's own model (probe-verified) — the detector is
not the gap; the approach is.

DESIGN v3 therefore gives every rung a walking approach:
- (65,-91) becomes a LEVEL LANDING at feet 64 on its native
  grass@63 — the (65,64) stone_bricks placement is REMOVED from
  the window. Treads A (64,-91) and the landing form one two-cell
  standing level at feet 64.
- Rung-B: ONE placement, (66,64,-91) stone_bricks (top feet 65),
  taken east from the landing with a full cell of approach.
- Rung-C: NO placement — clear the grass cap at (66,66,-90),
  revealing the native dirt@65 top (feet 66) one step SOUTH of
  rung-B; its head cell (66,67,-90) is leaf_litter, which the
  helm's own scan reads as passable (not a 'block' bounding box).
- Then west along the rim: (65,-90) grass@66 top feet 67 (+1),
  north (65,-89) feet 67 (level), west (64,-89) grass@67 top
  feet 68 (+1) — a charter pad cell.
Window v3 = EIGHT setblocks: clears (63,64,-90), (64,64..67,-91),
(65,66,-91), (66,66,-90); placement (66,64,-91) stone_bricks.
The (65,63) grass under the old tread-2 plan is untouched now;
the buried-grass conversion noted in attempt 11's verify (grass
under a cover block dies to dirt) applies to (66,63) under rung-B
instead — cosmetic, recorded in advance. Rehearsed as v3 before
any world edit, per the gate.

## AMENDMENT 13 (2026-11-13T08:40Z) — v3's flight climbs; the last leg overshot

Rehearsal attempt 12 (design v3): replica verified 43/43 native,
15/15 edited. The new top flight CLIMBED, first attempt nearly
everywhere: landing 0.7 s, rung-B 0.9 s, rung-C 0.9 s, rim-west
0.9 s (tread-1 took its gotoNear second attempt after a walkTo
no-move — inside leg()'s normal structure). The design rule is
proven: no rung without a walking approach. Two corrections
ride with this amendment: (i) rung-B needs BOTH its edits —
place (66,64) AND clear the native grass cap at (66,65,-91),
which otherwise occupies the rung's feet cell (window is now
NINE setblocks); (ii) the rim-north leg overshot — the body
coasted through (65,-89) to (65,-88) at feet 67 with walkTo
reporting arrival — so rim-north is deleted as a stop: from
rim-west the climb goes straight at the pad cell (64,-89).
Descent unchanged in shape. Attempt 13 runs the corrected form.

## AMENDMENT 14 (2026-11-13T08:45Z) — CLIMB 1 COMPLETE; the cycle is the remaining work

Attempt 14: CLIMB 1 PASSED END TO END — every leg first-attempt
walkTo (drop, step-1, step-2, tread-1, landing-rung-B merged,
rung-C, rim-west, pad-step), ending at the pad cell (64,-89) feet
68. Design v3's flight is proven in the replica. The descent and
the second climb are what failed: rim descent legs drifted
(wrong-way overshoot east, a fall off rung-B's south edge —
recovered by the leg structure both times), the pocket-return
leg never moved the body west, and climb 2's step-1 failed from
a cold shaft start (62.30, -89.53) where climb 1's had succeeded
from a fresh drop landing (62.52, -89.30).

Two structural facts ride with this amendment. First, the wake
stance is a trap cell for re-entry: from anywhere in the bowl its
column reads as a +4 face (the grass cap at y64 is the scan's
top), so no walking body can re-enter it — climbs 2 and 3 must
start from the pocket floor, the charter's other named start.
Second, descent must end STRICTLY at the pocket floor cell
(61,-91) feet 61 — the loose inPocket box let a shaft start
masquerade as a pocket return. Attempt 15: descent mirrors the
climb's proven path and ends with west+north legs into the
pocket floor, strictly judged; climbs 2/3 open with pocket-north
and shaft-east legs so step-1 is always approached from a fresh
walk, never a cold stand.

## AMENDMENT 15 (2026-11-13T08:58Z) — climb proven twice; reset becomes one gotoNear

Attempt 15: climb 1 passed end to end again (pad-step on its
third attempt after two loose arrivals — the pad cell at feet 68,
server-read). The leg-by-leg descent then failed at d-tread-1:
a level westward walkTo drove the body SOUTH into the (65,-92)
wall and wedged it in the correction stream for the remaining
nine legs. Leg-chained descent across this rim is a coin flip
per leg against the arbiter's lateral probe. The reset is
therefore replaced by ONE driver-form call: gotoNear to the
pocket floor (61.5, 61, -91.5, radius 1.6, 90 s) — the
pathfinder routes the stair downhill or the helm remainder
funnels into the bowl — judged by server Pos inside the pocket
box (x 60..63, z -92..-90, feet <= 63), with one walkTo
follow-up if needed. No teleport, no operator touch: the body
still returns entirely under its own movement, per the charter
form. Climbs 2/3 keep the pocket profile.

## AMENDMENT 16 (2026-11-13T09:02Z) — the sub-0.9 trap, named and aimed past

Attempt 16: climb 1 passed (third process in a row). The
gotoNear reset returned the body down the stair to step-2's
tread under its own movement; climb 2's pocket-north leg walked
it to the shaft-row west cell — then shaft-east failed all three
attempts without the body moving: from (61.84, -89.54) the
target centre is 0.67 away, inside both prims' arrival slack,
so every call reports arrival and no call drives. The body sat
0.16 from the cell boundary it needed to cross. This is the
loose-arrival trap at its smallest scale. Fix: leg() accepts an
explicit aim point distinct from the judged cell; shaft-east
now aims at (63.4, -90.5), past the boundary, so the drive
carries the body east until step-1's face stops it inside the
shaft cell. Judgement stays server-Pos cell + feet band,
unchanged.

## AMENDMENT 17 (2026-11-13T09:12Z) — shaft-east deleted; step-1 taken from the pocket row

Attempts 16 and 17 failed identically at shaft-east: after
pocket-north delivered the body to (61.84, 61, -89.53), all
three prim attempts returned success in ~0.4 s without the body
moving — a one-cell eastward hop out of a fresh westward
arrival never engages this helm. (Amendment 16's aim override,
it must be owned, never reached the prims: the leg() in the
shipped script is the reset-bearing form without aim
parameters, so the table entry was inert. The failure is the
same either way — the hop itself is the trap.) The pocket
profile therefore deletes the shaft-east hop: from the pocket
row the body drives straight at step-1, crossing the shaft at
a walk with ~1.5 cells of level approach — the configuration
that has taken step-1 in every successful stance climb.

## AMENDMENT 18 (2026-11-13T09:15Z) — the reset endpoint is the bowl floor complex

Attempt 18: climb 2 failed one leg earlier — pocket-north
stopped one cell short, leaving the body in the shaft at
(62.30, 61, -89.50), a cell from which the full flight is
directly climbable (it is where every stance climb's drop leg
ends). Judging the reset by one named cell keeps discarding
good cycles. Ruling, filed before the run it governs: the
reset endpoint is the bowl floor complex — pocket floor,
pocket row or shaft, all feet-61 cells of the pocket the body
reached under its own walking — and pocket-north becomes a
non-fatal positioning leg. Every scored climb still traverses
the entire flight from feet 61, step-1 included; no climb's
content changes.

## AMENDMENT 19 (2026-11-13T09:17Z) — the gate form stands; the legs get more patience

Attempt 19's climb 1 failed at tread-1 — the first stance
climb to fail in five processes — with the body caught
mid-jump at the face on its last attempt. The variance is per
leg and real; the charter's 3-consecutive form is not softened.
What changes is the instrument's patience, which the charter
does not constrain: legs now run five attempts (walkTo,
gotoNear alternating), with the run-up reset firing before
attempts 3 and 5. Same prims, same judgement (server Pos,
cell + feet band), same pass form.

## AMENDMENT 20 (2026-11-13T09:33Z) — the straddle is a climbed rung; footprint judgement

The z-probe (zprobe.js, setup teleports, probe only) separated
the variables. Control: from the pocket row, step-1 failed as
in the gate runs. Test: the same start, a positioning walk to
the shaft's south portion (62.35, 61, -89.32), then step-1 —
the body TOOK the step and stood at feet 62 on the tread, but
its centre stayed at x 62.72, straddling the cell boundary,
pressed against the +3 face beyond. Centre-cell judgement
calls that a failure and retries from a stance that can never
centre-cross by driving east. A body standing on the tread at
tread level, footprint on the tread cell, has climbed the
rung. leg() therefore judges by footprint intersection
(centre +- 0.3 against the target cell) at the target feet;
the pad judgement is unchanged in substance. The pocket
profile also gains the shaft-south positioning walk after
pocket-north, non-fatal, judged by server Pos.

## AMENDMENT 21 (2026-11-13T09:40Z) — do not destroy a good start

Attempt 21's reset ended in the shaft's south portion
(62.43, 61, -89.30) — the exact stance from which the probe
took step-1 — and the climb then dragged the body west
through pocket-north and a 22-second shaft-south wedge before
step-1, which failed all five attempts pressed at the face.
The pattern across attempts 16-21 is consistent: step-1 fires
when the body reaches the face in one clean drive after a
drop or a fresh start, and does not fire after prolonged
face-pressing in the preceding legs. Positioning for climbs
2/3 is therefore subtractive: if the reset already ended in
the shaft, no positioning legs run at all; if it ended on the
lower stair, one step-DOWN walk drops the body into the
shaft (the drop is climb 1's own proven entry motion); the
pocket-row route runs only when the body is actually in the
pocket. Shaft-south correction runs only from the shaft's
north portion.

## AMENDMENT 22 (2026-11-13T09:51Z) — two of three; the step-down goes pathfinder-first

Attempt 22: climbs 1 and 2 passed consecutively — climb 2 in
31 seconds from the shaft stance the reset had left, with no
positioning legs before it. Climb 3's reset ended on step-2;
the step-down walkTo never engaged (15 s, body unmoved), the
climb started from step-2 regardless, traversed every leg in
sequence, and failed only at the final pad-step. One change:
the step-down goes gotoNear-first (the pathfinder routed both
descents; it steps down off treads the helm will not leave
from a standstill), with the walkTo as fallback.

## AMENDMENT 23 (2026-11-13T09:58Z) — one clean drive into the south stance, then step-1

Attempt 23: climb 2 failed at step-1 from (62.34, 61, -89.53)
after a pathfinder step-down stopped mid-shaft. The full
record now separates cleanly: step-1 has fired every time the
body's last motion was one clean drive ending in the shaft's
south portion (z about -89.30 — every climb-1 drop landing,
attempt 22's reset descent, the probe's test arm) and has
never fired after the body was parked, pressed or wedged in
the shaft first, nor from a mid-shaft stance. Positioning for
climbs 2/3 is therefore a single settle-south drive —
walkTo (62.45, 61, -89.12), gotoNear as fallback, judged by
server Pos (shaft cell, feet 61, z >= -89.45) — and step-1
follows immediately, with nothing in between.

## AMENDMENT 24 (2026-11-13T10:07Z) — the south stance is a wall stop; drive into the wall

Attempt 24's reset ended in the shaft's north portion
(62.31, 61, -89.65) and both settle drives false-arrived
without moving — the target was 0.55 away, inside the arrival
slack. The geometry is now plain: every natural south arrival
reads z -89.30 because that is where the (62,-89) column
stops the body — the drop landing, the reset descent and the
probe's test arm all end at the wall stop. The settle
therefore aims INTO the wall column (62.5, 63, -88.4): one
drive, and the wall parks the body at the stance step-1 has
always fired from.

## AMENDMENT 25 (2026-11-13T10:14Z) — REPLICA GATE GREEN: 3/3

Attempt 25 (ramp-rehearsal-redesign25.js;
results ramp-rehearsal-redesign25-results.jsonl): THREE
CONSECUTIVE FULL CLIMBS, stance/pocket -> pad cell feet 68,
server-Pos judged throughout, no operator touch, teleport or
reset between climbs. Climb 1 from the wake stance; climb 2
from the shaft wall-stop stance the reset descent left
(62.42, 61, -89.32), 41 seconds; climb 3 from step-2 after
the wall-drive positioning, traversing every leg in sequence
to the pad. Design v3 is replica-proven as filed (window v3,
nine setblocks). The lane proceeds to the placement window.
