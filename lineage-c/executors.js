// executors.js — Lineage C's CLOSED vocabulary of structured actions.
//
// This is the whole GITM point: the body provably knows how to do exactly
// these things, and the minds may only ever compose these. No code generation
// happens anywhere in Lineage C — not here, not in the minds. Every executor
// returns { ok, evidence } where the evidence is measured from world state
// (inventory deltas, block reads, entity positions), never from intention.
//
// Vocabulary (the planner's JSON uses exactly these names):
//   goto          {place:"anchor"|"spawn"|"shelter"} | {x,y,z} | {block:"<name>"} | {entity:"<playerName>"}
//   collect       {block:"<name>"|"log"|"stone", count:n}
//   craft         {item:"<name>", count:n}         one recipe step, n operations
//   equip         {item:"<name>"}
//   place         {item:"<name>", x,y,z} | {item:"<name>", near:"self"}
//   store         {item:"<name>", count:n}          into nearest chest (or given x,y,z)
//   eat           {}
//   shelter-enter {}
//   shelter-exit  {}
//   flee          {}
//   attack-nearest{}
//   wait          {seconds:n}
//   say           {text:"..."}
const { goals } = require("mineflayer-pathfinder");
const Vec3 = require("vec3");

const LOGS = ["oak_log", "spruce_log", "birch_log", "jungle_log", "acacia_log", "dark_oak_log"];
const HOSTILES = ["zombie", "skeleton", "spider", "cave_spider", "creeper", "enderman", "witch", "pillager", "vindicator", "drowned", "husk", "stray", "phantom", "slime", "magma_cube", "blaze", "ghast", "zombie_villager", "spider_jockey"];
const FOODS = ["cooked_beef", "cooked_porkchop", "cooked_mutton", "cooked_chicken", "cooked_cod", "cooked_salmon", "bread", "apple", "baked_potato", "carrot", "cooked_rabbit", "beef", "porkchop", "mutton", "chicken", "melon_slice", "sweet_berries", "golden_carrot"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const v3 = (x, y, z) => new Vec3(Math.floor(x), Math.floor(y), Math.floor(z));

function inventory(bot) {
  const out = {};
  for (const it of bot.inventory.items()) out[it.name] = (out[it.name] || 0) + it.count;
  return out;
}
const count = (bot, name) => inventory(bot)[name] || 0;
const has = (bot, name) => count(bot, name) > 0;

function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new Error(label + " timed out after " + ms + "ms")), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

// One pathfinder goto under a movement watchdog. Resolves "reached" when the
// goto promise settles cleanly, "no-movement" when the body has not displaced
// at all for 12 s (a goto must fail in seconds, not minutes, or the
// deliberation loop can never iterate — the pathfinder follow loop can churn
// in stuck-resets indefinitely at terrain faces; the watchdog is what bounds
// it. 12 s, raised from 6 s on 2026-11-07, tolerates a hand-dig of a step
// block plus settle time now that travel may dig: see README addendum),
// "timeout" at the budget, "err:<msg>" on rejection.
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

