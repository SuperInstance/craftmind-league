// skill: gatherWoodForTools
// stage: S1
// purpose: Collect enough oak logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough oak logs for crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 oak logs for a crafting table and 1 more for a wooden pickaxe
  // Total needed: 5 oak logs
  const neededLogs = 5;
  const currentLogs = oakLogs;
  
  if (currentLogs >= neededLogs) {
    return;
  }
  
  // Find nearby oak trees by looking for oak logs within 20 blocks
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, 5);
  
  if (oakLogsNearby.length === 0) {
    // If no oak logs found nearby, try to find oak trees by looking for oak wood blocks
    const oakTreeTrunks = helpers.findBlocks(bot, 'oak_log', 20, 5);
    
    if (oakTreeTrunks.length === 0) {
      // Try to find more oak logs in the survey area
      const surveyOakLogs = ctx.state.survey.oak_log;
      if (surveyOakLogs < 5) {
        throw new Error(`Not enough oak logs found in survey area: ${surveyOakLogs}`);
      }
    }
  }
  
  // Collect oak logs from nearby locations
  const logsToCollect = Math.min(neededLogs - currentLogs, 5);
  await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 20 });
  
  // Verify we have enough logs now
  const finalLogs = helpers.count(bot, 'oak_log');
  if (finalLogs < neededLogs) {
    throw new Error(`Failed to collect enough oak logs. Got ${finalLogs}, needed ${neededLogs}`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.has(bot, 'crafting_table');
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 5 && (craftingTable || woodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      crafting_table: craftingTable,
      wooden_pickaxe: woodenPickaxe
    }
  };
};