// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have sufficient materials for crafting a crafting table and wooden pickaxe
// postconditions: Have enough oak logs to craft a crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory for oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    throw new Error(`Not enough oak logs: have ${oakLogs}, need at least 4`);
  }
  
  // Find more oak logs nearby
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakLogsNearby.length === 0) {
    // If no oak logs found nearby, search for more
    const oakLogsInSurvey = ctx.state.survey.oak_log;
    if (oakLogsInSurvey < 10) {
      throw new Error(`Not enough oak logs found in survey: ${oakLogsInSurvey}`);
    }
    
    // Collect oak logs from the area
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  }
  
  // Verify we have enough oak logs
  const finalOakLogs = helpers.count(bot, 'oak_log');
  if (finalOakLogs < 4) {
    throw new Error(`Failed to collect enough oak logs: have ${finalOakLogs}, need at least 4`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  const craftingTables = helpers.count(bot, 'crafting_table');
  if (craftingTables < 1) {
    throw new Error(`Failed to craft crafting table`);
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  const woodenPickaxes = helpers.count(bot, 'wooden_pickaxe');
  if (woodenPickaxes < 1) {
    throw new Error(`Failed to craft wooden pickaxe`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  const woodenPickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: craftingTableCount >= 1 && woodenPickaxeCount >= 1,
    evidence: {
      craftingTables: craftingTableCount,
      woodenPickaxes: woodenPickaxeCount
    }
  };
};
