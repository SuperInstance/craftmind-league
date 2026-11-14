'use strict';
/**
 * glm-driver.js — the GLM library driver (First Casting, step 4;
 * design of record: rolling-perception-work/casting/
 * CASTING-CENSUS-AND-DESIGN-2026-11-07.md; declared in
 * pulse/ledger.jsonl: casting-fire-20261107).
 *
 * Polls the GLM consult book (commons/consults/glm.jsonl) every ~60 s.
 * For each OPEN consult: runs the Thor ZCode seat headless
 * (zcode -p, read-only Q&A — the seat's proven shape) with the
 * citizen's question + situation digest, and appends the answer to
 * the same book, provenance-stamped (community, seat, latency).
 * Answers are length-disciplined (the prompt caps ~200 words).
 *
 * Budgets: at most 2 answered consults per citizen per rolling hour
 * (a library is not a chat); a failed round trip is retried on later
 * polls, and after 3 attempts the consult is closed UNANSWERED —
 * silence is a legal answer (comms protocol). Kill: stop the process
 * (pidfile: craftmind-league/logs/glm-driver.pid); the book is just a
 * file and keeps every record.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const BOOK_PATH = '/home/caseydigennaro/craftmind-league/commons/consults/glm.jsonl';
const POLL_MS = 60000;
const ZCODE_TIMEOUT_MS = 300000;
const MAX_ATTEMPTS = 3;
const ANSWER_CAP_PER_HOUR = 2;

function nowIso() { return new Date().toISOString(); }
function log(...a) { console.log('[GLM-DRIVER]', nowIso(), ...a); }
function readBook() {
  try {
    return fs.readFileSync(BOOK_PATH, 'utf8').split('\n').filter(Boolean)
      .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
function appendBook(rec) {
  fs.appendFileSync(BOOK_PATH, JSON.stringify(rec) + '\n');
}

function askLibrary(consult) {
  return new Promise((resolve) => {
    const prompt =
      'You are the research library for a Minecraft citizen agent. Answer the question below in at most 200 words: practical, specific, plain prose. No preamble, no code unless the question asks for it.\n\n' +
      'Citizen: ' + consult.citizen + '\n' +
      'Situation: ' + (consult.context_digest || '') + '\n' +
      'Question: ' + consult.question;
    const t0 = Date.now();
    let out = '', err = '';
    let child;
    try {
      child = spawn('zcode', ['-p', prompt], { cwd: path.dirname(BOOK_PATH) });
    } catch (e) { return resolve({ ok: false, error: 'spawn failed: ' + e.message }); }
    const killer = setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, ZCODE_TIMEOUT_MS);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', (e) => { clearTimeout(killer); resolve({ ok: false, error: e.message }); });
    child.on('close', (code) => {
      clearTimeout(killer);
      const latencyMs = Date.now() - t0;
      const answer = out.trim();
      if (code === 0 && answer.length >= 20) resolve({ ok: true, answer: answer.slice(0, 4000), latencyMs });
      else resolve({ ok: false, error: 'exit ' + code + '; stdout ' + answer.length + ' chars; stderr: ' + err.slice(0, 200), latencyMs });
    });
  });
}

let busy = false;
async function poll() {
  if (busy) return;
  const book = readBook();
  const consults = book.filter((r) => r.type === 'consult' && r.status === 'open');
  if (!consults.length) return;
  const answeredIds = new Set(book.filter((r) => r.type === 'answer').map((r) => r.id));
  const attempts = {};
  for (const r of book) if (r.type === 'attempt') attempts[r.id] = (attempts[r.id] || 0) + 1;
  const hourAgo = Date.now() - 3600000;
  const answeredThisHour = {};
  for (const r of book) {
    if (r.type === 'answer' && r.status === 'answered' && new Date(r.ts).getTime() > hourAgo) {
      answeredThisHour[r.citizen] = (answeredThisHour[r.citizen] || 0) + 1;
    }
  }
  for (const consult of consults) {
    if (answeredIds.has(consult.id)) continue;
    if ((attempts[consult.id] || 0) >= MAX_ATTEMPTS) {
      appendBook({ type: 'answer', id: consult.id, citizen: consult.citizen, community: 'glm', ts: nowIso(), status: 'unanswered', answer: null, note: 'driver gave up after ' + MAX_ATTEMPTS + ' attempts — silence is a legal answer', question: consult.question });
      log('closed unanswered (attempts exhausted):', consult.id);
      continue;
    }
    if ((answeredThisHour[consult.citizen] || 0) >= ANSWER_CAP_PER_HOUR) {
      log('hourly answer cap reached for', consult.citizen, '— leaving', consult.id, 'open');
      continue;
    }
    busy = true;
    log('answering consult', consult.id, '(', consult.citizen, '/', consult.kind || 'general', ') attempt', (attempts[consult.id] || 0) + 1);
    const res = await askLibrary(consult);
    if (res.ok) {
      appendBook({
        type: 'answer', id: consult.id, citizen: consult.citizen, community: 'glm', ts: nowIso(),
        status: 'answered', answer: res.answer, question: consult.question,
        provenance: { seat: 'thor-zcode', model: 'GLM-5.3 via zcode -p', latencyMs: res.latencyMs },
      });
      answeredThisHour[consult.citizen] = (answeredThisHour[consult.citizen] || 0) + 1;
      log('answered', consult.id, 'in', Math.round(res.latencyMs / 1000) + 's', '(' + res.answer.length + ' chars)');
    } else {
      appendBook({ type: 'attempt', id: consult.id, citizen: consult.citizen, community: 'glm', ts: nowIso(), ok: false, error: String(res.error || 'unknown').slice(0, 300), latencyMs: res.latencyMs || null });
      log('attempt failed for', consult.id, ':', String(res.error || '').slice(0, 140));
    }
    busy = false;
  }
}

log('glm driver started; polling', BOOK_PATH, 'every', POLL_MS / 1000 + 's');
poll();
setInterval(poll, POLL_MS);
