'use strict';
// test-extract-day5.js — extraction fidelity: the shared extractor
// (extract-lib-day5.js) must reproduce the shipped functions'
// behaviour on a stub world. PASS here + the debug run (findBlocks
// live returns the birch column) is what licenses the live fell.
const { Vec3 } = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js');
const { loadDriverFns } = require('/home/caseydigennaro/craftmind-league/pulse/extract-lib-day5.js');
const { perceiveTrees, arrivalCheck } = loadDriverFns('/home/caseydigennaro/craftmind-league/pulse/direct-drive-day5.js');
const world = new Map();
for (let y = 66; y <= 72; y++) world.set(`80,${y},-96`, { name: 'birch_log', boundingBox: 'block' });
world.set('80,65,-96', { name: 'dirt', boundingBox: 'block' });
world.set('70,71,-90', { name: 'oak_log', boundingBox: 'block' }); // crown fragment: below is leaves
world.set('70,70,-90', { name: 'oak_leaves', boundingBox: 'block' });
const bot = {
  entity: { position: { x: 77.5, y: 66, z: -96.5 } },
  blockAt: (v) => world.get(`${v.x},${v.y},${v.z}`) || { name: 'air', boundingBox: 'empty' },
  findBlocks: ({ matching, count }) => {
    const out = [];
    for (const [k, b] of world) { const [x, y, z] = k.split(',').map(Number); if (matching(b)) out.push(new Vec3(x, y, z)); }
    return out.slice(0, count);
  },
};
const trees = perceiveTrees(bot);
console.log('perceiveTrees on stub world:', JSON.stringify(trees));
console.log(trees.length === 1 && trees[0].x === 80 && trees[0].y === 66 && trees[0].z === -96 ? 'EXTRACTION FIDELITY: PASS — the birch foot (80,66,-96) offered; the crown fragment (70,71,-90) correctly refused' : 'EXTRACTION FIDELITY: FAIL');
const chk = arrivalCheck({ entity: { position: { x: 65.3, y: 63, z: -92.5 } } }, 64, 66, -92, 1.6);
console.log('arrivalCheck pit case:', JSON.stringify(chk), chk.arrived === false ? 'PASS' : 'FAIL');
