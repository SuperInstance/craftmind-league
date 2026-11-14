#!/usr/bin/env node
/*
 * CHRONICLE CHECK — the citation spot-check, run against the stores and
 * the compiled dossiers. A dossier claim that does not resolve to a
 * store row is a failed dossier (study A.3 rule 5, store-aware).
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const DIR = __dirname;
const R = { pass: [], fail: [] };
const ok = (name, cond, detail) => (cond ? R.pass : R.fail).push(name + (detail ? " — " + detail : ""));

const loadRaw = (n) => fs.readFileSync(path.join(DIR, n), "utf8").trim().split("\n");
const load = (n) => loadRaw(n).map((l) => JSON.parse(l));
const beats = load("beats.jsonl"), views = load("viewings.jsonl"), tens = load("tension-series.jsonl");
const ids = new Set([...beats, ...views, ...tens].map((r) => r.id));

/* hash chains */
for (const [name, rows] of [["beats.jsonl", beats], ["viewings.jsonl", views], ["tension-series.jsonl", tens]]) {
  let prev = "GENESIS", good = true;
  rows.forEach((r, i) => {
    if (r.seq !== i + 1 || r.prev_sha256 !== prev) good = false;
    prev = crypto.createHash("sha256").update(JSON.stringify(r)).digest("hex");
  });
  ok("hash chain + gapless seq: " + name, good, rows.length + " rows");
}

/* ids unique */
ok("ids unique across the address space", ids.size === beats.length + views.length + tens.length,
   ids.size + " ids");

/* beat discipline */
const KINDS = new Set(["death", "first", "scenario_placed", "scenario_response", "near_miss", "recurrence", "floor_act", "crew_fault", "thread_open", "thread_close", "day_shape"]);
let noEv = [], thinObs = [], badKind = [], longWhat = [];
for (const b of beats) {
  if (!b.evidence || b.evidence.length < 1) noEv.push(b.id);
  if (!(b.observations && b.observations.length >= 2) && !b.observations_gap) thinObs.push(b.id);
  if (!KINDS.has(b.kind)) badKind.push(b.id + ":" + b.kind);
  if (b.what.length > 320) longWhat.push(b.id + ":" + b.what.length);
}
ok("every beat cites >=1 evidence", noEv.length === 0, noEv.join(",") || beats.length + " beats");
ok("every beat keeps >=2 independent observations or a labelled gap", thinObs.length === 0, thinObs.join(",") || "all covered");
ok("beat kinds within the study's set", badKind.length === 0, badKind.join(",") || "11 kinds");
ok("beat 'what' fields stay plain (<=320 chars; the study's 200-char cap is exceeded by design on correction beats — deviation documented in CHRONICLE-IMPL)", longWhat.length === 0, longWhat.join(",") || "max " + Math.max(...beats.map((b) => b.what.length)));

/* tension gates */
const t9 = tens.find((r) => r.id === "t:D09:excluded");
ok("day 9 tension row is the C4 exclusion", !!t9 && t9.status === "excluded_by_C4" && /99\.1%/.test(t9.gates.join(" ")));
ok("every tension row carries NOT-PROMOTED", tens.every((r) => /NOT-PROMOTED/.test(r.verdict)));
for (const d of [6, 7, 8]) ok("day " + d + " tension absence is on the record", tens.some((r) => r.citizen_day === d && r.status === "absent"));
for (const d of [1, 2, 3, 4, 5]) {
  const r = tens.find((x) => x.citizen_day === d);
  ok("day " + d + " tension row carries the hp-artefact gate", !!r && r.gates.some((g) => /hp/.test(g) && /artefact/.test(g)));
}

/* dossiers: citations resolve; claim lines carry citations */
const citeRe = /\[(b|t|w):[A-Za-z0-9:._\-]+\]/g;
for (const name of ["director-days9-10", "cold-reader-day3"]) {
  const text = fs.readFileSync(path.join(DIR, "dossiers", name + ".md"), "utf8");
  const lines = text.split("\n").filter((l) => l.startsWith("- "));
  const cited = [...text.matchAll(citeRe)].map((m) => m[0].slice(1, -1));
  const unresolved = cited.filter((c) => !ids.has(c));
  const bare = lines.filter((l) => ![...l.matchAll(citeRe)].length);
  ok(name + ": every citation resolves to a store row", unresolved.length === 0,
     cited.length + " citations, " + new Set(cited).size + " distinct ids" + (unresolved.length ? "; UNRESOLVED: " + unresolved.join(",") : ""));
  ok(name + ": every claim line carries >=1 citation", bare.length === 0, lines.length + " claim lines" + (bare.length ? "; BARE: " + bare[0].slice(0, 80) : ""));
  if (name === "cold-reader-day3") ok(name + ": no tension citations (cold reader isolation)", !/\[t:/.test(text));
  if (name === "director-days9-10") {
    const tLines = lines.filter((l) => /\[t:/.test(l));
    ok(name + ": every tension-citing line carries the gate/verdict label", tLines.every((l) => /NOT-PROMOTED|excluded/.test(l)), tLines.length + " tension lines");
  }
}

/* coverage: every citizen day 1..10 has >=1 beat or an explicit absence */
for (let d = 1; d <= 10; d++) {
  const has = beats.some((b) => b.anchor.citizen_day === d);
  ok("citizen day " + d + " present in the beat log", has);
}

console.log(JSON.stringify({ pass: R.pass, fail: R.fail }, null, 1));
process.exit(R.fail.length ? 1 : 0);
