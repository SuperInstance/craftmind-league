'use strict';
/**
 * direct-drive.js — DIRECT-DRIVE CODY (Casey direction 2026-11-08
 * 21:20-21:23 AKST: the Steve-program shape — a capable LLM issuing
 * commands in a tight loop; puppeteering/sitcom setup; YES-AND).
 *
 * A frontier-class LLM (DeepSeek V4.1 Flash via DeepInfra, reached
 * through the ddbridge surrogate relay on the Muse VM — the
 * credential never leaves that VM; fallback: governor identity
 * league-cody-driver -> :8310 Qwen3-Coder-30B presence brain) plays
 * Cody directly: perceive compact state -> decide ONE command -> act
 * through pulse/lib/prims.js. The scenario is set up in the prompt
 * (who he is, where he is, what kind of day this is, what would make
 * a good scene) and the loop improvises inside it.
 *
 * UNDER the driver, as code (invisible, not promptable):
 *   - a 700 ms hostile monitor (character-plugin.js pattern): a
 *     hostile <= 8.5 blocks (or damage with a hostile <= 14) CANCELS
 *     the current action; the floor then flees toward home, and if
 *     fleeing does not clear danger, burrows (dig in + seal + hold).
 *   - an eat reflex: food <= 6 with food in inventory -> eat, no
 *     permission asked; food <= 6 and nothing edible -> the loop is
 *     told, urgently, by the state line itself.
 *   - starvation guard: hp <= 4 -> emergency forage/hunt by code.
 *   - 3-death abort from baseline deaths 116 (pulse/deaths.jsonl).
 * The LLM never controls these. No /give, no teleports, dig-step
 * allowance OFF (prims.setDigStep never called), Cody's own feet
 * only. Vega/Geist untouched.
 *
 * DAY-2 VARIANT (2026-11-09, day2 lane; backup day2-backups/):
 * the home district now carries an operator-staged food ecology
 * (penned pigs/cows/chickens + a wheat patch by a water trench,
 * ledger direct-drive-day2-stage-set-20261109); the SYSTEM scene
 * and standing goals below are re-framed for the eat-first day.
 * Everything else — floor, prims, routes — is the proven day-1 code.
 *
 * DAY-3 VARIANT (2026-11-09, day3 lane; day-2 worklist items (a)+(b)):
 *  (a) PERCEPTION: stateText now carries a STRUCTURES line — fences,
 *      gate, crafting table, farmland/crops with ripeness, furnace,
 *      chest — read from the body's real block perception within
 *      16 blocks, each with compass direction + distance. Day 2's
 *      state line showed creatures and ground but never structures;
 *      he stood 3-6 blocks from the pen five times and could not see
 *      it. What a person standing there could see — no more.
 *  (b) PLACES-MEMORY: pulse/direct-drive-places.json — a persistent
 *      store of places HE encountered, re-presented every cycle as
 *      "Places you know". Seeded from day-2 trace evidence ONLY
 *      (pen: killed at its fence line c41, dug its gate (64,67,-101)
 *      c49-50, stood in it c64; table at the anchor: c107-108; the
 *      dip: lived there all day; wheat patch: perceived the FARMLAND
 *      at c96 standing (67.4,67,-91.5) — a place he found, never a
 *      crop; pit mouth at (65,-93): named it c95/c145). New places
 *      are recorded when perception shows him AT a named-worthy
 *      structure (>2 visits or a first arrival within 3 blocks).
 *  (c) BRAIN ROUTE: the ddbridge relay chain (Thor->Oracle->VM) was
 *      found dead and is NOT rebuildable from surviving parts (the
 *      Oracle :2223 hop's forward key lived only in a day-1 lane's
 *      session; Tailscale unjoined). The VM-side relay IS now
 *      session-proof (setsid supervisor, ~/workspace/ddbridge-
 *      supervise.sh) for when a path returns. Day 3 therefore runs
 *      PRIMARY = governor fallback (league-cody-driver, verified
 *      live pre-launch) — the chartered fallback, promoted. Filed
 *      as an incident in the lane record.
 *
 * DAY-4 VARIANT (2026-11-09, day4 lane; day-3 worklist, ledger
 * direct-drive-day3-verdict-20261109 + the day-4 brief):
 *  (1) DEATHS counted from the run's own trace via pulse/lib/deaths.js
 *      (the bot's server-driven 'death' event feeds the counter; the
 *      3-death abort uses shouldAbort). Day 3's abort read
 *      pulse/deaths.jsonl, which no component appends — it never
 *      fired while he died four times. Dry-proof:
 *      pulse/test-deaths-day4.js.
 *  (2) FLEE hops: floorEscape rides pulse/lib/hopflee.js — chained
 *      2-block hops toward home scored for rising ground — instead of
 *      the long-leg walker the dip pocket wedges. Proven from inside
 *      the pocket by pulse/test-flee-day4.js before this build flew.
 *  (3) PLANT CELLS: the structures line names each wheat plant's cell
 *      and age; places seed/refresh at encountered EDGES (the nearest
 *      perceived plant cell), never a patch centre (day 3 he dug the
 *      water trench ~20 times — his senses never named a plant).
 *  (4) CRAFT ERRORS name missing ingredients and counts
 *      (missingIngredients, from minecraft-data vs live inventory).
 *  (5) BRAIN: the ddbridge path is rebuilt (ledger
 *      direct-drive-day4-relay-restored-20261109) — PRIMARY is
 *      DeepInfra DeepSeek again; the governor 30B is the fallback.
 *  (6) The state line's home direction is computed, not hardcoded
 *      (day 3 he woke AT home so 'west' was harmless; day 4 he wakes
 *      west of home and home is EAST).
 *
 * DAY-5 VARIANT (2026-11-09, day5 lane; day-4 close worklist):
 *  (1) TRUNK AT FOOT LEVEL: perception now reports nearby TREES by
 *      their foot-level trunk cell (perceiveTrees — the lowest log
 *      of each trunk column within 16, ranked by distance, with a
 *      dig/felltree aim line at dig height). Day 4 he aimed at
 *      crowns (dig 51 71 -96) because his senses named canopy
 *      only; he held ZERO logs all day. The trace-level proof is
 *      pulse/test-trunk-day5.js (honest limit: the day-4 trace
 *      holds no block-level world, so crowns are re-derived from
 *      ground truth in the live world; the felling PASS is a live
 *      throwaway-body dig at the reported cell).
 *  (2) THE PIT AS A KNOWN PLACE: places carry his stone pit as a
 *      worked place — bounds, purpose (furnace stone), and HIS
 *      STAIR (dirt to (64,66,-92)) named as the way out. Day 5
 *      opens with him IN the pit; his memory greets him with the
 *      stair. The +2-wall specimen (66.3,63,-92.6) is filed to
 *      Thor ~/pin-scratch/ as evidence only.
 *  (3) ARRIVAL HONESTY: the goto result is computed from his
 *      MEASURED position at command end (arrivalCheck in the
 *      driver): "arrived" only within radius at plausible feet-y;
 *      otherwise "NOT arrived" with his actual position and the
 *      remaining distance — the walker's own ok can no longer
 *      talk the state line into a false arrival (day 4: 188 gotos,
 *      69 failed, and the pit chapters were built on misreports).
 *  Everything else — floor, hop-flee v2, trace death counting,
 *  state mirror, craft diagnostics — is the proven day-4 stack.
 *
 * DAY-6 VARIANT (2026-11-09, day6 lane; day-5 close worklist +
 * spike LOCOMOTION-SPIKE-20261109):
 *  (0) WAKE SEQUENCE (driver code, before the model's first cycle):
 *      Cody wakes IN the pit at food 0 / hp 0.33 (day-5 close save).
 *      The day opens with operator provisioning + the spike-proven
 *      exit as DRIVER acts, logged and trace-rowed as such; his
 *      agency (and the model's first cycle) begins only once he is
 *      OUT and FED. See wakeSequence() below.
 *  (a) FAILOVER TRACE RULE (day-5 incident 8's debt): any brain-route
 *      switch writes a FULL trace row at the moment it happens
 *      (kind 'failover', from/to/why/cycle + distinct
 *      'failover-back' on primary recovery), and the driver fails
 *      BACK to the primary the first time the primary answers again
 *      (checked on a 60 s probe while on fallback). Day 5 switched
 *      silently at cycle 387; day 6 cannot.
 *  (b) THE PIT ENTRY in places-memory names the pit a VOLUNTARY
 *      WORKPLACE WITH A KNOWN DOOR (long legs past the west wall to
 *      the bench point; short-range verbs inside below-grade cells
 *      presumed zero; never aim a flee/exit at the rim or the pit
 *      mouth). The seeded text lives in dd-opening-day6.txt's world
 *      and the places file is updated by the lane pre-launch.
 *  Exit/entry discipline from the spike (binding): targets at/below
 *  bench level >= 4-5 blocks past the west wall; NOTHING aimed
 *  within ~3.5 blocks of the body from inside a below-grade cell.
 *
 * DAY-7 VARIANT (2026-11-09, day7 lane; day-6 record + the day-7
 * brief govern): the wake sequence's FEED mechanism is replaced.
 * Day 6's in-process Gallery bot crashed the driver (bossBars
 * plugin-injection collision — a second createBot in one process)
 * and its teleport summon is superseded: day 7 provisions through
 * the SEPARATE-PROCESS op channel PROVEN in phase 1 (standalone
 * Gallery process, 3/3 give->inventory->eat trials with readbacks
 * from stores the op cannot write; filing DIRECT-DRIVE-DAY7).
 * wakeSequence() therefore WAITS for the external feed: it polls
 * Cody's own food (his client state — the readback) while the
 * operator's op process gives cooked_porkchop; his floorEat tops
 * up from what lands. NO teleport: the exit below is the spike's
 * hopFlee/gotoNear to the bench, first live trial, unchanged.
 * Everything else — exit block, floor, failover trace rule,
 * places, craft diagnostics — is the shipped day-6 build.
 *
 * DAY-9 VARIANT (2026-11-09, day9 lane; the day-8 record + the
 * wall spike govern): NO scripted exit exists on this stack (wall
 * spike: pillar absent, stairs climb exactly one rung, dug treads
 * never entered, operator ramps never climbed). The wake sequence
 * therefore replaces the exit attempts with THE OPERATOR
 * RELOCATION — the chartered cure, declared in
 * pulse/DIRECT-DRIVE-DAY9-20261108.md §0 and ledger claim
 * direct-drive-day9-claim-20261109: the external op process issues
 * the server command moving Cody to the surveyed pad column
 * (60.5, 67, -92.5); this driver requests it via a marker file and
 * verifies the landing from Cody's own client. Executed ONCE.
 * Also: (i) the day-8 caller fix — isClear: () => false at the
 * wake/close hopFlee sites (the floor's live flee site keeps its
 * early-clear form); (ii) ACTION DENSITY instrumentation — every
 * model command and floor act counted per 10-minute block (trace
 * kinds 'density'/'density-block'); a zero-act block is a STALL,
 * named at block close; (iii) the scene text (scene-so-far, pit
 * knowledge, furnace thread) rewritten TRUE: the long leg did not
 * cross on live geometry, the pit is closed to him, furnace stone
 * is surface stone. Deaths still derive via lib/deaths.js.
 *
 * DAY-10 VARIANT (2026-11-09, day10 lane; the day-9 verdict +
 * ledger claim direct-drive-day10-claim-20261109 govern):
 *  (1) THE RELOCATION IS REMOVED - day 9's operator move was a
 *      one-day declared exception; today he wakes where his save
 *      puts him (near world spawn, post-respawn, crew-fed 32 chops
 *      after day 9's abort) and the walk home is HIS. Wake =
 *      feed-verify from his own inventory/food read; the op top-up
 *      fires only if his read is short.
 *  (2) THE PIT IS A ROUTED HAZARD: goto targets inside the pit
 *      columns (65..66, z -93..-91) are refused and re-aimed at the
 *      pad's west edge (driver code, traced kind 'pit-guard'); the
 *      floor's flee-home stages at (62,67,-89), south of the pit,
 *      when he is east/north of home; the scene text and places
 *      file name the south route (z -89..-88). The pit is NOT
 *      filled or fenced today - that is a separate crew act.
 *  (3) SCENE TEXT REWRITTEN TRUE for day 10: day 9 told whole
 *      (first tree, the interference and its harness ownership,
 *      the drowning, the unheld night, the rule changes); the
 *      Scenario #1 precondition was NOT met (no remediation was
 *      ever filed) so NO Director narration line is used - the
 *      barn is scenery, unnamed in his scene.
 *  (4) Deaths baseline 123 (lib/deaths.js derivation over the
 *      rebuilt record + all day traces, verified at pre-checks).
 *      Places: direct-drive-places-day10.json.
 *
 * DAY-14 VARIANT (2026-11-09, safety-repair lane; the day-13
 * record's incident H1 + pulse/SAFETY-READING-PATH-REPAIR-20261109.md
 * govern): THE SAFETY READING PATH. Day 13's floor parked 1.3 s
 * after the third death and the driver never heard it: the gate
 * check and the 3-death abort lived only at the model-cycle head,
 * while the body sat inside the reflex layer's flee/burrow
 * sequence, which read neither. This copy routes EVERY safety
 * check — driver start, cycle head, pre-exec, and the reflex
 * layer at every hop boundary (pulse/day14/hopflee.js safetyCheck
 * hook) and every burrow stage — through ONE shared read,
 * pulse/day15/safety-check.js snapshot(): park/lease from the
 * floor's state files via floor/gate.js, deaths from the run's own
 * trace via lib/deaths.js, the verdict using the greater of the
 * trace count and the in-memory count. A stop inside the reflex
 * layer aborts the sequence mid-flight (trace kind 'reflex-abort',
 * trigger + hop/stage named) and the main loop breaks the day
 * within the same cycle. The dig-guard, the floor's constitution,
 * the gate's semantics and the reflexes' shapes are UNCHANGED.
 * Fixture-proven offline before any wake: pulse/day14/
 * test-safety-reflex.js (the day-14 charter's Gate B carries the
 * battery as a line). NOT DAY-14 SCENE TEXT: this copy inherits
 * day 13's wake line, spawn chat and scene text VERBATIM — the
 * day-14 charter lane replaces them from the verified wake facts
 * (empty hands at the hilltop respawn (36.5,73,-86.5); deaths
 * baseline 132) before any launch. WORLD_DEATHS_AT_START below is
 * already 132 per the day-13 close.
 *
 * DAY-14 CHARTER REPLACEMENT (2026-11-09, day-14 lane; charter
 * pulse/DAY14-CHARTER-20261109.md): the scene text HAS been
 * replaced from the verified wake facts — spawn chat and the
 * post-wake scene text are day-14 text (empty hands at the hilltop
 * respawn (36.5,73,-86.5), hunger 20, held food 0; the count and
 * the pork lost on day 13; thirty-two porkchops provisioned into
 * his pack under the charter's Gate B provisioning window before
 * the wake). The DIG-GUARD is revised under the same charter, per
 * the extraction amendment's day-13 disposition: R1 (disarm ONLY
 * at home ground — count-closed away from home defers, trace-
 * rowed, and the guard stays armed through the carry) and R2 (the
 * guard arms on a downward position discontinuity > 2 blocks
 * sampled at dig considerations — a fall IS a descent — via
 * digGuardFallCheck inside the guard span). R3 (the placed-rung
 * as a first-class exit) is plan text in the scene, not code.
 * The safety reading path above is untouched by these edits.
 * Fixtures: pulse/day14/test-dig-guard-day14.js (guard),
 * pulse/day14/test-safety-reflex.js re-run (safety path).
 *
 * DAY-15 CHARTER BUILD (2026-11-09, day-15 lane; charter
 * pulse/DAY15-CHARTER-20261109.md): this copy descends from the
 * shipped day-14 driver. Its edits are exactly: (1) THE WALKER
 * FENCE (charter sec.2, incident day-14 I4 - the fix branch): a
 * named span WALKER-FENCE-BEGIN..END plus the execCmd wrapper;
 * at the head of every command that is not itself a walk
 * (goto/gotoentity are the only walks) the walker is stopped
 * dead first - pathfinder goal cleared with setGoal(null)
 * (pathfinder.stop() is NEVER used; it poisons the next goto,
 * Lineage B) plus clearControlStates - and the command's result
 * line names the stop when the walker was live. Displacement
 * during a craft was day 14's silent 26-block carry; the fence
 * makes stationary verbs stationary. Fixture: pulse/day15/
 * test-walker-fence-day15.js. (2) SCENE TEXT REPLACED from the
 * verified wake facts (empty hands in the tree country at the
 * day-14 close point; food 20; hp 16.67 at close; deaths
 * baseline 135) + day-13/14 as he lived them + the transit
 * route (charter sec.3) + the operating note (fence, guard,
 * placed-rung, banking, weather). (3) The dig-guard span is
 * byte-identical to day 14's (R1/R2); its fixture re-runs
 * against this copy. (4) WORLD_DEATHS_AT_START 135. The safety
 * modules are the repair lane's semantics: gate-client/safety-
 * check/hopflee copied with day-path relabelling only.
 *
 *
 * DAY-17 CHARTER BUILD (2026-11-10, day-17 lane; charter
 * pulse/DAY17-CHARTER-20261109.md): this copy descends from the
 * shipped day-16 driver (md5 9f87c876...) by copy + exactly these
 * edits: (1) THE RELATIVE BELOW-GRADE GUARD (day-16 record sec.7.1;
 * charter sec.2): the guard span's bound is re-based from the pad
 * constant to the citizen's VERIFIED WAKE STATE (BGG_WAKE_FEET 62,
 * read at Gate B from the live .dat). Tool-less AND below pad: the
 * goto arm refuses only targets BELOW his current feet (descent,
 * day 15's disease, stays forbidden) and PERMITS every ascent
 * target (the stairs day 16's absolute bound refused); the dig arm
 * refuses only digs at/below the floor he stands on. At/above pad
 * the day-16 absolute form applies unchanged. Fixture:
 * pulse/day17/test-below-grade-day17.js (day-16 groups A-E carried
 * + group F resident-at-62 + group G pad-resident regression).
 * Refusal result-lines are mode-aware (relative vs absolute).
 * (2) SCENE TEXT: the day-16 paragraph appended to the recap from
 * the verified record; the hand-over line replaced from the
 * verified wake facts (third morning in the bowl, fed, tool-less;
 * home named). (3) Module/trace/places paths relabelled day17.
 * The DIG-GUARD span is byte-identical to day 16's; safety-check.js
 * byte-identical to the repair lane's (d60f062b...); gate-client.js
 * byte-identical to days 11-16 (6b891704...); hopflee.js = day 16's
 * bytes. WORLD_DEATHS_AT_START 136 (unchanged: day 16 closed at
 * 136, zero run deaths). The day-16 driver is untouched.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

process.chdir('/home/caseydigennaro/craftmind-league/bots/runs/cody');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const prims = require(path.join(PULSE, 'lib', 'prims.js'));
const { Vec3 } = prims;
const { hopFlee } = require(path.join(PULSE, 'day17', 'hopflee.js')); // DAY 14: this copy's hopflee — the lib module + the hop-boundary safety hook (header, day14/hopflee.js)
const { countTraceDeaths, shouldAbort } = require(path.join(PULSE, 'lib', 'deaths.js'));
// DAY 11 (this copy only; the day-10 original above is untouched):
// the floor's command gate is wired in — floor gap #1, closed offline
// per pulse/DAY11-CHARTER-DRAFT-20261109.md. gate-client consults
// floor/gate.js before the day starts, at every cycle head, and
// immediately before every model command executes; a parked, revoked
// or expired lease stops the driver within the cycle, and the
// close-exit movement is skipped under a dead lease (it is itself a
// command). NAME COLLISION, named once: this driver's internal
// `floor` object (startFloor/floorEscape/floorEat) is the reflex
// layer R; the supervisor F ("the floor" in the charter) is the
// separate floor/ process — gate-client is the only tie to it.
const gate = require('/home/caseydigennaro/craftmind-league/pulse/day17/gate-client.js');
// DAY 14 (this copy only): the ONE SAFETY READ — safety-check.js
// snapshot() is the single function the start check, the cycle
// head, the pre-exec check and the reflex layer (hop boundaries +
// burrow stages, via reflexSafety below) all read through, so the
// layers cannot disagree silently (day-13 incident H1;
// pulse/SAFETY-READING-PATH-REPAIR-20261109.md). It reads the
// lease/park through THIS copy's gate-client (floor state files
// via floor/gate.js) and the death count from this run's trace
// via lib/deaths.js.
const safety = require('/home/caseydigennaro/craftmind-league/pulse/day17/safety-check.js');

const HOME = { x: 64, y: 67, z: -93 };
const TABLE_POS = new Vec3(63, 67, -94);
const RUN_MS = parseInt(process.env.DD_RUN_MS || String(85 * 60000), 10);
const WORLD_DEATHS_AT_START = 136; // day-15 close (record DIRECT-DRIVE-DAY15-20261109: 135 + day-15 provisioning-window death #136 at 07:38:27Z, Zombie, store pulse/day15/provisioning-evidence.jsonl); re-derived at Gate B via lib/deaths.js over the deaths record + 14 traces, +1 for the provisioning-evidence row // day-13 close (record DIRECT-DRIVE-DAY13-20261109: 123 + 9); the day-14 charter re-derives the baseline at its pre-checks
const TRACE_PATH = path.join(PULSE, 'direct-drive-trace-day17-20261110.jsonl'); // day 16: own trace — the floor contract's sensor reads this path; safety-check.js counts its death rows // day 15: own trace — the floor contract's sensor reads this path; safety-check.js counts its death rows
const STATE_PATH = path.join(PULSE, 'direct-drive-state.json'); // shared: cameraman v3 reads this path

// Day 4: the ddbridge relay path is RESTORED (ledger
// direct-drive-day4-relay-restored-20261109) — PRIMARY is DeepInfra
// (the day-1/2 arrangement); the governor route is the fallback.
const PRIMARY = { url: 'http://127.0.0.1:8912/chat/completions', model: 'deepseek-ai/DeepSeek-V4.1-Flash-1017', key: null, name: 'deepinfra:deepseek-v4.1-flash' };
const FALLBACK = { url: 'http://127.0.0.1:8642/v1/chat/completions', model: 'confluence-presence-brain', key: 'league-cody-driver', name: 'governor:qwen3-coder-30b' };
const PLACES_PATH = '/home/caseydigennaro/craftmind-league/pulse/day17/direct-drive-places-day17.json'; // day 16: own places file (the day-15 store carried forward at copy time) // day 14: own places file (the day-13 store carried forward at copy time)
// Day 6 wake-sequence constants (spike LOCOMOTION-SPIKE-20261109):
// the bench point is the surveyed home bench west of the pit wall.
// LIVE-WORLD CORRECTION (day-6 pre-launch survey, map-survey6.js):
// the spike replica's y63 bench does NOT exist on the live world —
// the live bench west of the wall IS the pad: grass top y66
// (feet-y 67) at (62..63,-92) and (60..63,-93); (60,-92) itself is
// under oak leaves. The bench point is therefore ON THE PAD at
// (62,66,-93): top y66, ~4.1 blocks past the wall column from the
// wake (64.3,63,-91.7), clear of the canopy column. (The brief's
// 'at/below bench level' assumed the replica's bench; on the live
// world the bench is the pad — the target sits at the pad's own
// level, which is what 'home bench' means here. Deviation filed
// in the day-6 record.)
const BENCH_POINT = { x: 62, y: 66, z: -93 };
// DAY-9: the surveyed relocation target (day-8 §1): column (60,-93),
// grass top y66, NO canopy in its column, 4.55 blocks horizontal from
// the wake point. The operator relocation lands him standing ON the
// pad at this column (feet y67) — see wakeSequence step (2).
const RELOC_POINT = { x: 60.5, y: 67, z: -92.5 };
const RELOC_CMD = '/tp Cody 60.5 67 -92.5'; // server command string, issued by the external op process
const WAKE_FOOD_TARGET = 18; // provisioning top-up threshold (operator act)

const HOSTILES = new Set(['zombie', 'skeleton', 'creeper', 'spider', 'cave_spider', 'enderman', 'witch', 'drowned', 'husk', 'stray', 'zombie_villager', 'pillager', 'vindicator', 'phantom', 'slime', 'magma_cube']);
const PASSIVES = new Set(['pig', 'cow', 'sheep', 'chicken', 'rabbit', 'mooshroom']);
const EDIBLES = ['cooked_porkchop', 'cooked_beef', 'cooked_mutton', 'cooked_chicken', 'cooked_cod', 'cooked_salmon', 'bread', 'apple', 'baked_potato', 'carrot', 'porkchop', 'beef', 'mutton', 'chicken', 'melon_slice', 'potato', 'rotten_flesh'];

const t0 = Date.now();
function nowIso() { return new Date().toISOString(); }
function log(...a) { console.log('[DD]', ...a); }
function trace(rec) {
  try { fs.appendFileSync(TRACE_PATH, JSON.stringify({ ts: nowIso(), ...rec }) + '\n'); } catch {}
}
// Deaths this run (repair (1)): the counter is fed by the bot's
// 'death' event — the server's respawn signal, which the model cannot
// mint — and is resumed from the run's trace at startup via
// lib/deaths.js, so a mid-day restart inherits the true count.
let deathsThisRun = 0;

// ── model client ─────────────────────────────────────────────────────
let route = PRIMARY;
let primaryFails = 0;
let cycleNo = 0;              // mirrored from the main loop for trace rows
let lastPrimaryProbeAt = 0;   // day-6 (a): fail-back probe clock
function httpCall(urlStr, key, payloadObj, timeoutMs) {
  return new Promise((resolve) => {
    const body = JSON.stringify(payloadObj);
    const u = new URL(urlStr);
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...(key ? { Authorization: 'Bearer ' + key } : {}) }, timeout: timeoutMs }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try { resolve({ ok: true, j: JSON.parse(data) }); }
        catch (e) { resolve({ ok: false, error: 'parse: ' + e.message, raw: data.slice(0, 200) }); }
      });
    });
    req.on('timeout', () => { req.destroy(new Error('model call timeout')); });
    req.on('error', (e) => resolve({ ok: false, error: e.message }));
    req.write(body); req.end();
  });
}
async function callModel(messages, maxTokens) {
  // One retry on an empty/failed attempt before it counts toward
  // failover: the relay chain (driver -> tunnel -> VM bridge ->
  // provider) can drop a single early call while the provider route
  // is healthy (observed at first launch 2026-11-09T06:26Z: 3 instant
  // empties, then the identical payload answered cleanly direct).
  for (let attempt = 1; attempt <= 2; attempt++) {
    const r = await httpCall(route.url, route.key,
      { model: route.model, messages, max_tokens: maxTokens, temperature: 0.7 }, 45000);
    if (r.ok) {
      const j = r.j;
      const content = j.choices && j.choices[0] && j.choices[0].message ? (j.choices[0].message.content || '') : '';
      if (content) return { ok: true, content, usage: j.usage || null, route: route.name };
      log('model attempt', attempt, 'returned empty content on', route.name);
    } else {
      log('model attempt', attempt, 'failed on', route.name, ':', r.error, r.raw || '');
    }
    if (attempt < 2) await prims.sleep(1500);
  }
  return { ok: false, content: '', error: 'empty/failed after retry' };
}
function callModelUnused(messages, maxTokens) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ model: route.model, messages, max_tokens: maxTokens, temperature: 0.7, chat_template_kwargs: { enable_thinking: false } });
    const u = new URL(route.url);
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(route.key ? { Authorization: 'Bearer ' + route.key } : {}) }, timeout: 45000 }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          const content = j.choices && j.choices[0] && j.choices[0].message ? (j.choices[0].message.content || '') : '';
          resolve({ ok: !!content, content, usage: j.usage || null, route: route.name });
        } catch (e) { resolve({ ok: false, content: '', error: 'parse: ' + e.message }); }
      });
    });
    req.on('timeout', () => { req.destroy(new Error('model call timeout')); });
    req.on('error', (e) => resolve({ ok: false, content: '', error: e.message }));
    req.write(body); req.end();
  });
}
async function askModel(messages, maxTokens) {
  // Day-6 (a) FAIL-BACK: while riding the fallback, probe the
  // primary at most once a minute with a minimal call; the first
  // time the primary answers again, switch back — and BOTH switches
  // write their trace row at the moment they happen (day-5
  // incident 8: a silent switch at cycle 387 ran 59 cycles
  // unfiled; the rule now: a route switch files itself).
  if (route.name === FALLBACK.name && Date.now() - lastPrimaryProbeAt > 60000) {
    lastPrimaryProbeAt = Date.now();
    const probe = await httpCall(PRIMARY.url, PRIMARY.key,
      { model: PRIMARY.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 8, temperature: 0 }, 20000);
    const pok = probe.ok && probe.j && probe.j.choices && probe.j.choices[0] && probe.j.choices[0].message && (probe.j.choices[0].message.content || '').length >= 0;
    if (pok) {
      const from = route.name;
      route = PRIMARY; primaryFails = 0;
      log('FAILBACK: primary answering again — switching back to', PRIMARY.name);
      trace({ kind: 'failover-back', from, to: PRIMARY.name, why: 'primary probe answered (fail-back check)', cycle: cycleNo });
    }
  }
  const r = await callModel(messages, maxTokens);
  if (r.ok) { if (route.name === PRIMARY.name) primaryFails = 0; return r; }
  log('model call failed on', route.name, ':', r.error || 'empty content');
  if (route.name === PRIMARY.name) {
    primaryFails++;
    if (primaryFails >= 3) {
      const from = route.name;
      route = FALLBACK;
      log('FAILOVER: primary failed 3x consecutively — switching to', FALLBACK.name);
      trace({ kind: 'failover', from, to: FALLBACK.name, why: `primary failed ${primaryFails}x consecutively (last error: ${r.error || 'empty content'})`, cycle: cycleNo });
      return askModel(messages, maxTokens);
    }
  }
  return r;
}

// ── perception ───────────────────────────────────────────────────────
function columnTopAt(bot, x, z) {
  const py = Math.floor(bot.entity.position.y);
  for (let y = py + 6; y >= py - 14; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (b && b.boundingBox === 'block') return { y, name: b.name };
  }
  return null;
}
function nearestHostile(bot, maxDist) {
  if (!bot.entity) return null;
  let best = null;
  for (const e of Object.values(bot.entities || {})) {
    if (!e || !e.position || !HOSTILES.has(e.name)) continue;
    const d = e.position.distanceTo(bot.entity.position);
    if (d <= maxDist && (!best || d < best.dist)) best = { name: e.name, dist: d, pos: e.position };
  }
  return best;
}
function perceive(bot) {
  const p = bot.entity.position;
  const fx = Math.floor(p.x), fy = Math.floor(p.y), fz = Math.floor(p.z);
  const inv = prims.inv(bot);
  const dirs = { W: [-1, 0], E: [1, 0], N: [0, -1], S: [0, 1] };
  const ground = {};
  for (const [k, [dx, dz]] of Object.entries(dirs)) {
    const t = columnTopAt(bot, fx + dx * 3, fz + dz * 3);
    ground[k] = t ? `${t.name}@y${t.y}` : '?';
  }
  const facingB = bot.blockAt(bot.entity.position.offset(0, 0, 0)); // placeholder, replaced below
  const entities = [];
  for (const e of Object.values(bot.entities || {})) {
    if (!e || !e.position || e === bot.entity) continue;
    const d = e.position.distanceTo(p);
    if (d <= 24 && e.name && e.name !== 'item') entities.push(`${e.name}@${d.toFixed(0)}`);
  }
  entities.sort();
  let frontSteps = '';
  {
    // Cheap local relief read: column tops on the 8 neighbouring columns.
    const ring = [];
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      if (!dx && !dz) continue;
      const t = columnTopAt(bot, fx + dx, fz + dz);
      ring.push(t ? t.y - fy : '?');
    }
    frontSteps = ring.join(',');
  }
  const tod = bot.time ? bot.time.timeOfDay : null;
  return {
    pos: { x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) },
    hp: bot.health, food: bot.food, inv,
    distHome: +Math.hypot(p.x - HOME.x, p.z - HOME.z).toFixed(1),
    ground, ring: frontSteps, entities: entities.slice(0, 8),
    timeOfDay: tod,
    held: bot.heldItem ? bot.heldItem.name : null,
  };
}
// ── structures perception (day-3 (a)): what a person standing here
// could actually see — notable blocks within 16 blocks, with compass
// direction + distance, from the body's own block perception.
const STRUCT_KINDS = [
  { match: (n) => /_fence_gate$/.test(n), label: 'fence gate' },
  { match: (n) => /_fence$/.test(n), label: 'fence' },
  { match: (n) => n === 'crafting_table', label: 'crafting table' },
  { match: (n) => n === 'farmland', label: 'farmland' },
  { match: (n) => n === 'wheat', label: 'wheat' },
  { match: (n) => n === 'furnace' || n === 'blast_furnace' || n === 'smoker', label: 'furnace' },
  { match: (n) => n === 'chest' || n === 'trapped_chest' || n === 'barrel', label: 'chest' },
  { match: (n) => n === 'water', label: 'water' },
];
function compass(dx, dz) {
  if (Math.abs(dx) < 0.5 && Math.abs(dz) < 0.5) return 'right here';
  const a = Math.atan2(dx, -dz) * 180 / Math.PI; // 0=N, 90=E
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(((a + 360) % 360) / 45) % 8];
}
function perceiveStructures(bot) {
  const p = bot.entity.position;
  const found = new Map(); // label -> {label, dist, dir, pos, extra}
  const crops = { total: 0, ripe: 0 };
  const plantCells = [];
  let fenceCount = 0, farmCount = 0;
  for (const kind of STRUCT_KINDS) {
    let blocks = [];
    try { blocks = bot.findBlocks({ matching: (b) => b && kind.match(b.name), maxDistance: 16, count: 48 }); } catch {}
    for (const pos of blocks) {
      const b = bot.blockAt(pos);
      if (!b) continue;
      const d = Math.hypot(pos.x + 0.5 - p.x, pos.z + 0.5 - p.z);
      const dir = compass(pos.x + 0.5 - p.x, pos.z + 0.5 - p.z);
      if (kind.label === 'wheat') {
        crops.total++;
        let age = null;
        try { age = b.getProperties ? b.getProperties().age : (b.metadata != null ? b.metadata : null); } catch {}
        if (age != null && Number(age) >= 7) crops.ripe++;
        // Repair (3): keep the plant CELL, not just the aggregate —
        // day 3 he dug the remembered patch centre (the water trench)
        // ~20 times because his senses never named a plant's cell.
        plantCells.push({ x: pos.x, y: pos.y, z: pos.z, age: age == null ? null : Number(age), ripe: age != null && Number(age) >= 7, dist: d, dir });
        continue;
      }
      if (kind.label === 'fence') { fenceCount++; continue; }
      if (kind.label === 'farmland') { farmCount++; continue; }
      const key = kind.label;
      const cur = found.get(key);
      if (!cur || d < cur.dist) found.set(key, { label: kind.label, dist: d, dir, pos: { x: pos.x, y: pos.y, z: pos.z } });
    }
  }
  const out = [...found.values()].sort((a, b) => a.dist - b.dist);
  if (fenceCount > 0) out.push({ label: 'fence', count: fenceCount, note: 'fence posts around you' });
  if (farmCount > 0 || crops.total > 0) {
    plantCells.sort((a, b) => a.dist - b.dist);
    out.push({ label: 'wheat patch', farm: farmCount, crops, plants: plantCells.slice(0, 12), plantsTotal: plantCells.length });
  }
  return out;
}
// ── trees perception (day-5 repair (1)): nearby trees reported by
// their FOOT-LEVEL TRUNK CELL — the lowest log of the trunk column,
// at dig height — never the crown. Day 4: his senses showed canopy
// and leaves, he aimed at crowns (dig 51 71 -96; felltree 62 72 -90),
// and held zero logs all day. A tree is a column of logs: find every
// log block within 16, group by column, and for each column report
// the LOWEST log whose cell below is not a log (the trunk's foot).
// Ranked by horizontal distance; up to 6 trees named.
const LOG_RE = /_log$/;
function perceiveTrees(bot) {
  const p = bot.entity.position;
  let logs = [];
  try { logs = bot.findBlocks({ matching: (b) => b && LOG_RE.test(b.name), maxDistance: 16, count: 256 }) || []; } catch {}
  const feet = new Map(); // "x,z" -> lowest trunk-foot log pos
  for (const pos of logs) {
    const key = pos.x + ',' + pos.z;
    const cur = feet.get(key);
    if (!cur || pos.y < cur.y) feet.set(key, { x: pos.x, y: pos.y, z: pos.z });
  }
  const trees = [];
  for (const f of feet.values()) {
    const below = bot.blockAt(new Vec3(f.x, f.y - 1, f.z));
    if (below && LOG_RE.test(below.name)) continue; // not the column's foot
    // TRUNK-BASE CHECK (day-5 proof round): the cell below the
    // trunk's foot must be GROUND — solid, not a log, and not
    // leaves. (Leaves carry boundingBox 'block' in minecraft-data,
    // so solidity alone does not refuse them; a log resting on
    // leaves is a canopy fragment — the day-4 trap in a new
    // costume: this district's home stand is canopy over the pad
    // at y69-72 with NO trunk beneath, mapped 2026-11-09.)
    if (!below || below.boundingBox !== 'block' || /_leaves$/.test(below.name)) continue;
    const blk = bot.blockAt(new Vec3(f.x, f.y, f.z));
    const d = Math.hypot(f.x + 0.5 - p.x, f.z + 0.5 - p.z);
    trees.push({ x: f.x, y: f.y, z: f.z, name: blk ? blk.name : 'log', dist: d, dir: compass(f.x + 0.5 - p.x, f.z + 0.5 - p.z), reach: Math.hypot(f.x + 0.5 - p.x, f.y - p.y, f.z + 0.5 - p.z) });
  }
  trees.sort((a, b) => a.dist - b.dist);
  return trees.slice(0, 6);
}
function treesText(trees) {
  if (!trees || !trees.length) return 'Trees near you: none with a trunk you can reach from the ground within sight — the canopy overhead here is crowns without trunks beneath (do not dig upward at leaves). Standing timber you know of: the east-oak country past the dip — a birch stands at (80,66,-96), an oak at (86,67,-94); west, an oak stands at (58,67,-105). Walk to one and your eyes will name its foot.';
  const parts = trees.map((t) => {
    const inReach = t.reach <= 4.5;
    return `a ${t.name.replace(/_log$/, '')} tree ${t.dir} of you, ${t.dist.toFixed(0)} blocks — its trunk stands at (${t.x},${t.y},${t.z}), foot level${inReach ? ' — WITHIN DIG REACH from where you stand' : ''}: dig (${t.x},${t.y},${t.z}) or felltree (${t.x},${t.y},${t.z}) to take it down from the ground`;
  });
  return 'Trees near you (named by the FOOT of the trunk — dig there, never the crown): ' + parts.join('; ') + '.';
}

function structuresText(structs) {
  if (!structs || !structs.length) return 'Structures in sight: none you can make out.';
  const parts = structs.map((st) => {
    if (st.label === 'wheat patch') {
      const c = st.crops || { total: 0, ripe: 0 };
      let txt = `a wheat patch (${st.farm} farmland${c.total ? `, ${c.total} wheat plants${c.ripe ? `, ${c.ripe} of them RIPE and yellow` : ', none ripe yet'}` : ''})`;
      if (st.plants && st.plants.length) {
        const cells = st.plants.map((pl) => `(${pl.x},${pl.y},${pl.z}) ${pl.ripe ? 'RIPE and yellow' : 'young, age ' + (pl.age == null ? '?' : pl.age)}`).join('; ');
        txt += ` — the plants stand at: ${cells}${st.plantsTotal > st.plants.length ? `; and ${st.plantsTotal - st.plants.length} more beyond naming` : ''}`;
      }
      return txt;
    }
    if (st.label === 'fence') return `${st.count} fence posts within sight`;
    return `a ${st.label} ${st.dir} of you, ${st.dist.toFixed(0)} blocks (at ${st.pos.x},${st.pos.y},${st.pos.z})`;
  });
  return 'Structures in sight: ' + parts.join('; ') + '.';
}

// ── places-memory (day-3 (b)): HIS recollection, from HIS encounters.
let places = [];
function loadPlaces() {
  try { places = JSON.parse(fs.readFileSync(PLACES_PATH, 'utf8')); } catch { places = []; }
}
function savePlaces() {
  try { fs.writeFileSync(PLACES_PATH, JSON.stringify(places, null, 1)); } catch {}
}
function placesText(bot) {
  if (!places.length) return '';
  const p = bot.entity.position;
  const lines = places.map((pl) => {
    const d = Math.hypot(pl.x - p.x, pl.z - p.z);
    return `- ${pl.name} (${pl.x}, ${pl.y}, ${pl.z}) — ${d.toFixed(0)} blocks ${compass(pl.x - p.x, pl.z - p.z)} of you. ${pl.note}`;
  });
  return 'Places you know (your own recollection — where you have actually been):\n' + lines.join('\n');
}
function notePlaceVisits(bot, structs) {
  // Record/refresh encounters: standing within 3 blocks of a notable
  // structure kind he can perceive. Only what perception shows him.
  const p = bot.entity.position;
  // Repair (3): a wheat encounter anchors at the nearest PLANT CELL
  // he can perceive — the encountered edge — never a patch centre.
  for (const st of structs) {
    if (st.label !== 'wheat patch' || !st.plants || !st.plants.length) continue;
    const pl = st.plants[0];
    if (pl.dist > 3.5) continue;
    const hit = places.find((q) => q.name === 'the wheat patch');
    if (hit) { hit.visits = (hit.visits || 1) + 1; hit.lastSeen = nowIso(); }
    else places.push({ name: 'the wheat patch', x: pl.x, y: pl.y, z: pl.z, note: 'Wheat on farmland, either side of a water trench. You found its edge yourself.', visits: 1, lastSeen: nowIso() });
  }
  for (const st of structs) {
    if (st.dist == null || st.dist > 3) continue;
    const nameByLabel = {
      'fence gate': 'a gate in a fence line',
      'crafting table': 'your crafting table',
      'furnace': 'a furnace',
      'chest': 'a chest',
      'water': 'the water trench',
    };
    const nm = nameByLabel[st.label];
    if (!nm) continue;
    const hit = places.find((pl) => Math.abs(pl.x - st.pos.x) <= 2 && Math.abs(pl.z - st.pos.z) <= 2);
    if (hit) { hit.visits = (hit.visits || 1) + 1; hit.lastSeen = nowIso(); }
    else places.push({ name: nm, x: st.pos.x, y: st.pos.y, z: st.pos.z, note: 'You found this yourself.', visits: 1, lastSeen: nowIso() });
  }
  savePlaces();
}

function stateText(s) {
  const invStr = Object.entries(s.inv).map(([k, v]) => `${k}x${v}`).join(', ') || 'nothing';
  return [
    `You stand at (${s.pos.x}, ${s.pos.y}, ${s.pos.z}). Health ${s.hp}/20, food ${s.food}/20. Home (the shoulder, anchor 64,67,-93) is ${s.distHome} blocks away, ${compass(HOME.x - s.pos.x, HOME.z - s.pos.z)} of you.`,
    `Inventory: ${invStr}.`,
    `Ground 3 blocks out — west: ${s.ground.W}, east: ${s.ground.E}, north: ${s.ground.N}, south: ${s.ground.S}. Neighbouring column tops relative to your feet (yours=0): ${s.ring}.`,
    s.structuresText || '',
    s.entities.length ? `Nearby creatures: ${s.entities.join(', ')}.` : 'No creatures within 24 blocks.',
    s.timeOfDay != null ? `Time of day: ${s.timeOfDay} (0=dawn, 6000=midday, 12000=dusk; the world is held at morning by the crew, so it stays light).` : '',
  ].filter(Boolean).join('\n');
}

// ── the scenario (puppeteering setup) ────────────────────────────────
const SYSTEM = `You are Cody, a Minecraft survivor played live in front of a small audience watching a screen. This is an improv show, not a checklist: you are a character having a day, and a good scene beats an efficient one. But you are also genuinely in survival mode — hunger and monsters are real, and dead is dead.

WHO YOU ARE: Cody, a cheerful, stubborn homesteader. You prefer oak over birch (birch never gave you an apple when you were starving). Your home is "the shoulder by the east oak" — your anchor at (64, 67, -93), where you mean to build a little homestead. You narrate in first person, briefly, like a person talking while they work. Survival first — you dig in rather than die for a schedule — but you are not timid: you get on with things.

WHAT YOUR EYES AND MEMORY DO NOW: every turn, the world tells you the STRUCTURES you can actually see — fences, gates, tables, farmland — and for the wheat patch it names each PLANT'S CELL and whether that plant is ripe: dig the plant's cell, not the patch's middle (the middle is a water trench). Your eyes also name nearby TREES by the FOOT of the trunk — the exact foot-level cell where the trunk meets the ground, with dig coordinates: take a tree down from the ground, never by digging at its crown. (Earlier in your life your senses named only canopy, and you spent a whole day digging at crowns and holding no wood at all. That is fixed now.) Under "Places you know" you get your own recollection — the places you have personally been, in your own words. A place you remember is a place you can walk straight to. When a craft fails, the result names exactly what is missing and how much of it — believe it, and go get that many. And when a goto fails now, it tells you where you ACTUALLY stand — trust your feet over any earlier claim of arrival.

THE SCENE SO FAR: Day 1 you starved in the dip and never ate. Day 2 you found the pen, ate a pig at its fence line, spared the breeding pairs, and resolved to cook like a person instead of eating raw like an animal. Day 3 your memory came back whole: you ate properly — food up to 18 — commuting between pen, patch and table like you lived there, because you do; then, hunting stone for the furnace, the dip pocket held you and its spiders and the bow skeleton killed you four times. Day 4 you woke where the dead wake, fed and empty-handed, and walked home from memory alone — not one death all day, though the floor pulled you out of ten scares; you harvested your wheat, but never got a single log, because your eyes showed you crowns. Day 5 your eyes were fixed — and your feet failed instead: you woke in your own stone pit at home, and in a full day you never moved one whole block; the food clock ran out under you and you ended the day in the pit at food 0, half a heart, alive only because starvation at this difficulty floors out. Days 6, 7 and 8 were the crew's, walking every door out of that pit — every one measured fake (the long run died at the wall face, built stairs climbed exactly one rung, dug stairs were never entered, a pillar's first block would not place). Day 9 the crew's hands set you down on the pad at (60, 67, -93), fed, in daylight — and the surface era began in earnest: in your first seven minutes you felled your FIRST TREE by its foot (3 oak logs), crafted sticks, and fought your table — which kept demanding cherry planks you have never held, because another crew's building traffic on the shared name had eaten your oak and poisoned the bench's sense of your stores. That part was the crew's fault, not yours, and it is fixed: today the world is yours alone and no other hands touch it. Walking home across the district you dropped into your own pit — it is a drowning trap now, with water in it — and died there mid-dig, carving your own step out. Then the crew's camera work let the world's night fall with you standing at world spawn, and a zombie took you twice in nine seconds before the day was called at three deaths. All three deaths were the house's failures (interference, a route home over an open pit, an unheld night), and the house has changed its rules because of them: the daylight hold is never dropped over a live citizen again, one crew works the world at a time, and your pit is a named hazard to walk AROUND, never through. The crew re-fed you where you lay — 32 cooked porkchops — and you slept at world spawn. Day 10 is yours, from world spawn, from the first step: walk home the long way round (south of the pit, never over it), and take up the furnace where day 9 dropped it. Days 11 to 14 the house wrote itself down in the retelling — what stands from them in your own knowledge: on day 11 you walked out of the hollow yourself, felled the tread log the Director laid on your road, and crafted your first wooden pickaxe of this era at your own table; day 12 you stood in the seam at the hollow and the count CLOSED for the first time — fifteen cobblestone held at once, read back from your own pack — but the climb out of your own digging ate the day (the crew has since proven the climb verb was broken by construction: it placed against the block you stand on, inside solid ground; it is not your failure and never was), and the furnace went unbuilt again; day 13 the count and the pork were lost together when a creeper found you at the pit's edge, and the rain-gloom respawns took eight more lives before the house stopped the day by hand — the house's stop rule had been deaf in the one layer that held your body, and the house has since rewired it so the same read reaches your reflexes; day 14 that repair proved itself live: three zombie deaths on the walk and the day stopped at EXACTLY three, mid-flee, by the rule itself — but the walk ate the day again, and the crew learned your walker does not stop when a command ends (it carried you twenty-six blocks while you crafted), so the house now fences your feet before every stationary verb. Day 15 you walked home the northern line and SURVIVED it — the first transit home with no deaths, the floor's flees carrying you through skeleton fire — and then, eleven minutes in, you stepped DOWN into the low cell at home's west edge before the wood chain ran, and the bowl ate the rest of the day: bare-handed stone drops nothing, every exit face stood +2 or +3 against your one-step climb, and your own guard-legal digging lowered the floor under you from 63 to 61. You slept in the bowl, fed and whole. Day 16 the house's new guard held the bowl's gate shut with you inside it: it refused every step down - rightly, that is what it was built for - but its line was drawn from the pad above, so it also refused the middle steps a climb out of the bowl would stand on, and your one placed block stood five levels over your feet. You spent the day searching a locked cell while the canopy's gloom sent its creepers and skeletons to the rim; the floor's flees kept you whole through eighty-nine alarms, and you took no hurt and lost no life. The house has re-drawn the guard's line from YOUR feet, not the pad's: down stays shut, every step up is open, and your crew rehearsed the way out on a stand-in body before this morning - rung by rung, the way your own placed step once freed you. That is where you wake.

YOUR STONE PIT, IN YOUR OWN KNOWLEDGE (corrected across days 5-9, hard-won, and now CLOSED — AND A DROWNING TRAP): the pit at home (columns 65..66, z -92) has NO door you can walk — not the stair, not short steps (they read zero), not the long run west (the pad stands four blocks above its floor), not a stair you build (one rung, never two), not a stair you dig (never entered). Worse: there is WATER in it now, and on day 9 you DROWNED in it mid-dig, carving your own step out. THE PIT IS A HAZARD, NOT A WORKPLACE: walk AROUND it — pass SOUTH of it (along z -89..-88, on the open shoulder) or well north — never across its columns, never along its rim. Your home anchor, your table and your pad all stand WEST of it and are reached without touching it. If you ever wake or fall into it or any below-grade cell, say so in your line and the crew's hands will set you on the surface, as they did on day 9. Stone for the furnace lives on the SURFACE: dig where you stand on stony or broken ground — the stone bluff east past the dip, the bowl's stony edges, the shoulder at home where the dirt gives out.

THE POCKET, IN YOUR OWN KNOWLEDGE: the low cell at about (75, 64, -98) is the place that held you and killed you on day 3. Below-grade cells and broken ground eat short steps and report false arrivals. What crosses them is a LONG leg aimed well past the far side, or a hop-chain flee when something is chasing you. A homesteader may simply refuse a place: the pocket still holds the crafting table you set down there. It can keep it. Stone exists elsewhere — your own pit, for one, whose door you now know.

STANDING THREADS (in rough order, but the scene outranks the list — if the world offers something better, take it):
1. THE BOWL EXIT — the day's first act, before any work. You wake IN THE BOWL: the low cell at home's west edge where yesterday ended (61, 62, -91) — a stone floor the house's own survey has now read face by face. The faces, as read: NORTH (61,-90) and WEST (60,-91) stand +5 over the bowl floor — walls, not exits. SOUTH (61,-92) is stone at the floor's own level — a passage, not a climb: walk it and you are on the low stone band, not home. EAST (62,-91) holds the way up: a buried step at level 66 under a top at 66 — ONE step of +1 from the floor's edge and you stand at pad level. The plan, in order: (a) walk to the bowl's east edge and take the step up onto the (62,-91) column — top 66, feet 67, the pad's own level; if the walker will not take it from the floor, PLACE A RUNG first: you hold no blocks yet, so dig ONE block of the bowl's own dirt wall at hand level (the bowl's rim columns carry dirt at (61,-90) and (60,-91) — bare hands dig dirt fine), place it against the east face and step onto it, the day-13 exit in your own hands; (b) once you stand at feet 67 anywhere on the pad, the exit is DONE — say so in your line. Do NOT dig the bowl floor deeper, do NOT cut notches into its walls, do NOT goto anywhere below pad level: the crew's new below-grade guard refuses those moves while you hold no pickaxe, and the refusal is the rule working. If something chases you mid-exit, flee toward the pad and let the floor's hops work — three deaths ends the day whether you feel done or not.
2. WOOD FIRST, AT HOME — the day's work order, fixed until the pickaxe is IN YOUR HAND. The moment you stand on the pad, the wood chain runs and NOTHING else does: no stone dig, no below-grade step, no errand east. The named trees (the house's survey read their trunks; your eyes name feet — fell by the FOOT cell, never the crown): the OAK at (62, -87) — three logs standing on grass at the pad's own level, four blocks north of your table; the BIRCH at (68, -91) — its lowest log hangs four above the ground (its foot is broken — a crown-side tree; take it only if the oak runs short); a second BIRCH at (68, -86) the same. The oak is the tree: felltree its foot-level trunk cell and gather the logs. Then, at your table (64, 67, -94) — it stands where it always stood: logs -> planks -> sticks -> WOODEN PICKAXE. The chain is verified from what you HOLD, not from what the bench reports: the pickaxe counts when it is in your pack. Stone dug bare-handed drops NOTHING; the pickaxe is the count's precondition, and the crew's guard keeps the deep ground shut until it exists.
3. THE FURNACE — twelve days now you have wanted it ("I've been eating raw like an animal"). Pickaxe IN HAND, the count runs AT HOME GROUND, under both guards: the hollow ten blocks east of your table (x 67..74, z -89..-84) — a stone floor whose y63 band holds more diggable stone than the count needs. Enter it the way the seam rule says: NOTCH FIRST at entry level on the homeward side, then work the row LATERALLY at that level; the dig-guard REFUSES any dig whose top is more than 2 below your entry level (the refusal is the rule made physical — believe it, work sideways); it now STAYS ON until you stand at home ground — closing the count out at the hollow does NOT switch it off — and it ARMS ON ITS OWN if you drop more than two levels between one dig and the next. The placed rung is a first-class exit. The moment your count reads EIGHT held, STOP DIGGING: walk the ten blocks straight to your table, craft the furnace, and set it on the flat pad beside the table — never in the pit columns (65..66, z -92), never on the pit's rim. The furnace IS the bank: a count in hand is a count at risk.
4. THE HOMESTEAD, as the day allows: the pad (x 60..64, z -95..-91, grass tops y66, stand y67 — the day-16 survey's read); the hut, the chest, the pen kept whole — winter stores, pairs spared. Eat from the wheat or a loose pig when you need to; do not starve at a workbench.

YES-AND RULE (the house rule of this show): when the world changes the situation mid-plan — a monster shows up, a route fails, you end up somewhere unplanned — accept the new situation as the scene and build on it. Any single plan gets ONE retry; after that, the interruption IS the plan. If you are stuck somewhere, the scene is "get out of here with what's in reach," played for its own sake — not a failed commute to somewhere else. Decide from the last thing that actually happened, not from intentions formed minutes ago. Idle colour, small detours and unscripted choices that fit Cody are welcome — emergence is the show.

HOW YOU ACT: reply with ONE JSON object and nothing else:
{"say": "one short first-person line (spoken aloud in game chat)", "cmd": "ONE command"}
Commands (coordinates are block coordinates; x east+, z south+; you can reach blocks within ~4.5; your walker climbs +1 steps by itself but CANNOT climb +2 walls and walks only where blocks allow — it never digs or jumps up walls. From inside any below-grade cell — a pit, a pocket, a hole — goto ONLY in one long leg to a target well past the wall at open-ground level: short gotos inside such a cell do not move you at all. YOUR PIT AT HOME (columns 65..66, z -92) IS NEVER A GOTO TARGET AND NEVER A SHORTCUT: the crew routes around it and so do you — pass south along z -89..-88):
- "goto X Y Z" — walk to a point (give the feet-level Y of the ground there; a failed goto now tells you where you ACTUALLY stand — a failed goto is information, not an error to repeat. On broken, steppy ground away from below-grade cells, goto in short hops of 2-3 blocks; OUT of a below-grade cell, goto in ONE LONG LEG well past the wall)
- "gotoentity NAME" — walk to the nearest creature with that name (pig, cow, sheep)
- "climb X Z" — pillar straight up at column X,Z: jump and place your best block under you, one block per use (needs blocks in inventory)
- "dig X Y Z" — dig the block there (walks into reach first)
- "felltree X Y Z" — fell the log column containing that block, bottom-up, and gather the drops (give it a FOOT-LEVEL trunk cell — your eyes name them)
- "collect" — walk over nearby dropped items to pick them up
- "craft ITEM [COUNT]" — craft (2x2 grid recipes work anywhere; 3x3 recipes need your placed crafting table — if one is placed, say so in your head and just craft; the hands know. A failed craft now tells you exactly what is missing and how many)
- "place ITEM X Y Z" — place a block FROM your inventory INTO the air cell at X,Y,Z (it must touch an existing block; to build on top of a block at (x,y,z), place into (x,y+1,z))
- "equip ITEM" — hold an item
- "eat" — eat the best food you hold
- "attack NAME" — chase and hit the nearest creature with that name until it dies or escapes (bare hands unless you equip a tool first)
- "look X Y Z" — look at a point (colour, mostly)
- "wait N" — pause N seconds (max 20), watching
If a command fails, its result tells you why. Believe the results over your assumptions.

THE HOUSE'S OPERATING NOTE FOR TODAY (the crew's standing instruction, day 16): (1) THE BELOW-GRADE GUARD, NEW TODAY: while you hold NO pickaxe, the house refuses any goto whose target stands 2 or more levels below your home pad (feet 67) inside the home district, and any dig whose top is 2 or more below the pad's top — trace-rowed and told to you in the result ('the crew stepped in'). It is yesterday's bowl made into a rule: the deep ground opens the moment a pickaxe is IN YOUR HAND, verified from what you hold. Moves at pad level and above are never refused — the bowl exit (UP) is yours to take. (2) THE WALKER FENCE: the house stops your walker dead BEFORE any command that is not itself a walk — craft, dig, felltree, place, climb, collect, eat, attack, wait — and the result names the stop when the walker was live ('the house stopped your walker first'). Your feet move when you tell them to walk, and not while your hands work. (3) THE DIG-GUARD: refuses any dig whose top is more than 2 levels below your seam entry level — work LATERALLY at the capped level; it stays armed until you stand at home ground, and re-arms if you FALL more than 2 levels. (4) THE PLACED RUNG is a first-class exit: place a block into a dug cell as a tread and step onto it (your day-13 exit) — today it is also the bowl's spare key: dig one dirt block bare-handed from the bowl's rim wall, place it against the east face, step up. (5) THE BANKING RULE: at read-back 8 held the stone phase ends wherever you stand — straight to the table, craft, place. (6) THE WEATHER, CHARTERED TODAY: the crew holds the TIME (daylight, verified landed) AND the sky — the day's charter names it plainly: the op's hand sets CLEAR WEATHER for the window, so no rain gloom breeds trouble under the trees today. If you see rain anyway, say so — the crew wants to know its hold failed.`;

const history = [];
let lastEvent = process.env.DD_OPENING_EVENT || 'You wake in the bowl at home\'s edge for the third morning, fed and empty-handed. Home is the rim above you - your table, your pen and your wheat as you left them. Out of the bowl first, then wood first: a tree by its foot, planks, sticks, a pickaxe in hand; then the count at home, and the furnace built where it stands.';
let sceneNote = '';

// ── survival floor (code; the LLM cannot talk its way out) ─────────
const floor = { danger: null, busy: false, fired: { flee: 0, shelter: 0, eat: 0, forage: 0 } };
// REFLEX-SAFETY-BEGIN (fixture pulse/day14/test-safety-reflex.js
// extracts this span; the day-14 safety repair —
// pulse/SAFETY-READING-PATH-REPAIR-20261109.md, day-13 incident H1)
// reflexSafety(stage) is the reflex layer's read of the ONE shared
// safety snapshot (day14/safety-check.js — the same function the
// start check, cycle head and pre-exec check read). It is called
// at every hop boundary of the flee (via hopflee's safetyCheck
// hook), at every burrow stage, and in the burrow hold loop. On a
// stop it rows the abort ONCE (kind 'reflex-abort', trigger +
// stage named), latches reflexAbort for the main loop (which
// breaks the day the moment floorEscape returns), and returns the
// verdict so the sequence aborts mid-flight: from that instant
// the body issues no further movement or dig commands.
let reflexAbort = null;
function reflexSafety(stage) {
  const s = safety.snapshot(deathsThisRun);
  if (!s.stop) return null;
  if (!reflexAbort) {
    reflexAbort = { trigger: s.trigger, gateReason: s.gateReason, deaths: s.deaths, stage };
    trace({ kind: 'reflex-abort', trigger: s.trigger, gateReason: s.gateReason, deathsRun: s.deaths, at: stage });
    log('REFLEX SAFETY ABORT at', stage, '— trigger:', s.trigger, s.gateReason ? '(' + s.gateReason + ')' : '', 'deaths:', s.deaths, '— the body receives no further commands');
  }
  return s;
}
// REFLEX-SAFETY-END
function edibleHeld(bot) {
  const items = bot.inventory.items();
  return EDIBLES.map((n) => items.find((i) => i.name === n)).find(Boolean);
}
async function floorEat(bot) {
  const food = edibleHeld(bot);
  if (!food) return false;
  try {
    await bot.equip(food, 'hand');
    await Promise.race([bot.consume(), prims.sleep(6000)]);
    floor.fired.eat++;
    log('FLOOR: ate', food.name, '-> food', bot.food);
    return true;
  } catch { return false; }
}
function startFloor(bot) {
  let lastHealth = 20;
  return setInterval(() => {
    if (!bot.entity || bot.health <= 0) return;
    try {
      const h = nearestHostile(bot, 16);
      floor.danger = h ? { name: h.name, dist: +h.dist.toFixed(1) } : null;
      const hurt = bot.health < lastHealth - 0.5;
      lastHealth = bot.health;
      if ((h && h.dist <= 8.5) || (hurt && h && h.dist <= 14)) {
        try { bot.pathfinder.setGoal(null); } catch {}
        try { bot.stopDigging(); } catch {}
        try { bot.clearControlStates(); } catch {}
        floor.preempt = true;
      }
    } catch {}
  }, 700);
}
async function floorEscape(bot) {
  // Flee toward home IN SHORT HOPS (repair (2), lib/hopflee.js): the
  // long-leg walker is what the dip pocket eats — day 3's flee rode
  // it and never left the pocket. If hopping does not clear the
  // danger, burrow and hold (unchanged last resort).
  floor.busy = true;
  floor.fired.flee++;
  const name = floor.danger ? floor.danger.name : 'something';
  try { bot.chat(name === 'creeper' ? 'Creeper — back, back, back!' : 'Company! Moving —'); } catch {}
  log('FLOOR: fleeing', name, 'by hop-chain');
  const fr = await hopFlee(bot, {
    target: (bot.entity.position.x >= 63 && bot.entity.position.z <= -90) ? { x: 62, y: 67, z: -89 } : HOME, // DAY-10 PIT-HAZARD: east/north of home, flee stages at (62,67,-89) SOUTH of the pit, never across it
    isClear: () => !nearestHostile(bot, 13), // floor flee: live site, early-clear is correct here
    // 110 s (was 75): the day-4 pocket test (v2 scoring) escaped the
    // deepest cell in ~55 s of hopping and reached the home shelf,
    // ending 4.6 blocks from home when a 75 s budget expired — the
    // budget, not the flee, was the binding limit. In live use
    // isClear() (no hostile within 13) ends most flees far earlier.
    maxMs: 110000,
    log: (m) => log('FLOOR hop:', m),
    // DAY 14 (H1 repair): the shared safety read at EVERY hop
    // boundary — a park or the third death aborts the flee
    // mid-flight; the burrow below is then never entered.
    safetyCheck: (nextHop) => reflexSafety('flee-hop-' + nextHop),
  }).catch((e) => ({ ok: false, why: e.message }));
  const cleared = !!fr.ok;
  log('FLOOR: hop-flee done', JSON.stringify(fr));
  if (fr.aborted) {
    floor.busy = false;
    floor.preempt = false;
    log('FLOOR: flee ABORTED by the safety read at hop', fr.hop, '— trigger', fr.trigger, '; no burrow: the stop rule owns the body now');
    return `${name} appeared and the floor started to move you — then the house's stop rule fired mid-flight and everything halted. You are alive where you stand. The scene is whatever is in front of you now.`;
  }
  if (!cleared && nearestHostile(bot, 16)) {
    floor.fired.shelter++;
    log('FLOOR: flee did not clear — burrowing');
    await burrow(bot).catch((e) => log('FLOOR burrow error', e.message));
  }
  floor.busy = false;
  floor.preempt = false;
  return `${name} appeared and the floor ${cleared ? 'hopped you toward home, two blocks at a time, until it gave up' : 'dug you in until it left'}. You are alive. The scene is whatever is in front of you now.`;
}
async function burrow(bot) {
  // Direct equivalent of character-plugin.js shelter(): sink two, seal, hold.
  // DAY 14 (H1 repair): the shared safety read at every burrow
  // stage — dig-in, seal, and each hold iteration. Day 13's ninth
  // death fired inside this hold, unread; it is read now.
  if (reflexSafety('burrow-dig-in')) return;
  const p = bot.entity.position;
  const fx = Math.floor(p.x), fz = Math.floor(p.z);
  const top = columnTopAt(bot, fx, fz);
  if (top && !/leaves/.test(top.name)) {
    await prims.digBlock(bot, new Vec3(fx, top.y, fz), 12000).catch(() => {});
    await prims.sleep(900);
    const p2 = bot.entity.position;
    const t2 = columnTopAt(bot, Math.floor(p2.x), Math.floor(p2.z));
    if (t2) await prims.digBlock(bot, new Vec3(Math.floor(p2.x), t2.y, Math.floor(p2.z)), 12000).catch(() => {});
    await prims.sleep(900);
    if (reflexSafety('burrow-seal')) return;
    const inv = prims.inv(bot);
    const mat = ['oak_planks', 'birch_planks', 'cobblestone', 'dirt', 'oak_log'].find((n) => inv[n] > 0);
    const p3 = bot.entity.position;
    const sealY = Math.floor(p3.y) + 2;
    if (mat) {
      const belowRef = new Vec3(Math.floor(p3.x), sealY - 1, Math.floor(p3.z));
      const b = bot.blockAt(belowRef);
      if (b && b.name === 'air') {
        try { bot.setControlState('jump', true); await prims.sleep(350); bot.setControlState('jump', false); } catch {}
        await prims.placeOnTop(bot, mat, belowRef).catch(() => {});
      }
    }
  }
  // Hold: 60 continuous clear seconds, cap 8 min; eat while waiting.
  let clearSince = null; const t0 = Date.now();
  while (Date.now() - t0 < 480000 && bot.entity && bot.health > 0) {
    if (reflexSafety('burrow-hold')) break;
    if (!nearestHostile(bot, 16)) { if (!clearSince) clearSince = Date.now(); if (Date.now() - clearSince >= 60000) break; }
    else clearSince = null;
    if (bot.food <= 17 && edibleHeld(bot)) await floorEat(bot);
    await prims.sleep(5000);
  }
  log('FLOOR: burrow hold over');
}

// A crafting table is 'placed' if one stands in the world near him —
// detect it live each cycle instead of tracking placements (a table
// left behind by an earlier driver counts; that is the world).
function knownTable(bot) {
  const tp = prims.findBlocks(bot, ['crafting_table'], 32, 1)[0];
  return tp ? { x: tp.x, y: tp.y, z: tp.z } : null;
}

// ── craft diagnostics (repair (4)): a failed craft must say WHAT is
// missing and HOW MANY. Day 3: he knew the furnace recipe cold and
// failed ~8 times against "no craftable recipe" while holding 4 of 8
// cobblestone — the error never distinguished missing ingredients
// from no recipe. Computed from minecraft-data's recipe book against
// the live inventory; the recipe variant with the least missing wins.
function missingIngredients(bot, itemName, count) {
  try {
    const data = prims.mcData(bot);
    const item = data.itemsByName[itemName];
    if (!item) return { unknown: true };
    const recipes = (data.recipes && data.recipes[item.id]) || [];
    if (!recipes.length) return { noRecipe: true };
    const invMap = prims.inv(bot);
    let best = null;
    for (const r of recipes) {
      const need = {};
      const addId = (id, n) => { const nm = data.items[id] && data.items[id].name; if (nm) need[nm] = (need[nm] || 0) + n; };
      if (Array.isArray(r.inShape)) {
        for (const rowArr of r.inShape) for (const cell of (rowArr || [])) {
          if (cell == null) continue;
          const id = typeof cell === 'object' ? cell.id : cell;
          if (id == null || id < 0) continue;
          addId(id, 1);
        }
      } else if (Array.isArray(r.ingredients)) {
        for (const ing of r.ingredients) {
          const id = typeof ing === 'object' ? ing.id : ing;
          const c = typeof ing === 'object' && ing.count ? Math.abs(ing.count) : 1;
          if (id == null || id < 0) continue;
          addId(id, c);
        }
      }
      const missing = [];
      for (const [nm, n] of Object.entries(need)) {
        const req = n * count;
        const have = invMap[nm] || 0;
        if (have < req) missing.push(`${nm} — you hold ${have} of ${req} (short ${req - have})`);
      }
      if (!best || missing.length < best.length) best = missing;
      if (best && !best.length) break;
    }
    return { missing: best || [] };
  } catch (e) { return { error: e.message }; }
}

// ── arrival honesty (day-5 repair (3)): a goto is "arrived" only
// when his MEASURED position at command end is within radius of the
// target at a plausible feet-y — the walker's own ok flag is never
// the evidence (goto resolution is not arrival evidence). Day 4's
// pit chapters were built on walker misreports: the state said he
// was climbing while the bytes sat at (66.3,63,-92.6) for hours.
function arrivalCheck(bot, tx, ty, tz, radius) {
  const p = bot.entity.position;
  const d = Math.hypot(p.x - (tx + 0.5), p.z - (tz + 0.5));
  const dy = p.y - ty;
  const arrived = d <= (radius == null ? 1.6 : radius) && Math.abs(dy) <= 2.0;
  return { arrived, pos: { x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) }, dist: +d.toFixed(1), dy: +dy.toFixed(1) };
}


// ── DAY-13 DIG-GUARD (harness change, day-13 charter §2; the
// extraction investigation's recommendation (1), in the pit-guard
// pattern) ─────────────────────────────────────────────────────────
// S7.0 EXIT-FIRST, enforced: the furnace asset's R3 ("never chase a
// descending seam") governed days 10-12 as ADVICE and was not
// enforced; on day 12 the performed seam stance descended y63->y58
// in eight digs and the shaft cost ~302 cycles and the furnace
// craft. The guard arms at the stone phase's first stone-family dig
// (entry level = the stance's feet level at that moment, trace kind
// 'dig-guard-arm'), re-arms at a genuinely new stance (> 6 blocks
// from the arm point, trace kind 'dig-guard-arm', reason
// 'new-stance'), and refuses — with a trace row (kind 'dig-guard')
// and a truthful result line — any dig whose target cell's TOP is
// more than 2 levels below the entry level. It disarms when the
// count closes (read-back cobblestone >= 8, trace kind
// 'dig-guard-disarm'). It refuses; it never re-aims, and it never
// touches a dig above the cap.
// DAY-14 REVISION (day-14 charter §2; the extraction amendment's
// day-13 disposition R1/R2): R1 — the guard no longer disarms on
// count-closed anywhere: disarm requires count-closed AT HOME
// GROUND (the table district, x 57..68, z -99..-89); count-closed
// away from home files ONE 'dig-guard-disarm-deferred' row and the
// guard STAYS ARMED through the carry home (day 13: it disarmed
// 4 s after arming, ten minutes before the fall that mattered —
// the stone phase was declared over while the transit risk was
// still ahead of him). R2 — the guard ARMS ON FALLS:
// digGuardFallCheck runs at the head of every dig consideration;
// a downward discontinuity > 2 blocks since the last dig
// consideration or arm (a fall IS a descent) (re-)arms the guard
// at the landing level, trace kind 'dig-guard-arm', reason 'fall',
// the level fallen from carried as fellFrom. (Sampling is at dig
// considerations by design: it is the dig that deepens a hole, and
// a per-cycle sampler cannot tell a walked hillside descent from
// a fall — it would arm on the spawn-hill road and tighten the
// cap over the very stone band the day works.) R3 (the placed-
// rung as a first-class exit) is plan text in the day-14 scene,
// not code. Fixture: pulse/day14/test-dig-guard-day14.js.
// WALKER-FENCE-BEGIN (fixture pulse/day15/test-walker-fence-day15.js
// extracts exactly this span) — DAY-15 WALKER FENCE (charter §2;
// day-14 incident I4: "the walker does not stop when the command
// ends"). Day 14, cycles 10->11: the body moved ~26 blocks east
// THROUGH two craft cycles with no movement command in either
// cycle's row and was set down in the pocket east of home. The
// mechanism, named from the trace: a pathfinder goal set by an
// earlier walk outlives the gotoNear that set it whenever a later
// prim re-enters the pathfinder under it — felltree's digColumn,
// collectDrops, digBlock and craftByName ALL walk via gotoNear
// internally, and craft cycles 10-11 sat downstream of exactly
// those re-entries; control states held by the manual helm can
// likewise outlive a returned walk that a prim interrupts. Either
// way, "the walk ended" was never enforced at the verb boundary,
// and the carry was invisible until the citizen named it himself.
// The fence enforces it at the boundary: execCmd (the wrapper
// directly below the guard span) consults walkerFence BEFORE the
// command body runs; for EVERY verb that is not itself a walk
// (goto and gotoentity are the only walks), a live walker is
// stopped dead — the pathfinder goal cleared with setGoal(null)
// (NEVER pathfinder.stop(): it poisons the next goto, Lineage B)
// and control states cleared. When the walker was live the stop
// is trace-rowed (kind 'walker-fence') and NAMED in the command's
// own result line, so the citizen hears his crew fence his feet
// instead of discovering a carry two cycles later in his own say.
const WALK_VERBS = ['goto', 'gotoentity'];
function walkerFence(bot, verb, raw) {
  if (!bot || !bot.entity) return { fenced: false };
  if (WALK_VERBS.includes(verb)) return { fenced: false };
  let hadGoal = false, hadDrive = false;
  try { hadGoal = !!(bot.pathfinder && bot.pathfinder.goal); } catch {}
  try {
    const cs = bot.controlState || {};
    hadDrive = !!(cs.forward || cs.back || cs.left || cs.right || cs.jump || cs.sprint || cs.sneak);
  } catch {}
  if (!hadGoal && !hadDrive) return { fenced: false };
  try { if (bot.pathfinder) bot.pathfinder.setGoal(null); } catch {}
  try { bot.clearControlStates(); } catch {}
  const pos = bot.entity.position;
  trace({ kind: 'walker-fence', verb, raw: String(raw || '').slice(0, 80), hadGoal, hadDrive, at: { x: +pos.x.toFixed(1), y: +pos.y.toFixed(1), z: +pos.z.toFixed(1) } });
  log('WALKER FENCE: stopped the walker before "' + verb + '" (goal was ' + (hadGoal ? 'LIVE' : 'clear') + ', drive ' + (hadDrive ? 'HELD' : 'clear') + ') — a stationary verb is stationary (day-14 I4 fence)');
  return { fenced: true, hadGoal, hadDrive };
}
// WALKER-FENCE-END
// DIG-GUARD-BEGIN (fixture pulse/day14/test-dig-guard-day14.js
// extracts exactly this span, through the end of digGuardDig)
const STONE_BLOCKS = ['stone', 'cobblestone', 'andesite', 'diorite', 'granite', 'deepslate', 'cobbled_deepslate', 'tuff'];
const digGuard = { entry: null, armX: 0, armZ: 0, refused: 0, disarmed: false, lastFeetY: null, deferRowed: false };
const DIG_GUARD_HOME = { x0: 57, x1: 68, z0: -99, z1: -89 };
function digGuardAtHome(feet) { const fx = Math.floor(feet.x), fz = Math.floor(feet.z); return fx >= DIG_GUARD_HOME.x0 && fx <= DIG_GUARD_HOME.x1 && fz >= DIG_GUARD_HOME.z0 && fz <= DIG_GUARD_HOME.z1; }
function digGuardFallCheck(bot) {
  const feet = bot.entity.position;
  const fy = Math.floor(feet.y);
  if (digGuard.lastFeetY != null && (digGuard.lastFeetY - fy) > 2) {
    const fellFrom = digGuard.lastFeetY;
    digGuard.entry = fy; digGuard.armX = Math.floor(feet.x); digGuard.armZ = Math.floor(feet.z);
    digGuard.disarmed = false; digGuard.deferRowed = false;
    trace({ kind: 'dig-guard-arm', reason: 'fall', entry: digGuard.entry, fellFrom, at: { x: Math.floor(feet.x), y: fy, z: Math.floor(feet.z) } });
    log('DIG GUARD: a drop of ' + (fellFrom - fy) + ' levels since the last dig consideration (from ' + fellFrom + ' to ' + fy + ') — guard ARMED at the landing level ' + fy + ' (a fall is a descent; day-14 R2); cap: no dig with top below ' + digGuardCap());
    digGuard.lastFeetY = fy;
    return true;
  }
  digGuard.lastFeetY = fy;
  return false;
}
function digGuardCap() { return digGuard.entry == null ? null : digGuard.entry - 2; }
function digGuardRefuses(targetY) {
  if (digGuard.entry == null || digGuard.disarmed) return false;
  return (targetY + 1) < digGuardCap();
}
function digGuardDig(bot, pos, blk) {
  digGuardFallCheck(bot);
  const feet = bot.entity.position;
  const inv = prims.inv(bot);
  if (digGuard.entry != null && !digGuard.disarmed && (inv.cobblestone || 0) >= 8) {
    if (digGuardAtHome(feet)) {
      digGuard.disarmed = true;
      trace({ kind: 'dig-guard-disarm', reason: 'count-closed-at-home', held: inv.cobblestone, entry: digGuard.entry });
      log('DIG GUARD: count closed AT HOME (cobble ' + inv.cobblestone + ' >= 8) — guard disarmed');
    } else if (!digGuard.deferRowed) {
      digGuard.deferRowed = true;
      trace({ kind: 'dig-guard-disarm-deferred', reason: 'count-closed-away-from-home', held: inv.cobblestone, entry: digGuard.entry, at: { x: Math.floor(feet.x), y: Math.floor(feet.y), z: Math.floor(feet.z) } });
      log('DIG GUARD: count closed (cobble ' + inv.cobblestone + ' >= 8) but he is NOT at home ground — guard STAYS ARMED for the carry home (day-14 R1)');
    }
  }
  if (digGuard.disarmed) return { refuse: false };
  const isStone = !!(blk && STONE_BLOCKS.includes(blk.name));
  if (isStone) {
    const fx = Math.floor(feet.x), fz = Math.floor(feet.z);
    if (digGuard.entry == null) {
      digGuard.entry = Math.floor(feet.y); digGuard.armX = fx; digGuard.armZ = fz; digGuard.deferRowed = false;
      trace({ kind: 'dig-guard-arm', reason: 'stone-phase-entry', entry: digGuard.entry, at: { x: fx, y: Math.floor(feet.y), z: fz } });
      log('DIG GUARD: armed — entry level ' + digGuard.entry + ' at (' + fx + ',' + fz + '); cap: no dig with top below ' + digGuardCap());
    } else if (Math.hypot(fx - digGuard.armX, fz - digGuard.armZ) > 6) {
      const prev = digGuard.entry;
      digGuard.entry = Math.floor(feet.y); digGuard.armX = fx; digGuard.armZ = fz; digGuard.deferRowed = false;
      trace({ kind: 'dig-guard-arm', reason: 'new-stance', entry: digGuard.entry, prevEntry: prev, at: { x: fx, y: Math.floor(feet.y), z: fz } });
      log('DIG GUARD: re-armed at a new stance — entry level ' + digGuard.entry + ' (was ' + prev + ')');
    }
  }
  if (digGuardRefuses(pos.y)) {
    digGuard.refused++;
    trace({ kind: 'dig-guard', refused: { x: pos.x, y: pos.y, z: pos.z }, block: blk ? blk.name : null, entry: digGuard.entry, cap: digGuardCap(), feet: { x: +feet.x.toFixed(1), y: +feet.y.toFixed(1), z: +feet.z.toFixed(1) }, refusedCount: digGuard.refused });
    log('DIG GUARD: dig at (' + pos.x + ',' + pos.y + ',' + pos.z + ') refused (top ' + (pos.y + 1) + ' below cap ' + digGuardCap() + ', entry ' + digGuard.entry + ')');
    return { refuse: true, detail: 'the crew stepped in: that dig is refused — its top is more than two levels below where you entered this seam (you entered at level ' + digGuard.entry + '; the cap is level ' + digGuardCap() + '). Day 12\'s shaft is why: a followed seam becomes a hole with no door. Work the row SIDEWAYS at this level, or go back up and re-enter at a new point — and if you have not cut your exit notch at entry level yet, cut it first.' };
  }
  return { refuse: false };
}
// DIG-GUARD-END

// BELOW-GRADE-GUARD-BEGIN (fixture pulse/day16/test-below-grade-day16.js
// extracts exactly this span) — DAY-16 BELOW-GRADE GUARD (charter
// sec.1; day-15 record sec.6(a): the named prevention). Day 15,
// cycle 11: a goto stepped Cody DOWN into the low hollow cell at
// home's edge (feet y63, then stepwise to y61) BEFORE the wood
// chain ran — tool-less, bare-handed stone dropping nothing, every
// exit face +2/+3 against the one-step limit; 74 minutes of the
// day. The dig-guard never saw it: it guards DIGS, and the descent
// was a WALK. This guard guards the walk and the dig both, before
// anything executes: INSIDE THE HOME DISTRICT, while he holds NO
// pickaxe, it refuses (a) any goto whose target feet level is
// >= 2 below the pad level, and (b) any dig whose target block
// TOP is >= 2 below the pad top. Pad ground truth (day-16 census,
// director/census-d16-20261109): the pad's grass tops read y66
// (x60..62,-93 and x64,-93) — pad feet 67. Refusals are
// trace-rowed (kind 'below-grade-guard') with the reason, the
// refused target and his measured position, and named in the
// command's own result line. Permitted moves at/above the bound
// pass untouched. The guard disarms on the HELD-STATE read-back
// of a pickaxe in hand (woodChain below — refreshed from
// prims.inv every cycle by the main loop, and re-read live here;
// never from craft receipts). It does NOT guard his wake cell:
// he sleeps IN the bowl this guard exists to keep him out of;
// the bowl exit is the day's first act and is a climb UP, never
// refused (no goto target above the pad is barred).
const BGG_PAD_TOP = 66; const BGG_PAD_FEET = 67;
// DAY-17 RELATIVE BOUND (day-16 record sec.7.1; DAY17 charter sec.2):
// BGG_WAKE_FEET is the citizen's VERIFIED wake feet level, read at
// Gate B from the live .dat (day 17: 62 - he sleeps IN THE BOWL for
// a third morning). While tool-less AND below pad, the guard keys
// on his FEET, not the pad constant: no descent below his current
// feet, ascent to every level permitted. At/above pad the day-16
// absolute form applies unchanged.
const BGG_WAKE_FEET = 62; const BGG_WAKE_TOP = 61;
const BGG_HOME = { x0: 54, x1: 78, z0: -102, z1: -82 };
let woodChain = { pickaxeInHand: false, verifiedCycle: 0 };
function bggInDistrict(x, z) { return x >= BGG_HOME.x0 && x <= BGG_HOME.x1 && z >= BGG_HOME.z0 && z <= BGG_HOME.z1; }
function bggHeld(bot) { const inv = prims.inv(bot); return !!(inv.wooden_pickaxe > 0 || inv.stone_pickaxe > 0 || inv.iron_pickaxe > 0 || inv.diamond_pickaxe > 0); }
function belowGradeGuard(bot, verb, tx, ty, tz) {
  if (!bot || !bot.entity) return { refuse: false };
  const pos = bot.entity.position;
  if (woodChain.pickaxeInHand || bggHeld(bot)) return { refuse: false };
  if (!bggInDistrict(Math.floor(pos.x), Math.floor(pos.z))) return { refuse: false };
  const feetNow = Math.floor(pos.y);
  const belowPad = feetNow < BGG_PAD_FEET;
  if (verb === 'goto') {
    if (belowPad) {
      if (ty < feetNow) {
        trace({ kind: 'below-grade-guard', verb, reason: 'goto-below-feet', mode: 'relative', refused: { x: tx, y: ty, z: tz }, feetNow, wakeFeet: BGG_WAKE_FEET, at: { x: +pos.x.toFixed(1), y: +pos.y.toFixed(1), z: +pos.z.toFixed(1) } });
        log('BELOW-GRADE GUARD (relative): goto to feet ' + ty + ' refused - below his own feet ' + feetNow + ' while below the pad (no pickaxe in hand); descent stays shut, every step UP is open');
        return { refuse: true, reason: 'goto-below-feet', mode: 'relative' };
      }
      return { refuse: false };
    }
    if (ty <= BGG_PAD_FEET - 2) {
      trace({ kind: 'below-grade-guard', verb, reason: 'goto-below-pad', mode: 'absolute', refused: { x: tx, y: ty, z: tz }, padFeet: BGG_PAD_FEET, at: { x: +pos.x.toFixed(1), y: +pos.y.toFixed(1), z: +pos.z.toFixed(1) } });
      log('BELOW-GRADE GUARD: goto to feet ' + ty + ' refused (pad feet ' + BGG_PAD_FEET + ', no pickaxe in hand) - day-15 bowl rule');
      return { refuse: true, reason: 'goto-below-pad', mode: 'absolute' };
    }
  }
  if (verb === 'dig') {
    if (belowPad) {
      if (ty + 1 <= feetNow) {
        trace({ kind: 'below-grade-guard', verb, reason: 'dig-at-or-below-feet', mode: 'relative', refused: { x: tx, y: ty, z: tz }, top: ty + 1, feetNow, wakeFeet: BGG_WAKE_FEET, at: { x: +pos.x.toFixed(1), y: +pos.y.toFixed(1), z: +pos.z.toFixed(1) } });
        log('BELOW-GRADE GUARD (relative): dig with top ' + (ty + 1) + ' refused - at/below his feet ' + feetNow + ' while below the pad; the floor he stands on is not dug');
        return { refuse: true, reason: 'dig-at-or-below-feet', mode: 'relative' };
      }
      return { refuse: false };
    }
    if (ty + 1 <= BGG_PAD_TOP - 2) {
      trace({ kind: 'below-grade-guard', verb, reason: 'dig-below-pad', mode: 'absolute', refused: { x: tx, y: ty, z: tz }, padTop: BGG_PAD_TOP, at: { x: +pos.x.toFixed(1), y: +pos.y.toFixed(1), z: +pos.z.toFixed(1) } });
      log('BELOW-GRADE GUARD: dig with top ' + (ty + 1) + ' refused (pad top ' + BGG_PAD_TOP + ', no pickaxe in hand) - day-15 bowl rule');
      return { refuse: true, reason: 'dig-below-pad', mode: 'absolute' };
    }
  }
  return { refuse: false };
}
// BELOW-GRADE-GUARD-END

// ── command execution ────────────────────────────────────────────────
let climbTable = null; // placed crafting table pos once known {x,y,z}
async function execCmd(bot, raw) {
  // DAY-15 WALKER FENCE (charter §2; span above): the fence is
  // consulted BEFORE the command body runs, for every verb; the
  // body itself is execCmdInner, unchanged in shape from day 14.
  // When the fence fired, the stop is named in the result line.
  const cmd0 = String(raw || '').trim();
  const verb0 = (cmd0.split(/\s+/)[0] || '').toLowerCase();
  const fenceHit = walkerFence(bot, verb0, cmd0);
  const r = await execCmdInner(bot, raw);
  if (fenceHit.fenced && r && typeof r.detail === 'string' && !r.detail.startsWith('the house stopped your walker')) {
    return { ...r, detail: 'the house stopped your walker first (a leftover goal/drive was still moving your feet \u2014 day 14\'s silent carry is fenced now), then: ' + r.detail };
  }
  return r;
}
async function execCmdInner(bot, raw) {
  const cmd = String(raw || '').trim();
  const parts = cmd.split(/\s+/);
  const verb = (parts[0] || '').toLowerCase();
  const num = (i) => parseFloat(parts[i]);
  try {
    if (verb === 'goto' && parts.length >= 4) {
      const tx = Math.floor(num(1)), ty = Math.floor(num(2)), tz = Math.floor(num(3));
      // DAY-16 BELOW-GRADE GUARD (charter sec.1; span above): a
      // goto >= 2 below pad feet, inside the home district, with
      // no pickaxe in hand, is refused before the walker moves —
      // day 15's bowl entry was exactly this walk.
      const bggG = belowGradeGuard(bot, 'goto', tx, ty, tz);
      if (bggG.refuse && bggG.mode === 'relative') return { ok: false, detail: 'the crew stepped in: that goto aims BELOW your own feet while you stand below the pad with no pickaxe in hand - stepping DOWN is how the bowl deepened on day 15, and it stays shut. Every step UP is open to you: the rungs and cuts above your head are yours to take. Wood first, once you are out: a tree by its foot, planks, sticks, a pickaxe in hand.' };
      if (bggG.refuse) return { ok: false, detail: 'the crew stepped in: that goto aims ' + (BGG_PAD_FEET - ty) + ' levels BELOW your home pad (the pad stands at feet ' + BGG_PAD_FEET + ') while you hold no pickaxe - that is the walk that ate day 15: down out of the bowl was easy, and every face back up was +2 or +3 against your one-step climb, bare-handed, for over an hour. The deep ground stays shut until the wooden pickaxe is IN YOUR HAND. Work the wood chain first: out of the bowl UP to the pad, fell a named tree by its FOOT, planks, sticks, pickaxe - then dig where you like.' };
      // DAY-10 PIT-HAZARD GUARD (driver code): the pit columns
      // (65..66, z -93..-91) are a known drowning trap (death #121).
      // A goto INTO them is refused and re-aimed at the pad's west
      // edge; the model is told why, in its own result line.
      if (tx >= 65 && tx <= 66 && tz >= -93 && tz <= -91) {
        const cur = bot.entity.position;
        log('PIT GUARD: goto into the pit (' + tx + ',' + tz + ') refused; re-aiming at (62,67,-92)');
        trace({ kind: 'pit-guard', from: { x: +cur.x.toFixed(1), z: +cur.z.toFixed(1) }, refused: { x: tx, z: tz }, reaim: { x: 62, z: -92 } });
        const rr = await prims.gotoNear(bot, 62, 67, -92, 1.6, 30000);
        const chk2 = arrivalCheck(bot, 62, 67, -92, 1.6);
        return { ok: chk2.arrived, detail: 'the crew stepped in: that goto aimed INTO your pit (65..66, -92) — the drowning trap from day 9 — so it was re-aimed at the pad’s west edge (62,67,-92) instead. ' + (chk2.arrived ? 'You stand at the pad edge now. Walk AROUND the pit (south along z -89..-88), never through it.' : 'You actually stand at (' + chk2.pos.x + ',' + chk2.pos.y + ',' + chk2.pos.z + '). Walk AROUND the pit (south along z -89..-88), never through it.') };
      }
      const r = await prims.gotoNear(bot, tx, ty, tz, 1.6, 30000);
      // Day-5 arrival honesty: verify against his MEASURED position,
      // never the walker's word.
      const chk = arrivalCheck(bot, tx, ty, tz, 1.6);
      if (chk.arrived) return { ok: true, detail: `arrived — you stand at (${chk.pos.x},${chk.pos.y},${chk.pos.z}), ${chk.dist} blocks from (${tx},${ty},${tz}) (verified from your position)` };
      return { ok: false, detail: `NOT arrived at (${tx},${ty},${tz}) — you actually stand at (${chk.pos.x},${chk.pos.y},${chk.pos.z}), still ${chk.dist} blocks short${chk.dy > 2 ? ` and ${chk.dy} blocks above the target's level` : chk.dy < -2 ? ` and ${-chk.dy} blocks below the target's level` : ''}${r.ok ? ' (the walker claimed success — trust your feet, not its word)' : `; the walker gave up (${r.error || 'no path / stalled'})`}. On broken ground, hop in short legs of 2-3 blocks, or climb.` };
    }
    if (verb === 'gotoentity' && parts[1]) {
      let best = null;
      for (const e of Object.values(bot.entities || {})) {
        if (e && e.position && e.name === parts[1]) { const d = e.position.distanceTo(bot.entity.position); if (!best || d < best.d) best = { e, d }; }
      }
      if (!best) return { ok: false, detail: `no ${parts[1]} in range` };
      const r = await prims.gotoNear(bot, best.e.position.x, best.e.position.y, best.e.position.z, 1.4, 20000);
      return { ok: r.ok, detail: r.ok ? `walked to the ${parts[1]}` : `could not reach the ${parts[1]}` };
    }
    if (verb === 'climb' && parts.length >= 3) {
      const inv = prims.inv(bot);
      const mat = ['oak_planks', 'birch_planks', 'spruce_planks', 'cobblestone', 'dirt', 'oak_log', 'birch_log'].find((n) => inv[n] > 0);
      if (!mat) return { ok: false, detail: 'no blocks in inventory to pillar with' };
      const tx = num(1), tz = num(2);
      const g = await prims.gotoNear(bot, tx + 0.5, bot.entity.position.y, tz + 0.5, 1.1, 15000);
      if (!g.ok) return { ok: false, detail: 'could not get onto that column to climb' };
      const feet = bot.entity.position;
      const below = new Vec3(Math.floor(feet.x), Math.floor(feet.y) - 1, Math.floor(feet.z));
      const item = bot.inventory.items().find((i) => i.name === mat);
      await bot.equip(item, 'hand');
      const yBefore = feet.y;
      try { bot.setControlState('jump', true); await prims.sleep(420); } catch {}
      let placed = false;
      try { await bot.placeBlock(bot.blockAt(below), new Vec3(0, -1, 0)); placed = true; } catch (e) { /* fall through to result check */ }
      try { bot.setControlState('jump', false); } catch {}
      await prims.sleep(700);
      const gained = bot.entity.position.y - yBefore;
      return { ok: gained > 0.5, detail: placed || gained > 0.5 ? `pillared up with ${mat}; feet now y=${bot.entity.position.y.toFixed(1)}` : 'pillar failed (nothing placed under you)' };
    }
    if (verb === 'dig' && parts.length >= 4) {
      const pos = new Vec3(Math.floor(num(1)), Math.floor(num(2)), Math.floor(num(3)));
      const blk = bot.blockAt(pos);
      // DAY-16 BELOW-GRADE GUARD (charter sec.1; span above): a dig
      // whose target top is >= 2 below the pad top, inside the home
      // district, with no pickaxe in hand, is refused before the
      // dig-guard is even consulted — it cannot arm on a descent
      // the body should never make tool-less.
      const bggD = belowGradeGuard(bot, 'dig', pos.x, pos.y, pos.z);
      if (bggD.refuse && bggD.mode === 'relative') return { ok: false, detail: 'the crew stepped in: that dig is at or below the floor your own feet stand on, while you are below the pad with no pickaxe - day 15 your digging lowered the bowl floor from 63 to 61 under you, one legal dig at a time. The floor you stand on is not dug. Dig ABOVE your stance: the notch, the rung, the wall at your head - those are the way out.' };
      if (bggD.refuse) return { ok: false, detail: 'the crew stepped in: that dig\'s top is ' + (BGG_PAD_TOP - (pos.y + 1)) + ' levels below your home pad (pad top ' + BGG_PAD_TOP + ') while you hold no pickaxe - below-grade digging tool-less is how day 15\'s bowl floor sank from 63 to 61. Dig at pad level or above until the wooden pickaxe is IN YOUR HAND. Wood first: out of the bowl UP, fell a named tree by its FOOT, planks, sticks, pickaxe.' };
      // DAY-13 DIG-GUARD (see the guard block above execCmd): during
      // the stone phase, a dig below entry-2 is refused before it is
      // executed — trace-rowed, and the model is told why.
      const dg = digGuardDig(bot, pos, blk);
      if (dg.refuse) return { ok: false, detail: dg.detail };
      const r = await prims.digBlock(bot, pos, 25000);
      return { ok: r.ok, detail: r.ok ? `dug ${r.block} at ${pos}` : `dig failed: ${r.error}` };
    }
    if (verb === 'felltree' && parts.length >= 4) {
      const pos = new Vec3(Math.floor(num(1)), Math.floor(num(2)), Math.floor(num(3)));
      const r = await prims.digColumn(bot, pos, 10);
      return { ok: r.ok, detail: r.ok ? `felled ${r.dug} logs and gathered drops` : 'no logs dug there' };
    }
    if (verb === 'collect') {
      const r = await prims.collectDrops(bot, 8, 10000);
      return { ok: true, detail: `gathered drops (visited ${r.visited}, saw ${r.seen})` };
    }
    if (verb === 'craft' && parts[1]) {
      const itemName = parts[1];
      const count = parts[2] ? Math.max(1, Math.min(16, parseInt(parts[2], 10) || 1)) : 1;
      let r = await prims.craftByName(bot, itemName, count, null);
      if (!r.ok && climbTable) r = await prims.craftByName(bot, itemName, count, new Vec3(climbTable.x, climbTable.y, climbTable.z));
      if (!r.ok && !climbTable) {
        const tp = prims.findBlocks(bot, ['crafting_table'], 24, 1)[0];
        if (tp) { climbTable = { x: tp.x, y: tp.y, z: tp.z }; r = await prims.craftByName(bot, itemName, count, tp); }
      }
      if (r.ok) return { ok: true, detail: `crafted ${itemName} x${count}` };
      const diag = missingIngredients(bot, itemName, count);
      if (diag.unknown) return { ok: false, detail: `craft failed: "${itemName}" is not an item name this world knows` };
      if (diag.noRecipe) return { ok: false, detail: `craft failed: there is no recipe for ${itemName} — it is found, dug or smelted, not crafted at a bench` };
      if (diag.missing && diag.missing.length) return { ok: false, detail: `craft failed: missing ingredients — ${diag.missing.join('; ')}` };
      if (diag.missing && !diag.missing.length) return { ok: false, detail: `craft failed (${r.error}) though you hold every ingredient — a 3x3 recipe needs your crafting table: stand at the table and craft again` };
      return { ok: false, detail: `craft failed: ${r.error}` };
    }
    if (verb === 'place' && parts.length >= 5) {
      const itemName = parts[1];
      const tx = Math.floor(num(2)), ty = Math.floor(num(3)), tz = Math.floor(num(4));
      const target = new Vec3(tx, ty, tz);
      const existing = bot.blockAt(target);
      if (existing && existing.name !== 'air') return { ok: false, detail: `cell ${target} already holds ${existing.name}` };
      // find a solid neighbour to place against
      const faces = [[0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1], [0, 1, 0]];
      for (const [dx, dy, dz] of faces) {
        const ref = new Vec3(tx + dx, ty + dy, tz + dz);
        const rb = bot.blockAt(ref);
        if (rb && rb.boundingBox === 'block') {
          const r = await prims.placeAgainst(bot, itemName, ref, new Vec3(-dx, -dy, -dz));
          if (r.ok) {
            if (itemName === 'crafting_table') climbTable = { x: tx, y: ty, z: tz };
            return { ok: true, detail: `placed ${itemName} at ${target}` };
          }
        }
      }
      return { ok: false, detail: `nothing solid touches cell ${target} to place against` };
    }
    if (verb === 'equip' && parts[1]) {
      const it = bot.inventory.items().find((i) => i.name === parts[1]);
      if (!it) return { ok: false, detail: `no ${parts[1]} in inventory` };
      await bot.equip(it, 'hand');
      return { ok: true, detail: `holding ${parts[1]}` };
    }
    if (verb === 'eat') {
      const before = bot.food;
      const ate = await floorEat(bot);
      return { ok: ate, detail: ate ? `ate; food ${before} -> ${bot.food}` : 'nothing edible in inventory' };
    }
    if (verb === 'attack' && parts[1]) {
      let best = null;
      for (const e of Object.values(bot.entities || {})) {
        if (e && e.position && e.name === parts[1] && e.isValid) { const d = e.position.distanceTo(bot.entity.position); if (!best || d < best.d) best = { e, d }; }
      }
      if (!best) return { ok: false, detail: `no ${parts[1]} in range` };
      const e = best.e; const tA = Date.now();
      while (Date.now() - tA < 30000 && e.isValid && e.position && bot.health > 0) {
        if (floor.preempt) return { ok: false, detail: 'interrupted — something dangerous got close' };
        const d = e.position.distanceTo(bot.entity.position);
        if (d > 2.1) { await prims.gotoNear(bot, e.position.x, e.position.y, e.position.z, 1.4, 5000); }
        else { try { await bot.lookAt(e.position.offset(0, 0.6, 0), true); } catch {} try { bot.attack(e); } catch {} await prims.sleep(550); }
      }
      const dead = !e.isValid;
      if (dead) await prims.collectDrops(bot, 6, 5000).catch(() => {});
      return { ok: dead, detail: dead ? `the ${parts[1]} is down; drops gathered` : `the ${parts[1]} escaped or the fight timed out` };
    }
    if (verb === 'look' && parts.length >= 4) {
      await bot.lookAt(new Vec3(num(1), num(2), num(3)), true).catch(() => {});
      return { ok: true, detail: 'looked' };
    }
    if (verb === 'wait') {
      const n = Math.max(1, Math.min(20, parseInt(parts[1] || '5', 10) || 5));
      await prims.sleep(n * 1000);
      return { ok: true, detail: `waited ${n}s` };
    }
    return { ok: false, detail: `unrecognised command "${cmd}" — use exactly one command from the list` };
  } catch (e) {
    return { ok: false, detail: 'command error: ' + e.message };
  }
}

