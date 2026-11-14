# Mob map — 2026-11-07 (Night Priority 7: saturation survey + safe corridors)

Full data: `mob-map-20261107.json` (same directory). Declared in `pulse/ledger.jsonl`
as `mob-saturation-survey-20261107`; verdict entry `mob-saturation-survey-verdict-20261107`.

## Method (no-body, read-only)

Parsed the Orin server's saved entity store directly —
`world/dimensions/minecraft/overworld/entities/*.mca` (4 region files, md5-verified
copies, snapshot of the store as last written 07:20Z, 2026-11-08) — on the Thor.
No login, no bot body, no op commands, no world edits; the playerdata sample-clone
hazard therefore never arises. Every persisted entity (1,261) was read; 294 are
hostile-class. Surface layering uses the league's own column surveys
(`shoulder-survey.json`, `cell-survey.json`, `prep-scan-before.json`,
`prep-scan-night-before.json`, 1,501 columns merged): a hostile is "surface" when it
stands within −1.5/+1.2 of its column top, "pocket" when ~2.5 below the top in the
hollow row, "underground" otherwise; outside the survey span, y≥62 is
"surface-assumed". Daytime persistence is read from the entities themselves:
`Paper.ShouldBurnInDay`, helmet slot in `equipment`, canopy headroom from the
survey columns. Caveat: this is the *saved* population — a mob in a chunk unloaded
since the autosave keeps its last saved position and only re-enters play when its
chunk loads again.

## The headline: the saturation is a cave population, and tonight was a hold failure

- 172 of 294 hostiles are deep underground (caves; the world also carries 744 bats).
  Only ~100 are in the surface band, scattered over the whole explored map — no
  8×8 surface cell in the citizens' geography holds more than 2.
- The spawn→homestead working band (x26..72, z−108..−80) holds **six** persisted
  surface hostiles. The homestead pad and apron-12 hold **zero** (nearest: zombie
  (63.2, 68, −88.8) at the apron-12 edge, unhelmeted — burns at dawn). The Trial-7
  work shoulder (68.5, −87.7) is **empty now**; the Trial-6 birch-stand box is empty.
- Trial 7's corridor grind (7 deaths in 3.5 min) is **not** reproduced by the
  standing population: those killers were night-window spawns from the old leaky
  hold, since despawned or burned. The map says this plainly rather than
  retro-fitting the verdict.
- At capture the world was in an **unheld night** (timeOfDay ≈18–19k at
  07:12–07:13Z; last cameraman `/time set 1000` at 05:58:42Z; ~70 Cody mob-death
  lines in the server log; Cody emergency-held offline 07:21:13Z, relaunched
  07:22:49Z by the Priority-2 lane). The lethal variable tonight was the hold,
  not a standing army.

## Standing threats that survive daylight

Only four daylight-permanent hostiles stand in citizen geography (items 2–3),
plus one pocket-persistent (item 4):

1. **Golden-helmet skeleton, (0.5, 67, −93.5)** — Chebyshev 10 from Geist's anchor
   (7, −85), inside his west collecting apron. Helmeted undead do not burn: this
   is a permanent day-and-night ranged threat at his door. Filed to the Geist
   lane as a ledger note (`mob-map-geist-apron-warning-20261107`).
2. **Creeper (20.5, 69, −93.8)** — on the spawn→Geist west line, apron-24 for
   Geist, west edge of the spawn square. Creepers never burn.
3. **Creepers (70.2, 67, −80.5) NE and (69.6, 67, −107.5) SE** — both Chebyshev 16
   from Cody's homestead anchor, on the apron's outer rim, also inside Vega's
   apron-24/12 edge. Daylight-permanent.
4. **Pocket skeleton (36.6, 64.9, −92.9)**, hp 11, unhelmeted — stands ~2.5 below
   the surveyed column top in the plateau hollow row, 2 blocks from the Trial-8
   pin cell, 1.1 south of the z=−94 march line. Pocket-shaded: the exact Trial-7
   daylight-kill profile. Treat as daylight-persistent until visually cleared.

Everything else undead in the working geography is unhelmeted with
ShouldBurnInDay=1 and no canopy cover in the survey record: it burns at dawn.
Spiders and endermen persist by day but are neutral unless provoked/looked at —
including the spider sitting in the canopy at (41.7, 71.1, −87.8) above the
north-shelf route. Spawn reasons: 293 NATURAL, 1 LIGHTNING (the zombified piglin
at (1.6, 68, −197.3), far north, neutral) — no spawner/reinforcement artefacts.

## Safe corridors (under a working daylight hold)

- **Spawn → homestead, z=−94 row (Trial-8 march line):** one threat only, the
  pocket skeleton at the west end — pass wide on the z≤−97 row or clear it
  first; east of x40 the box is empty. At night with the hold down: UNSAFE —
  the spawn plateau itself carries a zombie on the plateau (32.5, 67, −88.2),
  the pocket skeleton, a south zombie pair (30.5, −107.2)/(29.2, −109), the
  canopy spider, and the west-edge creeper.
- **Spawn → homestead, north shelf z=−88..−84 (Trial-2/7 line):** zombies at
  both ends burn at dawn; canopy spider mid-route is day-neutral. Daylight-safe;
  night-guarded.
- **Homestead → Vega anchor:** zombies (63.2, −88.8)/(61.8, −78.8) burn at dawn;
  the (70.2, −80.5) creeper does not — route west of x66.
- **Spawn → Geist anchor:** NOT clean even at day — creeper (20.5, −93.8)
  mid-line and the golden-helmet skeleton guarding the apron. Geist's loop
  should treat the west apron as ranged-hostile ground until that skeleton is
  dealt with by his own lane.

## What would change this map

Any further unheld night reseeds the surface (tonight proved the rate: dozens of
deaths in ~90 minutes of darkness). A working 300 s hold keeps the standing
surface threat at the 4–5 named hostiles above; the cave population (172) only
matters where citizens dig or where cave mouths meet work areas — none of the
three anchors' aprons currently has a shallow-underground hostile within reach
except the pocket skeleton already named.
