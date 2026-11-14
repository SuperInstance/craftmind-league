module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Exit hollow, gather logs, craft crafting table and wooden pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { x, y, z } = bot.entity.position;
    
    // Check if we already have the goal items
    if (prims.countItem(bot, 'crafting_table') >= 1 || prims.countItem(bot, 'wooden_pickaxe') >= 1) {
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
      } else if (z > -90) {
        // Second leg: go north to (68, 67, -90)
        const result = await prims.walkTo(bot, 68, y, -90, 2, 30000);
        if (!result.ok) {
          return { done: false };
        }
        return { done: false };
      }
    }
    
    // Gather logs if we don't have enough
    const logs = prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 8);
    if (logs.length > 0) {
      const logPos = logs[0];
      const result = await prims.digBlock(bot, logPos, 25000);
      if (!result.ok) {
        // Move away from failed dig spot
        const moveX = logPos.x + (Math.random() - 0.5) * 5;
        const moveZ = logPos.z + (Math.random() - 0.5) * 5;
        await prims.walkTo(bot, moveX, y, moveZ, 2, 10000);
        return { done: false };
      }
      return { done: false };
    }
    
    // Collect dropped items
    const collected = await prims.collectDrops(bot, 7, 12000);
    if (collected.ok) {
      return { done: false };
    }
    
    // Craft planks from logs
    const logCount = prims.countItem(bot, 'oak_log') + prims.countItem(bot, 'birch_log');
    if (logCount >= 1) {
      const result = await prims.craftByName(bot, 'oak_planks', 1, null);
      if (!result.ok) {
        return { done: false };
      }
      return { done: false };
    }
    
    // Craft sticks from planks
    const plankCount = prims.countItem(bot, 'oak_planks');
    if (plankCount >= 2) {
      const result = await prims.craftByName(bot, 'stick', 1, null);
      if (!result.ok) {
        return { done: false };
      }
      return { done: false };
    }
    
    // Craft crafting table
    if (plankCount >= 4) {
      const result = await prims.craftByName(bot, 'crafting_table', 1, null);
      if (!result.ok) {
        return { done: false };
      }
      return { done: false };
    }
    
    // Place crafting table
    const tableCount = prims.countItem(bot, 'crafting_table');
    if (tableCount >= 1) {
      const tablePos = bot.entity.position.offset(1, 0, 0);
      const result = await prims.placeOnTop(bot, 'crafting_table', tablePos);
      if (!result.ok) {
        return { done: false };
      }
      return { done: false };
    }
    
    // Craft wooden pickaxe
    const stickCount = prims.countItem(bot, 'stick');
    if (stickCount >= 2) {
      const tablePos = bot.entity.position.offset(1, 0, 0);
      const result = await prims.craftByName(bot, 'wooden_pickaxe', 1, tablePos);
      if (!result.ok) {
        return { done: false };
      }
      return { done: false };
    }
    
    return { done: false };
  }
};
