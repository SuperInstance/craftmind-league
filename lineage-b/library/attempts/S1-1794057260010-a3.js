// skill: buildCraftingTable
// stage: S1
// purpose: Gather enough logs to craft a crafting table and then craft wooden tools
// postconditions: Crafting table is crafted and carried or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to craft a crafting table
  if (oakLogs < 4 && birchLogs < 4) {
    // Collect more logs - prioritize oak logs based on survey
    const oakLogsNeeded = Math.max(0, 4 - oakLogs);
    const birchLogsNeeded = Math.max(0, 4 - birchLogs);
    
    // Collect oak logs first if we have them in survey
    if (ctx.state.survey.oak_log > 0 && oakLogsNeeded > 0) {
      await helpers.collect(bot, 'oak_log', oakLogsNeeded, { maxDistance: 30 });
    }
    
    // If still need more, collect birch logs
    const newOakLogs = helpers.count(bot, 'oak_log');
    const newBirchLogs = helpers.count(bot, 'birch_log');
    const remainingOakNeeded = Math.max(0, 4 - newOakLogs);
    const remainingBirchNeeded = Math.max(0, 4 - newBirchLogs);
    
    if (remainingBirchNeeded > 0 && ctx.state.survey.birch_log > 0) {
      await helpers.collect(bot, 'birch_log', remainingBirchNeeded, { maxDistance: 30 });
    }
    
    // Verify we have enough logs now
    const finalOakLogs = helpers.count(bot, 'oak_log');
    const finalBirchLogs = helpers.count(bot, 'birch_log');
    
    if (finalOakLogs < 4 && finalBirchLogs < 4) {
      throw new Error('Not enough logs to craft a crafting table');
    }
  }
  
  // Craft a crafting table using 4 logs (any type)
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxeCount < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  
  // Check if crafting table is carried or placed within 20 blocks
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  
  return {
    ok: craftingTableCount >= 1 && pickaxeCount >= 1 && (craftingTableNearby !== null || craftingTableCount >= 1),
    evidence: {
      craftingTableCarried: craftingTableCount >= 1,
      pickaxeInInventory: pickaxeCount >= 1,
      craftingTableNearby: craftingTableNearby !== null
    }
  };
};