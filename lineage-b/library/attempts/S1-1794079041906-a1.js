// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs from the north-eastern region
// postconditions: Have enough wood logs to build a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs already
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 4 && birchLogs >= 4) {
    // We have enough logs, but let's make sure we can build a crafting table
    const craftingTables = helpers.count(bot, 'crafting_table');
    if (craftingTables >= 1) {
      return;
    }
  }
  
  // Look for more logs in the north-eastern region
  // Based on survey data, there should be plenty of oak and birch logs
  const logs = helpers.findBlocks(bot, 'oak_log', 50, 10);
  if (logs.length === 0) {
    // Try birch logs if oak logs are not found
    const birchLogs = helpers.findBlocks(bot, 'birch_log', 50, 10);
    if (birchLogs.length === 0) {
      throw new Error('No oak or birch logs found in the surrounding area');
    }
  }
  
  // Collect oak logs first
  const oakLogsToCollect = Math.max(0, 4 - oakLogs);
  if (oakLogsToCollect > 0) {
    await helpers.collect(bot, 'oak_log', oakLogsToCollect, { maxDistance: 30 });
  }
  
  // Collect birch logs
  const birchLogsToCollect = Math.max(0, 4 - birchLogs);
  if (birchLogsToCollect > 0) {
    await helpers.collect(bot, 'birch_log', birchLogsToCollect, { maxDistance: 30 });
  }
  
  // Verify we have enough logs
  const finalOakLogs = helpers.count(bot, 'oak_log');
  const finalBirchLogs = helpers.count(bot, 'birch_log');
  
  if (finalOakLogs < 4 || finalBirchLogs < 4) {
    throw new Error('Not enough logs collected to build a crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTables = helpers.count(bot, 'crafting_table');
  
  return {
    ok: (oakLogs >= 4 && birchLogs >= 4) || craftingTables >= 1,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_tables: craftingTables
    }
  };
};
