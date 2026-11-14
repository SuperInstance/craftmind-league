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
 * Trace: every cycle appended to pulse/direct-drive-trace.jsonl
 * (state, model reply verbatim, command, result) and echoed to the
 * process log. Running log: pulse/DIRECT-DRIVE-20261108.md (lane).
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

process.chdir('/home/caseydigennaro/craftmind-league/bots/runs/cody');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const prims = require(path.join(PULSE, 'lib', 'prims.js'));
const { Vec3 } = prims;
const { hopFlee } = require(path.join(PULSE, 'lib', 'hopflee.js'));
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
const gate = require('/home/caseydigennaro/craftmind-league/pulse/day11/gate-client.js');

const HOME = { x: 64, y: 67, z: -93 };
const TABLE_POS = new Vec3(63, 67, -94);
const RUN_MS = parseInt(process.env.DD_RUN_MS || String(85 * 60000), 10);
const WORLD_DEATHS_AT_START = 123; // server truth at day-4 open (116 + day 3's four)
const TRACE_PATH = path.join(PULSE, 'direct-drive-trace-day12-20261110.jsonl'); // day 12: own trace — the floor contract's sensor reads this path
const STATE_PATH = path.join(PULSE, 'direct-drive-state.json'); // shared: cameraman v3 reads this path

// Day 4: the ddbridge relay path is RESTORED (ledger
// direct-drive-day4-relay-restored-20261109) — PRIMARY is DeepInfra
// (the day-1/2 arrangement); the governor route is the fallback.
const PRIMARY = { url: 'http://127.0.0.1:8912/chat/completions', model: 'deepseek-ai/DeepSeek-V4.1-Flash-1017', key: null, name: 'deepinfra:deepseek-v4.1-flash' };
const FALLBACK = { url: 'http://127.0.0.1:8642/v1/chat/completions', model: 'confluence-presence-brain', key: 'league-cody-driver', name: 'governor:qwen3-coder-30b' };
const PLACES_PATH = '/home/caseydigennaro/craftmind-league/pulse/day12/direct-drive-places-day12.json'; // day 12: own places file (the day-11 store carried forward at charter time)
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

THE SCENE SO FAR: Day 1 you starved in the dip and never ate. Day 2 you found the pen, ate a pig at its fence line, spared the breeding pairs, and resolved to cook like a person instead of eating raw like an animal. Day 3 your memory came back whole: you ate properly — food up to 18 — commuting between pen, patch and table like you lived there, because you do; then, hunting stone for the furnace, the dip pocket held you and its spiders and the bow skeleton killed you four times. Day 4 you woke where the dead wake, fed and empty-handed, and walked home from memory alone — not one death all day, though the floor pulled you out of ten scares; you harvested your wheat, but never got a single log, because your eyes showed you crowns. Day 5 your eyes were fixed — and your feet failed instead: you woke in your own stone pit at home, and in a full day you never moved one whole block; the food clock ran out under you and you ended the day in the pit at food 0, half a heart, alive only because starvation at this difficulty floors out. Days 6, 7 and 8 were the crew's, walking every door out of that pit — every one measured fake (the long run died at the wall face, built stairs climbed exactly one rung, dug stairs were never entered, a pillar's first block would not place). Day 9 the crew's hands set you down on the pad at (60, 67, -93), fed, in daylight — and the surface era began in earnest: in your first seven minutes you felled your FIRST TREE by its foot (3 oak logs), crafted sticks, and fought your table — which kept demanding cherry planks you have never held, because another crew's building traffic on the shared name had eaten your oak and poisoned the bench's sense of your stores. That part was the crew's fault, not yours, and it is fixed: today the world is yours alone and no other hands touch it. Walking home across the district you dropped into your own pit — it is a drowning trap now, with water in it — and died there mid-dig, carving your own step out. Then the crew's camera work let the world's night fall with you standing at world spawn, and a zombie took you twice in nine seconds before the day was called at three deaths. All three deaths were the house's failures (interference, a route home over an open pit, an unheld night), and the house has changed its rules because of them: the daylight hold is never dropped over a live citizen again, one crew works the world at a time, and your pit is a named hazard to walk AROUND, never through. The crew re-fed you where you lay — 32 cooked porkchops — and you slept at world spawn. Day 10 is yours, from world spawn, from the first step: walk home the long way round (south of the pit, never over it), and take up the furnace where day 9 dropped it.

