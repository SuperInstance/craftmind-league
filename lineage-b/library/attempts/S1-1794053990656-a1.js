// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs from the nearby forest to build a crafting table
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs to craft a crafting table (4 logs)
  if (!helpers.has(bot, 'oak_log', 4)) {
    // Find nearby oak logs
    const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
    if (oakLogs.length === 0) {
      throw new Error('No oak logs found nearby');
    }
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
    
    // Verify we have the logs
    if (!helpers.has(bot, 'oak_log', 4)) {
      throw new Error('Failed to collect enough oak logs');
    }
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was created
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was created
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      hasCraftingTable,
      hasWoodenPickaxe
    }
  };
};
