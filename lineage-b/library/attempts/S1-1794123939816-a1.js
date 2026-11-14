// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Collect more oak and birch logs to craft a crafting table and wooden pickaxe
// postconditions: Have enough wood logs to build a crafting table and craft a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough wood logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 oak logs or birch logs to make a crafting table
  // And we need 1 more for the pickaxe, so 5 total of either type
  if (oakLogs >= 5 || birchLogs >= 5) {
    return;
  }
  
  // If we don't have enough, go collect more
  // First, find the nearest wood logs
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
  
  if (!oakLogBlock && !birchLogBlock) {
    throw new Error("No oak or birch logs found within 30 blocks");
  }
  
  // Choose the nearest one
  let targetBlock;
  if (oakLogBlock && birchLogBlock) {
    const oakDistance = Math.sqrt(
      Math.pow(oakLogBlock.position.x - bot.entity.position.x, 2) +
      Math.pow(oakLogBlock.position.z - bot.entity.position.z, 2)
    );
    const birchDistance = Math.sqrt(
      Math.pow(birchLogBlock.position.x - bot.entity.position.x, 2) +
      Math.pow(birchLogBlock.position.z - bot.entity.position.z, 2)
    );
    targetBlock = oakDistance < birchDistance ? oakLogBlock : birchLogBlock;
  } else {
    targetBlock = oakLogBlock || birchLogBlock;
  }
  
  // Go to the wood log block
  await helpers.goto(bot, targetBlock.position.x, targetBlock.position.y, targetBlock.position.z, 2);
  
  // Collect the wood logs
  await helpers.collect(bot, targetBlock.name, 10, { maxDistance: 5 });
  
  // Verify we collected enough
  const newOakLogs = helpers.count(bot, 'oak_log');
  const newBirchLogs = helpers.count(bot, 'birch_log');
  
  if (newOakLogs < 5 && newBirchLogs < 5) {
    throw new Error("Failed to collect enough wood logs");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // Check if we have enough wood logs to build a crafting table (4 logs) and make a pickaxe (1 more)
  const hasEnoughWood = (oakLogs >= 5 || birchLogs >= 5);
  
  return {
    ok: hasEnoughWood,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      has_enough_wood: hasEnoughWood
    }
  };
};
