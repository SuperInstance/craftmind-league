# DAY-11 CHARTER — DRAFT (2026-11-09)

*Drafted offline by the day-11 preparation lane, 2026-11-09. NO world
contact was made in this drafting: no placement, no wake, no logins,
no server commands. Everything below is drafting + code on copies +
fixture tests. Status: DRAFT — a live day 11 requires the pre-wake
gates in §2–§3 filed PASS and the readiness list (§12) cleared or
explicitly waived by the parent. Every place a live-day decision is
still owed is marked **OWED**; nothing owed has been invented here.*

*Sources read in full: `floor/FLOOR-IMPL-20261109.md` (incl. its 11
gaps), `skills/furnace-sequence.v1.json` + `skills/FURNACE-SKILL-
20261109.md`, `director/SCENARIO-002.md`, `pulse/OPERATIONS.md`,
`pulse/DIRECT-DRIVE-DAY10-20261109.md`, the floor source
(`floor/floor.js`, `gate.js`, `constitution.js`, `opchannel.js`,
`release.js`), and the day-10 driver (`pulse/direct-drive-day10.js`).*

## Artefacts this charter builds on

| Artefact | Path | State |
|---|---|---|
| Day-11 driver (COPY of day-10 + gate wiring) | `pulse/day11/direct-drive-day11.js` | md5 `2c9b2020…`, node --check PASS; day-10 original untouched (md5 `aa92def4…` before and after) |
| Gate client | `pulse/day11/gate-client.js` | md5 `6b891704…` |
| Gate-wiring fixture battery | `pulse/day11/test-gate-wiring.js` + `pulse/day11/gate-wiring-fixture-output.txt` + `pulse/day11/fixture-run/` | **4/4 PASS** (§11) |
| Places store (day-10 carried forward) | `pulse/day11/direct-drive-places-day11.json` | copy of the day-10 file |
| Day-11 floor contract (DRAFT) | `floor/contract-day11-draft.json` | validates clean; sha256 `bad629589c958259fb26e92d60a56f16b7c4e2e9c7b7176a59fbf447bbf3603f` — PROVISIONAL (re-pins when the issuer identity is confirmed, §5) |
| Launch script (DRAFT, not executed) | `pulse/day11/dd-launch-day11.sh` | mirrors day-10 + gate env |

## 1. The day at a glance

Cody wakes where day 10 parked him: in the stone hollow at
(70.3, 64, −88.6), hp 20, food 20, holding cobblestone ×1, oak_log
×18, birch_log ×10, planks ×8, sticks ×7, wooden pickaxes ×5,
cooked porkchops ×30. Deaths baseline **123** (derived, §3). The
day's named plan is the furnace skill (§6) — its second use, the one
that makes it capital or breaks it. On his road home stands scenario
#2's single log, **if** its placement window has landed (§2). For the
first time, the floor supervises a live day (§5): it verifies his
feed before any lease exists, issues the lease the driver now
actually consults, holds daylight as the single asserter, counts his
deaths from his own trace, and can park the day — and the driver,
wired at last, will stop within one cycle when it does (§11).

The day is judged, in this order: **the action curve first** (acts
per ~10-minute block by verb, the standing product standard), then
the furnace outcome against §6, then triple-021 scored by its rule
(§7), then the frame verdict (§8), then the deaths delta.

## 2. GATE A — the scenario-#2 placement window (gating pre-wake section)

The placement is a separate parent-sequenced window (SCENARIO-002,
PLACEMENT WINDOW REQUIREMENTS). This charter executes none of it.
The day-11 lane receives the scenario and its hand-over line only
after the window files its readback. The checklist the window must
satisfy, from the scenario filing:

1. **Claimed first** in `pulse/DIRECTOR-WORLD-CLAIM.md`: the window,
   the district (the step box, x 63..66, z −90..−87), and the op
   identity. Gallery is reserved to citizen-day ops; the identity is
   the parent's to assign (scenario #1's remediation precedent:
   MapProbe4). One bot per process, always. **OWED: parent
   sequencing + identity.**
2. **No citizen live or imminent**: no citizen day running anywhere
   in the world, none in the hour before this wake, day 10's close
   filed. The window's open re-verifies from live stores: server-log
   join/leave audit clean, no citizen in the world.
3. **Daylight hold landing-verified at the open** (issuer-specific
   server-log `/time set 1000` lines) and through the window; the
   cameraman untouched; the clean-frame toggle untouched
   (chatVisibility stays 1).
