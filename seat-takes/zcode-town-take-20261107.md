# GLM Senior Seat — Town Take (2026-11-07)

## 1. Town Design Critique

A camp is an inventory: one of everything a body needs, each build answering a survival predicate. Cody's stack — relocate, pickaxe, pad, hut, chest, pen, watchtower — is exactly that, and it is the right shape for one citizen. The next ring becomes a town at the first build that cannot be justified by a body's needs alone. Three tells, in ascending order of strength:

- **Builds that reference other builds.** A camp sites everything against terrain — flat, near water, near ore. The first structure sited by reference to an existing structure (the pen goes downhill of the hut; the road bends to keep the chest in sight) is the town's founding act. The placement grammar shifts from "where is the ground good" to "where is the town."
- **Non-predicate expenditure.** Roads, plazas, walls enclosing nothing yet, signs, a second story nobody sleeps in. A camp spends every block on a survival predicate; a town spends blocks on relationships between structures and on anticipated third parties. Vega and Geist unpark tonight — a guest hut, a path someone else will walk, a pen built larger than one citizen needs are all town moves that require no scripted cooperation.
- **Flow assets instead of state assets.** Hut and chest are states: built once, ensured forever. A pen that breeds, a field that regrows, a trap that catches are rates. When most new projects produce flows rather than states, the settlement has an economy rather than a kit.

**Critique of the ensure-style stack as the town engine.** The approach earned Cody's survival: predicates over world state are idempotent, re-entrant after death, self-healing after damage, and readable — you can inspect the goal. At town scale the same properties curdle, because ensure-style predicates are *local, binary, and stateless about each other*. Local: "chest exists at X" has no representation of spacing, alignment, sightlines, or adjacency of function — the stack grows like ivy, complete at every instant, never planned, and you get camp-with-more-camps. Binary: every predicate is satisfiable by degenerate world states (a one-block watchtower, a 3×3 pen), so existence-grade truth lets junk accrete, and later predicates build around the junk and lock it in. Stateless about each other: predicates rarely overlapped at survival scale; at town scale everything overlaps. Do not replace the engine — harden it. The two most likely failure modes and the cheapest guards:

**Failure mode 1 — predicate interference (thrash).** Projects' world-state footprints overlap; satisfying A violates B; the engine re-ensures B by undoing A; the stack loops, or worse, both settle into mutually degenerate satisfiers (the road and the pen sharing the same three flat blocks). *Cheapest guard:* a footprint registry — every project declares the volume it may write, and the stack refuses to activate two projects with intersecting write sets, serializing them instead. One intersect-check per activation.

**Failure mode 2 — minimal-satisfier accretion.** The engine reaches "tower exists" as cheaply as possible and stops; the town fills with technically-true junk whose shape forecloses good later builds. *Cheapest guard:* graded predicates — dimensions, material counts, and placement constraints written into the predicate rather than bare existence — plus a periodic town audit that re-scores old satisfied predicates at stricter grades while resources allow.

Transition test for the league: the ring is a town on the day a project's predicate takes another structure as an argument. First relational ensure, first town.

## 2. Three Library Answers

### (a) To Geist — grounds that lie and digs that aren't

Your collecting grounds overlap a spawn-protection square where digs silently fail. Two problems, and the second is the dangerous one: not the bad ground, but that your success signal comes from the command instead of the world. Fix that first.

Prove a dig is real with a receipt: read the block before, issue the dig, read the block after. If the block state did not change, nothing happened, whatever the command returned. From tonight, no dig counts until the world-state delta is logged.

Choose new grounds by four tests, in order. One, the boundary test: protection radii are usually larger than documented, so probe-dig at 8, 16, and 32 blocks beyond the claimed edge; the first distance where a probe carries a receipt is your true boundary — add half again as margin. Two, the yield test: one test pit, count useful blocks per ten dug. Three, the return test: walk home from the pit with a full inventory; if you cannot make it dry and without cliff work, the grounds are too far regardless of yield. Four, the neighbor test: stay clear of Cody's build ring — his predicates will re-dig what you dug, and you will both thrash.

Standing principle: command accepted is not world changed. Only receipts count.

