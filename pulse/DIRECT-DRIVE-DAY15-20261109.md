# DIRECT-DRIVE DAY 15 — THE TRANSIT LANDED; THE BOWL AT HOME ATE THE DAY (2026-11-10)

*The day-15 lane's record. Charter: `pulse/DAY15-CHARTER-20261109.md`.
Cody ran 268 cycles, 07:42:19Z→09:07:19Z (the full chartered 85
minutes; driver exit rc=0 at window end). **Deaths in the run:
ZERO — the first zero-death day since day 12, and the first day
ever whose transit home was survived.** The day's one death
happened BEFORE it, inside Gate B's provisioning window
(incident P1, below): the census-named zombie at his login point
killed the defenceless stand-only body in 5.5 seconds. Deaths:
135 (Gate B baseline, re-derived) → **136** (provisioning) →
136 at close. Furnace: **NO** — fifth consecutive day without
S10/S11; the consuming phase and the prevention are named in
§6, as the charter's pre-registration required.*

## The action curve first

Blocks of ~10 minutes from the 07:42Z wake (acts = model cycles;
reflex acts counted separately below):

| Block | Acts | Shape |
|---|---|---|
| 1 (07:42–52) | 42 — goto 21, dig 9, place 7, climb 2, felltree 1, look 1, collect 1 | **THE TRANSIT**: wake at the respawn (33.5,67,−96.5); east along the line; **2 floor-escape flees** under skeleton fire (hp 20 → 9 at cycle 8); ate, regenerated; home ground reached ~cycle 10; the dip entered ~cycle 11 |
| 2 (07:52–08:02) | 46 — goto 20, dig 16, place 7, climb 2, collect 1 | The bowl: dig/place-dirt step attempts at (61.7,63,−91.6); **dig-guard ARMED 07:46:34Z** (in block 1's tail — stone-phase-entry, entry 63) |
| 3 (08:02–12) | 34 — goto 21, dig 9, place 2, wait 1, collect 1 | Bowl: notch attempts north/east; transient +1 gains by long leg, each lost |
| 4 (08:12–22) | 43 — dig 20, goto 15, wait 3, place 2, climb 2, collect 1 | Bowl: he digs himself DOWN to y61 (stepwise, 63→62→61); placed tread one level too high (top y63 from feet y61 = +2) |
| 5 (08:22–32) | 29 — goto 15, dig 10, collect 1, look 1, climb 1, place 1 | Bowl at y61–62; +1 regained by long leg (cycle 187); **model-fail ×2 at cycles 192–193 → FAILOVER to governor:qwen3-coder-30b** for the rest of the day (79 of 268 cycles) |
| 6 (08:32–42) | 21 — goto 16, climb 2, collect 2, dig 1 | Bowl: the fallback brain settles into a goto/climb/collect loop; pit-guard refusals continue |
| 7 (08:42–52) | 22 — goto 19, climb 2, felltree 1 | Bowl: the fallback repeatedly proposes the pit route (66,−91); pit-guard refuses |
| 8 (08:52–09:02) | 20 — goto 15, climb 3, collect 2 | Bowl: unchanged |
| 9 (09:02–07) | 11 — goto 8, climb 2, collect 1 | Window ends with him in the bowl at (61.7, 62, −91.3) |

**Verb totals (ok/total)**: goto 24/150, dig 40/65, place 9/19,
climb **0/16** (14 × "no blocks in inventory", 2 × "pillar
failed" — the verb stays broken-by-construction AND starved of
blocks), felltree 0/2, collect 10/10, look 2/2, wait 4/4,
**craft 0/0, eat 0/0** (the eat reflex is driver-side; his food
went 20→19→18→20 across the day — he ate from the reflex layer,
never by command). **Zero craft commands all day** — the wood
chain never ran past cycle 2's single felltree (which itself
failed: the tree at (35,70,−91) was beyond the dip he had
dropped into).

