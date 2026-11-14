// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Crafting table is placed or carried within 20 blocks AND wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to craft a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to make a crafting table
  if (oakLogs + birchLogs < 4) {
    // Collect more logs
    const logsToCollect = 4 - (oakLogs + birchLogs);
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // Check if we collected enough
    const newOakLogs = helpers.count(bot, 'oak_log');
    if (newOakLogs < 4) {
      throw new Error(`Failed to collect enough oak logs. Have ${newOakLogs}, need 4`);
    }
  }
  
  // Craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (err) {
    // If crafting failed, check if there's a crafting table nearby
    const nearbyCraftingTable = helpers.findBlock(bot, 'crafting_table', 20);
    if (!nearbyCraftingTable) {
      throw new Error(`Failed to craft crafting table and no nearby crafting table found`);
    }
  }
  
  // Try to craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (err) {
    throw new Error(`Failed to craft wooden pickaxe`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (craftingTableNearby || helpers.count(bot, 'crafting_table') > 0) && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: !!craftingTableNearby,
      hasWoodenPickaxe: hasWoodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      birchLogs: helpers.count(bot, 'birch_log'),
      craftingTableCount: helpers.count(bot, 'crafting_table')
    }
  };
};
