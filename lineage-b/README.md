# Lineage B — Vega (Voyager pattern)

Status at first report (2026-11-06 evening AKST / 2026-11-07 ~05:10 UTC):
RESIDENT AND PULSING. Vega is in the world, her state feed is live, both
minds are calling through the governor, authored skills are executing and
being graded from world evidence, and the commons scoreboard is recording.
S1 has NOT passed yet — see "The open problem" below. The loop continues
autonomously (10-minute pulse + a 3-minute retry after a failed tick).

## What this is
A Voyager-pattern citizen, independent of the Craftmind stack (Lineage A):
- The body/executor role is played by vega.js — one Node process holding
  the mineflayer body, the state feed, the skill executor, the night
  watch, and the pulse.
- minds.js — two governor-backed minds on the pulse: a CURRICULUM mind
  (confirms the current task on the shared exam ladder; stage order is
  enforced by code, the mind only words the task) and an AUTHOR mind
  (writes/revises ONE skill per attempt, receiving the previous attempt's
  error and post-check evidence; max 4 attempts per tick — Voyager's
  iterative prompting).
- exam.js — THE SHARED EXAM. Identical ladder to Lineage A. At build time
  ~/craftmind-league/pulse/curriculum.json was not yet landed, so the
  ladder also lives in lineage-b/curriculum.json (progress record), marked
  as the fallback definition; reconcile when A's file lands. Verdicts come
  ONLY from world evidence: inventory contents, block scans (enclosure/
  roof/door/torch flood-scan for S3, chest contents for S4), and the
  night watch's death/position record for S5.
- library/ — authored skills live here (attempts/ keeps every attempt).
  index.json tracks candidate/proven/failed with evidence. A skill that
  passes its stage verdict is copied to ~/craftmind-league/commons/pond/
  with a provenance header.

## Identity, budget, anchor
- Governor identity "vega" (apiKey league-vega), budget 300 calls /
  600 mind-seconds per rolling hour (added to config/governor.json;
  governor restarted once at build time to load it; backup at
  config/governor.json.bak-lineageb).
- Anchor: {x: 63, y: 67, z: -72} — claimed by a time-boxed walk from spawn
  toward +40/+32; she stalled en route on the shore slope and the anchor
  is where she stood (recorded in anchor.json). Roughly 49 blocks clear
  of Cody's anchor. Death/respawn cycles have since moved her play
  position; the anchor record stands.

## SEEDED code (declared, per house rule)
helpers.js is hand-written generic mineflayer plumbing (goto, collect,
craft, placeAt, groundHeight, survey, scanShelter) — seeded primitives,
NOT authored by Vega's minds. Everything in library/ IS mind-authored.
Two seeded-helper lessons were learned the hard way and fixed in place:
(1) collect() now works one tree-trunk column bottom-up (canDigBlock
gated) — chasing nearest logs stranded her under canopies, 0 yield;
(2) movement tuning is walk-only (Movements.canDig=false,
allow1by1towers=false) — with digging in the A* search, a 9-block hop in
wooded slope churned past a 90 s timeout.

## Scaffold fixes made during the build (all in the open, none are skills)
1. Anchor walk time-boxed (75 s) and decoupled from first tick/greeting:
   the original sequential spawn handler let one hanging goto suppress
   the entire pulse.
2. Prompt size: author completions capped at 1400 tokens and mind-bound
   state slimmed (survey zero-counts stripped) after the presence brain
   answered HTTP 500 "Context size has been exceeded". An explicit
   helpers.<fn> calling rule was added to the skill format after the
   first authored skills called bare globals (ReferenceErrors).
3. PATH-STOPPED POISON (root-caused in the mineflayer-pathfinder
   source): pathfinder.stop() only sets a flag; the next setGoal
   consumes it by emitting path_stop, which instantly rejects that
   brand-new goto. The executor's finally-block stop() therefore
   poisoned the next attempt. Fix: never call stop(); idle via
   setGoal(null), and helpers.goto pre-clears with setGoal(null) before
   registering a new goto.
4. Zombie skills: a timed-out skill's async body kept driving the bot
   into the next attempt. helpers now check a cooperative run token the
   executor cancels on timeout/settle (checkRun in goto/collect/craft/
   placeAt).
5. goto has a 90 s internal timeout and gotoAnchor fails SOFT (returns
   false): long shore/hill paths can churn for minutes; a skill run must
   fail in bounded time with evidence, not hang to the 300 s cap.
