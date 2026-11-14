'use strict';
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const { Vec3 } = require(NM + '/vec3');
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'RepairProbe', auth: 'offline' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
bot.once('spawn', async () => {
  console.log('[OBS] spawned at', JSON.stringify(bot.entity.position));
  await sleep(4000);
  const players = Object.keys(bot.players||{});
  console.log('[OBS] players online:', players.join(','));
  const cody = bot.players['Cody'] && bot.players['Cody'].entity;
  if (!cody) { console.log('[OBS] Cody entity NOT visible to probe'); }
  else {
    console.log('[OBS] Cody entity keys:', Object.keys(cody).join(','));
    console.log('[OBS] Cody pos', JSON.stringify(cody.position), 'vel', JSON.stringify(cody.velocity), 'yaw', cody.yaw, 'pitch', cody.pitch, 'onGround', cody.onGround);
    console.log('[OBS] Cody vehicle field:', cody.vehicle ? (cody.vehicle.type+' '+cody.vehicle.name+' pos '+JSON.stringify(cody.vehicle.position)) : String(cody.vehicle));
    console.log('[OBS] Cody metadata sample:', JSON.stringify(cody.metadata));
    console.log('[OBS] Cody effects:', JSON.stringify(bot.players['Cody'].entity && cody.effects));
  }
  const cx=46, cz=-84;
  console.log('[OBS] --- blocks around Cody (non-air), x 43..50, z -87..-80 ---');
  for (let y=62; y<=69; y++) {
    let row=[];
    for (let x=43; x<=50; x++) for (let z=-87; z<=-80; z++) {
      const b = bot.blockAt(new Vec3(x,y,z));
      if (b && b.name!=='air' && b.name!=='cave_air' && b.name!=='void_air') row.push(x+','+y+','+z+'='+b.name+'(bb:'+b.boundingBox+')');
    }
    if (row.length) console.log('[OBS] y='+y+': '+row.join(' | '));
    else console.log('[OBS] y='+y+': (all air)');
  }
  console.log('[OBS] --- entities within 8 blocks of Cody pin point ---');
  const pin = new Vec3(46.648,65,-83.305);
  for (const id of Object.keys(bot.entities)) {
    const e = bot.entities[id];
    if (e && e.position && e.position.distanceTo(pin) < 8) console.log('[OBS] ent id',id,'type',e.type,'name',e.name,'username',e.username,'pos',JSON.stringify(e.position),'isValid',e.isValid);
  }
  if (cody) {
    console.log('[OBS] --- sampling Cody position 8 x 750ms (resident wander should move him) ---');
    let prev = cody.position.clone();
    for (let i=0;i<8;i++){ await sleep(750); const p=cody.position; console.log('[OBS] sample',i, p.x.toFixed(4),p.y.toFixed(4),p.z.toFixed(4),'movedSincePrev', prev.distanceTo(p).toFixed(4)); prev=p.clone(); }
  }
  bot.quit(); process.exit(0);
});
bot.on('error', (e) => console.log('[OBS] error', e.message));
setTimeout(() => { console.log('[OBS] TIMEOUT'); process.exit(1); }, 60000);