// Stall-breaker (substrate, declared 2026-11-07 — see README addendum).
// Measured root cause of the travel stalls: the pathfinder follow loop (and
// raw control alike) starts a 1-block climb from a standstill pressed
// against the step face (centre = face + 0.30), and in this physics a
// standstill jump at the face does not clear it — the follow loop's own
// movement simulations agree, so it sets forward=false and resets "stuck"
// forever. A jump taken WITH a run-up clears the same step (probe GP8:
// backoff 1.9 blocks east, run-up jump west displaced 4.6 blocks and landed
// on top). So when a hop stalls: back off, run up and jump toward the hop
// goal; if still stuck, dig the face blocks at feet/head height in the
// goal direction (a step block or head-high leaves) and run up again. This
// is body plumbing under the closed vocabulary — it adds no action word;
// goto/collect call it exactly as they called gotoPos before.
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
async function unstickToward(bot, tx, tz) {
  const p0 = bot.entity.position.clone();
  const dx = tx - p0.x, dz = tz - p0.z;
  const h = Math.hypot(dx, dz);
  if (h < 0.5) return 0;
  const ux = dx / h, uz = dz / h;
  await rawDrive(bot, -ux, -uz, 380, false); // back off the face
  await rawDrive(bot, ux, uz, 1100, true); // run-up jump toward the goal
  if (bot.entity.position.distanceTo(p0) >= 0.4) return bot.entity.position.distanceTo(p0);
  // Still stuck: clear the face. Dig the feet/head blocks in EVERY front
  // cell the body's AABB spans (it can straddle two cells and be blocked
  // by either). Dig solid blocks (a step block, head-high leaves/log) AND
  // leaf_litter: prismarine-data reports litter shapes=[] (no collision)
  // in every state, but the server measurably face-stops bots at some
  // litter cells (probe GP11: two clean stops at litter-feet cells with a
  // deceleration profile; GP10's stall-breaker dug nothing because it
  // filtered on boundingBox==="block" and the blocker was litter). Digging
  // the litter removes the client/server disagreement. (2026-11-07.)
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

async function gotoPos(bot, x, y, z, range = 1, timeoutMs = 90000) {
  // Travel in hops of <=6 horizontal blocks (was <=14 until 2026-11-07;
  // see README addendum: with travel digging re-enabled, short hops keep
  // every A* local and bounded — the dig-enabled churn the B crew measured
  // was on long hops). Field lessons baked in:
  // (1) idle/flush via setGoal(null), never pathfinder.stop() — stop() sets a
  // flag the next setGoal consumes via path_stop, killing the next goto
  // (Lineage B's root-cause, shared by operator note); (2) a single long A*
  // to a far point can spin hot without moving the bot — short hops keep
  // every search local; (3) every hop runs under the movement watchdog, so a
  // stalled body fails the action in seconds, not minutes.
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
    // stall-breaker: the hop ended without reaching and without real
    // progress toward the target — break the face-plant (see unstickToward)
    // and let the loop retry the hop from a moving start.
    const nowD = Math.hypot(x - bot.entity.position.x, z - bot.entity.position.z);
    if (res !== "reached" && nowD > horiz - 0.8) {
      await unstickToward(bot, hopTx, hopTz).catch(() => {});
    }
  }
  return bot.entity.position;
}

function blockIds(bot, name) {
  const mc = bot.registry || require("minecraft-data")(bot.version);
  if (name === "log") return LOGS.map((n) => mc.blocksByName[n] && mc.blocksByName[n].id).filter((x) => x != null);
  if (name === "stone") { const s = mc.blocksByName["stone"]; return s ? [s.id] : []; }
  const b = mc.blocksByName[name];
  return b ? [b.id] : [];
}

function findBlocks(bot, name, maxDistance = 48, n = 20) {
  const ids = blockIds(bot, name);
  if (!ids.length) return [];
  return bot.findBlocks({ matching: ids, maxDistance, count: n });
}

// Column-base rule (field lesson, 2026-11-07): in this forest the NEAREST
// matching block is often high in a trunk or canopy, and pathing to it
// strands the bot in the branches while the A* churns (root cause of
// Geist's first-day paralysis and most of his HP loss). Group candidates
// by column, keep each column's LOWEST block — a trunk is harvested from
// its base — then order the columns by distance.
function columnBases(positions) {
  const byCol = new Map();
  for (const p of positions) {
    const k = p.x + "," + p.z;
    if (!byCol.has(k) || p.y < byCol.get(k).y) byCol.set(k, p);
  }
  return [...byCol.values()];
}

async function equipItem(bot, name) {
  const it = bot.inventory.items().find((i) => i.name === name);
  if (!it) return false;
  await bot.equip(it, "hand");
  return true;
}

// pick a sensible digging tool already in inventory (executor substrate, not
// deliberation: the vocabulary says "dig this", the hand chooses its tool)
async function equipBestToolFor(bot, blockName) {
  const prefs = blockName.includes("log") || blockName.includes("planks")
    ? ["stone_axe", "wooden_axe"]
    : blockName === "stone" || blockName === "cobblestone" || blockName.includes("ore")
      ? ["stone_pickaxe", "wooden_pickaxe"]
      : [];
  for (const p of prefs) if (has(bot, p)) { await equipItem(bot, p); return p; }
  return "hand";
}

