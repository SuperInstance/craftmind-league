# DAY-18 BUDGET ADDENDUM — THE CHARTER'S §7, RE-PRICED ON THE RE-BASELINED BUDGET

**Lane:** day18-budget-addendum (parent-sequenced). **Date:** 2026-11-10 (programme day 2026-11-09).
**Obligation:** `ledger/F1-F2-20261109.md`, consequence 1 — *"The day-18 run lane
must file a budget addendum on these numbers before the run."* Filed here,
before any run, before any claim.
**Scope:** this addendum ONLY. The charter (`pulse/DAY18-CHARTER-20261109.md`,
34,806 B, md5 `ee937901…` at filing) is **not edited** — its §7 stands as
drafted, and §8 below supersedes its numbers *by reference*, the house
pattern. Nothing is run, claimed, placed, or woken by this lane.

---

## §1. The numbers, verified against the store

Every figure in the commissioning brief was checked against
`ledger/deliberation/out/budget.json` as rebuilt by the F1/F2 lane.
**No number differed.** The store governs and the store says:

| Quantity | Charter §7 era | Now (budget.json) |
|---|---:|---:|
| Baseline window (last three valid days) | [2, 4, 10] | **[12, 15, 16]** |
| β by window day (wc/min) | 3.976 / 4.782 / 3.575 | 3.9747 / 2.3163 / 2.1657 |
| **β₀ (median) = operative ceiling** | **3.976** | **2.3163 wc/min** |
| **Day budget B (85 min)** | **337.96 wc** | **196.8855 wc** |
| **Hard cap (200% of B)** | **675.92 wc** | **393.771 wc** |
| β_floor | 1.186 (novelty binds) | **1.000 (liveness binds)** — novelty term 0.6492, character 0.0706 |
| β∞ (accounting target) | 1.252 | **0.6991 — below the floor** |
| Credit / budget falls | 0 / no | 0 / no — a **re-baseline**, not compilation |

Two standing facts the addendum inherits, stated so the run lane does not
re-derive them wrong:

- **A is still GAP.** `scenario_allowance_A_wc: null`. B = β_next × 85 is the
  **driver-only** figure; scenario #4's authoring was seat-subscription work
  and sits in Feed C as UNMETERED entries (`calls: null`). The day record's
  budget line (§7 of the charter) must carry A as GAP — never silently as 0.
