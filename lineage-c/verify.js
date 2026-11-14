// verify.js — stage verdicts from WORLD EVIDENCE ONLY.
// The Deliberator's plans never grade themselves: a stage passes when the
// blocks and inventories say it passed. Criteria are the shared exam's
// (identical ladder to Lineages A and B; see lineage-b/exam.js and
// pulse/curriculum.json — same words, own implementation).
const Vec3 = require("vec3");
const ex = require("./executors");

const DOORS = ["oak_door", "spruce_door", "birch_door", "jungle_door", "acacia_door", "dark_oak_door", "iron_door"];

const solid = (bot, x, y, z) => { const b = bot.blockAt(new Vec3(x, y, z)); return !!(b && b.boundingBox === "block"); };
const isAir = (bot, x, y, z) => { const b = bot.blockAt(new Vec3(x, y, z)); return !!(b && (b.name === "air" || b.name === "cave_air" || b.name === "void_air")); };

// Find an enclosed, roofed interior volume fronted by a door, near the anchor.
// Method: for each door block near the anchor, try both sides as the interior;
// from the seed cell, flood-fill the 2-high air columns that have floor below
// and roof above; the volume must stay bounded (>=3 cells, <=60) and contain
// or touch a torch. Returns {ok, evidence} and on success evidence.centre.
function scanShelter(bot, anchor) {
  let doors = [];
  for (const d of DOORS) {
    try { doors = doors.concat(ex.findBlocks(bot, d, 40, 12).map((p) => ({ name: d, pos: p }))); } catch {}
  }
  doors = doors.filter((d) => Math.hypot(d.pos.x - anchor.x, d.pos.z - anchor.z) <= 26);
  if (!doors.length) return { ok: false, evidence: { reason: "no door block within 26 (horizontal) of anchor" } };
  doors.sort((a, b) => Math.hypot(a.pos.x - anchor.x, a.pos.z - anchor.z) - Math.hypot(b.pos.x - anchor.x, b.pos.z - anchor.z));

  for (const door of doors.slice(0, 5)) {
    const base = door.pos; // bottom half of the door
    const fy = base.y - 1; // floor surface level
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const sx = base.x + dx, sz = base.z + dz;
      if (!solid(bot, sx, fy, sz) || !isAir(bot, sx, fy + 1, sz) || !isAir(bot, sx, fy + 2, sz) || !solid(bot, sx, fy + 3, sz)) continue;
      const seen = new Set(); const queue = [[sx, sz]]; let leaky = false;
      while (queue.length) {
        const [cx, cz] = queue.pop();
        const key = cx + "," + cz;
        if (seen.has(key)) continue;
        seen.add(key);
        if (seen.size > 60) { leaky = true; break; }
        if (!solid(bot, cx, fy, cz) || !isAir(bot, cx, fy + 1, cz) || !isAir(bot, cx, fy + 2, cz) || !solid(bot, cx, fy + 3, cz)) { leaky = true; break; }
        for (const [nx, nz] of [[cx + 1, cz], [cx - 1, cz], [cx, cz + 1], [cx, cz - 1]]) {
          if (seen.has(nx + "," + nz)) continue;
          if (nx === base.x && nz === base.z) continue; // the doorway itself
          if (isAir(bot, nx, fy + 1, nz) && solid(bot, nx, fy, nz)) queue.push([nx, nz]);
        }
      }
      if (leaky || seen.size < 3) continue;
      // torch inside the volume or on its inner walls
      let torchAt = null;
      const scanCell = (x, y, z) => { const b = bot.blockAt(new Vec3(x, y, z)); if (b && (b.name === "torch" || b.name === "wall_torch")) torchAt = { x, y, z }; };
      for (const key of seen) {
        const [cx, cz] = key.split(",").map(Number);
        for (const y of [fy + 1, fy + 2]) scanCell(cx, y, cz);
      }
      if (!torchAt) {
        for (const key of seen) {
          const [cx, cz] = key.split(",").map(Number);
          for (const [ox, oz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (const y of [fy + 1, fy + 2]) scanCell(cx + ox, y, cz + oz);
          if (torchAt) break;
        }
      }
      if (!torchAt) {
        return { ok: false, evidence: { reason: "enclosed roofed volume found, but no torch inside", door: { name: door.name, x: base.x, y: base.y, z: base.z }, interiorCells: seen.size } };
      }
      return { ok: true, evidence: { door: { name: door.name, x: base.x, y: base.y, z: base.z }, interiorCells: seen.size, torchAt, floorY: fy, centre: { x: sx, y: fy + 1, z: sz } } };
    }
  }
  return { ok: false, evidence: { reason: "doors exist but none fronts an enclosed roofed volume", doorsFound: doors.length } };
}

const CHECKS = {
  async S1(bot, ctx) {
    const inv = ex.inventory(bot);
    const pick = ex.has(bot, "wooden_pickaxe");
    const tableItem = ex.has(bot, "crafting_table");
    let tableBlock = null;
    const t = ex.findBlocks(bot, "crafting_table", 20, 1)[0];
    if (t) tableBlock = { x: t.x, y: t.y, z: t.z };
    return { ok: pick && (tableItem || !!tableBlock), evidence: { wooden_pickaxe: pick, crafting_table_item: tableItem, crafting_table_block: tableBlock, inventory: inv } };
  },
  async S2(bot, ctx) {
    const inv = ex.inventory(bot);
    const pick = ex.has(bot, "stone_pickaxe");
    const cob = ex.count(bot, "cobblestone");
    const cobSeen = (ctx.maxSeen && ctx.maxSeen.cobblestone) || 0;
    return { ok: pick && (cob > 0 || cobSeen > 0), evidence: { stone_pickaxe: pick, cobblestone: cob, cobblestoneSeen: cobSeen, inventory: inv } };
  },
  async S3(bot, ctx) {
    const s = scanShelter(bot, ctx.anchor);
    if (s.ok) ctx.shelter = s.evidence;
    return s;
  },
  async S4(bot, ctx) {
    const s = scanShelter(bot, ctx.anchor);
    if (!s.ok) return { ok: false, evidence: { reason: "no shelter to furnish", scan: s.evidence } };
    const c = s.evidence.centre;
    const chests = ex.findBlocks(bot, "chest", 32, 6).filter((p) => Math.hypot(p.x - ctx.anchor.x, p.z - ctx.anchor.z) <= 26);
    if (!chests.length) return { ok: false, evidence: { reason: "no chest near the shelter" } };
    for (const pos of chests) {
      await ex.gotoPos(bot, pos.x, pos.y, pos.z, 2, 45000).catch(() => {});
      const block = bot.blockAt(pos);
      if (!block) continue;
      let container;
      try { container = await bot.openContainer(block); } catch { continue; }
      const items = container.items() || [];
      const total = items.reduce((sum, i) => sum + i.count, 0);
      const detail = items.map((i) => ({ name: i.name, count: i.count }));
      try { container.close(); } catch {}
      void c;
      return { ok: total >= 8, evidence: { chestAt: { x: pos.x, y: pos.y, z: pos.z }, storedTotal: total, contents: detail } };
    }
    return { ok: false, evidence: { reason: "chests found but none could be opened" } };
  },
};

module.exports = { CHECKS, scanShelter };
