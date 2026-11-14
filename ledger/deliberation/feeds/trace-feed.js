// FEED A — direct-drive traces (the provider-route feed the noticing report demanded).
// Reads pulse/direct-drive-trace*.jsonl; every `cycle` row is one brain call with
// route + usage; `model-fail` / `parse-fail` rows are calls that consumed a request
// but left no usage record — they are emitted flagged and EXCLUDED from wc totals.
// Tier weights are FROZEN per study D.2: capable 1.0, fallback 0.1.
// Route->tier is evidence-based: the day records name DeepInfra primary/capable and
// the governor (Qwen3-Coder-30B presence brain) as the FALLBACK identity, entered
// only on brain-call failure (failover rows in the traces themselves).
'use strict';
const fs = require('fs');
const path = require('path');

const DAY_FILES = {
  1: 'direct-drive-trace-day1-20261108.jsonl',
  2: 'direct-drive-trace-day2-20261109.jsonl',
  3: 'direct-drive-trace-day3-20261109.jsonl',
  4: 'direct-drive-trace.jsonl',
  5: 'direct-drive-trace-day5-20261109.jsonl',
  6: 'direct-drive-trace-day6-20261109.jsonl',
  7: 'direct-drive-trace-day7-20261109.jsonl',
  9: 'direct-drive-trace-day9-20261109.jsonl',
  10: 'direct-drive-trace-day10-20261109.jsonl',
  // Days 11-16 added by the feeds-completion lane (FEEDS-IMPL-20261109):
  // their traces live at the pulse root under the -20261110 suffix.
  11: 'direct-drive-trace-day11-20261110.jsonl',
  12: 'direct-drive-trace-day12-20261110.jsonl',
  13: 'direct-drive-trace-day13-20261110.jsonl',
  14: 'direct-drive-trace-day14-20261110.jsonl',
  15: 'direct-drive-trace-day15-20261110.jsonl',
  16: 'direct-drive-trace-day16-20261110.jsonl',
  // day 8: no trace exists — the citizen was not woken (aim proof only).
  // day 17: no trace exists — the day never launched (rehearsal gate held).
};

function tierOf(route) {
  if (!route) return { tier: 'unknown', weight: null };
  if (route.startsWith('deepinfra')) return { tier: 'capable', weight: 1.0 };
  if (route.startsWith('governor')) return { tier: 'fallback', weight: 0.1 };
  return { tier: 'unknown', weight: null };
}

// precondition_class: FOOD BAND ONLY. The trace hp field on the day 1-5 drivers is
// mis-scaled/stuck (tension filing TENSION-IMPL-20261109: day 2 constant 0.1333
// across a deathless active day), so hp is not a groundable precondition in this
// archive. Food is integer and cross-checks clean against the day records.
function foodBand(food) {
  if (typeof food !== 'number') return 'unknown';
  if (food >= 10) return 'fed';
  if (food >= 4) return 'hungry';
  return 'starving';
}

function targetClass(cmd, result) {
  const parts = cmd.split(/\s+/);
  const verb = parts[0];
  switch (verb) {
    case 'craft': case 'equip': return parts[1] || 'unspecified';
    case 'place': return parts[1] || 'unspecified';
    case 'gotoentity': case 'attack': return parts[1] || 'unspecified';
    case 'dig': {
      if (result && result.ok && typeof result.detail === 'string') {
        const m = result.detail.match(/^dug ([a-z0-9_]+)/);
        if (m) return m[1];
      }
      return 'unresolved'; // intended block is not recoverable from the trace
    }
    case 'felltree': return 'tree';
    case 'goto': case 'climb': case 'look': return 'position';
    case 'collect': return 'drops';
    case 'eat': return 'food';
    case 'wait': return 'time';
    default: return 'unspecified';
  }
}

function decisionKey(row) {
  if (!row.cmd) return null;
  const verb = row.cmd.split(/\s+/)[0];
  return `${verb}|${targetClass(row.cmd, row.result)}|${foodBand(row.food)}`;
}

