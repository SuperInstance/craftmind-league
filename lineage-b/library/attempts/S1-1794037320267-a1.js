// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs to craft a crafting table and wooden pickaxe
// postconditions: Crafting table in inventory or nearby, and wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    // Find oak logs nearby
    const oakLogBlock = helpers.findBlock(bot, 'oak_log', 20);
    if (!oakLogBlock) {
      throw new Error('No oak logs found within 20 blocks');
    }
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 20 });
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
