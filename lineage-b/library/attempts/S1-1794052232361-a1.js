// skill: gatherWoodForTools
// stage: S1
// purpose: Collect oak logs to build a crafting table and ensure at least 10 logs for the crafting table
// postconditions: Have at least 10 oak logs for crafting table and have a crafting table in inventory or nearby
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 10) {
    return;
  }
  
  // Collect the remaining oak logs needed
  const neededLogs = 10 - oakLogs;
  await helpers.collect(bot, 'oak_log', neededLogs, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const finalLogs = helpers.count(bot, 'oak_log');
  if (finalLogs < 10) {
    throw new Error(`Failed to collect enough oak logs. Have ${finalLogs}, need 10`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
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
