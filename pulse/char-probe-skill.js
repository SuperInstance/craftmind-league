'use strict';
/** char-probe-skill.js — OPERATOR PROBE (not curriculum, not a trial).
 * Locomotion driver matrix from Cody's current cell; see pulse ledger
 * character-locomotion-probe-20261107. Runs ONCE (guarded by its
 * result file); every arm is walk-only (canDig forced false). */
const fs = require('fs');
const path = require('path');
const CM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const { Movements, goals } = require(path.join(CM, 'mineflayer-pathfinder'));
const OUT = '/home/caseydigennaro/craftmind-league/pulse/char-probe-result.json';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function pos(bot) { const p = bot.entity.position; return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }; }

async function pfArm(bot, movements, tx, tz, ms) {
  const start = pos(bot);
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(null);
  await sleep(300);
  bot.pathfinder.setGoal(new goals.GoalNear(tx, start.y, tz, 1.2));
  const t0 = Date.now();
  let arrived = false;
  while (Date.now() - t0 < ms) {
    const p = bot.entity.position;
    if (Math.hypot(p.x - tx, p.z - tz) <= 1.6) { arrived = true; break; }
    await sleep(400);
  }
  try { bot.pathfinder.setGoal(null); } catch {}
  try { bot.clearControlStates(); } catch {}
  await sleep(600);
  const end = pos(bot);
  return { start, end, disp: +Math.hypot(end.x - start.x, end.z - start.z).toFixed(2), arrived };
}

module.exports = {
  meta: { name: 'char-probe' },
  async run(ctx) {
    const { bot, prims } = ctx;
    if (fs.existsSync(OUT)) return { ok: true, note: 'already probed' };
    const results = { ts: new Date().toISOString(), arms: [] };
    const save = () => { try { fs.writeFileSync(OUT, JSON.stringify(results, null, 1)); } catch {} };
    const mcData = prims.mcData(bot);
    // P0 baseline drift
    const p0a = pos(bot); await sleep(10000); const p0b = pos(bot);
    results.arms.push({ arm: 'P0-idle', start: p0a, end: p0b, disp: +Math.hypot(p0b.x - p0a.x, p0b.z - p0a.z).toFixed(2) });
    save();
    // P1 travel movements (canDig false, no towers)
    {
      const mv = new Movements(bot, mcData); mv.canDig = false; mv.allow1by1towers = false;
      const s = pos(bot);
      results.arms.push({ arm: 'P1-travelMovements-east6', ...(await pfArm(bot, mv, s.x + 6, s.z, 45000)) });
      save();
    }
    // P2 framework-default movements (parkour per bot.js config), canDig forced false
    {
      const mv = new Movements(bot, mcData); mv.canDig = false; mv.allowSprinting = true; mv.allowParkour = true;
      const s = pos(bot);
      results.arms.push({ arm: 'P2-defaultMovements-parkour-east6', ...(await pfArm(bot, mv, s.x + 6, s.z, 45000)) });
      save();
    }
    // P3 helm alone
    {
      const s = pos(bot);
      const r = await prims.walkTo(bot, s.x + 6, s.y, s.z, 1.2, 45000);
      const e = pos(bot);
      results.arms.push({ arm: 'P3-helm-east6', start: s, end: e, disp: +Math.hypot(e.x - s.x, e.z - s.z).toFixed(2), walkToOk: r.ok });
      save();
    }
    // P4 manual sprint+jump east, 8 s
    {
      const s = pos(bot);
      try {
        await bot.lookAt(bot.entity.position.offset(10, 0.5, 0), true);
        bot.setControlState('forward', true); bot.setControlState('sprint', true); bot.setControlState('jump', true);
        await sleep(8000);
        bot.clearControlStates();
      } catch {}
      await sleep(600);
      const e = pos(bot);
      results.arms.push({ arm: 'P4-sprintjump-east8s', start: s, end: e, disp: +Math.hypot(e.x - s.x, e.z - s.z).toFixed(2) });
      save();
    }
    // P5 diagonal NE with P2 movements
    {
      const mv = new Movements(bot, mcData); mv.canDig = false; mv.allowSprinting = true; mv.allowParkour = true;
      const s = pos(bot);
      results.arms.push({ arm: 'P5-parkour-diagNE', ...(await pfArm(bot, mv, s.x + 5, s.z - 5, 45000)) });
      save();
    }
    results.done = true;
    save();
    return { ok: true, arms: results.arms.length };
  },
};
