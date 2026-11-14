// skill: gatherWoodForTools
// stage: S1
// purpose: Gather enough oak logs to build a crafting table
// postconditions: Have enough oak logs in inventory to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 4) {
    return;
  }
  
  // Find and collect more oak logs
  const logs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (logs.length === 0) {
    throw new Error("No oak logs found within 30 blocks");
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const newOakLogs = helpers.count(bot, 'oak_log');
  if (newOakLogs < 4) {
    throw new Error(`Only collected ${newOakLogs} oak logs, need at least 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 4 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};
