// skill: gatherWoodForTools
// stage: S1
// purpose: Gather 5 oak logs and 5 birch logs to craft wooden tools
// postconditions: Have crafting table and wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough logs
  const oakLogs = helpers.count(bot, 'oak_log');
  const birchLogs = helpers.count(bot, 'birch_log');
  
  if (oakLogs < 5 || birchLogs < 5) {
    // Collect oak logs
    if (oakLogs < 5) {
      const oakLogCount = 5 - oakLogs;
      await helpers.collect(bot, 'oak_log', oakLogCount, { maxDistance: 30 });
    }
    
    // Collect birch logs
    if (birchLogs < 5) {
      const birchLogCount = 5 - birchLogs;
      await helpers.collect(bot, 'birch_log', birchLogCount, { maxDistance: 30 });
    }
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have the required items
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTable = helpers.has(bot, 'crafting_table', 1);
  const woodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: craftingTable && woodenPickaxe,
    evidence: {
      craftingTable: craftingTable,
      woodenPickaxe: woodenPickaxe
    }
  };
};
