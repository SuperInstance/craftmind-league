// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to oak log location and gather 5 oak logs
// postconditions: 5 oak logs in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we have enough oak logs at anchor
  if (helpers.count(bot, 'oak_log') < 5) {
    // Navigate to the target location
    await helpers.goto(bot, 69, 67, -80, 5);
    
    // Check if we're at the right location
    const pos = bot.entity.position;
    if (Math.abs(pos.x - 69) > 5 || Math.abs(pos.z - (-80)) > 5) {
      throw new Error('Failed to reach target location 69,67,-80');
    }
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  }
  
  // Verify we have the required logs
  if (helpers.count(bot, 'oak_log') < 5) {
    throw new Error(`Only collected ${helpers.count(bot, 'oak_log')} oak logs, needed 5`);
  }
  
  bot.chat("Collected 5 oak logs for tool crafting");
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 5 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};
