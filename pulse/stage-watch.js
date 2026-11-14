'use strict';
/**
 * stage-watch.js — DAY-4 operator instrument: LIVE pen watch.
 * Connects as opped 'Gallery', stands at the pen, censuses farm stock
 * inside the pen box every 8 s. At t+24 s, if pigs/chickens are short
 * of the chartered restock (2/2 alongside the cow pair), it summons
 * the shortfall UNDER OBSERVATION and keeps censusing, so the record
 * shows what the summoned animals actually do. Ends with save-all.
 */
const NM = '/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules';
const mineflayer = require(NM + '/mineflayer');
const Vec3 = require(NM + '/vec3').Vec3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bot = mineflayer.createBot({ host: '192.168.0.50', port: 25565, username: 'Gallery', auth: 'offline', version: '26.1' });
bot.on('error', (e) => console.log('ERR', e && e.message));
bot.on('kicked', (r) => console.log('KICKED', String(r)));
function penStock() {
  const inside = { pig: [], cow: [], chicken: [] };
  const loose = [];
  for (const e of Object.values(bot.entities || {})) {
    if (!e || !e.position || !e.name) continue;
    const p = e.position;
    if (inside[e.name]) {
      const rec = { x: +p.x.toFixed(1), y: +p.y.toFixed(1), z: +p.z.toFixed(1) };
      if (p.x >= 60.5 && p.x <= 65.5 && p.z >= -103.5 && p.z <= -97.5) inside[e.name].push(rec);
      else if (p.distanceTo(new Vec3(62.5, 67, -100.5)) <= 25) loose.push({ name: e.name, ...rec });
    }
  }
  return { inside, loose };
}
bot.once('spawn', async () => {
  try {
    await sleep(3000);
    bot.chat('/tp Gallery 62 69 -100');
    await sleep(4000);
    let summoned = false;
    for (let i = 0; i < 10; i++) {
      const s = penStock();
      console.log(`t+${i * 8}s inside: pigs=${s.inside.pig.length} cows=${s.inside.cow.length} chickens=${s.inside.chicken.length}`,
        JSON.stringify({ pig: s.inside.pig, chicken: s.inside.chicken, loose: s.loose }));
      if (i === 2 && !summoned) {
        const pigsNeeded = Math.max(0, 2 - s.inside.pig.length);
        const chickensNeeded = Math.max(0, 2 - s.inside.chicken.length);
        if (pigsNeeded + chickensNeeded > 0) {
          console.log(`SUMMONING under watch: pigs x${pigsNeeded}, chickens x${chickensNeeded}`);
          for (let k = 0; k < pigsNeeded; k++) { bot.chat('/summon pig 62.5 67 -100.5'); await sleep(1200); }
          for (let k = 0; k < chickensNeeded; k++) { bot.chat('/summon chicken 63.5 67 -99.5'); await sleep(1200); }
          summoned = true;
        } else {
          console.log('NO SUMMON NEEDED — pen already at restock target');
          summoned = true;
        }
      }
      await sleep(8000);
    }
    bot.chat('/save-all flush');
    await sleep(2500);
    const s = penStock();
    console.log('FINAL inside:', JSON.stringify(s.inside), 'loose:', JSON.stringify(s.loose));
    bot.quit();
    await sleep(700);
    process.exit(0);
  } catch (e) { console.log('FATAL', e); try { bot.quit(); } catch {} process.exit(1); }
});
