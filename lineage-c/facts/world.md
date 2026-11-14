# world.md — the shared world as Geist knows it (seeded fact file)
# Updated by hand/crew when the world changes. Facts, not weights.

## The world
- One Paper survival world on the Orin; offline mode; several citizens live here.
- World spawn is near (26, 74, -98). Days are ~10 minutes of daylight; night is
  dangerous and unlit areas spawn hostiles.

## The citizens and their anchors (keep ~30 blocks clear of each other's sites)
- Cody (Lineage A, Craftmind reflex school) — anchor (24, 67, -111).
- Vega (Lineage B, Voyager code school) — anchor (63, 67, -72).
- Geist (Lineage C, the Deliberator — you) — anchor (7, 67, -85) ("HOME"),
  west of spawn: dry grass, surveyed on foot. (Until 2026-11-07 the anchor
  was (-16, 56, -78); that column is a pond — superseded, see below. The
  pond is never a destination.) Build your shelter at your own anchor; do
  not build on, dig under, or take from the other citizens' sites.

## House rules (from the commons README)
- The exam is shared: same ladder, same evidence standard, one scoreboard.
- Proven skills go to the pond with provenance; anyone may adopt them.
- Do not grief: no destroying another citizen's build, no stealing from their
  chests. The world grades citizens; citizens do not grade each other down.

## Local geography (surveyed 2026-11-07, Geist's first day — update as learned)
- The spawn area is DENSE FOREST. Fresh players land ON THE CANOPY (y ≈ 75–77);
  the forest floor is at y ≈ 70, carpeted with leaf litter. World spawn point
  measured at (26.5, 77, -92.5).
- Trees near spawn are oak-type (oak logs/leaves). Trunks are harvested from the
  BASE of the column, never from canopy blocks.
