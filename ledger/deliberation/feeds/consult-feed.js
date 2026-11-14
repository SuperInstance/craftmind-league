// FEED D — the consult stores (commons/consults/*.jsonl). Each line is one
// citizen consult: a model call whose output is a judgement about state or
// quality — caller_class `judge` under the study D.1 definition. The stores
// record the question and the verdict's context but no token usage, so these
// rows carry calls with tokens GAP (null), wc at the capable tier weight is NOT
// assumed — wc stays null and the count is reported beside the budget, because
// the consult routes (seat subscriptions / consult APIs) have no frozen tier
// assignment in the study. Counts only; never folded into the driver baseline.
'use strict';
const fs = require('fs');
const path = require('path');

function load(consultsDir) {
  const rows = [];
  const files = fs.readdirSync(consultsDir).filter(f => f.endsWith('.jsonl'));
  for (const f of files) {
    for (const line of fs.readFileSync(path.join(consultsDir, f), 'utf8').split('\n')) {
      if (!line.trim()) continue;
      let r; try { r = JSON.parse(line); } catch (e) { continue; }
      rows.push({
        ts: r.ts, citizen_day: null, citizen: r.citizen || null,
        caller_class: 'judge', model: null, route: `consult:${r.community}`,
        tier: 'unmetered', weight: null, wc: null, trigger: 'consult',
        tokens_in: null, tokens_out: null, tokens_cached: null, usd_est: null,
        decision_key: null, outcome_ref: `commons/consults/${f}#${r.id}`,
        outcome_ok: null, compiled_alt: null, source: 'consult-feed',
        flags: ['tokens-not-recorded'],
      });
    }
  }
  return rows;
}

module.exports = { load };
