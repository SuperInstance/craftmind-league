#!/usr/bin/env node
// run.js — one-command pipeline: score every recorded day with a usable
// store into out/, then run the apparatus controls.
//   node run.js
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const NODE = process.execPath;
const HERE = __dirname;
const LEAGUE = path.resolve(HERE, "..");
const OUT = path.join(HERE, "out");
const DEATHS = path.join(LEAGUE, "pulse/deaths-record.jsonl");

// held = daylight contract in force, per the day records (landing-verified
// holds: day 2, day 4, day 9, day 10). Days 1/3/5: hold unverified in the
// record — p_N is null on those days too, on grounding grounds (no
// world-time series exists), as the manifests state.
const DAYS = [
  { day: "day1", trace: "pulse/direct-drive-trace-day1-20261108.jsonl", held: "0" },
  { day: "day2", trace: "pulse/direct-drive-trace-day2-20261109.jsonl", held: "1" },
  { day: "day3", trace: "pulse/direct-drive-trace-day3-20261109.jsonl", held: "0" },
  { day: "day4", trace: "pulse/direct-drive-trace.jsonl", held: "1" }, // md5-identical to day5-backups/direct-drive-trace.jsonl.bak-day4-record
  { day: "day5", trace: "pulse/direct-drive-trace-day5-20261109.jsonl", held: "0" },
  { day: "day9", trace: "pulse/direct-drive-trace-day9-20261109.jsonl", held: "1" },
  { day: "day10", trace: "pulse/direct-drive-trace-day10-20261109.jsonl", held: "1" }
];
// No usable store: day 6 (2 trace rows, no cycles), day 7 (wake-only rows,
// no cycles), day 8 (citizen never woken, no trace). Below the ≥30-sample /
// ≥10-cycle floor the instrument requires; listed here so the gap is on
// the record rather than silent.

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const d of DAYS) {
    execFileSync(NODE, [path.join(HERE, "tension.js"),
      "--trace", path.join(LEAGUE, d.trace), "--day", d.day, "--held", d.held,
      "--deaths", DEATHS,
      "--out", path.join(OUT, d.day + ".tsv"),
      "--manifest", path.join(OUT, d.day + ".manifest.json")], { stdio: "inherit" });
  }
  execFileSync(NODE, [path.join(HERE, "controls.js")], { stdio: "inherit" });
}
if (require.main === module) main();
