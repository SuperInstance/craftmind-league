"use strict";
// TRAVERSE-VERIFY-4 — operator probe (not a citizen, not curriculum).
// Route traverse-verification for the z=-84 gate line, fourth pass,
// with helm v3.6 and the SETTLE BEAT at every leg boundary.
//
// TRAVERSE-VERIFY-3 OUTCOME (helm v3.5, TraverseG112033): all three
// v3.5 mechanisms fired as designed — the arbiter held single
// ownership, the progress-keyed trigger granted the wedge unmasked
// (stuckFor 3151 ms, windowProg 0.02), every jump was face-keyed
// (0.82-0.99) — and leg E2 still failed, at the same x54 face, one
// level HIGHER: the body froze MID-AIR at (53.69, 68.02..68.25),
// onGround false, feet ~1.25 above the x53 plateau's standing
// level, held at the litter-capped top of the step. Failure
// anatomy, in order: (1) E1 closed with the body still airborne at
// (53.31, 68.17) — E2's walk began inside E1's jump arc, and the
// freeze engaged at the arc's altitude; (2) cycles 1-3 at that
// altitude only bobbed vertically (dispCycle 0.23 each); (3) the
// 1.5 s long backoff let the body fall and slide 4.4 blocks west
// to (49.31, 66), surrendering both climbed steps; (4) the final
// cycle's run-up (dispCycle 4.003, back to (52.91, 67.75)) ended
// 0.75 short of the progress anchor, so the wedge was judged
// EXHAUSTED at its moment of near-success; (5) after exhaustion,
// dig and backoff alternated under the fairness rule with
// digUses 0 — dig's ripeness is permanently true in a hard stall
// and starved the guarded probe.
//
// HELM v3.6 ANSWERS, one per mechanism: (A) at a HIGH freeze
// (gained altitude >= +0.9 over the walk's standing level) the
// wedge runs HOLD-AND-TAP — no back pulse, no long backoff (an
// extended hold instead), short forward taps — so a release never
// spends bought height; (B) wedge exhaustion is judged on
// BEST-IN-SEQUENCE — a final cycle that improved the episode's
// best cycle-end progress (or was still progressing) earns ONE
// extension cycle; (C) THE SETTLE BEAT (this harness): a leg does
// not close, and the next does not open, until the body is
// grounded and stable (onGround, |velocity| ~ 0) for ~1 s, or an
// 8 s timeout records that it never settled — no leg begins
// inside the previous leg's arc; settle outcomes are recorded per
// leg in OUT.settles and on each leg record; (D) a DIG-GRANT CAP
// in the arbiter — at most one dig grant per stall episode unless
// a dig actually executed under dig's last ownership.
//
// Same route discipline as verifies 1-3: gate-walk legs verbatim
// (waypoints 53.5/58.5/63.5/69.5 at z=-83.5, corridor |z+83.5| <= 2,
// one declared dig-step retry per leg, dig-step armed and counted),
// 75 s leg windows, 400 ms trace, wedge + arbiter logs per attempt.
// Judged on displacement only. If this probe crosses E1's step
// pair AND completes the line out and back, the route is
// body-verified and gate re-run 6 may stage; if it wedges, the
// new wall is recorded precisely and NO gate is run. The result
// file is per-probe (traverse-result-<user>.json).
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
const OUT = { user: USER, ts: new Date().toISOString(), helm: "v3.6 (arbiter + hold-tap + best-in-sequence + dig cap; settle beat)", legMs: 75000, nav: [], deaths: 0, health: null, settles: [] };

function columnTop(x, z) {
  let top = null;
  for (let y = 95; y > 45; y--) {
    const b = bot.blockAt(new Vec3(x, y, z));
    if (!b) continue;
    if (b.boundingBox === "block" && !/_leaves$/.test(b.name)) { top = y; break; }
  }
  return top;
}

bot.on("death", () => { OUT.deaths++; console.log("[TRAV] DEATH", OUT.deaths, "at", JSON.stringify(fmt(bot.entity.position))); });

