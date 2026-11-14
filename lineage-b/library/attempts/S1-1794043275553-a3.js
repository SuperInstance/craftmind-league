// skill: gatherWoodForTools
// stage: S1
// purpose: Collect at least 10 oak logs from the designated location at 69,67,-80 and craft tools
// postconditions: Inventory contains at least 10 oak logs, a wooden pickaxe, and a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 10)) {
    // If we have enough logs, proceed to craft tools
    await helpers.craft(bot, 'wooden_pickaxe', 1);
    await helpers.craft(bot, 'crafting_table', 1);
    return;
  }
  
  // Navigate to the oak log gathering location
  const targetX = 69;
  const targetZ = -80;
  const targetY = 67;
  
  // Check if we're already near the target
  const distanceToTarget = Math.sqrt(
    Math.pow(bot.entity.position.x - targetX, 2) +
    Math.pow(bot.entity.position.z - targetZ, 2)
  );
  
  if (distanceToTarget > 20) {
    // If we're far from target, go to a closer position first
    await helpers.goto(bot, targetX, targetY, targetZ, 10);
  }
  
  // Collect at least 10 oak logs
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  
  // Verify we have collected enough oak logs
  if (!helpers.has(bot, 'oak_log', 10)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Craft a crafting table first (this was the issue - need crafting table before pickaxe)
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify we have crafted a crafting table
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Now craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have crafted a wooden pickaxe
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasLogs = helpers.has(bot, 'oak_log', 10);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  
  return {
    ok: hasLogs && hasPickaxe && hasCraftingTable,
    evidence: {
      oak_logs: helpers.count(bot, 'oak_log'),
      wooden_pickaxe: helpers.count(bot, 'wooden_pickaxe'),
      crafting_table: helpers.count(bot, 'crafting_table')
    }
  };
};