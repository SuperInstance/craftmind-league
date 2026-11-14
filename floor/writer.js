'use strict';
/**
 * writer.js — the floor's ONLY output path, as a separate child process.
 *
 * The floor core sends rows on stdin: {"target": <name>, "row": {...}}.
 * The writer appends each row as one JSON line to its file and acks the
 * row's seq on stdout: {"ack": <seq>}.
 *
 * Why a separate process: the day-10 guard failure was a watcher whose
 * outputs stopped while it was believed alive. If the core's liveness
 * and its outputs live in one process, "alive" proves nothing about
 * "writing". Here, output movement is a distinct, killable, measurable
 * thing: kill this process and the canary stops while the core still
 * runs — the verifier (verifier.js) detects exactly that.
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const dir = process.argv[2];
if (!dir) { console.error('usage: writer.js <stateDir>'); process.exit(2); }
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'writer.pid'), String(process.pid));

const FILES = {
  log: 'floor-log.jsonl',       // the act log (C.5 runtime log)
  canary: 'floor-canary.jsonl', // SELF_PROVE rows through the real writer path
  counts: 'floor-counts.jsonl', // COUNT_DEATH appends (the floor's count record)
  alert: 'operator-alert.jsonl',// NOTIFY rows for the operator plane
};

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  const file = FILES[msg.target];
  if (!file || !msg.row) {
    process.stdout.write(JSON.stringify({ ack: msg && msg.row ? msg.row.seq : null, error: 'bad-target' }) + '\n');
    return;
  }
  try {
    fs.appendFileSync(path.join(dir, file), JSON.stringify(msg.row) + '\n');
    process.stdout.write(JSON.stringify({ ack: msg.row.seq }) + '\n');
  } catch (e) {
    process.stdout.write(JSON.stringify({ ack: msg.row.seq, error: String(e && e.message || e) }) + '\n');
  }
});
rl.on('close', () => process.exit(0));
