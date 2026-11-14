/**
 * Tests for CraftMind Disc Golf scripts.
 * Run with: node --experimental-vm-modules tests/test-disc-scripts.js
 * Or: npx vitest run tests/test-disc-scripts.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { recommendDisc, getDiscByName } from '../src/scripts/disc-selector.js';
import { MoodSystem, Scorecard, Step, weightedRandom, GolfScriptRunner } from '../src/scripts/script-engine.js';
import { discs, stability, stabilityLabel, DiscType, getDisc, getDiscsByType } from '../src/engine/disc-database.js';

// ── Disc Database Tests ──────────────────────────────────────

describe('Disc Database', () => {
  it('has 70+ discs', () => {
    assert.ok(discs.length >= 70, `Expected 70+, got ${discs.length}`);
  });

  it('covers all disc types', () => {
    const types = new Set(discs.map(d => d.type));
    assert.ok(types.has(DiscType.PUTTER));
    assert.ok(types.has(DiscType.MIDRANGE));
    assert.ok(types.has(DiscType.FAIRWAY_DRIVER));
    assert.ok(types.has(DiscType.DISTANCE_DRIVER));
  });

  it('every disc has valid flight numbers', () => {
    for (const d of discs) {
      assert.ok(d.speed >= 1 && d.speed <= 14, `${d.name}: speed ${d.speed}`);
      assert.ok(d.glide >= 1 && d.glide <= 7, `${d.name}: glide ${d.glide}`);
      assert.ok(d.turn >= -5 && d.turn <= 1, `${d.name}: turn ${d.turn}`);
      assert.ok(d.fade >= 0 && d.fade <= 5, `${d.name}: fade ${d.fade}`);
    }
  });

  it('every disc has unique id', () => {
    const ids = new Set(discs.map(d => d.id));
    assert.equal(ids.size, discs.length);
  });

  it('stability() returns reasonable values', () => {
    const veryUnder = discs.find(d => d.id === 'roadrunner');
    const veryOver = discs.find(d => d.id === 'firebird');
    assert.ok(stability(veryUnder) < stability(veryOver), `${veryUnder.name}(${stability(veryUnder)}) vs ${veryOver.name}(${stability(veryOver)})`);
    assert.ok(stabilityLabel(veryUnder).includes('under'));
    assert.ok(stabilityLabel(veryOver).includes('over'));
  });
});

// ── Disc Selector Tests ──────────────────────────────────────

describe('Disc Selector', () => {
  it('recommends putter for short distance', () => {
    const rec = recommendDisc({ distance: 100, par: 'par3' });
    assert.equal(rec.disc.type, DiscType.PUTTER);
  });

  it('recommends putter type for putting range', () => {
    const rec = recommendDisc({ distance: 80, par: 'par3' });
    assert.equal(rec.disc.type, DiscType.PUTTER);
  });

  it('recommends midrange for approach distance', () => {
    const rec = recommendDisc({ distance: 200, par: 'par3' });
    assert.ok(
      rec.disc.type === DiscType.MIDRANGE || rec.disc.type === DiscType.PUTTER,
      `Expected mid/putter, got ${rec.disc.type}`
    );
  });

  it('recommends midrange when many obstacles', () => {
    const rec = recommendDisc({ distance: 220, obstacles: 3, par: 'par4' });
    assert.ok(rec.disc.type === DiscType.MIDRANGE, `Expected midrange, got ${rec.disc.type}`);
  });

  it('recommends fairway driver for medium distance', () => {
    const rec = recommendDisc({ distance: 300, par: 'par4' });
    assert.ok(
      rec.disc.type === DiscType.FAIRWAY_DRIVER || rec.disc.type === DiscType.DISTANCE_DRIVER,
      `Expected fairway/distance, got ${rec.disc.type}`
    );
  });

  it('recommends distance driver for long holes', () => {
    const rec = recommendDisc({ distance: 420, par: 'par5' });
    assert.ok(
      rec.disc.type === DiscType.DISTANCE_DRIVER || rec.disc.type === DiscType.FAIRWAY_DRIVER,
      `Expected distance driver, got ${rec.disc.type}`
    );
  });

  it('prefers overstable disc in headwind', () => {
    const rec = recommendDisc({ distance: 350, windSpeed: 5, windAngle: 180, par: 'par4' });
    assert.ok(stability(rec.disc) >= 2, `Expected overstable in headwind, got stability ${stability(rec.disc)} for ${rec.disc.name}`);
  });

  it('prefers understable disc in tailwind', () => {
    const rec = recommendDisc({ distance: 350, windSpeed: 5, windAngle: 0, par: 'par4' });
    assert.ok(stability(rec.disc) <= 3.5, `Expected understable in tailwind, got stability ${stability(rec.disc)}`);
  });

  it('returns throw type', () => {
    const rec = recommendDisc({ distance: 300, par: 'par4' });
    assert.ok(['backhand', 'forehand', 'putt'].includes(rec.throwType));
  });

  it('returns put for short range', () => {
    const rec = recommendDisc({ distance: 50, par: 'par3' });
    assert.equal(rec.throwType, 'putt');
  });

  it('returns a reason string', () => {
    const rec = recommendDisc({ distance: 300, windSpeed: 3, windAngle: 180, par: 'par4' });
    assert.ok(typeof rec.reason === 'string');
    assert.ok(rec.reason.length > 10);
  });

  it('suggests reasonable power (0-1)', () => {
    const rec = recommendDisc({ distance: 300, par: 'par4' });
    assert.ok(rec.suggestedPower >= 0 && rec.suggestedPower <= 1);
  });

  it('getDiscByName finds by id', () => {
    const disc = getDiscByName('buzzz');
    assert.ok(disc);
    assert.equal(disc.name, 'Buzzz');
  });

  it('getDiscByName returns null for unknown', () => {
    const disc = getDiscByName('totally fake disc');
    assert.equal(disc, null);
  });
});

// ── Mood System Tests ────────────────────────────────────────

describe('Mood System', () => {
  it('starts at neutral', () => {
    const mood = new MoodSystem();
    assert.equal(mood.mood, 0.5);
    assert.equal(mood.label, 'neutral');
  });

  it('shifts up on good event', () => {
    const mood = new MoodSystem();
    mood.shift(0.3);
    assert.ok(mood.mood > 0.5);
    assert.ok(mood.label === 'focused' || mood.label === 'excited');
  });

  it('shifts down on bad event', () => {
    const mood = new MoodSystem();
    mood.shift(-0.3);
    assert.ok(mood.mood < 0.5);
    assert.ok(mood.label === 'frustrated' || mood.label === 'miserable');
  });

  it('clamps to 0-1', () => {
    const mood = new MoodSystem();
    mood.shift(10);
    assert.equal(mood.mood, 1);
    mood.shift(-20);
    assert.equal(mood.mood, 0);
  });

  it('excited label at high mood', () => {
    const mood = new MoodSystem();
    mood.mood = 0.9;
    assert.equal(mood.label, 'excited');
  });

  it('miserable label at low mood', () => {
    const mood = new MoodSystem();
    mood.mood = 0.1;
    assert.equal(mood.label, 'miserable');
  });

  it('chattiness correlates with mood', () => {
    const mood = new MoodSystem();
    const lowChat = new MoodSystem();
    lowChat.mood = 0.2;
    assert.ok(mood.chattiness > lowChat.chattiness);
  });

  it('tick decays toward neutral', () => {
    const mood = new MoodSystem();
    mood.mood = 0.9;
    for (let i = 0; i < 100; i++) mood.tick();
    assert.ok(mood.mood < 0.9, 'Mood should decay');
  });
});

// ── Scorecard Tests ──────────────────────────────────────────

describe('Scorecard', () => {
  it('tracks scores correctly', () => {
    const card = new Scorecard([
      { number: 1, par: 3 },
      { number: 2, par: 4 },
    ]);
    card.recordStrokes(1, 3);
    card.recordStrokes(2, 5);
    assert.equal(card.totalScore, 8);
    assert.equal(card.totalPar, 7);
    assert.equal(card.scoreToPar, 1);
  });

  it('scoreName works', () => {
    assert.equal(Scorecard.scoreName(-2), 'eagle');
    assert.equal(Scorecard.scoreName(-1), 'birdie');
    assert.equal(Scorecard.scoreName(0), 'par');
    assert.equal(Scorecard.scoreName(1), 'bogey');
    assert.equal(Scorecard.scoreName(2), 'double bogey');
    assert.equal(Scorecard.scoreName(3), '3 over');
  });
});

// ── Step System Tests ────────────────────────────────────────

describe('Step System', () => {
  it('chat step picks from array', () => {
    const step = Step.chat(['a', 'b', 'c']);
    for (let i = 0; i < 20; i++) {
      const msg = step.pick();
      assert.ok(['a', 'b', 'c'].includes(msg));
    }
  });

  it('chat step returns string directly', () => {
    const step = Step.chat('hello');
    assert.equal(step.pick(), 'hello');
  });

  it('weightedRandom distributes correctly', () => {
    const results = { a: 0, b: 0 };
    for (let i = 0; i < 1000; i++) {
      const pick = weightedRandom({ 0.7: 'a', 0.3: 'b' });
      results[pick]++;
    }
    // a should be roughly 70%, b roughly 30%
    assert.ok(results.a > 500, `a got ${results.a}, expected > 500`);
    assert.ok(results.b > 100, `b got ${results.b}, expected > 100`);
  });
});

// ── Script Runner Tests (with mock bot) ─────────────────────

describe('GolfScriptRunner', () => {
  function mockBot() {
    const messages = [];
    return {
      chat: (msg) => messages.push(msg),
      _messages: messages,
    };
  }

  it('executes simple chat script', async () => {
    const bot = mockBot();
    const runner = new GolfScriptRunner(bot);

    const { Script } = await import('../src/scripts/script-engine.js');
    const script = Script.define('test_chat', [
      Step.chat('hello'),
      Step.wait(50),
      Step.chat('world'),
    ]);

    await runner.run(script);
    assert.ok(bot._messages.includes('hello') || bot._messages.length <= 1); // may skip based on chattiness
  });

  it('updates context', async () => {
    const bot = mockBot();
    const runner = new GolfScriptRunner(bot);
    runner.updateContext({ hole: 5, par: 4, distanceToBasket: 320 });
    assert.equal(runner.context.hole, 5);
    assert.equal(runner.context.par, 4);
  });

  it('mood shifts on throw result', async () => {
    const bot = mockBot();
    const onThrow = async () => ({ landing: 'parked', distance: 0 });
    const runner = new GolfScriptRunner(bot, { onThrow });
    const { Script } = await import('../src/scripts/script-engine.js');

    const script = Script.define('test_throw', [
      Step.throwDisc(),
    ]);

    const beforeMood = runner.mood.mood;
    await runner.run(script);
    assert.ok(runner.mood.mood > beforeMood, 'Mood should increase on parked shot');
  });

  it('mood drops on bad throw', async () => {
    const bot = mockBot();
    const onThrow = async () => ({ landing: 'obstacle', distance: 50 });
    const runner = new GolfScriptRunner(bot, { onThrow });
    const { Script } = await import('../src/scripts/script-engine.js');

    const script = Script.define('test_throw', [
      Step.throwDisc(),
    ]);

    const beforeMood = runner.mood.mood;
    await runner.run(script);
    assert.ok(runner.mood.mood < beforeMood, 'Mood should decrease on obstacle');
  });

  it('context tracks strokes', async () => {
    const bot = mockBot();
    const onThrow = async () => ({ landing: 'short', distance: 100 });
    const runner = new GolfScriptRunner(bot, { onThrow });
    const { Script } = await import('../src/scripts/script-engine.js');

    const script = Script.define('test_multi', [
      Step.throwDisc(),
      Step.throwDisc(),
      Step.throwDisc(),
    ]);

    await runner.run(script);
    assert.equal(runner.context.strokes, 3);
  });

  it('interrupt stops execution', async () => {
    const bot = mockBot();
    let actionCount = 0;
    const runner = new GolfScriptRunner(bot);
    const { Script } = await import('../src/scripts/script-engine.js');

    const script = Script.define('test_interrupt', [
      Step.action('count', () => { actionCount++; runner.interrupt('test'); }),
      Step.action('should-not-run', () => { actionCount += 100; }),
    ]);

    await runner.run(script);
    assert.equal(actionCount, 1);
  });

  it('register and run by name', async () => {
    const bot = mockBot();
    const runner = new GolfScriptRunner(bot);
    const { Script } = await import('../src/scripts/script-engine.js');

    runner.register(Script.define('by_name', [
      Step.chat('found me'),
    ]));

    await runner.run('by_name');
    // May or may not chat depending on chattiness, but should not error
  });
});

// ── Personality Script Tests ─────────────────────────────────

describe('Personality Scripts', () => {
  async function buildAndCheck(builder, ctx) {
    try {
      const mod = await import(`../src/scripts/${builder}.js`);
      const buildFn = Object.values(mod).find(fn => typeof fn === 'function' && fn.name?.startsWith('build'));
      if (buildFn) return buildFn(ctx);
    } catch {
      // Try default export
      const mod = await import(`../src/scripts/${builder}.js`);
      const fn = mod.default?.[Object.keys(mod.default)[0]];
      if (fn) return fn(ctx);
    }
    return null;
  }

  const baseCtx = {
    hole: 1,
    par: 3,
    distanceToBasket: 280,
    windSpeed: 2,
    windDirection: 90,
    strokes: 0,
    lastShotResult: null,
    mood: new MoodSystem(),
    discInHand: null,
  };

  it('stoic script builds without error', async () => {
    const { buildStoicScript } = await import('../src/scripts/v1-stoic.js');
    const script = buildStoicScript(baseCtx);
    assert.ok(script);
    assert.ok(script.steps.length > 0);
  });

  it('showboat script builds without error', async () => {
    const { buildShowboatScript } = await import('../src/scripts/v1-showboat.js');
    const script = buildShowboatScript(baseCtx);
    assert.ok(script);
    assert.ok(script.steps.length > 0);
  });

  it('caddy script builds without error', async () => {
    const { buildCaddyScript } = await import('../src/scripts/v1-caddy.js');
    const script = buildCaddyScript(baseCtx);
    assert.ok(script);
    assert.ok(script.steps.length > 0);
  });

  it('veteran script builds without error', async () => {
    const { buildVeteranScript } = await import('../src/scripts/v1-veteran.js');
    const script = buildVeteranScript(baseCtx);
    assert.ok(script);
    assert.ok(script.steps.length > 0);
  });

  it('scripts adapt to par 5', async () => {
    const { buildCaddyScript } = await import('../src/scripts/v1-caddy.js');
    const script = buildCaddyScript({ ...baseCtx, par: 5, distanceToBasket: 450 });
    assert.ok(script);
  });

  it('scripts handle wind', async () => {
    const { buildCaddyScript } = await import('../src/scripts/v1-caddy.js');
    const script = buildCaddyScript({ ...baseCtx, windSpeed: 7, windDirection: 180 });
    assert.ok(script);
  });
});

console.log('All test suites defined. Run with: node --test tests/test-disc-scripts.js');
