// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 4 oak logs from the surrounding area
// postconditions: Have 4 oak logs in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 4)) {
    return;
  }
  
  // Find oak logs nearby using a larger search radius
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 4);
  
  if (oakLogs.length < 4) {
    throw new Error(`Not enough oak logs: found ${oakLogs.length}, need 4`);
  }
  
  // Collect the oak logs one by one to ensure we get them
  for (let i = 0; i < 4; i++) {
    const log = oakLogs[i];
    await helpers.goto(bot, log.x, log.y, log.z, 1);
    await bot.dig(bot.blockAt(v3(log.x, log.y, log.z)));
  }
  
  // Verify we have the required number
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error(`Failed to collect enough oak logs: have ${helpers.count(bot, 'oak_log')}, need 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.findBlock(bot, 'crafting_table', 20) !== null;
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