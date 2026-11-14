// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs to craft a crafting table and wooden tools
// postconditions: Crafting table is crafted and either carried or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to craft a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to craft a crafting table
  if (oakLogs + birchLogs < 4) {
    // If we don't have enough logs, we need to gather more
    const logsToGather = 4 - (oakLogs + birchLogs);
    const oakLogsNeeded = Math.min(logsToGather, 4);
    
    // Find nearby oak logs to collect
    const oakLogsFound = helpers.findBlocks(bot, 'oak_log', 30, 10);
    if (oakLogsFound.length > 0) {
      // Collect oak logs
      await helpers.collect(bot, 'oak_log', oakLogsNeeded, { maxDistance: 30 });
    } else {
      // If no oak logs found, try to find birch logs
      const birchLogsFound = helpers.findBlocks(bot, 'birch_log', 30, 10);
      if (birchLogsFound.length > 0) {
        await helpers.collect(bot, 'birch_log', oakLogsNeeded, { maxDistance: 30 });
      } else {
        // If no logs found nearby, we'll need to search for more
        throw new Error("No oak or birch logs found nearby to craft a crafting table");
      }
    }
  }
  
  // Now craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (error) {
    // If crafting fails, try to find a nearby crafting table
    const nearbyCraftingTable = helpers.findBlock(bot, 'crafting_table', 20);
    if (!nearbyCraftingTable) {
      throw new Error("Failed to craft crafting table and no nearby crafting table found");
    }
  }
  
  // Check if we have a crafting table in inventory or nearby
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const nearbyCraftingTable = helpers.findBlock(bot, 'crafting_table', 20);
  
  if (!craftingTableInInventory && !nearbyCraftingTable) {
    throw new Error("No crafting table found in inventory or nearby");
  }
  
  // Now craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (error) {
    throw new Error("Failed to craft wooden pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
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
