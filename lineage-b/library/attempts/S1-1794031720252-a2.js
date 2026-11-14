// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak and birch logs to create wooden tools
// postconditions: Crafting table is carried or placed within 20 blocks AND wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // If we don't have enough logs, collect them first
  if (oakLogs < 10 || birchLogs < 10) {
    // Collect oak logs first
    if (oakLogs < 10) {
      const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
      if (!oakLogBlock) {
        throw new Error('No oak logs found within 30 blocks');
      }
      await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 1);
      await bot.dig(oakLogBlock);
    }
    
    // Collect birch logs
    if (birchLogs < 10) {
      const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
      if (!birchLogBlock) {
        throw new Error('No birch logs found within 30 blocks');
      }
      await helpers.goto(bot, birchLogBlock.position.x, birchLogBlock.position.y, birchLogBlock.position.z, 1);
      await bot.dig(birchLogBlock);
    }
  }
  
  // Now check again if we have enough logs
  const oakLogsAfter = helpers.count(bot, 'oak_log');
  const birchLogsAfter = helpers.count(bot, 'birch_log');
  
  if (oakLogsAfter < 10 || birchLogsAfter < 10) {
    throw new Error(`Not enough logs after collection: oak=${oakLogsAfter}, birch=${birchLogsAfter}`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if crafting table was successful
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if pickaxe was successful
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Verify the postconditions
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const pickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  if (!craftingTableInInventory || !pickaxeInInventory) {
    throw new Error('Postconditions not met: crafting table and/or pickaxe missing');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const pickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTableInInventory && pickaxeInInventory,
    evidence: {
      craftingTableInInventory,
      pickaxeInInventory
    }
  };
};