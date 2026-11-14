# PLACEMENT WINDOW — DAY-18 STAIR REDESIGN (DESIGN v3), GATE A
## Executed 2026-11-13T10:17Z–10:20Z by the day18-stair-redesign lane (builder identity: MapProbe4)

Filed under `pulse/day18/RAMP-REDESIGN-FILING-20261112.md` (design v3,
window v3, Amendments 1–25) and the claim regime
(`pulse/DIRECTOR-WORLD-CLAIM.md`). Authorisation: Casey, 2026-11-11
09:47 AKST — "Place the ramp, then run day 18", renewed 2026-11-12
22:20 AKST (full throttle). Claim: ledger line 388. Window open:
ledger line 389. Replica pre-proof: Amendment 25 — design v3 passed
3/3 consecutive climbs on the prov-scratch replica built from the
pre-read (attempt 25, `ramp-rehearsal-redesign25-results.jsonl`).

## Pre-reads (fresh copies, 2026-11-13T10:16Z, `redesign-20261112/window-pre/`)
- Region md5 `c702b8d4f635af53f154412464bd9a50`; entities md5
  `1832c932a6a5823e5e6449994e39e87c`.
- Programmatic audit of the nine window cells plus six invariants
  (`/tmp/winaudit.py`): PASS 15/15 — the live bowl matched the
  filing's pre-state exactly, including the standing column
  (stone_bricks y62–66 in (64,-91), grass cap y67), the lone stone
  at (63,64,-90), and water at (66,62..63,-91).
- Cody's .dat sha256 at window open:
  `13702eb7598a466f21eedaf6dde9ecef7cdedaa39ea0eed2e6b2081ba4c20ca8`
  — byte-identical to the charter value. Cody offline throughout.

## The window
- MapProbe4 joined 10:17:48Z (spawn (37.5, 66, -99.5)) via
  `director/remed-20261109/mp4bot.js`, req/res in
  `redesign-20261112/window/`.
- Pre-probes: `#chk` set to 7; `execute store result ... if block
  66 64 -91 minecraft:stone_bricks` → "Test failed";
  `... if block 64 67 -91 minecraft:air` → "Test failed". The
  premise held live.
- **The NINE setblocks** (each receipted "Changed the block"):
  clears — (63,64,-90), (64,64,-91), (64,65,-91), (64,66,-91),
  (64,67,-91), (65,66,-91), (66,65,-91), (66,66,-90), all to air;
  placement — (66,64,-91) to `minecraft:stone_bricks`. No other
  setblock.
- Post-probes: both execute-store tests → "Test passed".
  `/save-all flush` → "Saved the game". MapProbe4 quit.

## Two-store verification (the stores agree)
1. **Offline region parse** (fresh copy,
   `redesign-20261112/window-post/`: region md5
   `a5f5d685a9adb41a18600c28e3dd6dc3`): all nine cells at their
   filed post values; all six invariants identical (stance cap
   (62,64,-91) grass, pocket floor (61,60,-91) stone, water
   (66,62..63,-91), table (64,67,-94), scenario-#3 block
   (65,66,-88)). Audit PASS 15/15.
2. **Scoreboard file** (fresh copy, `window-post/scoreboard.dat`,
   md5 `2b02fc0301cf9e24537b1faa9a3a988f`): PlayerScores contains
   {"Name": "#chk", "Score": 1, "Objective": "chk"} — the server's
   own arithmetic read the placed block and the cleared cap.

## Sleep-save integrity
Cody's `.dat` sha256 at window close: `13702eb7...` — byte-identical
to the pre-read. The window touched nothing of his.

## Charter §1.1 disposition
**GREEN.** Placement executed and read back clean from two
independent stores. What remains of §1: Gate A-R rehearsal 3/3
against the stair AS READ BACK (replica rebuilt from
`window-post/`), then Gate A (live sweep + pig), Gate B, the day.
