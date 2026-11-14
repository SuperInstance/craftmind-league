# DIRECT-DRIVE DAY 11 — GATE B STOP: THE DAY THAT NEVER STARTED (2026-11-09)

*Run by the day-11 lane (parent-delegated, end-to-end) under
`pulse/DAY11-CHARTER-DRAFT-20261109.md`. Gate A was MET before this
lane opened (tread at (65, 66, −88), two-store verified;
`director/PLACEMENT-WINDOW-20261110.md`). Gate B was run in full.
**The day did not proceed: the floor/driver heartbeat contract makes
the charter's Gate B sequence inexecutable, and both driver starts
were refused by the gate — correctly.** Cody never reached cycle 1.
Per the charter's stop rules and the lane's commission, a Gate B that
fires honestly is a successful Gate B. This record is filed in §10's
shape; where a §10 element has no day to report, it says so rather
than rounding.*

- **Deaths: 123 → 123 (delta 0)**, re-derived twice via
  `pulse/lib/deaths.js` over `deaths-record.jsonl` + all traces
  (the second derivation includes the day-11 trace: 123).
- **Action curve: zero cycles, zero acts.** The day-11 trace holds
  exactly two rows, both `gate-refuse-start`. There is no curve;
  §9.7's zero-act rule is noted and not misapplied — this was a
  no-start, not a stall of a running day.
- **Furnace: NO — never attempted.** The skill's second use did not
  occur; no `uses[]` entry is appended (see §6).
- **Triple-021: UNSCORED** (premise void; census clause holds).
  Scoring entry: `triple-022-scenario-002-stone-hollow-scored-day11`.
- **Frame verdict: not producible** (no citizen in the world; see §8).
- **Budget: 0 citizen brain calls** against B ≈ 338 wc / ceiling
  3.976 wc/min (ledger `ledger/LEDGER-IMPL-20261109.md`). Three
  RELAY-OK probes ≈ $0.0000079 total. The gate ruled on the plan;
  the day spent nothing because it never started.

## INCIDENTS (at the head, per §10)

1. **THE BLOCKER — floor/driver heartbeat contract defect
   (fault_owner: harness).** `floor.js` parks
   `driver_heartbeat_lost` when no heartbeat has been seen within
   `heartbeat_lost_s` (90 s) of LEASE_ISSUE — including when the
   driver has never started. The driver's heartbeat
   (`gate-client.js`) starts inside the driver process at `main()`,
   after `createBot`, seconds before the start-gate check. The
   charter's order — floor opens, lease stands (§3.6), driver
   launches after the remaining Gate B checks — therefore has the
   floor revoke the lease 90 s after issuing it, long before any
   driver can exist. Observed live, twice: lease
   `lease-1794270345449` issued 00:25:45Z → PARK + LEASE_REVOKE
   00:27:20Z; released via `floor/release.js` (operator path,
   parent-delegated) → fresh lease `lease-1794270500154` 00:28:20Z →
   PARK + LEASE_REVOKE 00:29:50Z. Both driver starts (00:28:31Z,
   00:30:10Z launches) reached the start gate after their lease had
   expired and were refused: trace rows `gate-refuse-start`,
   reason `no-lease`; driver log "[DD] GATE REFUSE-START: no-lease —
   the floor holds no live lease for this driver; stopping the day
   per charter". **§9.10 worked exactly as designed — an ungated day
   did not proceed.** Three latent defects, named for the repair
   charter (this lane did not patch the floor mid-charter):
   (a) no distinction between "driver not yet started" and "driver
   died" — the heartbeat-lost park needs a first-heartbeat-ever
   grace, or the charter must sequence the driver launch inside the
   90-second window of a lease issued on demand at launch;
   (b) `RELEASE_OBSERVED` is single-shot — `releaseObserved` latches
   true after the first release, so the second release (00:31:11Z,
   park_seq 17) was never observed and no fresh lease followed it;
   (c) gate-reason fidelity — `gate.js`'s readJson collapses
   missing/expired/revoked lease states into the single surface
   reason `no-lease`, which misdescribes an expired lease at the
   exact moment an operator most needs the distinction.
