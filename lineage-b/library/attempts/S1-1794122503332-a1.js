// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect additional oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough wood logs to build a crafting table and craft a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs for a crafting table and 1 more for a wooden pickaxe
  const neededOak = Math.max(0, 4 - oakLogs);
  const neededBirch = Math.max(0, 4 - birchLogs);
  
  // If we already have enough, we're done
  if (neededOak === 0 && neededBirch === 0) {
    return;
  }
  
  // Collect oak logs first
  if (neededOak > 0) {
    const oakBlock = helpers.findBlock(bot, 'oak_log', 30);
    if (oakBlock) {
      await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
    } else {
      // If no oak logs found nearby, search further
      const oakBlocks = helpers.findBlocks(bot, 'oak_log', 50, 10);
      if (oakBlocks.length > 0) {
        await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 50 });
      } else {
        throw new Error('No oak logs found within 50 blocks');
      }
    }
  }
  
  // Collect birch logs if needed
  if (neededBirch > 0) {
    const birchBlock = helpers.findBlock(bot, 'birch_log', 30);
    if (birchBlock) {
      await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
    } else {
      // If no birch logs found nearby, search further
      const birchBlocks = helpers.findBlocks(bot, 'birch_log', 50, 10);
      if (birchBlocks.length > 0) {
        await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 50 });
      } else {
        throw new Error('No birch logs found within 50 blocks');
      }
    }
  }
  
  // Verify we have enough logs
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 4 || finalBirch < 4) {
    throw new Error(`Not enough logs collected. Have ${finalOak} oak logs and ${finalBirch} birch logs`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe');
  
  const hasCraftingTable = craftingTable > 0;
  const hasWoodenPickaxe = woodenPickaxe > 0;
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_tables: craftingTable,
      wooden_pickaxes: woodenPickaxe
    }
  };
};