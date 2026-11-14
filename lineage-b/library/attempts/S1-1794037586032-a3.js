// skill: gatherWoodForTools
// stage: S1
// purpose: Gather oak logs to craft a crafting table and wooden pickaxe
// postconditions: Crafting table in inventory or nearby, and wooden pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak logs
  const oakLogs = helpers.count(bot, 'oak_log');
  if (oakLogs < 4) {
    // Find oak logs nearby using survey data
    const surveyData = ctx.state.survey;
    if (surveyData.oak_log < 4) {
      // Try to find oak logs in a different way
      const oakLogBlock = helpers.findBlock(bot, 'oak_log', 30);
      if (!oakLogBlock) {
        // If no oak logs found, try to find a tree and chop it down
        const treeBlock = helpers.findBlock(bot, 'oak_log', 30);
        if (!treeBlock) {
          // Try to find a tree by looking for leaves
          const leavesBlock = helpers.findBlock(bot, 'oak_leaves', 30);
          if (!leavesBlock) {
            // If no leaves found, try to find a tree by looking for a log and then chopping it
            const logBlock = helpers.findBlock(bot, 'oak_log', 30);
            if (!logBlock) {
              throw new Error('No oak logs or trees found within 30 blocks');
            }
            // Dig the log block
            await bot.dig(logBlock);
            // Wait for the block to be broken and collected
            await helpers.sleep(1000);
          } else {
            // Find the trunk below the leaves
            const trunkBlock = helpers.findBlock(bot, 'oak_log', 30);
            if (!trunkBlock) {
              throw new Error('No oak trunk found below leaves');
            }
            // Dig the trunk block
            await bot.dig(trunkBlock);
            // Wait for the block to be broken and collected
            await helpers.sleep(1000);
          }
        } else {
          // Dig the tree block
          await bot.dig(treeBlock);
          // Wait for the block to be broken and collected
          await helpers.sleep(1000);
        }
      } else {
        // Collect oak logs
        await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
      }
    } else {
      // Collect oak logs
      await helpers.collect(bot, 'oak_log', 4, { maxDistance: 30 });
    }
  }
  
  // Craft a crafting table
  await helpers.craft(bot, 'crafting_table', 1);
  
  // Verify crafting table was crafted
  if (!helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('Failed to craft crafting table');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify wooden pickaxe was crafted
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
      hasCraftingTable,
      hasWoodenPickaxe
    }
  };
};