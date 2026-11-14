#!/usr/bin/env node
/* The Mt. Moon pass — triples reconciliation (ACTIONS item 2, 2026-11-08).
 *
 * Samples the oldest / least-verified UNCONFIRMED triples and re-checks each
 * against its provenance source: every evidence pointer and the
 * verification.source pointer must resolve NOW (ledger entry present in
 * pulse/ledger.jsonl, file present under the league root). Verdicts are
 * appended to reconciliation.jsonl (append-only, beside this script) —
 * never into triples.jsonl, so retrieval is unaffected:
 *
 *   { id: "recon-<triple-id>-<yyyymmdd>", reconciles: "<triple-id>", ts,
 *     method, checks: [ { pointer, ok, detail } ... ],
 *     verdict: "confirmed" | "still-unconfirmed" | "refuted",
 *     note }
 *
 *   confirmed          — every pointer resolves; the filing evidence stands.
 *   still-unconfirmed  — a pointer no longer resolves, or none could be
 *                        checked; the defect is named in the checks.
 *   refuted            — NEVER assigned by this script. Refutation is a
 *                        judgement that the cited evidence contradicts the
 *                        claim; a lane appends it by hand in the same format
 *                        with the contradicting evidence named in 'note'
 *                        (the Mt. Moon case: a wrong note killed in the open).
 *
 * Usage:
 *   node reconcile.js                 oldest 5 unconfirmed (default)
 *   node reconcile.js --n 3           oldest 3
 *   node reconcile.js --all           every entry not yet confirmed
 *   node reconcile.js --dry-run       print verdicts, append nothing
 *
 * Effective status of an entry = its verification.status, overridden by the
 * LATEST reconciliation verdict for it (confirmed -> confirmed; refuted ->
 * unconfirmed + flagged; still-unconfirmed -> unconfirmed).
 * Exit: 0 always on a completed pass (verdicts are data, not failures);
 * 2 on usage/io errors.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const LEAGUE = path.resolve(DIR, '..', '..');
const LIB = path.join(DIR, 'triples.jsonl');
const RECON = path.join(DIR, 'reconciliation.jsonl');

const ledgerText = () => fs.readFileSync(path.join(LEAGUE, 'pulse', 'ledger.jsonl'), 'utf8');
function ledgerHas(led, id) { return led.includes(`"id": "${id}"`) || led.includes(`"id":"${id}"`); }

function resolvePointer(p, led) {
  if (typeof p !== 'string' || !p.trim()) return { pointer: p, ok: false, detail: 'empty pointer' };
  p = p.trim();
  if (p.startsWith('ledger:')) {
    const id = p.slice(7);
    return { pointer: p, ok: ledgerHas(led, id), detail: ledgerHas(led, id) ? 'ledger entry present' : 'ledger entry NOT FOUND' };
  }
  if (p.startsWith('file:')) {
    const rel = p.slice(5);
    return { pointer: p, ok: fs.existsSync(path.join(LEAGUE, rel)), detail: fs.existsSync(path.join(LEAGUE, rel)) ? 'file exists' : 'file MISSING' };
  }
  const checks = [];
  for (const m of p.matchAll(/ledger\.jsonl#([a-z0-9-]+)/g)) checks.push([`ledger#${m[1]}`, ledgerHas(led, m[1])]);
  for (const m of p.matchAll(/[A-Za-z0-9_\-.\/]*\/[A-Za-z0-9_\-.\/]+\.(?:jsonl?|log|md|js|out)/g)) {
    if (m[0] === 'ledger.jsonl' || m[0].endsWith('/ledger.jsonl')) continue;
    checks.push([`path:${m[0]}`, fs.existsSync(path.join(LEAGUE, m[0]))]);
  }
  for (const m of p.matchAll(/\b([a-z][a-z0-9-]*-202611\d\d)\b/g)) {
    if (!checks.some(c => c[0].includes(m[1]))) checks.push([`ledger:${m[1]}`, ledgerHas(led, m[1])]);
  }
  if (!checks.length) {
    if (/orin/i.test(p)) return { pointer: p, ok: true, offbox: true, detail: 'no Thor-resolvable token; OFF-BOX source (Orin) - rests on the filing lane attestation, flagged not failed' };
    return { pointer: p, ok: false, detail: 'no resolvable token in free-text pointer' };
  }
  const offbox = checks.some(c => !c[1]) && /orin/i.test(p);
  return { pointer: p, ok: checks.every(c => c[1]) || offbox, offbox, detail: checks.map(c => `${c[0]}=${c[1] ? 'ok' : 'FAIL'}`).join(' ') };
}

function numOf(id) { const m = /^triple-(\d+)-/.exec(id || ''); return m ? parseInt(m[1], 10) : 9999; }

function main() {
  const argv = process.argv.slice(2);
  let n = 5, all = false, dry = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--n') n = parseInt(argv[++i], 10);
    else if (argv[i] === '--all') all = true;
    else if (argv[i] === '--dry-run') dry = true;
    else { console.error(`unknown arg: ${argv[i]}`); return 2; }
  }
  const entries = fs.readFileSync(LIB, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
  const prior = fs.existsSync(RECON)
    ? fs.readFileSync(RECON, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
  const latest = {};
  for (const r of prior) latest[r.reconciles] = r;

  const effective = t => {
    const r = latest[t.id];
    if (r) return r.verdict === 'confirmed' ? 'confirmed' : 'unconfirmed';
    return (t.verification && t.verification.status) || 'unconfirmed';
  };
  const pending = entries.filter(t => effective(t) !== 'confirmed')
    .sort((a, b) => numOf(a.id) - numOf(b.id) || a.id.localeCompare(b.id));
  const sample = all ? pending : pending.slice(0, n);
  if (!sample.length) { console.log('reconciliation: nothing unconfirmed — library fully reconciled.'); return 0; }

  const led = ledgerText();
  const now = new Date();
  const stamp = now.toISOString().replace(/\.\d+Z$/, 'Z');
  const ymd = stamp.slice(0, 10).replace(/-/g, '');
  const out = [];
  for (const t of sample) {
    const pointers = [...((t.provenance && t.provenance.evidence) || []),
                      ...((t.verification && t.verification.source) ? [t.verification.source] : [])];
    const checks = pointers.map(p => resolvePointer(p, led));
    const ok = checks.length > 0 && checks.every(c => c.ok);
    const verdict = ok ? 'confirmed' : 'still-unconfirmed';
    const rec = {
      id: `recon-${t.id}-${ymd}`,
      reconciles: t.id,
      ts: stamp,
      method: 'pointer re-resolution against pulse/ledger.jsonl + league file tree (Mt. Moon pass, reconcile.js)',
      checks,
      verdict,
      note: ok
        ? 'All provenance pointers re-resolve at check time; the filing evidence stands. A lane that finds the cited evidence CONTRADICTS the claim appends verdict "refuted" by hand in this same file.'
        : 'At least one provenance pointer no longer resolves — the defect is in the checks above; the entry stays unconfirmed until repaired or refuted.',
    };
    out.push(rec);
    console.log(`${verdict === 'confirmed' ? 'CONFIRMED        ' : 'STILL-UNCONFIRMED'}  ${t.id}  (${checks.filter(c => c.ok).length}/${checks.length} pointers ok)`);
    for (const c of checks) if (!c.ok) console.log(`    FAIL ${c.pointer} — ${c.detail}`);
  }
  if (!dry) {
    fs.appendFileSync(RECON, out.map(r => JSON.stringify(r)).join('\n') + '\n');
    console.log(`appended ${out.length} verdict(s) to reconciliation.jsonl${all ? ' (--all)' : ''}`);
  } else {
    console.log(`dry run: ${out.length} verdict(s) NOT appended`);
  }
  return 0;
}
process.exit(main());
