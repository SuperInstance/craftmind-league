// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs and birch logs to create wooden tools
// postconditions: Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  
  // Return to anchor if far away
  await helpers.gotoAnchor(bot, anchor);
  
  // Collect oak logs
  const oakLogs = await helpers.findBlocks(bot, 'oak_log', 30, 10);
  if (oakLogs.length < 10) {
    throw new Error(`Not enough oak logs found. Found ${oakLogs.length}, need at least 10`);
  }
  
  // Collect birch logs
  const birchLogs = await helpers.findBlocks(bot, 'birch_log', 30, 10);
  if (birchLogs.length < 10) {
    throw new Error(`Not enough birch logs found. Found ${birchLogs.length}, need at least 10`);
  }
  
  // Collect logs to inventory
  await helpers.collect(bot, 'oak_log', 10, { maxDistance: 30 });
  await helpers.collect(bot, 'birch_log', 10, { maxDistance: 30 });
  
  // Verify we have enough logs
  if (!helpers.has(bot, 'oak_log', 10)) {
    throw new Error('Failed to collect enough oak logs');
  }
  if (!helpers.has(bot, 'birch_log', 10)) {
    throw new Error('Failed to collect enough birch logs');
  }
  
  // Craft crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table is in inventory
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Place crafting table near anchor
  const craftingTablePos = helpers.v3(anchor.x, anchor.y, anchor.z);
  await helpers.placeAt(bot, 'crafting_table', craftingTablePos.x, craftingTablePos.y, craftingTablePos.z);
  
  // Craft wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe is in inventory
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const { anchor } = ctx;
  const craftingTableNearby = helpers.findBlock(bot, 'crafting_table', 20);
  const hasPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: !!craftingTableNearby && hasPickaxe,
    evidence: {
      craftingTableNearby: !!craftingTableNearby,
      hasPickaxe: hasPickaxe,
      craftingTablePosition: craftingTableNearby ? {
        x: craftingTableNearby.position.x,
        y: craftingTableNearby.position.y,
        z: craftingTableNearby.position.z
      } : null
    }
  };
};
