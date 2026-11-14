// THE DELIBERATION LEDGER — build. Study: claude-code-study.md section D.
// One command reproduces every output:
//   node build.js            (from this directory; Node stdlib only)
// Outputs: out/call-ledger.jsonl (D.3-shaped rows), out/per-day.json,
//          out/budget.json (the derived budget for the next citizen day).
'use strict';
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..', '..'); // ~/craftmind-league
const traceFeed = require('./feeds/trace-feed');
const governorFeed = require('./feeds/governor-feed');
const commissionFeed = require('./feeds/commission-feed');
const consultFeed = require('./feeds/consult-feed');

const R_RESIDUAL = 0.1; // study D.4 step 3: residual cost of a compiled act, assumed until measured

// ---- Validity (study D.4 step 1: no dead relay, no untraced route change,
//      active minutes >= 30, citizen not stopped by harness fault for most of it;
//      plus the study's own named inspections of days 3 and 5).
//      Days 11-16 ruled by the F2 lane (ledger/F1-F2-20261109.md) under the
//      same four criteria, each exclusion filed with its criterion. ----
const VALIDITY = {
  1: { valid: true, flagged: true, reason: 'Route changes are TRACED in-trace (5 failover rows); active 31.6 min >= 30. Flags: 10 model-fail calls without usage records; 30% fallback-tier share; 7 spawn rows (multi-launch file). Outside the baseline window in any case.' },
  2: { valid: true, flagged: true, reason: 'One traced failover (26/293 cycles on the fallback tier); active 67.8 min. The failover is in the trace, declared by the day-6 rule retroactively satisfied here.' },
  3: { valid: false, reason: 'EXCLUDED — fallback-tier regime for the entire day (237/237 cycles governor). Study D.4 names day 3 for inspection and D.7 names the trap: at weight 0.1 its beta (0.33) would chart as the best day of the curve. A single-tier fallback day is a different regime, not a cheap capable day.' },
  4: { valid: true, flagged: false, reason: 'Single route all day (429/429 capable). The relay death occurred BEFORE launch, was restarted, and RELAY-OK was proven end-to-end pre-wake (day record) — not a mid-run route change. Active 89.7 min.' },
  5: { valid: false, reason: 'EXCLUDED — mid-run tier substitution at cycle 387 (failover row 2026-11-09T14:16:27Z; 59 fallback cycles follow). The substitution was the day\'s charter breach: silent to the operator at the time. Its blended beta (4.21) represents neither regime. Study D.4 names day 5.' },
  6: { valid: false, reason: 'EXCLUDED — not a citizen day: 0 cycles; chartered abort after four wake failures. Nothing to meter.' },
  7: { valid: false, reason: 'EXCLUDED — not a day run: 0 cycles; a wake/feed verification session only. Active minutes < 30 by construction.' },
  8: { valid: false, reason: 'EXCLUDED — no run exists: the citizen was not woken (aim proof only). No trace file.' },
  9: { valid: false, reason: 'EXCLUDED — active minutes 7.1 by cycle span (~19 spawn-to-abort), below the 30-minute floor; and the day was ended by harness fault (cameraman STOP killed the daylight hold; third death fired the abort). Fails two criteria.' },
  10: { valid: true, flagged: false, reason: 'Single route, zero failovers, RELAY-OK proven pre-wake and held all day; active 84.8 min; zero deaths.' },
  11: { valid: false, reason: 'EXCLUDED (F2) - active minutes 7.47 by cycle span (31 cycles, 00:59:36Z-01:07:04Z), below the 30-minute floor (D.4 step 1, criterion 3); and the citizen was stopped by harness fault (criterion 4): the floor PARK daylight_unrestorable at 01:07:03Z ended the day on the mirror off-by-one - the three daylight commands demonstrably landed (server log + op results ok:true) and the floor verified none. Same two-criterion failure shape as day 9. The trace file pools the Gate B STOP attempt (3 gate-refuse-start rows, zero cycles) with the played relaunch; only the played span is ruled on. The days beta (4.152) is the rate of a 7.5-minute fragment - a rate without a day.' },
  12: { valid: true, flagged: true, reason: 'VALID, flagged (F2) - all four criteria pass: no dead relay mid-run (the pre-check death was recovered before Gate B; RELAY-OK at check and at launch; the days 22 daylight assertions landed attempt 1); the one route change is TRACED (failover row at cycle 324 after 37 model-fail rows; 6 governor cycles of 327 = 1.8%, vs day 5s undeclared 59-cycle substitution and day 3s 100% fallback regime - the day-5 rule satisfied in form); active 80.9 min >= 30; full chartered 85-minute window, driver exit rc=0, zero deaths, citizen never stopped by harness fault. Flag: beta 3.975 blends two regimes (321 capable + 6 fallback cycles).' },
  13: { valid: false, reason: 'EXCLUDED (F2) - citizen stopped by harness fault for most of the day (D.4 step 1, criterion 4): the safety-reading-path defect (incident H1). The floor parked correctly 2 s after death 3 (06:09:24Z); the driver never read the park - both safety checks live at the model-cycle head and cycle 212 sat inside the reflex flee/burrow sequence, which checks neither - so deaths 3-9 landed inside one stuck cycle and the lane stopped the driver BY HAND at 06:14:43Z, six deaths past the chartered limit. The day ran 54 of 85 chartered minutes with its final ~50 minutes consumed by the hole/extraction and the burst. Its beta (4.376) is the rate of a day the harness fault owned - the direct analogue of day 9s exclusion and of the unreconciled day the study premise excludes.' },
  14: { valid: false, reason: 'EXCLUDED (F2) - active minutes 10.1 by cycle span (32 cycles), below the 30-minute floor (D.4 step 1, criterion 3). The chartered 85 minutes ran 10 min 53 s: the day ended on its own stop rule, read live by the repaired reflex layer (the first live proof the 3-death abort works - deaths stopped at exactly 3). The exclusion is the floor criterion only: the stop was the safety system WORKING, not a harness fault (day 9 fails both criteria; day 14 fails one), and the route was single and traced throughout. Its beta (3.168) is a 10-minute fragment rate.' },
  15: { valid: true, flagged: true, reason: 'VALID, flagged (F2) - all four criteria pass over the RUN: full chartered 85 minutes (07:42:19Z-09:07:19Z, driver exit rc=0), 268 cycles, zero run deaths, citizen never stopped by harness fault (the days consuming phase was a legal-dig bowl entry - world/harness geometry, not a stop); the mid-run route change is TRACED (model-fail x2 at cycles 192-193, failover row, 79 governor cycles of 268 = 29.5% - day 2s declared-failover precedent at 8.9% extended in degree, not kind; NOT day 5: declared in-trace by the day-5 rule, and the day completed its charter). Flags: (1) beta 2.316 is a two-regime blend (189 capable + 79 fallback cycles) - it must never be quoted as a capable-regime rate; (2) the Gate B provisioning death #136 (07:38:27Z, census-named zombie, stand-only body killed 5.5 s after spawn, before the floor opened) is OUTSIDE the run and its beta; it is a window event, recorded here so the ruling is not misread as the day being deathless end-to-end.' },
  16: { valid: true, flagged: true, reason: 'VALID, flagged (F2) - all four criteria pass: full chartered 85 minutes (09:41:36Z-11:06:26Z, driver exit rc=0), 237 cycle rows, zero deaths (second consecutive zero-death run day), citizen never stopped by harness fault - the below-grade guard REFUSED targets (69 refusals) but never parked or stopped the body; the day ran to its window. The mid-run route change is TRACED (model-fail x2 at cycles 206/208, failover row, 60 governor cycles of 237 = 25.3%). Flag: beta 2.166 is a two-regime blend (177 capable + 60 fallback cycles) - never a capable-regime rate.' },
};

