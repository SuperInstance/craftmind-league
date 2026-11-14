# DAY 18 — GATE A-R REHEARSAL: **RED** (the R claim is void before any wake)
## Filed 2026-11-11 by the day-18 run lane. Charter §1.2 / §0. Day claim: ledger 380. Ramp window: ledger 381 (open) / 382 (close).

## What is green
**§1.1 — the placement window: GREEN.** Executed exactly as filed
(`director/PLACEMENT-WINDOW-RAMP-20261111.md`): seven setblocks in column
(64,−91) by MapProbe4, read back clean from two stores (fresh region parse:
stone_bricks y60–66, grass cap y67 intact, every invariant cell identical;
scoreboard.dat #chk = 1). Cody's `.dat` sha `13702eb7…` unchanged. The ramp
stands in the world as Casey authorised it.

## What is red
**§1.2 — the climb rehearsal: NOT 3/3. Climb 1 failed in every form tried;
no climb was ever completed.** Three attempts, in order:

1. **Run 1 — INVALID REPLICA, filed as such.** Replica = the day-17
   rehearsal build (which models column (63,−91) as pad body, solid to
   y66 + grass cap) + the ramp column. Result: climb 1 failed (body pinned
   at the stance). The replica's (63,−91) modelling contradicts the real
   world — the post-placement region read shows that column stone to y62
   with AIR above — so this run tested the wrong geometry and proves
   nothing either way (day-17's own ruling on its rehearsal 1, applied to
   mine). Evidence: `~/pin-scratch/ramp-rehearsal-day18-results.jsonl`.
2. **Run 2 — replica built FROM THE READ-BACK.** Every non-air cell of the
   box x56..70, y55..74, z−96..−86 copied verbatim from the placement
   window's post region copy (724 run commands, generator
   `~/pin-scratch/gen_replica_day18.py`); verified cell-by-cell via the
   rcon type-equality probe before the body moved: **0 mismatches over
   the 16 climb-relevant cells** (incl. (63,62,−91) stone / (63,63,−91)
   air / ramp stone_bricks y60–66 / (64,67,−91) grass_block). Throwaway
   body BowlBot set up once at the wake stance (62.559, 62, −90.692),
   survival, empty. Climb 1 forms tried: `gotoNear` direct to the pad
   (61.5, 67, −93.5) — FAIL (40 s, body unmoved from the stance but for
   jump cycles at y62.2); then east-step leg (63.5, 63, −91.5) + pad
   again — FAIL. Evidence:
   `~/pin-scratch/ramp-rehearsal-day18-run2-results.jsonl`.
3. **Route probe — the filing's named route, leg by leg, tight range.**
   Leg A, stance → (63.5, 63, −91.5) at range 0.5, 30 s: FAIL. The body
   oscillated between (62.6, 62, −90.7) and (62.1, 62, −90.3) and never
   stepped east onto (63,−91). Legs B/C never ran (conditioned on A).
   Evidence: `~/pin-scratch/ramp-routeprobe-day18-results.jsonl`.

**The measured fact:** under the citizen driver's own movement prims
(`prims.gotoNear`, the helm the day-18 driver ships), a throwaway body at
Cody's exact wake stance cannot take the first +1 step east onto
(63,−91) — the step the whole ramp route stands on. The rehearsal gate
did its job: it found this on the scratch rig, not with Cody's body.

**Geometry observations from the read-back** (filed as observations, not
as the verdict — the verdict is the body's failure above): (a) the placed
ramp is a single stacked column: blocks y62–66 in (64,−91) present as a
face to a body standing on (63,−91), not as treads in successive columns;
(b) the grass_block at (64,67,−91) — the column's natural cap, left in
place per the filing — occupies the feet cell of the top step (standing
on the y66 block means occupying y67). Any future ramp design must answer
both. This lane redesigned nothing: redesign is a new filing, not a
rehearsal improvisation.

## Disposition (charter §0 / §1.2, in their own words)
§1 is RED → the claim's variant R is **void as filed**. The lane STOPPED
before Gate A proper: **no live sweep, no pig stocked, no Gate B, no
wake.** Cody was never woken; his `.dat` at this filing is still
`13702eb7…`, byte-identical. Triple-026 is UNSCORED (premise unplayed —
the day did not run; it is not a FAIL). The furnace skill records NO use
for day 18 (no use began; the asset's evidence is not padded). Whether
day 18 runs variant N, a redesigned ramp is filed, or the day waits, is
the parent's ruling with Casey — the lane does not fall back on its own.

The ramp remains placed in the world (Casey's authorised geometry).
Removal, if ever wanted, is its own window; the seven cells' pre-read
types are recorded in the placement filing.

## Lane incidents (owned)
- Run 1's invalid replica (above): the lane inherited day-17's replica
  build without re-deriving its (63,−91) modelling against the fresh
  read-back it already held. Caught by the lane's own geometry check
  before any conclusion was drawn from it; the invalid run is filed,
  not buried.
