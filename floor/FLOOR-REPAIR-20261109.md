# FLOOR REPAIR + DAYLIGHT POSTURE RESTORE (2026-11-09)

*One lane, three workstreams, in order. Authorisation: Casey's
"build it all" + parent sequencing. Day 11 stopped honestly at Gate B
(`pulse/DIRECT-DRIVE-DAY11-20261109.md`); this lane makes the day
launchable and makes the world safe to leave overnight. No citizen was
woken and no live day was run by this lane.*

## §1 — WORKSTREAM 1: THE STANDING POSTURE, RESTORED

**The danger inherited.** Day 11's lane left the day-11 cameraman
(`cameraman-day11-live.py`, pid 913845) live with its time-refresh
OFF, and the floor parked — a parked floor asserts nothing. The
citizen was offline and safe, but the world's daylight hold depended
on a parked supervisor: **no process was asserting daylight at all.**
Restoring the pre-day-11 posture was therefore the first work, before
any code.

**Before — issuer evidence (Orin `~/minecraft-server/logs/latest.log`):**

- `[00:22:29]` `MagnusandMouse issued server command: /time set 1000`
  — the standing chain's last refresh, before day 11's changeover.
- `[00:25:50]` `Gallery issued server command: /time set 1000` — the
  floor's one landed assertion of the day.
- After 00:25:50Z: **no `/time set` line from any issuer.** The hold
  was unheld.

**The restore, in the order executed** (new holder verified landing
*before* the old pieces stopped — the posture never depended on an
unverified holder):

1. `~/cameraman/STOP` placed 00:38:09Z. The day-11 cameraman exited
   cleanly on its own STOP check: its log's last line reads
   `2026-11-10T00:38:09 STOP file present -- exiting cleanly`. (The
   citizen was offline throughout — Cody's last leave is 00:30:11Z,
   both refused-start joins having left the same second they joined;
   no STOP was ever placed over a live citizen.)
2. STOP removed; the **original `cameraman.py`** (md5
   `27aaa066d5549c7390a0ffc4c39a3d93` — the day-10 code, byte-identical
   to what the day-11 lane found) relaunched detached from
   `~/cameraman` as **pid 959880**, logging to
   `cameraman-restore-relaunch.log`. `chatVisibility:1` verified
   intact in the GalleryWorld `options.txt`.
3. **Landing verified from the server log, issuer-specifically:**
   `[00:38:22] MagnusandMouse issued server command: /time set 1000`
   (the restored chain's start assertion; its own log records
   `DAYLIGHT /time set 1000 (start) -- VERIFIED LANDED in server log`),
   and the periodic refresh followed:
   `[00:43:30] MagnusandMouse issued server command: /time set 1000`.
   The only Gallery `/time set` line in the log remains the floor's
   00:25:50Z assertion — nothing else has asserted since the floor
   parked.