- **The shape matches.** budget.json's `next_day_shape` (85 planned minutes,
  1 new scenario, 1 beat — derived at impl from the day-11 draft) is the same
  shape the day-18 charter files (§4: 85 minutes, scenario #4, one element).
  No shape correction is owed; only the prices moved.

## §2. The costing basis — the three valid comparators, from the store

All figures from `ledger/deliberation/out/per-day.json` (the build's own
output, post-F2 validity rulings). wc = weighted calls (capable tier weight
1.0, fallback/governor tier weight 0.1).

| Day | Cycles | wc total | Active min | β (wc/min) | Unweighted calls/min | USD | κ (wc per visible act) | Visible acts |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 12 (VALID, flagged) | 327 | **321.6** | 80.91 | 3.9747 | 4.0414 | $0.3604 | 2.144 | 150 |
| 15 (VALID, flagged) | 268 | **196.9** | 85.01 | 2.3163 | 3.1527 | $0.0776 | 2.2124 | 89 |
| 16 (VALID, flagged) | 237 | **183.0** | 84.5 | 2.1657 | 2.8047 | $0.0839 | 7.9565 | 23 |

The blends, because every rate below is meaningless without them: day 12 =
321 capable + 6 fallback cycles (1.8% fallback); day 15 = 189 + 79 (29.5%);
day 16 = 177 + 60 (25.3%). β₀ is the median of these three days, and two of
the three are blend days — F2's flags travel with every number in this
addendum. A "capable-only" stress case is costed for each variant: the day's
observed call tempo with every cycle at weight 1.0 (the unweighted rate × 85).

## §3. Variant R — the chartered day does NOT fit the new budget

R's phases (§4.2) are day 12's phases: exit/encounter in motion, wood chain,
the count at the hollow, the tail (S10/S11) at home. Day 12 is the honest
comparator, and the arithmetic is not close:

- Day 12 **as run** spent **321.6 wc in 80.91 minutes** — already **+124.71 wc
  (+63.3%) over the new B**, in less than the chartered window.
- Projected to the full 85 minutes at day 12's β: **337.85 wc = 171.6% of B,
  over B by +140.96 wc**, and **55.92 wc under the hard cap** (85.8% of cap).
- Capable-only stress (day-12 tempo, no failover at all): **343.52 wc**, over
  B by +146.63.
- For an R day at day-12 tempo (343.5 calls) to fit B, its mean weight would
  have to fall to 0.5731 — i.e. **≥47.4% of all cycles on the fallback tier**.
  Days 15/16, the blend days themselves, ran 29.5% / 25.3%. Fallback share is
  decided by provider failure, not by the plan; a plan that fits only if the
  provider fails half the day is not a plan.

**Gate ruling on R as chartered: OVER-TARGET.** β_plan 3.9747 > ceiling
2.3163; projected total 171.6% of B — over target, **under the 200% hard
cap**, so the cap's response (reroute to a proven fallback or defer) is not
triggered. There is no proven fallback to reroute to (budget.json, hard-cap
note), and §6 prices the options.

## §4. Variant N — fits on the evidence, and the fit is blend-contingent

N's day (§4.3) is the bowl day: the encounter as the morning, his own acts
inside the room under the relative guard. The comparators are day 16 (the
full bowl day) and day 15 (transit + bowl):

- Day 16 **as run**: **183.0 wc over 84.5 minutes — under B by 13.89 wc
  (−7.1%)**; projected to 85 minutes at its β, 184.08 wc, still under.
- Day 15 as run: **196.9 wc — over B by 0.01 wc**, which is to say exactly at
  it (day 15 *is* the median day; B is its rate × 85 by construction).
- **Gate ruling on N as chartered: PASS** — β_plan 2.1657 < ceiling 2.3163
  (93.5% of ceiling), projected total inside B.
- The contingency, in the open: day 16's fit is bought by its blend. At day
  16's tempo with **no failover** (all-capable), the same day costs
  **238.40 wc — over B by +41.51 (+21.1%)**, still 155.37 wc under the hard
  cap. N fits if the recent blend pattern recurs (every day since day 12 has
  failed over, traced, at 25–30%); it runs mildly over-target if day 18 is
  the first fully-capable day since day 13. Both outcomes are pre-priced
  here; neither is a surprise the record should have to absorb.

## §5. The asymmetry, in so many words

**The ramp variant does not fit the new budget; the bowl variant does.**
Costed on the valid days' own evidence, R runs at ~171.6% of the day budget
(337.85 wc projected) and N at ~93.5% (184.08 wc projected) — a factor of
~1.8× between the two days Casey is choosing between, against a budget whose
median day is a bowl-pattern day. His ramp ruling is therefore also a budget
ruling, and this addendum is the price tag, filed before he rules:

- **R = the full chartered day, run OVER-TARGET under the hard cap** (or a
  shortened day — §6, Option B, at the tail's expense).
- **N = a day inside the budget as planned**, with the all-capable stress
  case (+41.51 wc) pre-filed.

One defusing fact, so the overage is not misread: wc is the compilation
curve's currency, not money. The dollar difference between the two days as
evidenced is **$0.28** ($0.3604 vs $0.0839). R's over-target is a ruling
about what the day costs in deliberation against the fleet's own baseline —
the gate working as designed — not a spending problem.

## §6. The options for R, in the gate's vocabulary — and a recommendation

**Option A — run R full-window OVER-TARGET, overage filed in advance.**
85 minutes as chartered; expected 337.85 wc (+140.96 over B, 55.92 under the
hard cap). This addendum is the advance filing. The gate's fixture precedent
(F1/F2, consequence 2) shows the same ruling landing on day 10 replayed as a
plan: PASS → OVER-TARGET under the new ceiling. Over-target is a price the
gate names, not a stop it imposes; the stop lives at 200%, and R projects
to 171.6%.

**Option B — shorten the window until the plan fits.** At day 12's β, B buys
**49.5 minutes**. The cost is structural, and it falls on the tail: §4.2's
order puts S10/S11 *last* — after the exit, the encounter, the wood chain,
the walk east, the count, and the return — and every earlier phase carries
variance the rehearsals have not compressed (day 12 closed its count at
cycle 19 and still spent ~300 further cycles on extraction; R removes the
extraction by Gate A rehearsal, but the wood-chain → count → return sequence
has never been run as one chain). ≈200 cycles at day-12 tempo is what 49.5
minutes holds, and the clauses priced out first are the furnace clauses —
the eighth day at the tail, which is R's stated reason to exist. A 49.5-min
day still clears validity's 30-active-minute floor, so the option is legal;
it buys budget compliance by amputating the day's success line.

**Option C — change the plan's rate discipline. Not available as a charter
line.** The shipped driver class has no cycle-pacing mechanism: the call
rate is an emergent property of provider latency and the reflex layer
(observed unweighted rates across the valid days: 2.80–4.04 calls/min —
measured, never set). The only other cheapness in the system is fallback
share (§3: failure, not discipline). A pacing mechanism would be a *driver
change* — its own build, its own fixture battery against the shipped md5,
its own Gate B line — not a sentence this addendum or the run lane can write
into a plan. Named here so its absence from the run is a decision on record,
not an oversight.

**RECOMMENDATION: Option A.** Run R at the full 85 minutes, over-target,
with this addendum as the advance filing. Reasons: (1) the projection sits
55.92 wc under the hard cap — the gate's actual stop is not approached;
(2) Option B spends the day's purpose (the tail) to satisfy a baseline whose
own median is a blend day — it would hold R to a price set by days that
never attempted R's work; (3) Option C does not exist to choose; (4) the
re-baseline is a measurement correction, and the honest response to a
corrected measurement is to file the true price and run the day — not to
shrink the day until the old paperwork would have passed it. The parent
rules; the run lane carries the ruling and cites this addendum in the day
record's budget line.

## §7. The liveness floor — what it protects now, and what to watch

β_floor is now **1.000 wc/min, and the binding term is liveness** (floors in
budget.json: liveness 1.000, novelty 0.6492, character 0.0706). Before F2,
the novelty term bound at 1.186: a too-cheap plan tripped the below-floor
alarm for starving the day's *freshness*. The basis has changed kind:

- **What the floor now protects is the citizen's deliberation itself.** A
  plan under 1.000 wc/min — under **85.0 wc across the whole day** — is a
  plan in which Cody barely thinks: too few deliberations for a day to be a
  day he lived, whatever the scenario's novelty. The below-floor alarm is
  now an aliveness alarm.
- **Cheapness has a trapdoor the floor now guards.** wc can be made cheap
  by fallback share (weight 0.1): day 16's call tempo run entirely on the
  fallback tier reads **0.28 wc/min** — far below the floor, while calls
  continue and a naive rate check sees a "calm" day. The floor is what makes
  that shape file as starved rather than efficient.
- **And the floor can be satisfied while almost nothing happens.** Day 16
  spent 183.0 wc (2.1657/min — comfortably over the floor) and produced
  **23 visible acts: κ 7.9565**, against 2.144 (day 12) and 2.2124 (day 15).
  214 of its 237 cycles were guard refusals and flee pre-empts — deliberation
  consumed, no act produced. The floor measures spend rate; it does not
  measure life.

**What the run lane must watch that it did not before:** (1) **κ and the
action curve are now the liveness evidence** — the charter §7 record already
leads with the action curve; under the new floor, a day that passes the
budget and fails κ has failed the thing the floor exists for, and the record
must say so in those terms. (2) **Every rate quoted with its blend share** —
a bare β is the F2-flagged lie; the day record's budget line carries the
capable/fallback split or it carries nothing. (3) **Mid-day wc/min sag** —
a long fallback stretch drops the rate toward the floor while the day looks
quiet; that is the below-floor shape arriving gradually, and it is read
from the floor's own log, not at close. (4) **Do not plan toward β∞.**
β∞ (0.6991) sits *below* β_floor (1.000): the schedule's max() governs, the
floor is the operative minimum for any real day until compilation lifts β∞
above it — a plan priced between 0.699 and 1.000 is below-floor, full stop.

Neither variant is anywhere near the floor as planned (R 3.9747, N 2.1657
expected / 2.8047 capable-only) — the floor binds this programme's *future*
cheap days, not day 18. It is filed here because day 18's record is the
first that will be read against it.

## §8. What this addendum supersedes in the charter (by reference only)

- Charter §7's budget line — *"the budget (calls, rate vs the 3.976 wc/min
  ceiling, cost, any failover trace-rowed with its reason)"* — is read from
  the run onward as: **rate vs the 2.3163 wc/min ceiling; day budget
  196.8855 wc; hard cap 393.771 wc; floor 1.000 (liveness); A carried as
  GAP; blend share stated with every rate; κ reported as the liveness
  read.** The charter's sentence stands unedited; this addendum is its
  price correction.
- Charter §4's *"5100 s driver budget"* is wall-clock and is **unchanged**
  by the re-baseline; nothing in this addendum shortens the chartered
  window (Option B is priced and not recommended, not adopted).
- The variant selector (§0), both success lines (§4.2/§4.3), and every gate
  are untouched by the re-baseline. The budget was the only section of the
  charter priced in the old baseline's currency.

## Reproduce

```
cd ~/craftmind-league/ledger/deliberation
cat out/budget.json            # window [12, 15, 16], beta0 2.3163, B 196.8855, cap 393.771
cat out/per-day.json           # days 12/15/16: wc, beta, blends, kappa — §2's table
```

## What this lane did not do

Edit the charter (md5 `ee937901…`, 34,806 B, verified again at this filing's
close); rule the plan option (Option A is a *recommendation* — the parent
rules, the run lane carries it); re-derive or re-rule any validity (F2's
rulings are consumed as filed); estimate A (GAP stands); run, claim, place,
stock, or wake anything; touch any world.

Filed by the day18-budget-addendum lane, 2026-11-10.
