// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to the nearest oak tree and chop down a log to gather wood for crafting tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Find the nearest oak tree (not just oak_log which might be on the ground)
  const oakTree = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakTree) {
    throw new Error('No oak tree found within 30 blocks');
  }
  
  // Move to the oak tree location
  await helpers.goto(bot, oakTree.position.x, oakTree.position.y, oakTree.position.z, 3);
  
  // Check if we're on the ground level of the tree
  const groundLevel = helpers.groundHeight(bot, oakTree.position.x, oakTree.position.z, oakTree.position.y);
  if (Math.abs(bot.entity.position.y - groundLevel) > 2) {
    // If we're not at ground level, dig the block beneath us to descend
    const blockBelow = bot.blockAt(bot.entity.position.offset(0, -1, 0));
    if (blockBelow && blockBelow.type !== 0) {
      await bot.dig(blockBelow);
    }
  }
  
  // Now we should be able to chop down the tree
  // First, find the top of the oak tree (the highest oak_log block)
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (!oakLogs || oakLogs.length === 0) {
    throw new Error('No oak logs found around the tree');
  }
  
  // Sort by y position to get the highest log
  oakLogs.sort((a, b) => b.position.y - a.position.y);
  const highestLog = oakLogs[0];
  
  // Dig the highest log to start chopping the tree
  await bot.dig(highestLog);
  
  // Wait a bit for the block to be broken
  await helpers.sleep(1000);
  
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