2. **Relay's eighth death (fault_owner: harness/infrastructure).**
   Gate B relay check at 00:22:05Z: `RELAY FAIL: read ECONNRESET`.
   Both VM-side setsid supervisors (relay :8911, tunnel → Oracle
   :8913) were gone — the same VM session-loss pattern as deaths
   1–7. Thor's `ddbridge-fwd.service` was healthy throughout.
   Restarted under their supervisors from the VM (relay supervisor
   pid 2573 / relay pid 2575; tunnel supervisor restarted; Oracle
   :8913 LISTEN re-verified). RELAY-OK PASS end-to-end from Thor at
   00:23:00Z (HTTP 200, real DeepInfra completion, content
   "RELAY-OK"), and re-proven at the launch re-check. The
   restart-surviving service-unit debt stands, heavier — setsid
   supervision has now failed eight times as a strategy.
3. **Floor's first open parked on the sensor (fault_owner:
   harness — this lane's sequencing).** The floor's first live open
   (00:25:03Z) found the contract's sensor trace
   (`pulse/direct-drive-trace-day11-20261110.jsonl`) not yet created
   and parked `SENSOR_PATH_BROKEN` before any lease — the floor
   refusing to count from an unreadable store, as designed (the
   day-3 decoration, inverted). The state was archived
   (`floor/run/day11/state-attempt1-parked/`), the trace created
   empty, and the floor re-opened clean. The rig lane's dry-check
   had seeded its fixture trace; the live sequence had not.
4. **The cameraman cap-renewal never fired (fault_owner: harness).**
   The brief carried "the cap-renewal job fires 15:42 AKST". No such
   job exists in the fleet's cron store (0 jobs) or Thor's user
   crontab; the MonitorEvent lines in this lane's context came from
   a background exec owned by a prior agent session that no longer
   exists. It gated nothing: the cameraman chain was verified live
   at Gate B and then superseded pre-wake by the chartered day-11
   activation (below). Recorded so the next lane does not wait on a
   firing that will never come.

## GATE B (§3) — EVERY CHECK, WITH ITS EVIDENCE

