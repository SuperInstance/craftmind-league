#!/usr/bin/env node
// tension.js — the tension score as a pure instrument (study §B construction).
// One fixed-anchor computation over server-authoritative citizen state as
// recorded in the direct-drive day traces (per-cycle hp/food/pos samples are
// server-sent state relayed to the citizen client and written by the crew
// sampler). No narration, no chat, no camera data, no log-verbosity input.
//
// Terms (study B.3): p_H (rate+static), p_M, p_N, p_F, p_E, p_V (weight 0).
//   p_M: DROPPED — no hostiles series exists in any recorded store.
//   p_N: NULL — daylight held by contract on held days (null per spec);
//        on other days no world-time series exists, so it cannot be grounded.
// T = 1 - (1-p_H)(1-p_F)(1-p_E) over the grounded terms (noisy-OR, B.4).
// No per-day normalisation. Anchors absolute.
//
// Usage:
//   node tension.js --trace F --day NAME --out TSV --manifest JSON
//                   [--deaths F] [--held 0|1] [--filter none|drop50|halve|triple]
//                   [--emitCheckpoint F] [--resume F]
"use strict";
const fs = require("fs");
const crypto = require("crypto");

const SCORE_VER = "tension-1.0.0";
// Deaths whose fault_owner is the harness (operator-caused 115/116;
// day-9 record: all three deaths fault_owner: harness). Excluded from the
// p_E death-set and from C3/C8's non-harness event labels.
const HARNESS_DEATH_N = new Set([115, 116, 121, 122, 123]);

function arg(name, dflt) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 ? process.argv[i + 1] : dflt;
}
function sha256(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }
function fmt(x) { return x === null || x === undefined || Number.isNaN(x) ? "" : x.toFixed(6); }