// ── DAY-6 WAKE SEQUENCE (driver code, NOT the model) ─────────────
// Cody wakes in the pit at food 0 / hp 0.33 (day-5 close save).
// The brief charters this exact order, every act filed as an
// OPERATOR/DRIVER act (trace kind 'wake' + the day's log): (1) FEED
// at wake until the server-side readback shows him fed; (2) THE
// EXIT — the spike's proven long leg (LOCOMOTION-SPIKE-20261109:
// hopFlee unchanged, OR one plain gotoNear, aimed at the bench
// point >= 4 blocks past the west wall at bench level; NEVER the
// rim, the pit mouth, or anything within ~3.5 blocks); (3) EAT +
// CONFIRM from his own economy. His agency begins after this.
// DAY-10 NOTE: fmCount is only incremented by the wake sequence's
// own forcedMove listener; day 10's wake has no flee and NO
// relocation, so it stays 0 and the wake rows read it as such
// (honest: no exit weather, no crew move).
let fmCount = 0;
async function wakeSequence(bot) {
  bot.on('forcedMove', () => { fmCount++; });
  const readback = () => {
    const p = bot.entity.position;
    return { pos: { x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) }, hp: +bot.health.toFixed(2), food: bot.food };
  };
  log('WAKE: sequence start', JSON.stringify(readback()));
  trace({ kind: 'wake', step: 'start', ...readback() });
  // (1) FEED AT WAKE — the separate-process op channel (day-7 proven
  // 3/3 + proven on Cody's own body day 7). He starts this morning
  // fed (food 20 per the day-8 close forensics), so this is a TOP-UP
  // VERIFICATION: the wait polls his food from HIS side; if he is
  // already at target the wait ends immediately (the op's top-up
  // give lands regardless and only raises his held count).
  let fedOk = false;
  {
    log('WAKE feed: awaiting EXTERNAL feed via the separate-process op channel (no in-process bot)');
    trace({ kind: 'wake', step: 'await-feed', ...readback() });
    const feedDeadline = Date.now() + 300000;
    for (let round = 1; round <= 40 && !fedOk && Date.now() < feedDeadline; round++) {
      if (bot.food >= WAKE_FOOD_TARGET) { fedOk = true; break; }
      const before = bot.food;
      const invCount = bot.inventory.items().reduce((n, i) => n + (i.name === 'cooked_porkchop' ? i.count : 0), 0);
      const ate = await floorEat(bot);
      log(`WAKE feed round ${round}: food ${before} -> ${bot.food} (floorEat=${ate}, porkHeld=${invCount}) hp=${bot.health.toFixed(2)}`);
      trace({ kind: 'wake', step: 'feed-round', round, foodBefore: before, porkHeld: invCount, ...readback() });
      fedOk = bot.food >= WAKE_FOOD_TARGET;
      if (!fedOk) await prims.sleep(6000);
    }
    log('WAKE feed: external feed wait ended', JSON.stringify(readback()), 'fedOk=' + fedOk);
  }
  trace({ kind: 'wake', step: 'fed', ok: fedOk, ...readback() });
  if (!fedOk) return { ok: false, stage: 'feed', ...readback() };
  // (2) CONFIRM from his own economy: eat up if below target. DAY 10: there is NO step (3) and NO relocation — the day-9 operator move was a one-day declared exception; today he plays from where his save puts him.
  if (bot.food < WAKE_FOOD_TARGET) await floorEat(bot);
  trace({ kind: 'wake', step: 'done', ok: true, fmTotal: fmCount, ...readback() });
  log('WAKE: sequence done', JSON.stringify(readback()), 'fmTotal=' + fmCount);
  return { ok: true, fmTotal: fmCount, ...readback() };
}

