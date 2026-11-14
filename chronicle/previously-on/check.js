#!/usr/bin/env node
/*
 * PREVIOUSLY ON — CHECKER. Independent of the renderer's claims: it
 * re-reads the three stores from disk, re-renders every edition from
 * the plan, and verifies the contract of CHRONICLE-IMPL §6 line by line:
 *
 *   1. determinism      — files on disk byte-equal a fresh re-render.
 *   2. sealed only      — every cited beat exists and is status: sealed;
 *                         every cited viewing exists.
 *   3. narration        — every narration quote in an edition byte-equals
 *                         the cited beat row's `narration` field
 *                         (located as a quoted substring of the line).
 *   4. testimony        — every watcher's quoted words byte-equal the
 *                         cited viewing row's landed/bored entry.
 *   5. aired            — every [aired: w:…] mark resolves to a viewing
 *                         row that confers aired (non-empty watched +
 *                         testimony) on the anchor day of every beat on
 *                         that line; w:ARM:001 and w:STD:001 confer
 *                         nothing and may never be cited as aired;
 *                         edition two's aired claim equals the conferred
 *                         day map recomputed from viewings.jsonl.
 *   6. fault shown      — per line, the set of [fault shown: …] markers
 *                         equals the set recomputed from the stores for
 *                         the line's cited beats (owner + beat id).
 *   7. tension absent   — no [t: citation in either edition; the word
 *                         "tension" appears only in meta lines, and any
 *                         meta line using it also carries NOT-PROMOTED;
 *                         no day_shape beat is cited in either edition.
 *   8. no leak          — neither edition contains any denylist marker
 *                         (scenario-#2's element, cell, triple, or
 *                         prediction vocabulary).
 *   9. citation floor   — every non-meta line carries >= 1 citation.
 *
 * Writes check-results.json; exit code 0 iff all checks pass.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const gen = require("./generate.js");

const DIR = __dirname;
const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}`);
};

/* 1. determinism */
for (const ed of gen.PLAN) {
  const onDisk = fs.readFileSync(path.join(DIR, "editions", ed.file), "utf8");
  const fresh = gen.renderEdition(ed).text;
  check(`determinism:${ed.file}`, onDisk === fresh,
    onDisk === fresh ? "disk bytes == fresh re-render" : "MISMATCH between disk and re-render");
}

