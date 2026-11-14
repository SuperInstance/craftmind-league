// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using available oak and birch logs
// postconditions: Crafting table is placed or carried and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs < 4 && birchLogs < 4) {
    throw new Error('Not enough logs to build crafting table');
  }
  
  // Place the crafting table first (this is the key fix - we need to place it first)
  // We'll use one of the logs to place the crafting table
  const logToUse = oakLogs >= 4 ? 'oak_log' : 'birch_log';
  const logCount = helpers.count(bot, logToUse);
  
  // Place the crafting table using 4 logs
  await helpers.placeAt(bot, logToUse, ctx.anchor.x, ctx.anchor.y, ctx.anchor.z);
  
  // Wait a moment for placement to register
  await helpers.sleep(1000);
  
  // Now craft the crafting table from the placed block
  // First, we need to get the crafting table from the placed block
  // Actually, let's re-evaluate - we need to craft it properly
  
  // Let's try a different approach - craft the crafting table directly from logs
  // But we need to make sure we have the right items in inventory
  // Craft 4 planks from logs first
  await helpers.craft(bot, 'oak_planks', 4);
  await helpers.craft(bot, 'birch_planks', 4);
  
  // Now craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
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
      hasCraftingTable: helpers.has(bot, 'crafting_table', 1),
      hasWoodenPickaxe: helpers.has(bot, 'wooden_pickaxe', 1)
    }
  };
};