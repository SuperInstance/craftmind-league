// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough materials for crafting a crafting table
// postconditions: Have at least 4 oak logs in inventory for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 4)) {
    return;
  }
  
  // Find more oak logs nearby
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  
  if (oakLogs.length === 0) {
    // If no oak logs found nearby, try to find them in a broader area
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 50, 10);
    if (oakLogsNearby.length === 0) {
      throw new Error('No oak logs found within 50 blocks');
    }
    
    // Collect oak logs from the broader area
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 50 });
  } else {
    // Collect oak logs from the nearby area
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
  }
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Failed to collect enough oak logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTables = helpers.count(bot, 'crafting_table');
  
  return {
    ok: oakLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      crafting_tables: craftingTables
    }
  };
};