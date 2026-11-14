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
    
    // Find and mine logs
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
    
    // Craft planks from logs
    if (prims.countItem(bot, 'oak_log') >= 4) {
      const result = await prims.craftByName(bot, 'oak_planks', 4);
      if (result.ok) {
        await prims.collectDrops(bot, 7, 12000);
      }
    }
    
    // Craft sticks from planks (need 4 planks for 4 sticks)
    if (prims.countItem(bot, 'oak_planks') >= 4) {
      const result = await prims.craftByName(bot, 'stick', 4);
      if (result.ok) {
        await prims.collectDrops(bot, 7, 12000);
      }
    }
    
    // Place crafting table if we have enough planks and haven't placed one yet
    if (prims.countItem(bot, 'oak_planks') >= 4 && prims.countItem(bot, 'crafting_table') < 1) {
      // Find a suitable position to place the table
      const tablePos = new ctx.Vec3(bot.entity.position.x, bot.entity.position.y, bot.entity.position.z);
      const result = await prims.placeOnTop(bot, 'crafting_table', tablePos);
      if (result.ok) {
        await prims.say(bot, "Crafting table placed");
      } else {
        // If placement fails, try a different position
        const result2 = await prims.walkTo(bot, bot.entity.position.x + 2, bot.entity.position.y, bot.entity.position.z, 1.5);
        if (result2.ok) {
          const result3 = await prims.placeOnTop(bot, 'crafting_table', tablePos.offset(0, 1, 0));
          if (result3.ok) {
            await prims.say(bot, "Crafting table placed");
          }
        }
      }
    }
    
    // Craft wooden pickaxe if we have a crafting table and enough materials
    if (prims.countItem(bot, 'crafting_table') >= 1 && prims.countItem(bot, 'oak_planks') >= 3 && prims.countItem(bot, 'stick') >= 2) {
      const tablePos = new ctx.Vec3(bot.entity.position.x, bot.entity.position.y, bot.entity.position.z);
      const result = await prims.craftByName(bot, 'wooden_pickaxe', 1, tablePos);
      if (result.ok) {
        await prims.collectDrops(bot, 7, 12000);
        await prims.say(bot, "Wooden pickaxe crafted");
      }
    }
    
    return { done: false };
  }
};
