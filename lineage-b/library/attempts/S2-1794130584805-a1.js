// skill: gatherStoneForPickaxe
// stage: S2
// purpose: Gather stone blocks to craft a stone pickaxe using the wooden pickaxe
// postconditions: Stone pickaxe in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor if needed
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Verify we have enough oak logs and sticks for crafting
  if (!helpers.has(bot, "oak_log", 3)) {
    throw new Error("Not enough oak logs for crafting table");
  }
  
  if (!helpers.has(bot, "stick", 2)) {
    throw new Error("Not enough sticks for crafting table");
  }
  
  // Check if we have a crafting table
  const craftingTable = helpers.findBlock(bot, "crafting_table", 10);
  if (!craftingTable) {
    // Need to build crafting table first
    await helpers.craft(bot, "crafting_table", 1);
    
    // Verify crafting table was created
    const craftingTableAfter = helpers.findBlock(bot, "crafting_table", 10);
    if (!craftingTableAfter) {
      throw new Error("Failed to craft crafting table");
    }
  }
  
  // Now find stone blocks nearby to mine
  const stoneBlock = helpers.findBlock(bot, "stone", 10);
  if (!stoneBlock) {
    throw new Error("No stone block found nearby");
  }
  
  // Mine the stone block
  await bot.dig(stoneBlock);
  
  // Verify we have cobblestone now
  const cobblestoneCount = helpers.count(bot, "cobblestone");
  if (cobblestoneCount < 3) {
    throw new Error("Not enough cobblestone mined");
  }
  
  // Craft the stone pickaxe
  await helpers.craft(bot, "stone_pickaxe", 1);
  
  // Verify we have the stone pickaxe
  if (!helpers.has(bot, "stone_pickaxe", 1)) {
    throw new Error("Failed to craft stone pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const hasPickaxe = helpers.has(bot, "stone_pickaxe", 1);
  return {
    ok: hasPickaxe,
    evidence: {
      hasStonePickaxe: hasPickaxe
    }
  };
};