**The shape in one line**: eleven minutes of exactly the
chartered day (provisioned wake, the northern-line transit
survived under fire, home reached) — then 74 minutes inside a
bowl of his own deepening at home's edge, at y61–63, four blocks
from his table, without the pickaxe that would have made its
stone walls into the count.

## Furnace: NO — with both stores

S10/S11 were never attempted (fifth consecutive day). Both
verification stores agree: post-day `.dat` (sha `1b6922ba…`)
inventory = **{cooked_porkchop: 29}** — no cobblestone, no
furnace, nothing else; the fresh region parse (copy md5
`83dc7b31…`) finds **zero furnace blocks in any palette** of the
64 scanned chunks. His table still stands at (64,67,−94);
scenario-#3's cobble still stands at (65,66,−88). Held
cobblestone at any point in the day: **0** — every stone dig was
bare-handed (no pickaxe was ever crafted), and bare-handed stone
drops nothing; his own cycle-122 words: "I don't actually hold
stone. The dig dropped it and I'm just digging pockets in the
walls." Skill `uses[]` entry appended (the array’s fifth appended entry — days 11, 12, 13, 14, 15; day 10’s first use was never appended, as filed).

## Deaths: 135 → 136 (+1), derived

Baseline 135 re-derived at Gate B via `lib/deaths.js` over
`deaths-record.jsonl` + all traces (day-14 window exactly 3).
**The run itself: ZERO deaths** (trace death rows: 0; floor
COUNT_DEATH: 0; the `.dat` at close reads hp 20). The +1 is
**death #136, 07:38:27Z, Zombie — inside the provisioning
window**, before the floor opened (incident P1). It is not in
any day trace by construction (the harness is not the driver);
its store is `pulse/day15/provisioning-evidence.jsonl` +
the server log line "[07:38:27] Cody was slain by Zombie". The
derivation total (record + traces) reads 135; **135 + 1
(evidence file) = 136**, and the record states the seam rather
than smoothing it: the deaths record's coverage is day traces,
and a Gate B window death lives in the window's evidence.

## The reflex layer's live account

- **Flee: 2 engagements**, both in the transit (07:44:31Z,
  07:45:22Z — "skeleton appeared and the floor hopped you toward
  home, two blocks at a time, until it gave up. You are alive.").
  Both exited by their own clear. The hostile was the census's
  skeleton country east of the wake; hp bottomed at 8.97 (cycle
  8) and the eat reflex + held daylight restored him to 20 by
  cycle 10. **The transit's survival is the reflex layer's work
  as much as the route's** — day 14 died on this leg; day 15's
  flees hopped him TOWARD HOME (the chartered direction), and
  he arrived.
- **Burrow: NEVER ENGAGED — the repair filing's named gap
  STANDS, a third day.** No burrow-start rows exist. The
  burrow's proof remains the shared helper + 15 wiring
  assertions from the repair battery. This record does not
  round the flee-arm proof (days 14–15) up into a burrow claim.
- **Pit-guard: 13 refusals** (07:55:35Z → ~09:05Z), every one a
  goto into the pit columns (65..66, −91..−92) re-aimed at
  (62,67,−92). From mid-afternoon the refusals were mostly the
  FALLBACK brain's repeated "water trench" plan (goto 66 62
  −91) — the guard very plausibly saved the day from a drowning
  death #121-repeat: the pit is water over stone, and a body at
  y61–62 entering it does not climb out. fault: none — the
  guard did exactly its job, thirteen times.
- **reflex-abort: none** (no park landed during the run; no
  death-count stop was needed — the count never moved).

## The dig-guard's live account — R1/R2's disposition day

One row, and it matters: **`dig-guard-arm` 07:46:34.125Z,
reason `stone-phase-entry`, entry 63, at (61,63,−92)** — the
guard's FIRST live row in two days of carrying the revision.
The account around it:

