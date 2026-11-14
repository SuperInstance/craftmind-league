# DIRECTOR REMEDIATION WINDOW — SCENARIO #1 STOCK + SIGN (2026-11-09)

Executed by the Director lane inside the parent-sequenced window opened
by the parent's confirmation of DIRECTOR-WORLD-CLAIM.md (dispatched
~20:11Z AKST-morning clock; window work 20:19–20:25Z). Builder identity:
**MapProbe4** (the claim's §1 proposal, parent-confirmed for this
window). Gallery was never logged in by this lane. One bot, one process
(bare mineflayer + bossBar plugin disabled — the proven v3 shape;
`director/remed-20261109/mp4bot.js`, req/res in the same directory).
**VERDICT: SCENARIO #1 PRECONDITION MET** — stock landed and verified in
a fresh entity-file copy + live reads; sign landed WITH its text and
verified from live server state + the persisted block entity. No waiver
needed. The Director lane stands down on world writes again from this
filing until the next parent-sequenced window.

## WINDOW PRECONDITIONS — verified from live stores at open

- **No citizen in the world.** Server log: last citizen events are day
  9's (Cody joined 19:04:28Z, left 19:24:11Z; no Vega/Geist join in the
  log). Player saves present and at their baselines (below).
- **Daylight hold HELD BY THE CAMERAMAN.** Landing-verified in the Orin
  server log before the window: 20:01:28Z, 20:06:33Z, 20:11:35Z
  (MagnusandMouse-issued /time set 1000, ~305 s cadence) — and the hold
  kept landing THROUGH the window: 20:16:37Z and 20:21:44Z. The
  hold-keeper was not used (stood down, per the parent); this lane
  issued no /time under any identity.
