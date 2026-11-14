'use strict';
// Fresh-eyes verify: entity census around the pen from a new connection.
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const Vec3 = require(NM + '/vec3').Vec3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Gallery', auth: 'offline', version: '26.1' });
bot.on('error', (e) => console.log('ERR', e && e.message));
bot.once('spawn', async () => {
  await sleep(3000);
  bot.chat('/tp Gallery 62 69 -100');
  await sleep(6000); // let entity spawn packets settle
  const all = [];
  for (const e of Object.values(bot.entities || {})) {
    if (!e || !e.position || !e.name || e.name === 'item') continue;
    const p = e.position;
    const dPen = p.distanceTo(new Vec3(62.5, 67, -100.5));
    if (dPen <= 20) all.push({ name: e.name, x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1), dPen: +dPen.toFixed(1) });
  }
  all.sort((a, b) => a.dPen - b.dPen);
  console.log('ENTITIES WITHIN 20 OF PEN CENTRE:', JSON.stringify(all));
  bot.quit();
  await sleep(600);
  process.exit(0);
});
