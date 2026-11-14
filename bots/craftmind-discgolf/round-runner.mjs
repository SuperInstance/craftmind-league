// round-runner.mjs — the league's first recorded round (simulator side).
//
// Three citizens play the 9-hole Acadia Pines card through Engine A
// (src/engine/disc-physics.js) with the league ledger on
// (LEAGUE_LEDGER=1) and execution noise on (LEAGUE_NOISE=1). Every
// throw goes through GolfScriptRunner's throw_disc step, so every
// throw is recorded in ledger/events.jsonl as a decision. After each
// throw, the citizen narrates one line through the governor
// (System Two putting words to the decision) — receipted in
// ledger/mind-calls.jsonl under their league-<name> identity.
//
// DISTANCE SCALE — read this before trusting the scores:
// Engine A as shipped flies 3–8 units at full power, whatever the
// disc: its drag term is not course-scale (max measured flight
// 8.12 units vs Acadia's 155–380-unit holes). Rather than edit the
// physics (out of scope, and the flag-off suite must stay pristine)
// the round is played at SCALE = 0.05 of the card distances: hole
// shapes, pars, relative lengths, wind and disc trade-offs are the
// real ones; absolute distances are compressed 20:1. The mismatch
// is recorded here and in round-1.md as an engine calibration gap.
//
// Run:
//   LEAGUE_LEDGER=1 LEAGUE_NOISE=1 node round-runner.mjs
// Writes: ~/craftmind-league/logs/round-1.md + round-1.json,
//         updated skill-state.json per citizen, ledger lines.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { GolfScriptRunner, Script, Step, Scorecard } from './src/scripts/script-engine.js';
import { simulateThrow } from './src/engine/disc-physics.js';
import { getDisc } from './src/engine/disc-database.js';
import { ACADEDA_PINES_COURSE } from './src/course-builder.js';
import { seededRng } from './src/engine/execution-noise.js';

if (process.env.LEAGUE_LEDGER !== '1' || process.env.LEAGUE_NOISE !== '1') {
  console.error('Refusing to run: LEAGUE_LEDGER=1 and LEAGUE_NOISE=1 are both required.');
  process.exit(2);
}

const LEAGUE = '/home/caseydigennaro/craftmind-league';
const SCALE = 0.05;          // card distance -> engine units (see header)
const CAPTURE = 0.75;        // remaining distance that counts as holed
const MAX_STROKES = 8;       // pick up at 8
const GOVERNOR = 'http://127.0.0.1:8642/v1/chat/completions';
// Fixed per-hole wind (same for every citizen — the weather is shared).
const WIND = { 1: [3, 20], 2: [4, 80], 3: [2, 140], 4: [5, 200], 5: [6, 260], 6: [2, 320], 7: [4, 40], 8: [5, 110], 9: [3, 290] };

const CITIZEN_IDS = ['mara', 'jules', 'pip'];
const roundStart = new Date();
const roundLog = [];

function loadCitizen(id) {
  const dir = `${LEAGUE}/bots/runs/${id}`;
  const citizen = JSON.parse(readFileSync(`${dir}/citizen.json`, 'utf8'));
  const statePath = `${dir}/skill-state.json`;
  const state = existsSync(statePath)
    ? JSON.parse(readFileSync(statePath, 'utf8'))
    : { throwsTaken: citizen.initialThrowsTaken };
  return { citizen, state, statePath, rng: seededRng(1000 + id.length * 77 + id.charCodeAt(0)) };
}

function slotFor(remaining) {
  if (remaining > 11) return 'distance';
  if (remaining > 7.5) return 'fairway';
  if (remaining > 4) return 'midrange';
  return 'putter';
}