- Geist's ground position after canopy descent: (35.7, 70, -107.6), on grass.
- Cody's dock is east of spawn; Cody was measured at (46.7, 65, -85.7).
- Vega is in the spawn canopy at (29.7, 75, -103.1).
- Geist's anchor column (-16, -78): the highest solid block is y=55 — much lower
  than the forest floor, so the column is likely water or a deep dip. UNVERIFIED
  on foot; treat the anchor as provisional until surveyed in person.
  [SURVEYED 2026-11-07 — it is a pond. See below.]
  [SUPERSEDED AS ANCHOR 2026-11-07 — the anchor moved to HOME (7, 67, -85)
  after deaths 20-28 (the descent-toward-the-pond loop). See the survey
  section below and memory seed #2 in memory/plans.md.]
- CRITICAL WORLD FACT: the server currently refuses bot locomotion — it
  re-teleports every bot to its position each tick (measured for all three
  lineages; see lineage-c/README.md "The wall"). Walking plans will fail until
  that changes; digging, crafting and other reach-local actions still work, and
  gravity still works (descend is reliable).
  [SUPERSEDED 2026-11-07 — this claim is WRONG. Controlled same-session probes
  walk freely (a fresh probe covered 12.5 blocks in 3 s with zero correction
  packets). There is no locomotion refusal and no ride state; the correction
  stream was the symptom of bots face-planted against 1-block steps they could
  not climb without jumping. See the survey section below.]

## Surveyed corrections and additions — 2026-11-07 (operator survey, probe SurveyN53951, on foot)

- THE OLD ANCHOR IS A POND. The column (-16, -78) is open water: surface
  y=62, water down to a sand bottom at y=55, and every column within at
  least ±4 blocks is water at y=62 too. Do not plan to stand, dig, or build
  there — the pond is never a destination. [This column was Geist's anchor
  until 2026-11-07, when the anchor moved to HOME (7, 67, -85). The move
  was forced by deaths 20-28: nine deaths in 3m20s (Drowned x7, Zombie x2)
  as the canopy descent kept delivering him from the respawn canopy toward
  this water. The S3 shelter now belongs at the anchor itself: HOME, dry
  grass.]
- HOME = (7, 67, -85) — AND, AS OF 2026-11-07, HOME IS THE ANCHOR.
  Geist's designated home point: a dry grass plateau — the ground block at
  (7, -85) is grass at y=66 (stand at y=67), flat within ~2 blocks in every
  direction (neighbours y=65-67, grass), oak trunks 4-6 blocks east at
  (11, -85) and (12, -82). It was picked ~24 blocks east of the old anchor
  column (the pond, above), on the route his own canopy descent already
  travels (his descent landed at (5.2, 64, -84.7) on 2026-11-07). The
  anchor record (anchor.json), the substrate canopy-descent target, and
  the S3 measurement all point at HOME now. If he is caught away from a
  finished shelter as dusk comes, HOME is where he goes.
- LEAF LITTER runs this forest. The litter layer is at feet level everywhere
  (17 of 98 cells scanned around (12, -82); around world spawn the ground
  itself is litter-topped at y≈69). Geist's physics data calls litter
  non-solid, but the server collides with litter piles at fractional heights
  (about +0.12 / +0.42 / +0.9, varying by cell). Expect paths planned through
  litter to stall at cell boundaries; travel here is slow — measured
  0.1–0.3 blocks/s in dense litter. Budget travel by distance, never assume it.
- SPAWN PROTECTION: within 16 blocks of world spawn (~(26, 77, -92)), a
  non-opped citizen's block-breaks are cancelled by the server — digs there
  silently fail, forever. Movement is NOT protected. Geist respawns at the
  spawn canopy inside this zone, which is why digging down from the respawn
  point could never work and the pathfinder descent (move first, dig later)
  is the way down.
- THE DUSK FACT, plainly: in this world the night kills unsheltered citizens.
  Geist's own record (server log, 2026-11-07) is the evidence: 19 deaths, and
  every single one was a hostile mob kill — 6 slain by Zombies between 06:16
  and 06:18 UTC during the spawn-canopy respawn loop, then 13 more between
  06:38 and 06:49 UTC while exposed on the ground after descending (Spiders
  ×6, Zombies ×4, Drowned ×2, Skeleton ×1). Zero deaths from falls, hunger, or
  drowning. The operator's survey probe, a fresh citizen with the same body,
  died once on a 17-block night walk (timeOfDay 18828). Deaths happen in the
  dark window (timeOfDay ~13000 to dawn); each death also returns Geist to
  the spawn canopy, far from his work and his materials. An unsheltered
  citizen caught outside in that window should expect to die, repeatedly.

## Operator addendum — 2026-11-07 (spawn-protection geometry, measured; gathering ground)
[OPERATOR-SEEDED — provenance: measured from the servers own records by

## Operator addendum — 2026-11-07 (spawn-protection geometry, measured; gathering ground)
[OPERATOR-SEEDED — provenance: measured from the server's own records by
the night crew (level data read on the Orin; server.properties checked the
same night). Supersedes the spawn-centre figure in the survey section
above for protection math.]
- The world spawn point in the server's level data is (32, 70, -96) —
  the (26.5, 77, -92.5) figure in the survey above was a respawn-scatter
  landing, not the centre. Spawn protection is the SQUARE |dx| <= 16 and
  |dz| <= 16 around (32, -96): x in [16, 48], z in [-112, -80]. Inside
  it, a non-opped citizen's digs are cancelled by the server, silently,
  forever. Movement is NOT protected.
- Geist's recent collecting grounds ((25..38, -85..-93)) are INSIDE that
  square (6 to 11 blocks from the centre, Chebyshev). Nothing dug there
  can ever take effect, however close he stands — the hours of
  out-of-reach collects were measured from inside it. His executors now
  refuse protected columns outright and verify a stand within dig reach
  before digging (substrate, 2026-11-07).
- The oak cluster east of HOME — (11, -85) and (12, -82) — is OUTSIDE
  the square (Chebyshev 21 and 20 from spawn). Digs there take effect;
  that is the known-good gathering ground. Ground east of the square's
  edge (x >= 50) is likewise unprotected.
