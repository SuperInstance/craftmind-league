# ROUTE RELIEF SURVEY 2026-11-08 — corridors for the league's pending moves

**Lane:** Orin specialty (front room; the world lives on this box), read-only.
**Filed:** 2026-11-09 ~02:40 UTC (2026-11-08 evening AKST).
**Purpose:** triple-020 closed the wedge arc — the veto is surface **relief geometry** (dense +1 full-block step faces). Movement is therefore now an engineering question: which lines a driver may be sent down, and what grading the failing lines would cost. This survey measures candidate corridors from each citizen's parked position to their next objectives. **It feeds a relaunch charter decision; it authorises no relaunch itself.**
**Raw data:** Orin `~/route-relief-survey-20261108/` (`route_survey.py`, `route_survey.json`, `scan_entities.py`, `entities.json`), with copies filed alongside the census raw data in Orin `~/surface-census-20261108/`. Every number below is reproducible from `route_survey.json`.

## Method (census-identical headline; read the caveats)

- **Read path:** the census lane's byte-validated pure-python MCA/NBT reader (`mcprobe.py`) run on the Orin against the live saved region files (`world/dimensions/minecraft/overworld/region/r.0.-1.mca` covers all corridors; animal positions from the saved `entities/` region files, same read-only route). No bot joined, no console command was issued, no live file was written.
- **Headline metric — exactly the census method:** a *step edge* is two horizontally adjacent columns (E+S neighbours) whose **top** heights (top = highest non-air block, canopy inclusive) differ by exactly 1, counted only when both tops are **full** blocks (the census NONFULL dressing set — leaves, leaf_litter, tufts, snow, crops, etc. — excluded). Density = full-to-full +1 edges per 100 columns. Reference bands from the census: **walked anchors 5.4–9.5** (Vega anchor 5.4, Cody anchor 9.5); **veto clusters 24.8–29.4** (A 24.8, C 27.4, B 29.4).
- **Sampling-window caveat (honest):** the census sampled square areas (r=10/12); this survey samples **corridor strips 5 blocks wide** (columns within 2.5 blocks of the centreline). Same edge rule and same normalisation, different window shape — a narrow strip along a rough line can read higher than a square over the same ground (Geist's first legs do; see §5). Treat corridor densities as comparable in kind and direction, with the strip caveat attached, not as identical instruments.
- **Floor companion metric (labelled, not the headline):** *floor* = highest block that is neither air nor dressing (i.e. the walking surface under canopy/litter). `floorstep/100` counts +1 floor edges per 100 strip columns the same way. Where a corridor runs under closed canopy, the headline can read ~0 while the walker still meets a stepped floor (the census's cluster squares had enough open grass/stone tops to register; Cody's NE corridor does not). **Rankings below use the headline, overridden where the floor companion contradicts it — each such case is flagged.**
- **Water:** zero water columns in **every** corridor strip surveyed — the pond trap has no analogue on any of these lines.
- **Canopy note:** `canopyTop` = strip columns whose top block is leaves. High canopy means shade and litter, not blockage (the walker passes under); it matters because it masks the headline metric (above) and because canopy-edge columns are where floor spikes occur (isolated tree-trunk columns read as floor 75–82 on a centreline — single columns, sidestep ±1–2 blocks; strip medians are the operative figure wherever they appear).
- **Grade estimate (rough, labelled):** `grade~` = Σ|floor − modal floor| over strip columns = blocks to add/remove to plane the whole 5-wide strip at its modal floor level. FLATTEN-arm-style grading of just the walked centreline (1–2 wide, level each column to a smoothed profile) costs a fraction of this — treat `grade~` as the strip-wide upper bound and ~⅓ of it as the centreline working figure. Triple-020's FLATTEN levelled 47,044 cells across 9 chunks to clear a district; the corridor grades below are two orders smaller.
- **Food targets are from saved data, not invention:** animal positions were read from the saved entity store (positions as of last save; animals wander — a charter must re-census same-hour before any launch, per standing rules).

## Saved food ground (entity store, read 2026-11-09 ~02:30 UTC)

- **East herd (Vega's, triple-011):** cows at (113.7, 72, −57.2), (115.8, 72, −58.7), (114.4, 72, −65.1); pig at (107.8, 69, −48.3) — clustered around the eastMeatRun terminus (112, −59), 57.6–59.5 blocks from Vega's park, 56.7–65.0 from Cody's.
- **North-east herd (new, nearest to Cody):** chicken (104.5, 71, −121.9); cows (105.3, 70, −129.4), (111.8, 70, −126.1), (113.7, 70, −131.7), (112.8, 69, −137.4) — a five-cow-plus-chicken cluster around (110, −128), ~47 blocks from Cody's park (nearest animal 38.2). Nothing edible is saved closer to Cody in any direction; the next-nearest groups are ≥54 blocks away.

## 1. Headline table

Densities = census-method step faces per 100 strip columns (weighted overall per corridor). Bands: walked 5.4–9.5 · veto 24.8–29.4.

| Corridor | Length | Overall | Worst segment | Verdict in one line |
|---|---|---|---|---|
| Cody → chest, via anchor | 23.0 | **10.8** | park→anchor 12.2 | Just above walked band; best Cody chest line |
| Cody → chest, direct | 22.0 | 13.2 | west leg 15.8 | Worse than via-anchor on both legs |
| Cody → food, NE herd | 49.1 | **6.2** headline / floor-flagged | first leg 16.5 (floorstep 31.3) | Shortest food; first leg is the price |
| Cody → food, east herd (join v3) | 58.9 | 11.7 | park→join 21.6 | Longer, and its first leg is near-veto |
| Vega → east herd (eastMeatRun v3, 19 wps verbatim) | 71.4 | **6.5** | wp11 (85→88,−82) 30.6 | Corridor stands; one 3-block veto-density pinch |
| Vega → chest, direct | 18.0 | **6.9** | leg A 7.8 | **Inside the walked band — best chest approach in the league** |
| Vega → chest, via anchor | 19.2 | 10.8 | anchor→chest 11.3 | The anchor detour is a cost, not a help |
| Geist → east exit → Cody anchor | 29.7 | 34.0 | inside-square leg 54.7 | Starts inside the veto district — see §5 |
| Geist → SE exit → Vega anchor | 39.0 | 33.5 | inside-square leg 44.5 | No relief advantage over the east exit |

## 2. Cody (parked 71.685, 63, −102.313 · hp 1.33 · food 9)

Cody's park sits on the lowland floor SW of his homestead (centreline floor 62–63 at the park cell, rising to 66 at the anchor). Every Cody corridor's first move is that climb.

### 2a. To the commons chest site (63, 68, −82)

**Via anchor (recommended):** (72,−102) → (64,−93) → (63,−82).
- park→anchor: 12.2/100 (floorstep 25.6), 82 cols, floor median 66, range 61–71, canopyTop 25, water 0. Centreline floor profile: 63, 65, 65, 65, 66, 66, 66, 66, 66, 66 at the anchor — a two-step climb in the first three blocks, then flat 66. This is the ground Cody demonstrably crossed (his anchor window measured 9.5 as an area).
- anchor→chest: 9.2/100 (floorstep 22.4), 76 cols, floor median 66, range 64–72, canopyTop 30, water 0. Centreline: flat 66 for four blocks, one +1 rise to 67 at (64,−89), then flat 67 into the chest site (floor 67 at (63,−82); the site itself was verified empty in the commons prep).
- Grade option: none needed at these densities; if the charter wants the walked band strictly, centreline smoothing of park→anchor is ~25 blocks (strip bound 79).

**Direct diagonal:** (72,−102) → (67,−92) → (63,−82): 15.8 then 10.7 — dominated by via-anchor on the first leg and no better on the second. **Rejected.**

**Walkable line (driver-ready):** from park, climb NE to the anchor pad (64,−93) on the flat-66 shelf, then due south along x≈63–64 on floor 66→67 to (63,−82). One +1 step at (64,−89) is the only named face on the line.

### 2b. To food (his relaunch needs food first)

**NE herd (recommended, with the flag):** (72,−102) → (88,−112) → (104,−122) → (112,−130).
- park→midground: headline 16.5, floorstep 31.3, floor median 65, range 61–76, canopyTop 54/115. This first leg is the corridor's price: it climbs Cody's lowland (62–65) onto the NE shoulder. It sits between the bands on the headline and in veto territory on the floor companion — budget dig-face hops (triple-007) or grade it (strip bound ~201 blocks; centreline working figure ~65).
- midground→chicken ground: headline **0.0** — a canopy artefact (86 of 115 tops are leaves). Floor companion 17.4/100, floor median 70, range 67–76: a genuinely stepped forest floor, mid-band, the best long leg in this survey. Centreline floor is a smooth 69→70 ramp.
- chicken→cow ground: headline 0.0 (canopy 75/77), floorstep **9.1** — walked band on the floor — floor median 69. Two isolated trunk spikes (floor 78–81 at (106..108, −124..126)) are single tree columns on the centreline; sidestep ±2.
- Total 49.1 blocks to a five-cow herd — vs 58.9 to the east herd.

**East herd via the v3 corridor join:** (72,−102) → (80,−90) → (88,−82) → v3 line → (112,−59). First leg 21.6/100 (near-veto; the climb out of the lowland SE-ward is rougher than the NE climb), second 15.6, then it inherits the v3 corridor's good eastern half (2.4–12.2). Longer *and* rougher at the start. **Rejected as Cody's primary**; retained as the fallback if the NE herd has dispersed at re-census.

**Walkable line (driver-ready):** NE from park to (88,−112) accepting the climb (dig-face budget on the first leg), then follow the floor-69/70 forest shelf ESE through (104,−122) to the cow cluster around (110,−128). At hp 1.33 this remains a *charter* judgement, not a survey one: the survey says the ground is traversable at these densities; it does not say a 1.33 hp body should be sent — the food plan and the margin math belong to the charter.

## 3. Vega (parked 56.690, 65, −65.304 · hp 3 · food 2)

### 3a. To food — eastMeatRun v3 corridor, re-measured in full

The v3 corridor (19 waypoints verbatim from `lineage-b/library/eastMeatRun.js`) re-surveys at **6.5/100 overall — inside the walked band** — confirming triple-011's BFS finding (57 cells, 10 dig-face-able +1 faces) on the census instrument. Per-leg detail that matters:

- Legs wp0–wp10 (park to (85,−82)) run 0.0–19.4 headline; several read 0.0 under canopy with floorstep 25–47 — the known canopy mask; triple-011 already walked the first 9 blocks and BFS-cleared the rest at ≤+1, so these floor figures are *stepped-but-legal* (+1 faces, dig-face-able), not walls: floor ranges per leg stay within 63–73 with no ≥2 centreline ledge except isolated trunk columns.
- **The pinch: wp11, (85,−82) → (88,−82), headline 30.6/100 — veto band.** Three blocks along z=−82 where the corridor crosses the rise onto the floor-68 shelf (centreline 67,67,68,68,68; tops almost all grass — this one is real, not canopy-masked). It is exactly the class of face triple-011's dig-face escalation was built for (3 cycles/waypoint), and it is also the cheapest grade in the survey: strip bound ~16 blocks to plane at modal 68 (centreline ~5). **Recommendation to the charter: pre-grade or dig-face-budget this one 3-block pinch explicitly; the rest of the corridor needs neither.**
- Eastern half (wp12→herd) runs 0.0–17.5, floor median rising 68→71, ending on open grass (canopyTop 0 on the last two legs) at the herd ground.
- The NO-GO logic of triple-011 is unchanged by relief: at food 2 the corridor was never the binding constraint — margin was. This survey removes relief as an unknown; it does not restore margin.

### 3b. To the commons chest site

**Direct (recommended):** (57,−65) → (60,−73) → (63,−82): **7.8 then 6.1 — both legs inside the walked band**, floor median 67 throughout, centreline essentially flat 66–67 the whole way (one −1 dip at her park cell). 18.0 blocks. This is the cleanest approach to the chest site measured, from either citizen.
**Via her anchor** (63,−72): 10.3 then 11.3 — the anchor leg adds relief for no benefit. **Rejected.**

**Walkable line (driver-ready):** SE from park on the diagonal through (60,−73), floor 67, straight into (63,−82). If a citizen walks the chest in, the survey's answer is: **Vega's direct line is the route** (subject to her food state — she cannot be the walker until the margin problem is solved; the line is equally the approach for whoever places/escorts).

## 4. The chest site approaches, compared

| Approach | Overall | Worst leg | Floor median |
|---|---|---|---|
| Vega direct | **6.9** | 7.8 | 67 |
| Cody via anchor | 10.8 | 12.2 | 66 |
| Vega via anchor | 10.8 | 11.3 | 67 |
| Cody direct | 13.2 | 15.8 | 66–67 |

Both citizens can reach (63,−82) on lines at or near the walked band. The placement blocker is no longer route relief; it remains what it was — a walking body with the margin to go.

## 5. Geist (parked 34.5, 67, −98.5 · hp ~13.8 · food 20)

Geist is parked **inside** the veto district — his park cell sits between census clusters B (35,−101) and C (28,−100). Both exits therefore start with a veto-density leg; this is a fact of his geography, not a route-choice failure, and his own record agrees (collect live-verified, but movement face-specific and hard-won; S1 not passed).

- **East exit (recommended of the two):** (35,−99) → (48,−97) → (64,−93). Inside-square leg: **54.7/100** (floorstep 57.0) — far above the veto band, with the strip caveat (5-wide strip; stone tops 44/86 — the stony bluff shoulder). But note the centreline itself: floor 65,65,65,65,65,65,66,66,65,65,65,65,64,65 — nearly flat. The density lives in the strip around the line, which is precisely the triple-020 geometry (validator vs surrounding relief), so the honest reading is: *the line looks walkable and the district says veto* — Geist's own pin history at (41,−85)/(36,−101) is this exact ground. Outside the square, east-edge→Cody-anchor falls to 17.1 (floor median 66, flat 65→66 centreline) — ordinary rough ground.
- **SE exit:** (35,−99) → (47,−86) → (57,−76) → (63,−72): 44.5, then 39.6 (this leg is still rough well outside the square — the shoulder runs SE too), then 3.4 into Vega's anchor. Longer (39.0 vs 29.7) with no relief advantage. **Rejected.**
- **Grade option — with a hard constraint:** the inside-square leg's strip bound is ~79 blocks to plane at modal 65, the cheapest big grade in the survey — **but it lies inside spawn protection (x 16–48, z −112..−80), where citizen digs are server-cancelled** (triple-011's apple-route evidence). A citizen cannot grade Geist out. Grading this leg is an *operator/op decision for the charter to take explicitly*, or Geist's resume keeps the standing protocol (operator hold, ≤2-block hops) across ~13 blocks of veto district to the x=48 edge, after which his ground is unremarkable. The survey flags this as the single place where relief, protection, and a citizen's resume protocol intersect.
- Collecting ground outside the square, once out: the Cody-anchor shelf (64,−93, floor 66, area density 9.5) east, or the Vega-anchor clearing (63,−72, area density 5.4) south-east — both are ground citizens have demonstrably worked.

## 6. Ranked recommendations (per citizen)

- **Cody — food: NE herd line** (72,−102) → (88,−112) → (104,−122) → cow cluster (110,−128). 49 blocks, headline 6.2 overall; price = first leg (16.5 headline / 31.3 floorstep; dig-face budget or ~65 centreline blocks of grading). East-herd join is the fallback (rougher start, longer). **Chest: via anchor** (10.8), flat-66 shelf then the x≈63–64 line south to (63,−82), one named +1 face at (64,−89).
- **Vega — food: the v3 corridor as frozen** (6.5 overall), with the wp11 pinch at (85→88,−82) pre-graded (~5 centreline blocks) or dig-face-budgeted — relief is not her blocker; margin is, and remains the charter's problem. **Chest: direct diagonal** (6.9) — the league's cleanest chest approach.
- **Geist — east exit only**, and only under his standing resume protocol (same-hour census, operator hold, ≤2-block hops) or an explicit charter decision to grade the protection-square leg by other hands; past x=48 his ground drops to 17.1 and then to the walked anchors. SE exit rejected.

Every recommended line's worst *sustained* ground sits at or below ~17/100 on the census instrument — between the walked band (5.4–9.5) and the veto band (24.8–29.4), and far from the clusters' 25–29 — with the three named exceptions priced individually: Cody's NE first leg (floor-flagged), Vega's wp11 pinch (30.6, 3 blocks, ~5 blocks to grade), and Geist's first 13 blocks (in-district, protection-locked).

## 7. Compliance

- Citizens untouched and verified: `.dat` sha256 in the live `world/players/data/` (116 files) match the baselines at start and handback — **Cody e8757760…a5ca4, Geist 8ecbd230…94f0, Vega 4b65ff2e…edc6**. Files were hashed, never opened for content.
- Read-only throughout: saved region/entity data only; no bot joined the live world; no command was issued to the live server; no citizen was relaunched. Writes were confined to this lane's Orin work directory (`~/route-relief-survey-20261108/`), the raw-data copies alongside the census's, and this document on the Thor.
- This survey is evidence for a relaunch charter. It is not a relaunch, a food plan, or a margin decision.

— Orin route-relief survey lane, 2026-11-08. Sources read before starting: SURFACE-CENSUS-20261108 (method + bands), OPERATIONS.md (spawn protection §, spawn-country warning, triple-011 §), triple-011 + `eastMeatRun.js` v3 (Vega corridor + herd), triple-020 via OPERATIONS §9 (relief verdict + FLATTEN arm).
