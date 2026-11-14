// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to the nearest oak tree and chop down a log to gather wood for crafting tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Find the nearest oak log
  const oakLog = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLog) {
    throw new Error('No oak log found within 30 blocks');
  }
  
  // Dig the oak log to collect wood
  await bot.dig(oakLog);
  
  // Check if we have enough wood (at least 1 oak_log)
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
      inventory: helpers.inventoryList(bot)
    }
  };
};
