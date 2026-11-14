# The deliberation ledger

Implements study section D (`claude-code-study.md`) over the league's real
records. This directory sits inside `~/craftmind-league/ledger/` — the
governor's live directory (`mind-calls.jsonl` is its receipt file and is only
ever READ here). The chronicle lane's directory is separate and untouched.

## Reproduce everything (one command each, Node stdlib only)

```
node build.js                  # -> out/call-ledger.jsonl, out/per-day.json, out/budget.json
node fixtures/run-fixtures.js  # -> out/fixture-rulings.json
node gate.js <plan.json>       # rule on any proposed day plan
```

## Feeds (the noticing report #2 correction, built in)

The governor ledger alone saw almost none of programme day 2026-11-09, so the
ledger is fed by four adapters:

- `feeds/trace-feed.js` — direct-drive traces (per-cycle route, usage, cost).
  This is the source of every citizen-day driver number.
- `feeds/governor-feed.js` — the governor ledger as one feed among several:
  reconciliation of governor-routed trace cycles (±5% per study D.3) and
  coverage accounting. Never a source of day numbers.
- `feeds/commission-feed.js` + `feeds/commissions.jsonl` — seat commissions,
  Director windows, benches, entered from their filings
  (format: `feeds/commissions.md`). `calls: null` = UNMETERED, never estimated.
- `feeds/consult-feed.js` — the consult stores (judge class, counts only).

## The gate's discipline

`gate.js` rules on plans, on paper. It has no import path to any driver, bot,
or live system, by construction. A breach may change who is asked or when —
never whether the body runs.
