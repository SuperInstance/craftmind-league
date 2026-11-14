# DIRECT-DRIVE DAY 2 — FEED THE HOME DISTRICT + CODY'S NEXT DAY (parent brief 2026-11-09; direct-drive run's named gap, ledger 277-278)

THE GAP THIS LANE CLOSES: the direct-drive shape is PROVEN (dip out 3x in ~2 min
each, home reached, pickaxe crafted twice, yes-and fired, zero deaths) but Cody
STARVED — food 4 -> 0 across ~100 min of combined driving because the home
district has no working food economy: an apple-decay lottery plus unreachable
wandering prey. JOB 1 stages a starter food ecology (operator stage-setting,
declared as a world edit — the showrunner stocks the set; it is NOT citizen
help). JOB 2 is Cody's next day under the proven direct-drive shape: EAT above
14 by his own actions, then the project list (pad, hut, chest, pen).

START STATE (NBT-verified at day-1 close): Cody save (75.69, 64, -105.42),
hp 0.1333 (hunger-floored on this build — cannot die of it, cannot meaningfully
play at food 0), food 0; inventory: wooden_pickaxe, crafting_table, oak_log x1,
oak_planks x3, cobblestone x4, stick x2, oak_sapling x2, oak_button x2.
Deaths 116 (abort at +3). Vega/Geist untouched (shas == baselines).

SEAM: ledger line 279 (direct-drive-day2-claim-20261109).

## INCIDENTS (lead this log; filed as they happen)

- (none yet)

## PRE-FLIGHT (2026-11-09T07:1xZ)

- Content-Length fix VERIFIED IN CODE: pulse/direct-drive.js callModel()
  httpCall sets 'Content-Length': Buffer.byteLength(body) on the model
  request (line ~79). One controlled test call through the real bridge
  path follows before launch.
- Floor forage gate in code: food <= 1 && hp <= 12 with 90 s backoff
  (the day-1 patch) — verified present in direct-drive.js main loop.
- Oracle route (VM-side osh.sh) answers; ddbridge + governor alive on
  the Thor (HTTP answers on :8912 / :8642); bridge call log readable
  for cost accounting.

## PHASE LOG

- (entries appended as they land)
- 2026-11-09T07:11Z — CLAIM filed (ledger 279). Pre-flight so far:
  Content-Length fix verified in code (callModel httpCall, line ~79);
  floor forage gate verified (food<=1 && hp<=12, 90 s backoff); bridge
  + governor alive (:8912/:8642 answer); Oracle route answers VM-side.
- 2026-11-09T07:11:09Z — CONTROLLED TEST CALL through the real bridge
  path (Node client, explicit Content-Length, full-size ~4.4k-token-
  class payload): HTTP 200, in-character JSON with the exact commanded
  cmd ("look 64 68 -93"), usage returned. Primary route PROVEN.
- 2026-11-09T07:12Z — TERRAIN CENSUS (stage-probe bot ridden in on the
  cameraman shuttle to (41.5,69,-91.5); census x52..80 / z-112..-84,
  0 unloaded; raw: pulse/stage-probe-result.json):
  * The home shelf (anchor 64,67,-93) is a broad FLAT bench, top y66,
    spanning roughly x52..69 / z-106..-95 — far bigger than the 5x5
    plan pad. The dip bowl (tops 60-64) lies SOUTH-EAST (x>=70,
    z<=-99); Cody's wake column (75,-105) tops at y62 stone, with a
    +1-step ramp west through (76,-105) y63... wait, east side: the
    bowl rises east/south-east; his proven exit runs west onto the
    shelf (day-1: bowl -> (70,66,-95) -> home in 3 gotos).
  * EXISTING OBJECTS on the shelf: crafting_table standing at
    (64,67,-94) and an oak_planks block at (63,67,-94) — day-1 placed,
    still there. Plan pad (62..66, -95..-91, y66) overlaps them.
  * NO standing water anywhere in the census box (0 water columns in
    841) — the brief's assumed water must be PLACED for the wheat.
  * NO animals within 40 of the anchor at census time (entity read:
    only the probe itself) — the district is as empty as filed.
  * One hazard cell: (65,-93) tops at y62 stone — a 4-deep pit mouth
    INSIDE the plan pad's east edge. Cody's project work will meet it.
  STAGE PLAN (all on the flat bench, all reachable on foot — the
  bench is one +1-stepped plain from the anchor; the wake->stage walk
  is Cody's own proven day-1 exit line):
  * PEN: natural hollow + fence ring. Site: x61..64, z-102..-100
    (flat y66, dist ~7.5 SW of anchor). Ring of oak_fence on the
    perimeter at y67 with ONE gate (oak_fence_gate) on the east side
    facing home; interior stays grass. Stock: 3 pigs + 2 cows + 2
    chickens (7 head — a breeding nucleus; brief band 4-6 read as
    the livestock core; chickens added as the fast egg/meat line).
  * WHEAT: plot x65..67, z-97..-95 (flat y66, dist ~3.9 E of anchor):
    water trench down the middle column (x66) at soil level, farmland
    either side (x65, x67), wheat seeds on all 6 farmland cells —
    "wheat growing by the water" within sight of the anchor.
  * Placement via the opped headed client (opsend) under cameraman
    STOP discipline; verification by probe re-read + /save-all after.
- 2026-11-09T07:13-07:15Z — JOB 1 EXECUTED + VERIFIED. Cameraman
  STOPped cleanly 07:12:55Z (its own log: "STOP file present --
  exiting cleanly"; note for the record: the stop took ~15 s from
  STOP-file creation, and my confirmation check was additionally
  delayed by pgrep self-matching my own ssh command line — the
  OPERATIONS /proc-cmdline lesson, re-learned; actual exit was
  prompt). 28 operator commands typed via opsend (focus-guarded),
  EVERY one server-log-verified as issued AND effected:
  * 07:13:28 gamemode spectator (see caveat below), 07:13:31 tp to
    (62.5, 72, -96) over the stage.
  * PEN x61..64 / z-102..-99, fence ring at y67 on flat grass y66:
    west wall x61 z-102..-99 (4), north wall z-102 x61..64 (4),
    south wall z-99 x61..64 (4), east wall x64: (64,-102), (64,-100),
    (64,-99) fence + oak_fence_gate at (64,-101) facing home.
    Post-hoc read by an independent probe bot (stage-verify): ring
    COMPLETE — 13 oak_fence + 1 oak_fence_gate, every perimeter cell
    occupied at y67, interior grass intact.
  * WHEAT x65..67 / z-97..-95: water at (66,66,-96) (air cleared
    above it), farmland at y66 on x65 and x67 columns (6 cells),
    wheat standing at y67 on all 6. Probe re-read AFTER placement:
    farmland still farmland (hydrated by the trench — no reversion),
    all 6 wheat crops standing. Dist from anchor: ~4 blocks east.
  * STOCK, all "Summoned new" in the server log, all 7 re-found
    INSIDE the pen by the probe read minutes later: pig x3, cow x2,
    chicken x2 (positions within x61.5..63.5 / z-101.5..-99.2).
  * /save-all 07:14:49 — "Saved the game". Zero command errors in
    the server log across the whole sequence.
  CAVEAT (filed, not smoothed): no "Set game mode to Spectator"
  result line for the 07:13:28 gamemode command exists in today's
  log (the last such line is 04:15:08Z). The client was already in
  Spectator from that 04:15 restoration (the binding post-incident
  state); a gamemode set to the CURRENT mode emits no change line.
  Nothing moved him out of spectator (zero GUI interaction; opsend
  types chat only). State left as found: SPECTATOR. Will re-confirm
  from the relaunch screenshot.
  Reachability: pen, wheat, table and anchor all stand on the one
  flat bench (top y66, single +1 steps); the wake site in the bowl
  (75,-105) exits WEST onto this bench — the line Cody himself
  proved three times on day 1 (bowl -> (70,66,-95) -> home). No
  stage element sits across any rim.
- 2026-11-09T07:15:47Z — Cameraman RELAUNCHED after the stage work;
  hold VERIFIED LANDED 07:15:45Z (/time set 1000 in the server log;
  weather clear at start). Cycle cadence back at 300 s.
- 2026-11-09T07:18Z — LAUNCH PRE-FLIGHT FILED (ledger 281). Launch
  immediately after: driver spawned Cody at (75.7, 64.0, -105.4)
  hp 0.1333 food 0 deathsBaseline 116 — EXACTLY the NBT-verified
  day-1 closing state (no stale-read surprise this time; the spawn
  read matches the filed baseline to the digit). Route: PRIMARY
  DeepInfra from cycle 1 — no failover. Cycle 1 say: "Morning, empty
  belly. Pigs in my own pen, they tell me — let's go see if the
  world's really been that kind." cmd: goto 70 66 -100 — west, up
  out of the bowl, pen-ward. Day 2 is live.

- 2026-11-09T07:22Z — INCIDENT: FLOOR FORAGE-GATE MISFIRE (leads; found
  in the trace within 5 min of launch): the patched emergency-forage
  gate (food<=1 && hp<=12) is TRUE from spawn (food 0, hp 0.13) and
  the penned stock is inside its perception range — so the floor has
  pre-empted EVERY cycle since cycle 1: 8 consecutive floor-forage
  hunts (07:18:07-07:21:49Z) chasing pen animals ~17 blocks away
  across the bowl rim, each ending "the X escaped or the fight timed
  out", the body still at/near the wake site making only the hunt's
  own approach progress (cycle 1's driver goto reached (72.3,62,
  -102.6)). The 90 s re-fire backoff is DEAD CODE as written: it sets
  floor.lastForageAt then hunts anyway (the if/else has no else —
  the hunt executes regardless) — day-1's patch, never exercised in
  anger until this launch (on day 1 prey was never in range at the
  gate's conditions... and day-1's late run DID show the same loop:
  "emergency forage repeated without advancing"). Compounding design
  fault (mine to name, driver-class): at food 0 the gate should yield
  to the DRIVER — the driver has the map, the scene and the pen's
  location; the floor hunt has none of those, only a compass. The
  floor was designed as a last resort under a functioning driver,
  not as the primary mover at spawn. ACTION (floor-level code fix,
  chartered class — the floor stays code): (1) repair the backoff
  (a fire inside 90 s SKIPS the hunt); (2) narrow the gate so it
  cannot own the scene: forage fires only if the driver has produced
  no forward progress for 3+ minutes AND prey is within 12 blocks —
  the floor as backstop, not pilot. Driver restart on the fix; the
  restart is a lane action, filed here and in the ledger.

- WATCH 2026-11-09T07:22:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.7, 'y': 64, 'z': -105.4} hp 0.1 food 0 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 3, 'wooden_pickaxe': 1, 'cobblestone': 4, 'oak_log': 1} distHome 17.1

- WATCH 2026-11-09T07:27:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78, 'y': 65, 'z': -98.3} hp 0.1 food 0 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 3, 'wooden_pickaxe': 1, 'cobblestone': 4, 'oak_log': 1} distHome 15

- WATCH 2026-11-09T07:28:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 74.3, 'y': 63, 'z': -97.4} hp 0.1 food 0 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 3, 'wooden_pickaxe': 1, 'cobblestone': 4, 'oak_log': 1} distHome 11.2
- 2026-11-09T07:26Z — SEGMENT 2 LIVE on the forage fix (ledger
  282): spawn read back EXACTLY (75.7, 63.2, -98.4) hp 0.1333 food 0.
  The floor has NOT fired once since (the backstop holds). But the
  segment's first 15 cycles show the day's second hard truth:
  CODY IS FIGHTING THE WRONG ANIMALS. The penned stock, fenced at
  (61..64, -102..-99), SITS AT Y67 ON THE SHELF — and two pigs + a
  chicken have drifted/wandered to the fence's EAST side (probe
  verify-2 at 07:28Z: pig (63.9,67,-99.5), pig (63,67,-100.2),
  chicken (64.6,67,-100.2) — OUTSIDE the ring, east edge), i.e. in
  the driver's 24-block perception from the bowl. His perception
  names creatures but not which side of a fence they stand on; he
  has spent cycles 2-15 chasing those shelf-edge animals ACROSS
  THE RIM (attack pig x3, gotoentity x3, goto west x4 — every goto
  timing out on the (75,-98/-99) y62 step pocket, the same +2-step
  trap the triple-020 work mapped: the bowl at z-98/-99 tops y62
  with the y65 bench behind a 3-step face at x74-75). Day 1 he
  exited WEST-NORTH (via (70,66,-95)) cleanly; today the animal
  scent pulls him at the rim's worst cell. His reasoning is visibly
  sound ("the pen's got a fence and a gate... go to the pen
  itself") — his ground truth is not: he does not know the animals
  he can see are ABOVE him behind a fence, nor that the gate is
  the east cell (64,-101). This is a PERCEPTION gap (fences/levels
  invisible in his state line), not a driver failure and not a
  stage failure — the stage is exactly where it should be; he is
  being lured by its scent across unclimbable ground. NOT fixing
  mid-scene (he may yet route west-north as day 1 did; cycle 15
  has him heading for the fence line at (68,64,-101)); the
  perception gap is filed as the segment's live finding and the
  day-3 driver should get fence/level awareness in its state line.

- WATCH 2026-11-09T07:32:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 76.2, 'y': 64, 'z': -98.3} hp 0.1 food 0 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 3, 'wooden_pickaxe': 1, 'cobblestone': 4, 'oak_log': 1} distHome 13.3