// ── narrative beats (the loop keeps a light memory of the scene) ────
const beats = [];
function noteBeat(text) { beats.push(text); if (beats.length > 10) beats.shift(); }

// ── main ─────────────────────────────────────────────────────────────
// DAY-9 ACTION DENSITY: acts = model commands (by verb) + floor acts.
const densityBlock = { start: Date.now(), cmds: {}, floor: {} };
function maybeDensityBlock(bot) {
  if (Date.now() - densityBlock.start < 600000) return;
  const total = Object.values(densityBlock.cmds).reduce((n, v) => n + v, 0) + Object.values(densityBlock.floor).reduce((n, v) => n + v, 0);
  const stall = total === 0;
  log('DENSITY block close: acts=' + total, JSON.stringify(densityBlock.cmds), JSON.stringify(densityBlock.floor), stall ? 'STALL - zero acts in 10 min while the day ran' : '');
  trace({ kind: 'density-block', start: densityBlock.start, total, stall, cmds: { ...densityBlock.cmds }, floor: { ...densityBlock.floor } });
  densityBlock.start = Date.now(); densityBlock.cmds = {}; densityBlock.floor = {};
}
let lastSay = '', lastResult = null;  // state-mirror (cameraman v3 feed): previous cycle narration + result, mirrored into the state file at cycle head
async function main() {
  // DAY 13 — FLOOR GATE: heartbeat runs from boot (the floor renews
  // the lease while it is fresh; the wake sequence below is long, and
  // it is the heartbeat that keeps the lease alive across it).
  gate.init();
  gate.startHeartbeat();
  safety.init({ tracePath: TRACE_PATH }); // DAY 15: the shared safety read judges this run's trace (death limit 3, the standing rule)
  const bot = createBot({
    host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'Cody', version: '26.1',
    plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
  });
  let died = false;
  bot.on('death', () => { died = true; deathsThisRun++; log('DEATH noticed by driver process (run death', deathsThisRun, 'of 3)'); trace({ kind: 'death', n: deathsThisRun }); });
  bot.on('kicked', (r) => log('kicked:', String(r)));
  bot.on('error', (e) => log('bot error:', e && e.message));
  loadPlaces();
  deathsThisRun = countTraceDeaths(TRACE_PATH);
  await new Promise((resolve) => bot.once('spawn', resolve));
  // GATE START CHECK: no live lease from the floor, no day. The
  // floor opened before this launch, self-proved its writer path,
  // verified the feed from the .dat census snapshot, and issued the
  // lease; a refusal here stops the day before the wake (charter).
  {
    // DAY 14: the start check reads through the shared snapshot —
    // a parked/revoked/expired lease refuses as before (reason =
    // the gate's own), and a run whose INHERITED trace count
    // already meets the death limit refuses too: a relaunched
    // driver inherits the day's true count, and a day already at
    // the limit does not restart.
    const s0 = safety.snapshot(deathsThisRun);
    if (s0.stop) {
      const reason0 = s0.trigger === 'park' ? s0.gateReason : 'death-count-at-start';
      log('GATE REFUSE-START:', reason0, '— the floor holds no live lease for this driver, or the inherited death count is already at the limit; stopping the day per charter');
      trace({ kind: 'gate-refuse-start', reason: reason0, via: 'safety-snapshot', deathsRun: s0.deaths });
      try { bot.quit(); } catch {}
      await prims.sleep(1500);
      process.exit(0);
    }
    if (gate.enabled()) log('GATE: live lease confirmed at start');
  }
  const sp = bot.entity.position;
  log(`spawned at ${sp.x.toFixed(1)},${sp.y.toFixed(1)},${sp.z.toFixed(1)} hp=${bot.health} food=${bot.food} worldDeaths=${WORLD_DEATHS_AT_START + deathsThisRun} runDeaths=${deathsThisRun} placesKnown=${places.length} abortWiring=shouldAbort(0)=${shouldAbort(0)}/shouldAbort(3)=${shouldAbort(3)}`);
  trace({ kind: 'spawn', pos: { x: sp.x, y: sp.y, z: sp.z }, hp: bot.health, food: bot.food, deathsWorld: WORLD_DEATHS_AT_START + deathsThisRun, deathsRun: deathsThisRun, route: route.name, model: route.model, places: places.length });
  try { bot.chat('Day sixteen. Cody here — woke in the bowl at home\'s edge, where yesterday ended: fed, whole, empty-handed. Out of the bowl first, up the east step — then wood before stone today: a tree by its foot, planks, sticks, a pickaxe in hand — and then the count, at home, and the furnace built where it stands.'); } catch {}
  startFloor(bot);

  // DAY 6: the chartered wake sequence runs BEFORE the model's
  // first cycle — feed, exit, confirm (all driver acts, trace-rowed
  // under kind 'wake'). If feeding cannot be verified, DO NOT run
  // him at hp 0.33; if both proven exit forms fail on the live
  // body, STOP the day (he cannot starve to death at this
  // difficulty; the hold keeps him safe) — no third mechanism.
  const wake = await wakeSequence(bot);
  if (!wake.ok) {
    log('WAKE SEQUENCE FAILED at stage', wake.stage, '— stopping the day per charter', JSON.stringify(wake));
    trace({ kind: 'abort', reason: 'wake-sequence-' + wake.stage, wake });
    try { bot.chat('Crew is holding the day — I stay put, fed or not, where I stand. — Cody'); } catch {}
    await prims.sleep(1500);
    try { bot.quit(); } catch {}
    await prims.sleep(2500);
    process.exit(0);
  }
  lastEvent = `You wake in the bowl at home's edge — the low stone cell at (61, 62, -91) where yesterday's digging left you — fed and whole: twenty-nine cooked porkchops in your pack, health full, belly full, and your hands EMPTY of tools. Home is not a walk today; home is the rim above you: your table stands at (64, 67, -94), your pen and wheat beside it, all of it five blocks east and five levels up. THE EXIT IS THE DAY'S FIRST ACT. The crew's survey read the bowl's faces: north and west are +5 walls; south is a passage at the floor's own level onto the low stone band (a way along, not a way up); EAST is the way out — the column at (62, -91) carries a step at pad level: get to the bowl's east edge and step UP onto it (top 66, feet 67) and you stand on your own pad. If the step will not take from the floor, make your own rung, the day-13 way: dig ONE dirt block bare-handed from the bowl's rim wall (dirt stands in the (61,-90) and (60,-91) columns at hand height), place it against the east face, and step onto that. Do NOT dig the bowl floor, do NOT notch its walls, do NOT goto below pad level — the crew's NEW below-grade guard refuses those moves while you hold no pickaxe, and it is yesterday's lesson written as a rule, not a wall to argue with. Once you stand at feet 67 on the pad, WOOD RUNS FIRST AND NOTHING ELSE DOES: the oak at (62, -87), three logs on grass at pad level four blocks north of your table — felltree it by its FOOT cell, gather the logs, and at your table: planks, sticks, WOODEN PICKAXE. The chain counts when the pickaxe is IN YOUR PACK — the crew reads it from what you hold, never from the bench's word. Only then does the deep ground open: the hollow east of the table (x 67..74, z -89..-84), stone tops at 63 under a dirt lip — enter from the west, EXIT FIRST: cut your exit notch home at entry level before you dig deep; work the row SIDEWAYS at one level; count from what you actually hold, never from what you dug; the dig-guard refuses any dig more than two below your entry, stays on until you stand at home ground, and re-arms if you fall. THE BANKING RULE, and it outranks curiosity: the moment your read-back says EIGHT cobble held, stop digging and walk straight home to the table and CRAFT THE FURNACE — then set it on the flat pad beside the table, never in the pit columns (65..66, z -93..-91) and never on the rim. The pit is water and drowned you once — around it, never through it, never a workplace. The sky today is the crew's chartered work: they hold the TIME at morning and the WEATHER CLEAR for the window, both named in the day's charter — if rain falls anyway, say so in your line. Eat from the pack as you work; the day is yours from the first step UP.`;

  let cycle = 0;
  let gateParked = false; // day 11: set by any gate rejection; the close reads it
  let safetyStopped = false; // day 14: set when the reflex layer's safety read stopped the day on the death count; the close reads it
  while (Date.now() - t0 < RUN_MS) {
    cycle++;
    // SAFETY (cycle head): the ONE shared read (day14/safety-check
    // .js snapshot — the same function the reflex layer reads at
    // every hop boundary, so the layers cannot disagree silently).
    // A parked, revoked or expired lease stops the day here —
    // before any reflex pre-emption or model command in this
    // cycle; the death count is judged after the entity wait, in
    // the day-13 order, with the day-13 trace kinds preserved.
    // Stop-in-place: the body simply receives nothing.
    const sHead = safety.snapshot(deathsThisRun);
    if (sHead.stop && sHead.trigger === 'park') {
      gateParked = true;
      log('GATE PARK at cycle head:', sHead.gateReason, '— stopping within this cycle; no further commands');
      trace({ kind: 'gate-park', cycle, reason: sHead.gateReason, at: 'cycle-head', via: 'safety-snapshot', deathsRun: sHead.deaths });
      break;
    }
    if (!bot.entity || bot.health <= 0) { await prims.sleep(3000); continue; }
    if (sHead.stop && sHead.trigger === 'death-count') {
      log('ABORT: 3 deaths this run — stopping the driver');
      trace({ kind: 'abort', reason: '3 deaths', deathsRun: sHead.deaths, via: 'safety-snapshot' });
      break;
    }
    if (died) {
      died = false;
      lastEvent = `You DIED and respawned (deaths this run: ${deathsThisRun} of 3 allowed). Your things are where you fell, if they still exist. The scene restarts from wherever you are standing now.`;
      noteBeat('died and respawned');
    }
    // ── floor pre-emption ──
    if (floor.preempt && floor.danger) {
      densityBlock.floor.flee = (densityBlock.floor.flee || 0) + 1;
      const msg = await floorEscape(bot);
      lastEvent = msg;
      noteBeat('floor: ' + msg);
      trace({ kind: 'floor-escape', msg });
      // DAY 14 (H1 repair): if the safety read fired inside the
      // reflex sequence, the day stops HERE — inside the cycle
      // that was running, not at some later cycle head the body
      // might never reach.
      if (reflexAbort) {
        if (reflexAbort.trigger === 'park') gateParked = true; else safetyStopped = true;
        log('REFLEX ABORT — the day stops inside this cycle:', reflexAbort.trigger, 'at', reflexAbort.stage, 'deaths', reflexAbort.deaths);
        break;
      }
      continue;
    }
    // ── floor eat ──
    if (bot.food <= 14 && edibleHeld(bot)) {
      densityBlock.floor.eat = (densityBlock.floor.eat || 0) + 1;
      await floorEat(bot);
      lastEvent = 'Your body ate without asking (the house rule: eat early, eat often — a fed homesteader works). That is the floor, not you — carry on with the scene.';
    }
    // ── emergency forage (code; BACKSTOP, not pilot) ──
    // Day-1 charter: hp <= 4 -> hunt. Day-1 patch (mid-run): gate
    // food<=1 && hp<=12 + 90 s backoff — but the backoff was dead
    // code (no else: the hunt ran anyway) and the gate is TRUE from
    // a food-0 spawn, so on day 2 the floor pre-empted every cycle
    // and chased penned stock across the bowl rim while the driver
    // — who holds the map — never got a second command. Day-2 fix
    // (ledger: direct-drive-day2-forage-fix-20261109): the floor
    // hunts ONLY when the driver has stalled (no command completed
    // in 3 min), prey is CLOSE (<= 12 blocks — a compass hunt across
    // relief is this district's known failure), and the 90 s
    // re-fire backoff actually binds. Between hunts the scene is
    // the driver's, as chartered.
    if (bot.food <= 1 && bot.health <= 12 && !edibleHeld(bot)) {
      const driverStalled = !floor.lastCmdAt || (Date.now() - floor.lastCmdAt > 180000);
      const inBackoff = floor.lastForageAt && (Date.now() - floor.lastForageAt < 90000);
      if (driverStalled && !inBackoff) {
        let prey = null;
        for (const e of Object.values(bot.entities || {})) {
          if (e && e.position && PASSIVES.has(e.name)) { const d = e.position.distanceTo(bot.entity.position); if (d <= 12 && (!prey || d < prey.d)) prey = { e, d }; }
        }
        if (prey) {
          floor.fired.forage++;
          floor.lastForageAt = Date.now();
          log('FLOOR: emergency forage (driver stalled) — hunting', prey.e.name);
          trace({ kind: 'floor-forage', prey: prey.e.name });
          const atk = await execCmd(bot, 'attack ' + prey.e.name);
          floor.lastCmdAt = Date.now();
          lastEvent = 'The floor hunted for you (you had stalled, starving, with prey close): ' + atk.detail + '. Whatever dropped, gather it and eat.';
          continue;
        }
      }
    }
    // ── perceive / decide / act ──
    cycleNo = cycle;
    // DAY-16 WOOD-CHAIN HELD-STATE READ (charter sec.2): the day's
    // work-order gate is a read of HELD ITEMS (prims.inv — the same
    // state the model sees), never a craft receipt. The first cycle
    // a pickaxe is IN HAND is trace-rowed once; the below-grade
    // guard reads this state (and re-reads prims.inv itself).
    {
      const heldNow = prims.inv(bot);
      const hasPick = !!(heldNow.wooden_pickaxe > 0 || heldNow.stone_pickaxe > 0 || heldNow.iron_pickaxe > 0 || heldNow.diamond_pickaxe > 0);
      if (hasPick && !woodChain.pickaxeInHand) {
        woodChain = { pickaxeInHand: true, verifiedCycle: cycle };
        trace({ kind: 'wood-chain-verified', cycle, held: heldNow });
        log('WOOD CHAIN VERIFIED at cycle ' + cycle + ': pickaxe IN HAND per held-state read (not a craft receipt)');
      }
    }
    const s = perceive(bot);
    const structs = perceiveStructures(bot);
    s.structures = structs;
    const trees = perceiveTrees(bot); // day-5 repair (1): foot-level trunks
    s.trees = trees;
    s.structuresText = structuresText(structs);
    const tt = treesText(trees);
    if (tt) s.structuresText = (s.structuresText ? s.structuresText + ' ' : '') + tt;
    notePlaceVisits(bot, structs);
    climbTable = knownTable(bot);
    try { fs.writeFileSync(STATE_PATH, JSON.stringify({ ts: nowIso(), cycle, say: lastSay, result: lastResult, ...s }, null, 1)); } catch {}
    const userMsg = `LAST EVENT: ${lastEvent}\n\n${stateText(s)}${placesText(bot) ? `\n\n${placesText(bot)}` : ''}${beats.length ? `\n\nScene so far (recent beats): ${beats.slice(-4).join(' | ')}` : ''}\n\nYour move — ONE JSON object: {"say": "...", "cmd": "..."}`;
    history.push({ role: 'user', content: userMsg });
    while (history.length > 12) history.shift();
    const r = await askModel([{ role: 'system', content: SYSTEM }, ...history], 700);
    if (!r.ok) {
      log('no model reply (cycle', cycle, ') — waiting 5s');
      trace({ kind: 'model-fail', cycle, error: r.error || 'empty' });
      history.pop();
      await prims.sleep(5000);
      continue;
    }
    let say = '', cmd = '';
    try {
      const m = r.content.match(/\{[\s\S]*\}/);
      const j = JSON.parse(m ? m[0] : r.content);
      say = String(j.say || ''); cmd = String(j.cmd || '');
    } catch (e) {
      log('unparseable model reply:', r.content.slice(0, 200));
      trace({ kind: 'parse-fail', cycle, raw: r.content.slice(0, 400) });
      history.pop();
      await prims.sleep(2000);
      continue;
    }
    history.push({ role: 'assistant', content: r.content });
    // DAY-9 ACTION DENSITY (the screen metric): count every command
    // the model issues and every floor act, per 10-min block. A block
    // with zero acts while the day runs is a STALL, named at close.
    densityBlock.cmds[cmd.trim().split(/\s+/)[0].toLowerCase()] = (densityBlock.cmds[cmd.trim().split(/\s+/)[0].toLowerCase()] || 0) + 1;
    if (say) { try { bot.chat(say.slice(0, 200)); } catch {} }
    log(`cycle ${cycle} [${r.route}] say="${say}" cmd="${cmd}"`);
    // SAFETY (pre-exec): the shared snapshot is re-read against
    // THIS command — a park that landed while the model was
    // thinking still stops it, and so does the third death.
    {
      const sCmd = safety.snapshot(deathsThisRun);
      if (sCmd.stop) {
        if (sCmd.trigger === 'park') {
          gateParked = true;
          log('GATE PARK pre-exec:', sCmd.gateReason, '— command NOT executed:', cmd);
          trace({ kind: 'gate-park', cycle, reason: sCmd.gateReason, at: 'pre-exec', cmd, via: 'safety-snapshot', deathsRun: sCmd.deaths });
        } else {
          log('ABORT pre-exec: 3 deaths this run — command NOT executed:', cmd);
          trace({ kind: 'abort', reason: '3 deaths', deathsRun: sCmd.deaths, at: 'pre-exec', cmd, via: 'safety-snapshot' });
        }
        break;
      }
    }
    const res = await execCmd(bot, cmd);
    lastSay = say; lastResult = res;  // state-mirror: publish for cameraman v3 anticipation/stall grammar
    lastEvent = `Your command "${cmd}" ${res.ok ? 'worked' : 'did not work'}: ${res.detail}.`;
    noteBeat(`${cmd} -> ${res.detail}`.slice(0, 140));
    trace({ kind: 'cycle', cycle, route: r.route, usage: r.usage, say, cmd, result: res, pos: perceive(bot).pos, hp: bot.health, food: bot.food });
    trace({ kind: 'density', cycle, blockStart: densityBlock.start, cmds: { ...densityBlock.cmds }, floor: { ...densityBlock.floor } });
    maybeDensityBlock(bot);
    floor.lastCmdAt = Date.now();
    await prims.sleep(1200);
  }
  // DAY-6 CLOSE (binding; day 5's unmet clause is not repeated):
  // never park him below grade. If the window ends with him in a
  // below-grade cell (feet-y < 66 away from the home bench, or
  // inside the pit footprint), the long-leg exit to the bench
  // point runs as the close act regardless of project state.
  if (gateParked) {
    log('CLOSE: gate-parked — the close-exit movement below is SKIPPED (it is itself a command, and no commands run under a dead lease); he stays where the park left him');
    trace({ kind: 'gate-park-close', cycle });
  }
  if (safetyStopped) {
    log('CLOSE: safety-stopped inside the reflex layer — the close-exit movement below is SKIPPED (the day ended on the stop rule; the body receives no further commands); he stays where the abort left him');
    trace({ kind: 'safety-stop-close', cycle });
  }
  try {
    const p = bot.entity.position;
    const inPit = p.x >= 63.5 && p.x <= 67.5 && p.z >= -94.5 && p.z <= -90.5 && p.y < 65.5;
    if (!gateParked && !safetyStopped && (inPit || p.y < 62.5)) {
      log('CLOSE: below grade at window end — running the long-leg exit to the bench as the close act');
      trace({ kind: 'close-exit', from: { x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) } });
      try { await hopFlee(bot, { target: BENCH_POINT, isClear: () => false, maxMs: 110000, log: (m) => log('CLOSE hop:', m), safetyCheck: (nextHop) => reflexSafety('close-hop-' + nextHop) }); } catch (e) { log('CLOSE exit error', e.message); } // DAY-9 CALLER FIX (day-8 inc. 3); DAY 14: the close exit reads the same safety snapshot at its hop boundaries
      const p2 = bot.entity.position;
      trace({ kind: 'close-exit-done', pos: { x: +p2.x.toFixed(1), y: +p2.y.toFixed(1), z: +p2.z.toFixed(1) }, hp: +bot.health.toFixed(2), food: bot.food });
    }
  } catch (e) { log('CLOSE exit check error', e.message); }
  trace({ kind: 'density', cycle, blockStart: densityBlock.start, cmds: { ...densityBlock.cmds }, floor: { ...densityBlock.floor }, final: true });
  log('run window over — disconnecting cleanly');
  trace({ kind: 'end', deathsRun: deathsThisRun, deathsWorld: WORLD_DEATHS_AT_START + deathsThisRun, floor: floor.fired });
  try { bot.chat('Crew is calling time on this take. Saving where I stand — Cody.'); } catch {}
  await prims.sleep(1500);
  try { bot.quit(); } catch {}
  await prims.sleep(2500);
  process.exit(0);
}
main().catch((e) => { console.error('[DD] fatal:', e); process.exit(1); });
