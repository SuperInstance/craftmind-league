// skill: gatherWoodForTools
// stage: S1
// purpose: Collect enough oak logs to build a crafting table and craft a wooden pickaxe
// postconditions: Have enough oak logs in inventory to craft a crafting table and have a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory for oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  
  // If we don't have enough logs, collect more
  if (oakLogs < 10) {
    const logsToCollect = 10 - oakLogs;
    await helpers.collect(bot, 'oak_log', logsToCollect, { maxDistance: 30 });
    
    // Verify we have enough logs
    const finalCount = helpers.count(bot, 'oak_log');
    if (finalCount < 10) {
      throw new Error(`Only collected ${finalCount} oak logs, need at least 10`);
    }
  }
  
  // Now craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (error) {
    throw new Error("Failed to craft crafting table");
  }
  
  // Now craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (error) {
    throw new Error("Failed to craft wooden pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    (helpers.findBlock(bot, 'crafting_table', 20) !== null);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 10 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};