- WATCH 2026-11-09T07:33:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 74.3, 'y': 64, 'z': -98.3} hp 0.1 food 0 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 4, 'oak_log': 1} distHome 11.6
- 2026-11-09T07:3xZ — ★ HE ATE. THE HEADLINE EVENT OF THE DAY: after
  ~26 cycles working the bowl — including a genuine piece of play:
  abandoning the rim fight, dropping EAST to the low grass at
  (77,63,-98) and walking the shelf south (cycles 37-38, his own
  plan, quoted in the trace) — Cody came up against the pen fence
  with a pig a block away, equipped the pickaxe, and killed it
  (cycle 41). FLOOR AUTO-EAT: porkchop -> FOOD 3 (from 0). Cycle 42
  is the judgement that deserves quoting whole: "Two pigs left in
  the pen, that's my breeding pair, so I leave them be... No —
  spare the pairs." He then took a chicken by the same route
  (cycle 43) -> FOOD 5, and at cycle 44 turned to the project list
  of his own accord: "I've been eating raw like an animal — let me
  get a furnace going. I've got cobblestone for it. First, let me
  check the wheat patch by the anchor." FOOD GOAL status: NOT yet
  reached (needs >14; at 5 and thinking about cooking — a cooked
  porkchop economy needs more animals than the nucleus holds, or
  the wheat; his restraint on the breeding pairs is correct play
  and it caps the meat path. Watch: does he breed, wait for wheat,
  or take the cows?). Note on the pen count: he reports "two pigs
  left in the pen" — the stage verify counted 3 pigs total in the
  area (1 inside + 2 outside east) + the fence-side chicken he
  took may have been the loose one; the exact post-kill census
  comes at the close read. His perception of the pen's population
  (2) vs the stage record will be reconciled in the final report —
  perception, not world, is where any gap lives.

- WATCH 2026-11-09T07:37:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 67, 'z': -99.5} hp 0.1 food 5 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 2, 'oak_log': 1, 'egg': 1, 'chicken': 1} distHome 6.6

- 2026-11-09T07:37Z — INCIDENT: CAMERAMAN DOWN (harness; self-inflicted
  by this lane during the chartered screenshot): the screenshot
  sequence's pkill matched the ssh session's own command line
  (the classic self-match: the stop command contained the pattern),
  killing the control shell before the capture could run; a second
  attempt then found the client-side CDP endpoint (:9223) refusing
  connections — the Prism client's browser/debug surface is closed
  (the client ITSELF is unaffected: FACE-CAM/CUT lines continued in
  the server log through 07:36Z and the world stays held by the
  server-side time state; but the HOLD-REFRESH machinery is the
  cameraman process, which is DOWN as of this filing). Priority now
  is singular: cameraman relaunch + landing-verified refresh before
  anything else; the screenshot is re-attempted only after the hold
  is proven again. (Prior runs took screenshots through a different
  client surface; that surface is not answering now — do not improvise
  against the client while Cody is live; the camera evidence falls
  back to the server-log FACE-CAM/CUT record + the trace/state files
  if the CDP surface stays closed.)

- WATCH 2026-11-09T07:38:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.1, 'y': 67, 'z': -99} hp 0.1 food 5 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 1, 'oak_log': 1, 'egg': 1, 'oak_fence': 1} distHome 6
- 2026-11-09T07:3xZ — CAMERAMAN INCIDENT — RESOLVED + LESSON FILED:
  the cameraman was down from my screenshot attempt (07:37Z filing);
  relaunched pid 680414 at ~07:38Z; an EMERGENCY refresh landed
  07:38:26Z and was VERIFIED LANDED in the server log; the 300 s
  cycle resumed; FACE-CAM on Cody restored. The world was WITHOUT
  refresh for ~2 min 18 s (07:36:08 -> 07:38:26) — far inside a
  Minecraft daylight window; no night exposure, Cody unharmed
  (food 5, acting throughout). LESSON, filed plainly: (1) never
  stop the cameraman for a screenshot during a live citizen run —
  the renewal procedure (which the parent's cron uses) is the only
  stop; a mid-run still is taken from the client's EXISTING surface
  or not at all; (2) the stop-pattern self-match (pkill -f matching
  the ssh command line) is a known trap — future stops use the
  bracket pattern or the STOP file. SCREENSHOT: the client CDP
  endpoint (:9223) refuses connections in this session (the
  surface prior lanes used is closed); NOT improvised against
  further (client untouched, spectator undisturbed — server log
  shows only cameraman commands). Camera evidence for the eating
  beat therefore rests on: cameraman FACE-CAM/CUT record + the
  driver trace + the state file (food 0 -> 3 -> 5 with the pig and
  chicken kills at cycles 41/43) — three independent stores, all
  agreeing. A still is re-attempted only via the renewal window.
- 2026-11-09T07:4xZ — THE PEN IS BEING CONSUMED BY ITS TENANT
  (live finding, mid-run): Cody, inside/alongside the pen after
  the kills, has (cycle ~49-50) REMOVED THE GATE for passage and
  placed it back ("Gate's down — but the pig's wandered off... I'll
  put it back so the stock stays in" — he did, cycle 50, good
  husbandry in intent), then at cycle 55 DUG OUT A FENCE SECTION
  at (62,67,-98) to exit west ("The fence right north of me is
  what's walling me in... knock this fence out and step through")
  and now carries oak_fence x1. Current position (62,67,-98.9) —
  OUTSIDE the pen's west side; the pen ring now has a gap at its
  north-west (plus the gate he replaced). Husbandry reading: a
  citizen who can dig will treat a fence as an obstacle, not an
  institution — the pen holds animals only while the citizen
  chooses not to cross it. The remaining stock CAN now wander out
  of the gap. This is scene, not failure — but the day's close
  census must count the pen as Cody left it (gap and all), and the
  "breeding nucleus" may need restocking by tomorrow's stage hand
  if the stock disperses. The gap is HIS doing and stays his.

- WATCH 2026-11-09T07:42:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 59.5, 'y': 67, 'z': -97.5} hp 0.1 food 5 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 1, 'oak_log': 1, 'egg': 1, 'oak_fence': 2} distHome 6.4

- WATCH 2026-11-09T07:43:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 51.3, 'y': 66, 'z': -93.7} hp 0.1 food 5 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 1, 'oak_log': 1, 'egg': 1, 'oak_fence': 2} distHome 12.7
- 2026-11-09T07:44Z — SEGMENT-2 ARC AT CYCLE 80 (position (50.7,66,
  -91.4), food 5, distHome 13.4): after eating, Cody dug out of
  the pen corner, came HOME (cycle ~71, "Home again, safe
  footing"), oriented on the wheat patch — and then made the
  day's most consequential misread: at cycles 72-73 he looked for
  the pen "south-west of the anchor," found "empty grass," and
  concluded the pen in the story was not real ("The world gave me
  a pen in the story, but my eyes say empty grass") — HE WAS
  STANDING ~10 BLOCKS FROM IT, having already eaten from it; the
  pen (61..64, -102..-99) sits SOUTH-WEST of the ANCHOR but he
  searched from home at the wrong bearing/scale and his creature
  perception (24 blocks) showed him nothing because the remaining
  stock had drifted to the pen's far side / out the gap he dug.
  Belief updated on absent evidence; scene inverted: he trekked
  WEST to (43..51, -91..-95) after wild animals — chased a cow
  into the oaks and lost it (cycle 76-77), failed a felltree on a
  leaves column (78), and at cycle 80 settled to dig coal in a
  pocket ("fuel is the thing I'm missing most"). Filed findings:
  (1) citizens' mental maps decay across ~30 min of dense play —
  the pen he ATE FROM became unreal to him because a later look
  found nothing; state-line memory (a "places I know" line) is a
  day-3 driver item, same family as the fence/level gap.
  (2) His food restraint is now costing him: he spares "the pairs"
  that are in fact scattered singles, and the wheat (his staged
  renewable) is still growing (planted 07:0x, ~1.5-2 game-days to
  first ripe heads at day speed; the hold freezes the clock at
  day, so growth runs at real-time random-tick pace — slow).
  (3) The >14 goal remains OPEN at food 5; paths left in-world:
  the remaining pen stock (2 pigs + 2 cows + 1-2 chickens by the
  stage census, minus dispersal through his gap), wild stock west,
  or wheat+bread later. The scene continues to ~08:26Z unless the
  hut step lands or a stop condition fires.

- WATCH 2026-11-09T07:47:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 67.4, 'y': 67, 'z': -91.5} hp 0.1 food 5 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 1, 'oak_log': 1, 'egg': 1, 'oak_fence': 2} distHome 3.7

- WATCH 2026-11-09T07:48:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 42.3, 'y': 67, 'z': -94.8} hp 0.1 food 5 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 1, 'oak_log': 1, 'egg': 1, 'oak_fence': 2} distHome 21.8
- 2026-11-09T07:49Z — THE PEN SEARCH, SECOND ACT (cycles 96-105): he
  came back east, tried the wheat (cycle 96-97: dug at (67,67,-90) —
  ONE BLOCK EAST of the patch's true east edge (66,-90..-93); the
  patch read as "not ripe or not there"; at his dig time the crops
  were age 0-1 anyway — the look cost him nothing but confirmed
  nothing), then walked the pen's neighbourhood for ~9 cycles
  (98-105) WITHOUT FINDING IT: at (58,67,-99) he stood 3 BLOCKS
  WEST of the pen's west fence (61) and reported "no fence under
  my feet... the pen's empty of stock"; at (55,67,-97) "practically
  on it" — 6 blocks short. His perception reports CREATURES and
  the 4-direction ground, never fences/structures: a fence line 3
  blocks away is INVISIBLE in his state line unless he walks into
  it. The remaining stock, meanwhile, shows "no creatures within
  24" from the pen's own doorstep — consistent with dispersal
  through his dug gap + the wander-outs (verify-2 already showed
  2 pigs + 1 chicken outside east BEFORE his kills; the kills took
  the pig and chicken at the fence; the in-pen remainder (1 pig,
  2 cows, 1 chicken by the stage census) has had ~40 min to drift
  out of a 4x3 pen through a 1-wide gap — passive mobs wander;
  a 12-block pen empties itself in well under an hour of loaded
  time). STAGE LESSON (for tomorrow's stage hand, filed plainly):
  a pen a citizen can dig out of is a pen with a half-life; the
  gap he dug at cycle 55 was the release. Stocking must assume the
  citizen breaches it — either double-ring it or accept dispersal
  and stock MORE, closer. He is now (cycle 105) chasing a wild cow
  at (30,67,-95), 21 blocks west, distHome 20.8 — day-1's failure
  mode (the open-range hunt) with better legs. Food still 5.

- WATCH 2026-11-09T07:52:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.5, 'y': 67, 'z': -96.3} hp 0.1 food 5 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 6, 'wooden_pickaxe': 1, 'cobblestone': 1, 'egg': 1, 'oak_fence': 2} distHome 4.1

- WATCH 2026-11-09T07:53:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -106} hp 0.1 food 4 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 6, 'wooden_pickaxe': 1, 'cobblestone': 1, 'egg': 1, 'oak_fence': 2} distHome 19.6
- 2026-11-09T07:54Z — FOOD TICKED 5 -> 4 (hunger drain from the
  exertion; no eating since cycle 43). State: HOME (65.3,67,-93.9),
  distHome 1.6, planks back up to 6 (he felled something in the
  106-130 stretch — the trace will show it; he also spent ~25
  cycles in the canopy by home digging leaves hunting a trunk,
  cycles 131-132). His belief about the pen has now fully inverted
  ("the pen isn't where my head thinks it is") despite having
  eaten from it at 07:3x — the day's central cognitive finding,
  restated for the record: WITHOUT a persistent places-memory in
  his state line, a citizen's world-model is only as old as his
  last perception; ~40 min of play erased a true, important fact
  and replaced it with a confident false one. This is precisely
  the "complete picture, refined at contact" problem from the
  evening's doctrine — his picture stayed complete; it stopped
  being TRUE at the pen, and no contact since has corrected it
  because the correcting contact (walking the last 6 blocks to
  the fence) keeps not happening: his searches stop at (55..58)
  and his goto targets overshoot or undershoot the ring by 3-6
  blocks every time. ~30 min of run remain (to ~08:26Z). He is
  home, safe, at food 4; the hut step is plausible from here
  (planks 6, cobble 1, table in bag).

- WATCH 2026-11-09T07:57:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.1, 'y': 64, 'z': -86.4} hp 0.1 food 4 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 6, 'wooden_pickaxe': 1, 'cobblestone': 1, 'egg': 1, 'oak_fence': 2} distHome 9