1. **Claim** — ledger line 330 (`day11-live-claim-20261109`,
   00:21:32Z) via `ledger-append.py`. This lane was the only live
   lane in the world; Gallery was reserved to its ops (the floor's
   channel + this lane's op bot). ✓
2. **Citizen state** — Cody's save present in the LIVE playerdata
   directory; sha256 `dae53b9a…752c` at Gate B — byte-identical to
   day 10's close. Vega `4b65ff2e…edc6` ✓, Geist `8ecbd230…4f0` ✓ —
   byte-identical to charter hashes, untouched. Cody is not opped
   (live ops.json: Gallery, MagnusandMouse, MapProbe4 — all level
   4). ✓ *(Post-stop note: the two refused starts joined Cody's body
   and left within the same second, twice; the server rewrote his
   .dat on join (sha now `83dc33af…`), and a fresh feed-snapshot
   re-read shows the inventory identical item-for-item to day 10's
   close — wooden_pickaxe 5, cooked_porkchop 30, oak_log 18,
   birch_log 10, cobblestone 1, planks 8, sticks 7. Nothing was
   gained, lost, or moved; he never acted.)*
3. **Deaths baseline** — **123**, re-derived via `lib/deaths.js`
   over the record + all 10 pre-day-11 traces (not quoted). ✓
4. **Relay** — dead at check (incident 2), restarted under
   supervisors, RELAY-OK PASS 00:23:00Z **and** again at the launch
   re-check. ✓
5. **Cameraman** — running chain confirmed (pid 855297 lineage,
   parent 855294 detached, no STOP file, `chatVisibility:1` intact),
   then, with the citizen OFFLINE, the prepared framing copy was
   activated WITH the §5 changeover as a new live file (Orin
   `~/cameraman/cameraman-day11-live.py`, md5 `8cda2a4f…`; the
   rig lane's prepared copies and the live v3 untouched, md5
   `27aaa066…`): env switch `CAM_DAY_REFRESH_OFF=1` guards both the
   start assertion and the refresh loop. New chain pid **913845**,
   started 00:24:21Z; its log's second line reads "DAY-11 CHANGEOVER
   ACTIVE: cameraman /time set refresh OFF … daylight is asserted by
   the floor". Server-log verification: the last MagnusandMouse
   `/time set 1000` is **00:22:29Z** (before the changeover); the
   only later issuer line in the log is **Gallery 00:25:50Z** — the
   floor's. No cameraman-issued time lines after the changeover. ✓
   *(Recorded plainly: the activation STOP-started the old chain —
   the stop-then-start the charter's changeover requires — across a
   ~50-second window with no citizen in the world. The citizen was
   never exposed; the alternative, two live cameramen on one client,
   is worse. The old chain's final daylight assertion had landed at
   00:22:29Z and the floor's first landed 00:25:50Z: a 3-minute-21-
   second gap in assertions, in an empty world, in held morning.)*
6. **Floor open** — contract finalised per the parent's ruling:
   `daylight_issuer: "Gallery"` (the floor's op identity rides the
   day-11 op bot under the §3 claim; the camera's MagnusandMouse is
   not the floor's identity, and the contract hash makes the
   distinction auditable). Final contract:
   `floor/contract-day11.json`; the floor's canonical contract hash
   (its own `contractSha` over the compact sorted serialisation) is
   **`64940d283e933e8ba7a2d8567c01e29b915ae65246b4745825bb247c5ee0d764`**,
   carried on every floor row of the day; thresholds as drafted
   (TTL 60 s, heartbeat-lost 90 s, canary 60 s, daylight check
   240 s, poll 5 s). Live open sequence (second open, after
   incident 3): mirror loop running at the rigged 1 s cadence
   BEFORE the floor opened; fresh snapshot from `feed-snapshot.py`
   (porkchops 30); canary moving (SELF_PROVE seq 1); VERIFY_FEED
   passed from the snapshot (need 8, have 30 — no remedy give);
   LEASE_ISSUE after the canary ack; verifier running, status fresh
   and **ok: true** once its cross-audit was wired to the op
   channel's record (the verifier reads `<stateDir>/op-req.jsonl`;
   the lane keeps that file in step with the channel's own log —
   the final audited state: seq 1..21 gapless across log/canary/
   alert, counts agreement 0=0, cross-audit equal per kind). ✓ —
   with incident 1 as the standing exception: the lease could not
   *stand* for a driver launched on Gate B's timescale.
7. **Op bot** — `pulse/op-day11.js` up in its own process (pid
   1411369), spawned as Gallery at (30.5, 82, −87.5). Ping receipted
   through the real channel (`gateb-ping-1`, ok, spawned). Test
   park-notify receipted through the real channel twice
   (`gateb-park-test-1` + the floor's own live park-notifies for
   both parks, `floor-park-1/2/3`, all `{ok: true, recorded:
   true}`, park log at `floor/run/day11/op/park-notify-day11.jsonl`).
   ✓
8. **Driver** — `pulse/day11/dd-launch-day11.sh` with the gate env
   set (`FLOOR_STATE_DIR`, `FLOOR_DRIVER_ID=cody-driver`). The start
   log printed the refusal, not `GATE: live lease confirmed at
   start` — §9.10 therefore stopped the day, twice. ✗ (by design;
   the failure is incident 1's, not the gate's.)

## THE WAKE (§4) — NOT REACHED

The sequence ran as far as it could: VERIFY_FEED passed from the
live snapshot (30 porkchops; the morning give was not required — the
contract's feed rule is a minimum of 8, and his own stock is the
evidence). No LEASE could stand to meet the driver (incident 1).
The driver-side wake feed-confirm, the hollow readback, and cycle 1
never happened. The hand-over line — carried verbatim in the driver
copy's scene text per SCENARIO-002 — was never delivered. It remains
owed, word for word, to the next played day.

## THE DAY (§5–§9) — WHAT RAN INSTEAD

No citizen day ran. What ran was the floor's first live shift, spent
entirely on the harness (its full report is below), a cameraman
filming an empty world with its subject-keeper live and nothing to
keep, and an op bot holding a spawn point. §9's stop rules fired in
their Gate B form (§9.10, twice) before any in-day rule could be
reached. No death occurred; no park was disobeyed (no command was
ever issued under a dead lease — the gate saw to that); no STOP was
placed over a live citizen.

