// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak planks and oak logs to enable crafting of wooden tools
// postconditions: Crafting table is placed within 20 blocks and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to the anchor if far away
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough materials
  if (!helpers.has(bot, "oak_planks", 4)) {
    throw new Error("Not enough oak planks to build crafting table");
  }
  
  // Craft the crafting table
  await helpers.craft(bot, "crafting_table", 1);
  
  // Check if crafting table was successful
  if (!helpers.has(bot, "crafting_table", 1)) {
    throw new Error("Failed to craft crafting table");
  }
  
  // Place the crafting table near the anchor
  const placeX = ctx.anchor.x;
  const placeY = ctx.anchor.y;
  const placeZ = ctx.anchor.z;
  
  // Find a suitable block to place the crafting table on
  const groundY = helpers.groundHeight(bot, placeX, placeZ, placeY);
  if (groundY === null) {
    throw new Error("Could not find suitable ground height for crafting table");
  }
  
  // Place the crafting table
  await helpers.placeAt(bot, "crafting_table", placeX, groundY + 1, placeZ);
  
  // Verify the crafting table was placed
  const craftingTableBlock = bot.blockAt(v3(placeX, groundY + 1, placeZ));
  if (!craftingTableBlock || craftingTableBlock.name !== "crafting_table") {
    throw new Error("Failed to place crafting table");
  }
  
  // Craft a wooden pickaxe using the crafting table
  await helpers.craft(bot, "wooden_pickaxe", 1);
  
  // Verify the wooden pickaxe was crafted
  if (!helpers.has(bot, "wooden_pickaxe", 1)) {
    throw new Error("Failed to craft wooden pickaxe");
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = helpers.findBlock(bot, "crafting_table", 20);
  const hasPickaxe = helpers.has(bot, "wooden_pickaxe", 1);
  
  return {
    ok: craftingTableNearby !== null && hasPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      hasPickaxe: hasPickaxe,
      craftingTablePosition: craftingTableNearby ? craftingTableNearby.position : null
    }
  };
};