- WATCH 2026-11-09T07:58:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 69.6, 'y': 64, 'z': -86.3} hp 0.1 food 3 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 6, 'wooden_pickaxe': 1, 'cobblestone': 1, 'dirt': 1, 'egg': 1, 'oak_fence': 2} distHome 8.8
- 2026-11-09T07:59Z — FOOD 4 -> 3; he is in ANOTHER pocket, this
  one NORTH-EAST of home around (69..72, -86..-92) under a birch
  leaf wall (y70 canopy), working out of it methodically (dig,
  look, south-around, cycles 155-164) and now moving again
  (70.7,64,-88.7), distHome 8. YES-AND VERBATIM at cycle 161:
  "That's my one retry spent on the west walk — something here
  won't let me through. The scene is now: I'm boxed in this pocket
  at food 3, and food is the whole day." — the rule, in his own
  words, again. NOTE for the day-3 list: the walker's repeated
  false "arrived" reports on this ground (helm fallback eventually
  moves him) are the same triple-020 relief family — his distrust
  of the walker's position reports ("the walker's lying about my
  position", cycle 160) is EARNED, and his workaround (dig the
  toe block, try the open compass point) is the citizen-grade
  version of the league's own relief doctrine. ~26 min remain.

- WATCH 2026-11-09T08:02:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 69.6, 'y': 65, 'z': -88.5} hp 0.1 food 3 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 1, 'egg': 1, 'oak_fence': 2} distHome 7.2

- WATCH 2026-11-09T08:03:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 69.5, 'y': 65, 'z': -88.7} hp 0.1 food 2 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 1, 'dirt': 1, 'egg': 1, 'oak_fence': 2} distHome 6.9
- 2026-11-09T08:04Z — FOOD 3 -> 2. Cycles 187-196: pinned in the
  north pocket's south edge around (69..71, 65, -88..-91) — the
  walker repeatedly reports "arrived" at targets his position
  readout contradicts (his read: "the walker's lying about its
  position or the readout's stale" — likely a perceived-vs-actual
  mismatch in the helm fallback's partial moves on this relief;
  his distrust is rational either way). He keeps improvising
  (dig a lane, approach from the south, aim at the pig). NOTE the
  egg beat, cycles 193/195: "There's an egg in my pack and I'm
  not proud — wait, no, that's not eating." Correct (raw eggs are
  not food in Minecraft) and self-corrected mid-thought. ~21 min
  to the window's end; the close-out will run on time regardless
  of scene state. If he reaches the pen and eats again, the day
  upgrades; if not, the day's verdict stands as filed: ate 0->5
  peak, goal >14 NOT reached, and the two named causes (breached
  pen dispersal + perception/memory gaps) are the day-3 worklist.

- WATCH 2026-11-09T08:07:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 63, 'z': -88.6} hp 0.1 food 2 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 2, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 8.5

- WATCH 2026-11-09T08:08:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.1} hp 0.1 food 2 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 2, 'dirt': 2, 'egg': 1, 'oak_fence': 2} distHome 8
- 2026-11-09T08:09Z — FOOD 2 -> 1 (floor forage gate now ARMED by
  its numbers — food<=1 && hp<=12 — but it cannot fire usefully:
  the backstop requires a 3-minute driver stall AND prey within
  12 blocks; the driver is not stalled (he commands every ~20 s)
  and no prey is within 12. Correct behaviour by the fixed design:
  the floor's job was never to commute him.) He remains in the
  birch pocket at (70.7,63,-87.3), digging/bridging out grain by
  grain (dirt x3 collected, cobble x3 — he is MINING his way out
  of a surface pocket, slowly winning: y dropped to 63 in a hollow
  "flat in every direction" at cycle 239). One perception artefact
  worth filing: cycle 237 — "Oak planks at (71,65,-88)? I never put
  those there — the world's building around me" (his own earlier
  place actions / the table from day 1 read as alien construction;
  memory gap again, benign here, funny and diagnostic at once).
  ~16 min to close-out (08:26Z). Standing by to stop on time,
  verify, and file the day.

- WATCH 2026-11-09T08:12:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 69.3, 'y': 65, 'z': -88.6} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 3, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 6.9

- WATCH 2026-11-09T08:13:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.7, 'y': 63, 'z': -87.7} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 3, 'dirt': 4, 'egg': 1, 'oak_fence': 2} distHome 8.5
- 2026-11-09T08:14Z — FOOD 1 -> 0 (the day's arc closes where it
  began, at 0 — but by a wholly different road: he ATE today,
  twice, by his own kills at the staged pen; the zero at close is
  exertion drain across ~230 further cycles of hard ground).
  Position (66.4,66,-87.7), distHome 5.8, under the oak canopy
  north-east of home, still working west. Cycle 257 holds the
  day's most poignant line — at food 0 in the pocket he REMEMBERS
  the stage correctly again: "But the world gave me a pen full of
  pigs while I slept. That's the meal." The pen belief oscillates
  with perception, exactly as filed. Close-out at 08:26Z stands:
  stop, NBT verify, census the pen as he left it, price the day,
  file the verdict.

- 2026-11-09T08:16Z — INCIDENT: DDBRIDGE RELAY DIED MID-RUN (infra;
  found at cycle ~268, root-caused in minutes): the driver log shows
  "connect ECONNREFUSED 127.0.0.1:8912" x3 from ~08:16:3x — the
  VM-side ddbridge relay process (~/workspace/ddbridge.py, the
  DeepInfra surrogate holder) had DIED on the Muse VM (no process;
  last successful metered call 08:16:31Z in ddbridge-calls.jsonl —
  the relay served ~250 calls across both segments before dying;
  cause of death not visible from here: no log tail survived, most
  likely the VM-side parent shell/session that launched it ended).
  The driver's chartered failover fired CORRECTLY (3 consecutive
  failures -> governor fallback league-cody-driver / Qwen3-Coder-
  30B for the rest of the run) — the citizen kept playing through
  the infra failure, which is the fallback doing its designed job.
  ACTION: relay RESTARTED on the VM at ~08:17Z (ping verified
  {"ok": true}); the tunnel path Thor:8912 -> VM:8911 is live
  again for the NEXT launch, but per the driver design the current
  run STAYS on the fallback (failover is one-way, chartered) — so
  segment 2's tail (cycle ~268 to close) is fallback-driven and
  the report prices the two routes separately. Cody's position at
  the failover: (73.3,62,-101.3) — he had worked out of the north
  pocket, crossed home country, and is back at the BOWL's south
  rim (distHome 12.5), food 0. The fallback's legs got him there;
  where he ends the day is the fallback's scene now.

- WATCH 2026-11-09T08:17:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 73.3, 'y': 62, 'z': -101.3} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 5, 'egg': 1, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T08:18:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 74.7, 'y': 63, 'z': -101.8} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 5, 'egg': 1, 'oak_fence': 2} distHome 13.8
- 2026-11-09T08:21Z — FALLBACK ARC (cycles 269-282, governor
  Qwen3-Coder-30B driving): the fallback climbed him out of the
  bowl's south rim and then walked him EAST along the z-99..-100
  bench to (82.4,66,-100.3) — distHome 19.8, the far side of the
  bowl from home. Its geography is looser than the primary's (it
  speaks of a "wheat patch by the water trench" at x80-85 — the
  real patch is at (65..66,-90..-93), west; it has the shape of
  the stage story without the primary's tighter grounding) and it
  is navigating by the story as much as by the state line. This
  is the measured difference between the two drivers today, filed
  without varnish: same floor, same world; the primary's scene-
  memory and spatial discipline are visibly stronger. CLOSE-OUT
  in ~5 min regardless: the day is fully evidenced either way.

- WATCH 2026-11-09T08:22:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 76.7, 'y': 63, 'z': -100.6} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 14.8

- WATCH 2026-11-09T08:23:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 74.9, 'y': 64, 'z': -100.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 13.2

- WATCH 2026-11-09T08:27:32Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

- WATCH 2026-11-09T08:28:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

================================================================
VERDICT — DIRECT-DRIVE DAY 2 (filed 2026-11-09T08:3xZ; world
evidence only; running log above is the process record)
================================================================

JOB 1 — THE STAGE (operator stage-setting, ledger 280; verified
by independent probe re-reads at 07:15Z and at close):
- PEN: ring x61..64 / z-102..-99 at y67 (oak_fence; gate
  oak_fence_gate at (64,67,-101) facing home), floor grass y66,
  on the flat shelf SW of the anchor. Stocked at placement
  (07:15:20Z probe census, all inside the ring): pigs x3
  (62.5,-99.9 / 63.5,-100.5 / 62.5,-101.5), cows x2 (63.5,-101.5 /
  61.5,-100.5), chickens x2 (62.5,-99.2 / 63.5,-99.5).
- WHEAT: 6 farmland cells at y66 — (65,-95..-97) and (67,-95..-97)
  — water trench cell (66,66,-96) between them, wheat standing at
  y67 on all 6, ~4 blocks east of the anchor (64,67,-93).
- REACHABILITY: pen, wheat, table, anchor all on the one y66-67
  shelf (stage file §, 07:1xZ); Cody himself proved it in play —
  he reached the pen fence from the bowl by his own route
  (cycles 37-41) and ate there.

JOB 2 — THE DAY (two segments; seg 1 07:17:33-07:22:24Z lost to
the floor misfire, ledger 282; seg 2 07:26:44-08:26:21Z, 295
cycles: 267 primary DeepInfra + 26 fallback governor + failover
gap; trace 293 cycle rows + 9 floor-forage + 1 failover):
- ★ DID HE EAT: YES — the first eating of the direct-drive era.
  Cycle 41 (primary): killed a pig at the pen fence with the
  wooden pickaxe; floor auto-eat: porkchop -> FOOD 3 (from 0).
  Cycle 43: killed a chicken at the fence; auto-eat -> FOOD 5.
  PEAK FOOD 5 (~07:37Z). He then DRAINED 5 -> 0 across ~230
  further cycles of exertion on broken ground and ended at
  food 0. GOAL (>14) NOT REACHED.
- HIS JUDGEMENT, verbatim (cycle 42): "Pig's down and I've got a
  porkchop — ate one already, food's up to 3. Two pigs left in
  the pen, that's my breeding pair, so I leave them be... No —
  spare the pairs." (His count was perception's, not the world's:
  3 pigs were staged, 2 outside the ring's east edge by then —
  see below.) Also cycle 44: "I've been eating raw like an
  animal — let me get a furnace going. I've got cobblestone for
  it." The furnace was never crafted (he never again held 8
  cobble at a table in one stretch).
