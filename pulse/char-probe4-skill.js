'use strict';
/** char-probe4-skill.js — OPERATOR PROBE 4, DIAGNOSTIC (see ledger
 * character-locomotion-probe4-20261107). Runs once (guard file). */
const fs = require('fs');
const path = require('path');
const CM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const { Movements, goals } = require(path.join(CM, 'mineflayer-pathfinder'));
const Vec3 = require(path.join(CM, 'vec3')).Vec3;
const OUT = '/home/caseydigennaro/craftmind-league/pulse/char-probe4-result.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function pos(bot) { const p = bot.entity.position; return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }; }

module.exports = {
  meta: { name: 'char-probe4' },
  async run(ctx) {
    const { bot, prims } = ctx;
    if (fs.existsSync(OUT)) return { ok: true, note: 'already probed' };
    const R = { ts: new Date().toISOString(), startPos: pos(bot), arms: [] };
    const save = () => { try { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); } catch {} };
    // D0: Cody's own client world view
    const cols = {};
    for (const [cx, cz] of [[38, -96], [38, -97], [39, -101], [39, -102], [40, -102]]) {
      const names = [];
      for (let y = 62; y <= 71; y++) {
        const b = bot.blockAt(new Vec3(cx, y, cz));
        names.push(y + ':' + (b ? b.name : 'UNLOADED') + (b && b.boundingBox === 'block' ? '*' : ''));
      }
      cols[cx + ',' + cz] = names;
    }
    const feet = bot.blockAt(bot.entity.position.offset(0, -0.5, 0));
    const under = bot.blockAt(bot.entity.position.offset(0, -1.2, 0));
    R.d0 = { cols, feetBlock: feet ? feet.name : null, underBlock: under ? under.name : null, onGround: bot.entity.onGround };
    save();
    // path_update telemetry for the whole run
    const updates = [];
    const onUpd = (r) => { updates.push({ t: Date.now(), status: r.status, pathLen: r.path ? r.path.length : null }); };
    bot.pathfinder.on('path_update', onUpd);
    const mcData = prims.mcData(bot);
    async function watch(ms, tag) {
      const s = pos(bot); const samples = [s]; const t0 = Date.now();
      while (Date.now() - t0 < ms) { await sleep(4000); samples.push(pos(bot)); }
      return { arm: tag, start: s, end: pos(bot), samples, updates: updates.splice(0) };
    }
    // D1: the wander's exact construction (one-arg Movements, GoalNear r1, goal y = current y)
    {
      bot.pathfinder.setGoal(null); await sleep(300);
      const mv = new Movements(bot);
      bot.pathfinder.setMovements(mv);
      const p = bot.entity.position;
      bot.pathfinder.setGoal(new goals.GoalNear(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z) - 4, 1));
      R.arms.push(await watch(30000, 'D1-wander-replica-north4'));
      save();
    }
    // D2: two-arg Movements + goto() promise with rejection capture
    {
      bot.pathfinder.setGoal(null); await sleep(300);
      const mv = new Movements(bot, mcData); mv.canDig = false; mv.allow1by1towers = false;
      bot.pathfinder.setMovements(mv);
      const p = bot.entity.position;
      let outcome = 'pending';
      const gp = bot.pathfinder.goto(new goals.GoalNear(Math.floor(p.x), Math.floor(p.y) + 1, Math.floor(p.z) - 4, 1.2))
        .then(() => { outcome = 'resolved'; })
        .catch((e) => { outcome = 'rejected: ' + (e && e.message ? e.message : String(e)); });
      const w = await watch(30000, 'D2-goto-north4');
      w.gotoOutcome = outcome;
      R.arms.push(w);
      try { bot.pathfinder.setGoal(null); } catch {}
      save();
    }
    // D3: prims.gotoNear same direction
    {
      const p = bot.entity.position;
      const r = await prims.gotoNear(bot, Math.floor(p.x), Math.floor(p.y) + 1, Math.floor(p.z) - 4, 1.2, 30000);
      R.arms.push({ arm: 'D3-prims-gotoNear-north4', start: null, end: pos(bot), gotoNearOk: r.ok, err: r.ok ? null : String(r.error || '').slice(0, 120), updates: updates.splice(0) });
      save();
    }
    bot.pathfinder.removeListener('path_update', onUpd);
    R.done = true;
    save();
    return { ok: true };
  },
};
