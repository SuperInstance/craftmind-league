// skill: buildCraftingTable
// stage: S1
// purpose: Craft a crafting table using available oak planks and logs, then craft a wooden pickaxe
// postconditions: A crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in a known location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_planks', 4)) {
    // We need to convert logs to planks first
    const logCount = helpers.count(bot, 'oak_log');
    if (logCount < 4) {
      throw new Error('Not enough oak logs to craft planks for crafting table');
    }
    
    // Convert logs to planks (4 logs = 4 planks)
    await helpers.craft(bot, 'oak_planks', 1);
    
    // Verify we have the planks now
    if (!helpers.has(bot, 'oak_planks', 4)) {
      throw new Error('Failed to craft enough oak planks for crafting table');
    }
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Now craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Check that we have both items in inventory
  if (!helpers.has(bot, 'crafting_table', 1) || !helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Missing required items after crafting');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (hasCraftingTable || craftingTableNearby !== null) && hasWoodenPickaxe,
    evidence: {
      craftingTableInInventory: hasCraftingTable,
      craftingTableNearby: craftingTableNearby !== null,
      woodenPickaxeInInventory: hasWoodenPickaxe,
      inventory: helpers.inventoryList(bot)
    }
  };
};