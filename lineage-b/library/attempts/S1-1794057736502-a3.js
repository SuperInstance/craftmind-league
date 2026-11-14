// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak logs to build a crafting table and craft a wooden pickaxe
// postconditions: Crafting table is placed or carried, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    throw new Error(`Not enough oak logs in inventory: ${oakLogs} < 4`);
  }
  
  // Gather more oak logs since we need 4 for crafting table
  const logsToGather = 4 - oakLogs;
  if (logsToGather > 0) {
    // Find nearby oak logs to collect
    const oakLogBlocks = helpers.findBlocks(bot, 'oak_log', 30, 10);
    if (oakLogBlocks.length === 0) {
      // If no oak logs found nearby, search for more
      const oakLogCount = helpers.count(bot, 'oak_log');
      if (oakLogCount < 4) {
        // Try to find more oak logs in the survey area
        const survey = helpers.survey(bot);
        if (survey.oak_log > 0) {
          // Move to a location with oak logs
          const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
          if (oakLogBlock) {
            await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 2);
          } else {
            throw new Error('No oak logs found in survey area');
          }
        } else {
          throw new Error('No oak logs found in survey area');
        }
      }
    }
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
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
  
  bot.chat("Successfully gathered wood, built crafting table and crafted wooden pickaxe!");
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