function loadTrace(path) {
  const rows = [];
  for (const line of fs.readFileSync(path, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch (e) { continue; }
    if (r && r.ts) rows.push(r);
  }
  rows.sort((a, b) => (a.ts < b.ts ? -1 : a.ts > b.ts ? 1 : 0));
  return rows;
}

function extract(rows) {
  const samples = [], deaths = [], feeds = [];
  for (const r of rows) {
    const t = Date.parse(r.ts) / 1000;
    if (typeof r.hp === "number" && r.pos) {
      samples.push({ t, hp: r.hp, food: typeof r.food === "number" ? r.food : null, pos: r.pos, cycle: r.kind === "cycle" });
    }
    if (r.kind === "death") deaths.push({ t, n: r.n || null });
    if (r.kind === "wake" && r.step === "fed") feeds.push(t);
  }
  return { samples, deaths, feeds, rowTimes: rows.map(r => Date.parse(r.ts) / 1000) };
}

function loadDeathsRecord(path, t0, t1) {
  // Returns Map epochSec -> {n, harness} for verified deaths inside window.
  const map = new Map();
  if (!path || !fs.existsSync(path)) return map;
  for (const line of fs.readFileSync(path, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch (e) { continue; }
    if (!r.ts || typeof r.n !== "number") continue;
    const t = Math.floor(Date.parse(r.ts) / 1000);
    if (t < t0 - 5 || t > t1 + 5) continue;
    map.set(t, { n: r.n, harness: HARNESS_DEATH_N.has(r.n) });
  }
  return map;
}

function applyFilter(samples, filter) {
  if (filter === "none" || filter === "triple") return samples.slice();
  if (filter === "drop50") { // deterministic hash-half of samples
    return samples.filter((s, i) => ((Math.imul(i + 1, 2654435761) >>> 0) % 2) === 0);
  }
  if (filter === "halve") return samples.filter((s, i) => i % 2 === 0);
  throw new Error("unknown filter " + filter);
}

function expandTriple(samples) {
  const out = [];
  for (const s of samples) {
    out.push(s);
    out.push({ ...s, t: s.t + 1 / 3 });
    out.push({ ...s, t: s.t + 2 / 3 });
  }
  out.sort((a, b) => a.t - b.t);
  return out;
}

function score(opts) {
  const traceBuf = fs.readFileSync(opts.trace);
  const rows = loadTrace(opts.trace);
  let { samples, deaths, feeds } = extract(rows);
  samples = applyFilter(samples, opts.filter || "none");
  if (opts.filter === "triple") samples = expandTriple(samples);
  if (samples.length === 0) throw new Error("no state samples in trace");

  // Resume (C1 restart support): warm samples/feeds from the checkpoint are
  // merged in so trailing windows rebuild exactly; E and phase history are
  // restored in the state block below.
  let resumeCp = null;
  if (opts.resume) {
    resumeCp = JSON.parse(fs.readFileSync(opts.resume, "utf8"));
    const seen = new Set(samples.map(s => s.t + "|" + s.hp));
    for (const ws of resumeCp.warmSamples || []) {
      if (!seen.has(ws.t + "|" + ws.hp)) samples.push(ws);
    }
    samples.sort((a, b) => a.t - b.t);
    for (const f of resumeCp.feeds || []) if (!feeds.includes(f)) feeds.push(f);
    feeds.sort((a, b) => a - b);
  }

  const t0 = Math.floor(samples[0].t);
  // Grid extends to the last trace ROW of any kind, not the last state
  // sample: on day 3 the four death rows land 47–113 s after the final
  // cycle sample, and a grid that ends at the last sample silently
  // amputates the day's most important seconds. Seconds past the last
  // sample age into SOURCE_STALE at >90 s by the normal rule.
  const tLastRow = Math.floor(Date.parse(rows[rows.length - 1].ts) / 1000);
  const t1 = Math.max(Math.floor(samples[samples.length - 1].t), tLastRow);
  const recDeaths = loadDeathsRecord(opts.deaths, t0, t1);
  // Merge death events: trace death rows + record rows (dedupe within 3 s).
  const deathEvents = [];
  for (const d of deaths) deathEvents.push({ t: Math.floor(d.t), harness: false, n: d.n });
  for (const [t, info] of recDeaths) {
    if (!deathEvents.some(d => Math.abs(d.t - t) <= 3)) deathEvents.push({ t, harness: info.harness, n: info.n });
    else for (const d of deathEvents) if (Math.abs(d.t - t) <= 3 && info.harness) d.harness = true;
  }
  if (resumeCp) {
    for (const d of resumeCp.deathEvents || []) {
      if (!deathEvents.some(x => Math.abs(x.t - d.t) <= 3)) deathEvents.push(d);
    }
  }
  deathEvents.sort((a, b) => a.t - b.t);

  // Drop/heal/food-change events at sample instants (second resolution).
  const hpDrops = new Map(), foodDrops = new Map(), changeEvents = [];
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1], b = samples[i];
    const sec = Math.floor(b.t);
    if (b.hp < a.hp) hpDrops.set(sec, (hpDrops.get(sec) || 0) + (a.hp - b.hp));
    if (typeof b.food === "number" && typeof a.food === "number" && b.food < a.food)
      foodDrops.set(sec, (foodDrops.get(sec) || 0) + (a.food - b.food));
    const moved = a.pos && b.pos ? Math.hypot(b.pos.x - a.pos.x, b.pos.y - a.pos.y, b.pos.z - a.pos.z) : 0;
    changeEvents.push({ sec, moved: moved > 0.5, hpCh: b.hp !== a.hp, foodCh: b.food !== a.food });
  }
  const deathSecs = new Set(deathEvents.map(d => d.t));
  const sumWindow = (map, t, w) => { let s = 0; for (const [sec, v] of map) if (sec > t - w && sec <= t) s += v; return s; };

  // Resume state: E + phase history restored from the checkpoint.
  let E = 0, startSec = t0;
  let hist = []; // {t, T} for phase windows
  if (resumeCp) { E = resumeCp.E; startSec = resumeCp.nextSec; hist = resumeCp.hist || []; }
  const inWindow = (sec, t, w) => sec > t - w && sec <= t;

  const out = [];
  const allSamples = samples;
  let belowLoRun = 0, peakSinceRest = false, restUntil = -1, onsetFlag = "";
  let checkpoint = null;

  for (let t = startSec; t <= t1; t++) {
    // Step-hold: last sample at or before this second (binary search).
    let lo = 0, hi = allSamples.length - 1, idx = -1;
    while (lo <= hi) { const mid = (lo + hi) >> 1; if (allSamples[mid].t <= t + 0.999) { idx = mid; lo = mid + 1; } else hi = mid - 1; }
    const cur = idx >= 0 ? allSamples[idx] : null;
    const age = cur ? t - Math.floor(cur.t) : Infinity;

    const maskBits = [];
    if (opts.held) maskBits.push("HOLD");
    const inFeed = feeds.some(f => t >= Math.floor(f) && t < Math.floor(f) + 120);
    if (inFeed) maskBits.push("FEED");
    const inRespawn = deathEvents.some(d => t >= d.t && t < d.t + 15);
    if (inRespawn) maskBits.push("RESPAWN");
    const stale = !cur || age > 90;
    if (stale) maskBits.push("SOURCE_STALE");

    // p_E evolves every second regardless (decay), drops land at sample secs.
    E = E * Math.exp(-1 / 30);
    const dropHere = hpDrops.get(t) || 0;
    if (dropHere > 0) E = Math.min(1, E + dropHere / 20);
    const deathHere = deathEvents.find(d => d.t === t);
    if (deathHere && !deathHere.harness) E = 1;
    E = Math.min(1, E);

    let T = null, pH = null, pF = null, topTerm = "", phase = "", acts = 0;
    // acts_per_min: cycle samples in trailing 60 s.
    acts = allSamples.filter(s => s.cycle && s.t > t - 60 && s.t <= t + 0.999).length;

    if (!stale && cur) {
      const hp = cur.hp, food = cur.food;
      // p_H rate: trailing 10 s of drops.
      const loss10 = sumWindow(hpDrops, t, 10);
      let pRate = 0;
      if (loss10 > 0) { const rate = loss10 / 10; const tau = hp / rate; pRate = Math.min(1, Math.exp(-tau / 10)); }
      let pStatic = 0.5 * Math.pow(1 - hp / 20, 2);
      if (inRespawn) pStatic = 0; // spec exclusion: respawn window
      pH = 1 - (1 - pRate) * (1 - pStatic);
      // p_F: food only (saturation not recorded — flagged in manifest).
      if (typeof food === "number") {
        const drain = sumWindow(foodDrops, t, 300) / 300;
        if (food <= 6) pF = 0.4;
        else if (drain > 0) pF = 0.4 * Math.exp(-((food - 6) / drain) / 120);
        else pF = 0;
      } else pF = 0;
      T = 1 - (1 - pH) * (1 - pF) * (1 - E);
      const terms = [["p_H", pH], ["p_F", pF], ["p_E", E]];
      terms.sort((a, b) => b[1] - a[1]);
      topTerm = terms[0][1] > 0 ? terms[0][0] : "";
    }

    hist.push({ t, T });
    // phase: FSM over trailing 120 s mean of T.
    const win = hist.filter(h => h.t > t - 120 && h.T !== null);
    if (win.length >= 10) {
      const avg = win.reduce((s, h) => s + h.T, 0) / win.length;
      const prev = hist.filter(h => h.t > t - 240 && h.t <= t - 120 && h.T !== null);
      const avgPrev = prev.length >= 10 ? prev.reduce((s, h) => s + h.T, 0) / prev.length : avg;
      if (avg >= 0.5) phase = "SUSTAIN";
      else if (avg >= 0.15) phase = avg >= avgPrev ? "BUILD_UP" : "FADE";
      else phase = "RELAX";
    }
    // onset / rest (narrator signal, as data only).
    onsetFlag = "";
    if (T !== null) {
      if (T < 0.15) {
        belowLoRun++;
        if (peakSinceRest && t > restUntil) { restUntil = t + 59; onsetFlag = "rest"; peakSinceRest = false; }
        else if (t <= restUntil) onsetFlag = "rest";
      } else {
        if (T >= 0.15 && belowLoRun >= 30) { onsetFlag = "onset"; }
        if (T >= 0.5) peakSinceRest = true;
        belowLoRun = 0;
      }
    } else belowLoRun = 0;
    const blocked = maskBits.some(b => ["FEED", "RESPAWN", "PARKED", "SWAP", "SOURCE_STALE"].includes(b)) ? 1 : 0;
    // p_V: state-diff classes in trailing 10 s (weight 0 — never enters T).
    let pV = 0;
    {
      const cls = new Set();
      for (const ce of changeEvents) if (inWindow(ce.sec, t, 10)) {
        if (ce.moved) cls.add("moved"); if (ce.hpCh) cls.add("hp"); if (ce.foodCh) cls.add("food");
      }
      for (const d of deathEvents) if (inWindow(d.t, t, 10)) cls.add("death");
      pV = cls.size / 4;
    }
    out.push([
      (t - t0) * 20, fmt(T), fmt(pH), "", "", fmt(pF), fmt(stale ? null : E), pV.toFixed(6),
      topTerm, "", phase, maskBits.join("|"), acts, onsetFlag, blocked
    ].join("\t"));
    if (opts.emitCheckpoint && t === t1) {
      checkpoint = {
        E, nextSec: t1 + 1, day: opts.day,
        hist: hist.filter(h => h.t > t1 - 240),
        warmSamples: allSamples.filter(s => s.t > t1 - 400),
        feeds: feeds.filter(f => f > t1 - 400),
        deathEvents: deathEvents.filter(d => d.t > t1 - 400)
      };
    }
  }
  if (opts.emitCheckpoint && checkpoint) fs.writeFileSync(opts.emitCheckpoint, JSON.stringify(checkpoint));
  return { lines: out, samples: samples.length, t0, t1, deathEvents, feeds, inputSha: sha256(traceBuf) };
}

