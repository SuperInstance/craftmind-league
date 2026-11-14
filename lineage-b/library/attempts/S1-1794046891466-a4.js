// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs from nearby trees to begin crafting wooden tools
// postconditions: Inventory contains oak logs and crafting table is placed or carried
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 5)) {
    // We have enough logs, proceed to craft crafting table
    await helpers.craft(bot, 'crafting_table', 1);
    return;
  }
  
  // Find nearby oak logs
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 20, 5);
  
  if (oakLogs.length === 0) {
    // No oak logs found nearby, search more broadly
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 50, 5);
    if (oakLogsNearby.length === 0) {
      throw new Error('No oak logs found within 50 blocks');
    }
    
    // Go to the nearest oak log
    const nearestLog = oakLogsNearby[0];
    await helpers.goto(bot, nearestLog.x, nearestLog.y, nearestLog.z, 2);
    
    // Collect the oak logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  } else {
    // Go to the nearest oak log
    const nearestLog = oakLogs[0];
    await helpers.goto(bot, nearestLog.x, nearestLog.y, nearestLog.z, 2);
    
    // Collect the oak logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  }
  
  // Verify we have the required logs
  if (!helpers.has(bot, 'oak_log', 5)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Now craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table')) {
    throw new Error('Failed to craft crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasLogs = helpers.has(bot, 'oak_log', 5);
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.findBlock(bot, 'crafting_table', 20);
  
  return {
    ok: hasLogs && hasCraftingTable,
    evidence: {
      oak_logs: helpers.count(bot, 'oak_log'),
      crafting_table_nearby: helpers.findBlock(bot, 'crafting_table', 20) !== null,
      crafting_table_carried: helpers.has(bot, 'crafting_table')
    }
  };
};