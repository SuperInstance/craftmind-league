// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak, birch, and acacia logs to craft wooden tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Go back to anchor first
  await helpers.gotoAnchor(bot, anchor);
  
  // Collect logs - we need at least 1 of each type
  await helpers.collect(bot, 'oak_log', 1);
  await helpers.collect(bot, 'birch_log', 1);
  await helpers.collect(bot, 'acacia_log', 1);
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error("Failed to craft crafting table");
  }
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error("Failed to craft wooden pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (craftingTableNearby || hasCraftingTable) && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby,
      hasCraftingTable,
      hasWoodenPickaxe,
      inventory: helpers.inventoryList(bot)
    }
  };
};