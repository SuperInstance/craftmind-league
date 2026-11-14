// skill: buildCraftingTable
// stage: S1
// purpose: Craft a crafting table using available oak planks and logs
// postconditions: A crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, check if we have enough materials to craft a crafting table
  // Need 4 oak_planks or 1 oak_log to craft a crafting table
  const planks = helpers.count(bot, 'oak_planks');
  const logs = helpers.count(bot, 'oak_log');
  
  // If we have enough planks, craft directly
  if (planks >= 4) {
    await helpers.craft(bot, 'crafting_table', 1);
    return;
  }
  
  // If we have a log but not enough planks, we need to make planks first
  if (logs >= 1) {
    // Convert log to planks
    await helpers.craft(bot, 'oak_planks', 4);
    // Now craft the crafting table
    await helpers.craft(bot, 'crafting_table', 1);
    return;
  }
  
  // If we don't have either, we need to gather more wood
  // But first, let's check if we're near enough to the anchor to proceed
  const distance = Math.sqrt(
    Math.pow(bot.entity.position.x - ctx.anchor.x, 2) +
    Math.pow(bot.entity.position.y - ctx.anchor.y, 2) +
    Math.pow(bot.entity.position.z - ctx.anchor.z, 2)
  );
  
  // If we're far from anchor, head back to anchor first
  if (distance > 30) {
    // Use gotoAnchor which should be more reliable than goto
    try {
      await helpers.gotoAnchor(bot, ctx.anchor);
    } catch (e) {
      // If gotoAnchor fails, try a direct goto to anchor
      await helpers.goto(bot, ctx.anchor.x, ctx.anchor.y, ctx.anchor.z, 5);
    }
  }
  
  // Look for more oak logs near the anchor
  const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
  if (oakLogBlock) {
    // Collect the oak logs
    await helpers.collect(bot, 'oak_log', 1, { maxDistance: 30 });
    // Convert to planks
    await helpers.craft(bot, 'oak_planks', 4);
    // Craft the crafting table
    await helpers.craft(bot, 'crafting_table', 1);
    return;
  }
  
  // If no oak logs found, try birch logs
  const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
  if (birchLogBlock) {
    await helpers.collect(bot, 'birch_log', 1, { maxDistance: 30 });
    await helpers.craft(bot, 'birch_planks', 4);
    await helpers.craft(bot, 'crafting_table', 1);
    return;
  }
  
  // If we still don't have logs, we should have enough planks from the inventory
  // Let's craft directly from planks if we have them
  if (planks >= 4) {
    await helpers.craft(bot, 'crafting_table', 1);
    return;
  }
  
  // If we've exhausted all options, throw an error
  throw new Error('No oak or birch logs found and not enough planks to craft a crafting table');
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableInInventory = helpers.has(bot, 'crafting_table', 1);
  const craftingTableNearby = helpers.findBlocks(bot, 'crafting_table', 20).length > 0;
  const woodenPickaxeInInventory = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: (craftingTableInInventory || craftingTableNearby) && woodenPickaxeInInventory,
    evidence: {
      craftingTableInInventory,
      craftingTableNearby,
      woodenPickaxeInInventory
    }
  };
};