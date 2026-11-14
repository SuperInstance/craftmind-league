"use strict";
// TRAVERSE-VERIFY-5 — operator probe (not a citizen, not curriculum).
// Route traverse-verification for the BENT gate-latitude route
// chosen by the route survey for Gate 0 re-run 7 (ledger
// route-survey-gate-rerun-7; scan survey4-result-SurveyG121447.json).
//
// WHY A NEW ROUTE: four helm generations (v3.3 momentum step-up,
// v3.4 wedge-release, v3.5 arbiter, v3.6 hold-and-tap) pinned at
// the same cell — the x53.69 stand / x54 face pair on the z=-84
// line — with every recovery-side confound excluded in turn
// (grounded settle-verified starts, position-preserving release,
// fair arbitration, unmasked triggers, face-keyed jumps). The
// recovery space is exhausted; the remaining in-lane lever is the
// ROUTE. Selection criteria were stated in the ledger BEFORE this
// traverse: no nulls, no trunk obstructions, max up-step <= 1 in
// both directions, +1 faces isolated (>= 4 columns apart), >= 2
// flat run-up columns before every face, no litter cap on any
// face column.
//
// THE CHOSEN LINE: east along row z=-85 from x49 to x54 (flat top
// 67), one shift leg north at column x54 (crossing row z=-84 ON
// the plateau top, flat 67 — the body never walks the z=-84 row's
// west approach and never stands at (53.69,-83.5)), then east
// along row z=-83 from x55 to x69 (flat 67, one -1 step down at
// x65, flat 66 to the end). Eastbound climbs: ZERO. Westbound:
// exactly ONE climb — face (64,-83), stand (65,-83) top 66, run-up
// x66..x69 flat 66, landing shelf flat 67 — isolated by the whole
// path. 7 on-surface litter cells, all on flat columns; no litter
// cap on the climb face; no trunks; no head blocks.
//
// STRUCTURE: axis-aligned waypointed legs (the gate-walk
// discipline generalised to a bent corridor): the corridor is
// enforced per leg as drift <= 2 from the leg's own axis (z for
// east/west legs, x for the shift legs). Helm v3.6, settle beat
// at every leg boundary, dig-step armed and declared (same
// allowance as every gate: +2 tops or litter capping a +1; clean
// +1s never dug — extending the allowance is the OWNER's decision,
// not taken), 75 s leg windows, 400 ms trace, wedge + arbiter
// logs per attempt. Judged on displacement only. If this probe
// crosses the full path out and back, the route is body-verified
// and gate re-run 7 may stage; if it wedges, the new wall is
// recorded precisely and NO gate is run (and per the lane's hard
// stop, the gate line is then parked). Result file is per-probe.
const fs = require("fs");
const NM = "/home/caseydigennaro/craftmind-league/bots/craftmind/node_modules";
const PULSE = "/home/caseydigennaro/craftmind-league/pulse";
const mineflayer = require(NM + "/mineflayer");
const pf = require(NM + "/mineflayer-pathfinder");
const prims = require(PULSE + "/lib/prims.js");
const Vec3 = require(NM + "/vec3").Vec3;
const USER = process.env.TRAV_USER;
if (!USER) { console.error("TRAV_USER required"); process.exit(2); }
const OUT_PATH = PULSE + "/traverse-result-" + USER + ".json";
const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline", plugins: { pathfinder: pf.pathfinder } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (p) => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) });
const OUT = { user: USER, ts: new Date().toISOString(), helm: "v3.6 (arbiter + hold-tap + best-in-sequence + dig cap; settle beat)", route: "bent gate-latitude path: z=-85 row x49->x54, shift at x54, z=-83 row x55->x69 (ledger route-survey-gate-rerun-7)", legMs: 75000, nav: [], deaths: 0, health: null, settles: [] };

const START = { x: 49.5, y: 68, z: -84.5 };

bot.on("death", () => { OUT.deaths++; console.log("[TRAV5] DEATH", OUT.deaths, "at", JSON.stringify(fmt(bot.entity.position))); });

