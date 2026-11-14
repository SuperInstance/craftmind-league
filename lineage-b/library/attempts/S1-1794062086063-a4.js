// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough planks for building a crafting table
// postconditions: Have enough oak planks (at least 4) and oak logs (at least 10) for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const currentOakLogs = helpers.count(bot, 'oak_log');
  const currentPlanks = helpers.count(bot, 'oak_planks');
  
  // Need at least 10 oak logs and 4 planks to make a crafting table
  if (currentOakLogs >= 10 && currentPlanks >= 4) {
    return;
  }
  
  // Try to find oak logs nearby first
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
  
  if (oakLogs.length > 0) {
    // Collect oak logs from the found locations
    await helpers.collect(bot, 'oak_log', 10 - currentOakLogs, { maxDistance: 30 });
  } else {
    // If no oak logs found nearby, search more broadly but with a different approach
    // Use the survey data to find where oak logs are most abundant
    const surveyData = ctx.state.survey;
    const oakLogCount = surveyData.oak_log;
    
    // If we have a good survey, try to go to a location with high oak log density
    if (oakLogCount > 0) {
      // Try to find a spot with many oak logs nearby
      const oakLogSpots = helpers.findBlocks(bot, 'oak_log', 100, 20);
      if (oakLogSpots.length > 0) {
        // Sort by distance and go to the closest one
        oakLogSpots.sort((a, b) => {
          const distA = Math.sqrt(Math.pow(a.x - bot.entity.position.x, 2) + Math.pow(a.z - bot.entity.position.z, 2));
          const distB = Math.sqrt(Math.pow(b.x - bot.entity.position.x, 2) + Math.pow(b.z - bot.entity.position.z, 2));
          return distA - distB;
        });
        
        const closestSpot = oakLogSpots[0];
        await helpers.goto(bot, closestSpot.x, closestSpot.y, closestSpot.z, 2);
        await helpers.collect(bot, 'oak_log', 10 - currentOakLogs, { maxDistance: 30 });
      } else {
        // If still no logs found, try to go to a known good location
        // Try to go to a nearby area that should have oak logs
        await helpers.goto(bot, 81, 66, -104, 5);
        await helpers.collect(bot, 'oak_log', 10 - currentOakLogs, { maxDistance: 30 });
      }
    } else {
      // Fallback: go to a known good location
      await helpers.goto(bot, 81, 66, -104, 5);
      await helpers.collect(bot, 'oak_log', 10 - currentOakLogs, { maxDistance: 30 });
    }
  }
  
  // Verify we have enough logs now
  const newOakLogs = helpers.count(bot, 'oak_log');
  if (newOakLogs < 10) {
    throw new Error(`Only collected ${newOakLogs} oak logs, need at least 10`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const oakPlanks = helpers.count(bot, 'oak_planks');
  const craftingTable = helpers.has(bot, 'crafting_table', 1);
  
  return {
    ok: oakLogs >= 10 && oakPlanks >= 4,
    evidence: {
      oak_logs: oakLogs,
      oak_planks: oakPlanks,
      crafting_table: craftingTable
    }
  };
};