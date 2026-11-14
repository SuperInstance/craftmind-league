// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak logs to build a crafting table
// postconditions: Have enough oak logs to craft a crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 10) {
    throw new Error(`Not enough oak logs in inventory. Found ${oakLogs}, need at least 10.`);
  }
  
  // Look for nearby oak logs first
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 20, 10);
  if (oakLogsNearby.length >= 10) {
    // Collect oak logs nearby
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 20 });
  } else {
    // If not enough logs nearby, look for trees and harvest them
    // First, find some oak trees nearby
    const trees = helpers.findBlocks(bot, 'oak_log', 30, 5);
    if (trees.length === 0) {
      throw new Error(`No oak trees found within 30 blocks.`);
    }
    
    // Harvest oak logs from trees
    for (let i = 0; i < 5; i++) {
      const tree = trees[i];
      if (!tree) break;
      
      // Harvest the tree by digging the log block
      try {
        await bot.dig(bot.blockAt(tree));
      } catch (err) {
        // If we can't dig the block, continue to next tree
        continue;
      }
      
      // Wait a bit for the block to be harvested
      await helpers.sleep(1000);
    }
    
    // Collect any newly dropped logs
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 20 });
  }
  
  // Verify we have enough logs now
  const logsAfterCollection = helpers.count(bot, 'oak_log');
  if (logsAfterCollection < 10) {
    throw new Error(`Failed to collect enough oak logs. Got ${logsAfterCollection}, need at least 10.`);
  }
  
  // Chat about progress
  bot.chat("Gathering oak logs for crafting table...");
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 10 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};
