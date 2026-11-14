// skill: buildCraftingTable
// stage: S1
// purpose: Craft a crafting table using oak planks and logs to progress with tool crafting
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, ensure we're at the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak planks (4 planks needed for crafting table)
  const oakPlanksCount = helpers.count(bot, 'oak_planks');
  if (oakPlanksCount < 4) {
    // We need to craft more planks from logs
    const oakLogsCount = helpers.count(bot, 'oak_log');
    if (oakLogsCount < 1) {
      throw new Error(`Not enough oak logs to craft more planks: need 1, have ${oakLogsCount}`);
    }
    
    // Craft 4 planks from 1 oak log (1 log = 4 planks)
    await helpers.craft(bot, 'oak_planks', 4);
    
    // Verify we have the planks now
    const newPlanksCount = helpers.count(bot, 'oak_planks');
    if (newPlanksCount < 4) {
      throw new Error(`Failed to craft enough oak planks: need 4, have ${newPlanksCount}`);
    }
  }
  
  // Now we should have at least 4 oak planks
  // Craft the crafting table using 4 oak planks
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify we have a crafting table
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error(`Failed to craft crafting table`);
  }
  
  // Now craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have a wooden pickaxe
  const woodenPickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (woodenPickaxeCount < 1) {
    throw new Error(`Failed to craft wooden pickaxe`);
  }
  
  // Check if crafting table is nearby (within 20 blocks)
  const nearbyCraftingTables = helpers.findBlocks(bot, 'crafting_table', 20, 1);
  if (nearbyCraftingTables.length === 0) {
    // If no nearby crafting table, check if we're carrying one
    if (craftingTableCount < 1) {
      throw new Error(`Crafting table not placed or carried`);
    }
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlocks(bot, 'crafting_table', 20, 1).length > 0;
  const carryingCraftingTable = helpers.count(bot, 'crafting_table') > 0;
  const hasWoodenPickaxe = helpers.count(bot, 'wooden_pickaxe') > 0;
  
  return {
    ok: (craftingTableNearby || carryingCraftingTable) && hasWoodenPickaxe,
    evidence: {
      craftingTablesNearby: craftingTableNearby,
      carryingCraftingTable: carryingCraftingTable,
      hasWoodenPickaxe: hasWoodenPickaxe
    }
  };
};