'use strict';
/**
 * trial.js — the Pulse's trial gate (the trust discipline).
 *
 * A candidate skill NEVER becomes Cody silently. A trial:
 *   1. Snapshots baselines (deaths file size, state feed, server log).
 *   2. Fresh-relaunches Cody loading [promoted skills for earlier
 *      stages..., the candidate] via PULSE_SKILLS / PULSE_STAGE env.
 *   3. Polls the state feed + evidence scan for a bounded window.
 *   4. Computes the verdict ONLY from world evidence (max-seen
 *      inventory across polls, evidence.json scans, deaths records,
 *      the Orin server log) — never from the script's claims.
 *   5. Appends the verdict to pulse/ledger.jsonl. PASS promotes the
 *      candidate into active.json + marks the curriculum stage.
 *      FAIL leaves it in the library as a marked failure the smith
 *      will read on its next tick.
 *   6. Relaunches Cody on the promoted (active) set — the rollback
 *      is always one relaunch away.
 *
 * Usage:
 *   node trial.js run --stage S1 --candidate <file.js> [--window 15]
 *   node trial.js night        — S5: arm and watch one full night
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const PULSE = '/home/caseydigennaro/craftmind-league/pulse';
const LEAGUE = '/home/caseydigennaro/craftmind-league';
const CODY_DIR = path.join(LEAGUE, 'bots', 'runs', 'cody');
const NODE = '/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node';
const RESIDENT = 'resident-cody.js';
const RESIDENT_LOG = path.join(LEAGUE, 'logs', 'resident-cody.log');

const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };
const writeJson = (p, o) => { const t = p + '.tmp'; fs.writeFileSync(t, JSON.stringify(o, null, 1)); fs.renameSync(t, p); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slog = (...a) => console.log('[TRIAL]', ...a);

// ── Cody process management ──────────────────────────────────────────
function codyPids() {
  try {
    return execSync(`pgrep -f "${RESIDENT}"`, { timeout: 10000 }).toString().trim().split('\n').filter(Boolean).map(Number);
  } catch { return []; }
}

async function killCody() {
  const pids = codyPids();
  for (const pid of pids) { try { process.kill(pid, 'SIGTERM'); } catch {} }
  for (let i = 0; i < 20; i++) {
    if (!codyPids().length) return;
    await sleep(500);
  }
  for (const pid of codyPids()) { try { process.kill(pid, 'SIGKILL'); } catch {} }
  await sleep(1000);
}

function launchCody(env = {}) {
  const envStr = Object.entries(env).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ');
  const cmd = `cd ${CODY_DIR} && ${envStr} nohup ${NODE} ${RESIDENT} >> ${RESIDENT_LOG} 2>&1 &`;
  spawn('bash', ['-c', cmd], { detached: true, stdio: 'ignore' }).unref();
}

async function waitForState(maxMs = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    const st = readJson(path.join(PULSE, 'cody-state.json'), null);
    if (st && Date.now() - new Date(st.ts).getTime() < 25000 && st.pos) return st;
    await sleep(3000);
  }
  return null;
}

// ── evidence helpers ─────────────────────────────────────────────────
function deathsSince(byteOffset) {
  const p = path.join(PULSE, 'deaths.jsonl');
  if (!fs.existsSync(p)) return [];
  const buf = fs.readFileSync(p);
  const fresh = buf.slice(byteOffset).toString().split('\n').filter(Boolean);
  return fresh.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
function fileSize(p) { try { return fs.statSync(p).size; } catch { return 0; } }

function serverLogSince(offset) {
  try {
    const out = execSync(
      `ssh -o ConnectTimeout=10 orin-lan "tail -c +${offset + 1} ~/minecraft-server/logs/latest.log"`,
      { timeout: 30000 }
    ).toString();
    return out;
  } catch (e) {
    return ''; // Orin unreachable: verdict falls back to pulse-side evidence
  }
}
function serverLogSize() {
  try {
    return parseInt(execSync(
      `ssh -o ConnectTimeout=10 orin-lan "stat -c%s ~/minecraft-server/logs/latest.log"`,
      { timeout: 30000 }
    ).toString().trim(), 10) || 0;
  } catch { return 0; }
}

function promotedSetBefore(stageId) {
  const active = readJson(path.join(PULSE, 'active.json'), { stages: {} });
  const curr = readJson(path.join(PULSE, 'curriculum.json'), { stages: [] });
  const out = [];
  for (const st of curr.stages) {
    if (st.id === stageId) break;
    const a = active.stages && active.stages[st.id];
    if (a && a.skill) out.push(a.skill);
  }
  return out;
}

// ── stage verdicts (pure functions of collected evidence) ────────────
function verdictFor(stageId, col) {
  const inv = col.maxInv;
  switch (stageId) {
    case 'S1': {
      const table = (inv.crafting_table || 0) >= 1 || col.sawPlacedTable;
      const pick = (inv.wooden_pickaxe || 0) >= 1;
      return { pass: table && pick, detail: { craftingTable: table, woodenPickaxe: pick } };
    }
    case 'S2': {
      const pick = (inv.stone_pickaxe || 0) >= 1;
      const cobble = (inv.cobblestone || 0) >= 1;
      return { pass: pick && cobble, detail: { stonePickaxe: pick, cobblestoneSeen: cobble } };
    }
    case 'S3': {
      const s = col.bestShelter;
      return { pass: !!(s && s.found && s.hasDoor && s.hasTorchInside), detail: { shelter: s } };
    }
    case 'S4': {
      return { pass: col.maxChestTotal >= 8, detail: { maxChestTotal: col.maxChestTotal } };
    }
    default:
      return { pass: false, detail: { error: 'no verdict function for ' + stageId } };
  }
}

// ── run a stage trial ────────────────────────────────────────────────
async function runTrial(stageId, candidate, windowMin, maxDeaths = 0) {
  const curr = readJson(path.join(PULSE, 'curriculum.json'), { stages: [] });
  const stage = curr.stages.find((s) => s.id === stageId);
  if (!stage) throw new Error('unknown stage ' + stageId);
  const win = windowMin || stage.windowMin || 15;
  const trialId = `trial-${stageId}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  slog(trialId, 'starting; window', win, 'min; candidate', candidate);

  const skills = [...promotedSetBefore(stageId), path.resolve(candidate)];
  const deathsOffset = fileSize(path.join(PULSE, 'deaths.jsonl'));
  const logOffset = serverLogSize();

  await killCody();
  launchCody({ PULSE_SKILLS: skills.join(','), PULSE_STAGE: stageId });
  const st0 = await waitForState();
  slog('Cody up for trial:', st0 ? `pos ${JSON.stringify(st0.pos)} stage ${st0.stage}` : 'STATE FEED NOT LIVE');

  const col = { maxInv: {}, sawPlacedTable: false, bestShelter: null, maxChestTotal: 0, polls: 0 };
  let breakerFired = false;
  const deadline = Date.now() + win * 60000;
  let lastState = null;
  while (Date.now() < deadline) {
    await sleep(15000);
    const st = readJson(path.join(PULSE, 'cody-state.json'), null);
    const ev = readJson(path.join(PULSE, 'evidence.json'), null);
    if (st && st.inventory) {
      lastState = st;
      for (const [k, v] of Object.entries(st.inventory)) col.maxInv[k] = Math.max(col.maxInv[k] || 0, v);
      col.polls++;
    }
    if (ev) {
      if (ev.tables && ev.tables.length) col.sawPlacedTable = true;
      if (ev.shelter && ev.shelter.found) {
        const s = ev.shelter;
        const score = (s.hasDoor ? 2 : 0) + (s.hasTorchInside ? 2 : 0) + (s.volumeCells || 0);
        if (!col.bestShelter || score > (col.bestShelter._s || 0)) { s._s = score; col.bestShelter = s; }
      }
      if (ev.chests) for (const c of ev.chests) if (typeof c.total === 'number') col.maxChestTotal = Math.max(col.maxChestTotal, c.total);
    }
    // Death circuit-breaker (standing floor rule, declared in the ledger
    // 2026-11-07 as death-circuit-breaker-20261107): abort AUTOMATICALLY at
    // maxDeaths deaths in the run; the trial is then judged on the evidence
    // gathered up to the abort. Trial 7's 7-death grind is what this prevents.
    if (maxDeaths > 0 && deathsSince(deathsOffset).length >= maxDeaths) {
      breakerFired = true;
      slog('DEATH CIRCUIT-BREAKER fired at', maxDeaths, 'deaths in the run - aborting trial');
      break;
    }
    // Early exit on clear pass for inventory stages.
    const probe = verdictFor(stageId, col);
    if (probe.pass && (stageId === 'S1' || stageId === 'S2')) { slog('early PASS evidence reached'); break; }
  }
  if (col.bestShelter) delete col.bestShelter._s;

  const deaths = deathsSince(deathsOffset);
  const slogText = serverLogSince(logOffset);
  const serverDeathLines = slogText.split('\n').filter((l) => /Cody/.test(l) && /(was shot|was slain|died|was killed|drowned|fell out|hit the ground|was burnt|was blown)/.test(l));

  const v = verdictFor(stageId, col);
  const entry = {
    ts: new Date().toISOString(), kind: 'trial', trialId, stage: stageId,
    candidate: path.resolve(candidate), skills, windowMin: win,
    verdict: v.pass ? 'PASS' : 'FAIL',
    evidence: {
      detail: v.detail, maxInventory: col.maxInv, polls: col.polls,
      deathsDuringTrial: deaths.length, serverDeathLines: serverDeathLines.slice(0, 6),
      finalPos: lastState ? lastState.pos : null,
      stateFeed: path.join(PULSE, 'cody-state.json'), evidenceScan: path.join(PULSE, 'evidence.json'),
    },
  };
  fs.appendFileSync(path.join(PULSE, 'ledger.jsonl'), JSON.stringify(entry) + '\n');
  if (breakerFired) {
    entry.abortedByCircuitBreaker = true;
    entry.abortReason = 'death circuit-breaker: trial aborted automatically at ' + maxDeaths + ' deaths in the run (standing floor rule, ledger death-circuit-breaker-20261107)';
  }
  slog(trialId, 'verdict', entry.verdict, JSON.stringify(v.detail));

  // Curriculum bookkeeping.
  const curr2 = readJson(path.join(PULSE, 'curriculum.json'), { stages: [] });
  const st2 = curr2.stages.find((s) => s.id === stageId);
  if (st2) {
    st2.attempts.push({ ts: entry.ts, candidate: entry.candidate, verdict: entry.verdict, trialId });
    if (v.pass) st2.status = 'passed';
    writeJson(path.join(PULSE, 'curriculum.json'), curr2);
  }
  if (v.pass) {
    const active = readJson(path.join(PULSE, 'active.json'), { stages: {} });
    active.stages = active.stages || {};
    active.stages[stageId] = { skill: path.resolve(candidate), promotedAt: entry.ts, trialId };
    const next = curr2.stages.find((s) => s.status !== 'passed');
    active.currentStage = next ? next.id : 'DONE';
    writeJson(path.join(PULSE, 'active.json'), active);
    slog('promoted into active.json; currentStage =', active.currentStage);
  }

  // Rollback / normal running: relaunch on the promoted set.
  await killCody();
  launchCody({});
  const back = await waitForState(60000);
  slog('Cody relaunched on active set:', back ? 'state feed live' : 'STATE FEED DARK — check resident log');
  return entry;
}

// ── S5: the night watch ──────────────────────────────────────────────
async function nightWatch(candidate) {
  const skills = candidate ? [...promotedSetBefore('S5'), path.resolve(candidate)] : null;
  const trialId = `trial-S5-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  slog(trialId, 'arming; waiting for dusk (tod>=12400)');
  if (skills) {
    await killCody();
    launchCody({ PULSE_SKILLS: skills.join(','), PULSE_STAGE: 'S5' });
    await waitForState();
  }
  // Wait for dusk.
  for (;;) {
    const st = readJson(path.join(PULSE, 'cody-state.json'), null);
    if (st && typeof st.timeOfDay === 'number' && st.timeOfDay >= 12400 && st.timeOfDay < 13000) break;
    await sleep(10000);
  }
  const deathsOffset = fileSize(path.join(PULSE, 'deaths.jsonl'));
  const logOffset = serverLogSize();
  const ev0 = readJson(path.join(PULSE, 'evidence.json'), {});
  const centre = ev0.shelter && ev0.shelter.centre ? ev0.shelter.centre : null;
  slog(trialId, 'night begins; shelter centre', JSON.stringify(centre));
  const samples = [];
  let sawMidpoint = false;
  for (;;) {
    const st = readJson(path.join(PULSE, 'cody-state.json'), null);
    if (st && typeof st.timeOfDay === 'number') {
      const tod = st.timeOfDay;
      if (tod >= 13000 || tod < 3000) {
        samples.push({ tod, pos: st.pos, ts: st.ts });
        if (tod >= 17500 && tod <= 18500) sawMidpoint = true;
      }
      if (tod >= 3000 && tod < 12000 && samples.length > 4) break; // dawn passed
    }
    await sleep(15000);
  }
  const deaths = deathsSince(deathsOffset).filter((d) => typeof d.timeOfDay === 'number' && d.timeOfDay >= 13000 && d.timeOfDay <= 23000);
  const slogText = serverLogSince(logOffset);
  const serverDeathLines = slogText.split('\n').filter((l) => /Cody/.test(l) && /(was shot|was slain|died|was killed|drowned|fell out|hit the ground|was burnt|was blown)/.test(l));
  let withinCount = 0, nightSamples = samples.filter((s) => s.tod >= 13000 && s.tod <= 23000);
  if (centre) {
    for (const s of nightSamples) {
      const d = Math.hypot(s.pos.x - centre.x, s.pos.z - centre.z);
      if (d <= 7 && Math.abs(s.pos.y - centre.y) <= 4) withinCount++;
    }
  }
  const withinFrac = nightSamples.length ? withinCount / nightSamples.length : 0;
  const pass = deaths.length === 0 && serverDeathLines.length === 0 && sawMidpoint && withinFrac >= 0.7;
  const entry = {
    ts: new Date().toISOString(), kind: 'trial', trialId, stage: 'S5',
    candidate: candidate ? path.resolve(candidate) : '(active set)',
    verdict: pass ? 'PASS' : 'FAIL',
    evidence: {
      nightDeaths: deaths.length, serverDeathLines: serverDeathLines.slice(0, 6),
      nightSamples: nightSamples.length, withinShelterFraction: +withinFrac.toFixed(2), sawMidpoint,
      shelterCentre: centre,
    },
  };
  fs.appendFileSync(path.join(PULSE, 'ledger.jsonl'), JSON.stringify(entry) + '\n');
  slog(trialId, 'verdict', entry.verdict, JSON.stringify(entry.evidence));
  if (pass) {
    const curr2 = readJson(path.join(PULSE, 'curriculum.json'), { stages: [] });
    const st2 = curr2.stages.find((s) => s.id === 'S5');
    if (st2) { st2.status = 'passed'; st2.attempts.push({ ts: entry.ts, candidate: entry.candidate, verdict: 'PASS', trialId }); writeJson(path.join(PULSE, 'curriculum.json'), curr2); }
    const active = readJson(path.join(PULSE, 'active.json'), { stages: {} });
    active.currentStage = 'DONE';
    if (candidate) { active.stages = active.stages || {}; active.stages.S5 = { skill: path.resolve(candidate), promotedAt: entry.ts, trialId }; }
    writeJson(path.join(PULSE, 'active.json'), active);
  }
  await killCody();
  launchCody({});
  await waitForState(60000);
  slog('Cody relaunched on active set after the night');
  return entry;
}

// ── main ─────────────────────────────────────────────────────────────
(async () => {
  const cmd = process.argv[2];
  const get = (flag) => { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : null; };
  if (cmd === 'run') {
    const stage = get('--stage');
    const candidate = get('--candidate');
    const windowMin = get('--window') ? parseInt(get('--window'), 10) : null;
    const maxDeaths = get('--max-deaths') ? parseInt(get('--max-deaths'), 10) : 0;
    if (!stage || !candidate) { console.error('usage: trial.js run --stage S1 --candidate <file> [--window N] [--max-deaths N]'); process.exit(2); }
    const entry = await runTrial(stage, candidate, windowMin, maxDeaths);
    process.exit(entry.verdict === 'PASS' ? 0 : 1);
  } else if (cmd === 'night') {
    const entry = await nightWatch(get('--candidate'));
    process.exit(entry.verdict === 'PASS' ? 0 : 1);
  } else {
    console.error('usage: trial.js run --stage S1 --candidate <file> [--window N] | night [--candidate <file>]');
    process.exit(2);
  }
})().catch((e) => { console.error('TRIAL FATAL:', e.message); process.exit(1); });