- PROJECT LIST: pad NOT built; hut NOT started; chest NOT
  crafted; pen — the staged pen was USED, breached, and partly
  repaired by the citizen: he removed and REPLACED the gate
  (cycle 50, verified oak_fence_gate back at (64,67,-101) at
  close), dug out fence at (61,67,-99) [close read: air, y66 air
  beneath — a hole in the ring's NW] and at (62,67,-101)
  replaced it with HIS OWN cobblestone (62,67,-101)=cobblestone
  on dirt — his repairs are in the world. Other world edits by
  him: cobble placed (74,64,-98) cycle 31 (his bowl stair),
  dirt+planks bridging in the north pocket (cycles 169-170, 233).
- DEATHS: 0 (116 at open, 116 at close; deaths.jsonl 116 lines,
  last entry 04:57:38Z; server log's only Cody death lines today
  are 115/116 from the earlier lane).
- YES-AND, verbatim: cycle 4 — "Two tries at the animals and the
  ground's beaten me both times. That's the rule — the
  interruption IS the plan. I'm going up, not across." Cycle 161:
  "That's my one retry spent on the west walk — something here
  won't let me through. The scene is now: I'm boxed in this pocket
  at food 3, and food is the whole day."
- THE PEN AT CLOSE (probe re-read 08:3xZ): ring standing except
  (61,-99) gap; gate in place; HIS cobble patch at (62,-101);
  STOCK WITHIN 30 BLOCKS OF PEN CENTRE: ZERO. The staged animals
  are gone from the district — 2 eaten by Cody; the rest (1 pig,
  2 cows, 1 chicken by the stage census) dispersed through the
  breach and wandered beyond 30 blocks during ~70 min of loaded
  time (or despawned out of loaded range; the read cannot
  distinguish, and the report doesn't pretend to). The nucleus
  did NOT survive contact with its citizen.
- THE WHEAT AT CLOSE: ALL 6 CROPS AT AGE 7 (fully ripe), soil
  still farmland, water cell intact. The district's renewable is
  READY and was never harvested — he dug one block east of it
  (cycle 96) and read it as "not ripe or not there"; at that hour
  it was in fact unripe. By close it would have fed him: 6 wheat
  = 2 bread = 10 food, plus seeds to replant. Tomorrow's scene
  opens on ripe wheat.
- FINAL SAVE (NBT-verified from the Orin after the 08:26:21Z
  leave; save position is the driver's last commanded approach —
  the disconnect wrote Pos (68.31, 67.0, -94.97), ON THE HOME
  SHELF, ~5 blocks from the anchor): Health 0.1333, foodLevel 0;
  inventory: leaf_litter x1, oak_sapling x2, crafting_table x1,
  oak_planks x5, wooden_pickaxe x1, cobblestone x4, dirt x3,
  egg x1, oak_fence x2, feather x1, oak_button x2, stick x2.
  (Day-1 items oak_log x1 was consumed — planks crafted/spent in
  play; nothing else lost.) Vega.dat sha 4b65ff2e.. == baseline;
  Geist 8ecbd230.. == baseline — untouched.
- HOLD: landing-verified refreshes continued through the close
  (last in the window 08:23:50Z); cameraman pid 680414 live,
  FACE-CAM on Cody. The world stays held.
- COST (receipts): DeepInfra (ddbridge log, VM): seg 1 = 1
  metered call $0.0002; seg 2 primary = 259 calls, 1,118,219
  prompt + 16,672 completion tokens, $0.0798. Day-2 DeepInfra
  total $0.0800. Governor fallback: 26 driven cycles
  (~08:16-08:26Z) + the failover-trigger failed calls; the
  governor's own log does not break out league-cody-driver rows
  in a greppable form from here — filed as 26 cycles, mind-time
  not separately metered in this read (day-1's fallback priced
  63 calls / 139.2 mind-s for comparison).

WHY THE GOAL FAILED (the deficit, plainly — two causes, both
named in the running log as they happened):
1. THE PEN'S HALF-LIFE. A fence a digging citizen treats as an
   obstacle is a container with a half-life of minutes once he
   is inside it. He breached it for honest reasons (egress), the
   stock walked out, ate 2 of 7, and the rest dispersed. The
   stage design (single ring, diggable) did not survive the
   citizen it was built for. fault_owner: prompt (the stage
   design was mine/the brief's shape), with the citizen's
   behaviour correct throughout.
2. PERCEPTION + MEMORY. His state line shows creatures and
   4-direction ground, never structures: a fence 3 blocks away
   is invisible until walked into; and without a places-memory,
   the pen he ATE FROM became "a story, not a larder" within
   ~40 min (cycles 73, 98-103, 135-138 verbatim). He searched
   for it five times, stopping 3-6 blocks short each time. The
   wheat miss (one block east + unripe) compounded it.
WHAT WORKED, in evidence order: the direct-drive shape again
(extraction from the bowl by a self-found east-drop route;
pen reached; kills made; gate husbandry; yes-and twice in his
own words); the FIXED floor (zero floor interference across 295
cycles — the backstop never fired because the driver never
stalled with prey within 12; day-1's misfire class is closed);
the failover (citizen played through a dead relay without a
beat); his food ethics (spared the "pairs", sought a furnace).
DAY-3 WORKLIST (from this day's evidence, not theory):
(a) driver perception: structures/fences in the state line +
    a persistent places-known line (pen, wheat, table, home)
    written from HIS OWN visits — the memory must be his
    evidence, not operator coordinates;
(b) stage: restock the pen as a DOUBLE ring or accept dispersal
    and stock more, closer; the wheat is ripe NOW — tomorrow's
    opening situation can name it as a person would ("the wheat
    by the water is yellow") only if a stage hand verifies it
    still stands at wake time;
(c) relay resilience: the ddbridge must not die with a VM shell
    session — run it detached/supervised before the next launch;
(d) the walker's false "arrived" reports on relief remain the
    deepest harness drag (his distrust is earned; ~1/3 of his
    cycles bought no displacement).
fault_owner summary: stage/pen design = prompt; perception &
memory gaps = harness (driver state line); relay death = harness
(infra); Cody's play = no fault found.

- CORRECTION (same filing, 08:3xZ): in the VERDICT above, the
  stage section's wheat line reads "water trench cell (66,66,-96)
  between them" — for the record the stage as built (stage file
  §, 07:1xZ) placed a water TRENCH down the middle column x66 at
  soil level with farmland either side; the close probe sampled
  only the single cell (66,-96), which reads water at y66 exactly
  as built. No discrepancy; the parenthetical is the probe's
  sample, the stage file is the placement record. Also for the
  record: crop ages at PLACEMENT were 0 (fresh-seeded, stage file
  + verify ts 07:15:20Z); age 7 at close is ~71 min of held-day
  random-tick growth — the hold's frozen clock does not freeze
  crop ticks while chunks are loaded.

- POSTSCRIPT (08:29Z): hold confirmed landing-verified AFTER the
  close (refresh 08:28:53Z VERIFIED LANDED; cameraman pid 680414
  live). ddbridge relay confirmed alive on the VM (ping ok) for
  the next launch — but per the verdict's day-3 item (c) it must
  be made session-proof before day 3, not merely restarted.
  Lane closed. — DIRECT-DRIVE DAY 2, end of record.

- WATCH 2026-11-09T08:32:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

- WATCH 2026-11-09T08:33:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

- WATCH 2026-11-09T08:37:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

- WATCH 2026-11-09T08:38:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

- WATCH 2026-11-09T08:42:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

- WATCH 2026-11-09T08:43:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.7, 'y': 66, 'z': -105.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 19.3

- WATCH 2026-11-09T08:47:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.7, 'y': 66.9, 'z': -94.5} hp 0.1 food 0 inv {'feather': 1, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 1, 'oak_fence': 2} distHome 2.3

- WATCH 2026-11-09T08:48:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.1, 'y': 67, 'z': -99.7} hp 0.1 food 2 inv {'feather': 3, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'chicken': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 2, 'egg': 1, 'oak_fence': 2} distHome 6.9

- WATCH 2026-11-09T08:52:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.1, 'y': 67, 'z': -95.4} hp 0.1 food 4 inv {'feather': 3, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 1, 'egg': 1, 'oak_fence': 2} distHome 2.6

- WATCH 2026-11-09T08:53:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.4, 'y': 66.9, 'z': -95.5} hp 0.1 food 4 inv {'feather': 3, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 1, 'egg': 1, 'oak_fence': 2} distHome 2.9

- WATCH 2026-11-09T08:57:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 66.9, 'z': -94.5} hp 0.1 food 6 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 1, 'egg': 2, 'oak_fence': 2} distHome 2

- WATCH 2026-11-09T08:58:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 66.9, 'z': -94.5} hp 0.1 food 6 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 1, 'egg': 2, 'oak_fence': 2} distHome 2

- WATCH 2026-11-09T09:02:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 66.9, 'z': -94.5} hp 0.1 food 6 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 2, 'egg': 2, 'oak_fence': 2} distHome 2

- WATCH 2026-11-09T09:03:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 66.9, 'z': -94.5} hp 0.1 food 6 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 2, 'egg': 2, 'oak_fence': 2} distHome 2

- WATCH 2026-11-09T09:07:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.5, 'y': 67, 'z': -97.5} hp 0.1 food 6 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 2, 'egg': 2, 'oak_fence': 2} distHome 4.7

- WATCH 2026-11-09T09:08:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.9, 'y': 67, 'z': -94.8} hp 0.1 food 9 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 2, 'egg': 2, 'oak_fence': 2} distHome 1.8

- WATCH 2026-11-09T09:12:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.5, 'y': 66.9, 'z': -94.6} hp 0.1 food 9 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 2, 'egg': 2, 'oak_fence': 2} distHome 2.2

- WATCH 2026-11-09T09:13:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 67, 'z': -95.7} hp 0.1 food 9 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 2, 'egg': 2, 'oak_fence': 2} distHome 2.8

- WATCH 2026-11-09T09:17:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.2, 'y': 67, 'z': -95.5} hp 0.1 food 9 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 2.7

- WATCH 2026-11-09T09:18:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.2, 'y': 67, 'z': -95.5} hp 0.1 food 9 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 2.7

- WATCH 2026-11-09T09:22:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 76.6, 'y': 64, 'z': -98.3} hp 0.1 food 15 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'porkchop': 1, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 13.7

- WATCH 2026-11-09T09:23:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.5} hp 0.1 food 15 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'porkchop': 1, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.6

- WATCH 2026-11-09T09:27:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.7, 'y': 63, 'z': -98.3} hp 0.1 food 15 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'porkchop': 1, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.8

- WATCH 2026-11-09T09:28:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.2} hp 0.1 food 18 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T09:32:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.4} hp 4.1 food 16 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T09:33:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.2} hp 4.1 food 16 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T09:37:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.1} hp 4.1 food 15 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.4

- WATCH 2026-11-09T09:38:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 73.3, 'y': 64, 'z': -98.6} hp 4.1 food 15 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 10.9

- WATCH 2026-11-09T09:42:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.5} hp 4.1 food 15 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.6

- WATCH 2026-11-09T09:43:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.1} hp 4.1 food 15 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.4

- WATCH 2026-11-09T09:47:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.5} hp 4.1 food 13 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.6

- WATCH 2026-11-09T09:48:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 76.3, 'y': 64, 'z': -98.3} hp 4.1 food 13 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 13.4

- WATCH 2026-11-09T09:52:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.2, 'y': 64, 'z': -98.5} hp 4.1 food 13 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T09:53:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 76.8, 'y': 64, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 13.9

- WATCH 2026-11-09T09:57:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.4} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T09:58:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:02:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:03:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:07:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:08:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:12:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:13:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:17:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:18:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:22:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:23:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:27:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:28:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:32:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:33:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:37:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:38:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 63, 'z': -98.3} hp 4.1 food 12 inv {'feather': 4, 'oak_button': 2, 'stick': 2, 'leaf_litter': 1, 'wheat': 1, 'oak_sapling': 2, 'wheat_seeds': 2, 'crafting_table': 1, 'oak_planks': 5, 'wooden_pickaxe': 1, 'cobblestone': 4, 'dirt': 3, 'egg': 2, 'oak_fence': 2} distHome 12.5

- WATCH 2026-11-09T10:42:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.5, 'y': 64, 'z': -94.5} hp 16.3 food 20 inv {} distHome 29.5

- WATCH 2026-11-09T10:43:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.5, 'y': 64, 'z': -94.5} hp 16.3 food 20 inv {} distHome 29.5

- WATCH 2026-11-09T10:47:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.5, 'y': 64, 'z': -94.5} hp 16.3 food 20 inv {} distHome 29.5

- WATCH 2026-11-09T10:48:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.5, 'y': 64, 'z': -94.5} hp 16.3 food 20 inv {} distHome 29.5

- WATCH 2026-11-09T10:52:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 42.8, 'y': 67, 'z': -94.3} hp 19.3 food 17 inv {} distHome 21.3

- WATCH 2026-11-09T10:53:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 48.7, 'y': 67, 'z': -96.9} hp 19.3 food 16 inv {} distHome 15.8

- WATCH 2026-11-09T10:57:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.5, 'y': 67, 'z': -93.1} hp 19.3 food 16 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.5

- WATCH 2026-11-09T10:58:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.5, 'y': 63, 'z': -93.1} hp 19.3 food 16 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 6} distHome 1.5

- WATCH 2026-11-09T11:02:33Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 66, 'z': -93.3} hp 19.3 food 15 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.3

- WATCH 2026-11-09T11:03:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 66.1, 'z': -94.4} hp 19.3 food 15 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 2} distHome 1.9

- WATCH 2026-11-09T11:07:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 15 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 2.4

- WATCH 2026-11-09T11:08:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.3} hp 18.3 food 15 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 2} distHome 2.4

- WATCH 2026-11-09T11:12:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 14 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 2} distHome 2.4

- WATCH 2026-11-09T11:13:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 14 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 2} distHome 2.4

- WATCH 2026-11-09T11:17:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 14 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 2.4

- WATCH 2026-11-09T11:18:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 14 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.4

- WATCH 2026-11-09T11:22:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 13 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 3} distHome 2.4

- WATCH 2026-11-09T11:23:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 13 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.4

- WATCH 2026-11-09T11:27:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.6} hp 18.3 food 13 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 2.4

- WATCH 2026-11-09T11:28:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.6} hp 18.3 food 13 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 2.4

- WATCH 2026-11-09T11:32:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.5} hp 18.3 food 12 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.3

- WATCH 2026-11-09T11:33:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.6} hp 18.3 food 12 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.4

- WATCH 2026-11-09T11:37:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 12 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 7} distHome 2.4

- WATCH 2026-11-09T11:38:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 12 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 7} distHome 2.4

- WATCH 2026-11-09T11:42:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.5} hp 18.3 food 11 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.4

- WATCH 2026-11-09T11:43:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.5} hp 18.3 food 11 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.4

- WATCH 2026-11-09T11:47:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.5} hp 18.3 food 11 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.3

- WATCH 2026-11-09T11:48:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.5} hp 18.3 food 10 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.4

- WATCH 2026-11-09T11:52:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 10 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 7} distHome 2.4

- WATCH 2026-11-09T11:53:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 10 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 2.4

- WATCH 2026-11-09T11:57:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 9 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 6} distHome 2.4

- WATCH 2026-11-09T11:58:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.4} hp 18.3 food 9 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 2.4

- WATCH 2026-11-09T12:02:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.6, 'y': 63, 'z': -92.7} hp 18.3 food 9 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 4} distHome 2.6

- WATCH 2026-11-09T12:03:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.4, 'y': 63, 'z': -92.7} hp 18.3 food 9 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 1.4

- WATCH 2026-11-09T12:07:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.9, 'y': 63, 'z': -92.4} hp 18.3 food 8 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 2

- WATCH 2026-11-09T12:08:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.3, 'y': 63, 'z': -92.7} hp 18.3 food 8 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 5} distHome 2.3

