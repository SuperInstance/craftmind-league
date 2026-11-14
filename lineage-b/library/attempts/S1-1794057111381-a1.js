// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs to craft a crafting table and wooden tools
// postconditions: Crafting table is crafted and carried or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to craft a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to craft a crafting table
  if (oakLogs < 4 && birchLogs < 4) {
    // Collect more logs
    const logsToCollect = 4 - Math.min(oakLogs, birchLogs);
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // If we still don't have enough, try birch logs
    const oakLogsAfter = helpers.count(bot, 'oak_log');
    const birchLogsAfter = helpers.count(bot, 'birch_log');
    
    if (oakLogsAfter < 4 && birchLogsAfter < 4) {
      throw new Error('Not enough logs to craft a crafting table');
    }
  }
  
  // Craft a crafting table
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
