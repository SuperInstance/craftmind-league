// skill: gatherWoodForTools
// stage: S1
// purpose: Collect enough oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: A crafting table is crafted and placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor position
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory for logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to craft a crafting table
  if (oakLogs + birchLogs < 4) {
    // Calculate how many more logs we need
    const logsNeeded = 4 - (oakLogs + birchLogs);
    
    // If we have some logs, we might be able to collect more
    if (logsNeeded > 0) {
      // Try to find and collect more logs
      const logsToCollect = Math.min(logsNeeded, 10); // Collect up to 10 logs
      
      // First, try to find oak logs
      const oakLogsFound = helpers.findBlocks(bot, 'oak_log', 30, logsToCollect);
      if (oakLogsFound.length > 0) {
        await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
      } else {
        // If no oak logs found, try birch logs
        const birchLogsFound = helpers.findBlocks(bot, 'birch_log', 30, logsToCollect);
        if (birchLogsFound.length > 0) {
          await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
        } else {
          // If no logs found nearby, we need to go to a place with logs
          // Let's assume there are logs in the survey data
          const survey = ctx.state.survey;
          if (survey.oak_log > 0 || survey.birch_log > 0) {
            // We'll try to go to a nearby log source
            // For now, just try to gather what we have
            throw new Error("No oak or birch logs found nearby to craft a crafting table");
          } else {
            throw new Error("No oak or birch logs found nearby to craft a crafting table");
          }
        }
      }
    }
  }
  
  // Recheck our inventory after collection
  const oakLogsAfter = helpers.count(bot, 'oak_log');
  const birchLogsAfter = helpers.count(bot, 'birch_log');
  
  if (oakLogsAfter + birchLogsAfter < 4) {
    throw new Error("Not enough logs to craft a crafting table");
  }
  
  // Craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (error) {
    // If crafting fails, we should check if there's already a crafting table nearby
    const nearbyCraftingTable = helpers.findBlock(bot, 'crafting_table', 20);
    if (!nearbyCraftingTable) {
      throw new Error("Failed to craft crafting table and no nearby crafting table found");
    }
  }
  
  // Place the crafting table near us
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  if (craftingTableInInventory) {
    // Place the crafting table
    const groundY = helpers.groundHeight(bot, ctx.anchor.x, ctx.anchor.z, ctx.anchor.y);
    await helpers.placeAt(bot, 'crafting_table', ctx.anchor.x, groundY + 1, ctx.anchor.z);
  }
  
  // Now craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (error) {
    throw new Error("Failed to craft wooden pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  // Check if we have a crafting table in inventory or nearby
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const nearbyCraftingTable = helpers.findBlock(bot, 'crafting_table', 20);
  const woodenPickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  const craftingTableExists = craftingTableInInventory || nearbyCraftingTable;
  
  return {
    ok: craftingTableExists && woodenPickaxeInInventory,
    evidence: {
      craftingTableInInventory,
      nearbyCraftingTable: !!nearbyCraftingTable,
      woodenPickaxeInInventory
    }
  };
};