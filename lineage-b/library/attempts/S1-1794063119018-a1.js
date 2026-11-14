// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough planks for crafting a crafting table
// postconditions: Have enough oak logs and planks to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs and planks to craft a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const oakPlanks = helpers.count(bot, 'oak_planks');
  
  // We need 4 oak logs to make 4 oak planks, and then 4 planks to make a crafting table
  // So we need at least 4 oak logs to start making planks
  if (oakLogs < 4) {
    throw new Error(`Not enough oak logs: ${oakLogs} < 4 needed`);
  }
  
  // Check if we already have a crafting table
  const craftingTables = helpers.count(bot, 'crafting_table');
  if (craftingTables > 0) {
    // We already have a crafting table, so we're done
    return;
  }
  
  // We need to craft a crafting table from planks
  // First, we need to make planks from logs
  const planksNeeded = 4; // For crafting table
  const logsNeeded = 4; // 4 logs make 4 planks
  
  // Check if we have enough logs to make planks
  if (oakLogs < logsNeeded) {
    // We need to gather more logs
    const logsToGather = logsNeeded - oakLogs;
    
    // Find nearby oak logs to collect
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
    
    if (oakLogsNearby.length === 0) {
      throw new Error("No oak logs found nearby to collect");
    }
    
    // Collect the required number of oak logs
    await helpers.collect(bot, 'oak_log', logsToGather, { maxDistance: 30 });
    
    // Verify we collected enough
    const newOakLogs = helpers.count(bot, 'oak_log');
    if (newOakLogs < logsNeeded) {
      throw new Error(`Failed to collect enough oak logs. Got ${newOakLogs}, needed ${logsNeeded}`);
    }
  }
  
  // Now we have enough logs to make planks
  // Craft planks from logs
  await helpers.craft(bot, 'oak_planks', 1);
  
  // Verify we now have planks
  const newPlanks = helpers.count(bot, 'oak_planks');
  if (newPlanks < planksNeeded) {
    throw new Error(`Failed to craft enough planks. Got ${newPlanks}, needed ${planksNeeded}`);
  }
  
  // Now craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify we now have a crafting table
  const finalCraftingTables = helpers.count(bot, 'crafting_table');
  if (finalCraftingTables < 1) {
    throw new Error(`Failed to craft crafting table. Got ${finalCraftingTables}`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTables = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTables >= 1 && woodenPickaxe,
    evidence: {
      craftingTables: craftingTables,
      woodenPickaxe: woodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      oakPlanks: helpers.count(bot, 'oak_planks')
    }
  };
};