// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough materials for crafting a crafting table
// postconditions: Have at least 4 oak logs in inventory for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  if (helpers.has(bot, 'oak_log', 4)) {
    return;
  }
  
  // Instead of trying to find logs in a specific direction, let's use the survey data
  // The survey shows there are 30 oak logs nearby, so we should be able to find them
  const logs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  
  if (logs.length === 0) {
    // If we can't find logs nearby, try to go to a known good location
    // Based on the survey data, we know oak logs are available
    // Let's try to go to a nearby position where logs might be
    const targetX = ctx.anchor.x + 10;
    const targetZ = ctx.anchor.z;
    
    try {
      await helpers.goto(bot, targetX, ctx.anchor.y, targetZ, 5);
      
      // Try to collect oak logs from this location
      await helpers.collect(bot, 'oak_log', 4, { maxDistance: 20 });
    } catch (err) {
      // If that fails, try another nearby location
      const targetX2 = ctx.anchor.x - 10;
      const targetZ2 = ctx.anchor.z;
      
      await helpers.goto(bot, targetX2, ctx.anchor.y, targetZ2, 5);
      await helpers.collect(bot, 'oak_log', 4, { maxDistance: 20 });
    }
  } else {
    // Collect oak logs from the nearby area
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
  }
  
  // Verify we have enough oak logs
  if (!helpers.has(bot, 'oak_log', 4)) {
    throw new Error('Failed to collect enough oak logs');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTables = helpers.count(bot, 'crafting_table');
  
  return {
    ok: oakLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      crafting_tables: craftingTables
    }
  };
};