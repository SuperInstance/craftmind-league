// skill: gatherWoodForTools
// stage: S1
// purpose: Gather more oak logs and birch logs to build a crafting table
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // Need at least 4 more oak logs and 4 more birch logs to make a crafting table
  const neededOak = Math.max(0, 4 - oakLogs);
  const neededBirch = Math.max(0, 4 - birchLogs);
  
  // Collect additional oak logs
  if (neededOak > 0) {
    const oakBlocks = helpers.findBlocks(bot, 'oak_log', 30, neededOak);
    if (oakBlocks.length < neededOak) {
      throw new Error(`Not enough oak logs found. Found ${oakBlocks.length}, needed ${neededOak}`);
    }
    await helpers.collect(bot, 'oak_log', neededOak, { maxDistance: 30 });
  }
  
  // Collect additional birch logs
  if (neededBirch > 0) {
    const birchBlocks = helpers.findBlocks(bot, 'birch_log', 30, neededBirch);
    if (birchBlocks.length < neededBirch) {
      throw new Error(`Not enough birch logs found. Found ${birchBlocks.length}, needed ${neededBirch}`);
    }
    await helpers.collect(bot, 'birch_log', neededBirch, { maxDistance: 30 });
  }
  
  // Verify we have enough logs
  const finalOak = helpers.count(bot, 'oak_log');
  const finalBirch = helpers.count(bot, 'birch_log');
  
  if (finalOak < 4 || finalBirch < 4) {
    throw new Error(`Not enough logs after collection. Oak: ${finalOak}, Birch: ${finalBirch}`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was created
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was created
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxeCount < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  
  // Check if crafting table is carried or placed within 20 blocks
  const craftingTablePlaced = craftingTableCount > 0; // We assume it's placed if we have it in inventory
  
  return {
    ok: craftingTablePlaced && pickaxeCount > 0,
    evidence: {
      oak_logs: helpers.count(bot, 'oak_log'),
      birch_logs: helpers.count(bot, 'birch_log'),
      crafting_table: craftingTablePlaced,
      wooden_pickaxe: pickaxeCount > 0
    }
  };
};
