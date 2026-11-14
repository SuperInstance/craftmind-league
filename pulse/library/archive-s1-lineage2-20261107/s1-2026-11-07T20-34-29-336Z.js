module.exports = {
  meta: { name: 's1-gather-tools', stage: 'S1', summary: 'Gather logs, craft planks, build crafting table, then craft wooden pickaxe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const { 
      countItem, 
      hasItem, 
      craftByName, 
      placeOnTop, 
      digBlock, 
      collectDrops, 
      walkTo,
      findBlocks,
      groundY,
      anchor,
      say
    } = prims;
    
    // Check if we already have a crafting table and wooden pickaxe
    if (hasItem(bot, 'crafting_table') && hasItem(bot, 'wooden_pickaxe')) {
      return { done: true };
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
          // If we can't reach, try to find logs nearby
          const logs = await findBlocks(bot, ['oak_log'], 32, 1);
          if (logs.length > 0) {
            const r = await digBlock(bot, logs[0], 25000);
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
        const r = await digBlock(bot, logPos, 25000);
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
    if (countItem(bot, 'oak_planks') >= 4 && !hasItem(bot, 'crafting_table')) {
      await craftByName(bot, 'crafting_table', 1);
    }
    
    // Place crafting table if we have it in inventory
    if (hasItem(bot, 'crafting_table') && !hasItem(bot, 'crafting_table', 2)) {
      // Place the table adjacent to Cody
      const refPos = bot.entity.position.offset(1, -1, 0); // Ground block 
      const result = await placeOnTop(bot, 'crafting_table', refPos);
      if (result.ok) {
        // Craft sticks from planks (2 planks = 4 sticks)
        const sticksNeeded = 2;
        if (countItem(bot, 'oak_planks') >= 2) {
          await craftByName(bot, 'stick', sticksNeeded, refPos.offset(0, 1, 0));
        }
        // Craft wooden pickaxe (3 planks + 2 sticks)
        if (countItem(bot, 'oak_planks') >= 3 && countItem(bot, 'stick') >= 2) {
          await craftByName(bot, 'wooden_pickaxe', 1, refPos.offset(0, 1, 0));
        }
      }
    }
    
    // If we have a crafting table but haven't crafted a pickaxe yet
    if (hasItem(bot, 'crafting_table') && !hasItem(bot, 'wooden_pickaxe')) {
      // Check if we have enough materials
      if (countItem(bot, 'oak_planks') >= 3 && countItem(bot, 'stick') >= 2) {
        // Find the crafting table position
        const tablePos = bot.entity.position.offset(1, 0, 0);
        await craftByName(bot, 'wooden_pickaxe', 1, tablePos);
      }
    }
    
    return { done: false };
  }
};
