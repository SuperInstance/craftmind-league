'use strict';
// extract-lib-day5.js — SHARED extraction for the day-5 proof
// harnesses. Pulls perceiveTrees / treesText / arrivalCheck /
// compass OUT OF the shipped driver file by index-bounded spans
// (never regexes over function bodies — a non-greedy regex stops
// at the first inner "\n}" and silently ships a truncated
// function; and never regex-extract a regex literal — the harness
// lost LOG_RE's $ anchor that way and "proved" a false FAIL).
// Bindings go on globalThis because strict-mode eval keeps its own
// declarations local.
const fs = require('fs');
function loadDriverFns(driverPath) {
  const src = fs.readFileSync(driverPath, 'utf8');
  const span = (fname) => {
    const a = src.indexOf('function ' + fname);
    if (a < 0) throw new Error('span not found: ' + fname);
    const b = src.indexOf('\n}\n', a);
    if (b < 0) throw new Error('span end not found: ' + fname);
    return src.slice(a, b + 3);
  };
  globalThis.LOG_RE = /_log$/; // the driver's literal, verbatim
  // the driver closes over prims' Vec3 at module scope; extracted
  // functions reference the same free name — supply it identically.
  globalThis.Vec3 = require('/home/caseydigennaro/craftmind-league/pulse/lib/prims.js').Vec3;
  for (const fname of ['compass', 'perceiveTrees', 'treesText', 'arrivalCheck']) {
    globalThis[fname] = eval(span(fname) + '\n;' + fname);
    if (typeof globalThis[fname] !== 'function') throw new Error('extract did not define ' + fname);
  }
  return { compass: globalThis.compass, perceiveTrees: globalThis.perceiveTrees, treesText: globalThis.treesText, arrivalCheck: globalThis.arrivalCheck, LOG_RE: globalThis.LOG_RE };
}
module.exports = { loadDriverFns };
