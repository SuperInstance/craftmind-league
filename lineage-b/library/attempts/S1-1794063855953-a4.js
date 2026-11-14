// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak planks and logs in inventory, then craft a wooden pickaxe
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, ensure we're at the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_planks', 4)) {
    throw new Error('Not enough oak planks to build crafting table');
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify we now have a crafting table
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Now craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we now have a wooden pickaxe
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Check that we have at least one crafting table (either carried or placed within 20 blocks)
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    // Try to place the crafting table we just crafted
    const pos = bot.entity.position;
    await helpers.placeAt(bot, 'crafting_table', pos.x, pos.y, pos.z);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  const woodenPickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  
  // Check if we have at least one crafting table (either carried or placed within 20 blocks)
  const craftingTableNearby = helpers.findBlocks(bot, 'crafting_table', 20, 1).length > 0;
  const hasCraftingTable = craftingTableCount > 0 || craftingTableNearby;
  
  return {
    ok: hasCraftingTable && woodenPickaxeCount > 0,
    evidence: {
      craftingTables: craftingTableCount,
      woodenPickaxe: woodenPickaxeCount > 0,
      craftingTableNearby: craftingTableNearby
    }
  };
};