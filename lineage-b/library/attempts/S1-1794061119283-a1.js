// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak planks and oak logs to progress with tool crafting
// postconditions: A crafting table is placed within 20 blocks or carried, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_planks', 4)) {
    throw new Error('Not enough oak planks to build crafting table');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Place the crafting table near the anchor
  const tableX = ctx.anchor.x;
  const tableY = ctx.anchor.y;
  const tableZ = ctx.anchor.z;
  
  await helpers.placeAt(bot, 'crafting_table', tableX, tableY, tableZ);
  
  // Check if crafting table is placed
  const tableBlock = bot.blockAt(v3(tableX, tableY, tableZ));
  if (tableBlock.name !== 'crafting_table') {
    throw new Error('Failed to place crafting table');
  }
  
  // Craft a wooden pickaxe
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
