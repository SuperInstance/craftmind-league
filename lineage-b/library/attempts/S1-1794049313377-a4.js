// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak logs and dirt, then craft a wooden pickaxe
// postconditions: Crafting table is placed within 20 blocks or carried, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs and dirt
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Not enough oak logs to build crafting table');
  }
  
  if (!helpers.has(bot, 'dirt', 1)) {
    throw new Error('Not enough dirt to build crafting table');
  }
  
  // Find a safe position to place the crafting table
  const safePosition = bot.entity.position.offset(2, 0, 0);
  
  // Ensure the block below is solid before placing
  const blockBelow = bot.blockAt(safePosition.offset(0, -1, 0));
  if (!blockBelow || !blockBelow.boundingBox.includes('block')) {
    // Find a solid block nearby to place on
    const solidBlocks = helpers.findBlocks(bot, ['dirt', 'grass_block', 'stone', 'cobblestone'], 3, 1);
    if (solidBlocks.length === 0) {
      // If no solid block found, dig down to create a solid base
      const groundPos = bot.entity.position.offset(0, -1, 0);
      const groundBlock = bot.blockAt(groundPos);
      if (groundBlock && groundBlock.boundingBox.includes('block')) {
        // Already solid, just need to place on it
      } else {
        // Dig down to find solid ground
        const groundHeight = helpers.groundHeight(bot, safePosition.x, safePosition.z, safePosition.y);
        const targetY = Math.floor(groundHeight) - 1;
        const targetPos = safePosition.offset(0, targetY - safePosition.y, 0);
        const targetBlock = bot.blockAt(targetPos);
        if (targetBlock && targetBlock.boundingBox.includes('block')) {
          // We can place on this block
          safePosition.y = targetY;
        } else {
          // If no solid block found, try to find a good spot to dig
          const nearbySolid = helpers.findBlock(bot, ['dirt', 'grass_block', 'stone', 'cobblestone'], 5);
          if (nearbySolid) {
            safePosition.x = nearbySolid.position.x;
            safePosition.z = nearbySolid.position.z;
            safePosition.y = nearbySolid.position.y;
          } else {
            // Fall back to a simple approach - dig down to find solid ground
            const targetY = Math.floor(bot.entity.position.y) - 1;
            const targetPos = bot.entity.position.offset(0, targetY - bot.entity.position.y, 0);
            const targetBlock = bot.blockAt(targetPos);
            if (targetBlock && targetBlock.boundingBox.includes('block')) {
              safePosition.y = targetY;
            } else {
              // If still no solid block, just try to place it anyway
            }
          }
        }
      }
    }
  }
  
  // Place the crafting table
  await helpers.placeAt(bot, 'crafting_table', safePosition.x, safePosition.y, safePosition.z);
  
  // Verify crafting table was placed
  const placedTable = helpers.findBlock(bot, 'crafting_table', 2);
  if (!placedTable) {
    throw new Error('Failed to place crafting table');
  }
  
  // Craft a wooden pickaxe using the placed crafting table
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