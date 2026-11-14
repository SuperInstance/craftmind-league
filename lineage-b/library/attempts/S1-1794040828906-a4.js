// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to oak tree location and gather oak logs for tool-making
// postconditions: Inventory contains crafting table and wooden pickaxe made from oak logs
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we're already at the target location
  const targetX = 69;
  const targetY = 67;
  const targetZ = -80;
  const distanceToTarget = Math.sqrt(
    Math.pow(bot.entity.position.x - targetX, 2) +
    Math.pow(bot.entity.position.y - targetY, 2) +
    Math.pow(bot.entity.position.z - targetZ, 2)
  );
  
  // If we're not close enough to the target, navigate there
  if (distanceToTarget > 10) {
    await helpers.goto(bot, targetX, targetY, targetZ, 5);
  }
  
  // Find oak logs near the target area
  const oakLogs = await helpers.findBlocks(bot, 'oak_log', 20, 10);
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found within 20 blocks of target location');
  }
  
  // Collect oak logs - we need at least 6 for crafting a pickaxe
  await helpers.collect(bot, 'oak_log', 6, { maxDistance: 20 });
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 6)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  bot.chat("Gathered wood and crafted tools successfully!");
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      hasCraftingTable,
      hasWoodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      craftingTable: helpers.count(bot, 'crafting_table'),
      woodenPickaxe: helpers.count(bot, 'wooden_pickaxe')
    }
  };
};