"use strict";
// driver.js — Litter Lab travel driver.
//
// gotoWatched, rawDrive and unstickToward are VERBATIM copies from
// lineage-c/executors.js (Lineage C's substrate, as deployed 2026-11-07).
// gotoPos is lineage-c's gotoPos with exactly two surgical differences,
// both at the single branch where a hop ends without >=0.8 blocks of
// progress:
//   - mode "A" (status quo): counters.stallBreaker++ and the original
//     unstickToward call — behaviour identical to Lineage C tonight.
//   - mode "B" (candidate): counters.replans++ and NO manual unsticking;
//     the loop simply re-issues the hop (fresh A* on current state).
// Every other line — hop size, watchdog, budgets, stall accounting —
// is identical between the arms, so the experiment isolates the
// {Movements config + stall-breaker} package as the single variable.
const NM = "/home/caseydigennaro/craftmind-league/lineage-c/node_modules";
const { goals } = require(NM + "/mineflayer-pathfinder");
const Vec3 = require(NM + "/vec3");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const v3 = (x, y, z) => new Vec3(Math.floor(x), Math.floor(y), Math.floor(z));

function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new Error(label + " timed out after " + ms + "ms")), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

// === VERBATIM from lineage-c/executors.js ===
async function gotoWatched(bot, goal, budgetMs) {
  let settled = null;
  const gotoPromise = bot.pathfinder.goto(goal)
    .then(() => { settled = "reached"; })
    .catch((e) => { settled = "err:" + (e && e.message); });
  const t0 = Date.now();
  let lastPos = bot.entity.position.clone();
  let lastMoveAt = Date.now();
  while (!settled && Date.now() - t0 < budgetMs) {
    await sleep(500);
    const p = bot.entity.position;
    if (p.distanceTo(lastPos) > 0.05) { lastPos = p.clone(); lastMoveAt = Date.now(); }
    if (Date.now() - lastMoveAt >= 12000) { settled = "no-movement"; break; }
  }
  if (!settled) settled = "timeout";
  if (settled !== "reached") { try { bot.pathfinder.setGoal(null); } catch {} }
  await gotoPromise.catch(() => {});
  return settled;
}

// === VERBATIM from lineage-c/executors.js ===
async function rawDrive(bot, ux, uz, ms, jump) {
  const s = bot.entity.position.clone();
  await bot.lookAt(s.offset(ux * 6, 0, uz * 6), true);
  await sleep(60);
  if (jump) bot.setControlState("jump", true);
  bot.setControlState("forward", true);
  await sleep(ms);
  try { bot.clearControlStates(); } catch {}
  await sleep(150);
  return bot.entity.position.distanceTo(s);
}

// === VERBATIM from lineage-c/executors.js ===
async function unstickToward(bot, tx, tz) {
  const p0 = bot.entity.position.clone();
  const dx = tx - p0.x, dz = tz - p0.z;
  const h = Math.hypot(dx, dz);
  if (h < 0.5) return 0;
  const ux = dx / h, uz = dz / h;
  await rawDrive(bot, -ux, -uz, 380, false); // back off the face
  await rawDrive(bot, ux, uz, 1100, true); // run-up jump toward the goal
  if (bot.entity.position.distanceTo(p0) >= 0.4) return bot.entity.position.distanceTo(p0);
  const q = bot.entity.position;
  const fx = Math.floor(q.x + ux * 0.9), fz = Math.floor(q.z + uz * 0.9), fy = Math.floor(q.y);
  const perpCells = new Set();
  if (Math.abs(ux) > Math.abs(uz)) { perpCells.add(Math.floor(q.z - 0.3)); perpCells.add(Math.floor(q.z + 0.3)); }
  else { perpCells.add(Math.floor(q.x - 0.3)); perpCells.add(Math.floor(q.x + 0.3)); }
  for (const pc of perpCells) {
    for (const yy of [fy, fy + 1]) {
      const cell = Math.abs(ux) > Math.abs(uz) ? v3(fx, yy, pc) : v3(pc, yy, fz);
      const b = bot.blockAt(cell);
      if (b && (b.boundingBox === "block" || b.name === "leaf_litter")) {
        try { await withTimeout(bot.dig(b), 6000, "dig-face"); } catch { try { bot.stopDigging(); } catch {} }
      }
    }
  }
  await rawDrive(bot, -ux, -uz, 300, false);
  await rawDrive(bot, ux, uz, 1100, true);
  return bot.entity.position.distanceTo(p0);
}

// lineage-c gotoPos, with the single mode branch described in the header.
async function gotoPos(bot, x, y, z, opts = {}) {
  const range = opts.range != null ? opts.range : 1;
  const timeoutMs = opts.timeoutMs != null ? opts.timeoutMs : 90000;
  const mode = opts.mode || "A";
  const counters = opts.counters || { stallBreaker: 0, replans: 0 };
  const deadline = Date.now() + timeoutMs;
  let lastDist = Infinity, stalls = 0, hops = 0;
  while (Date.now() < deadline && hops < 40) {
    const me = bot.entity.position;
    const dx = x - me.x, dz = z - me.z;
    const horiz = Math.hypot(dx, dz);
    if (horiz <= range + 0.6 && Math.abs(y - me.y) <= 2.5) return bot.entity.position;
    if (horiz > lastDist - 0.5) { if (++stalls >= 2) break; } else stalls = 0;
    lastDist = horiz;
    hops++;
    const step = Math.min(horiz, 6);
    const finalHop = step >= horiz - 0.01;
    const hopTx = finalHop ? x : me.x + (dx / horiz) * step;
    const hopTz = finalHop ? z : me.z + (dz / horiz) * step;
    const goal = finalHop
      ? new goals.GoalNear(x, y, z, range)
      : new goals.GoalNear(hopTx, me.y, hopTz, 1.5);
    try { bot.pathfinder.setGoal(null); } catch {}
    const remain = Math.max(4000, deadline - Date.now());
    const res = await gotoWatched(bot, goal, Math.min(remain, finalHop ? 45000 : 25000));
    if (res === "no-movement") { if (++stalls >= 2) break; }
    const nowD = Math.hypot(x - bot.entity.position.x, z - bot.entity.position.z);
    if (res !== "reached" && nowD > horiz - 0.8) {
      if (mode === "A") {
        counters.stallBreaker++;
        await unstickToward(bot, hopTx, hopTz).catch(() => {});
      } else {
        counters.replans++;
      }
    }
  }
  return bot.entity.position;
}

module.exports = { gotoPos, gotoWatched, rawDrive, unstickToward, sleep };
