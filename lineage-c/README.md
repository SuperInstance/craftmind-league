# Lineage C — "the Deliberator" (GITM pattern)

Citizen: **Geist**. World: Paper 26.1.2 on the Orin (192.168.0.50:25565, offline mode, survival).
Home: Thor `~/craftmind-league/lineage-c/`. Anchor: **(7, 67, -85)** ("HOME") — a dry grass
plateau surveyed on foot, ~31 blocks clear of Cody's (24, 67, -111) and far from Vega's
(63, 67, -72). Re-anchored 2026-11-07: the original chartered anchor (-16, 56, -78) is a
pond (surveyed on foot, N5) — see the N5 addendum and the re-anchor addendum at the end.

## Architecture (GITM, faithfully, in our own code)

Three LLM roles compose a **closed vocabulary of structured actions** over **fact files**.
No code generation, no learned controller. The minds may only compose the vocabulary;
they may not write code.

- `executors.js` — the closed vocabulary, implemented once, by hand, over mineflayer +
  pathfinder: `goto` (place|coords|block|entity), `collect`, `craft` (one recipe step),
  `equip`, `place`, `store`, `eat`, `shelter-enter`, `shelter-exit`, `flee`,
  `attack-nearest`, `wait`, `say`, and `descend` (dig the block beneath and drop, step by
  step, until standing on ground — added day one on the Lineage B crew's prescription;
  citizens land in this forest's canopy and gravity is the one movement channel this
  world never refuses). Every executor returns `{ok, evidence}` verified from world state.
- `facts/` — the deliberator's world knowledge as plain text: `recipes.md` (**generated**
  by `facts/gen-facts.js` from the league's installed minecraft-data 26.1 recipe tables —
  GITM used the wiki; ours are generated from the game's own data, and are declared as
  seeded facts), `techtree.md` (settle-in progression dependencies), `shelter.md`
  (canonical shelter blueprints), `world.md` (spawn, anchors, citizens, house rules).
- `minds.js` — three governor-backed roles (all mind calls go through the league governor
  on Thor :8642, identities `geist` / `geist-mind`, → presence brain :8310):
  - **PLANNER** — current exam stage + live state + facts + retrieved memories + (at S3+)
    pond headers as advisory facts → one JSON plan (ordered structured actions only;
    a substrate validator enforces the vocabulary; one feedback bounce for malformed JSON).
  - **CALCULATOR** — validates the plan against the facts: recipes satisfiable from
    inventory + the plan's own earlier steps, quantities sane; revises counts/targets or
    bounces the plan back with the reason.
  - **REFLECTION** — after execution (or on the first not-ok action, cap 3 replans per
    tick): appends one (situation, plan, outcome) entry to `memory/plans.md`; the PLANNER
    retrieves the top-3 keyword-matching entries next tick.
- `geist.js` — the resident body: auto-respawn, relaunch loop, state feed
  (`geist-state.json` every ~10 s), operator command channel (`command.json` →
  `command-result.json`, executed through the same executor path), pulse loop (first tick
  +75 s, then every 10 min; a retry timer after failed ticks). Declared survival substrate
  (not deliberation, each firing logged as SUBSTRATE): oxygen swim-up, emergency eat at
  food ≤ 4 when food is carried, canopy-descent check after (re)spawn.
- `verify.js` — world-evidence stage checks for the shared exam. Verdicts come ONLY from
  world evidence; stage events are appended to `~/craftmind-league/commons/SCOREBOARD.jsonl`
  as lineage `"C"`, citizen `"Geist"`.

## The exam (shared)

S1 wooden tools → S2 stone pickaxe → S3 enclosed roofed shelter + door + torch at his
anchor → S4 chest inside with ≥8 items stored → S5 one full night, zero deaths, in/near
shelter. The commons pond is read as FACTS: before planning S3+, the PLANNER reads
pond-published notes' headers as advisory text, and the plan log records when a pond item
influenced a plan (cross-lineage learning made visible). Passing plans are published to
the pond as `C-plan-<stage>.md` with provenance + verdict evidence.

## The wall (found day one, 2026-11-07 — read this before judging any lineage's progress)

**Bot locomotion is refused by this world at the server level, for every lineage.**
Measured, not theorised:

- A mineflayer bot holding `forward` for 5 s displaces **0.00 blocks**; forward-only,
  forward+jump, forward+sprint and forward+sneak all measure 0.00 (debug probes,
  GeistProbe, fresh player, world spawn).
- During the hold, the server sends the bot a fresh clientbound `position` teleport
  roughly **every tick (~20/s)**, each with an incrementing `teleportId` and the bot's
  exact login coordinates. The client confirms each one (mineflayer supportFeature
  `teleportUsesOwnPacket` = true; physics.js writes `teleport_confirm`) and is re-pinned.
- mineflayer-pathfinder computes valid paths on this terrain (6-node path, `success`),
  but its follow loop can only report `PATH_RESET reason: stuck` every ~3.5 s — the
  pathfinder's own physics line-checks pass when called directly, and a prismarine-physics
  simulation of the same body walks 4 blocks in 40 ticks. The refusal is between the
  client and the server, not inside the pathfinder.
- **It is not a Lineage C defect.** The pre-existing Lineage A resident (Cody) was
  observed stationary at his dock (46.7, 65, -85.7) for a full 60 s watch; Lineage B's
  Vega is stationary in her spawn canopy (29.7, 75, -103.1). The only displacement
  channel that has ever worked for a bot here is **gravity** (stepping/falling off the
  canopy), plus sub-0.2-block drifts.
