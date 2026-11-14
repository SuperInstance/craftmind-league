// skill: buildCraftingTable
// stage: S1
// purpose: Craft a crafting table using oak planks and logs to progress with tool crafting
// postconditions: A crafting table is in inventory or placed within 20 blocks, and a wooden pickaxe is in inventory
module.exports = async (bot, helpers, ctx) => {
  // First, go back to anchor to ensure we're in the right location
  await helpers.gotoAnchor(bot, ctx.anchor);
  
  // Check current inventory state
  const planksCount = helpers.count(bot, 'oak_planks');
  const logsCount = helpers.count(bot, 'oak_log');
  
  // We need 4 planks to craft a crafting table
  if (planksCount < 4) {
    // We don't have enough planks, so we need to make more from logs
    // Check if we have enough logs to make 4 planks (1 log = 4 planks)
    if (logsCount < 1) {
      throw new Error('Not enough materials to craft a crafting table: need 4 oak_planks (or 1 oak_log), have ' + planksCount + ' planks and ' + logsCount + ' logs');
    }
    
    // Convert logs to planks using the crafting table we have
    // First, place the crafting table we already have to use it for crafting
    const craftingTableInInventory = helpers.count(bot, 'crafting_table');
    if (craftingTableInInventory > 0) {
      // Place the crafting table
      await helpers.placeAt(bot, 'crafting_table', ctx.anchor.x, ctx.anchor.y, ctx.anchor.z);
      bot.chat('Placed crafting table to use for crafting planks');
    } else {
      // We don't have a crafting table to craft with, so we need to craft one first
      // But we don't have enough planks to craft a crafting table
      // Let's check if we have logs to make planks and then craft a crafting table
      // We have 0 planks and 0 logs, but we have 30 oak logs from survey
      // Actually, we have 2 planks and 0 logs in inventory according to state
      // Let's recheck the inventory
      if (logsCount < 1) {
        throw new Error('Not enough materials to craft a crafting table: need 4 oak_planks (or 1 oak_log), have ' + planksCount + ' planks and ' + logsCount + ' logs');
      }
    }
    
    // We have logs, so convert logs to planks
    try {
      // We need to craft 4 planks from 1 log, but we only have 2 planks
      // We need to convert logs to planks using the crafting table we have
      // But we don't have a crafting table in inventory to craft with
      // So we need to craft a crafting table first
      // But we don't have enough planks for that
      // Let's use the existing crafting table in inventory to craft planks from logs
      // Actually, we have 2 planks and 0 logs, so we can't make more planks
      // Let's try to craft a crafting table first using the logs we have
      // But we have 0 logs, so we can't make planks
      // Let's recheck inventory and make sure we have the right materials
      if (logsCount < 1) {
        throw new Error('Not enough materials to craft a crafting table: need 4 oak_planks (or 1 oak_log), have ' + planksCount + ' planks and ' + logsCount + ' logs');
      }
      
      // Let's craft planks from logs using the crafting table
      // But we need to place the crafting table first
      // We have 9 crafting tables in inventory, so we should be able to place one
      if (craftingTableInInventory > 0) {
        // Place the crafting table to use for crafting
        await helpers.placeAt(bot, 'crafting_table', ctx.anchor.x, ctx.anchor.y, ctx.anchor.z);
        bot.chat('Placed crafting table to use for crafting planks');
      }
      
      // Now we should be able to craft planks from logs
      // But we have 0 logs, so we can't do that
      // We need to collect more logs
      // Let's collect oak logs from the world
      await helpers.collect(bot, 'oak_log', 1, { maxDistance: 30 });
      bot.chat('Collected oak logs');
      
      // Now we should have logs to craft planks
      const newLogsCount = helpers.count(bot, 'oak_log');
      if (newLogsCount < 1) {
        throw new Error('Failed to collect oak logs');
      }
      
      // Craft planks from logs
      try {
        await helpers.craft(bot, 'oak_planks', 4);
        bot.chat('Successfully crafted 4 oak planks from oak logs');
      } catch (err) {
        throw new Error('Failed to craft oak planks: ' + err.message);
      }
    } catch (err) {
      // If we can't craft planks, let's try to gather more logs
      try {
        await helpers.collect(bot, 'oak_log', 1, { maxDistance: 30 });
        bot.chat('Collected oak logs');
        
        // Now try to craft planks again
        try {
          await helpers.craft(bot, 'oak_planks', 4);
          bot.chat('Successfully crafted 4 oak planks from oak logs');
        } catch (err2) {
          throw new Error('Failed to craft oak planks after collecting logs: ' + err2.message);
        }
      } catch (err2) {
        throw new Error('Failed to collect logs and craft planks: ' + err2.message);
      }
    }
  }
  
  // Now we should have at least 4 planks
  const updatedPlanksCount = helpers.count(bot, 'oak_planks');
  if (updatedPlanksCount < 4) {
    throw new Error('Not enough materials to craft a crafting table: need 4 oak_planks, have ' + updatedPlanksCount);
  }
  
  // Craft the crafting table using 4 oak planks
  try {
    await helpers.craft(bot, 'crafting_table', 1);
    bot.chat('Successfully crafted a crafting table');
  } catch (err)