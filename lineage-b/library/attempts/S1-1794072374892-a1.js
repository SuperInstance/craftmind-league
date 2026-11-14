// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to have enough materials for crafting a crafting table and wooden tools
// postconditions: Have sufficient oak and birch logs for crafting a crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs already
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 oak logs and 4 birch logs for crafting
  // But we also need to account for the fact that we might need to craft a crafting table first
  // Let's collect more logs to be safe
  
  // Find more oak logs
  const oakLogsToCollect = Math.max(0, 8 - oakLogs);
  if (oakLogsToCollect > 0) {
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 30, oakLogsToCollect);
    if (oakBlocks.length < oakLogsToCollect) {
      throw new Error(`Not enough oak logs found. Found ${oakBlocks.length}, needed ${oakLogsToCollect}`);
    }
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', oakLogsToCollect, { maxDistance: 30 });
  }
  
  // Find more birch logs
  const birchLogsToCollect = Math.max(0, 8 - birchLogs);
  if (birchLogsToCollect > 0) {
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 30, birchLogsToCollect);
    if (birchBlocks.length < birchLogsToCollect) {
      throw new Error(`Not enough birch logs found. Found ${birchBlocks.length}, needed ${birchLogsToCollect}`);
    }
    
    // Collect birch logs
    await helpers.collect(bot, 'birch_log', birchLogsToCollect, { maxDistance: 30 });
  }
  
  // Verify we have enough logs
  const finalOakLogs = helpers.count(bot, 'oak_log');
  const finalBirchLogs = helpers.count(bot, 'birch_log');
  
  if (finalOakLogs < 4 || finalBirchLogs < 4) {
    throw new Error(`Insufficient logs after collection. Oak: ${finalOakLogs}, Birch: ${finalBirchLogs}`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTables = helpers.count(bot, 'crafting_table');
  
  return {
    ok: oakLogs >= 4 && birchLogs >= 4 && craftingTables >= 1,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_tables: craftingTables
    }
  };
};
