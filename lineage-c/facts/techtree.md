# techtree.md — the settle-in progression (seeded fact file)
# Source: hand-written from the game's own recipe data (minecraft-data) and the
# shared exam definition. Facts, not weights: any lineage may consult this file.

## The ladder (the shared exam, in order)
- S1 Gather + tools: crafting table (carried or placed) AND wooden pickaxe in inventory.
- S2 Stone: stone pickaxe in inventory (cobblestone mined with the wooden pickaxe).
- S3 Shelter: enclosed, roofed volume within ~26 blocks of your anchor, with a door
  installed and a torch inside. Judged by block scan, not by say-so.
- S4 Furnish: a chest inside the shelter holding at least 8 stored items.
- S5 The night: one full night (timeOfDay 13000 -> 23000) with zero deaths, inside
  or within ~6 blocks of the shelter at mid-night.

## Dependency chain for S1 (wooden tools)
1. Any log (oak_log, spruce_log, birch_log, jungle_log, acacia_log, dark_oak_log)
   is dug by hand from a tree trunk. No tool needed.
2. 1 log -> 4 planks (inventory 2x2 grid, no table needed).
3. 2 planks stacked vertically -> 4 sticks (2x2 grid, no table needed).
4. 4 planks in a square -> 1 crafting table (2x2 grid, no table needed).
5. Place the crafting table (or carry it and place it when needed); 3x3 recipes
   require standing next to a placed table.
6. 3 planks across the top row + 2 sticks down the middle column, at the table
   -> 1 wooden pickaxe.

## S1 bill of materials (added 2026-11-07 — exact minimum inputs, derived from facts/recipes.md)
To finish S1 (crafting table placed or carried AND a wooden pickaxe in
inventory), starting from empty hands, the minimum inputs are:
- LOGS: collect at least 3 logs (any wood). 3 logs -> 12 planks, of which
  9 are consumed below. With only 2 logs (8 planks) S1 is arithmetically
  IMPOSSIBLE: table (4 planks) + pickaxe head (3 planks) = 7, leaving 1
  plank — less than the 2 planks a stick batch costs. There is no S1
  plan on 2 logs; do not propose one.
- PLANKS: 9 consumed in total — 4 for the crafting table, 3 for the
  pickaxe head, 2 for the stick batch. (3 planks left over from 3 logs.)
- STICKS: the stick craft is 2 planks -> 4 sticks — FOUR sticks, never
  one stick from 2 planks. The pickaxe consumes exactly 2 sticks; the
  other 2 from the batch are spare. Budget the batch exactly as written:
  2 planks in, 4 sticks out, 2 used.
- Sequence: collect 3 logs -> craft planks (1 log -> 4 planks, x3 = 12)
  -> craft sticks (2 planks -> 4 sticks) -> craft crafting table
  (4 planks) -> place the table -> at the table, craft the wooden
  pickaxe (3 planks + 2 sticks). Every quantity above is the recipe
  file's own number; a plan that contradicts them will fail at the
  calculator or at the crafting grid.

## Dependency chain for S2 (stone)
7. With the wooden pickaxe equipped, dig stone blocks (exposed rock, cliff faces,
   stream beds, or dig down through dirt/gravel to the stone layer). Each stone
   block drops 1 cobblestone.
8. 3 cobblestone + 2 sticks at the table -> 1 stone pickaxe.

## Dependency chain for S3 (shelter)
9. Wall/roof material: planks (4 per log) or cobblestone — see shelter.md for the
   canonical blueprint and the block counts.
10. Any wooden door: 6 planks in a 2-wide, 3-tall rectangle at the table -> 1 door.
11. Torch: 1 stick + 1 coal or 1 charcoal, 2x2 grid (no table needed) -> 4 torches.
    - Coal: dig coal_ore (black-speckled stone, common in exposed stone and
      shallow digging) with any pickaxe -> coal.
    - Charcoal: smelt 1 log in a furnace with fuel (needs a furnace: 8 cobblestone
      in a ring at the table) — the slower path; prefer coal ore.

## Dependency chain for S4 (furnish)
12. Chest: 8 planks in a ring at the table -> 1 chest. Place inside the shelter,
    deposit at least 8 surplus items (keep tools in hand).

## The dusk rule (added 2026-11-07, from Geist's own death record — see facts/world.md)
- A plan is INCOMPLETE if it leaves Geist unsheltered and away from HOME
  (7, 67, -85) when timeOfDay passes ~12000. The work plan and the
  be-home-by-dusk plan are one plan.
- If the current stage's work cannot finish before dusk, the plan's final
  actions return Geist to HOME (or to the finished S3 shelter, once it
  exists). Travel in this forest is slow (0.1–0.3 blocks/s in litter), so the
  return leg is budgeted by distance: at dusk-minus-ten-minutes he is already
  late if he is more than ~100 blocks out, and the canopy descent after a
  death costs several minutes more.
- The S3 shelter is the long-term answer to the night; HOME is the interim
  one. Until S3 passes, shelter-seeking outranks stage progress after ~12000.

## Survival facts
- Night falls at timeOfDay ~13000; dawn at ~23000. Hostiles spawn in darkness.
- Geist's death record (2026-11-07, server log): 19 deaths, ALL hostile mob
  kills in darkness — none from falls, hunger, or water. The night, not the
  terrain, is what kills him. Full evidence in facts/world.md.
- Torches inside a shelter keep the interior lit; a closed door keeps most
  hostiles out (zombies can break wooden doors on hard difficulty only).
- Food: apples drop occasionally from oak leaves; animals drop meat (cook it if
  possible). Eat before food drops low; starving drains health.
- Water: do not stay underwater; air runs out in ~15 seconds.
