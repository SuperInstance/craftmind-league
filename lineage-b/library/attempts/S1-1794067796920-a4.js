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
  
  // Since previous goto attempts failed, let's try a more robust approach
  // Find oak logs in the survey area
  const survey = ctx.state.survey;
  if (survey.oak_log > 0) {
    // Try to find a path to a position with oak logs
    // We'll use a simpler approach: go to a known good location in the area
    // First, let's find a walkable position near the anchor that's likely to have oak logs
    const targetX = ctx.anchor.x + 10;
    const targetZ = ctx.anchor.z - 10;
    const targetY = groundHeight(bot, targetX, targetZ, ctx.anchor.y);
    
    // Ensure we can walk to this position
    const blockBelow = bot.blockAt(v3(targetX, targetY - 1, targetZ));
    if (blockBelow && blockBelow.name !== 'air') {
      // Move to this position
      await helpers.goto(bot, targetX, targetY, targetZ, 5);
    } else {
      // If we can't walk to this position, try to find a nearby walkable block
      const walkableBlock = bot.findBlock({
        matching: block => block.name !== 'air',
        maxDistance: 10,
        point: v3(targetX, targetY - 1, targetZ)
      });
      
      if (walkableBlock) {
        await helpers.goto(bot, walkableBlock.position.x, walkableBlock.position.y, walkableBlock.position.z, 5);
      } else {
        // If no walkable block, try a different approach - go to a nearby walkable position
        await helpers.goto(bot, ctx.anchor.x + 5, ctx.anchor.y, ctx.anchor.z - 5, 5);
      }
    }
    
    // Now collect oak logs
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  } else {
    throw new Error('No oak logs available in the area according to survey');
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