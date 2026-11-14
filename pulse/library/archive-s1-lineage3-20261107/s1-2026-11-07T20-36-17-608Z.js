module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Escape hollow, gather logs, craft planks, table, and pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { Vec3 } = ctx;
    
    // Check if we already have the goal items
    if (prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    // If we're in the trapped hollow, move out first
    if (bot.entity.position.x >= 69 && bot.entity.position.x <= 75 && 
        bot.entity.position.z >= -89 && bot.entity.position.z <= -84 &&
        bot.entity.position.y <= 65) {
      // Move to a safe position outside the hollow
      const safePos = new Vec3(68, 65, -90);
      const result = await prims.walkTo(bot, safePos.x, safePos.y, safePos.z, 1.5);
      if (!result.ok) {
        return { done: false };
      }
      return { done: false };
    }
    
    // Find and mine logs
    const logs = await prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 8);
    if (logs.length > 0) {
      const logPos = logs[0];
      const result = await prims.digBlock(bot, logPos);
      if (result.ok) {
        // Collect the dropped items
        await prims.collectDrops(bot, 7);
        return { done: false };
      } else {
        // Try a different log if this one fails
        return { done: false };
      }
    }
    
    // Check if we have enough planks to make a crafting table
    const planksCount = prims.countItem(bot, 'oak_planks') + prims.countItem(bot, 'birch_planks');
    if (planksCount < 4) {
      // Need to craft planks from logs
      const logCount = prims.countItem(bot, 'oak_log') + prims.countItem(bot, 'birch_log');
      if (logCount >= 1) {
        // Craft planks
        await prims.craftByName(bot, 'oak_planks', 1);
        return { done: false };
      }
      return { done: false };
    }
    
    // Place crafting table
    const tablePos = bot.entity.position.offset(1, 0, 0);
    const groundPos = bot.entity.position.offset(1, -1, 0);
    
    // Check if we have a crafting table in inventory
    if (prims.countItem(bot, 'crafting_table') >= 1) {
      // Place the table
      const result = await prims.placeOnTop(bot, 'crafting_table', groundPos);
      if (result.ok) {
        // Craft wooden pickaxe
        await prims.craftByName(bot, 'wooden_pickaxe', 1, tablePos);
        return { done: true };
      }
      return { done: false };
    }
    
    // Need to craft crafting table first
    if (planksCount >= 4) {
      // Craft the crafting table
      await prims.craftByName(bot, 'crafting_table', 1);
      return { done: false };
    }
    
    return { done: false };
  }
};
