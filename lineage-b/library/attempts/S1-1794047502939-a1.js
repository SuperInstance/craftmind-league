// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs to craft a crafting table
// postconditions: Crafting table is crafted and either carried or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs to craft a crafting table (4 logs)
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    // Find nearby oak trees and collect logs
    const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
    if (oakLogsNearby.length === 0) {
      throw new Error('No oak logs found nearby');
    }
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  const woodenPickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (woodenPickaxeCount < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = craftingTableNearby !== null || helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasCraftingTable: hasCraftingTable,
      hasWoodenPickaxe: hasWoodenPickaxe
    }
  };
};
