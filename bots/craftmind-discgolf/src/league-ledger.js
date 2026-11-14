/**
 * league-ledger.js — the league ledger writer (disc golf line).
 *
 * Append-only JSONL. One line per throw, recorded as a DECISION:
 * who threw, on which hole, which disc they chose, with what shot
 * parameters, in what wind — and what it cost them in strokes.
 * This is the record CRAFTMIND-MAP §5.5 item 1 asks for ("scorecards
 * record strokes, not decisions") and the seed §5.4's trust ledger
 * aggregates over.
 *
 * Gated by env LEAGUE_LEDGER=1. When the flag is off, recordThrow
 * is a no-op and physics/scoring behaviour is byte-identical to
 * upstream. The writer never throws: a broken ledger must not
 * break a round.
 *
 * Path: env LEAGUE_LEDGER_PATH, default the league ledger dir.
 */
import { appendFileSync } from 'node:fs';

const LEDGER_PATH =
  process.env.LEAGUE_LEDGER_PATH ||
  '/home/caseydigennaro/craftmind-league/ledger/events.jsonl';

export function leagueLedgerEnabled() {
  return process.env.LEAGUE_LEDGER === '1';
}

function discRef(disc) {
  if (!disc) return null;
  if (typeof disc === 'string') return disc;
  return disc.id || disc.name || null;
}

/**
 * @param {object} ev
 * @param {string|null} ev.agent    - agent/player name (bot username or script runner's agentName)
 * @param {string|null} ev.script   - behavior script that made the throw
 * @param {number|null} ev.hole
 * @param {number|null} ev.par
 * @param {object|string|null} ev.disc - disc record or id
 * @param {object} ev.shot          - {power, hyzer, aimYaw, aimPitch}
 * @param {object} ev.wind          - {speed, direction}
 * @param {object} ev.outcome       - {landing, distance, strokes} (strokes = running strokes on the hole after this throw)
 */
export function recordThrow(ev) {
  if (!leagueLedgerEnabled()) return;
  try {
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      kind: 'throw',
      agent: ev.agent ?? null,
      script: ev.script ?? null,
      hole: ev.hole ?? null,
      par: ev.par ?? null,
      disc: discRef(ev.disc),
      shot: ev.shot ?? null,
      wind: ev.wind ?? null,
      outcome: ev.outcome ?? null,
    });
    appendFileSync(LEDGER_PATH, line + '\n');
  } catch {
    /* the ledger never breaks a round */
  }
}
