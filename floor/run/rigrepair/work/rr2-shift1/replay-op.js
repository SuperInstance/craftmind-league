'use strict';
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
const script = JSON.parse(fs.readFileSync(path.join(dir, 'replay-script.json'), 'utf8'));
const reqPath = path.join(dir, 'op-req.jsonl');
const resPath = path.join(dir, 'op-res.jsonl');
let seen = 0, chatN = 0;
setInterval(() => {
  let lines = [];
  try { lines = fs.readFileSync(reqPath, 'utf8').split('\n').filter((l) => l.trim()); } catch { return; }
  while (seen < lines.length) {
    let req; try { req = JSON.parse(lines[seen]); } catch { seen++; continue; }
    seen++;
    if (req.cmd === 'chat') {
      const step = script[Math.min(chatN++, script.length - 1)];
      setTimeout(() => {
        fs.appendFileSync(resPath, JSON.stringify({ ts: new Date().toISOString(), id: req.id, ok: true, chat: '/time set 1000', srv: ['Set minecraft:overworld to  tick(s)'], replayDelayMs: step.delayMs }) + '\n');
      }, step.delayMs);
    } else {
      fs.appendFileSync(resPath, JSON.stringify({ ts: new Date().toISOString(), id: req.id, ok: true }) + '\n');
    }
  }
}, 50);
