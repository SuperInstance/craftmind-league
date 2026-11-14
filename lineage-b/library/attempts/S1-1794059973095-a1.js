// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak planks and oak logs to progress with tool crafting
// postconditions: A crafting table is placed or carried within 20 blocks and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_planks', 4)) {
    throw new Error('Not enough oak planks to build crafting table');
  }
  
  // Place the crafting table
  const craftingTablePosition = bot.entity.position.offset(2, 0, 0);
  await helpers.placeAt(bot, 'crafting_table', craftingTablePosition.x, craftingTablePosition.y, craftingTablePosition.z);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify the crafting table was placed
  const craftingTableBlock = bot.blockAt(craftingTablePosition);
  if (craftingTableBlock.name !== 'crafting_table') {
    throw new Error('Failed to place crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTableNearby !== null && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasWoodenPickaxe: hasWoodenPickaxe,
      craftingTablePosition: craftingTableNearby ? craftingTableNearby.position : null
    }
  };
};