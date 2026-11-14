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
  
  // Find a clear position to place the crafting table
  // Try multiple positions in a systematic way
  const positionsToTry = [
    bot.entity.position.offset(2, 0, 0),
    bot.entity.position.offset(-2, 0, 0),
    bot.entity.position.offset(0, 0, 2),
    bot.entity.position.offset(0, 0, -2),
    bot.entity.position.offset(1, 1, 1),
    bot.entity.position.offset(-1, 1, -1)
  ];
  
  let placedCraftingTable = false;
  let placementPosition = null;
  
  for (const pos of positionsToTry) {
    const block = bot.blockAt(pos);
    // Check if position is air and not too high or low
    if (block.name === 'air' && pos.y >= ctx.anchor.y - 2 && pos.y <= ctx.anchor.y + 2) {
      try {
        await helpers.placeAt(bot, 'crafting_table', pos.x, pos.y, pos.z);
        placedCraftingTable = true;
        placementPosition = pos;
        break;
      } catch (err) {
        // Try next position
        continue;
      }
    }
  }
  
  if (!placedCraftingTable) {
    // If we couldn't place it, try to carry it instead
    await helpers.craft(bot, 'crafting_table', 1);
    // Verify crafting table was crafted
    if (!helpers.has(bot, 'crafting_table', 1)) {
      throw new Error('Failed to craft or place crafting table');
    }
  } else {
    // Verify the crafting table was placed
    const craftingTableBlock = bot.blockAt(placementPosition);
    if (craftingTableBlock.name !== 'crafting_table') {
      throw new Error('Failed to place crafting table at attempted position');
    }
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have the wooden pickaxe
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  // Check if crafting table is nearby (within 20 blocks) or carried
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  const hasCraftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  
  // Return true if either condition is met
  const ok = (craftingTableNearby !== null || hasCraftingTableInInventory) && hasWoodenPickaxe;
  
  return {
    ok: ok,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasWoodenPickaxe: hasWoodenPickaxe,
      hasCraftingTableInInventory: hasCraftingTableInInventory,
      craftingTablePosition: craftingTableNearby ? craftingTableNearby.position : null
    }
  };
};