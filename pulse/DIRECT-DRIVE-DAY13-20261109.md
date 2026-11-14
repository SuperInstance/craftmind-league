# DIRECT-DRIVE DAY 13 — wake, the road home, the hole, and the burst

Day 13 of the direct-drive line (charter:
`pulse/DAY13-CHARTER-20261109.md`; ledger day-13 claim = line 347,
`day-13-claim-20261109`). NO Director scenario — day 13 was the
furnace's day. It did not become the furnace's day: the table was
never reached, no craft was ever attempted, and the day ended early
under its own stop rule — nine deaths in five minutes inside one
stuck driver cycle, the floor's PARK correct and unreachable, the
day stopped by the lane's hand at 06:14:43Z. Window as run:
**2026-11-10T05:20:45Z → 06:14:43Z (54 of the chartered 85
minutes)**. 209 completed cycles (numbered to 211; two iterations
were post-death sleeps that row no cycle), all on the primary route
(deepinfra:deepseek-v4.1-flash; no failover). Cody's deaths:
**123 → 132 (+9)**.

## ACTION CURVE (first, per the standing order)

Ten-minute blocks from wake; acts = successful dig/place/goto/
felltree/climb commands:

| block (UTC) | cycles | acts | what the block was |
|---|---|---|---|
| 05:20 | 38 | 16 | the road home: short legs around the pit's south shoulder; the pad fight (cycles 1–19) |
| 05:30 | 57 | 16 | pad fight continues; first stone digs (guard arms/disarms); **cycle 38: the fall** to y59 |
| 05:40 | 44 | 8 | the hole: notch digging at y59–60, waits, failed gotos |
| 05:50 | 39 | 4 | the hole: the notch stalls; digs begin returning false (already air) |
| 06:00 | 31 | 4 | **escape** (placed cobble step, cycles 205–206), then the death burst; last completed cycle 211 at 06:09:03Z; cycle 212 never returned |

Verb totals: goto 77, dig 64, wait 37, climb 18, place 8, felltree 3,
look 2. No zero-act block (the stall rule was not tripped), but the
05:40–06:00 blocks are an extraction stall in substance: 83 cycles
for 12 successful acts, most of them failed gotos and waits at the
bottom of a hole.

