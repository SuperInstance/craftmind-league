// skill: gatherWoodForTools
// stage: S1
// purpose: Collect oak logs from nearby trees to begin crafting wooden tools
// postconditions: Inventory contains at least 5 oak logs and a crafting table is placed or carried
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs
  if (helpers.has(bot, 'oak_log', 5)) {
    return;
  }
  
  // Find nearby oak logs
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 20, 5);
  if (oakLogs.length === 0) {
    // Try to find oak trees and walk to them
    const oakTree = helpers.findBlock(bot, 'oak_log', 30);
    if (!oakTree) {
      throw new Error('No oak logs or trees found within 30 blocks');
    }
    
    // Move to the tree location
    await helpers.goto(bot, oakTree.position.x, oakTree.position.y, oakTree.position.z, 3);
    
    // Collect logs from the tree
    const logs = helpers.findBlocks(bot, 'oak_log', 5, 5);
    if (logs.length === 0) {
      throw new Error('No oak logs found near the tree');
    }
    
    // Collect the logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 5 });
  } else {
    // Collect oak logs directly
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 20 });
  }
  
  // Verify we have the logs
  if (!helpers.has(bot, 'oak_log', 5)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Now try to craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (err) {
    // If crafting fails, try placing a crafting table from inventory
    if (helpers.has(bot, 'crafting_table', 1)) {
      // Already have one, good
      return;
    }
    throw new Error('Failed to craft or place crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasLogs = helpers.has(bot, 'oak_log', 5);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  
  return {
    ok: hasLogs && hasCraftingTable,
    evidence: {
      oak_logs: helpers.count(bot, 'oak_log'),
      crafting_table: helpers.count(bot, 'crafting_table')
    }
  };
};