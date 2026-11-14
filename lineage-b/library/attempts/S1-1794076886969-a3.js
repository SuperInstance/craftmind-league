// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs from the nearby forest to build a crafting table
// postconditions: Have enough wood logs to build a crafting table (at least 4 oak logs and 4 birch logs)
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough wood logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 4 && birchLogs >= 4) {
    return;
  }
  
  // Find more oak and birch logs
  const maxDistance = 50;
  const oakLogsToCollect = Math.max(0, 4 - oakLogs);
  const birchLogsToCollect = Math.max(0, 4 - birchLogs);
  
  // Collect oak logs
  if (oakLogsToCollect > 0) {
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', maxDistance, oakLogsToCollect);
    if (oakBlocks.length < oakLogsToCollect) {
      throw new Error(`Not enough oak logs found. Found ${oakBlocks.length}, needed ${oakLogsToCollect}`);
    }
    await helpers.collect(bot, 'oak_log', oakLogsToCollect, { maxDistance: maxDistance });
  }
  
  // Collect birch logs
  if (birchLogsToCollect > 0) {
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', maxDistance, birchLogsToCollect);
    if (birchBlocks.length < birchLogsToCollect) {
      throw new Error(`Not enough birch logs found. Found ${birchBlocks.length}, needed ${birchLogsToCollect}`);
    }
    await helpers.collect(bot, 'birch_log', birchLogsToCollect, { maxDistance: maxDistance });
  }
  
  // Verify we have enough logs
  const finalOakCount = helpers.count(bot, 'oak_log');
  const finalBirchCount = helpers.count(bot, 'birch_log');
  
  if (finalOakCount < 4 || finalBirchCount < 4) {
    throw new Error(`Failed to collect enough logs. Oak: ${finalOakCount}, Birch: ${finalBirchCount}`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.has(bot, 'crafting_table');
  
  return {
    ok: oakLogs >= 4 && birchLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_table: craftingTable
    }
  };
};