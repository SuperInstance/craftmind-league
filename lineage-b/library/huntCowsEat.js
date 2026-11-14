"use strict";
// huntCowsEat - Vega S1 completion lane, Phase 2 (food). Operator skill via
// the VEGA_OPERATOR_SKILL latch. Travels to her surveyed herd (~65-80 blocks
// EAST of her parked cell), kills cows (or the pig) with the wooden pickaxe,
// collects the beef, eats RAW beef until food >= 14 or the meat runs out.
// post() grades FOOD ONLY (this skill's own goal - the transition-bug lesson:
// a skill's post must grade its own postconditions, not the whole stage).
const PREY = ["cow", "pig", "sheep", "chicken"];
const MEATS = ["beef", "porkchop", "mutton", "chicken"];
module.exports = async (bot, helpers, ctx) => {
  const say = (m) => { try { bot.chat(m); } catch {} };
  const startFood = bot.food;
  say("Pickaxe in hand - heading east to the herd for food.");
  if (!helpers.has(bot, "wooden_pickaxe")) throw new Error("huntCowsEat: no wooden_pickaxe - Phase 1 must complete first");
  // travel east in legs toward the surveyed herd ground (~114, 72, -60)
  const legs = [[70, -58], [92, -58], [108, -60]];
  for (const [lx, lz] of legs) {
    if (bot.food <= 3) throw new Error("huntCowsEat: food at floor during travel - aborting");
    const legStart = bot.entity.position.clone();
    try { await helpers.goto(bot, lx, bot.entity.position.y, lz, 3); }
    catch (e) { /* goto timeouts are survivable if she closed distance; the prey scan below re-decides */ }
    // Abort the leg if the SERVER is vetoing displacement (the triple-007
    // mechanism): commanded travel, zero net displacement, full timeout.
    const pNow = bot.entity.position;
    if (legStart && Math.hypot(pNow.x - legStart.x, pNow.z - legStart.z) < 1) {
      throw new Error("huntCowsEat: server veto on this leg - zero displacement under commanded travel, aborting before the food floor");
    }
    const p = bot.entity.position;
    if (Math.hypot(p.x - 108, p.z + 60) < 14) break;
  }
  // hunt loop: nearest live prey within 40, up to 3 kills
  let kills = 0;
  for (let round = 0; round < 3; round++) {
    const prey = Object.values(bot.entities)
      .filter((e) => e && e.position && PREY.includes(e.name))
      .map((e) => ({ e, d: e.position.distanceTo(bot.entity.position) }))
      .filter((x) => x.d <= 40).sort((a, b) => a.d - b.d)[0];
    if (!prey) break;
    try { await helpers.goto(bot, prey.e.position.x, prey.e.position.y, prey.e.position.z, 1.5); } catch (e) {}
    try { await helpers.equip(bot, "wooden_pickaxe"); } catch (e) {}
    for (let swing = 0; swing < 30; swing++) {
      const t = bot.entities[prey.e.id];
      if (!t || !t.isValid) break;
      try { await bot.lookAt(t.position.offset(0, 1, 0), true); bot.attack(t); } catch (e) { break; }
      await helpers.sleep(650);
    }
    kills++;
    await helpers.sleep(1200); // let drops settle
    // pick up drops: walk a small sweep over the kill site (item entities attract via physics pickup on contact)
    const drops = Object.values(bot.entities).filter((e) => e && e.position && e.name === "item" && e.position.distanceTo(bot.entity.position) <= 12);
    for (const d of drops.slice(0, 4)) {
      try { await helpers.goto(bot, d.position.x, d.position.y, d.position.z, 0.5); } catch (e) {}
    }
    if (MEATS.some((m) => helpers.has(bot, m))) break;
    if (bot.food <= 3) break;
  }
  // eat raw meat (raw beef/porkchop = 3 food each) until >= 14 or out of meat
  for (const m of MEATS) {
    while (helpers.has(bot, m) && bot.food < 14) {
      try { await helpers.equip(bot, m); await bot.consume(); } catch (e) { break; }
      await helpers.sleep(300);
    }
  }
  say("Food run done: food " + startFood + " -> " + bot.food + ", kills " + kills + ".");
  return;
};
module.exports.post = async (bot, helpers, ctx) => {
  // ABSOLUTE grading (this skill's own goal, never relative): food actually
  // RESTORED above the takeover level of 4, and the body still alive.
  return { ok: bot.food >= 6 && bot.health >= 10, evidence: { food: bot.food, health: bot.health, inventory: helpers.inventoryList(bot), position: { x: +bot.entity.position.x.toFixed(1), y: +bot.entity.position.y.toFixed(1), z: +bot.entity.position.z.toFixed(1) } } };
};
