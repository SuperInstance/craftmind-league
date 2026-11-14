'use strict';
/**
 * probe5.js — SCAFFOLD DIAGNOSTIC #5: characterise the freeze in-process.
 * physicTick rate, gamemode, effects, velocity/position at 100 ms,
 * feet block + block below, passenger/vehicle state.
 */
module.exports = {
  meta: { name: 'probe5-freeze', stage: 'S1', summary: 'freeze characterisation' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const L = (...a) => ctx.log('[PROBE5]', ...a);
    await prims.sleep(2000);
    L('gameMode', bot.game && bot.game.gameMode, 'health', bot.health, 'food', bot.food);
    L('effects', JSON.stringify(bot.entity && bot.entity.effects || {}));
    const p = bot.entity.position;
    const feet = bot.blockAt(p.offset(0, 0.2, 0));
    const below = bot.blockAt(p.offset(0, -0.4, 0));
    L('feetBlock', feet && feet.name, 'belowBlock', below && below.name,
      'isInWater', bot.entity.isInWater, 'onGround', bot.entity.onGround,
      'vehicle', bot.vehicle ? bot.vehicle.name : null, 'yaw/pitch', bot.entity.yaw, bot.entity.pitch);
    let ticks = 0;
    const onTick = () => { ticks++; };
    bot.on('physicTick', onTick);
    bot.setControlState('forward', true);
    let prev = null; let changes = 0;
    for (let i = 0; i < 30; i++) {
      await prims.sleep(100);
      const cur = bot.entity.position.x + ',' + bot.entity.position.y + ',' + bot.entity.position.z +
        ' v=' + bot.entity.velocity.x + ',' + bot.entity.velocity.y + ',' + bot.entity.velocity.z;
      if (cur !== prev) changes++;
      prev = cur;
    }
    bot.setControlState('forward', false);
    bot.removeListener('physicTick', onTick);
    L('physicTicks in 3s:', ticks, 'distinct pos/vel samples:', changes, 'of 30');
    L('final pos', JSON.stringify(bot.entity.position), 'vel', JSON.stringify(bot.entity.velocity));
    return { done: true, note: 'probe5 complete' };
  },
};
