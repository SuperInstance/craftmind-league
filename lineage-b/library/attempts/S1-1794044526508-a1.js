// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and craft a crafting table
// postconditions: Crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    throw new Error(`Not enough oak logs: have ${oakLogs}, need 4`);
  }
  
  // Craft a crafting table
  try {
    await helpers.craft(bot, 'crafting_table', 1);
  } catch (err) {
    throw new Error(`Failed to craft crafting table: ${err.message}`);
  }
  
  // Check if crafting table was successful
  const craftingTableCount = helpers.count(bot, 'crafting_table');
  if (craftingTableCount < 1) {
    throw new Error('Crafting table not found in inventory after crafting');
  }
  
  // Craft a wooden pickaxe
  try {
    await helpers.craft(bot, 'wooden_pickaxe', 1);
  } catch (err) {
    throw new Error(`Failed to craft wooden pickaxe: ${err.message}`);
  }
  
  // Check if wooden pickaxe was successful
  const pickaxeCount = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxeCount < 1) {
    throw new Error('Wooden pickaxe not found in inventory after crafting');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const craftingTableInInventory = helpers.count(bot, 'crafting_table') > 0;
  const pickaxeInInventory = helpers.count(bot, 'wooden_pickaxe') > 0;
  
  return {
    ok: (craftingTableNearby || craftingTableInInventory) && pickaxeInInventory,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      craftingTableInInventory: craftingTableInInventory,
      pickaxeInInventory: pickaxeInInventory
    }
  };
};
