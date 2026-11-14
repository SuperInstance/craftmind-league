module.exports = {
  meta: { name: 's1-gather-tools', stage: 'S1', summary: 'Gather logs, craft planks, build crafting table, then craft wooden pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { countItem, hasItem, craftByName, placeOnTop, digColumn, collectDrops, walkTo, groundY } = prims;
    
    // Check if we already have a crafting table and wooden pickaxe
    if (hasItem(bot, 'crafting_table') || countItem(bot, 'crafting_table') > 0) {
      if (hasItem(bot, 'wooden_pickaxe')) {
        return { done: true };
      }
    }
    
    // If we don't have any planks, gather logs and craft planks
    if (countItem(bot, 'oak_planks') < 4) {
      const logs = await prims.findBlocks(bot, ['oak_log'], 32, 8);
      if (logs.length > 0) {
        const logPos = logs[0];
        const r = await digColumn(bot, logPos, 8);
        if (r.ok) {
          await collectDrops(bot, 7, 12000);
          // After collecting drops, craft planks from logs
          const planks = countItem(bot, 'oak_planks');
          if (planks < 4) {
            // Craft 4 planks from logs (2 logs = 4 planks)
            const logsToCraft = Math.min(2, Math.ceil((4 - planks) / 2));
            if (logsToCraft > 0) {
              await craftByName(bot, 'oak_planks', logsToCraft);
            }
          }
        }
      }
    }
    
    // If we have at least 4 planks, craft the crafting table
    if (countItem(bot, 'oak_planks') >= 4) {
      // Check if crafting table is already in inventory
      if (hasItem(bot, 'crafting_table')) {
        // If table is in inventory, place it
        const tablePos = bot.entity.position.offset(0, 1, 0);
        const r = await placeOnTop(bot, 'crafting_table', tablePos);
        if (r.ok) {
          // Now craft the pickaxe using the placed table
          await craftByName(bot, 'wooden_pickaxe', 1, tablePos);
        }
      } else {
        // If table is not in inventory, craft it first
        await craftByName(bot, 'crafting_table', 1);
      }
    }
    
    // If we have a crafting table in inventory but haven't placed it yet
    if (hasItem(bot, 'crafting_table') && countItem(bot, 'crafting_table') > 0) {
      const tablePos = bot.entity.position.offset(0, 1, 0);
      const r = await placeOnTop(bot, 'crafting_table', tablePos);
      if (r.ok) {
        // Now craft the pickaxe using the placed table
        await craftByName(bot, 'wooden_pickaxe', 1, tablePos);
      }
    }
    
    return { done: false };
  }
};
