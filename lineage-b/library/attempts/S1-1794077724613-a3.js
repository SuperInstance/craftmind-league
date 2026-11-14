// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 30 oak logs and 30 birch logs to build a crafting table
// postconditions: Have 30 oak logs and 30 birch logs in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 30 && birchLogs >= 30) {
    return;
  }
  
  // Collect oak logs if needed
  if (oakLogs < 30) {
    const neededOak = 30 - oakLogs;
    // Use a more specific search for oak logs with a reasonable max distance
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 50, neededOak);
    if (oakBlocks.length < neededOak) {
      throw new Error(`Not enough oak logs found. Found ${oakBlocks.length}, needed ${neededOak}`);
    }
    // Collect each oak log block individually to ensure we get them all
    for (let i = 0; i < neededOak; i++) {
      await helpers.collect(bot, 'oak_log', 1, { maxDistance: 50 });
    }
  }
  
  // Collect birch logs if needed
  if (birchLogs < 30) {
    const neededBirch = 30 - birchLogs;
    // Use a more specific search for birch logs with a reasonable max distance
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 50, neededBirch);
    if (birchBlocks.length < neededBirch) {
      throw new Error(`Not enough birch logs found. Found ${birchBlocks.length}, needed ${neededBirch}`);
    }
    // Collect each birch log block individually to ensure we get them all
    for (let i = 0; i < neededBirch; i++) {
      await helpers.collect(bot, 'birch_log', 1, { maxDistance: 50 });
    }
  }
  
  // Verify we have enough logs
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 30 || finalBirch < 30) {
    throw new Error(`Failed to collect enough logs: oak=${finalOak}, birch=${finalBirch}`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  return {
    ok: oakLogs >= 30 && birchLogs >= 30,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs
    }
  };
};