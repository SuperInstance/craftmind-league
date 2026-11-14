# DIRECT-DRIVE CODY — the Steve-program shape (Casey direction 2026-11-08 21:20 AKST; puppeteering/sitcom frame 21:22; YES-AND rule 21:23)

Casey: "when I was experimenting with that Steve AI program it was very
easy to get Steve to do things I don't understand why it's hard for our
characters to actually be doing things... a pretty easy command system
once I plugged in an API... I just don't see anything happening."
Follow-ups: the driver SETS UP A SCENE (who Cody is, where he is, what
kind of day this is) and lets it play — emergence is the product to
watch; and YES-AND: an interrupted plan gets ONE retry, after that the
interruption IS the plan. Cody's scripted run died of the opposite:
35 minutes blocking the world's offer. The survival floor stays code,
invisible, underneath.

## MODEL ROUTE (evidence in ledger line 274)

PRIMARY: deepseek-ai/DeepSeek-V4.1-Flash-1017 via DeepInfra (the
fleet's existing paid route) through the ddbridge surrogate relay —
the custom.deepinfra credential is surrogate-held on the Muse VM and
never leaves it; the Thor process presents no credential. Path:
driver (Thor 127.0.0.1:8912) -> reverse SSH tunnel -> Muse VM
127.0.0.1:8911 relay (~/workspace/ddbridge.py, per-call log
~/workspace/ddbridge-calls.jsonl) -> api.deepinfra.com. FALLBACK
(auto, 3 consecutive failures): governor identity league-cody-driver
-> :8310 confluence-presence-brain (Qwen3-Coder-30B, Casey's resident;
used, never restarted). Probe before build: the candidate model was
handed the exact dip-opening state sight-unseen and answered in
character with a legal command and an honest terrain read.
Casey's key offer: NOT needed — no gap to name.

## BUILD

pulse/direct-drive.js (30,785 B) + bots/runs/cody/resident-cody-dd.js
(thin launch wrapper; the original resident + character plugin are
untouched). The loop: perceive (position/hp/food/inventory, ground
3 blocks out in 4 directions, neighbour relief ring, creatures <=24,
time) -> ONE JSON command {say, cmd} -> act via pulse/lib/prims.js.
Commands: goto / gotoentity / climb (pillar) / dig / felltree /
collect / craft / place / equip / eat / attack / look / wait.
Dig-step allowance NOT enabled; no /give; no teleports; his own feet.
FLOOR (code, under the driver, character-plugin.js equivalents):
700 ms hostile monitor cancels work at <=8.5 blocks; flee to home;
burrow + seal + hold if fleeing does not clear; eat at food <=6 when
food is held; emergency hunt at hp <=4; 3-death abort from baseline
deaths 116. Full per-cycle trace: pulse/direct-drive-trace.jsonl.
Shape differs from the one-player launch in ONE declared way: no
pulsePlugin (its pulse-state feed drove the character loop's books;
the driver keeps its own trace) — framework movement plugins skipped
identically; body ownership = the driver process itself, proven by
its spawn line + trace.

## PRE-FLIGHT (2026-11-09T06:25Z)

- Syntax: node --check PASS both files. codyctl status: no resident.
- Daylight hold: cameraman pid 644570 alive on the Orin, citizens=Cody;
  refresh "/time set 1000" VERIFIED LANDED in the server log 06:25:06
  (its own log agrees). Hold live before join.
- Cody's .dat present in world/players/data/ (the pool rule holds);
  start state per the one-player closing verification: dip
  (77.34, 64, -98.3), hp 9.13, food 4, oak_log x6 + oak_sapling x2,
  deaths 116.

## PHASE LOG

- (entries appended as they land; incidents lead, not buried)

- 2026-11-09T06:26Z - LAUNCH 1 + INCIDENT (leads; full text ledger
  direct-drive-failover-incident-20261109): spawned in the dip exactly
  per baseline (77.3, 64, -98.3; hp 9.13; food 4; deaths 116). The
  primary DeepInfra route returned empty content 3x instantly and the
  driver failed over to the governor fallback; replaying the identical
  payload through the same bridge minutes later answered cleanly -
  the relay chain dropped the first calls, the provider is innocent.
  Driver patched (one retry per call before failover counts). The
  fallback's 14 cycles PLAYED meanwhile: dug, climbed, placed, and
  walked him out of the dip bowl to (75.3, 66, -94.1), 11.3 from home,
  hp/food untouched, zero deaths. Extraction-from-the-bowl: FALLBACK
  driver, ~2.5 min (scripted run: never, in 35). The primary run
  starts from the lip and is judged on food/home/projects.

- 2026-11-09T06:36Z - CORRECTION + SEGMENT 2 (ledger
  direct-drive-incident-correction-20261109): line 275's root cause
  was WRONG. Bridge logs prove HTTP 422: the payload carried
  chat_template_kwargs, which DeepInfra rejects (llama.cpp field).
  Also fixed: max_tokens 220 -> 700 (the primary's JSON was being
  truncated mid-object at real prompt sizes), and the placed crafting
  table is now re-detected from the live world each cycle (segment 1
  had placed one the restarted process forgot). Segment 2 (fallback,
  ~12 cycles): CRAFTED THE WOODEN PICKAXE (inventory proof:
  oak_planks x10, oak_button x1, wooden_pickaxe x1), then wandered
  back into the dip bowl (75.7, 63, -98.4) chasing the table/home -
  hp 9.13 / food 4 / deaths 116 throughout. The pickaxe exists. The
  primary run starts with it in hand, in the bowl, hungry.

- 2026-11-09T06:40Z - ROOT CAUSE, FINAL (ledger
  direct-drive-root-cause-final-20261109): the driver's Node client
  sent chunked bodies with no Content-Length; the body arrived EMPTY
  at DeepInfra (422: model field required; payload_keys [] in the
  bridge log). Every isolated component was innocent; the composition
  ate the body. Fixed (explicit Content-Length) and PROVEN with the
  identical full-size Node payload: 200, in character. Three launches
  failed over inside ~40 s each because three empties is precisely the
  chartered failover trigger. Segments so far, all fallback-driven:
  bowl -> lip; pickaxe crafted; redipped; repeated table/pickaxe
  attempts from inside the bowl. Deaths still 116, hp 9.13, food 4.
  Relaunching on the primary route now.

- 2026-11-09T06:38Z - LAUNCH 4: THE PRIMARY IS DRIVING.
  DeepSeek V4.1 Flash (DeepInfra) from cycle 1, no failover. In its
  first ~3 minutes: climbed out of the dip in three gotos (74,65,-96
  -> 70,66,-95 -> 67,66,-94) where segment drivers burned tens of
  minutes; a YES-AND beat en route - it detoured at the apple oak
  (felltree/look/dig at the canopy), accepted the failure, and
  re-planned ("Enough guessing - I'm starving... home's three blocks
  off") instead of retrying the plan to death. HOME by cycle 7-8
  (goto 64 67 -93 arrived). Placed a crafting table at the anchor,
  recovered from a failed pickaxe craft by sequencing planks ->
  sticks -> pickaxe, and by cycle 13 HELD A SECOND WOODEN PICKAXE.
  Then back to the apple oak for food: the trunk hunt continues
  (felltree found leaves where it guessed; it is digging leaves for
  drops). Food 4 -> 3 (one exertion tick). hp 9.13, deaths 116.
  Food is now the whole scene: no animals within 24 blocks in any
  perception so far; the oak's apples are a decay lottery; if neither
  lands, starvation floors at 1 hp on NORMAL - a slow decline the
  floor's emergency hunt answers only if prey wanders in.
- CAMERA: still owed - screenshot of the headed client follows in
  this log once taken (cameraman pid 644570 is following Cody; its
  CUT lines name him continuously per its log).

- CAMERA EVIDENCE (06:41:38Z, Orin /tmp/orin_screen_dd.png, viewed
  first-hand by this lane): FACE-CAM frame - Cody visible mid-frame
  under the canopy beside the placed crafting table and planks on the
  home shelf, held-daylight sky, and his own in-world chat on screen:
  "<Cody> Walker says I'm at 66 but I'm still at 64.5 - that dip's
  ground keeps eating my steps. Fine. I've got one log and five
  planks; let me set down a crafting table right here and make a
  pickaxe before I s..." (a fallback-segment line, timestamped to
  that segment). Cameraman STOP-discipline honoured for the grab
  (STOP file -> clean exit 06:41:38 -> screenshot -> relaunched pid
  668000; refresh verified landed in the server log 06:42:21). The
  headed client was never touched by hand; spectator state undisturbed
  (no GUI interaction occurred - the grab is an X screenshot only).

- WATCH 2026-11-09T06:46:22Z: [DD] cycle 78 [deepinfra:deepseek-v4.1-flash] say="There was a second table tucked in here. Fine — I'll keep this one in my pocket and go find something with a pulse to eat." cmd="gotoentity cow"
  state: {'x': 63.8, 'y': 68, 'z': -93.7} hp 9.1 food 2 inv {'wooden_pickaxe': 1, 'oak_button': 2, 'oak_planks': 2, 'stick': 2, 'oak_sapling': 2} distHome 0.7

- WATCH 2026-11-09T06:51:22Z: [DD] cycle 113 [deepinfra:deepseek-v4.1-flash] say="Now I'm up on the stone shelf. West of me the grass sits at 66 — that's the lip I want. Let me try walking onto it." cmd="goto 70 66 -104"
  state: {'x': 71.3, 'y': 61, 'z': -104.7} hp 6.1 food 1 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 2, 'wooden_pickaxe': 1, 'cobblestone': 2} distHome 13.8

