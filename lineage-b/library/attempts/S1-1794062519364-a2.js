// skill: buildCraftingTable
// stage: S1
// purpose: Build a crafting table using oak planks and oak logs, then craft a wooden pickaxe
// postconditions: A crafting table is placed or carried within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, ensure we're at the anchor
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check if we have enough oak planks to build a crafting table
  const planksCount = helpers.count(bot, 'oak_planks');
  if (planksCount < 4) {
    // We need to make more planks from logs
    const logsCount = helpers.count(bot, 'oak_log');
    if (logsCount < 1) {
      throw new Error(`Not enough oak logs to make planks. Have ${logsCount}, need at least 1.`);
    }
    
    // Craft planks from logs
    await helpers.craft(bot, 'oak_planks', 1);
  }
  
  // Verify we have enough planks now
  const updatedPlanksCount = helpers.count(bot, 'oak_planks');
  if (updatedPlanksCount < 4) {
    throw new Error(`Not enough oak planks after crafting. Have ${updatedPlanksCount}, need 4.`);
  }
  
  // Check if we have a crafting table in inventory
  if (!helpers.has(bot, 'crafting_table', 1)) {
    // We need to craft a crafting table
    await helpers.craft(bot, 'crafting_table', 1);
  }
  
  // Place the crafting table
  const ground = helpers.groundHeight(bot, ctx.anchor.x, ctx.anchor.z, ctx.anchor.y);
  const placeX = ctx.anchor.x;
  const placeY = ground + 1;
  const placeZ = ctx.anchor.z;
  
  await helpers.placeAt(bot, 'crafting_table', placeX, placeY, placeZ);
  
  // Now we need to craft a wooden pickaxe
  // Check if we have a crafting table nearby
  const tableNearby = bot.findBlock({
    matching: (block) => block.name === 'crafting_table',
    maxDistance: 20
  });
  
  if (!tableNearby) {
    throw new Error('No crafting table found nearby to craft wooden pickaxe');
  }
  
  // Craft a wooden pickaxe
  await helpers.craft(bot, 'wooden_pickaxe', 1);
  
  // Verify we have the wooden pickaxe
  if (!helpers.has(bot, 'wooden_pickaxe', 1)) {
    throw new Error('Failed to craft wooden pickaxe');
  }
  
  // Verify we have a crafting table nearby or carried
  const craftingTableNearby = bot.findBlock({
    matching: (block) => block.name === 'crafting_table',
    maxDistance: 20
  });
  
  if (!craftingTableNearby && !helpers.has(bot, 'crafting_table', 1)) {
    throw new Error('No crafting table found nearby or carried');
  }
};

module.exports.post = async (bot, helpers, ctx) => {
  const craftingTableNearby = bot.findBlock({
    matching: (block) => block.name === 'crafting_table',
    maxDistance: 20
  });
  
  const hasCraftingTable = craftingTableNearby !== null || helpers.has(bot, 'crafting_table', 1);
  const hasWoodenPickaxe = helpers.has(bot, 'wooden_pickaxe', 1);
  
  return {
    ok: hasCraftingTable && hasWoodenPickaxe,
    evidence: {
      craftingTableNearby: craftingTableNearby !== null,
      craftingTableInInventory: helpers.has(bot, 'crafting_table', 1),
      woodenPickaxeInInventory: helpers.has(bot, 'wooden_pickaxe', 1)
    }
  };
};