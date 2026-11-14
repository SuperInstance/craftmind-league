// skill: gatherWoodForTools
// stage: S1
// purpose: Gather enough wood to craft wooden tools and place a crafting table
// postconditions: Crafting table is placed within 20 blocks and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Go back to anchor if needed
  await gotoAnchor(bot, anchor);
  
  // Check if we already have a crafting table
  const craftingTable = bot.findBlock({
    matching: (block) => block.name === 'crafting_table',
    maxDistance: 20
  });
  
  if (craftingTable) {
    // Crafting table is already in the world, check if we have a pickaxe
    if (has(bot, 'wooden_pickaxe', 1)) {
      return;
    }
  }
  
  // Collect logs for crafting
  const logTypes = ['oak_log', 'birch_log', 'acacia_log'];
  const logsNeeded = 6; // 6 logs total for pickaxe, axe, shovel
  
  // Find logs using findBlocks helper
  let totalLogs = 0;
  for (const logType of logTypes) {
    const logs = findBlocks(bot, logType, 32, 100);
    totalLogs += logs.length;
  }
  
  if (totalLogs < logsNeeded) {
    throw new Error(`Not enough logs found. Need ${logsNeeded}, found ${totalLogs}`);
  }
  
  // Collect logs
  const logsToCollect = [];
  for (const logType of logTypes) {
    const logs = findBlocks(bot, logType, 32, 100);
    for (let i = 0; i < Math.min(2, logs.length); i++) {
      logsToCollect.push(logs[i]);
    }
  }
  
  // Collect logs
  for (const log of logsToCollect) {
    await collect(bot, log.name, 1, { maxDistance: 32 });
  }
  
  // Craft planks from logs
  const planks = [];
  for (const logType of logTypes) {
    const count = count(bot, logType);
    if (count > 0) {
      const plankType = logType.replace('_log', '_planks');
      await craft(bot, plankType, Math.ceil(count / 2));
      planks.push(plankType);
    }
  }
  
  // Craft crafting table
  await craft(bot, 'crafting_table', 1);
  
  // Check if crafting table is in inventory
  if (!has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Place crafting table
  const floor = bot.blockAt(bot.entity.position).below();
  await placeAt(bot, 'crafting_table', floor.x, floor.y, floor.z);
  
  // Craft wooden pickaxe
  await craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have the pickaxe
  if (!has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTable = bot.findBlock({
    matching: (block) => block.name === 'crafting_table',
    maxDistance: 20
  });
  
  const hasPickaxe = has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: !!craftingTable && hasPickaxe,
    evidence: {
      craftingTablePlaced: !!craftingTable,
      hasPickaxe: hasPickaxe,
      craftingTableDistance: craftingTable ? craftingTable.distanceTo(bot.entity.position) : null
    }
  };
};