- WATCH 2026-11-09T06:56:22Z: [DD] FLOOR: emergency forage — hunting chicken
  state: {'x': 72.9, 'y': 63, 'z': -99.3} hp 6.1 food 1 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 1, 'wooden_pickaxe': 1, 'cobblestone': 4} distHome 10.9

- 2026-11-09T06:5xZ - MID-RUN ARC + A FLOOR DEFECT (leads): after
  coming home and crafting, the primary driver went back to the apple
  oak for food and the scene slid: repeated trunk-guesses at canopy
  level (felltree/dig at leaves), a drift south-east back over the
  dip's edge, a fall into a stone pit (hp 9.1 -> 6.1), food 3 -> 1.
  At food 1 / hp 6.1 the FLOOR's emergency-forage trigger (chartered
  as hp <= 4) never fired by its own gate - it fired only via the
  loop's incidental path and then LOOPED: 'emergency forage - hunting
  chicken' repeated without the state file advancing for minutes:
  the hunt's gotoNear chases a fleeing chicken across relief the
  walker cannot cross, returns, and the floor re-fires instantly.
  Root cause: the floor rule was written for the scripted era (hp<4
  = nearly dead) and has no re-fire backoff; a starving-but-not-dying
  citizen at food 1 falls BETWEEN the driver's food thread (which
  owns no prey) and the floor's gate. Fix (code, floor-level, inside
  the chartered design): trigger = food <= 1 AND hp <= 12, with a
  90 s re-fire backoff so the driver keeps the scene between hunts.
  Driver restarted on the patched floor; the scene it inherits:
  (72.9, 63, -99.3) in the dip, hp 6.1, food 1, holding pickaxe,
  table, 4 cobblestone, 1 plank. Deaths still 116.

