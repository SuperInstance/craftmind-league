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
  
  // Find a safe position to place the crafting table (clear of blocks)
  const safePosition = bot.entity.position.offset(2, 0, 0);
  const safeBlock = bot.blockAt(safePosition);
  
  // If the position is occupied, try a different position
  if (safeBlock.name !== 'air') {
    // Try a position that's 1 block higher to avoid ground issues
    const higherPosition = safePosition.offset(0, 1, 0);
    const higherBlock = bot.blockAt(higherPosition);
    if (higherBlock.name !== 'air') {
      // If that's also occupied, try a position directly in front
      const frontPosition = bot.entity.position.offset(0, 0, 2);
      const frontBlock = bot.blockAt(frontPosition);
      if (frontBlock.name !== 'air') {
        throw new Error('No suitable position found to place crafting table');
      }
      await helpers.placeAt(bot, 'crafting_table', frontPosition.x, frontPosition.y, frontPosition.z);
    } else {
      await helpers.placeAt(bot, 'crafting_table', higherPosition.x, higherPosition.y, higherPosition.z);
    }
  } else {
    // Position is clear, proceed with placing
    await helpers.placeAt(bot, 'crafting_table', safePosition.x, safePosition.y, safePosition.z);
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify the crafting table was placed
  const craftingTableBlock = bot.blockAt(safePosition);
  if (craftingTableBlock.name !== 'crafting_table') {
    // If the first position didn't work, check the alternative positions
    const frontBlock = bot.blockAt(bot.entity.position.offset(0, 0, 2));
    if (frontBlock.name !== 'crafting_table') {
      const higherBlock = bot.blockAt(bot.entity.position.offset(2, 1, 0));
      if (higherBlock.name !== 'crafting_table') {
        throw new Error('Failed to place crafting table in any attempted position');
      }
    }
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