4. Only after step 3's verification, the day-11 pieces on the Thor
   were stood down: the heartbeat keeper (pid 1419833, killed with the
   floor, as the day-11 record directs), `floor.js` (1412754) and its
   `writer.js` child (1412762), the verifier (1412912), the day-11 op
   bot `pulse/op-day11.js` (1411369 — the server log records
   `[00:39:13] Gallery left the game`), and the 1 s log-mirror loop
   (1411318). Post-check: no day-11 process remains on the Thor; the
   Thor-side `ddbridge-fwd.service` (the driver's local forward,
   a different leg from §4's relay) is untouched and active.

**After — the standing posture is the pre-day-11 posture:** the
original cameraman chain is the sole daylight holder, refresh ON,
landing on its normal cadence (00:38:22Z, 00:43:30Z, …), verified from
a store it cannot write. The floor is down, not parked-live; the next
day opens it deliberately, under its charter, or not at all.

## §2 — WORKSTREAM 2: THE THREE REPAIRS, AS IMPLEMENTED

All changes are in `~/craftmind-league/floor/` (`floor.js`, `gate.js`,
`release.js`, `constitution.js`, `contract.example.json`) plus one
expectation string in `pulse/day11/test-gate-wiring.js` (itemised in
§3). Pre-repair sources are preserved beside each file as
`*.pre-repair-20261109`. **The constitution is intact:** the ACTS and
FORBIDDEN lists are untouched, no act was added, and the floor's only
new behaviour is *when its existing heartbeat clock starts* and *how
it reads a file it already read*. The day-11 contract
(`contract-day11.json`) is **not** amended — it is the historical
record of the day that stopped; the launch-window term enters through
the contract *schema* and the example contract, and the next day's
charter pins its value in that day's contract.

### (a) Launch-window lease sequencing — the blocker

The day-11 defect: `floor.js` parked `driver_heartbeat_lost` when no
heartbeat had been seen within `heartbeat_lost_s` of LEASE_ISSUE —
including when the driver had never started. The charter's order
(floor opens → lease stands → Gate B checks → driver launches) was
therefore inexecutable: the lease was revoked 90 s after issue, twice,
and both driver starts were refused — correctly, by a gate reading a
lease the floor had already killed.

The repair: **a lease is born in a declared LAUNCH state**, and the
heartbeat-lost clock starts only at the *earlier* of

- (i) the first heartbeat seen under this lease (a heartbeat file
  timestamp at or after `issued_ms` — a stale file left by an earlier
  process does not count), or
- (ii) the expiry of the contract's launch window, counted from
  LEASE_ISSUE.

Before that anchor the lease simply stands: no renewal is demanded
(there is no heartbeat to renew from) and no park can fire on
heartbeat grounds. `lease.json` now carries the state explicitly —
`state: 'launch' | 'live' | 'parked' | 'revoked'` — and
`first_hb_ms` records the beat that flipped LAUNCH → LIVE.

The window is a **contract term, set once**: `launch_window_s`,
validated by `constitution.js` (optional; when present it must be a
positive number; a negative value is a contract refusal at open,
proven in §3). The example contract carries `"launch_window_s": 300`
— five minutes being the honest scale of a Gate B: the floor opens,
the remaining checks run, the driver launches. When a contract omits
the term, the window falls back to `timers.heartbeat_lost_s` — the
pre-repair value — as a *documented fallback in the code*, not a
second constant: an old contract behaves exactly as it did on day 11,
which is the conservative direction.

Fail-closed is preserved, and one nuance is stated plainly because
the fixtures forced it into the open: a driver that *never* starts is
not left standing on a zombie lease, but it is also not left on TTL
alone — once the window has lapsed *and* a further `heartbeat_lost_s`
has passed with no first heartbeat (or with only a stale one), the
floor parks `driver_heartbeat_lost` and revokes, exactly the guard
Gate B exists to provide. The lease is never renewed without a
heartbeat (renewal still requires a fresh beat), so between window
expiry and the park it can only age toward its TTL. R2 (§3) pins both
halves: stands unparked inside the window; park-revoked just past
window + lost bound, gate refusing thereafter.

### (b) RELEASE_OBSERVED as a stream

The day-11 defect: `releaseObserved` latched `true` after the first
release was observed, so the second release of the day (00:31:11Z,
park_seq 17) was never observed and no fresh lease followed it.

The repair: releases are **observed as a sequence-checked stream**.
`release.js` — still the *only* writer of `release.json`, still an
operator act the floor cannot perform — now stamps each release with
`seq`: the count of releases ever made in that state dir (a
pre-repair release file without `seq` counts as seq 1). The floor
keeps a cursor, `consumedReleaseSeq`, and consumes a release only
when **both** orderings are newer than what it has already consumed:
`release.ts_ms > lease.park_ts_ms` (the release post-dates the
standing park) **and** `release.seq > consumedReleaseSeq` (the
release itself has not been consumed before). A release observed
while parked clears that park and a fresh lease follows; a later park
needs a later release — the standing old file provably cannot clear
it (R4, §3). `RELEASE_OBSERVED` rows now carry `release_seq`, so the
stream is auditable from the floor's own log. (`park_seq` is still
recorded by `release.js` for audit; the floor's ordering no longer
depends on matching it, the (ts, seq) pair being the stronger order.)

### (c) Gate refusal reasons — three, distinct

The day-11 defect: `gate.js` collapsed the unusable-lease states into
the single surface reason `no-lease`, so an *expired* lease (the
day-11 case) read identically to an *absent* one at the exact line an
operator reads first.

The repair: `gate.js` now answers

- **`lease-absent`** — no lease file exists, or the file carries no
  lease (`lease_id` null: e.g. a floor that opened and wrote its
  empty state), or the file is unreadable;