- WATCH 2026-11-09T07:01:22Z: [BotMessenger] Shutdown complete for Cody
  state: {'x': 74.7, 'y': 63, 'z': -103.5} hp 0.1 food 0 inv {'oak_button': 2, 'stick': 2, 'oak_sapling': 2, 'crafting_table': 1, 'oak_planks': 3, 'wooden_pickaxe': 1, 'cobblestone': 4} distHome 15

## VERDICT — filed 2026-11-09T07:05Z (direct-drive lane closed)

### What the run was, honestly
Five driver segments between 06:26Z and 07:00Z, not one clean take:
three launches (06:26 / 06:29 / ~06:34) drove on the governor
FALLBACK (30B) because the primary route's request bodies arrived
empty at DeepInfra (chunked encoding, no Content-Length - root
cause ledger line 277); the fourth launch (06:38Z) ran the PRIMARY
(DeepSeek V4.1 Flash) for 135 cycles; the fifth (06:58Z, after a
floor patch) ran 2 minutes and was stopped by this lane - see the
closing incident. Cycle totals: 192 (135 primary / 57 fallback).
Costs: DeepInfra $0.036 total (145 metered calls, 485k prompt tokens
- the identical-prefix scenario prompt caches well); governor
fallback 63 calls / 139.2 mind-seconds. The scripted one-player run
it is compared against spent 65 minutes for zero food and no exit;
this shape spent ~35 live minutes across all segments.

### In world evidence
- OUT OF THE DIP: YES, three separate times, by two different
  drivers. Fallback segment 1: bowl (77.3,64,-98.3) -> lip
  (75.3,66,-94.1) in ~2.5 min. Primary run: bowl -> home in three
  gotos, ~2 min. The scripted sequencer never did it in 35.
- HOME: YES (primary, cycles 7-8: at the anchor (64,67,-93),
  crafting table placed there at cycle 8).
