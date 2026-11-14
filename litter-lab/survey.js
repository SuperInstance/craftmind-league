"use strict";
// survey.js — Litter Lab step 1: measure >=20 leaf_litter cells in the
// spawn forest. Per cell: floor block, segment_amount (live block
// state), perch height (bot physically stands on the pile), and a
// pass/hold test (hold forward 2.5 s from clean ground, no jump).
// Output: results/survey.jsonl (one JSON object per measured cell)
// plus human progress lines on stdout.
//
// COMMUTING CONFIG: the survey bot travels between cells with the
// CANDIDATE (arm B) Movements + replan driver. Field experience
// (2026-11-07 night) showed the status-quo stack makes only ~1-6
// blocks per 2-minute budget in the rough mid-field band, which
// starved sampling entirely. This does not contaminate the
// measurements: the pass/hold and step-on tests are raw control-state
// manoeuvres from a verified standstill in a verified air approach
// cell, and the test cell's litter is re-verified present immediately
// before each test (a cell dug during commuting is recorded as
// destroyed-before-test and skipped). How the bot commutes is not
// part of what a cell measures.
//
// V5 APPROACH FIX (2026-11-07 night, after v4 measured 0 cells): in
// dense litter the approach cell itself is usually litter too, so
// v4's "approach cell must be air" filter rejected every side and
// the bot never moved. v5 prepares the approach cell instead: travel
// near it with the arm-A driver (stall-breaker equipped; B wedged
// permanently at faces), home raw, then DIG the approach cell's own
// litter (never the test cell's) to make the clean ground the test
// definition wants. The test cell is re-verified untouched before
// the pass/hold test runs.
const fs = require("fs");
const path = require("path");
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const mineflayer = require(NM + "/mineflayer");
const { pathfinder } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3");
const { gotoPos, rawDrive, sleep } = require("./driver");
const { makeLitterMovements } = require("./movements");

const USER = process.env.LITTER_USER;
if (!USER) { console.log("no LITTER_USER"); process.exit(2); }
const OUT = path.join(__dirname, "results", "survey.jsonl");
fs.mkdirSync(path.dirname(OUT), { recursive: true });

// Citizen areas to stay out of (x, z), >=12 blocks horizontal.
const EXCLUSIONS = [
  [46, -83], [24, -111], [29, -104], [46, -101], [63, -72], [5, -85], [-16, -78],
];
const nearExclusion = (x, z, r) => EXCLUSIONS.some(([ex, ez]) => Math.hypot(x - ex, z - ez) < r);

const bot = mineflayer.createBot({ host: "192.168.0.50", port: 25565, username: USER, auth: "offline" });
bot.loadPlugin(pathfinder);

let spawnPos = null;
let deaths = 0;
bot.on("death", () => { deaths++; console.log("[SURVEY] death #" + deaths + " — will re-descend and continue"); });
bot.on("error", (e) => console.log("[SURVEY] bot error", e && e.message));
bot.on("kicked", (r) => console.log("[SURVEY] kicked", r));

function logCell(obj) {
  fs.appendFileSync(OUT, JSON.stringify(obj) + "\n");
  console.log("[CELL]", JSON.stringify(obj));
}
const fmt = (p) => p.x.toFixed(2) + "," + p.y.toFixed(2) + "," + p.z.toFixed(2);

function isPhysical(b) { return b && b.boundingBox === "block"; }

