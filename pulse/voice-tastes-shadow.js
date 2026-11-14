'use strict';
/**
 * voice-tastes-shadow.js — OFFLINE shadow harness for the
 * Voice+Tastes layer (2026-11-08). NO bot, NO world: it wires the
 * real actor-client to a fake hooks object (sayDirect is captured,
 * never sent) and drives scripted states through the LIVE actor
 * endpoint via the governor (identity league-cody-actor — this is
 * test traffic on Cody's own actor budget, a handful of calls).
 *
 * Sequence: taste-hook unit checks, then beats from Cody's real
 * recorded state — (1) DECLARE a leg out of the dip, (2) REACT to a
 * wedge failure there, (3) a second react inside the spacing window
 * (must be REFUSED by the cap), wait out the cap, (4) REACT evening
 * at the pad, (5) a plain TICK beat, (6) stats — actor.lastLine must
 * be non-null (the defect this layer fixes).
 */
process.env.CODY_ACTOR = '1';
const path = require('path');
const tastes = require(path.join(__dirname, 'tastes.js'));
const actor = require(path.join(__dirname, 'actor-client.js'));

const out = { tasteChecks: [], beats: [], stats: null };
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  out.tasteChecks.push({ name, got, want, ok });
}

// ── taste hooks, unit-exercised ────────────────────────────────────
check('rankLogNames oak-first',
  tastes.rankLogNames(['birch_log', 'spruce_log', 'oak_log'])[0], 'oak_log');
check('placeNameFor Cody stopped pos (71.685,63,-102.313)',
  (tastes.placeNameFor({ x: 71.685, y: 63, z: -102.313 }) || {}).name, 'the dip');
check('placeNameFor homestead anchor (64,67,-93)',
  (tastes.placeNameFor({ x: 64, y: 67, z: -93 }) || {}).name, 'the shoulder');
check('placeNameFor apple oak (66,67,-97)',
  (tastes.placeNameFor({ x: 66, y: 67, z: -97 }) || {}).name, 'the apple oak');
check('preferredPlank picks oak at low count',
  tastes.preferredPlank({ birch_planks: 9, oak_planks: 2 }, 1), 'oak_planks');
check('preferredPlank falls back to birch when no oak',
  tastes.preferredPlank({ birch_planks: 9 }, 1), 'birch_planks');

// ── actor beats against scripted states ────────────────────────────
const spoken = [];
const HIS_INVENTORY = { oak_planks: 18, birch_log: 10, stick: 2, lead: 2, bone: 1, crafting_table: 1, birch_sapling: 1, dirt: 1 };
let ctx = {
  intent: 'Heading to the homestead', project: 'relocate', step: 'travel',
  place: 'the dip', tod: 2000,
  pos: { x: 71.7, y: 63, z: -102.3 }, health: 1.3333, food: 9,
  inventory: HIS_INVENTORY,
  openProjects: [{ id: 'hut' }, { id: 'chest' }, { id: 'pen' }],
  milestones: ['relocate', 'pickaxe', 'pad'],
};
const fakeBot = { entity: { position: { x: 71.7, y: 63, z: -102.3 } }, health: 1.3333, food: 9 };
actor._test.setup({
  sayDirect: (line) => { spoken.push(line); },
  lastChatAt: () => 0,
  context: () => ctx,
  ledger: () => {},
}, fakeBot);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function beat(label, fn) {
  const before = spoken.length;
  const t0 = Date.now();
  const r = await fn();
  out.beats.push({ label, returned: r, ms: Date.now() - t0, lines: spoken.slice(before) });
}

(async () => {
  await beat('DECLARE leg west-approach out of the dip', () =>
    actor.declareBeat('leg:route2', 'try the west approach out of the dip toward the homestead', {}));
  await beat('REACT wedge at the dip west wall', () =>
    actor.reactBeat('wedge', 'your last three hops toward the homestead closed no distance at all — the ground at the west wall of the dip will not take you', {}));
  await beat('REACT evening immediately (cap must REFUSE)', () =>
    actor.reactBeat('evening', 'the day is ending at home', {}));
  console.log('[shadow] waiting out the react spacing cap (46 s)…');
  await sleep(46000);
  ctx = Object.assign({}, ctx, {
    intent: 'Evening putter', project: 'homestead', step: 'putter',
    place: 'the shoulder', tod: 11200,
    pos: { x: 64, y: 67, z: -93 }, health: 20, food: 17,
  });
  fakeBot.entity.position = { x: 64, y: 67, z: -93 };
  await beat('REACT evening at the pad', () =>
    actor.reactBeat('evening', "the day is ending at home. That's the pad done. A starter hut tomorrow.", { template: "That's the pad done. A starter hut tomorrow." }));
  await beat('TICK narration', () => actor._test.runBeat('tick', { reason: 'arm' }));
  out.stats = actor.stats();
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error('shadow harness error:', e); process.exit(1); });
