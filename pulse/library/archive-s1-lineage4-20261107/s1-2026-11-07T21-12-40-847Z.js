module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Exit hollow, gather logs, craft crafting table and wooden pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { x, y, z } = bot.entity.position;
    
    // Check if we already have the goal items
    if (prims.countItem(bot, 'crafting_table') >= 1 || prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    // If inside the spawn protection zone, move outside first
    const spawnX = 32;
    const spawnZ = -96;
    const distanceFromSpawn = Math.sqrt(Math.pow(x - spawnX, 2) + Math.pow(z - spawnZ, 2));
    
    if (distanceFromSpawn <= 16) {
      // Move to a safe spot outside spawn protection
      const safeX = 50;
      const safeZ = -100;
      const result = await prims.walkTo(bot, safeX, y, safeZ, 2, 30000);
      if (!result.ok) {
        return { done: false };
      }
      return { done: false };
    }
    
    // Check if we're in the hollow area that's unreachable from inside
    if (x >= 69 && x <= 75 && z >= -89 && z <= -84 && y <= 65) {
      // Exit the hollow by going west then north
      if (x > 68.5) {
        // First leg: go west to (68, 65, -88)
        const result = await prims.walkTo(bot, 68, y, -88, 2, 30000);
        if (!result.ok) {
          return { done: false };
        }
        return { done: false };
      } else if (z > -90) {
        // Second leg: go north to (68, 67, -90)
        const result = await prims.walkTo(bot, 68, y, -90, 2, 30000);
        if (!result.ok) {
          return { done: false };
        }
        return { done: false };
      }
    }
    
    // Find and gather logs
    const logs = await prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 1);
    if (logs.length > 0) {
      const logPos = logs[0];
      const result = await prims.digBlock(bot, logPos, 15000);
      if (result.ok) {
        // Collect the dropped items
        await prims.collectDrops(bot, 7, 10000);
        return { done: false };
      } else {
        // If dig failed, move to a different location
        const result = await prims.walkTo(bot, logPos.x + 2, y, logPos.z, 2, 10000);
        if (!result.ok) {
          return { done: false };
        }
        return { done: false };
      }
    }
    
    // Check if we have enough planks to craft a table
    const oakPlanks = prims.countItem(bot, 'oak_planks');
    const birchPlanks = prims.countItem(bot, 'birch_planks');
    const totalPlanks = oakPlanks + birchPlanks;
    
    if (totalPlanks >= 4) {
      // Craft a crafting table
      const result = await prims.craftByName(bot, 'crafting_table', 1, null);
      if (result.ok) {
        // Place the crafting table
        const tablePos = bot.entity.position.offset(1, 0, 0);
        const placeResult = await prims.placeOnTop(bot, 'crafting_table', tablePos);
        if (placeResult.ok) {
          // Now craft a wooden pickaxe
          const pickaxeResult = await prims.craftByName(bot, 'wooden_pickaxe', 1, tablePos);
          if (pickaxeResult.ok) {
            return { done: true };
          }
        }
      }
    }
    
    // If we don't have enough planks, check if we have logs to gather
    const logsInInventory = prims.countItem(bot, 'oak_log') + prims.countItem(bot, 'birch_log');
    if (logsInInventory > 0) {
      // Craft planks from logs
      const result = await prims.craftByName(bot, 'oak_planks', 1, null);
      if (result.ok) {
        return { done: false };
      }
    }
    
    // If we have no logs and no planks, we need to gather more logs
    return { done: false };
  }
};
