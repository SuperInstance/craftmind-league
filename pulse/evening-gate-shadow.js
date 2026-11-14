'use strict';
/**
 * evening-gate-shadow.js — OFFLINE verification for the evening-gate
 * fix (2026-11-08; claim cody-evening-gate-claim-20261108; ACTIONS
 * item 21). NO bot, NO world: wires the real actor-client to fake
 * hooks (sayDirect captured, never sent) and drives scripted states
 * through the live actor endpoint via the governor (identity
 * league-cody-actor — test traffic inside Cody's own actor budget).
 *
 *   N=6 evening samples on the exact state that produced this
 *     morning's overclaims (open projects hut/chest/pen, milestones
 *     relocate/pickaxe/pad) via the putter's real call shape.
 *   + 1 evening call with NO template (must produce no line).
 *   + regression set: DECLARE / REACT wedge / REACT milestone / TICK.
 *   Beats respect the layer's own caps/spacing, so waits are real.
 */
process.env.CODY_ACTOR = '1';
const path = require('path');
const actor = require(path.join(__dirname, 'actor-client.js'));

const N = 6;
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
const out = { evening: [], eveningNoTemplate: null, regression: [] };
async function beat(label, fn, sink) {
  const before = spoken.length;
  const t0 = Date.now();
  const r = await fn();
  sink.push({ label, returned: r, ms: Date.now() - t0, lines: spoken.slice(before) });
}

(async () => {
  await beat('DECLARE leg west-approach out of the dip', () =>
    actor.declareBeat('leg:route2', 'try the west approach out of the dip toward the homestead', {}), out.regression);
  await beat('REACT wedge at the dip west wall', () =>
    actor.reactBeat('wedge', 'your last three hops toward the homestead closed no distance at all - the ground at the west wall of the dip will not take you', {}), out.regression);
  console.log('[gate-shadow] waiting out the react spacing (46 s)...');
  await sleep(46000);
  await beat('REACT milestone S1 pickaxe', () =>
    actor.reactBeat('milestone', 'a wooden pickaxe is in hand; the pad milestones stand at relocate, pickaxe, pad', {}), out.regression);
  // Evening state: his real day-end circumstances (pad done, hut/chest/
  // pen still open) — the state behind this morning's overclaims.
  ctx = Object.assign({}, ctx, {
    intent: 'Evening putter', project: 'hut', step: 'putter',
    place: 'the shoulder', tod: 11200,
    pos: { x: 64, y: 67, z: -93 }, health: 20, food: 17,
  });
  fakeBot.entity.position = { x: 64, y: 67, z: -93 };
  for (let i = 0; i < N; i++) {
    if (i > 0) { console.log('[gate-shadow] waiting out the react spacing (46 s)...'); await sleep(46000); }
    // The putter's exact call shape (character-plugin.js maybePutter):
    const line = "That's the pad done. A starter hut tomorrow.";
    await beat('REACT evening sample ' + (i + 1), () =>
      actor.reactBeat('evening', 'the day is ending at home. ' + line, { template: line }), out.evening);
  }
  console.log('[gate-shadow] waiting out the react spacing (46 s)...');
  await sleep(46000);
  {
    const before = spoken.length;
    const r = await actor.reactBeat('evening', 'the day is ending at home', {});
    out.eveningNoTemplate = { returned: r, lines: spoken.slice(before), note: 'empty-opts evening call: template-only gate must produce NO line' };
  }
  await beat('TICK narration', () => actor._test.runBeat('tick', { reason: 'arm' }), out.regression);
  out.stats = actor.stats();
  console.log('===GATE-SHADOW-RESULT===');
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error('gate shadow harness error:', e); process.exit(1); });
