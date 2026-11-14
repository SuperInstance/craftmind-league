// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak logs and dirt to enable tool crafting
// postconditions: A crafting table is placed within 20 blocks or carried, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Not enough oak logs to build crafting table');
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Place the crafting table nearby
  const tablePos = bot.entity.position.offset(2, 0, 0);
  await helpers.placeAt(bot, 'crafting_table', tablePos.x, tablePos.y, tablePos.z);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
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