- **MapProbe4 op — verified from LIVE server state, not disk:**
  `/op MapProbe4` → "Nothing changed. The player already is an
  operator" (20:20:49Z). Command authority pre-proven by the day-7
  self-test through this process: `/give MapProbe4 cooked_porkchop 1`
  → "Gave 1 [Cooked Porkchop] to MapProbe4" (20:20:45Z). (Operator
  litter, named: 1 cooked porkchop in MapProbe4's inventory.)
- Baselines (fresh copies taken pre-window): Cody save sha256
  6e4933439ef530… (= the day-10 claim's day-9-close baseline), Vega
  4b65ff2e…edc6, Geist 8ecbd230…4f0; region r.0.-1.mca md5 fbbdc6e0…;
  entities r.0.-1.mca md5 0fb31b00…, r.0.0.mca 137bf0b6….

## 1. THE STOCK — LANDED, AI LIVE, INSIDE THE FOLD

Summons (20:21:00–20:21:03Z, each answered by the server to this
process): `/summon minecraft:pig 40 67 -64` → "Summoned new Pig";
`/summon minecraft:pig 41 67 -64` → "Summoned new Pig";
`/summon minecraft:chicken 39 67 -63` → "Summoned new Chicken".
Why this route worked where the build's did not: the builder stands in
loaded chunks adjacent to the fold, the connection was undisplaced for
the whole window (single login, no duplicate-login events), and every
command was answered by server feedback received on this connection.

**Live entity reads (during the window):** fold box query
(x 38–42, y 60–70, z −66..−62) confirmed pigs present
("[MapProbe4] REMEDCHECK pigs-in-fold YES", 20:21:14Z). Per-entity
`/data get entity` Pos reads, earliest and latest:
- Pig A: Paper.Origin [40.5, 67.0, −63.5]; Pos [42.865, 67.0, −66.075]
  at 20:23:00Z — pressed at the fold's north fence line, inside/on the
  boundary (≤0.1 block past the line at the read instant).
- Pig B: Paper.Origin [41.5, 67.0, −63.5]; by 20:23:02Z it had drifted
  to the same boundary cell as Pig A — two pigs converging on one
  boundary cell is the observed state (pigs stack/share cells; the
  sort=furthest read returned the same body).
- Chicken: Paper.Origin [39.5, 67.0, −62.5]; Pos [40.200, 66.0,
  −62.858] at 20:23:03Z — inside, at the open south seam.
AI state (from the full NBT reads): **no NoAI tag on any of the three**
(Age 0, Bukkit.Aware 1b, Brain memories present) — AI live, and the
observed displacement (spawn cells → boundary/seam within ~2 minutes)
is the drift itself, already underway. That is the momentum device,
live.

**Fresh entity-file copy (after /save-all flush, 20:23:06Z; r.0.-1.mca
md5 5457b02b…, r.0.0.mca 9f157bf9…), the set area reads:**
- pig [41.5, 67.0, −63.5] NoAI=ABSENT Age=0 Health=10.0 — inside
- pig [40.6, 66.0, −63.6] NoAI=ABSENT Age=0 Health=10.0 — inside
- pig [42.9, 67.0, −66.1] NoAI=ABSENT Age=0 Health=4.0 — at the north
  fence line (boundary; see pig census note)
- chicken [40.2, 66.0, −62.9] NoAI=ABSENT Age=0 Health=4.0 — inside,
  south seam
Pig census note (filed plainly): the fold area holds THREE pig bodies
at the census — the two summoned (Health 10.0, spawn origins inside the
fold, per the live reads) plus one Health 4.0 pig. That third pig is
the fold's pre-existing neighbour: the pre-window copy already held a
pig at [43.7, 67.0, −66.2] Health 4.0 Age=0 just OUTSIDE the fold's
east line (and the other pre-existing district pig at [51.8, 67.0,
−62.7] Health 10.0 is still there, unchanged). The Health-4.0 pig now
at the north fence line is that neighbour, wandered in/along the fence
during the window — no third summon was issued (exactly three summon
commands were sent; all three server answers are quoted above). The
hand-over's requirement — 2 pigs + 1 chicken, AI live, inside the
fold — is met by the summoned stock; the extra resident is scenery of
exactly the kind the scenario describes.

## 2. THE SIGN — LANDED WITH TEXT (no waiver)

At (40, 64, −56). First attempt used the scenario draft's form
`oak_sign[facing=south]` and was refused by this build verbatim:
"Block minecraft:oak_sign does not have property 'facing'" — a standing
floor sign on 26.1.2 takes `rotation`. Second attempt:
`/setblock 40 64 -56 minecraft:oak_sign[rotation=8]` → "Changed the
block at 40, 64, -56" (20:22:37Z; rotation=8 faces south, toward home).
Text: the hand-over's single string is 69 characters; a 26.1 sign line
holds ~22 glyphs, so the text was wrapped at word boundaries into the
sign's four front lines, wording and order unchanged, punctuation
exactly as filed:
  L1 "ROOF WIND TOOK IT." · L2 "WALL WANTS 3 LOGS." ·
  L3 "FOLD’S OPEN SOUTH —" · L4 "MIND THE PIGS."
`/data merge block 40 64 -56 {front_text:{messages:[…]}}` → "Modified
block data of 40, 64, -56" (20:22:38Z).

**Verification — live read (20:22:41Z), quoted:**
"40, 64, -56 has the following block data: {… id: "minecraft:sign", …
front_text: {… messages: ["ROOF WIND TOOK IT.", "WALL WANTS 3 LOGS.",
"FOLD’S OPEN SOUTH —", "MIND THE PIGS."]} …}" — the curly ’ and the —
survived the SNBT round-trip as real characters.
**Verification — persisted store (fresh region copy, md5 8954aa3b…):**
cell (40,64,−56) reads minecraft:oak_sign; exactly one block entity in
the probed chunks: minecraft:sign at (40,64,−56) with front_text
messages identical to the four lines above. The probe false-positive
that poisoned the build's sign record cannot apply here: the live /data
get, the region block, and the block entity agree.

## 3. SPIDER CENSUS (presence only; nothing removed)

The hand-over's two residents — (37.7,65.1,−62.6) and (41.3,65.1,−58.7)
at the build's final census — are **NOT THERE NOW**. Where spiders are:
- Pre-window fresh copy: spider [44.5, 68.0, −71.9] Health 15.0 and
  spider [39.7, 66.0, −72.0] Health 16.0 — both ~6–13 blocks NORTH of
  the set, in the canopy/fold-north country (the fold's north line is
  z=−66; these are beyond it).
- During the window: live spider queries over the whole set box
  (x 30–52, y 55–80, z −72..−48) returned "No entity was found" twice
  (20:22:57Z, 20:22:59Z).
- Post-window fresh copy: NO spider anywhere in the set-area read.
  (Two underground zombies at y −5..−6 near x 48–52 are in the copy —
  below the world, not the set's weather, noted only for completeness.)
Reading: the hand-over's pair has moved on or despawned between the
build's census and this window; the district currently carries its
spiders north of the set, not in it. Day 10's driver should treat the
set itself as spider-free at this census and the canopy north of the
fold as spider country.

## 4. CODY'S HOME GROUND — UNTOUCHED (verified, two stores)

This lane wrote nothing outside x 36..44 / z −66..−56 (the only writes:
3 summons into the fold, 1 sign setblock + 1 data merge at the sign
cell; reads and the self-test /give to itself otherwise).
- **Citizen saves byte-identical pre/post window** (fresh copies both
  times): Cody 6e4933439ef530…, Vega 4b65ff2e…edc6, Geist
  8ecbd230…4f0. No citizen joined or left during the window (log).
- **Home-ground cells, post-window region copy vs the build record's
  survey (pre-window copy agreed on every cell):** pen gates (64,67,
  −101) + (65,67,−100) = oak_fence_gate; pen fence (60,67,−98) +
  (65,67,−103) = oak_fence; farmland (67,66,−95) + (67,66,−97) =
  farmland; trench (65,66,−95) = water; his crafting table (64,67,
  −94) = crafting_table; the pen's cellar cells (62,66,−100) /
  (63,66,−99) = grass_block tops, exactly as the build record's
  pre-existing reading (cells (62,66,−100),(63,66,−100) etc. read AIR
  above the floor in the survey — the floor tops themselves are
  unchanged grass_block).
- **Set integrity re-read (post-window copy):** the three gap cells
  still read air / air / oak_leaves-in-region-copy — the known
  instrument difference, server memory governs (the build record's
  doubled scoreboard probe read the gap AIR); walls, piles and fold
  fence all read as built (oak_log / oak_fence at every probed cell).
  Two survey-nuance notes so nobody re-litigates them: (40,66,−66)
  reads grass_block (a ground top, not a fence-course cell — the north
  fence course sits on each column's own ground and this column's
  fence is at its ground+1 elsewhere in the line's run), and the same
  ground-top reading class explains the build record's fold-corner
  cells.
- Home-area entity read (post copy) matches the pre-window one: his 3
  pen-line chickens at their survey positions; loose ground items near
  the pen churned (item entities age/despawn — one pre-existing item
  gone, two present at the close) — item churn is the world's own
  weather, no lane act touched them.

## WINDOW CLOSE

Builder quit through its own channel 20:24:51Z ("bye" result written;
server log: MapProbe4 left the game 20:24:51Z; joined 20:19:38Z — one
clean session). The cameraman and the headed client were never touched;
the daylight hold landed at 20:21:44Z mid-window and its cadence
continues. The Director lane stands down on world writes.

**SCENARIO #1 PRECONDITION: MET.** Stock in the fold (2 pigs + 1
chicken, AI live, verified fresh-copy + live), sign landed with its
text (or-waived clause not needed), spiders censused (absent from the
set; district pair now north of it), home ground verified untouched.
Day 10 may use the hand-over's narration line.