- ATE: NO. Food went 4 -> 0 across the run and nothing edible was
  ever held. This is the run's hard negative and it is shared by
  every driver and the scripted loop before them: the home
  district's food economy is an apple-decay lottery plus wandering
  prey, and in ~100 minutes of combined play today the lottery
  never paid and prey appeared within reach exactly once (a chicken
  the floor could not catch). The direct drive did NOT crack food;
  it failed at it more articulately, and faster.
- BUILT: wooden pickaxe CRAFTED TWICE (fallback segment 2 from the
  bare-hands start; primary at cycle 12 after correctly sequencing
  planks -> sticks -> pickaxe at its own placed table); crafting
  tables placed (one near (63,67,-94) by segment 2, one at the
  anchor by the primary); pads/hut/chest/pen NOT reached - food
  consumed every scene after the pickaxe.
- DEATHS: 0 (116 at close; deaths.jsonl verified 116 lines, no
  entry after 04:57:38Z). One near-death: the final save sits at
  hp 0.13 / food 0 (see incident) - hunger floors at ~0.13 hp on
  this build rather than killing, which is the only reason the
  count is 0.
- YES-AND: FIRED, visibly, on the primary route. Cycle 4: the
  apple-oak detour interrupted the commute home; cycles 5-6 tried
  the tree twice; cycle 7 accepted the interruption as information
  and re-planned ("Enough guessing - I'm starving and the leaves
  aren't cooperating. Home's three blocks off"). One retry, then
  the new situation became the plan - the exact behaviour the
  scripted run lacked for 35 minutes. Also unscripted colour: it
  narrated its own state honestly throughout ("Walker says arrived
  but I'm glued at 61 - same spot every time. This lip is a trap.")
  and chose a north-side descent BECAUSE the dip beat its plan
  ("The dip keeps beating my plans, so let it.").
- THE SCENE THAT PLAYED (nobody scripted it): a starving man with
  a new pickaxe, in sight of home, spending his strength shaking a
  tree that would not feed him, falling into a stone pit, and
  crawling out the low side - present, funny in the bleak way, and
  entirely emergent. Casey's frame held: set up well, let it play.
- FLOOR: the hostile monitor never fired (no hostile closed within
  range in held daylight all run - the floor's flee/burrow went
  untested by the world, not by choice). The eat reflex never had
  food to eat. The emergency forage fired 11 times and caught
  nothing: its trigger was mis-gated for the starving case
  (patched mid-run: food <= 1 && hp <= 12, 90 s backoff) and its
  hunt cannot run down a fleeing chicken across relief - the same
  carrier as everything else in this district.

### CLOSING INCIDENT (leads the record, owned)
The fifth launch (06:58Z, floor patch aboard) spawned Cody at
hp 0.13 / food 0 - NOT the hp 6.1 / food 1 the lane believed it had
stopped segment 4 at. Cause: segment 4's driver was still running
when this lane read its state file and filed the floor incident;
hunger kept ticking in the live world between the read and the
kill, and the disconnect save recorded the later, worse state.
fault_owner: agent (this lane) - a stale-read stop, the same
family as every stale-read error in this programme's ledger. The
fifth launch was stopped within 2 minutes; no death occurred
(hunger does not kill on this build; hp floors at 0.13).
FINAL SAVE (NBT-verified from the Orin after disconnect):
Pos (75.69, 64.0, -105.42), Health 0.1333, foodLevel 0, Inventory:
stick x2, oak_sapling x2, crafting_table x1, oak_planks x3,
wooden_pickaxe x1, cobblestone x4, oak_log x1, oak_button x2.
Deaths 116. Vega .dat sha256 4b65ff2e...edc6 and Geist
8ecbd230...94f0 verified byte-identical to their baselines -
untouched. Daylight hold verified landed at 06:52:27 and 06:57:32
(server log) and the cameraman's tail shows Cody's leave at
07:00:25; the world stays held.

### The honest comparison (vs the scripted run, 05:09-06:15Z)
BETTER: extraction (minutes vs never), home (reached vs never),
crafting (pickaxe twice vs wood gathered only), adaptation
(yes-and beats vs 35 min of route rotation), legibility (every
decision narrated from live state; the trace is 192 fully recorded
cycles). WORSE: infrastructure fragility (three launches burned on
a transport bug the scripted shape never had to survive - a local
0.6B behind the governor has no tunnel to fall through), cost
visibility ($0.036 is nothing, but the route's failure modes are
operational, not behavioural), and food: IDENTICAL failure, which
indicts the district's food economy, not the driver class.
The Steve-program verdict: Casey's premise is confirmed by the
evidence. A capable model behind a simple command system played
immediately and visibly; the league's difficulty was never the
citizen - it was the scaffolding around him.

