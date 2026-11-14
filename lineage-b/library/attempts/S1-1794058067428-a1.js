// skill: gatherWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to build a crafting table and craft wooden tools
// postconditions: Crafting table is placed within 20 blocks or carried, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to build a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to make a crafting table
  if (oakLogs + birchLogs < 4) {
    // Collect more logs
    const logsToCollect = 4 - (oakLogs + birchLogs);
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // If still not enough, collect birch logs
    const oakLogsAfter = helpers.count(bot, 'oak_log');
    const birchLogsAfter = helpers.count(bot, 'birch_log');
    const totalLogs = oakLogsAfter + birchLogsAfter;
    
    if (totalLogs < 4) {
      const additionalLogs = 4 - totalLogs;
      await helpers.collect(bot, 'birch_log', additionalLogs, { maxDistance: 30 });
    }
  }
  
  // Verify we have enough logs
  const oakLogsFinal = helpers.count(bot, 'oak_log');
  const birchLogsFinal = helpers.count(bot, 'birch_log');
  if (oakLogsFinal + birchLogsFinal < 4) {
    throw new Error(`Not enough logs to build crafting table. Have ${oakLogsFinal} oak logs and ${birchLogsFinal} birch logs`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (hasCraftingTable || craftingTableNearby) && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: !!craftingTableNearby,
      hasCraftingTable: hasCraftingTable,
      hasWoodenPickaxe: hasWoodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      birchLogs: helpers.count(bot, 'birch_log')
    }
  };
};
