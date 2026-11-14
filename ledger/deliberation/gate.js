// THE BUDGETS GATE — the enforcement half, on paper only.
// Rules on a PROPOSED day's plan against out/budget.json (run build.js first).
// It never touches the body, the driver, or any live system: a breach may
// change who is asked or when, never whether the body runs (study D.7).
//
// Usage: node gate.js <plan.json>
// Plan: { name, planned_minutes, driver_wc, n_new_scenarios, scenario_beats,
//         proven_assets: [{asset, live_uses, success_rate, floor_events,
//                          retired_share}] }
// Rulings: PASS | OVER-TARGET (spending must re-route or the plan is re-cut) |
//          BELOW-FLOOR (alarm: the plan starves novelty, liveness, character
//          or audit — under-floor spend is a failure, not a saving).
'use strict';
const fs = require('fs');
const path = require('path');

const R_RESIDUAL = 0.1;

function isProven(a) {
  return a.live_uses >= 5 && a.success_rate >= 0.8 && (a.floor_events || 0) === 0;
}

function rule(plan, budget) {
  const beta0 = budget.beta0_driver_wc_per_min;
  const minutes = plan.planned_minutes;
  const betaPlan = plan.driver_wc / minutes;

  // Proven-asset credit, recomputed from the plan's own asset claims against
  // the study's proof bar — an asset the plan merely NAMES earns nothing.
  const claimed = plan.proven_assets || [];
  const proven = claimed.filter(isProven);
  const credit = proven.reduce((s, a) => s + (a.retired_share || 0) * (1 - R_RESIDUAL), 0);
  const ceiling = Math.max(budget.beta_floor_driver_wc_per_min, beta0 * (1 - Math.min(0.20, credit)));

  // Floors for THIS plan's shape (character floor scales with its beats).
  const floors = {
    novelty: budget.floors.novelty_wc_per_min,
    liveness: budget.floors.liveness_wc_per_min,
    character: +(6 * (plan.scenario_beats || 0) / minutes).toFixed(4),
  };
  const floor = Math.max(floors.novelty, floors.liveness, floors.character);
  const bindingFloor = Object.keys(floors).find(k => floors[k] === floor);

  const notes = [];
  if ((plan.n_new_scenarios || 0) > 0 && budget.scenario_allowance_A_wc === null) {
    notes.push('Plan includes new scenario(s) but the scenario allowance A is GAP (scenario #1 authoring was never metered): this ruling covers the driver rate only and is PROVISIONAL for the scenario part.');
  }
  if (claimed.length && !proven.length) {
    notes.push('Plan names asset(s) but none meets the proof bar (>=5 live uses, >=80% success, no attributable floor event): credit 0. The budget does not fall.');
  }
  if (!claimed.length) notes.push('No proven asset claimed: credit 0. The budget does not fall (beta ceiling = beta0, floored).');

  let ruling, why;
  if (betaPlan < floor) {
    ruling = 'BELOW-FLOOR';
    why = `beta_plan ${betaPlan.toFixed(3)} wc/min < floor ${floor.toFixed(3)} (binding: ${bindingFloor}). Under-floor spend is an ALARM, not a saving: check the logger, the route, and idleness — a starved plan produces standing-around.`;
  } else if (betaPlan > ceiling) {
    ruling = 'OVER-TARGET';
    why = `beta_plan ${betaPlan.toFixed(3)} wc/min > ceiling ${ceiling.toFixed(3)} (beta0 ${beta0} with proven-asset credit ${credit.toFixed(3)}). Spending must re-route: a proven asset retires its share, or the plan is re-cut. The gate rules on the plan only — it never touches the body.`;
    if (betaPlan >= 2 * ceiling) {
      why += ` HARD-CAP TERRITORY (>= 200% of ceiling): per study D.7 the response is reroute to a proven fallback — none is proven today — or defer the spend; the parent decides at the next safe point.`;
    }
  } else {
    ruling = 'PASS';
    why = `beta_plan ${betaPlan.toFixed(3)} wc/min sits between floor ${floor.toFixed(3)} (binding: ${bindingFloor}) and ceiling ${ceiling.toFixed(3)}.`;
  }
  return {
    plan: plan.name, planned_minutes: minutes, driver_wc: plan.driver_wc,
    beta_plan: +betaPlan.toFixed(4), floor_wc_per_min: floor, binding_floor: bindingFloor,
    ceiling_wc_per_min: +ceiling.toFixed(4), proven_assets_credited: proven.map(a => a.asset),
    credit: +credit.toFixed(4), ruling, why, notes,
  };
}

if (require.main === module) {
  const planFile = process.argv[2];
  if (!planFile) { console.error('usage: node gate.js <plan.json>'); process.exit(2); }
  const budget = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'budget.json'), 'utf8'));
  const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
  console.log(JSON.stringify(rule(plan, budget), null, 1));
}

module.exports = { rule, isProven };