function loadDay(pulseDir, day) {
  const file = DAY_FILES[day];
  const full = path.join(pulseDir, file);
  const rows = [];
  for (const line of fs.readFileSync(full, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch (e) { /* torn line: skipped, counted below */ }
  }
  const cycles = rows.filter(r => r.kind === 'cycle');
  const failedCalls = rows.filter(r => r.kind === 'model-fail' || r.kind === 'parse-fail');
  const calls = cycles.map(r => {
    const t = tierOf(r.route);
    const u = r.usage || {};
    return {
      ts: r.ts, citizen_day: day, citizen: 'cody', caller_class: 'driver',
      model: r.model || null, route: r.route || null,
      tier: t.tier, weight: t.weight, wc: t.weight,
      trigger: 'cycle',
      tokens_in: u.prompt_tokens ?? null, tokens_out: u.completion_tokens ?? null,
      tokens_cached: (u.prompt_tokens_details && u.prompt_tokens_details.cached_tokens) ?? null,
      usd_est: u.estimated_cost ?? null,
      decision_key: decisionKey(r),
      outcome_ref: `${file}#cycle-${r.cycle}`,
      outcome_ok: !!(r.result && r.result.ok),
      compiled_alt: null, source: 'trace-feed', flags: [],
    };
  });
  const failed = failedCalls.map(r => ({
    ts: r.ts, citizen_day: day, citizen: 'cody', caller_class: 'driver',
    model: null, route: null, tier: 'unknown', weight: null, wc: null,
    trigger: r.kind, tokens_in: null, tokens_out: null, tokens_cached: null,
    usd_est: null, decision_key: null, outcome_ref: `${file}#${r.kind}-${r.cycle ?? '?'}`,
    outcome_ok: false, compiled_alt: null, source: 'trace-feed',
    flags: ['failed-call-no-usage', 'excluded-from-wc'],
  }));
  const first = cycles.length ? cycles[0].ts : null;
  const last = cycles.length ? cycles[cycles.length - 1].ts : null;
  const activeMinutes = cycles.length >= 2
    ? (Date.parse(last) - Date.parse(first)) / 60000 : 0;
  const wc = calls.reduce((s, c) => s + (c.wc || 0), 0);
  const okActs = calls.filter(c => c.outcome_ok).length;
  const byRoute = {};
  for (const c of calls) {
    byRoute[c.route] = byRoute[c.route] || { calls: 0, wc: 0, usd: 0, tokens: 0 };
    byRoute[c.route].calls += 1; byRoute[c.route].wc += c.wc || 0;
    byRoute[c.route].usd += c.usd_est || 0;
    byRoute[c.route].tokens += (c.tokens_in || 0) + (c.tokens_out || 0);
  }
  return {
    day, file, calls, failed,
    stats: {
      cycles: cycles.length, failed_calls: failed.length,
      wc: round(wc), active_minutes: round(activeMinutes),
      beta_wc_per_min: activeMinutes > 0 ? round(wc / activeMinutes, 4) : null,
      unweighted_per_min: activeMinutes > 0 ? round(cycles.length / activeMinutes, 4) : null,
      visible_acts_ok: okActs,
      kappa_wc_per_act: okActs > 0 ? round(wc / okActs, 4) : null,
      usd_est: round(calls.reduce((s, c) => s + (c.usd_est || 0), 0), 4),
      tokens: calls.reduce((s, c) => s + (c.tokens_in || 0) + (c.tokens_out || 0), 0),
      by_route: byRoute, first_cycle_ts: first, last_cycle_ts: last,
      span_first_row_ts: rows.length ? rows[0].ts : null,
      span_last_row_ts: rows.length ? rows[rows.length - 1].ts : null,
      governor_cycles: calls.filter(c => (c.route || '').startsWith('governor')).length,
    },
  };
}

function round(x, d = 2) { const p = 10 ** (d ?? 2); return Math.round(x * p) / p; }

function loadAll(pulseDir) {
  const days = {};
  for (const d of Object.keys(DAY_FILES)) days[d] = loadDay(pulseDir, Number(d));
  return days;
}

module.exports = { loadAll, DAY_FILES, tierOf, decisionKey };
