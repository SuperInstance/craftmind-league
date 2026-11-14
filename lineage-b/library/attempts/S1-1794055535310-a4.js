// skill: buildCraftingTable
// stage: S1
// purpose: Gather enough logs and build a crafting table to enable tool crafting
// postconditions: Crafting table in inventory or within 20 blocks AND wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  
  // If we already have a crafting table, we can proceed to tool crafting
  if (craftingTableCount > 0) {
    // Craft a wooden pickaxe
    await helpers.craft(bot, 'wooden_pickaxe', 1);
    return;
  }
  
  // We need at least 4 logs to craft a crafting table
  const totalLogs = oakLogs + birchLogs;
  if (totalLogs < 4) {
    // Collect more logs - we'll collect a few extra to be safe
    const logsNeeded = 4 - totalLogs;
    await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 30 });
    
    // Check if we collected enough
    const newOakLogs = helpers.count(bot, 'oak_log');
    const newBirchLogs = helpers.count(bot, 'birch_log');
    const newTotalLogs = newOakLogs + newBirchLogs;
    
    if (newTotalLogs < 4) {
      throw new Error(`Failed to collect enough logs. Have ${newOakLogs} oak logs and ${newBirchLogs} birch logs, need 4 total`);
    }
  }
  
  // Craft a crafting table using 4 logs (any combination of oak and birch logs)
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was created
  const craftingTableCountAfter = helpers.count(bot, 'crafting_table');
  if (craftingTableCountAfter < 1) {
    throw new Error(`Failed to craft crafting table. Have ${craftingTableCountAfter} crafting tables`);
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was created
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxeCount < 1) {
    throw new Error(`Failed to craft wooden pickaxe. Have ${pickaxeCount} pickaxes`);
  }
  
  // Report progress
  bot.chat("Successfully crafted crafting table and wooden pickaxe");
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const craftingTableInInventory = helpers.count(bot, 'crafting_table');
  const pickaxeInInventory = helpers.count(bot, 'wooden_pickaxe');
  
  const ok = (craftingTableNearby || craftingTableInInventory > 0) && pickaxeInInventory > 0;
  
  return {
    ok,
    evidence: {
      craftingTableNearby: !!craftingTableNearby,
      craftingTableInInventory,
      pickaxeInInventory
    }
  };
};