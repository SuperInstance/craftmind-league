'use strict';
/**
 * minimax-driver.js — the MiniMax library driver (First Casting step 5,
 * fired at Vega's unpark 2026-11-08; mirrors glm-driver.js in shape and
 * rules). Declared in pulse/ledger.jsonl: vega-minimax-casting-20261108.
 *
 * Polls the MiniMax consult book (commons/consults/minimax.jsonl) every
 * ~60 s. For each OPEN consult: drives the Thor MCode seat (MiniMax
 * M3.1-Flash, TUI-only — there is no headless print mode) through a
 * dedicated tmux session "minimax-library" using the fleet's proven
 * paste-buffer pattern:
 *   /clear (fresh context per question — a library answers each
 *   question on its own), Ctrl-U (kill any suggested-message prefill),
 *   paste the question, Enter, wait for the TUI's "Completed in ..."
 *   line, scrape the answer block from the pane, append it to the book
 *   provenance-stamped (community, seat, latency).
 * The prompt forbids tool use (knowledge answers only); the seat
 * complied in the driver's verification probe (2026-11-08).
 *
 * Budgets: at most 2 answered consults per citizen per rolling hour
 * (a library is not a chat); a failed round trip is retried on later
 * polls, and after 3 attempts the consult is closed UNANSWERED —
 * silence is a legal answer (comms protocol). Kill: stop the process
 * (pidfile: craftmind-league/logs/minimax-driver.pid); the book is
 * just a file and keeps every record. The tmux session is the
 * driver's own; stopping the driver leaves the seat up (harmless).
 */
const fs = require('fs');
const { spawnSync } = require('child_process');

const BOOK_PATH = '/home/caseydigennaro/craftmind-league/commons/consults/minimax.jsonl';
const TMUX_SESSION = 'minimax-library';
const POLL_MS = 60000;
const ANSWER_TIMEOUT_MS = 600000;
const MAX_ATTEMPTS = 3;
const ANSWER_CAP_PER_HOUR = 2;
const NODE_BIN = '/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin';
const MCODE = '/home/caseydigennaro/.minimax-code/bin/mcode';

function nowIso() { return new Date().toISOString(); }
function log(...a) { console.log('[MINIMAX-DRIVER]', nowIso(), ...a); }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function tmux(args, opts = {}) {
  const r = spawnSync('tmux', args, { encoding: 'utf8', timeout: opts.timeout || 30000 });
  return { code: r.status, out: (r.stdout || ''), err: (r.stderr || '') };
}
function capturePane() {
  const r = tmux(['capture-pane', '-t', TMUX_SESSION, '-p', '-S', '-400']);
  return r.code === 0 ? r.out : '';
}
function pasteText(text) {
  fs.writeFileSync('/tmp/minimax-driver-paste.txt', text);
  tmux(['load-buffer', '/tmp/minimax-driver-paste.txt']);
  tmux(['paste-buffer', '-p', '-t', TMUX_SESSION]);
}
async function ensureSeat() {
  let r = tmux(['has-session', '-t', TMUX_SESSION]);
  if (r.code !== 0) {
    tmux(['new-session', '-d', '-s', TMUX_SESSION, '-x', '200', '-y', '50']);
    await sleep(1000);
  }
  let pane = capturePane();
  if (!/Ask Mcode to do anything/.test(pane) && !/Ready/.test(pane)) {
    // mcode not at its prompt — (re)launch it in the pane.
    tmux(['send-keys', '-t', TMUX_SESSION, MCODE, 'Enter']);
    for (let i = 0; i < 24; i++) {
      await sleep(2500);
      pane = capturePane();
      if (/Ask Mcode to do anything/.test(pane)) break;
    }
  }
  return /Ask Mcode to do anything/.test(capturePane());
}

// Extract the answer text from a pane capture that contains exactly one
// Q/A (the driver /clears before each question). Shape, verified live:
//   [bullet] <answer first line>
//     <continuation lines, indented to the text column>
//     [corner] Completed in Ns
function extractAnswer(pane) {
  const lines = pane.split('\n');
  let completedIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/Completed in/.test(lines[i])) { completedIdx = i; break; }
  }
  if (completedIdx < 0) return null;
  let startIdx = -1;
  for (let i = completedIdx - 1; i >= 0; i--) {
    if (/^\s*●\s+/.test(lines[i])) { startIdx = i; break; }
    if (/Thought for/.test(lines[i])) break; // walked past the answer block
  }
  if (startIdx < 0) return null;
  const raw = [];
  for (let i = startIdx; i < completedIdx; i++) {
    let l = lines[i].replace(/^\s*●\s+/, '').replace(/^ {2,6}/, '');
    raw.push(l);
  }
  // Join wrapped lines into paragraphs (blank line = paragraph break).
  const paras = [];
  let cur = '';
  for (const l of raw) {
    if (!l.trim()) { if (cur) { paras.push(cur); cur = ''; } continue; }
    cur = cur ? cur + ' ' + l.trim() : l.trim();
  }
  if (cur) paras.push(cur);
  const answer = paras.join('\n\n').trim();
  return answer.length >= 20 ? answer.slice(0, 4000) : null;
}

