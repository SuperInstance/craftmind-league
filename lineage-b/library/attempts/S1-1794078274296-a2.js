// skill: gatherWoodForTools
// stage: S1
// purpose: Collect oak and birch logs from nearby trees to build a crafting table
// postconditions: Have enough wood logs (at least 4) to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough wood logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const totalLogs = oakLogs + birchLogs;
  
  if (totalLogs >= 4) {
    return;
  }
  
  // Collect additional wood logs
  const neededLogs = 4 - totalLogs;
  
  // Find nearby oak logs
  const oakBlocks = helpers.findBlocks(bot, 'oak_log', 30, neededLogs);
  if (oakBlocks.length > 0) {
    await helpers.collect(bot, 'oak_log', neededLogs, { maxDistance: 30 });
  }
  
  // Find nearby birch logs
  const birchBlocks = helpers.findBlocks(bot, 'birch_log', 30, neededLogs);
  if (birchBlocks.length > 0) {
    await helpers.collect(bot, 'birch_log', neededLogs, { maxDistance: 30 });
  }
  
  // If we still don't have enough logs, try to find more
  const newOakLogs = helpers.count(bot, 'oak_log');
  const newBirchLogs = helpers.count(bot, 'birch_log');
  const newTotalLogs = newOakLogs + newBirchLogs;
  
  if (newTotalLogs < 4) {
    throw new Error(`Not enough wood logs collected. Have ${newTotalLogs} logs, need at least 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const totalLogs = oakLogs + birchLogs;
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  
  return {
    ok: totalLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      total_logs: totalLogs,
      has_crafting_table: hasCraftingTable
    }
  };
};