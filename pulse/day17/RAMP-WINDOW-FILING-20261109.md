# OPERATOR-PLACED RAMP — WINDOW FILING (PREPARED, NOT EXECUTED) — 2026-11-10

Status: **PREPARED by the day-17 lane under the DAY17 charter's SS9 fork.
NOT EXECUTED.** Execution needs Casey's named word (the parent carries
this filing to him). Precedent class: the day-9 chartered relocation —
operator-placed geometry in a sequenced window under claim, declared
before the act, verified from stores the actor cannot write.

## WHY

Day 17's rehearsal gate (charter SS3) ran in full: four exit mechanisms
(place-ladder north, notch-cut east with pickaxe, place-at-feet south,
ascending notch-stair east in two scripted forms), twelve-plus runs on a
cell-by-cell-verified replica, **none passed 3/3** — the movement stack
grants exactly one step from a stance and no scripted composition chains
a second inside the pocket (record: `pulse/DIRECT-DRIVE-DAY17-20261109.md`
SS2). Cody sleeps in the bowl at (62.56, 62, -90.69), hp 20, food 20, 27
porkchops, deaths 136. Without an exit there is no day 18 in the bowl.

## THE PLACEMENT (op identity: MapProbe4, as the Director windows)

Five blocks, one column — the bowl's east face at (64, y, -91), OUTSIDE
the pocket's air shaft, each a single one-step above the last, tops
forming a stair from the pocket's step stance to the pad:

| # | cell | top (new feet) | steps from |
|---|------|------|------|
| 1 | (64, 62, -91) | 63 | the entry step stance (feet 62, on (62,-91)'s stone top 61 / pocket floor) |
| 2 | (64, 63, -91) | 64 | block 1 |
| 3 | (64, 64, -91) | 65 | block 2 |
| 4 | (64, 65, -91) | 66 | block 3 |
| 5 | (64, 66, -91) | 67 | block 4 -> the pad (tops y67) |

Material: `minecraft:stone_bricks` — visually distinct from every native
bowl material (the census reads stone/dirt/grass there), so the ramp is
identifiable in every later census and removable without ambiguity.

PRE-READS (fresh census 2026-11-10T11:35Z, `director/census-d17-20261109/`,
region md5 `85711ca6...`): column (64,-91) currently reads: 58-59 stone,
60-61 AIR, 62 dirt, 63 stone, 64 air, 65 air, 66 dirt, 67 grass_block.
The placement therefore: fills (64,60,-91) and (64,61,-91) FIRST (two
support fills, air -> stone_bricks; without them blocks 1-2 have
predecessor support only in part), then sets (64,62..66,-91) to
stone_bricks, overwriting dirt/stone/air/dirt respectively. SEVEN
setblock commands total, all in column (64,-91). No other cell is
touched. Invariant cells (must read identical before and after): Cody's
stance columns (61,-91) and (62,-91) entire; the pocket floor cell
(61,60,-91); his table (64,67,-94); scenario #3's block (65,66,-88);
the pad tops at (60..63,67,-90..-93).

NOTE on geometry honesty: the stair's first step is taken from the
pocket side — from his stance at feet 62 the body walks east through
columns (63,-91) (solid to y62: its top at 62 IS a stance at feet 63
once the head cells above are as the census reads them — air 63? NO:
(63,-91) reads stone to 62, then the column above is pad body; the
filing does NOT assume (63,-91) is passable. The ramp as placed makes
(64,-91) a staircase whose FOOT is reached from (63,-91)'s top (feet
63) if that column is steppable from the stance, or from the pocket
floor via (62,-91)->(63,-91) — the day-18 charter must rehearse the
ramp climb on the replica WITH the ramp placed (one rehearsal run,
3/3, before the wake) exactly as day 17 rehearsed the bare bowl.
This filing places geometry; it does not certify the climb — the
rehearsal does, on the scratch rig, before any citizen launch, under
the same gate.

## THE WINDOW (sequence, once authorised)

1. Ledger claim addendum (window open) via `pulse/ledger-append.py`.
2. Fresh region copy from the Orin; pre-reads of the seven target cells
   + the invariant cells; Cody's `.dat` sha noted (`13702eb7...` at
   filing).
3. Op bot (MapProbe4) issues the seven setblocks, in the order above.
4. `/save-all flush` via the op channel; fresh region copy; read-back:
   all seven cells read `stone_bricks`; all invariant cells identical;
   Cody's `.dat` sha unchanged (he is offline throughout).
5. Second store: the scoreboard-file probe pattern (the placement
   windows' `#chk` sentinel) as the independent confirmation.
6. Ledger close line (window closed) with the read-back hashes.
7. The scratch-rig rehearsal of the placed ramp (3/3) is chartered as
   day 18's Gate A; only then does a citizen day get chartered.

## WHAT THIS FILING IS NOT

- Not a relocation: Cody's body is never moved; the world gains a stair.
- Not executed, not scheduled: it waits for Casey's named word.
- Not reversible-by-silence: if placed and later unwanted, removal is
  its own window (the seven cells' pre-read types are recorded above).
