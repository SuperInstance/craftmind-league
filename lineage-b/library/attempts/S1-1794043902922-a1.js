// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak logs and sticks in inventory
// postconditions: Crafting table is placed within 20 blocks and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
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
  
  // Place the crafting table near the anchor
  const tablePosition = ctx.anchor;
  await helpers.placeAt(bot, 'crafting_table', tablePosition.x, tablePosition.y, tablePosition.z);
  
  // Verify crafting table is placed
  const craftingTableBlock = bot.blockAt(v3(tablePosition.x, tablePosition.y, tablePosition.z));
  if (!craftingTableBlock || craftingTableBlock.name !== 'crafting_table') {
    throw new Error('Failed to place crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe is in inventory
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Report progress
  bot.chat('Crafting table built and wooden pickaxe crafted');
};

module.exports.post = async (bot, helpers, ctx) => {
  // Check if crafting table is carried or placed within 20 blocks
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = craftingTableNearby !== null || helpers.has(bot, 'crafting_table', 1);
  
  // Check if wooden pickaxe is in inventory
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
