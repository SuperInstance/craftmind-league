'use strict';
/**
 * test-walker-fence-day15.js — DAY-15 FIXTURE for the WALKER FENCE
 * (charter §2; day-14 incident I4). Offline; no server, no world.
 * Extracts the WALKER-FENCE span from the REAL day-15 driver source
 * and exercises walkerFence with a stubbed bot whose pathfinder
 * goal / control states are scripted, so the code under test is
 * the code that ships — not a copy. Wiring assertions pin the
 * integration: the fence is consulted at the head of execCmd for
 * every non-walk verb, its note reaches the result line, and it
 * never uses pathfinder.stop() (which poisons the next goto).
 *
 * The fixture scene (day-14 I4, abstracted): a goto leaves a LIVE
 * pathfinder goal (and, in the second scene, held drive states);
 * the next command is a CRAFT. Before the fence: the craft would
 * execute under a live walker — the silent 26-block carry. After:
 * the walker is dead before the craft runs, the stop is trace-
 * rowed and named in the craft's result line, and a following
 * goto starts from a clean slate (pre-clear semantics).
 */
const fs = require('fs');
const path = require('path');
const SRC = fs.readFileSync(path.join(__dirname, 'direct-drive-day17.js'), 'utf8');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra ? ' — ' + extra : '')); }
}

const b = SRC.indexOf('// WALKER-FENCE-BEGIN');
const e = SRC.indexOf('// WALKER-FENCE-END');
check('fence span present in driver source', b >= 0 && e > b);
const span = SRC.slice(b, e);

function freshFence() {
  const rows = [];
  const factory = new Function('trace', 'log',
    span + '\nreturn { walkerFence, WALK_VERBS };');
  const F = factory((r) => rows.push(r), () => {});
  return { F, rows };
}
function stubBot({ goal = null, drive = {} } = {}) {
  const calls = [];
  return {
    entity: { position: { x: 50.4, y: 68.0, z: -109.9 } },
    pathfinder: {
      goal,
      setGoal(g) { calls.push(['setGoal', g]); this.goal = g; },
      stop() { calls.push(['STOP-CALLED']); },
    },
    controlState: { forward: false, back: false, left: false, right: false, jump: false, sprint: false, sneak: false, ...drive },
    clearControlStates() { calls.push(['clearControlStates']); for (const k of Object.keys(this.controlState)) this.controlState[k] = false; },
    _calls: calls,
  };
}

// ── scene 1: a live pathfinder goal, then a craft ────────────────
{
  const { F, rows } = freshFence();
  const bot = stubBot({ goal: { x: 84, y: 66, z: -92 } });
  const r = F.walkerFence(bot, 'craft', 'craft stick 4');
  check('S1: fence fires on a craft under a live goal', r.fenced === true && r.hadGoal === true);
  check('S1: goal cleared via setGoal(null)', bot.pathfinder.goal === null && bot._calls.some((c) => c[0] === 'setGoal' && c[1] === null));
  check('S1: pathfinder.stop() NEVER called', !bot._calls.some((c) => c[0] === 'STOP-CALLED'));
  check('S1: stop trace-rowed (kind walker-fence, verb + position)', rows.some((t) => t.kind === 'walker-fence' && t.verb === 'craft' && t.hadGoal === true && t.at.x === 50.4 && t.at.z === -109.9));
}

// ── scene 2: held drive states (manual helm), then a dig ─────────
{
  const { F, rows } = freshFence();
  const bot = stubBot({ goal: null, drive: { forward: true, jump: true } });
  const r = F.walkerFence(bot, 'dig', 'dig 70 63 -88');
  check('S2: fence fires on a dig under held drive states', r.fenced === true && r.hadDrive === true);
  check('S2: control states cleared', bot.controlState.forward === false && bot.controlState.jump === false && bot._calls.some((c) => c[0] === 'clearControlStates'));
  check('S2: stop trace-rowed with hadDrive', rows.some((t) => t.kind === 'walker-fence' && t.hadDrive === true));
}

// ── scene 3: walk verbs are NOT fenced ────────────────────────────
{
  const { F, rows } = freshFence();
  const bot = stubBot({ goal: { x: 1, y: 2, z: 3 }, drive: { forward: true } });
  check('S3: goto is not fenced (it replaces the goal itself)', F.walkerFence(bot, 'goto', 'goto 64 67 -94').fenced === false);
  check('S3: gotoentity is not fenced', F.walkerFence(bot, 'gotoentity', 'gotoentity pig').fenced === false);
  check('S3: no goal was touched by the walk verbs', bot.pathfinder.goal !== null && rows.length === 0);
}

// ── scene 4: a quiet walker fences nothing ────────────────────────
{
  const { F, rows } = freshFence();
  const bot = stubBot({});
  const r = F.walkerFence(bot, 'craft', 'craft oak_planks 5');
  check('S4: no live goal + no drive -> no fence, no row, no calls', r.fenced === false && rows.length === 0 && bot._calls.length === 0);
}

// ── scene 5: every stationary verb in the command list is fenced ──
{
  const { F } = freshFence();
  const stationary = ['craft', 'dig', 'felltree', 'place', 'climb', 'collect', 'equip', 'eat', 'attack', 'look', 'wait'];
  check('S5: all 11 stationary verbs fence a live goal', stationary.every((v) => F.walkerFence(stubBot({ goal: { x: 0 } }), v, v).fenced === true), stationary.join(','));
  check('S5: WALK_VERBS is exactly goto + gotoentity', F.WALK_VERBS.length === 2 && F.WALK_VERBS.includes('goto') && F.WALK_VERBS.includes('gotoentity'));
}

// ── wiring: the fence is integrated in execCmd, before execution ──
{
  const execHead = SRC.indexOf('async function execCmd(bot, raw) {');
  const fenceCall = SRC.indexOf('walkerFence(bot, verb0, cmd0)', execHead);
  const innerCall = SRC.indexOf('execCmdInner(bot, raw)', execHead);
  const innerHead = SRC.indexOf('async function execCmdInner(bot, raw) {', execHead);
  const firstVerb = SRC.indexOf("if (verb === 'goto'", innerHead);
  check('W: execCmd wrapper consults walkerFence before the command body runs', execHead >= 0 && fenceCall > execHead && innerCall > fenceCall && innerHead > innerCall);
  check('W: the command body is execCmdInner and its verb branches come after the fence', firstVerb > innerHead);
  check('W: result line names the stop truthfully', SRC.includes("the house stopped your walker first"));
  check('W: fence span never calls pathfinder.stop()', !/^\s*[^/].*\.stop\(/m.test(span));
}

console.log(`\nWALKER-FENCE-DAY16 FIXTURE: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
