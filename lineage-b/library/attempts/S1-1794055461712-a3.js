// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs to craft a crafting table and wooden tools
// postconditions: Crafting table in inventory or within 20 blocks AND wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to craft a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to craft a crafting table
  if (oakLogs + birchLogs < 4) {
    // Collect more logs
    const logsToCollect = 4 - (oakLogs + birchLogs);
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // Check again after collection
    const newOakLogs = helpers.count(bot, 'oak_log');
    const newBirchLogs = helpers.count(bot, 'birch_log');
    
    if (newOakLogs + newBirchLogs < 4) {
      throw new Error(`Failed to collect enough logs. Have ${newOakLogs} oak logs and ${newBirchLogs} birch logs, need 4 total`);
    }
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was created
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error(`Failed to craft crafting table. Have ${craftingTableCount} crafting tables`);
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