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
  
  // Find more oak logs using a more reliable method
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 50, 10);
  if (oakLogs.length === 0) {
    // If no oak logs found nearby, try to find them in a wider area
    const nearbyOakLogs = helpers.findBlocks(bot, 'oak_log', 100, 20);
    if (nearbyOakLogs.length === 0) {
      throw new Error('No oak logs found within 100 blocks');
    }
    // Try to go to one of the nearby oak logs
    const targetLog = nearbyOakLogs[0];
    await helpers.goto(bot, targetLog.x, targetLog.y, targetLog.z, 2);
    // Collect the logs from this location
    await helpers.collect(bot, 'oak_log', 10 - currentOakLogs, { maxDistance: 30 });
  } else {
    // Collect oak logs from the found locations
    await helpers.collect(bot, 'oak_log', 10 - currentOakLogs, { maxDistance: 30 });
  }
  
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
