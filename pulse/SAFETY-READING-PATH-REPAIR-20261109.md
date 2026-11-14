# SAFETY-READING-PATH REPAIR — the reflex layer can hear the stop now

Day-13 incident H1's fix, built and fixture-proven offline on
2026-11-09 (AKST). **Day 14's first gate is this repair: no citizen
wakes on the day-14 driver copy until the fixture battery below
stands at 40/40 against the shipped bytes — it does (run 2; run 1's
two failures were a fixture-geometry defect, §3).** No live citizen
work in this lane; Vega/Geist untouched; the day-13 driver copy is
byte-identical to before this lane (md5 `d303d9d3…`, re-verified
after the build), as are `pulse/lib/hopflee.js` (`f9e7394e…`),
`floor/floor.js` and `floor/gate.js`.

## 1. THE DEFECT ANATOMY — where each check lived, where the body was

Day 13 (record `pulse/DIRECT-DRIVE-DAY13-20261109.md`, §Incident
H1). Two safety checks existed, both correct, both unreachable:

- **The floor's PARK.** The supervisor counted deaths from the
  run's trace and parked exactly as chartered: death 3 at
  **06:09:22.954Z** (trace row n=3), PARK at **06:09:24.272Z**
  (`deaths_today>=max_deaths`, evidence `trace#count=3`), lease
  revoked + parked latched in `floor/run/day13/state/lease.json`
  (park_seq 73). The floor's half of the stop rule fired in 1.3 s.
- **The driver's checks.** In `direct-drive-day13.js`, the command
  gate (`gate.check`, via gate-client → `floor/gate.js`) was read
  at three sites — driver start, cycle head, pre-exec — and the
  3-death abort (`shouldAbort(deathsThisRun)`, `lib/deaths.js`)
  immediately after the cycle-head gate check. All four sites sit
  on the model loop's path.

The body was somewhere else. Cycle 212 (begun ~06:09:03Z) took the
floor pre-emption branch and **awaited `floorEscape(bot)`** — the
reflex layer: an 11-hop `hopFlee` (110 s budget, exited "budget
exhausted", 33.7 blocks), then `burrow()` (dig-in, seal, and a hold
loop of up to 8 minutes). Neither `hopFlee` nor `burrow` reads the
lease, the gate, or the death count — there was no code path by
which the park, or deaths 4–9, could reach the body while the
reflex layer held it. Death events kept arriving asynchronously
(the driver's `bot.on('death')` handler incremented
`deathsThisRun` and appended the trace rows — the WRITING path,
proven since day 4, worked perfectly: rows n=1..9, floor
COUNT_DEATH ×9, all agreeing). Nothing READ them. Deaths 4–9
(06:09:33Z–06:11:50Z) fired inside the stuck cycle; the lane
stopped the driver by hand at 06:14:43Z, six deaths past the
limit.

**The shape of the failure, in the standing form: the counter's
writing path was proven and its reading path did not exist on the
layer where the body actually was.** A safety check that only runs
at a cycle head is only as strong as the longest single cycle —
and the reflex layer is precisely where cycles get long, because
it takes the body exactly when the world is most dangerous.

## 2. THE REPAIR AS BUILT

Built in the day-14 driver copy (`pulse/day14/`); the day-13 copy
stands as the record. Diff vs the day-13 driver: 171 lines across
21 hunks, every hunk at a site named below; the dig-guard, the
floor's constitution, the gate's semantics, the reflexes' shapes
and every scene text are unchanged.

### 2.1 The shared read — `pulse/day14/safety-check.js` (new, md5 `d60f062b…`)

One function, `snapshot(localDeaths)`, returning
`{ stop, trigger, gateReason, deaths, ts_ms }`. Every safety check
in the day-14 driver — start, cycle head, pre-exec, and the reflex
layer — reads through it, so the layers cannot disagree silently:
there is only one read. Its two sources of truth, both files, both
pre-existing:

- **Park / lease** — the floor's state files:
  `<FLOOR_STATE_DIR>/lease.json` (+ `release.json`), read through
  `floor/gate.js` via the day-14 copy's `gate-client.js` (byte-
  identical to days 11–13, md5 `6b891704…`). Any gate refusal —
  parked, lease-revoked, lease-expired, lease-absent,
  wrong-driver — is a stop with **trigger `park`**, and the gate's
  own reason rides in the verdict unaltered.
