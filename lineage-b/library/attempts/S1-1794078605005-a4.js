// skill: gatherWoodForTools
// stage: S1
// purpose: Collect oak and birch logs from nearby trees to build a crafting table
// postconditions: Have enough wood logs (at least 4) to craft a crafting table
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we already have enough wood logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const totalLogs = oakLogs + birchLogs;
  
  if (totalLogs >= 4) {
    return;
  }
  
  // Collect additional wood logs
  const neededLogs = 4 - totalLogs;
  
  // Instead of relying on findBlocks which may not work reliably, 
  // we'll use a more direct approach to collect logs
  try {
    // Try to collect oak logs first
    await helpers.collect(bot, 'oak_log', neededLogs, { maxDistance: 30 });
    
    // Check how many we got
    const newOakLogs = helpers.count(bot, 'oak_log');
    const logsCollected = newOakLogs - oakLogs;
    
    // If we didn't get enough oak logs, try birch logs
    if (logsCollected < neededLogs) {
      const remainingNeeded = neededLogs - logsCollected;
      await helpers.collect(bot, 'birch_log', remainingNeeded, { maxDistance: 30 });
    }
  } catch (error) {
    // If collect fails, try to find logs manually
    const logsToCollect = neededLogs;
    let collected = 0;
    
    // Look for oak logs first
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 30, logsToCollect);
    for (const block of oakBlocks) {
      if (collected >= logsToCollect) break;
      await helpers.goto(bot, block.x, block.y, block.z, 1);
      await bot.dig(bot.blockAt(v3(block.x, block.y, block.z)));
      collected++;
    }
    
    // If still need more, look for birch logs
    if (collected < logsToCollect) {
      const birchBlocks = helpers.findBlocks(bot, 'birch_log', 30, logsToCollect - collected);
      for (const block of birchBlocks) {
        if (collected >= logsToCollect) break;
        await helpers.goto(bot, block.x, block.y, block.z, 1);
        await bot.dig(bot.blockAt(v3(block.x, block.y, block.z)));
        collected++;
      }
    }
    
    // Verify we collected enough
    const finalOakLogs = helpers.count(bot, 'oak_log');
    const finalBirchLogs = helpers.count(bot, 'birch_log');
    const finalTotalLogs = finalOakLogs + finalBirchLogs;
    
    if (finalTotalLogs < 4) {
      throw new Error(`Not enough wood logs collected. Have ${finalTotalLogs} logs, need at least 4`);
    }
  }
  
  // Verify we have enough logs
  const finalOakLogs = helpers.count(bot, 'oak_log');
  const finalBirchLogs = helpers.count(bot, 'birch_log');
  const finalTotalLogs = finalOakLogs + finalBirchLogs;
  
  if (finalTotalLogs < 4) {
    throw new Error(`Not enough wood logs collected. Have ${finalTotalLogs} logs, need at least 4`);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const totalLogs = oakLogs + birchLogs;
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  
  return {
    ok: totalLogs >= 4,
    evidence: {
      oak_logs: oakLogs,
      birch_logs: birchLogs,
      total_logs: totalLogs,
      has_crafting_table: hasCraftingTable
    }
  };
};