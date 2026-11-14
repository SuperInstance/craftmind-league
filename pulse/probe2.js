'use strict';
/**
 * probe2.js — SCAFFOLD DIAGNOSTIC #2: why does bot.dig time out?
 * Instruments one dig attempt three ways with mineflayer introspection.
 */
module.exports = {
  meta: { name: 'probe2-dig', stage: 'S1', summary: 'dig diagnostic' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const L = (...a) => ctx.log('[PROBE2]', ...a);
    await prims.sleep(4000); // let chunks load
    L('pos', JSON.stringify(bot.entity.position), 'onGround', bot.entity.onGround);
    const logs = prims.findBlocks(bot, ['oak_log'], 32, 8);
    L('logs near:', logs.map((p) => p.toString()).join(' '));
    if (!logs.length) return { done: true, note: 'no logs' };
    // prefer an eye-level-ish log not at feet
    const pos = bot.entity.position;
    const target = logs.find((p) => p.y >= Math.floor(pos.y) + 1) || logs[0];
    const blk = bot.blockAt(target);
    L('target', target.toString(), 'block', blk && blk.name, 'canDig', blk ? bot.canDigBlock(blk) : '?',
      'digTime(ms)', blk ? bot.digTime(blk) : '?', 'inSight', (() => { try { return !!bot.blockInSight(blk); } catch (e) { return 'ERR ' + e.message; } })());
    bot.clearControlStates();
    let aborted = 0; let completed = 0;
    const onAbort = (b) => { aborted++; L('event diggingAborted at', b && b.position && b.position.toString()); };
    const onComplete = (b) => { completed++; L('event diggingCompleted', b && b.position && b.position.toString()); };
    bot.on('diggingAborted', onAbort); bot.on('diggingCompleted', onComplete);
    L('calling bot.dig...');
    const t0 = Date.now();
    try {
      const p = bot.dig(blk, 'ignore');
      const raced = await Promise.race([p.then(() => 'resolved').catch((e) => 'rejected: ' + e.message),
        prims.sleep(12000).then(() => 'STILL-PENDING@12s')]);
      L('dig outcome:', raced, 'after', Date.now() - t0, 'ms; abortedEvents', aborted, 'completedEvents', completed,
        'block now', (bot.blockAt(target) || {}).name);
    } catch (e) {
      L('dig threw:', e.message);
    }
    bot.removeListener('diggingAborted', onAbort); bot.removeListener('diggingCompleted', onComplete);
    return { done: true, note: 'probe2 complete' };
  },
};
