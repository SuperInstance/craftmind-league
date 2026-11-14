// FEED C writer helper — append ONE commission entry to commissions.jsonl.
// House discipline (commissions.md): append-only, never rewrite; an entry with
// calls:null is UNMETERED and must carry evidence; a duplicate id is refused
// (re-running a backfill is safe — it changes nothing).
// Usage: node commission-append.js < entry.json   (one JSON object on stdin)
"use strict";
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "commissions.jsonl");
const text = fs.readFileSync(0, "utf8").trim();
const e = JSON.parse(text);
for (const k of ["id", "ts", "programme_day", "caller_class", "agent", "route", "evidence", "note"]) {
  if (e[k] === undefined) { console.error("REFUSED: missing field " + k); process.exit(2); }
}
if (!(e.calls === null || (typeof e.calls === "number" && e.calls >= 0))) {
  console.error("REFUSED: calls must be a non-negative number or null (UNMETERED)"); process.exit(2);
}
if (!(e.usd_est === null || (typeof e.usd_est === "number" && e.usd_est >= 0))) {
  console.error("REFUSED: usd_est must be a non-negative number or null"); process.exit(2);
}
const existing = fs.readFileSync(FILE, "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l).id);
if (existing.includes(e.id)) { console.error("REFUSED: duplicate id " + e.id + " (already in feed; nothing appended)"); process.exit(3); }
fs.appendFileSync(FILE, JSON.stringify(e) + "\n");
console.log("appended " + e.id + " (feed C now " + (existing.length + 1) + " entries)");
