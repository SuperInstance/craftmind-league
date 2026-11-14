module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Exit hollow, gather logs, craft crafting table and wooden pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { x, y, z } = bot.entity.position;
    
    // Check if we already have the goal item (wooden_pickaxe in inventory)
    if (prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    // Check for hostile mobs and flee if needed
    const entities = bot.entities;
    let nearestHostile = null;
    let minDistance = 100;
    
    for (const entity of Object.values(entities)) {
      if (entity.name === 'zombie' || entity.name === 'skeleton' || entity.name === 'creeper') {
        const distance = Math.sqrt(Math.pow(entity.position.x - x, 2) + Math.pow(entity.position.z - z, 2));
        if (distance < minDistance) {
          minDistance = distance;
          nearestHostile = entity;
        }
      }
    }
    
    if (nearestHostile && minDistance < 14) {
      // Flee uphill into open sun
      const dirX = x - nearestHostile.position.x;
      const dirZ = z - nearestHostile.position.z;
      const fleeX = x + (dirX / Math.sqrt(dirX*dirX + dirZ*dirZ)) * 14;
      const fleeZ = z + (dirZ / Math.sqrt(dirX*dirX + dirZ*dirZ)) * 14;
      const fleeY = prims.groundY(bot, fleeX, fleeZ) + 10;
      
      const result = await prims.walkTo(bot, fleeX, fleeY, fleeZ, 2, 30000);
      if (!result.ok) {
        return { done: false };
      }
      
      // Wait and re-scan for safety
      await prims.sleep(2000);
      return { done: false };
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
      } else if (z < -90) {
        // Second leg: go north to (68, 67, -90)
        const result = await prims.walkTo(bot, 68, y, -90, 2, 30000);
        if (!result.ok) {
          return { done: false };
        }
        return { done: false };
      }
    }
    
    // Gather logs if needed
    const logs = prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 1);
    if (logs.length > 0) {
      const logPos = logs[0];
      const result = await prims.digBlock(bot, logPos, 25000);
      if (!result.ok) {
        // Try a different log if this one fails
        return { done: false };
      }
      // Collect the dropped items
      await prims.collectDrops(bot, 7, 12000);
      return { done: false };
    }
    
    // Check inventory for planks to craft table
    const oakPlanks = prims.countItem(bot, 'oak_planks');
    const birchPlanks = prims.countItem(bot, 'birch_planks');
    const totalPlanks = oakPlanks + birchPlanks;
    
    // Craft planks if we have logs
    if (prims.hasItem(bot, 'oak_log') || prims.hasItem(bot, 'birch_log')) {
      const logType = prims.hasItem(bot, 'oak_log') ? 'oak' : 'birch';
      const plankType = logType + '_planks';
      const result = await prims.craftByName(bot, plankType, 1, null);
      if (result.ok) {
        return { done: false };
      }
    }
    
    // Craft crafting table if we have 4 planks
    if (totalPlanks >= 4) {
      const result = await prims.craftByName(bot, 'crafting_table', 1, null);
      if (result.ok) {
        // Place the crafting table
        const refPos = bot.entity.position.offset(1, -1, 0); // Ground block beside Cody
        const placeResult = await prims.placeOnTop(bot, 'crafting_table', refPos);
        if (placeResult.ok) {
          return { done: false };
        }
      }
    }
    
    // Craft sticks if we have planks
    if (totalPlanks >= 2) {
      const result = await prims.craftByName(bot, 'stick', 1, null);
      if (result.ok) {
        return { done: false };
      }
    }
    
    // Craft wooden pickaxe if we have table and required materials
    const sticks = prims.countItem(bot, 'stick');
    if (prims.hasItem(bot, 'crafting_table') && totalPlanks >= 3 && sticks >= 2) {
      const tablePos = bot.entity.position.offset(1, 0, 0); // Position where table was placed
      const result = await prims.craftByName(bot, 'wooden_pickaxe', 1, tablePos);
      if (result.ok) {
        return { done: false };
      }
    }
    
    // If we have no logs and no planks, try to find more logs
    if (totalPlanks === 0 && !prims.hasItem(bot, 'oak_log') && !prims.hasItem(bot, 'birch_log')) {
      const logs = prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 1);
      if (logs.length > 0) {
        const logPos = logs[0];
        const result = await prims.digBlock(bot, logPos, 25000);
        if (!result.ok) {
          return { done: false };
        }
        // Collect the dropped items
        await prims.collectDrops(bot, 7, 12000);
        return { done: false };
      }
    }
    
    // If we're in a safe spot and have no logs, start gathering
    if (distanceFromSpawn > 16) {
      const logs = prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 1);
      if (logs.length > 0) {
        const logPos = logs[0];
        const result = await prims.digBlock(bot, logPos, 25000);
        if (!result.ok) {
          return { done: false };
        }
        // Collect the dropped items
        await prims.collectDrops(bot, 7, 12000);
        return { done: false };
      }
    }
    
    return { done: false };
  }
};
