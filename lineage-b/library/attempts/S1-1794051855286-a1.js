// skill: gatherWoodForTools
// stage: S1
// purpose: Collect enough oak logs to build a crafting table
// postconditions: Have at least 4 oak logs for crafting table and 10 oak logs total
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 10) {
    throw new Error(`Not enough oak logs in inventory. Have ${oakLogs}, need 10`);
  }
  
  // Check if we have enough logs for crafting table (4 logs)
  if (oakLogs < 4) {
    // Need to collect more oak logs
    const logsToCollect = 4 - oakLogs;
    const oakLogsNearby = ctx.state.survey.oak_log;
    
    if (oakLogsNearby < logsToCollect) {
      throw new Error(`Not enough oak logs nearby. Have ${oakLogsNearby}, need ${logsToCollect}`);
    }
    
    // Collect the required oak logs
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 32 });
    
    // Verify we collected enough
    const newOaks = helpers.count(bot, 'oak_log');
    if (newOaks < 4) {
      throw new Error(`Failed to collect enough oak logs. Have ${newOaks}, need 4`);
    }
  }
  
  // Check if we have enough logs for both crafting table and having 10 total
  const totalOaks = helpers.count(bot, 'oak_log');
  if (totalOaks < 10) {
    const logsNeeded = 10 - totalOaks;
    const oakLogsNearby = ctx.state.survey.oak_log;
    
    if (oakLogsNearby < logsNeeded) {
      throw new Error(`Not enough oak logs nearby to reach 10 total. Have ${oakLogsNearby}, need ${logsNeeded}`);
    }
    
    await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 32 });
  }
  
  // Final check
  const finalCount = helpers.count(bot, 'oak_log');
  if (finalCount < 10) {
    throw new Error(`Final inventory check failed. Have ${finalCount}, need 10`);
  }
  
  // Report progress
  bot.chat("Collected enough oak logs for crafting table");
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 10 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};