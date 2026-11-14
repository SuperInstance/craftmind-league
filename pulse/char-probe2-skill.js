'use strict';
/** char-probe2-skill.js — OPERATOR PROBE 2 (see ledger
 * character-locomotion-probe2-20261107). Pure-pathfinder isolation:
 * NO helm anywhere. Runs once (guard file). */
const fs = require('fs');
const path = require('path');
const CM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const { Movements, goals } = require(path.join(CM, 'mineflayer-pathfinder'));
const OUT = '/home/caseydigennaro/craftmind-league/pulse/char-probe2-result.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function pos(bot) { const p = bot.entity.position; return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }; }

async function arm(bot, prims, name, tx, ty, tz, tol, ms) {
  const mcData = prims.mcData(bot);
  const mv = new Movements(bot, mcData); mv.canDig = false; mv.allow1by1towers = false;
  bot.pathfinder.setMovements(mv);
  bot.pathfinder.setGoal(null);
  await sleep(400);
  const start = pos(bot);
  const samples = [start];
  bot.pathfinder.setGoal(new goals.GoalNear(tx, ty, tz, tol));
  const t0 = Date.now();
  let arrived = false;
  while (Date.now() - t0 < ms) {
    await sleep(5000);
    const p = pos(bot);
    samples.push(p);
    if (Math.hypot(p.x - tx, p.y - ty, p.z - tz) <= tol + 0.4) { arrived = true; break; }
  }
  try { bot.pathfinder.setGoal(null); } catch {}
  try { bot.clearControlStates(); } catch {}
  await sleep(600);
  return { arm: name, start, samples, end: pos(bot), arrived };
}

module.exports = {
  meta: { name: 'char-probe2' },
  async run(ctx) {
    const { bot, prims } = ctx;
    if (fs.existsSync(OUT)) return { ok: true, note: 'already probed' };
    const results = { ts: new Date().toISOString(), arms: [] };
    const save = () => { try { fs.writeFileSync(OUT, JSON.stringify(results, null, 1)); } catch {} };
    results.arms.push(await arm(bot, prims, 'Q1-atomic-plus1-north', 39, 68, -102, 1.2, 90000));
    save();
    results.arms.push(await arm(bot, prims, 'Q2-onto-ridge', 41, 69, -102, 1.6, 150000));
    results.done = true;
    save();
    return { ok: true };
  },
};
