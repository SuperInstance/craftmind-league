// skill: buildCraftingTable
// stage: S1
// purpose: Craft a crafting table using oak planks from inventory
// postconditions: Crafting table is in inventory or placed within 20 blocks, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in a known location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak planks (4 planks needed for crafting table)
  const planksCount = helpers.count(bot, 'oak_planks');
  if (planksCount < 4) {
    throw new Error(`Not enough oak planks: have ${planksCount}, need 4`);
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Now craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxeCount < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Check if crafting table is in inventory or nearby
  const tableInInventory = helpers.count(bot, 'crafting_table') > 0;
  const tableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  
  if (!tableInInventory && !tableNearby) {
    throw new Error('Crafting table not found in inventory or within 20 blocks');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.count(bot, 'crafting_table') > 0;
  const woodenPickaxeInInventory = helpers.count(bot, 'wooden_pickaxe') > 0;
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  
  return {
    ok: craftingTableInInventory || craftingTableNearby,
    evidence: {
      craftingTableInInventory,
      woodenPickaxeInInventory,
      craftingTableNearby: !!craftingTableNearby
    }
  };
};