async function askLibrary(consult) {
  const t0 = Date.now();
  const ready = await ensureSeat();
  if (!ready) return { ok: false, error: 'mcode seat not at a ready prompt', latencyMs: Date.now() - t0 };
  // Fresh context per question.
  tmux(['send-keys', '-t', TMUX_SESSION, 'C-u']);
  await sleep(400);
  pasteText('/clear');
  await sleep(600);
  tmux(['send-keys', '-t', TMUX_SESSION, 'Enter']);
  await sleep(3000);
  const prompt =
    'You are the research library (MiniMax community) for a Minecraft citizen agent. Answer the question below in at most 200 words: practical, specific, plain prose. If a rule of thumb answers it, end with that rule in one sentence. Answer from knowledge only — do not use tools, do not run commands, do not open files.\n\n' +
    'Citizen: ' + consult.citizen + '\n' +
    'Situation: ' + (consult.context_digest || '') + '\n' +
    'Question: ' + consult.question;
  tmux(['send-keys', '-t', TMUX_SESSION, 'C-u']);
  await sleep(400);
  pasteText(prompt);
  await sleep(800);
  tmux(['send-keys', '-t', TMUX_SESSION, 'Enter']);
  const deadline = Date.now() + ANSWER_TIMEOUT_MS;
  let lastTail = '';
  let stableCount = 0;
  while (Date.now() < deadline) {
    await sleep(5000);
    const pane = capturePane();
    if (!/Completed in/.test(pane)) { stableCount = 0; continue; }
    const tail = pane.slice(-1500);
    if (tail === lastTail) {
      stableCount++;
      if (stableCount >= 2) {
        const answer = extractAnswer(pane);
        const latencyMs = Date.now() - t0;
        if (answer) return { ok: true, answer, latencyMs };
        return { ok: false, error: 'completed but answer extraction failed', latencyMs };
      }
    } else { stableCount = 0; lastTail = tail; }
  }
  return { ok: false, error: 'answer timeout after ' + Math.round(ANSWER_TIMEOUT_MS / 1000) + 's', latencyMs: Date.now() - t0 };
}

function readBook() {
  try {
    return fs.readFileSync(BOOK_PATH, 'utf8').split('\n').filter(Boolean)
      .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
function appendBook(rec) {
  fs.appendFileSync(BOOK_PATH, JSON.stringify(rec) + '\n');
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
      appendBook({ type: 'answer', id: consult.id, citizen: consult.citizen, community: 'minimax', ts: nowIso(), status: 'unanswered', answer: null, note: 'driver gave up after ' + MAX_ATTEMPTS + ' attempts — silence is a legal answer', question: consult.question });
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
        type: 'answer', id: consult.id, citizen: consult.citizen, community: 'minimax', ts: nowIso(),
        status: 'answered', answer: res.answer, question: consult.question,
        provenance: { seat: 'thor-mcode', model: 'MiniMax M3.1-Flash via mcode TUI (tmux minimax-library)', latencyMs: res.latencyMs },
      });
      answeredThisHour[consult.citizen] = (answeredThisHour[consult.citizen] || 0) + 1;
      log('answered', consult.id, 'in', Math.round(res.latencyMs / 1000) + 's', '(' + res.answer.length + ' chars)');
    } else {
      appendBook({ type: 'attempt', id: consult.id, citizen: consult.citizen, community: 'minimax', ts: nowIso(), ok: false, error: String(res.error || 'unknown').slice(0, 300), latencyMs: res.latencyMs || null });
      log('attempt failed for', consult.id, ':', String(res.error || '').slice(0, 140));
    }
    busy = false;
  }
}

log('minimax driver started; polling', BOOK_PATH, 'every', POLL_MS / 1000 + 's');
poll();
setInterval(poll, POLL_MS);
