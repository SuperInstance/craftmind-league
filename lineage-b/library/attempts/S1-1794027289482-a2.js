// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and birch logs to create wooden tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Go back to anchor first
  await helpers.gotoAnchor(bot, anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // Collect logs if needed
  if (oakLogs < 10) {
    const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
    if (!oakLogBlock) {
      throw new Error('No oak logs found nearby');
    }
    await helpers.collect(bot, 'oak_log', 10 - oakLogs, { maxDistance: 30 });
  }
  
  if (birchLogs < 10) {
    const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
    if (!birchLogBlock) {
      throw new Error('No birch logs found nearby');
    }
    await helpers.collect(bot, 'birch_log', 10 - birchLogs, { maxDistance: 30 });
  }
  
  // Craft crafting table
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount === 0) {
    await helpers.craft(bot, 'crafting_table', 1);
  }
  
  // Craft wooden pickaxe
  const woodenPickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (woodenPickaxeCount === 0) {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  }
  
  // Verify we have the required items
  if (helpers.count(bot, 'crafting_table') === 0) {
    throw new Error('Failed to craft crafting table');
  }
  
  if (helpers.count(bot, 'wooden_pickaxe') === 0) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  const woodenPickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: craftingTableCount > 0 && woodenPickaxeCount > 0,
    evidence: {
      craftingTableCount,
      woodenPickaxeCount
    }
  };
};