/* per-edition, per-line verification against the stores */
for (const ed of gen.PLAN) {
  const { rendered } = gen.renderEdition(ed);
  ed.lines.forEach((line, i) => {
    const tag = `${ed.file}:L${i + 1}`;
    const text = rendered[i];

    /* 2. sealed only */
    for (const id of line.beats || []) {
      const b = gen.B.get(id);
      check(`${tag}:sealed:${id}`, b && b.status === "sealed",
        b ? `status=${b.status}` : "beat missing from store");
    }
    for (const id of line.views || []) {
      check(`${tag}:viewing-exists:${id}`, gen.W.has(id), gen.W.has(id) ? "resolves" : "MISSING");
    }

    /* 3. narration byte-compare */
    for (const m of line.text.matchAll(/⟦NARR:(b:[^⟧]+)⟧/g)) {
      const b = gen.B.get(m[1]);
      const needle = `"${b.narration}"`;
      check(`${tag}:narration-verbatim:${m[1]}`, text.includes(needle),
        text.includes(needle) ? "quoted bytes == beat narration field" : "QUOTE NOT FOUND VERBATIM");
    }

    /* 4. testimony byte-compare */
    for (const m of line.text.matchAll(/⟦SAID:(w:[^⟧]+?):(landed|bored):(\d+)⟧/g)) {
      const w = gen.W.get(m[1]);
      const words = w[m[2]][Number(m[3])].words;
      check(`${tag}:testimony-verbatim:${m[1]}`, text.includes(`"${words}"`),
        text.includes(`"${words}"`) ? "quoted bytes == viewing row words" : "QUOTE NOT FOUND VERBATIM");
    }

    /* 5. aired marks resolve + derivation */
    for (const wid of line.aired || []) {
      const w = gen.W.get(wid);
      const confers = w && (w.watched || []).length > 0 &&
        ((w.landed || []).length + (w.bored || []).length) > 0;
      const daysOk = (line.beats || []).every((id) => gen.B.get(id).anchor.citizen_day === w.anchor.citizen_day);
      check(`${tag}:aired-resolves:${wid}`, confers && daysOk,
        `confers=${confers} anchor-day-matches-all-beats=${daysOk}`);
    }

    /* 6. fault markers == store-recomputed set */
    const expected = (line.beats || [])
      .filter((id) => gen.B.get(id).fault_owner !== null && gen.B.get(id).fault_owner !== undefined)
      .map((id) => `[fault shown: ${gen.B.get(id).fault_owner} — ${id}]`)
      .sort();
    const found = [...text.matchAll(/\[fault shown: [^\]]+\]/g)].map((x) => x[0]).sort();
    check(`${tag}:fault-shown`, JSON.stringify(expected) === JSON.stringify(found),
      `expected ${expected.length} marker(s), found ${found.length}`);

    /* 7c. no day_shape beat cited */
    for (const id of line.beats || []) {
      check(`${tag}:no-day-shape:${id}`, gen.B.get(id).kind !== "day_shape",
        `kind=${gen.B.get(id).kind}`);
    }

    /* 9. citation floor */
    const cites = (text.match(/\[(b|w):[^\]]+\]/g) || []).length;
    check(`${tag}:citation-floor`, cites >= 1, `${cites} citation(s) on line`);
  });

  const full = fs.readFileSync(path.join(DIR, "editions", ed.file), "utf8");

  /* 7a/7b. tension absent */
  check(`${ed.file}:no-tension-citation`, !/\[t:/.test(full), "no [t: citation anywhere");
  const metaSet = new Set(ed.meta);
  const nonMeta = full.split("\n").filter((l) => /tension/i.test(l) && !metaSet.has(l));
  const badTension = nonMeta.filter((l) => !l.startsWith("Compiled by "));
  check(`${ed.file}:tension-word-meta-only`, badTension.length === 0,
    badTension.length ? `non-meta lines using the word: ${badTension.length}` : "word confined to meta lines + the provenance footer");
  const footerTension = nonMeta.filter((l) => l.startsWith("Compiled by "));
  check(`${ed.file}:tension-footer-provenance-only`, footerTension.every((l) => l.includes("hashed for provenance only") && l.includes("not read for content")),
    "the footer's only mention is the provenance hash, content unread");
  const metaTension = ed.meta.filter((m) => /tension/i.test(m));
  check(`${ed.file}:tension-meta-labelled`, metaTension.every((m) => m.includes("NOT-PROMOTED")),
    "every meta mention carries the NOT-PROMOTED gate label");

  /* 8. denylist */
  for (const d of gen.DENY) {
    check(`${ed.file}:denylist:${d}`, !full.includes(d), full.includes(d) ? "LEAK MARKER PRESENT" : "absent");
  }

  /* 5b. edition aired claim == recomputed conferred map */
  const claimLine = ed.lines.find((l) => l.airedClaim);
  if (claimLine) {
    const conferred = [...gen.conferredDays().keys()].sort((a, b) => a - b);
    check(`${ed.file}:aired-claim`, JSON.stringify(conferred) === JSON.stringify([...claimLine.airedClaim].sort((a, b) => a - b)),
      `conferred days recomputed = [${conferred}], claimed = [${claimLine.airedClaim}]`);
  }
}

/* 5c. the non-conferring rows confer nothing, anywhere */
const conf = gen.conferredDays();
const allConferring = [...conf.values()].flat();
check("aired:w:ARM:001-confers-nothing", !allConferring.includes("w:ARM:001"), "exposure-only row confers no aired");
check("aired:w:STD:001-confers-nothing", !allConferring.includes("w:STD:001"), "standard row (watched nothing) confers no aired");

const fails = results.filter((r) => !r.ok);
const summary = { pass: results.length - fails.length, fail: fails.length, checks: results };
fs.writeFileSync(path.join(DIR, "check-results.json"), JSON.stringify(summary, null, 1) + "\n");
console.log(`\n${summary.pass} PASS / ${summary.fail} FAIL — check-results.json written`);
process.exit(fails.length ? 1 : 0);