- The spawn area makes it worse: fresh players land **on the forest canopy** (y≈75–77;
  ground ≈70). Geist's first hours were spent pathfinding inside a tree; the falls cost
  him 20 → 1.3 HP before the cause was diagnosed.

Mitigations built into the substrate (declared, not hidden): walk-only travel movements
(`canDig=false`, `allow1by1towers=false` — Lineage B's field finding, via operator note);
column-base targeting for tree harvest (never path to a canopy block); hop-chained goto
(≤14 blocks) under a **movement watchdog** (an action whose body has not displaced for
6 s fails in seconds, so the deliberation loop can iterate); a dig-reach gate in
`collect`; idle via `setGoal(null)` never `pathfinder.stop()` (stop-poisoning,
root-caused by Lineage B); the `descend` executor. None of this cures the pin — it makes
the citizen fail fast, honestly, and keep deliberating. A server-side or client-stack
fix is outside this lane's scope (no server restarts, no Orin changes).

Known shared-world condition: the Orin cameraman issues `/time set 1000` roughly every
10 minutes while filming, which can erase a natural night — S5 attempts by ANY lineage
must reckon with it. Cody's resident also has a known fragility: a server restart kills
his in-process reconnect (boss_bar crash); Geist's body relaunches as a fresh process
instead and does not share that failure mode.

## Status (2026-11-07, Phase 1)

- Geist is **resident**: server log shows him joined and logged in at
  (35.697, 70, -107.573) (Orin `~/minecraft-server/logs/latest.log`), state feed
  live, HP 1.3 (canopy-fall damage from the first hours; food 17; deaths 0).
- Facts seeded: `recipes.md` generated from minecraft-data (4,621 B, spot-verified),
  `techtree.md`, `shelter.md`, `world.md` (geography filled from the first survey).
- Executor smoke (operator command channel): `descend` ok (steps: 0,
  standingOn: grass_block — already on ground); `collect log 3` **failed honestly**
  (gained 0 — the locomotion wall); `goto` fails under the movement watchdog in
  seconds with position evidence. The brief's scripted smoke (goto a tree, collect
  3 logs, return) cannot complete in the world's current state; the failure is the
  server-level pin documented above, shared by all three lineages.
- **First deliberation tick ran end-to-end** (2026-11-07T05:28:42Z): PLANNER →
  CALCULATOR (revised counts/targets) → execution → REFLECTION, × 3 attempts
  (the replan cap), each appended to the commons scoreboard as lineage "C"
  attempts and to `memory/plans.md` as (situation, plan, outcome) entries. The
  plan shape was a correct settle-in decomposition (descend → collect log →
  planks → sticks → crafting table → place → wooden pickaxe); every attempt
  failed at the collect step against the wall. Governor receipts for the tick's
  mind calls are in `~/craftmind-league/ledger/mind-calls.jsonl` (status 200).
  The presence brain held the JSON-plan discipline throughout — no format
  loosening was needed or made.
- Stage: **S1, not passed** — blocked on the world locomotion wall, not on the
  architecture. The pulse continues every 10 minutes; if the world's pin is ever
  lifted, the same loop should start passing stages without code changes.

## Process notes

- Build order: governor identities → facts (generated + hand-written) → executors →
  minds → body → launch → diagnosis campaign (canopy → pathfinder → packet capture)
  → mitigations → first deliberation tick.
- The diagnosis campaign's debug scripts were scaffolding and have been deleted; their
  findings live in "The wall" above, with the measurements.


---

## Addendum 2026-11-07 — substrate repair: the locomotion floor (Muse, fleet substrate job)

This addendum corrects the record and declares every substrate change made
today. **The "wall" described in the section above was misdiagnosed.** There
is no server pin and no ride state (settled with packet-level evidence in
`~/craftmind-league/repair-cody/`). What the probes measured instead:

**Pocket geometry at the original stuck spot (35.697, 70, -107.573):** not a
pocket — a flat grass plain, ground sheet top y69 (stand y70) for >=6 blocks
in every direction, leaf_litter at feet level in most cells, low canopy
(birch_leaves y72 in patches), trunk bases 3-6 blocks away. A bot CAN walk
out in every direction (probe GP2: 12.5 blocks in 3 s raw). He never did,
because of the mechanism below.

**The failing mechanism, as measured (probes GP4-GP12):** `leaf_litter`.
prismarine-data for this version reports leaf_litter with `shapes: []`
(no collision) in all 27,846+ states, so mineflayer physics and the
pathfinder treat it as air — but in this build litter piles collide at
fractional heights. Bots perch on litter at stand+0.12/+0.42/+0.9
(measured at (48,-103), (51,-102), and the y=81 respawn canopy), walk
into some litter cells at full speed and face-stop at others (deceleration
profile, stop exactly at face+0.30), per cell. A* plans walk-throughs the
server refuses; the follow loop churns in `path_reset reason: stuck`
every ~3.5 s until caller budgets die. Compounding it, travel Movements
shipped walk-only (`canDig=false`), so any route whose only continuation
is through a step, trunk or leaf block had NO legal plan at all.

**Declared substrate changes (geist.js + executors.js only; the closed
action vocabulary is UNCHANGED):**
1. geist.js travel Movements: `canDig=false -> true` (`allow1by1towers`
   stays false). Routes through diggable blocks can now exist.
2. geist.js travel Movements: `maxDropDown 4 -> 10` (mirrors Lineage B).
3. executors.js `gotoPos`: hop step 14 -> 6 blocks, hops cap 16 -> 40;
   no-movement watchdog 6 s -> 12 s (tolerates a hand-dig of a step
   block); the stale "server pins bot locomotion" comment and the
   collect error text ("world locomotion wall") corrected.
