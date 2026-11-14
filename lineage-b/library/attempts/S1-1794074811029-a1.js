// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to build a crafting table and craft wooden tools
// postconditions: Crafting table is placed or carried within 20 blocks AND wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to build a crafting table (4 logs)
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs < 4 && birchLogs < 4) {
    throw new Error('Not enough wood logs to build crafting table');
  }
  
  // Collect more oak logs if needed
  if (oakLogs < 4) {
    const neededOak = 4 - oakLogs;
    await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
  }
  
  // Collect more birch logs if needed
  if (birchLogs < 4) {
    const neededBirch = 4 - birchLogs;
    await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
  }
  
  // Verify we have enough logs
  const oakLogsAfter = helpers.count(bot, 'oak_log');
  const birchLogsAfter = helpers.count(bot, 'birch_log');
  
  if (oakLogsAfter < 4 && birchLogsAfter < 4) {
    throw new Error('Not enough wood logs to build crafting table after collection');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if crafting table was successful
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if pickaxe was successful
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxeCount < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const craftingTableInInventory = helpers.count(bot, 'crafting_table');
  const pickaxeInInventory = helpers.count(bot, 'wooden_pickaxe');
  
  const ok = (craftingTableNearby !== null || craftingTableInInventory > 0) && pickaxeInInventory > 0;
  
  return {
    ok,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      craftingTableInInventory: craftingTableInInventory > 0,
      pickaxeInInventory: pickaxeInInventory > 0
    }
  };
};
