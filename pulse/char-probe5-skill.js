'use strict';
/** char-probe5-skill.js — OPERATOR PROBE 5 (see ledger
 * character-locomotion-probe5-20261107). Chunk-load timing +
 * wander-replica with bot-level path_update telemetry.
 * Runs once (guard file). */
const fs = require('fs');
const path = require('path');
const CM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const { Movements, goals } = require(path.join(CM, 'mineflayer-pathfinder'));
const Vec3 = require(path.join(CM, 'vec3')).Vec3;
const OUT = '/home/caseydigennaro/craftmind-league/pulse/char-probe5-result.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function pos(bot) { const p = bot.entity.position; return { x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }; }
function blk(bot, x, y, z) { const b = bot.blockAt(new Vec3(x, y, z)); return b ? b.name : 'UNLOADED'; }

module.exports = {
  meta: { name: 'char-probe5' },
  async run(ctx) {
    const { bot } = ctx;
    if (fs.existsSync(OUT)) return { ok: true, note: 'already probed' };
    const R = { ts: new Date().toISOString(), startPos: pos(bot), chunkLoads: 0, timeline: [], updates: [] };
    const save = () => { try { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); } catch {} };
    bot.on('chunkColumnLoad', () => { R.chunkLoads++; });
    bot.on('path_update', (r) => { R.updates.push({ status: r.status, pathLen: r.path ? r.path.length : null }); });
    const sample = (tag) => {
      R.timeline.push({
        tag, pos: pos(bot), onGround: bot.entity.onGround, chunkLoads: R.chunkLoads,
        rampTop_38_65_m96: blk(bot, 38, 65, -96),   // survey: grass top of the ramp cell
        homeTop_39_66_m101: blk(bot, 39, 66, -101), // survey: grass top of his clean cell
        ridgeTop_40_68_m102: blk(bot, 40, 68, -102),
        air_39_67_m101: blk(bot, 39, 67, -101),
      });
      save();
    };
    sample('t0');
    for (const t of [15, 15, 15, 15]) { await sleep(t * 1000); sample('t+' + R.timeline.length * 15); }
    // wander-replica goal: 4 north, one-arg Movements, radius 1, goal y = current y
    const mv = new Movements(bot);
    bot.pathfinder.setMovements(mv);
    const p = bot.entity.position;
    bot.pathfinder.setGoal(new goals.GoalNear(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z) - 4, 1));
    const samples = [pos(bot)];
    for (let i = 0; i < 6; i++) { await sleep(5000); samples.push(pos(bot)); }
    try { bot.pathfinder.setGoal(null); } catch {}
    R.goalArm = { samples, endPos: pos(bot) };
    R.done = true;
    save();
    return { ok: true };
  },
};
