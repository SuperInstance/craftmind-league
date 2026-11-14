// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 30 oak logs from location 69,67,-80 and return to anchor
// postconditions: Inventory contains 30 oak logs and bot is at anchor position
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  const anchor = ctx.anchor;
  const currentPos = bot.entity.position;
  const distanceToAnchor = currentPos.distanceTo(v3(anchor.x, anchor.y, anchor.z));
  
  if (distanceToAnchor > 5) {
    await helpers.gotoAnchor(bot, anchor);
  }
  
  // Navigate to oak log location
  const oakLogLocation = v3(69, 67, -80);
  await helpers.goto(bot, oakLogLocation.x, oakLogLocation.y, oakLogLocation.z, 2);
  
  // Collect 30 oak logs
  const collectedLogs = await helpers.collect(bot, 'oak_log', 30, { maxDistance: 30 });
  
  if (collectedLogs < 30) {
    throw new Error(`Failed to collect 30 oak logs, only collected ${collectedLogs}`);
  }
  
  // Return to anchor
  await helpers.gotoAnchor(bot, anchor);
};

module.exports.post = async (bot, helpers, ctx) => {
  const anchor = ctx.anchor;
  const currentPos = bot.entity.position;
  const distanceToAnchor = currentPos.distanceTo(v3(anchor.x, anchor.y, anchor.z));
  
  const inventoryOakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || helpers.findBlock(bot, 'crafting_table', 20);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: inventoryOakLogs >= 30 && distanceToAnchor <= 2 && hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      oak_logs_collected: inventoryOakLogs,
      distance_to_anchor: distanceToAnchor,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};
