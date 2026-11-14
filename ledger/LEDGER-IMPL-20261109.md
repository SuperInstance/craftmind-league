# LEDGER + BUDGETS GATE — IMPLEMENTATION FILING

**Lane:** ledger-budgets (build order: ledger → budgets gate). **Date:** 2026-11-09.
**Spec:** Claude Code study §D (`~/workspace/studies/minecraft-research-takes-20261109/claude-code-study.md`)
+ synthesis addendum (d). **Binding correction applied:** Noticing report #2 —
the governor ledger recorded nothing from days 9/10, the deliberation, the
Director's windows, or the benches, so this ledger is fed from non-governor
routes by construction.

**Build:** `~/craftmind-league/ledger/deliberation/` (inside the governor's
live `ledger/` directory, which is only ever READ — `mind-calls.jsonl` is its
receipt file, untouched). Reproduce everything, Node stdlib only:

```
node build.js                  # out/call-ledger.jsonl, out/per-day.json, out/budget.json
node fixtures/run-fixtures.js  # out/fixture-rulings.json
node gate.js <plan.json>       # rule on any proposed day plan
```

The chronicle lane's directory was not touched; nothing here depends on it.

---

## 1. Feeds and their coverage

Four adapters feed one call ledger in the study D.3 row shape
(`out/call-ledger.jsonl`, **1,980 rows**):

| Feed | Source | What it carries |
|---|---|---|
| **A. Traces** | `pulse/direct-drive-trace*.jsonl` | Every driver cycle call, days 1–10 as available: route, model, tokens in/out/cached, provider `estimated_cost`, the command's result. **The source of every citizen-day driver number.** |
| **B. Governor** | `ledger/mind-calls.jsonl` (2,399 rows, 2026-11-05T22:25Z → 2026-11-09T14:42Z) | Demoted to one feed among several: reconciliation + coverage accounting. Never a source of day numbers. |
| **C. Commissions** | `feeds/commissions.jsonl` (format: `feeds/commissions.md`) | Seat commissions, Director windows, benches — entered from their filings. `calls: null` = UNMETERED, never estimated. |
| **D. Consults** | `commons/consults/*.jsonl` | 14 judge-class consult calls (citizen → glm/minimax communities). Counts only; the stores record no token usage. |

### Per-day driver coverage (feed A)

| Day | Cycles | Weighted calls | Active min | β (wc/min) | Visible acts (ok) | κ (wc/act) | USD (provider est.) | Validity |
|---|---|---|---|---|---|---|---|---|
| 1 | 192 | 140.7 | 31.6 | 4.449 | 81 | 1.737 | 0.0356 | VALID, flagged |
| 2 | 293 | 269.6 | 67.8 | **3.976** | 152 | 1.774 | 0.0807 | VALID, flagged |
| 3 | 237 | 23.7 | 71.1 | 0.333 | 87 | 0.272 | 0 (local) | EXCLUDED |
| 4 | 429 | 429.0 | 89.7 | **4.782** | 225 | 1.907 | 0.3628 | VALID |
| 5 | 432 | 378.9 | 90.0 | 4.209 | 206 | 1.839 | 0.3971 | EXCLUDED |
| 6 | 0 | — | — | — | — | — | — | EXCLUDED (not a day) |
| 7 | 0 | — | — | — | — | — | — | EXCLUDED (not a day) |
| 8 | — | — | — | — | — | — | — | EXCLUDED (no run) |
| 9 | 28 | 28.0 | 7.1 | 3.957 | 12 | 2.333 | 0.0220 | EXCLUDED |
| 10 | 303 | 303.0 | 84.8 | **3.575** | 148 | 2.047 | 0.3588 | VALID |

Validity is ruled by study D.4 step 1 (no dead relay, no untraced route
change, active ≥ 30 min, citizen not stopped by harness fault), with each
exclusion filed:

