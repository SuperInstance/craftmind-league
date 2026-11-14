// skill: gatherStoneForPickaxe
// stage: S2
// purpose: Gather cobblestone to craft a stone pickaxe
// postconditions: Stone pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, ensure we're at the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough cobblestone to craft a pickaxe (3 cobblestone)
  const cobblestoneCount = helpers.count(bot, 'cobblestone');
  if (cobblestoneCount >= 3) {
    // We already have enough cobblestone, skip mining
    return;
  }
  
  // Find stone deposits marked in survey
  const stoneBlocks = helpers.findBlocks(bot, 'stone', 30, 10);
  if (stoneBlocks.length === 0) {
    throw new Error("No stone blocks found in survey area");
  }
  
  // Mine the first stone block we find
  const stoneBlock = stoneBlocks[0];
  await helpers.goto(bot, stoneBlock.x, stoneBlock.y, stoneBlock.z, 1);
  await bot.dig(bot.blockAt(stoneBlock));
  
  // Wait a bit for the block to be mined and dropped
  await helpers.sleep(1000);
  
  // Collect the cobblestone
  const cobblestone = helpers.findBlock(bot, 'cobblestone', 5);
  if (cobblestone) {
    await helpers.goto(bot, cobblestone.x, cobblestone.y, cobblestone.z, 1);
    await helpers.collect(bot, 'cobblestone', 1);
  } else {
    throw new Error("Failed to find cobblestone after mining stone block");
  }
  
  // Mine more cobblestone if needed
  const remainingCobblestone = 3 - helpers.count(bot, 'cobblestone');
  if (remainingCobblestone > 0) {
    const cobblestoneBlocks = helpers.findBlocks(bot, 'cobblestone', 30, remainingCobblestone);
    for (const block of cobblestoneBlocks) {
      await helpers.goto(bot, block.x, block.y, block.z, 1);
      await bot.dig(bot.blockAt(block));
      await helpers.sleep(1000);
    }
    
    // Collect the remaining cobblestone
    for (let i = 0; i < remainingCobblestone; i++) {
      const cobblestone = helpers.findBlock(bot, 'cobblestone', 5);
      if (cobblestone) {
        await helpers.goto(bot, cobblestone.x, cobblestone.y, cobblestone.z, 1);
        await helpers.collect(bot, 'cobblestone', 1);
      }
    }
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasPickaxe = helpers.has(bot, 'stone_pickaxe', 1);
  const hasCobblestone = helpers.count(bot, 'cobblestone') >= 3;
  
  return {
    ok: hasPickaxe && hasCobblestone,
    evidence: {
      hasStonePickaxe: hasPickaxe,
      hasCobblestone: hasCobblestone,
      cobblestoneCount: helpers.count(bot, 'cobblestone')
    }
  };
};
