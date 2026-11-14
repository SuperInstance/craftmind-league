// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough wood logs to build a crafting table and craft a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 oak logs or birch logs to make a crafting table
  if (oakLogs >= 4 || birchLogs >= 4) {
    return;
  }
  
  // If we don't have enough, collect more logs
  // Let's try to find logs nearby first
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, 10);
  const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 20, 10);
  
  // Collect logs from nearby locations
  if (oakLogsNearby.length > 0) {
    await helpers.collect(bot, 'oak_log', 10);
  } else if (birchLogsNearby.length > 0) {
    await helpers.collect(bot, 'birch_log', 10);
  } else {
    // If no logs found nearby, we need to go find them
    // Try to find logs in a wider area but with a reasonable distance
    const oakLogsInArea = helpers.findBlocks(bot, 'oak_log', 50, 10);
    const birchLogsInArea = helpers.findBlocks(bot, 'birch_log', 50, 10);
    
    if (oakLogsInArea.length > 0) {
      await helpers.goto(bot, oakLogsInArea[0].x, oakLogsInArea[0].y, oakLogsInArea[0].z, 2);
      await helpers.collect(bot, 'oak_log', 10);
    } else if (birchLogsInArea.length > 0) {
      await helpers.goto(bot, birchLogsInArea[0].x, birchLogsInArea[0].y, birchLogsInArea[0].z, 2);
      await helpers.collect(bot, 'birch_log', 10);
    } else {
      // If we can't find logs, we should try to find a tree to chop down
      // Let's find some trees
      const trees = helpers.findBlocks(bot, 'oak_log', 50, 10);
      if (trees.length > 0) {
        await helpers.goto(bot, trees[0].x, trees[0].y, trees[0].z, 2);
        // We'll need to dig the tree down to get logs
        // But we need to be careful not to dig too far
        await helpers.dig(bot, trees[0]);
      } else {
        // If no trees found, we'll need to go to a different area
        // For now, let's just try to collect what we can from our current area
        await helpers.collect(bot, 'oak_log', 5);
        await helpers.collect(bot, 'birch_log', 5);
      }
    }
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: (oakLogs >= 4 || birchLogs >= 4) && (craftingTable > 0 || woodenPickaxe > 0),
    evidence: {
      oakLogs: oakLogs,
      birchLogs: birchLogs,
      craftingTable: craftingTable,
      woodenPickaxe: woodenPickaxe
    }
  };
};