## §5 — THE FLOOR'S LIVE REPORT (from its own log + verifier status)

State: `floor/run/day11/state/` (attempt 1 archived beside it).
Acts, in sequence: FLOOR_OPEN (NOTIFY) → **VERIFY_FEED** (have 30 ≥
need 8, first read, zero gives) → **LEASE_ISSUE** → **ASSERT_DAYLIGHT
attempt 1, landed** (issued via the op bot as Gallery; the mirror
carries "Gallery issued server command: /time set 1000" at
00:25:50Z; the floor's 2 s landing window held at the 1 s mirror
cadence) → PARK `driver_heartbeat_lost` + LEASE_REVOKE (00:27:20Z) →
RELEASE_OBSERVED + LEASE_ISSUE (00:28:20Z) → PARK
`driver_heartbeat_lost` + LEASE_REVOKE (00:29:50Z) → (release filed
00:31:11Z; unobserved — defect (b) above). Daylight assertions: 1
issued, 1 landed, 0 retries, 0 daylight parks. Deaths counted: 0
(the sensor read the day's trace throughout; its only rows are the
two refusals). Canary: moving throughout (age < 60 s bound at every
verifier read). Verifier final status: **ok: true**, seq_ok: true.
The floor ends the day parked on the second heartbeat-lost park —
its by-design end-state for a driver that never came.

## §6 — THE FURNACE CHAIN

Not run. S0's inputs are unchanged (his save's content is the day-10
close, re-read after the stop). **No `uses[]` entry is appended to
`skills/furnace-sequence.v1.json`**: the asset's rule appends a use
when the skill is used, and appending a "use" for a day on which the
citizen never woke would corrupt the asset's evidence — the second
use remains owed, exactly as the first was earned. If the parent
rules the entry should exist as a non-use record, it can be added
against this filing; this lane did not presume it.

## §7 — TRIPLE-021

Scored through the triples machinery as `triple-022-scenario-002-
stone-hollow-scored-day11`: **UNSCORED — premise void, not
falsified.** Clause (iii) holds (post-day census, fresh region copy
md5 `c4ccf93c…`, offline parse: (65, 66, −88) =
`minecraft:oak_log[axis=z]`; all invariant and his-ground cells as
placed/surveyed; the (65, 65, −88) dirt is the placement's own
cover-kill, already filed by its window). Clauses (i)/(ii) have no
evidence either way — there was no homeward leg. Triple-021 stays
`unverified`, live for the next played day. Full reading:
`director/LOOSENING-NOTE-002-20261109.md`.

## §8 — FRAME VERDICT

Not producible: no citizen was ever in the world, so no stills of
Cody exist to sample. The camera facts that do exist: the framing
copy is live (pid 913845) with SUBJECT-KEEPER on and the §5
changeover verified from the server log (above); from 00:27:21Z it
ran its FALLBACK over an empty world. The day-10 baseline (0/9)
stands unclosed — not by a failed attempt, but by no attempt being
possible.

## CLOSE STATE (what the parent inherits)

- Cody: offline, unharmed, content-identical to day 10's close;
  deaths 123. Vega/Geist untouched.
- The tread stands at (65, 66, −88). Scenario #2 is live and
  unscored; its hand-over line is undelivered and owed verbatim.
- Still running, deliberately left for the parent's sequencing:
  the floor (parked, state `floor/run/day11/state/`), the verifier,
  the log-mirror loop (1 s), the day-11 op bot (Gallery, in world at
  its spawn point), the day-11 cameraman (pid 913845, refresh OFF —
  **the floor is now the only daylight asserter; if the floor is
  stopped, the cameraman does not resume asserting on its own**),
  and this lane's stand-in heartbeat keeper (writing
  `heartbeat.json` for a driver that does not exist; kill it with
  the floor).
- Owed before any day 12: the repair charter for incident 1's three
  defects (heartbeat first-seen grace or launch-window sequencing;
  release-observation latch; gate-reason fidelity), and the
  restart-surviving relay service unit (eight deaths).

*— Day-11 lane, 2026-11-09. The charter's stop rules won over the
day, as the charter says they must. The gate held; the harness
didn't; Cody slept through all of it, fed and whole.*
