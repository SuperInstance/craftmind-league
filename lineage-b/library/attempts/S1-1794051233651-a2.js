// skill: gatherWoodForTools
// stage: S1
// purpose: Gather enough oak logs to build a crafting table and wooden pickaxe
// postconditions: Have 5 oak logs for crafting table and 4 more for wooden pickaxe (9 total), plus crafting table placed or carried
module.exports = async (bot, helpers, ctx) => {
  // Go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const neededLogs = 9; // 5 for crafting table + 4 for wooden pickaxe
  
  if (oakLogs >= neededLogs) {
    return;
  }
  
  // Find more oak logs
  const logs = helpers.findBlocks(bot, 'oak_log', 30, neededLogs - oakLogs);
  if (logs.length === 0) {
    throw new Error("No oak logs found within 30 blocks");
  }
  
  // Collect the required logs
  await helpers.collect(bot, 'oak_log', neededLogs - oakLogs, { maxDistance: 30 });
  
  // Verify we have enough logs
  const logsAfter = helpers.count(bot, 'oak_log');
  if (logsAfter < neededLogs) {
    throw new Error(`Only collected ${logsAfter} oak logs, needed ${neededLogs}`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 9 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      crafting_table: hasCraftingTable,
      wooden_pickaxe: hasWoodenPickaxe
    }
  };
};