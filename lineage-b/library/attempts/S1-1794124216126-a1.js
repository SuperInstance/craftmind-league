// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect additional oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough wood logs to build a crafting table and craft a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, anchor);
  
  // Check if we already have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 4 && birchLogs >= 4) {
    return;
  }
  
  // Find more logs in the surrounding area
  const maxDistance = 30;
  const logsToCollect = [];
  
  // Find oak logs
  const oakBlocks = helpers.findBlocks(bot, 'oak_log', maxDistance, 10);
  logsToCollect.push(...oakBlocks);
  
  // Find birch logs
  const birchBlocks = helpers.findBlocks(bot, 'birch_log', maxDistance, 10);
  logsToCollect.push(...birchBlocks);
  
  if (logsToCollect.length === 0) {
    throw new Error('No logs found within 30 blocks');
  }
  
  // Collect logs
  await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
  await helpers.collect(bot, 'birch_log', 4, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const newOakLogs = helpers.count(bot, 'oak_log');
  const newBirchLogs = helpers.count(bot, 'birch_log');
  
  if (newOakLogs < 4 || newBirchLogs < 4) {
    throw new Error('Failed to collect enough logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  return {
    ok: oakLogs >= 4 && birchLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs
    }
  };
};
