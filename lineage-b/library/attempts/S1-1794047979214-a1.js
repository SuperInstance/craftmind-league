// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak logs and dirt to enable tool crafting
// postconditions: A crafting table is placed within 20 blocks or carried, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Not enough oak logs to build crafting table');
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if crafting table was successful
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Place the crafting table near the anchor
  const tableX = ctx.anchor.x;
  const tableZ = ctx.anchor.z;
  const tableY = ctx.anchor.y;
  
  // Find a suitable position to place the crafting table
  const groundY = helpers.groundHeight(bot, tableX, tableZ, tableY);
  if (groundY === null) {
    throw new Error('Could not determine ground height for crafting table placement');
  }
  
  // Place the crafting table at the ground level
  await helpers.placeAt(bot, 'crafting_table', tableX, groundY, tableZ);
  
  // Verify the crafting table was placed
  const craftingTableBlock = bot.blockAt(v3(tableX, groundY, tableZ));
  if (!craftingTableBlock || craftingTableBlock.name !== 'crafting_table') {
    throw new Error('Failed to place crafting table');
  }
  
  // Craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify the wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  // Check if crafting table is either carried or placed within 20 blocks
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1) || craftingTableNearby !== null;
  
  // Check if wooden pickaxe is in inventory
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasCraftingTable: helpers.has(bot, 'crafting_table', 1),
      hasWoodenPickaxe: hasWoodenPickaxe
    }
  };
};
