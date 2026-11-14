// FEED C — commissions & filings. Seat commissions, Director windows, and bench
// runs do not pass through any provider meter the house owns; they are entered
// from their filings in feeds/commissions.jsonl (format: feeds/commissions.md).
// An entry with calls=null is UNMETERED — a routing fact with evidence, never an
// estimate. This adapter validates the file and passes entries through as
// ledger rows whose wc is null until a meter exists for that route.
'use strict';
const fs = require('fs');

function load(file) {
  const entries = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const e = JSON.parse(line);
    if (!e.id || !e.caller_class || !e.evidence) {
      throw new Error(`commission entry missing id/caller_class/evidence: ${line.slice(0, 80)}`);
    }
    entries.push({
      ts: e.ts, citizen_day: e.programme_day ?? null, citizen: null,
      caller_class: e.caller_class, agent: e.agent || null,
      model: e.model || null, route: e.route || null,
      tier: 'unmetered', weight: null, wc: null,
      trigger: 'commission',
      tokens_in: null, tokens_out: null, tokens_cached: null,
      usd_est: e.usd_est ?? null,
      calls: e.calls, // number | null (null = UNMETERED)
      decision_key: null, outcome_ref: e.evidence, compiled_alt: null,
      source: 'commission-feed',
      flags: e.calls === null ? ['unmetered-no-count-in-filing'] : [],
      note: e.note || null,
    });
  }
  return entries;
}

module.exports = { load };