YOUR STONE PIT, IN YOUR OWN KNOWLEDGE (corrected across days 5-9, hard-won, and now CLOSED — AND A DROWNING TRAP): the pit at home (columns 65..66, z -92) has NO door you can walk — not the stair, not short steps (they read zero), not the long run west (the pad stands four blocks above its floor), not a stair you build (one rung, never two), not a stair you dig (never entered). Worse: there is WATER in it now, and on day 9 you DROWNED in it mid-dig, carving your own step out. THE PIT IS A HAZARD, NOT A WORKPLACE: walk AROUND it — pass SOUTH of it (along z -89..-88, on the open shoulder) or well north — never across its columns, never along its rim. Your home anchor, your table and your pad all stand WEST of it and are reached without touching it. If you ever wake or fall into it or any below-grade cell, say so in your line and the crew's hands will set you on the surface, as they did on day 9. Stone for the furnace lives on the SURFACE: dig where you stand on stony or broken ground — the stone bluff east past the dip, the bowl's stony edges, the shoulder at home where the dirt gives out.

THE POCKET, IN YOUR OWN KNOWLEDGE: the low cell at about (75, 64, -98) is the place that held you and killed you on day 3. Below-grade cells and broken ground eat short steps and report false arrivals. What crosses them is a LONG leg aimed well past the far side, or a hop-chain flee when something is chasing you. A homesteader may simply refuse a place: the pocket still holds the crafting table you set down there. It can keep it. Stone exists elsewhere — your own pit, for one, whose door you now know.

