"use strict";
// movements.js — the two arms' Movements factories.
//
// Arm A (status quo): Lineage C's travel Movements exactly as deployed
// on 2026-11-07 (geist.js): canDig=true, allow1by1towers=false,
// maxDropDown=10, no exclusions.
//
// Arm B (candidate): the litter-aware configuration. Mechanism, from
// mineflayer-pathfinder/lib/movements.js:
//   getBlock() marks a cell `safe` when boundingBox === 'empty'.
//   leaf_litter has boundingBox 'empty' (shapes [] in all 16 states),
//   so a litter cell at feet level is `safe`, safeOrBreak() returns
//   only the step cost, and A* prices crossing it at plain move cost
//   while planning a walk-through the server refuses (the pile
//   collides at fractional height). Adding leaf_litter's type to
//   blocksToAvoid flips `safe` to false for litter cells; they then
//   route through safeOrBreak(), and since litter is diggable
//   (hardness 0) A* plans dig-through moves — move cost + dig labour
//   (~1 + (1 + 3*digTime/1000) * digCost) — executed by the follow
//   loop's toBreak handling. No cell is ever forbidden (no cost-100
//   wall: the failure mode that zeroed Lineage C's bowl trial), so a
//   route always exists; A* merely prefers clean cells when a short
//   detour exists and digs through litter when it doesn't.
// LITTER_STEP_COST is frozen by the dated amendment in README.md
// after the survey; the value below is the frozen one.
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const { Movements } = require(NM + "/mineflayer-pathfinder");

const LITTER_STEP_COST = 0; // frozen post-survey — see README amendment

function makeStatusQuoMovements(bot) {
  const mv = new Movements(bot);
  mv.canDig = true;
  mv.allow1by1towers = false;
  mv.maxDropDown = 10;
  return mv;
}

function makeLitterMovements(bot) {
  const mv = makeStatusQuoMovements(bot);
  const litter = bot.registry.blocksByName.leaf_litter;
  if (litter) mv.blocksToAvoid.add(litter.id);
  if (LITTER_STEP_COST > 0) {
    mv.exclusionAreasStep.push((block) => (block && block.name === "leaf_litter" ? LITTER_STEP_COST : 0));
  }
  return mv;
}

module.exports = { makeStatusQuoMovements, makeLitterMovements, LITTER_STEP_COST };
