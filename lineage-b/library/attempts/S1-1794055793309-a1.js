// skill: gatherWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to craft a crafting table and wooden tools
// postconditions: Crafting table is placed or carried within 20 blocks AND wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to craft a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need 4 logs total for a crafting table (any combination)
  if (oakLogs + birchLogs < 4) {
    // Collect more logs
    const logsToCollect = 4 - (oakLogs + birchLogs);
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // Check if we still need more after collecting oak logs
    const newOakLogs = helpers.count(bot, 'oak_log');
    const newBirchLogs = helpers.count(bot, 'birch_log');
    const totalLogs = newOakLogs + newBirchLogs;
    
    if (totalLogs < 4) {
      // Collect more birch logs if needed
      const additionalLogs = 4 - totalLogs;
      await helpers.collect(bot, 'birch_log', additionalLogs, { maxDistance: 30 });
    }
  }
  
  // Now try to craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (error) {
    // If crafting fails, check if we're near a crafting table
    const nearbyCraftingTables = helpers.findBlocks(bot, 'crafting_table', 20);
    if (nearbyCraftingTables.length === 0) {
      throw new Error("Failed to craft crafting table and no nearby crafting table found");
    }
  }
  
  // Check if we have a crafting table
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount === 0) {
    // If we don't have one, try to place it
    const craftingTableBlock = helpers.findBlock(bot, 'crafting_table', 20);
    if (!craftingTableBlock) {
      throw new Error("No crafting table in inventory or nearby");
    }
  }
  
  // Craft wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (error) {
    throw new Error("Failed to craft wooden pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlocks(bot, 'crafting_table', 20).length > 0;
  const craftingTableInInventory = helpers.count(bot, 'crafting_table') > 0;
  const woodenPickaxeInInventory = helpers.count(bot, 'wooden_pickaxe') > 0;
  
  const ok = (craftingTableNearby || craftingTableInInventory) && woodenPickaxeInInventory;
  
  return {
    ok,
    evidence: {
      craftingTableNearby,
      craftingTableInInventory,
      woodenPickaxeInInventory
    }
  };
};