The day's story in one paragraph: he woke exactly where day 12 left
him with the count in hand, took the hand-over line in ("I've got
stone in my hand and a bench to use it at. Home's west"), and fought
the broken ground toward the table for nineteen cycles without
arriving — the walker timing out on 2–3-block legs across the same
+1-step relief that has gated this approach since day 11. Wandering
east of the pad he dug a little at his own level, and at cycle 38 a
long goto dropped him six blocks into a hole at (70,59,−87.7). He
spent the day's middle digging S7.0-shaped notches that gained single
steps and never composed, got out at ~06:06Z on a placed cobble step
— and a creeper was waiting at the exit. The first death took
everything he owned. The eight deaths after it took nothing but the
count, because there was nothing left to take, and they happened
somewhere no safety check could reach (§Incident H1).

## FURNACE: NO — S10/S11 NEVER ATTEMPTED

Zero `craft` commands in the trace; the crafting table at
(64,67,−94) was never reached. Verified from both stores he cannot
write:

- **Post-day `.dat`** (fresh snapshot, sha256 `c39540fe…`):
  inventory **EMPTY** — no furnace item, nothing at all. Pos
  (36.5, 73, −86.5) — his respawn point, ~28 blocks west of home;
  health 20, food 20 (fresh-respawn vitals).
- **Fresh region copy** (Orin `world/dimensions/minecraft/overworld/
  region/r.0.-1.mca`, md5 `321b8953…`, parsed offline with mcprobe):
  no `furnace` name in any palette or block-entity list in chunks
  (3..5, −7..−5) — the nine chunks covering the home pad. No furnace
  block exists at home.

The asset's promotion rule (a verified placed furnace) is unmet for
the third consecutive day. The skill's fourth use entry is appended
to `skills/furnace-sequence.v1.json` (outcome:
not-attempted-tail-day-lost-to-extraction-and-death-burst); the
asset's status is unchanged (ADMITTED-WITH-UNPROVEN-TAIL).

Wake state, for the record (Branch A confirmed twice — Gate B
pre-checks and the live open's fresh snapshot): cobblestone **15**,
cooked_porkchop 29, wooden_pickaxe 6, oak_planks 15, stick 9,
oak_log 11, birch_log 10, pos (71.33, 65, −82.69), hp/food 20/20 —
byte-identical inventory to day 12's close. The hand-over line was
spoken as chartered (charter §7, verbatim) and landed: his cycle-1
words are the line's own facts back ("stone in my hand and a bench
to use it at. Home's west — around the pit, south shoulder, same as
always").

## DEATHS: 123 → 132 (+9, derived)

Derived with `lib/deaths.js` over the day 1–12 records/traces plus
today's trace; the floor's own COUNT_DEATH rows (×9) and the
driver's counter agree exactly. Causes from the server log (the
store none of the counters write):

| # | time (UTC) | cause (server log) | where |
|---|---|---|---|
| 1 | 06:07:06 | blown up by Creeper | at the hole exit, seconds after the escape |
| 2 | 06:07:49 | blown up by Creeper | at/near the respawn approach |
| 3 | 06:09:22 | slain by Zombie | during the stuck cycle's flee |
| 4 | 06:09:33 | slain by Zombie | same |
| 5 | 06:09:53 | slain by Zombie | same |
| 6 | 06:10:29 | slain by Zombie | same |
| 7 | 06:10:41 | slain by Zombie | same |
| 8 | 06:10:58 | slain by Zombie | same |
| 9 | 06:11:50 | slain by Zombie | same; respawned, no further death before the stop |

**Death 1 cost the whole inventory.** His cycle-208 words: "Lost
the lot — logs, cobble, the porkchops, all of it." The 15
cobblestone and 29 porkchops — the count two days were spent closing
— dropped at (70,60,−87) and were never recovered (he respawned 28
blocks away; the drops aged out). Day 14 therefore wakes to an
empty-handed citizen at a hilltop spawn (36.5,73,−86.5), not to the
count in hand. That is a fact for the next charter, stated here so
it is not discovered at a wake.

Why mobs at all under held daylight: the floor held TIME (1000)
and every assertion landed (§Floor), but weather is not held — rain
moved in from ~06:00Z (visible in the stills), and under the dense
canopy around home and the respawn hill, rain gloom is dark enough
for surface spawns in pockets. Days 11–12 had no rain. Not a floor
failure; filed as a world condition the next charter must price in
(a daylight hold is not a safety hold in the rain under trees).

## THE DIG-GUARD'S LIVE ACCOUNT (charter §2)

Offline: fixture `pulse/day13/test-dig-guard.js` extracts the exact
span shipped in the driver — **18 PASS / 0 FAIL** (refuses below-cap
with trace row + truthful line; permits at-cap and lateral; re-arms
on a >6-block stance move; disarms on count-closed), output filed
at `pulse/day13/dig-guard-fixture-output.txt` and quoted in the
charter.

Live: the guard **armed once** — 05:28:41Z, `kind:'dig-guard-arm'`,
entry level **65**, stance (70,65,−84) — on the stone phase's first
stone-family digs east of the pad (cycles 33–37: digs at tops 63–64,
all permitted, at or above the entry−2 cap). It **disarmed 4
seconds later**, 05:28:45Z, `kind:'dig-guard-disarm'`,
reason `count-closed` (held 15 ≥ 8) — its designed trigger, firing
exactly as built. **Digs refused: 0. Below-cap digs offered while
armed: 0.** Every dig after 05:28:45Z — including all the hole
digging at y59–61 — was post-disarm and therefore unguarded, and
the descent that mattered (cycle 38) was a fall during a goto,
which no dig-side guard can see. The guard worked; the guard's
arm/disarm envelope did not cover the day's actual risk. The two
revisions this forces (disarm only at home ground; arm on falls)
are filed in the amendment disposition below.

## S7.0 EXIT-FIRST — DISPOSITION: REVISED, NOT PROMOTED

Filed in full at the tail of
`skills/furnace-sequence-EXTRACTION-AMENDMENT-20261109.md`
(append-only; the clause text is unchanged). Summary: the governed
case (a dug descent) never occurred — the descent was a fall; the
guard disarmed on count-closed ten minutes before it; his in-hole
notch work was clause-shaped and gained single steps (y59→60 twice)
that never composed, and the exit that worked was a placed cobble
rung (cycles 205–206) — the rehearsal-proven form. Revisions R1
(disarm), R2 (arm on falls), R3 (placed-rung as a first-class exit)
are named there. The clause stays DRAFT.

## THE FLOOR'S REPORT

Two opens. Open 1 (05:18:14Z) carried Gate B as far as a lease, then
the driver's start raced the lease TTL and refused (§Incident G1);
its state is preserved at `floor/run/day13/state-refused-start-0519/`.
Open 2 (05:20:44Z) carried the day:

- VERIFY_FEED ×1 — cooked_porkchop need 8, have **29** → PASS, zero
  gives (fresh snapshot at the rig path).
- LEASE_ISSUE `lease-1794288044437`, launch → live on the driver's
  first heartbeat; the start gate confirmed ("GATE: live lease
  confirmed at start").
- ASSERT_DAYLIGHT ×13, **every one attempt 1** (the repaired path's
  second consecutive full day; issuer verified against the server
  log at open: Gallery 05:20:49Z mirror row, and no MagnusandMouse
  /time set after the 05:17:54Z changeover).
- COUNT_DEATH ×9 (one per trace death row).
- **PARK ×1 at 06:09:24.272Z** — `deaths_today>=max_deaths`,
  evidence `trace#count=3`, lease revoked, state parked. The
  floor's half of the stop rule fired exactly as chartered; that
  the driver could not hear it is §Incident H1, a harness fault,
  not a floor fault.
- FLOOR_CLOSE on the lane's SIGTERM at stand-down (seq 96).
- The verifier's watch ran throughout; its standing cross-audit
  note over preflight channel traffic is the known day-11 artefact.

Keeper (charter §6 activation): the standing cameraman was
STOP-stopped with Cody offline; the activated file's md5 was
verified at the point of use (`cameraman-day12-live.py`
`3551b50d…`, keeper base `6042c1cb…`); banner confirmed keeper live
+ changeover (CAM_DAY_REFRESH_OFF=1); the floor was the day's sole
daylight asserter (no MagnusandMouse /time set lines after
05:13:35Z; the next is the restored chain's own at 06:15:55Z).
In-window keeper log (filed at
`pulse/day13/keeper-day13-log-window.txt`): **167 CUT reframes**,
3 SUBJECT-HOLDs (the last at 06:09:17Z, when the driver's state
mirror went stale inside the stuck cycle — the keeper held the
last frame, as designed).

## FRAME VERDICT — FROM CONTENT (10 stills, ~10-min cadence)

Stills at `pulse/day13/stills/`, extracted from the Orin capture
segments and read one by one:

- **Cody fully visible: 1/10** (05:45 — standing in his dug notch,
  centre-frame; chunk-void margins).
- **Cody partial/minute: 4/10** (05:24 partial behind terrain,
  clean; 05:34 and 05:37 a tiny figure in the pit under chunk
  voids + /tp receipt text; 06:07 a speck at respawn under the
  "blown up by Creeper" line).
- **Cody absent: 5/10** (05:29 terrain occlusion; 05:49, 05:57,
  06:01 the camera inside the canopy while he was in the hole/at
  respawn; 06:13 chat window open over the death burst, the
  keeper's /tp half-typed in the input line).
- **Clean frames (no void, no text): 3/10. Clean AND Cody visible:
  1/10** (the 05:24 partial).

Subject-KEEPING is not the failure (167 reframes; the camera was
where he was, including chasing the respawn/flee positions at
y70–89 in the burst). The failures are the day-12 pair, unchanged:
chunk voids on /tp cuts (3/10) and the camera client's own
command/death text in frame (5/10) — **capture-side hygiene**, plus
a day spent in a hole under a canopy, which no framing survives
well. Filed as the standing capture-side deficit, not a keeper
deficit.

## BUDGET

209 completed cycles in 53.97 minutes = **3.87 calls/min** against
the standing ceiling of **3.976** — under, for the fourth
consecutive day. Metered cost **$0.2317** (DeepInfra primary all
day; zero failovers, zero governor calls). Say-words 7,303.

## INCIDENTS

### Incident H1 (HEAD) — the stuck cycle defeated both safety
### checks; 9 deaths; the day stopped by hand. fault_owner: harness

The 3-death abort and the floor gate are both **cycle-head**
checks in the driver (gate at loop top; `shouldAbort(deathsThisRun)`
immediately after). Death 3 landed at 06:09:22Z and the floor
parked at 06:09:24Z — and the driver never reached another cycle
head. Cycle 212 (begun ~06:09:03Z off cycle 211's `goto 31 67 -102`,
"get down off this canopy") passed body control to the driver's
floor-reflex layer: the log shows an 11-hop flee (33.7 blocks,
"budget exhausted") and a burrow attempt, all inside the one cycle,
while death events 3–9 fired asynchronously into the trace. The
reflex layer checks neither the gate nor the death count; the
model loop that does was still awaiting the cycle's return. The
lane killed the driver process at 06:14:43Z (SIGTERM; clean exit
rc=0; Cody left the game) — the stop rule executed by hand, 5
minutes after the park, 6 deaths past the limit. **Lesson, in the
standing form: a safety check that only runs at a cycle head is
only as strong as the longest single cycle. The death counter's
writing path was proven (trace rows n=1..9, floor COUNT_DEATH ×9);
its READING path on the reflex layer does not exist.** Any future
day needs the abort + gate enforced inside the reflex layer or on
a watchdog timer independent of the model loop. Until then the
3-death rule is a floor guarantee (the park fires) with a manual
backstop, and this record says so plainly.

### Incident H2 — total inventory loss at death 1

Death 1 (creeper, 06:07:06Z) dropped his entire inventory at the
hole exit — the 15 cobblestone, 29 porkchops, 6 pickaxes, planks,
sticks, logs: two days of accumulated position, gone in one blast,
unrecovered through 8 further deaths and despawn. Not a malfunction
— Minecraft being Minecraft — but it converts day 14's wake from
"the count in hand" to "empty hands at a hilltop spawn", and it
prices the true cost of a death at the surface: not the count of
deaths, the loss of the carried position. Any future furnace day
should treat the walk home WITH the count as the dangerous leg,
not the dig.

### Incident G1 — Gate B refuse-start (lease-expired), recovered

Open 1's lease issued 05:18:14Z (TTL 60s); the driver's launch ran
~60s late (an ssh `&&`/`&` precedence slip in the launch command —
the third time this shell trap has bitten this lane) and its start
gate read the lease 2.5s past expiry, before the floor's renewal
write landed: `GATE REFUSE-START: lease-expired`, one trace row,
no commands executed, Cody joined and left untouched (post-flicker
snapshot: inventory byte-identical). Recovery in the established
pattern: state archived, fresh snapshot, fresh open, driver
launched the second the lease issued — gate confirmed, wake clean.
Filed as a lane sequencing error (verification reads between open
and launch consumed the window the charter's R1 rehearsal had
priced at 18s), not a floor or gate defect: the gate refused
correctly on a genuinely expired lease.

### Incident R2 — the relay's ninth death (Gate B pre-check)

Found dead at the pre-check (both setsid supervisors' pidfiles
pointing at dead processes; no systemd units exist on this VM
instance — the day-12 lesson held and the check looked for the
form this box actually has). Relaunched; RELAY-OK PASS from Thor
at check and again at launch. Driver ran the primary route all
day with no failover.

### Incident F — frame hygiene (capture-side)

Chunk voids in 3/10 sampled stills and command/death text in 5/10,
including one frame with the camera's chat window open mid-/tp.
The day-12 capture-side deficit, unclosed; not a keeper fault
(167 reframes, holds correct). It is also, read cold, the day's
most honest footage: the 06:13 still IS the death burst, chat and
all.

## CLOSE + POSTURE

Driver stopped by hand 06:14:43Z (H1). Stand-down in the chartered
order after Cody was offline: op bot quit through its channel
(receipted `bye:true`); floor SIGTERM → FLOOR_CLOSE (seq 96);
verifier and mirror stopped; keeper STOP-stopped on the Orin and
the **original `cameraman.py` relaunched detached (pid 1537246,
refresh ON)** — its own start assertion **VERIFIED LANDED** in the
server log (MagnusandMouse /time set 1000 at 06:15:55Z). Relay left
running (standing service). Vega and Geist untouched all day.
Thor↔Orin skew <0.5s at Gate B.

**Standing state after day 13:** Cody alive at his respawn point
(36.5,73,−86.5), hp/food 20/20, **inventory empty**; deaths **132**;
the count is NOT in hand (it is despawned at the hole exit); the
table is unreached, the furnace uncrafted, S10/S11 unproven for
the third day; the dig-guard is fixture-proven and was live-correct
inside an envelope the day outran; S7.0 is REVISED-not-promoted
with R1–R3 named; and the 3-death stop rule needs a within-cycle
enforcement path before it can be called a guarantee again.
