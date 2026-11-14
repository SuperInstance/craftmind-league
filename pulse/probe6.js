'use strict';
/**
 * probe6.js — SCAFFOLD DIAGNOSTIC #6: WHO else drives this bot?
 * Shims setGoal/setControlState/clearControlStates with caller logging,
 * then runs one prims.gotoNear to a log and samples the fight.
 */
module.exports = {
  meta: { name: 'probe6-who', stage: 'S1', summary: 'control-ownership tracer' },
  run: async (ctx) => {
    const { bot, prims } = ctx;
    const L = (...a) => ctx.log('[PROBE6]', ...a);
    await prims.sleep(2500);
    const seen = {};
    const trace = (kind, info) => {
      const st = new Error().stack.split('\n').slice(2, 6).map((s) => s.trim().replace('/home/caseydigennaro/craftmind-league/', '')).join(' <- ');
      const key = kind + '|' + st;
      if (!seen[key]) { seen[key] = 1; L('CALL', kind, info, 'from:', st); }
    };
    const pf = bot.pathfinder;
    const origSetGoal = pf.setGoal.bind(pf);
    pf.setGoal = (g, dyn) => { trace('setGoal', g ? (g.constructor.name + '@' + (g.x !== undefined ? g.x + ',' + g.y + ',' + g.z : '?')) : 'null'); return origSetGoal(g, dyn); };
    const origSCS = bot.setControlState.bind(bot);
    bot.setControlState = (c, v) => { if (v === false) trace('setControlState', c + '=false'); return origSCS(c, v); };
    const origClear = bot.clearControlStates.bind(bot);
    bot.clearControlStates = () => { trace('clearControlStates', ''); return origClear(); };
    const logs = prims.findBlocks(bot, ['oak_log'], 40, 4);
    L('logs:', logs.map((p) => p.toString()).join(' '), 'my pos', JSON.stringify(bot.entity.position));
    if (logs.length) {
      const t = logs[0];
      const r = await prims.gotoNear(bot, t.x, t.y, t.z, 2.5, 20000);
      L('gotoNear ->', JSON.stringify(r), 'pos', JSON.stringify(bot.entity.position));
    }
    L('callers seen:', Object.keys(seen).length);
    return { done: true, note: 'probe6 complete' };
  },
};
