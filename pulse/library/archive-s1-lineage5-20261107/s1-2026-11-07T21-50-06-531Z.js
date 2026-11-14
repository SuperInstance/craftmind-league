module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Gather logs, craft planks, crafting table, sticks, and wooden pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { x, y, z } = bot.entity.position;
    
    // Check if stage goal already met
    if (prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    // Scan for hostiles and handle survival
    const hostileEntities = bot.entities.filter(e => 
      e.name === 'zombie' || e.name === 'skeleton' || e.name === 'creeper'
    );
    
    if (hostileEntities.length > 0) {
      const nearestHostile = hostileEntities.reduce((nearest, entity) => {
        const dist = bot.entity.position.distanceTo(entity.position);
        return !nearest || dist < nearest.dist ? { entity, dist } : nearest;
      }, null);
      
      if (nearestHostile && nearestHostile.dist < 14) {
        // Flee to higher ground away from hostile
        const fleeDir = bot.entity.position.clone().subtract(nearestHostile.entity.position);
        const fleePos = bot.entity.position.clone().add(fleeDir.normalize().scale(14));
        const groundY = prims.groundY(bot, fleePos.x, fleePos.z);
        if (groundY !== null) {
          const safePos = new ctx.Vec3(fleePos.x, groundY + 1, fleePos.z);
          const result = await prims.walkTo(bot, safePos.x, safePos.y, safePos.z, 1.5, 10000);
          if (result.ok) {
            // Wait and re-scan
            await prims.sleep(3000);
            const recheckHostiles = bot.entities.filter(e => 
              e.name === 'zombie' || e.name === 'skeleton' || e.name === 'creeper'
            );
            const stillHostile = recheckHostiles.some(e => 
              bot.entity.position.distanceTo(e.position) < 14
            );
            if (stillHostile) {
              return { done: false };
            }
          }
        }
        return { done: false };
      }
    }
    
    // Exit hollow area if needed
    if (x >= 68 && z <= -88 && y <= 65) {
      if (x > 68.5) {
        // First leg: walk west to (68, 65, -88)
        const result = await prims.walkTo(bot, 68, 65, -88, 1.5, 15000);
        if (!result.ok) {
          return { done: false };
        }
      } else {
        // Second leg: walk north to (68, 67, -90)
        const result = await prims.walkTo(bot, 68, 67, -90, 1.5, 15000);
        if (!result.ok) {
          return { done: false };
        }
      }
      return { done: false };
    }
    
    // Check inventory for materials needed for crafting
    const logs = prims.countItem(bot, 'oak_log') + prims.countItem(bot, 'birch_log');
    const planks = prims.countItem(bot, 'oak_planks') + prims.countItem(bot, 'birch_planks');
    const sticks = prims.countItem(bot, 'stick');
    const craftingTable = prims.countItem(bot, 'crafting_table');
    
    // Craft planks from logs if we have logs
    if (logs > 0) {
      const logType = prims.hasItem(bot, 'oak_log') ? 'oak_log' : 'birch_log';
      const plankType = logType === 'oak_log' ? 'oak_planks' : 'birch_planks';
      const logCount = prims.countItem(bot, logType);
      const plankCount = prims.countItem(bot, plankType);
      
      // Craft planks (2x2 grid)
      const toCraft = Math.min(logCount, 4 - plankCount);
      if (toCraft > 0) {
        const result = await prims.craftByName(bot, plankType, toCraft, null);
        if (!result.ok) {
          return { done: false };
        }
      }
    }
    
    // Craft crafting table if we have 4 planks
    if (planks >= 4 && craftingTable === 0) {
      const result = await prims.craftByName(bot, 'crafting_table', 1, null);
      if (!result.ok) {
        return { done: false };
      }
    }
    
    // Place crafting table if we have it
    if (prims.hasItem(bot, 'crafting_table') && craftingTable === 0) {
      const tablePos = bot.entity.position.offset(1, -1, 0);
      const result = await prims.placeOnTop(bot, 'crafting_table', tablePos);
      if (!result.ok) {
        return { done: false };
      }
    }
    
    // Craft sticks if we have planks
    if (planks >= 2) {
      const result = await prims.craftByName(bot, 'stick', 4, null);
      if (!result.ok) {
        return { done: false };
      }
    }
    
    // Craft wooden pickaxe if we have table and materials
    if (prims.hasItem(bot, 'crafting_table') && planks >= 3 && sticks >= 2) {
      const tableBlock = prims.findBlocks(bot, ['crafting_table'], 16, 1)[0];
      if (tableBlock) {
        const result = await prims.craftByName(bot, 'wooden_pickaxe', 1, tableBlock);
        if (!result.ok) {
          return { done: false };
        }
      }
    }
    
    // Gather logs if we don't have enough
    if (logs < 3) {
      const logBlocks = prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 1);
      if (logBlocks.length > 0) {
        const logBlock = logBlocks[0];
        const result = await prims.digBlock(bot, logBlock, 10000);
        if (!result.ok) {
          return { done: false };
        }
        await prims.sleep(1000);
        await prims.collectDrops(bot, 7, 5000);
        return { done: false };
      }
    }
    
    return { done: false };
  }
};