4. **Pre-reads from fresh read-only copies**: the tread cell
   (65, 66, −88) reads `air`; the scenario's invariant cells read as
   spec'd; Cody's saved `.dat` sha256 unchanged from day 10's close.
   **If any pre-read disagrees with the filing, the window STOPS and
   files — it does not improvise a new site.**
5. **The one placement** — `/setblock 65 66 -88
   minecraft:oak_log[axis=z]`, nothing else placed, cut, or moved —
   then verification **twice, from two stores**: the scoreboard-file
   probe (execute-store → save-all flush → scoreboard.dat) reading
   the cell as `oak_log[axis=z]`, and a fresh region copy parsed
   offline reading the same — plus the invariant cells and the
   his-ground spot reads from the scenario's manifest.
6. **The window files its readback** under `director/` before this
   charter's day runs with the line.

**If Gate A is not filed MET:** there is no scenario — only a road
as he left it — and no hand-over line is owed. The day may still run
clean on Cody's own list, but the driver copy's scene text (§4)
carries the line, so a clean run needs an opening variant without it
(**OWED: parent — postpone the day, or supply the clean opening**).
Running the copy as-is without the placement is not an option this
charter offers.

## 3. GATE B — launch gates (all verified from live stores, day-10 pattern)

1. **Claim**: one line in `pulse/ledger.jsonl` via
   `ledger-append.py` claiming Cody for day 11; this is the ONLY
   live lane in the world; Gallery reserved to this lane's ops.
2. **Citizen state**: Cody's save present in the LIVE playerdata
   directory; sha256 compared against day 10's close; Vega and Geist
   saves byte-identical to their charter hashes, untouched. Cody is
   not opped, as ever.
3. **Deaths baseline**: **123**, re-derived at pre-checks via
   `pulse/lib/deaths.js` over `deaths-record.jsonl` + all day
   traces — derived, never asserted.
4. **Relay**: RELAY-OK proven end-to-end **from Thor** (a real
   DeepInfra completion through the ddbridge relay) before any wake,
   and re-checked at launch — day 10's relay died between its first
   check and launch (its seventh death) and was re-proven at
   20:29:39Z pre-wake; that is the standard, not the exception.
5. **Cameraman**: v3 running on the Orin, no STOP file,
   `chatVisibility:1` intact, clean-frame toggle untouched — and the
   daylight changeover of §5 in effect. The cameraman is never
   STOPped over a live citizen without a hold-keeper (§9.8).
6. **Floor open** (§5): the floor process is running against the
   day-11 contract; its writer path has self-proved (canary acks
   moving); VERIFY_FEED has passed against the census snapshot; a
   live lease stands in `floor/run/day11/lease.json`; the verifier
   is running and its status file is fresh.
