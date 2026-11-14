'use strict';
/**
 * fake-op.js — a fixture op bot for the FileOpChannel test: watches a
 * request JSONL, appends a result line per request, and for a daylight
 * chat command also appends the issuer-specific landing line to the
 * fixture server log (what the real server would do).
 *
 * usage: node fake-op.js <reqFile> <resFile> <serverLogFile> <issuer>
 */
const fs = require('fs');

const [reqFile, resFile, logFile, issuer] = process.argv.slice(2);
let seen = 0;
setInterval(() => {
  let lines = [];
  try { lines = fs.readFileSync(reqFile, 'utf8').split('\n').filter((l) => l.trim()); } catch { return; }
  while (seen < lines.length) {
    let req; try { req = JSON.parse(lines[seen]); } catch { seen++; continue; }
    seen++;
    fs.appendFileSync(resFile, JSON.stringify({ ts: new Date().toISOString(), id: req.id, ok: true }) + '\n');
    if (req.cmd === 'chat' && /\/time set/.test(req.text || '')) {
      fs.appendFileSync(logFile, `[00:00:02] [Server thread/INFO]: ${issuer} issued server command: ${req.text}\n`);
    }
  }
}, 100);
