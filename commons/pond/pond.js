// pond.js — commons pond v2: confirmed transfers + decay for the skill pond.
//
// Extends commons/comms/PROTOCOL.md's delivery rule to skills: a pond entry
// is not "shared" because it was copied somewhere — a transfer counts only
// when the RECEIVING citizen's own records cite the entry (the field-study
// steal: "served = confirmed eaten", first built for chat in comms v1).
// And the memory paradox: an entry nobody ever retrieves is not memory.
// Entries with no retrieval inside the decay window are marked decayed —
// they sink to the bottom of every listing and are reported, never deleted.
//
// State (all in this directory):
//   index.json         the registry: one record per pond entry file, incl.
//                      its current transfer record {transferredTo,
//                      transferTs, confirmedBy, confirmedTs, status}.
//                      This is STATE, rewritten as things change; the
//                      history lives in the ledger.
//   pond-ledger.jsonl  append-only events: registered / transfer /
//                      retrieval / confirmed / decayed / undecayed /
//                      retired / primed. Never edited, never deleted.
//   .scan-state.json   byte offsets per scanned source, so citations are
//                      only ever counted once, when they are new.
//
// Citation sources (read-only; citizens are never written to):
//   Geist — lineage-c/memory/plans.md, lineage-c/logs/ticks.jsonl
//           (his plans name pond files in usedPond; reflections cite them)
//   Vega  — lineage-b/logs/ticks.jsonl (skill runs), lineage-b/library/*.js
//   Cody  — pulse/library/*.js (smith curriculum use), pulse/library/
//           ticks.jsonl, pulse/ledger.jsonl
//   plus the commons' own ledgers, attributed per line:
//   SCOREBOARD.jsonl (citizen field) and comms/chat.jsonl (from field,
//   chat text only) — PROTOCOL rule 4 already counts a commons-ledger
//   note as a confirmation there; the same leg applies here.
//
// Confirmation discipline: the FIRST scan ever only primes the sources
// (offsets set to end-of-file, a `primed` event is ledgered) — the pond
// never takes retroactive credit for citations written before it was
// watching. `transfer` also primes to now before recording, so only a
// citation written AFTER the transfer can confirm it. Files that appear
// later under a glob (a citizen authoring a new skill) are scanned whole.
//
// Run: node pond.js <transfer|confirm-scan|list> ... (see usage below)
// The 60 s loop lives in pond-watch.js (see start-pond-watch.sh).
const fs = require("fs");
const path = require("path");
const ORIG_CWD = process.cwd();
process.chdir(__dirname);

const DIR = __dirname;
const COMMONS = path.join(DIR, "..");
const LEAGUE = path.join(COMMONS, "..");
const INDEX_FILE = path.join(DIR, "index.json");
const LEDGER = path.join(DIR, "pond-ledger.jsonl");
const SCAN_STATE = path.join(DIR, ".scan-state.json");
const CITIZENS = ["Cody", "Vega", "Geist"];
const DECAY_WINDOW_MS = 48 * 3600 * 1000; // v1 parameter, 2026-11-07: 48 h unretrieved => decayed
const NON_ENTRY = new Set(["pond.js", "pond-watch.js"]);

const CITIZEN_SOURCES = {
  Geist: [
    path.join(LEAGUE, "lineage-c", "memory", "plans.md"),
    path.join(LEAGUE, "lineage-c", "logs", "ticks.jsonl"),
  ],
  Vega: [
    path.join(LEAGUE, "lineage-b", "logs", "ticks.jsonl"),
    path.join(LEAGUE, "lineage-b", "library", "*.js"),
  ],
  Cody: [
    path.join(LEAGUE, "pulse", "library", "*.js"),
    path.join(LEAGUE, "pulse", "library", "ticks.jsonl"),
    path.join(LEAGUE, "pulse", "ledger.jsonl"),
  ],
};
const LEDGER_SOURCES = [
  { file: path.join(COMMONS, "SCOREBOARD.jsonl"), field: "citizen", wholeLine: true },
  { file: path.join(COMMONS, "comms", "chat.jsonl"), field: "from", wholeLine: false },
];

