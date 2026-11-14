// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and birch logs to craft wooden tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // Collect more logs if needed
  if (oakLogs < 10 || birchLogs < 10) {
    // Collect oak logs first
    if (oakLogs < 10) {
      const logsToCollect = 10 - oakLogs;
      await helpers.collect(bot, 'oak_log', logsToCollect, { tools: ['wooden_pickaxe'] });
    }
    
    // Collect birch logs
    if (birchLogs < 10) {
      const logsToCollect = 10 - birchLogs;
      await helpers.collect(bot, 'birch_log', logsToCollect, { tools: ['wooden_pickaxe'] });
    }
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if crafting table is in inventory
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if wooden pickaxe is in inventory
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Place crafting table near the anchor
  const craftingTablePos = ctx.anchor;
  await helpers.placeAt(bot, 'crafting_table', craftingTablePos.x, craftingTablePos.y, craftingTablePos.z);
  
  // Verify crafting table is placed
  const craftingTableBlock = bot.blockAt(v3(craftingTablePos.x, craftingTablePos.y, craftingTablePos.z));
  if (craftingTableBlock.name !== 'crafting_table') {
    throw new Error('Failed to place crafting table');
  }
  
  // Verify we have both items
  if (!helpers.has(bot, 'crafting_table', 1) || !helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Missing required items after crafting');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const woodenPickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null;
  
  return {
    ok: (craftingTableInInventory || craftingTableNearby) && woodenPickaxeInInventory,
    evidence: {
      craftingTableInInventory,
      woodenPickaxeInInventory,
      craftingTableNearby,
      craftingTableBlock: craftingTableNearby ? helpers.findBlock(bot, 'crafting_table', 20).name : null
    }
  };
};