// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to build a crafting table
// postconditions: Have enough wood logs to craft a crafting table and a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor position first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 4 && birchLogs >= 4) {
    // We already have enough logs
    return;
  }
  
  // Collect more logs - look for oak logs first
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  if (oakLogBlock) {
    await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 2);
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
  }
  
  // Collect birch logs
  const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
  if (birchLogBlock) {
    await helpers.goto(bot, birchLogBlock.position.x, birchLogBlock.position.y, birchLogBlock.position.z, 2);
    await helpers.collect(bot, 'birch_log', 4, { maxDistance: 30 });
  }
  
  // If we still don't have enough, try collecting from nearby areas
  if (helpers.count(bot, 'oak_log') < 4 || helpers.count(bot, 'birch_log') < 4) {
    // Look for logs in a wider area around current position
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 50, 10);
    const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 50, 10);
    
    // Collect oak logs
    for (const log of oakLogsNearby) {
      if (helpers.count(bot, 'oak_log') >= 4) break;
      await helpers.goto(bot, log.position.x, log.position.y, log.position.z, 2);
      await helpers.collect(bot, 'oak_log', 1, { maxDistance: 50 });
    }
    
    // Collect birch logs
    for (const log of birchLogsNearby) {
      if (helpers.count(bot, 'birch_log') >= 4) break;
      await helpers.goto(bot, log.position.x, log.position.y, log.position.z, 2);
      await helpers.collect(bot, 'birch_log', 1, { maxDistance: 50 });
    }
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: (oakLogs >= 4 && birchLogs >= 4) || craftingTable > 0 || woodenPickaxe > 0,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_tables: craftingTable,
      wooden_pickaxes: woodenPickaxe
    }
  };
};
