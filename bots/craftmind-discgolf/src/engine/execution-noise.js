/**
 * execution-noise.js — practice-shrinking execution noise for Engine A.
 *
 * WHY THIS EXISTS (CRAFTMIND-MAP §2.2 / §5.5 item 2): upstream
 * simulateThrow is deterministic — given disc, power, hyzer, aim and
 * wind it produces the identical flight every time. A league on a
 * noiseless arm can only ever measure *selection* quality, never
 * *execution* growth. This module adds the missing half: the thrower's
 * hand. The intended shot (what the decision layer chose) is perturbed
 * by Gaussian release noise whose magnitude shrinks as the agent's
 * lifetime throws_taken grows — practice, as a physical quantity.
 *
 * Flag: active only when env LEAGUE_NOISE=1 AND the caller passes a
 * skill state. Flag off (or no state) = simulateThrow is untouched,
 * byte-identical to upstream.
 *
 * THE MODEL
 *   sigmaScale(throws) = FLOOR + (1 - FLOOR) * exp(-throws / TAU)
 *   power'  = clamp(power  + N(0, POWER_SIGMA  * sigmaScale), 0.05, 1)
 *   hyzer'  = clamp(hyzer  + N(0, HYZER_SIGMA  * sigmaScale), -60, 60)
 *   aimYaw' = aimYaw       + N(0, AIM_SIGMA    * sigmaScale)
 *
 * CONSTANTS, and why:
 *   POWER_SIGMA = 0.13 — a true beginner's power scatter: ±13% of
 *     intended power (1σ). At Engine A distances (~3–8 units) that is
 *     a ±1-unit distance spray on a drive — visible on every hole,
 *     the difference between parked and a comeback putt.
 *   HYZER_SIGMA = 9° — release-angle scatter for a new arm. Hyzer is
 *     the strongest lateral lever in the integrator (0.03 force per
 *     degree, plus it stacks with turn/fade), so 9° of wobble is
 *     honestly spray, not decoration.
 *   AIM_SIGMA = 6.5° — where the disc is pointed vs where the brain
 *     aimed it. Slightly under hyzer scatter: gross aim is easier
 *     than release angle, in disc golf as in the model.
 *   FLOOR = 0.18 — nobody becomes a machine. A fully practised arm
 *     keeps 18% of the rookie scatter (power σ ≈ 2.3%, hyzer ≈ 1.6°,
 *     aim ≈ 1.2°): tight grouping, still human, still able to miss.
 *   TAU = 180 throws — the practice time constant. exp decay means
 *     ~63% of the closable gap closes in the first TAU throws
 *     (≈ 5–6 league rounds): a rookie visibly improves *within a
 *     season*, and a veteran at 800+ throws sits essentially on the
 *     floor. Chosen so a single round (~30 throws) helps a little —
 *     throws_taken moves during play — but cannot max a skill.
 *
 * The RNG is injectable (seeded in tests and in the round runner) so
 * a battery of throws is reproducible; without one, Math.random is
 * used. Skill state is a plain object { throwsTaken } that
 * simulateThrow increments once per noisy throw — the state IS the
 * agent's career record, persisted by the caller.
 */

export const NOISE_CONSTANTS = Object.freeze({
  POWER_SIGMA: 0.13,
  HYZER_SIGMA_DEG: 9,
  AIM_SIGMA_DEG: 6.5,
  FLOOR: 0.18,
  TAU: 180,
});

export function executionNoiseEnabled() {
  return process.env.LEAGUE_NOISE === '1';
}

/** Normalised scatter scale for a career throw count: 1 → FLOOR. */
export function sigmaScale(throwsTaken, constants = NOISE_CONSTANTS) {
  const n = Math.max(0, throwsTaken || 0);
  return constants.FLOOR + (1 - constants.FLOOR) * Math.exp(-n / constants.TAU);
}

/** mulberry32 — tiny deterministic PRNG for reproducible batteries. */
export function seededRng(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal sample via Box–Muller over a uniform rng. */
export function gaussian(rng = Math.random) {
  let u = 0;
  while (u === 0) u = rng();
  const v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Perturb an intended shot by the thrower's execution noise.
 * Does NOT increment the counter — simulateThrow does that once the
 * throw actually happens.
 *
 * @param {{power:number, hyzer:number, aimYaw:number}} shot - intended
 * @param {{throwsTaken:number}} skillState
 * @param {() => number} [rng]
 * @returns {{power:number, hyzer:number, aimYaw:number,
 *            noise:{sigmaScale:number, dPower:number, dHyzer:number, dAimYaw:number}}}
 */
export function applyExecutionNoise(shot, skillState, rng = Math.random, constants = NOISE_CONSTANTS) {
  const scale = sigmaScale(skillState?.throwsTaken, constants);
  const dPower = gaussian(rng) * constants.POWER_SIGMA * scale;
  const dHyzer = gaussian(rng) * constants.HYZER_SIGMA_DEG * scale;
  const dAimYaw = gaussian(rng) * constants.AIM_SIGMA_DEG * scale;
  return {
    power: clamp(shot.power + dPower, 0.05, 1),
    hyzer: clamp(shot.hyzer + dHyzer, -60, 60),
    aimYaw: shot.aimYaw + dAimYaw,
    noise: {
      sigmaScale: +scale.toFixed(4),
      dPower: +dPower.toFixed(4),
      dHyzer: +dHyzer.toFixed(2),
      dAimYaw: +dAimYaw.toFixed(2),
    },
  };
}
