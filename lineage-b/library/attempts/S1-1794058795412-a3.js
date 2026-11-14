// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using available oak and birch logs and craft a wooden pickaxe
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
  
  // Craft 4 planks from logs first (use oak logs if available, otherwise birch)
  const logsToUse = oakLogs >= 4 ? 'oak_log' : 'birch_log';
  const planksToCraft = logsToUse === 'oak_log' ? 'oak_planks' : 'birch_planks';
  
  // Craft 4 planks from 4 logs
  await helpers.craft(bot, planksToCraft, 4);
  
  // Craft the crafting table from 4 planks
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