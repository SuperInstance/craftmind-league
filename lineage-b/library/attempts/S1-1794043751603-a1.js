// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs from specified location to craft a crafting table
// postconditions: Crafting table is crafted and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 4)) {
    // Go to the specified location to gather oak logs
    await helpers.goto(bot, 69, 67, -80, 5);
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 10 });
    
    // Verify we collected enough logs
    if (!helpers.has(bot, 'oak_log', 4)) {
      throw new Error('Failed to collect enough oak logs');
    }
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