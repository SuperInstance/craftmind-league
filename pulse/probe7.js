'use strict';
/**
 * probe7.js — SCAFFOLD DIAGNOSTIC #7: three helm styles, measured.
 * A) forward once + one lookAt (cleanroom replica)
 * B) forward + lookAt re-asserted at 10 Hz (walkTo replica)
 * C) forward re-asserted at 10 Hz, no lookAt
 */
module.exports = {
  meta: { name: 'probe7-helm', stage: 'S1', summary: 'helm style A/B/C test' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const L = (...a) => ctx.log('[PROBE7]', ...a);
    await prims.sleep(2500);
    async function leg(name, fn) {
      const start = bot.entity.position.clone();
      await fn();
      const moved = start.distanceTo(bot.entity.position);
      try { bot.clearControlStates(); } catch {}
      L(name, 'moved', moved.toFixed(2), 'from', start.x.toFixed(1) + ',' + start.z.toFixed(1), 'to', bot.entity.position.x.toFixed(1) + ',' + bot.entity.position.z.toFixed(1));
      await prims.sleep(1500);
    }
    await leg('A forward-once', async () => {
      await bot.lookAt(bot.entity.position.offset(8, 0, 0), true);
      bot.setControlState('forward', true);
      await prims.sleep(4000);
    });
    await leg('B lookAt+forward 10Hz', async () => {
      const t0 = Date.now();
      while (Date.now() - t0 < 4000) {
        try { await bot.lookAt(bot.entity.position.offset(8, 0, 0), true); } catch {}
        bot.setControlState('forward', true);
        await prims.sleep(100);
      }
    });
    await leg('C forward 10Hz no-lookAt', async () => {
      await bot.lookAt(bot.entity.position.offset(0, 0, 8), true);
      const t0 = Date.now();
      while (Date.now() - t0 < 4000) {
        bot.setControlState('forward', true);
        await prims.sleep(100);
      }
    });
    return { done: true, note: 'probe7 complete' };
  },
};
