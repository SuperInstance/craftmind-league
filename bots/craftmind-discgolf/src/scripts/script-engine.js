/**
 * Stochastic Script Engine for CraftMind Disc Golf
 *
 * Adapted from fishing engine — drives AI golfer personality scripts
 * through disc golf holes with weighted random chat, actions, and mood.
 */

// League ledger hook (flag: LEAGUE_LEDGER=1) — records throws as
// decisions in ~/craftmind-league/ledger/events.jsonl. No-op when the
// flag is off; never changes physics or scoring. See ../league-ledger.js.
import { recordThrow } from '../league-ledger.js';

export function weightedRandom(weights) {
  const entries = weights instanceof Map ? [...weights.entries()] : Object.entries(weights);
  const total = entries.reduce((s, [w]) => s + parseFloat(w), 0);
  if (total <= 0) return entries[0]?.[1] ?? null;
  let roll = Math.random() * total;
  for (const [w, outcome] of entries) {
    roll -= parseFloat(w);
    if (roll <= 0) return outcome;
  }
  return entries[entries.length - 1][1];
}

export class Step {
  static action(name, fn) {
    return { type: 'action', name, fn };
  }

  static chat(msgs) {
    return {
      type: 'chat',
      pick: () => {
        if (typeof msgs === 'string') return msgs;
        if (Array.isArray(msgs)) return msgs[Math.floor(Math.random() * msgs.length)];
        return weightedRandom(msgs);
      }
    };
  }

  static wait(ms) {
    return { type: 'wait', ms };
  }

  static throwDisc(opts = {}) {
    return { type: 'throw_disc', opts };
  }

  static walkToTee() {
    return { type: 'walk_to_tee' };
  }

  static walkToBasket() {
    return { type: 'walk_to_basket' };
  }

  static celebrate() {
    return { type: 'celebrate' };
  }

  static complain() {
    return { type: 'complain' };
  }

  static readCard() {
    return { type: 'read_card' };
  }

  static branch(condition, ifTrue, ifFalse) {
    return { type: 'branch', condition, ifTrue, ifFalse };
  }

  static goto(scriptName) {
    return { type: 'goto', scriptName };
  }

  static noop() {
    return { type: 'noop' };
  }

  static set(key, value) {
    return { type: 'set', key, value };
  }

  /** Multi-step sequence */
  static sequence(...steps) {
    return steps.flat();
  }
}

export class MoodSystem {
  constructor() {
    this.mood = 0.5; // 0=miserable, 0.5=neutral, 1=elated
    this.focus = 0.7; // 0=distracted, 1=tunnel vision
    this.energy = 1.0;
  }

  /** @returns {'miserable'|'frustrated'|'neutral'|'focused'|'excited'} */
  get label() {
    if (this.mood < 0.2) return 'miserable';
    if (this.mood < 0.4) return 'frustrated';
    if (this.mood < 0.6) return 'neutral';
    if (this.mood < 0.8) return 'focused';
    return 'excited';
  }

  shift(amount) {
    this.mood = Math.max(0, Math.min(1, this.mood + amount));
  }

  /** Chatty? Higher mood = more chatty. */
  get chattiness() {
    return Math.max(0.1, Math.min(0.95, this.mood * 1.1));
  }

  /** Delay multiplier for actions */
  get speedMultiplier() {
    return 0.7 + this.energy * 0.6;
  }

  tick() {
    this.mood += (0.5 - this.mood) * 0.008;
    this.energy = Math.max(0.15, this.energy - 0.0003);
    this.focus = Math.max(0.3, Math.min(1, this.focus + (0.7 - this.focus) * 0.005));
  }
}

/**
 * Score tracking for a round.
 */
export class Scorecard {
  constructor(holes) {
    this.scores = new Map();
    this.pars = new Map();
    for (const h of holes) {
      this.scores.set(h.number, 0);
      this.pars.set(h.number, h.par);
    }
    this.currentHole = 1;
    this.totalHoles = holes.length;
  }

  recordStrokes(hole, strokes) {
    this.scores.set(hole, strokes);
  }

  getPar(hole) {
    return this.pars.get(hole);
  }

  getScoreRelativeToPar(hole) {
    const strokes = this.scores.get(hole);
    const par = this.pars.get(hole);
    if (strokes == null || par == null) return 0;
    return strokes - par;
  }

  get totalScore() {
    let total = 0;
    for (const [hole, strokes] of this.scores) {
      total += strokes;
    }
    return total;
  }

  get totalPar() {
    let total = 0;
    for (const [, par] of this.pars) {
      total += par;
    }
    return total;
  }

  get scoreToPar() {
    return this.totalScore - this.totalPar;
  }

  /** Score name: 'birdie', 'par', 'bogey', etc. */
  static scoreName(delta) {
    if (delta <= -3) return 'albatross';
    if (delta === -2) return 'eagle';
    if (delta === -1) return 'birdie';
    if (delta === 0) return 'par';
    if (delta === 1) return 'bogey';
    if (delta === 2) return 'double bogey';
    return `${delta} over`;
  }
}

export class Script {
  constructor(name, steps) {
    this.name = name;
    this.steps = steps;
  }

  static define(name, steps) {
    return new Script(name, steps);
  }
}

