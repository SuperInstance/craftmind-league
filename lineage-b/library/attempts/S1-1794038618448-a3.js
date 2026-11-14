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
  
  // Since previous goto failed, let's try a more robust approach to reach the target
  // First, check if we can see the target location
  const targetPos = helpers.v3(69, 67, -80);
  const targetBlock = bot.blockAt(targetPos);
  
  // If we're already at the target location, proceed to collect
  const targetDist = bot.entity.position.distanceTo(targetPos);
  if (targetDist < 5) {
    // We're already near the target, try to collect
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  } else {
    // Try to find a path to the target location
    // First, check if there's a clear path by looking at blocks around the target
    const logBlock = bot.findBlock({
      matching: (block) => block.name === 'oak_log',
      maxDistance: 20
    });
    
    if (logBlock) {
      // If we can find oak logs nearby, go to them
      await helpers.goto(bot, logBlock.position.x, logBlock.position.y, logBlock.position.z, 3);
    } else {
      // If no logs found nearby, try to go to the target position
      // But first, let's make sure we're not stuck in a tree or high ground
      const groundBelow = bot.blockAt(bot.entity.position.offset(0, -1, 0));
      if (groundBelow && groundBelow.name === 'air') {
        // We're floating, dig the block below us
        await bot.dig(groundBelow);
      }
      
      // Now try to go to the target
      await helpers.goto(bot, 69, 67, -80, 3);
    }
    
    // After reaching the area, collect the logs
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  }
  
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