bot.once("spawn", async () => {
  try {
    await sleep(3000);
    for (let i = 0; i < 10 && !bot.entity.onGround; i++) await sleep(1500);
    const sp = bot.entity.position;
    const below = bot.blockAt(sp.offset(0, -1, 0));
    OUT.spawn = { pos: fmt(sp), onGround: !!bot.entity.onGround, below: below ? below.name : null, health: bot.health };
    console.log("[TRAV5] spawn", JSON.stringify(OUT.spawn));

    // ── reach the route start ──
    // The self-powered commute is on the record as a failure; the
    // traverse measures the ROUTE, not the commute, so with
    // TRAV_STAGE=1 this probe waits at spawn for the declared
    // operator teleport (the same trial apparatus used to stage
    // Cody), then traverses.
    let navOk = false;
    {
      const P0 = bot.entity.position;
      if (Math.hypot(START.x - P0.x, START.z - P0.z) <= 2.5) navOk = true;
    }
    if (!navOk && process.env.TRAV_STAGE === "1") {
      console.log("[TRAV5] STAGE-WAIT — holding at spawn for operator teleport to the route start", JSON.stringify(START));
      const w0 = Date.now();
      while (Date.now() - w0 < 720000) {
        const P = bot.entity.position;
        if (Math.hypot(START.x - P.x, START.z - P.z) <= 2.5) { navOk = true; break; }
        await sleep(4000);
      }
      OUT.nav.push({ staged: "operator teleport (declared trial apparatus)", waitedMs: Date.now() - w0, at: fmt(bot.entity.position) });
      console.log("[TRAV5] stage-wait done, navOk", navOk, "at", JSON.stringify(fmt(bot.entity.position)));
    }
    OUT.navOk = navOk;
    console.log("[TRAV5] navOk", navOk, "at", JSON.stringify(fmt(bot.entity.position)));
    if (!navOk) {
      OUT.verdict = "NAV-FAIL — probe could not reach the route start; traverse NOT run";
      fs.writeFileSync(OUT_PATH, JSON.stringify(OUT, null, 1));
      console.log("[TRAV5] RESULT", JSON.stringify(OUT));
      bot.quit(); process.exit(0);
    }

    // ── the traverse: axis-aligned waypointed legs ──
    // axis: the corridor constrains drift in the OTHER coordinate:
    // for axis "z" legs (travel along x) drift = z - line; for axis
    // "x" legs (the shifts, travel along z) drift = x - line.
    const EAST = [
      { label: "E1", x: 54.5, y: 68, z: -84.5, axis: "z", line: -84.5 },
      { label: "E2", x: 54.5, y: 68, z: -82.5, axis: "x", line: 54.5 },
      { label: "E3", x: 59.5, y: 68, z: -82.5, axis: "z", line: -82.5 },
      { label: "E4", x: 64.5, y: 68, z: -82.5, axis: "z", line: -82.5 },
      { label: "E5", x: 69.5, y: 67, z: -82.5, axis: "z", line: -82.5 },
    ];
    const WEST = [
      { label: "W1", x: 64.5, y: 68, z: -82.5, axis: "z", line: -82.5 },
      { label: "W2", x: 59.5, y: 68, z: -82.5, axis: "z", line: -82.5 },
      { label: "W3", x: 54.5, y: 68, z: -82.5, axis: "z", line: -82.5 },
      { label: "W4", x: 54.5, y: 68, z: -84.5, axis: "x", line: 54.5 },
      { label: "W5", x: START.x, y: START.y, z: START.z, axis: "z", line: -84.5 },
    ];
    const LEG_MS = 75000, RECENTRE_MS = 12000, CORR = 2.0;
    const t0 = Date.now();
    const legs = [];
    let failed = false;
    const digUses = () => prims.digStepStats().uses;
    const driftOf = (p, wp) => (wp.axis === "z" ? p.z - wp.line : p.x - wp.line);

    async function attempt(wp, ms) {
      const from = bot.entity.position.clone();
      const d0 = Math.hypot(wp.x - from.x, wp.z - from.z);
      const dig0 = digUses();
      const a0 = Date.now();
      const trace = [];
      const iv = setInterval(() => { try { const p = bot.entity.position; trace.push({ t: Date.now() - a0, x: +p.x.toFixed(2), y: +p.y.toFixed(2), z: +p.z.toFixed(2) }); } catch {} }, 400);
      const r = await prims.walkTo(bot, wp.x, wp.y, wp.z, 1.2, ms);
      clearInterval(iv);
      const to = bot.entity.position.clone();
      const d1 = Math.hypot(wp.x - to.x, wp.z - to.z);
      const drift = driftOf(to, wp);
      return {
        ok: !!r.ok, error: r.ok ? null : (r.error || "walkTo failed"),
        ms: Date.now() - a0, from: fmt(from), to: fmt(to),
        distBeforeXZ: +d0.toFixed(2), distAfterXZ: +d1.toFixed(2),
        progressXZ: +(d0 - d1).toFixed(2),
        drift: +drift.toFixed(2),
        corridorBreach: Math.abs(drift) > CORR,
        digUses: digUses() - dig0, trace,
        wedge: r.wedge ? { cycles: r.wedge.cycles, log: r.wedge.log } : null,
        arbiter: r.arbiter ? { grants: r.arbiter.grants, log: r.arbiter.log } : null,
      };
    }

    // ── SETTLE BEAT (helm v3.6 harness rule, declared 2026-11-07) ──
    async function settleBeat(tag) {
      const s0 = Date.now();
      let stableSince = null, settled = false;
      while (Date.now() - s0 < 8000) {
        const e = bot.entity, v = e.velocity;
        if (e.onGround && Math.hypot(v.x, v.z) < 0.03 && Math.abs(v.y) < 0.15) {
          if (stableSince === null) stableSince = Date.now();
          if (Date.now() - stableSince >= 1000) { settled = true; break; }
        } else stableSince = null;
        await sleep(100);
      }
      const rec = { tag, settled, ms: Date.now() - s0, at: fmt(bot.entity.position), onGround: !!bot.entity.onGround };
      OUT.settles.push(rec);
      console.log("[TRAV5] settle", JSON.stringify(rec));
      return rec;
    }

    async function leg(wp) {
      const rec = { label: wp.label, target: { x: wp.x, y: wp.y, z: wp.z }, axis: wp.axis, line: wp.line, attempts: [] };
      rec.settlePre = await settleBeat(wp.label + ":pre");
      let a = await attempt(wp, LEG_MS);
      rec.attempts.push(a);
      if (!(a.ok && !a.corridorBreach)) {
        rec.settleRetry = await settleBeat(wp.label + ":retry");
        if (a.corridorBreach) {
          const p = bot.entity.position;
          const rcTarget = wp.axis === "z" ? { x: p.x, y: wp.y, z: wp.line, axis: wp.axis, line: wp.line } : { x: wp.line, y: wp.y, z: p.z, axis: wp.axis, line: wp.line };
          rec.recentre = await attempt(rcTarget, RECENTRE_MS);
        }
        const b = await attempt(wp, LEG_MS);
        rec.attempts.push(b);
        a = b;
      }
      rec.ok = !!(a.ok && !a.corridorBreach);
      legs.push(rec);
      console.log("[TRAV5] leg", wp.label, "ok=" + rec.ok, "attempts=" + rec.attempts.length, "end=" + JSON.stringify(a.to), "digUses=" + rec.attempts.reduce((s, t) => s + t.digUses, 0));
      if (!rec.ok) failed = true;
      return rec.ok;
    }

    prims.setDigStep(true);
    try {
      OUT.stageSettle = await settleBeat("stage");
      const start = bot.entity.position.clone();
      OUT.traverseStart = fmt(start);
      for (const wp of EAST) {
        if (Date.now() - t0 > 1800000) { failed = true; break; }
        await leg(wp);
        if (failed) break;
      }
      const mid = bot.entity.position.clone();
      if (!failed) {
        for (const wp of WEST) {
          if (Date.now() - t0 > 1800000) { failed = true; break; }
          await leg(wp);
          if (failed) break;
        }
      }
      OUT.endSettle = await settleBeat("end");
      const end = bot.entity.position.clone();
      const dig = prims.digStepStats();
      const homeDist = Math.hypot(end.x - start.x, end.z - start.z);
      const pass = !failed && homeDist <= 1.6;
      OUT.traverse = {
        legs, mid: fmt(mid), end: fmt(end),
        outDistXZ: +Math.hypot(mid.x - start.x, mid.z - start.z).toFixed(2),
        homeDistXZ: +homeDist.toFixed(2),
        elapsedMs: Date.now() - t0,
        digStep: { uses: dig.uses, log: dig.log }, pass,
      };
      OUT.health = bot.health;
      OUT.verdict = pass ? "ROUTE BODY-VERIFIED — the bent gate-latitude path crossed out and back by a walking body (helm v3.6, settle beat at every leg boundary)" : "TRAVERSE FAIL — see legs for the wall";
      console.log("[TRAV5] traverse pass", pass, "homeDist", homeDist.toFixed(2), "digUses", dig.uses, "deaths", OUT.deaths);
    } finally {
      prims.setDigStep(false);
    }
  } catch (e) {
    OUT.exception = String((e && e.stack) || e);
    console.log("[TRAV5] EXCEPTION", OUT.exception);
  }
  try { fs.writeFileSync(OUT_PATH, JSON.stringify(OUT, null, 1)); } catch {}
  console.log("[TRAV5] DONE");
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[TRAV5] error", e.message));
bot.on("kicked", (r) => console.log("[TRAV5] kicked", String(r)));
setTimeout(() => { console.log("[TRAV5] TIMEOUT"); try { fs.writeFileSync(OUT_PATH, JSON.stringify(OUT, null, 1)); } catch {} process.exit(1); }, 3300000);
