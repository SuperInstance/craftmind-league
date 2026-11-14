# TENSION SCORE — GATED IMPLEMENTATION AND CONTROL EVIDENCE (2026-11-09)

**VERDICT: NOT-PROMOTED.** The score remains an offline instrument. No
consumer may be proposed for it — no Director feed, no camera signal, no
narrator gating, no display. Promotion stops at the first control, **C0**
(not runnable offline), and would stop again at **C2** (failed) and **C8**
(failed) even if C0 had passed. The trust ladder's lowest rung — shadow,
no consumers — requires C0–C2; this build does not reach it.

What the instrument *can* honestly claim after this run: it computes
deterministically and restart-safely (C1); its harness gate correctly
certifies six recorded days and refuses the one harness-owned day (C4);
and it reproduces the study's own predicted blind spot — day 10, the
Director's first scenario day, scores a flat zero (see §3). What it
cannot claim: that it tracks imminent jeopardy (C8: AUC 0.561 against a
0.75 bar), or that its phase signal is stable under the sampling cadence
of the archive's sparse days (C2).

Built per the Claude Code study, §B (`claude-code-study.md` in
`~/workspace/studies/minecraft-research-takes-20261109/`), as adopted by
the synthesis addendum: one fixed-anchor computation over
server-authoritative state, published as term series with three derived
signals, no per-day normalisation, no scalar-only output.

**Reproduce everything with one command** (on the Thor):
`cd ~/craftmind-league/tension && ~/.nvm/versions/node/v24.22.2/bin/node run.js`
— scores every usable day into `out/<day>.tsv` + `out/<day>.manifest.json`
(input/code SHA-256s recorded per day), then runs the controls into
`controls-results.json`. Code: `tension.js` (scorer), `controls.js`,
`run.js`. Node, stdlib only. Offline throughout; nothing here touches a
world, a consumer, or any file outside `tension/` and this lane's single
ledger append.

---

## §1 Terms and their grounding

The recorded stores are the direct-drive day traces
(`pulse/direct-drive-trace-*.jsonl`): per-cycle samples of `hp`, `food`,
`pos` written by the crew's driver — server-sent citizen state relayed to
the citizen client. There is **no** 1 Hz sampler series, **no** hostiles
series, **no** world-time series, and **no** saturation field anywhere in
the archive. The score is computed on a 1-second grid (20 ticks nominal)
by step-hold over the cycle samples; seconds more than 90 s past the last
sample are `SOURCE_STALE` and score null, never zero (study failure
mode 8). This cadence gap between the study's design (a 20-tick sampler)
and the archive (cycle-rate samples, ~7–35 s apart) is itself one of the
findings: the archive was not recorded for this instrument.

