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
  
  // Collect more logs using a more reliable approach
  const logsToCollect = 4 - (oakLogs + birchLogs);
  
  // Try to collect logs within a reasonable distance
  try {
    // First, try to collect oak logs
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // Check if we got enough logs
    const currentOak = helpers.count(bot, 'oak_log');
    const currentBirch = helpers.count(bot, 'birch_log');
    const totalLogs = currentOak + currentBirch;
    
    if (totalLogs < 4) {
      // If still not enough, collect birch logs
      await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
    }
  } catch (e) {
    // If collect fails, try to find logs manually
    // Look for logs in a larger area around the anchor
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 50, 10);
    const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 50, 10);
    
    // Combine both lists
    const allLogs = [...oakLogsNearby, ...birchLogsNearby];
    
    if (allLogs.length > 0) {
      // Go to the nearest log
      const nearestLog = allLogs[0];
      await helpers.goto(bot, nearestLog.x, nearestLog.y, nearestLog.z, 3);
      
      // Collect logs from that location
      await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
      await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
    } else {
      // If we can't find logs nearby, go to a known good area
      // Based on survey, logs are available in the area, so go to a spot that's likely to have logs
      const targetX = ctx.anchor.x + 15;
      const targetZ = ctx.anchor.z + 15;
      await helpers.goto(bot, targetX, ctx.anchor.y, targetZ, 5);
      
      // Try to collect logs again
      await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
      await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
    }
  }
  
  // Final verification
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  const totalLogs = finalOak + finalBirch;
  
  if (totalLogs < 4) {
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