export class GolfScriptRunner {
  constructor(bot, options = {}) {
    this.bot = bot;
    this.scripts = new Map();
    this.mood = options.mood || new MoodSystem();
    this.scorecard = options.scorecard || null;
    this.context = {
      agentName: options.agentName || null,
      hole: 1,
      par: 3,
      discInHand: null,
      distanceToBasket: 0,
      windSpeed: 0,
      windDirection: 0,
      strokes: 0,
      lastShotResult: null,
      playersNearby: new Set(),
      lastChatTime: 0,
      currentScript: null,
      interrupted: false,
    };
    this._running = false;
    this._currentScript = null;
    this._tickInterval = null;
    this._onThrow = options.onThrow || null;
    this._onWalk = options.onWalk || null;
  }

  register(script) {
    this.scripts.set(script.name, script);
    return this;
  }

  async run(scriptNameOrScript) {
    const script = typeof scriptNameOrScript === 'string'
      ? this.scripts.get(scriptNameOrScript)
      : scriptNameOrScript;

    if (!script) {
      console.error(`[GolfScript] Script not found: ${scriptNameOrScript}`);
      return;
    }

    this._currentScript = script;
    this.context.currentScript = script.name;
    this._running = true;

    try {
      await this._executeSteps(script.steps);
    } catch (err) {
      if (err.message !== 'INTERRUPTED') {
        console.error(`[GolfScript] Error in ${script.name}:`, err.message);
      }
    } finally {
      this._currentScript = null;
      this.context.currentScript = null;
      this._running = false;
    }
  }

  interrupt(reason) {
    this._running = false;
    this.context.interrupted = true;
  }

  get isRunning() {
    return this._running;
  }

  updateContext(updates) {
    Object.assign(this.context, updates);
  }

  startAutoRun(tickMs = 3000) {
    this._tickInterval = setInterval(() => {
      this.mood.tick();
      if (!this._running) {
        this._pickNextScript();
      }
    }, tickMs);
  }

  stopAutoRun() {
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = null;
    }
  }

  _pickNextScript() {
    const scripts = [...this.scripts.keys()];
    if (scripts.length === 0) return;
    this.run(scripts[0]);
  }

  async _executeSteps(steps) {
    for (const step of steps) {
      if (!this._running) throw new Error('INTERRUPTED');
      await this._executeStep(step);
      await this._naturalDelay();
    }
  }

  async _executeStep(step) {
    if (!this._running) throw new Error('INTERRUPTED');

    switch (step.type) {
      case 'action':
        try {
          await step.fn(this.context);
        } catch (e) {
          console.error(`[GolfScript] Action "${step.name}" error:`, e.message);
        }
        break;

      case 'chat': {
        if (Math.random() > this.mood.chattiness) break;
        if (Date.now() - this.context.lastChatTime < 2500) break;
        const msg = step.pick();
        if (msg && typeof msg === 'string') {
          this.bot.chat(msg);
          this.context.lastChatTime = Date.now();
        }
        break;
      }

      case 'wait':
        await this._wait(step.ms * (2 - this.mood.speedMultiplier));
        break;

      case 'throw_disc': {
        const result = this._onThrow
          ? await this._onThrow(step.opts, this.context)
          : { landing: 'parked', distance: this.context.distanceToBasket };
        this.context.lastShotResult = result;
        this.context.strokes++;
        this.context.distanceToBasket = result.distance ?? 0;

        // League ledger: record the throw as a decision (flag-gated,
        // read-only — does not touch result, context, or physics).
        recordThrow({
          agent: this.context.agentName ?? this.bot?.username ?? null,
          script: this.context.currentScript,
          hole: this.context.hole,
          par: this.context.par,
          disc: step.opts?.disc ?? this.context.discInHand,
          shot: {
            // When execution noise is on, the physics returns the
            // shot as actually executed — the ledger records what
            // the hand did, not just what the brain intended.
            power: result.shot?.power ?? step.opts?.power ?? null,
            hyzer: result.shot?.hyzer ?? step.opts?.hyzer ?? null,
            aimYaw: result.shot?.aimYaw ?? step.opts?.aimYaw ?? null,
            aimPitch: result.shot?.aimPitch ?? step.opts?.aimPitch ?? null,
          },
          wind: {
            speed: this.context.windSpeed ?? 0,
            direction: this.context.windDirection ?? 0,
          },
          outcome: {
            landing: result.landing ?? null,
            distance: result.distance ?? null,
            strokes: this.context.strokes,
          },
        });

        // Mood shift based on result
        if (result.landing === 'parked' || result.landing === 'in_basket') {
          this.mood.shift(0.1);
        } else if (result.landing === 'obstacle' || result.landing === 'short') {
          this.mood.shift(-0.08);
        } else if (result.landing === 'left' || result.landing === 'right') {
          this.mood.shift(-0.04);
        }
        break;
      }

      case 'walk_to_tee':
      case 'walk_to_basket':
        if (this._onWalk) await this._onWalk(step.type, this.context);
        break;

      case 'celebrate':
      case 'complain':
      case 'read_card':
        // Personality scripts override these with chat steps; defaults are no-ops
        break;

      case 'branch': {
        const result = step.condition();
        const branch = result ? step.ifTrue : step.ifFalse;
        if (Array.isArray(branch)) {
          await this._executeSteps(branch);
        } else {
          await this._executeStep(branch);
        }
        break;
      }

      case 'goto': {
        const target = this.scripts.get(step.scriptName);
        if (target) await this._executeSteps(target.steps);
        break;
      }

      case 'set':
        this.context[step.key] = step.value;
        break;

      case 'noop':
        break;
    }
  }

  _naturalDelay() {
    return this._wait(300 + Math.random() * 500 * this.mood.speedMultiplier);
  }

  _wait(ms) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, ms);
      this._interruptReject = () => {
        clearTimeout(timeout);
        reject(new Error('INTERRUPTED'));
      };
    });
  }
}
