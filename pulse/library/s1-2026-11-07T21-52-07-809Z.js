module.exports = {
  meta: { name: 'S1-gather-tools', stage: 'S1', summary: 'Exit spawn protection, gather logs, craft planks, table, and pickaxe' },
  run: async (ctx) => {
    const bot = ctx.bot;
    const prims = ctx.prims;
    const anchor = ctx.anchor;
    
    // Check if stage goal already reached
    if (prims.countItem(bot, 'wooden_pickaxe') >= 1) {
      return { done: true };
    }
    
    // 1. Survival scan
    const hostileEntities = Object.values(bot.entities).filter(e => 
      e.name === 'zombie' || e.name === 'skeleton' || e.name === 'creeper'
    );
    
    if (hostileEntities.length > 0) {
      const hostile = hostileEntities[0];
      const distance = bot.entity.position.distanceTo(hostile.position);
      if (distance < 14 || bot.health < 10) {
        // Flee away from hostile
        const direction = bot.entity.position.clone().subtract(hostile.position);
        const fleePos = bot.entity.position.clone().add(direction.normalize().scale(14));
        const groundY = prims.groundY(bot, fleePos.x, fleePos.z);
        if (groundY !== null) {
          fleePos.y = groundY + 1;
          await prims.walkTo(bot, fleePos.x, fleePos.y, fleePos.z, 1.5, 10000);
          // Wait and re-scan
          await prims.sleep(3000);
          return { done: false };
        }
      }
    }
    
    // 2. Exit spawn protection if needed
    const spawnDist = Math.sqrt(
      Math.pow(bot.entity.position.x - 32, 2) + 
      Math.pow(bot.entity.position.z - (-96), 2)
    );
    
    if (spawnDist < 17) {
      // Walk east to exit protection zone
      const targetX = 32 + 18;
      const targetZ = -96;
      const result = await prims.walkTo(bot, targetX, bot.entity.position.y, targetZ, 1.5, 30000);
      if (result.ok) {
        return { done: false };
      }
    }
    
    // 3. Exit hollow if needed
    const x = Math.floor(bot.entity.position.x);
    const z = Math.floor(bot.entity.position.z);
    if (x >= 69 && x <= 75 && z >= -89 && z <= -84) {
      // Exit through two legs: first west to (68, 65, -88), then north to (68, 67, -90)
      if (x > 68.5) {
        const result = await prims.walkTo(bot, 68, bot.entity.position.y, -88, 1.5, 30000);
        if (result.ok) {
          return { done: false };
        }
      } else {
        const result = await prims.walkTo(bot, 68, 67, -90, 1.5, 30000);
        if (result.ok) {
          return { done: false };
        }
      }
    }
    
    // 4. Inventory check and crafting chain
    const inventory = prims.inv(bot);
    const oakLogs = prims.countItem(bot, 'oak_log');
    const birchLogs = prims.countItem(bot, 'birch_log');
    const oakPlanks = prims.countItem(bot, 'oak_planks');
    const birchPlanks = prims.countItem(bot, 'birch_planks');
    const sticks = prims.countItem(bot, 'stick');
    
    // Craft planks from logs
    if ((oakLogs > 0 || birchLogs > 0) && (oakPlanks + birchPlanks) < 4) {
      const logType = oakLogs > 0 ? 'oak' : 'birch';
      const plankType = logType + '_planks';
      const result = await prims.craftByName(bot, plankType, 1, null);
      if (result.ok) {
        return { done: false };
      }
    }
    
    // Craft crafting table if we have enough planks and no table placed
    if ((oakPlanks + birchPlanks) >= 4 && !prims.hasItem(bot, 'crafting_table')) {
      const result = await prims.craftByName(bot, 'crafting_table', 1, null);
      if (result.ok) {
        // Place the table
        const refPos = bot.entity.position.offset(1, -1, 0);
        const placeResult = await prims.placeOnTop(bot, 'crafting_table', refPos);
        if (placeResult.ok) {
          return { done: false };
        }
      }
    }
    
    // Craft sticks if we have planks
    if ((oakPlanks + birchPlanks) >= 2 && sticks < 4) {
      const result = await prims.craftByName(bot, 'stick', 4, null);
      if (result.ok) {
        return { done: false };
      }
    }
    
    // Craft pickaxe if we have table and materials
    if (sticks >= 2 && (oakPlanks + birchPlanks) >= 3) {
      // Find the placed table position
      const tables = prims.findBlocks(bot, ['crafting_table'], 16, 1);
      if (tables.length > 0) {
        const tablePos = tables[0];
        const result = await prims.craftByName(bot, 'wooden_pickaxe', 1, tablePos);
        if (result.ok) {
          return { done: false };
        }
      }
    }
    
    // 5. Gather logs if needed
    if ((oakLogs + birchLogs) < 3) {
      const logs = prims.findBlocks(bot, ['oak_log', 'birch_log'], 32, 1);
      if (logs.length > 0) {
        const logPos = logs[0];
        const result = await prims.digBlock(bot, logPos, 10000);
        if (result.ok) {
          await prims.collectDrops(bot, 7, 5000);
          return { done: false };
        }
      }
    }
    
    return { done: false };
  }
};
