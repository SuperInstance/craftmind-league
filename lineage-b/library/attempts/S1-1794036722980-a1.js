// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and craft a crafting table and wooden pickaxe
// postconditions: Crafting table in inventory or nearby, wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 4)) {
    // Find oak logs near the anchor
    const oakLogs = helpers.findBlocks(bot, 'oak_log', 20, 4);
    if (oakLogs.length < 4) {
      throw new Error(`Not enough oak logs found near anchor. Found ${oakLogs.length}, need 4`);
    }
    
    // Collect the oak logs
    await helpers.collect(bot, 'oak_log', 4, { drop: false, tools: [] });
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
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (hasCraftingTable || craftingTableNearby) && hasWoodenPickaxe,
    evidence: {
      hasCraftingTable,
      craftingTableNearby,
      hasWoodenPickaxe,
      oakLogCount: helpers.count(bot, 'oak_log')
    }
  };
};
