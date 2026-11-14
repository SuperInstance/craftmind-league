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
  
  if (oakLogs < 10 || birchLogs < 10) {
    // Collect more logs
    const logCount = Math.max(10 - oakLogs, 10 - birchLogs);
    await helpers.collect(bot, 'oak_log', logCount, { drop: false, tools: [] });
    await helpers.collect(bot, 'birch_log', logCount, { drop: false, tools: [] });
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTable: hasCraftingTable,
      woodenPickaxe: hasWoodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      birchLogs: helpers.count(bot, 'birch_log')
    }
  };
};
