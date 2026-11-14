// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak logs and dirt, then craft a wooden pickaxe
// postconditions: Crafting table is placed within 20 blocks or carried, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs and dirt
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Not enough oak logs to build crafting table');
  }
  
  if (!helpers.has(bot, 'dirt', 1)) {
    throw new Error('Not enough dirt to build crafting table');
  }
  
  // Place the crafting table first (this should work since we're placing it, not crafting it)
  const tablePosition = bot.entity.position.offset(2, 0, 0);
  await helpers.placeAt(bot, 'crafting_table', tablePosition.x, tablePosition.y, tablePosition.z);
  
  // Verify crafting table was placed
  const placedTable = helpers.findBlock(bot, 'crafting_table', 2);
  if (!placedTable) {
    throw new Error('Failed to place crafting table');
  }
  
  // Craft a wooden pickaxe using the placed crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = craftingTableNearby !== null || helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasCraftingTable: hasCraftingTable,
      hasWoodenPickaxe: hasWoodenPickaxe
    }
  };
};