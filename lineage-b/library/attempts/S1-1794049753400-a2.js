// skill: buildCraftingTable
// stage: S1
// purpose: Gather oak logs and birch logs to build a crafting table and craft a wooden pickaxe
// postconditions: Crafting table is crafted and in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs and birch logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // If we don't have enough logs, collect more
  if (oakLogs < 4 || birchLogs < 4) {
    // Collect oak logs first
    if (oakLogs < 4) {
      const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
      if (oakLogBlock) {
        await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 2);
        await bot.dig(oakLogBlock);
      } else {
        throw new Error("No oak logs found within 30 blocks");
      }
    }
    
    // Collect birch logs
    if (birchLogs < 4) {
      const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
      if (birchLogBlock) {
        await helpers.goto(bot, birchLogBlock.position.x, birchLogBlock.position.y, birchLogBlock.position.z, 2);
        await bot.dig(birchLogBlock);
      } else {
        throw new Error("No birch logs found within 30 blocks");
      }
    }
  }
  
  // Now attempt to craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (err) {
    // If crafting fails, check if we have enough logs
    const oakLogsNow = helpers.count(bot, 'oak_log');
    const birchLogsNow = helpers.count(bot, 'birch_log');
    
    if (oakLogsNow < 4 && birchLogsNow < 4) {
      throw new Error("Not enough logs to craft a crafting table");
    }
    
    // If we have enough logs but still can't craft, it's likely a world issue
    throw new Error("Failed to craft crafting table despite having enough logs");
  }
  
  // Now craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (err) {
    throw new Error("Failed to craft wooden pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.count(bot, 'crafting_table') > 0;
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const woodenPickaxeInInventory = helpers.count(bot, 'wooden_pickaxe') > 0;
  
  const ok = (craftingTableInInventory || craftingTableNearby) && woodenPickaxeInInventory;
  
  return {
    ok,
    evidence: {
      craftingTableInInventory,
      craftingTableNearby,
      woodenPickaxeInInventory
    }
  };
};