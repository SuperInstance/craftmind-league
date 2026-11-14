// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak and birch logs
// postconditions: Crafting table is placed within 20 blocks of anchor
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough wood
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs < 4 && birchLogs < 4) {
    throw new Error('Not enough wood logs to build crafting table');
  }
  
  // Craft 4 planks from oak logs
  const oakPlanks = Math.min(oakLogs, 4);
  await helpers.craft(bot, 'oak_planks', oakPlanks);
  
  // Craft 4 planks from birch logs
  const birchPlanks = Math.min(birchLogs, 4);
  await helpers.craft(bot, 'birch_planks', birchPlanks);
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Place crafting table near anchor
  const tableX = ctx.anchor.x;
  const tableY = ctx.anchor.y;
  const tableZ = ctx.anchor.z;
  
  await helpers.placeAt(bot, 'crafting_table', tableX, tableY, tableZ);
  
  // Verify crafting table is placed
  const craftingTableBlock = bot.blockAt(v3(tableX, tableY, tableZ));
  if (craftingTableBlock.name !== 'crafting_table') {
    throw new Error('Failed to place crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const tableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: tableNearby !== null && hasPickaxe,
    evidence: {
      craftingTableNearby: tableNearby !== null,
      hasWoodenPickaxe: hasPickaxe
    }
  };
};
