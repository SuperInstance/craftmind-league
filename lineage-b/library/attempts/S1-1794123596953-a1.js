// skill: gatherWoodForTools
// stage: S1
// purpose: Collect 10 oak logs and 10 birch logs for crafting table and tools
// postconditions: Have 10 oak logs and 10 birch logs in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 10 && birchLogs >= 10) {
    return;
  }
  
  // Collect oak logs (need 10)
  const oakToCollect = Math.max(0, 10 - oakLogs);
  await helpers.collect(bot, 'oak_log', oakToCollect, { maxDistance: 30 });
  
  // Collect birch logs (need 10)
  const birchToCollect = Math.max(0, 10 - birchLogs);
  await helpers.collect(bot, 'birch_log', birchToCollect, { maxDistance: 30 });
  
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
