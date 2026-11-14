// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using available oak and birch logs
// postconditions: Crafting table is placed or carried and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs to make a crafting table
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs < 4 && birchLogs < 4) {
    throw new Error(`Not enough logs to make crafting table: have ${oakLogs} oak logs and ${birchLogs} birch logs`);
  }
  
  // Craft the crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Place the crafting table near the anchor
  const placementX = ctx.anchor.x;
  const placementY = ctx.anchor.y;
  const placementZ = ctx.anchor.z;
  
  await helpers.placeAt(bot, 'crafting_table', placementX, placementY, placementZ);
  
  // Craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (hasCraftingTable || craftingTableNearby !== null) && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasCraftingTable: hasCraftingTable,
      hasWoodenPickaxe: hasWoodenPickaxe
    }
  };
};
