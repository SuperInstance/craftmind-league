// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to the nearest oak tree and chop down a log to gather wood for tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Find the nearest oak log
  const oakLog = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLog) {
    throw new Error('No oak log found within 30 blocks');
  }
  
  // Go to the oak log
  await helpers.goto(bot, oakLog.position.x, oakLog.position.y, oakLog.position.z, 1);
  
  // Dig the oak log
  await bot.dig(oakLog);
  
  // Check if we have oak logs now
  if (!helpers.has(bot, 'oak_log', 1)) {
    throw new Error('Failed to collect oak log');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if we have a crafting table
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if we have a wooden pickaxe
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
      craftingTableCount: helpers.count(bot, 'crafting_table'),
      woodenPickaxeCount: helpers.count(bot, 'wooden_pickaxe')
    }
  };
};
