# FLOOR-IMPL-20261109 — the supervisor, built and fixture-proven

*Built 2026-11-09 by the floor lane (deliberation build order item 1:
synthesis §4.3 + wave-2 study verdict (c), the floor's constitution).
ALL OFFLINE. No world contact, no citizen contact, no live supervision
occurred in this build. First live use requires a day-11 charter; the
gaps between this build and that charter are named at the end, not
smoothed. Directory: Thor `~/craftmind-league/floor/`. Runtime: Node
v24.22.2 (nvm absolute path), stdlib only.*

## The disambiguation the study demanded

The synthesis used "floor" for three different things. This build is
exactly one of them:

- **F, the supervisor** — issues and revokes leases, counts deaths,
  parks, re-asserts a daylight contract, verifies the declared feed.
  **This is what was built.** (`floor.js`, constitution C.2.)
- A **cognition tier** ("floor first; the capable model wakes on
  novelty") — a routing question for the ledger work. Not built here,
  not a supervisor act.
- **Reflexes** in the body runtime ("the floor never waits") — R, its
  own review. Not built here. The study's correction stands and is
  repeated in the gaps: this supervisor has **no preventive
  authority**. It cannot prevent a death; it can only count one and
  park the body. While a driver can direct-drive a body into water,
  the LLM holds survival authority up to whatever the reflex layer
  covers — and that coverage is still unaudited.

Parties: **D** driver (proposes commands), **G** command gate
(`gate.js` — executes only commands holding a live lease), **R**
reflex layer (not here), **F** floor (`floor.js`).

## What was built (11 files, 56,538 B as deployed; battery re-deploy +467 B)

| File | Role |
|---|---|
| `constitution.js` | The constitution as data: the closed C.2 act list, the 14 forbidden acts, fixed NOTIFY reason codes, PARK triggers, contract validation + sha256 pinning. |
| `floor.js` | F. Loads a hashed day contract; refuses an invalid one (REFUSE_RESUME at open, zero acts emitted); supervises lease, deaths, daylight, feed; parks on the C.2 triggers. |
| `writer.js` | The floor's ONLY output path, a separate child process. Appends rows (one global sequence across all outputs) and acks each seq. Killable independently of the core — deliberately. |
| `gate.js` | G. Honours a command iff the lease is live, unrevoked, unexpired, and no PARK is latched (or an external release newer than the park exists AND a fresh lease postdates it). |
| `verifier.js` | The independent proof checker. Read-only; checks canary freshness, global sequence integrity, replay validity against the closed act list, count agreement, and the op-channel cross-audit. Writes `verifier-status.json` atomically; violations also write `verifier-alert.json` and exit 2. |
| `opchannel.js` | The floor's own admin path in the fleet's op shape (req/res JSONL, cf. `pulse/op-day10.js`): `FileOpChannel` (real shape) + `StubOpChannel` (fixture double). Never the cameraman's typed channel. |
| `release.js` | The ONLY writer of `release.json`. An operator/parent act, run by hand. The floor cannot release its own park. |
| `contract.example.json` | A day-11-shaped contract (Cody, max_deaths 3, daylight held, feed declared, study [J] timers). |
| `test-floor.js` | The fixture battery (below). |
| `test-driver.js`, `fake-op.js` | Fixture driver (heartbeats, gate attempts, spam) and fixture op bot. |

Two structural decisions worth naming:

1. **Lease state does not ride the writer path.** `lease.json` is
   written by the floor core directly, by atomic rename. If the writer
   dies, the floor can still revoke — a dead writer can never leave a
   live lease behind. Everything else (act log, canary, counts,
   alerts) rides the writer, so the writer's movement is the thing the
   canary proves.
2. **No lease before proof.** SELF_PROVE starts at boot; the first
   lease issues only after the writer's first ack returns AND the
   wake feed (if declared) verifies. A floor that cannot write cannot
   authorise play.

## The constitution as implemented — permitted acts → code paths

- **OBSERVE** — the tick loop's reads only (heartbeat file, trace
  sensor, server log tail, feed snapshot, release file). Emits no row;
  its evidence refs appear on the acts it feeds.
- **COUNT_DEATH** — `sensorPoll()` derives from the run's own trace
  via `pulse/lib/deaths.js` (`parseTraceDeaths` + `deathsInWindow` —
  the fleet's single derivation, required, not re-implemented) and
  appends each newly-seen in-window death through the writer to
  `floor-counts.jsonl`, with the act row in the floor log. Counts
  every death; assigns no fault (no fault field exists in the row).
- **LEASE_ISSUE** — `issueLease()`: after self-proof + feed verified,
  and again after an external release is observed. TTL from the
  contract (60 s in the example).
- **LEASE_REVOKE** — `revokeLease()`: inside every PARK, and on the
  writer-failure exit path (direct lease write, exit code 3).
- **PARK** — `park()`: latches `parked` + `park_seq` in `lease.json`,
  revokes, writes the PARK act row, NOTIFYs with the trigger's fixed
  reason code, and issues `{cmd:"park-notify"}` on the op channel.
  Triggers wired: `deaths_today>=max_deaths`,
  `driver_heartbeat_lost`, `daylight_unrestorable`,
  `feed_unverified`, `own_writer_canary_failed`,
  `sensor_path_broken`, `human_stop` (STOP file). Pose:
  stop-in-place (gate rejection); `park_bay` is carried in the
  contract but unused — no hazard predicate is implemented (gap).
- **ASSERT_DAYLIGHT** — `daylightCheck()`: only when the contract
  declares `daylight: held` (the contract decides; the floor
  enforces). Issues the contract's daylight command via the floor's
  own op channel, then verifies an **issuer-specific** landing line
  (`<issuer> issued server command: …`) in the log bytes written
  after the issue. 3 attempts, then PARK.
- **VERIFY_FEED** — `verifyFeed()` at wake, before any lease: reads
  the citizen's inventory from a snapshot store the feeder does not
  write; if short, re-issues the contract-declared feed op (max 2);
  still short → PARK `feed_unverified`, and no lease ever issues.
- **REFUSE_RESUME** — at open (invalid contract →
  `floor-refusal.json`, exit 2, zero acts, no lease) and as the
  verifier's replay refusal (an unlisted act in the floor log is a
  refusal-grade alert, T8).
- **NOTIFY** — `notify()`: fixed reason codes only (constitution
  `REASONS`), to the floor log + `operator-alert.jsonl`; driver
  status rides `lease.json`. No prose is authored anywhere.
- **SELF_PROVE** — a canary row through the real writer path every
  `canary_s` (60 s live shape, 1 s in fixtures), from boot, before
  any lease.
- **RELEASE_OBSERVED** — the tick's release check: the floor sees an
  external `release.json` matching the latched `park_seq`, records
  the observation, and may then issue a fresh lease. The release
  itself is never the floor's act.

## The constitution as implemented — forbidden acts → structural absence

1. *Goal-directed body commands* — the floor has no body-command
   emitter. The only op requests it can construct are the three kinds
   named in the act list (`park-notify`, daylight `chat`, feed
   `give`); T0's static check + the verifier's per-kind cross-audit
   hold this.
2. *Healing/reviving/extra feeding* — the only `give` in the code is
   the contract-declared feed op inside VERIFY_FEED's remedy, max 2,
   pre-play only. No heal or revive command exists.
3. *World changes except ASSERT_DAYLIGHT* — the sole world-directed
   command string the floor can issue is `contract.daylight_command`.
4. *Editing/deleting/reclassifying records* — all outputs are appends
   (`appendFileSync` in the writer); `deaths-record.jsonl` is only
   ever read.
5. *Assigning fault* — no fault field exists in any row the floor
   writes; COUNT_DEATH rows carry `{death_ts, n_today}` and nothing
   else.
6. *Ending the day / issuing a verdict* — no such act in the closed
   list; PARK is the ceiling, and release/end/fault escalate to the
   parent per the study's C.4 table.
7. *Self-release from PARK* — `release.json`'s only writer is
   `release.js`, a separate operator-run program. T0 statically
   verifies `floor.js` never writes it. T3 proves a park is undone
   only by external release + a fresh lease.
8. *Model calls / natural language* — stdlib-only imports, no model
   SDK (T0); NOTIFY is fixed reason codes; the floor authors no text.
9. *Reading chronicle/tension/viewings/ledger* — the floor reads only
   its contract, the trace sensor, the server log (daylight
   verification), the feed snapshot, and its own state files. No
   chronicle, tension, viewing, or ledger path appears in the code.
10. *Restarting the driver / changing its route* — no process-control
    or routing code exists. The floor's only lever on the driver is
    lease revocation.
11. *Stopping processes* — the floor signals nothing. Its single
    `SIGKILL` is to its own writer child during its own fail-closed
    exit, after the lease is already revoked.
12. *Acting on other clients* — every state file and sensor is keyed
    to the contract's `citizen`/`driver_id`; the gate rejects a
    wrong-driver lease outright. No other client's name appears.
13. *Changing its own thresholds* — thresholds load once from the
    hashed contract; there is no mutation path. Every output row
    carries `contract_sha`; the verifier flags a mixed sha.
14. *Commanding Director/camera/narrator* — the floor publishes state
    only (`lease.json`, verifier status). It sends them nothing. The
    cameraman's typed channel is never touched: T6's fixture log
    contains no cameraman lines at all, and the hold still verified.

## The writer-path proof (the day-10 guard clause)

The day-10 guard died silently and was believed alive from stale
writes. Here that failure has three independent detectors, none of
which is the writer:

1. **The canary + verifier.** SELF_PROVE rows ride the real writer
   path every `canary_s`. The verifier (separate process, read-only)
   flags a stale canary. **Measured detection latency, writer killed
   mid-run: 1.84 s (run 2) and 2.04 s (run 1) at a 2 s canary bound,
   test scale (canary 1 s, verifier polled every 200 ms).**
2. **The floor's own ack watch.** If acks stop for 2.5 × `canary_s`,
   the floor revokes the lease by direct write and exits with code 3
   (observed in both runs). At test scale that is a 2.5 s bound.
3. **The lease TTL.** Whatever else dies, honoured commands stop when
   the lease expires (60 s live shape). T4 proves the gate fails
   closed on a killed floor.

**Live-config projection (example contract timers — arithmetic, not
measurement):** canary 60 s, verifier stale bound 90 s polled every
15 s → writer-death detection ≤ ~105 s; floor self-detection ≤ 150 s;
the binding fail-closed number for commands is the 60 s lease TTL,
independent of both detectors.

## Fixture battery — results verbatim

Run 1 (2026-11-09): 11/14. The three failures were defects in the
TEST HARNESS, each diagnosed from evidence, none in the floor: T2
read the driver's pid file before the driver had written it; T3 left
the STOP file standing across the release, and the floor correctly
re-parked within a tick (STOP is level-triggered — a release under a
standing stop is overridden; that semantics is now documented by the
test itself); T6b ran without a driver, so heartbeat-loss parked the
scenario before the daylight retries could finish. All three fixed
in the harness; the floor's code was not changed between runs.

Run 2 (2026-11-09), full output:

```
PASS T0 static constitution checks — bad-require=none sdk=false floor-writes-release=false
PASS T1 deaths derivation (real stores) — total=123 (want 123); day9 window=3 n=121,122,123 (want 3, 121,122,123); day10 window=0 (want 0); traces merged=10
PASS T2 driver killed -> revoke + PARK — park-detection latency=2.99s; PARK row=true; LEASE_REVOKE row=true; post-park gate probe ok=false reason=lease-revoked
PASS T3 spam during PARK rejected; release is external only — attempts during park=2 all rejected=true; RELEASE_OBSERVED=true; released_by=test-operator
PASS T4 floor killed -> lease expires, verifier flags stale canary — fail-closed observed; verifier exit=2 problems=["canary-stale age_s=4.3 bound_s=2"]
PASS T5 writer killed -> detected, fail closed — floor self-detection: exit code=3 (3 = writer-path failure, lease revoked directly); verifier detection latency=1.84s at canary bound 2s
PASS T6 daylight asserted + verified via own issuer — fixture log contains no cameraman lines at all — the hold is the floor's own channel
PASS T6b daylight unrestorable -> 3 retries -> PARK — assert attempts=3; park trigger=daylight_unrestorable
PASS T7 feed verified from snapshot; remedy landed — snapshot porkchops=32; give re-issues=1
PASS T7b feed never lands -> 2 re-issues -> PARK, no lease — give re-issues=2; lease issued=false
PASS T8 replay validator refuses unlisted act — verifier exit=2 problems=["unlisted-act TELEPORT_CITIZEN seq=2"]
PASS T9 three deaths counted via writer path -> PARK — counts rows=3; COUNT_DEATH acts=3; park trigger=deaths_today>=max_deaths
PASS T10 sensor path broken -> NOTIFY + PARK — a counter that cannot read parks; it never counts silence as safety
PASS T11 FileOpChannel round-trip vs fixture op bot — op results=1; channel = the fleet req/res JSONL shape

14/14 PASS
```

Required reproductions, stated plainly: **deaths total 123; day-9
window = 3 (#121–#123); day-10 window = 0** — derived by the floor's
own counting path (`pulse/lib/deaths.js`) over the real
`deaths-record.jsonl` + all 10 run traces. A simulated driver-kill
mid-run ends with the lease revoked and PARK issued (T2, detection
2.99 s against the 3 s heartbeat-lost threshold). A deliberately
killed floor writer is detected (T5: verifier 1.84 s at test scale;
floor self-exit 3 with the lease revoked directly).

## Gaps to a live day-11 charter — named, not smoothed

1. **The gate has no teeth in production yet.** `gate.js` is the
   gate as a model; the real driver (the resident direct-drive
   lineage) does not consult `lease.json`. Wiring G into the body
   runtime — so a revoked or expired lease actually stops commands
   reaching the bot — is the day-11 charter's first act. Until then
   the floor can count, notify, and latch state, but it cannot stop
   a live driver.
2. **The reflex layer is unbuilt and unaudited** (the study's open
   check stands: whether R shares a process with the driver is still
   unanswered). The supervisor does not close Cairn's law; it was
   never the layer that could.
3. **`park-notify` has no live handler.** The current op bot
   (`pulse/op-day10.js`) knows ping/quit/give/chat. The live charter
   must either add a park handler or declare park-notify record-only
   (with the physical park carried by gate rejection + driver stop
   discipline).
4. **Two PARK triggers are enumerated but have no detector:**
   `evidence_contradiction` (no server-vs-mirror comparison is
   built) and `rollback_failed` (belongs to the swap gate, gap 6).
   They exist in the constitution data so a charter cannot quietly
   forget them; they do not fire today.
5. **Daylight verification is landing-based** — an issuer-specific
   line in the new log bytes after the issue — which is the fleet's
   day-10 GATE-1 standard. The study's stronger check ("clock frozen
   on next sample") is not implemented; it needs a live clock-query
   path. Related, and a charter decision: with `daylight: held`, both
   the cameraman chain and the floor could assert — the contract
   must name the single asserter (if the cameraman asserts, the
   floor's role becomes verifying its landings, not issuing).
6. **Feed snapshot source is a fixture JSON.** Live VERIFY_FEED
   needs the real store wired in — the citizen's saved `.dat` /
   entity read over a read-only census route — as the snapshot
   source. The verification logic itself is store-agnostic and
   proven (T7/T7b).
7. **Heartbeat is a fixture file.** Live, the driver's liveness
   should ride its lease-renewal path through the gate, so "stopped
   renewing" and "dead" are the same signal. The TTL arithmetic is
   proven either way (T2/T4).
8. **The swap gate (study C.5) exists only in pieces:** open-refusal
   (REFUSE_RESUME) and the replay validator are built; the full
   PRE/FREEZE/CHECKPOINT/HANDOFF/PROVE sequence, the proof-carry rule
   across swaps, and route-change breach logging are not. They belong
   with the first planned driver swap — our historical swaps were
   unplanned (day 3, day 5), which is the study's argument for
   building it before the next one, not after.
9. **The verifier's own death** is covered only by its status file
   going stale — a charter-level read, not an alerter. The external
   expecter (meta-watcher) remains Casey's outstanding owner item;
   this build does not pretend to close it. The lease TTL is the
   backstop that keeps that gap from being a safety hole.
10. **`FloorOp` is a placeholder identity.** The example contract's
    daylight issuer must become a real, dedicated op identity at
    charter — not Gallery (citizen-day ops), not the cameraman.
11. **Thresholds are pre-registration values** (the study's [J]
    numbers: TTL 60 s, heartbeat-lost 90 s, canary 60 s, daylight
    check 240 s), not measured optima. The charter sets them once
    against day 11's shape; the contract hash then pins them.
12. **NOTIFY's operator leg is a file** (`operator-alert.jsonl`).
    No live alerting surface is wired — deliberate for an offline
    build; the charter chooses the surface.

*— Floor lane, 2026-11-09. Battery re-runnable any time:
`floor/test-floor.js` under the nvm Node v24. State from both runs is
kept under `floor/run/` as evidence.*