// Find a ground column (top block grass/dirt/stone, air above) within
// radius r of the bot, preferring one BELOW the bot if it is in canopy.
function findGroundColumn(r) {
  const p = bot.entity.position;
  let best = null;
  for (let dx = -r; dx <= r; dx++) {
    for (let dz = -r; dz <= r; dz++) {
      const cx = Math.floor(p.x) + dx, cz = Math.floor(p.z) + dz;
      for (let y = Math.min(90, Math.floor(p.y) + 8); y >= Math.floor(p.y) - 26; y--) {
        const b = bot.blockAt(new Vec3(cx, y, cz));
        if (!b) break;
        if (isPhysical(b)) {
          if (["grass_block", "dirt", "stone"].includes(b.name)) {
            const d = Math.hypot(dx, dz);
            const score = d + Math.max(0, (p.y - (y + 1))) * 0.1;
            if (!best || score < best.score) best = { x: cx + 0.5, y: y + 1, z: cz + 0.5, score };
          }
          break; // topmost physical block of this column only
        }
      }
    }
  }
  return best;
}

async function descendToGround() {
  for (let attempt = 0; attempt < 3; attempt++) {
    const p = bot.entity.position;
    const below = bot.blockAt(new Vec3(Math.floor(p.x), Math.floor(p.y) - 1, Math.floor(p.z)));
    const col = findGroundColumn(14);
    if (!col) { console.log("[SURVEY] no ground column found nearby"); return false; }
    const dropNeeded = p.y - col.y;
    if (below && ["grass_block", "dirt", "stone"].includes(below.name) && dropNeeded <= 2.5) {
      console.log("[SURVEY] on ground at", fmt(p), "standing on", below.name);
      return true;
    }
    console.log("[SURVEY] descending toward ground column", col.x, col.y, col.z, "from", fmt(p));
    await gotoPos(bot, col.x, col.y, col.z, { range: 1.2, timeoutMs: 90000, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
    await sleep(600);
  }
  return true;
}

const yawFor = (dx, dz) => Math.atan2(-dx, dz);

// Raw final approach (diag2 finding, 2026-11-07 night): the
// pathfinder follow loop is the weak layer in this terrain — it
// wedges at faces for tens of seconds — while raw control-state
// drives with directly-set yaw move cleanly. So the pathfinder only
// has to get the bot NEAR the stand point; homing pulses finish.
async function rawFinalApproach(sx, sz) {
  for (let i = 0; i < 9; i++) {
    const p = bot.entity.position;
    const dx = sx - p.x, dz = sz - p.z;
    const d = Math.hypot(dx, dz);
    if (d <= 0.35) return true;
    await bot.look(yawFor(dx, dz), 0, true);
    if (i === 4 && d > 0.6) bot.setControlState("jump", true); // one step-up pulse mid-homing
    bot.setControlState("forward", true);
    await sleep(Math.min(450, Math.max(150, d * 140)));
    bot.setControlState("forward", false);
    bot.setControlState("jump", false);
    await sleep(130);
  }
  const p = bot.entity.position;
  return Math.hypot(sx - p.x, sz - p.z) <= 0.6;
}

async function measureCell(cellPos) {
  const litterId = bot.registry.blocksByName.leaf_litter.id;
  const b = bot.blockAt(cellPos);
  if (!b || b.name !== "leaf_litter") return null;
  const floor = bot.blockAt(cellPos.offset(0, -1, 0));
  if (!isPhysical(floor)) return null;
  let props = {};
  try { props = b.getProperties() || {}; } catch {}
  const seg = props.segment_amount != null ? String(props.segment_amount) : null;
  const floorTop = cellPos.y; // litter block sits directly on the floor; its y IS the floor top

  // Choose an approach side: cardinal neighbour cell at litter level
  // whose own cell is air and whose floor is physical.
  const sides = [
    { dx: 1, dz: 0 }, { dx: -1, dz: 0 }, { dx: 0, dz: 1 }, { dx: 0, dz: -1 },
  ];
  const me = bot.entity.position;
  sides.sort((s1, s2) => {
    const d1 = Math.hypot(cellPos.x - s1.dx - me.x, cellPos.z - s1.dz - me.z);
    const d2 = Math.hypot(cellPos.x - s2.dx - me.x, cellPos.z - s2.dz - me.z);
    return d1 - d2;
  });
  let approached = false, dir = null;
  for (const s of sides) {
    const aPos = cellPos.offset(-s.dx, 0, -s.dz); // approach cell (feet level)
    const aBlock = bot.blockAt(aPos);
    const aFloor = bot.blockAt(aPos.offset(0, -1, 0));
    // Approach floor must be physical and at the SAME ground level as
    // the test cell's floor, and the approach cell itself must be air
    // or litter (litter we may dig away to make clean ground — v5).
    // (A one-step-below approach was considered and rejected: the bot
    // would face the test cell's FLOOR block, not its litter, so the
    // pass test would measure the terrain step, not the pile.)
    if (!aBlock || (aBlock.name !== "air" && aBlock.name !== "leaf_litter")) continue;
    if (!isPhysical(aFloor) || aFloor.position.y !== cellPos.y - 1) continue;
    // Stand point: centre of approach cell pushed 0.30 away from the litter cell.
    const sx = aPos.x + 0.5 - s.dx * 0.30, sz = aPos.z + 0.5 - s.dz * 0.30;
    // Loose pathfinder arrival near the approach cell (arm A driver:
    // its stall-breaker unwedges faces that strand arm B), then raw homing.
    await gotoPos(bot, aPos.x + 0.5, aPos.y, aPos.z + 0.5, { range: 2.2, timeoutMs: 60000, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
    await sleep(250);
    if (Math.abs(bot.entity.position.y - aPos.y) > 1.6) continue;
    if (!await rawFinalApproach(sx, sz)) { await sleep(250); continue; }
    // Prepare clean ground: dig the APPROACH cell's litter if present.
    const ab2 = bot.blockAt(aPos);
    if (ab2 && ab2.name === "leaf_litter") {
      try {
        await Promise.race([
          bot.dig(ab2),
          sleep(6000).then(() => { try { bot.stopDigging(); } catch {} throw new Error("dig timeout"); }),
        ]);
      } catch {}
      await sleep(200);
      const ab3 = bot.blockAt(aPos);
      if (!ab3 || ab3.name !== "air") continue;
      if (!await rawFinalApproach(sx, sz)) continue; // settle onto the cleared ground
    }
    approached = true; dir = s; break;
  }
  if (!approached) {
    console.log("[SURVEY] approach failed for cell", cellPos.x, cellPos.y, cellPos.z, "bot at", fmt(bot.entity.position));
    return { cell: [cellPos.x, cellPos.y, cellPos.z], seg, outcome: "unreachable-for-test" };
  }
  // Litter may have been dug by our own approach (stall-breaker).
  const b2 = bot.blockAt(cellPos);
  if (!b2 || b2.name !== "leaf_litter") return { cell: [cellPos.x, cellPos.y, cellPos.z], seg, outcome: "destroyed-before-test" };

  // Fine alignment: face the cell centre with directly-set yaw.
  await bot.look(yawFor(dir.dx, dir.dz), 0, true);
  await sleep(120);

  // PASS/HOLD TEST: hold forward 2.5 s, no jump.
  const start = bot.entity.position.clone();
  const samples = [];
  bot.setControlState("forward", true);
  const t0 = Date.now();
  while (Date.now() - t0 < 2500) { samples.push(bot.entity.position.clone()); await sleep(100); }
  bot.setControlState("forward", false);
  await sleep(400);
  const end = bot.entity.position.clone();
  const sStart = (start.x - (cellPos.x + 0.5)) * dir.dx + (start.z - (cellPos.z + 0.5)) * dir.dz;
  const sEnd = (end.x - (cellPos.x + 0.5)) * dir.dx + (end.z - (cellPos.z + 0.5)) * dir.dz;
  const lat = Math.abs((end.x - (cellPos.x + 0.5)) * dir.dz - (end.z - (cellPos.z + 0.5)) * dir.dx);
  const disp = Math.hypot(end.x - start.x, end.z - start.z);
  let maxPerch = null;
  for (const sm of samples) {
    const ss = (sm.x - (cellPos.x + 0.5)) * dir.dx + (sm.z - (cellPos.z + 0.5)) * dir.dz;
    const ll = Math.abs((sm.x - (cellPos.x + 0.5)) * dir.dz - (sm.z - (cellPos.z + 0.5)) * dir.dx);
    if (Math.abs(ss) <= 0.55 && ll <= 0.55) { const h = sm.y - floorTop; if (maxPerch === null || h > maxPerch) maxPerch = h; }
  }
  let outcome, perch = null;
  if (sEnd > 0.55) outcome = "crossed";
  else if (Math.abs(sEnd) <= 0.55 && lat <= 0.55 && end.y - floorTop > 0.04) { outcome = "perched"; perch = +(end.y - floorTop).toFixed(3); }
  else if (sEnd - sStart < 0.45) outcome = "face-stopped";
  else outcome = "partial";
  if (perch === null && maxPerch !== null && maxPerch > 0.04) perch = +maxPerch.toFixed(3);

  // STEP-ON TEST (only if not crossed): back off, run-up jump onto the pile.
  let stepOn = null;
  if (outcome !== "crossed") {
    await rawDrive(bot, -dir.dx, -dir.dz, 450, false);
    await rawDrive(bot, dir.dx, dir.dz, 1100, true);
    await sleep(800);
    const q = bot.entity.position;
    const sq = (q.x - (cellPos.x + 0.5)) * dir.dx + (q.z - (cellPos.z + 0.5)) * dir.dz;
    const lq = Math.abs((q.x - (cellPos.x + 0.5)) * dir.dz - (q.z - (cellPos.z + 0.5)) * dir.dx);
    if (Math.abs(sq) <= 0.55 && lq <= 0.55 && q.y - floorTop > 0.02) { stepOn = +(q.y - floorTop).toFixed(3); if (perch === null) perch = stepOn; }
    else if (sq > 0.55) stepOn = "cleared-with-jump";
    else stepOn = "no-land";
  }

  const rec = {
    cell: [cellPos.x, cellPos.y, cellPos.z],
    floor: floor.name,
    seg,
    facing: props.facing != null ? String(props.facing) : null,
    stateId: b.stateId,
    passOutcome: outcome,
    passDisp: +disp.toFixed(2),
    sStart: +sStart.toFixed(2),
    perch,
    stepOn,
    timeOfDay: bot.time ? bot.time.timeOfDay : null,
  };
  logCell(rec);
  return rec;
}

// Travel with wedge detection: if a gotoPos call nets <0.5 blocks and
// we are still far from the target, this probe is wedged in geometry
// the status-quo driver cannot leave (e.g. a 1x1 pit: no towering, no
// run-up room). Probes are disposable — exit with code 5 and let the
// supervisor relaunch under a fresh name (fresh spawn scatter).
async function travelTo(x, y, z, timeoutMs) {
  const s = bot.entity.position.clone();
  // Arm-A driver branch for all survey logistics (v5 note): the
  // replan-only branch wedges permanently at ordinary step faces;
  // the stall-breaker is the unwedging tool. Measurements unaffected.
  await gotoPos(bot, x, y, z, { range: 1.5, timeoutMs, mode: "A", counters: { stallBreaker: 0, replans: 0 } });
  const net = Math.hypot(bot.entity.position.x - s.x, bot.entity.position.z - s.z);
  const remain = Math.hypot(bot.entity.position.x - x, bot.entity.position.z - z);
  if (net < 0.5 && remain > 8) {
    console.log("[SURVEY] WEDGED at", fmt(bot.entity.position), "net", net.toFixed(2), "— exiting for supervisor relaunch");
    process.exit(5);
  }
  return remain;
}

async function main() {
  await new Promise((res) => bot.once("spawn", res));
  spawnPos = bot.entity.position.clone();
  console.log("[SURVEY] spawned as", USER, "at", fmt(spawnPos), "timeOfDay", bot.time.timeOfDay);
  bot.pathfinder.setMovements(makeLitterMovements(bot));
  await sleep(2500);
  await descendToGround();
  // V7 (2026-11-07 night): the west-field pilgrimage is GONE. It cost
  // ~4 minutes and several deaths per launch, and measuring has since
  // succeeded both in the west field and in the near-spawn field.
  // The main loop now measures wherever the bot lands and relocates
  // itself (10-block hops toward the west strip) only when the local
  // candidate pool runs dry.

  const litterId = bot.registry.blocksByName.leaf_litter.id;
  const measured = new Set();
  let results = 0, tried = 0;
  // Resume: a supervisor relaunch (wedge recovery) keeps prior cells.
  if (fs.existsSync(OUT)) {
    for (const line of fs.readFileSync(OUT, "utf8").split("\n")) {
      if (!line.trim()) continue;
      try {
        const o = JSON.parse(line);
        if (o.cell) measured.add(o.cell[0] + "," + o.cell[1] + "," + o.cell[2]);
        if (o.passOutcome) results++;
      } catch {}
    }
    console.log("[SURVEY] resumed with", results, "measured cells already on file");
  }
  const deadline = Date.now() + 30 * 60 * 1000;
  let stuckCount = 0;
  let handledDeaths = 0;
  while (results < 20 && Date.now() < deadline) {
    if (deaths > 0 && bot.entity && bot.entity.position && bot.entity.position.y > 74) {
      await sleep(2000); await descendToGround();
    }
    // V8 (2026-11-07 night): DEATH = COMMUTE WEST. The server log
    // shows why probes die in spirals at spawn: Drowned and Zombies
    // camp the spawn forest (slain-by lines, ~30 s apart, launch
    // after launch). Respawn drops the bot back into the same kill
    // zone. So on every death, before measuring anything else, the
    // bot commutes to the west field (0,-97) — the area where the
    // LitterLab9868 launch measured 4 cells with a single death.
    // A launch that dies >6 times exits for a fresh-name relaunch.
    if (deaths > handledDeaths) {
      handledDeaths = deaths;
      if (deaths > 6) {
        console.log("[SURVEY] death budget spent (" + deaths + ") — exiting for supervisor relaunch");
        process.exit(6);
      }
      console.log("[SURVEY] death #" + deaths + " — commuting west before resuming");
      await sleep(1500);
      await descendToGround();
      const col = findGroundColumn(6);
      await travelTo(0.5, col ? col.y : bot.entity.position.y, -96.5, 180000);
      await descendToGround();
    }
    const found = bot.findBlocks({ matching: [litterId], maxDistance: 48, count: 200 });
    // Approachability pre-filter (v6): a cell is only worth an attempt
    // if some neighbour offers a same-level stand (physical floor at
    // cell.y-1, feet cell air or diggable litter). Unapproachable
    // cells are skipped silently instead of burning minutes each on
    // approaches that geometry forbids.
    const approachable = (pos) => {
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const feet = bot.blockAt(new Vec3(pos.x + dx, pos.y, pos.z + dz));
        const fl = bot.blockAt(new Vec3(pos.x + dx, pos.y - 1, pos.z + dz));
        if (feet && (feet.name === "air" || feet.name === "leaf_litter") && isPhysical(fl)) return true;
      }
      return false;
    };
    const candidates = found.filter((pos) => {
      const key = pos.x + "," + pos.y + "," + pos.z;
      if (measured.has(key)) return false;
      if (nearExclusion(pos.x, pos.z, 13)) return false;
      if (spawnPos && Math.hypot(pos.x - spawnPos.x, pos.z - spawnPos.z) < 10) return false;
      if (!approachable(pos)) return false;
      return true;
    });
    console.log("[SURVEY] at", fmt(bot.entity.position), "litter within 40:", found.length, "candidates:", candidates.length, "measured:", results);
    if (!candidates.length) {
      // Directed relocation: the west strip (x ~0, z ~-112) is forest
      // floor outside every exclusion disc.
      const col = (() => {
        let best = null;
        for (let dx = -10; dx <= 10; dx++) for (let dz = -10; dz <= 10; dz++) {
          const cx = dx, cz = -112 + dz;
          for (let y = 85; y >= 55; y--) {
            const b = bot.blockAt(new Vec3(cx, y, cz));
            if (!b) break;
            if (b.boundingBox === "block") {
              if (["grass_block", "dirt", "stone"].includes(b.name)) {
                const d = Math.hypot(bot.entity.position.x - (cx + 0.5), bot.entity.position.z - (cz + 0.5));
                if (!best || d < best.d) best = { x: cx + 0.5, y: y + 1, z: cz + 0.5, d };
              }
              break;
            }
          }
        }
        return best;
      })();
      const tgt = col || { x: 0.5, y: bot.entity.position.y, z: -111.5 };
      // Short hop toward the strip (one long goto wedges on this
      // terrain; the loop re-issues until we arrive).
      const p0 = bot.entity.position;
      const dx = tgt.x - p0.x, dz = tgt.z - p0.z, dh = Math.hypot(dx, dz);
      const hx = dh > 10 ? p0.x + (dx / dh) * 10 : tgt.x;
      const hz = dh > 10 ? p0.z + (dz / dh) * 10 : tgt.z;
      console.log("[SURVEY] relocating toward west strip via hop", hx.toFixed(1), hz.toFixed(1), "target", JSON.stringify(tgt));
      await travelTo(hx, tgt.y, hz, 120000);
      await sleep(500);
      continue;
    }
    // Prefer cells near the bot's own level: approaches up a 2-step
    // littered rise are the ones that time out, and findBlocks'
    // distance order would burn the whole budget on them first.
    const by = bot.entity.position.y;
    candidates.sort((a, b) => {
      const sa = Math.hypot(a.x - bot.entity.position.x, a.z - bot.entity.position.z) + 4 * Math.max(0, Math.abs(a.y - by) - 1);
      const sb = Math.hypot(b.x - bot.entity.position.x, b.z - bot.entity.position.z) + 4 * Math.max(0, Math.abs(b.y - by) - 1);
      return sa - sb;
    });
    const cellPos = candidates[0];
    measured.add(cellPos.x + "," + cellPos.y + "," + cellPos.z);
    tried++;
    const before = deaths;
    const posBefore = bot.entity.position.clone();
    try {
      const rec = await measureCell(cellPos);
      if (rec && rec.passOutcome) results++;
      else if (rec) logCell(rec);
      // Wedge exit: repeated unreachable verdicts without the bot
      // itself moving means this probe is stranded — hand over to
      // the supervisor for a fresh-name relaunch (fresh spawn scatter).
      const net = Math.hypot(bot.entity.position.x - posBefore.x, bot.entity.position.z - posBefore.z);
      if (rec && !rec.passOutcome && net < 0.2) {
        if (++stuckCount >= 3) {
          console.log("[SURVEY] WEDGED (3 unreachable, net <0.2) at", fmt(bot.entity.position), "— exiting for supervisor relaunch");
          process.exit(5);
        }
      } else stuckCount = 0;
    } catch (e) { console.log("[SURVEY] measure error", e.message); }
    if (deaths > before) { await sleep(3000); await descendToGround(); }
    await sleep(300);
  }
  console.log("[SURVEY] DONE measured=" + results + " tried=" + tried + " deaths=" + deaths);
  bot.quit();
  process.exit(0);
}

main().catch((e) => { console.log("[SURVEY] FATAL", e && e.stack || e); process.exit(1); });
setTimeout(() => { console.log("[SURVEY] GLOBAL TIMEOUT"); process.exit(3); }, 35 * 60 * 1000);
