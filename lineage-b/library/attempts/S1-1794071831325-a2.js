// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using available oak planks and logs
// postconditions: A crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the correct location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_planks', 4)) {
    throw new Error('Not enough oak planks to craft crafting table');
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if we successfully crafted a crafting table
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Now craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if we successfully crafted a wooden pickaxe
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Verify both items are in inventory
  if (!helpers.has(bot, 'crafting_table', 1) || !helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Crafting table or wooden pickaxe not found in inventory after crafting');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const woodenPickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  // Check if crafting table is placed within 20 blocks
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null;
  
  return {
    ok: (craftingTableInInventory || craftingTableNearby) && woodenPickaxeInInventory,
    evidence: {
      craftingTableInInventory,
      craftingTableNearby,
      woodenPickaxeInInventory
    }
  };
};