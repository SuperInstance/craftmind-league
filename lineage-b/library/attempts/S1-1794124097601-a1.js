// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect additional oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough wood logs to build a crafting table and craft a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs >= 4 && birchLogs >= 4) {
    // We already have enough logs
    return;
  }
  
  // Collect additional logs
  const neededOak = Math.max(0, 4 - oakLogs);
  const neededBirch = Math.max(0, 4 - birchLogs);
  
  // Find and collect oak logs
  if (neededOak > 0) {
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 50, neededOak);
    if (oakBlocks.length < neededOak) {
      throw new Error(`Not enough oak logs found. Needed ${neededOak}, found ${oakBlocks.length}`);
    }
    await helpers.collect(bot, 'oak_log', neededOak);
  }
  
  // Find and collect birch logs
  if (neededBirch > 0) {
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 50, neededBirch);
    if (birchBlocks.length < neededBirch) {
      throw new Error(`Not enough birch logs found. Needed ${neededBirch}, found ${birchBlocks.length}`);
    }
    await helpers.collect(bot, 'birch_log', neededBirch);
  }
  
  // Verify we have enough logs
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 4 || finalBirch < 4) {
    throw new Error(`Failed to collect enough logs. Oak: ${finalOak}/4, Birch: ${finalBirch}/4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.has(bot, 'crafting_table');
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 4 && birchLogs >= 4 && (craftingTable || woodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_table: craftingTable,
      wooden_pickaxe: woodenPickaxe
    }
  };
};
