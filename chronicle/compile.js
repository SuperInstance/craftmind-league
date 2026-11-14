#!/usr/bin/env node
/*
 * DOSSIER COMPILER — a deterministic compile (no model) of the three
 * chronicle stores for one reader, per the study's dossier table.
 * Every claim line in a dossier is a bullet ending in citations of the
 * form [b:D03:004] / [t:D10:series] / [w:D09:001] that resolve to store
 * rows. Headings and the metadata block are not claims.
 * Readers compiled here:
 *   director-days9-10  Director: beats filtered by salience, tension as
 *                      day_shape only (gates labelled), viewings as
 *                      landed + bored lines. (Study table, row 1.)
 *   cold-reader-day3   A first-contact reader meeting Cody for the
 *                      first time (the episode viewer). NOT one of the
 *                      study's six rows — an added reader, documented
 *                      in CHRONICLE-IMPL-20261109.md: day-3 beats in
 *                      story order, NO tension, NO other viewings.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const DIR = __dirname;
const load = (n) => fs.readFileSync(path.join(DIR, n), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const beats = load("beats.jsonl"), views = load("viewings.jsonl"), tens = load("tension-series.jsonl");
const B = new Map(beats.map((r) => [r.id, r])), W = new Map(views.map((r) => [r.id, r])), T = new Map(tens.map((r) => [r.id, r]));
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

const beatLine = (id) => {
  const b = B.get(id);
  if (!b) throw new Error("missing beat " + id);
  let s = `- **${b.id}** (${b.kind}, ${b.place}) — ${b.what}`;
  if (b.narration) s += ` His words: "${b.narration}"`;
  s += ` [${b.id}]`;
  return s;
};
const viewLine = (id) => {
  const w = W.get(id);
  if (!w) throw new Error("missing viewing " + id);
  const parts = [];
  for (const l of w.landed) parts.push(`landed: "${l.words}"`);
  for (const l of w.bored) parts.push(`bored: "${l.words}"`);
  return `- **${w.id}** (${w.watcher}, ${w.anchor.wall_utc.slice(0, 10)}) — ${parts.join(" | ")} [${w.id}]`;
};
const tensLine = (id) => {
  const t = T.get(id);
  if (!t) throw new Error("missing tension row " + id);
  const gates = t.gates ? t.gates.join("; ") : t.why;
  return `- **${t.id}** (tension series, ${t.status}) — ${t.verdict}. Gates: ${gates} [${t.id}]`;
};

/* ---------------- Director, days 9-10 ---------------- */
const director = [];
director.push("# DOSSIER — the Director, days 9-10");
director.push("");
director.push("Compiled deterministically from beats.jsonl + tension-series.jsonl + viewings.jsonl (the chronicle, one address space). Beats filtered by salience; tension appears as day_shape only, with its gates; viewings as landed and bored lines. Every claim line cites the store row it resolves to.");
director.push("");
director.push("## Day 9 — the show put on screen, and what it cost");
for (const id of ["b:D09:001", "b:D09:002", "b:D09:003", "b:D09:004", "b:D09:005", "b:D09:006", "b:D09:007", "b:D09:008"]) director.push(beatLine(id));
director.push("");
director.push("## Day 10 — the first clean day");
for (const id of ["b:D10:001", "b:D10:002", "b:D10:003", "b:D10:004", "b:D10:005", "b:D10:006", "b:D10:007"]) director.push(beatLine(id));
director.push("");
director.push("## After day 10 — the set, read back");
director.push(beatLine("b:D10:009"));
director.push("");
director.push("## Threads you are choosing against");
director.push(beatLine("b:D02:003"));
director.push(beatLine("b:D03:008"));
director.push("");
director.push("## The tension series — gated data, not a drama measure");
director.push(tensLine("t:D09:excluded"));
director.push(tensLine("t:D10:series"));
director.push(beatLine("b:D09:009"));
director.push(beatLine("b:D10:008"));
director.push("");
director.push("## What the watcher said");
director.push(viewLine("w:D09:001"));
director.push(viewLine("w:D10:001"));
director.push("");

/* ---------------- Cold reader, day 3 ---------------- */
const cold = [];
cold.push("# DOSSIER — a cold reader meets Cody: day 3");
cold.push("");
cold.push("Compiled deterministically from beats.jsonl (day 3, story order). No tension series, no watcher testimony — a first-contact reader gets the day as it was lived, from the beat log only. Every claim line cites the store row it resolves to.");
cold.push("");
cold.push("## The day");
for (const b of beats.filter((r) => r.anchor.citizen_day === 3 && r.kind !== "day_shape")) cold.push(beatLine(b.id));
cold.push("");
cold.push("## If you watched it");
cold.push(`- The episode cut of this day exists ("Cody, Day 3: The Wheat Is Yellow", 2:54, silent) and covers only the day's front half — the deaths at the end of this dossier are NOT in the cut. Its cold watch is still owed; the viewing log carries that as an open exposure row, not a verdict. [w:ARM:001]`);
cold.push("");

const outDir = path.join(DIR, "dossiers");
fs.mkdirSync(outDir, { recursive: true });
const files = { "director-days9-10": director.join("\n"), "cold-reader-day3": cold.join("\n") };
const index = { compiled_utc: new Date().toISOString(), compiler: "chronicle-compile 1.0.0", dossiers: {} };
for (const [name, text] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name + ".md"), text);
  index.dossiers[name] = { file: "dossiers/" + name + ".md", sha256: sha(text), bytes: Buffer.byteLength(text) };
}
index.stores = { "beats.jsonl": sha(fs.readFileSync(path.join(DIR, "beats.jsonl"))),
                 "viewings.jsonl": sha(fs.readFileSync(path.join(DIR, "viewings.jsonl"))),
                 "tension-series.jsonl": sha(fs.readFileSync(path.join(DIR, "tension-series.jsonl"))) };
fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index, null, 1) + "\n");
console.log("dossiers compiled:", Object.keys(files).join(", "));
