// exam.js — THE SHARED EXAM for the agent-community world.
// Identical ladder to Lineage A (~/craftmind-league/pulse/curriculum.json if
// present; at Lineage B build time it was not yet landed, so this file is the
// fallback definition — the ladders are textually the same S1..S5).
// Every verdict is computed from WORLD EVIDENCE ONLY (inventory contents,
// block scans, server-observable events) — never from a skill saying it worked.
const h = require("./helpers");

const STAGES = [
  { id: "S1", name: "Wooden tools",
    criteria: "Crafting table (carried or placed within 20 blocks) AND a wooden pickaxe in inventory.",
    task: "Gather wood from nearby trees, craft planks and sticks, craft and place (or carry) a crafting table, and craft a wooden pickaxe." },
  { id: "S2", name: "Stone pickaxe",
    criteria: "A stone pickaxe in inventory (implies cobblestone was mined with the wooden pickaxe).",
    task: "Use the wooden pickaxe to mine stone for cobblestone, then craft a stone pickaxe at the crafting table." },
  { id: "S3", name: "Shelter",
    criteria: "An enclosed, roofed volume within ~26 blocks of the anchor with a door block and a torch inside (block-scan evidence).",
    task: "Build a small enclosed shelter near the anchor: floor, walls, roof, a crafted door installed, and a torch placed inside." },
  { id: "S4", name: "Furnish",
    criteria: "A chest inside the shelter volume containing at least 8 stored items.",
    task: "Craft a chest, place it inside the shelter, and deposit at least 8 surplus items into it." },
  { id: "S5", name: "Survive the night",
    criteria: "One full night (timeOfDay 13000->23000) with zero deaths, Vega inside or within 6 blocks of the shelter at mid-night.",
    task: "When night falls, be inside the shelter and stay there until morning. (Monitored continuously by the resident loop, not by a single skill run.)" },
];

// verdicts: async (bot, ctx) -> {ok, evidence}
const CHECKS = {
  async S1(bot, ctx) {
    const inv = h.inventoryList(bot);
    const pick = h.has(bot, "wooden_pickaxe");
    let tableBlock = null, tableItem = h.has(bot, "crafting_table");
    try { const t = h.findBlock(bot, "crafting_table", 20); if (t) tableBlock = { x: t.position.x, y: t.position.y, z: t.position.z }; } catch {}
    return { ok: pick && (tableItem || !!tableBlock), evidence: { wooden_pickaxe: pick, crafting_table_item: tableItem, crafting_table_block: tableBlock, inventory: inv } };
  },
  async S2(bot, ctx) {
    const inv = h.inventoryList(bot);
    return { ok: h.has(bot, "stone_pickaxe"), evidence: { stone_pickaxe: h.has(bot, "stone_pickaxe"), cobblestone: h.count(bot, "cobblestone"), inventory: inv } };
  },
  async S3(bot, ctx) {
    const s = h.scanShelter(bot, ctx.anchor);
    if (s.ok) ctx.shelter = s.evidence;
    return s;
  },
  async S4(bot, ctx) {
    const s = h.scanShelter(bot, ctx.anchor);
    if (!s.ok) return { ok: false, evidence: { reason: "no shelter to furnish", scan: s.evidence } };
    const c = s.evidence.centre;
    // find a chest near the shelter centre
    const chests = h.findBlocks(bot, "chest", 30, 10);
    const near = chests.filter((p) => Math.abs(p.x - c.x) <= 5 && Math.abs(p.z - c.z) <= 5);
    if (!near.length) return { ok: false, evidence: { reason: "no chest within 5 of shelter centre", centre: c } };
    await h.goto(bot, near[0].x, near[0].y, near[0].z, 2);
    const block = bot.blockAt(near[0]);
    const chest = await bot.openChest(block);
    const items = chest.containerItems();
    const total = items.reduce((a, i) => a + i.count, 0);
    const detail = items.map((i) => ({ name: i.name, count: i.count }));
    chest.close();
    return { ok: total >= 8, evidence: { chestAt: { x: near[0].x, y: near[0].y, z: near[0].z }, storedTotal: total, items: detail } };
  },
  async S5(bot, ctx) {
    // Filled in by the resident night-watch (vega.js) into ctx.nightRecord.
    const n = ctx.nightRecord;
    if (!n || !n.complete) return { ok: false, evidence: { reason: "no complete night observed yet", nightRecord: n || null } };
    return { ok: n.deathsDuring === 0 && !!n.insideAtMid, evidence: n };
  },
};

module.exports = { STAGES, CHECKS };
