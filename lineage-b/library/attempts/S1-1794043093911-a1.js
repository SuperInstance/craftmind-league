// skill: gatherWoodForTools
// stage: S1
// purpose: Collect at least 10 oak logs from the designated location at 69,67,-80
// postconditions: Inventory contains at least 10 oak logs and a wooden pickaxe
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we have the right items in inventory
  if (!helpers.has(bot, 'oak_log', 10)) {
    throw new Error('Not enough oak logs in inventory');
  }
  
  // Navigate to the oak log gathering location
  await helpers.goto(bot, 69, 67, -80, 5);
  
  // Collect at least 10 oak logs
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  
  // Verify we have collected enough oak logs
  if (!helpers.has(bot, 'oak_log', 10)) {
    throw new Error('Failed to collect enough oak logs');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have crafted a wooden pickaxe
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify we have crafted a crafting table
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasLogs = helpers.has(bot, 'oak_log', 10);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  const hasCraftingTable = helpers.has(bot, 'crafting_table', 1);
  
  return {
    ok: hasLogs && hasPickaxe && hasCraftingTable,
    evidence: {
      oak_logs: helpers.count(bot, 'oak_log'),
      wooden_pickaxe: helpers.count(bot, 'wooden_pickaxe'),
      crafting_table: helpers.count(bot, 'crafting_table')
    }
  };
};