function nowIso() { return new Date().toISOString(); }
function loadJson(p, fb) { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fb; } }
function saveJson(p, o) { fs.writeFileSync(p, JSON.stringify(o, null, 2) + "\n"); }
function appendLedger(o) { fs.appendFileSync(LEDGER, JSON.stringify(o) + "\n"); }
function rel(p) { return path.relative(LEAGUE, p); }

// ---------------- entries -------------------------------------------------

function entryFiles() {
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".js") && f.includes("-") && !NON_ENTRY.has(f))
    .sort();
}

function parseEntryFile(file) {
  // <LINEAGE>-<skillName>.js ; provenance parsed from the header when present
  // ("// provenance: lineage B / citizen Vega / stage S1 / <ts>", vega.js form).
  const base = file.replace(/\.js$/, "");
  const dash = base.indexOf("-");
  const prefix = dash > 0 ? base.slice(0, dash) : null;
  const skillName = dash > 0 ? base.slice(dash + 1) : base;
  let authorLineage = prefix, authorCitizen = null;
  try {
    const head = fs.readFileSync(path.join(DIR, file), "utf8").slice(0, 2000);
    const m = head.match(/provenance:\s*lineage\s+(\S+)\s*\/\s*citizen\s+([A-Za-z]+)/i);
    if (m) { authorLineage = m[1]; authorCitizen = m[2]; }
  } catch { /* header unreadable: filename facts only */ }
  return { skillName, authorLineage, authorCitizen };
}

function loadIndex() {
  const idx = loadJson(INDEX_FILE, null);
  if (idx && idx.entries) return idx;
  return { version: 2, entries: {} };
}

function registerAndRetire(index, summary) {
  const files = entryFiles();
  const seen = new Set(files);
  for (const file of files) {
    if (!index.entries[file]) {
      const meta = parseEntryFile(file);
      let mtime = null;
      try { mtime = fs.statSync(path.join(DIR, file)).mtime.toISOString(); } catch { /* ignore */ }
      const rec = {
        entry: file,
        skillName: meta.skillName,
        authorLineage: meta.authorLineage,
        authorCitizen: meta.authorCitizen,
        addedTs: mtime || nowIso(),
        registeredTs: nowIso(),
        synthetic: meta.authorLineage === "TEST",
        transfer: null,
        lastRetrievalTs: null,
        retrievalCount: 0,
        decayed: false,
        decayedTs: null,
      };
      index.entries[file] = rec;
      const ev = { ts: nowIso(), type: "registered", entry: file, authorLineage: rec.authorLineage, authorCitizen: rec.authorCitizen };
      if (rec.synthetic) ev.synthetic = true;
      appendLedger(ev);
      summary.registered.push(file);
    }
  }
  for (const file of Object.keys(index.entries)) {
    if (!seen.has(file)) {
      const rec = index.entries[file];
      const ev = { ts: nowIso(), type: "retired", entry: file, reason: rec.synthetic ? "synthetic verification fixture removed after end-to-end test" : "entry file no longer present in pond/" };
      if (rec.synthetic) ev.synthetic = true;
      appendLedger(ev);
      summary.retired.push(file);
      delete index.entries[file];
    }
  }
}

// ---------------- scanning ------------------------------------------------

function expandSource(p) {
  if (!p.includes("*")) return fs.existsSync(p) ? [p] : [];
  const dir = path.dirname(p);
  const suffix = p.slice(p.indexOf("*") + 1);
  try {
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith(suffix))
      .sort()
      .map((f) => path.join(dir, f));
  } catch { return []; }
}

function collectSources(extraSources) {
  const out = [];
  for (const c of CITIZENS)
    for (const p of CITIZEN_SOURCES[c])
      for (const f of expandSource(p)) out.push({ citizen: c, file: f, ledgerField: null, wholeLine: true });
  for (const ls of LEDGER_SOURCES)
    if (fs.existsSync(ls.file)) out.push({ citizen: null, file: ls.file, ledgerField: ls.field, wholeLine: ls.wholeLine });
  for (const e of extraSources || []) out.push({ citizen: e.citizen, file: e.file, ledgerField: null, wholeLine: true });
  return out;
}

