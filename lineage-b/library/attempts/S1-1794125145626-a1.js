// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak logs to build a crafting table and make wooden tools
// postconditions: Have enough oak logs to build a crafting table and a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 4) {
    // We have enough logs to build a crafting table
    return;
  }
  
  // Find nearby oak trees to collect more logs
  const oakTreeBlocks = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakTreeBlocks.length === 0) {
    throw new Error('No oak logs found within 30 blocks');
  }
  
  // Collect oak logs from the nearest tree
  const targetLog = oakTreeBlocks[0];
  await helpers.goto(bot, targetLog.x, targetLog.y, targetLog.z, 2);
  
  // Collect the oak logs
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 10 });
  
  // Verify we collected enough logs
  const logsAfterCollection = helpers.count(bot, 'oak_log');
  if (logsAfterCollection < 4) {
    throw new Error(`Only collected ${logsAfterCollection} oak logs, need at least 4`);
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
      has_crafting_table: craftingTable,
      has_wooden_pickaxe: woodenPickaxe
    }
  };
};
