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
  
  if (distance > 30) {
    // Head back to anchor first
    await helpers.gotoAnchor(bot, ctx.anchor);
  }
  
  // Look for more oak logs
  const oakLogs = helpers.findBlocks(bot, 'oak_log', 30, 1);
  if (oakLogs.length > 0) {
    // Collect the oak logs
    await helpers.collect(bot, 'oak_log', 1, { maxDistance: 30 });
    // Convert to planks
    await helpers.craft(bot, 'oak_planks', 4);
    // Craft the crafting table
    await helpers.craft(bot, 'crafting_table', 1);
  } else {
    // No oak logs found, try to find birch logs as alternative
    const birchLogs = helpers.findBlocks(bot, 'birch_log', 30, 1);
    if (birchLogs.length > 0) {
      await helpers.collect(bot, 'birch_log', 1, { maxDistance: 30 });
      await helpers.craft(bot, 'birch_planks', 4);
      await helpers.craft(bot, 'crafting_table', 1);
    } else {
      // No logs found, go back to anchor and try to gather more
      await helpers.gotoAnchor(bot, ctx.anchor);
      // We need to gather logs from the survey data
      const survey = ctx.state.survey;
      if (survey.oak_log > 0) {
        // Find and collect oak logs
        const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
        if (oakLogBlock) {
          await helpers.collect(bot, 'oak_log', 1, { maxDistance: 30 });
          await helpers.craft(bot, 'oak_planks', 4);
          await helpers.craft(bot, 'crafting_table', 1);
        } else {
          throw new Error('No oak logs found to craft a crafting table');
        }
      } else if (survey.birch_log > 0) {
        // Find and collect birch logs
        const birchLogBlock = helpers.findBlock(bot, 'birch_log', 30);
        if (birchLogBlock) {
          await helpers.collect(bot, 'birch_log', 1, { maxDistance: 30 });
          await helpers.craft(bot, 'birch_planks', 4);
          await helpers.craft(bot, 'crafting_table', 1);
        } else {
          throw new Error('No birch logs found to craft a crafting table');
        }
      } else {
        throw new Error('No oak or birch logs found to craft a crafting table');
      }
    }
  }
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