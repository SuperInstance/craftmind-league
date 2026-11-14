// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and birch logs to craft wooden tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Collect oak logs
  const oakLogs = await helpers.findBlocks(bot, 'oak_log', 30, 5);
  if (oakLogs.length < 5) {
    throw new Error(`Failed to find enough oak logs. Found ${oakLogs.length}, needed 5`);
  }
  
  // Collect birch logs
  const birchLogs = await helpers.findBlocks(bot, 'birch_log', 30, 5);
  if (birchLogs.length < 5) {
    throw new Error(`Failed to find enough birch logs. Found ${birchLogs.length}, needed 5`);
  }
  
  // Collect logs to inventory
  await helpers.collect(bot, 'oak_log', 5);
  await helpers.collect(bot, 'birch_log', 5);
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify crafting table is in inventory or nearby
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const craftingTableNearby = await helpers.findBlock(bot, 'crafting_table', 20);
  
  if (!craftingTableInInventory && !craftingTableNearby) {
    throw new Error('Crafting table not found in inventory or nearby');
  }
  
  // Verify wooden pickaxe is in inventory
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Wooden pickaxe not found in inventory');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const craftingTableNearby = await helpers.findBlock(bot, 'crafting_table', 20);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (craftingTableInInventory || craftingTableNearby) && hasPickaxe,
    evidence: {
      craftingTableInInventory,
      craftingTableNearby: !!craftingTableNearby,
      hasPickaxe
    }
  };
};