7. **Op bot**: the day-11 op bot (op-day10's successor) is running
   with the park-notify handler of §5 receipting a pre-launch ping
   and a test park-notify. **(Readiness §12 — not yet built.)**
8. **Driver**: `pulse/day11/dd-launch-day11.sh` with the gate env
   set (`FLOOR_STATE_DIR`, `FLOOR_DRIVER_ID=cody-driver`); the
   driver's start log must print `GATE: live lease confirmed at
   start` (§9.10).

## 4. Wake sequence (feed → verify → work; each step verified server-side)

Day 11 has **no exit/relocation step**: nobody moves Cody. His start
point is unchanged from day 10's close, and his exit from the hollow
is his own walk — the prediction's first clause (§7) is scored on
exactly that. The sequence:

1. **Floor VERIFY_FEED** (before any lease): the snapshot producer
   (§5) parses Cody's saved `.dat` from a fresh read-only copy;
   cooked_porkchop count must be ≥ 8 (he closed holding 30; the
   contract's declared minimum is the floor's, not his expected
   count). If short, the floor re-issues the declared give
   (32 cooked_porkchop) via its own op channel, max 2, with a fresh
   census re-read after each. Still short → PARK `feed_unverified`,
   no lease ever issues, no wake.
2. **LEASE_ISSUE**: only after the writer's first canary ack AND the
   feed verifies (the floor's own order; a floor that cannot write
   cannot authorise play).
3. **Driver launch + start gate**: the driver's heartbeat starts at
   boot; after spawn it confirms the live lease
   (`gate.check('__driver_start__')`) — refusal stops the day before
   the wake (§11, fixture phases C/D).
4. **Driver wake feed-confirm** (the day-10 wakeSequence, unchanged):
   from HIS OWN read — food target 18, eating held porkchops via the
   reflex eat; expected to pass immediately at food 20. Failure →
   the day stops, as on day 10. This is the second, independent feed
   check: the floor read a store the feeder cannot write; the driver
   reads the body itself.
5. **Verify**: wake readback — position (70.3, 64, −88.6) ± a block,
   hp 20, food ≥ 18 — trace-rowed (`kind: 'wake'`), before the
   model's first cycle.
6. **Work**: cycle 1. His first perception carries the day-11 scene
   text (§7 for the hand-over line it opens with, when Gate A is
   MET). The survival reflexes (the driver's internal floor object —
   the reflex layer R, **not** the supervisor) run as on day 10;
   they fired zero times on day 10 and are unchanged here.

## 5. The floor's first live use

### Contract terms (draft: `floor/contract-day11-draft.json`)

citizen `Cody` · driver_id `cody-driver` · constitution `floor.v0` ·
day window 2026-11-10T09:00:00Z → 2026-11-11T09:00:00Z (the AKST
day) · max_deaths **3** · daylight **held**, command `/time set
1000`, issuer `FloorOp` (PROVISIONAL — see below) · feed: verify
cooked_porkchop ≥ 8, remedy give 32 · sensor: this day's trace,
`pulse/direct-drive-trace-day11-20261110.jsonl` · park_bay null
(stop-in-place pose; no hazard predicate exists — floor gap, named
in the floor filing).

### Thresholds — set once here, pinned by the contract hash

| Timer | Value | Why |
|---|---|---|
| `lease_ttl_s` | 60 | The binding fail-closed number: whatever else dies, honoured commands stop 60 s after the last renewal. |
| `heartbeat_lost_s` | 90 | The driver's gate-client heartbeats every 1 s; 90 s of silence is a dead driver, not a slow one. Renewal keeps the lease ahead of its TTL while the heartbeat is fresh, so expiry only ever bites when renewal has stopped. |
| `canary_s` | 60 | Writer-path self-proof cadence; the verifier's stale bound derives from it (~90 s + poll → writer-death detection ≤ ~105 s; the floor self-detects at 2.5× canary and revokes directly). |
| `daylight_check_s` | 240 | Comfortably under the ~550 s dusk-leak window (OPERATIONS §8), with margin for a slipped cycle; each assertion is landing-verified, 3 failures → PARK. |
| `poll_s` | 5 | The floor's tick; STOP-file and sensor latency stay in single-digit seconds. |

These are the study's pre-registration values, adopted once for day
11's shape (floor gap #11). The contract sha256
(`bad62958…f3603f`, draft) pins them — **with one deliberate
exception**: `daylight_issuer: "FloorOp"` is the floor filing's
placeholder (gap #10). The live issuer must be a real, dedicated op
identity — not Gallery (citizen-day ops), not the cameraman's
identity, not MapProbe4. **OWED: parent assigns/confirms the floor's
op identity; the contract re-pins its hash when it is set, and the
final hash is what the day record cites.**

### Daylight: the single asserter is THE FLOOR

The contract must name one asserter (floor gap #5); this charter
names **the floor**, for three reasons. (1) Its assertions are
landing-verified issuer-specifically on its own op channel, and
three unlanded attempts become a PARK — a failing hold stops the
day instead of leaking a night nobody notices; day 9's deaths #122
and #123 happened in an unheld night under an issuer-blind guard
pattern. (2) The cameraman's typed channel is a filming surface
with a known fragility (the day-9 chatfix: its command channel died
of a chat-visibility state); supervision should not ride it. (3) One
asserter ends the two-clocks problem: whoever asserts is whoever
verifies, and the floor's log is the record.

Consequence, stated plainly: **the cameraman's own `/time set 1000`
refresh (DAY_REFRESH) must be OFF for day 11** — two asserters is
the one configuration this charter forbids. That change belongs to
the cameraman lane (**readiness §12**); it is not made by this
charter. If the changeover has not landed by launch, the fallback
is a degraded mode — contract `daylight: "free"` (the floor asserts
nothing) with the cameraman holding as on day 10 and the day lane
verifying its landings GATE-1-style — **OWED: parent chooses the
fallback or holds the day; running `held` with both asserters live
is not permitted.**

The floor's daylight verification remains landing-based (an
issuer-specific line in the log bytes after the issue). The study's
stronger clock-frozen check is not implemented (floor gap #5) and
is not claimed here. The floor reads the server log via its rig
(`server_log_path`): live, that path is a Thor-local mirror of the
Orin log tail (**readiness §12** — the mirror is a rig item, built
by the day lane, read-only toward the Orin).

### Feed source (floor gap #6 — the fixture JSON becomes a live store)

`rig.snapshot_path` for the live day points at a snapshot produced
by a **read-only census step**: a fresh copy of Cody's playerdata
`.dat` taken from the Orin's live directory, parsed offline on Thor
(the fleet's mcprobe/.dat route — the same instrument the
scenario-#2 census used), written as `{inventory: {…}, ts}` to
`floor/run/day11/snapshot.json`. The feeder (any op bot) has no
write path to that file; the floor's VERIFY_FEED remedy loop re-runs
the census after each give rather than trusting the give's result
line. The producer is a small script the day lane runs at floor
open and on the floor's remedy demand (**readiness §12**).

### park-notify (floor gap #3): declared RECORD-ONLY, with a handler

Day 11's op bot gains a `park-notify` handler with exactly this
behaviour: append the request (id, reason, ts) to the op bot's
park-notify log, print a console alert line, respond `ok`. It moves
nothing and quits nobody. The physical park is carried by gate
rejection + the driver's gate-stop (§11) — proven in fixture — and
by nothing else; the handler exists so a park is an operator-visible
event with a receipt, not a silent state change. Building
`op-day11.js` with this handler + a fixture test against a stub
floor park-notify is a readiness item (**§12**), not part of this
drafting lane's wiring deliverable.

### NOTIFY surface, release, and the floor's limits

- NOTIFY rows land in the floor log + `operator-alert.jsonl` in the
  floor state dir; the day lane tails both as part of its watch.
  **OWED: parent confirms no further alerting surface is required
  for day 11** (floor gap #12; the meta-watcher's external expecter
  remains Casey's outstanding owner item, backstopped by the TTL —
  floor gap #9, restated, not closed here).
- A PARK is released only by the parent, running `floor/release.js`
  by hand. The floor cannot release itself; no other release path
  exists (§11 fixture phase B exercises the external-release shape
  at the gate: none was needed — a parked day ends parked unless the
  parent rules otherwise).
- The floor has **no preventive authority** — the floor filing's
  correction stands at the head of its live use: it cannot prevent
  a death; it can only count one and park the body. The reflex layer
  that holds survival authority inside the body is the driver's own
  reflex object (R), unbuilt as a separate layer and unaudited
  (floor gap #2); day 11 changes neither fact. Two PARK triggers
  remain enumerated-but-detectorless (`evidence_contradiction`,
  `rollback_failed` — floor gap #4): they will not fire on day 11,
  and the charter does not pretend otherwise.

## 6. The named plan — furnace skill v1, REVISED (the asset's second use)

The charter adopts `skills/furnace-sequence.v1.json` (v1.0.0,
status ADMITTED-WITH-UNPROVEN-TAIL) as day 11's named plan **as
data** — it steers the day through the scene text and this charter,
not through any driver change. One revision is applied, on census
evidence, and one step is struck:

> **STRUCK — the recovery step.** The asset's §5 step 2 and S6
> preference (a) send Cody to recover day-10 drops still lying in
> the world (8 in the seam row at (90–92, y64, −104..−106), 4+ in
> the hollow). The scenario-#2 census (fresh Orin entity copies,
> 2026-11-09T23:33Z, offline parse) found **the drops are GONE**:
> zero item entities in the hollow box, and the only item entities
> anywhere in r.0.-1 are three eggs at his pen — items age out under
> the held daylight. There is nothing to recover, at either site.
> The stone phase digs fresh, under the seam-stance rules — which
> makes the stance's positive arm a *pure* test: every drop it
> gathers will be a drop the stance itself produced.

### The day's run of the asset (S0 assess computed from day-10 close)

| Step | Day-11 ruling |
|---|---|
| S0 ASSESS | First act: count from state — logs 28 (oak 18 + birch 10), planks 8, sticks 7, pickaxes 5, cobble **1**, porkchops 30. Every skip below is S0's output, not an assumption. |
| S1 WOOD | **SKIP** — read-back logs 28 ≥ 4. |
| S2 TABLE | **GO** — `goto` the table at (64, 67, −94), short hops on relief (R6). This is his homeward leg: it crosses the shoulder band the prediction watches (§7). |
| S3 PLANKS | **TOP UP** — held 8 < 12; craft oak_planks at the table to read-back ≥ 12 (the chain's 9 + wear margin). |
| S4 STICKS | **SKIP** — held 7 ≥ 4. |
| S5 PICKAXE | **SKIP** — 5 held; the S3/S4 reserves stay unspent against wear (day 10 crafted 5 across the day). |
| S6 STONE | **GO, fresh dig** — primary site: the hollow pocket at his wake country (x 69–73, z −89..−86; stone floor tops y59–63 — the stone he dug on day 10, at foot level, on his road). Alternate: the seam row (90–92, y64, −104..−106) as a fresh dig (its drops are gone too). Preference is the pocket: it prices no cross-country goto tax before the test begins. |
| S7 SEAM STANCE | **THE TEST** (protocol below) — step INTO the row/floor so the feet are at the dig level, inside the seam, before digging laterally. |
| S8 WORK THE ROW | Dig laterally at foot level, one cell at a time; after every ≤3 digs, advance one cell along the row so the body passes over the drop cells; read-back after every advance. **Count cobble from state, never from digs (R1).** Never chase a descending seam downward (R3); `collect` is not a recovery verb — recovery is a goto onto the drop cells (R4). Continue until **read-back cobblestone ≥ 8** (he holds 1; the phase owes +7). |
| S9 RETURN | Short hops home (R6), priced at 3 attempts per leg. **Climb is excluded from the plan entirely** (0/13 on day 10; R6). |
| S10 CRAFT FURNACE | At the table, with read-back cobble ≥ 8: `craft furnace`. On failure apply R5 by dialect — *named* shortage: act as spoken; *cherry_planks phantom*: recraft planks → retry once → hard stop (heuristic, one observed recovery, one contradiction — never promoted); *unnamed* ("no craftable recipe"): state read, name the shortage from state, **never a second identical retry** (day 3's eight identical retries are the anti-pattern this rule exists to kill). |
| S11 PLACE FURNACE | `place furnace` on flat ground at the home pad beside the table — **not** in the pit columns (x 65..66, z −93..−91) and not on the pit's rim. |

### The positive-arm test protocol (S7/S8 — what day 11 proves or breaks)

1. Read-back cobble **before** entering the stone (expect 1) —
   trace-rowed.
2. Stance first: feet at the dig level inside the row before any
   lateral dig (R2). No digging a seam row from a stance above it —
   the geometry that lost 13 of 14 drops on day 10.
3. Read-back after every ≤3 digs and every advance. The stance is
   **SUPPORTED** if held cobble tracks the foot-level digs (drops
   gathered by the body passing over their cells, the felltree
   mechanism day 10 evidences positively); **BROKEN** if read-back
   lags digs the way day 10's did.
4. The result files **into the asset**, either way: the day lane
   appends the second entry to the asset's `uses[]` with the
   day-11 trace pointer and the outcome, and S10/S11's endings file
   exactly as they land ("crafted, not placed" files as exactly
   that, never rounded up). Promotion to PROVEN requires this use
   to end at a **verified placed furnace** (the asset's §5).

### Verification (from stores Cody cannot write)

Craft: the furnace appears in his parsed `.dat` after S10. Place:
a fresh region read shows the furnace block at the placed cell
after S11. Budget: the asset prices 55–70 cycles wood-in-hand to a
placed furnace; day 11 starts wood-in-hand, and the chain is the
day's **first** business — day 10's failure shape was the chain
reached only in the final 40 cycles.

## 7. Scenario #2 in the day

**Precondition**: Gate A (§2) filed MET. Until then there is no
scenario and this section is inert.

**The hand-over line** — the driver copy's post-wake scene text
opens with it verbatim (it names only what he already knows — his
wake, his stone count, his road, his ground — and deliberately does
not name the tread):

> "You wake in the stone hollow where your hunt ended yesterday, one cobble in hand and the furnace still wanting seven more. Home is west along the south shoulder, the pit on your left hand — your table, your pen and your wheat as you left them."

**What the day does not do**: the driver does not route him to the
tread, does not name it again unless he does, and does not score
him on it. His list — the furnace first — runs as his own. Ground
truth the day lane holds: the pit on his route's south side holds
water at (65..66, −92..−94) and his route discipline refuses those
columns; his deaths stand at 123.

**The prediction** — `triple-021-scenario-002-stone-hollow-
prediction`, pre-filed via `commons/triples/allocate.py` before any
placement exists. Verbatim:

> "On day 11, Cody wakes in the stone hollow at (70.3, 64, −88.6) with the furnace chain at 1 of 8 cobble, and his day is again governed by his own list. The Director predicts: he leaves the hollow under his own power, and on his homeward leg he crosses the shoulder band (x=65 while z is in −90..−87) — and the tread log at (65, 66, −88) is neither dug by him nor built on by him during day 11: no dig or place command in his day-11 trace targets the step box (x 63..66, z −90..−87), and the post-day census still reads (65, 66, −88) as the placed oak_log. The element will be met as ground — climbed over or walked past — not taken as material and not finished as a stair."

**Scoring rule** (world evidence only — the day-11 trace + a fresh
post-day census of r.0.-1): **PASS** = all three hold: (i) his
trace's homeward leg crosses x=65 with z in −90..−87; (ii) no
dig/place command in the trace targets the step box; (iii) the
post-day census reads (65, 66, −88) as `minecraft:oak_log[axis=z]`.
**FAIL** = any one of: the census reads the tread cell as anything
else; a dig/place targets the step box; or he never crosses the
band on his homeward leg — *refusal-by-geometry*. The perception
sub-read (a say within 5 cycles of his first westbound crossing of
x=66 in the band naming the road, the step, a log, the shoulder, or
a stair) is recorded in the loosening note and is **not** scored.
The Director declares neither success nor failure for the player;
the score prices the scenario's siting claim only. After the day:
the Director lane reads the trace + a fresh census of the step box
and tread cell, scores the triple, and files loosening note #2.

## 8. Camera — position-driven subject-keeping

Day 10's frame verdict was *clean picture, missing subject*: 9/9
stills clean (Commands Only held; zero chat, commands, nameplates)
and **Cody clearly visible in 0/9** — the cameraman loses him in
canopy/relief country; the shot log records intent, not content.
The Mirage bench returned **NO** (Orin `~/mirage-bench/
MIRAGE-BENCH-20261109.md`): no frame-content checker exists, and
none is adopted. Day 11's requirement is therefore on the camera
itself:

1. **Frame from the citizen's known position.** The driver
   publishes his position every cycle to the state mirror
   (`pulse/direct-drive-state.json` — pos, hp, food, last say, last
   result; cameraman v3 already reads this path). The cameraman's
   framing target is the mirror's current position, re-read each
   cycle — position-driven follow, not a shot plan. If the mirror
   goes stale, the camera holds its last position and the staleness
   is logged; it does not silently frame somewhere he has left.
2. **Frame verdict by sampling** (the day-10 method, since no
   content instrument exists): ≥9 stills sampled across the day's
   capture segments at ~10-minute cadence, scored
   Cody-clearly-visible **n/9**, reported in the day record beside
   the action curve. Day 10's 0/9 is the baseline this requirement
   exists to close.
3. **Standing rules unchanged**: chat stays Commands Only
   (`chatVisibility:1`); the clean-frame toggle is NOT touched (its
   ON state kills the typed channel — chatfix filing); the
   cameraman is never STOPped over a live citizen without a
   hold-keeper (§9.8); its daylight role is per §5's changeover.

The cameraman code change this requires (follow-the-mirror framing
+ staleness logging) is a readiness item (§12) owned by the
cameraman lane — this charter states the requirement and the
verdict method; it does not implement them, and it does not claim
day 11's pictures will be better until the change is in and the
samples say so.

## 9. Stop rules (binding)

1. **Deaths**: 3 deaths in the run stops the day — by BOTH
   mechanisms, either sufficient: the driver's own abort
   (`shouldAbort(deathsThisRun)`, the standing circuit-breaker,
   OPERATIONS §7) and the floor's PARK at `max_deaths` counted from
   the trace. The counter's writer path is proven on both sides:
   the bot's server-driven `death` event appends the trace row the
   derivations read (driver side), and the floor's COUNT_DEATH
   derives from that same trace via `lib/deaths.js` — a counter
   whose writer path has never moved is a decoration, and neither
   of these is one.
2. **Any floor PARK** stops the driver within one cycle (§11,
   fixture-proven). The day ends parked. Release is the parent's
   alone, via `floor/release.js`, by hand.
3. **Floor writer-path failure**: the floor revokes the lease
   directly and exits (code 3); if the floor itself dies, the 60 s
   lease TTL is the binding fail-closed bound — commands stop
   whether or not anyone notices.
4. **Feed unverifiable** at either check (§4.1, §4.4) → no lease /
   no day. He is never run unfed.
5. **Relay not RELAY-OK** at the launch re-check → no wake.
6. **Placement pre-reads disagree** → the window stops and files
   (§2.4); no improvisation, no day under a false premise.
7. **A zero-act 10-minute block** while the day runs is a STALL,
   named at close (the action-curve rule; day 10 had none —
   minimum block 24 acts).
8. **The cameraman is never STOPped** over a live citizen without
   a hold-keeper standing in its place.
9. **Contract invalid or hash-mismatched** → the floor refuses at
   open (REFUSE_RESUME, exit 2, zero acts) → no day.
10. **Gate not live at driver start** (the start log lacks `GATE:
    live lease confirmed at start`, or shows a refusal) → the day
    is not under the floor and does not proceed. Day 11 is the
    floor's first live use; running it ungated would spend the day
    and prove nothing about the supervisor.

## 10. Reporting (the day record's required shape)

The day-11 record leads with **the action curve** (acts per
~10-minute block by verb, reflex-layer acts counted separately,
gate rows shown), then: the furnace chain step-by-step against §6
including every stance read-back; triple-021 scored by its rule
(§7); the frame verdict n/9 (§8); the deaths delta from 123,
derived; the floor's act summary from its own log + verifier status
(leases issued, canary health, daylight assertions and their
landings, feed verification, parks — if any — with reason codes);
incidents at the head, not the tail. Verdicts only from world
evidence; `fault_owner` named for anything that fails.

## 11. The gate wiring — implementation and fixture results

Floor gap #1 ("the gate has no teeth in production yet — the real
driver does not consult `lease.json`") is closed **offline**, in a
copy. The day-10 original is untouched (md5 `aa92def4…` verified
before and after); all day-11 code lives in `pulse/day11/`.

**Integration points** in `pulse/day11/direct-drive-day11.js`
(diff vs the day-10 original: 72 changed lines — the gate sites
below, the day-11 trace/places paths, and the day-11 scene text):

1. **Require** — `gate-client.js` is required immediately after the
   `lib/deaths.js` require, with the R/F name collision named in a
   comment at the site.
2. **Boot** — `gate.init()` + `gate.startHeartbeat()` are the first
   statements of `main()`, before `createBot`: the heartbeat
   (gate-client writes `heartbeat.json {ts_ms, driver}` into the
   floor state dir every 1 s) is what keeps the lease renewed
   across the long wake sequence; the floor renews expiry only
   while the heartbeat is fresh.
3. **Start gate** — after spawn, before the wake:
   `gate.check('__driver_start__')`. A rejection traces
   `kind: 'gate-refuse-start'` with the gate's reason, quits the
   bot, and exits — no wake, no cycles. A pass with the gate
   enabled logs `GATE: live lease confirmed at start` (§3.8, §9.10).
4. **Cycle-head gate** — the first act of every loop iteration:
   `gate.check('cycle-head')`. A rejection sets `gateParked`,
   traces `kind: 'gate-park', at: 'cycle-head'`, and breaks the
   loop — before any reflex pre-emption or model call that cycle.
5. **Pre-exec gate** — immediately before `execCmd(bot, cmd)`:
   `gate.check(cmd)`. A park that landed while the model was
   thinking still stops that command; the rejection traces
   `kind: 'gate-park', at: 'pre-exec', cmd` and the command is
   **not** executed.
6. **Close guard** — the day-6 close-exit (the long-leg hopFlee to
   the bench) is skipped when `gateParked` (traced
   `kind: 'gate-park-close'`): the close-exit is itself a command,
   and no commands run under a dead lease. He stays where the park
   left him — the floor's stop-in-place pose, honoured by the body
   runtime at last.

The gate itself is `floor/gate.js` unmodified: a command is
honoured iff the lease exists for this driver, is unrevoked,
unexpired, and unparked (or externally released with a fresh lease
after the release). Gate config is by env (`FLOOR_STATE_DIR`,
`FLOOR_DRIVER_ID`) set in the launch draft; unset env = gate
disabled = exact day-10 behaviour, which is why §9.10 makes the
start-log line a hard launch condition rather than a hope.

**Residual, named**: the reflex layer's own `execCmd` calls inside
a cycle (floorEscape, floorEat, the forage attack) are covered by
the cycle-head check, not gated individually — a park landing
mid-cycle bounds them to that cycle's remainder. Individually
gating R's acts belongs to the reflex layer's own review (floor
gap #2), which day 11 does not close.

**Fixture results** — `pulse/day11/test-gate-wiring.js` drives the
real floor (stub op channel, fixture stores) through the same
gate-client the driver copy uses, in its simulate mode (identical
init/heartbeat/check pattern at the same call-site shape). Two full
runs, identical outcomes; output filed at
`pulse/day11/gate-wiring-fixture-output.txt`, evidence under
`pulse/day11/fixture-run/`:

```
PASS A lease granted -> cycles flow — exit=0; cycle rows=5, all ok=true
PASS B park mid-run -> stops within one cycle — exit=0; executed=6/60; rejection=cycle 7 reason=lease-revoked; ok-after-park(+1 cycle)=0; lease parked=true revoked=true
PASS C lease expired -> driver refuses to start — exit=3; refusal=START-REFUSED reason=lease-expired; cycle rows=0
PASS D no lease -> driver refuses to start — exit=3; refusal=START-REFUSED reason=no-lease

GATE-WIRING FIXTURE: 4/4 PASS
```

What this proves and what it does not: the lease the floor issues
is the lease the driver-side gate honours; a park lands as a stop
within one cycle with zero commands executed after it; an expired
or absent lease refuses the start outright. The full driver was
**not** run — it requires a live world, and this lane has no world
contact; its copy passes `node --check`, and its gate call sites
are the ones enumerated above, exercisable line-by-line against
this battery's module. A live day remains the first full proof,
which is what §9.10's launch condition is for.

## 12. READINESS LIST — what remains between this draft and a live day 11

Each item owned. "Lane" = a fleet lane to be dispatched; nothing
here is done until its owner files it done.

**Placement and scenario**
1. **[Parent]** Sequence the scenario-#2 placement window and
   assign its op identity (not Gallery); the window files its claim
   in `pulse/DIRECTOR-WORLD-CLAIM.md` before any placement. (§2.1)
2. **[Lane — placement window]** Execute the window exactly as
   SCENARIO-002 specifies: pre-reads from fresh copies (tread cell
   air, invariant cells, Cody's `.dat` sha unchanged), the single
   setblock, two-store verification, his-ground spot reads, readback
   filed under `director/`. Any pre-read disagreement stops the
   window. (§2.2–2.6)
3. **[Parent]** If Gate A will not be MET before the intended day:
   rule postpone, or supply the clean opening text (the driver
   copy's scene text carries the hand-over line; a no-line variant
   must exist before a clean run uses the copy). (§2, Gate A tail)

**The floor, live**
4. **[Parent]** Assign/confirm the floor's dedicated op identity;
   set it as `daylight_issuer` in the day-11 contract and re-pin
   the contract hash; the day record cites the final hash. (§5)
5. **[Lane — floor live rig]** Build the live rig file for
   `floor/run/day11/`: FileOpChannel pointed at the day-11 op bot's
   req/res files; `snapshot_path` at the census snapshot (item 6);
   `server_log_path` at a Thor-local mirror of the Orin server-log
   tail, refreshed on a cadence that keeps daylight landing
   verification inside its 2 s window — or a charter amendment
   widening that window, filed before the day, not during it. (§5)
6. **[Lane — floor live rig]** Build the feed-snapshot producer: a
   read-only copy of Cody's playerdata `.dat` from the Orin's live
   directory + offline parse → `floor/run/day11/snapshot.json`
   `{inventory, ts}`; runnable at floor open and on demand (the
   VERIFY_FEED remedy loop re-reads after each give). Prove it
   against day-10's close state (30 porkchops) before the day. (§5)
7. **[Lane — op bot]** Build `op-day11.js` (op-day10 successor) with
   the park-notify handler as §5 specifies (append to park-notify
   log, console alert, `ok` response, no world effect) + a fixture
   test: a stub floor issues park-notify; the handler receipts it.
   (§5)
8. **[Parent]** Confirm the NOTIFY surface for day 11 is the floor
   log + `operator-alert.jsonl`, tailed by the day lane — or name
   the surface that replaces it. (§5)
9. **[Lane — cameraman]** The daylight changeover: the cameraman's
   `/time set 1000` refresh OFF for day 11 (the floor is the single
   asserter), verified from the Orin server log at Gate B (no
   cameraman-issued time lines; floor-issued lines landing).
   **[Parent]** If this slips: choose the §5 degraded fallback
   (contract `daylight: "free"`, cameraman holds) or hold the day.
   (§5)

**Camera**
10. **[Lane — cameraman]** Position-driven subject-keeping: framing
    target = the state mirror's current position, re-read each
    cycle; staleness holds the last position and logs it. The
    day-11 frame verdict (≥9 sampled stills, Cody-visible n/9) is
    the acceptance read. (§8)

**Launch day itself**
11. **[Lane — day 11]** Gate B pre-checks (§3) run and filed: claim,
    citizen-save shas, deaths baseline re-derived (123),
    RELAY-OK from Thor at check AND at launch, cameraman state,
    floor open sequence (canary moving, feed verified, lease live,
    verifier fresh), op-bot ping + test park-notify receipted.
12. **[Parent]** Set the final run window (`DD_RUN_MS` in the
    launch draft; 85 min drafted from day 10) and give the launch
    word. The launch is a live act under the parent's sequencing;
    this charter authorises nothing by itself.
13. **[Lane — day 11]** Run the day under §4–§9; file the day
    record in §10's shape; append the furnace asset's second
    `uses[]` entry with the trace pointer and outcome (§6).
14. **[Lane — Director]** Post-day: fresh census of the step box +
    tread cell; score triple-021 by its rule; file loosening
    note #2. (§7)

*— Day-11 preparation lane, 2026-11-09. Drafted offline; the world
was not touched. The charter's tail is this readiness list; above
it, everything a live day needs is either specified or marked
OWED — nothing is silently assumed.*
