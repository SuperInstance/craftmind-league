// skill: gatherWoodForTools
// stage: S1
// purpose: Navigate to oak log location and gather 5 oak logs for crafting tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  let logsNeeded = 5 - helpers.count(bot, 'oak_log');
  if (logsNeeded > 0) {
    // Navigate to the target location
    await helpers.goto(bot, 69, 67, -80, 5);
    
    // Check if we're at the right location
    const pos = bot.entity.position;
    if (Math.abs(pos.x - 69) > 5 || Math.abs(pos.z - (-80)) > 5) {
      throw new Error('Failed to reach target location 69,67,-80');
    }
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 10 });
  }
  
  // Verify we have the required logs
  if (helpers.count(bot, 'oak_log') < 5) {
    throw new Error(`Only collected ${helpers.count(bot, 'oak_log')} oak logs, needed 5`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  bot.chat("Collected 5 oak logs and crafted tools");
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