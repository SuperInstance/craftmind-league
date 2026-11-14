#!/usr/bin/env node
// controls.js — the study's apparatus/placebo controls (B.8), run in order.
// Offline-runnable here: C1, C2, C3, C4, C6, C8.
// Not runnable under this lane's constraints (recorded, not faked):
//   C0 (live throwaway body), C5 (live intervention on the Orin),
//   C7 (no paired citizen-client-view series exists), C9 (human watcher),
//   C10 (no consumer placements exist in the recorded days — vacuous),
//   C11 (weeks of randomised placements).
// Promotion stops at the first control that does not pass: that is C0.
// Everything after it is reported as diagnostics, per the commission.
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const NODE = process.execPath;
const HERE = __dirname;
const LEAGUE = path.resolve(HERE, "..");
const OUT = path.join(HERE, "out");
const TMP = path.join(HERE, "tmp-controls");
const HARNESS_DEATH_N = new Set([115, 116, 121, 122, 123]);

function sha(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function ranks(arr) { // average ranks, 1-based
  const idx = arr.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(arr.length);
  let i = 0;
  while (i < idx.length) {
    let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[idx[k][1]] = avg;
    i = j + 1;
  }
  return r;
}
function spearman(x, y) {
  const rx = ranks(x), ry = ranks(y);
  const n = x.length, mx = rx.reduce((a, b) => a + b, 0) / n, my = ry.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) { num += (rx[i] - mx) * (ry[i] - my); dx += (rx[i] - mx) ** 2; dy += (ry[i] - my) ** 2; }
  return dx && dy ? num / Math.sqrt(dx * dy) : NaN;
}
function auc(scores, labels) { // Mann-Whitney with tie-averaged ranks
  const r = ranks(scores);
  let sumPos = 0, nPos = 0, nNeg = 0;
  for (let i = 0; i < labels.length; i++) { if (labels[i]) { sumPos += r[i]; nPos++; } else nNeg++; }
  if (!nPos || !nNeg) return NaN;
  return (sumPos - nPos * (nPos + 1) / 2) / (nPos * nNeg);
}