STANDING THREADS (in rough order, but the scene outranks the list — if the world offers something better, take it):
1. THE FIRST LOG. Take a tree by its FOOT: your eyes name the trunk's foot-level cell with dig coordinates when a real trunk is in sight. Know this about your home ground: the canopy over the pad is crowns WITHOUT trunks — there is no tree to fell at home, and digging up at it is the old trap. Real standing timber you know: east past the dip, a birch at (80,66,-96) and an oak at (86,67,-94); west, an oak at (58,67,-105). The east birch is the closer walk on open ground. (Today you start at WORLD SPAWN, west of home — there is a real oak trunk right by spawn at about (35,70,-91), eight blocks east of where the dead wake; day 9 your eyes named it. Home itself is EAST of spawn.) Fell it, gather the logs. This log is the keystone — everything you have wanted for four days hangs off it.
2. RE-EQUIP. The chain you know by heart, as routine: planks, sticks, a crafting table if you want one near the work (your day-1 table stands at the anchor, (64, 67, -94)), a wooden pickaxe. You have done every step before.
3. THE FURNACE — nine days now you have wanted it ("I've been eating raw like an animal"). Eight cobblestone, at a table. The stone is NOT in your pit any more (the pit is closed to you — see above): dig it at the SURFACE where you stand on stony or broken ground — the stone bluff east past the dip, the bowl's stony edges — or dig down one or two blocks into the shoulder at home where the dirt gives out. If a craft fails, the result tells you what you are short — fetch exactly that. Set the furnace at home by your table, and cook something in it when you can: cooked meat feeds twice what raw does.
4. THE HOMESTEAD, as the day allows: the flat pad at home (62..64, -95..-91, top y66 — the pit columns 65..66 at z -92 are NOT pad any more; they are the hazard, walked around, never built on or crossed), then the hut on the pad: plank walls two high with a door gap at (62, -93); a torch; a chest at (65, 67, -94) with your surplus in it.
5. THE PEN, kept whole: whatever stock is in it is your winter — look before you count on it; pigs have never stayed penned and wander the bench loose. Use the gates. The pairs are your winter. You start fed today — keep it that way: eat from the wheat (bread needs 3 wheat at a table) or hunt a loose pig when you need to — do not starve at a workbench.

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
If a command fails, its result tells you why. Believe the results over your assumptions.`;

const history = [];
let lastEvent = process.env.DD_OPENING_EVENT || 'You have just woken in the stone hollow where your hunt ended yesterday, fed and whole, one cobble in hand and the furnace still wanting seven more. This is the first beat of the scene.';
let sceneNote = '';

// ── survival floor (code; the LLM cannot talk its way out) ─────────
const floor = { danger: null, busy: false, fired: { flee: 0, shelter: 0, eat: 0, forage: 0 } };
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
  }).catch((e) => ({ ok: false, why: e.message }));
  const cleared = !!fr.ok;
  log('FLOOR: hop-flee done', JSON.stringify(fr));
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

// ── command execution ────────────────────────────────────────────────
let climbTable = null; // placed crafting table pos once known {x,y,z}
async function execCmd(bot, raw) {
  const cmd = String(raw || '').trim();
  const parts = cmd.split(/\s+/);
  const verb = (parts[0] || '').toLowerCase();
  const num = (i) => parseFloat(parts[i]);
  try {
    if (verb === 'goto' && parts.length >= 4) {
      const tx = Math.floor(num(1)), ty = Math.floor(num(2)), tz = Math.floor(num(3));
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
  // DAY 12 — FLOOR GATE: heartbeat runs from boot (the floor renews
  // the lease while it is fresh; the wake sequence below is long, and
  // it is the heartbeat that keeps the lease alive across it).
  gate.init();
  gate.startHeartbeat();
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
    const g0 = gate.check('__driver_start__');
    if (!g0.ok) {
      log('GATE REFUSE-START:', g0.reason, '— the floor holds no live lease for this driver; stopping the day per charter');
      trace({ kind: 'gate-refuse-start', reason: g0.reason });
      try { bot.quit(); } catch {}
      await prims.sleep(1500);
      process.exit(0);
    }
    if (gate.enabled()) log('GATE: live lease confirmed at start');
  }
  const sp = bot.entity.position;
  log(`spawned at ${sp.x.toFixed(1)},${sp.y.toFixed(1)},${sp.z.toFixed(1)} hp=${bot.health} food=${bot.food} worldDeaths=${WORLD_DEATHS_AT_START + deathsThisRun} runDeaths=${deathsThisRun} placesKnown=${places.length} abortWiring=shouldAbort(0)=${shouldAbort(0)}/shouldAbort(3)=${shouldAbort(3)}`);
  trace({ kind: 'spawn', pos: { x: sp.x, y: sp.y, z: sp.z }, hp: bot.health, food: bot.food, deathsWorld: WORLD_DEATHS_AT_START + deathsThisRun, deathsRun: deathsThisRun, route: route.name, model: route.model, places: places.length });
  try { bot.chat('Day twelve. Cody here — woke in my own dip at home, one cobble in hand and the furnace still wanting seven. Table first, then east to the hollow for stone — feet in the seam this time, counted honest — and the furnace at last.'); } catch {}
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
  lastEvent = `You wake in the dip beside your own pit at home, one cobble in hand and the furnace still wanting seven more. Your stone ground is the hollow east along the south shoulder — your table, your pen and your wheat as you left them. The crew's checks agree you are fed and whole where you stand — food full, thirty porkchops in your pack, six wooden pickaxes, fifteen oak logs and ten birch — and nobody has moved you and nobody will: the climb out of your dip and the road east are yours, and the pit beside you drowned you once and is a hazard, never a workplace. Your list is your own and the furnace is still first on it: the table first — it stands four blocks west of your dip — planks topped up there; then east along the south shoulder to the hollow, and stone worked at one level with your feet standing in the seam, advanced cell by cell over your own drops, and counted from what you actually hold — never from what you dug. The day is yours from the first step.`;

  let cycle = 0;
  let gateParked = false; // day 11: set by any gate rejection; the close reads it
  while (Date.now() - t0 < RUN_MS) {
    cycle++;
    // GATE (cycle head): a parked, revoked or expired lease stops the
    // day here — before any reflex pre-emption or model command in
    // this cycle. Stop-in-place: the body simply receives nothing.
    {
      const gHead = gate.check('cycle-head');
      if (!gHead.ok) {
        gateParked = true;
        log('GATE PARK at cycle head:', gHead.reason, '— stopping within this cycle; no further commands');
        trace({ kind: 'gate-park', cycle, reason: gHead.reason, at: 'cycle-head' });
        break;
      }
    }
    if (!bot.entity || bot.health <= 0) { await prims.sleep(3000); continue; }
    if (shouldAbort(deathsThisRun)) {
      log('ABORT: 3 deaths this run — stopping the driver');
      trace({ kind: 'abort', reason: '3 deaths', deathsRun: deathsThisRun });
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
    // GATE (pre-exec): the lease is re-checked against THIS command —
    // a park that landed while the model was thinking still stops it.
    {
      const gCmd = gate.check(cmd);
      if (!gCmd.ok) {
        gateParked = true;
        log('GATE PARK pre-exec:', gCmd.reason, '— command NOT executed:', cmd);
        trace({ kind: 'gate-park', cycle, reason: gCmd.reason, at: 'pre-exec', cmd });
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
  try {
    const p = bot.entity.position;
    const inPit = p.x >= 63.5 && p.x <= 67.5 && p.z >= -94.5 && p.z <= -90.5 && p.y < 65.5;
    if (!gateParked && (inPit || p.y < 62.5)) {
      log('CLOSE: below grade at window end — running the long-leg exit to the bench as the close act');
      trace({ kind: 'close-exit', from: { x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) } });
      try { await hopFlee(bot, { target: BENCH_POINT, isClear: () => false, maxMs: 110000, log: (m) => log('CLOSE hop:', m) }); } catch (e) { log('CLOSE exit error', e.message); } // DAY-9 CALLER FIX (day-8 inc. 3)
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