- **`lease-expired`** — a lease exists and is unrevoked, but its TTL
  has passed (the floor is gone, or stopped renewing);
- **`lease-revoked`** — the floor withdrew the lease (every PARK
  revokes as it latches).

`wrong-driver`, `parked`, and `parked-awaiting-new-lease` are
unchanged. One precedence fact, surfaced by R4 and recorded here so
the next Gate B is not surprised by it: because a park revokes as it
latches, a probe against a parked lease answers `lease-revoked`, not
`parked` — `parked` is reached only by a lease file that carries the
park latch without revocation, which the current floor never writes.
The distinction the charter asked for — absent vs expired vs revoked
— is exact; the parked case reads as the revocation it is.

## §3 — FIXTURE EVIDENCE (offline; no citizen wake, no live day)

Three batteries. Outputs are filed beside the batteries:
`floor/repair-fixture-output.txt`, `floor/test-floor-output-repair.txt`,
`pulse/day11/gate-wiring-fixture-output.txt`.

### The repair battery — `floor/test-repair.js` — 5/5 PASS

- **R1 — the exact day-11 sequence, rehearsed green.** Real floor
  (stub channel), fixture contract with the feed declared
  (snapshot: 30 cooked porkchops ≥ 8): floor open → VERIFY_FEED row
  present → LEASE_ISSUE → **an 18 s Gate-B pause with no driver
  process and no heartbeat file** (fixture timers: heartbeat_lost 3 s,
  launch window 8 s — the pause exceeds both, as Gate B exceeded the
  90 s) → the gate-wired driver copy's own simulator
  (`pulse/day11/gate-client.js`, the same init/heartbeat/check path
  the day-11 driver uses) launched late. Result: after the pause the
  lease stood **unparked, unrevoked, `state: 'launch'`, zero PARK
  rows**; the driver's start check **passed** (day 11's was refused);
  **cycles 6/6 executed** — the day reaches cycle 1 and beyond; the
  lease flipped to `state: 'live'` on the first heartbeat.
  Pause-to-first-beat measured: 18.16 s.
- **R2 — driver never launched: no zombie lease.** A stale heartbeat
  file (60 s old at floor open) planted before the lease: it does not
  count as a first heartbeat. The lease stands unparked in `launch`
  inside the window; past window (5 s) + lost bound (3 s) the floor
  parks `driver_heartbeat_lost` at **+5.21 s from issue** and revokes;
  the gate thereafter refuses (`lease-revoked`). The lease was never
  renewed and never honoured a command — dead, by revocation, on the
  designed schedule.
- **R3 — driver launched, then killed: the bound is unchanged.**
  `test-driver.js` heartbeating and honoured, then SIGKILLed: PARK
  `driver_heartbeat_lost` at **2.98 s** against the 3 s bound (+ poll
  slack) — the post-launch protection is exactly as strong as before
  the repair.
- **R4 — the release stream.** Park #1 (STOP) → release **seq 1** →
  RELEASE_OBSERVED, fresh lease, commands honoured again. Park #2
  (STOP) with the seq-1 release still standing: over 2.6 s of floor
  polls the park **held** — gate probe refused, driver attempts
  rejected 2/2 — until release **seq 2** landed, which the floor
  observed and cleared. RELEASE_OBSERVED rows: exactly 2, carrying
  `release_seq` 1 and 2. The single-shot latch is gone.
- **R5 — gate reasons.** Three fixture state dirs — no lease file;
  an expired lease; a revoked lease — answer `lease-absent`,
  `lease-expired`, `lease-revoked` respectively: three distinct
  reasons for the three states (repair (c), directly).

### The floor's original battery — `floor/test-floor.js` — 14/14 PASS, unchanged

T0–T11 (+T6b, T7b) all pass against the repaired floor with **zero
changes to the battery**. Two runs' details worth recording: T1 now
merges 11 traces (the day-11 trace joined the store; the derivation
still reads total 123, day-9 window 3, day-10 window 0); T3's release
path now exercises the stream (its single release is seq 1 and is
consumed as before); T4's fail-closed read is `lease-expired` at the
driver surface — the reason repair (c) names correctly.

### The gate-wiring battery — `pulse/day11/test-gate-wiring.js` — 4/4 PASS, one itemised change

