// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough materials for crafting a crafting table
// postconditions: Have at least 4 oak logs in inventory for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 4) {
    throw new Error('Already have enough oak logs for crafting table');
  }
  
  // Since we don't have enough oak logs, we need to gather more
  // Find oak logs nearby
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLogBlock) {
    // If no oak logs found nearby, search further
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 100, 10);
    if (oakLogsNearby.length === 0) {
      throw new Error('No oak logs found within 100 blocks');
    }
    
    // Go to the nearest oak log
    const nearestOakLog = oakLogsNearby[0];
    await helpers.goto(bot, nearestOakLog.position.x, nearestOakLog.position.y, nearestOakLog.position.z, 3);
  } else {
    // Go to the oak log we found
    await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 3);
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 4 - oakLogs, { maxDistance: 30 });
  
  // Verify we have enough oak logs now
  const finalOakLogs = helpers.count(bot, 'oak_log');
  if (finalOakLogs < 4) {
    throw new Error(`Only collected ${finalOakLogs} oak logs, need 4`);
  }
  
  // Report progress
  bot.chat('Collected enough oak logs for crafting table');
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      crafting_tables: craftingTable,
      wooden_pickaxes: woodenPickaxe
    }
  };
};