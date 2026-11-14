// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak logs to build a crafting table
// postconditions: Have enough oak logs to craft a crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 10) {
    throw new Error(`Not enough oak logs in inventory. Found ${oakLogs}, need at least 10.`);
  }
  
  // Find more oak logs nearby
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, 10);
  if (oakLogsNearby.length < 10) {
    // If not enough logs nearby, look for trees
    const trees = helpers.findBlocks(bot, 'oak_log', 30, 10);
    if (trees.length < 10) {
      throw new Error(`Not enough oak logs found nearby. Found ${trees.length}, need at least 10.`);
    }
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 20 });
  
  // Verify we have enough logs now
  const logsAfterCollection = helpers.count(bot, 'oak_log');
  if (logsAfterCollection < 10) {
    throw new Error(`Failed to collect enough oak logs. Got ${logsAfterCollection}, need at least 10.`);
  }
  
  // Chat about progress
  bot.chat("Gathering oak logs for crafting table...");
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
