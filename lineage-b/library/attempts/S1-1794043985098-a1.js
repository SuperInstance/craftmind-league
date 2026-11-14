// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak logs and sticks in inventory
// postconditions: Crafting table is placed within 20 blocks and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Not enough oak logs to build crafting table');
  }
  
  if (!helpers.has(bot, 'stick', 2)) {
    throw new Error('Not enough sticks to build crafting table');
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
  
  // Find a suitable position to place the table (on ground)
  let placeY = tableY;
  let blockBelow = bot.blockAt(v3(tableX, placeY - 1, tableZ));
  
  // Keep looking down until we find solid ground
  while (blockBelow && !blockBelow.boundingBox) {
    placeY--;
    blockBelow = bot.blockAt(v3(tableX, placeY - 1, tableZ));
  }
  
  // Place the crafting table
  await helpers.placeAt(bot, 'crafting_table', tableX, placeY, tableZ);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if wooden pickaxe was successful
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTableNearby !== null && hasPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasPickaxe: hasPickaxe,
      craftingTablePosition: craftingTableNearby ? craftingTableNearby.position : null
    }
  };
};
