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
  
  // Check if we're already at the target location
  const targetPos = helpers.v3(69, 67, -80);
  const targetDist = bot.entity.position.distanceTo(targetPos);
  
  // If we're already near the target, try to collect logs directly
  if (targetDist < 10) {
    await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
  } else {
    // Try to find oak logs nearby first
    const logBlock = bot.findBlock({
      matching: (block) => block.name === 'oak_log',
      maxDistance: 30
    });
    
    if (logBlock) {
      // Go to the nearest oak log
      await helpers.goto(bot, logBlock.position.x, logBlock.position.y, logBlock.position.z, 3);
      // Collect logs from this area
      await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
    } else {
      // If no logs found nearby, try to go to the target position
      // Make sure we're not stuck in high ground by checking and digging below
      const groundBelow = bot.blockAt(bot.entity.position.offset(0, -1, 0));
      if (groundBelow && groundBelow.name === 'air') {
        // We're floating, dig the block below us
        await bot.dig(groundBelow);
      }
      
      // Try to go to the target position with a more robust approach
      // Check if we can see the target from our current position
      const pathToTarget = [];
      const startX = Math.floor(bot.entity.position.x);
      const startZ = Math.floor(bot.entity.position.z);
      const targetX = 69;
      const targetZ = -80;
      
      // Simple pathfinding: move towards target in chunks
      let currentX = startX;
      let currentZ = startZ;
      const stepSize = 5;
      
      while (Math.abs(currentX - targetX) > stepSize || Math.abs(currentZ - targetZ) > stepSize) {
        if (Math.abs(currentX - targetX) > stepSize) {
          currentX += (targetX > currentX) ? stepSize : -stepSize;
        }
        if (Math.abs(currentZ - targetZ) > stepSize) {
          currentZ += (targetZ > currentZ) ? stepSize : -stepSize;
        }
        
        // Check if this point is walkable
        const checkBlock = bot.blockAt(helpers.v3(currentX, bot.entity.position.y, currentZ));
        const checkBlockBelow = bot.blockAt(helpers.v3(currentX, bot.entity.position.y - 1, currentZ));
        
        if (checkBlock && checkBlock.name !== 'air' && checkBlockBelow && checkBlockBelow.name !== 'air') {
          // This point is not walkable, adjust
          if (Math.abs(currentX - targetX) > stepSize) {
            currentX += (targetX > currentX) ? -stepSize : stepSize;
          }
          if (Math.abs(currentZ - targetZ) > stepSize) {
            currentZ += (targetZ > currentZ) ? -stepSize : stepSize;
          }
        }
        
        pathToTarget.push(helpers.v3(currentX, bot.entity.position.y, currentZ));
      }
      
      // Add final target
      pathToTarget.push(targetPos);
      
      // Navigate through each point in the path
      for (const point of pathToTarget) {
        await helpers.goto(bot, point.x, point.y, point.z, 3);
        
        // After each move, check if we're close enough to collect
        const dist = bot.entity.position.distanceTo(targetPos);
        if (dist < 10) {
          await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
          break;
        }
      }
      
      // If we haven't collected yet, try one more direct approach
      if (helpers.count(bot, 'oak_log') < 5) {
        await helpers.goto(bot, 69, 67, -80, 3);
        await helpers.collect(bot, 'oak_log', 5, { maxDistance: 10 });
      }
    }
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