// ---- Spawn protection + stand closure (substrate, 2026-11-07) ----
// Two measured causes sat under every S1 collect failure, and they stack:
// (a) STAND GEOMETRY — goto/collect pathfound to the column base POINT and
// settled wherever the pathfinder gave up (arrival tolerance was horizontal
// range+0.6 with |dy| <= 2.5, plus a stall give-up), so the 3D distance from
// the body to the lowest log block kept landing past dig reach: the tick
// log shows "last distance 6.5" for hours (4.5 in an earlier plan-state).
// The dig was never even attempted from those stands.
// (b) SPAWN PROTECTION — the world spawn is (32, 70, -96) (the level.dat
// spawn pos, read on the Orin 2026-11-07; it matches the spawn-position
// packet the bots receive) and server.properties sets spawn-protection=16:
// inside the square |dx| <= 16 AND |dz| <= 16 around spawn, the server
// silently cancels a non-opped citizen's block-breaks — the dig promise
// resolves, the block stays, the local world model drops it anyway (the
// phantom-dig finding; the descend executor below records the canopy
// case). Geist's recent collecting grounds ((25..38, -85..-93), Chebyshev
// 6..11 from spawn) are INSIDE that square; the oak cluster east of HOME
// ((11,-85), (12,-82), Chebyshev 21/20) is outside it — matching the
// record that digs near HOME took effect.
// So: a column is eligible only if its base cell AND the chosen stand
// cell are both outside the square (+1 margin) — movement is not
// protected, digs are — and collect digs only from a stand cell whose
// arrival VERIFIES (3D distance to the lowest target block <= 4.2
// measured after the pathfind, not assumed before it). Refusals ride in
// the evidence so the planner sees why a column was skipped, and a dig
// that resolves while the cell still holds the same block is counted as
// cancelled (descend's detection, applied here) rather than as dug.
const SPAWN_PROTECT = 16; // server.properties spawn-protection, measured
const SPAWN_MARGIN = 1;
function spawnCentre(bot) {
  const sp = bot && bot.spawnPoint;
  if (sp && typeof sp.x === "number" && typeof sp.z === "number") return { x: Math.floor(sp.x), z: Math.floor(sp.z) };
  return { x: 32, z: -96 }; // level.dat fallback, measured 2026-11-07
}
function protectDist(bot, cell) {
  const c = spawnCentre(bot);
  return Math.max(Math.abs(Math.floor(cell.x) - c.x), Math.abs(Math.floor(cell.z) - c.z));
}
function cellProtected(bot, cell) {
  return protectDist(bot, cell) <= SPAWN_PROTECT + SPAWN_MARGIN;
}
// The 4 horizontal neighbours of the column base cell, best first by
// nominal 3D distance from the stand centre to the lowest log block.
function standOptions(bot, base) {
  const bc = base.offset(0.5, 0.5, 0.5);
  const out = [];
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const cell = v3(base.x + dx, base.y, base.z + dz);
    const centre = new Vec3(cell.x + 0.5, base.y, cell.z + 0.5);
    out.push({ cell, dist: +centre.distanceTo(bc).toFixed(2), protectedCell: cellProtected(bot, cell) });
  }
  out.sort((a, b) => a.dist - b.dist);
  return out;
}
// Column bases filtered by the protection guard, nearest first. Returns
// usable entries {base, stands, protectDist} (stands already filtered to
// unprotected cells) plus the refusals, for the evidence. The block
// budget is 256, not the 24 the pre-guard code used: findBlocks returns
// the NEAREST blocks, and in this forest the nearest two dozen logs are
// all inside the protection square — the first live tick on the guard
// refused 5 columns and saw zero usable ones, because the diggable
// columns never made the cut. The guard is only as good as the search
// that feeds it.
function eligibleColumns(bot, name, refusedKeys) {
  const cols = columnBases(findBlocks(bot, name, 48, 256));
  const me = bot.entity.position;
  cols.sort((a, b) => a.distanceTo(me) - b.distanceTo(me));
  const usable = [], refused = [];
  for (const base of cols) {
    const key = base.x + "," + base.y + "," + base.z;
    if (refusedKeys && refusedKeys.has(key)) continue;
    const pd = protectDist(bot, base);
    if (cellProtected(bot, base)) { refused.push({ column: { x: base.x, y: base.y, z: base.z }, protectDist: pd, why: "column inside spawn protection" }); continue; }
    const stands = standOptions(bot, base).filter((s) => !s.protectedCell);
    if (!stands.length) { refused.push({ column: { x: base.x, y: base.y, z: base.z }, protectDist: pd, why: "no unprotected stand cell" }); continue; }
    usable.push({ base, stands, protectDist: pd });
  }
  return { usable, refused };
}

