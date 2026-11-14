'use strict';
const fs = require('fs');
const nbt = require('/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules/prismarine-nbt');
(async () => {
  for (const name of ['cody_live', 'cody', 'geist', 'vega', 'magnus']) {
    const p = '/home/caseydigennaro/craftmind-league/repair-cody/' + name + '.dat';
    if (!fs.existsSync(p)) { console.log(name, 'MISSING'); continue; }
    try {
      const { parsed } = await nbt.parse(fs.readFileSync(p));
      const s = nbt.simplify(parsed);
      console.log('=====', name.toUpperCase(), '=====');
      console.log(JSON.stringify(s, null, 1));
    } catch (e) { console.log(name, 'ERR', e.message); }
  }
})();
