/**
 * Disc Selector — Pure heuristic disc selection AI.
 *
 * Given distance, wind, and obstacles, recommends a disc + reason.
 * No LLM needed.
 */

import { discs, stability, stabilityLabel } from '../engine/disc-database.js';

/**
 * @typedef {Object} DiscRecommendation
 * @property {Object} disc - disc object from database
 * @property {string} reason - human-readable reason
 * @property {string} throwType - 'backhand' | 'forehand' | 'putt'
 * @property {number} suggestedPower - 0-1
 * @property {number} suggestedHyzer - degrees
 */

/**
 * Recommend a disc for the given conditions.
 *
 * @param {Object} opts
 * @param {number} opts.distance - distance to basket in blocks/feet
 * @param {number} opts.windSpeed - wind speed in blocks/s (0-10 typical)
 * @param {number} opts.windAngle - angle from throw direction (0=tailwind, 180=headwind, 90=right crosswind)
 * @param {number} opts.obstacles - number of obstacles (0-5)
 * @param {'par3'|'par4'|'par5'} opts.par
 * @returns {DiscRecommendation}
 */
export function recommendDisc({ distance, windSpeed = 0, windAngle = 90, obstacles = 0, par }) {
  const isHeadwind = windAngle > 120 && windAngle < 240;
  const isTailwind = windAngle < 60 || windAngle > 300;
  const isCrosswind = !isHeadwind && !isTailwind;
  const windSignificant = windSpeed > 3;

  let candidates;
  let reason = '';

  // ── Distance-based disc type selection ──────────
  if (distance < 150) {
    // Putting range
    candidates = discs.filter(d => d.type === 'putter');
    reason = windSignificant
      ? `${distance}ft putt. Wind's a factor — keep it low.`
      : `${distance}ft — pure putting range.`;
  } else if (distance < 250) {
    // Approach range
    if (obstacles >= 2) {
      // Lots of obstacles — trust a midrange
      candidates = discs.filter(d => d.type === 'midrange');
      reason = `${distance}ft through trees. Midrange for control.`;
    } else {
      candidates = discs.filter(d => d.type === 'midrange' || d.type === 'putter');
      reason = `${distance}ft approach. Need accuracy here.`;
    }
  } else if (distance < 350) {
    // Fairway driver range
    if (obstacles >= 3) {
      candidates = discs.filter(d => d.type === 'fairway_driver' || d.type === 'midrange');
      reason = `${distance}ft but tight. Fairway driver or mid, no heroics.`;
    } else {
      candidates = discs.filter(d => d.type === 'fairway_driver');
      reason = `${distance}ft — fairway driver territory.`;
    }
  } else {
    // Distance driver range
    candidates = discs.filter(d => d.type === 'distance_driver' || d.type === 'fairway_driver');
    reason = `${distance}ft — let it rip.`;
  }

  // ── Wind adjustments ───────────────────────────
  if (isHeadwind && windSignificant) {
    // Headwind: need more overstable disc (it'll fight the wind)
    candidates = candidates.filter(d => stability(d) >= 2);
    reason += ' Headwind — something overstable to fight through it.';
  } else if (isTailwind && windSignificant) {
    // Tailwind: understable disc rides the wind longer
    candidates = candidates.filter(d => stability(d) <= 3);
    reason += ' Tailwind lets an understable disc carry.';
  } else if (isCrosswind && windSignificant) {
    // Crosswind: overstable for control
    if (windAngle > 180) {
      // Left-to-right crosswind (for RHBH)
      candidates = candidates.filter(d => stability(d) >= 2.5);
      reason += ' Crosswind — need something beefy to hold the line.';
    } else {
      // Right-to-left
      candidates = candidates.filter(d => stability(d) <= 3.5);
      reason += ' Crosswind from the right — understable disc should flip up nice.';
    }
  }

  // ── Obstacle adjustments ───────────────────────
  if (obstacles >= 3 && candidates.length > 1) {
    // Prefer slower, more predictable discs
    candidates = candidates.filter(d => d.speed <= 9);
  }

  // ── Pick the best candidate ────────────────────
  if (candidates.length === 0) {
    // Fallback: any disc of the right type
    candidates = discs.filter(d => d.type === (distance < 150 ? 'putter' : distance < 250 ? 'midrange' : 'fairway_driver'));
  }

  // Score candidates based on fit
  const scored = candidates.map(d => {
    let score = 0;
    // Prefer stability matching wind
    if (isHeadwind && stability(d) >= 3) score += 3;
    if (isTailwind && d.turn <= -1) score += 3;
    // Prefer appropriate speed
    if (distance < 200 && d.speed <= 5) score += 2;
    if (distance > 300 && d.speed >= 10) score += 2;
    // Penalty for too fast in tight spaces
    if (obstacles >= 3 && d.speed >= 10) score -= 2;
    // Bonus for classic/reliable discs
    if (['buzzz', 'teebird', 'destroyer', 'aviar', 'roc3', 'wraith'].includes(d.id)) score += 1;
    return { disc: d, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const pick = scored[0].disc;

  // ── Determine throw type and power ─────────────
  let throwType, suggestedPower, suggestedHyzer;

  if (distance < 150) {
    throwType = 'putt';
    suggestedPower = Math.min(1, distance / 150 * 0.6 + 0.2);
    suggestedHyzer = 0;
  } else if (distance < 350) {
    throwType = Math.random() > 0.3 ? 'backhand' : 'forehand';
    suggestedPower = Math.min(1, distance / 450 + 0.25);
    suggestedHyzer = obstacles >= 2 ? (Math.random() > 0.5 ? 15 : -15) : 5;
  } else {
    throwType = 'backhand';
    suggestedPower = Math.min(1, distance / 400 + 0.35);
    suggestedHyzer = isHeadwind ? 10 : -5;
  }

  return {
    disc: pick,
    reason,
    throwType,
    suggestedPower,
    suggestedHyzer,
  };
}

/**
 * Recommend a disc by name. For personality scripts that want specific discs.
 */
export function getDiscByName(name) {
  const lower = name.toLowerCase();
  return discs.find(d =>
    d.name.toLowerCase() === lower ||
    d.id.toLowerCase() === lower ||
    (d.manufacturer.toLowerCase() + ' ' + d.name.toLowerCase()) === lower
  ) ?? null;
}
