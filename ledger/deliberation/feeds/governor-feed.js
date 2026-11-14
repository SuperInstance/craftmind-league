// FEED B — the governor ledger (ledger/mind-calls.jsonl), demoted to ONE FEED
// AMONG SEVERAL. Its job in the deliberation ledger is (1) reconciliation of the
// governor-routed trace cycles (study D.3: reconcile daily, tolerance ±5%) and
// (2) coverage accounting for governor-route traffic that has no trace
// (the pre-direct-drive era, other programmes' citizens). It is NEVER the source
// of a citizen-day driver number — the traces are.
//
// RECONCILIATION SEMANTICS (F1 fix, ledger/F1-F2-20261109.md): the receipt
// book counts EVERY governor attempt; the trace counts only cycles that
// became driver cycle rows on the fallback route. The original matcher
// compared ALL receipts (any status) against span-matched trace cycles, and
// day 12's HTTP-400 rejection storm (70 receipts, 04:33:36Z-04:37:30Z, every
// one inside the day-12 span, zero of them ever a cycle) made the headline
// deviation +84 = +16.0%. The books are now reconciled BY CLASS, never by
// editing either to match: receipts-served (status 200) vs trace cycles;
// receipts-rejected (status != 200 — attempts the route refused, which can
// never appear as cycles); cycles-unreceipted (trace governor cycles beyond
// served receipts in span). The ±5% test applies to served-vs-cycles ONLY.
'use strict';
const fs = require('fs');

function load(governorPath) {
  const rows = [];
  for (const line of fs.readFileSync(governorPath, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch (e) { /* torn line skipped */ }
  }
  return rows;
}

// Reconcile: for each traced day, governor receipt rows for agent `cody-driver`
// inside the day's full trace span, split by class, vs governor-routed cycle
// rows in the trace. See the header for the class semantics.
function reconcile(rows, traceDays) {
  const receipts = rows.filter(r => r.agent === 'cody-driver');
  const spans = Object.values(traceDays).map(d => [Date.parse(d.stats.span_first_row_ts), Date.parse(d.stats.span_last_row_ts)]);
  const perDay = {};
  let traceGovTotal = 0, servedInSpanTotal = 0;
  for (const [day, d] of Object.entries(traceDays)) {
    const lo = Date.parse(d.stats.span_first_row_ts), hi = Date.parse(d.stats.span_last_row_ts);
    const inSpan = receipts.filter(r => { const t = Date.parse(r.ts); return t >= lo && t <= hi; });
    const served = inSpan.filter(r => r.status === 200).length;
    perDay[day] = {
      trace_governor_cycles: d.stats.governor_cycles,
      governor_receipts_in_span: inSpan.length,
      receipts_served_in_span: served,
      receipts_rejected_in_span: inSpan.length - served,
      cycles_unreceipted_in_span: Math.max(0, d.stats.governor_cycles - served),
      served_deviation: served - d.stats.governor_cycles,
    };
    traceGovTotal += d.stats.governor_cycles;
    servedInSpanTotal += served;
  }
  const outsideSpans = receipts.filter(r => { const t = Date.parse(r.ts); return !spans.some(([lo, hi]) => t >= lo && t <= hi); });
  const outsideServed = outsideSpans.filter(r => r.status === 200).length;
  const rejectedInSpans = Object.values(perDay).reduce((s, v) => s + v.receipts_rejected_in_span, 0);
  const servedTotal = receipts.filter(r => r.status === 200).length;
  const rejectedTotal = receipts.length - servedTotal;
  const servedDeviation = servedTotal - traceGovTotal;
  return {
    per_day: perDay,
    classes: {
      receipts_served_total: servedTotal,
      receipts_served_in_spans: servedInSpanTotal,
      receipts_served_outside_spans: outsideServed,
      receipts_rejected_total: rejectedTotal,
      receipts_rejected_in_spans: rejectedInSpans,
      receipts_rejected_outside_spans: rejectedTotal - rejectedInSpans,
      cycles_unreceipted_in_spans: Object.values(perDay).reduce((s, v) => s + v.cycles_unreceipted_in_span, 0),
    },
    trace_governor_cycles_total: traceGovTotal,
    governor_cody_driver_receipts_total: receipts.length,
    deviation_calls: servedDeviation,
    deviation_pct: traceGovTotal ? +(100 * servedDeviation / traceGovTotal).toFixed(1) : null,
    within_tolerance_5pct: traceGovTotal ? Math.abs(servedDeviation / traceGovTotal) <= 0.05 : null,
    legacy_all_receipts_deviation: {
      deviation_calls: receipts.length - traceGovTotal,
      deviation_pct: traceGovTotal ? +(100 * (receipts.length - traceGovTotal) / traceGovTotal).toFixed(1) : null,
      note: 'The pre-F1 headline figure: ALL receipts (served + rejected + outside-span) vs trace cycles. Retained so the +16.0% breach stays explainable; it mixes classes and is not the D.3 test.',
    },
    note: 'Reconciled by class (F1, ledger/F1-F2-20261109.md): the D.3 ±5% test compares receipts SERVED (status 200) against trace governor cycles, globally as at ledger impl. Rejected receipts are attempts the route refused — they can never be cycles, so they are reported as their own class, never a deviation. Served receipts outside every trace span are probes/wake checks, the impl-era named class.',
  };
}

function coverage(rows) {
  const byAgent = {};
  for (const r of rows) byAgent[r.agent] = (byAgent[r.agent] || 0) + 1;
  return {
    total_rows: rows.length,
    ts_first: rows.length ? rows[0].ts : null,
    ts_last: rows.length ? rows[rows.length - 1].ts : null,
    by_agent: byAgent,
    denied_429: rows.filter(r => r.status === 429).length,
  };
}

module.exports = { load, reconcile, coverage };