function loadScanState() {
  const st = loadJson(SCAN_STATE, null);
  if (st && st.files) return st;
  return { primed: false, files: {} };
}

// Advance every known source to EOF without crediting anything.
function primeToNow(state, sources) {
  for (const s of sources) {
    try { state.files[s.file] = fs.statSync(s.file).size; } catch { /* vanished mid-prime */ }
  }
  if (!state.primed) {
    state.primed = true;
    appendLedger({ ts: nowIso(), type: "primed", note: "first scan: existing citizen logs baselined at end-of-file; only citations written from now on are counted" });
  }
}

function readNew(state, file) {
  let size;
  try { size = fs.statSync(file).size; } catch { return null; }
  let off = state.files[file];
  if (off === undefined) off = 0; // file appeared after priming (e.g. new skill in a library): scan whole
  if (size < off) off = 0; // rotated/truncated: rescan (confirmations are idempotent; retrievals may recount)
  if (size === off) { state.files[file] = size; return null; }
  const fd = fs.openSync(file, "r");
  const buf = Buffer.alloc(size - off);
  fs.readSync(fd, buf, 0, buf.length, off);
  fs.closeSync(fd);
  state.files[file] = size;
  return buf.toString("utf8");
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function countCitations(text, rec) {
  let mentions = 0, snippet = null;
  for (const token of [rec.entry, rec.skillName]) {
    const re = new RegExp(`(?<![A-Za-z0-9_.-])${escapeRe(token)}(?![A-Za-z0-9_-])`, "g");
    const hits = text.match(re);
    if (hits) {
      mentions += hits.length;
      if (!snippet) {
        const i = text.search(re);
        snippet = text.slice(Math.max(0, i - 60), i + token.length + 60).replace(/\s+/g, " ").trim();
      }
    }
  }
  return { mentions, snippet };
}

function applyCitation(index, rec, citizen, sourceFile, mentions, snippet, summary) {
  const ts = nowIso();
  rec.lastRetrievalTs = ts;
  rec.retrievalCount += 1;
  const rev = { ts, type: "retrieval", entry: rec.entry, by: citizen, source: rel(sourceFile), mentions };
  if (snippet) rev.snippet = snippet;
  if (rec.synthetic) rev.synthetic = true;
  appendLedger(rev);
  summary.retrievals.push(`${rec.entry} <- ${citizen}`);
  if (rec.decayed) {
    rec.decayed = false;
    rec.decayedTs = null;
    const uev = { ts, type: "undecayed", entry: rec.entry, by: citizen, note: "retrieved again after decay; back in circulation" };
    if (rec.synthetic) uev.synthetic = true;
    appendLedger(uev);
    summary.undecayed.push(rec.entry);
  }
  const tr = rec.transfer;
  if (tr && tr.status === "unconfirmed" && tr.transferredTo === citizen) {
    tr.status = "confirmed";
    tr.confirmedBy = citizen;
    tr.confirmedTs = ts;
    const cev = { ts, type: "confirmed", entry: rec.entry, confirmedBy: citizen, source: rel(sourceFile), note: "receiver's own records cite the entry: served = confirmed eaten" };
    if (snippet) cev.snippet = snippet;
    if (rec.synthetic) cev.synthetic = true;
    appendLedger(cev);
    summary.confirmed.push(`${rec.entry} <- ${citizen}`);
  }
}

function scanSource(index, state, src, summary) {
  const chunk = readNew(state, src.file);
  if (!chunk) return;
  if (!src.ledgerField) {
    for (const rec of Object.values(index.entries)) {
      const { mentions, snippet } = countCitations(chunk, rec);
      if (mentions > 0) applyCitation(index, rec, src.citizen, src.file, mentions, snippet, summary);
    }
    return;
  }
  // commons ledgers: attribute each line to its citizen field
  for (const line of chunk.split("\n")) {
    if (!line.trim()) continue;
    let obj = null;
    try { obj = JSON.parse(line); } catch { continue; }
    const citizen = obj && obj[src.ledgerField];
    if (!citizen || !CITIZENS.includes(citizen)) continue;
    const text = src.wholeLine ? line : (typeof obj.text === "string" ? obj.text : "");
    if (!text) continue;
    for (const rec of Object.values(index.entries)) {
      const { mentions, snippet } = countCitations(text, rec);
      if (mentions > 0) applyCitation(index, rec, citizen, src.file, mentions, snippet, summary);
    }
  }
}

// ---------------- decay ---------------------------------------------------

function decaySweep(index, summary) {
  const now = Date.now();
  for (const rec of Object.values(index.entries)) {
    if (rec.decayed) continue;
    const base = Date.parse(rec.lastRetrievalTs || rec.addedTs);
    if (now - base > DECAY_WINDOW_MS) {
      rec.decayed = true;
      rec.decayedTs = nowIso();
      const ev = { ts: rec.decayedTs, type: "decayed", entry: rec.entry, lastRetrievalTs: rec.lastRetrievalTs || null, windowH: DECAY_WINDOW_MS / 3600000, note: "no retrieval inside the decay window; sunk in listings, never deleted" };
      if (rec.synthetic) ev.synthetic = true;
      appendLedger(ev);
      summary.decayed.push(rec.entry);
    }
  }
}

// ---------------- the cycle ------------------------------------------------

function emptySummary() {
  return { registered: [], retired: [], retrievals: [], confirmed: [], decayed: [], undecayed: [] };
}
function summaryChanged(s) {
  return Object.values(s).some((a) => a.length > 0);
}

function runCycle(extraSources) {
  const index = loadIndex();
  const state = loadScanState();
  const summary = emptySummary();
  registerAndRetire(index, summary);
  const sources = collectSources(extraSources);
  if (!state.primed) {
    primeToNow(state, sources);
    saveJson(INDEX_FILE, index);
    saveJson(SCAN_STATE, state);
    summary.primed = true;
    return summary;
  }
  for (const src of sources) scanSource(index, state, src, summary);
  decaySweep(index, summary);
  saveJson(INDEX_FILE, index);
  saveJson(SCAN_STATE, state);
  return summary;
}

// ---------------- transfer --------------------------------------------------

function normaliseCitizen(s) {
  const c = CITIZENS.find((x) => x.toLowerCase() === String(s).toLowerCase());
  if (!c) throw new Error(`unknown citizen "${s}" (expected one of ${CITIZENS.join(", ")})`);
  return c;
}

function resolveEntry(arg) {
  const files = entryFiles();
  const hit = files.find((f) => f === arg || f === arg + ".js" || f.replace(/\.js$/, "") === arg || parseEntryFile(f).skillName === arg);
  if (!hit) throw new Error(`no pond entry matches "${arg}" (pond holds: ${files.join(", ") || "nothing"})`);
  return hit;
}

function transfer(entryArg, citizenArg, synthetic) {
  const citizen = normaliseCitizen(citizenArg);
  const file = resolveEntry(entryArg);
  const index = loadIndex();
  const state = loadScanState();
  const summary = emptySummary();
  registerAndRetire(index, summary);
  // Prime to now BEFORE the transfer is on record: only a citation the
  // receiver writes after this moment can confirm it.
  primeToNow(state, collectSources([]));
  const rec = index.entries[file];
  const ts = nowIso();
  if (synthetic) rec.synthetic = true;
  rec.transfer = { transferredTo: citizen, transferTs: ts, confirmedBy: null, confirmedTs: null, status: "unconfirmed" };
  const tev = { ts, type: "transfer", entry: file, to: citizen, status: "unconfirmed", note: "handed over; counts only when the receiver's own records cite it" };
  if (rec.synthetic) tev.synthetic = true;
  appendLedger(tev);
  // A transfer surfaces the entry: it counts as a retrieval (decay clock).
  rec.lastRetrievalTs = ts;
  rec.retrievalCount += 1;
  const rev = { ts, type: "retrieval", entry: file, by: citizen, via: "transfer" };
  if (rec.synthetic) rev.synthetic = true;
  appendLedger(rev);
  saveJson(INDEX_FILE, index);
  saveJson(SCAN_STATE, state);
  return rec;
}

// ---------------- list -------------------------------------------------------

function listEntries() {
  const index = loadIndex();
  const recs = Object.values(index.entries);
  const active = recs.filter((r) => !r.decayed)
    .sort((a, b) => String(b.lastRetrievalTs || b.addedTs).localeCompare(String(a.lastRetrievalTs || a.addedTs)) || a.entry.localeCompare(b.entry));
  const decayed = recs.filter((r) => r.decayed).sort((a, b) => a.entry.localeCompare(b.entry));
  const lines = [];
  lines.push(`pond — ${recs.length} entr${recs.length === 1 ? "y" : "ies"} (decay window ${DECAY_WINDOW_MS / 3600000} h; decayed entries sink last, never deleted)`);
  const fmt = (r) => {
    const tr = r.transfer
      ? `${r.transfer.status} -> ${r.transfer.transferredTo}${r.transfer.status === "confirmed" ? ` (confirmed by ${r.transfer.confirmedBy} ${r.transfer.confirmedTs})` : ` (since ${r.transfer.transferTs})`}`
      : "never transferred";
    return [
      `${r.entry}`,
      `  author: ${r.authorCitizen || "?"} (lineage ${r.authorLineage || "?"}) · added ${r.addedTs}`,
      `  transfer: ${tr}`,
      `  retrievals: ${r.retrievalCount} · last ${r.lastRetrievalTs || "never"}${r.decayed ? ` · DECAYED since ${r.decayedTs}` : ""}${r.synthetic ? " · SYNTHETIC (test fixture)" : ""}`,
    ].join("\n");
  };
  for (const r of active) lines.push(fmt(r));
  for (const r of decayed) lines.push(fmt(r));
  if (!recs.length) lines.push("  (the pond is empty — no skill has passed its stage verdict yet)");
  return lines.join("\n");
}

// ---------------- CLI ---------------------------------------------------------

function usage() {
  console.log([
    "pond.js — commons pond v2 (confirmed transfers + decay)",
    "  node pond.js transfer <entry> <citizen> [--synthetic]",
    "      Record that a pond entry was handed to a citizen. Unconfirmed until",
    "      the receiver's own logs cite it (seen by confirm-scan / pond-watch).",
    "  node pond.js confirm-scan [--extra-source Citizen=path]...",
    "      One full cycle: register new entries, scan citizens' logs for new",
    "      citations (retrievals + confirmations), sweep for decay.",
    "  node pond.js list",
    "      Entries with transfer status; decayed entries sink last.",
  ].join("\n"));
}

if (require.main === module) {
  const [cmd, ...rest] = process.argv.slice(2);
  try {
    if (cmd === "transfer") {
      const synthetic = rest.includes("--synthetic");
      const args = rest.filter((a) => a !== "--synthetic");
      if (args.length !== 2) { usage(); process.exit(2); }
      const rec = transfer(args[0], args[1], synthetic);
      console.log(`transfer recorded: ${rec.entry} -> ${rec.transfer.transferredTo} (unconfirmed; confirms when ${rec.transfer.transferredTo}'s own records cite it)`);
    } else if (cmd === "confirm-scan") {
      const extras = [];
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--extra-source" && rest[i + 1]) {
          const [c, p] = rest[i + 1].split(/=(.+)/).filter(Boolean);
          extras.push({ citizen: normaliseCitizen(c), file: path.resolve(ORIG_CWD, p) });
          i++;
        }
      }
      const s = runCycle(extras);
      console.log("confirm-scan cycle:", JSON.stringify(s));
    } else if (cmd === "list") {
      console.log(listEntries());
    } else {
      usage();
      process.exit(cmd ? 2 : 0);
    }
  } catch (e) {
    console.error("pond.js:", e.message);
    process.exit(1);
  }
}

module.exports = { runCycle, transfer, listEntries, DECAY_WINDOW_MS, CITIZENS };