- WATCH 2026-11-09T12:12:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:13:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:17:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:18:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:22:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:23:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:27:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:28:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:32:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:33:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:37:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:38:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:42:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:43:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:47:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:48:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:52:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:53:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:57:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T12:58:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:02:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:03:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:07:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:08:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:12:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:13:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:17:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:18:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:22:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:23:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 7 inv {'leaf_litter': 2, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:27:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 6 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:28:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 6 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:32:34Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 6 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:33:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 6 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:37:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 6 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:38:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 6 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 2} distHome 1.4

- WATCH 2026-11-09T13:42:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66, 'y': 63, 'z': -92.3} hp 18.3 food 5 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 2.1

- WATCH 2026-11-09T13:43:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.2, 'y': 63, 'z': -92.3} hp 18.3 food 5 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 2.3

- WATCH 2026-11-09T13:47:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 5 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T13:48:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -92.5} hp 18.3 food 5 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T13:52:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.6, 'y': 63, 'z': -92.7} hp 18.3 food 4 inv {'dirt': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.6

- WATCH 2026-11-09T13:53:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.6, 'y': 63, 'z': -92.7} hp 18.3 food 4 inv {'dirt': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.6

- WATCH 2026-11-09T13:57:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 18.3 food 4 inv {'dirt': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.3

- WATCH 2026-11-09T13:58:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.5, 'y': 63, 'z': -91.7} hp 18.3 food 4 inv {'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T14:02:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.8, 'y': 63, 'z': -91.7} hp 18.3 food 3 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.5

- WATCH 2026-11-09T14:03:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.8, 'y': 63, 'z': -91.7} hp 18.3 food 3 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.5

- WATCH 2026-11-09T14:07:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.6, 'y': 63, 'z': -91.7} hp 18.3 food 3 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T14:08:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66, 'y': 62, 'z': -91.3} hp 18.3 food 3 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 2.6

- WATCH 2026-11-09T14:12:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 18.3 food 2 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T14:13:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 18.3 food 2 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.4

- WATCH 2026-11-09T14:17:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.5, 'y': 62, 'z': -91.7} hp 18.3 food 2 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T14:18:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.5, 'y': 62, 'z': -91.7} hp 18.3 food 2 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.4

- WATCH 2026-11-09T14:22:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.7, 'y': 62, 'z': -91.7} hp 18.3 food 2 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.5

- WATCH 2026-11-09T14:23:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.7, 'y': 62, 'z': -91.7} hp 18.3 food 2 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.5

- WATCH 2026-11-09T14:27:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.9, 'y': 63, 'z': -91.7} hp 18.3 food 1 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.6

- WATCH 2026-11-09T14:28:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.9, 'y': 63, 'z': -91.7} hp 18.3 food 1 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.6

- WATCH 2026-11-09T14:32:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.9, 'y': 63, 'z': -91.7} hp 16.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.6

- WATCH 2026-11-09T14:33:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.9, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3} distHome 1.6

- WATCH 2026-11-09T14:37:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.3, 'y': 63, 'z': -91.8} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.8

- WATCH 2026-11-09T14:38:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.6, 'y': 63, 'z': -91.4} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.7

- WATCH 2026-11-09T14:42:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T14:43:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T14:47:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T14:48:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T14:52:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T14:53:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T14:57:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T14:58:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:02:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:03:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:07:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:08:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:12:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:13:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:17:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:18:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:22:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:23:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:27:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:28:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:32:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:33:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:37:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:38:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:42:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:43:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:47:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:48:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:52:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:53:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:57:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T15:58:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:02:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:03:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:07:35Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:08:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:12:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:13:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:17:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:18:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:22:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:23:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:27:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:28:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:32:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:33:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:37:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:38:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:42:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:43:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:47:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:48:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:52:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:53:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:57:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T16:58:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:02:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:03:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:07:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:08:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:12:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:13:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:17:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:18:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:22:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:23:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:27:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:28:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:32:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:33:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:37:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:38:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:42:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:43:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:47:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:48:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:52:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:53:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:57:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T17:58:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:02:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:03:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:07:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:08:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:12:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:13:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:17:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:18:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:22:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:23:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:27:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:28:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:32:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:33:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:37:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:38:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:42:36Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:43:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:47:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:48:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:52:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:53:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:57:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T18:58:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T19:02:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T19:03:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T19:07:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 63, 'z': -91.7} hp 0.3 food 0 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1} distHome 1.3

- WATCH 2026-11-09T19:08:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.8, 'y': 66, 'z': -95.5} hp 20 food 20 inv {'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1, 'cooked_porkchop': 60} distHome 15

- WATCH 2026-11-09T19:12:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63, 'z': -91.9} hp 20 food 20 inv {'stick': 4, 'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'dirt': 1, 'cooked_porkchop': 60} distHome 2.9

- WATCH 2026-11-09T19:13:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65.7, 'y': 62, 'z': -91.6} hp 20 food 20 inv {'stick': 4, 'leaf_litter': 1, 'wheat': 1, 'wheat_seeds': 3, 'cooked_porkchop': 60} distHome 2.2

- WATCH 2026-11-09T19:17:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:18:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:22:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:23:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:27:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:28:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:32:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:33:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:37:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:38:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:42:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:43:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:47:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:48:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:52:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:53:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:57:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T19:58:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:02:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:03:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:07:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:08:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:12:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:13:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:17:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:18:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:22:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:23:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:27:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:28:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:32:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:33:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:37:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:38:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 27.5, 'y': 69, 'z': -92.5} hp 20 food 20 inv {} distHome 36.5

- WATCH 2026-11-09T20:42:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.4, 'y': 66, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 31} distHome 29.7

- WATCH 2026-11-09T20:43:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.4, 'y': 65, 'z': -92.3} hp 20 food 20 inv {'cooked_porkchop': 31} distHome 29.6

- WATCH 2026-11-09T20:47:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.8, 'y': 65, 'z': -92.3} hp 20 food 20 inv {'cooked_porkchop': 31} distHome 29.2

- WATCH 2026-11-09T20:48:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 34.8, 'y': 65, 'z': -92.3} hp 20 food 20 inv {'cooked_porkchop': 31} distHome 29.2

- WATCH 2026-11-09T20:52:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 44.7, 'y': 67, 'z': -86.7} hp 20 food 20 inv {'cooked_porkchop': 31} distHome 20.3

- WATCH 2026-11-09T20:53:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 58.5, 'y': 67, 'z': -101.5} hp 20 food 20 inv {'cooked_porkchop': 31} distHome 10.1

- WATCH 2026-11-09T20:57:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 82.8, 'y': 67, 'z': -97.7} hp 20 food 20 inv {'stick': 2, 'oak_button': 1, 'wooden_pickaxe': 1, 'cooked_porkchop': 31, 'egg': 3, 'dirt': 1} distHome 19.3

- WATCH 2026-11-09T20:58:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 88.7, 'y': 67, 'z': -100.5} hp 20 food 20 inv {'stick': 2, 'oak_button': 1, 'wooden_pickaxe': 1, 'cooked_porkchop': 31, 'egg': 3, 'dirt': 1, 'oak_log': 4} distHome 25.8

- WATCH 2026-11-09T21:02:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64, 'y': 67, 'z': -92.5} hp 20 food 20 inv {'stick': 2, 'oak_button': 1, 'wooden_pickaxe': 1, 'cooked_porkchop': 31, 'egg': 3, 'dirt': 1, 'oak_log': 4} distHome 0.5

- WATCH 2026-11-09T21:03:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 77.5, 'y': 65, 'z': -102.5} hp 20 food 20 inv {'oak_planks': 12, 'wooden_pickaxe': 1, 'oak_button': 3, 'cooked_porkchop': 31, 'egg': 3, 'dirt': 2, 'leaf_litter': 1} distHome 16.6

- WATCH 2026-11-09T21:07:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.3, 'y': 61, 'z': -110.3} hp 20 food 20 inv {'cobblestone': 2, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'egg': 3, 'oak_planks': 12, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 20.7

- WATCH 2026-11-09T21:08:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.3, 'y': 61, 'z': -108.1} hp 20 food 20 inv {'cobblestone': 2, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'egg': 3, 'oak_planks': 12, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 17.3

- WATCH 2026-11-09T21:12:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 74, 'y': 63, 'z': -103} hp 20 food 20 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 14.1

- WATCH 2026-11-09T21:13:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.3, 'y': 62, 'z': -103.3} hp 20 food 20 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 13.2

- WATCH 2026-11-09T21:17:37Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 73.3, 'y': 61, 'z': -111.3} hp 20 food 20 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 20.5

- WATCH 2026-11-09T21:18:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 74.5, 'y': 63, 'z': -105.7} hp 20 food 20 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 16.5

- WATCH 2026-11-09T21:22:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 81.4, 'y': 64, 'z': -115.7} hp 20 food 20 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 28.6

- WATCH 2026-11-09T21:23:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 82.3, 'y': 65, 'z': -116.7} hp 20 food 19 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 4, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 5} distHome 30

- WATCH 2026-11-09T21:27:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 77.9, 'y': 67, 'z': -115.3} hp 20 food 18 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 10, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 6} distHome 26.3

- WATCH 2026-11-09T21:28:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 77.5, 'y': 67, 'z': -115.3} hp 20 food 18 inv {'egg': 3, 'cooked_porkchop': 31, 'oak_button': 3, 'wooden_pickaxe': 1, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 10, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 6} distHome 26.1

- WATCH 2026-11-09T21:32:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.5, 'y': 67, 'z': -116.5} hp 20 food 20 inv {'egg': 3, 'oak_button': 3, 'wooden_pickaxe': 1, 'cooked_porkchop': 30, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 12, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 6} distHome 26.2

- WATCH 2026-11-09T21:33:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 75.5, 'y': 67, 'z': -116.5} hp 20 food 20 inv {'egg': 3, 'oak_button': 3, 'wooden_pickaxe': 1, 'cooked_porkchop': 30, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 12, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 6} distHome 26.2

- WATCH 2026-11-09T21:37:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 56.3, 'y': 68, 'z': -111.7} hp 20 food 20 inv {'egg': 3, 'oak_button': 3, 'wooden_pickaxe': 1, 'cooked_porkchop': 30, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 25, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 6} distHome 20.2

- WATCH 2026-11-09T21:38:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.5, 'y': 68, 'z': -96.5} hp 20 food 20 inv {'egg': 3, 'oak_button': 3, 'wooden_pickaxe': 1, 'cooked_porkchop': 30, 'oak_planks': 9, 'leaf_litter': 1, 'oak_log': 25, 'stick': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 3.8

- WATCH 2026-11-09T21:42:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 88.7, 'y': 67, 'z': -98.2} hp 20 food 20 inv {'egg': 3, 'stick': 3, 'oak_planks': 14, 'oak_button': 5, 'wooden_pickaxe': 2, 'cooked_porkchop': 30, 'oak_log': 21, 'leaf_litter': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 25.2

- WATCH 2026-11-09T21:43:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 81.9, 'y': 66, 'z': -97.7} hp 20 food 20 inv {'egg': 3, 'stick': 3, 'oak_planks': 14, 'oak_button': 5, 'wooden_pickaxe': 2, 'cooked_porkchop': 30, 'oak_log': 21, 'leaf_litter': 1, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 18.5

- WATCH 2026-11-09T21:47:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 82.3, 'y': 65, 'z': -96.3} hp 20 food 20 inv {'egg': 3, 'oak_log': 21, 'stick': 5, 'leaf_litter': 2, 'oak_button': 6, 'wooden_pickaxe': 3, 'cooked_porkchop': 30, 'oak_planks': 8, 'dirt': 4, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 18.6

- WATCH 2026-11-09T21:48:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 82.3, 'y': 65, 'z': -96.3} hp 20 food 20 inv {'egg': 3, 'oak_log': 21, 'stick': 5, 'leaf_litter': 5, 'oak_button': 6, 'wooden_pickaxe': 3, 'cooked_porkchop': 30, 'oak_planks': 8, 'dirt': 4, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 18.6

- WATCH 2026-11-09T21:52:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 82.3, 'y': 64, 'z': -97.4} hp 20 food 20 inv {'egg': 3, 'oak_log': 21, 'stick': 5, 'leaf_litter': 5, 'oak_button': 6, 'wooden_pickaxe': 3, 'cooked_porkchop': 30, 'oak_planks': 8, 'dirt': 7, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 18.8

- WATCH 2026-11-09T21:53:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 82.6, 'y': 64, 'z': -97.7} hp 20 food 20 inv {'egg': 3, 'oak_log': 21, 'stick': 5, 'leaf_litter': 5, 'oak_button': 6, 'wooden_pickaxe': 3, 'cooked_porkchop': 30, 'oak_planks': 8, 'dirt': 7, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 19.2

- WATCH 2026-11-09T21:57:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 78.4, 'y': 65, 'z': -98.6} hp 20 food 20 inv {'egg': 3, 'oak_planks': 17, 'stick': 5, 'leaf_litter': 5, 'oak_button': 9, 'wooden_pickaxe': 3, 'cooked_porkchop': 30, 'oak_log': 17, 'dirt': 7, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 15.5

- WATCH 2026-11-09T21:58:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 81.5, 'y': 66, 'z': -96.2} hp 20 food 20 inv {'egg': 3, 'oak_button': 11, 'oak_planks': 10, 'leaf_litter': 5, 'stick': 7, 'wooden_pickaxe': 4, 'cooked_porkchop': 30, 'oak_log': 17, 'dirt': 7, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10} distHome 17.8

