# Round 0 — failed attempt (invalid, quarantined)

The first round-runner launch (2026-11-06T01:34Z) never attached its
onThrow arm to the GolfScriptRunner, so every throw_disc step fell
back to the runner stub result ({landing: parked, distance:
context.distanceToBasket}) — no physics ran, no noise engaged, every
hole maxed at 8 stub strokes, and 216 narration calls were spent
narrating throws that never happened. The bogus ledger lines are
preserved verbatim in round-0-failed-events.jsonl (216) and
round-0-failed-mind-calls.jsonl (216); the league ledgers were
restored to their pre-attempt state (events empty, mind-calls = the
single cody setup receipt) so the league record begins with real
rounds, the same treatment the harness proof line got. Bug fixed in
round-runner.mjs (onThrow attached to the runner via a per-throw
holder); Round 1 was re-run for real.
