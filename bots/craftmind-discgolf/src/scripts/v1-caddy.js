/**
 * v1-caddy.js — The Helpful Advisor
 *
 * Gives disc selection advice, reads wind, suggests approach.
 * Encourages player: "Nice release!" or "That'll play."
 *
 * Hypothesis: Best for human player experience, moderate own scores.
 */

import { Script, Step } from './script-engine.js';
import { recommendDisc } from './disc-selector.js';

const LINES = {
  tee: [
    'Alright, here we go. Hole {hole}, par {par}.',
    'Okay, par {par}. Let\'s think about this.',
    'Hole {hole}. I like this one.',
    'Let me look at this setup...',
    'Good hole. We can score well here.',
    'Take your time on this one.',
    'I\'ve seen this hole go both ways.',
  ],
  discAdvice: [
    'You want the Buzzz here — trust me. Dead straight.',
    'Teebird off the tee. Classic. Can\'t go wrong.',
    'Destroyer if you\'ve got the arm. Let it fly.',
    'Aviar for the approach. These putt well here.',
    'Leopard3 — give it a little anhyzer and watch it cruise.',
    'Firebird if you need to muscle through a headwind.',
    'Roc3. Reliable midrange. It\'ll hold whatever line you put it on.',
    'Wraith for distance, but watch the fade at the end.',
    'Challenger for the putt. Nice and beefy, drops in clean.',
    'Comet for this one — it glides forever.',
    'Use the FD here. Best fairway driver ever made.',
    'Verdict for the approach — overstable mid that won\'t flip on you.',
    'Put the Nuke away. You\'re going to need control here, not distance.',
    'Zone for the upshot. It won\'t turn over.',
  ],
  windAdvice: [
    'Wind\'s picking up — keep it low.',
    'Headwind — throw something more overstable, it\'ll fight back.',
    'Tailwind! Understable disc will carry forever.',
    'Crosswind from the left — hyzer it and let the wind bring it back.',
    'That wind\'s going to push everything right. Aim left.',
    'Calm day. Perfect for throwing your natural line.',
    'Nice breeze — actually helps discs carry a bit further.',
  ],
  distanceAdvice: [
    'About {distance}ft. One good drive and you\'re putting.',
    '{distance}ft out — you might need a layup first.',
    'Long hole, {distance}ft. Pace yourself.',
    'Short one. Don\'t overthink it.',
    '{distance}ft — par {par} all day if you stay in the fairway.',
  ],
  encourageGood: [
    'Nice release!',
    'That\'ll play.',
    'Smooth throw. That\'s right there.',
    'Good line. Solid.',
    'Textbook. You\'re dialing in.',
    'Now THAT is disc golf.',
    'Clean. Very clean.',
    'Ooh, that carried nicely.',
    'You read that wind perfectly.',
    'Beautiful flight path.',
    'That\'s going to be in range.',
    'Trust your arm — that was the right shot.',
    'See? That\'s what happens when you commit.',
  ],
  encourageBad: [
    'Hey, it happens. Breathe.',
    'No worries — just get back in the fairway.',
    'Tree love. It\'s part of the game.',
    'Shake it off. Next throw.',
    'That\'ll play for par if you put a good approach on it.',
    'Don\'t let one shot derail the hole.',
    'We\'ve all been there. Reset and throw.',
    'Wind got that one. Nothing you could do.',
    'Okay, damage control. What\'s the play?',
    'Easy bogey from here. Keep it simple.',
  ],
  holeComplete: [
    'Good hole. Let\'s keep it rolling.',
    'Moving on. Stay focused.',
    'That\'s disc golf. On to the next.',
    'Alright, what\'s next?',
  ],
  roundSummary: [
    'Good round! You\'re playing solid.',
    'Not bad at all. Keep that energy up.',
    'Nice work out there today.',
    'Some great shots in that round.',
  ],
};

function pick(key) {
  const arr = LINES[key];
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolate(str, ctx) {
  return (str || '')
    .replace('{hole}', ctx.hole)
    .replace('{par}', ctx.par)
    .replace('{distance}', ctx.distanceToBasket || '?');
}

function chatLine(key, ctx) {
  const msg = interpolate(pick(key), ctx);
  return msg ? Step.chat(msg) : Step.noop();
}

/**
 * Build caddy hole script.
 */
export function buildCaddyScript(ctx) {
  const rec = recommendDisc({
    distance: ctx.distanceToBasket,
    windSpeed: ctx.windSpeed,
    windAngle: ctx.windDirection,
    obstacles: 0,
    par: ctx.par <= 3 ? 'par3' : ctx.par <= 4 ? 'par4' : 'par5',
  });

  const steps = [
    Step.walkToTee(),
    Step.wait(500),
    chatLine('tee', ctx),
    Step.wait(600),
    chatLine('distanceAdvice', { ...ctx, distance: ctx.distanceToBasket }),
    Step.wait(400),

    // Wind advice (sometimes)
    Step.branch(
      () => ctx.windSpeed > 2,
      chatLine('windAdvice', ctx),
      Step.noop(),
    ),
    Step.wait(300),

    // Disc recommendation
    Step.chat(rec.reason),
    Step.wait(400),
    Step.chat(pick('discAdvice')),
    Step.wait(500),

    Step.set('discInHand', rec.disc.name),
    Step.throwDisc({ disc: rec.disc, power: rec.suggestedPower, hyzer: rec.suggestedHyzer }),
    Step.wait(600),

    // Reaction
    Step.branch(
      () => ['parked', 'in_basket'].includes(ctx.lastShotResult?.landing),
      chatLine('encourageGood', ctx),
      Step.branch(
        () => ['obstacle', 'short'].includes(ctx.lastShotResult?.landing),
        chatLine('encourageBad', ctx),
        chatLine('encourageGood', ctx), // decent but not great
      ),
    ),

    Step.walkToBasket(),
    Step.wait(800),
    chatLine('holeComplete', ctx),
  ];

  return Script.define('caddy_hole', steps);
}

export function buildCaddyRoundScript(ctx) {
  return Script.define('caddy_round', [
    Step.chat(pick('roundSummary')),
    Step.wait(400),
    Step.chat(`Final: ${ctx.scoreToPar || 'even par'}. Good round!`),
  ]);
}

export default { buildCaddyScript, buildCaddyRoundScript };
