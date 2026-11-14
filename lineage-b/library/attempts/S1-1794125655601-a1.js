// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to build a crafting table and make wooden tools
// postconditions: Have enough oak logs to build a crafting table and a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs to build a crafting table
  const logsNeeded = 4;
  if (helpers.has(bot, 'oak_log', logsNeeded)) {
    // We already have enough logs, proceed to build crafting table
    return;
  }
  
  // Find nearby oak trees to collect more logs
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found nearby');
  }
  
  // Collect oak logs from the nearest source
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  
  // Verify we have enough logs now
  if (!helpers.has(bot, 'oak_log', logsNeeded)) {
    throw new Error('Failed to collect enough oak logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      hasCraftingTable,
      hasWoodenPickaxe,
      oakLogCount: helpers.count(bot, 'oak_log')
    }
  };
};
