// skill: buildCraftingTable
// stage: S1
// purpose: Collect oak logs and craft a crafting table, then a wooden pickaxe
// postconditions: Crafting table is in inventory or placed within 20 blocks, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor to ensure we're in the correct location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 4)) {
    // Collect oak logs from nearby trees
    const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 4);
    if (oakLogs.length < 4) {
      throw new Error('Not enough oak logs found nearby');
    }
    
    // Collect the logs
    await helpers.collect(bot, 'oak_log', 4);
  }
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null || helpers.has(bot, 'crafting_table', 1);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTableNearby && hasPickaxe,
    evidence: {
      craftingTableNearby,
      hasPickaxe,
      inventory: helpers.inventoryList(bot)
    }
  };
};