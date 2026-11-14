// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 5 oak logs and 5 birch logs to craft wooden tools
// postconditions: Have 5 oak logs, 5 birch logs, crafting table, and wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  if (helpers.count(bot, 'oak_log') < 5) {
    const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 5);
    if (oakLogs.length < 5) {
      throw new Error(`Not enough oak logs found. Found ${oakLogs.length}, need 5`);
    }
    await helpers.collect(bot, 'oak_log', 5);
  }
  
  if (helpers.count(bot, 'birch_log') < 5) {
    const birchLogs = helpers.findBlocks(bot, 'birch_log', 30, 5);
    if (birchLogs.length < 5) {
      throw new Error(`Not enough birch logs found. Found ${birchLogs.length}, need 5`);
    }
    await helpers.collect(bot, 'birch_log', 5);
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1) || 
    (helpers.count(bot, 'crafting_table') > 0 && helpers.has(bot, 'crafting_table', 1));
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTable: hasCraftingTable,
      woodenPickaxe: hasWoodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      birchLogs: helpers.count(bot, 'birch_log')
    }
  };
};