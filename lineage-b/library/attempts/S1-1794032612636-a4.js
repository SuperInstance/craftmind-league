// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak and birch logs to craft wooden tools
// postconditions: Crafting table carried or placed within 20 blocks AND wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, anchor);
  
  // Collect oak logs
  const oakLogs = await helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found within 30 blocks');
  }
  
  // Collect birch logs
  const birchLogs = await helpers.findBlocks(bot, 'birch_log', 30, 10);
  if (birchLogs.length === 0) {
    throw new Error('No birch logs found within 30 blocks');
  }
  
  // Collect enough logs for crafting
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  await helpers.collect(bot, 'birch_log', 5, { maxDistance: 30 });
  
  // Verify we have enough logs
  if (!helpers.has(bot, 'oak_log', 5) || !helpers.has(bot, 'birch_log', 5)) {
    throw new Error('Not enough logs collected');
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table is in inventory
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe is in inventory
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (hasCraftingTable || craftingTableNearby) && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby,
      hasCraftingTable,
      hasWoodenPickaxe
    }
  };
};