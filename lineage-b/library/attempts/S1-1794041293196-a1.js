// skill: gatherWoodForTools
// stage: S1
// purpose: Collect at least 5 oak logs from the designated location
// postconditions: Have at least 5 oak logs in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right area
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we have the right wood type available
  const survey = ctx.state.survey;
  if (survey.oak_log < 5) {
    throw new Error(`Not enough oak logs available. Found ${survey.oak_log}, need at least 5`);
  }
  
  // Navigate to the oak log gathering location
  const targetPosition = { x: 69, y: 67, z: -80 };
  await helpers.goto(bot, targetPosition.x, targetPosition.y, targetPosition.z, 3);
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  
  // Verify we have collected enough logs
  if (helpers.count(bot, 'oak_log') < 5) {
    throw new Error(`Failed to collect enough oak logs. Got ${helpers.count(bot, 'oak_log')}, need 5`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
                         helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 5 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs_collected: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};
