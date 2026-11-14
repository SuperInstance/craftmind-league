# shelter.md — the canonical shelter blueprint (seeded fact file)
# A standard 5x5 shelter the PLANNER can copy. Coordinates are RELATIVE to the
# anchor (ax, ay, az), where ay is the ground/floor level at the build site.
# Interior is 3x3, standing height 2, flat roof. Door on the south (+z) side.

## Layout (dx, dz in -2..2; dy is height above floor level ay)
- Floor: the ground itself (grass/dirt is acceptable); optionally cover later.
- Walls (dy = 1 and dy = 2): every perimeter cell of the 5x5 square EXCEPT:
  - the door cell at (dx=0, dz=+2): door occupies dy=1 and dy=2 (one door item
    fills both). Do NOT place wall blocks in the door cell.
  - Wall block count: perimeter cells = 16; minus door cell = 15 cells x 2 high
    = 30 blocks, plus the door item itself.
- Roof (dy = 3): all 25 cells of the 5x5 square.
- Total building blocks needed: 30 (walls) + 25 (roof) = 55 blocks of planks or
  cobblestone (plus spares), and 1 wooden door.
- Torch: placed on an interior wall or floor inside (e.g. at (dx=0, dy=2, dz=-1)
  against the north wall, or standing on the floor at a corner).

## Build order that works with the closed action vocabulary
1. goto the anchor; stand at the build site centre.
2. Place the south wall first, leaving the door gap; then east, north, west walls.
   (Placing a wall block at dy=2 requires a reference block: the dy=1 block
   below it works once placed.)
3. Install the door in the gap (place the door item at the door cell, dy=1).
4. Roof: place from inside by pillaring or from the wall tops; each roof cell
   needs an adjacent solid reference — build the roof row by row from one edge.
5. Place the torch inside.
6. Verify with the shelter scan (door + enclosed roofed volume + torch inside).

## Notes
- If the ground at the anchor slopes, level a 5x5 pad of dirt first (collect dirt,
  place to fill) so wall bases share one ay.
- A 4x4 variant (interior 2x2) also passes the scan if fully enclosed and roofed:
  perimeter 12 cells - door = 11 x 2 = 22 wall blocks + 16 roof = 38 blocks.
  The 5x5 is preferred; the 4x4 is the fallback when materials run short.
