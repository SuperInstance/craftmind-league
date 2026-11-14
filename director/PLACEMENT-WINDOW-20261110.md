# DIRECTOR PLACEMENT WINDOW — SCENARIO #2 TREAD (2026-11-10)

Executed by the placement-window lane inside the parent-sequenced
window claimed in `pulse/DIRECTOR-WORLD-CLAIM.md` (addendum filed
2026-11-10T00:15Z, BEFORE any placement). Authorisation: Casey's
"build it all" (2026-11-09) + the parent's sequencing; Gate A of
`pulse/DAY11-CHARTER-DRAFT-20261109.md` §2. Op identity: **MapProbe4**
(parent-assigned; scenario #1 remediation precedent). Gallery was
never logged in by this lane. One bot, one process (bare mineflayer +
bossBar disabled — `director/remed-20261109/mp4bot.js`, Node
v22.23.4 via the nvm absolute path; req/res/console + probe scripts +
pre/post copies in `director/placement-s2-20261110/`).

**VERDICT: GATE A MET.** The one element stands at (65, 66, −88) as
`minecraft:oak_log[axis=z]`, verified twice from two stores. One
consequence is filed loudly in §5 (the grass beneath the tread became
dirt — the placed block's own physics, not a second act). The
hand-over precondition in SCENARIO-002 is satisfied; the day-11 lane
may be handed the scenario and its line.

## WINDOW TIMES

- Claim filed: 2026-11-10T00:15Z (`pulse/DIRECTOR-WORLD-CLAIM.md`
  addendum).
- Bot in: MapProbe4 joined 2026-11-10T00:15:42Z (server log; from
  192.168.0.78, entity id 105266, spawn (37.5, 66, −99.5)).
- Placement: 2026-11-10T00:16:38Z (server log).
- Bot out: MapProbe4 left 2026-11-10T00:17:33Z — one clean session,
  no duplicate-login events.
- Readback filed: this filing (~00:20Z). Window closed.

## 1. OPEN CHECK — NO CITIZEN LIVE OR IMMINENT

Server-log join/leave audit (Orin `~/minecraft-server/logs/`):
2026-11-09 log's last citizen event is **Cody left
2026-11-09T22:05:59Z** (day 10's close; the day-10 op bot, Gallery,
left 22:08:48Z). The 2026-11-10 log contains **no join or leave
lines at all** before this window — only the cameraman's commands.
No citizen day is running; none is scheduled within the hour (day 11
exists only as an unlaunched charter draft).

## 2. DAYLIGHT HOLD — LANDED, ISSUER-SPECIFIC, THROUGH THE WINDOW

The cameraman holds daylight (MagnusandMouse-issued `/time set
1000`, each landing confirmed by the server's result line
"Set minecraft:overworld to 1000 tick(s)"): 23:35:30Z, 23:40:34Z,
23:45:43Z, 23:50:53Z, 23:56:03Z (Nov 9); **00:01:10Z, 00:06:55Z,
00:12:09Z and — inside this window — 00:17:23Z** (Nov 10). This lane
issued no /time under any identity. The cameraman (Orin pid 855297)
was not stopped, edited, or reconfigured; **chatVisibility:1**
verified in the client's `options.txt` after the window.

## 3. PRE-READS — FROM FRESH READ-ONLY COPIES (all as filed)

Copies taken 2026-11-10T00:15Z (`placement-s2-20261110/pre/`):
region r.0.-1 md5 `50a69ddf…`, entities r.0.-1 md5 `c6f25b9c…`,
Cody .dat 1,889 B. Offline parse with the fleet mcprobe (the
scenario-#2 census instrument; `probe_cells.py`). Block comparisons
are by base block id — the palette carries natural block-state
properties (grass_block[snowy=false], farmland[moisture=7],
water[level=2], etc.), recorded raw in the probe output.

- **(a) Tread cell (65, 66, −88): `minecraft:air`** — as filed.
- **(b) Invariant cells — all six as filed:** (65,65,−88)
  grass_block[snowy=false]; (65,67,−88) air; (65,66,−89)
  grass_block[snowy=false]; (64,66,−88) dirt; (64,67,−88)
  grass_block[snowy=false]; (64,68,−88)
  leaf_litter[facing=south,segment_amount=2].
- **(c) Cody's .dat sha256 =
  `dae53b9acc5ec10a1d2b6ec7d91bbec918a587edfd3da751b7a1d26db019752c`**
  — byte-identical to the day-10 close value recorded in
  `pulse/DAY11-RIG-20261109.md` §1 and
  `floor/run/day11/snapshot.json` (Pos (70.302, 64, −88.579),
  hp/food 20/20, 30 porkchops). He wakes where day 10 left him.
- Bonus baseline: every his-ground spot read (§6) was also taken
  pre-placement and matched, so the post-placement reads compare
  against this window's own baseline, not only the older surveys.

No pre-read disagreed. The window proceeded.

## 4. THE ONE PLACEMENT — RECEIPT

One command, issued by MapProbe4 through its own channel
(req id `setblock1`, result written 2026-11-10T00:16:40Z):

`/setblock 65 66 -88 minecraft:oak_log[axis=z]`

Server answer, received on this process and in the server log
(00:16:38Z): **"Changed the block at 65, 66, -88."** Nothing else
was placed, cut, filled, moved, or summoned. The bot's remaining
commands were reads and the verification probe (§5) plus
`/save-all flush` and its own quit.

## 5. VERIFICATION — TWICE, FROM TWO STORES

**(a) Live server state — the scoreboard-file probe** (SCENARIO-002
§5; the scenario-#1 build's instrument). Through the op channel:
`/scoreboard players set #chk chk 7` → "Set [chk] for #chk to 7"
(sentinel, 00:16:57Z); `/execute store result score #chk chk if
block 65 66 -88 minecraft:oak_log[axis=z]` → server feedback **"Test
passed"** (00:16:58Z); `/save-all flush` → "Saved the game"
(00:17:00Z). A fresh copy of the persisted `world/data/minecraft/
scoreboard.dat`, parsed offline, reads **#chk / chk = 1** — the
sentinel 7 was overwritten by the store, so the value is the
server's own test result, not a default. (A `/data get block` was
also issued; it returned "The target block is not a block entity" —
an oak log carries no block-entity data; that is why the probe, not
data get, is this programme's live read for plain blocks.)
**Store (a) reads (65, 66, −88) = oak_log[axis=z].**

**(b) Offline region parse** — fresh post-flush copy
(`placement-s2-20261110/post/region-r.0.-1.mca`, md5 `dae7ef90…`),
same probe: **(65, 66, −88) = `minecraft:oak_log[axis=z]`.**
Both stores agree. A single-pass readback was not relied on.

**Invariant re-reads (post copy):** (65,67,−88) air ✓;
(65,66,−89) grass_block ✓; (64,66,−88) dirt ✓; (64,67,−88)
grass_block ✓; (64,68,−88) leaf_litter ✓ — and **(65,65,−88), the
cell directly beneath the tread, now reads `minecraft:dirt`**
(pre-read: grass_block). FILED LOUDLY, per the scenario's own rule
("all unchanged or the window record says so, loudly"): this is not
a second act and not an improvisation — no further command was
issued. Grass converts to dirt when an opaque block covers it; the
log at y66 sits directly on the grass at y65, and the conversion is
the specified placement's own mechanical consequence, inseparable
from it (the same grammar reads throughout this terrain — e.g. the
face column (64,−88) stands dirt at 65..66 under its grass top at
67). The window placed exactly one block; the world's rule did the
rest. Nothing was done to reverse it — reversing it would itself be
a second world edit, outside this window's spec.

## 6. HIS GROUND — SPOT READS (post copy vs this window's baseline)

All unchanged, identical pre and post: crafting table (64,67,−94)
crafting_table; farmland (67,66,−95), (67,66,−96), (67,66,−97)
farmland[moisture=7]; trench (65,66,−95) water[level=2]; pad tops
(60,66,−93), (61,66,−93), (62,66,−93) grass_block; pen gates
(64,67,−101) and (65,67,−100) oak_fence_gate (closed); his hollow
step (71,64,−88) dirt and (71,65,−88) oak_planks — his work,
untouched. Citizen saves were not written by anyone this window:
Cody's .dat was read once, at the pre-read (see 3c); it is
written only while he is in the world, and the log shows he
never joined (see 1) - no post-window re-copy was taken or
needed. Vega and Geist were never in the world and their
ground reads as surveyed. No citizen joined or left during
the window (server log, see 1).

## 7. WHAT THIS WINDOW DID NOT DO

No summons, no stock, no sign, no second setblock, no teleport of
any body, no /time, no cameraman contact, no clean-frame toggle, no
citizen contact of any kind. The prediction
(triple-021-scenario-002-stone-hollow-prediction) stands pre-filed
and unscored until day 11 is played and the Director's post-day
census scores it by its rule.

**GATE A: MET.** The tread stands. Scenario #2's hand-over line is
now owed to the day-11 lane with this scenario.

— Placement-window lane, 2026-11-10.
