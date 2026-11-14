// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak and birch logs to build a crafting table
// postconditions: Have enough wood logs to craft a crafting table and a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs already
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // If we already have enough logs, we're done
  if (oakLogs >= 4 && birchLogs >= 4) {
    return;
  }
  
  // Find nearby logs to collect
  const oakLogsNearby = helpers.findBlocks(bot, 'oak_log', 30, 10);
  const birchLogsNearby = helpers.findBlocks(bot, 'birch_log', 30, 10);
  
  // If we found logs nearby, collect them
  if (oakLogsNearby.length > 0 || birchLogsNearby.length > 0) {
    // Collect oak logs if needed
    if (oakLogs < 4) {
      const neededOak = 4 - oakLogs;
      await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
    }
    
    // Collect birch logs if needed
    if (birchLogs < 4) {
      const neededBirch = 4 - birchLogs;
      await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
    }
  } else {
    // If no logs found nearby, try to find a good location to gather logs
    // Look for a spot with good visibility and log density
    const logLocations = [];
    
    // Search for oak logs in a wider area
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 50, 20);
    for (const block of oakBlocks) {
      logLocations.push({ x: block.x, y: block.y, z: block.z, type: 'oak' });
    }
    
    // Search for birch logs in a wider area
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 50, 20);
    for (const block of birchBlocks) {
      logLocations.push({ x: block.x, y: block.y, z: block.z, type: 'birch' });
    }
    
    // If we found log locations, head to the nearest one
    if (logLocations.length > 0) {
      // Sort by distance from current position
      logLocations.sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.x - bot.entity.position.x, 2) +
          Math.pow(a.y - bot.entity.position.y, 2) +
          Math.pow(a.z - bot.entity.position.z, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.x - bot.entity.position.x, 2) +
          Math.pow(b.y - bot.entity.position.y, 2) +
          Math.pow(b.z - bot.entity.position.z, 2)
        );
        return distA - distB;
      });
      
      // Go to the nearest log location
      const nearestLog = logLocations[0];
      await helpers.goto(bot, nearestLog.x, nearestLog.y, nearestLog.z, 2);
      
      // Collect logs from that location
      if (nearestLog.type === 'oak') {
        await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
      } else {
        await helpers.collect(bot, 'birch_log', 4, { maxDistance: 30 });
      }
    } else {
      // If no logs found anywhere, try to find a good spot to gather logs
      // Try to find a good location to gather logs
      const goodSpot = await findGoodLogGatheringSpot(bot, helpers);
      if (goodSpot) {
        await helpers.goto(bot, goodSpot.x, goodSpot.y, goodSpot.z, 2);
        // Try to collect logs from this location
        await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
        await helpers.collect(bot, 'birch_log', 4, { maxDistance: 30 });
      } else {
        throw new Error('No good log gathering spots found');
      }
    }
  }
  
  // Verify we have enough logs now
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 4 || finalBirch < 4) {
    throw new Error(`Not enough wood logs collected. Have ${finalOak} oak logs and ${finalBirch} birch logs`);
  }
};

// Helper function to find a good log gathering spot
async function findGoodLogGatheringSpot(bot, helpers) {
  // Try to find a good spot near the anchor
  const anchor = ctx.anchor;
  const searchRadius = 50;
  
  // Look for a spot with good visibility and log density
  for (let x = anchor.x - searchRadius; x <= anchor.x + searchRadius; x += 10) {
    for (let z = anchor.z - searchRadius; z <= anchor.z + searchRadius; z += 10) {
      // Check if this spot is suitable
      const y = helpers.groundHeight(bot, x, z, anchor.y);
      
      // Ensure we're not too high or too low
      if (Math.abs(y - anchor.y) > 10) continue;
      
      // Check if there are logs nearby
      const logs = helpers.findBlocks(bot, 'oak_log', 10, 5);
      if (logs.length > 0) {
        return { x, y, z };
      }
      
      const birchLogs = helpers.findBlocks(bot, 'birch_log', 10, 5);
      if (birchLogs.length > 0) {
        return { x, y, z };
      }
    }
  }
  
  // If no good spots found, return null
  return null;
}

module.exports.post = async (bot, helpers, ctx) =>