- **Day 3 — EXCLUDED.** Fallback-tier regime for the entire day (237/237
  cycles on the governor). At the frozen fallback weight (0.1) its β of 0.333
  would chart as the best day of the curve — the exact mirage study D.7 names
  ("day 3 on a fallback brain would otherwise chart as the best day"). A
  single-tier fallback day is a different regime, not a cheap capable day.
- **Day 5 — EXCLUDED.** Mid-run tier substitution at cycle 387 (failover row
  2026-11-09T14:16:27Z; 59 fallback cycles follow) — the day's charter breach,
  silent to the operator at the time. Its blended β (4.209) represents neither
  regime. Study D.4 names day 5.
- **Day 9 — EXCLUDED.** Active minutes 7.1 by cycle span (~19 spawn-to-abort),
  under the 30-minute floor; and the day was ended by harness fault (the
  cameraman STOP killed the daylight hold; the third death fired the abort).
  Its rate (3.957) sits near baseline — a rate without a day.
- **Days 6, 7 — EXCLUDED.** Not citizen days: 0 cycles each (chartered abort
  after wake failures; a wake/feed verification session).
- **Day 8 — EXCLUDED.** No run exists; the citizen was not woken.
- **Day 1 — VALID, flagged.** Route changes are traced in-trace (5 failover
  rows: 135 capable + 57 fallback cycles); flags: 10 model-fail calls with no
  usage record, 7 spawn rows (multi-launch file). It sits outside the baseline
  window regardless — excluding it would not change the window.
- **Day 2 — VALID, flagged.** One traced failover (26/293 fallback cycles).
- **Day 4 — VALID.** Single route all day. The relay death that day occurred
  BEFORE launch, was restarted, and RELAY-OK was proven end-to-end pre-wake
  (day record) — not a mid-run route change.

**Failed calls** (a request was consumed; no usage record exists) are counted
and flagged in the ledger, excluded from wc: day 1: 10 model-fail; day 2: 2;
day 4: 9 parse-fail; day 5: 19 (17 parse-fail + 2 model-fail). 40 in total —
their tokens and cost are GAP.

**Reconciliation (study D.3, ±5%).** Governor-routed trace cycles: 379.
Governor `cody-driver` receipts: 393. Deviation +14 = **+3.7%, within
tolerance.** Per day: day 2 exact (26/26), day 3 exact (237/237), days 1 and 5
+5/+6 (receipts inside the span with no cycle row — probes and failover
checks). The two feeds agree where they overlap; the trace feed is complete
where the governor is blind (days 4, 9, 10: zero governor receipts, full
trace coverage).

### The commission feed's worked example (feed C, 12 entries, programme day 2026-11-09)

- **Deliberation (judge class), 5 entries, all UNMETERED:** ZCode take
  (subscription:zai), MCode take (subscription:minimax), parent take, synthesis
  + addendum, Claude Code study (ProArt seat). No house store counts their
  calls; the entries carry the filings as evidence.
