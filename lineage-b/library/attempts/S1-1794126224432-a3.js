// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak logs to build a crafting table and make a wooden pickaxe
// postconditions: Have enough oak logs to build a crafting table and a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs to build a crafting table (4 logs)
  if (helpers.has(bot, 'oak_log', 4)) {
    return;
  }
  
  // Find nearby oak trees to collect more logs
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 5);
  
  if (oakLogs.length === 0) {
    // If no logs on ground, try to find trees and chop them down
    const trees = helpers.findBlocks(bot, 'oak_log', 30, 10);
    if (trees.length === 0) {
      throw new Error('No oak trees found nearby to chop down');
    }
    
    // Chop down the first tree we find
    const tree = trees[0];
    await helpers.goto(bot, tree.x, tree.y, tree.z, 3);
    
    // Get the block above the tree to ensure we're not in the tree
    const blockAbove = bot.blockAt(v3(tree.x, tree.y + 1, tree.z));
    if (blockAbove && blockAbove.name !== 'air') {
      // Dig the block beneath us to get down
      const blockBeneath = bot.blockAt(v3(tree.x, tree.y - 1, tree.z));
      if (blockBeneath && blockBeneath.name !== 'air') {
        await bot.dig(blockBeneath);
      }
    }
    
    // Chop the tree down
    await bot.dig(tree);
    
    // Wait a bit for the log to drop
    await helpers.sleep(1000);
    
    // Now collect the dropped logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  } else {
    // Collect oak logs from the ground
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  }
  
  // Verify we have enough logs now
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Failed to collect enough oak logs for crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.count(bot, 'crafting_table') > 0;
  
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      hasCraftingTable,
      hasWoodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log')
    }
  };
};