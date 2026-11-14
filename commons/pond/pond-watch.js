// pond-watch.js — commons pond v2: the pond's ledger-keeper loop.
//
// A standalone process, sibling to (and deliberately separate from) the
// comms daemon: it does not touch the daemon, the citizens, or the exam.
// Every 60 s it runs one pond.js cycle — register new pond entries, scan
// the citizens' public logs for NEW citations of pond entries (a citation
// by the receiver confirms an open transfer; any citation is a retrieval),
// and sweep for decay (no retrieval inside 48 h => decayed, sunk in
// listings, never deleted). All state lives beside it in commons/pond/:
// index.json, pond-ledger.jsonl (append-only), .scan-state.json.
//
// Run from this directory: node pond-watch.js   (see start-pond-watch.sh)
const pond = require("./pond.js");

const CADENCE_MS = 60 * 1000;

function log(...a) { console.log(new Date().toISOString(), "[POND]", ...a); }

function cycle() {
  try {
    const s = pond.runCycle([]);
    const bits = [];
    if (s.primed) bits.push("primed (existing logs baselined; no retroactive credit)");
    if (s.registered && s.registered.length) bits.push("registered " + s.registered.join(", "));
    if (s.retired && s.retired.length) bits.push("retired " + s.retired.join(", "));
    if (s.retrievals && s.retrievals.length) bits.push("retrievals: " + s.retrievals.join("; "));
    if (s.confirmed && s.confirmed.length) bits.push("CONFIRMED: " + s.confirmed.join("; "));
    if (s.decayed && s.decayed.length) bits.push("decayed: " + s.decayed.join(", "));
    if (s.undecayed && s.undecayed.length) bits.push("undecayed: " + s.undecayed.join(", "));
    if (bits.length) log("cycle —", bits.join(" · "));
  } catch (e) {
    log("cycle error:", (e && e.message) || e);
  }
}

log("pond-watch started — cadence 60 s, decay window", pond.DECAY_WINDOW_MS / 3600000, "h");
cycle();
setInterval(cycle, CADENCE_MS);
