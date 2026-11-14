/**
 * v1-showboat.js — The Trick Shot Artist
 *
 * Celebrates EVERY good shot with flair.
 * Attempts risky shots, talks about backhand vs forehand.
 * References real disc names from the database.
 *
 * Hypothesis: Most entertaining, worst actual scores.
 */

import { Script, Step } from './script-engine.js';
import { recommendDisc, getDiscByName } from './disc-selector.js';

const LINES = {
  tee: [
    'Alright, let me WORK.',
    'Crowd please — watch this one.',
    'Going big on this hole. No fear.',
    'Time to put on a SHOW.',
    'Okay okay okay. I can feel it.',
    'This is the one. I can feel it in my bones.',
    'Everyone watch CLOSELY.',
    'Hyzer flip incoming!',
    'About to make disc golf look like art.',
    'Let me cook.',
  ],
  discPick: [
    'Going with the Wraith on this one.',
    'Destroyer time. Full send.',
    'Buzzz for the approach — classic.',
    'Nuke SS. We ride at dawn.',
    'Firebird for that big hyzer line.',
    'Teebird — the chef\'s kiss of fairway drivers.',
    'Hades. I trust the turn.',
    'Sidewinder for the flex shot.',
    'Leopard3, let it rip.',
    'Pulling out the Katana. No mercy.',
    'Force through the wind.',
    'Roadrunner — we going RIGHT.',
  ],
  throwStyle: [
    'Big backhand — watch the snap!',
    'Forehand flick! That\'s where the magic happens.',
    'Anhyzer backhand. We trust the flip.',
    'Hyzer forehand — power line.',
    'Going overhead tomahawk on this one!',
    'Roller? Roller. Let\'s get weird.',
    'Backhand, full run-up, MAX power.',
  ],
  goodShot: [
    'YOOO! Did you SEE that?',
    'That was NASTY!',
    'Are you KIDDING me?! Gorgeous!',
    'That\'s what I\'m TALKING about!',
    'HIGHLIGHT REEL! That\'s going on the channel!',
    'Chef\'s kiss! *mwah*',
    'Textbook! That hyzer line was PERFECT.',
    'Someone get me a commentator job!',
    'That disc FLIPPED perfectly!',
    'I am UNSTOPPABLE right now!',
  ],
  greatShot: [
    'ACE WATCH! ACE WATCH!',
    'BIRDIE CITY, POPULATION ME!',
    'That was the throw of the CENTURY!',
    'I should go pro. Actually.',
    'That\'s going in the montage for SURE.',
    'If that\'s not a 10, I don\'t know what is!',
  ],
  badShot: [
    '...okay that one didn\'t work.',
    'No no no, that was the WIND\'s fault.',
    'I meant to do that. Totally intentional.',
    'That disc has a mind of its own!',
    'We don\'t talk about that one.',
    'Ugh, tree. Classic.',
    'Next one\'s going in. Trust.',
    'Even the pros miss sometimes... right?',
  ],
  terribleShot: [
    'Well. That happened.',
    'I\'m blaming the disc.',
    'New disc. This one\'s cursed.',
    'Okay I need a moment.',
    '...can we get a drop zone?',
  ],
  celebrate: [
    '*spins around* LET\'S GOOO!',
    '*flexes* Disc golf is MY sport!',
    'Take a PICTURE, it\'ll last longer!',
    '*dabs*',
    'WEEEEEE!',
    'I\'m the greatest to ever do it!',
    '*does a little dance*',
  ],
  holeComment: [
    'Nice hole! I made that look easy.',
    'Another one in the books.',
    'That hole owes me nothing.',
    'Clean! Moving on.',
  ],
};

function pick(key) {
  const arr = LINES[key];
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Build a showboat hole script.
 */
export function buildShowboatScript(ctx) {
  const rec = recommendDisc({
    distance: ctx.distanceToBasket,
    windSpeed: ctx.windSpeed,
    windAngle: ctx.windDirection,
    obstacles: 0,
    par: ctx.par <= 3 ? 'par3' : ctx.par <= 4 ? 'par4' : 'par5',
  });

  // Showboat uses riskier discs sometimes
  const riskyPower = Math.min(1, rec.suggestedPower + 0.1);
  const riskyHyzer = rec.suggestedHyzer + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 15 : -15) : 0);

  const steps = [
    Step.walkToTee(),
    Step.wait(600),
    Step.chat(pick('tee')),
    Step.wait(800),
    Step.chat(pick('discPick')),
    Step.wait(400),
    Step.chat(pick('throwStyle')),
    Step.wait(600),
    Step.set('discInHand', rec.disc.name),
    Step.throwDisc({ disc: rec.disc, power: riskyPower, hyzer: riskyHyzer }),
    Step.wait(800),
    Step.branch(
      () => ['parked', 'in_basket'].includes(ctx.lastShotResult?.landing),
      Step.sequence(
        Step.chat(pick('greatShot')),
        Step.celebrate(),
        Step.chat(pick('celebrate')),
      ),
      Step.branch(
        () => ['left', 'right', 'long'].includes(ctx.lastShotResult?.landing),
        Step.chat(pick('badShot')),
        Step.chat(pick('badShot')),
        Step.branch(
          () => ctx.mood?.mood < 0.3,
          Step.chat(pick('terribleShot')),
          Step.noop(),
        ),
      ),
    ),
    Step.walkToBasket(),
    Step.wait(1000),
    Step.chat(pick('holeComment')),
  ];

  return Script.define('showboat_hole', steps);
}

export function buildShowboatRoundScript(ctx) {
  return Script.define('showboat_round', [
    Step.branch(
      () => (ctx.scoreToPar || 0) <= 0,
      Step.chat('Underrated round. You\'re welcome for the entertainment.'),
      Step.chat('The crowd loved it and THAT\'S what matters.'),
    ),
    Step.chat(pick('celebrate')),
  ]);
}

export default { buildShowboatScript, buildShowboatRoundScript };
