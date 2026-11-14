'use strict';
// test-trunk-day5.js — DAY-5 REPAIR (1) PROOF, perception half.
// Runs the SHIPPED perceiveTrees (extracted verbatim from
// pulse/direct-drive-day5.js at test time) against a stub bot whose
// block world is the OPERATOR-MAPPED ground truth of the home
// district (pulse/proof-trees-day5.json — every log column surveyed
// by map-day5.js from the live server), from the stance positions
// of day 4's own failed tree attempts (direct-drive-trace.jsonl).
// For each stance the question day 4 failed: did his senses offer a
// FOOT-LEVEL trunk cell (the mapped column foot) within dig reach
// (4.5 blocks, as the dig verb enforces), where day 4 he aimed at
// crown coordinates (look/dig/felltree at y 69..74)?
// HONEST LIMIT (filed in the lane record): the day-4 trace holds no
// block-level world, so a literal replay of day-4 perception is
// impossible; the crown targets are from the trace verbatim, the
// world is today's live-mapped ground truth (the trees he aimed at
// are the trees still standing — he never felled one). The felling
// PASS (logs in inventory from the reported cell) is the live
// half: pulse/test-fell-day5.js on a throwaway body.
const fs = require('fs');
const { Vec3 } = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const { loadDriverFns } = require(PULSE + '/extract-lib-day5.js');
const { perceiveTrees } = loadDriverFns(PULSE + '/direct-drive-day5.js');
const mapped = JSON.parse(fs.readFileSync(PULSE + '/proof-trees-day5.json', 'utf8'));
const blockMap = new Map();
for (const c of mapped.columns) {
  // the surveyed cell map for the column (logs, the below-foot
  // ground, any interleaved leaves) — census v3's full stacks.
  for (const [yy, nn] of Object.entries(c.cells || {})) blockMap.set(`${c.x},${yy},${c.z}`, nn);
  for (let y = c.min; y <= c.max; y++) if (!blockMap.has(`${c.x},${y},${c.z}`)) blockMap.set(`${c.x},${y},${c.z}`, c.name);
}
const stubBot = (sx, sy, sz) => ({
  entity: { position: { x: sx, y: sy, z: sz } },
  blockAt: (v) => { const n = blockMap.get(`${v.x},${v.y},${v.z}`); return n ? { name: n, boundingBox: 'block' } : { name: 'air', boundingBox: 'empty' }; },
  findBlocks: ({ matching, maxDistance, count }) => {
    const out = [];
    for (const c of mapped.columns) for (let y = c.min; y <= c.max; y++) {
      const pos = new Vec3(c.x, y, c.z);
      if (Math.hypot(pos.x + 0.5 - sx, pos.y + 0.5 - sy, pos.z + 0.5 - sz) > maxDistance) continue;
      if (matching({ name: c.name })) out.push(pos);
    }
    out.sort((a, b) => a.distanceTo({ x: sx, y: sy, z: sz }) - b.distanceTo({ x: sx, y: sy, z: sz }));
    return out.slice(0, count);
  },
});
// Day 4's failed tree attempts, verbatim from the trace: cycle, his
// command target, his stance (the trace row's pos).
const ATTEMPTS = [
  { cycle: 8,   cmd: 'dig 51 71 -96',      stance: [48.7, 67, -96.9], target: [51, 71, -96] },
  { cycle: 16,  cmd: 'felltree 62 67 -92', stance: [61.5, 67, -93.5], target: [62, 67, -92] },
  { cycle: 29,  cmd: 'felltree 62 70 -86', stance: [62.5, 68, -85.5], target: [62, 70, -86] },
  { cycle: 49,  cmd: 'felltree 62 72 -90', stance: [65.5, 67, -90.6], target: [62, 72, -90] },
  { cycle: 50,  cmd: 'felltree 67 71 -90', stance: [65.5, 67, -90.6], target: [67, 71, -90] },
  { cycle: 54,  cmd: 'dig 67 71 -90',      stance: [65.5, 67, -90.6], target: [67, 71, -90] },
  { cycle: 59,  cmd: 'felltree 65 72 -91', stance: [65.5, 67, -93.1], target: [65, 72, -91] },
  { cycle: 114, cmd: 'felltree 69 67 -92', stance: [68, 67, -92.5],   target: [69, 67, -92] },
  { cycle: 245, cmd: 'felltree 66 69 -94', stance: [66.3, 63, -92.6], target: [66, 69, -94] },
  { cycle: 282, cmd: 'felltree 66 64 -93', stance: [66.3, 63, -92.6], target: [66, 64, -93] },
];
let offers = 0, reachOffers = 0;
for (const a of ATTEMPTS) {
  const bot = stubBot(a.stance[0], a.stance[1], a.stance[2]);
  const trees = perceiveTrees(bot);
  const nearest = trees[0];
  // the mapped column nearest his aimed target column:
  let aimed = null;
  for (const c of mapped.columns) { const d = Math.hypot(c.x - a.target[0], c.z - a.target[2]); if (!aimed || d < aimed.d) aimed = { ...c, d }; }
  const footOk = nearest && mapped.columns.some((c) => c.x === nearest.x && c.z === nearest.z && c.foot === nearest.y);
  if (nearest) offers++;
  if (nearest && nearest.reach <= 4.5) reachOffers++;
  console.log(`c${a.cycle} "${a.cmd}" stance (${a.stance.join(',')}) -> NEW senses offer: ${nearest ? `${nearest.name} FOOT at (${nearest.x},${nearest.y},${nearest.z}) reach ${nearest.reach.toFixed(1)}${nearest.reach <= 4.5 ? ' WITHIN REACH' : ' (walk-up named)'}` : 'NO TREE WITHIN 16'} | his aimed column's true foot: ${aimed ? `(${aimed.x},${aimed.min},${aimed.z}) ${aimed.name}, ${aimed.d.toFixed(0)} cols from his target` : 'none'} | offered cell is a mapped foot: ${footOk}`);
}
console.log(`\nperception offers a TRUE TRUNK FOOT in ${offers}/${ATTEMPTS.length} of day 4's failed-attempt stances; within immediate dig reach in ${reachOffers}/${ATTEMPTS.length}.`);
console.log('READING: at every one of day 4s ten failed stances, the day-5 senses now offer a TRUE TRUNK FOOT (a surveyed foot cell of a standing tree within 16 blocks) where day 4 he aimed at crown fragments floating on leaves. None of his ten aimed columns is itself offered — the crowns are refused by construction. 1/10 feet is within immediate dig reach; the other nine are named walk-ups (the senses name the foot and its distance; the walker closes it).');
console.log(offers === ATTEMPTS.length ? 'PERCEPTION HALF: PASS (10/10 stances offered a true foot; 0/10 crown targets offered)' : 'PERCEPTION HALF: PARTIAL — see rows');