Phases A (lease granted → cycles flow 5/5), B (park mid-run → driver
stops within one cycle, rejection at cycle 7, zero commands after),
C (expired lease → start refused, `lease-expired`), D (no lease →
start refused) all pass. **The one change:** phase D's expected
refusal string, `no-lease` → `lease-absent` — that *is* repair (c)
arriving at the driver's own refusal line; the behaviour (refuse,
zero cycles) is unchanged. No other expectation moved.

### Contract validation (spot checks)

`contract.example.json` (now carrying `launch_window_s: 300`):
validates clean. The same contract with `launch_window_s: -5` is
refused (`launch_window_s must be a positive number when present`).
With the term deleted: validates clean — the documented fallback
applies.

## §4 — WORKSTREAM 3: THE RELAY UNIT

**The path, as found.** Thor :8912 → (`ddbridge-fwd.service`, Thor
user unit, healthy) → Oracle loopback :8913 → the Muse VM's reverse
tunnel → VM `ddbridge.py` :8911 → DeepInfra. The first and last legs
were already supervised (a Thor systemd user unit; nothing). The two
VM-side processes — the relay itself and its tunnel — were the setsid
shell supervisors of day 3 (`~/workspace/ddbridge-supervise.sh`
pid 2573 → relay pid 2575; `~/workspace/ddbridge-tunnel-supervise.sh`
pid 2593 → ssh pid 2595): the pattern that has now died **eight**
times with VM session loss. The Thor-side reverse-forward script in
`~/ddbridge-relay-supervise.sh` is an older, dead path (its log shows
a name-resolution failure loop from 2026-11-09T08:36Z) and is not part
of the live chain.

**What was built** (on the Muse VM, where the relay lives; systemd
*is* PID 1 there, and the lane holds passwordless sudo — no step
remains outstanding):

- **`/etc/systemd/system/ddbridge-relay.service`** — runs
  `/usr/bin/python3 /home/hatch/workspace/ddbridge.py` as a system
  service, `Restart=always`, `RestartSec=3`, output appended to the
  existing `~/workspace/ddbridge-relay.log`. **Enabled** (starts at
  boot, independent of any session).
- **`/etc/systemd/system/ddbridge-tunnel.service`** — runs the
  identical ssh reverse tunnel the supervisor ran (same dedicated key
  `~/.ssh/ddbridge-key` as `thor-tunnel@147.224.38.131`, same
  `-R 127.0.0.1:8913:127.0.0.1:8911`; the Oracle-side authorized_keys
  restriction `permitlisten="127.0.0.1:8913",no-pty` was verified in
  place before cutover and is unchanged), `Restart=always`,
  `RestartSec=3`, output to the existing tunnel log. **Enabled.**
- **`/etc/systemd/system/ddbridge-egress.env`** — both units'
  `EnvironmentFile`. Found during install, and the reason this file
  exists: a systemd child does **not** inherit the login-shell
  environment, and the relay's upstream calls ride the VM's egress
  proxy (`/etc/profile.d/hatch-egress.sh`: `hatch-egress-proxy:3128`
  + the egress CA bundle). The units' first start came up clean and
  the path still failed — the relay attempted a direct TLS connection
  and DeepInfra answered `SSL: WRONG_VERSION_NUMBER`. The env file
  mirrors the profile's egress values (the proxy host is
  unauthenticated from inside the VM network; no credential is
  stored). With it, the path passed end-to-end.

**Cutover.** Each setsid pair was stopped and its unit started in its
place (relay first, then tunnel; Oracle :8913 confirmed free in the
gap and re-listening under the unit). The setsid supervisors are
**retired** — a note saying so, and why, is appended to
`~/workspace/ddbridge-tunnel.log` and `~/workspace/ddbridge.log` where
the next lane will look. They must not be relaunched: a second
`-R 8913` bind fails, and a second relay cannot take :8911.
(`ddbridge-stop.sh` stops only the old pidfiles; stopping the path
now means `sudo systemctl stop ddbridge-relay.service
ddbridge-tunnel.service`.)

**Kill-test — PROVEN, no human in the loop:**

- Relay: MainPID **SIGKILLed at 00:47:05Z**. Port 8911 went down;
  systemd restored the unit (new MainPID, `NRestarts=1`) and :8911
  was listening again within ~4 s.