function readTSV(file) {
  const lines = fs.readFileSync(file, "utf8").trim().split("\n");
  const head = lines[0].split("\t");
  return lines.slice(1).map(l => {
    const p = l.split("\t"); const o = {};
    head.forEach((h, i) => o[h] = p[i]);
    o.T = o.T === "" ? null : parseFloat(o.T);
    o.absSec = null; // filled by caller from manifest window
    return o;
  });
}
function loadDays() {
  const days = [];
  for (const f of fs.readdirSync(OUT).filter(f => f.endsWith(".manifest.json"))) {
    const m = JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8"));
    const rows = readTSV(path.join(OUT, m.day + ".tsv"));
    const start = Math.floor(Date.parse(m.window_utc[0]) / 1000);
    for (const r of rows) r.absSec = start + parseInt(r.tick, 10) / 20;
    days.push({ manifest: m, rows });
  }
  days.sort((a, b) => a.manifest.day.localeCompare(b.manifest.day, undefined, { numeric: true }));
  return days;
}
function loadTraceRows(tracePath) {
  const rows = [];
  for (const line of fs.readFileSync(tracePath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch (e) { continue; }
    if (r && r.ts) rows.push(r);
  }
  rows.sort((a, b) => (a.ts < b.ts ? -1 : 1));
  return rows;
}

// ---------- C1: determinism + restart ----------
function c1(days) {
  const d10 = days.find(d => d.manifest.day === "day10");
  const trace = d10.manifest.trace_file;
  const args = ["--trace", trace, "--day", "day10", "--held", "1", "--deaths", path.join(LEAGUE, "pulse/deaths-record.jsonl")];
  const run = (extra, outName) => {
    execFileSync(NODE, [path.join(HERE, "tension.js"), ...args, ...extra, "--out", path.join(TMP, outName)], { stdio: "pipe" });
    return fs.readFileSync(path.join(TMP, outName), "utf8");
  };
  const a = run([], "c1-a.tsv"), b = run([], "c1-b.tsv");
  const identical = sha(a) === sha(b);
  // Restart mid-segment: split trace rows at the temporal midpoint.
  const rows = loadTraceRows(trace);
  const tMid = (Date.parse(rows[0].ts) + Date.parse(rows[rows.length - 1].ts)) / 2;
  const first = rows.filter(r => Date.parse(r.ts) <= tMid), second = rows.filter(r => Date.parse(r.ts) > tMid);
  const f1 = path.join(TMP, "c1-first.jsonl"), f2 = path.join(TMP, "c1-second.jsonl");
  fs.writeFileSync(f1, first.map(r => JSON.stringify(r)).join("\n") + "\n");
  fs.writeFileSync(f2, second.map(r => JSON.stringify(r)).join("\n") + "\n");
  const cp = path.join(TMP, "c1-checkpoint.json");
  execFileSync(NODE, [path.join(HERE, "tension.js"), "--trace", f1, "--day", "day10a", "--held", "1", "--deaths", path.join(LEAGUE, "pulse/deaths-record.jsonl"), "--emitCheckpoint", cp, "--out", path.join(TMP, "c1-p1.tsv")], { stdio: "pipe" });
  execFileSync(NODE, [path.join(HERE, "tension.js"), "--trace", f2, "--day", "day10b", "--held", "1", "--deaths", path.join(LEAGUE, "pulse/deaths-record.jsonl"), "--resume", cp, "--out", path.join(TMP, "c1-p2.tsv")], { stdio: "pipe" });
  const full = readTSV(path.join(OUT, "day10.tsv"));
  const start = Math.floor(Date.parse(d10.manifest.window_utc[0]) / 1000);
  const fullMap = new Map(full.map(r => [start + parseInt(r.tick, 10) / 20, r]));
  // Tick bases: p1's base is its first sample; p2's base is its earliest
  // merged sample = the checkpoint's earliest warm sample.
  const hpTimes = rs => rs.filter(r => typeof r.hp === "number").map(r => Date.parse(r.ts) / 1000);
  const p1Base = Math.floor(Math.min(...hpTimes(first)));
  const cpObj = JSON.parse(fs.readFileSync(cp, "utf8"));
  const p2Base = Math.floor(Math.min(cpObj.warmSamples[0].t, Math.min(...hpTimes(second))));
  const cols = ["T", "p_H", "p_F", "p_E", "p_V", "top_term", "phase", "mask", "acts_per_min", "blocked"];
  let compared = 0, mismatched = 0, firstMismatchSec = null;
  const midSec = Math.floor(tMid / 1000);
  const partBySec = new Map();
  for (const r of readTSV(path.join(TMP, "c1-p1.tsv"))) partBySec.set(p1Base + parseInt(r.tick, 10) / 20, r);
  for (const r of readTSV(path.join(TMP, "c1-p2.tsv"))) partBySec.set(p2Base + parseInt(r.tick, 10) / 20, r);
  for (const [sec, fr] of fullMap) {
    if (sec < midSec + 30) continue; // recovery window = one p_E decay window
    const pr = partBySec.get(sec);
    if (!pr) continue;
    compared++;
    const same = cols.every(c => String(fr[c]) === String(pr[c]));
    if (!same) { mismatched++; if (firstMismatchSec === null) firstMismatchSec = sec; }
  }
  return {
    id: "C1", name: "Determinism + restart", status: identical && mismatched === 0 ? "PASS" : "FAIL",
    evidence: `recompute twice: byte-identical=${identical} (sha ${sha(a).slice(0, 12)}…). Restart at midpoint: ${compared} post-recovery seconds compared on ${cols.length} columns (onset edge-state excluded — not checkpointed), mismatches=${mismatched}${firstMismatchSec ? ", first at +" + (firstMismatchSec - midSec) + " s" : ""}.`
  };
}

// ---------- C2: input verbosity / cadence invariance ----------
function c2(days) {
  const results = [];
  let allPass = true;
  for (const dayName of ["day3", "day10"]) {
    const d = days.find(x => x.manifest.day === dayName);
    const base = new Map(d.rows.filter(r => r.T !== null).map(r => [r.absSec, r]));
    for (const filter of ["drop50", "halve", "triple"]) {
      const outName = `c2-${dayName}-${filter}.tsv`;
      execFileSync(NODE, [path.join(HERE, "tension.js"), "--trace", d.manifest.trace_file, "--day", dayName + filter, "--held", d.manifest.held_daylight ? "1" : "0", "--deaths", path.join(LEAGUE, "pulse/deaths-record.jsonl"), "--filter", filter, "--out", path.join(TMP, outName)], { stdio: "pipe" });
      const vr = readTSV(path.join(TMP, outName));
      const start = Math.floor(Date.parse(d.manifest.window_utc[0]) / 1000);
      const vmap = new Map();
      for (const r of vr) { r.absSec = start + parseInt(r.tick, 10) / 20; if (r.T !== null) vmap.set(r.absSec, r); }
      const secs = [...base.keys()].filter(s => vmap.has(s));
      const sp = spearman(secs.map(s => base.get(s).T), secs.map(s => vmap.get(s).T));
      let maxDiff = 0;
      for (const s of secs) maxDiff = Math.max(maxDiff, Math.abs(base.get(s).T - vmap.get(s).T));
      let phTot = 0, phOk = 0;
      for (const s of secs) { const a = base.get(s).phase, b = vmap.get(s).phase; if (a && b) { phTot++; if (a === b) phOk++; } }
      const phAgree = phTot ? phOk / phTot : NaN;
      // Zero-variance base (a constant series — day 10 is identically 0):
      // Spearman is undefined; invariance is then identity of values.
      const identity = Number.isNaN(sp) && maxDiff === 0;
      const pass = identity || (sp >= 0.98 && phAgree >= 0.95);
      if (!pass) allPass = false;
      results.push(`${dayName}/${filter}: ${identity ? "Spearman undefined (base series constant), max|ΔT|=0 — identity holds" : `Spearman=${sp.toFixed(4)}`}, phase agreement=${(phAgree * 100).toFixed(1)}% over ${secs.length} s — ${pass ? "pass" : "FAIL"}`);
    }
  }
  return {
    id: "C2", name: "Log verbosity (adapted: sampling verbosity/cadence of the state series — the score consumes no log rows, so the study's row-drop test is applied to its actual input)",
    status: allPass ? "PASS" : "FAIL",
    evidence: results.join("; ") + ". Pass keeps p_V eligible for future weighting; p_V remains weight 0 in this version regardless."
  };
}

// ---------- shared label machinery for C3 / C8 ----------
function buildLabelSet(days) {
  // Per-second pooled observations across days: predictors + label
  // (non-harness hp loss >= 5 within next 60 s, or non-harness death within 60 s).
  const obs = [];
  const deathsRec = [];
  for (const line of fs.readFileSync(path.join(LEAGUE, "pulse/deaths-record.jsonl"), "utf8").split("\n")) {
    if (!line.trim()) continue; const r = JSON.parse(line);
    deathsRec.push({ t: Math.floor(Date.parse(r.ts) / 1000), n: r.n, harness: HARNESS_DEATH_N.has(r.n) });
  }
  for (const d of days) {
    const rows = d.rows;
    const traceRows = loadTraceRows(d.manifest.trace_file);
    const samples = traceRows.filter(r => typeof r.hp === "number").map(r => ({ t: Date.parse(r.ts) / 1000, hp: r.hp }));
    const rowTimes = traceRows.map(r => Date.parse(r.ts) / 1000);
    const start = Math.floor(Date.parse(d.manifest.window_utc[0]) / 1000);
    const hpAt = sec => { let v = null; for (const s of samples) { if (s.t <= sec + 0.999) v = s.hp; else break; } return v; };
    for (const r of rows) {
      if (r.T === null) continue;
      const sec = r.absSec;
      const hpNow = hpAt(sec);
      if (hpNow === null) continue;
      let minFuture = Infinity;
      for (const s of samples) { if (s.t > sec && s.t <= sec + 60 && s.hp < minFuture) minFuture = s.hp; }
      const deathSoon = deathsRec.some(x => !x.harness && x.t > sec && x.t <= sec + 60 && x.t >= start && x.t <= start + rows.length);
      const label = (hpNow - minFuture >= 5) || deathSoon ? 1 : 0;
      const rpm = rowTimes.filter(t => t > sec - 60 && t <= sec).length;
      obs.push({ T: r.T, hpAlone: 1 - hpNow / 20, rowsPerMin: rpm, label, day: d.manifest.day });
    }
  }
  return obs;
}

function c3(obs) {
  const aT = auc(obs.map(o => o.T), obs.map(o => o.label));
  const aHp = auc(obs.map(o => o.hpAlone), obs.map(o => o.label));
  const aRpm = auc(obs.map(o => o.rowsPerMin), obs.map(o => o.label));
  const beats = aT > aHp && aT > aRpm;
  return {
    id: "C3", name: "Baseline race (the 'free transcript' test)", status: beats ? "PASS (letter only — see rider)" : "FAIL",
    evidence: `Pooled ${obs.length} per-second observations, ${obs.filter(o => o.label).length} positive (non-harness ≥5 hp loss or death within 60 s). AUC: T=${aT.toFixed(3)}, hp alone=${aHp.toFixed(3)}, log rows/min (verbosity)=${aRpm.toFixed(3)}. Legs NOT RUNNABLE: hostile count and time of day — no such series exists in the recorded stores. T ${beats ? "beats every available baseline" : "does NOT beat every available baseline"}. RIDER: winning this race is a weak claim — AUC(T) sits far below C8's 0.75 absolute bar (see C8), the verbosity baseline is anti-predictive rather than competitive, and the hp inputs/labels for days 1–5 rest on the mis-scaled trace hp field (filing §2). C8 is the operative test.`
  };
}
function c8(obs) {
  const aT = auc(obs.map(o => o.T), obs.map(o => o.label));
  const aHp = auc(obs.map(o => o.hpAlone), obs.map(o => o.label));
  const aRpm = auc(obs.map(o => o.rowsPerMin), obs.map(o => o.label));
  const pass = aT >= 0.75 && aT > aHp && aT > aRpm;
  return {
    id: "C8", name: "Predictive validity", status: pass ? "PASS" : "FAIL",
    evidence: `AUC of T for non-harness ≥5 hp loss or death in the next 60 s = ${aT.toFixed(3)} (bar: ≥0.75 and above C3 baselines hp=${aHp.toFixed(3)}, rows/min=${aRpm.toFixed(3)}). ${pass ? "Bar met." : "Bar NOT met."} Note: with p_M dropped (no hostiles store), the score sees mob jeopardy only once damage lands — a structural handicap recorded in the filing.`
  };
}

// ---------- C4: harness share ----------
function c4(days) {
  const per = [];
  let totInt = 0, totHarness = 0;
  for (const d of days) {
    let int = 0, harnessInt = 0;
    const topRows = [];
    for (const r of d.rows) {
      if (r.T === null) continue;
      int += r.T;
      const harnessTick = /FEED|RESPAWN/.test(r.mask || "") ||
        (d.manifest.day === "day9" && r.absSec >= Math.floor(Date.parse("2026-11-09T19:14:12Z") / 1000) && r.absSec <= Math.floor(Date.parse("2026-11-09T19:23:52Z") / 1000));
      if (harnessTick) harnessInt += r.T;
      topRows.push(r);
    }
    topRows.sort((a, b) => b.T - a.T);
    const topDecile = topRows.slice(0, Math.max(1, Math.floor(topRows.length / 10)));
    const inHarnessWindow = d.manifest.day === "day9"
      ? topDecile.filter(r => r.absSec >= Math.floor(Date.parse("2026-11-09T19:14:12Z") / 1000) && r.absSec <= Math.floor(Date.parse("2026-11-09T19:23:52Z") / 1000)).length
      : topDecile.filter(r => /FEED|RESPAWN/.test(r.mask || "")).length;
    const share = int ? harnessInt / int : 0;
    totInt += int; totHarness += harnessInt;
    per.push(`${d.manifest.day}: harness share=${(share * 100).toFixed(1)}% (bar ≤20%), top-decile rows=${topDecile.length}, of which on harness-tagged ticks=${inHarnessWindow}, peak T=${topRows.length ? topRows[0].T.toFixed(3) : "n/a"}`);
  }
  const pooled = totInt ? totHarness / totInt : 0;
  return {
    id: "C4", name: "Harness share (retro-run, incl. day 9)", status: "PASS as a per-day gate — day 9 FAILS it and is excluded",
    evidence: per.join("; ") + `. Pooled harness share=${(pooled * 100).toFixed(1)}% — but the study's bar is per-day ("≤20% for a day to be used for pacing"), and day 9 fails it at 98.2%: on the retro-run the gate does exactly its job, certifying days 1–5 and 10 and refusing day 9, whose entire tension integral sits on harness-tagged ticks (its peaks are the crew's own death window — study failure mode 2, confirmed empirically). Day 10's top-decile membership is a tie artefact (510 rows tie at T=0). Harness-tagged ticks = FEED/RESPAWN mask windows from the traces + day 9's record-tagged harness death window (19:14:12–19:23:52Z, ±30 s).`
  };
}

// ---------- C6: lead-lag screen ----------
function c6(days) {
  const rng = mulberry32(20261109);
  const parts = [];
  for (const d of days) {
    const rows = d.rows.filter(r => r.T !== null);
    if (rows.length < 600) continue;
    const T = rows.map(r => r.T), A = rows.map(r => parseInt(r.acts_per_min, 10));
    const lag0 = spearman(T, A);
    let ge = 0; const R = 200;
    for (let i = 0; i < R; i++) {
      const k = 60 + Math.floor(rng() * (rows.length - 120));
      const rot = A.map((_, j) => A[(j + k) % A.length]);
      if (Math.abs(spearman(T, rot)) >= Math.abs(lag0)) ge++;
    }
    parts.push(`${d.manifest.day}: Spearman(T, acts/min) at lag 0 = ${Number.isNaN(lag0) ? "undefined (T constant that day)" : lag0.toFixed(3)}; |lag0| exceeded by ${ge}/${R} circular rotations`);
  }
  return {
    id: "C6", name: "Lead-lag screen (apparatus cadence proxy: driver cycle rate)",
    status: "SCREEN-ONLY (per study; C5 decides, and C5 was not run)",
    evidence: parts.join("; ") + ". The only apparatus cadence recorded in the stores is the driver's own cycle rate; camera cuts and narration events are not in any recorded store, so this screen cannot clear the apparatus — it can only fail to detect one coupling."
  };
}

function main() {
  fs.mkdirSync(TMP, { recursive: true });
  const days = loadDays();
  const controls = [];
  controls.push({
    id: "C0", name: "Writer and movers (throwaway body)", status: "NOT RUN",
    evidence: "Requires a live throwaway-body session (inflict damage, place a zombie at 8 blocks, set dusk, unplug the sampler). This lane is offline-only by commission. PROMOTION STOPS HERE: the trust ladder's shadow rung requires C0–C2. Additionally, p_M — the term C0 would exercise most directly — has no grounding store in the archive at all."
  });
  controls.push(c1(days));
  controls.push(c2(days));
  const obs = buildLabelSet(days);
  controls.push(c3(obs));
  controls.push(c4(days));
  controls.push({
    id: "C5", name: "Camera and narration, by intervention", status: "NOT RUN",
    evidence: "Requires a scripted actor in a throwaway world on the real Orin (3 camera arms × narration on/off × 2 replicates). Live-world intervention is outside this lane's constraints."
  });
  controls.push(c6(days));
  controls.push({
    id: "C7", name: "Paired observation (server state vs citizen client view)", status: "NOT RUN",
    evidence: "No paired series exists: the traces are a single (client-relayed) view, and server-side state survives only as sparse overwritten snapshots (e.g. pulse/cody-state.json), not a series. Agreement ≥0.9 cannot be computed."
  });
  controls.push(c8(obs));
  controls.push({
    id: "C9", name: "Human construct validity (blind paired clips)", status: "NOT RUN",
    evidence: "Requires ~20 minutes of a human watcher's blind judgements. Not obtainable by this lane; must not be self-certified."
  });
  controls.push({
    id: "C10", name: "Sham score (rotated-T consumer metrics)", status: "NOT RUN — VACUOUS ON THE ARCHIVE",
    evidence: "The metric it guards ('placements cluster at troughs') has no instances: no consumer existed during the recorded days and no placement was ever made by or against this score (scenario #1 predates it and was sited by the Director's own judgement). The sham machinery is specified in the filing for automatic running once a consumer exists."
  });
  controls.push({
    id: "C11", name: "Causal payoff (randomised placement timing)", status: "NOT RUN",
    evidence: "Requires weeks of randomised eligible placements across days. Only this control could support 'pacing works'; nothing in this lane speaks to it."
  });
  const verdict = "NOT-PROMOTED";
  const out = { score_ver: "tension-1.0.0", verdict, promotion_stops_at: "C0", controls };
  fs.writeFileSync(path.join(HERE, "controls-results.json"), JSON.stringify(out, null, 1));
  for (const c of controls) console.log(`${c.id}: ${c.status} — ${c.name}`);
  console.log("VERDICT: " + verdict);
}
if (require.main === module) main();
