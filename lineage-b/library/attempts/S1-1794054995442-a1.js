// skill: gatherWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to craft a crafting table and wooden tools
// postconditions: Have enough logs to craft a crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to craft a crafting table (4 oak logs or 4 birch logs)
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // If we don't have enough logs, collect more
  if (oakLogs < 4 && birchLogs < 4) {
    // Find more logs nearby
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
    const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 30, 10);
    
    // If there are logs nearby, collect them
    if (oakLogsNearby.length > 0) {
      await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
    } else if (birchLogsNearby.length > 0) {
      await helpers.collect(bot, 'birch_log', 10, { maxDistance: 30 });
    } else {
      // If no logs nearby, we need to find a new area
      // For now, just try to collect what we can find
      await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
      await helpers.collect(bot, 'birch_log', 10, { maxDistance: 30 });
    }
  }
  
  // Verify we have enough logs
  const newOakLogs = helpers.count(bot, 'oak_log');
  const newBirchLogs = helpers.count(bot, 'birch_log');
  
  if (newOakLogs < 4 && newBirchLogs < 4) {
    throw new Error(`Not enough logs to craft a crafting table. Have ${newOakLogs} oak logs and ${newBirchLogs} birch logs`);
  }
  
  // Craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (err) {
    throw new Error(`Failed to craft crafting table: ${err.message}`);
  }
  
  // Verify crafting table was crafted
  const craftingTables = helpers.count(bot, 'crafting_table');
  if (craftingTables < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (err) {
    throw new Error(`Failed to craft wooden pickaxe: ${err.message}`);
  }
  
  // Verify wooden pickaxe was crafted
  const woodenPickaxes = helpers.count(bot, 'wooden_pickaxe');
  if (woodenPickaxes < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTables = helpers.count(bot, 'crafting_table');
  const woodenPickaxes = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: craftingTables >= 1 && woodenPickaxes >= 1,
    evidence: {
      craftingTables: craftingTables,
      woodenPickaxes: woodenPickaxes
    }
  };
};