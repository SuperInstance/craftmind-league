'use strict';
// map-driver2.js — v2 sequence: stand-in streams chunks (15 s
// lead), op bot ops the probe, probe reads + surveys, op bot deops.
const { spawn } = require('child_process');
const NM = '/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function run(script, label) {
  return new Promise((resolve) => {
    const ch = spawn(NM, [script], { cwd: __dirname, stdio: 'inherit' });
    ch.on('exit', (c) => { console.log('[' + label + ' exited ' + c + ']'); resolve(); });
  });
}
(async () => {
  const standin = spawn(NM, ['map-standin.js'], { cwd: __dirname, stdio: 'inherit' });
  await sleep(12000);
  const opbot = run('map-opbot.js', 'OP BOT');
  await sleep(8000);
  await run('map-day5b.js', 'MAP PROBE v2');
  await opbot;
  await new Promise((r) => standin.on('exit', r));
  console.log('map-driver2 done');
  process.exit(0);
})();
