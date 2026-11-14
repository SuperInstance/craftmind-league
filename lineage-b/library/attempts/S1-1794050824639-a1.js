// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak logs and birch logs to build a crafting table and create a wooden pickaxe
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // Need at least 4 oak logs for crafting table
  // Need at least 1 birch log for crafting table (if oak logs aren't enough)
  const neededOakLogs = Math.max(0, 4 - oakLogs);
  const neededBirchLogs = Math.max(0, 4 - oakLogs - birchLogs);
  
  // Collect oak logs if needed
  if (neededOakLogs > 0) {
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, neededOakLogs);
    if (oakLogsNearby.length < neededOakLogs) {
      throw new Error(`Not enough oak logs found. Needed ${neededOakLogs}, found ${oakLogsNearby.length}`);
    }
    await helpers.collect(bot, 'oak_log', neededOakLogs, { maxDistance: 20 });
  }
  
  // Collect birch logs if needed
  if (neededBirchLogs > 0) {
    const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 20, neededBirchLogs);
    if (birchLogsNearby.length < neededBirchLogs) {
      throw new Error(`Not enough birch logs found. Needed ${neededBirchLogs}, found ${birchLogsNearby.length}`);
    }
    await helpers.collect(bot, 'birch_log', neededBirchLogs, { maxDistance: 20 });
  }
  
  // Verify we have enough logs
  const newOakLogs = helpers.count(bot, 'oak_log');
  const newBirchLogs = helpers.count(bot, 'birch_log');
  if (newOakLogs + newBirchLogs < 4) {
    throw new Error(`Not enough logs to craft a crafting table. Have ${newOakLogs} oak logs and ${newBirchLogs} birch logs`);
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxeCount < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlocks(bot, 'crafting_table', 20, 1).length > 0;
  const craftingTableInInventory = helpers.count(bot, 'crafting_table') > 0;
  const woodenPickaxeInInventory = helpers.count(bot, 'wooden_pickaxe') > 0;
  
  const ok = (craftingTableNearby || craftingTableInInventory) && woodenPickaxeInInventory;
  
  return {
    ok,
    evidence: {
      crafting_table_nearby: craftingTableNearby,
      crafting_table_in_inventory: craftingTableInInventory,
      wooden_pickaxe_in_inventory: woodenPickaxeInInventory
    }
  };
};
