// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak, birch, and acacia logs to create wooden tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // Go back to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  const acaciaLogs = helpers.count(bot, 'acacia_log');
  
  if (oakLogs < 10 || birchLogs < 10 || acaciaLogs < 10) {
    throw new Error(`Not enough logs: oak=${oakLogs}, birch=${birchLogs}, acacia=${acaciaLogs}`);
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Place crafting table nearby
  const tableX = ctx.anchor.x + 2;
  const tableZ = ctx.anchor.z + 2;
  const tableY = helpers.groundHeight(bot, tableX, tableZ, ctx.anchor.y);
  await helpers.placeAt(bot, 'crafting_table', tableX, tableY, tableZ);
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have the crafting table and pickaxe
  const hasCraftingTable = helpers.has(bot, 'crafting_table');
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe');
  
  if (!hasCraftingTable) {
    throw new Error('Failed to craft or place crafting table');
  }
  
  if (!hasPickaxe) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: craftingTableCount >= 1 && pickaxeCount >= 1,
    evidence: {
      craftingTableCount,
      pickaxeCount
    }
  };
};
