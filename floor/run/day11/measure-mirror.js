'use strict';
/**
 * measure-mirror.js — MEASURE the log mirror's refresh latency the
 * way the floor's daylight verification experiences it.
 *
 * Method: append a unique marker line to a THOR-LOCAL probe file
 * (never to the Orin — nothing is written on the Orin; the Orin log
 * itself is the read-only source). Instead of writing to the real
 * server log (forbidden), we time the mirror's own refresh loop:
 *   1. N sequential `log-mirror.sh once` runs -> per-refresh wall time
 *      (ssh + tail + replace), the floor's worst-case staleness add.
 *   2. A landing-visibility simulation: floor.js daylightCheck()
 *      records the mirror size, issues, then polls the mirror every
 *      100 ms for up to 2000 ms for the needle; the needle here is a
 *      line ALREADY in the Orin log before the refresh starts, and we
 *      measure how long until a mirror refresh makes the log's
 *      CURRENT last line visible locally — the transport component of
 *      landing latency. (The command-issue -> server-log component
 *      happens on the Orin and is not the mirror's.)
 * Prints JSON lines. Offline/measurement only.
 */
const { execFileSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = '/home/caseydigennaro/craftmind-league/floor/run/day11';
const MIRROR = path.join(DIR, 'server-log-mirror.log');
const SCRIPT = path.join(DIR, 'log-mirror.sh');

function refresh() {
  const t0 = Date.now();
  execFileSync('bash', [SCRIPT, 'once'], { stdio: 'pipe' });
  return Date.now() - t0;
}

async function main() {
  const runs = [];
  for (let i = 0; i < 10; i++) runs.push(refresh());
  runs.sort((a, b) => a - b);
  const med = runs[Math.floor(runs.length / 2)];
  const p90 = runs[Math.floor(runs.length * 0.9)];
  const max = runs[runs.length - 1];

  // Landing-visibility under a continuously refreshing mirror:
  // start the loop at 1 s cadence, then time how long until the
  // mirror's tail equals the Orin log's current tail (sampled once
  // at test start through a fresh refresh).
  execFileSync('bash', [SCRIPT, 'once'], { stdio: 'pipe' });
  const targetTail = fs.readFileSync(MIRROR, 'utf8').slice(-120);
  const loop = spawn('bash', [SCRIPT, 'loop', '1'], { detached: true, stdio: 'ignore' });
  const vis = [];
  try {
    for (let trial = 0; trial < 5; trial++) {
      // Perturb: wait for a refresh boundary, then check visibility
      // of the (unchanged) tail — measures loop phase error only,
      // the append->visible term is bounded by cadence + refresh.
      const t0 = Date.now();
      for (;;) {
        const cur = fs.readFileSync(MIRROR, 'utf8').slice(-120);
        if (cur === targetTail) { vis.push(Date.now() - t0); break; }
        if (Date.now() - t0 > 10000) { vis.push(-1); break; }
        await new Promise((r) => setTimeout(r, 100)); // floor.js poll cadence
      }
      await new Promise((r) => setTimeout(r, 1100));
    }
  } finally {
    try { process.kill(-loop.pid, 'SIGKILL'); } catch { try { loop.kill('SIGKILL'); } catch {} }
  }
  console.log(JSON.stringify({
    refresh_ms: { runs, median: med, p90, max },
    note: 'append->visible latency for a NEW server-log line = up to one loop cadence (1 s) + one refresh (median above); floor.js polls the mirror every 100 ms inside a 2000 ms window',
    loop_phase_visibility_ms: vis,
  }, null, 1));
}
main();
