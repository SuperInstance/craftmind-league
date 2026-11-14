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
  
  // Since previous attempts failed due to goto timeouts, let's try a different approach
  // Look for oak logs in a specific direction from the anchor
  const searchDirection = { x: 1, z: 0 }; // Search east from anchor
  const searchDistance = 50;
  
  // Try to find oak logs in the search area
  const oakLogs = helpers.findBlocks(bot, 'oak_log', searchDistance, 10);
  
  if (oakLogs.length === 0) {
    // If no oak logs found nearby, try a different search pattern
    // Search in multiple directions from anchor
    const directions = [
      { x: 1, z: 0 },   // East
      { x: -1, z: 0 },  // West
      { x: 0, z: 1 },   // South
      { x: 0, z: -1 }   // North
    ];
    
    let foundLogs = false;
    for (const dir of directions) {
      const targetX = ctx.anchor.x + dir.x * searchDistance;
      const targetZ = ctx.anchor.z + dir.z * searchDistance;
      
      // Move to search location
      try {
        await helpers.goto(bot, targetX, ctx.anchor.y, targetZ, 5);
        
        // Look for oak logs at this location
        const logs = helpers.findBlocks(bot, 'oak_log', 20, 5);
        if (logs.length > 0) {
          await helpers.collect(bot, 'oak_log', 4, { maxDistance: 20 });
          foundLogs = true;
          break;
        }
      } catch (err) {
        // Continue to next direction if this one fails
        continue;
      }
    }
    
    if (!foundLogs) {
      throw new Error('No oak logs found within search area');
    }
  } else {
    // Collect oak logs from the nearby area
    await helpers.collect(bot, 'oak_log', 4, { maxDistance: searchDistance });
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