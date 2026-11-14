# CAMERAMAN SUBJECT-KEEPER — built, audited, proven (offline)

*Built 2026-11-09 by the subject-keeper build lane, under Casey's
"build it all" + parent sequencing. OFFLINE BUILD + PROOF ONLY: no
activation, no wake, no server commands, no placement. The running
cameraman was never restarted and its file never edited — Orin
`~/cameraman/cameraman.py` md5 `27aaa066…` before and after, pid
1027476 still running it at filing time, refresh ON, no STOP file.*

## 0. The deliverable

- **File**: `cameraman-subject-keeper.py`, 69,710 B,
  md5 `6042c1cb67da7d67a0c28c941c64efd6` — byte-identical in both
  homes (verified by md5 after each copy):
  - Thor (working home): `~/craftmind-league/pulse/camera/`
  - Orin (activation home): `~/cameraman/` (a NEW file beside the
    running one; nothing replaced)
- **Proof suite**: `pulse/camera/test-subject-keeper.py`, output at
  `pulse/camera/test-subject-keeper-output.txt` — **PASS, 0 failed
  assertions**, run on Thor against the filed bytes; every input is
  a pinned fixture in `pulse/camera/fixtures/` (sources + hashes in
  `fixtures/manifest.json`).
- **Construction**: the rig lane's audited day-11 build (Thor
  `pulse/day11/cameraman-day11-framing.py`, md5 `7d683ce8…`) with
  exactly two comment spans corrected inside its own keeper banner
  (the banner now names this file and this filing instead of the
  prep lane; one section header re-tagged). No code line differs
  from the rig build. Everything below is measured against the
  ORIGINAL cameraman, not asserted from the rig filing.

## 1. What actually happened before — the precise record

Incident C (day-11 record) said "the framing copy carries no framing
change." Measured today, the failure has three distinct parts:

1. **A keeper WAS built and dry-proven on Thor.** The Thor working
   copy (`7d683ce8…`) contains a complete subject-keeper (§2), and
   its filed test output is genuine: 308/308 tracked, 71 reframes.
2. **It never reached the Orin.** The Orin "framing copy"
   (`~/cameraman/cameraman-day11-framing.py`) is byte-identical to
   the original (`27aaa066…`) — the copy step delivered the wrong
   bytes, and nobody hash-checked the destination. The file actually
   activated for day 11 was a third file, `cameraman-day11-live.py`
   (original + two `CAM_DAY_REFRESH_OFF` guards, 10 diff lines).
   Day 11 therefore ran day-10 camera logic, and the frame verdict
   (Cody visible 1/10) prices that logic, twice-measured.
