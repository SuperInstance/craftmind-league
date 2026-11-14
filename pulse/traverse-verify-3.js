"use strict";
// TRAVERSE-VERIFY-3 — operator probe (not a citizen, not curriculum).
// Route traverse-verification for the z=-84 gate line, third pass:
// the first verification (helm v3.3, traverse-result-g131742.json)
// walked 2.2 blocks at full speed and wedged at the route's FIRST
// +1 (the x52 face) in the frozen-fall correction-stream signature
// for the full 25 s of both attempts — every v3.3 recovery was
// onGround-gated or too slow for a 25 s leg. This probe walks the
// full line with helm v3.5 (stall ARBITER: exactly one recovery
// owns a stall at a time; PROGRESS-KEYED trigger — distance-to-
// target, which oscillation cannot fake; FACE-KEYED jump timing —
// the jump starts when the scanned face is ~0.8-1.0 blocks ahead)
// and gate-walk-7's leg structure —
// same waypoints and corridor, one declared dig-step retry per leg,
// dig-step armed and counted — with 75 s leg windows so the
// stream's release schedule fits inside the leg. Every attempt
// records its wedge-release log (the protocol working or failing,
// per cycle) alongside the 400 ms trace. Judged on displacement
// only. If this probe crosses E1's step pair AND completes the
// line, the route is body-verified and gate re-run 6 may stage; if
// it wedges somewhere, the new wall is recorded precisely and NO
// gate is run. The result file is per-probe (traverse-result-<user>
// .json) — the first verification's shared-file overwrite is not
// repeated.
//
// TRAVERSE-VERIFY-2 OUTCOME (helm v3.4, TraverseG120241): the
// wedge-release proved itself on its designed target — leg E1,
// frozen at traverse-1's exact cell, freed by ONE release-first
// cycle and both +1s climbed. The wall moved to leg E2's x54 face:
// two full 75 s attempts face-planted at (53.69, 67, -83.5). Two
// measured mechanisms: (1) the v3.3 backoff's limit oscillation
// (~2.7-block excursions, 7-10 s period) kept 3 s net displacement
// >= 0.3 and silenced the displacement-keyed wedge trigger for
// ~65 s of both attempts — the recoveries duelled; (2) the
// jump-hold's apex landed ~1.5 blocks west of the face, so the
// body arrived back at feet level. Helm v3.5 (this run) answers
// both by construction: single stall ownership, a progress-keyed
// trigger, and face-keyed jump timing. Every attempt records its
// arbiter log (grants/releases) alongside the wedge log.
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
const OUT = { user: USER, ts: new Date().toISOString(), helm: "v3.5 (arbiter)", legMs: 75000, nav: [], deaths: 0, health: null };

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

    async function leg(label, wp) {
      const rec = { label, target: { x: wp.x, y: wp.y, z: wp.z }, attempts: [] };
      let a = await attempt(wp, LEG_MS);
      rec.attempts.push(a);
      if (!(a.ok && !a.corridorBreach)) {
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
      OUT.verdict = pass ? "ROUTE BODY-VERIFIED — full z=-84 line crossed east and west by a walking body (helm v3.5 arbiter)" : "TRAVERSE FAIL — see legs for the wall";
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