4. executors.js: declared stall-breaker `unstickToward` in the substrate
   layer — when a hop ends without >=0.8 blocks of progress: back off,
   run-up jump (a backoff + momentum jump was measured clearing a
   1-block step, GP8: 4.6 blocks, landed on top), then dig the face
   blocks (feet + head) in EVERY front cell the body spans — including
   `leaf_litter` itself, removing the client/server disagreement at the
   face (GP10's first version dug nothing: it filtered on
   boundingBox==="block" and the blocker was litter).
5. A `leaf_litter` step-exclusion (exclusionAreasStep, cost 100) was
   tried and REVERTED the same day: at the verification bowl
   (0,62,-83) it produced zero movement in 90 s (every local route
   crosses litter; A* budgets died on detours), while the un-excluded
   config demonstrably travels. Noted in code.
6. geist.js `canopyDescent` mechanism replaced TWICE in one day:
   v1 (blind step-off) -> v2 (dig down) -> v3 (pathfinder descent
   toward the anchor, elevation-based trigger). Why: the v1 step-off
   caused a DEATH LOOP at the current respawn point — Geist respawns in
   a tall canopy at (31.5, 81, -85.5), stepped off, fell ~16 blocks,
   died, respawned in the same canopy (deaths 1-4, 06:16-06:17).
   v2's digs then proved futile at that exact spot: the Orin server
   runs `spawn-protection=16` (server.properties, read directly) and
   Geist respawns at world spawn, where a non-opped bot's block breaks
   are cancelled by the server (leaf digs below his feet on a fresh
   session never completed; Lineage B's identical digs worked 19
   blocks from spawn, outside the radius). Movement is not protected,
   so v3 pathfinds down. Trigger is elevation-based (position >6 above
   anchor ground, no ground block within 4 below) because his client
   intermittently reads the supporting leaf block at the spawn column
   as air (`descend` reported standingOn "air" at y=81 on two fresh
   sessions while an observer read oak_leaves) — protection-cancelled
   digs leave the two block views disagreeing at that cell.

**Verification evidence:**
- Canopy -> ground: 2026-11-07T06:29:28 SUBSTRATE canopy-descent fired;
  06:31:08 "done at 5.2 64.0 -84.7 standingOn grass_block" — a 26-block
  traverse with a 17-block descent, hp 20 -> 19.3, no death.
- Scripted walks via his own goto executor: (52,68,-92) -> (44,68,-98),
  10.3 blocks toward (37,70,-107) in 81 s (06:13); (5,64,-85) ->
  (0,62,-84), 5 blocks descending stepped ground (06:31).
- RESIDUAL DEFICIT (not papered over): gotoPos made ZERO net progress
  in two 90 s budgets from a dug notch at (0.3,62,-83.3) (06:37, 06:41)
  — a hollow his own face-digging helped dig, with +1/+2 littered steps
  on the anchor side. Travel rate in dense litter/step terrain is
  ~0.1-0.26 blocks/s. He is mobile; he is not fast, and this notch
  class can still stall a budget.
- Deaths 7-11 (06:38-06:40) were night-mob kills while exposed on the
  ground after descent (the world was in night, day 1) — not
  locomotion failures; the death LOOP (deaths 1-4) is substrate-fixed.

**Pulse status — WALL, verbatim:** his pulse ticks fire on schedule
(06:30:36 "tick (first) — stage S1", 06:37:51), but every planner call
is rejected: `governor HTTP 400: request (4518-4543 tokens) exceeds the
available context size (4096 tokens)`. No fresh scoreboard attempt line
can exist until that is resolved; his last attempt lines are
2026-11-07T05:30:16 / 05:31:13 (pre-repair). The prompt grows with
memory/reflection content, so this is a deliberation-layer (prompt
budget) or governor-context issue — outside this substrate job's scope,
flagged here for the lineage owner.

---

## Addendum 2026-11-07 — N5: the dusk experiment (operator; facts + memory only, NO code)

**Question under test:** Geist's deaths 7–11 were night-mob kills while exposed
post-descent, and the count kept climbing (19 by 07:13 UTC — every one a mob
kill per the server log; zero falls/hunger/water). Lineage C's claim is that it
learns from facts + text memory. So the operator changed ONLY what he reads —
no new behaviours, no substrate reflexes — and watched whether the PLANNER's
output changes.

**Survey (fresh probe SurveyN53951, on foot, 2026-11-07 ~07:15–07:25 UTC):**
the chartered anchor (-16, 56, -78) is a POND — open water, surface y=62, sand
bottom y=55, water in every column ±4. It was never a build site. His operating
area around (5, 64, -85) is dry rolling grass (y60–67) with oak trunks a few
blocks east and a stony dip falling west toward the pond. The probe itself died
once on the night walk in (timeOfDay 18828), respawned, and reached
(12.4, 68, -82.3).

**HOME chosen: (7, 67, -85)** — dry grass plateau (ground grass y=66, flat
±2), trunks 4–6 blocks east, ~24 blocks from the anchor column (inside the S3
radius), on the route his own canopy descent already travels.

**Changes made (all dated 2026-11-07, this addendum is their declaration):**
1. `facts/world.md` — survey section added: the pond, HOME with coordinates,
   the litter behaviour of this forest (client data says non-solid; the server
   collides at fractional pile heights; travel 0.1–0.3 blocks/s), spawn
   protection (block-breaks cancelled within 16 of world spawn; movement
   fine), and the dusk fact stated plainly with his death record as evidence
   (19 deaths, all mob kills: 6× Zombie 06:16–06:18; Spiders ×6, Zombies ×4,
   Drowned ×2, Skeleton ×1 between 06:38–06:49). The stale "server refuses
   locomotion" fact is marked SUPERSEDED in place (it was measured false by
   controlled probes; it had never been corrected in the file).
