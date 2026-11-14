// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to nearest oak tree cluster and collect at least 5 oak logs, then craft tools
// postconditions: Inventory contains at least 5 oak logs, crafting table is placed or carried, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 5)) {
    // If we have enough logs, proceed to crafting
    await helpers.craft(bot, 'crafting_table', 1);
    await helpers.craft(bot, 'wooden_pickaxe', 1);
    return;
  }
  
  // Find the nearest oak tree cluster by looking for oak logs nearby
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 5);
  if (oakLogs.length === 0) {
    // If no oak logs found nearby, try to find a tree block to chop
    const oakTree = helpers.findBlock(bot, 'oak_log', 30);
    if (!oakTree) {
      throw new Error('No oak trees found within 30 blocks');
    }
    
    // Dig the oak log block to get logs
    await bot.dig(oakTree);
    
    // Wait a bit for the block to drop
    await helpers.sleep(1000);
    
    // Collect the dropped logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  } else {
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  }
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 5)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.has(bot, 'crafting_table');
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 5 && craftingTable && woodenPickaxe,
    evidence: {
      oak_logs_collected: oakLogs,
      crafting_table_carried: craftingTable,
      wooden_pickaxe_carried: woodenPickaxe
    }
  };
};