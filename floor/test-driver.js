'use strict';
/**
 * test-driver.js — a fixture driver (D). Heartbeats by writing
 * heartbeat.json (the fixture form of lease renewal) and attempts a
 * command through the gate every second, appending each result to
 * driver-results.jsonl. It never stops on its own: after a PARK it
 * keeps attempting ("spamming"), and the gate's answers are the record.
 *
 * usage: node test-driver.js <stateDir> <driverId>
 */
const fs = require('fs');
const path = require('path');
const { createGate } = require('./gate');

const [stateDir, driverId] = process.argv.slice(2);
const gate = createGate(stateDir);
const resultsFile = path.join(stateDir, 'driver-results.jsonl');
let n = 0;
fs.writeFileSync(path.join(stateDir, 'driver.pid'), String(process.pid));

setInterval(() => {
  fs.writeFileSync(path.join(stateDir, 'heartbeat.json'), JSON.stringify({ ts_ms: Date.now(), driver: driverId }));
}, 200);
setInterval(() => {
  n++;
  const cmd = 'cmd-' + n;
  const r = gate.exec(driverId, cmd);
  fs.appendFileSync(resultsFile, JSON.stringify({ ts: new Date().toISOString(), cmd, ok: r.ok, reason: r.reason || null }) + '\n');
}, 1000);