function intendedShot(citizen, slot, remaining, rng) {
  let power, hyzer, aimPitch;
  if (slot === 'distance') { power = 0.5 + remaining / 30; hyzer = 6; aimPitch = 10; }
  else if (slot === 'fairway') { power = 0.45 + remaining / 22; hyzer = 5; aimPitch = 10; }
  else if (slot === 'midrange') { power = 0.35 + remaining / 20; hyzer = 2; aimPitch = 8; }
  else { power = Math.min(0.62, Math.max(0.22, remaining / 7)); hyzer = 0; aimPitch = 3; }
  power = Math.min(1, power * citizen.style.powerFactor);
  hyzer += citizen.style.hyzerOffset;
  // The rookie sometimes reaches for the wrong shelf on drives.
  let discSlot = slot;
  if (slot === 'distance' && citizen.style.driveSwapChance && rng() < citizen.style.driveSwapChance) {
    discSlot = 'fairway';
  }
  return { disc: getDisc(citizen.bag[discSlot]), power, hyzer, aimPitch, discSlot };
}

async function narrate(entry, throwCtx) {
  const { citizen } = entry;
  const c = throwCtx;
  const system = `You are ${citizen.name}, a disc golfer. ${citizen.personality} Speak in first person. One short line, at most 18 words, no quotes, no preamble.`;
  const user = `Hole ${c.hole} (par ${c.par}), throw ${c.stroke}. You threw your ${c.discName} (power ${c.power}) into wind ${c.windSpeed} at ${c.windDirection} degrees. It finished ${c.remaining} units from the basket (landing: ${c.landing}). ${c.holed ? 'That holed out.' : ''} Say your line about this throw.`;
  try {
    const res = await fetch(GOVERNOR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer league-${citizen.id}` },
      body: JSON.stringify({
        model: 'confluence-presence-brain',
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        max_tokens: 60,
        temperature: 0.8,
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) return { line: null, error: `HTTP ${res.status}` };
    const data = await res.json();
    const line = data?.choices?.[0]?.message?.content?.trim().split('\n')[0] || null;
    return { line, error: line ? null : 'empty completion' };
  } catch (e) {
    return { line: null, error: e.message };
  }
}

function localObstacles(hole, D) {
  const { tee, basket } = hole;
  const dx = basket.x - tee.x, dz = basket.z - tee.z;
  const distW = Math.hypot(dx, dz);
  const k = D / distW;
  return (hole.obstacles || [])
    .map((o) => {
      const ox = o.x - tee.x, oz = o.z - tee.z;
      const f = (ox * dx + oz * dz) / (distW * distW);
      const lateral = (ox * dz - oz * dx) / distW;
      return { x: f * D, z: lateral * k, radius: Math.max(0.35, o.radius * k), f };
    })
    .filter((o) => o.f > 0.05 && o.f < 0.95)
    .map(({ x, z, radius }) => ({ x, z, radius }));
}

const results = [];

for (const id of CITIZEN_IDS) {
  const entry = loadCitizen(id);
  const { citizen, state } = entry;
  const throwsBefore = state.throwsTaken;
  const bot = { username: citizen.name, chat: () => {} };
  const scorecard = new Scorecard(ACADEDA_PINES_COURSE.holes);
  const runner = new GolfScriptRunner(bot, { scorecard, agentName: citizen.id });
  runner._naturalDelay = async () => {}; // simulator pace, not stage pace
  // The throw arm. GolfScriptRunner calls options.onThrow per
  // throw_disc step; it must be attached to the RUNNER (a local
  // closure the runner never sees is the bug that invalidated the
  // first attempt — see logs/round-0-failed-attempt.md). Per-throw
  // parameters travel through this mutable holder.
  const holder = { shot: null, lie: { x: 0, z: 0 }, aimYaw: 0, windSpeed: 0, windDirection: 0, obstacles: [], target: 0, flight: null };
  runner._onThrow = async (opts) => {
    const r = simulateThrow({
      disc: holder.shot.disc,
      power: opts.power,
      hyzer: opts.hyzer,
      aimYaw: holder.aimYaw,
      aimPitch: holder.shot.aimPitch,
      windSpeed: holder.windSpeed,
      windDirection: holder.windDirection,
      startX: holder.lie.x,
      startY: 1.6,
      startZ: holder.lie.z,
      obstacles: holder.obstacles,
      skillState: state,
      noiseRng: entry.rng,
    });
    holder.flight = r;
    const rem = Math.hypot(holder.target - r.finalX, 0 - r.finalZ);
    return { landing: r.landing, distance: +r.distance.toFixed(2), shot: r.shot, remaining: rem };
  };
  const holesLog = [];
  const driveLandings = [];
  const noiseDeltas = [];

  for (const hole of ACADEDA_PINES_COURSE.holes) {
    const D = +(hole.distance * SCALE).toFixed(2);
    const obstacles = localObstacles(hole, D);
    const [windSpeed, windDirection] = WIND[hole.number];
    let lie = { x: 0, z: 0 };
    let remaining = D;
    runner.updateContext({ hole: hole.number, par: hole.par, strokes: 0, windSpeed, windDirection, distanceToBasket: hole.distance });
    const throwLines = [];

    while (remaining > CAPTURE && runner.context.strokes < MAX_STROKES) {
      const slot = slotFor(remaining);
      const shot = intendedShot(citizen, slot, remaining, entry.rng);
      const aimYaw = (Math.atan2(0 - lie.z, D - lie.x) * 180) / Math.PI;
      Object.assign(holder, { shot, lie, aimYaw, windSpeed, windDirection, obstacles, target: D, flight: null });
      const flight = () => holder.flight;
      runner.register(Script.define(`${citizen.id}_round`, [
        Step.throwDisc({ disc: shot.disc, power: shot.power, hyzer: shot.hyzer, aimYaw, aimPitch: shot.aimPitch }),
      ]));
      await runner.run(`${citizen.id}_round`);
      const fl = flight();
      const rem = fl ? Math.hypot(D - fl.finalX, 0 - fl.finalZ) : remaining;
      if (fl?.executionNoise) {
        noiseDeltas.push({ dPower: Math.abs(fl.executionNoise.dPower), dHyzer: Math.abs(fl.executionNoise.dHyzer), dAimYaw: Math.abs(fl.executionNoise.dAimYaw) });
      }
      if (runner.context.strokes === 1 && fl) driveLandings.push({ x: fl.finalX, z: fl.finalZ });
      lie = fl ? { x: fl.finalX, z: fl.finalZ } : lie;
      remaining = rem;
      const narration = await narrate(entry, {
        hole: hole.number, par: hole.par, stroke: runner.context.strokes,
        discName: shot.disc.name, power: shot.power.toFixed(2),
        windSpeed, windDirection, remaining: rem.toFixed(2),
        landing: fl?.landing ?? 'unknown', holed: rem <= CAPTURE,
      });
      throwLines.push({
        stroke: runner.context.strokes, disc: shot.disc.id, slot: shot.discSlot,
        intendedPower: +shot.power.toFixed(2),
        executedPower: fl?.shot ? +fl.shot.power.toFixed(3) : null,
        flightDistance: fl ? +fl.distance.toFixed(2) : null,
        remaining: +rem.toFixed(2), landing: fl?.landing ?? null,
        narration: narration.line, narrationError: narration.error,
      });
      runner.updateContext({ distanceToBasket: Math.round(rem / SCALE) });
    }

    const strokes = runner.context.strokes;
    scorecard.recordStrokes(hole.number, strokes);
    writeFileSync(entry.statePath, JSON.stringify({ throwsTaken: state.throwsTaken }, null, 2) + '\n');
    holesLog.push({ hole: hole.number, name: hole.name, par: hole.par, cardDistance: hole.distance, simDistance: D, strokes, holed: remaining <= CAPTURE, throws: throwLines });
    console.log(`[${citizen.id}] hole ${hole.number} (${hole.name}): ${strokes} strokes, throws_taken=${state.throwsTaken}`);
  }

  const cx = driveLandings.reduce((s, p) => s + p.x, 0) / Math.max(1, driveLandings.length);
  const cz = driveLandings.reduce((s, p) => s + p.z, 0) / Math.max(1, driveLandings.length);
  const driveDispersion = Math.sqrt(driveLandings.reduce((s, p) => s + (p.x - cx) ** 2 + (p.z - cz) ** 2, 0) / Math.max(1, driveLandings.length));
  const meanDelta = (k) => noiseDeltas.length ? noiseDeltas.reduce((s, d) => s + d[k], 0) / noiseDeltas.length : 0;

  results.push({
    citizen, throwsBefore, throwsAfter: state.throwsTaken,
    totalStrokes: scorecard.totalScore, totalPar: scorecard.totalPar, scoreToPar: scorecard.scoreToPar,
    holes: holesLog, driveDispersion: +driveDispersion.toFixed(3),
    meanAbsNoise: { dPower: +meanDelta('dPower').toFixed(4), dHyzer: +meanDelta('dHyzer').toFixed(2), dAimYaw: +meanDelta('dAimYaw').toFixed(2) },
    narrationFailures: holesLog.flatMap((h) => h.throws).filter((t) => !t.narration).length,
    throwsTotal: holesLog.reduce((s, h) => s + h.throws.length, 0),
  });
}

// ── Mind spend for the round window ─────────────────────────────
const mindLines = readFileSync(`${LEAGUE}/ledger/mind-calls.jsonl`, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const roundMind = mindLines.filter((l) => new Date(l.ts) >= roundStart && CITIZEN_IDS.includes(l.agent));
const mindByAgent = {};
for (const id of CITIZEN_IDS) {
  const mine = roundMind.filter((l) => l.agent === id);
  mindByAgent[id] = { calls: mine.length, mindSeconds: +mine.reduce((s, l) => s + (l.mind_seconds || 0), 0).toFixed(3) };
}
let budgetAfter = null;
try {
  budgetAfter = await (await fetch('http://127.0.0.1:8642/budget')).json();
} catch { /* governor introspection unavailable; receipts still counted */ }

writeFileSync(`${LEAGUE}/logs/round-1.json`, JSON.stringify({
  roundStart: roundStart.toISOString(), roundEnd: new Date().toISOString(),
  scale: SCALE, capture: CAPTURE, maxStrokes: MAX_STROKES, results, mindByAgent, budgetAfter,
}, null, 2) + '\n');

const fmtToPar = (n) => (n === 0 ? 'E' : n > 0 ? `+${n}` : `${n}`);
const standings = [...results].sort((a, b) => a.totalStrokes - b.totalStrokes);
let md = `# Round 1 — Acadia Pines (simulator), ${roundStart.toISOString().slice(0, 10)}\n\n`;
md += `The league's first recorded round. Three citizens, 9 holes, Engine A physics with execution noise on (LEAGUE_NOISE=1) and the league ledger on (LEAGUE_LEDGER=1). Every throw below is a ledger line in \`ledger/events.jsonl\`; every narration line is a governor receipt in \`ledger/mind-calls.jsonl\`.\n\n`;
md += `**Distance scale:** Engine A flies 3–8 units at full power (its drag term is not course-scale), so the card was played at ${SCALE}× distance — hole shapes, pars, relative lengths, wind and disc trade-offs are the real Acadia Pines ones; absolute distances are compressed 20:1. Recorded as an engine calibration gap, not hidden. Capture radius ${CAPTURE} units; pick up at ${MAX_STROKES}.\n\n`;
md += `## Standings\n\n| # | Citizen | Bag (D/F/M/P) | Throws taken (before → after) | Strokes | To par |\n|---|---|---|---|---|---|\n`;
for (let i = 0; i < standings.length; i++) {
  const r = standings[i];
  md += `| ${i + 1} | ${r.citizen.name} — ${r.citizen.title} | ${r.citizen.bag.distance}/${r.citizen.bag.fairway}/${r.citizen.bag.midrange}/${r.citizen.bag.putter} | ${r.throwsBefore} → ${r.throwsAfter} | ${r.totalStrokes} | ${fmtToPar(r.scoreToPar)} |\n`;
}
md += `\n## Card\n\n| Hole | Par | Card dist | Sim dist | ${results.map((r) => r.citizen.name.split(' ')[0]).join(' | ')} |\n|---|---|---|---|---|\n`;
for (const hole of ACADEDA_PINES_COURSE.holes) {
  md += `| ${hole.number} ${hole.name} | ${hole.par} | ${hole.distance} | ${(hole.distance * SCALE).toFixed(2)} | ${results.map((r) => r.holes[hole.number - 1].strokes).join(' | ')} |\n`;
}
md += `| **Total** | **${results[0].totalPar}** | | | ${results.map((r) => `**${r.totalStrokes} (${fmtToPar(r.scoreToPar)})**`).join(' | ')} |\n`;
md += `\n## Did the rookie spray more? (dispersion evidence)\n\n`;
md += `Battery proof (tests/test-execution-noise.js, same seed): rookie dispersion vs veteran dispersion is asserted at <55% — see test output. In this round itself:\n\n`;
md += `| Citizen | Career throws at start | Mean |noise| power | Mean |noise| hyzer° | Mean |noise| aim° | Drive-landing dispersion (RMS, n=9 drives) |\n|---|---|---|---|---|---|\n`;
for (const r of results) {
  md += `| ${r.citizen.name} | ${r.throwsBefore} | ${r.meanAbsNoise.dPower} | ${r.meanAbsNoise.dHyzer} | ${r.meanAbsNoise.dAimYaw} | ${r.driveDispersion} |\n`;
}
const pip = results.find((r) => r.citizen.id === 'pip');
const others = results.filter((r) => r.citizen.id !== 'pip');
md += `\nPip started with ${pip.throwsBefore} career throws; the veterans with ${others.map((r) => r.throwsBefore).join(' and ')}. Pip's mean release noise and drive scatter above ${pip.driveDispersion > Math.max(...others.map((r) => r.driveDispersion)) ? '**exceed**' : 'do **not** exceed'} the veterans' — the round ${pip.driveDispersion > Math.max(...others.map((r) => r.driveDispersion)) ? 'agrees' : 'does not fully agree'} with the battery at n=9 drives (small sample; the battery is the controlled evidence, the round is the lived one). Over the round Pip's sigma scale also shrank as throws_taken climbed from ${pip.throwsBefore} to ${pip.throwsAfter} — practice, accruing mid-round.\n`;
md += `\n## Mind spend (System Two narration, via the governor)\n\n| Citizen | Narration calls | Mind-seconds |\n|---|---|---|\n`;
for (const id of CITIZEN_IDS) md += `| ${results.find((r) => r.citizen.id === id).citizen.name} | ${mindByAgent[id].calls} | ${mindByAgent[id].mindSeconds} |\n`;
md += `| **Total** | **${roundMind.length}** | **${+roundMind.reduce((s, l) => s + (l.mind_seconds || 0), 0).toFixed(3)}** |\n`;
md += `\nGovernor budget state after the round: \`${JSON.stringify(budgetAfter)}\`\n`;
md += `\nNarration failures: ${results.reduce((s, r) => s + r.narrationFailures, 0)} of ${results.reduce((s, r) => s + r.throwsTotal, 0)} throws (failed lines are marked in the shot log, never invented).\n`;
md += `\n## Shot log\n`;
for (const r of results) {
  md += `\n### ${r.citizen.name} — ${r.citizen.title}\n`;
  for (const h of r.holes) {
    md += `\n**Hole ${h.hole} — ${h.name}** (par ${h.par}, sim ${h.simDistance}) — ${h.strokes} strokes${h.holed ? '' : ' (picked up at max)'}\n`;
    for (const t of h.throws) {
      md += `- #${t.stroke} ${t.disc} — intended power ${t.intendedPower}, executed ${t.executedPower ?? '—'}, flew ${t.flightDistance}, ${t.remaining} left. ${t.narration ? `*${t.narration}*` : `(narration unavailable: ${t.narrationError})`}\n`;
    }
  }
}
writeFileSync(`${LEAGUE}/logs/round-1.md`, md);
console.log(`[round] done. standings: ${standings.map((r) => `${r.citizen.id}=${r.totalStrokes}`).join(' ')}; mind calls=${roundMind.length}`);
