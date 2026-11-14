// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and craft a crafting table and wooden pickaxe
// postconditions: Crafting table is in inventory or placed within 20 blocks, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs (need 4 for crafting table)
  if (!helpers.has(bot, 'oak_log', 4)) {
    // Collect oak logs
    const logs = await helpers.findBlocks(bot, 'oak_log', 30, 4);
    if (logs.length < 4) {
      throw new Error(`Not enough oak logs found. Need 4, found ${logs.length}`);
    }
    
    // Collect the logs
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if crafting table was made
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if pickaxe was made
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
