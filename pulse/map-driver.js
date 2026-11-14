'use strict';
// map-driver.js — operator driver for the day-5 map probe (NOT a
// citizen): launches the census stand-in, waits for its chunk
// load-in, then the map probe, then the stand-in's exit. Sequential
// on purpose (parallel-lane discipline: one operator body at a time
// in the shared world, plus the stand-in idling concurrently).
const { spawn } = require('child_process');
const NM = '/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function run(script, label) {
  console.log(`\n########## ${label} ##########`);
  await new Promise((resolve) => {
    const ch = spawn(NM, [script], { cwd: __dirname, stdio: 'inherit' });
    ch.on('exit', (c) => { console.log(`[${label} exited ${c}]`); resolve(); });
  });
}
(async () => {
  const standin = spawn(NM, ['map-standin.js'], { cwd: __dirname, stdio: 'inherit' });
  await sleep(12000);
  await run('map-day5.js', 'MAP PROBE');
  await new Promise((r) => standin.on('exit', r));
  console.log('map-driver done');
  process.exit(0);
})();