- **Deaths** — the run's own trace file, counted by
  `pulse/lib/deaths.js` `countTraceDeaths` (the same counter the
  floor's COUNT_DEATH derives from and the driver's spawn seed
  resumes from), judged by the same `shouldAbort` (limit 3). The
  caller's in-memory count is passed in and the verdict uses the
  **greater** of the two, so the shared read is never weaker than
  either check it replaces.

**Precedence: park before death-count.** The floor's stop is the
supervisor's word — and on day 13 the park WAS the count's
consequence (it fired 1.3 s after death 3), so naming `park`
names the cause's instrument either way. The verdict always
carries the death count alongside; nothing is hidden by the
choice.

**Cost:** two file reads + a count per snapshot; no model call, no
network. Measured against the real day-13 trace (186,235 B, 50
reads): **median 2.27 ms, max 4.98 ms** (fixture case (e)).

### 2.2 The reflex hook — `pulse/day14/hopflee.js` (copy of lib, md5 `f460b1b3…`)

A copy of `pulse/lib/hopflee.js` with exactly two deltas (24 diff
lines): the prims require is the absolute lib path (the copy lives
outside `lib/`; the prims driven is the same shipped module), and
an optional **`opts.safetyCheck(nextHop)`** hook. At **every hop
boundary** — the top of the hop loop, after the body-gone check,
**before** the clear/muster exits, so a stop outranks a clear —
the hook is awaited; a truthy verdict aborts the flee mid-flight
and **no further hop is issued**. The aborted return carries
`{ aborted: true, trigger, gateReason, deaths, hop }` where `hop`
is the hop that never executed. Absent the opt, behaviour is
exactly the day-4 module's (the lib original is untouched; the
standing driver and `test-flee-day4.js` are unaffected).

### 2.3 The driver integration — `pulse/day14/direct-drive-day14.js` (md5 `6c28837d…`)

- **REFLEX-SAFETY span** (marked `// REFLEX-SAFETY-BEGIN..END`,
  the dig-guard convention): `reflexSafety(stage)` reads the
  snapshot; on a stop it rows the abort **once** — trace kind
  **`reflex-abort`**, with trigger, gate reason, death count and
  the stage named — latches `reflexAbort`, and returns the verdict
  so the calling sequence aborts at that instant.
- **The flee**: `floorEscape` passes
  `safetyCheck: (nextHop) => reflexSafety('flee-hop-' + nextHop)`
  to hopFlee, and branches on `fr.aborted`: **no burrow is
  entered** after a safety abort, the reflex flags are cleared,
  and the return text tells the scene the stop rule fired
  mid-flight.
- **The burrow**: `reflexSafety` at **dig-in** (before the first
  dig), at the **seal** (before the seal placement), and at the
  head of **every hold-loop iteration** (the 5 s cadence the loop
  already keeps; day 13's ninth death fired inside this hold,
  unread — it is read now). An abort returns/breaks immediately;
  no further dig or place is issued.
- **The main loop**: the moment `floorEscape` returns, a latched
  `reflexAbort` **breaks the day inside the same cycle** (park →
  `gateParked`; death-count → the new `safetyStopped` flag), and
  the close honours both flags: the close-exit movement is skipped
  under either, each with its own truthful log line and trace kind
  (`gate-park-close` / `safety-stop-close`).
- **The close exit** itself passes the same hook
  (`'close-hop-' + n`): a park landing mid-close-exit now aborts
  the walk instead of walking on under a dead lease.
- **The model-loop checks remain, re-read through the snapshot**
  (defence in depth, day-13 order and trace kinds preserved):
  start (park → the existing `gate-refuse-start` with the gate's
  reason; a run whose *inherited* trace count already meets the
  limit also refuses, reason `death-count-at-start` — a
  relaunched driver inherits the day's true count, and a day
  already at the limit does not restart), cycle head (park →
  `gate-park` at `cycle-head`; entity wait; then death-count →
  `abort`, reason `3 deaths`), pre-exec (park → `gate-park` at
  `pre-exec` with the command named; death-count → `abort` at
  `pre-exec` — the command is NOT executed under either).
- **Identity updates in the copy**: own trace
  (`direct-drive-trace-day14-20261110.jsonl`), own places file
  (day-13 store carried forward), `WORLD_DEATHS_AT_START` 132 per
  the day-13 close, gate/hopflee requires pointed at the day-14
  copies.
