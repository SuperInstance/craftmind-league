// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak logs to build a crafting table and make wooden tools
// postconditions: Have enough oak logs to build a crafting table and a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs to build a crafting table (4 logs)
  if (helpers.has(bot, 'oak_log', 4)) {
    return;
  }
  
  // Find nearby oak trees
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 20, 10);
  
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found within 20 blocks');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 4, { maxDistance: 20 });
  
  // Verify we have enough logs
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Failed to collect enough oak logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasLogs = helpers.has(bot, 'oak_log', 4);
  return { 
    ok: hasLogs, 
    evidence: { 
      hasOakLogs: hasLogs,
      oakLogCount: helpers.count(bot, 'oak_log')
    } 
  };
};