| Term | Construction (study B.3) | Grounding store | Status |
|---|---|---|---|
| `p_H` | noisy-OR of rate (τ = hp ÷ trailing-10 s loss rate, τ₀=10 s) and static (`0.5·(1−hp/20)²`, zeroed in the respawn window) | trace `hp` samples | **Computed, but the field itself is suspect on days 1–5 — see §2** |
| `p_M` | hostiles within 24 blocks, τ = d/v, reachability-excluded | — | **DROPPED. No hostiles-with-distance series exists in any recorded store.** The traces carry hp/food/pos per cycle only; `prey` (days 1–2) is a single animal name, not a series. Substituting anything else (death causes, narration, result text) would be exactly the harness-log substitution the commission forbids. |
| `p_N` | seconds to hostile light, τ₀=60 s, cap 0.5 | — | **NULL on every day.** On daylight-held days (2, 4, 9, 10 — holds landing-verified in the day records) it is null by the study's own rule. On days 1, 3, 5 the hold is unverified and no world-time series exists, so seconds-to-hostile-light cannot be grounded either. |
| `p_F` | seconds until food ≤ 6 at trailing-300 s drain, τ₀=120 s, cap 0.4; FEED mask 120 s around harness feeds | trace `food` samples | Computed — **food only. Saturation is recorded nowhere**; the drain is estimated from food decreases alone (flagged, per commission). The food field cross-checks against the day records (e.g. day 2's "food peak 5" matches its samples exactly). |
| `p_E` | leaky memory: `E ← E·e^(−1/30) + hp_lost/20` per second; death sets E = 1 | hp drop events + `pulse/deaths-record.jsonl` + trace death rows | Computed. Harness-owned deaths (115, 116 — operator-caused; 121–123 — day-9 record, fault_owner: harness) are excluded from the E = 1 set, per spec. |
| `p_V` | state-diff classes (moved / hp-changed / food-changed / death) in trailing 10 s, ÷ 4 | the sample series | Published as a column at **weight 0** — it never enters T. C2 was its gate to future weighting; C2 failed (§4). |

Combination (B.4): `T = 1 − (1−p_H)(1−p_F)(1−p_E)` — the study's noisy-OR
over the terms that exist. With `p_M` dropped and `p_N` null, **the
archive's T is a three-term score**, and every output artefact says so.
Anchors are absolute; there is no per-day normalisation.

Output columns per B.5: `tick, T, p_H, p_M, p_N, p_F, p_E, p_V,
top_term, threat_pos, phase, mask, acts_per_min`, plus two documented
additions at the end: `onset` (the narrator derived signal as data —
rising-edge and post-peak rest markers; no narrator exists or is fed)
and `blocked` (1 when a blocking mask bit is set — the null a future
consumer would receive). The three derived signals are: Director shape =
`phase` (FSM over the trailing-120 s mean of T; θ_hi 0.5, θ_lo 0.15,
direction from the previous window — a [J] reading of B.5's
BUILD_UP → SUSTAIN → FADE → RELAX); camera = `top_term` + `threat_pos`
(**`threat_pos` is empty throughout — it belonged to `p_M`**); narrator =
`onset`. Mask bits per B.6: HOLD (held days), FEED, RESPAWN (15 s [J]
after each death), SOURCE_STALE; PARKED / DIRECTOR_SETTLING / SWAP /
TPS_LOW are never settable from these stores and are never set — their
absence is a store limitation, not evidence the conditions didn't occur.

## §2 The hp-field finding (a term's store is not what it claims to be)

The trace `hp` field on the early drivers is **not the server's health
value**. Evidence, from the samples themselves:

- **Day 2: `hp` = 0.1333… in all 295 samples**, across a full, active,
  deathless day (pen built, wheat planted, food eaten). A citizen does
  not spend a day at 0.13 of 20 hp. The field was stuck; the day's
  constant T = 0.696 is that stuck field (plus food pinned ≤ 6 holding
  `p_F` at its cap), not a day of unbroken peril.
- Days 1 and 3 take only fractional values with a constant .1333
  fractional part (9.1333, 6.1333, 3.1333, 0.1333 / 4.1333); days 4, 5, 7
  the same shape with .3333 (19.3333, 18.3333, 16.3333, 12.3333,
  0.3333). Vanilla health does not come in thirds. The field is health
  passed through some wrong transform in those drivers, in whole-hp
  steps on a shifted scale.
- Days 9–10 are clean (20, 19.8, 0 at death; 20 throughout day 10).

Consequences, stated plainly: `p_H` — and, through the drop events,
`p_E`, and through the labels, C3/C8 — is **server-grounded only on days
9–10**; on days 1–5 it is computed from a mis-scaled field and flagged as
such here and in each manifest's stead this section stands as the flag.
Day 9's non-harness event count is zero (its deaths are harness-owned)
and day 10 has no loss events at all, so **predictive validity is
effectively untestable on clean data** — C8's failure (§4) is recorded
against the pooled archive with that rider attached. The `food` field,
by contrast, cross-checks clean against the day records wherever both
exist.

## §3 Per-day results

| Day | Scored s | Stale s | mean T | peak T | Reading |
|---|---|---|---|---|---|
| 1 | 1,904 | 135 | 0.520 | 0.989 | food-driven day (top term `p_F` nearly throughout) — the starvation era reads as chronic pressure, correctly in shape |
| 2 | 3,861 | 241 | 0.696 | 0.696 | **constant** — the stuck hp field (§2); SUSTAIN for 3,843 s. An apparatus artefact, filed as one |
| 3 | 4,295 | 91 | 0.477 | 1.000 | the four mob deaths register (T = 1.000 at the death seconds); between them, chronic low-state plateaus from the mis-scaled field |
| 4 | 4,832 | 586 | 0.004 | 0.053 | the quiet zero-death homecoming reads quiet — RELAX for 4,814 s. The instrument's cleanest true negative |
| 5 | 5,342 | 65 | 0.369 | 0.997 | mixed: real jeopardy peaks over a chronic base |
| 9 | 722 | 412 | 0.044 | 1.000 | peaks exist but are the crew's own death window — C4 refuses this day (99.1% harness share) |
| 10 | 5,103 | 19 | 0.000 | 0.000 | **flat zero for 5,103 s** (hp 20, food 18–20, no damage) — see below |

Days 6, 7, 8 have no usable store (day 6: two trace rows, no cycles;
day 7: wake-only rows; day 8: never woken, no trace) and are listed in
`run.js` so the gap is on the record.

**Day 10 is the study's B.1 blind spot, confirmed on the archive.** The
study predicted that the Director's first scenario (a roofless barn,
loose pigs, no hostiles, no health loss, daylight held) scores near zero
on this construction — it scores *exactly* zero, for every second of the
day. T carries no information about day 10 at all. The only day-10
distinction the instrument offers is the one the study built for it:
`acts_per_min` averages 3.6, so by B.5's split the day reads *breathing*,
not *dead air* — and that signal is the act rate, not the tension score.
Anyone proposing a consumer for T must answer for this row of the table
first.

