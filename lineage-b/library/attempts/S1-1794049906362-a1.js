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
  
  // Find nearby oak trees
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, 5);
  if (oakLogsNearby.length > 0) {
    // Collect oak logs from nearby locations
    await helpers.collect(bot, 'oak_log', 10 - oakLogs, { maxDistance: 20 });
  } else {
    // If no logs found nearby, search for oak trees and collect from them
    const oakTreeBlocks = helpers.findBlocks(bot, 'oak_log', 30, 5);
    if (oakTreeBlocks.length > 0) {
      // Collect from oak tree locations
      await helpers.collect(bot, 'oak_log', 10 - oakLogs, { maxDistance: 30 });
    } else {
      // If no oak logs found in range, we need to find a tree
      const oakTree = helpers.findBlock(bot, 'oak_log', 50);
      if (oakTree) {
        await helpers.goto(bot, oakTree.position.x, oakTree.position.y, oakTree.position.z, 3);
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
