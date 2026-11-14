// skill: gatherWoodForTools
// stage: S1
// purpose: Cut down nearby oak trees and collect the dropped oak logs
// postconditions: Inventory contains oak logs and crafting table
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, anchor);
  
  // Find and cut down oak trees nearby
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 20, 10);
  if (oakLogs.length === 0) {
    throw new Error('No oak logs found within 20 blocks');
  }
  
  // Collect oak logs
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 20 });
  
  // Verify we have oak logs
  if (!helpers.has(bot, 'oak_log', 10)) {
    throw new Error('Failed to collect oak logs');
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table is in inventory
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe is in inventory
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTable: hasCraftingTable,
      woodenPickaxe: hasWoodenPickaxe,
      oakLogs: helpers.count(bot, 'oak_log')
    }
  };
};