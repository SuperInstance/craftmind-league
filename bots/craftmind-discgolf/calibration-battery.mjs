// calibration-battery.mjs — characterise Engine A as built.
// Direct simulateThrow calls, noise OFF (no skillState passed), no
// wind, flat tee (startY 1.6) — the release-speed -> distance map
// the league calibration is derived from. Writes
// ~/craftmind-league/logs/calibration-battery.json and prints a table.
import { writeFileSync } from "node:fs";
import { simulateThrow } from "./src/engine/disc-physics.js";
import { getDisc } from "./src/engine/disc-database.js";

const RECIPES = {
  distance: { hyzer: 6, aimPitch: 10 },
  fairway:  { hyzer: 5, aimPitch: 10 },
  midrange: { hyzer: 2, aimPitch: 8 },
  putter:   { hyzer: 0, aimPitch: 3 },
};
const BAGS = {
  mara: ["boss", "firebird", "wasp", "luna"],
  jules: ["wraith", "teebird", "buzzz", "judge"],
  pip: ["archangel", "leopard3", "comet", "aviar"],
};
const SLOT_OF = {};
for (const bag of Object.values(BAGS)) {
  SLOT_OF[bag[0]] = "distance"; SLOT_OF[bag[1]] = "fairway";
  SLOT_OF[bag[2]] = "midrange"; SLOT_OF[bag[3]] = "putter";
}
const POWERS = [0.3, 0.5, 0.7, 0.85, 0.9, 1.0];
const PUTTER_POWERS = [0.05, 0.1, 0.15, 0.2, 0.25];
const rows = [];
for (const discId of Object.keys(SLOT_OF)) {
  const disc = getDisc(discId);
  const slot = SLOT_OF[discId];
  const recipe = RECIPES[slot];
  const v0max = 22 + (disc.speed / 14) * 8;
  const powers = slot === "putter" ? [...PUTTER_POWERS, ...POWERS] : POWERS;
  for (const power of powers) {
    const r = simulateThrow({ disc, power, hyzer: recipe.hyzer, aimYaw: 0, aimPitch: recipe.aimPitch, windSpeed: 0, windDirection: 0, startX: 0, startY: 1.6, startZ: 0, obstacles: [] });
    rows.push({ disc: discId, slot, speed: disc.speed, glide: disc.glide, turn: disc.turn, fade: disc.fade,
      power, releaseSpeed: +(v0max * power).toFixed(2), distance: +r.distance.toFixed(3),
      height: +r.height.toFixed(2), landing: r.landing });
  }
}
const byDisc = {};
for (const r of rows) { (byDisc[r.disc] = byDisc[r.disc] || []).push(r); }
console.log("disc        slot      spd  pwr   v0(m/s)  dist(units)");
for (const [disc, rs] of Object.entries(byDisc)) {
  for (const r of rs) console.log(
    disc.padEnd(11), r.slot.padEnd(9), String(r.speed).padStart(3),
    r.power.toFixed(2), String(r.releaseSpeed).padStart(7), String(r.distance).padStart(9));
}
const bossFull = byDisc["boss"].find((r) => r.power === 1.0);
console.log("\nREFERENCE DRIVE (boss, power 1.0, drive recipe): carry =", bossFull.distance, "engine units at v0 =", bossFull.releaseSpeed, "m/s");
writeFileSync("/home/caseydigennaro/craftmind-league/logs/calibration-battery.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), engine: "src/engine/disc-physics.js as built, noise off, no wind", recipes: RECIPES, rows }, null, 2) + "\n");
console.log("wrote logs/calibration-battery.json");