- **Reviewed and classified, not changed**: the emergency forage
  is a single `execCmd` act inside one cycle, preceded by that
  cycle's head read — not a sequence, outside the H1 class. The
  eat reflex is a single act on the same footing; the eat inside
  the burrow hold sits behind the hold's per-iteration check.

### 2.4 Abort semantics (the whole repair in one breath)

At every reflex hop boundary and burrow stage the body reads the
one shared snapshot; the first stop observed aborts the sequence
mid-flight — no further movement or dig commands are issued — the
abort is trace-rowed once with its trigger (`park` |
`death-count`) and its hop/stage, the burrow is never entered
after a flee abort, and the main loop breaks the day within the
same cycle, the close skipping its exit movement under the stop.

## 3. FIXTURE PROOF — the gate

`pulse/day14/test-safety-reflex.js`; output filed at
`pulse/day14/safety-reflex-fixture-output.txt`. The battery
exercises the **shipped** code: `safety-check.js` and `hopflee.js`
required directly (only hopFlee's world physics is stubbed — flat
ground, scripted `gotoNear` — via the prims require-cache),
`reflexSafety` extracted from the driver source (the dig-guard
pattern), the real `gate.js`/`deaths.js` underneath, and 15
wiring assertions on the driver source pinning every integration
site (the span alone would prove nothing if the driver never
called it — the day-13 lesson applied to the repair itself).