## §4 The controls — all twelve, in order

**Count ambiguity, flagged per commission:** the commission says
"eleven" controls; the study's table lists **C0–C11, which is twelve**.
The stricter reading was implemented: all twelve, in order. A control
failure stops promotion claims at that control; everything after a
failure is diagnostics and is labelled as such.

| ID | Status | Evidence (condensed; full text in `controls-results.json`) |
|---|---|---|
| C0 Writer & movers | **NOT RUN — promotion stops here** | Needs a live throwaway-body session (damage, zombie at 8 blocks, dusk, unplug the sampler). This lane is offline-only. The shadow rung requires C0–C2. Note: `p_M`, the term C0 would exercise most, has no grounding store at all. |
| C1 Determinism | PASS | Recompute of day 10 twice: byte-identical. Restart at the midpoint with a full checkpoint (E, phase history, warm samples/feeds/deaths): 2,532 post-recovery seconds compared on 10 columns, **0 mismatches**. (The `onset` edge-state is not checkpointed and is excluded from the comparison — documented in code.) |
| C2 Verbosity | **FAIL** | Adapted to the score's actual input (it consumes no log rows): drop-50% / halve / triple the *state samples*. Tripling is invariant everywhere (Spearman 1.0000; day 10 identity). But on day 3, drop-50 and halve give Spearman 0.9788 / 0.9868 with **phase agreement 93.6% / 92.8%, below the 95% bar**. The T series nearly survives resampling; the *phase* — the Director's derived signal — does not, on the sparsest dynamic day. `p_V` therefore stays at weight 0. |
| C3 Baseline race | PASS (letter only) | Pooled 26,059 s, 263 positives. AUC: **T = 0.561**, hp alone = 0.498, log rows/min = 0.299. T beats every *available* baseline — but 0.561 is a weak absolute value, the verbosity baseline is anti-predictive rather than competitive, and two legs (**hostile count, time of day**) are not runnable: no such series exist. C8 is the operative test. |
| C4 Harness share | PASS as a per-day gate — **day 9 excluded** | Days 1–5, 10: harness share 0.0–0.9% (bar ≤ 20%). **Day 9: 99.1%** — its entire tension integral sits on harness-tagged ticks; the retro-run confirms study failure mode 2 ("peaks are bugs") empirically and the gate refuses the day, which is what the gate is for. Day 10's top-decile membership is a tie artefact (510 rows tie at T = 0). |
| C5 Camera/narration intervention | NOT RUN | Requires a scripted actor in a throwaway world on the real Orin (3 camera arms × narration × 2 replicates, ~72 min, lane claimed). Outside this lane's constraints. The study is explicit that **C5 decides** the apparatus question; C6 cannot substitute. |
| C6 Lead-lag screen | SCREEN ONLY | Only apparatus cadence in the stores is the driver's own cycle rate (camera cuts / narration events are recorded nowhere). Lag-0 Spearman(T, acts/min) ranges −0.490 (day 5; exceeded by 0/200 rotations — a real negative coupling: tension high when acts low) to +0.354 (day 9); undefined on days 2 and 10 (T constant). A screen that cannot clear the apparatus, reported as such. |
| C7 Paired observation | NOT RUN | No paired series exists: the traces are a single client-relayed view; server state survives only as sparse overwritten snapshots (`pulse/cody-state.json`), from which a ≥ 0.9 agreement cannot be computed. |
| C8 Predictive validity | **FAIL** | AUC of T for non-harness ≥ 5 hp loss or death within 60 s = **0.561**, bar ≥ 0.75 and above baselines. Not met. Structural riders: with `p_M` dropped, mob jeopardy is invisible until damage lands; with the §2 field problem, five of seven days' hp inputs are mis-scaled; on the two clean days there are no non-harness positives to predict. The honest summary is that this construction, on this archive, does not predict imminent loss. |
| C9 Human construct validity | NOT RUN | Requires ~20 min of a human watcher's blind paired-clip judgements. Not self-certifiable by this lane. |
| C10 Sham score | NOT RUN — vacuous on the archive | The metric it guards ("placements cluster at troughs") has no instances: no consumer existed during the recorded days and no placement was ever made by or against this score. Machinery for future automatic running, specified here so it isn't lost: for each day, recompute every consumer metric against T circularly rotated by a random offset (seeded, recorded); if the metric holds for the sham, the metric is vacuous. Must be wired the day any consumer is wired — not after. |
| C11 Causal payoff | NOT RUN | Requires weeks of randomised placement timing across days. Only this control could ever support "pacing works." Nothing here speaks to it. |

