// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to oak trees and gather logs to craft tools
// postconditions: Crafting table carried or placed within 20 blocks AND wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Navigate to oak tree location (69,67,-80 relative to anchor)
  const targetX = ctx.anchor.x + 69;
  const targetY = ctx.anchor.y + 67;
  const targetZ = ctx.anchor.z + (-80);
  
  // Check if we're already at the target location
  const distanceToTarget = Math.sqrt(
    Math.pow(bot.entity.position.x - targetX, 2) +
    Math.pow(bot.entity.position.z - targetZ, 2)
  );
  
  if (distanceToTarget > 5) {
    await helpers.goto(bot, targetX, targetY, targetZ, 5);
  }
  
  // Collect oak logs - need at least 6 for crafting a wooden pickaxe
  const oakLogs = await helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLogs) {
    throw new Error('No oak logs found at target location');
  }
  
  // Collect 6 oak logs
  await helpers.collect(bot, 'oak_log', 6, { maxDistance: 30 });
  
  // Verify we have enough logs
  if (!helpers.has(bot, 'oak_log', 6)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      hasCraftingTable,
      hasWoodenPickaxe,
      inventory: helpers.inventoryList(bot)
    }
  };
};
