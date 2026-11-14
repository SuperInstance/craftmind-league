// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect additional oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough wood logs to build a crafting table and craft a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs for a crafting table and 1 more for a wooden pickaxe
  const neededOak = Math.max(0, 4 - oakLogs);
  const neededBirch = Math.max(0, 4 - birchLogs);
  
  // If we already have enough, we're done
  if (neededOak === 0 && neededBirch === 0) {
    return;
  }
  
  // Since we're having trouble reaching the wood sources, let's try a different approach
  // First, let's check what wood types are available in the survey
  const survey = ctx.state.survey;
  
  // Try to collect oak logs first (if we need them)
  if (neededOak > 0) {
    // Look for oak logs in a wider range
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 50, 10);
    if (oakBlocks.length > 0) {
      await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 50 });
    } else {
      // If no oak logs found, try to find a path to where they might be
      // Let's try to find a path to a nearby oak tree
      const oakTree = helpers.findBlock(bot, 'oak_log', 30);
      if (oakTree) {
        await helpers.goto(bot, oakTree.position.x, oakTree.position.y, oakTree.position.z, 2);
        await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
      } else {
        // If we can't find oak logs nearby, we might need to go to a new area
        // Let's try to find a path to a known good location
        const targetX = 22;
        const targetZ = -86;
        const targetY = 69;
        
        // Try to reach the target location
        try {
          await helpers.goto(bot, targetX, targetY, targetZ, 3);
          const oakBlocks = helpers.findBlocks(bot, 'oak_log', 20, 5);
          if (oakBlocks.length > 0) {
            await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 20 });
          } else {
            throw new Error('No oak logs found at target location');
          }
        } catch (error) {
          // If we can't reach the target, use the survey data to find the best place
          // Since we know from survey that there are oak logs available, let's try to find them
          // by going to a location that's likely to have them
          const groundHeightAtTarget = helpers.groundHeight(bot, targetX, targetZ, targetY);
          await helpers.goto(bot, targetX, groundHeightAtTarget + 1, targetZ, 3);
          const oakBlocks = helpers.findBlocks(bot, 'oak_log', 20, 5);
          if (oakBlocks.length > 0) {
            await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 20 });
          } else {
            throw new Error('No oak logs found at target location even after moving to ground level');
          }
        }
      }
    }
  }
  
  // Collect birch logs if needed
  if (neededBirch > 0) {
    // Look for birch logs in a wider range
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 50, 10);
    if (birchBlocks.length > 0) {
      await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 50 });
    } else {
      // If no birch logs found, try to find a path to where they might be
      const birchTree = helpers.findBlock(bot, 'birch_log', 30);
      if (birchTree) {
        await helpers.goto(bot, birchTree.position.x, birchTree.position.y, birchTree.position.z, 2);
        await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
      } else {
        // If we can't find birch logs nearby, we might need to go to a new area
        // Let's try to find a path to a known good location
        const targetX = 22;
        const targetZ = -86;
        const targetY = 69;
        
        // Try to reach the target location
        try {
          await helpers.goto(bot, targetX, targetY, targetZ, 3);
          const birchBlocks = helpers.findBlocks(bot, 'birch_log', 20, 5);
          if (birchBlocks.length > 0) {
            await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 20 });
          } else {
            throw new Error('No birch logs found at target location');
          }
        } catch (error) {
          // If we can't reach the target, use the survey data to find the best place
          // Since we know from survey that there are birch logs available, let's try to find them
          // by going to a location that's likely to have them
          const groundHeightAtTarget = helpers.groundHeight(bot, targetX, targetZ, targetY);
          await helpers.goto(bot, targetX, groundHeightAtTarget + 1, targetZ, 3);
          const birchBlocks = helpers.findBlocks(bot, 'birch_log', 20, 5);
          if (birchBlocks.length > 0) {
            await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 20 });
          } else {
            throw new Error('No