- WATCH 2026-11-09T22:02:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.7, 'y': 67, 'z': -92.4} hp 20 food 20 inv {'egg': 3, 'oak_button': 11, 'oak_planks': 10, 'leaf_litter': 5, 'stick': 7, 'apple': 1, 'wooden_pickaxe': 4, 'cooked_porkchop': 30, 'oak_log': 17, 'dirt': 6, 'oak_sapling': 1, 'birch_log': 10} distHome 0.7

- WATCH 2026-11-09T22:03:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.7, 'y': 67, 'z': -92.4} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'leaf_litter': 5, 'stick': 9, 'apple': 1, 'oak_planks': 11, 'wooden_pickaxe': 4, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'oak_sapling': 1, 'birch_log': 10} distHome 0.7

- WATCH 2026-11-09T22:07:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:08:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:12:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:13:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:17:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:18:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:22:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:23:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:27:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:28:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:32:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:33:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:37:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:38:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:42:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:43:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:47:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:48:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:52:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:53:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:57:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T22:58:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:02:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:03:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:07:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:08:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:12:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:13:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:17:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:18:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:22:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:23:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:27:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:28:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:32:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:33:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:37:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:38:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:42:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:43:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:47:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:48:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:52:38Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:53:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:57:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-09T23:58:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:02:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:03:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:07:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:08:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:12:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:13:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:17:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:18:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:22:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:23:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:27:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:28:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:32:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:33:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:37:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:38:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:42:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:43:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:47:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:48:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:52:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:53:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:57:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T00:58:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 64, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 6, 'birch_log': 10} distHome 7.7

- WATCH 2026-11-10T01:02:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 68.8, 'y': 65, 'z': -86.3} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 5, 'birch_log': 10} distHome 8.2

- WATCH 2026-11-10T01:03:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 68.5, 'y': 65, 'z': -86.7} hp 20 food 20 inv {'egg': 3, 'oak_button': 13, 'stick': 7, 'leaf_litter': 5, 'oak_planks': 8, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 5, 'cooked_porkchop': 30, 'oak_log': 18, 'dirt': 4, 'birch_log': 10} distHome 7.8

- WATCH 2026-11-10T01:07:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:08:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:12:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:13:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:17:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:18:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:22:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:23:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:27:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:28:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:32:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:33:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:37:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:38:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:42:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:43:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:47:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:48:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:52:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:53:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:57:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T01:58:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:02:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:03:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:07:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:08:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:12:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:13:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:17:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:18:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:22:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:23:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:27:39Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:28:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:32:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:33:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:37:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:38:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:42:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:43:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:47:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:48:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:52:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:53:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:57:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T02:58:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T03:02:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T03:03:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T03:07:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T03:08:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_planks': 4, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T03:12:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 64, 'z': -90.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'wooden_pickaxe': 6, 'oak_button': 15, 'leaf_litter': 9, 'oak_log': 15, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 1, 'oak_planks': 4, 'cooked_porkchop': 30, 'dirt': 3, 'birch_log': 10} distHome 2.7

- WATCH 2026-11-10T03:13:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.7, 'y': 58, 'z': -88.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_planks': 16, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 8, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'dirt': 1, 'birch_log': 10} distHome 8.9

- WATCH 2026-11-10T03:17:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.6, 'y': 59, 'z': -88.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 12, 'cooked_porkchop': 30, 'oak_planks': 15, 'wooden_pickaxe': 6, 'birch_log': 10} distHome 9

- WATCH 2026-11-10T03:18:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.8, 'y': 59, 'z': -88.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'cobblestone': 15, 'cooked_porkchop': 30, 'oak_planks': 15, 'wooden_pickaxe': 6, 'birch_log': 10} distHome 9.1

- WATCH 2026-11-10T03:22:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.5} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'oak_planks': 15, 'cobblestone': 14, 'birch_log': 10} distHome 8.6

- WATCH 2026-11-10T03:23:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.5, 'y': 59, 'z': -88.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'oak_planks': 15, 'cobblestone': 15, 'birch_log': 10} distHome 8.9

- WATCH 2026-11-10T03:27:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.5} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'oak_planks': 15, 'cobblestone': 15, 'birch_log': 10} distHome 8.6

- WATCH 2026-11-10T03:28:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.5} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'cooked_porkchop': 30, 'oak_planks': 15, 'cobblestone': 15, 'birch_log': 10} distHome 8.6

- WATCH 2026-11-10T03:32:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.5} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 15, 'cooked_porkchop': 30, 'birch_log': 10} distHome 8.6

- WATCH 2026-11-10T03:33:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.4, 'y': 59, 'z': -88.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 15, 'cooked_porkchop': 30, 'birch_log': 10} distHome 8.8

- WATCH 2026-11-10T03:37:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 14, 'cooked_porkchop': 30, 'birch_log': 10} distHome 8.7

- WATCH 2026-11-10T03:38:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 12, 'cooked_porkchop': 30, 'birch_log': 10} distHome 8.7

- WATCH 2026-11-10T03:42:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'cobblestone': 13, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cooked_porkchop': 30} distHome 8.6

- WATCH 2026-11-10T03:43:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 11, 'cooked_porkchop': 30} distHome 8.6

- WATCH 2026-11-10T03:47:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.6} hp 20 food 19 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 9, 'cooked_porkchop': 30} distHome 8.5

- WATCH 2026-11-10T03:48:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.6} hp 20 food 19 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 10, 'cooked_porkchop': 30} distHome 8.5

- WATCH 2026-11-10T03:52:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.7, 'y': 59, 'z': -88.3} hp 20 food 18 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 30, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 11} distHome 9.9

- WATCH 2026-11-10T03:53:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.4} hp 20 food 18 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 30, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 11} distHome 8.6

- WATCH 2026-11-10T03:57:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.5, 'y': 59, 'z': -88.3} hp 20 food 18 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 30, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 11} distHome 8.8

- WATCH 2026-11-10T03:58:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.5, 'y': 59, 'z': -88.3} hp 20 food 18 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'apple': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 30, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 11} distHome 8.8

- WATCH 2026-11-10T04:02:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.5, 'y': 59, 'z': -86.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 17, 'cooked_porkchop': 30} distHome 10.8

- WATCH 2026-11-10T04:03:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 59, 'z': -87.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 16, 'cooked_porkchop': 30} distHome 8.2

- WATCH 2026-11-10T04:07:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72, 'y': 58, 'z': -87.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 17, 'cooked_porkchop': 30} distHome 9.6

- WATCH 2026-11-10T04:08:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.2, 'y': 59, 'z': -87.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 16, 'cooked_porkchop': 30} distHome 8.9

- WATCH 2026-11-10T04:12:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.3, 'y': 59, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 15, 'cooked_porkchop': 30} distHome 10.1

- WATCH 2026-11-10T04:13:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.3, 'y': 59, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 15, 'cooked_porkchop': 30} distHome 10.1

- WATCH 2026-11-10T04:17:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.4, 'y': 59, 'z': -87.3} hp 20 food 19 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cobblestone': 15, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cooked_porkchop': 30} distHome 8.6

- WATCH 2026-11-10T04:18:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.3, 'y': 61, 'z': -87.3} hp 20 food 19 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 13, 'cooked_porkchop': 30} distHome 10.1

- WATCH 2026-11-10T04:22:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.5, 'y': 62, 'z': -87.7} hp 20 food 18 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 30, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 12} distHome 10

- WATCH 2026-11-10T04:23:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 72.6, 'y': 62, 'z': -87.3} hp 20 food 18 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 30, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 12} distHome 10.3

- WATCH 2026-11-10T04:27:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 63, 'z': -86.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 17} distHome 9.8

- WATCH 2026-11-10T04:28:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.5} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 16} distHome 12.8

- WATCH 2026-11-10T04:32:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.5} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 16} distHome 12.8

- WATCH 2026-11-10T04:33:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:37:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:38:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:42:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:43:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:47:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:48:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:52:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:53:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:57:40Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T04:58:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:02:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:03:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:07:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:08:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:12:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:13:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:17:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:18:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 65, 'z': -82.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 12.6

- WATCH 2026-11-10T05:22:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.7, 'y': 66, 'z': -86.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 6.3

- WATCH 2026-11-10T05:23:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.7, 'y': 66, 'z': -86.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 6.4

- WATCH 2026-11-10T05:27:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 65, 'z': -83.6} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'wooden_pickaxe': 6, 'cooked_porkchop': 29, 'oak_planks': 15, 'cobblestone': 15} distHome 11.3

- WATCH 2026-11-10T05:28:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 65, 'z': -83.4} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 15} distHome 11.5

- WATCH 2026-11-10T05:32:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.8, 'y': 59, 'z': -87.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 18} distHome 8.6

- WATCH 2026-11-10T05:33:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.8, 'y': 59, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 21} distHome 8.9

- WATCH 2026-11-10T05:37:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.9, 'y': 59, 'z': -87.7} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 23} distHome 8.7

- WATCH 2026-11-10T05:38:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.7, 'y': 59, 'z': -87.8} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 23} distHome 9.3

- WATCH 2026-11-10T05:42:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 69.4, 'y': 59, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 25} distHome 7.8

- WATCH 2026-11-10T05:43:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 69.5, 'y': 59, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'dirt': 1, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 25} distHome 7.9

- WATCH 2026-11-10T05:47:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.7, 'y': 59, 'z': -86.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 30} distHome 10.2

- WATCH 2026-11-10T05:48:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.4, 'y': 59, 'z': -88.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 30} distHome 8.8

- WATCH 2026-11-10T05:52:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 59, 'z': -88.6} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 30} distHome 8.5

- WATCH 2026-11-10T05:53:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.4, 'y': 59, 'z': -86.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 30} distHome 9.9

- WATCH 2026-11-10T05:57:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.5, 'y': 60, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 30} distHome 9.4

- WATCH 2026-11-10T05:58:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 71.3, 'y': 60, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 30} distHome 9.2

- WATCH 2026-11-10T06:02:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.3, 'y': 59, 'z': -87.6} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 31} distHome 8.3

- WATCH 2026-11-10T06:03:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 70.5, 'y': 60, 'z': -87.3} hp 20 food 20 inv {'egg': 3, 'stick': 9, 'oak_log': 11, 'oak_button': 18, 'leaf_litter': 9, 'oak_sapling': 1, 'birch_log': 10, 'cooked_porkchop': 29, 'wooden_pickaxe': 6, 'oak_planks': 15, 'cobblestone': 29} distHome 8.6

- WATCH 2026-11-10T06:07:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 42.8, 'y': 67.5, 'z': -95.8} hp 20 food 20 inv {} distHome 21.4

- WATCH 2026-11-10T06:08:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:12:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:13:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:17:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:18:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:22:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:23:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:27:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:28:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:32:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:33:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:37:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:38:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:42:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:43:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:47:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:48:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:52:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:53:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 30.7, 'y': 75, 'z': -102.4} hp 20 food 20 inv {} distHome 34.6

- WATCH 2026-11-10T06:57:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 36.5, 'y': 73, 'z': -86.5} hp 20 food 20 inv {'cooked_porkchop': 32} distHome 28.3

- WATCH 2026-11-10T06:58:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 39.5, 'y': 66, 'z': -105.3} hp 20 food 20 inv {} distHome 27.4

- WATCH 2026-11-10T07:02:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 77.3, 'y': 64, 'z': -99.5} hp 20 food 20 inv {'oak_log': 1, 'oak_button': 2, 'oak_planks': 3, 'stick': 2, 'wooden_pickaxe': 1, 'egg': 1} distHome 14.8

- WATCH 2026-11-10T07:03:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 77.8, 'y': 65, 'z': -98.3} hp 20 food 20 inv {'oak_log': 1, 'oak_button': 2, 'oak_planks': 3, 'stick': 2, 'wooden_pickaxe': 1, 'egg': 1} distHome 14.8

- WATCH 2026-11-10T07:07:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:08:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:12:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:13:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:17:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:18:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:22:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:23:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:27:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:28:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:32:41Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:33:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:37:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:38:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 31.5, 'y': 68, 'z': -103.5} hp 20 food 20 inv {} distHome 34.2

- WATCH 2026-11-10T07:42:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 35.9, 'y': 64, 'z': -92.3} hp 20 food 20 inv {'cooked_porkchop': 32} distHome 28.1

- WATCH 2026-11-10T07:43:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 42.6, 'y': 67, 'z': -93.3} hp 20 food 20 inv {'cooked_porkchop': 32} distHome 21.4

- WATCH 2026-11-10T07:47:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 63, 'z': -91.6} hp 20 food 19 inv {'cooked_porkchop': 30, 'dirt': 1} distHome 2.7

- WATCH 2026-11-10T07:48:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 63, 'z': -91.6} hp 20 food 19 inv {'cooked_porkchop': 30} distHome 2.7

