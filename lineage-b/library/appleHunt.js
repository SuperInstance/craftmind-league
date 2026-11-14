"use strict";
// appleHunt - Vega S1 completion lane, food attempt 2. Operator skill via the
// VEGA_OPERATOR_SKILL latch. The cow hunt was vetoed by the server
// (displacement frozen under commanded travel, hp 19 -> 5 cost). This skill
// does the opposite of travel: SHORT hops (<= 2.5 blocks) under the dense oak
// canopy ~32 blocks WSW of her anchor - the Cody escape-route pattern
// (triple-001: dense hops consumed at 2.2 blocks work where free goto churns).
// It fells ONE oak with helpers.collect (its own goto-to-trunk is proven:
// the previous lane harvested 6 logs with it), sweeps the leaf-fall area for
// dropped apples, and eats every apple found (2 food each).
// post() grades THIS skill's goal absolutely: food >= 6 and health >= 10.
module.exports = async (bot, helpers, ctx) => {
  const say = (m) => { try { bot.chat(m); } catch {} };
  say("Herd run was vetoed by the ground itself. Trying the oak canopy for apples - short hops only.");
  const start = bot.entity.position.clone();
  const TARGET = { x: 46, z: -92 }; // under the surveyed oak canopy (logs at (46,68..71,-91))
  // dense hop chain: straight-line interpolation, hops of <= 2.2 blocks
  const dx = TARGET.x - start.x, dz = TARGET.z - start.z;
  const dist = Math.hypot(dx, dz);
  const hops = Math.max(1, Math.ceil(dist / 2.2));
  for (let i = 1; i <= hops; i++) {
    if (bot.food <= 3) throw new Error("appleHunt: food at floor en route - aborting");
    if (bot.health <= 6) throw new Error("appleHunt: health critical en route - aborting");
    const hx = start.x + (dx * i) / hops, hz = start.z + (dz * i) / hops;
    const before = bot.entity.position.clone();
    try { await helpers.goto(bot, hx, bot.entity.position.y, hz, 0.8); } catch (e) {}
    const now = bot.entity.position;
    if (Math.hypot(now.x - before.x, now.z - before.z) < 0.3 && i > 1) {
      // one vetoed hop is survivable (digFace may clear it); two in a row is the wall
      const b2 = bot.entity.position.clone();
      try { await helpers.goto(bot, hx, bot.entity.position.y, hz, 0.8); } catch (e) {}
      const n2 = bot.entity.position;
      if (Math.hypot(n2.x - b2.x, n2.z - b2.z) < 0.3) throw new Error("appleHunt: two consecutive vetoed hops - the canopy line is walled, aborting");
    }
  }
  // fell one oak: collect targets the trunk and walks to it with its own logic
  const logsBefore = helpers.count(bot, "oak_log");
  try { await helpers.collect(bot, "oak_log", 2, { maxDistance: 24 }); } catch (e) { say("Oak collect ended: " + String(e.message).slice(0, 80)); }
  await helpers.sleep(2500); // leaves decay / drops settle
  // sweep for dropped items (apples fall as item entities near the trunk)
  for (let sweep = 0; sweep < 3; sweep++) {
    const drops = Object.values(bot.entities).filter((e) => e && e.position && e.name === "item" && e.position.distanceTo(bot.entity.position) <= 14);
    if (!drops.length) break;
    for (const d of drops.slice(0, 5)) {
      try { await helpers.goto(bot, d.position.x, d.position.y, d.position.z, 0.5); } catch (e) {}
      await helpers.sleep(250);
    }
  }
  let ate = 0;
  while (helpers.has(bot, "apple") && bot.food < 18) {
    try { await helpers.equip(bot, "apple"); await bot.consume(); ate++; } catch (e) { break; }
    await helpers.sleep(300);
  }
  say("Apple run done: ate " + ate + ", food now " + bot.food + ", logs " + logsBefore + " -> " + helpers.count(bot, "oak_log") + ".");
  return;
};
module.exports.post = async (bot, helpers, ctx) => {
  return { ok: bot.food >= 6 && bot.health >= 10, evidence: { food: bot.food, health: bot.health, inventory: helpers.inventoryList(bot), position: { x: +bot.entity.position.x.toFixed(1), y: +bot.entity.position.y.toFixed(1), z: +bot.entity.position.z.toFixed(1) } } };
};