## §5 Ambiguities and judgement calls (all flagged, stricter reading taken)

1. **Control count**: "eleven" vs the study's C0–C11 (twelve) — all
   twelve run/listed (§4).
2. **C2's object**: the study's C2 perturbs *log rows*; this score
   consumes no log rows by construction (that is its observer-cut
   discipline). The control was applied to its actual input — the state
   sample series. If the parent prefers the letter of C2, then C2 is
   trivially passed by construction and the phase-instability finding
   above is the stricter, more informative result. Either way `p_V`
   stays at weight 0 this version.
3. **Sampling clock**: the study specifies a 20-tick sampler; the
   archive has cycle-rate samples. The 1 s step-hold grid + 90 s
   SOURCE_STALE threshold [J] is the adaptation; it is why C2's cadence
   sensitivity matters.
4. **Phase FSM**: B.5 names the states and thresholds but not the
   transition rule; implemented as trailing-120 s mean with direction
   from the preceding window. [J]
5. **Window lengths**: FEED mask 120 s, RESPAWN mask 15 s, stale 90 s —
   [J], recorded in code.
6. **`p_V` classes**: the study says "state-diff classes only" without
   enumerating; four classes derivable from the stores were used
   (moved / hp / food / death), normalised ÷ 4. Weight 0 regardless.
7. **A build bug found and fixed during this lane, on the record**: the
   first scoring run ended each day's grid at its last *state sample*,
   which silently amputated day 3's four death rows (they land 47–113 s
   after the final cycle sample) and day 9's tail. The grid now extends
   to the last trace row of any kind, with post-sample seconds ageing
   into SOURCE_STALE normally. All numbers in this filing are from the
   fixed build (code SHA in each manifest).

## §6 What would have to change before this is re-run

1. **A sampler that records what the score eats**: server-authoritative
   citizen state at a fixed clock — hp, food **and saturation**, world
   time, and **hostiles within 24 blocks with distance and
   reachability** — written by a process that is not the driver, on days
   whose hp field is the server's value. Without this, `p_M` stays
   dropped and C8 stays unanswerable on clean data.
2. **C0** (one throwaway-body session, ~20 min) and **C2 re-run** on the
   denser series — the shadow rung's remaining gates.
3. **C5** on the Orin and **C9** with a watcher, before any consumer is
   even proposed; **C10** wired alongside the first consumer, **C11**
   only after weeks of placements.
4. Until then: the series in `out/` are a recomputable offline record of
   what this construction makes of the first ten days — including its
   two most useful products, which are negative: a harness gate that
   provably refuses day 9, and a flat zero across the Director's first
   scenario day.

*Filed by the tension-score lane, 2026-11-09. Score version
`tension-1.0.0`. No consumer was built, proposed, or fed.*
