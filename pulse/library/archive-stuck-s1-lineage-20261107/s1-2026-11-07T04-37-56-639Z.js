module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Gather logs and craft tools' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    
    // Check if goal already achieved
    if (prims.countItem(bot, 'crafting_table') >= 1 && prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    // If no crafting table in inventory, look for logs and mine them
    if (prims.countItem(bot, 'crafting_table') < 1) {
      const logs = await prims.findBlocks(bot, ['oak_log'], 32, 8);
      if (logs.length > 0) {
        const logPos = logs[0];
        const result = await prims.digBlock(bot, logPos);
        if (result.ok) {
          await prims.collectDrops(bot, 7, 12000);
        }
      } else {
        // If no logs found, try to find a tree nearby
        const trees = await prims.findBlocks(bot, ['oak_log'], 10, 1);
        if (trees.length > 0) {
          const treePos = trees[0];
          const result = await prims.digBlock(bot, treePos);
          if (result.ok) {
            await prims.collectDrops(bot, 7, 12000);
          }
        }
      }
    }
    
    // Craft planks from logs
    if (prims.countItem(bot, 'oak_log') >= 1) {
      const result = await prims.craftByName(bot, 'oak_planks', 4);
      if (result.ok) {
        await prims.collectDrops(bot, 7, 12000);
      }
    }
    
    // Craft sticks from planks
    if (prims.countItem(bot, 'oak_planks') >= 4) {
      const result = await prims.craftByName(bot, 'stick', 4);
      if (result.ok) {
        await prims.collectDrops(bot, 7, 12000);
      }
    }
    
    // Place crafting table
    if (prims.countItem(bot, 'oak_planks') >= 4 && prims.countItem(bot, 'crafting_table') < 1) {
      const result = await prims.placeOnTop(bot, 'crafting_table', bot.entity.position.offset(0, 1, 0));
      if (result.ok) {
        await prims.sleep(1000);
      }
    }
    
    // Craft wooden pickaxe using crafting table
    if (prims.countItem(bot, 'oak_planks') >= 3 && prims.countItem(bot, 'stick') >= 2) {
      const tablePos = bot.blockAt(bot.entity.position.offset(0, 1, 0));
      if (tablePos && tablePos.name === 'crafting_table') {
        const result = await prims.craftByName(bot, 'wooden_pickaxe', 1, bot.entity.position.offset(0, 1, 0));
        if (result.ok) {
          await prims.collectDrops(bot, 7, 12000);
        }
      }
    }
    
    // Check final state
    if (prims.countItem(bot, 'crafting_table') >= 1 && prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    return { done: false };
  }
};