2. `facts/techtree.md` — the dusk rule added in GITM style: a plan that
   leaves him unsheltered away from HOME after timeOfDay ~12000 is
   incomplete; S3's shelter is the long-term answer, HOME the interim one.
3. `memory/plans.md` — ONE operator-seeded reflection entry summarising the
   night deaths and the rule, provenance-marked in its first line as
   operator-written (his memory discipline distinguishes provenance).
4. geist.js RESTARTED via start-geist.sh to make the patch live: minds.js
   caches fact files at first read (`factCache`), so a running process would
   never see new facts. Restart noted here per the operator's scope.

**Observation protocol:** watch ≥3 ticks post-restart; quote the planner's
plans from ticks.jsonl/plans.md reflections; count deaths and causes from the
server log during the watch against the pre-patch baseline (19 deaths, the
last at 06:49:31 UTC; clusters ran ~6 deaths/2 min in the canopy loop and
13 deaths/11 min exposed on the ground). If he ignores the facts, that is the
finding — no code escalation.

---

## Addendum 2026-11-07 — commons conversation protocol v1 (comms integration)

Declared integration, built under the night programme (job N3). The commons
conversation layer lives at `commons/comms/` (`PROTOCOL.md`, the daemon,
the append-only ledger `chat.jsonl`, per-citizen digests refreshed every
15 s). Delivery = the addressee's confirmation (reply naming the sender,
a ledger note, or an observable act); unconfirmed after two of the
addressee's pulses -> failed; 3 exchanges per pair per hour, then the
daemon withholds the tail from digests. See Lineage B's README addendum of
the same date for the full build description and the declared asymmetry
(Cody is a readable presence in v1; his lines are recorded but never
delivery-tracked; his send-side is v2 and his Pulse was not disturbed).

**This lineage's patch (minds.js; backup `minds.js.bak-comms-20261107`;
geist.js untouched — the digest is read by the minds at call time):**
- PLANNER: context now includes Geist's comms digest (peers
  busy/idle/stage/position/distance, inbox awaiting his confirmation,
  his unconfirmed outbox, guard allowance), and its system prompt carries
  the protocol: to message a citizen, emit a `say` action whose text
  begins with their name; a reply naming the sender IS the confirmation;
  one open conversation per citizen; silence is a legal answer; another
  citizen's chat claim is not evidence — their digested state is.
- REFLECTION: receives his unconfirmed outbox with an explicit honesty
  rule — unconfirmed messages are recorded as NOT delivered, never as if
  the other citizen heard or agreed.

