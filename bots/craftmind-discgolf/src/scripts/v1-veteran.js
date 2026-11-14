/**
 * v1-veteran.js — The Old Course Regular
 *
 * Knows every hole by heart. Complains about course design.
 * "Back in my day" references. Actually plays quite well.
 *
 * Hypothesis: Best blend of personality and performance.
 */

import { Script, Step } from './script-engine.js';
import { recommendDisc } from './disc-selector.js';

const LINES = {
  holeKnowledge: [
    'Oh, this one. The dogleg left.',
    'Hole {hole}. I know this one by heart.',
    'This is my favorite hole. Used to par it every time.',
    'Ah yes, the tricky one. Watch the tree line on the right.',
    'This hole\'s changed since they redesigned it. Not for the better.',
    'Easy hole if you stay left. Everyone goes right and ends up in the bushes.',
    'Long par {par}. Need to place your drive or you\'re scrambling all day.',
    'This is where I got my first ace. Three years ago. Still remember it.',
    'Narrow fairway here. Don\'t overpower it.',
    'Classic risk-reward. Bomb it and hope, or lay up and take par.',
    'Water on the left if you\'re wondering why everyone\'s aiming right.',
    'The wind always swirls through this corridor. Throws everyone off.',
  ],
  courseComplaints: [
    'They moved the basket again. Used to be ten feet further back.',
    'Back in my day, this was a par 4. Now it\'s a par 3. Kids these days.',
    'These new baskets are too deep. Can\'t get the speed right.',
    'They cleared too many trees. No challenge anymore.',
    'Somebody put in a new tee pad. It\'s crooked.',
    'The sand trap on 7? That wasn\'t there last year.',
    'Course maintenance is going downhill. Look at those fairways.',
    'Whoever designed hole 12 has never thrown a disc in their life.',
    'They should have kept the old layout. This is dumbed down.',
    'GPS says {distance}ft but it plays way longer with the uphill.',
  ],
  backInTheDay: [
    'Back in my day, we threw CE plastic and LIKED it.',
    'I remember when the Destroyer first came out. Changed everything.',
    'Used to play this course with DX Aviars. No fancy plastic.',
    'I\'ve been playing this course since before half these holes existed.',
    'When I started, there were no tee pads. Threw off dirt.',
    'The old pros didn\'t need disc selection algorithms. Just feel.',
    'I\'ve carded more rounds here than most people have rounds total.',
  ],
  discComment: [
    'Going with the Roc3. Does everything I need.',
    'Teebird off the tee. It\'s always the Teebird.',
    'Buzzz for the approach. Never let me down.',
    'Aviar to finish. Simple.',
    'Old school choice — Firebird. It just works.',
    'Pulling out the Wraith. For when I need a little extra.',
    'Thunderbird for this one. Overstable enough for the wind.',
    'Leopard3 when I want something that glides.',
    'Challenger upshot — I know this putt.',
  ],
  goodShot: [
    'Still got it.',
    'That\'s how you throw a disc.',
    'Textbook. Been doing that for years.',
    'Nothing fancy. Just good fundamentals.',
    'That\'s what a thousand rounds teaches you.',
    'See? Fundamentals.',
    'Placed it exactly where I wanted.',
    'Right where I aimed. Funny how that works.',
    'That\'s the line. Been throwing it for a decade.',
    'Calculated.',
  ],
  badShot: [
    'Hmm. That\'s unusual for me.',
    'Wind caught it. Not my fault.',
    'That\'s the first time that\'s happened. I swear.',
    'New plastic. Still breaking it in.',
    'Okay, that one got away from me.',
    'Eh, I\'ll be fine from here.',
    'That tree wasn\'t there last week.',
    'The ground is wet. Different release.',
    'Sun was in my eyes.',
  ],
  birdieReaction: [
    'Par is for mortals.',
    'That\'s how it\'s done, kid.',
    'When you know the course... you know the course.',
    'I\'ve birdied this hole more times than you\'ve played it.',
    'Efficient. No wasted throws.',
    'That\'s the benefit of experience.',
  ],
  bogeyReaction: [
    'That hole owes me.',
    'It happens. This course is sneaky.',
    'Bogey\'s fine. I\'ll get it back.',
    'Not my day on this one.',
    'Par would have been the right score. Wind was tricky.',
    'I\'ll remember that for next time.',
  ],
  roundSummary: [
    'Solid round. Could have been better, could have been worse.',
    'Course played tough today. Happy with the result.',
    'Same score I always card. Consistency is underrated.',
    'I\'ve shot better, I\'ve shot worse. That\'s disc golf.',
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
 * Build veteran hole script.
 */
export function buildVeteranScript(ctx) {
  const rec = recommendDisc({
    distance: ctx.distanceToBasket,
    windSpeed: ctx.windSpeed,
    windAngle: ctx.windDirection,
    obstacles: 0,
    par: ctx.par <= 3 ? 'par3' : ctx.par <= 4 ? 'par4' : 'par5',
  });

  // Veteran uses conservative power — plays well
  const safePower = Math.min(1, rec.suggestedPower - 0.05);
  const safeHyzer = rec.suggestedHyzer || 5;

  const steps = [
    Step.walkToTee(),
    Step.wait(700),

    // Hole knowledge
    chatLine('holeKnowledge', ctx),
    Step.wait(800),

    // Sometimes complain about course
    Step.branch(
      () => Math.random() > 0.5,
      chatLine('courseComplaints', ctx),
      Step.noop(),
    ),
    Step.wait(300),

    // Disc selection — veteran always has a reason
    Step.chat(pick('discComment')),
    Step.wait(500),

    // Sometimes a "back in my day" reference
    Step.branch(
      () => Math.random() > 0.6,
      Step.sequence(
        Step.wait(400),
        Step.chat(pick('backInTheDay')),
      ),
      Step.noop(),
    ),
    Step.wait(400),

    Step.set('discInHand', rec.disc.name),
    Step.throwDisc({ disc: rec.disc, power: safePower, hyzer: safeHyzer }),
    Step.wait(700),

    // Reaction
    Step.branch(
      () => ['parked', 'in_basket'].includes(ctx.lastShotResult?.landing),
      Step.branch(
        () => ctx.strokes <= ctx.par - 1,
        Step.chat(pick('birdieReaction')),
        Step.chat(pick('goodShot')),
      ),
      Step.branch(
        () => ctx.strokes >= ctx.par + 1,
        Step.chat(pick('bogeyReaction')),
        Step.chat(pick('badShot')),
      ),
    ),

    Step.walkToBasket(),
    Step.wait(900),
  ];

  return Script.define('veteran_hole', steps);
}

export function buildVeteranRoundScript(ctx) {
  return Script.define('veteran_round', [
    Step.chat(pick('roundSummary')),
    Step.wait(500),
    Step.chat(pick('backInTheDay')),
  ]);
}

export default { buildVeteranScript, buildVeteranRoundScript };
