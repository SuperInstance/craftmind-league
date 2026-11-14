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
  
  // Find nearby logs using a larger search radius
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 50, 10);
  const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 50, 10);
  
  // If we can't find logs nearby, try to find a path to a location with logs
  if (oakLogsNearby.length === 0 && birchLogsNearby.length === 0) {
    // Try to find logs in a wider area
    const oakLogsFar = helpers.findBlocks(bot, 'oak_log', 100, 10);
    const birchLogsFar = helpers.findBlocks(bot, 'birch_log', 100, 10);
    
    if (oakLogsFar.length > 0) {
      // Go to the nearest oak log
      const nearestOak = oakLogsFar[0];
      await helpers.goto(bot, nearestOak.x, nearestOak.y, nearestOak.z, 3);
    } else if (birchLogsFar.length > 0) {
      // Go to the nearest birch log
      const nearestBirch = birchLogsFar[0];
      await helpers.goto(bot, nearestBirch.x, nearestBirch.y, nearestBirch.z, 3);
    } else {
      // If we still can't find logs, try to go to a known good location
      // Since we know from survey that logs are available, we should try a different approach
      // Let's try to go to a spot that's likely to have logs based on the survey
      const targetX = ctx.anchor.x + 20;
      const targetZ = ctx.anchor.z + 20;
      await helpers.goto(bot, targetX, ctx.anchor.y, targetZ, 5);
    }
  }
  
  // After moving, try to collect logs again
  await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
  await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
  
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