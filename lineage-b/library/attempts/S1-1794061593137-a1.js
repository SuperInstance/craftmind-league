// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough planks for building a crafting table
// postconditions: Have enough oak planks (at least 4) and oak logs (at least 10) for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const currentOakLogs = helpers.count(bot, 'oak_log');
  const currentPlanks = helpers.count(bot, 'oak_planks');
  
  // Need at least 10 oak logs and 4 planks to make a crafting table
  if (currentOakLogs >= 10 && currentPlanks >= 4) {
    return;
  }
  
  // Find more oak logs
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found within 30 blocks');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 10 - currentOakLogs, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const newOakLogs = helpers.count(bot, 'oak_log');
  if (newOakLogs < 10) {
    throw new Error(`Only collected ${newOakLogs} oak logs, need at least 10`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const oakPlanks = helpers.count(bot, 'oak_planks');
  const craftingTable = helpers.has(bot, 'crafting_table', 1);
  
  return {
    ok: oakLogs >= 10 && oakPlanks >= 4,
    evidence: {
      oak_logs: oakLogs,
      oak_planks: oakPlanks,
      crafting_table: craftingTable
    }
  };
};
