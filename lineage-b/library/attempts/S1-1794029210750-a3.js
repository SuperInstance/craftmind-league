// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and birch logs to create wooden tools
// postconditions: Crafting table is carried or placed within 20 blocks AND wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  if (!helpers.has(bot, 'oak_log', 1) && !helpers.has(bot, 'birch_log', 1)) {
    // Find and collect logs
    const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
    const birchLogs = helpers.findBlocks(bot, 'birch_log', 30, 10);
    
    if (oakLogs.length > 0) {
      await helpers.collect(bot, 'oak_log', 1);
    } else if (birchLogs.length > 0) {
      await helpers.collect(bot, 'birch_log', 1);
    } else {
      throw new Error('No oak or birch logs found within 30 blocks');
    }
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Place the crafting table nearby
  const tablePos = bot.entity.position.offset(2, 0, 0);
  await helpers.placeAt(bot, 'crafting_table', tablePos.x, tablePos.y, tablePos.z);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify crafting table is placed or carried
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  
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
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const woodenPickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (craftingTableInInventory || craftingTableNearby) && woodenPickaxeInInventory,
    evidence: {
      craftingTableInInventory,
      craftingTableNearby: !!craftingTableNearby,
      woodenPickaxeInInventory
    }
  };
};