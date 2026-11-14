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
  
  // Since we're having trouble reaching the wood sources, let's try a more direct approach
  // Use the survey data to determine where to look for logs
  
  // First, let's try to collect oak logs
  if (neededOak > 0) {
    // Try to find oak logs nearby first
    const oakBlock = helpers.findBlock(bot, 'oak_log', 30);
    if (oakBlock) {
      await helpers.goto(bot, oakBlock.position.x, oakBlock.position.y, oakBlock.position.z, 2);
      await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
    } else {
      // If no oak logs found nearby, try to find a path to a location with oak logs
      // Based on survey, we know oak logs are available, so let's try to find them
      const targetX = 22;
      const targetZ = -86;
      const targetY = 69;
      
      // Move to target location
      await helpers.goto(bot, targetX, targetY, targetZ, 3);
      
      // Check for oak logs at target location
      const oakBlocks = helpers.findBlocks(bot, 'oak_log', 20, 5);
      if (oakBlocks.length > 0) {
        await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 20 });
      } else {
        // If no oak logs at target, try a broader search
        const oakBlocksNearby = helpers.findBlocks(bot, 'oak_log', 50, 10);
        if (oakBlocksNearby.length > 0) {
          await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 50 });
        } else {
          throw new Error('No oak logs found in search area');
        }
      }
    }
  }
  
  // Now collect birch logs if needed
  if (neededBirch > 0) {
    // Try to find birch logs nearby first
    const birchBlock = helpers.findBlock(bot, 'birch_log', 30);
    if (birchBlock) {
      await helpers.goto(bot, birchBlock.position.x, birchBlock.position.y, birchBlock.position.z, 2);
      await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
    } else {
      // If no birch logs found nearby, try to find a path to a location with birch logs
      // Based on survey, we know birch logs are available, so let's try to find them
      const targetX = 22;
      const targetZ = -86;
      const targetY = 69;
      
      // Move to target location
      await helpers.goto(bot, targetX, targetY, targetZ, 3);
      
      // Check for birch logs at target location
      const birchBlocks = helpers.findBlocks(bot, 'birch_log', 20, 5);
      if (birchBlocks.length > 0) {
        await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 20 });
      } else {
        // If no birch logs at target, try a broader search
        const birchBlocksNearby = helpers.findBlocks(bot, 'birch_log', 50, 10);
        if (birchBlocksNearby.length > 0) {
          await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 50 });
        } else {
          throw new Error('No birch logs found in search area');
        }
      }
    }
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const craftingTable = helpers.has(bot, 'crafting_table', 1);
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (oakLogs >= 4 || birchLogs >= 4) && (craftingTable || woodenPickaxe),
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      crafting_table: craftingTable,
      wooden_pickaxe: woodenPickaxe
    }
  };
};
