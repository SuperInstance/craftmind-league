// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to target location and gather wood for tools
// postconditions: Crafting table carried or placed within 20 blocks AND wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Navigate to target location at 21,69,-105
  await helpers.goto(bot, 21, 69, -105, 5);
  
  // Collect wood blocks - prefer oak_log since it's available
  const oakLogCount = helpers.count(bot, 'oak_log');
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  
  // Verify we collected some wood
  const newOakLogCount = helpers.count(bot, 'oak_log');
  if (newOakLogCount <= oakLogCount) {
    throw new Error('Failed to collect oak logs');
  }
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Place crafting table nearby
  const position = bot.entity.position;
  await helpers.placeAt(bot, 'crafting_table', position.x, position.y, position.z);
  
  // Verify crafting table is placed
  const craftingTable = helpers.findBlock(bot, 'crafting_table', 20);
  if (!craftingTable) {
    throw new Error('Failed to place crafting table within 20 blocks');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTableNearby && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby,
      hasWoodenPickaxe,
      inventory: helpers.inventoryList(bot)
    }
  };
};