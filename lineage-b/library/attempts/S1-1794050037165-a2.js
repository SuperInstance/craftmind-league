// skill: gatherWoodForTools
// stage: S1
// purpose: Collect enough oak logs to build a crafting table
// postconditions: Have enough oak logs in inventory to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory for oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 10) {
    // We already have enough logs
    return;
  }
  
  // Since previous attempt failed due to goto timeout, let's try a different approach
  // Look for oak logs in a more systematic way using the survey data
  const survey = ctx.state.survey;
  
  // Try to find oak logs in the immediate area first
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 15, 5);
  if (oakLogsNearby.length > 0) {
    // Collect oak logs from nearby locations
    await helpers.collect(bot, 'oak_log', 10 - oakLogs, { maxDistance: 15 });
  } else {
    // If no logs found nearby, try to find a tree and go to it
    // Use the survey data to find a good location for oak trees
    const oakTree = helpers.findBlock(bot, 'oak_log', 30);
    if (oakTree) {
      // Try to go to the oak tree location
      try {
        await helpers.goto(bot, oakTree.position.x, oakTree.position.y, oakTree.position.z, 3);
        await helpers.collect(bot, 'oak_log', 10 - oakLogs, { maxDistance: 30 });
      } catch (error) {
        // If goto fails, try to find a tree by scanning the area
        const trees = helpers.findBlocks(bot, 'oak_log', 50, 10);
        if (trees.length > 0) {
          // Go to the first tree found
          await helpers.goto(bot, trees[0].position.x, trees[0].position.y, trees[0].position.z, 3);
          await helpers.collect(bot, 'oak_log', 10 - oakLogs, { maxDistance: 50 });
        } else {
          throw new Error("No oak logs found within 50 blocks");
        }
      }
    } else {
      // If no tree found, try to find a tree by scanning the area
      const trees = helpers.findBlocks(bot, 'oak_log', 50, 10);
      if (trees.length > 0) {
        // Go to the first tree found
        await helpers.goto(bot, trees[0].position.x, trees[0].position.y, trees[0].position.z, 3);
        await helpers.collect(bot, 'oak_log', 10 - oakLogs, { maxDistance: 50 });
      } else {
        throw new Error("No oak logs found within 50 blocks");
      }
    }
  }
  
  // Verify we have enough logs
  const finalCount = helpers.count(bot, 'oak_log');
  if (finalCount < 10) {
    throw new Error(`Only collected ${finalCount} oak logs, need at least 10`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    (helpers.findBlock(bot, 'crafting_table', 20) !== null);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 10 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};