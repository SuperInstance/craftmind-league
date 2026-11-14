// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 10 oak logs and 10 birch logs to craft wooden tools
// postconditions: Have 10 oak logs and 10 birch logs in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have the required logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 10 && birchLogs >= 10) {
    return;
  }
  
  // Collect oak logs
  if (oakLogs < 10) {
    const neededOak = 10 - oakLogs;
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 30, neededOak);
    if (oakBlocks.length === 0) {
      throw new Error('No oak logs found within 30 blocks');
    }
    for (const block of oakBlocks) {
      await helpers.goto(bot, block.x, block.y, block.z, 1);
      await bot.digBlock(block);
    }
  }
  
  // Collect birch logs
  if (birchLogs < 10) {
    const neededBirch = 10 - birchLogs;
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 30, neededBirch);
    if (birchBlocks.length === 0) {
      throw new Error('No birch logs found within 30 blocks');
    }
    for (const block of birchBlocks) {
      await helpers.goto(bot, block.x, block.y, block.z, 1);
      await bot.digBlock(block);
    }
  }
  
  // Verify we have enough logs
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 10 || finalBirch < 10) {
    throw new Error(`Failed to collect enough logs. Got ${finalOak} oak logs and ${finalBirch} birch logs`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  return {
    ok: oakLogs >= 10 && birchLogs >= 10,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs
    }
  };
};