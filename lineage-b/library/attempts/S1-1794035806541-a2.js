// skill: gatherWoodForTools
// stage: S1
// purpose: Cut down nearby oak trees and collect the dropped oak logs, then craft tools
// postconditions: Inventory contains crafting table and wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, anchor);
  
  // Find and cut down oak trees nearby
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 20, 10);
  if (oakLogs.length === 0) {
    // If no oak logs found, try to find oak trees and chop them down
    const oakTrees = helpers.findBlocks(bot, 'oak_log', 30, 5);
    if (oakTrees.length === 0) {
      throw new Error('No oak trees found within 30 blocks');
    }
    
    // Chop down the first oak tree found
    const treeBlock = oakTrees[0];
    await helpers.goto(bot, treeBlock.x, treeBlock.y, treeBlock.z, 3);
    
    // Ensure we have a tool to chop down the tree
    await helpers.equipAny(bot, ['wooden_pickaxe', 'stone_pickaxe', 'iron_pickaxe']);
    
    // Dig the oak log block
    await bot.dig(bot.blockAt(v3(treeBlock.x, treeBlock.y, treeBlock.z)));
    
    // Wait a moment for the block to drop
    await helpers.sleep(1000);
    
    // Collect the dropped logs
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 20 });
  } else {
    // Collect oak logs directly if they are already on the ground
    await helpers.collect(bot, 'oak_log', 10, { maxDistance: 20 });
  }
  
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