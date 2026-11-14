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
  
  // Since we failed before, let's try a different approach
  // First, check if we have enough logs to make planks
  const logsNeeded = Math.max(0, 4 - oakLogs);
  const planksNeeded = Math.max(0, 4 - oakPlanks);
  
  // If we don't have enough logs, find and collect them
  if (logsNeeded > 0) {
    // Find oak logs nearby using a larger search radius
    const oakLogBlocks = helpers.findBlocks(bot, 'oak_log', 50, 10);
    if (oakLogBlocks.length === 0) {
      throw new Error('No oak logs found within 50 blocks');
    }
    
    // Collect the required number of logs
    await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 50 });
    
    // Verify we have enough logs now
    const newOakLogs = helpers.count(bot, 'oak_log');
    if (newOakLogs < 4) {
      throw new Error(`Failed to collect enough oak logs. Got ${newOakLogs}, needed 4`);
    }
  }
  
  // Now craft planks from the logs (if we don't have enough)
  if (planksNeeded > 0) {
    // Check if we have enough logs to craft planks
    const logsToCraft = Math.min(planksNeeded, helpers.count(bot, 'oak_log'));
    if (logsToCraft < planksNeeded) {
      throw new Error(`Not enough oak logs to craft ${planksNeeded} planks`);
    }
    
    // Craft the required number of planks
    await helpers.craft(bot, 'oak_planks', planksNeeded);
    
    // Verify we have enough planks
    const newOakPlanks = helpers.count(bot, 'oak_planks');
    if (newOakPlanks < 4) {
      throw new Error(`Failed to craft enough oak planks. Got ${newOakPlanks}, needed 4`);
    }
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