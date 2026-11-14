module.exports = {
  meta: { name: 's1-gather-tools', stage: 'S1', summary: 'Gather logs, craft planks, build crafting table, then craft wooden pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { 
      countItem, 
      hasItem, 
      craftByName, 
      placeOnTop, 
      digColumn, 
      collectDrops, 
      walkTo,
      findBlocks,
      groundY,
      anchor
    } = prims;
    
    // Check if we already have a crafting table and wooden pickaxe
    if (hasItem(bot, 'crafting_table') || countItem(bot, 'crafting_table') > 0) {
      if (hasItem(bot, 'wooden_pickaxe')) {
        return { done: true };
      }
    }
    
    // Move outside spawn protection area to gather resources
    const spawnDist = Math.sqrt(Math.pow(bot.entity.position.x - 32, 2) + Math.pow(bot.entity.position.z - (-96), 2));
    if (spawnDist <= 17) {
      // Move away from spawn to a safe location
      const safeX = 32 + 20; // Move east of spawn
      const safeZ = -96; // Keep same z
      const safeY = groundY(bot, safeX, safeZ);
      if (safeY !== null) {
        const result = await walkTo(bot, safeX, safeY, safeZ, 1.5, 30000);
        if (!result.ok) {
          // If we can't reach, try a different approach
          const nearbySafe = await findBlocks(bot, ['oak_log'], 32, 1);
          if (nearbySafe.length > 0) {
            const r = await digColumn(bot, nearbySafe[0], 8);
            if (r.ok) {
              await collectDrops(bot, 7, 12000);
            }
          }
        }
        return { done: false };
      }
    }
    
    // Gather logs and craft planks
    const planksNeeded = Math.max(0, 4 - countItem(bot, 'oak_planks'));
    if (planksNeeded > 0) {
      const logs = await findBlocks(bot, ['oak_log'], 32, 8);
      if (logs.length > 0) {
        const logPos = logs[0];
        const r = await digColumn(bot, logPos, 8);
        if (r.ok) {
          await collectDrops(bot, 7, 12000);
          // Craft planks from logs (2 logs = 4 planks)
          const logsToCraft = Math.min(2, Math.ceil(planksNeeded / 2));
          if (logsToCraft > 0) {
            await craftByName(bot, 'oak_planks', logsToCraft);
          }
        }
      }
    }
    
    // Craft crafting table if we have enough planks
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
