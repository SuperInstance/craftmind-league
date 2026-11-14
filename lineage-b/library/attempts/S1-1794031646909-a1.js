// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak and birch logs to create wooden tools
// postconditions: Crafting table is carried or placed within 20 blocks AND wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs < 10 || birchLogs < 10) {
    throw new Error(`Not enough logs: oak=${oakLogs}, birch=${birchLogs}`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Check if crafting table was successful
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Check if pickaxe was successful
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Verify the postconditions
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const pickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  if (!craftingTableInInventory || !pickaxeInInventory) {
    throw new Error('Postconditions not met: crafting table and/or pickaxe missing');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const pickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTableInInventory && pickaxeInInventory,
    evidence: {
      craftingTableInInventory,
      pickaxeInInventory
    }
  };
};
