```js
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
  
  // Since we're in the right location, try to collect logs directly
  // Collect oak logs if needed (need 4 total)
  if (oakLogs < 4) {
    const neededOak = 4 - oakLogs;
    await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
  }
  
  // Collect birch logs if needed (need 4 total)
  if (birchLogs < 4) {
    const neededBirch = 4 - birchLogs;
    await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
  }
  
  // If we still don't have enough logs, try to find logs in a wider area
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 4 || finalBirch < 4) {
    // Look for logs in a wider search area
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 50, 20);
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 50, 20);
    
    if (oakBlocks.length > 0 || birchBlocks.length > 0) {
      // Collect any remaining logs
      if (finalOak < 4) {
        const neededOak = 4 - finalOak;
        await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 50 });
      }
      
      if (finalBirch < 4) {
        const neededBirch = 4 - finalBirch;
        await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 50 });
      }
    } else {
      // If no logs found nearby, we need to search more systematically
      // Try to find a good location to gather logs
      const goodSpot = await findGoodLogGatheringSpot(bot, helpers);
      if (goodSpot) {
        await helpers.goto(bot, goodSpot.x, goodSpot.y, goodSpot.z, 2);
        // Collect logs from this location
        if (finalOak < 4) {
          const neededOak = 4 - finalOak;
          await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
        }
        if (finalBirch < 4) {
          const neededBirch = 4 - finalBirch;
          await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
        }
      } else {
        // If no good spot found, try to find a good area by scanning the world
        const survey = helpers.survey(bot);
        if (survey.oak_log > 0 || survey.birch_log > 0) {
          // We have logs in the survey, but not near us
          // Try to find a good gathering spot
          const anchor = ctx.anchor;
          const searchRadius = 50;
          
          // Look for a spot with good visibility and log density
          for (let x = anchor.x - searchRadius; x <= anchor.x + searchRadius; x += 10) {
            for (let z = anchor.z - searchRadius; z <= anchor.z + searchRadius; z += 10) {
              const y = helpers.groundHeight(bot, x, z, anchor.y);
              
              // Check if this spot is suitable
              if (Math.abs(y - anchor.y) > 10) continue;
              
              // Check if there are logs nearby
              const logs = helpers.findBlocks(bot, 'oak_log', 10, 5);
              if (logs.length > 0) {
                await helpers.goto(bot, x, y, z, 2);
                await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
                return;
              }
              
              const birchLogs = helpers.findBlocks(bot, 'birch_log', 10, 5);
              if (birchLogs.length > 0) {
                await helpers.goto(bot, x, y, z, 2);
                await helpers.collect(bot, 'birch_log', 4, { maxDistance: 30 });
                return;
              }
            }
          }
        }
      }
    }
  }
  
  // Final verification
  const finalOakCheck = helpers.count(bot, 'oak_log');
  const finalBirchCheck = helpers.count(bot, 'birch_log');
  
  if (finalOakCheck < 4 || finalBirchCheck < 4) {
    throw new Error(`Not enough wood logs collected. Have ${finalOakCheck} oak logs and ${finalBirchCheck} birch logs`);
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
      
      // Check if