- **Arming: 1** (stone-phase-entry, as designed — he began
  digging stone-family ground at the bowl's edge).
- **Refusals: 0.** Every dig he attempted had its target top at
  or above the cap (entry 63 − 2 = 61). His descent 63→62→61
  was stepwise through cells he dug at his own level — legal
  under the cap, one level at a time.
- **Fall arms (R2): 0 — correctly.** No single drop > 2 ever
  occurred; the descent was dug, not fallen.
- **Disarm/defer: neither.** Count-closed never happened (he
  never held a cobble), so R1's disarm path never came into
  play; the guard stood armed at close.
- **His own words show the rule internalised**: cycle ~142 —
  "The guard says work sideways at my level"; cycle ~144 —
  "I've dug in a circle at my level" (paraphrase-tight quotes
  from the trace says). The guard shaped his digging even
  without refusing: he worked laterally at the capped level for
  hours and never once tried to dig deeper than the cap.

**Disposition (filed into the amendment note, append-only)**:
R1/R2 **CARRIED, live-touched at last but not live-proven** —
the arm fired live in its designed condition; the refusal and
the fall-arm and the home-disarm remain fixture-only. The
guard's envelope gap is now measured, and it is NOT the one
day 13 predicted: the day was lost INSIDE the envelope, by
legal digs — the guard governs DEPTH below entry; it says
nothing about a citizen digging a legal bowl at entry level and
being walled into it by the one-step movement limit. That is
§6's named joint, and it is a movement/entry problem, not a
guard problem. The guard is not blamed and not promoted.

## The walker fence's live evidence

**Fence rows: 0. Displacement during stationary verbs: NONE at
the charter's measure** — the mechanical pass over all 268
cycle rows (a stationary verb's row position vs the previous
row's, the I4 measurement) finds exactly one displacement
> 1.5 blocks: cycle 2's felltree, 1.8 blocks — felltree's own
internal walk-to-the-trunk, the verb's designed motion, not a
carry. During the day's stationary acts (dig 65, place 19,
climb 16, collect 10, wait 4, look 2 — and ZERO crafts, the
I4-shaped act, which never occurred), no cycle row shows the
body somewhere the command did not put it. **Verdict under the
charter's two-part rule: arm (i) — the invariant held unforced:
fence rows == 0 AND displacement == 0.** Stated with its limit:
the fence was never FIRED live (no stale goal survived to a
stationary verb all day — plausibly because the day's goto
chains mostly stalled in place rather than timing out
mid-carry), so the fix is **shipped, fixture-proven 18/18, and
live-unfired** — the same epistemic class as the guard's arm.
What CAN be said from the world: day 14's failure mode — a
26-block silent carry during crafts — did not recur, and the
day contained no craft for it to recur during. The carry's
other habitat (long goto chains ending in timeouts) occurred
constantly and produced no displacement rows. **Incident-D
watch: no recurrence** — no held-items-to-ground-drops anomaly;
his close inventory (29 pork) matches the trace's eat account
(32 − 3 eaten).

## The floor's live report

Contract `floor/run/day15/contract-day15.json` as-run sha
`1a9dc7df…` (the charter's pin: day-14 terms, window re-pinned
to the run's AKST day before open). 28 log rows: NOTIFY ×2,
VERIFY_FEED ×1 (first-read pass, have 32 — the provisioned
snapshot), LEASE_ISSUE ×1 (born `launch`; flipped `live` on the
driver's first heartbeat), **ASSERT_DAYLIGHT ×22, ALL attempt
1** (the repaired verification's third consecutive full-day
proof), PARK ×1 + LEASE_REVOKE ×1 at 09:08:57Z —
`driver_heartbeat_lost`, 92 s after the driver's clean exit at
window end: the expected end-of-day revocation, not an
incident. COUNT_DEATH ×0. The verifier's standing cross-audit
notes (park-notify count vs PARK count; chat count vs
ASSERT_DAYLIGHT count) reflect the file channel's known shape
(the floor's daylight goes through its op channel, not the op
bot's chat file) and are filed here as observed, not as
failures. Mirror loop ran the day at 1 s cadence, bytes
faithful. Floor closed by the lane at close-out (writer
stopped, process killed, verifier + mirror stopped).

## Budget

**268 calls in 85.0 min = 3.153 wc/min — UNDER the 3.976
ceiling.** Metered trace cost **$0.0776** (the trace's own
usage estimates; the fallback's 79 cycles carry the governor's
accounting, historically understated — the day-13/14 caveat
applies: treat the dollar figure as a floor, the call rate as
exact). Routes: DeepInfra primary 189 cycles; **one failover**
(cycles 192–193 model-fail ×2, "empty/failed after retry") →
governor:qwen3-coder-30b for cycles ~194–268 (79 cycles),
trace-rowed per the day-5 rule. The failover's playing quality
is part of §6's account: the fallback looped goto/climb/collect
and repeatedly proposed the pit route — it did not kill him
(the guards held), but it did not work the problem either.

## §6's answer — the consuming phase and the prevention (charter-mandated)

The charter pre-registered: if S10/S11 failed a fifth day, the
record names the consuming phase and the prevention follows its
class. From the trace, the consumer is unambiguous:

**THE BOWL — extraction's family, a NEW joint: TOOL-LESS ENTRY
INTO BELOW-GRADE HOME GROUND.** The sequence: the transit
delivered him to home ground at ~cycle 10 at (61.5, 64, −91.7);
his next goto (cycle 11, toward the hollow) stepped him DOWN
into the low cell at (61.7, 63, −91.6) — a real terrain cell:
the census's own tops around the pad's southwest read y63–64
against the pad's y66. He entered it **before the wood chain
had run** (the plan sequenced transit → wood at the table →
stone; the terrain put the stone phase's geography under his
feet first, and his goto chain walked him into it). From y63,
every exit face is +2 or +3. Without a pickaxe his stone digs
dropped NOTHING, so the count was void from the bowl; without
any held blocks for most of the day (dirt came and went), climb
had nothing to place (14 of 16 climbs: "no blocks in
inventory"); the placed-rung attempts placed beside him at the
wrong level (tread top +2 from his feet); his legal,
guard-compliant lateral digging lowered his own floor stepwise
to y61, raising every wall. The extraction investigation's law
held exactly: ONE +1 step is all the stack grants, and a
below-grade cell whose faces are all ≥ +2 is a prison on this
stack — at y63 beside his own pad as surely as at y58 in day
12's shaft.

fault_owner: **harness** (the movement stack's one-step limit
is the wall; the plan — charter + model jointly — walked him
into below-grade ground tool-less, but the stack offers no verb
that exits, and three days of evidence now say no plan-level
cleverness substitutes: notch compositions take ~200+ cycles
when they work at all) — **world** contributing (the low cell
sits ON the home approach, unmarked in any census as a hazard
because at census scale it reads as ordinary relief).

**The prevention, per the charter's pre-registered classes.**
The consumer is the stone-phase/extraction family, so the
guard-envelope clause applies — and the day's guard rows
(1 arm, 0 refusals, descent entirely legal) prove the envelope
is NOT where the fix lives: **the guard governs depth; the
disease is ENTRY.** The charter change that prevents a sixth,
named for day 16: **(a) WALK-LEVEL ENTRY DISCIPLINE as a
harness rule, sibling to the pit guard — the BELOW-GRADE GUARD:
while the citizen holds NO pickaxe, the driver refuses (and
re-aims) any goto whose target cell's top is ≥ 2 below the pad
level (y66) inside the home district, and refuses any dig that
would lower his standing cell below pad −1 before the wood
chain completes.** The bowl's entry (top 63 vs pad 66) would
have been refused at cycle 11 and re-aimed along the pad; the
self-deepening digs at cycles ~141–151 (feet-level cells dug
from y62 to y61) would have been refused before the walls rose.
**(b) THE WOOD CHAIN IS RE-SEQUENCED FIRST, BEFORE ANY
EASTWARD GOTO**: the day opens at the wake-adjacent/western
trees or the pad-edge trunks with felltree → planks → sticks →
wooden pickaxe as cycles 1–10's whole business, verified from
held state (pickaxe in inventory) before the transit's last leg
or the stone phase is allowed to begin. A pickaxe in hand
converts the bowl from prison to quarry — with drops, the same
walls become the count, and placeable cobble makes the
placed-rung exit real. (c) The day-16 wake itself needs no
relocation: **he sleeps tonight IN the bowl at (61.7, 62,
−91.3)** — the close position is inside home district, and a
day-16 plan that begins with (a)+(b) can work the bowl's own
stone legally WITH a pickaxe, or exit by notch at leisure. The
relocation class stays unspent.

## Incidents

**P1 (Gate B; world; the day's death) — THE PROVISIONING
WINDOW'S ZOMBIE.** The census had NAMED the risk in writing:
a zombie at (28.3, 67, −104.7), under a block from the login
point, and the charter stationed the harness's health watch as
the tripwire. It fired exactly as designed — health 16.67 →
13.83 → 11.17 → 8.33 → 5.33 → 2.33 → 0 across 07:38:22–27Z —
and the tripwire is a WATCH, not a shield: the stand-only body
has no defence by construction, and it died 5.5 s after spawn,
before the lane's `/give` could be sent. **Death #136.**
Recovery per the charter's own rule (re-derive before any
launch): the harness auto-respawned the body at the respawn
point (33.5, 67, −96.5) — open ground, no hostile in contact —
the give landed there (read-back {cooked_porkchop: 32}, hp 20,
food 20), clean quit, post-quit `.dat` verified {32} from the
snapshot (sha `39392d9d…`); the day's baseline was re-derived
as **136** and the wake facts re-read from the NEW save
(hp 20, not 16.67; position the respawn, not the login) before
the floor opened. The hand-over line was RE-DERIVED under the
branch rule and NOT re-spoken (see G2): the scene text's
day-15 threads already described waking in the tree country,
and the driver was never relaunched with edited text — the
line as shipped says "woke in the tree country", true of both
points. LESSON, filed plainly: **a provisioning window at a
census-named occupied point needs the op bot's cover FIRST
(the zombie removed or the window opened at a cleared hour) —
the health watch told us he was dying; nothing in the window
could stop it.** fault_owner: world (the zombie) + charter
(the window's design accepted a named risk with a watch where
it needed a guard).

**G1 (Gate B; lane) — TWO REFUSED STARTS, both the floor
working.** First launch (07:39:52Z): REFUSE-START
`death-count-at-start` — diagnosed to a stale pointer: the
driver copy's `TRACE_PATH` still read **day-14's trace** (with
its 3 deaths) because the pointer lives outside the charter's
listed edit set; the start check correctly refused to inherit
a day already at its limit. Root-caused, fixed (pointer →
day-15 trace), fixture batteries re-run against the corrected
copy (18/18, 40/40, 28/28), shipped md5 became **`faf22398…`**
(the charter's §4.9 pin updated by this record — the charter
text carries the pre-fix md5; the batteries were re-run
against the shipped bytes, which is the operative test).
Second refusal at the relaunch — the lane again put verifier
steps between floor-open and launch (day-14 I2's own lesson,
re-broken by the same hands under time pressure); the floor
was re-opened and the launch followed within seconds:
`GATE: live lease confirmed at start`, spawn 07:42:03Z at the
re-derived wake facts. Cody was never woken by a refused
attempt beyond a join/leave flicker (the refused drivers spawn
to read the gate; inventory and vitals at the true wake match
the staged snapshot: pork 32, hp 20).

**G2 (Gate B; lane, no effect) — THE KEEPER CHANGEOVER RAN
LATE.** The sequence above pushed the keeper changeover to
07:43Z, ~1 minute AFTER the driver spawned: for that minute
the standing cameraman asserted `/time set 1000` (server log:
MagnusandMouse 07:42:28Z) alongside the floor — a double
assertion the charter forbids in design (changeover precedes
launch). No harm resulted (both asserted the same value; the
floor's own assertions all verified attempt-1), but the
ordering rule exists for the day the values disagree, and the
record files the breach as the lane's. The lane also STOPped
the freshly-launched keeper once with a stale STOP file
(07:43:09Z — inherited from the standing cameraman's stop
step) and relaunched it; from 07:43:25Z the keeper tracked
cleanly (SUBJECT-KEEP ×10, SUBJECT-HOLD ×3, STALL shots ×46 —
the STALL count is the bowl's signature: the keeper kept
framing him WITH his obstacle because he never left it).
**The Gate B weather read (charter §9)**: `/weather clear`
issued 07:38:17Z for the window; the keeper's start act also
issued `/weather clear` (07:43:09Z); the day's sampled frames
show CLEAR SKIES throughout — no rain fell on day 15 in any
sampled frame; whether the clears or the sky deserve the
credit is not derivable, and no weather claim beyond the reads
is made.

**M (provider) — ONE FAILOVER.** Cycles 192–193: model-fail
×2 ("empty/failed after retry"); the driver failed over to
governor:qwen3-coder-30b, which played cycles ~194–268 (79
cycles), trace-rowed per the day-5 rule. The fallback's play:
a goto/climb/collect loop inside the bowl and repeated pit
proposals (pit-guard refused them all). No silent substitution
— the day-5 rule held.

**Frame account (from content; 9 frames sampled across the day
from the capture segments, read by eye)**: **Cody-visible 1/9**
(the bowl frame: his figure in the pit beside a black
unloaded-chunk void, mid/late day) **+ 1 partial** (a skeleton
— the transit's hostile — visible at frame edge in the bowl
frame's twin). Clean-frame **FAILED**: chunk voids in 2/9
frames; teleport-receipt text in 2/9 (one frame carries the
FULL chat backlog panel — teleport receipts, "[Gallery: Set
minecraft:overworld to 1000 tick(s)]" lines); canopy/leaf-wall
frames 3/9 (the camera inside the tree crowns, subject not
visible); surface frames without him 3/9. The keeper's tracking
itself is again exonerated by its own log (SUBJECT-KEEP ×10 —
he barely moved after 07:46Z, so holds dominate; STALL ×46
framed him with his obstacle as designed). The deficits are
the standing capture pair — chunk voids + receipt text — PLUS
canopy occlusion on the transit frames. fault_owner: harness
(capture/render hygiene), NOT the keeper. The frame-hygiene
item stays open for a fifth day in a row; it is now the
programme's longest-lived unowned deficit.

## Close state + posture

Cody OFFLINE at **(61.7, 62, −91.3)** — in the bowl at home's
edge — hp 20, food 20, inventory **{cooked_porkchop: 29}**,
save sha `1b6922ba…`. Posture restored and verified: keeper
STOP-stopped with Cody offline; **original `cameraman.py`
relaunched (pid 1926346), start assertion VERIFIED LANDED**
(server log: MagnusandMouse `/time set 1000` 09:09:22Z after
the restore); floor closed (writer stopped, FLOOR processes
down; its own end-of-day PARK/REVOKE at 09:08:57Z stands as the
day's last floor act); op bot quit through its channel; mirror
loop stopped; Thor stood down. The verifier's final
cross-audit notes are filed in the floor section above. The
renewal chain's next firing evaluates this restored posture,
as designed.

## What day 16 inherits

A citizen asleep in a bowl of his own digging at home's edge,
fed (29 pork), unhurt, four blocks from his table — and a
charter change already named (§6): the below-grade guard +
wood-chain-first. The transit problem is SOLVED (northern line,
flees toward home, zero deaths — day 15 is the proof). The
walker fence is shipped and unfired. The guard is armed in the
world's logic and was obeyed in words all day. The furnace is
five days unbuilt, and the reason has narrowed to ONE sentence:
**he must never again be below pad level without a pickaxe in
his hand.**

*— Day-15 lane, 2026-11-10. Charter `pulse/DAY15-CHARTER-20261109.md`;
trace `pulse/direct-drive-trace-day15-20261110.jsonl`; floor
`floor/run/day15/`; provisioning evidence
`pulse/day15/provisioning-evidence.jsonl`; census
`director/census-d15-20261109/`; frames `pulse/day15/stills/`.*