3. **The rig proof was not reproducible.** Its test read the LIVE
   `pulse/direct-drive-state.json` as its perception input. Day 11
   overwrote that file. Re-running the rig test today **FAILS** at
   A2 with **0 reframes**: fed day-11-close ground/ring (absolute
   column tops y67–y70 from Cody's home ground), `pick_station`
   rejects every station for day-10's roaming positions and the
   keeper — correctly, by its rules — frames nothing rather than
   framing blind (§5, arm P5 reproduces this deliberately). The
   keeper design was sound; the deployment and the proof hygiene
   were not. This filing's suite pins every input for that reason.

## 2. Design as built

The original v3 cameraman, plus ONE watcher thread
(`subject_keeper`, started in `main` beside `log_tail`/`thor_poll`):

- Every **2.0 s** (`SUBJECT_CYCLE_S`) it re-reads each citizen's
  direct-drive state — the driver's own per-cycle publication
  (`pulse/direct-drive-state.json`), the freshest position source
  in the fleet, already ingested by the cameraman's Thor poll into
  `World.dd`. The framing target IS that current position, re-read
  each cycle (`World.framing_target`), never a shot-time snapshot.
- When he has moved **> 3.0 blocks** (`SUBJECT_REFRAME_DIST`) from
  the last keeper-framed position and no shot sequence is running
  (a `Director.busy` flag set by `run_event` / `flythrough` /
  `fallback_step`; a flag wedged > 120 s is ignored so a stuck shot
  cannot blind the keeper), it re-frames: an LOS-checked
  `pick_station` station aimed at his **current** position
  (`SUBJECT-KEEP` cut, target = pos + 1.2). If every station is
  occluded it holds and retries next cycle — it never frames blind.
- Mirror older than **45 s** (`SUBJECT_STALE_S`, ≈ 2.5 missed
  publications at day-10's ~17 s driver cadence), or age unknown:
  **hold the last frame and log it** (`SUBJECT-HOLD`, once per
  episode; `SUBJECT-RESUME` on recovery). It never silently frames
  somewhere he has left.
- `SUBJECT_KEEPER=0` disables the keeper alone (the process keeps
  pure v3 behaviour) — the rollback switch.
- **Daylight is the original's, unchanged.** This build contains no
  `CAM_DAY_REFRESH_OFF` guard and chooses no asserter: who asserts
  daylight stays the day-charter's decision, applied at activation
  as its own audited step (§6.2).

## 3. Byte-diff audit vs the original (proof 1)

`diff` of the deliverable against the live `cameraman.py`
(`27aaa066…`): **158 lines added, 3 lines removed, 15 hunks** —

| hunk | change |
|---|---|
| 122a123 | `import calendar` (mirror-age arithmetic) |
| 202a204,232 | keeper banner + `SUBJECT_*` constants |
| 318a349,354 | `World` framing state (target / framed / ts / stale) |
| 441a478,485 | `World.dd_snapshot()` — lock-held copy of the dd dict |
| 876,877c920 | `_los_columns` reads via `dd_snapshot` (2 lines → 1; the one non-keeper code change — a lock-hardening the keeper's station picks rely on) |
| 967a1011,1012 | `Director.busy` / `busy_since` fields |
| 1255a1301,1302 · 1271a1319 · 1274a1323,1324 · 1279a1330 · 1301a1353 · 1304a1357,1358 · 1339a1394 | busy-flag hooks in `run_event`, `flythrough`, `fallback_step` |
| 1394a1450,1546 | `_mirror_age_s`, `keeper_step`, `subject_keeper` |
| 1399c1551,1554 | `main`: build the Director, start the keeper thread, run (1 line → 4) |

Machine-checked (suite arm P0, AST per-function comparison): **53
shared functions; every one byte-identical except the 7 named**
(`World.__init__`, `_los_columns`, `Director.__init__`,
`Director.run_event`, `Director.flythrough`,
`Director.fallback_step`, `main`); added functions exactly
{`World.dd_snapshot`, `_mirror_age_s`, `keeper_step`,
`subject_keeper`}; **nothing removed**; all 35 shared module
constants identical (added: only the `SUBJECT_*` set); imports gain
only `calendar`. Named explicitly: `Director._attempt_daylight`,
`Director.daylight`, `Director.check_stop`, `Director.dwell`,
`send_command`, `mc_window_active`, `thor_poll`, `log_tail` are
byte-identical — the landing-verified daylight hold, the STOP
semantics and the focus guard are the original's, untouched.

## 4. Replay proof (proof 2)

Actuation stubbed and recorded; the keeper code under test is the
filed deliverable's own.

- **Day 10** (308 publications with ts+pos, from the real trace;
  313 further rows carry no position): total displacement
  **573.9 blocks**; tracking **308/308 exact**; **71 reframes**;
  aim error max **0.0000** (every reframe aimed at the position
  current at that publication — never a stale one). *These are the
  rig lane's filed numbers, now reproduced from pinned fixtures:
  the claim was true; its evidence is now durable.*
- **Day 11** (36 publications — the played span; 38 trace rows
  carry no position: gate-refusals, density rows): displacement
  34.9 blocks; tracking **36/36 exact**; **6 reframes**; aim error
  max **0.0000**.
- Declared approximation (the rig test's, kept honest): the traces
  record positions, not per-cycle ground/ring, so P1/P2 run with
  neutral perception (no named columns → LOS clears). They prove
  tracking, reframing and aim. LOS behaviour under real (and
  wrong-place) perception is arm P5's evidence, plus v3's own live
  history.

## 5. Synthetic contrast + staleness (proofs 3, 4) and the rest

**P3 — moving-subject contrast.** A synthetic walker on a 108-block
path (legs at 3 blocks/s, work pauses between; publications every
2 s; sampled every 2 s, keeper sampled BEFORE its step so one cycle
of staleness is priced in). Original arms model v3 exactly as coded:
a shot's aim is fixed at the citizen's position when the shot starts
and does not move during the dwell. In-frame = subject within 6.0
blocks of the framed position.

| arm | in-frame (all samples) | in-frame WHILE MOVING | max err | mean err |
|---|---|---|---|---|
| **keeper** | **120/120** | **18/18** | **6.0** | **0.90** |
| original, fallback dwell 10.5 s | 106/121 | 7/18 | 25.5 | 2.00 |
| original, event cadence 20 s | 104/121 | 5/18 | 30.0 | 3.22 |

The discriminating column is WHILE MOVING: standing still, any
camera eventually frames a citizen; walking, the original holds a
frame he has left in 11–13 of 18 samples, the keeper in none.
Keeper reframes during the fixture: 19. **The keeper's bound,
stated plainly**: its worst-case sampled error while the subject
moves is ONE keeper cycle of travel (2 s × speed) — at the
fixture's 3 blocks/s that equals the 6.0-block radius exactly. At
sprint speed (~5.6 blocks/s) the same bound exceeds the radius
between cycles; at the citizens' recorded pace (573.9 blocks over
303 driver cycles on day 10) it is far inside. The original arms
have no bound: their error grows for the whole dwell.

**P4 — staleness.** Publications freeze for 120 s mid-walk while
the subject keeps walking (ground truth moves, the mirror does
not): stale state at **37/37** probes past the 45 s bound;
`SUBJECT-HOLD` logged **exactly once**; **zero** reframes during
the freeze; the framing target never leaves the last fresh
position (40.0, 64, 0.0); on resume, one `SUBJECT-RESUME` and a
reframe aimed at the true current position (aim error 0.0000).

**P4B — busy.** 40 day-10 publications under a running shot:
tracking exact, **0** reframes; on the first publication after the
shot ends, the deferred reframe fires.

**P5 — occlusion honesty.** Day-10 publications replayed against
the WRONG place's perception (day-11 close ground/ring, pinned as
a fixture): **308/308 occluded, 0 reframes, tracking still exact**
— the keeper starves rather than framing blind. This is precisely
why the rig test fails today, and it prices activation check §6.3:
fed another place's perception the keeper is blind; fed the
citizen's own — which the live mirror is by construction, the
driver publishing from his own position every cycle — it frames.

## 6. Activation contract — what Gate B must verify before this file ever runs live

1. **Identity of the ACTIVATED file.** md5 of the file about to run
   == `6042c1cb…`, in the home it runs from; any drift from the
   filed deliverable is a new build and re-opens this proof. (The
   day-11 failure was verifying the prepared file and running a
   different one.)
2. **Daylight changeover, deliberate.** This build asserts daylight
   exactly as the original does. If the day's charter makes the
   floor the single asserter, the refresh-off variant must be
   produced as its own audited diff from THIS file — and verified
   from the server log, issuer-specifically, after activation:
   never two asserters, never none.
3. **Live mirror sanity.** dd publications flowing (ts advancing),
   pos agreeing with the citizen's known position on a spot check,
   and ground/ring present and co-located (his OWN current
   perception — the P5 check). An occluded keeper logs LOS
   rejections; a silent one isn't running.
4. **Clock skew.** Mirror age is computed from the driver-written
   ts against the cameraman box's clock; skew eats the 45 s stale
   bound directly. Measure Thor↔Orin skew at Gate B (< 5 s) and
   file it.
5. **Frame-content spot check.** In the day's first hour, sample
   ≥ 3 stills and confirm the citizen is IN them by eye — the shot
   log records intent, not content (day 10's 0/9 was found by
   stills, not logs). Correlate with `SUBJECT-KEEP` lines: they
   must appear when he moves > 3 blocks; their absence while he
   roams means the keeper is not running, whatever the process
   list says.
6. **STOP rides the standard procedure.** The keeper adds no kill
   path and no new file: it dies with the process under the same
   STOP-file semantics as every renewal. Stand-down restores the
   standing chain the same way.
7. **Rollback.** `SUBJECT_KEEPER=0` in the environment disables
   the keeper alone, reverting the process to pure v3 behaviour
   without a file change.

## 7. Named limitations

- Keeper error bound is cycle × subject speed (§5): a sprinting
  citizen can exit a 6-block frame between cycles. The traces show
  citizens walk their legs well inside the bound; a future driver
  that sprints re-opens this.
- Staleness is judged on the publication's own ts: a driver that
  keeps publishing a FROZEN position with fresh ts defeats the age
  check (the keeper would track a lie faithfully). The floor's
  census cross-checks are the store that catches that class.
- LOS perception is the citizen's own survey (4-direction ground +
  8-column ring), inherited from v3 unchanged: columns it does not
  name cannot occlude a station.
- P1/P2 prove tracking/aim under neutral perception (§4); live
  LOS terrain behaviour rests on P5 + v3's live record until the
  first activated day measures it directly (§6.5 is that
  measurement).

*— Subject-keeper build lane, 2026-11-09. The world was not
touched: no activation, no wake, no logins, no server commands; the
live cameraman (pid 1027476) never restarted and never edited.*
