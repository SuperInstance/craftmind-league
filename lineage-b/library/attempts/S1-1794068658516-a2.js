// skill: gatherMoreWoodForTools
// stage: S1
// purpose: Gather more oak logs to build a crafting table
// postconditions: Have sufficient oak logs to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory for oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  
  // If we already have enough oak logs, we can proceed to build crafting table
  if (oakLogs >= 4) {
    return;
  }
  
  // Find oak logs nearby
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  
  if (!oakLogBlock) {
    // If no oak logs found nearby, search for them
    const oakLogBlocks = helpers.findBlocks(bot, 'oak_log', 100, 10);
    
    if (oakLogBlocks.length === 0) {
      throw new Error("No oak logs found within 100 blocks");
    }
    
    // Go to the nearest oak log
    const nearestOakLog = oakLogBlocks[0];
    await helpers.goto(bot, nearestOakLog.x, nearestOakLog.y, nearestOakLog.z, 2);
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 4 - oakLogs, { maxDistance: 10 });
  } else {
    // Go to the oak log block
    await helpers.goto(bot, oakLogBlock.x, oakLogBlock.y, oakLogBlock.z, 2);
    
    // Collect oak logs
    await helpers.collect(bot, 'oak_log', 4 - oakLogs, { maxDistance: 10 });
  }
  
  // Verify we have enough oak logs
  const finalOakLogs = helpers.count(bot, 'oak_log');
  if (finalOakLogs < 4) {
    throw new Error(`Failed to collect enough oak logs. Got ${finalOakLogs}, needed 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const craftingTable = helpers.count(bot, 'crafting_table');
  
  return {
    ok: oakLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      crafting_tables: craftingTable
    }
  };
};