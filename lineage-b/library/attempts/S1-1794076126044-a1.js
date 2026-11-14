// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs to build a crafting table
// postconditions: Have enough wood logs to craft a crafting table and a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs already
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // If we already have enough logs, we're done
  if (oakLogs >= 4 && birchLogs >= 4) {
    return;
  }
  
  // Collect more oak logs if needed
  if (oakLogs < 4) {
    const neededOak = 4 - oakLogs;
    await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
  }
  
  // Collect more birch logs if needed
  if (birchLogs < 4) {
    const neededBirch = 4 - birchLogs;
    await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
  }
  
  // Verify we have enough logs now
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 4 || finalBirch < 4) {
    throw new Error(`Not enough wood logs collected. Have ${finalOak} oak logs and ${finalBirch} birch logs`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 4 && birchLogs >= 4 && (craftingTable > 0 || craftingTable > 0),
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_tables: craftingTable,
      wooden_pickaxes: woodenPickaxe
    }
  };
};
