// skill: gatherWoodForTools
// stage: S1
// purpose: Collect at least 5 oak logs from the nearest oak tree cluster
// postconditions: Inventory contains at least 5 oak logs
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 5)) {
    return;
  }
  
  // Find the nearest oak tree cluster by looking for oak logs nearby
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 5);
  if (oakLogs.length === 0) {
    // If no oak logs found nearby, try to find a tree block to chop
    const oakTree = helpers.findBlock(bot, 'oak_log', 30);
    if (!oakTree) {
      throw new Error('No oak trees found within 30 blocks');
    }
    
    // Dig the oak log block to get logs
    await bot.dig(oakTree);
    
    // Wait a bit for the block to drop
    await helpers.sleep(1000);
    
    // Collect the dropped logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  } else {
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  }
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 5)) {
    throw new Error('Failed to collect enough oak logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  return {
    ok: oakLogs >= 5,
    evidence: {
      oak_logs_collected: oakLogs
    }
  };
};