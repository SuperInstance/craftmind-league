/**
 * v1-stoic.js — The Silent Pro
 *
 * Never celebrates, never complains. Just plays.
 * Occasional nod or "Mm."
 *
 * Hypothesis: Fastest round completion, least entertaining.
 */

import { Script, Step } from './script-engine.js';
import { recommendDisc } from './disc-selector.js';

const LINES = {
  acknowledge: [
    'Mm.',
    '*nods*',
    '..',
    'Right.',
    'Yep.',
  ],
  tee: [
    '*steps to tee*',
    'Hole {hole}.',
    '*lines up*',
    '',
  ],
  goodShot: [
    'Mm.',
    '*walks forward*',
    '*nods once*',
    '',
    '',
  ],
  badShot: [
    '..',
    '*walks to disc*',
    '',
    '',
    '*picks up disc*',
  ],
  birdie: [
    'Mm.',
    '*walks to basket*',
  ],
  bogey: [
    '*retrieves disc*',
    '..',
  ],
  card: [
    'Even par.',
    '{scoreToPar}.',
    '*folded scorecard*',
  ],
};

function pick(key) {
  const arr = LINES[key];
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolate(str, ctx) {
  return (str || '')
    .replace('{hole}', ctx.hole)
    .replace('{scoreToPar}', ctx.scoreToPar || 'even');
}

function makeChat(key, ctx) {
  const msg = interpolate(pick(key), ctx);
  if (!msg) return Step.noop();
  return Step.chat(msg);
}

/**
 * Build the stoic hole script.
 * @param {Object} ctx - context from script runner
 * @returns {Script}
 */
export function buildStoicScript(ctx) {
  const rec = recommendDisc({
    distance: ctx.distanceToBasket,
    windSpeed: ctx.windSpeed,
    windAngle: ctx.windDirection,
    obstacles: 0,
    par: ctx.par <= 3 ? 'par3' : ctx.par <= 4 ? 'par4' : 'par5',
  });

  const steps = [
    Step.walkToTee(),
    Step.wait(800),
    Step.set('discInHand', rec.disc.name),
    makeChat('tee', ctx),
    Step.wait(600),
    Step.throwDisc({ disc: rec.disc, power: rec.suggestedPower, hyzer: rec.suggestedHyzer }),
    Step.wait(500),
    Step.walkToBasket(),
    Step.wait(1200),
    Step.branch(
      () => ctx.strokes <= ctx.par,
      makeChat('birdie', ctx),
      makeChat('bogey', ctx),
    ),
  ];

  return Script.define('stoic_hole', steps);
}

/**
 * Build the stoic round summary.
 */
export function buildStoicRoundScript(ctx) {
  return Script.define('stoic_round', [
    makeChat('card', ctx),
    Step.wait(500),
    Step.chat('*walks off the course*'),
  ]);
}

export default { buildStoicScript, buildStoicRoundScript };
