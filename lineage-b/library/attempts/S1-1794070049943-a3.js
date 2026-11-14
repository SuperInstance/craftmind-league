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
  
  // Use survey data to find a good location for oak logs
  // The survey shows oak_log: 30, so they should be nearby
  // Instead of trying to find a specific block, let's use the survey to find a good area
  
  // Try to find oak logs in a reasonable radius using findBlocks
  const oakLogBlocks = helpers.findBlocks(bot, 'oak_log', 30, 10);
  
  if (oakLogBlocks.length > 0) {
    // Go to the first oak log we found
    const log = oakLogBlocks[0];
    await helpers.goto(bot, log.x, log.y, log.z, 5);
    
    // Collect the required number of oak logs
    const logsNeeded = 4 - oakLogs;
    await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 30 });
  } else {
    // If we can't find oak logs nearby, try to find birch logs as an alternative
    const birchLogBlocks = helpers.findBlocks(bot, 'birch_log', 30, 10);
    if (birchLogBlocks.length > 0) {
      // Go to the first birch log we found
      const log = birchLogBlocks[0];
      await helpers.goto(bot, log.x, log.y, log.z, 5);
      
      // Collect birch logs
      const logsNeeded = 4 - oakLogs;
      await helpers.collect(bot, 'birch_log', logsNeeded, { maxDistance: 30 });
      
      // Convert birch logs to planks for crafting table
      await helpers.craft(bot, 'oak_planks', 1);
    } else {
      // If no logs found at all, try to go to a known good area
      // Based on survey data, let's try a position that should have logs
      const targetPosition = v3(63, 67, -72); // anchor position
      await helpers.goto(bot, targetPosition.x, targetPosition.y, targetPosition.z, 5);
      
      // Try again to find logs
      const oakLogBlocks2 = helpers.findBlocks(bot, 'oak_log', 30, 10);
      if (oakLogBlocks2.length > 0) {
        const log = oakLogBlocks2[0];
        await helpers.goto(bot, log.x, log.y, log.z, 5);
        
        const logsNeeded = 4 - oakLogs;
        await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 30 });
      } else {
        // If we still can't find logs, try to go to a position that's likely to have logs
        await helpers.goto(bot, 65, 67, -75, 5);
        
        const oakLogBlocks3 = helpers.findBlocks(bot, 'oak_log', 30, 10);
        if (oakLogBlocks3.length > 0) {
          const log = oakLogBlocks3[0];
          await helpers.goto(bot, log.x, log.y, log.z, 5);
          
          const logsNeeded = 4 - oakLogs;
          await helpers.collect(bot, 'oak_log', logsNeeded, { maxDistance: 30 });
        } else {
          throw new Error('No oak logs found within 30 blocks after multiple attempts');
        }
      }
    }
  }
  
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