// skill: buildCraftingTable
// stage: S1
// purpose: Craft a crafting table using 2 oak planks and 4 birch logs
// postconditions: A crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we have the required materials
  if (!helpers.has(bot, 'oak_planks', 2)) {
    throw new Error(`Not enough oak planks: have ${helpers.count(bot, 'oak_planks')}, need 2`);
  }
  
  if (!helpers.has(bot, 'birch_log', 4)) {
    throw new Error(`Not enough birch logs: have ${helpers.count(bot, 'birch_log')}, need 4`);
  }
  
  // First, we need to make sure we have a crafting table to craft with
  // Since we have oak planks, we can make a crafting table from those
  // But the recipe is 4 planks in a 2x2 grid, not 2 planks and 4 logs
  // Let's check if we have a crafting table in inventory or nearby
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  
  // If we don't have a crafting table, we need to make one
  if (!craftingTableInInventory && !craftingTableNearby) {
    // Craft a crafting table from 4 oak planks (2x2 grid)
    await helpers.craft(bot, 'crafting_table', 1);
    
    // Verify crafting table was created
    if (!helpers.has(bot, 'crafting_table', 1)) {
      throw new Error('Failed to craft crafting table');
    }
  }
  
  // Now craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was created
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
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
      woodenPickaxeInInventory: hasWoodenPickaxe
    }
  };
};