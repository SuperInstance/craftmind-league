'use strict';
/**
 * constitution.js — the floor's constitution as data (study verdict (c), C.2/C.3).
 *
 * The supervisor (F) is ONE of the three things the synthesis called "floor":
 *   - F, supervisor: issues/revokes leases, counts, parks. THIS FILE GOVERNS F.
 *   - a cognition tier ("floor first; capable wakes on novelty") — NOT F.
 *   - reflexes in the body runtime ("the floor never waits") — NOT F.
 * Parties: D driver (proposes commands), G command gate (executes only
 * commands holding a live lease), R reflex layer (own review), F floor.
 *
 * Default-deny: an act not in ACTS does not exist in the floor's code.
 */
const crypto = require('crypto');

// C.2 permitted acts — closed list. `op` names the op-channel command kind the
// act may emit (null = the act emits no world-directed command at all).
const ACTS = {
  OBSERVE:        { op: null },
  COUNT_DEATH:    { op: null },
  LEASE_ISSUE:    { op: null },
  LEASE_REVOKE:   { op: null },
  PARK:           { op: 'park-notify' },
  ASSERT_DAYLIGHT:{ op: 'chat' },   // text is the contract's daylight command
  ASSERT_WEATHER: { op: 'chat' },   // text is the contract's weather command (day-17 weather hold; DAY17 charter sec.3)
  VERIFY_FEED:    { op: 'give' },   // only the contract-declared feed op
  REFUSE_RESUME:  { op: null },
  NOTIFY:         { op: null },
  SELF_PROVE:     { op: null },
  RELEASE_OBSERVED: { op: null },   // observing an external release; NOT a release
};

// C.3 forbidden acts — enumerated so the static check has named targets.
// Everything unlisted in ACTS is also forbidden.
const FORBIDDEN = [
  'goal-directed body commands (move/mine/place/attack)',
  'healing, reviving, or feeding beyond the declared op',
  'any block/entity/mob/weather/gamerule change except ASSERT_DAYLIGHT and ASSERT_WEATHER',
  'editing, deleting, or reclassifying any record',
  'assigning fault',
  'ending the day or issuing a verdict',
  'self-release from PARK',
  'calling any model, or authoring natural language',
  'reading chronicle, tension, viewings, or the ledger',
  'restarting the driver or changing its model route',
  'stopping any process other than through lease revocation',
  'acting on any client other than the declared citizen',
  'changing its own thresholds at runtime',
  'commanding the Director, camera, or narrator',
];

// Fixed NOTIFY reason codes (NOTIFY form: fixed reason code — no prose).
const REASONS = {
  MAX_DEATHS: 'MAX_DEATHS',
  DRIVER_HEARTBEAT_LOST: 'DRIVER_HEARTBEAT_LOST',
  DAYLIGHT_UNRESTORABLE: 'DAYLIGHT_UNRESTORABLE',
  FEED_UNVERIFIED: 'FEED_UNVERIFIED',
  WRITER_CANARY_FAILED: 'WRITER_CANARY_FAILED',
  SENSOR_PATH_BROKEN: 'SENSOR_PATH_BROKEN',
  EVIDENCE_CONTRADICTION: 'EVIDENCE_CONTRADICTION',
  HUMAN_STOP: 'HUMAN_STOP',
  FLOOR_OPEN: 'FLOOR_OPEN',
  FLOOR_CLOSE: 'FLOOR_CLOSE',
};

// PARK triggers (C.2). Keys are trigger_ids used in act rows.
const PARK_TRIGGERS = [
  'deaths_today>=max_deaths',
  'driver_heartbeat_lost',
  'daylight_unrestorable',
  'feed_unverified',
  'own_writer_canary_failed',
  'sensor_path_broken',
  'evidence_contradiction',
  'human_stop',
];

function stableStringify(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}';
}

function contractSha(contract) {
  return crypto.createHash('sha256').update(stableStringify(contract)).digest('hex');
}

function validateContract(c) {
  const bad = [];
  if (!c || typeof c !== 'object') return ['contract is not an object'];
  if (c.constitution !== 'floor.v0') bad.push('constitution must be floor.v0');
  if (!c.citizen) bad.push('citizen missing');
  if (!c.driver_id) bad.push('driver_id missing');
  if (!(Number.isInteger(c.max_deaths) && c.max_deaths >= 1)) bad.push('max_deaths must be a positive integer');
  if (!['held', 'free'].includes(c.daylight)) bad.push('daylight must be "held" or "free"');
  if (c.daylight === 'held' && !c.daylight_issuer) bad.push('daylight_issuer required when daylight is held');
  if (!c.sensor || !c.sensor.trace_path) bad.push('sensor.trace_path missing');
  if (!c.day_window || !c.day_window[0] || !c.day_window[1]) bad.push('day_window [w0,w1] missing');
  const t = c.timers || {};
  for (const k of ['lease_ttl_s', 'heartbeat_lost_s', 'canary_s', 'poll_s']) {
    if (!(typeof t[k] === 'number' && t[k] > 0)) bad.push('timers.' + k + ' must be a positive number');
  }
  // launch_window_s (repair charter (a), FLOOR-REPAIR-20261109.md): the
  // declared LAUNCH-state window after LEASE_ISSUE during which the
  // heartbeat-lost clock is not yet running. Optional; when present it
  // must be a positive number. When absent the floor falls back to
  // timers.heartbeat_lost_s as the window (documented fallback, not a
  // second constant).
  if (c.launch_window_s != null && !(typeof c.launch_window_s === 'number' && c.launch_window_s > 0)) {
    bad.push('launch_window_s must be a positive number when present');
  }
  // daylight_verify_window_s (rig-repair charter, RIG-REPAIR-20261109.md):
  // how long ASSERT_DAYLIGHT polls the server-log mirror for the
  // issuer-specific landing line after the op channel responds. The
  // response itself takes ~2.7 s live (the op bot answers only after it
  // sees the server apply the command), so a window below 3 s can be
  // structurally too short; the charter pins a value reasoned from that
  // measurement (5000 ms class). Optional; when present it must be a
  // positive number. When absent the floor falls back to 5000 ms
  // (documented fallback in floor.js, not a second constant).
  if (c.daylight_verify_window_s != null && !(typeof c.daylight_verify_window_s === 'number' && c.daylight_verify_window_s > 0)) {
    bad.push('daylight_verify_window_s must be a positive number when present');
  }
  // weather (day-17 weather hold, DAY17-CHARTER sec.3): an OPTIONAL
  // contract term beside daylight. When present it must carry the
  // command, the issuer, and positive check/verify numbers; when
  // absent the floor asserts no weather (the day-16-and-earlier form).
  if (c.weather != null) {
    const w = c.weather;
    if (typeof w !== 'object') bad.push('weather must be an object when present');
    else {
      if (!w.command || typeof w.command !== 'string' || w.command[0] !== '/') bad.push('weather.command must be a server command string');
      if (!w.issuer) bad.push('weather.issuer required when weather is present');
      if (!(typeof w.check_s === 'number' && w.check_s > 0)) bad.push('weather.check_s must be a positive number');
      if (w.verify_window_s != null && !(typeof w.verify_window_s === 'number' && w.verify_window_s > 0)) bad.push('weather.verify_window_s must be a positive number when present');
    }
  }
  return bad;
}

module.exports = { ACTS, FORBIDDEN, REASONS, PARK_TRIGGERS, contractSha, validateContract, stableStringify };