- WATCH 2026-11-10T07:52:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 63, 'z': -91.7} hp 20 food 18 inv {'cooked_porkchop': 30} distHome 2.6

- WATCH 2026-11-10T07:53:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 63, 'z': -91.7} hp 20 food 18 inv {'cooked_porkchop': 30} distHome 2.7

- WATCH 2026-11-10T07:57:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 63, 'z': -91.6} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T07:58:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 63, 'z': -91.6} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:02:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.3

- WATCH 2026-11-10T08:03:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.6, 'y': 62, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.6

- WATCH 2026-11-10T08:07:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -90.6} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.4

- WATCH 2026-11-10T08:08:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.5} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.8

- WATCH 2026-11-10T08:12:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.9, 'y': 62, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.4

- WATCH 2026-11-10T08:13:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.5, 'y': 62, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.1

- WATCH 2026-11-10T08:17:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:18:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.3, 'y': 61, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.8

- WATCH 2026-11-10T08:22:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.1

- WATCH 2026-11-10T08:23:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.3, 'y': 61, 'z': -89.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 4.3

- WATCH 2026-11-10T08:27:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 61, 'z': -89.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.9

- WATCH 2026-11-10T08:28:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -89.8} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.5

- WATCH 2026-11-10T08:32:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:33:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:37:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.5, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.8

- WATCH 2026-11-10T08:38:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.5} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T08:42:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.6} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:43:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:47:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.9, 'y': 62, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.4

- WATCH 2026-11-10T08:48:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:52:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T08:53:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 61, 'z': -90.4} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 3.5

- WATCH 2026-11-10T08:57:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.4} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.8

- WATCH 2026-11-10T08:58:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.6} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T09:02:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.7

- WATCH 2026-11-10T09:03:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.5, 'y': 62, 'z': -91.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.8

- WATCH 2026-11-10T09:07:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:08:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:12:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:13:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:17:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:18:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:22:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:23:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:27:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:28:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:32:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:33:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:37:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:38:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.9

- WATCH 2026-11-10T09:42:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.4} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.8

- WATCH 2026-11-10T09:43:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -91.4} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 2.8

- WATCH 2026-11-10T09:47:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.3, 'y': 61, 'z': -89.7} hp 20 food 20 inv {'cooked_porkchop': 29} distHome 4.2

- WATCH 2026-11-10T09:48:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.3, 'y': 61, 'z': -89.6} hp 20 food 19 inv {'cooked_porkchop': 29} distHome 3.8

- WATCH 2026-11-10T09:52:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.5, 'y': 61, 'z': -90.7} hp 20 food 19 inv {'cooked_porkchop': 29} distHome 3.4

- WATCH 2026-11-10T09:53:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 61, 'z': -89.3} hp 20 food 18 inv {'cooked_porkchop': 29} distHome 4

- WATCH 2026-11-10T09:57:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.6, 'y': 61, 'z': -90.7} hp 20 food 18 inv {'cooked_porkchop': 29} distHome 3.3

- WATCH 2026-11-10T09:58:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.6, 'y': 61, 'z': -90.7} hp 20 food 18 inv {'cooked_porkchop': 29} distHome 3.3

- WATCH 2026-11-10T10:02:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 61, 'z': -89.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.6

- WATCH 2026-11-10T10:03:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 61, 'z': -90.4} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.5

- WATCH 2026-11-10T10:07:42Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 62, 'z': -89.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.4

- WATCH 2026-11-10T10:08:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 62, 'z': -89.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.4

- WATCH 2026-11-10T10:12:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 62, 'z': -89.3} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.8

- WATCH 2026-11-10T10:13:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 62, 'z': -89.3} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.8

- WATCH 2026-11-10T10:17:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.3, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 2.9

- WATCH 2026-11-10T10:18:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.3, 'y': 62, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.2

- WATCH 2026-11-10T10:22:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.4, 'y': 62, 'z': -90.6} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 2.9

- WATCH 2026-11-10T10:23:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 61, 'z': -90.6} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.4

- WATCH 2026-11-10T10:27:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.6, 'y': 61, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.3

- WATCH 2026-11-10T10:28:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.5, 'y': 62, 'z': -91.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 2.9

- WATCH 2026-11-10T10:32:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 61, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.3

- WATCH 2026-11-10T10:33:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.2

- WATCH 2026-11-10T10:37:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.4, 'y': 62, 'z': -91.6} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3

- WATCH 2026-11-10T10:38:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.9, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.1

- WATCH 2026-11-10T10:42:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.1

- WATCH 2026-11-10T10:43:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.1

- WATCH 2026-11-10T10:47:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63, 'y': 62, 'z': -89.7} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 3.5

- WATCH 2026-11-10T10:48:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.4} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 2.9

- WATCH 2026-11-10T10:52:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.4} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 2.9

- WATCH 2026-11-10T10:53:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.3, 'y': 62, 'z': -90.6} hp 20 food 20 inv {'cooked_porkchop': 28} distHome 2.9

- WATCH 2026-11-10T10:57:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.6, 'y': 62, 'z': -89.7} hp 20 food 19 inv {'cooked_porkchop': 28} distHome 3.3

- WATCH 2026-11-10T10:58:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -89.8} hp 20 food 18 inv {'cooked_porkchop': 28} distHome 3.5

- WATCH 2026-11-10T11:02:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.7, 'y': 62, 'z': -90.5} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.8

