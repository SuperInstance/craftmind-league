module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Gather logs and craft tools' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    
    // Check if goal already achieved
    if (prims.countItem(bot, 'crafting_table') >= 1 && prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    // Move outside spawn protection area if needed
    const spawnPoint = { x: 32, z: -96 };
    const distanceFromSpawn = Math.sqrt(Math.pow(bot.entity.position.x - spawnPoint.x, 2) + Math.pow(bot.entity.position.z - spawnPoint.z, 2));
    if (distanceFromSpawn <= 16) {
      // Move to a safe location outside spawn protection
      const safeX = spawnPoint.x + 20;
      const safeZ = spawnPoint.z + 20;
      const result = await prims.walkTo(bot, safeX, bot.entity.position.y, safeZ, 2);
      if (!result.ok) {
        return { done: false };
      }
      await prims.sleep(1000);
    }
    
    // Find and mine logs if we don't have enough
    if (prims.countItem(bot, 'oak_log') < 4) {
      const logs = await prims.findBlocks(bot, ['oak_log'], 32, 8);
      if (logs.length > 0) {
        const logPos = logs[0];
        const result = await prims.digBlock(bot, logPos);
        if (result.ok) {
          await prims.collectDrops(bot, 7, 12000);
        } else {
          // If digging fails, try another log
          await prims.sleep(1000);
        }
      } else {
        // If no logs found, try to find a tree nearby
        const trees = await prims.findBlocks(bot, ['oak_log'], 10, 1);
        if (trees.length > 0) {
          const treePos = trees[0];
          const result = await prims.digBlock(bot, treePos);
          if (result.ok) {
            await prims.collectDrops(bot, 7, 12000);
          } else {
            // If digging fails, try another tree
            await prims.sleep(1000);
          }
        }
      }
    }
    
    // Craft planks from logs (4 logs = 4 planks)
    if (prims.countItem(bot, 'oak_log') >= 4) {
      const result = await prims.craftByName(bot, 'oak_planks', 4);
      if (result.ok) {
        await prims.collectDrops(bot, 7, 12000);
      }
    }
    
    // Craft sticks from planks (4 planks = 4 sticks)
    if (prims.countItem(bot, 'oak_planks') >= 4) {
      const result = await prims.craftByName(bot, 'stick', 4);
      if (result.ok) {
        await prims.collectDrops(bot, 7, 12000);
      }
    }
    
    // Place crafting table if we have enough planks and haven't placed one yet
    if (prims.countItem(bot, 'oak_planks') >= 4 && prims.countItem(bot, 'crafting_table') < 1) {
      // Find a suitable position to place the table (nearby, not in spawn protection)
      const anchor = ctx.anchor;
      const tableX = anchor.x + 5;
      const tableZ = anchor.z - 5;
      const tableY = prims.groundY(bot, tableX, tableZ);
      
      if (tableY !== null) {
        const result = await prims.placeOnTop(bot, 'crafting_table', new ctx.Vec3(tableX, tableY, tableZ));
        if (result.ok) {
          await prims.sleep(1000);
        }
      }
    }
    
    // Craft wooden pickaxe if we have the table and required materials
    if (prims.countItem(bot, 'crafting_table') >= 1 && prims.countItem(bot, 'oak_planks') >= 3 && prims.countItem(bot, 'stick') >= 2) {
      // Get the position of the placed crafting table
      const tables = await prims.findBlocks(bot, ['crafting_table'], 32, 1);
      if (tables.length > 0) {
        const tablePos = tables[0];
        const result = await prims.craftByName(bot, 'wooden_pickaxe', 1, tablePos);
        if (result.ok) {
          await prims.collectDrops(bot, 7, 12000);
        }
      }
    }
    
    return { done: false };
  }
};
