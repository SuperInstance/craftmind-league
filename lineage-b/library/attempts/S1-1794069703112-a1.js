// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough materials for crafting a crafting table
// postconditions: Have at least 4 oak logs in inventory for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 4) {
    throw new Error('Already have enough oak logs for crafting table');
  }
  
  // Find nearby oak logs
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLogBlock) {
    throw new Error('No oak logs found within 30 blocks');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 4 - oakLogs, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const finalLogs = helpers.count(bot, 'oak_log');
  if (finalLogs < 4) {
    throw new Error(`Only collected ${finalLogs} oak logs, need 4`);
  }
  
  bot.chat('Collected enough oak logs for crafting table');
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.has(bot, 'crafting_table', 1);
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: oakLogs >= 4 && (craftingTable || woodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      crafting_table: craftingTable,
      wooden_pickaxe: woodenPickaxe
    }
  };
};