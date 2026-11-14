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
        // Instead of goto, try a more robust approach
        // First, check if we're already close to the oak logs
        const distance = bot.entity.position.distanceTo(oakLogBlock.position);
        if (distance > 10) {
          // Try to find a path to the oak logs using a safer method
          // Move to a nearby position that's likely to be walkable
          const targetX = oakLogBlock.position.x;
          const targetZ = oakLogBlock.position.z;
          const targetY = oakLogBlock.position.y;
          
          // Move to a position near the oak logs but not directly on top of them
          await helpers.goto(bot, targetX, targetY, targetZ, 5);
          await helpers.collect(bot, 'oak_log', 10, { maxDistance: 50 });
        } else {
          // We're already close, just collect
          await helpers.collect(bot, 'oak_log', 10, { maxDistance: 50 });
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