// skill: buildCraftingTable
// stage: S1
// purpose: Craft a crafting table using oak planks and logs to progress with tool crafting
// postconditions: A crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  const planksCount = helpers.count(bot, 'oak_planks');
  const logsCount = helpers.count(bot, 'oak_log');
  
  // We need 4 planks to craft a crafting table
  if (planksCount < 4) {
    // We don't have enough planks, so we need to make more from logs
    // Check if we have enough logs to make 4 planks (1 log = 4 planks)
    if (logsCount < 1) {
      throw new Error('Not enough materials to craft a crafting table: need 4 oak_planks (or 1 oak_log), have ' + planksCount + ' planks and ' + logsCount + ' logs');
    }
    
    // Convert logs to planks
    try {
      await helpers.craft(bot, 'oak_planks', 4);
      bot.chat('Successfully crafted 4 oak planks from oak logs');
    } catch (err) {
      throw new Error('Failed to craft oak planks: ' + err.message);
    }
  }
  
  // Now we should have at least 4 planks
  const updatedPlanksCount = helpers.count(bot, 'oak_planks');
  if (updatedPlanksCount < 4) {
    throw new Error('Not enough materials to craft a crafting table: need 4 oak_planks, have ' + updatedPlanksCount);
  }
  
  // Craft the crafting table using 4 oak planks
  try {
    await helpers.craft(bot, 'crafting_table', 1);
    bot.chat('Successfully crafted a crafting table');
  } catch (err) {
    throw new Error('Failed to craft crafting table: ' + err.message);
  }
  
  // Now try to craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
    bot.chat('Successfully crafted a wooden pickaxe');
  } catch (err) {
    throw new Error('Failed to craft wooden pickaxe: ' + err.message);
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlocks(bot, 'crafting_table', 20, 1);
  const craftingTableInInventory = helpers.count(bot, 'crafting_table');
  const woodenPickaxeInInventory = helpers.count(bot, 'wooden_pickaxe');
  
  const hasCraftingTable = (craftingTableInInventory > 0) || (craftingTableNearby.length > 0);
  const hasWoodenPickaxe = woodenPickaxeInInventory > 0;
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTableInInventory,
      craftingTableNearby: craftingTableNearby.length,
      woodenPickaxeInInventory
    }
  };
};