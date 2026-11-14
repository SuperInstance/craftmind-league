'use strict';
// map-felldriver.js — op sequence for the day-5 fell test: stand-in
// streams chunks; op bot ops FellTest, then teleports it onto the
// surveyed stance (77.5, 66, -96.5) beside the birch trunk whose
// foot is (80,66,-96); FellTest runs the shipped perceiveTrees +
// digColumn; the op bot deops FellTest afterwards. Operator acts,
// plainly: the teleport is test staging, not citizen movement.
const { spawn } = require('child_process');
const NM = '/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function run(script, label, env) {
  return new Promise((resolve) => {
    const ch = spawn(NM, [script], { cwd: __dirname, stdio: 'inherit', env: { ...process.env, ...(env || {}) } });
    ch.on('exit', (c) => { console.log('[' + label + ' exited ' + c + ']'); resolve(); });
  });
}
(async () => {
  const standin = spawn(NM, ['map-standin.js'], { cwd: __dirname, stdio: 'inherit' });
  await sleep(12000);
  const opbot = run('map-opbot-fell.js', 'OP BOT (fell)');
  await sleep(9000);
  await run('test-fell-day5.js', 'FELL TEST');
  await opbot;
  await new Promise((r) => standin.on('exit', r));
  console.log('map-felldriver done');
  process.exit(0);
})();
