// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 30 oak logs from location 69,67,-80 for crafting wooden tools
// postconditions: Have 30 oak logs in inventory and a crafting table or wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we're at the anchor
  const anchorDist = bot.entity.position.distanceTo(helpers.v3(ctx.anchor.x, ctx.anchor.y, ctx.anchor.z));
  if (anchorDist > 5) {
    throw new Error(`Failed to return to anchor, distance: ${anchorDist}`);
  }
  
  // Navigate to oak log location at 69,67,-80
  const targetPos = helpers.v3(69, 67, -80);
  
  // Use a more robust approach - go to a nearby safe position first, then to target
  const safePos = helpers.v3(69, 67, -80);
  
  // Check if we're already at or near the target
  const currentPos = bot.entity.position;
  const distanceToTarget = currentPos.distanceTo(targetPos);
  
  if (distanceToTarget > 5) {
    // Move to the target location
    await helpers.goto(bot, 69, 67, -80, 3);
    
    // Verify we made it to the target
    const newDist = bot.entity.position.distanceTo(targetPos);
    if (newDist > 5) {
      throw new Error(`Failed to reach oak log location, distance: ${newDist}`);
    }
  }
  
  // Collect 30 oak logs
  await helpers.collect(bot, 'oak_log', 30, { maxDistance: 10 });
  
  // Verify we have the required logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 30) {
    throw new Error(`Failed to collect enough oak logs. Got ${oakLogs}, needed 30`);
  }
  
  bot.chat("Collected 30 oak logs for tools");
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogs >= 30 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oak_logs_collected: oakLogs,
      has_crafting_table: hasCraftingTable,
      has_wooden_pickaxe: hasWoodenPickaxe
    }
  };
};