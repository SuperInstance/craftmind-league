// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak logs to build a crafting table and craft wooden tools
// postconditions: Have enough oak logs for crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 oak logs for a crafting table
  if (oakLogs >= 4) {
    return;
  }
  
  // Look for more oak logs nearby
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, 10);
  
  if (oakLogsNearby.length > 0) {
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 20 });
  } else {
    // If no oak logs nearby, check if we can find more trees
    const survey = ctx.state.survey;
    if (survey.oak_log > 0) {
      // Try to find oak logs in the survey area
      const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
      if (oakLogBlock) {
        await helpers.goto(bot, oakLogBlock.position.x, oakLogBlock.position.y, oakLogBlock.position.z, 2);
        await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
      }
    }
  }
  
  // Check if we have enough logs now
  const newOakLogs = helpers.count(bot, 'oak_log');
  if (newOakLogs < 4) {
    throw new Error(`Failed to collect enough oak logs. Have ${newOakLogs}, need at least 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.has(bot, 'crafting_table');
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 4 && (craftingTable || woodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      crafting_table: craftingTable,
      wooden_pickaxe: woodenPickaxe
    }
  };
};
