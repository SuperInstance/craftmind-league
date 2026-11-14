# PLACEMENT WINDOW — SCENARIO #3 ("ONE OF SEVEN"), DAY-12 GATE A
## Executed 2026-11-10T02:58Z–03:02:31Z by the day-12 lane (builder identity: MapProbe4)

Filed under the claim regime (`pulse/DIRECTOR-WORLD-CLAIM.md`): the Gate A
addendum was appended to the claim BEFORE the window opened (2026-11-10T02:58Z),
naming the identity (MapProbe4), the district (step box x 63..66, z −90..−87),
the single cell (65,66,−88), and the expected side-effect. Sequencing guard
held: Gate B's pre-checks (relay, saves, deaths baseline) had passed their
reads before this window opened (see the day-12 charter §2/§3 and the day
record); the charter was filed before the window.

## Pre-reads (fresh copies, 2026-11-10T02:57Z, `placement-s3-20261110/pre/`)
- Region md5 `fa93604dc31961220e8bc3dc42fd5fb5`; entities md5
  `544a2772a34bc91650d2c0d79c45159a`. (Differ from the premise census's
  `309a625c…`/`e6d2b3b…` — the world lived a played day 11 in between; the
  comparison that binds is cell-by-cell, below.)
- Element cell (65,66,−88): **minecraft:air** — premise holds.
- Invariant cells: (65,67,−88) air; (65,66,−89) grass_block; (64,66,−88)
  dirt; (64,67,−88) grass_block; (66,66,−88) air — all as filed.
- Beneath the element: (65,65,−88) **grass_block** — premise holds.
- Canopy nuance: (64,68,−88) reads `leaf_litter[facing=south,segment_amount=2]`
  (the scenario filing's own probe read "air" for this cell; leaf litter is
  ground cover, not a canopy block — the step's function is unchanged).
- His-ground spot reads (14 cells): crafting table (64,67,−94), farmland
  (67,66,−95..−97), trench water (65,66,−95), pad tops (60..62,66,−93),
  pen gates (64,67,−101)/(65,67,−100), hollow step (71,64,−88) dirt +
  (71,65,−88) oak_planks, sleep dip (63,64,−90) stone + (63,65,−90) dirt —
  ALL unchanged from the premise census.
- Item entities in the district: none (four eggs only, at the pen and far
  east — salience S5 confirmed again).
- Cody's sleep-save at window open: sha256 `f88a88a2…ca93`, pos
  (63.30, 64, −90.44), hp 20, food 20, cobblestone 1 — byte-identical to the
  day-11 close `.dat` census read.
- Join/leave audit at open: last joins Cody 00:59:04Z (left 01:07:06Z),
  Gallery left 01:11:40Z; NOBODY in the world. Daylight landed at open:
  MagnusandMouse `/time set 1000` at 02:56:46Z (the standing cameraman,
  refresh ON). chatVisibility:1 confirmed on the client.

## The window
- 03:00:58Z — MapProbe4 joined (spawn (37.5, 66, −99.5)); the join is the
  claim's declared act.
- Pre-probe: `/scoreboard players set #chk chk 7`;
  `/execute store result score #chk chk if block 65 66 -88 minecraft:cobblestone`
  → "Test failed" (the cell was air, as read).
- **03:01:48Z — the ONE placement**: `/setblock 65 66 -88 minecraft:cobblestone`
  → server: "Changed the block at 65, 66, -88". No other setblock in the window.
- Post-probe: the same execute-store → **"Test passed"** (03:02:12Z);
  `/save-all flush` → "Saved the game" (03:02:17Z).
- 03:02:30Z — MapProbe4 left the game. Window closed.

## Two-store verification (the stores agree)
1. **Scoreboard file** (fresh copy, `placement-s3-20261110/post/scoreboard.dat`,
   188 B, taken after the flush): PlayerScores contains
   `{"Name": "#chk", "Score": 1, "Objective": "chk", "Locked": 1}` — the
   server's own arithmetic read the placed block.
2. **Offline region parse** (fresh copies, `placement-s3-20261110/post/`:
   region md5 `182848103b57b729662efe8953cf259e`, entities md5
   `aca1ecbf5211cbc1b6dca185e72a0490`): (65,66,−88) reads
   **minecraft:cobblestone**; all five invariant cells read identically to the
   pre-reads; all 14 his-ground spot reads identical.

## The expected consequence — DID NOT OCCUR this time
(65,65,−88) read **grass_block** in the immediate post-placement parse
(03:02Z) — the cover-kill the scenario filing predicted did NOT happen at
placement. It DID happen later: the post-day census (04:42Z) reads
(65,65,−88) = **dirt**. Filed as measured: the conversion landed sometime
between the placement and the post-day census (grass under a full opaque
block converts on the world's own tick schedule, not at the setblock). The
consequence belongs to the placement either way; its TIMING differs from the
scenario-#2 precedent, where the parse already read dirt in-window.

## Sleep-save integrity
Cody's `.dat` sha256 at window close: `f88a88a2…ca93` — byte-identical to the
pre-read. The window touched nothing of his.

## Incidents in the window (lane-owned, both recovered in-window)
1. The first three probe requests were written in the wrong channel shape
   (`verb`/`cmd` fields instead of the bot's `cmd`/`text`) and were refused
   "unknown cmd" — no server command was sent; the probes were re-issued in
   the correct shape and receipted. Filed because a refused probe that LOOKS
   sent is exactly how a verification silently never happens.
2. The bot's result file duplicated the p3 result line (two identical
   "Test passed" rows) — a channel echo in the res file, not two executions;
   the server log carries exactly one such command (03:02:12Z).