- **Director (director class), 5 entries:** charter + scenario #1 authoring
  (UNMETERED, Oracle-side API deliberation); scenario #1 build window and
  remediation window — **0 model calls, evidenced** (op bot MapProbe4; noticing
  report #2: "operator bots, no mind-calls"); loosening note #1 (UNMETERED);
  scenario #2 authoring (UNMETERED).
- **Benches (judge class), 2 entries:** Woof and Mirage — **0 API calls**
  (local inference on the Orin; local compute is not metered in call units).

### Routes that remain UNMETERED — the noticing gap, restated with evidence

1. **Seat subscriptions** (ZCode, MCode, Muse side agents, Claude Code):
   the deliberation's entire spend is invisible in call units. 5 of 12
   commission entries. What meters it: a seat/provider usage export adopted
   as a feed.
2. **Director authoring** (Oracle-side deliberation over APIs Muse holds):
   3 entries unmetered. Direct consequence: **the scenario allowance A is
   GAP** (§2) — the last first-time scenario's authoring cost was never
   counted.
3. **Curator class: NO FEED AT ALL.** The curator runs (Thor `~/curator/`)
   but no call records exist in its stores that this lane could read, and no
   commission entries were invented for it. Its spend is invisible until its
   cycles log calls or a filing enters them.
4. **Booth class:** does not exist yet. Per study D.5 it arrives as a
   SEPARATE line, never folded into the compilation curve.
5. **Judge baseline: GAP.** 14 consult calls exist (feed D) but no per-day
   judge rate can be derived, so the audit floor's "5% of β₀" term is
   uncomputable (§2).
6. **Failed calls:** 40 calls with no usage records — counted, tokens/cost GAP.
7. **Local compute** (presence-brain mind-seconds, Orin benches) is not
   counted in call units anywhere; the governor feed records mind-seconds for
   its own routes (2,524.2 s in the noticing window) but that is a different
   unit and is not converted.

---

## 2. The derived budget for the next citizen day (driver class)

Derivation per study D.4, from the traces alone. Units: weighted calls (wc) —
capable tier × 1.0, fallback tier × 0.1, weights frozen so a silent downgrade
cannot look like learning. Dollars ride beside, never instead: the window
days cost $0.0807 + $0.3628 + $0.3588 by provider estimate.

- **Baseline β₀ = 3.976 wc/min** — median of the last three valid days
  (day 2: 3.976; day 4: 4.782; day 10: 3.575). Noise band (min–max):
  3.575–4.782. Three days cannot estimate variance; per the study this budget
  is a tripwire, not a control limit.
- **Target (accounting identity, step 3).** Decision keys are
  `verb|target_class|food_band`, deterministic from the trace. (Food band
  only: the trace `hp` field on the day 1–5 drivers is mis-scaled/stuck —
  tension filing — so hp is not a groundable precondition in this archive.)
  A key is compilable with ≥ 3 world-evidenced successes across the valid
  days: **31 keys qualify; C = 0.761 of weighted calls** (0.758 unweighted).
  With r = 0.1: **β∞ = β₀ · (1 − C·(1−r)) = 1.252 wc/min.** C is an upper
  bound in the study's own sense — its keys are coarse (`goto|position|fed`
  dominates), and a repeated decision is not yet an asset that can serve it.
- **Schedule (step 4).** An asset counts only when PROVEN (≥ 5 live uses,
  ≥ 80% world-evidenced success, no attributable floor event). The library's
  one asset, `furnace-sequence.v1`, has **0 live uses** (`uses[]` is empty;
  status ADMITTED-WITH-UNPROVEN-TAIL). Credit = 0. **The budget does not
  fall.** β_next = max(β_floor, β₀) = **3.976 wc/min**.
- **Floor β_floor = 1.186 wc/min** = max of: novelty ν·β₀·1.25 = **1.186**
  (ν = 0.239 — binds), liveness 1.000 (one deliberated decision per 60 s of
  unscripted time), character 0.071 (≥ 6 deliberated decisions per scenario
  beat; day-11 shape: 1 beat / 85 min). Audit floor (judge class): **5 wc/day**
  — the max(5/day, 5% of β₀_judge) rule with its second term GAP.
  Note where things stand: β∞ (1.252) sits barely above the novelty floor
  (1.186). If compilation ever approached the accounting target, the floor
  would bind almost immediately — the novelty share is the citizen's
  uncodifiable thinking, and it is already most of what would remain.
