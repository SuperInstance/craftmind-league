'use strict';
/**
 * probe3.js — SCAFFOLD DIAGNOSTIC #3: does the pathfinder own the bot?
 * Sets a GoalNear 6 blocks away and samples goal/path/control state.
 */
module.exports = {
  meta: { name: 'probe3-path', stage: 'S1', summary: 'pathfinder ownership diagnostic' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const L = (...a) => ctx.log('[PROBE3]', ...a);
    const pf = require('/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules/mineflayer-pathfinder');
    await prims.sleep(3000);
    const start = bot.entity.position.clone();
    L('start pos', JSON.stringify(start), 'version', bot.version);
    const ev = [];
    const onPU = (r) => ev.push('path_update:' + (r && r.status));
    const onPR = (r) => ev.push('path_reset:' + r);
    const onGR = () => ev.push('goal_reached');
    bot.on('path_update', onPU); bot.on('path_reset', onPR); bot.on('goal_reached', onGR);
    const goal = new pf.goals.GoalNear(start.x + 6, start.y, start.z, 1.5);
    bot.pathfinder.setGoal(goal);
    for (let i = 0; i < 16; i++) {
      await prims.sleep(500);
      const cs = bot.controlState || {};
      L(`t${i} pos ${bot.entity.position.x.toFixed(2)},${bot.entity.position.y.toFixed(2)},${bot.entity.position.z.toFixed(2)}`,
        'goal?', !!bot.pathfinder.goal, 'moving?', bot.pathfinder.isMoving ? bot.pathfinder.isMoving() : '?',
        'ctrl', JSON.stringify({ f: cs.forward, j: cs.jump, s: cs.sprint }));
      if (ev.length) { L('events:', ev.splice(0).join(' | ')); }
    }
    bot.removeListener('path_update', onPU); bot.removeListener('path_reset', onPR); bot.removeListener('goal_reached', onGR);
    // manual control-state walk test: face east, forward 2.5 s
    const before = bot.entity.position.clone();
    await bot.lookAt(before.offset(5, 0, 0), true);
    bot.setControlState('forward', true);
    await prims.sleep(2500);
    bot.setControlState('forward', false);
    L('manual walk moved:', before.distanceTo(bot.entity.position).toFixed(2), 'blocks; now at', JSON.stringify(bot.entity.position));
    return { done: true, note: 'probe3 complete' };
  },
};
