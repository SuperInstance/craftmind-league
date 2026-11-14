// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect additional oak and birch logs to build a crafting table and create wooden tools
// postconditions: Have enough wood logs to build a crafting table and create a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to build a crafting table (4 oak logs or 4 birch logs)
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // Collect additional oak logs if needed
  const oakLogsToCollect = Math.max(0, 10 - oakLogs);
  if (oakLogsToCollect > 0) {
    await helpers.collect(bot, 'oak_log', oakLogsToCollect, { maxDistance: 30 });
  }
  
  // Collect additional birch logs if needed
  const birchLogsToCollect = Math.max(0, 10 - birchLogs);
  if (birchLogsToCollect > 0) {
    await helpers.collect(bot, 'birch_log', birchLogsToCollect, { maxDistance: 30 });
  }
  
  // Verify we have enough logs
  const finalOakLogs = helpers.count(bot, 'oak_log');
  const finalBirchLogs = helpers.count(bot, 'birch_log');
  
  if (finalOakLogs < 4 && finalBirchLogs < 4) {
    throw new Error('Not enough wood logs to build crafting table');
  }
  
  // If we don't have enough logs to make a pickaxe, collect more
  const totalLogs = finalOakLogs + finalBirchLogs;
  if (totalLogs < 7) { // Need at least 4 for crafting table + 3 for pickaxe
    const logsNeeded = 7 - totalLogs;
    await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 30 });
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: (oakLogs >= 4 || birchLogs >= 4) && (craftingTable >= 1 || woodenPickaxe >= 1),
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_tables: craftingTable,
      wooden_pickaxes: woodenPickaxe
    }
  };
};