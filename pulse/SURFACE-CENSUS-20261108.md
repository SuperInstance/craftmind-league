# SURFACE CENSUS 2026-11-08 — live-world surface composition of the veto clusters

**Lane:** Orin specialty (front room; the world lives on this box). **Filed:** 2026-11-09 ~00:35 UTC.
**Purpose:** give the Thor chunk-transplant lane (follow-on to **triple-019**: carrier = the played chunks' block content) eyes on the LIVE surface, read-only, so it can target block classes instead of guessing.
**Raw data:** Orin `~/surface-census-20261108/` (`surface_census.py` + `census.json` — every number below is reproducible from that JSON).

## Method and its limits (read this first)

- **Read path:** the Thor lanes' byte-validated pure-python MCA/NBT reader (`mcprobe.py`, wedge-followon1) copied to the Orin and run THERE against the live saved region files. All five census areas lie inside one region file: `~/minecraft-server/world/dimensions/minecraft/overworld/region/r.0.-1.mca` — mtime **2026-11-09 00:26 UTC**, read 00:27–00:35 UTC, i.e. minutes after the server's last save of it.
- **Saved-data reads show the last-saved state.** A chunk not dirtied since its last save reads as of that save. In practice the surface is static: no citizen is in the world, nothing has dug or placed today, and the region file was re-saved at 00:26 UTC during this census window.
- **Column "top" = highest non-air block.** In this forest the top is usually TREE CANOPY, not the walking floor. Floor composition is therefore read from the walking lines, the step-edge pairs, ground-under-dressing, and the named-cell stacks — not from raw top counts alone. Both are given.
- **Step edge** = two horizontally adjacent columns whose top heights differ by exactly 1 (the +1 step-face geometry the veto is measured on, triple-007/016/017) or ≥2 (ledge/wall). Pairs are written low-block>high-block.
- **Placed-signature scan** covers the surface band (top−8 .. top+3) of every column for planks/tables/furnaces/chests/cobble/fences/torches/ladders/stairs/slabs/beds/signs/`dirt_path` etc. A deeply buried placed block would not be seen; surface objects — the kind a walker meets — would.
- **Nothing touched the live world:** no bot joined, no console command was issued, no file was written on the Orin except this lane's own work directory. Citizens' `.dat` files were read only for sha256 (see §5).

## 1. The headline contrast

Per-area composition (columns censused: clusters 625 each at r=12; controls 441 each at r=10):

| Area | grass top | leaves top (canopy) | stone top | leaf_litter top | grass tufts top | +1 full-to-full step pairs (listed) | per 100 cols | ledges ≥2 |
|---|---|---|---|---|---|---|---|---|
| A (41,-85) | 268 (42.9%) | 243 (38.9%) | 54 (8.6%) | 47 (7.5%) | 8 | 155 | 24.8 | 285 |
| B (35,-101) | 250 (40.0%) | 240 (38.4%) | 117 (18.7%) | 18 (2.9%) | 0 | 184 | 29.4 | 328 |
| C (28,-100) | 233 (37.3%) | 246 (39.4%) | 113 (18.1%) | 31 (5.0%) | 2 | 171 | 27.4 | 325 |
| Cody anchor (64,-93) | 180 (40.8%) | 127 (28.8%) | 24 (5.4%) | 100 (22.7%) | 7 | 42 | 9.5 | 188 |
| Vega anchor (63,-72) | 181 (41.0%) | 142 (32.2%) | 0 (0.0%) | 24 (5.4%) | 93 | 24 | 5.4 | 177 |

**The clusters carry 3–5× the density of +1 full-block step faces of the lived-in controls** (A 24.8, B 29.4, C 27.4 per 100 columns vs Cody anchor 9.5, Vega anchor 5.4), and they are the only areas with large exposed-stone surfaces (B 18.7%, C 18.1% of columns stone-topped, plus coal_ore exposures in A). The controls are plateaus; the clusters are the steep, stony, densely-canopied shoulder. The three cluster areas overlap each other (shared ground x 29–40, z −101..−88 is in all three radii) — they are three windows on ONE rough district, not three independent sites.

## 2. Per-cluster findings

### Cluster A (41,-85)

- Top blocks: grass_block 268, oak_leaves 220, stone 54, leaf_litter 47, birch_leaves 23, short_grass 8, coal_ore 5
- Dressing (non-full) top columns: 298 of 625. Ground under dressing: oak_leaves 175, grass_block 76, birch_leaves 16, oak_log 8, leaf_litter 7
- +1 step pairs (all): oak_leaves>oak_leaves ×131; grass_block>grass_block ×80; grass_block>leaf_litter ×71; stone>grass_block ×52; grass_block>short_grass ×17; stone>stone ×10; birch_leaves>birch_leaves ×9; coal_ore>grass_block ×7
- +1 step pairs (full-to-full only): grass_block>grass_block ×80; stone>grass_block ×52; stone>stone ×10; coal_ore>grass_block ×7; grass_block>stone ×6
- Leaf litter segment_amount histogram (thickness 1–4): {'2': 14, '1': 17, '3': 14, '4': 2}
- Water columns: 0. Pit columns (top ≤ median−2): 133 — samples are all the natural y=63 lowland floor in the shared SW district, **not** dug trenches (see §4).
- Placed signatures in surface band: **none**.
- Top-y range 63..81, median 67 (canopy-inclusive).

### Cluster B (35,-101)

- Top blocks: grass_block 250, oak_leaves 158, stone 117, birch_leaves 82, leaf_litter 18
- Dressing (non-full) top columns: 258 of 625. Ground under dressing: oak_leaves 129, birch_leaves 50, grass_block 39, oak_log 7, leaf_litter 4
- +1 step pairs (all): stone>grass_block ×85; oak_leaves>oak_leaves ×79; grass_block>grass_block ×67; grass_block>leaf_litter ×41; birch_leaves>birch_leaves ×28; stone>stone ×26; grass_block>stone ×6; oak_leaves>birch_leaves ×5
- +1 step pairs (full-to-full only): stone>grass_block ×85; grass_block>grass_block ×67; stone>stone ×26; grass_block>stone ×6
- Leaf litter segment_amount histogram (thickness 1–4): {'2': 4, '3': 8, '1': 6}
- Water columns: 0. Pit columns (top ≤ median−2): 197 — samples are all the natural y=63 lowland floor in the shared SW district, **not** dug trenches (see §4).
- Placed signatures in surface band: **none**.
- Top-y range 63..82, median 68 (canopy-inclusive).

### Cluster C (28,-100)

- Top blocks: grass_block 233, oak_leaves 196, stone 113, birch_leaves 50, leaf_litter 31, short_grass 2
- Dressing (non-full) top columns: 279 of 625. Ground under dressing: oak_leaves 155, grass_block 56, birch_leaves 27, oak_log 10, birch_log 3
- +1 step pairs (all): oak_leaves>oak_leaves ×107; grass_block>grass_block ×70; stone>grass_block ×70; grass_block>leaf_litter ×56; stone>stone ×25; birch_leaves>birch_leaves ×18; grass_block>stone ×6; grass_block>short_grass ×5
- +1 step pairs (full-to-full only): grass_block>grass_block ×70; stone>grass_block ×70; stone>stone ×25; grass_block>stone ×6
- Leaf litter segment_amount histogram (thickness 1–4): {'3': 14, '2': 7, '1': 8, '4': 2}
- Water columns: 0. Pit columns (top ≤ median−2): 238 — samples are all the natural y=63 lowland floor in the shared SW district, **not** dug trenches (see §4).
- Placed signatures in surface band: **none**.
- Top-y range 63..82, median 69 (canopy-inclusive).

### Controls (for contrast)

- **Cody anchor (64,-93):** tops grass_block 180, leaf_litter 100, oak_leaves 89, birch_leaves 38, stone 24, short_grass 7; +1 full-to-full pairs only 42; leaf litter 100 columns (22.7% — the **densest litter carpet of any area censused** is at Cody's anchor, EW line x 55–58); tufts 7.
- **Vega anchor (63,-72):** tops grass_block 181, short_grass 86, birch_leaves 79, oak_leaves 63, leaf_litter 24, tall_grass 7; +1 full-to-full pairs only 24; short/tall grass tufts 93 columns — a grassy clearing; litter 24.

## 3. Named cells — the pins themselves are plain

Vertical stacks (top−3 .. top+4) at the exact cells the bodies wedged on. Every one is a plain grass or stone column with air at feet and head — direct cell-level confirmation of triple-017 ("not the pin cells' block geometry"):

| Cell | Top | Stack (low→high) |
|---|---|---|
| A pin cell (PristineProbe/Geist) (41,-85) | grass_block @66 | 63 stone, 64 stone, 65 dirt, 66 grass_block, 67 air, 68 air, 69 air, 70 air |
| A pin cell south neighbour (PristineProbe settled 41.699,-84.318) (41,-84) | grass_block @67 | 64 stone, 65 dirt, 66 dirt, 67 grass_block, 68 air, 69 air, 70 air, 71 air |
| B pin cell (35.3,-100.7) (35,-101) | oak_leaves @74 | 71 air, 72 oak_leaves, 73 oak_leaves, 74 oak_leaves, 75 air, 76 air, 77 air, 78 air |
| B cluster point (36,-101) (36,-101) | stone @66 | 63 stone, 64 stone, 65 stone, 66 stone, 67 air, 68 air, 69 air, 70 air |
| C pin cell (28,-100) (28,-100) | grass_block @66 | 63 stone, 64 stone, 65 stone, 66 grass_block, 67 air, 68 air, 69 air, 70 air |
| stance pair W (Cody) (72,-101) | grass_block @62 | 59 stone, 60 stone, 61 stone, 62 grass_block, 63 air, 64 air, 65 air, 66 air |
| stance pair E (Cody) (73,-102) | grass_block @62 | 59 stone, 60 stone, 61 stone, 62 grass_block, 63 air, 64 air, 65 air, 66 air |
| Cody anchor (64,-93) | grass_block @66 | 63 stone, 64 dirt, 65 dirt, 66 grass_block, 67 air, 68 air, 69 air, 70 air |
| Vega anchor (63,-72) | grass_block @66 | 63 stone, 64 dirt, 65 dirt, 66 grass_block, 67 air, 68 air, 69 air, 70 air |

One exception to "plain": **the B pin cell (35,−101) stands under an oak canopy** — natural leaves (`persistent:false`, distance 1–2 from a trunk) at y 72–74 above a ~66 floor. The body there wedged in the canopy's shade, not inside the leaves; the leaves are overhead, and they are also the litter source for the whole district (§4, class 3/4).

## 4. Ranked validator-suspicious surface features (targets for the transplant lane)

Ranked by (presence at the clusters) × (plausibility as movement-validation geometry) × (discrimination vs the controls). Counts are from this census.

**1. +1 full-block step faces — grass_block↔grass_block and stone→grass_block.** The exact geometry of every measured veto: triple-007's +1 step-face clamp, PristineProbe's dispH 0.0 flat-face push. Cluster density 24.8–29.4 pairs/100 cols vs 5.4–9.5 at the controls. In B the single largest pair is stone>grass_block ×85; in C grass>grass ×70 and stone>grass ×70; in A grass>grass ×80. *Transplant target: an arm that flattens ONLY +1 faces (or swaps in G chunks and re-counts face density) tests this class directly.*

**2. Exposed stone (and coal_ore) at the walking surface.** Stone tops: B 117, C 113, A 54 (+5 coal_ore) columns vs Cody control 24, Vega control **0**. The cluster floors are part-stone bluff interleaved with grass at the same heights — every stone/grass boundary at Δy=1 is a class-1 face with a stone side. Tops alone cannot date the exposure (natural bluff vs erosion vs old digging are indistinguishable from above); as a block CLASS it is cleanly targetable (surface stone→grass/dirt swap arm).

**3. Leaf litter ON grass — the phantom step.** Litter occupies the block ABOVE its ground block, so in raw block data a littered column stands +1 over its bare neighbour (`grass_block>leaf_litter` pairs: A ×71, B ×41, C ×56) while physically it is a collision-free film a walker passes through. It is the one surface feature that ACCUMULATES with lived time (leaf decay → litter), i.e. it is the visible form of triple-019's "grown-over, as saved" carrier. **Honest counter-indication:** litter is DENSEST at Cody's anchor control (100 columns, 22.7%, pairs ×124) — ground citizens demonstrably crossed — so litter alone is a weak sole-carrier candidate. Rank it as the leading CO-FACTOR: a litter-stripped arm is cheap and decisive either way. Segment amounts 1–4 all present (A: 1×17, 2×14, 3×14, 4×2).

**4. Canopy density and canopy-edge walls.** Leaves are the top block on ~39% of cluster columns vs ~29–32% at controls; walking lines repeatedly hit WALL+4..+9 transitions where a canopy column abuts a floor column (the walker passes UNDER, the column-top profile jumps 7–9 blocks). B's pin cell is under canopy. Leaves are also class 3's source. *Transplant target: canopy-cleared arm over the cluster chunks.*

**5. Grass tufts (short_grass/tall_grass) — deprioritised.** Densest by far at Vega's anchor control (86+7 top columns), ground she walked; sparse at the clusters (A 8, B 0, C 2). Negative evidence: keep out of the first transplant round.

**Exonerated at the surface (zero found in all five areas):**
- **Player-placed blocks: NONE.** No planks, crafting tables, furnaces, chests, cobble, fences, torches, ladders, stairs, slabs, signs or dirt_path in any area's surface band. Whatever the carrier is, it is not visible citizen construction at feet/head level. (Citizen building exists in this world — Cody's hut, Vega's table at (41,64,−56) — but none of it is inside the cluster/control windows.)
- **Water: 0 columns in all five areas.** The pond/swim trap that ate the G-world battery (triple-019, S0/S2) has NO live-world analogue in the clusters.
- **Snow, flowers, saplings, crops: 0** as top blocks anywhere censused.
- **Dug pits/trenches: no signature separable from terrain.** "Pit" columns (≤ median−2) are the shared natural y=63 lowland floor SW of the clusters, continuous across all three windows — regional relief, not digging.

## 5. Walking lines (verbatim from census.json)

Format: `coord:block@top_y[flags]` — NONFULL = non-full top block; STEP±1 / WALL / DROP = height change from the previous cell; litterxN = leaf_litter segment_amount.

### A (41,-85)

E–W along z=-85:

`29:oak_leaves@73[NONFULL] | 30:oak_leaves@73[NONFULL] | 31:oak_leaves@71[NONFULL,DROP-2] | 32:oak_leaves@72[NONFULL,STEP+1] | 33:oak_leaves@74[NONFULL,WALL+2] | 34:oak_leaves@74[NONFULL] | 35:oak_leaves@74[NONFULL] | 36:grass_block@66[DROP-8] | 37:stone@65[STEP-1] | 38:stone@65 | 39:grass_block@66[STEP+1] | 40:grass_block@66 | 41:grass_block@66 | 42:grass_block@67[STEP+1] | 43:grass_block@67 | 44:grass_block@65[DROP-2] | 45:grass_block@65 | 46:stone@64[STEP-1] | 47:stone@64 | 48:grass_block@65[STEP+1] | 49:grass_block@67[WALL+2] | 50:grass_block@65[DROP-2] | 51:grass_block@67[WALL+2] | 52:grass_block@67 | 53:grass_block@67`

N–S along x=41:

`-97:grass_block@66 | -96:grass_block@66 | -95:grass_block@67[STEP+1] | -94:grass_block@68[STEP+1] | -93:grass_block@68 | -92:grass_block@68 | -91:leaf_litter@69[NONFULL,litterx1,STEP+1] | -90:oak_leaves@73[NONFULL,WALL+4] | -89:oak_leaves@74[NONFULL,STEP+1] | -88:oak_leaves@75[NONFULL,STEP+1] | -87:oak_leaves@74[NONFULL,STEP-1] | -86:oak_leaves@73[NONFULL,STEP-1] | -85:grass_block@66[DROP-7] | -84:grass_block@67[STEP+1] | -83:oak_leaves@72[NONFULL,WALL+5] | -82:oak_leaves@74[NONFULL,WALL+2] | -81:oak_leaves@74[NONFULL] | -80:oak_leaves@74[NONFULL] | -79:oak_leaves@72[NONFULL,DROP-2] | -78:oak_leaves@71[NONFULL,STEP-1] | -77:oak_leaves@71[NONFULL] | -76:oak_leaves@72[NONFULL,STEP+1] | -75:oak_leaves@71[NONFULL,STEP-1] | -74:oak_leaves@71[NONFULL] | -73:grass_block@66[DROP-5]`

### B (35,-101)

E–W along z=-101:

`23:grass_block@69 | 24:grass_block@69 | 25:grass_block@69 | 26:grass_block@67[DROP-2] | 27:stone@66[STEP-1] | 28:stone@65[STEP-1] | 29:stone@65 | 30:stone@65 | 31:stone@65 | 32:grass_block@67[WALL+2] | 33:oak_leaves@74[NONFULL,WALL+7] | 34:oak_leaves@74[NONFULL] | 35:oak_leaves@74[NONFULL] | 36:stone@66[DROP-8] | 37:stone@65[STEP-1] | 38:stone@65 | 39:stone@65 | 40:grass_block@66[STEP+1] | 41:grass_block@68[WALL+2] | 42:grass_block@68 | 43:grass_block@68 | 44:oak_leaves@70[NONFULL,WALL+2] | 45:oak_leaves@72[NONFULL,WALL+2] | 46:oak_leaves@72[NONFULL] | 47:oak_leaves@72[NONFULL]`

N–S along x=35:

`-113:leaf_litter@69[NONFULL,litterx1] | -112:leaf_litter@69[NONFULL,litterx2] | -111:birch_leaves@72[NONFULL,WALL+3] | -110:birch_leaves@72[NONFULL] | -109:birch_leaves@71[NONFULL,STEP-1] | -108:grass_block@69[DROP-2] | -107:grass_block@67[DROP-2] | -106:stone@66[STEP-1] | -105:grass_block@67[STEP+1] | -104:grass_block@67 | -103:grass_block@69[WALL+2] | -102:oak_leaves@73[NONFULL,WALL+4] | -101:oak_leaves@74[NONFULL,STEP+1] | -100:stone@66[DROP-8] | -99:stone@65[STEP-1] | -98:stone@65 | -97:stone@64[STEP-1] | -96:grass_block@63[STEP-1] | -95:grass_block@63 | -94:grass_block@63 | -93:oak_leaves@72[NONFULL,WALL+9] | -92:oak_leaves@74[NONFULL,WALL+2] | -91:oak_leaves@74[NONFULL] | -90:oak_leaves@74[NONFULL] | -89:oak_leaves@72[NONFULL,DROP-2]`

### C (28,-100)

E–W along z=-100:

`16:grass_block@66 | 17:grass_block@66 | 18:grass_block@66 | 19:grass_block@68[WALL+2] | 20:grass_block@69[STEP+1] | 21:grass_block@69 | 22:grass_block@69 | 23:grass_block@69 | 24:grass_block@69 | 25:leaf_litter@70[NONFULL,litterx3,STEP+1] | 26:grass_block@69[STEP-1] | 27:grass_block@67[DROP-2] | 28:grass_block@66[STEP-1] | 29:stone@66 | 30:grass_block@67[STEP+1] | 31:grass_block@67 | 32:grass_block@67 | 33:oak_leaves@72[NONFULL,WALL+5] | 34:oak_leaves@74[NONFULL,WALL+2] | 35:stone@66[DROP-8] | 36:stone@66 | 37:stone@65[STEP-1] | 38:stone@65 | 39:stone@65 | 40:stone@65`

N–S along x=28:

`-112:grass_block@69 | -111:grass_block@66[DROP-3] | -110:grass_block@67[STEP+1] | -109:oak_leaves@74[NONFULL,WALL+7] | -108:oak_leaves@74[NONFULL] | -107:oak_leaves@76[NONFULL,WALL+2] | -106:oak_leaves@74[NONFULL,DROP-2] | -105:oak_leaves@74[NONFULL] | -104:stone@66[DROP-8] | -103:stone@65[STEP-1] | -102:stone@65 | -101:stone@65 | -100:grass_block@66[STEP+1] | -99:grass_block@67[STEP+1] | -98:oak_leaves@73[NONFULL,WALL+6] | -97:oak_leaves@75[NONFULL,WALL+2] | -96:oak_leaves@75[NONFULL] | -95:oak_leaves@75[NONFULL] | -94:grass_block@67[DROP-8] | -93:grass_block@67 | -92:oak_leaves@81[NONFULL,WALL+14] | -91:oak_leaves@81[NONFULL] | -90:oak_leaves@82[NONFULL,STEP+1] | -89:oak_leaves@81[NONFULL,STEP-1] | -88:oak_leaves@81[NONFULL]`

### Cody anchor (64,-93)

E–W along z=-93:

`54:grass_block@67 | 55:leaf_litter@68[NONFULL,litterx1,STEP+1] | 56:leaf_litter@68[NONFULL,litterx2] | 57:leaf_litter@68[NONFULL,litterx2] | 58:leaf_litter@67[NONFULL,litterx3,STEP-1] | 59:short_grass@67[NONFULL] | 60:grass_block@66[STEP-1] | 61:grass_block@66 | 62:grass_block@66 | 63:grass_block@66 | 64:grass_block@66 | 65:grass_block@66 | 66:grass_block@66 | 67:birch_leaves@70[NONFULL,WALL+4] | 68:birch_leaves@70[NONFULL] | 69:leaf_litter@67[NONFULL,litterx2,DROP-3] | 70:birch_leaves@70[NONFULL,WALL+3] | 71:leaf_litter@67[NONFULL,litterx2,DROP-3] | 72:oak_leaves@69[NONFULL,WALL+2] | 73:oak_leaves@69[NONFULL] | 74:oak_leaves@69[NONFULL]`

N–S along x=64:

`-103:grass_block@66 | -102:grass_block@66 | -101:grass_block@66 | -100:grass_block@66 | -99:grass_block@66 | -98:oak_leaves@70[NONFULL,WALL+4] | -97:oak_leaves@70[NONFULL] | -96:oak_leaves@70[NONFULL] | -95:oak_leaves@70[NONFULL] | -94:grass_block@66[DROP-4] | -93:grass_block@66 | -92:grass_block@66 | -91:grass_block@66 | -90:grass_block@66 | -89:leaf_litter@68[NONFULL,litterx1,WALL+2] | -88:leaf_litter@68[NONFULL,litterx2] | -87:oak_leaves@71[NONFULL,WALL+3] | -86:oak_leaves@71[NONFULL] | -85:oak_leaves@71[NONFULL] | -84:grass_block@66[DROP-5] | -83:grass_block@67[STEP+1]`

### Vega anchor (63,-72)

E–W along z=-72:

`53:grass_block@67 | 54:grass_block@67 | 55:grass_block@67 | 56:leaf_litter@68[NONFULL,litterx1,STEP+1] | 57:short_grass@68[NONFULL] | 58:short_grass@68[NONFULL] | 59:grass_block@67[STEP-1] | 60:grass_block@67 | 61:leaf_litter@68[NONFULL,litterx3,STEP+1] | 62:grass_block@66[DROP-2] | 63:grass_block@66 | 64:grass_block@64[DROP-2] | 65:birch_leaves@72[NONFULL,WALL+8] | 66:birch_leaves@72[NONFULL] | 67:birch_leaves@72[NONFULL] | 68:birch_leaves@70[NONFULL,DROP-2] | 69:grass_block@66[DROP-4] | 70:grass_block@66 | 71:grass_block@66 | 72:short_grass@67[NONFULL,STEP+1] | 73:tall_grass@68[NONFULL,STEP+1]`

N–S along x=63:

`-82:oak_leaves@71[NONFULL] | -81:oak_leaves@71[NONFULL] | -80:oak_leaves@71[NONFULL] | -79:oak_leaves@71[NONFULL] | -78:oak_leaves@71[NONFULL] | -77:birch_leaves@72[NONFULL,STEP+1] | -76:birch_leaves@72[NONFULL] | -75:birch_leaves@74[NONFULL,WALL+2] | -74:birch_leaves@73[NONFULL,STEP-1] | -73:birch_leaves@72[NONFULL,STEP-1] | -72:grass_block@66[DROP-6] | -71:grass_block@66 | -70:leaf_litter@68[NONFULL,litterx3,WALL+2] | -69:grass_block@67[STEP-1] | -68:grass_block@67 | -67:grass_block@67 | -66:short_grass@68[NONFULL,STEP+1] | -65:grass_block@67[STEP-1] | -64:grass_block@67 | -63:grass_block@67 | -62:grass_block@66[STEP-1]`

## 6. Cameraman and daylight-hold status (Orin, checked 2026-11-09 00:24–00:35 UTC)

**HOLD STATE: HEALTHY — landing-verified, no action taken (status check only).**

- Guarded cameraman process: **pid 476846**, `python3 cameraman.py`, started **2026-11-08T19:31:39Z** (`/proc` start time; the log file spans earlier incarnations back to Nov 7). Its hard cap in `cameraman.py` is `MAX_RUNTIME_S = 8h` → this instance's cap is **2026-11-09T03:31:39Z**; renewal is the renewal cron's business, not this lane's.
- Daylight refreshes: **201 "VERIFIED LANDED" lines** in `~/cameraman/cameraman.log` in total; cadence ~5 min; the seven most recent landed **23:58:45, 00:03:58, 00:09:05, 00:14:08, 00:19:16, 00:24:26, 00:29:35 UTC**. The server log corroborates independently — e.g. `[00:24:25] MagnusandMouse issued server command: /time set 1000` → `[MagnusandMouse: Set minecraft:overworld to 1000 tick(s)]`.
- The only HOLD-LOST line in the entire log is **2026-11-08T07:31:04Z — the deliberate guard test**. No alarm since; no consecutive failures.
- World clock state: each refresh resets time-of-day to tick 1000 (morning); between refreshes it advances ≈5 min × 20 tps ≈ 6,000 ticks, so the held band is ≈1000–7100 — always daylight. (This build's `level.dat` Data carries no `DayTime` field — only total `Time` = **5,314,049** ticks at the 00:24:44Z save — so the held band is established from the landed-command record, the only honest source.)
- Film activity continues normally (CUT/POV lines through 00:29 UTC, subject Cody).

## 7. Compliance

- Citizens untouched and verified: `.dat` sha256 located by hash in the live `world/players/data/` (79 files) match the triple-016/017/018/019 baselines exactly — **Cody e8757760…a5ca4, Geist 8ecbd230…94f0, Vega 4b65ff2e…edc6**. Files were hashed, never opened for content.
- Read-only throughout: region/level/playerdata reads only; no bot joined the live world; no command was issued to the live server; the only writes were this lane's work dir on the Orin (`~/surface-census-20261108/`) and this document on the Thor.

— Orin surface-census lane, 2026-11-08 (filed 2026-11-09 UTC). Sources: triple-019 + OPERATIONS §9 (+ addenda triple-016/017/018) read before starting; live region data as above.
