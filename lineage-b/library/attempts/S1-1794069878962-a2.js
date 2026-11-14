// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to have enough materials for crafting a crafting table
// postconditions: Have at least 4 oak logs in inventory for crafting a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs >= 4) {
    throw new Error('Already have enough oak logs for crafting table');
  }
  
  // Find nearby oak logs using survey data
  const surveyData = ctx.state.survey;
  if (surveyData.oak_log < 4) {
    throw new Error('Not enough oak logs in survey data to collect 4');
  }
  
  // Instead of using findBlock which might fail, use the survey data to determine where to go
  // Since we're at anchor (63,67,-72) and survey shows oak_log: 30, we can assume they're nearby
  // Let's try to find a path to a nearby oak log area
  
  // Try to find oak logs within a reasonable distance
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  if (!oakLogBlock) {
    // If findBlock fails, try to go to a position where we expect to find logs
    // Based on survey data, we know oak logs are available
    // Let's try to go to a nearby area that should have logs
    const targetPosition = v3(81, 66, -104); // This was the failing position in previous attempt
    try {
      await helpers.goto(bot, targetPosition.x, targetPosition.y, targetPosition.z, 5);
    } catch (err) {
      // If goto fails, try a different approach - go to a known good location
      // Try to find a good spot nearby using the survey data
      const nearbyOakLogs = helpers.findBlocks(bot, 'oak_log', 30, 10);
      if (nearbyOakLogs.length > 0) {
        // Go to the first one we found
        const log = nearbyOakLogs[0];
        await helpers.goto(bot, log.x, log.y, log.z, 5);
      } else {
        // If we can't find logs, try to go to a known good area
        // Try to go to a position that's likely to have logs based on survey
        await helpers.goto(bot, 80, 65, -100, 5);
      }
    }
    
    // After moving, try to find logs again
    const newOakLogBlock = helpers.findBlock(bot, 'oak_log', 10);
    if (!newOakLogBlock) {
      // If still can't find logs, try to find a different wood type
      const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
      if (birchLogBlock) {
        // Collect birch logs instead
        await helpers.collect(bot, 'birch_log', 4, { maxDistance: 30 });
        // Convert birch logs to planks for crafting table
        await helpers.craft(bot, 'oak_planks', 1);
        return;
      }
      throw new Error('No oak or birch logs found within 30 blocks after movement');
    }
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 4 - oakLogs, { maxDistance: 30 });
  
  // Verify we have enough logs now
  const finalLogs = helpers.count(bot, 'oak_log');
  if (finalLogs < 4) {
    throw new Error(`Only collected ${finalLogs} oak logs, need 4`);
  }
  
  bot.chat('Collected enough oak logs for crafting table');
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.has(bot, 'crafting_table', 1);
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: oakLogs >= 4 && (craftingTable || woodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      crafting_table: craftingTable,
      wooden_pickaxe: woodenPickaxe
    }
  };
};