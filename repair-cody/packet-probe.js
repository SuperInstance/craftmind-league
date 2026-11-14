'use strict';
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const USER = process.env.PROBE_USER;
if (!USER) { console.log('no PROBE_USER'); process.exit(2); }
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: USER, auth: 'offline' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let phase = 'pre-spawn';
const counts = {}; const posSamples = [];
bot._client.on('packet', (data, meta) => {
  const n = meta && meta.name ? meta.name : '?';
  const key = phase + ':' + n;
  counts[key] = (counts[key]||0)+1;
  if ((n.indexOf('position')>=0 || n.indexOf('teleport')>=0) && posSamples.length < 14) {
    posSamples.push({phase, name:n, x:data.x, y:data.y, z:data.z, yaw:data.yaw, pitch:data.pitch, teleportId:(data.teleportId!==undefined?data.teleportId:data.id), flags:data.flags});
  }
});
function fmt(p){ return p.x.toFixed(3)+','+p.y.toFixed(3)+','+p.z.toFixed(3); }
async function leg(label, dx, dz, jump){
  const start = bot.entity.position.clone();
  if (dx||dz) await bot.lookAt(start.offset(dx,0,dz), true);
  await sleep(120);
  phase = label;
  if (jump) bot.setControlState('jump', true);
  bot.setControlState('forward', true);
  await sleep(3000);
  bot.setControlState('forward', false);
  bot.setControlState('jump', false);
  const end = bot.entity.position.clone();
  console.log('[PKT]', USER, label, 'start', fmt(start), 'end', fmt(end), 'displacement', start.distanceTo(end).toFixed(3));
  phase = 'between';
  await sleep(300);
}
bot.once('spawn', async () => {
  console.log('[PKT]', USER, 'spawned at', fmt(bot.entity.position), 'vehicle', String(bot.entity.vehicle));
  phase = 'idle-3s';
  await sleep(3000);
  console.log('[PKT]', USER, 'after idle pos', fmt(bot.entity.position));
  await leg('forward-default-yaw-3s', 0, 0, false);
  await leg('forward-east-lookAt-3s', 6, 0, false);
  await leg('forward-north-JUMP-3s', 0, -6, true);
  phase = 'done';
  console.log('[PKT]', USER, 'FINAL pos', fmt(bot.entity.position));
  console.log('[PKT]', USER, 'position/teleport packet samples:', JSON.stringify(posSamples));
  const byPhase = {};
  for (const k of Object.keys(counts)) { const parts=k.split(':'); const ph=parts[0], nm=parts.slice(1).join(':'); if (nm.indexOf('position')>=0||nm.indexOf('teleport')>=0) byPhase[k]=counts[k]; }
  console.log('[PKT]', USER, 'position/teleport counts by phase:', JSON.stringify(byPhase));
  const allNames = {};
  for (const k of Object.keys(counts)) { const parts=k.split(':'); const nm=parts.slice(1).join(':'); allNames[nm]=(allNames[nm]||0)+counts[k]; }
  console.log('[PKT]', USER, 'all packet names total:', JSON.stringify(allNames));
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[PKT] error', e.message));
bot.on('kicked', (r) => console.log('[PKT] kicked', r));
setTimeout(() => { console.log('[PKT] TIMEOUT'); process.exit(1); }, 60000);
