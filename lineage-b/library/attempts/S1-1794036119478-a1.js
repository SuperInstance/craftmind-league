// skill: gatherWoodForTools
// stage: S1
// purpose: Collect at least 5 oak logs from the nearest oak tree cluster
// postconditions: Inventory contains at least 5 oak logs
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 5)) {
    return;
  }
  
  // Find the nearest oak tree cluster
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 5);
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found within 30 blocks');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 5)) {
    throw new Error('Failed to collect enough oak logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  return {
    ok: oakLogs >= 5,
    evidence: {
      oak_logs_collected: oakLogs
    }
  };
};