function median(xs) { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; }
function round(x, d = 4) { const p = 10 ** d; return Math.round(x * p) / p; }

function main() {
  const traceDays = traceFeed.loadAll(path.join(ROOT, 'pulse'));
  const govRows = governorFeed.load(path.join(ROOT, 'ledger', 'mind-calls.jsonl'));
  const reconciliation = governorFeed.reconcile(govRows, traceDays);
  const govCoverage = governorFeed.coverage(govRows);
  const commissions = commissionFeed.load(path.join(HERE, 'feeds', 'commissions.jsonl'));
  const consults = consultFeed.load(path.join(ROOT, 'commons', 'consults'));

  // ---- unified call ledger (study D.3 row shape) ----
  const outRows = [];
  for (const d of Object.values(traceDays)) outRows.push(...d.calls, ...d.failed);
  outRows.push(...consults, ...commissions);
  outRows.sort((a, b) => String(a.ts).localeCompare(String(b.ts)));

  // ---- per-day table ----
  const perDay = {};
  for (const [day, d] of Object.entries(traceDays)) {
    perDay[day] = { ...d.stats, validity: VALIDITY[day] };
  }
  perDay[8] = { cycles: 0, validity: VALIDITY[8] };

  // ---- baseline (study D.4 step 2): last three valid days ----
  const validDays = Object.keys(VALIDITY).map(Number).filter(d => VALIDITY[d].valid).sort((a, b) => a - b);
  const window = validDays.slice(-3);
  const betas = window.map(d => traceDays[d].stats.beta_wc_per_min);
  const beta0 = median(betas);

  // ---- target (step 3): decision_key classification over the valid record ----
  // Success census: keys with >= 3 world-evidenced successes (result.ok) across
  // ALL valid days. C measured over the baseline window's calls. C is an upper
  // bound (study's own label): success in the record is not proof an asset
  // exists that can serve the call — only that the decision has repeated.
  const successes = {};
  for (const d of validDays) {
    for (const c of traceDays[d].calls) {
      if (c.outcome_ok && c.decision_key) successes[c.decision_key] = (successes[c.decision_key] || 0) + 1;
    }
  }
  const compilableKeys = Object.keys(successes).filter(k => successes[k] >= 3);
  let winWc = 0, winCompilableWc = 0, winCalls = 0, winCompilableCalls = 0;
  for (const d of window) {
    for (const c of traceDays[d].calls) {
      winWc += c.wc || 0; winCalls += 1;
      if (c.decision_key && successes[c.decision_key] >= 3) { winCompilableWc += c.wc || 0; winCompilableCalls += 1; }
    }
  }
  const C_wc = winWc ? winCompilableWc / winWc : 0;
  const C_calls = winCalls ? winCompilableCalls / winCalls : 0;
  const nu = 1 - C_wc;
  const betaInf = beta0 * (1 - C_wc * (1 - R_RESIDUAL));

  // ---- proven assets (step 4): >= 5 live uses, >= 80% world-evidenced
  //      success, no floor event attributable. Read from the skills library. ----
  const assets = [];
  const skillsDir = path.join(ROOT, 'skills');
  for (const f of fs.readdirSync(skillsDir).filter(x => x.endsWith('.json'))) {
    const a = JSON.parse(fs.readFileSync(path.join(skillsDir, f), 'utf8'));
    const uses = a.uses || [];
    const liveUses = uses.length;
    const proven = liveUses >= 5; // success/floor-event terms cannot rescue a 0-use asset
    assets.push({ asset: a.id || f, status: a.status || null, live_uses: liveUses, proven, retired_share: 0 });
  }
  const credit = assets.filter(a => a.proven).reduce((s, a) => s + a.retired_share * (1 - R_RESIDUAL), 0);

  // ---- floor (study D.6), driver class, for the NEXT citizen day.
  //      Next-day shape from the day-11 charter draft: 85 planned minutes,
  //      scenario #2 = 1 new scenario, 1 scenario beat. ----
  const nextDay = { planned_minutes: 85, n_new_scenarios: 1, scenario_beats: 1,
    basis: 'pulse/DAY11-CHARTER-DRAFT-20261109.md (85 min drafted from day 10; scenario #2 single element, one beat)' };
  const floors = {
    novelty_wc_per_min: round(nu * beta0 * 1.25),
    liveness_wc_per_min: 1.0, // one deliberated decision per 60 s of unscripted time, at capable weight 1.0
    character_wc_per_min: round(6 * nextDay.scenario_beats / nextDay.planned_minutes),
    audit_judge_per_day: { value_wc: 5, basis: 'max(5 per day, 5% of beta0_judge); beta0_judge is GAP (no judge baseline exists), so the 5-per-day term stands alone' },
  };
  const betaFloor = Math.max(floors.novelty_wc_per_min, floors.liveness_wc_per_min, floors.character_wc_per_min);

  // ---- schedule (step 4) + day budget (step 5) ----
  const betaNext = Math.max(betaFloor, beta0 * (1 - Math.min(0.20, credit)));
  const budget = {
    derived_for: 'next citizen day (day 11 shape)',
    baseline_window_days: window, valid_days: validDays,
    beta_by_window_day: Object.fromEntries(window.map(d => [d, traceDays[d].stats.beta_wc_per_min])),
    beta0_driver_wc_per_min: round(beta0),
    beta_noise_band: [Math.min(...betas), Math.max(...betas)],
    C_compilable_share_wc: round(C_wc), C_compilable_share_calls: round(C_calls),
    nu_novelty_share: round(nu), r_residual: R_RESIDUAL,
    beta_inf_accounting_target: round(betaInf),
    compilable_keys_count: compilableKeys.length,
    assets, credit: round(credit),
    budget_falls: credit > 0,
    beta_floor_driver_wc_per_min: round(betaFloor), floors,
    beta_next_operative_ceiling: round(betaNext),
    scenario_allowance_A_wc: null, // GAP — scenario #1's authoring calls were never metered (see commission feed)
    day_budget_driver_wc: round(betaNext * nextDay.planned_minutes),
    day_budget_note: `B = beta_next x ${nextDay.planned_minutes} planned min = ${round(betaNext * nextDay.planned_minutes)} wc, PLUS A x ${nextDay.n_new_scenarios} new scenario(s) with A = GAP (unmeasured). The no-new-scenario budget is the numeric figure.`,
    hard_cap_driver_wc: round(2 * betaNext * nextDay.planned_minutes),
    hard_cap_note: 'Study D.7: at >= 200% the response is reroute to a PROVEN fallback or defer — never a floor act, never the body. No proven fallback exists today.',
    next_day_shape: nextDay,
    kappa_by_window_day: Object.fromEntries(window.map(d => [d, traceDays[d].stats.kappa_wc_per_act])),
  };

  fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
  fs.writeFileSync(path.join(HERE, 'out', 'call-ledger.jsonl'), outRows.map(r => JSON.stringify(r)).join('\n') + '\n');
  fs.writeFileSync(path.join(HERE, 'out', 'per-day.json'), JSON.stringify({
    per_day: perDay, governor_feed_coverage: govCoverage,
    governor_reconciliation: reconciliation,
    consult_calls_total: consults.length,
    commission_entries: commissions.length,
    commission_unmetered: commissions.filter(c => c.calls === null).length,
  }, null, 1));
  fs.writeFileSync(path.join(HERE, 'out', 'budget.json'), JSON.stringify(budget, null, 1));
  console.log(JSON.stringify({ window, beta0: round(beta0), C_wc: round(C_wc), betaInf: round(betaInf), betaFloor: round(betaFloor), betaNext: round(betaNext), rows: outRows.length }, null, 1));
}

main();
