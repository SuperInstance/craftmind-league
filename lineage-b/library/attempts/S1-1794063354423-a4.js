// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough planks for crafting a crafting table and wooden pickaxe
// postconditions: Have enough oak logs and planks to craft a crafting table and a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const oakPlanks = helpers.count(bot, 'oak_planks');
  const craftingTables = helpers.count(bot, 'crafting_table');
  
  // If we already have a crafting table, we're done with this part
  if (craftingTables > 0) {
    return;
  }
  
  // We need 4 oak logs to make 4 oak planks (needed for crafting table)
  // We also need 2 oak planks for a wooden pickaxe
  // So we need at least 4 oak logs to make planks for crafting table
  if (oakLogs < 4) {
    // Find nearby oak logs to collect
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30);
    
    if (oakLogsNearby.length === 0) {
      throw new Error("No oak logs found nearby to collect");
    }
    
    // Collect the required number of oak logs
    const logsToGather = 4 - oakLogs;
    await helpers.collect(bot, 'oak_log', logsToGather, { maxDistance: 30 });
    
    // Verify we collected enough
    const newOakLogs = helpers.count(bot, 'oak_log');
    if (newOakLogs < 4) {
      throw new Error(`Failed to collect enough oak logs. Got ${newOakLogs}, needed 4`);
    }
  }
  
  // Now we have enough logs to make planks
  // Craft planks from logs (4 logs = 4 planks)
  await helpers.craft(bot, 'oak_planks', 1);
  
  // Verify we now have planks
  const newPlanks = helpers.count(bot, 'oak_planks');
  if (newPlanks < 4) {
    throw new Error(`Failed to craft enough planks. Got ${newPlanks}, needed 4`);
  }
  
  // Now craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify we now have a crafting table
  const finalCraftingTables = helpers.count(bot, 'crafting_table');
  if (finalCraftingTables < 1) {
    throw new Error(`Failed to craft crafting table. Got ${finalCraftingTables}`);
  }
  
  // Now craft a wooden pickaxe using 3 planks for the head and 2 sticks for the handle
  // Check if we have enough planks and sticks
  const planksForPickaxe = 3;
  const sticksForPickaxe = 2;
  
  // We need to make sure we have enough planks for the pickaxe
  if (newPlanks < 4) {
    // We need to craft more planks
    await helpers.craft(bot, 'oak_planks', 1);
  }
  
  // Check if we have enough sticks for the handle
  const sticks = helpers.count(bot, 'stick');
  if (sticks < sticksForPickaxe) {
    // We need to craft sticks from planks
    await helpers.craft(bot, 'stick', 1);
  }
  
  // Now craft the wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
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