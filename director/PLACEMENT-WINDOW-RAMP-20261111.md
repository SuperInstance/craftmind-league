# PLACEMENT WINDOW — DAY-18 RAMP (OPERATOR-PLACED STAIR), GATE A
## Executed 2026-11-11T18:52Z–18:54Z by the day-18 lane (builder identity: MapProbe4)

Filed under the claim regime (`pulse/DIRECTOR-WORLD-CLAIM.md` addendum,
2026-11-11) and the prepared filing `pulse/day17/RAMP-WINDOW-FILING-20261109.md`.
Authorisation: Casey, 2026-11-11 09:47 AKST — "Place the ramp, then run
day 18" (the named word the filing waited for). Day claim: ledger line 380
(`day18-claim-20261111`, variant R declared). Window open: ledger line 381.

## Pre-reads (fresh copies, 2026-11-11T18:50Z, `placement-ramp-20261111/pre/`)
- Region md5 `12200d02542d06730320de71dfeac602`; entities md5
  `6d03239b01b317bbd01dc47607a065de`.
- Ramp column (64,-91) read NATIVE, exactly the filing's census reads:
  y58-59 stone, y60 air, y61 air, y62 dirt, y63 stone, y64 air, y65 air,
  y66 dirt, y67 grass_block. No stone_bricks. Premise holds — window GO.
- Invariant columns: (61,-91): stone to y60, air 61-64, dirt 65-66, grass 67
  (+ leaf_litter 68, oak_leaves 72). (62,-91): stone to y61, air 62-63,
  grass 64, air 65, grass 66 (+ oak_leaves 72). Both as the day-17 census.
- Spot invariants: pocket floor (61,60,-91) stone; his table (64,67,-94)
  crafting_table; scenario #3's block (65,66,-88) cobblestone (beneath it
  (65,65,-88) dirt — the cover-kill landed on an earlier day, as filed).
- Pad tops (60..63, y67, -90..-93) recorded cell-by-cell in the probe output
  (several read air at y67 — the pad surface steps; the invariant is
  before/after identity, verified below).
- Cody's .dat sha256 at window open: `13702eb7...` — byte-identical to the
  filing/charter value. Cody offline; nobody in the world but the standing
  cameraman (MagnusandMouse).

## The window
- MapProbe4 joined 18:52:05Z (spawn (37.5, 66, -99.5)); the join is the
  claim's declared act.
- Pre-probe: `#chk` set to 7; `execute store result score #chk chk if block
  64 62 -91 minecraft:stone_bricks` → "Test failed" (18:52:37Z — the cell
  was dirt, as read).
- **The SEVEN placements** (18:52:38Z–18:52:47Z), each receipted "Changed
  the block": (64,60,-91), (64,61,-91) [support fills], then (64,62,-91),
  (64,63,-91), (64,64,-91), (64,65,-91), (64,66,-91) — all
  `minecraft:stone_bricks`, in the filing's order. No other setblock.
- Post-probe: same execute-store → "Test passed" (18:52:49Z).
- `/save-all flush` → "Saved the game" (18:52:51Z). MapProbe4 quit.

## Two-store verification (the stores agree)
1. **Offline region parse** (fresh copy, `placement-ramp-20261111/post/`:
   region md5 `3908d04bbcb8da59d9dcc1f88a55a88a`): column (64,-91) reads
   stone_bricks at y60,61,62,63,64,65,66 — all seven; y67 grass_block cap
   intact; invariant columns (61,-91) and (62,-91) read IDENTICALLY to the
   pre-reads, cell for cell; spot invariants identical; pad tops identical.
2. **Scoreboard file** (fresh copy, `post/scoreboard.dat`, 188 B):
   PlayerScores contains {"Name": "#chk", "Score": 1, "Objective": "chk",
   "Locked": 1} — the server's own arithmetic read the placed block.

## Sleep-save integrity
Cody's `.dat` sha256 at window close: `13702eb7...` — byte-identical to
the pre-read. The window touched nothing of his.

## Charter §1.1 disposition
**GREEN.** The placement window executed and read back clean. §1's second
half (Gate A-R rehearsal 3/3 against the ramp AS READ BACK) is chartered
next, before any wake.
