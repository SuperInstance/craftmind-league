'use strict';
// test-fell-day5.js — DAY-5 REPAIR (1) PROOF, live half + REPAIR (3)
// live half. Throwaway body FellTest on the live Orin world:
//  Phase A (trunk): stand at the stance; run the SHIPPED
//    perceiveTrees; take the nearest tree's reported foot cell;
//    felltree it via the shipped digColumn. PASS = logs in
//    inventory (the only PASS, per the brief).
//  Phase B (arrival): goto a target across the broken ground by
//    the pit; the shipped arrivalCheck computes the verdict from
//    the MEASURED end position; print walker-ok beside it.
// Args: stance x y z (FellTest is placed there by /tp from the op
// bot beforehand — plain survival, no other operator help).
const fs = require('fs');
const { createBot } = require('/home/caseydigennaro/craftmind-league/bots/craftmind/src/bot.js');
const prims = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const { Vec3 } = prims;
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const { loadDriverFns } = require(PULSE + '/extract-lib-day5.js');
const { perceiveTrees, arrivalCheck } = loadDriverFns(PULSE + '/direct-drive-day5.js');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = createBot({
  host: process.env.MC_HOST || '192.168.0.50', port: 25565, username: 'FellTest', version: '26.1',
  plugins: [], skipPlugins: ['wanderer', 'flee-on-danger', 'combat', 'behavior-script', 'npc-system', 'onboarding', 'game-hub'],
});
bot.on('error', (e) => console.log('bot error:', e && e.message));
bot.on('kicked', (r) => console.log('kicked:', String(r)));
bot.once('spawn', async () => {
  try {
    await sleep(1500);
    const p0 = bot.entity.position;
    console.log('FellTest stance:', p0.x.toFixed(1), p0.y.toFixed(1), p0.z.toFixed(1), 'hp', bot.health, 'food', bot.food);
    // Chunk data streams in after a teleport: poll the senses
    // until the surveyed birch registers (or 30 s elapse) — a day-4
    // census lesson: a bot's first view of fresh ground can be air.
    let trees = [];
    for (let w = 0; w < 15; w++) {
      trees = perceiveTrees(bot);
      const probe = bot.blockAt(new Vec3(80, 66, -96));
      console.log(`sense poll ${w}: blockAt(80,66,-96) = ${probe ? probe.name : 'null'} | offers: ${trees.length}`);
      if (trees.length) break;
      await sleep(2000);
    }
    console.log('perceiveTrees offers:', JSON.stringify(trees.map((t) => ({ at: [t.x, t.y, t.z], name: t.name, reach: +t.reach.toFixed(1) })), null, 0));
    const t = trees[0];
    if (!t) { console.log('FELL: NO TREE OFFERED — FAIL'); }
    else {
      const before = prims.inv(bot);
      console.log('inventory before:', JSON.stringify(before));
      const r = await prims.digColumn(bot, new Vec3(t.x, t.y, t.z), 10);
      await sleep(800);
      const after = prims.inv(bot);
      const logs = Object.entries(after).filter(([k]) => /_log$/.test(k));
      console.log('digColumn:', JSON.stringify(r), '| inventory after:', JSON.stringify(after));
      console.log(logs.length && r.ok ? `FELL: PASS — ${logs.map(([k, v]) => k + ' x' + v).join(', ')} in inventory from reported foot (${t.x},${t.y},${t.z})` : 'FELL: FAIL — no logs held');
    }
    // Phase B: arrival honesty on broken ground — goto the pit
    // stair top from wherever the fell ended.
    const tgt = { x: 64, y: 66, z: -92 };
    const g = await prims.gotoNear(bot, tgt.x, tgt.y, tgt.z, 1.6, 30000);
    const chk = arrivalCheck(bot, tgt.x, tgt.y, tgt.z, 1.6);
    console.log(`ARRIVAL: goto (${tgt.x},${tgt.y},${tgt.z}) walker says ok=${g.ok} via=${g.via || '-'} err=${g.error || '-'} | arrivalCheck: arrived=${chk.arrived} pos=(${chk.pos.x},${chk.pos.y},${chk.pos.z}) dist=${chk.dist} dy=${chk.dy}`);
  } catch (e) {
    console.log('test error:', e && e.message);
  } finally {
    await sleep(500);
    try { bot.quit(); } catch {}
    setTimeout(() => process.exit(0), 800);
  }
});