**First exchange (evidence in `commons/comms/chat.jsonl`):** Geist's
first protocol message was operator-seeded through the existing command
channel (a genuine question from his live state: S1, empty hands, dying
in the canopy) — m1, 2026-11-07T07:22:55Z, asking Vega where she gathers
logs. Vega answered the content but addressed it to Cody (roster-order
capture; see B's addendum), so m1 was marked FAILED at 07:32:57Z.
Geist's follow-up (m3, 07:34:52Z) named the misfire and asked her to
reply to him by name with the oak coordinates; her reply came on her
next pulse tick — "Geist, the oak trees are roughly at coordinates
69,67,-80 relative to my anchor." (07:41:37Z) — and the daemon confirmed
m3 via reply. The pair Geist|Vega is now at the guard cap (3/3) for the
hour, shown in his digest.

**Operational notes from the same night:** (1) Geist's deliberation was
governor-capped during the integration — his `geist` identity hit its
120 mind-second rolling-hour budget (HTTP 429 receipts in
`ledger/mind-calls.jsonl`, e.g. 07:22:46Z, 124.719/120) after the
evening's heavy ticking; the say executor path needs no mind call, which
is why the seeded messages could still be sent. His planner picks the
protocol up unaided as budget returns. (2) The daemon's two-pulse
counter was corrected mid-night from raw tick-log growth (which counted
Vega's per-attempt log lines as pulses) to tick-id counting; m1's
failure stands — she had a full tick with the message in her digest
under either count. The pre-fix ledger (containing Vega's first
spontaneous `say`, 07:21:53Z) is preserved at
`commons/comms/chat.jsonl.pre-codyfix`. (3) Bestiary: no politeness
loops, no pretend-acting; one roster-capture mis-address, corrected
in-world by the citizens themselves after one failed delivery.

**Budget fix (2026-11-06, later the same night):** the `geist`
governor budget in note (1) was raised 120 calls / 120 mind-s ->
300 calls / 900 mind-s per rolling hour in `config/governor.json`
(backup `governor.json.bak-20261106-224506`), governor restarted
via `proxy/start-governor.sh`. Verified in the ledger: a refusal
at the old ceiling at 07:44:48Z (124.216/120 mind-s), then a
`league-geist` chat completion at status 200 at 07:45:20Z.
Full record: `~/craftmind-league/BRAIN.md`, Governor budgets.


---

## Addendum 2026-11-07 — re-anchor: the pond is retired (operator)

**Change:** Geist's anchor moved from **(-16, 56, -78)** to **(7, 67, -85)**
("HOME"), everywhere it lives: `anchor.json` (the record the code reads at
boot), the `geist.js` fallback default (was {-16, 74, -78}), the substrate
canopy-descent target (it aims at the anchor record, so it now aims at
HOME), `facts/world.md` (the pond marked as the OLD anchor, superseded
with the date and the reason; HOME declared the anchor), and the header of
this README. The old coordinates stay visible in the record throughout —
provenance, not erasure.

**Evidence that forced it (N5's sequel):** with the pond still the anchor,
deaths 20-28 landed inside 3m20s — Drowned x7, Zombie x2 — the
respawn-canopy -> canopy-descent -> pond loop: every respawn put him in
the spawn canopy, the descent pathfound down toward the anchor, and the
anchor was open water. Death 20 also dropped and lost the best S1
inventory he has ever held (3 logs, 3 planks — from his furthest S1
execution). HOME was already surveyed (N5): flat grass, stand y=67, oak
trunks 4-6 blocks east.

**Landed with this change:** memory seed #2 in `memory/plans.md` (deaths
20-28, operator-seeded per the N5 corollary — deaths that happen between
ticks leave no trace in his memory unless seeded) and an exact S1 bill of
materials in `facts/techtree.md` (minimum 3 logs; 9 planks consumed —
table 4, pickaxe head 3, stick batch 2 — and 2 planks yield 4 sticks,
never 1: the planner's thrice-bounced stick arithmetic is now
contradicted by a fact at plan time). geist.js restarted via
start-geist.sh so the anchor record and the re-cached facts
(`factCache` in minds.js) go live.

---

## Addendum 2026-11-07 — descent disarmed by its own trigger; descend postcondition (operator substrate fix)

**The failure, as measured.** After the re-anchor to HOME (7, 67, -85),
Geist's plans ran the correct S1 bill of materials but every attempt died
at collect: the 08:29 tick's three attempts each ran `descend -> ok` and
then failed collect with the nearest trunk columns out of dig reach (last
distance 8.4 / 7.9 blocks). He never left his respawn cell
(35.2, 73, -92.3). Two mechanisms, both in this lineage's own code:

1. **The substrate trigger could not fire.** canopyDescent's v3.1
   condition — y > anchor.y + 6 AND no ground block within 4 below —
   evaluated at HOME: anchor.y = 67 put the height gate at y73; his cell
   IS y73 (73 > 73 is false), and the forest floor ~3 below falsified the
   second clause anyway. Under the retired pond anchor the same rule
   fired readily (toward the water). The mechanism (pathfinder descent)
   was never the problem; the trigger geometry disarmed it.
2. **The `descend` executor lied.** It dug the block beneath step by
   step and returned ok unconditionally. His cell is ~8 blocks from
   world spawn, inside spawn-protection, where a non-opped bot's digs
   are server-cancelled: the digs "completed" in the client, nothing
   relocated, and the plan proceeded as if he were on the ground — a
   postcondition violation of the executor contract ({ok, evidence}
   verified from world state).

**Fix 1 — trigger v3.2 (geist.js).** Support-based: fire when the
support block (first solid block within 3 below the feet — the scan
tolerates the spawn column's flickering leaf read) is a *_leaves block,
AND bot y > anchor.y + 2, AND the support is not a ground block
(explicit check; a ground support fails the leaf test by construction).
Cooldown: at most one firing per 60 s (lastCanopyAt), atop the existing
canopyBusy guard; call sites unchanged (spawn +6 s, respawn +6 s).

**Fix 2 — descend postcondition (executors.js).** ok ONLY if, within a
90 s budget, the body actually relocated: y fell by >= 1 (coded >= 0.99),
OR the block underfoot became a non-leaf ground block. Already standing
on a ground block returns ok at once with `alreadyOnGround: true` in
evidence. Strategy order: (i) pathfinder step-down (gotoPos) to the
nearest lower ground column within 14 blocks (top solid block is a
ground block, at least half a block below the current stand level),
then toward the anchor's ground point — movement is not
spawn-protected, so this is the reliable channel near spawn; (ii)
dig-down, only where digs take effect: after each dig + settle the dug
cell is re-read, and if it still holds the same solid block the dig was
cancelled — break, and fall back to (i) with the remaining budget
instead of reporting ok. If nothing relocates him: ok:false with
{fromY, toY, steps, standingOn, digCancelled, position} — a plan that
knows it is still in the tree can replan; a plan lied to cannot. The
closed vocabulary is unchanged (descend already existed); no facts or
memory files were touched. Backups: geist.js.bak-descendfix-20261107,
executors.js.bak-descendfix-20261107.

**Verification (2026-11-07, live, from his respawn cell).** Resident
restarted via start-geist.sh at 08:45:51 UTC; spawned at
(35.7, 73.0, -92.3). Trigger v3.2 fired at 08:45:58 — the first firing
ever at this cell — and the state feed showed y=70 within ~10 s; the
substrate's close-out at 08:47:38 reads "done at 33.3 70.0 -92.3
standingOn grass_block" (the 100 s cap expired on the anchor leg; the
floor was reached on the first leg). First tick 08:47:06: attempt 2's
plan ran `descend -> ok` at 08:48:21 via the alreadyOnGround fast path
(support: grass), then collected. The collect failure changed class:
the 08:49:35 and 08:59:15 collects carry NO out-of-reach suffix
(pre-fix: 8.4 / 7.9), and the direct executor measurement (operator
command channel, result written 09:01:44) — `goto {block: "oak_log"}` —
reports horizontalDistanceToTarget 3.3 from (25, 68, -86): the nearest
trunk column base is inside dig reach (< ~4) from his floor position.
Deaths: 28 at job start, 28 at job end — no verification deaths.

**What the collects then hit (world, not substrate).** From his floor
cell the digs themselves are now the wall: attempt 3's collect
(09:01:02) ended at last distance 4.5 on a later candidate after nearer
ones were consumed, and gains stayed 0 — his stand at (25.3, -85.7)
sits ~12 blocks from world spawn (executor's spawn record 26, 74, -98),
inside the protection radius, where breaks are cancelled (the fact
already stands in facts/world.md; his 07:51 digs near HOME, ~22 blocks
out, took effect). Where to stand when collecting is a planning
question from here; the substrate's part — get him down, and never
report a descent that did not happen — is closed. Two operator probes
are on record in logs/geist.out and command-result.json (collect x1 at
08:52:37: gained 0, plain error; goto anchor at 08:54:47: first aid out
of the pond dip he had waded into — oxygen recovered, deaths
unchanged). The resident was relaunched once more at 09:01:58 by
another night-programme job (its minds.js landed 09:00; not this fix)
and booted on the patched files; at this addendum's writing it is
running on the floor at (25.3, 68, -85.7), mid-tick.

## Addendum 2026-11-07 — Rolling Plans: plan-delta drafting A/B (operator mechanism, lineage-c minds only)

Implements Application B of the rolling-primitives design (plan-delta
drafting) in `minds.js` only (backup `minds.js.bak-rollingplans-20261107`).
Calculator, reflection roles, the closed executor vocabulary, and all
facts/memory content are unchanged; commits to `memory/plans.md` still
happen only through Geist's own reflection path, now with a provenance
line marking each entry as a full derivation, a continuation, or an
invalidated re-derivation. No plan entries were hand-written.

Mechanism. The last committed plan persists in `plan-state.json` with its
per-step verification results (from executor evidence: collect `gained`,
craft `operations`, final positions). On each derivation the planner's
mode is chosen as follows:

- CONTINUATION — a valid verified prefix exists (at least one step whose
  evidence checks out against current state) and no invalidation trigger
  fired. The planner is shown the previous plan step-annotated
  (DONE / FAILED / NOT REACHED) plus the state delta, and is asked only
  for the suffix after the first invalidated step. The suffix alone
  executes; the calculator verifies it against current state, as before.
- FULL — today's prompt, unchanged. Used when there is no committed base
  plan, no verified prefix, the continuation-depth cap is reached, a
  counterweight fires, or the arm is the full-only control.
- INVALIDATED — a full derivation forced by a surprise trigger (below);
  logged distinctly.

Counterweights (the design's centre, not options):

- Periodic full re-derivation: the A/B rotation itself forces full-only
  blocks, and continuation depth is capped (maxContinuationDepth 3).
- Surprise invalidation: any world-evidence contradiction of the base
  plan's assumptions discards the base and forces a full derivation —
  death since commit; inventory contradiction (the base plan's expected
  post-state is simulated from `facts/recipes.md` using measured step
  evidence and compared with the live inventory); position drift greater
  than 16 blocks from where the verified steps left him (checked only
  when the prefix ends at a known position).
- Lock-in guard: the same step failing the same way out of two
  consecutive continuation commits forces a full derivation; a
  continuation block contradicting state evidence for 2+ consecutive
  ticks without an invalidation firing stops the arm and is reported.

Config lives in `rolling.json` (no code edits to flip):
{"arm":"auto","blockTicks":3,"enabled":true,"maxContinuationDepth":3,"positionDriftBlocks":16}.
Every derivation logs a `plan-mode` line (mode, reason, arm, blockIndex,
depth, prefixLen, firstInvalidated) in `logs/ticks.jsonl`; arm switches
log `arm-block`.

A/B protocol (pre-registered): blocks of 3 ticks alternate arm B
(continuation-enabled) vs arm A (full-only control), at least 4 blocks
(2 per arm) or until a stage pass. Metrics per arm come only from the
governor ledger (agent `geist-mind`) and the ticks log: mind-seconds per
derivation (receipts attributed to the window [derivation, next
derivation); the final open window excluded), derivations per tick,
budget-exhaustion (429) events, stage passes, lock-in signals.

Offline verification (before the live restart): the recipe parser reads
34 recipes from `facts/recipes.md`; the S1 bill-of-materials chain
(collect 3 logs, planks x3, stick batch, table, place table, pickaxe)
simulates to exactly the expected end state (3 planks, 2 sticks, 1
wooden pickaxe, table placed); a consistent live state passes the
invalidation check; a removed pickaxe fires it (naming the producing
step); a death fires it.

Running tally - FINAL for the pre-registered minimum (4 blocks complete
2026-11-07T10:34Z; ticks.jsonl md5 e53d6d542d6ca9bf663d4b10529072c9,
plan-state counters cross-checked against the tally: MATCH -
36 derivations, 13 continuations, 23 fulls, 0 invalidations):

- 12 ticks, 36 derivations, exactly 3 derivations per tick in both arms
  (replans per tick identical at the cap).
- Mind-seconds per derivation (governor ledger, agent geist-mind;
  closed windows only, 35 of 36 derivations - the last A4 window was
  still open at tally time): arm B 16.47 (continuations 16.36 across 13
  derivations; in-block fulls 16.75); arm A 18.96. Per block: B1 22.36,
  A2 22.86, B3 10.58, A4 14.56. Both arms got cheaper in the second
  block pair (a time confound - pair 1 is a dead heat, pair 2 favours
  B by about 27%), so the honest summary is: continuation is modestly
  cheaper per derivation in the later pair and never more expensive,
  on small noisy numbers.
- Prompt tokens per derivation: about 11.9k (B) vs 12.1k (A). The
  facts files and the calculator dominate every derivation in both
  modes; continuation's saving is confined to planner output, exactly
  as the design's own accounting predicted.
- Stage passes: none in either arm. Every tick in both arms still
  fails at the collect step (logs out of dig reach) - a
  world/substrate failure, not a planning failure - so
  mind-seconds per PASS is undefined. S1 remains pending.
- Budget exhaustion (429) events: 0 across the whole A/B.
- Lock-in: none. Guard strikes stayed 0; the prefix check refused to
  extend past the unverified collect step every time, and block B1
  twice escalated back to full derivations after a continuation
  committed a zero-length verified prefix.
- Surprise invalidation: never fired live. No deaths (31 throughout),
  no inventory, and no position drift occurred during the A/B, so
  the trigger set was never presented; that path stands on its
  offline verification only.
- Continuation depth never exceeded 1: step 1 (collect) never
  verified, so no plan grew a longer verified prefix, and the depth
  cap (3) was never approached. In block B3 most suffixes were
  calculator-bounced on stick-count arithmetic before execution
  (2-receipt derivations), reflections were correspondingly rare,
  and the continuation base stayed the 09:56:13Z commit - the chain
  held without deepening.
- Provenance in memory/plans.md at tally time (grep count): 14
  full-mode lines, 2 continuation-mode lines; the complete mode
  record is the 36 plan-mode lines in logs/ticks.jsonl.
- Geist was left running under the auto rotation, arm A block 4
  complete, rotation continuing into block B5 on the next tick.

## Addendum 2026-11-07 — Collect stand fix (protection guard + stand closure); lane PARKED

**PARKED 2026-11-07 by Casey's direction** (concentration on Lineage A):
Geist's resident was stopped after this addendum was written and is NOT
to be restarted by this lane. Parked state: position (38.7, 65, -94.7),
deaths 50, inventory empty, health/food 20. The diagnosis below stands
as the lane's handover record; the live collect verification was NOT
completed — the corrected build's first tick was still travelling when
the park order arrived.

Diagnosis (both causes measured, both real, and they stack):

- SPAWN PROTECTION (the deeper cause). World spawn read from the
  server's own level data (level.dat spawn pos, Orin, 2026-11-07):
  (32, 70, -96) — matching the spawn-position packet the bots receive;
  the (26.5, 77, -92.5) figure in facts/world.md's survey was a
  respawn-scatter landing. server.properties: spawn-protection=16, i.e.
  the square |dx| <= 16 AND |dz| <= 16 around (32, -96) — x in [16, 48],
  z in [-112, -80] — inside which the server silently cancels a
  non-opped citizen's block-breaks (the phantom-dig finding). Geist's
  collecting grounds of recent days ((25..38, -85..-93)) sit at
  Chebyshev 6..11 from spawn: INSIDE the square. Nothing dug there can
  ever take effect. The oak cluster east of HOME ((11,-85), (12,-82))
  is at Chebyshev 21/20: outside, diggable — consistent with the older
  record that digs near HOME took effect. facts/world.md carries an
  operator-seeded addendum with this geometry (2026-11-07).
- STAND GEOMETRY (the proximate cause in the logs). goto/collect
  pathfound to the column base POINT and accepted whatever stand the
  pathfinder gave up at; collect's own evidence shows "last distance
  6.5 blocks" on every failed collect for hours on 2026-11-07 (4.5 in
  an earlier plan-state) — past the 4.2 dig reach, so no dig was ever
  attempted from those stands.

Fixes landed in executors.js (backup executors.js.bak-standfix-20261107;
closed vocabulary unchanged — executor internals only):
1. Protection guard (shared by goto{block} and collect): a column is
   eligible only if its base cell AND the chosen stand cell are outside
   the protection square (+1 margin); refusals ride in the evidence
   with their Chebyshev distances.
2. Stand closure in collect: enumerate the 4 adjacent stand cells,
   pathfind to the best, and VERIFY the 3D distance to the lowest
   target block <= 4.2 from the body's actual stop before digging;
   unverifiable columns are refused within the action, not dug at.
3. Phantom-dig detection in collect (descend's pattern): a dig that
   resolves while the cell still holds the same block is recorded as
   cancelled (cancelledDigs in evidence), never as dug.
Offline verification: stub-bot smoke (/tmp/standfix-smoke.js on the
Thor) — collect gains 3 through a protected-forest refusal set with a
verified stand (2.6); a silently-cancelled dig at an unprotected column
is recorded, not counted; goto with only protected columns fails
naming the protection. node --check clean.

Live record on the new code (two restarts, both via start-geist.sh):
- Build 1 (block budget 24): tick 19:30:40Z collect FAILED in 16 s —
  "no diggable column within 48 blocks (5 refused by spawn
  protection)". The guard worked; the SEARCH starved it: findBlocks
  returns the nearest blocks first, and the nearest 24 logs are all
  inside the square, so no diggable column ever made the cut.
- Build 2 (budget raised to 256, regression-smoked against a dense
  protected forest): relaunched 19:31Z. Its first tick (19:32:54Z) was
  still in its first long travel action when the park order arrived —
  position drift over ~4 minutes was only ~1-2 blocks ((37.6,-94.5) ->
  (38.7,-94.7)), at litter travel speeds, with a further hazard live:
  oxygen read 3 in the final state feed (the dip he stands in).
  Whether travel closes on an eligible stand, and the digs land, is
  therefore UNVERIFIED live. If this lane is ever unparked, that tick
  is the first thing to watch: expect either a collect ok with
  lastStand.standDistance <= 4.2 and oak_log >= 3 gained, or a new
  measured wall stated in the error (stand distances / refusal counts
  are all in the evidence now — the failure can no longer be silent).

## Unpark addendum — 2026-11-08 (night of the first live verification)

**Pre-login .dat check PASSED.** Geist's UUID 00096e79-ab53-3cb8-a763-f07c1c6afa04; his file existed in world/players/data/ (1,377 B, his own Pos/Health/inventory) — no sample-clone risk on join. He joined as himself at his saved position, deaths verified 50 from the state feed.

**Standfix VERIFIED LIVE end-to-end** (ledger geist-collect-live-verified-20261107): the protection guard refused 34 in-square columns with correct Chebyshev distances and zero phantom digs; collect{oak_log,3} at 2026-11-08T08:08:44Z returned ok:true — wanted 3, gained 5 (oak_log 6 total), lastStand (51,68,-90) at standDistance 1.21 (<= 4.2), cancelledDigs []. Crafting table was crafted (08:36Z chain). The diagnosis in the section above is confirmed fixed at the collect layer.

**Open deficits found the same night:**
- *Travel closure is the residual failure layer.* gotoPos hop chains stall-break mid-journey at +1/+2 step faces (the face-clamp wedge class); goto{coords} can report ok:true while the body never moved (loose arrival tolerance, range+2.5); goto{block} failures return ok:false with NO error string ("FAIL: undefined" in logs).
- *Place needs an unprotected target.* place{crafting_table, near self} inside the protection square was silently refused by the server (block stayed air, executor reported the refusal correctly). Place sites must be chosen outside x[16,48] z[-112,-80].
- *Craft verification can misreport.* craft{oak_planks} once returned an updateSlot timeout error while the inventory delta showed the craft had landed (planks 1->4). Read command-result state blocks, not spot feeds.
- *eat executor FOODS list omits rotten_flesh and apple* (executors.js line 28) — he held rotten_flesh and eat answered "no food in inventory". Not yet fixed.
- *Tick/operator contention + respawn instability cost 6 deaths (50 -> 56).* Three (51-53) were executed by his own 08:40Z pulse tick: its revised plan marched him into lethal terrain and re-ran after each respawn (a grind; the resident was killed to stop it). Three more (54-56) were OPERATOR-caused during the pulse-hold relaunch sequence: canopy-descent fall from a tree spawn, then two drownings — his respawn cell had drifted into the pond west of spawn (22.5,70,-100.5) and the substrate swim-up could not save him. Geist is PARKED (process stopped) at deaths 56.
- *Operator hold now exists.* geist.js skips first/pulse/retry ticks when PULSE_MS > 3600000 (backup geist.js.bak-pulsehold-20261108; start-geist.sh currently pins PULSE_MS=7200000 — restore 600000 for normal unattended running). Command channel and substrate stay live under hold.

**Resume protocol (do not skip steps):** (1) verify his exact saved Pos in the .dat / state feed and survey that cell — if it is water or canopy, do NOT relaunch until the spawn cell is made safe; (2) launch under operator hold (PULSE_MS=7200000); (3) work only via the command channel in dense <=2-block hops along surveyed standable rows; (4) S1 finish = exit protection east, collect (verified), planks -> sticks -> table -> place OUTSIDE the square -> pickaxe -> verify.js -> SCOREBOARD.

**Casting:** Geist registered as a GLM book client in commons/consults/glm.jsonl; test consult geist-1a1ba5c7e6e-gs (test:true) answered by the live driver (GLM-5.3 via thor-zcode, latencyMs 35302). His framework exposes NO in-loop consult hook — answers are not consumed by geist.js; the hook gap is open (book-client registration only, as briefed). System-2 actor voice (:8311) NOT wired: his loop has no actor surface either; deferred per brief (surgery).

## Resume addendum — 2026-11-08 (geist-resume lane: stopped at spawn)

**One death (56 -> 57), circuit breaker fired, lane closed before the chain started.** Launched under operator hold 08:59:44Z; Geist joined at **(22.5, 70, -100.5) — the pond cell** — and was slain by a Zombie at 08:59:57Z (server log; first feed already read hp 8). Root cause is cross-lane state, not his body: the stance-probe lane had moved his .dat aside (`world/players/data.probe4-aside-20261108/`); the live `players/data/` was EMPTY and the sample pool aside, so the join was a genuine fresh spawn on the drifted respawn scatter. The saved cell itself was surveyed safe beforehand (.dat parse: (23.5, 68, -104.5), 20/20, empty; region column (23,-105) dry grass, top 67) — and never used. No command was ever issued. The substrate auto-respawn walked him to (34.5, 67, -98.5) at hp 20 before the resident was killed (09:00:18Z, clean save, no warning).

**Handback state (server-side NBT, live players/data/00096e79-*.dat):** Pos (34.5, 67, -98.5), Health 13.83, foodLevel 20, OnGround 1, inventory empty, deaths 57. His .dat is back in the LIVE directory under his own name — the next launch respawns at this verified dry cell (inside the square, z=-98.5 east row) **provided no lane moves a citizen .dat aside again**. PULSE_MS restored to 600000 in start-geist.sh (backup .bak-pulsepin-20261108).

**New resume preconditions (hard):** (1) verify the citizen's .dat is present in the LIVE players/data/ immediately before launch — "a citizen's .dat must never be absent at join" is a three-lineage rule, and another lane's asides change spawn semantics silently; (2) sweep spawn country for remnant hostiles first — bodies were still dying at spawn this hour (ChestScan, StanceProbe4 x3, CommonsSmith x4) from the hold-loss window's leftovers; (3) the commons chest at (63,68,-82) is NOT placed (prep verdict 08:57Z; region read still shows grass/air) — do not plan around it.

**Records:** pulse/ledger.jsonl geist-resume-takeover-20261108, geist-resume-incident-20261108, geist-resume-verdict-20261108. Triple-004 updated by appended superseding entry **triple-008** (append-only): collect arm PASS (08:08:44Z), chain outcome appended. S1 remains unpassed; no SCOREBOARD entry. GLM consult not filed — no genuine decision point arose.
