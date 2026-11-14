// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak logs to build a crafting table
// postconditions: Have enough oak logs (at least 4) to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    throw new Error(`Not enough oak logs in inventory: ${oakLogs} < 4`);
  }
  
  // Find more oak logs nearby
  const logs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (logs.length === 0) {
    throw new Error('No oak logs found nearby');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 4 - oakLogs, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const newOakLogs = helpers.count(bot, 'oak_log');
  if (newOakLogs < 4) {
    throw new Error(`Failed to collect enough oak logs: ${newOakLogs} < 4`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was created
  const craftingTables = helpers.count(bot, 'crafting_table');
  if (craftingTables < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify pickaxe was created
  const pickaxes = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxes < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  bot.chat("Successfully gathered wood and crafted tools!");
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTable = helpers.count(bot, 'crafting_table') > 0;
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe') > 0;
  
  return {
    ok: craftingTable && woodenPickaxe,
    evidence: {
      craftingTable: craftingTable,
      woodenPickaxe: woodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      inventory: helpers.inventoryList(bot)
    }
  };
};
