// skill: gatherWoodForTools
// stage: S1
// purpose: Collect oak logs from nearby trees to begin crafting wooden tools
// postconditions: Inventory contains oak logs and a crafting table is placed or carried
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs
  if (helpers.has(bot, 'oak_log', 5)) {
    return;
  }
  
  // Find nearby oak logs
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 20, 5);
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found within 20 blocks');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 20 });
  
  // Verify we have the logs
  if (!helpers.has(bot, 'oak_log', 5)) {
    throw new Error('Failed to collect enough oak logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasLogs = helpers.has(bot, 'oak_log', 5);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  
  return {
    ok: hasLogs && hasCraftingTable,
    evidence: {
      oak_logs: helpers.count(bot, 'oak_log'),
      crafting_table: helpers.count(bot, 'crafting_table')
    }
  };
};
