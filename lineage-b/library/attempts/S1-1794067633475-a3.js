// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to obtain the required 4 planks for building a crafting table
// postconditions: Have at least 4 oak planks available for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak planks
  if (helpers.has(bot, 'oak_planks', 4)) {
    return;
  }
  
  // Find oak logs nearby
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakLogs.length > 0) {
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  } else {
    // If no oak logs nearby, find a place with oak trees
    const survey = ctx.state.survey;
    if (survey.oak_log > 0) {
      // We know there are oak logs in the area, but not nearby
      // Try to find a path to where they are
      const oakLogBlock = helpers.findBlock(bot, 'oak_log', 50);
      if (oakLogBlock) {
        // Instead of direct goto which failed, use a more robust approach
        // Move to a nearby walkable position first
        const targetX = oakLogBlock.position.x;
        const targetZ = oakLogBlock.position.z;
        const targetY = oakLogBlock.position.y;
        
        // Find a walkable position near the oak logs
        const walkablePos = v3(targetX, targetY, targetZ);
        // Check if we can walk to this position
        const blockBelow = bot.blockAt(walkablePos.offset(0, -1, 0));
        if (blockBelow && blockBelow.name !== 'air') {
          // Try to go to a nearby position that's safe to walk to
          const safeX = Math.floor(targetX);
          const safeZ = Math.floor(targetZ);
          const safeY = targetY;
          
          // Move to a safe position nearby
          await helpers.goto(bot, safeX, safeY, safeZ, 5);
          await helpers.collect(bot, 'oak_log', 10, { maxDistance: 50 });
        } else {
          // If we can't walk to the exact position, try a different approach
          // Try to find a path to a nearby walkable block
          const nearbyWalkable = bot.findBlock({
            matching: block => block.name !== 'air',
            maxDistance: 10,
            point: oakLogBlock.position.offset(0, -1, 0)
          });
          
          if (nearbyWalkable) {
            await helpers.goto(bot, nearbyWalkable.position.x, nearbyWalkable.position.y, nearbyWalkable.position.z, 5);
            await helpers.collect(bot, 'oak_log', 10, { maxDistance: 50 });
          } else {
            // If no nearby walkable block, try to find a path to a different area
            // Try to go to a position that's known to be walkable
            await helpers.goto(bot, 81, 66, -104, 5);
            await helpers.collect(bot, 'oak_log', 10, { maxDistance: 50 });
          }
        }
      } else {
        throw new Error('No oak logs found in survey area');
      }
    } else {
      throw new Error('No oak logs available in the area');
    }
  }
  
  // Verify we have enough oak planks now
  if (!helpers.has(bot, 'oak_planks', 4)) {
    throw new Error('Failed to collect enough oak planks for crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const planks = helpers.count(bot, 'oak_planks');
  return {
    ok: planks >= 4,
    evidence: {
      oak_planks: planks
    }
  };
};