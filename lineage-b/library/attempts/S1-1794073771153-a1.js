// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect additional oak and birch logs to build a crafting table
// postconditions: Have enough wood logs to craft a crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs already
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs total for a crafting table
  if (oakLogs + birchLogs >= 4) {
    return;
  }
  
  // Collect more logs
  const logsToCollect = 4 - (oakLogs + birchLogs);
  
  // Find nearby logs
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
  const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 30, 10);
  
  // Collect oak logs first
  if (oakLogsNearby.length > 0) {
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
  }
  
  // Then collect birch logs if needed
  if (oakLogsNearby.length === 0 || helpers.count(bot, 'oak_log') < 4) {
    await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
  }
  
  // Verify we have enough logs
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak + finalBirch < 4) {
    throw new Error(`Not enough logs collected. Got ${finalOak} oak logs and ${finalBirch} birch logs, need at least 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const totalLogs = oakLogs + birchLogs;
  
  return {
    ok: totalLogs >= 4,
    evidence: {
      oakLogs: oakLogs,
      birchLogs: birchLogs,
      totalLogs: totalLogs
    }
  };
};