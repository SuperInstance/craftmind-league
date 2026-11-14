// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak logs to build a crafting table and make a wooden pickaxe
// postconditions: Have enough oak logs to build crafting table and have wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs to build a crafting table (4 logs)
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    // Need to collect more oak logs
    const logsToCollect = 4 - oakLogs;
    
    // Find nearby oak trees
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
    
    if (oakLogsNearby.length === 0) {
      // If no oak logs found nearby, search for oak trees
      const oakTrees = helpers.findBlocks(bot, 'oak_log', 50, 5);
      
      if (oakTrees.length === 0) {
        throw new Error('No oak trees found within 50 blocks');
      }
      
      // Go to the nearest oak tree
      const nearestOakTree = oakTrees[0];
      await helpers.goto(bot, nearestOakTree.x, nearestOakTree.y, nearestOakTree.z, 3);
      
      // Collect logs from the tree
      await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 10 });
    } else {
      // Collect logs from nearby locations
      await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 10 });
    }
  }
  
  // Verify we have enough logs
  const finalLogs = helpers.count(bot, 'oak_log');
  if (finalLogs < 4) {
    throw new Error(`Only collected ${finalLogs} oak logs, need at least 4`);
  }
  
  // Now craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  const oakLogs = helpers.count(bot, 'oak_log');
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe && oakLogs >= 4,
    evidence: {
      hasCraftingTable,
      hasWoodenPickaxe,
      oakLogs
    }
  };
};
