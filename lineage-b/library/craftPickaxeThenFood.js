// skill: craftPickaxeThenFood
// stage: S1
// purpose: From banked oak logs: planks (one type) -> crafting table placed at her feet -> sticks -> wooden pickaxe; then eat carried apples if any; post grades the full S1 exam criteria.
// postconditions: wooden_pickaxe in inventory AND a crafting table carried or placed within 20 blocks (the exam's own S1 check).
// OPERATOR SKILL (2026-11-08, Vega S1 completion lane): executed once via the
// VEGA_OPERATOR_SKILL latch in vega.js (substrate execution selection). The
// chain uses ONLY helpers.craft (post-craftfix semantics: convert logs to
// planks of ONE type first, never craft the table from raw logs - the
// triple-005 / MiniMax Q1 rule) and helpers.placeAt for the table.
module.exports = async (bot, helpers, ctx) => {
  const say = (m) => { try { bot.chat(m); } catch {} };
  const logs = helpers.count(bot, "oak_log");
  if (logs < 3 && !helpers.has(bot, "wooden_pickaxe")) {
    throw new Error("craftPickaxeThenFood: only " + logs + " oak_log banked - need 3 for the S1 chain");
  }
  // 1) planks of ONE type (oak) - 3 logs -> 12 oak_planks (need 7: table 4 + sticks 2 + pickaxe 3, with margin)
  if (!helpers.has(bot, "wooden_pickaxe")) {
    if (helpers.count(bot, "oak_planks") < 7) {
      await helpers.craft(bot, "oak_planks", 12);
    }
    // 2) crafting table (item), from oak_planks
    if (!helpers.has(bot, "crafting_table")) {
      await helpers.craft(bot, "crafting_table", 1);
    }
    // 3) place the table on the ground at her feet (her cell is outside spawn protection)
    const p = bot.entity.position;
    const feet = { x: Math.floor(p.x), y: Math.floor(p.y), z: Math.floor(p.z) };
    const spots = [
      { x: feet.x + 1, y: feet.y, z: feet.z }, { x: feet.x - 1, y: feet.y, z: feet.z },
      { x: feet.x, y: feet.y, z: feet.z + 1 }, { x: feet.x, y: feet.y, z: feet.z - 1 },
      { x: feet.x + 1, y: feet.y, z: feet.z + 1 }, { x: feet.x - 1, y: feet.y, z: feet.z - 1 },
    ];
    let placed = false;
    for (const s of spots) {
      const b = bot.blockAt(helpers.v3(s.x, s.y, s.z));
      if (b && b.name === "crafting_table") { placed = true; break; }
      if (b && b.name === "air") {
        try { await helpers.placeAt(bot, "crafting_table", s.x, s.y, s.z); placed = true; break; } catch (e) { /* try next spot */ }
      }
    }
    if (!placed) {
      // fall back: the exam also accepts a table block within 20 - if none placed, carrying still counts via item; keep going
      say("Table placement failed at every neighbour cell - carrying the table instead.");
    }
    // 4) sticks (2 planks -> 4 sticks), then the pickaxe (3 planks + 2 sticks, at the table)
    if (helpers.count(bot, "stick") < 2) await helpers.craft(bot, "stick", 4);
    await helpers.craft(bot, "wooden_pickaxe", 1);
    // The craft resolves on the window-close packet; the inventory sync can
    // land a beat later (observed live 2026-11-08T08:31:53Z: the check below
    // threw while the state feed 0.6 s later showed wooden_pickaxe 1 and the
    // exam ambient check passed S1). Poll briefly before declaring failure.
    for (let i = 0; i < 10 && !helpers.has(bot, "wooden_pickaxe"); i++) await helpers.sleep(500);
    if (!helpers.has(bot, "wooden_pickaxe")) throw new Error("craftPickaxeThenFood: pickaxe craft returned but no wooden_pickaxe in inventory after 5 s of polling");
    say("Wooden pickaxe crafted - S1 chain complete. Now food.");
  }
  // 5) eat any carried food (apples from the canopy, if the world provided)
  const FOODS = ["apple", "cooked_beef", "cooked_porkchop", "cooked_chicken", "cooked_mutton", "cooked_cod", "cooked_salmon", "beef", "porkchop", "chicken", "mutton", "bread", "carrot", "potato", "baked_potato", "sweet_berries"];
  for (const f of FOODS) {
    // Cheap relative-move supplement on purpose: the eat is a 1.6 s timed
    // action; the follower wedge needs motion. Tiny hops keep her legal.
    try { await helpers.goto(bot, p.x + 1, p.y, p.z, 0.6); } catch (e) {}
    while (helpers.has(bot, f) && bot.food < 20) {
      try { await helpers.equip(bot, f); await bot.consume(); } catch (e) { break; }
      await helpers.sleep(300);
    }
  }
  return;
};

module.exports.post = async (bot, helpers, ctx) => {
  const pick = helpers.has(bot, "wooden_pickaxe");
  const tableItem = helpers.has(bot, "crafting_table");
  let tableBlock = null;
  try { const t = helpers.findBlock(bot, "crafting_table", 20); if (t) tableBlock = { x: t.position.x, y: t.position.y, z: t.position.z }; } catch {}
  return {
    ok: pick && (tableItem || !!tableBlock),
    evidence: { wooden_pickaxe: pick, crafting_table_item: tableItem, crafting_table_block: tableBlock, inventory: helpers.inventoryList(bot), food: bot.food, health: bot.health },
  };
};
