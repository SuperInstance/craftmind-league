// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to build a crafting table
// postconditions: Have enough wood logs to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough wood logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs total for a crafting table
  if (oakLogs + birchLogs < 4) {
    // Collect more wood logs
    const logsToCollect = 4 - (oakLogs + birchLogs);
    
    // Find and collect oak logs first
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 30, logsToCollect);
    if (oakBlocks.length > 0) {
      for (const block of oakBlocks) {
        await helpers.goto(bot, block.x, block.y, block.z, 1);
        await bot.dig(bot.blockAt(v3(block.x, block.y, block.z)));
      }
    }
    
    // If we still need more logs, collect birch logs
    const remainingLogs = 4 - oakLogs;
    if (remainingLogs > 0) {
      const birchBlocks = helpers.findBlocks(bot, 'birch_log', 30, remainingLogs);
      if (birchBlocks.length > 0) {
        for (const block of birchBlocks) {
          await helpers.goto(bot, block.x, block.y, block.z, 1);
          await bot.dig(bot.blockAt(v3(block.x, block.y, block.z)));
        }
      }
    }
  }
  
  // Verify we have enough wood logs
  const finalOakLogs = helpers.count(bot, 'oak_log');
  const finalBirchLogs = helpers.count(bot, 'birch_log');
  
  if (finalOakLogs + finalBirchLogs < 4) {
    throw new Error(`Not enough wood logs to build crafting table. Have ${finalOakLogs} oak logs and ${finalBirchLogs} birch logs`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const totalLogs = oakLogs + birchLogs;
  
  return {
    ok: totalLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      total_logs: totalLogs
    }
  };
};