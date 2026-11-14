// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs from the nearby forest to build a crafting table and progress toward wooden tools
// postconditions: Have enough oak logs to build a crafting table and have a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs to build a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 4) {
    // We have enough logs, but we need to build the crafting table
    // First, check if we have a crafting table in inventory or nearby
    const craftingTableInInventory = helpers.has(bot, 'crafting_table');
    const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
    
    if (!craftingTableInInventory && !craftingTableNearby) {
      // Need to build crafting table
      await helpers.craft(bot, 'crafting_table', 1);
    }
    
    // Now craft a wooden pickaxe
    await helpers.craft(bot, 'wooden_pickaxe', 1);
    return;
  }
  
  // We don't have enough oak logs, so we need to gather more
  // Find nearby oak logs
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakLogsNearby.length > 0) {
    // Collect the oak logs
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  } else {
    // If no logs nearby, go to a location with oak logs
    // Since we're at anchor, we'll try to find a good spot to gather logs
    const survey = helpers.survey(bot);
    const oakLogCount = survey.oak_log;
    
    if (oakLogCount > 0) {
      // Try to find a good spot to collect logs
      const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
      if (oakLogBlock) {
        await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 2);
        await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
      } else {
        throw new Error("No oak logs found in survey area");
      }
    } else {
      // If no logs in survey, we might need to go to a different area
      // For now, we'll just try to find logs in a reasonable area
      const oakLogBlock = helpers.findBlock(bot, 'oak_log', 50);
      if (oakLogBlock) {
        await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 2);
        await helpers.collect(bot, 'oak_log', 10, { maxDistance: 50 });
      } else {
        throw new Error("No oak logs found within 50 blocks");
      }
    }
  }
  
  // After collecting logs, check if we have enough to build a crafting table
  const logsAfterCollection = helpers.count(bot, 'oak_log');
  if (logsAfterCollection >= 4) {
    // Build crafting table
    await helpers.craft(bot, 'crafting_table', 1);
    // Craft wooden pickaxe
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.has(bot, 'crafting_table');
  const woodenPickaxeInInventory = helpers.has(bot, 'wooden_pickaxe');
  const oakLogs = helpers.count(bot, 'oak_log');
  
  return {
    ok: craftingTableInInventory && woodenPickaxeInInventory && oakLogs >= 4,
    evidence: {
      craftingTableInInventory,
      woodenPickaxeInInventory,
      oakLogs
    }
  };
};
