# DIRECTOR LOOSENING NOTE #2 — SCENARIO #2 "THE STONE IN HIS OWN HOLLOW" AFTER DAY 11

Filed by the day-11 lane (parent-delegated) under DIRECTOR.md §6, in
loosening note #1's form. Method: the day-11 record
(`pulse/DIRECT-DRIVE-DAY11-20261109.md`), the day-11 trace, the floor's
live log, and a fresh post-day census of the step box and tread cell.
**No world writes of any kind were made by this read.** Day 11 did not
start — Gate B stopped it on a harness defect — so this note records
a scenario that was never offered, and says plainly what that does
and does not teach.

Census copies: `director/census-s2-postday11/` (fresh read-only copy
of the Orin's overworld region r.0.-1, md5 `c4ccf93c…`, offline
mcprobe parse — the scenario-#2 census instrument).

---

## 1. WHAT CODY DID WITH THE OFFER — THE TRACE, QUOTED

Nothing. There was no offer in his world: the day-11 trace
(`pulse/direct-drive-trace-day11-20261110.jsonl`) holds exactly two
rows, and they are the whole of his day:

```
{"ts":"2026-11-10T00:28:31.814Z","kind":"gate-refuse-start","reason":"no-lease"}
{"ts":"2026-11-10T00:30:11.105Z","kind":"gate-refuse-start","reason":"no-lease"}
```

The server log agrees: Cody joined and left inside the same second,
twice (00:28:31Z, 00:30:11Z) — the driver spawns the body before it
checks the gate, and the gate refused both starts because the floor's
lease had already been revoked (the floor/driver heartbeat contract
defect; day record, incident 1). He issued no command, spoke no say,
dug nothing, placed nothing. The hand-over line —

> "You wake in the stone hollow where your hunt ended yesterday, one cobble in hand and the furnace still wanting seven more. Home is west along the south shoulder, the pit on your left hand — your table, your pen and your wheat as you left them."

— was never delivered. It sits in the driver copy's scene text
exactly as filed, unspoken, and remains owed verbatim to the next
played day. His save's content is unchanged from day 10's close
(re-read by the snapshot producer after the stop: 30 porkchops, 5
pickaxes, 18 oak logs, 10 birch logs, 1 cobble). Deaths: 123 → 123.

## 2. THE BEATS — LOAD-BEARING, INERT, NEVER PERCEIVED

- **The tread (65, 66, −88): NEVER PERCEIVED.** It stands exactly as
  placed (census below). Nobody walked the shoulder today; there was
  no homeward leg for it to meet. It is scenery in the strictest
  sense — authored mass waiting on a road nobody travelled.
- **The hand-over line: NEVER DELIVERED.** Unlike scenario #1, whose
  line was delivered and refused by inaction, this line never
  entered his world at all. The two refusals must not be filed as
  the same kind of datum: #1 measured the player's attention; today
  measured the harness.
- **The floor's first live use: LOAD-BEARING — as evidence.** The
  supervisor's first shift was spent entirely on the machinery
  around the citizen, and it earned its keep there: VERIFY_FEED
  passed from a store the feeder cannot write; its first daylight
  assertion landed, issuer-verified, on attempt 1; and its park
  discipline caught — before any citizen was exposed to them —
  three latent defects in the floor/driver contract itself
  (pre-driver heartbeat park; single-shot release observation;
  gate-reason collapse). A supervisor that had waved day 11 through
  ungated would have taught us nothing and risked the citizen; this
  one stopped the day twice, correctly, on its own rules.
- **The gate (§9.10): LOAD-BEARING.** Twice presented with a start
  that lacked a live lease, twice it refused, and no command was
  ever executed under a dead lease. The charter's hardest stop rule
  is no longer a fixture result; it has fired live, twice, and held.
- **The prediction (triple-021): INERT TODAY.** Not confirmed, not
  falsified — unscored, premise void. Filed as
  `triple-022-scenario-002-stone-hollow-scored-day11`.

## 3. THE LOOSENING — WHAT THE NEXT DAY INHERITS, WHAT STAYS SCRIPTED, WHAT THE DIRECTOR NOW BELIEVES

**What carries forward unchanged.** Scenario #2 itself: the tread
stands, the siting claim (distance was scenario #1's whole lesson,
and #2 was built on it) is untested rather than wrong, and the
prediction stays filed and live. The Director authors nothing new
for the next day — the set is already on his road; re-authoring
would spend novelty to disguise a harness failure as a content
failure. The hand-over line carries forward verbatim. The refusal
beat's discipline — declare situations, never outcomes; never steer
him to the element — is untouched: nothing about today's stop was
the scenario's doing.

**What must change before any of it can play.** The binding
constraint on the programme has moved: it is not the citizen's
attention (day 10), not the world's geometry (the wedge, triple-020),
not the scenario's siting (#2 was sited on his road and still never
met him) — it is the supervision harness's own start sequence. The
next charter's first act is a repair, not a scenario: (a) the floor
must distinguish "driver not yet started" from "driver died"
(a first-heartbeat grace), or leases must be issued on demand inside
the launch window; (b) release observation must not latch; (c) the
gate must say *expired* when it means expired. Until those land and
are fixture-proven the way the gate wiring was, every future
Director element is a log stood on a road behind a locked gate.

**What the Director now believes.** That the loosening has a floor,
literally: a scenario can only loosen into a day that exists.
Scenario #1 taught that authored mass must intersect the citizen's
momentum; today's addendum is that the citizen's momentum must be
*permitted to exist* — the floor that guards the day can also, by a
defect in its own contract, prevent it, and a prevented day produces
no evidence about anything except the guard. The Director's next
measurement is therefore not of Cody at all: it is whether a repaired
floor can hold a lease across a real launch. When it can, scenario
#2 — already placed, already predicted — is the cheapest possible
first day: nothing to author, nothing to place, only a line to
deliver and a road to watch.

## 4. FRESH CENSUS — THE STEP BOX, THE TREAD, HIS GROUND

Post-day copy `director/census-s2-postday11/region-r.0.-1.mca`
(md5 `c4ccf93c…`), parsed offline with the placement window's probe:

- **Tread cell (65, 66, −88) = `minecraft:oak_log[axis=z]`** — the
  placed element, standing. (The probe's "EXPECT air" line is its
  pre-placement baseline from SCENARIO-002; the post-placement
  expectation is the log, and the log is what it reads.)
- **(65, 65, −88) = dirt** — the placement's own cover-kill of the
  grass beneath the log, filed loudly by the placement window at
  the time; unchanged since.
- Invariants: (65, 67, −88) air; (65, 66, −89) grass_block;
  (64, 66, −88) dirt; (64, 67, −88) grass_block; (64, 68, −88)
  leaf_litter — all as placed/surveyed.
- His ground, all unchanged: crafting table (64, 67, −94);
  farmland ×3 (67, 66, −95..−97); trench water (65, 66, −95); pad
  tops (60..62, 66, −93) grass; pen gates (64, 67, −101) and
  (65, 67, −100) closed oak_fence_gate; his hollow step — dirt
  (71, 64, −88), oak_planks (71, 65, −88) — his own work, untouched.
- The step box (x 63..66, z −90..−87) shows no dig, no place, no
  disturbance: consistent with a day that never ran.

## 5. SCENARIO #3 — SEED

None. Deliberately. Scenario #2 is unplayed, its prediction
unscored, its element standing; a third scenario authored now would
be inventory, not direction. The seed for the next Director act is a
sentence, not a set: *when the floor can hold a lease across a
launch, run the day that is already built.* If that day plays and
the tread is again never perceived, the siting doctrine — not the
harness — takes the blame, and note #3 will say so.

*— Director read, filed by the day-11 lane, 2026-11-09. The element
stands; the player slept; the guard did its job too early and too
well. Repair the guard's clock, and the road is already waiting.*
