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
  
  // Since we know from survey that logs are available, let's try to collect them directly
  // First, try to collect oak logs
  try {
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
  } catch (e) {
    // If that fails, try collecting birch logs
    await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
  }
  
  // If we still don't have enough, try to find logs in a larger area
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  const totalLogs = finalOak + finalBirch;
  
  if (totalLogs < 4) {
    // Try to find logs in a wider area by searching for blocks around the anchor
    const logs = helpers.findBlocks(bot, 'oak_log', 100, 10);
    if (logs.length === 0) {
      logs.push(...helpers.findBlocks(bot, 'birch_log', 100, 10));
    }
    
    if (logs.length > 0) {
      // Go to the nearest log
      const nearestLog = logs[0];
      await helpers.goto(bot, nearestLog.x, nearestLog.y, nearestLog.z, 3);
      
      // Collect the logs
      await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
      await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
    } else {
      // If we still can't find logs, we need to go to a known good location
      // Based on the survey, logs are available in the area, so let's try a different approach
      // Try to go to a spot that's likely to have logs based on the survey
      const targetX = ctx.anchor.x + 20;
      const targetZ = ctx.anchor.z + 20;
      await helpers.goto(bot, targetX, ctx.anchor.y, targetZ, 5);
      
      // Try to collect logs again
      await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
      await helpers.collect(bot, 'birch_log', logsToCollect, { maxDistance: 30 });
    }
  }
  
  // Final verification
  const finalOak2 = helpers.count(bot, 'oak_log');
  const finalBirch2 = helpers.count(bot, 'birch_log');
  const totalLogs2 = finalOak2 + finalBirch2;
  
  if (totalLogs2 < 4) {
    throw new Error(`Not enough logs collected. Got ${finalOak2} oak logs and ${finalBirch2} birch logs, need at least 4`);
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