- **(a) Park at a hop boundary — PASS.** Live lease, park written
  (in the floor's real shape) after hop 3 completes: the flee
  aborts at **hop 4**, trigger `park`, gate reason
  `lease-revoked`; **zero** hop commands issued after the park
  (3 issued, none at hop ≥ 4); exactly one `reflex-abort` row,
  naming trigger + stage `flee-hop-4`.
- **(b) Death-count crossing mid-sequence — PASS.** Lease live
  throughout; the third death row lands during hop 2 (both
  stores updated in the same tick, as the real death handler does):
  the flee aborts at **hop 3**, trigger `death-count`; zero
  commands after the crossing (2 issued); the abort row names
  trigger + count.
- **(c) Clean sequence — PASS.** No park, no deaths: the flee runs
  all 5 hops and exits by its own `clear`; no abort latched, no
  abort row, and a direct snapshot agrees (no stop, 0 deaths).
- **(d) The day-13 burst, replayed — PASS.** The recorded
  timeline driven at 20× (each hop burning the 8 s goto timeout
  the real hops hit, plus hopFlee's own 250 ms; boundaries at
  entry + (k−1)·8.25 s): trace pre-loaded with deaths 1–2
  verbatim, death 3 appended at its recorded offset (+19.954 s),
  the floor's park written at +21.318 s in its real shape
  (park_seq 73, park_ts_ms verbatim), deaths 4–9 scheduled at
  their recorded offsets **only if the body is still being
  driven**. The repaired flee aborts at **hop 4** — the first hop
  after the park — trigger `park`, count 3 in the verdict; the
  mapped abort instant **06:09:27.750Z** sits after the park
  (06:09:24.272Z) and **5.468 s before** death 4's recorded
  instant (06:09:33.218Z); the later deaths never append.
  **Deaths stop at 3 in the replay; the recorded day reached 9.**
  Anchor stated: flee entry at the record's cycle-212 start
  (~06:09:03Z) — the margin absorbs ±2 s of anchor error.
- **(e) Cost — PASS.** Median snapshot 2.27 ms / max 4.98 ms over
  the real day-13 trace; the snapshot counts its 9 deaths.

**Run history, honestly:** run 1 was **38 PASS / 2 FAIL** — both
failures in case (c): the fixture started the body 8.5 blocks
from target and the shipped hopFlee correctly *mustered* at hop 3
before the scripted clear, a fixture-geometry defect (the
floor-battery run-1 class: harness, not code). The fixture start
moved to the burst flee's own start (~33 blocks out); the shipped
code was not touched between runs. **Run 2: 40 PASS / 0 FAIL**,
and the filed output is run 2's.

**What the battery does NOT prove (named):** the burrow stages are
proven by the shared-helper extraction (the same `reflexSafety`
the burrow calls, exercised live in (a)/(b)/(d)) plus wiring
assertions on the three call sites — there is no simulated burrow
run, because `burrow` is entangled with the live body's block
perception and this lane is offline by charter. The first live
burrow under the repair is itself evidence the day-14 record must
read. And no fixture can prove the floor parks — it already did,
on day 13, in 1.3 s; what was missing was only ever the reading.

## 4. DAY-14 INTEGRATION NOTE — what the charter must pin

1. **The driver identity**: `pulse/day14/direct-drive-day14.js`,
   md5 **`6c28837d403c0cccfcedb017e4fce4e6`**, with its day-14
   modules (`safety-check.js` `d60f062b…`, `hopflee.js`
   `f460b1b3…`, `gate-client.js` `6b891704…` — the last
   byte-identical to days 11–13). Launch script in the day-13 form
   (`pulse/day14/dd-launch-day14.sh`; `FLOOR_STATE_DIR=
   …/floor/run/day14/state`, `FLOOR_DRIVER_ID=cody-driver`,
   `DD_RUN_MS` per the charter window; the day-14 trace file
   PRE-CREATED — the floor's sensor parks on an unreadable path
   by design, day 12's F1 lesson).
2. **The fixture battery as a Gate B line** (see §5 for the line
   verbatim): the battery re-run against the shipped md5 at Gate
   B, output re-filed; a missing, stale or short-of-40/40 output
   is a failed gate and the day does not launch.
3. **Scene text is NOT day-14 text in this copy.** The copy
   inherits day 13's wake line, spawn chat and scene text
   verbatim (flagged in its header). The day-14 charter replaces
   them from the verified wake facts — Cody wakes empty-handed at
   his respawn point (36.5, 73, −86.5), the count NOT in hand,
   deaths baseline 132 (re-derived at pre-checks, never asserted)
   — before any launch. **Do not launch the copy carrying day-13
   scene text.**
4. The floor contract for day 14 carries `max_deaths` 3 as ever;
   nothing in this repair changes the floor, its constitution, or
   its contract terms — the repair is entirely on the reading
   side, which is where the defect was.

## 5. THE GATE B LINE (verbatim, for the day-14 charter §4)

> 9. **Driver (the H1 gate)**: `pulse/day14/dd-launch-day14.sh`
>    runs `pulse/day14/direct-drive-day14.js` (md5 `6c28837d…`)
>    with the gate env set (`FLOOR_STATE_DIR=…/floor/run/day14/
>    state`, `FLOOR_DRIVER_ID=cody-driver`); the safety-reading-
>    path fixture battery (`pulse/day14/test-safety-reflex.js`)
>    has been re-run against the shipped copy and its output filed
>    at `pulse/day14/safety-reflex-fixture-output.txt` — **40 PASS
>    / 0 FAIL**, including the day-13 burst replay (abort at the
>    first hop after the park; deaths stop at 3) — and the
>    driver's start log must print `GATE: live lease confirmed at
>    start` (stop rule 10). A day whose fixture output is missing,
>    stale against the shipped md5, or short of 40/40 does not
>    launch.

## ARTEFACTS

- `pulse/day14/direct-drive-day14.js` — the repaired driver copy
  (md5 `6c28837d403c0cccfcedb017e4fce4e6`).
- `pulse/day14/safety-check.js` — the one shared safety read
  (md5 `d60f062bde6cb0635064010ddd8d385c`).
- `pulse/day14/hopflee.js` — hopFlee + the hop-boundary safety
  hook (md5 `f460b1b38e04ed1b3e6ba582370c56fa`).
- `pulse/day14/gate-client.js` — byte-identical copy of days
  11–13 (md5 `6b891704631f7e09e92e6a03956ee04d`).
- `pulse/day14/direct-drive-places-day14.json` — the day-13
  places store carried forward.
- `pulse/day14/test-safety-reflex.js` +
  `pulse/day14/safety-reflex-fixture-output.txt` — the battery
  and run 2's output (40 PASS / 0 FAIL); `pulse/day14/fixture-run/`
  holds its fixture state dirs and traces.
- Untouched, md5-verified after the build: day-13 driver
  `d303d9d357b6be0524c9517b9c2ea9fd`, `pulse/lib/hopflee.js`
  `f9e7394ec479074ebb137899d5d299e6`, `floor/floor.js`,
  `floor/gate.js`, and every other day's copy.

*— Safety-repair lane, 2026-11-09. The floor did its half on
day 13 in 1.3 seconds. The body can hear it now.*
