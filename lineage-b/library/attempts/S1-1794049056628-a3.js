// skill: buildCraftingTable
// stage: S1
// purpose: Gather oak logs and craft a crafting table, then craft a wooden pickaxe
// postconditions: Crafting table in inventory or nearby, wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs for a crafting table (4 logs)
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    // Collect additional oak logs
    const logsToCollect = 4 - oakLogs;
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // Verify we collected enough
    const newOakLogs = helpers.count(bot, 'oak_log');
    if (newOakLogs < 4) {
      throw new Error(`Failed to collect enough oak logs. Have ${newOakLogs}, need 4`);
    }
  }
  
  // Craft the crafting table using the oak logs
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was created
  const craftingTables = helpers.count(bot, 'crafting_table');
  if (craftingTables < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was created
  const woodenPickaxes = helpers.count(bot, 'wooden_pickaxe');
  if (woodenPickaxes < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const craftingTableInInventory = helpers.count(bot, 'crafting_table');
  const woodenPickaxeInInventory = helpers.count(bot, 'wooden_pickaxe');
  
  const ok = (craftingTableInInventory > 0 || craftingTableNearby !== null) && woodenPickaxeInInventory > 0;
  
  return {
    ok,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      craftingTableInInventory: craftingTableInInventory > 0,
      woodenPickaxeInInventory: woodenPickaxeInInventory > 0
    }
  };
};