- **Day budget (step 5), day-11 shape** (85 planned minutes per the charter
  draft; scenario #2 = 1 new scenario): **B = β_next × 85 = 337.96 wc, plus
  A × 1 with A = GAP.** The no-new-scenario budget is the numeric 337.96 wc.
  Hard cap (study D.7, ≥ 200%): **675.92 wc** (A excluded, flagged).
- **κ (wc per visible act)** across the window: day 2: 1.774, day 4: 1.907,
  day 10: 2.047 — rising. Day 10 bought each landed act with more deliberation
  than any prior valid day: the movement stack's tax, visible in the ledger's
  own units. Filed as an observation, not a ruling.

Operating order (study D.8) from here: meter only for 3 valid days at this
β₀, soft breaches filed in day records, the ratchet moves only on proven
assets, the hard cap comes last — and **the driver is not gated**: the gate
below rules on plans, and a breach may change who is asked or when, never
whether the body runs.

---

## 3. The budgets gate — rules as implemented

`gate.js` takes a plan (`{planned_minutes, driver_wc, n_new_scenarios,
scenario_beats, proven_assets[]}`) and `out/budget.json`, and rules:

1. **Proof check.** Each claimed asset is re-tested against the study's bar
   (≥ 5 live uses, ≥ 80% success, 0 attributable floor events). A named but
   unproven asset earns credit 0 and the ruling says so.
2. **Ceiling.** β_ceiling = max(β_floor, β₀ · (1 − min(0.20, credit))).
   No proven asset ⇒ ceiling = β₀: the budget does not fall.
3. **BELOW-FLOOR** if β_plan < β_floor (floors recomputed for the plan's own
   shape; the binding component is named). An alarm, per study D.7: check the
   logger, the route, and idleness. Under-floor spend is a failure, not a
   saving — day 3's excluded 0.333 is what a starved day looks like when it
   charts as a triumph.
4. **OVER-TARGET** if β_plan > β_ceiling: spending must re-route (a proven
   asset retires its share) or the plan is re-cut. At ≥ 200% of ceiling the
   ruling adds the hard-cap response (reroute to a proven fallback — none is
   proven today — or defer; the parent decides at the next safe point).
5. **PASS** between floor and ceiling.
6. Any plan with new scenarios carries the A = GAP note: the ruling covers
   the driver rate and is provisional for the scenario part.

The gate imports nothing from any driver, bot, or live system — by
construction it cannot touch the body. It rules on plans, on paper.

### The three fixture rulings (`out/fixture-rulings.json`, reproducible)

- **(a) Day 10 replayed as a plan → PASS.** β_plan 3.573 wc/min sits between
  the floor 1.186 (binding: novelty) and the ceiling 3.976. The best day in
  the record would have passed its own budget — with the caveat filed in the
  fixture: day 10 is inside the baseline window it is ruled against.
- **(b) Synthetic starved plan → BELOW-FLOOR (alarm).** 40 wc over 120
  planned minutes = 0.333 wc/min, under every floor component including
  liveness (1.000). The plan starves the citizen; the gate says check the
  logger, the route, and idleness — not "well saved."
- **(c) Synthetic bloated plan, no proven asset → OVER-TARGET, hard-cap
  territory.** 800 wc over 85 minutes = 9.412 wc/min vs ceiling 3.976. The
  plan claims the furnace asset retires 35%; the asset has 0 live uses, so
  credit is 0 and **the budget does not fall** — the ruling states the claim,
  the proof bar it failed, and the re-route-or-re-cut consequence.

---

## 4. What would change these numbers

- A **proven** furnace asset (≥ 5 live uses at ≥ 80%) starts the ratchet:
  credit = retired share × 0.9, capped at 20% per window.
- A **metered Director feed** turns A from GAP into a number and makes
  scenario-carrying plans fully ruleable.
- A **judge meter** (consult + deliberation routes) gives β₀_judge, the
  audit floor's second term, and a judge-class curve of its own.
- Three more valid days re-baseline the window (windows of 3 valid
  citizen-days, not weeks — study D.2).

Filed by the ledger-budgets lane, 2026-11-09. All figures reproducible from
the stores cited by the two commands in the header; no figure in this filing
was estimated where a store was silent — the silences are named GAP above.