bot.once("spawn", async () => {
  try {
    await sleep(3000);
    for (let i = 0; i < 10 && !bot.entity.onGround; i++) await sleep(1500);
    const sp = bot.entity.position;
    const below = bot.blockAt(sp.offset(0, -1, 0));
    OUT.spawn = { pos: fmt(sp), onGround: !!bot.entity.onGround, below: below ? below.name : null, health: bot.health };
    console.log("[TRAV] spawn", JSON.stringify(OUT.spawn));

    // ── reach the route start (49.5, 67, -83.5) ──
    // The self-powered commute is already on the record as a failure
    // (staging v1/v2, and probe TraverseG132247's nav: helm timeout at
    // the pit lip (37.69,65.79,-94.26) — the trap cell). The traverse
    // measures the ROUTE, not the commute, so with TRAV_STAGE=1 this
    // probe waits at spawn for the declared operator teleport (the
    // same trial apparatus used to stage Cody), then traverses.
    let navOk = false;
    {
      const P0 = bot.entity.position;
      if (Math.hypot(49.5 - P0.x, -83.5 - P0.z) <= 2.5) navOk = true;
    }
    if (!navOk && process.env.TRAV_STAGE === "1") {
      console.log("[TRAV] STAGE-WAIT — holding at spawn for operator teleport to the route start");
      const w0 = Date.now();
      while (Date.now() - w0 < 720000) {
        const P = bot.entity.position;
        if (Math.hypot(49.5 - P.x, -83.5 - P.z) <= 2.5) { navOk = true; break; }
        await sleep(4000);
      }
      OUT.nav.push({ staged: "operator teleport (declared trial apparatus)", waitedMs: Date.now() - w0, at: fmt(bot.entity.position) });
      console.log("[TRAV] stage-wait done, navOk", navOk, "at", JSON.stringify(fmt(bot.entity.position)));
    }
    if (!navOk) {
      // self-powered commute (kept for the record; off by default now)
      const HOPS = [[40, -93], [45, -89], [49.5, -83.5]];
      for (const [hx, hz] of HOPS) {
        const top = columnTop(Math.floor(hx), Math.floor(hz));
        const ty = top !== null ? top + 1 : bot.entity.position.y + 2;
        const from = fmt(bot.entity.position);
        const r = await prims.gotoNear(bot, hx, ty, hz, 2.0, 90000);
        const rec = { hop: [hx, hz], ty, ok: !!r.ok, via: r.via || null, error: r.ok ? null : (r.error || "fail"), from, to: fmt(bot.entity.position) };
        OUT.nav.push(rec);
        console.log("[TRAV] nav", JSON.stringify(rec));
        await sleep(2000);
        if (!r.ok) break;
      }
      const P = bot.entity.position;
      navOk = Math.hypot(49.5 - P.x, -83.5 - P.z) <= 2.5;
    }
    OUT.navOk = navOk;
    console.log("[TRAV] navOk", navOk, "at", JSON.stringify(fmt(bot.entity.position)));
    if (!navOk) {
      OUT.verdict = "NAV-FAIL — probe could not reach the route start; traverse NOT run";
      fs.writeFileSync(OUT_PATH, JSON.stringify(OUT, null, 1));
      console.log("[TRAV] RESULT", JSON.stringify(OUT));
      bot.quit(); process.exit(0);
    }

    // ── the traverse: gate-walk-5's legs, verbatim structure ──
    const LINE_Z = -83.5, CORR = 2.0;
    const TOPS = { 53: 66, 58: 67, 63: 67, 69: 64 };
    const EAST = [53.5, 58.5, 63.5, 69.5].map((x) => ({ x, y: TOPS[Math.floor(x)] + 1, z: LINE_Z }));
    const HOME = { x: 49.5, y: 66, z: LINE_Z };
    const WEST = EAST.slice(0, 3).reverse().concat([HOME]);
    const LEG_MS = 75000, RECENTRE_MS = 12000;
    const t0 = Date.now();
    const legs = [];
    let failed = false;
    const digUses = () => prims.digStepStats().uses;

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
      return {
        ok: !!r.ok, error: r.ok ? null : (r.error || "walkTo failed"),
        ms: Date.now() - a0, from: fmt(from), to: fmt(to),
        distBeforeXZ: +d0.toFixed(2), distAfterXZ: +d1.toFixed(2),
        progressXZ: +(d0 - d1).toFixed(2),
        zDrift: +(to.z - LINE_Z).toFixed(2),
        corridorBreach: Math.abs(to.z - LINE_Z) > CORR,
        digUses: digUses() - dig0, trace,
        wedge: r.wedge ? { cycles: r.wedge.cycles, log: r.wedge.log } : null,
        arbiter: r.arbiter ? { grants: r.arbiter.grants, log: r.arbiter.log } : null,
      };
    }

    // ── SETTLE BEAT (helm v3.6 harness rule, declared 2026-11-07) ──
    // A leg does not close — and the next does not open — until the
    // body is grounded and stable (onGround, |velocity| ~ 0) for a
    // ~1 s beat, or an 8 s timeout records that it never settled.
    // Traverse-verify-3's leg E2 began inside E1's closing jump arc
    // and the freeze engaged at the arc's altitude; no leg may
    // begin inside the previous leg's arc. Outcomes are recorded
    // in OUT.settles and on the leg records.
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
      console.log("[TRAV] settle", JSON.stringify(rec));
      return rec;
    }

    async function leg(label, wp) {
      const rec = { label, target: { x: wp.x, y: wp.y, z: wp.z }, attempts: [] };
      rec.settlePre = await settleBeat(label + ":pre");
      let a = await attempt(wp, LEG_MS);
      rec.attempts.push(a);
      if (!(a.ok && !a.corridorBreach)) {
        rec.settleRetry = await settleBeat(label + ":retry");
        if (a.corridorBreach) {
          const p = bot.entity.position;
          rec.recentre = await attempt({ x: p.x, y: wp.y, z: LINE_Z }, RECENTRE_MS);
        }
        const b = await attempt(wp, LEG_MS);
        rec.attempts.push(b);
        a = b;
      }
      rec.ok = !!(a.ok && !a.corridorBreach);
      legs.push(rec);
      console.log("[TRAV] leg", label, "ok=" + rec.ok, "attempts=" + rec.attempts.length, "end=" + JSON.stringify(a.to), "digUses=" + rec.attempts.reduce((s, t) => s + t.digUses, 0));
      if (!rec.ok) failed = true;
      return rec.ok;
    }

    prims.setDigStep(true);
    try {
      OUT.stageSettle = await settleBeat("stage");
      const start = bot.entity.position.clone();
      OUT.traverseStart = fmt(start);
      for (let i = 0; i < EAST.length && !failed; i++) {
        if (Date.now() - t0 > 1440000) { failed = true; break; }
        await leg("E" + (i + 1), EAST[i]);
      }
      const mid = bot.entity.position.clone();
      for (let i = 0; i < WEST.length && !failed; i++) {
        if (Date.now() - t0 > 1440000) { failed = true; break; }
        await leg("W" + (i + 1), WEST[i]);
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
      OUT.verdict = pass ? "ROUTE BODY-VERIFIED — full z=-84 line crossed east and west by a walking body (helm v3.6, settle beat at every leg boundary)" : "TRAVERSE FAIL — see legs for the wall";
      console.log("[TRAV] traverse pass", pass, "homeDist", homeDist.toFixed(2), "digUses", dig.uses, "deaths", OUT.deaths);
    } finally {
      prims.setDigStep(false);
    }
  } catch (e) {
    OUT.exception = String((e && e.stack) || e);
    console.log("[TRAV] EXCEPTION", OUT.exception);
  }
  try { fs.writeFileSync(OUT_PATH, JSON.stringify(OUT, null, 1)); } catch {}
  console.log("[TRAV] DONE");
  bot.quit();
  process.exit(0);
});
bot.on("error", (e) => console.log("[TRAV] error", e.message));
bot.on("kicked", (r) => console.log("[TRAV] kicked", String(r)));
setTimeout(() => { console.log("[TRAV] TIMEOUT"); try { fs.writeFileSync(OUT_PATH, JSON.stringify(OUT, null, 1)); } catch {} process.exit(1); }, 2700000);
