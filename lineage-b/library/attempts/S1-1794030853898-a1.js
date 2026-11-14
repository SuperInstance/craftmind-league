// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to the nearest oak tree and mine oak logs to craft a wooden pickaxe
// postconditions: Inventory contains a wooden pickaxe and a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have a crafting table
  if (helpers.has(bot, 'crafting_table')) {
    // If we have a crafting table, proceed to craft wooden pickaxe
    await helpers.craft(bot, 'wooden_pickaxe', 1);
    return;
  }
  
  // Find the nearest oak log
  const oakLog = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLog) {
    throw new Error('No oak log found within 30 blocks');
  }
  
  // Mine the oak log
  await bot.digBlock(oakLog);
  
  // Collect the oak logs (assuming they drop as items)
  await helpers.collect(bot, 'oak_log', 1);
  
  // Check if we have enough oak logs to craft a wooden pickaxe (3 logs)
  if (helpers.count(bot, 'oak_log') < 3) {
    throw new Error('Not enough oak logs to craft wooden pickaxe');
  }
  
  // Place a crafting table
  await helpers.placeAt(bot, 'crafting_table', oakLog.position.x, oakLog.position.y + 1, oakLog.position.z);
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe');
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  
  return {
    ok: hasPickaxe && hasCraftingTable,
    evidence: {
      hasPickaxe,
      hasCraftingTable,
      pickaxeCount: helpers.count(bot, 'wooden_pickaxe'),
      craftingTableCount: helpers.count(bot, 'crafting_table')
    }
  };
};