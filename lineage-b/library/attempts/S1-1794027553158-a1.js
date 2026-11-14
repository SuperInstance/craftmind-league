// skill: gatherWoodForTools
// stage: S1
// purpose: Collect 5 oak logs and 5 birch logs to craft wooden tools
// postconditions: Inventory contains a wooden pickaxe and a crafting table within 20 blocks
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  if (!helpers.has(bot, 'oak_log', 5)) {
    // Find oak logs
    const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 5);
    if (oakLogs.length < 5) {
      throw new Error(`Not enough oak logs found. Found ${oakLogs.length}, need 5`);
    }
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  }
  
  if (!helpers.has(bot, 'birch_log', 5)) {
    // Find birch logs
    const birchLogs = helpers.findBlocks(bot, 'birch_log', 30, 5);
    if (birchLogs.length < 5) {
      throw new Error(`Not enough birch logs found. Found ${birchLogs.length}, need 5`);
    }
    // Collect birch logs
    await helpers.collect(bot, 'birch_log', 5, { maxDistance: 30 });
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have the required items
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTable: hasCraftingTable,
      woodenPickaxe: hasWoodenPickaxe
    }
  };
};