### (b) To Cody — the order of things

Mid-hut, full health, stocked chest: the threats are no longer metabolic, they are dispositional — losing the stock, and missing compounding. Take pen, then watchtower, then the second structure.

Pen first because it is the only project on the list whose payoff is a rate, not a state. The chest is a stock; the pen converts a depleting commons (wandering animals) into owned flow. It is cheap, and every day unbuilt is a day the seed animals drift. A town is made of flows — this is your first town act even though it is the last survival one.

Watchtower second because it is an information asset, and information is worth buying only after food-flow is secured. Siting also improves: build it after the pen and it can reference the pen — sight along the approach the pen does not cover. That reference makes it your first relational build.

Second structure last, and choose it from the ledger, not the blueprint: log what the chest actually ran out of this week. Whatever you walked back for most is the deficit; the second structure answers that deficit. A plan drawn before evidence is a camp plan.

Standing principle: secure rates before sights, and let the ledger pick the last build.

### (c) To any citizen — the wedging shoulder

Same shoulder, every trip home: the geometry is constant, so a policy is wrong. Route, target, or body — test in that order, changing exactly one variable per attempt.

First, target selection: is "home" one coordinate? If the destination is a single block — a door-frame cell, a tile under an overhang — the route may be fine and the destination unreachable. Replace the point with a set: doorstep, the tile before the gate, the pad's edge, any member satisfying. If wedges stop, it was selection.

Second, route: same destination from a different origin, and a different destination across the same shoulder. If the wedge follows the place, the planner underprices that cell — a two-block step-up or an overhang it believes is free. Fix is a blacklist or a cost bump on that cell: a one-way door so it stops being proposed.

Third, body: if the wedge follows the action rather than the place — different shoulders, always mid-stride, always when inventory is full or at night — your walkability predicate claims terrain your reach and step cannot honor. Fix the claim, not the map.

Keep the ledger. A failure at a constant place is a map error; at a constant action, a model error. Wedges are data.

## 3. Divergence Instrumentation

Ground rule: culture is a reproducible difference in *how* ends are achieved, given the same world and the same means. Nothing is culture until it recurs across citizens within a community and survives a respawn. Five signals:

1. **Build-type distribution conditional on situation.** Same biome, same threat, same needs: the ratio of storage-to-defense-to-production footprint. A stable community-level preference (perimeter-first versus production-first) is culture; one citizen's idiosyncrasy is noise. Measured from build records categorized by function.
2. **Siting grammar.** For each new build, how much of its placement is predicted by (a) existing structures versus (b) terrain alone — axis-locking, distance bands, setbacks, symmetry. A community whose placements are consistently predictable from prior builds has a relational grammar; terrain-driven placement is a different grammar. Measured as the predictive split per community.
3. **Repair-versus-rebuild under identical damage.** Stage the same insult — a griefed wall, an emptied chest, a burned hut — against both communities. Repair-in-place versus teardown-rebuild versus relocate-and-abandon, and whether the response cites the original plan. Ensure-style engines bias toward re-satisfying (repair); a community that redesigns instead is diverging on values, not capability. Measured from block-delta records: repair fraction and delta entropy per damage event.
4. **Priority ordering under simultaneous pressure.** When food, safety, and asset threats present together, which project wins the stack. First-project-selected conditional on threat vector, from planner logs. A consistent ordering — safety-first versus food-first versus assets-first — across citizens is a value ordering, the cleanest cultural signal available.
5. **Consult-book shape.** Not volume — shape: ratio of diagnostic questions ("how do I tell which") to imperative ones ("what do I do"), whether answers include receipts and tests, whether failure is recorded as data or as error, and the recurrence of sealed standing principles. Epistemic style is cultural and measurable directly from the books.

**The signal that looks cultural but isn't: build rate and throughput** — blocks per hour, time-to-hut, structures per day. It reads as a work-ethic difference but measures the substrate: model latency, action-loop tick rate, token budgets, harness metering. Those live in the community stacks, not in the communities' answers. The same trap catches raw consult volume — count the asks and you are measuring how each harness meters its library. Keep throughput metrics off the culture dashboard entirely.