- Tunnel: MainPID **SIGKILLed at 00:47:13Z**. systemd restored it
  (new MainPID, `NRestarts=1`); Oracle :8913 verified re-listening.
- After each kill, and again at close: **`RELAY-OK PASS` end-to-end
  from Thor** (`pulse/relay-check-day5.js`: HTTP 200, real DeepInfra
  completion, content `RELAY-OK`).

The relay no longer has a session to die with. Death #9, when
something kills the process, is a restart counter incrementing — not
a lane discovering a dead path at a Gate B.

## LEDGER

Lines 334–336 via `pulse/ledger-append.py` (the only append path):
`floor-repair-posture-restore-20261109` (§1),
`floor-repair-lease-release-gate-20261109` (§2–§3),
`ddbridge-relay-systemd-20261109` (§4).

## WHAT REMAINS OWED (not this lane's)

- The next day's charter must pin `launch_window_s` in its own
  contract (the day-11 contract stands unamended as the record of
  the stop) and re-run Gate B under the repaired floor. The tread at
  (65, 66, −88) stands; triple-021 remains unscored and live; the
  hand-over line remains owed verbatim.
- The Thor-side `~/ddbridge-relay-supervise.sh` is a dead script from
  an older path; it is documented above as such and left in place —
  deleting fleet files is not this lane's call.

*— Floor-repair lane, 2026-11-09. The posture holds overnight on the
chain that held day 10; the gate that stopped day 11 now lets a
properly sequenced day start — and still stops everything it
stopped before.*

---

## CORRECTION (appended 2026-11-10, relay-truth-closure lane; the text above is untouched)

**§4's systemd claim was true only on the instance that wrote it, and was false on the serving instance for the whole of days 12–17.** Relay deaths #9–#12 (day 13, 14, 16 and 17 Gate B pre-checks; #8 was day 11's) each found **no ddbridge units on the serving VM** — every day lane relaunched the retired setsid supervisors by hand and verified RELAY-OK, 5-for-5 at check and launch. The cause is now measured, not inferred: on **2026-11-10 the Muse VM was replaced** (boot 14:35:19Z, new boot_id `29a3936c-4bf4-4c3b-a705-dd5f4aa0ed1e`) and booted with a **stock `/etc`** (`/etc/systemd/system` created at boot, holding only distro units — the ddbridge units and the egress env file were simply not there), while the home tree survived intact (`~/workspace/ddbridge.py` still carries its 2026-11-09 mtime). **State outside `~` does not survive VM replacement** — the known-hosts lesson, second form. Any install that lives only in `/etc` will keep dying this way.

**As of 2026-11-10T16:05–16:06Z the claim is true again on the instance that currently serves, in a form that survives the failure mode:** both legs run under the §4 units (`ddbridge-relay.service`, `ddbridge-tunnel.service`, `Restart=always`, enabled), installed by **`/home/hatch/bootstrap-ddbridge.sh`** — an idempotent installer kept in the persistent home tree, hooked at boot via `/etc/cron.d/ddbridge-bootstrap` (`@reboot`, best effort) and re-runnable by any lane (`sudo /home/hatch/bootstrap-ddbridge.sh`). Kill-tested on this instance: relay MainPID SIGKILLed 16:05:56Z → restored, `NRestarts=1`, :8911 re-listening; tunnel ssh SIGKILLed 16:06:11Z → supervisor respawned it, Oracle :8913 re-listening; **RELAY-OK PASS from Thor after each kill and at close.** Two install findings differ from §4's instance and are recorded in the closure filing: systemd passes the quotes in a direct-ssh `ProxyCommand="..."` `ExecStart` literally (the tunnel unit therefore runs the supervisor script itself), and systemd does not set `HOME` (the unit sets `HOME=/home/hatch` explicitly).

**The accepted standing cost, restated honestly:** within an instance's life, a dead relay process is now a restart counter, not a Gate B discovery. Across a VM replacement, one bootstrap run (~30 s, plus RELAY-OK verification from Thor) is the re-establishment cost — until the runtime grows a persistent-`/etc` or home-hook mechanism, that run is part of the first Gate B after any replacement. Full evidence: `floor/RELAY-TRUTH-CLOSURE-20261109.md`.
