// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table from oak logs and craft a wooden pickaxe
// postconditions: Crafting table is placed or carried, and wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // Return to anchor first
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    throw new Error(`Not enough oak logs in inventory: ${oakLogs} < 4`);
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was created
  const craftingTables = helpers.count(bot, 'crafting_table');
  if (craftingTables < 1) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify pickaxe was created
  const pickaxes = helpers.count(bot, 'wooden_pickaxe');
  if (pickaxes < 1) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  bot.chat("Successfully built crafting table and crafted wooden pickaxe!");
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTable = helpers.count(bot, 'crafting_table') > 0;
  const woodenPickaxe = helpers.count(bot, 'wooden_pickaxe') > 0;
  
  return {
    ok: craftingTable && woodenPickaxe,
    evidence: {
      craftingTable: craftingTable,
      woodenPickaxe: woodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log'),
      inventory: helpers.inventoryList(bot)
    }
  };
};