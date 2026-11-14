// skill: gatherWoodForTools
// stage: S1
// purpose: Collect enough oak logs to craft a crafting table
// postconditions: Have enough oak logs in inventory to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const neededLogs = 4; // Crafting table needs 4 logs
  
  if (oakLogs >= neededLogs) {
    return; // Already have enough logs
  }
  
  // Need to collect more logs
  const logsNeeded = neededLogs - oakLogs;
  
  // Try to find oak logs nearby first
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, 10);
  
  if (oakLogsNearby.length > 0) {
    // Collect nearby oak logs
    await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 20 });
  } else {
    // No nearby oak logs found, search further
    const oakLogBlock = helpers.findBlock(bot, 'oak_log', 50);
    if (oakLogBlock) {
      await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 2);
      await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 50 });
    } else {
      throw new Error('No oak logs found within 50 blocks');
    }
  }
  
  // Verify we have enough logs now
  const finalLogs = helpers.count(bot, 'oak_log');
  if (finalLogs < neededLogs) {
    throw new Error(`Only collected ${finalLogs} oak logs, needed ${neededLogs}`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.has(bot, 'crafting_table');
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 4 && (craftingTable || woodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      crafting_table: craftingTable,
      wooden_pickaxe: woodenPickaxe
    }
  };
};