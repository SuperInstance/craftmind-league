// skill: buildCraftingTable
// stage: S1
// purpose: Construct a crafting table using 4 oak logs and 2 sticks, then craft a wooden pickaxe
// postconditions: A crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Not enough oak logs: need 4, have ' + helpers.count(bot, 'oak_log'));
  }
  if (!helpers.has(bot, 'stick', 2)) {
    throw new Error('Not enough sticks: need 2, have ' + helpers.count(bot, 'stick'));
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table')) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe')) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || craftingTableNearby !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTableInInventory: helpers.has(bot, 'crafting_table'),
      craftingTableNearby: craftingTableNearby !== null,
      woodenPickaxeInInventory: helpers.has(bot, 'wooden_pickaxe')
    }
  };
};
