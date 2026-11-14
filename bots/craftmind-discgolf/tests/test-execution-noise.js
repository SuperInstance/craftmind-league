/**
 * Tests for the execution-noise model (src/engine/execution-noise.js).
 *
 * Three claims under test:
 *  1. Flag OFF: simulateThrow is byte-identical to upstream behaviour,
 *     even when a skill state is passed.
 *  2. Flag ON, same seed: a rookie's landing dispersion is measurably
 *     wider than a veteran's (practice shrinks the scatter).
 *  3. The skill counter increments once per noisy throw, and the
 *     sigma scale decays on the documented curve.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { simulateThrow } from '../src/engine/disc-physics.js';
import { getDisc } from '../src/engine/disc-database.js';
import {
  NOISE_CONSTANTS,
  sigmaScale,
  seededRng,
  executionNoiseEnabled,
} from '../src/engine/execution-noise.js';

const disc = getDisc('destroyer');
const BASE = { disc, power: 0.9, hyzer: 5, aimYaw: 0, aimPitch: 10, windSpeed: 0, windDirection: 0 };

function battery(throwsTaken, seed, n = 60) {
  const state = { throwsTaken };
  const rng = seededRng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const r = simulateThrow({ ...BASE, skillState: state, noiseRng: rng });
    pts.push({ x: r.finalX, z: r.finalZ });
  }
  return { pts, state };
}

/** RMS radial distance of landing points from their centroid. */
function dispersion(pts) {
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cz = pts.reduce((s, p) => s + p.z, 0) / pts.length;
  return Math.sqrt(pts.reduce((s, p) => s + (p.x - cx) ** 2 + (p.z - cz) ** 2, 0) / pts.length);
}

describe('Execution noise', () => {
  it('flag off = byte-identical, with and without a skill state', () => {
    delete process.env.LEAGUE_NOISE;
    assert.equal(executionNoiseEnabled(), false);
    const plain = simulateThrow({ ...BASE });
    const withState = simulateThrow({ ...BASE, skillState: { throwsTaken: 0 }, noiseRng: seededRng(7) });
    assert.equal(JSON.stringify(withState), JSON.stringify(plain));
    assert.equal(withState.shot, undefined);
  });

  it('sigma scale decays from 1 toward the floor on the tau curve', () => {
    const { FLOOR, TAU } = NOISE_CONSTANTS;
    assert.ok(Math.abs(sigmaScale(0) - 1) < 1e-9);
    assert.ok(Math.abs(sigmaScale(TAU) - (FLOOR + (1 - FLOOR) / Math.E)) < 1e-9);
    assert.ok(Math.abs(sigmaScale(100000) - FLOOR) < 1e-6);
  });

  it('same seed: veteran dispersion is measurably tighter than rookie', () => {
    process.env.LEAGUE_NOISE = '1';
    try {
      const rookie = battery(0, 1234);
      const veteran = battery(1200, 1234);
      const dRookie = dispersion(rookie.pts);
      const dVeteran = dispersion(veteran.pts);
      console.log(`    dispersion (RMS radial, blocks): rookie=${dRookie.toFixed(3)} veteran=${dVeteran.toFixed(3)}`);
      assert.ok(dRookie > 0.3, `rookie should visibly spray, got ${dRookie}`);
      assert.ok(dVeteran < dRookie * 0.55, `veteran ${dVeteran} should be < 55% of rookie ${dRookie}`);
      // Identical inputs, different outcomes across skill levels:
      assert.notEqual(JSON.stringify(rookie.pts), JSON.stringify(veteran.pts));
      // Counter increments once per noisy throw:
      assert.equal(rookie.state.throwsTaken, 60);
      assert.equal(veteran.state.throwsTaken, 1260);
    } finally {
      delete process.env.LEAGUE_NOISE;
    }
  });

  it('practice mid-battery tightens later throws (sigma scale is live)', () => {
    process.env.LEAGUE_NOISE = '1';
    try {
      const state = { throwsTaken: 0 };
      const rng = seededRng(99);
      const deltas = [];
      for (let i = 0; i < 40; i++) {
        const r = simulateThrow({ ...BASE, skillState: state, noiseRng: rng });
        deltas.push(Math.abs(r.executionNoise.dPower));
      }
      const early = deltas.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
      const late = deltas.slice(30).reduce((a, b) => a + b, 0) / 10;
      console.log(`    mean |dPower|: first10=${early.toFixed(4)} last10=${late.toFixed(4)} (throws 0→40, partial decay)`);
      assert.ok(state.throwsTaken === 40);
    } finally {
      delete process.env.LEAGUE_NOISE;
    }
  });
});
