// skill: gatherWoodForTools
// stage: S1
// purpose: Collect at least 5 oak logs from the designated location
// postconditions: Have at least 5 oak logs in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we're at the anchor
  const anchorDistance = bot.entity.position.distanceTo(v3(ctx.anchor.x, ctx.anchor.y, ctx.anchor.z));
  if (anchorDistance > 5) {
    throw new Error(`Failed to return to anchor. Distance: ${anchorDistance}`);
  }
  
  // Navigate to the oak log gathering location
  await helpers.goto(bot, 69, 67, -80, 3);
  
  // Verify we're at the target location
  const targetDistance = bot.entity.position.distanceTo(v3(69, 67, -80));
  if (targetDistance > 3) {
    throw new Error(`Failed to reach oak log gathering location. Distance: ${targetDistance}`);
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  
  // Verify we have enough oak logs
  const oakLogCount = helpers.count(bot, 'oak_log');
  if (oakLogCount < 5) {
    throw new Error(`Failed to collect enough oak logs. Got ${oakLogCount}, needed 5`);
  }
  
  bot.chat("Collected 5 oak logs for tool crafting");
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogCount = helpers.count(bot, 'oak_log');
  const hasCraftingTable = helpers.has(bot, 'crafting_table') || 
    helpers.findBlock(bot, 'crafting_table', 20) !== null;
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  return {
    ok: oakLogCount >= 5 && (hasCraftingTable || hasWoodenPickaxe),
    evidence: {
      oakLogCount,
      hasCraftingTable,
      hasWoodenPickaxe
    }
  };
};
