'use strict';
/**
 * probe.js — SCAFFOLD DIAGNOSTIC, not a curriculum skill.
 * Runs the atomic S1 steps once with verbose per-step logging so a
 * stuck trial can be attributed (prims vs script logic vs world).
 * Never promoted; never written by the smith.
 */
module.exports = {
  meta: { name: 'probe-s1-diag', stage: 'S1', summary: 'diagnostic probe' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const L = (...a) => ctx.log('[PROBE]', ...a);
    L('start; pos', JSON.stringify(bot.entity.position), 'inv', JSON.stringify(prims.inv(bot)));
    const logs = prims.findBlocks(bot, ['oak_log', 'birch_log', 'spruce_log'], 48, 6);
    L('findBlocks ->', logs.map((p) => p.toString()).join(' '));
    if (!logs.length) return { done: true, note: 'no logs found' };
    const target = logs[0];
    const g = await prims.gotoNear(bot, target.x, target.y, target.z, 2.5, 30000);
    L('gotoNear ->', JSON.stringify(g), 'pos now', JSON.stringify(bot.entity.position));
    const d = await prims.digBlock(bot, target);
    L('digBlock ->', JSON.stringify(d));
    await prims.sleep(600);
    const c = await prims.collectDrops(bot, 7, 10000);
    L('collectDrops ->', JSON.stringify(c), 'inv now', JSON.stringify(prims.inv(bot)));
    if ((prims.inv(bot).oak_log || prims.inv(bot).birch_log || 0) >= 1 || (prims.countItem(bot, 'spruce_log') >= 1)) {
      const wood = prims.countItem(bot, 'oak_log') ? 'oak' : prims.countItem(bot, 'birch_log') ? 'birch' : 'spruce';
      const p = await prims.craftByName(bot, wood + '_planks', 1);
      L('craftByName planks x1 ->', JSON.stringify(p), 'inv now', JSON.stringify(prims.inv(bot)));
    }
    return { done: true, note: 'probe complete' };
  },
};