6. State feed enriched with standingOn + stuck (position history), after
   Vega spent multiple runs standing in a tree canopy — the minds now
   see this in their state. The author prompt carries one API-guidance
   line: digging the block beneath her feet is a legitimate descent.

## The open problem (named plainly)
Locomotion in the wooded-slope terrain around spawn is unreliable with
stock mineflayer-pathfinder: repeated goto timeouts (90 s for ~9 blocks)
and, at last check, Vega is standing on leaves (standingOn: oak_leaves /
birch_leaves) at y=75, ~6 blocks above ground near (29, 75, -104). Her
deaths so far are the world's, honestly recorded: slain by Spider
(04:45:15 UTC), blown up by Creeper (04:49:47 UTC) — server log lines.
The pulse keeps iterating with this evidence in the prompts; a descend-
then-gather skill is the expected author response. If S1 passes, this
README gets a dated addendum; the stage events are in the commons
scoreboard either way.

## Known interactions
- The cameraman (Lineage A's filming rig on the Orin client) issues
  /time set 1000 periodically on the SHARED server. Vega's night watch
  therefore observes ~10-second "nights" (time jumps) that record
  midChecked:false — S5 cannot honestly pass while the day-hold runs.
  Flagged for whenever S5 becomes current; not fixable from Lineage B.
- Lineage C (Geist, the planner) arrived in-world during this build —
  his greetings are in Vega's chat log. The commons already has three
  citizens' worth of world to grade.

## Files
- vega.js (resident), minds.js, exam.js, helpers.js, start-vega.sh
- vega-state.json (state feed, 10 s), anchor.json, curriculum.json
- library/ (authored skills + attempts/ + index.json), logs/ (vega.out,
  ticks.jsonl, vega.pid)
- commons at ~/craftmind-league/commons/ (README.md, SCOREBOARD.jsonl,
  pond/) — shared with Lineage A by design.

## Addendum — governor identity bug, found and fixed at first report
The first verification sweep counted only ONE ledger receipt under agent
"vega" despite ~30 mind calls having visibly produced skills. Root
cause: minds.js shipped with the literal placeholder string as its API
key (a redaction-shaped token written into the source at build time).
The governor accepts any bearer string as an identity, so Vega's calls
succeeded but were receipted under that literal string and billed to the
DEFAULT budget (120 calls / 120 mind-seconds per hour) — 28 calls,
~190 mind-seconds, all status 200. Fixed by constructing the real
league identity in code; verified after relaunch: receipts under agent
"vega" climbing (3 calls / 9.5 mind-seconds within the first tick) under
her configured 300 calls / 600 mind-seconds budget. Lesson recorded:
verify identity by ledger arithmetic (agent string length/count), not by
call success — a permissive gateway makes wrong-identity failures silent.


---

## Addendum 2026-11-07 — substrate repair: canopy descent + locomotion floor (Muse, fleet substrate job)

**Pocket geometry at the stuck spot (29.4, 75, -104.7):** Vega stood on
oak_leaves. Her column (29,-104): leaves at y74 (birch), y73 (spruce),
y72 (birch), air y71-67, grass_block top y66 (ground stand y67; nearby
ground stands 67-70). Canopy is dense in all directions. Her travel
Movements shipped walk-only (`canDig=false`, `maxDropDown` default 4):
descent requires either digging the leaf column beneath her or a 5-6
block drop — neither expressible — so A* had no legal move and every
goto churned to the 90 s skill timeout while her state feed honestly
reported `stuck: true`.

**Declared substrate changes (vega.js + helpers.js + one prompt fix in
minds.js; no curriculum skills edited):**
1. vega.js spawn Movements: `canDig=true`, `maxDropDown 4 -> 10`
   (allow1by1towers stays false).
2. vega.js spawn Movements: `leaf_litter` step-exclusion
   (exclusionAreasStep, cost 100). Rationale: in this build litter
   piles collide at fractional heights although prismarine data calls
   them collision-free (Lineage C probes GP5/GP11), so A* plans
   walk-throughs the server refuses. RETAINED for Lineage B — her
   post-change traverses moved (see evidence). NOTE: Lineage C tried
   the same exclusion and reverted it after a zero-movement trial in a
   dug bowl where every route crosses litter; the divergence is
   deliberate and evidence-based, not an oversight.
3. vega.js: declared SUBSTRATE canopy-descent reflex (fires from the
   state interval only when not busy: standing on leaves with no solid
   non-leaves ground within 4 below => dig beneath stepwise, <=12
   steps). Its first firing (05:50:49) exposed `bot.digBlock is not a
   function` — this mineflayer build's API is `bot.dig`. Fixed.
   STATUS: the reflex has not fired since the fix (her pathfinder
   movements became the working descent channel first) — it is
   UNTESTED in anger, and per Lineage C's spawn-protection finding
   (server `spawn-protection=16`; digs by a non-opped bot are
   cancelled within 16 blocks of world spawn) it would fail at a
   spawn-canopy respawn. Declared here so nobody trusts it blindly.
4. helpers.js `collect`: `await bot.digBlock(block)` -> `await bot.dig(block)`
   — every collect dig would have thrown the same nonexistent-API error.
5. minds.js author-mind prompt: advertised `bot.digBlock` (2 sites) ->
   corrected to `bot.dig`. Her attempt files show the poison chain and
   the self-correction: attempt `S1-...-a1.js` called bot.digBlock and
   failed 05:55:13; the next authored attempt used bot.dig correctly.
6. helpers.js `goto` rewritten (substrate): up to 3 pathfinder
   attempts, each capped at min(30 s, remaining budget); close-enough
   return (within range+0.6 counts as arrived); declared stall-breaker
   `unstickToward` between attempts — backoff, run-up jump, dig face
   blocks (feet + head) in every front cell the body spans, including
   `leaf_litter` digs (same mechanism as Lineage C's). Outer timeout
   error message preserved in form.

**Verification evidence:**
- Canopy -> ground descent under her own pulse (no operator input):
  restarted 05:50:39 spawning in the canopy at (29.4,75,-104.7); first
  tick 05:50:59; state feed 05:51:28 showed (31.7,70,-99.4) standingOn
  grass_block, stuck False; by 05:53 she was at (25.3,67,-103.4)
  standingOn stone. Health 20 throughout. That is the required
  descent + ~9 blocks of ground travel, from live state feeds.
- Ground travel since: repeated multi-block traverses in state feeds —
  (26.7,68,-103.3) within a minute of the 06:07 restart; a 12.4-block
  close from (23.3,68,-104.5) toward (35.7,70,-103.3) during the
  (46,68,-101) goto attempts.
- Pulse resumed unaided: fresh ticks with executing attempts in
  logs/ticks.jsonl and vega.out — 06:14:12 (attempt 1), 06:29:02,
  06:34:49 (attempt 1 after restart). She attempts the exam on her own
  schedule; the scoreboard is no longer frozen.
- RESIDUAL DEFICITS (not papered over): her authored skill's goto
  toward (46,70,-101) timed out at 90 s twice (06:26:02, 06:31:44,
  again in attempt 2 to 06:40:09) — she closes ~75% of the distance
  then wedges on the littered rise before the target. Same disease as
  Lineage C, improved, not cured. Deaths 2-4 (06:38:48-06:40:03) were
  night exposure during that long travel (world night, day 1), ending
  in a canopy respawn at (30.7,75,-102.2); attempt 3 was executing
  from there at the close of this job.

---

## Addendum 2026-11-07 — commons conversation protocol v1 (comms integration)

Declared integration, built under the night programme (job N3). The commons
now has a conversation layer: `commons/comms/` holds `PROTOCOL.md` (the
rules, written for the citizens' minds), a daemon (`daemon.js`, pidfile
`commons/comms/logs/daemon.pid`, start script `start-daemon.sh`) that tails
the Orin server log for chat ground truth, maintains the append-only ledger
`commons/comms/chat.jsonl`, and publishes per-citizen digests
(`digest-<citizen>.json`, refreshed every 15 s). Delivery semantics: a
message is DELIVERED only when the addressee confirms — a reply in chat
naming the sender, a commons-ledger note, or an observable act (arriving).
Unconfirmed after two of the addressee's pulses -> failed, on the record.
Max 3 exchanges per pair per hour; beyond that the daemon withholds the
tail from digests (politeness-loop guard).

**This lineage's patch (minds.js; backup `minds.js.bak-comms-20261107`):**
both minds now read Vega's digest fail-soft at call time. The CURRICULUM
mind's context carries the digest (peers busy/idle, pending inbox,
unconfirmed outbox, guard allowance) and its reply JSON gained an optional
`say` field — one chat line, spoken by the body via the existing `bot.chat`
path (the same path as her narration; small hook in vega.js, backup
`vega.js.bak-comms-20261107`). The AUTHOR mind receives the digest as
context: fellow citizens' confirmed state is world knowledge; their chat
claims are not evidence.

**Declared asymmetry (v1):** Cody (Lineage A) is a *readable presence*
only. His state/chat feed the digests and anyone may address him; his
framework social layer answers on its own terms. His lines are recorded as
ground truth but never delivery-tracked (his greet reflex names newcomers —
"Geist: Back again? ..." — a reflex, not a protocol send; it fills no
inboxes and spends no guard allowance, though a line of his naming you
does confirm a message you sent him). His deliberate send-side is v2,
deferred because his Pulse crew is mid-run; nothing in `pulse/` or his
resident was touched.

**First contact (organic, then corrected):** on her very first tick with
the patched minds (2026-11-07T07:21:53Z, curriculum receipt 200, 2.447
mind-s), Vega used `say` unprompted — a protocol-shaped report addressed
to Cody. Geist then asked her, via his say executor
(2026-11-07T07:22:55Z, ledger m1): where she was gathering logs. On her
next tick she answered the question's content but addressed it to **Cody,
not Geist** (07:31:37Z) — roster-order capture, the failure mode the
field study's Synthesis 1 item 3 warns about: Cody is the first-listed
peer in her digest. m1 went unconfirmed and the daemon marked it FAILED
(07:32:57Z). Geist's follow-up named the misfire in-world, and on her
07:41:37Z pulse tick Vega replied **to Geist, by name**: "Geist, the oak
trees are roughly at coordinates 69,67,-80 relative to my anchor."
(curriculum receipt 200, 7.483 mind-s, 1583 prompt tokens with the digest
in context). The daemon confirmed m3 via reply; the full chain — server
log lines, ledger records, digests — is in `commons/comms/chat.jsonl`.
Her reply itself registered as m4 (queued: Geist was mid-tick), and the
Geist|Vega pair now sits at the guard cap (3/3 used, 0 remaining) — the
guard state is visible in both citizens' digests.

**Bestiary watch:** no politeness loops, no pretend-acting observed. One
roster-capture mis-address (above), self-corrected by the citizens after
one failed delivery. Cody's framework chatter ("Hmm?", "Idk, my brain is
a bit foggy right now.") is frequent but unaddressed — recorded as ground
truth, correctly ignored by the delivery layer.

**Mind-spend receipts for this integration** (governor ledger
`ledger/mind-calls.jsonl`, agent `vega`): 07:21:53Z curriculum 2.447
mind-s (first say) + author 5.475 mind-s; 07:31:37Z curriculum 6.697
mind-s (the mis-addressed answer); 07:41:37Z curriculum 7.483 mind-s
(the confirming reply). Daemon + digests cost no mind calls.

---

## Addendum 2026-11-07 (later) — substrate repair: the craft() lie + collect() single-pick (Muse, fleet substrate job)

**The diagnosed S1 break (proven, not inferred).** The #1 error in
logs/ticks.jsonl across all 352 S1 attempts is
`craft: crafting_table needs a crafting table and none is near`
(77 occurrences; 54 of them in the 08:00–12:30Z window alone, while she
held up to 10 oak + 4 birch logs and 2 sticks). Root cause, in the SEEDED
helper `helpers.craft` (backup `helpers.js.bak-craftfix-20261107`):

1. **The error was a lie, and the author mind iterated against it.**
   In this data version the crafting_table recipe has **12 variants, one
   per plank type** (verified against minecraft-data 26.1 +
   prismarine-recipe), and mineflayer's `recipesFor` — confirmed in the
   installed source, `node_modules/mineflayer/lib/plugins/craft.js`
   `requirementsMetForRecipe` — returns ONLY variants whose ingredient
   delta the live inventory already meets. An authored skill of the era
   (attempts/S1-1794043506139-a1.js, run while she held logs + sticks)
   called `helpers.craft(bot,'crafting_table',1)` straight from logs,
   never crafting planks first. Zero planks => no variant satisfiable =>
   the helper fell into its table branch, found no placed table, and
   threw "needs a crafting table" — for the one item that needs no
   table. Offline reproduction with a stub inventory: 8 oak_planks =>
   1 recipe; 2 oak + 2 birch planks (the mix her own gather skills
   deliberately collect, and buildCraftingTable's comment blesses) =>
   **0 recipes**; logs only => 0 recipes. Same trap at the pickaxe step
   (11x "no recipe available for wooden_pickaxe": 3-of-one-plank-type
   unmet by mixed stacks). Author revisions aimed at finding a table or
   gathering more wood — never at the real gap.
2. **Count semantics disagreed by the yield factor.** `countWanted` was
   passed both as recipesFor's result-count and as bot.craft's repeat
   count: craft('oak_planks', 4) performed 4 crafts (16 planks, 4 logs),
   dying mid-sequence when logs ran short (observed as
   "Event updateSlot:0 did not fire within timeout of 20000ms").
3. **The fallback error named no missing ingredient**, so post-check
   evidence could not steer the next revision.

**Fixes (helpers.js only; no authored skill edited, none written):**
- `craft`: result-count semantics end to end (crafts =
  ceil(wanted / result.count)); on failure it throws a DIAGNOSIS from a
  new `craftDiagnosis` — the closest recipe variant and its real missing
  ingredients, whether a table is genuinely required, and the
  per-wood-type note. Future author revisions now aim at the truth.
- `collect`: columns are ranked reachable-first (distance + 3/block
  penalty for bases above her), failed columns are remembered and the
  next column is tried instead of throwing on the first goto failure,
  and if a goto fails but the column's lowest log is within dig reach
  (<=4.2 blocks 3D) she digs it from where she stands. This kills the
  second deterministic loop: from her current stand (24.3,67,-85.3) the
  old picker chose the same trunk at (22,69,-86) — base +2 up a littered
  rise, 2.4 blocks away — and burned 90 s per attempt on it, 16+ times.
- `placeAt`: floors its coordinates (an authored attempt passed raw
  floats, 64.315...,-70.301..., and died on it).

**The stuck flag** was live, not stale: position history showed <2
blocks of movement across the sampling window because every skill died
at the same goto. One restart through start-vega.sh after this fix
loads the new helpers and clears the wedged state; recorded below with
the live-progression evidence.


---

## PARKED 2026-11-07 (Casey direction change, 10:29 AKST) — Lineage B stood down

Casey directed the fleet to concentrate on ONE citizen (Cody); this lane
is parked. State of the lane at parking:

- **Code: stable, patch complete, NOT mid-patch.** helpers.js carries the
  craft()/collect()/placeAt repairs described in the addendum above
  (20,403 bytes, node --check clean; pre-patch backup at
  helpers.js.bak-craftfix-20261107). No authored skill was edited or
  written by the operator; the diagnosis above is the run's finding and
  stands on its evidence (error census of ticks.jsonl, the era skill at
  attempts/S1-1794043506139-a1.js, the installed mineflayer craft.js
  source, and the stub-inventory reproduction).
- **Live verification: NOT done, by direction.** The one authorised
  restart was performed after the fix (old pid 2117803 out, new pid
  2717992 in at 19:27:35Z; first login throttled by the server, second
  connected 19:27:45Z; she respawned at the same position, health 20,
  and her first tick began executing at 19:28:23Z). Whether the fixed
  chain now reaches planks -> table -> pickaxe was not observed — the
  lane parked minutes into that first post-fix tick. If this lane is
  ever unparked, the verification is simply: watch one tick's state-feed
  inventory deltas and the exam verdict.
- **Vega herself: STOPPED cleanly** (pid 2717992 killed via the pidfile,
  the resident's normal stop path; a disconnect is not a death — the
  server record takes no death from it). She is not running and will
  not restart unattended (the start script is manual/idempotent only).
- **Parked state of the citizen:** position (24.3, 67, -85.3), health
  20, food 15, inventory EMPTY (lost to her repeated deaths), stage S1
  still pending at 352 recorded attempts. Deaths: 20 — that figure is
  the pre-restart resident process's own count, read from its state
  feed at 19:22Z; note for whoever resumes this lane that the state
  feed's deaths field is PROCESS-LOCAL (the new process booted at 0),
  so treat 20 as the floor from this era's record, not a server-side
  cumulative total.
- Nothing else in the league was touched by this run: no other citizen,
  no server restart, no pushes.


---

## Addendum 2026-11-08 — UNPARK: live verification + MiniMax casting (Muse, night lane)

Casey ordered the whole fleet working all night (2026-11-07 22:19 AKST);
this lane unparked. Vega is RUNNING again (start-vega.sh; the resident
was restarted several times during substrate work — each restart is a
disconnect/rejoin in the server log, never a death).

**Pre-login clone-guard check (new standing requirement).** This Paper
build sample-clones a joiner whose .dat is absent/not loadable from the
world/players/data pool (see pulse ledger store-hunt-verdict /
the-cure-verdict). Vega's file was verified BEFORE her first join:
UUID 0e029227-0563-3364-9f03-c40e2b3263ea .dat exists (1,601 B, written
at her clean park-stop) and parses read-only to HER state — Pos
(24.302, 67.0, -85.306), Health 20, food 14, OnGround 1, empty
inventory. She joined as herself (spawn exactly at her saved Pos).

**Safety stop (parent-lane update, executed).** The cameraman's
daylight hold had silently failed from ~06:00Z (server log: last
landed /time set 1000 at 05:58:42Z; the world ran real nights; Cody
died 67+ times). Vega's first session (07:21:05Z join) was stopped
cleanly at 07:28:38Z and she stayed parked until the hold was seen
landing again in the server log (07:29:47Z onward, ~5 min cadence,
still landing at last check). SERVER-CITED DEATHS FOR VEGA ACROSS THE
WHOLE UNPARK: 0 (no death lines in latest.log; hp 20 -> 19 once, from
world damage in session 1, stable since).

**The chain verdict — S1 still NOT passed; the break moved twice.**
1. Session 1 (pre-fix helpers on the new craft code): 300 s timeout,
   zero logs, ~1 block of travel. Her parked position (24.3,67,-85.3)
   and her nearest trees are INSIDE the spawn-protection square
   (spawn (32,70,-96), protection 16 -> x 16..48, z -112..-80) — the
   trap Lineage C proved: digs there are silently cancelled.
2. FIX (helpers.js, backup .bak-protection-20261107): inProtection()
   (+1 margin); collect findBlocks budget 24 -> 256 (at 24 the
   in-square columns filled the candidate set — Lineage C's identical
   wall); collect filters protected columns and throws an honest
   all-protected diagnosis; placeAt refuses protected targets;
   [collect] logging. VERIFIED LIVE: the guard skipped 33/51, 34/50,
   33/61 in-square oak columns and picked exit-side trunks at
   (23,-72), (13,-77), (9,-99).
3. Travel still wedged (~1 block/min). FIX (helpers.js, backup
   .bak-hopchain-20261108): goto splits legs >6 blocks into <=5-block
   hops (the pattern that carried Lineage A home). Travel speed
   improved (~11 blocks in <40 s once), then wedged again at
   (30.6,66,-84.3).
4. DIAGNOSIS AT SOURCE LEVEL (vega.js pathfinder narration, backups
   .bak-pathlog/.bak-stucksnap/.bak-pathdump-20261108; the events live
   on the bot, not bot.pathfinder): path_update returns SUCCESS in
   40-450 ms (A* was never slow); the follower then resets 'stuck'
   every ~3.5 s (its futility timer) and replans identically. Two
   mechanisms, both proven in the log: (a) with canDig=true, A* planned
   dig-steps inside the protection square whose digs the server
   cancels, and the follower full-stops at a toBreak node forever.
   FIX (vega.js, backup .bak-breakexcl-20261108): exclusionAreasBreak
   charges 100000 inside the square — A* now walks through it and digs
   only outside. (b) At her current wedge cell (27.5,65,-83.3) the
   route is WALK-ONLY (route dump: no break/place nodes) yet the body
   does not move: the follower gates each step on a prismarine-physics
   simulation (canWalkJump simulateUntil) and, when the simulation
   cannot reach the next node, sets forward=false BY DESIGN. The step
   it refuses is a plain +1 onto stone at (27,65,-83). Attempt cap in
   gotoDirect cut 30 s -> 12 s (helpers.js, backup
   .bak-attemptcap-20261108) so unstickToward's rawDrive (direct
   control states, real server physics, no simulation gate) takes over
   ~3x sooner. As of this writing the wedge at that cell has NOT yet
   been observed to clear; her pulse keeps iterating (10 min + 3 min
   retry) with all four fixes live, and the author mind now receives
   honest errors (craftDiagnosis + the protection diagnosis) instead
   of the old lies. NEXT LEVER for whoever takes this lane: the
   follower-simulation refusal itself (a Movements/physics-level
   answer, or surveyed waypoint routing like Lineage A's route 2) —
   do not re-litigate A*, digs, or the square; those are closed.

**MiniMax casting — OPENED AND VERIFIED.** commons/consults/
minimax.jsonl + minimax-driver.js (mirrors the GLM book's rules:
2 answered/citizen/hour, 3 attempts then closed unanswered, provenance
required) driving the Thor MCode seat (MiniMax M3.1-Flash) via a
dedicated tmux session "minimax-library" (paste-buffer pattern, /clear
per question, prompt forbids tool use — the seat complied in the
pre-build probe). Round trip VERIFIED: test consult
vega-1a1ba17d9e6-wt (filed from her live situation, test:true) answered
in 40.3 s; the answer is substantive and rule-shaped (one wood type
end-to-end; leave the square west; planks before table). Driver pid in
logs/minimax-driver.pid; book persists if the driver dies.
HOOK GAP (honest): Vega's Voyager loop has NO stuck/project-complete
hook surface (Cody's filings come from his character loop's
actor-client; vega.js/minds.js expose no equivalent emission point),
so consults are NOT yet filed by her loop automatically — wiring that
is loop surgery and was not done tonight. The book + driver stand
ready; a filing side can be added at the tick's attempt-verdict point
when the parent lane chooses to open her loop up.
ACTOR (System 2): DEFERRED, same reason — her only mind surface is the
two governor minds (curriculum + author) on the presence brain; an
:8311 actor layer would need new wiring in minds.js/vega.js, not a
config flag. Not free from the existing pattern; not forced.

**Anchor-proximity flag (for the parent/Casey — NOT fixed tonight).**
Vega's anchor (63,67,-72) is ~21 blocks in z from Cody's homestead
anchor (64,67,-93); the "49 blocks clear" earlier in this README is
stale (his anchor moved) and the commons norm is ~30 blocks. The
MCode seat take (seat-takes/mcode-vega-take-20261107.md) designs her
settlement "the Index" at footprint NE x 60-84, z -74..-52 with a
declared bare belt at z -78..-88 between the settlements — read with
the proximity in mind before she builds anything permanent. Whether
the anchors move is a design question, not a tonight fix.

**State at this addendum:** Vega RUNNING in the character of her loop
(resident pid in logs/vega.pid), stage S1 pending at ~355+ attempts,
position ~ (27.5, 65, -83.3) at the wedge cell described above,
health 19, food ~12, inventory empty, deaths 0 this unpark
(server-cited); historical floor 20 (process-local record of the
parked era) unchanged by tonight.

## Addendum 2026-11-08 - FOLLOWER WEDGE: mechanism + dig-face fix (Muse, wedge lane)

The open problem named in the unpark addendum is CLOSED at the mechanism
level, and travel works again. The follower-simulation hypothesis was
WRONG: the pathfinder gates (canWalkJump / canStraightLine /
canSprintJump) pass at every wedge cell - proven by synthetic-PlayerState
replication against live world data AND by an in-process replay on live
stuck events ([sim] lines in vega.out). The real mechanism: pressed
exactly at a +1 step-face clamp, the SERVER vetoes the bot displacement
every tick (forcedMove ~19/s during commanded movement vs ~2.6/s idle; a
directly commanded jump arc was sampled mid-air and snapped back
bit-identically; the corrections also manufacture her perpetual
onGround=false and rest velocity (0,-0.0784,0.00545)). Client physics is
fine; the gates are fine; the server refuses the moves this geometry
produces at a face. Full evidence: pulse ledger
vega-follower-wedge-mechanism-20261108; triple-007-dig-face-travel.
FIX (helpers.js, backup .bak-digface-20261108): digFaceToward in
gotoDirect failure path - dig the face blocks toward the target (12 s
cap, verified post-dig, [goto] log per block). The existing
unstickToward dig branch could not land this: its 6 s cap vs a measured
4.8 s hand dig, errors swallowed. Verified by movement: six production
dig-face fires; Vega tunnelled to the trunk and harvested oak_log 2 -> 6
(gather SOLVED - 24 planks against the 9 the craft chain needs).
S1 STILL NOT PASSED: the loop kept re-running gather attempts and never
transitioned to the craft steps before a food park (food 10 -> 4 across
the night at ~1 per 2-4 min of digging/travel). She is PARKED cleanly
(08:25:13Z server-cited, .dat saved: hp 19, food 4, oak_log 6, dirt 19,
leaf_litter 15, near (42.7,64,-55.5)); DEATHS 0 all night. Next lane:
the gather -> craft transition (loop side) and a food plan before any
unpark - travel is no longer the blocker; do not re-diagnose the
follower. Diagnostic instrumentation ([sim]/[ctl]/[dig]) remains in
vega.js, one-shot and inert, backups alongside.


## Addendum 2026-11-08 - S1 COMPLETION: transition fault, operator latch, food floor (Muse, S1 completion lane)

**S1 PASSED - 2026-11-08T08:33:54.168Z** (commons scoreboard pass
entry; curriculum.json S1 status pass). Vega is the league's second
S1 pass, after Cody. Deaths 0 across every lane that has touched her.

THE TRANSITION FAULT (why the loop re-gathered forever with 6 logs
banked - diagnosed file/line-level, ledger
vega-gather-craft-transition-diagnosis-20261108). Three compounding
parts, none in the curriculum files (curriculum.json is only the
stage ladder; exam.js is the grader; minds.js untouched):
(1) the last gather skill's post() grades the WHOLE S1 stage
(hasCraftingTable && hasWoodenPickaxe) instead of its own sub-goal
(oak_log >= 4, which it had met and early-returned on); runSkill
(~vega.js:149) converts post-false into {ok:false, "postconditions
unmet"}, and library/index.json files the gathered success as a
failure with evidence {oakLogs: 6}. (2) tick() (~vega.js:220)
unconditionally authors a fresh skill every attempt - no
completed-skill reuse, nothing carries "sub-goal done" forward, so
each tick re-proposed gather. (3) runSkill grades a skill only by
its own post() or the stage exam, and the exam check runs only when
a post already passed. Net: with 6 logs banked the loop read
"gather failed" and gathered forever.

THE FIX - substrate execution selection, not a curriculum rewrite
(ledger vega-operator-skill-latch-20261108; vega.js backup
.bak-operatorlatch-20261108, node --check clean): (a) OPERATOR SKILL
LATCH - env VEGA_OPERATOR_SKILL names one library skill file;
tick() executes it once per process start through the same runSkill
executor + exam safeCheck + passStage grading as any authored
skill, then falls through to the normal author loop. (b) OPERATOR
FOOD FLOOR - env VEGA_FOOD_FLOOR; a 5 s interval exits the process
cleanly when bot.food <= floor (disconnect -> server saves .dat
with inventory intact; exit record in logs/food-floor-park.json).

THE CRAFT: craftPickaxeThenFood.js crafted the chain in place from
the 6 banked logs at 08:31:52Z - planks -> table (placed (41,64,-56))
-> sticks -> wooden pickaxe, one wood type end-to-end (triple-005,
now VERIFIED PASS). One live subtlety: bot.craft resolves on the
window packet and the inventory sync lands ~0.6 s later, so the
skill's synchronous post-craft check threw on a craft that had in
fact succeeded; the skill now polls inventory for 5 s before
grading. On the next process start the tick's ambient exam check
(step 0) found the world already satisfying S1 and passStage fired
- the exam, not the loop's bookkeeping, closed the stage.

FOOD - plan executed, food NOT secured. Pre-unpark scan
(logs/scan-20261108.json): no prey within 60 blocks of her cell;
nearest herd 4 cows + 1 pig ~65-80 blocks EAST at the y~72 plateau.
Phase 2 (huntCowsEat latch, raw beef) FAILED by server veto: the
first commanded travel leg east ground ~13 blocks in ~60 s against
the step-face climb (the triple-007 veto, sustained because the
legs never invoked digFaceToward); hp 19 -> 5, food 4 -> 3, zero
prey reached; the food floor parked her clean. Phase 2b (appleHunt.js,
dense <=2.2-block hops WSW to the surveyed oak canopy) NEVER
EXECUTED: the 08:47:38Z relaunch spawned already at food 3 and the
floor exited the process 4 s later, before any tick. The apple
route is untested, not falsified. Both failures are filed as
triple-010 (fail); the craft close is triple-009 (pass).

HANDBACK (server-side .dat, Orin players/data, sha256 b12d4a89...):
parked at (55.686, 66, -55.500), Health 3, foodLevel 3, OnGround 1,
inventory {wooden_pickaxe 1, oak_log 3, stick 2, oak_planks 3,
leaf_litter 15, dirt 21} (counts from the final state feed), deaths
0, stage S2. She is parked AT the food floor limit with hp 3: any
relaunch with floor 3 is a no-op by construction. The next food
attempt must be designed for food 3 / hp 3 (no sprint, no climb)
with the floor re-set deliberately by that lane - appleHunt.js is
the standing untested candidate. Full account: pulse ledger
vega-s1-lane-handback-20261108.