- WATCH 2026-11-10T11:03:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.5, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:07:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:08:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:12:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:13:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:17:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:18:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:22:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:23:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:27:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:28:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:32:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:33:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:37:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:38:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:42:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:43:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:47:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:48:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:52:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:53:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:57:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T11:58:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:02:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:03:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:07:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:08:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:12:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:13:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:17:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:18:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:22:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:23:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:27:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:28:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:32:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:33:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:37:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:38:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:42:43Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:43:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:47:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:48:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:52:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:53:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:57:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T12:58:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:02:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:03:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:07:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:08:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:12:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:13:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:17:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:18:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:22:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:23:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:27:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:28:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:32:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:33:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:37:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:38:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:42:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:43:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:47:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:48:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:52:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:53:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:57:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T13:58:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:02:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:03:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:07:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:08:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:12:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:13:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:17:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:18:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:22:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:23:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:27:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:28:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:32:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:33:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:37:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:38:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:42:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:43:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:47:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:48:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:52:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:53:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:57:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T14:58:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:02:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:03:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:07:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:08:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:12:44Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:13:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:17:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:18:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:22:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:23:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:27:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:28:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:32:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:33:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:37:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:38:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:42:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:43:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:47:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:48:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:52:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:53:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:57:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T15:58:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:02:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:03:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:07:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:08:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:12:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:13:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:17:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:18:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:22:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:23:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:27:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:28:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:32:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:33:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:37:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:38:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:42:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:43:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:47:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:48:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:52:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:53:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:57:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T16:58:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:02:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:03:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:07:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:08:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:12:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:13:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:17:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:18:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:22:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:23:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:27:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:28:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:32:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:33:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:37:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:38:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:42:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:43:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:47:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:48:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:52:45Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:53:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:57:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T17:58:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:02:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:03:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:07:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:08:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:12:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:13:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:17:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:18:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:22:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:23:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:27:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:28:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:32:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:33:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:37:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:38:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:42:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:43:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:47:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:48:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:52:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:53:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:57:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T18:58:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:02:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:03:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:07:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:08:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:12:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:13:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:17:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:18:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:22:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:23:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:27:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:28:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:32:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:33:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:37:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:38:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:42:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:43:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:47:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:48:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:52:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:53:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:57:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T19:58:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:02:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:03:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:07:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:08:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:12:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:13:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:17:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:18:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:22:46Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:23:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:27:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:28:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:32:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:33:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:37:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:38:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:42:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:43:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:47:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:48:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:52:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:53:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:57:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T20:58:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:02:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:03:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:07:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:08:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:12:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:13:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:17:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:18:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:22:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:23:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:27:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:28:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:32:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:33:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:37:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:38:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:42:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:43:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:47:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:48:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:52:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:53:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:57:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T21:58:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:02:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:03:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:07:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:08:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:12:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:13:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:17:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:18:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:22:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:23:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:27:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:28:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:32:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:33:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:37:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:38:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:42:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:43:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:47:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:48:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:52:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:53:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:57:47Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T22:58:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:02:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:03:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:07:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:08:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:12:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:13:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:17:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:18:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:22:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:23:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:27:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:28:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:32:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:33:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:37:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:38:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:42:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:43:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:47:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:48:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:52:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:53:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:57:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-10T23:58:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:02:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:03:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:07:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:08:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:12:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:13:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:17:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:18:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:22:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:23:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:27:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:28:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:32:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:33:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:37:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:38:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:42:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:43:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:47:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:48:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:52:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:53:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:57:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T00:58:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:02:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:03:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:07:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:08:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:12:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:13:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:17:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:18:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:22:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:23:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:27:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:28:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:32:48Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:33:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:37:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:38:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:42:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:43:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:47:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:48:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:52:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:53:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:57:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T01:58:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:02:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:03:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:07:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:08:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:12:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:13:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:17:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:18:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:22:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:23:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:27:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:28:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:32:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:33:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:37:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:38:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:42:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:43:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:47:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:48:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:52:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:53:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:57:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T02:58:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:02:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:03:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:07:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:08:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:12:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:13:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:17:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:18:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:22:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:23:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:27:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:28:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:32:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:33:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:37:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:38:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:42:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:43:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:47:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:48:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:52:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:53:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:57:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T03:58:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:02:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:03:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:07:49Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:08:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:12:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:13:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:17:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:18:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:22:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:23:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:27:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:28:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:32:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:33:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:37:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:38:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:42:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:43:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:47:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:48:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:52:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:53:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:57:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T04:58:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:02:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:03:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:07:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:08:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:12:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:13:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:17:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:18:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:22:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:23:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:27:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:28:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:32:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:33:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:37:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:38:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:42:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:43:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:47:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:48:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:52:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:53:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:57:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T05:58:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:02:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:03:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:07:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:08:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:12:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:13:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:17:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:18:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:22:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:23:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:27:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:28:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:32:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:33:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:37:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:38:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:42:50Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:43:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:47:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:48:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:52:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:53:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:57:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T06:58:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:02:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:03:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:07:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:08:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:12:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:13:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:17:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:18:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:22:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:23:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:27:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:28:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:32:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:33:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:37:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:38:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:42:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:43:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:47:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:48:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:52:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:53:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:57:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T07:58:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:02:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:03:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:07:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:08:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:12:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:13:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:17:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:18:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:22:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:23:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:27:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:28:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:32:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:33:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:37:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:38:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:42:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:43:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:47:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:48:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:52:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:53:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:57:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T08:58:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:02:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:03:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:07:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:08:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:12:51Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:13:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:17:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:18:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:22:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:23:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:27:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:28:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:32:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:33:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:37:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:38:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:42:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:43:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:47:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:48:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:52:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:53:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:57:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T09:58:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:02:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:03:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:07:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:08:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:12:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:13:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:17:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:18:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:22:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:23:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:27:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:28:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:32:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:33:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:37:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:38:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:42:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:43:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:47:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:48:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:52:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:53:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:57:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T10:58:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:02:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:03:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:07:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:08:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:12:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:13:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:17:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:18:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:22:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:23:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:27:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:28:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:32:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:33:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:37:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:38:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:42:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:43:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:47:52Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:48:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:52:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:53:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:57:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T11:58:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:02:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:03:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:07:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:08:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:12:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:13:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:17:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:18:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:22:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:23:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:27:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:28:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:32:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:33:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:37:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:38:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:42:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:43:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:47:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:48:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:52:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:53:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:57:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T12:58:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:02:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:03:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:07:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:08:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:12:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:13:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:17:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:18:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:22:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:23:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:27:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:28:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:32:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:33:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:37:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:38:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:42:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:43:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:47:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:48:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:52:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:53:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:57:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T13:58:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:02:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:03:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:07:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:08:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:12:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:13:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:17:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:18:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:22:53Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:23:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:27:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:28:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:32:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:33:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:37:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:38:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:42:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:43:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:47:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:48:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:52:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:53:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:57:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T14:58:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:02:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:03:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:07:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:08:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:12:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:13:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:17:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:18:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:22:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:23:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:27:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:28:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:32:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:33:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:37:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:38:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:42:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:43:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:47:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:49:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:52:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:54:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:57:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T15:59:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:02:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:04:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:07:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:09:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:12:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:14:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:17:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:19:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:22:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:24:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:27:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:29:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:32:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:34:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:37:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:39:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:42:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:44:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:47:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:49:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:52:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:54:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:57:54Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T16:59:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:02:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:04:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:07:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:09:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:12:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:14:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:17:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:19:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:22:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:24:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:27:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:29:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:32:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:34:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:37:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:39:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:42:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:44:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:47:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:49:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:52:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:54:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:57:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T17:59:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:02:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:04:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:07:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:09:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:12:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:14:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:17:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:19:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:22:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:24:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:27:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:29:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:32:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:34:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:37:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:39:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:42:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:44:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:47:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:49:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:52:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:54:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:57:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T18:59:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:02:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:04:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:07:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:09:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:12:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:14:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:17:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:19:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:22:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:24:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:27:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:29:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:32:55Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:34:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:37:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:39:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:42:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:44:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:47:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:49:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:52:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:54:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:57:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T19:59:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:02:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:04:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:07:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:09:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:12:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:14:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:17:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:19:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:22:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:24:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:27:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:29:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:32:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:34:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:37:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:39:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:42:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:44:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:47:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:49:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:52:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:54:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:57:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T20:59:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:02:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:04:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:07:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:09:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:12:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:14:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:17:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:19:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:22:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:24:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:27:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:29:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:32:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:34:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:37:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:39:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:42:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:44:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:47:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:49:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:52:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:54:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:57:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T21:59:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:02:56Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:04:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:07:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:09:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:12:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:14:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:17:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:19:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:22:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:24:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:27:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:29:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:32:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:34:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:37:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:39:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:42:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:44:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:47:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:49:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:52:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:54:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:57:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T22:59:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:02:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:04:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:07:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:09:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:12:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:14:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:17:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:19:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:22:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:24:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:27:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:29:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:32:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:34:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:37:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:39:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:42:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:44:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:47:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:49:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:52:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:54:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:57:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-11T23:59:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:02:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:04:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:07:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:09:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:12:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:14:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:17:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:19:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:22:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:24:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:27:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:29:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:32:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:34:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:37:57Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:39:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:42:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:44:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:47:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:49:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:52:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:54:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:57:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T00:59:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:02:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:04:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:07:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:09:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:12:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:14:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:17:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:19:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:22:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:24:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:27:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:29:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:32:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:34:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:37:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:39:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:42:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:44:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:47:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:49:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:52:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:54:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:57:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T01:59:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:02:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:04:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:07:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:09:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:12:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:14:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:17:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:19:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:22:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:24:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:27:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:29:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:32:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:34:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:37:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:39:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:42:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:44:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:47:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:49:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:52:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:54:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:57:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T02:59:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:02:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:04:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:07:58Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:09:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:12:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:14:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:17:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:19:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:22:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:24:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:27:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:29:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:32:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:34:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:37:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:39:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:42:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:44:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:47:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:49:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:52:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:54:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:57:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T03:59:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:02:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:04:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:07:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:09:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:12:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:14:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:17:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:19:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:22:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:24:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:27:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:29:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:32:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:34:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:37:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:39:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:42:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:44:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:47:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:49:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:52:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:54:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:57:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T04:59:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:02:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:04:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:07:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:09:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:12:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:14:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:17:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:19:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:22:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:24:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:27:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:29:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:32:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:34:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:37:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:39:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:42:59Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:44:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:48:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:49:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:53:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:54:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:58:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T05:59:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:03:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:04:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:08:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:09:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:13:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:14:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:18:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:19:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:23:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:24:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:28:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:29:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:33:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:34:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:38:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:39:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:43:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:44:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:48:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:49:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:53:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:54:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:58:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T06:59:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:03:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:04:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:08:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:09:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:13:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:14:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:18:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:19:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:23:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:24:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:28:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:29:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:33:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:34:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:38:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:39:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:43:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:44:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:48:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:49:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:53:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:54:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:58:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T07:59:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:03:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:04:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:08:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:09:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:13:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:14:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:18:00Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:19:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:23:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:24:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:28:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:29:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:33:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:34:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:38:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:39:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:43:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:44:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:48:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:49:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:53:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:54:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:58:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T08:59:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:03:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:04:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:08:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:09:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:13:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:14:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:18:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:19:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:23:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:24:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:28:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:29:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:33:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:34:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:38:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:39:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:43:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:44:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:48:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:49:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:53:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:54:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:58:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T09:59:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:03:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:04:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:08:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:09:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:13:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:14:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:18:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:19:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:23:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:24:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:28:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:29:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:33:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:34:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:38:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:39:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:43:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:44:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:48:01Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:49:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:53:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:54:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:58:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T10:59:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:03:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:04:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:08:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:09:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:13:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:14:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:18:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:19:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:23:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:24:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:28:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:29:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:33:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:34:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:38:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:39:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:43:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:44:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:48:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:49:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:53:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:54:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:58:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T11:59:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:03:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:04:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:08:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:09:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:13:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:14:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:18:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:19:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:23:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:24:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:28:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:29:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:33:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:34:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:38:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:39:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:43:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:44:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:48:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:49:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:53:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:54:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:58:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T12:59:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:03:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:04:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:08:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:09:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:13:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:14:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:18:02Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:19:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:23:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:24:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:28:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:29:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:33:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:34:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:38:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:39:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:43:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:44:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:48:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:49:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:53:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:54:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:58:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T13:59:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:03:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:04:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:08:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:09:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:13:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:14:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:18:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:19:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:23:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:24:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:28:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:29:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:33:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:34:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:38:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:39:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:43:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:44:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:48:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:49:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:53:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:54:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:58:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T14:59:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:03:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:04:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:08:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:09:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:13:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:14:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:18:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:19:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:23:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:24:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:28:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:29:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:33:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:34:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:38:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:39:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:43:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:44:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:48:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:49:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:53:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:54:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:58:03Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T15:59:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:03:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:04:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:08:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:09:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:13:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:14:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:18:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:19:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:23:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:24:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:28:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:29:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:33:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:34:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:38:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:39:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:43:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:44:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:48:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:49:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:53:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:54:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:58:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T16:59:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:03:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:04:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:08:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:09:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:13:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:14:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:18:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:19:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:23:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:24:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:28:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:29:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:33:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:34:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:38:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:39:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:43:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:44:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:48:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:49:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:53:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:54:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:58:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T17:59:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:03:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:04:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:08:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:09:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:13:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:14:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:18:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:19:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:23:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:24:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:28:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:29:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:33:04Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:34:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:38:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:39:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:43:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:44:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:48:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:49:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:53:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:54:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:58:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T18:59:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:03:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:04:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:08:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:09:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:13:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:14:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:18:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:19:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:23:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:24:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:28:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:29:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:33:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:34:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:38:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:39:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:43:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:44:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:48:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:49:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:53:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:54:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:58:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T19:59:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:03:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:04:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:08:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:09:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:13:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:14:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:18:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:19:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:23:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:24:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:28:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:29:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:33:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:34:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:38:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:39:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:43:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:44:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:48:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:49:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:53:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:54:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:58:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T20:59:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:03:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:04:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:08:05Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:09:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:13:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:14:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:18:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:19:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:23:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:24:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:28:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:29:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:33:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:34:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:38:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:39:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:43:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:44:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:48:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:49:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:53:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:54:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:58:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T21:59:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:03:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:04:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:08:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:09:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:13:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:14:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:18:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:19:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:23:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:24:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:28:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:29:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:33:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:34:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:38:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:39:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:43:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:44:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:48:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:49:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:53:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:54:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:58:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T22:59:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:03:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:04:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:08:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:09:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:13:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:14:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:18:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:19:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:23:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:24:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:28:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:29:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:33:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:34:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:38:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:39:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:43:06Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:44:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:48:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:49:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:53:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:54:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:58:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-12T23:59:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:03:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:04:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:08:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:09:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:13:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:14:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:18:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:19:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:23:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:24:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:28:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:29:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:33:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:34:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:38:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:39:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:43:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:44:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:48:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:49:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:53:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:54:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:58:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T00:59:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:03:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:04:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:08:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:09:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:13:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:14:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:18:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:19:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:23:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:24:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:28:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:29:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:33:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:34:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:38:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:39:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:43:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:44:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:48:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:49:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:53:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:54:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:58:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T01:59:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:03:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:04:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:08:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:09:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:13:07Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:14:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:18:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:19:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:23:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:24:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:28:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:29:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:33:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:34:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:38:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:39:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:43:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:44:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:48:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:49:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:53:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:54:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:58:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T02:59:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:03:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:04:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:08:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:09:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:13:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:14:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:18:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:19:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:23:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:24:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:28:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:29:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:33:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:34:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:38:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:39:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:43:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:44:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:48:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:49:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:53:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:54:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:58:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T03:59:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:03:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:04:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:08:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:09:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:13:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:14:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:18:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:19:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:23:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:24:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:28:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:29:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:33:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:34:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:38:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:39:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:43:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:44:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:48:08Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:49:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:53:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:54:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:58:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T04:59:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:03:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:04:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:08:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:09:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:13:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:14:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:18:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:19:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:23:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:24:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:28:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:29:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:33:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:34:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:38:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:39:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:43:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:44:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:48:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:49:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:53:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:54:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:58:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T05:59:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:03:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:04:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:08:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:09:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:13:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:14:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:18:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:19:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:23:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:24:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:28:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:29:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:33:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:34:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:38:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:39:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:43:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:44:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:48:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:49:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:53:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:54:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:58:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T06:59:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:03:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:04:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:08:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:09:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:13:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:14:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:18:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:19:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:23:09Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:24:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:28:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:29:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:33:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:34:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:38:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:39:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:43:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:44:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:48:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:49:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:53:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:54:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:58:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T07:59:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:03:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:04:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:08:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:09:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:13:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:14:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:18:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:19:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:23:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:24:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:28:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:29:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:33:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:34:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:38:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:39:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:43:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:44:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:48:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:49:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:53:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:54:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:58:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T08:59:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:03:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:04:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:08:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:09:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:13:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:14:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:18:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:19:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:23:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:24:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:28:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:29:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:33:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:34:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:38:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:39:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:43:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:44:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:48:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:49:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:53:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:54:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:58:10Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T09:59:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:03:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:04:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:08:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:09:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:13:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:14:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:18:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:19:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:23:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:24:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:28:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:29:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:33:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:34:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:38:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:39:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:43:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:44:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:48:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:49:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:53:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:54:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:58:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T10:59:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:03:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:04:16Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:08:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:09:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:13:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:14:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:18:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:19:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:23:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:24:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:28:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:29:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:33:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:34:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:38:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:39:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:43:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:44:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:48:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:49:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:53:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:54:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:58:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T11:59:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:03:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:04:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:08:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:09:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:13:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:14:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.6, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:18:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T12:19:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 61.7, 'y': 61, 'z': -90.6} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.3

- WATCH 2026-11-13T12:23:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 62.3, 'y': 62, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T12:24:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 62, 'z': -89.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.4

- WATCH 2026-11-13T12:28:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.6, 'y': 63, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.3

- WATCH 2026-11-13T12:29:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.7, 'y': 63, 'z': -90.5} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.6

- WATCH 2026-11-13T12:33:11Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.4, 'y': 63, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.4

- WATCH 2026-11-13T12:34:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.3, 'y': 63, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.4

- WATCH 2026-11-13T12:38:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.1, 'y': 64, 'z': -90.7} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.3

- WATCH 2026-11-13T12:39:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 64, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.7

- WATCH 2026-11-13T12:43:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65, 'y': 64, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T12:44:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65, 'y': 64, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T12:48:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65, 'y': 64, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T12:49:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 65, 'y': 64, 'z': -90.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T12:53:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 64.3, 'y': 66, 'z': -91} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.1

- WATCH 2026-11-13T12:54:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 63.6, 'y': 68, 'z': -87.9} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 5.1

- WATCH 2026-11-13T12:58:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.4, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T12:59:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.4, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T13:03:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.4, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T13:04:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.4, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 2.9

- WATCH 2026-11-13T13:08:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:09:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:13:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:14:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:18:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:19:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:23:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:24:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:28:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:29:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:33:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:34:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:38:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:39:17Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:43:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:44:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:48:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:49:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:53:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:54:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:58:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T13:59:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:03:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:04:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:08:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:09:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:13:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:14:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:18:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:19:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:23:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:24:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:28:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:29:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:33:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:34:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:38:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:39:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:43:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:44:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:48:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:49:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:53:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:54:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:58:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T14:59:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:03:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:04:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:08:12Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:09:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:13:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:14:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:18:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:19:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:23:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:24:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:28:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:29:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:33:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:34:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:38:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:39:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:43:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:44:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:48:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:49:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:53:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:54:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:58:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T15:59:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:03:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:04:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:08:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:09:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:13:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:14:18Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:18:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:19:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:23:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:24:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:28:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:29:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:33:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:34:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:38:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:39:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:43:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:44:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:48:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:49:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:53:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:54:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:58:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T16:59:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:03:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:04:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:08:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:09:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:13:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:14:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:18:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:19:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:23:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:24:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:28:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:29:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:33:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:34:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:38:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:39:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:43:13Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:44:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:48:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:49:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:53:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:54:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:58:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T17:59:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:03:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:04:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:08:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:09:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:13:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:14:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:18:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:19:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:23:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:24:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:28:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:29:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:33:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:34:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:38:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:39:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:43:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:44:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:48:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:49:19Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:53:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:54:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:58:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T18:59:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:03:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:04:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:08:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:09:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:13:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:14:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:18:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:19:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:23:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:24:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:28:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:29:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:33:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:34:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:38:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:39:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:43:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:44:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:48:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:49:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:53:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:54:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:58:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T19:59:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:03:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:04:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:08:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:09:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:13:14Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:14:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:18:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:19:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:23:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:24:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:28:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:29:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:33:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:34:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:38:15Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2

- WATCH 2026-11-13T20:39:20Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 66.7, 'y': 63.1, 'z': -91.3} hp 20 food 20 inv {'cooked_porkchop': 27} distHome 3.2
