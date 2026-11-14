// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough planks for building a crafting table
// postconditions: Have at least 4 oak logs and 4 oak planks for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const oakPlanks = helpers.count(bot, 'oak_planks');
  
  // If we already have enough, we're done
  if (oakLogs >= 4 && oakPlanks >= 4) {
    return;
  }
  
  // Find more oak logs
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLogBlock) {
    throw new Error('No oak logs found within 30 blocks');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 4 - oakLogs, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const newOakLogs = helpers.count(bot, 'oak_log');
  if (newOakLogs < 4) {
    throw new Error(`Failed to collect enough oak logs. Got ${newOakLogs}, needed 4`);
  }
  
  // Now craft planks from the logs
  await helpers.craft(bot, 'oak_planks', 4 - oakPlanks);
  
  // Verify we have enough planks
  const newOakPlanks = helpers.count(bot, 'oak_planks');
  if (newOakPlanks < 4) {
    throw new Error(`Failed to craft enough oak planks. Got ${newOakPlanks}, needed 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const oakPlanks = helpers.count(bot, 'oak_planks');
  const craftingTable = helpers.has(bot, 'crafting_table');
  
  return {
    ok: oakLogs >= 4 && oakPlanks >= 4,
    evidence: {
      oakLogs: oakLogs,
      oakPlanks: oakPlanks,
      craftingTable: craftingTable
    }
  };
};