function main() {
  const opts = {
    trace: arg("trace"), day: arg("day", "day"), out: arg("out"), manifest: arg("manifest"),
    deaths: arg("deaths", null), held: arg("held", "0") === "1",
    filter: arg("filter", "none"), emitCheckpoint: arg("emitCheckpoint", null), resume: arg("resume", null)
  };
  const r = score(opts);
  const header = ["tick", "T", "p_H", "p_M", "p_N", "p_F", "p_E", "p_V", "top_term", "threat_pos", "phase", "mask", "acts_per_min", "onset", "blocked"].join("\t");
  const body = header + "\n" + r.lines.join("\n") + "\n";
  if (opts.out) fs.writeFileSync(opts.out, body);
  const manifest = {
    day: opts.day, score_ver: SCORE_VER,
    trace_file: opts.trace, input_sha256: r.inputSha,
    code_sha256: sha256(fs.readFileSync(__filename)),
    row_count: r.lines.length, samples: r.samples,
    window_utc: [new Date(r.t0 * 1000).toISOString(), new Date(r.t1 * 1000).toISOString()],
    grid: "1 s step-hold over per-cycle trace samples (20 ticks nominal per row)",
    terms_grounding: {
      p_H: "trace hp samples (server-sent state); rate = trailing 10 s drops, static = 0.5*(1-hp/20)^2, static zeroed in RESPAWN window",
      p_F: "trace food samples ONLY — saturation is not recorded anywhere; drain = trailing 300 s food decreases",
      p_E: "derived from hp drop events + deaths; harness-owned deaths (115,116,121,122,123) excluded from the E=1 set",
      p_V: "state-diff classes over the sample series; weight 0, never enters T"
    },
    terms_dropped: ["p_M — no hostiles-with-distance series exists in any recorded store (traces carry hp/food/pos per cycle only)"],
    terms_null: ["p_N — null on daylight-held days per spec; on unheld/unverified days no world-time series exists to ground seconds-to-hostile-light"],
    held_daylight: opts.held,
    deaths_in_window: r.deathEvents, feed_events: r.feeds.map(f => new Date(f * 1000).toISOString())
  };
  if (opts.manifest) fs.writeFileSync(opts.manifest, JSON.stringify(manifest, null, 1));
  console.log(JSON.stringify({ day: opts.day, rows: r.lines.length, samples: r.samples }));
}
if (require.main === module) main();
module.exports = { score, SCORE_VER };
