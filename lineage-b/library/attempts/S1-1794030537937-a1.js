// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to target coordinates to gather wood and craft tools
// postconditions: Crafting table carried or placed within 20 blocks AND wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough wood logs
  if (!helpers.has(bot, 'oak_log', 1) && !helpers.has(bot, 'birch_log', 1)) {
    // Navigate to target coordinates
    await helpers.goto(bot, 21, 69, -105, 5);
    
    // Collect wood logs
    const logs = helpers.findBlocks(bot, 'oak_log', 20);
    if (logs.length === 0) {
      const birchLogs = helpers.findBlocks(bot, 'birch_log', 20);
      if (birchLogs.length === 0) {
        throw new Error('No wood logs found at target coordinates');
      }
      await helpers.collect(bot, 'birch_log', 1, { maxDistance: 20 });
    } else {
      await helpers.collect(bot, 'oak_log', 1, { maxDistance: 20 });
    }
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Place the crafting table
  await helpers.placeAt(bot, 'crafting_table', bot.entity.position.x, bot.entity.position.y, bot.entity.position.z);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have the required items
  if (!helpers.has(bot, 'crafting_table', 1) && !helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft required items');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (craftingTableNearby !== null || helpers.has(bot, 'crafting_table', 1)) && hasPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasPickaxe: hasPickaxe,
      craftingTableInInventory: helpers.has(bot, 'crafting_table', 1),
      pickaxeInInventory: helpers.has(bot, 'wooden_pickaxe', 1)
    }
  };
};
