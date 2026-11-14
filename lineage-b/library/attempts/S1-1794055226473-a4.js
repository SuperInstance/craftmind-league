// skill: buildCraftingTable
// stage: S1
// purpose: Collect enough oak and birch logs to build a crafting table and craft wooden tools
// postconditions: Crafting table is placed within 20 blocks and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor position first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory for logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  // We need at least 4 logs to make a crafting table
  const neededLogs = Math.max(0, 4 - (oakLogs + birchLogs));
  
  if (neededLogs > 0) {
    // Collect more logs if needed
    await helpers.collect(bot, 'oak_log', neededLogs, { maxDistance: 30 });
    await helpers.collect(bot, 'birch_log', neededLogs, { maxDistance: 30 });
  }
  
  // Verify we have enough logs
  const newOakLogs = helpers.count(bot, 'oak_log');
  const newBirchLogs = helpers.count(bot, 'birch_log');
  
  if (newOakLogs + newBirchLogs < 4) {
    throw new Error(`Not enough logs to craft a crafting table. Have ${newOakLogs} oak logs and ${newBirchLogs} birch logs`);
  }
  
  // Craft a crafting table using 4 logs (any combination)
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (err) {
    throw new Error(`Failed to craft crafting table: ${err.message}`);
  }
  
  // Verify crafting table was crafted
  const craftingTables = helpers.count(bot, 'crafting_table');
  if (craftingTables < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Place the crafting table near the anchor
  const tableX = ctx.anchor.x;
  const tableZ = ctx.anchor.z;
  const tableY = ctx.anchor.y;
  
  // Find a suitable position nearby to place the table
  let placeX = tableX;
  let placeZ = tableZ;
  let placeY = tableY;
  
  // Try to find a clear spot near the anchor
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      const testX = tableX + dx;
      const testZ = tableZ + dz;
      const testY = tableY;
      
      // Check if this position is clear
      const block = bot.blockAt(v3(testX, testY, testZ));
      if (!block || block.name !== 'air') continue;
      
      // Check if the block below is solid
      const belowBlock = bot.blockAt(v3(testX, testY - 1, testZ));
      if (!belowBlock || !belowBlock.boundingBox) continue;
      
      placeX = testX;
      placeZ = testZ;
      placeY = testY;
      break;
    }
  }
  
  // Place the crafting table
  await helpers.placeAt(bot, 'crafting_table', placeX, placeY, placeZ);
  
  // Craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (err) {
    throw new Error(`Failed to craft wooden pickaxe: ${err.message}`);
  }
  
  // Verify wooden pickaxe was crafted
  const woodenPickaxes = helpers.count(bot, 'wooden_pickaxe');
  if (woodenPickaxes < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTables = helpers.count(bot, 'crafting_table');
  const woodenPickaxes = helpers.count(bot, 'wooden_pickaxe');
  
  return {
    ok: craftingTables >= 1 && woodenPickaxes >= 1,
    evidence: {
      craftingTables: craftingTables,
      woodenPickaxes: woodenPickaxes
    }
  };
};