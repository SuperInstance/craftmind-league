// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough wood logs to build a crafting table and craft a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs for crafting table (4 logs) and wooden pickaxe (3 logs)
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // If we already have enough logs, we can proceed to build crafting table
  if (oakLogs >= 4 || birchLogs >= 4) {
    return;
  }
  
  // Find more logs in the surrounding area
  const maxDistance = 50;
  const logsToCollect = 10; // Collect more than needed to be safe
  
  // Try to collect oak logs first
  const oakLogsFound = helpers.findBlocks(bot, 'oak_log', maxDistance, logsToCollect);
  if (oakLogsFound.length > 0) {
    await helpers.collect(bot, 'oak_log', logsToCollect);
  }
  
  // If we still need more logs, collect birch logs
  const birchLogsFound = helpers.findBlocks(bot, 'birch_log', maxDistance, logsToCollect);
  if (birchLogsFound.length > 0) {
    await helpers.collect(bot, 'birch_log', logsToCollect);
  }
  
  // Check if we now have enough logs
  const newOakLogs = helpers.count(bot, 'oak_log');
  const newBirchLogs = helpers.count(bot, 'birch_log');
  
  if (newOakLogs < 4 && newBirchLogs < 4) {
    throw new Error('Not enough logs collected to build crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: (oakLogs >= 4 || birchLogs >= 4) && (craftingTable > 0 || woodenPickaxe > 0),
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_tables: craftingTable,
      wooden_pickaxes: woodenPickaxe
    }
  };
};
