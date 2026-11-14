// skill: gatherWoodForTools
// stage: S1
// purpose: Gather enough oak logs to build a crafting table
// postconditions: Have enough oak logs to craft a crafting table (5 logs) and a wooden pickaxe (1 log for handle + 3 logs for head)
module.exports = async (bot, helpers, ctx) => {
  // First, check if we already have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 5) {
    return;
  }

  // Go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Find and collect oak logs
  const logs = helpers.findBlocks(bot, 'oak_log', 30, 5);
  if (logs.length === 0) {
    throw new Error("No oak logs found within 30 blocks");
  }
  
  // Collect the logs
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 30 });
  
  // Verify we have enough logs
  const logsAfter = helpers.count(bot, 'oak_log');
  if (logsAfter < 5) {
    throw new Error(`Only collected ${logsAfter} oak logs, needed 5`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 5 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      crafting_table: hasCraftingTable,
      wooden_pickaxe: hasWoodenPickaxe
    }
  };
};
