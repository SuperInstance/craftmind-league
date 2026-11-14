// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 5 oak logs from location 69,67,-80 for tool crafting
// postconditions: Inventory contains 5 oak logs and either a crafting table or wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right area
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we're at the anchor
  const anchorDist = bot.entity.position.distanceTo(helpers.v3(ctx.anchor.x, ctx.anchor.y, ctx.anchor.z));
  if (anchorDist > 5) {
    throw new Error(`Failed to return to anchor, distance: ${anchorDist}`);
  }
  
  // Navigate to the oak log gathering location
  await helpers.goto(bot, 69, 67, -80, 3);
  
  // Check if we're at the correct location
  const targetDist = bot.entity.position.distanceTo(helpers.v3(69, 67, -80));
  if (targetDist > 5) {
    throw new Error(`Failed to reach oak log location, distance: ${targetDist}`);
  }
  
  // Collect 5 oak logs
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  
  // Verify we have the required logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 5) {
    throw new Error(`Failed to collect enough oak logs. Got ${oakLogs}, needed 5`);
  }
  
  // Send progress update
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
      oak_logs_collected: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};