const executors = {
  async goto(bot, ctx, args = {}) {
    let target = null, desc = "", protectNote = null;
    if (args.place === "anchor") { target = ctx.anchor; desc = "anchor"; }
    else if (args.place === "spawn") { target = { x: 26, y: 74, z: -98 }; desc = "spawn"; }
    else if (args.place === "shelter") {
      if (!ctx.shelter || !ctx.shelter.centre) return { ok: false, error: "no shelter recorded yet" };
      target = ctx.shelter.centre; desc = "shelter";
    } else if (args.block) {
      // Protection guard (2026-11-07, see the substrate note above):
      // pathing to a column whose digs the server will cancel is a plan
      // lied to. Target the nearest column that can actually be dug.
      const { usable, refused } = eligibleColumns(bot, args.block, null);
      if (!usable.length) {
        return { ok: false, error: "no diggable " + args.block + " column within 48 blocks" + (refused.length ? ` — ${refused.length} column(s) refused by spawn protection (square radius ${SPAWN_PROTECT} around ${JSON.stringify(spawnCentre(bot))})` : ""), evidence: { refusedProtected: refused.slice(0, 6) } };
      }
      target = usable[0].base; desc = "base of nearest diggable " + args.block + " column";
      protectNote = { protectDist: usable[0].protectDist, refusedProtected: refused.length };
    } else if (args.entity) {
      const e = Object.values(bot.entities).find((en) => en.username === args.entity || en.name === args.entity);
      if (!e) return { ok: false, error: "entity " + args.entity + " not in range" };
      target = e.position; desc = "entity " + args.entity;
    } else if (typeof args.x === "number") { target = args; desc = "coords"; }
    if (!target) return { ok: false, error: "goto: no recognisable target in args " + JSON.stringify(args) };
    const from = bot.entity.position.clone();
    await gotoPos(bot, target.x, target.y, target.z, args.range != null ? args.range : 1);
    const p = bot.entity.position;
    const d = Math.hypot(p.x - target.x, p.z - target.z);
    return { ok: d <= (args.range != null ? args.range : 1) + 2.5, evidence: { wentTo: desc, from: from.floored(), at: p.floored(), horizontalDistanceToTarget: +d.toFixed(1), ...(protectNote ? { targetProtectDist: protectNote.protectDist, refusedProtectedCount: protectNote.refusedProtected } : {}) } };
  },

  async collect(bot, ctx, args = {}) {
    const name = args.block;
    const want = Math.max(1, Math.min(64, args.count || 1));
    if (!name) return { ok: false, error: "collect: args.block required" };
    const invNames = name === "log" ? LOGS : [name];
    const before = invNames.reduce((s, n) => s + count(bot, n), 0);
    const refusedKeys = new Set(); // columns refused within this action
    const refusals = [];            // spawn-protection refusals (evidence)
    const cancelledDigs = [];       // digs the server silently cancelled
    const deadline = Date.now() + 420000; // soft cap: a tick must stay responsive
    let dug = 0, tries = 0, noVerify = 0, lastDist = null, lastStand = null, noUsable = false;
    while (dug < want && tries < want + 6 && Date.now() < deadline) {
      tries++;
      const { usable, refused } = eligibleColumns(bot, name, refusedKeys);
      for (const r of refused) if (!refusals.some((x) => x.column.x === r.column.x && x.column.z === r.column.z)) refusals.push(r);
      if (!usable.length) { noUsable = true; break; }
      const { base: pos, stands } = usable[0];
      const colKey = pos.x + "," + pos.y + "," + pos.z;
      const block = bot.blockAt(pos);
      if (!block || block.name === "air") { refusedKeys.add(colKey); continue; }
      // STAND CLOSURE (2026-11-07): pathfind to a stand cell adjacent to
      // the column, then VERIFY the 3D distance to the lowest target
      // block from where the body actually stopped — never dig on the
      // strength of where the pathfinder was asked to go. (The old code
      // pathfound to the column point itself and measured stands of
      // 4.5–6.5 blocks, past dig reach, for hours.)
      let verified = null;
      for (const stand of stands) {
        await gotoPos(bot, stand.cell.x + 0.5, pos.y, stand.cell.z + 0.5, 0.4, 60000).catch(() => {});
        const fresh = bot.blockAt(pos);
        if (!fresh || fresh.name === "air") break;
        lastDist = bot.entity.position.distanceTo(pos.offset(0.5, 0.5, 0.5));
        lastStand = { cell: { x: stand.cell.x, y: stand.cell.y, z: stand.cell.z }, standDistance: +lastDist.toFixed(2) };
        if (lastDist <= 4.2) { verified = fresh; break; }
      }
      if (!verified) {
        // No stand of this column verified: move to the next column
        // rather than digging at air. Three unverifiable columns in a
        // row end the action with the reason named (the old reach
        // gate's discipline, now measured at verified stands).
        if (++noVerify >= 3) break;
        refusedKeys.add(colKey);
        continue;
      }
      noVerify = 0;
      await equipBestToolFor(bot, verified.name);
      const invBefore = invNames.reduce((s, n) => s + count(bot, n), 0);
      const cellName = verified.name;
      let digThrew = false;
      try { await withTimeout(bot.dig(verified), 20000, "dig"); } catch (e) { digThrew = true; }
      await sleep(450);
      // PHANTOM-DIG CHECK: a dig the server cancelled (protection)
      // resolves exactly like a dig that happened; only the cell knows.
      // Re-read it (descend's detection): still the same solid block =
      // the dig never happened — refuse the column and say so.
      const cellAfter = bot.blockAt(pos);
      if (!digThrew && cellAfter && cellAfter.name === cellName && cellAfter.boundingBox === "block") {
        cancelledDigs.push({ column: { x: pos.x, y: pos.y, z: pos.z }, protectDist: protectDist(bot, pos) });
        refusedKeys.add(colKey);
        continue;
      }
      if (!digThrew) dug++;
      // walk over the drop to vacuum it up
      await gotoPos(bot, pos.x, pos.y, pos.z, 0.6, 20000).catch(() => {});
      await sleep(350);
      const invAfter = invNames.reduce((s, n) => s + count(bot, n), 0);
      if (invAfter <= invBefore && dug > 0) { /* drop may have been missed; keep trying others */ }
    }
    const after = invNames.reduce((s, n) => s + count(bot, n), 0);
    const gained = after - before;
    let failReason = `only gained ${gained} of ${want} ${name}`;
    if (gained < want) {
      if (noUsable) failReason += `: no diggable column within 48 blocks (${refusals.length} refused by spawn protection)`;
      else if (noVerify >= 3) failReason += `: no stand verified within dig reach (last stand distance ${lastDist ? lastDist.toFixed(1) : "?"} blocks) after stand closure`;
      if (cancelledDigs.length) failReason += `; ${cancelledDigs.length} dig(s) silently cancelled by the server (protection signature)`;
      if (refusals.length) failReason += `; ${refusals.length} column(s) refused inside spawn protection`;
    }
    return { ok: gained >= want, evidence: { block: name, wanted: want, gained, inventoryNow: invNames.map((n) => [n, count(bot, n)]).filter(([, c]) => c > 0), ...(lastStand ? { lastStand } : {}), refusedProtected: refusals.slice(0, 6), cancelledDigs }, ...(gained >= want ? {} : { error: failReason }) };
  },

  async craft(bot, ctx, args = {}) {
    const item = args.item;
    const times = Math.max(1, Math.min(16, args.count || 1));
    if (!item) return { ok: false, error: "craft: args.item required" };
    const mc = require("minecraft-data")(bot.version);
    const entry = mc.itemsByName[item];
    if (!entry) return { ok: false, error: "unknown item " + item };
    const before = count(bot, item);
    let made = 0, lastErr = null;
    for (let i = 0; i < times; i++) {
      let recipes = bot.recipesFor(entry.id, null, 1, null);
      let table = null;
      if (!recipes.length) {
        const t = findBlocks(bot, "crafting_table", 6, 1)[0];
        if (t) {
          table = bot.blockAt(t);
          await gotoPos(bot, t.x, t.y, t.z, 2, 30000).catch(() => {});
          recipes = bot.recipesFor(entry.id, null, 1, table);
        }
      }
      if (!recipes.length) { lastErr = "no craftable recipe for " + item + " from current inventory (missing ingredients, or a crafting table is needed and none is within reach)"; break; }
      try {
        await withTimeout(bot.craft(recipes[0], 1, table || undefined), 30000, "craft");
        made++;
      } catch (e) { lastErr = "craft failed: " + e.message; break; }
    }
    const after = count(bot, item);
    return { ok: after > before && made > 0, evidence: { item, operations: made, inventoryBefore: before, inventoryAfter: after }, ...(after > before && made > 0 ? {} : { error: lastErr || "craft made nothing" }) };
  },

  async equip(bot, ctx, args = {}) {
    if (!args.item) return { ok: false, error: "equip: args.item required" };
    if (!has(bot, args.item)) return { ok: false, error: "no " + args.item + " in inventory" };
    await equipItem(bot, args.item);
    const held = bot.heldItem && bot.heldItem.name;
    return { ok: held === args.item, evidence: { heldItem: held } };
  },

  async place(bot, ctx, args = {}) {
    const item = args.item;
    if (!item) return { ok: false, error: "place: args.item required" };
    if (!has(bot, item)) return { ok: false, error: "no " + item + " in inventory" };
    let target;
    if (args.near === "self") {
      const me = bot.entity.position.floored();
      const candidates = [v3(me.x + 1, me.y - 1, me.z), v3(me.x - 1, me.y - 1, me.z), v3(me.x, me.y - 1, me.z + 1), v3(me.x, me.y - 1, me.z - 1), v3(me.x + 1, me.y, me.z), v3(me.x - 1, me.y, me.z)];
      target = candidates.find((c) => { const b = bot.blockAt(c); return b && b.name === "air"; });
      if (!target) return { ok: false, error: "place near self: no free cell adjacent" };
    } else if (typeof args.x === "number") {
      target = v3(args.x, args.y, args.z);
    } else return { ok: false, error: "place: needs {x,y,z} or {near:'self'}" };
    const existing = bot.blockAt(target);
    if (existing && existing.name !== "air" && existing.name !== "cave_air") {
      return { ok: false, error: `place: target ${target} occupied by ${existing.name}` };
    }
    // find a solid reference neighbour
    const dirs = [[0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
    let placed = false, lastErr = null;
    for (const [dx, dy, dz] of dirs) {
      const refPos = v3(target.x + dx, target.y + dy, target.z + dz);
      const ref = bot.blockAt(refPos);
      if (!ref || ref.boundingBox !== "block") continue;
      try {
        await gotoPos(bot, target.x, target.y, target.z, 3, 30000).catch(() => {});
        await equipItem(bot, item);
        await bot.lookAt(target.offset(0.5, 0.5, 0.5), true);
        await withTimeout(bot.placeBlock(ref, target.minus(refPos)), 15000, "placeBlock");
        await sleep(200);
        const now = bot.blockAt(target);
        if (now && now.name !== "air") { placed = true; break; }
      } catch (e) { lastErr = e.message; }
    }
    const now = bot.blockAt(target);
    return { ok: placed, evidence: { item, at: { x: target.x, y: target.y, z: target.z }, blockNow: now && now.name }, ...(placed ? {} : { error: "place failed: " + (lastErr || "no usable reference block") }) };
  },

  async store(bot, ctx, args = {}) {
    const item = args.item;
    const n = Math.max(1, args.count || 1);
    if (!item) return { ok: false, error: "store: args.item required" };
    let chestPos = null;
    if (typeof args.x === "number") chestPos = v3(args.x, args.y, args.z);
    else chestPos = findBlocks(bot, "chest", 32, 1)[0];
    if (!chestPos) return { ok: false, error: "no chest found" };
    const block = bot.blockAt(chestPos);
    await gotoPos(bot, chestPos.x, chestPos.y, chestPos.z, 2, 60000);
    const before = count(bot, item);
    if (!before) return { ok: false, error: "no " + item + " in inventory to store" };
    const container = await withTimeout(bot.openContainer(block), 20000, "openContainer");
    try {
      const mc = require("minecraft-data")(bot.version);
      await container.deposit(mc.itemsByName[item].id, null, Math.min(n, before));
    } finally { try { container.close(); } catch {} }
    await sleep(300);
    const after = count(bot, item);
    return { ok: after < before, evidence: { item, deposited: before - after, chestAt: { x: chestPos.x, y: chestPos.y, z: chestPos.z } } };
  },

  async eat(bot, ctx) {
    const food = FOODS.find((f) => has(bot, f));
    if (!food) return { ok: false, error: "no food in inventory" };
    const foodBefore = bot.food;
    await equipItem(bot, food);
    await withTimeout(bot.consume(), 15000, "consume");
    return { ok: bot.food > foodBefore || bot.food >= 20, evidence: { ate: food, foodBefore, foodAfter: bot.food } };
  },

  async "shelter-enter"(bot, ctx) {
    if (!ctx.shelter || !ctx.shelter.centre) return { ok: false, error: "no shelter recorded yet" };
    const c = ctx.shelter.centre;
    await gotoPos(bot, c.x, c.y, c.z, 1, 60000);
    const p = bot.entity.position;
    return { ok: Math.hypot(p.x - c.x, p.z - c.z) <= 2.5, evidence: { at: p.floored(), shelterCentre: c } };
  },

  async "shelter-exit"(bot, ctx) {
    await gotoPos(bot, ctx.anchor.x, ctx.anchor.y, ctx.anchor.z, 3, 60000);
    return { ok: true, evidence: { at: bot.entity.position.floored() } };
  },

  async flee(bot, ctx) {
    const me = bot.entity.position;
    const hostiles = Object.values(bot.entities).filter((e) => e.type === "mob" && HOSTILES.includes(e.name) && e.position.distanceTo(me) < 20);
    if (!hostiles.length) return { ok: true, evidence: { note: "no hostiles within 20 blocks" } };
    const h = hostiles[0];
    const away = me.minus(h.position); away.y = 0;
    const len = Math.hypot(away.x, away.z) || 1;
    const dest = { x: Math.floor(me.x + (away.x / len) * 14), y: Math.floor(me.y), z: Math.floor(me.z + (away.z / len) * 14) };
    await gotoPos(bot, dest.x, dest.y, dest.z, 2, 45000).catch(() => {});
    const d = bot.entity.position.distanceTo(h.position);
    return { ok: d > 10, evidence: { fledFrom: h.name, distanceNow: +d.toFixed(1) } };
  },

  async "attack-nearest"(bot, ctx) {
    const me = bot.entity.position;
    const hostiles = Object.values(bot.entities).filter((e) => e.type === "mob" && HOSTILES.includes(e.name) && e.position.distanceTo(me) < 16);
    if (!hostiles.length) return { ok: true, evidence: { note: "no hostiles within 16 blocks" } };
    hostiles.sort((a, b) => a.position.distanceTo(me) - b.position.distanceTo(me));
    const target = hostiles[0];
    for (const w of ["stone_sword", "wooden_sword", "stone_axe", "wooden_axe", "stone_pickaxe", "wooden_pickaxe"]) if (has(bot, w)) { await equipItem(bot, w); break; }
    const hpBefore = bot.health;
    const deadline = Date.now() + 25000;
    let ok = false;
    while (Date.now() < deadline) {
      const e = bot.entities[target.id];
      if (!e || !e.isValid) { ok = true; break; }
      await gotoPos(bot, e.position.x, e.position.y, e.position.z, 2, 8000).catch(() => {});
      await bot.lookAt(e.position.offset(0, 1, 0), true).catch(() => {});
      bot.attack(e);
      await sleep(650);
    }
    return { ok, evidence: { target: target.name, killed: ok, healthBefore: hpBefore, healthAfter: bot.health } };
  },

  async wait(bot, ctx, args = {}) {
    const s = Math.max(1, Math.min(180, args.seconds || 10));
    const t0 = bot.time.timeOfDay;
    await sleep(s * 1000);
    return { ok: true, evidence: { waitedSeconds: s, timeOfDayBefore: t0, timeOfDayAfter: bot.time.timeOfDay } };
  },

  async say(bot, ctx, args = {}) {
    const text = String(args.text || "").slice(0, 240);
    if (!text) return { ok: false, error: "say: empty text" };
    bot.chat(text);
    await sleep(400);
    return { ok: true, evidence: { said: text } };
  },

  async descend(bot, ctx, args = {}) {
    // Get DOWN, and prove it. Postcondition contract (tightened
    // 2026-11-07): ok ONLY if the body actually relocated — y fell by
    // >= 1, or the block underfoot became a non-leaf ground block.
    // The previous version dug the block beneath step by step and
    // returned ok unconditionally; inside spawn-protection the server
    // cancels a non-opped bot's digs, the digs "completed" vacuously,
    // and plans proceeded as if he were on the ground while he sat in
    // the canopy at (35, 73, -92) — every following collect then
    // failed out of dig reach (the 08:29 tick, 2026-11-07: descend
    // -> ok three times, collect last distance 8.4 / 7.9, gained 0).
    // A plan lied to cannot replan; a plan told "still in the tree"
    // can. Strategy order: (i) pathfinder step-down to the nearest
    // lower ground, then toward the anchor's ground (movement is NOT
    // spawn-protected — the reliable channel near spawn); (ii)
    // dig-down, only where digs actually take effect — a dug cell
    // still holding the same solid block after the settle was
    // cancelled by the server, so fall back to (i) instead of
    // reporting ok. If nothing relocates him: ok:false with the
    // position evidence.
    const GROUND = ["grass_block", "dirt", "stone", "sand", "gravel", "coarse_dirt", "podzol", "mycelium", "cobblestone", "bedrock", "clay", "sandstone", "dirt_path"];
    const deadline = Date.now() + 90000;
    const supportOf = () => {
      const feet = bot.entity.position.floored();
      for (let d = 1; d <= 3; d++) {
        const b = bot.blockAt(feet.offset(0, -d, 0));
        if (b && b.boundingBox === "block") return b;
      }
      return bot.blockAt(feet.offset(0, -1, 0));
    };
    const fromY = bot.entity.position.y;
    const startSupport = supportOf();
    if (startSupport && GROUND.includes(startSupport.name)) {
      return { ok: true, evidence: { fromY, toY: fromY, steps: 0, standingOn: startSupport.name, alreadyOnGround: true } };
    }
    const relocated = () => {
      if (fromY - bot.entity.position.y >= 0.99) return true;
      const s = supportOf();
      return !!(s && GROUND.includes(s.name));
    };
    const done = (method, steps) => {
      const s = supportOf();
      const q = bot.entity.position;
      return { ok: true, evidence: { fromY, toY: q.y, steps: steps || 0, standingOn: s ? s.name : null, method, position: { x: +q.x.toFixed(1), y: +q.y.toFixed(1), z: +q.z.toFixed(1) } } };
    };
    // Nearest column (within 14) whose top solid block is a ground
    // block at least half a block below the current stand level.
    const lowerGroundTarget = () => {
      const me = bot.entity.position;
      const cx = Math.floor(me.x), cz = Math.floor(me.z);
      const topY = Math.floor(me.y) + 3, botY = Math.floor(me.y) - 16;
      let best = null;
      for (let dx = -14; dx <= 14; dx++) for (let dz = -14; dz <= 14; dz++) {
        if (!dx && !dz) continue;
        const hd = Math.hypot(dx, dz);
        if (hd > 14) continue;
        for (let y = topY; y >= botY; y--) {
          const b = bot.blockAt(v3(cx + dx, y, cz + dz));
          if (b && b.boundingBox === "block") {
            if (GROUND.includes(b.name) && y + 1 <= me.y - 0.5) {
              if (!best || hd < best.hd) best = { x: cx + dx + 0.5, y: y + 1, z: cz + dz + 0.5, name: b.name, hd };
            }
            break; // only the column top counts
          }
        }
      }
      return best;
    };
    let steps = 0;
    const tryPathDown = async (budgetMs) => {
      const t = lowerGroundTarget();
      if (t) {
        await gotoPos(bot, t.x, t.y, t.z, 1, budgetMs).catch(() => {});
        if (relocated()) return "pathfinder-step-down";
      }
      if (ctx && ctx.anchor) {
        const a = ctx.anchor;
        if (Math.hypot(a.x - bot.entity.position.x, a.z - bot.entity.position.z) > 2) {
          await gotoPos(bot, a.x, a.y, a.z, 2, budgetMs).catch(() => {});
          if (relocated()) return "pathfinder-anchor";
        }
      }
      return null;
    };
    // (i) pathfinder first — the channel spawn protection cannot close.
    let method = await tryPathDown(45000);
    if (method) return done(method, steps);
    // (ii) dig-down, with cancellation detection.
    let settleWaits = 0, digCancelled = false, digError = null;
    while (steps < 10 && Date.now() < deadline && !relocated()) {
      const feet = bot.entity.position.floored();
      const below = bot.blockAt(feet.offset(0, -1, 0));
      if (!below) break;
      if (GROUND.includes(below.name)) break;
      if (below.boundingBox === "empty") { // air/water/carpet: mid-fall — let gravity settle
        if (++settleWaits > 6) break;
        await sleep(350);
        continue;
      }
      const cellPos = feet.offset(0, -1, 0);
      const cellName = below.name;
      try { await withTimeout(bot.dig(below), 15000, "dig-below"); }
      catch (e) { digError = e.message; break; }
      steps++;
      await sleep(450);
      const after = bot.blockAt(cellPos);
      if (after && after.name === cellName && after.boundingBox === "block") { digCancelled = true; break; } // server restored the cell: the dig never happened
    }
    if (relocated()) return done("dig-down", steps);
    // Cancelled digs mean this channel is closed here: back to (i)
    // with whatever budget remains, per the strategy order.
    if (digCancelled) {
      method = await tryPathDown(Math.max(5000, deadline - Date.now()));
      if (method) return done(method + "-after-cancelled-dig", steps);
    }
    const s = supportOf();
    const q = bot.entity.position;
    return { ok: false,
      evidence: { fromY, toY: q.y, steps, standingOn: s ? s.name : null, digCancelled, digError, position: { x: +q.x.toFixed(1), y: +q.y.toFixed(1), z: +q.z.toFixed(1) } },
      error: "descend: no relocation — still on " + (s ? s.name : "nothing") + " at y " + q.y.toFixed(1) + (digCancelled ? " (digs cancelled in place: spawn protection)" : "") + (digError ? " (dig error: " + digError + ")" : "") };
  },
};

const VOCABULARY = Object.keys(executors);

async function runAction(bot, ctx, step) {
  const fn = executors[step.action];
  if (!fn) return { ok: false, error: "action not in the closed vocabulary: " + step.action };
  try {
    return await fn(bot, ctx, step.args || {});
  } catch (e) {
    // Idle via setGoal(null), NEVER pathfinder.stop(): stop() sets a flag the
    // NEXT setGoal consumes via path_stop, instantly killing the next goto
    // ("Path was stopped before it could be completed!") — root-caused in the
    // pathfinder source by the Lineage B crew, 2026-11-06; shared as an
    // operator note and adopted here.
    try { bot.pathfinder.setGoal(null); } catch {}
    return { ok: false, error: String(e && e.message || e) };
  }
}

module.exports = { executors, runAction, VOCABULARY, inventory, count, has, findBlocks, gotoPos, sleep, LOGS, HOSTILES, FOODS };
