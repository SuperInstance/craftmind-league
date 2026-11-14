# DIRECT-DRIVE DAY 11 — PLAYED (the relaunch)

The day the stop record said could not start, run under the repaired
floor. The stop record (`pulse/DIRECT-DRIVE-DAY11-20261109.md`) is NOT
edited; this record cross-references it. Charter:
`pulse/DAY11-CHARTER-DRAFT-20261109.md`, unchanged. Amendments run per
the parent's relaunch brief: (1) relaunch contract
`floor/run/day11/contract-day11-relaunch.json`, canonical contractSha
`7d817ccdfabc587fd8ae2e9939ba3eadaaacc960d80ebe3fe77f8d922e250c8d`
(thresholds identical to the stop attempt's contract
`64940d283e933e8ba7a2d8567c01e29b915ae65246b4745825bb247c5ee0d764`,
plus `launch_window_s: 300`); (2) launch sequence in the repair
battery's R1 shape; (3) cameraman changeover in, standing posture
restored at close; (4) relay systemd-backed, RELAY-OK required at
check and launch; (5) Gate B otherwise as chartered, Cody's `.dat`
baseline = the CURRENT sha `83dc33af…` (the stop record's fresh
snapshot re-read proved its content item-for-item identical to day-10
close; the sha moved only because the server rewrote the file on the
stop attempt's two gate-refused joins).

Played window: **2026-11-10T00:59:36Z → 01:07:04Z — 31 cycles.** The
day was ended by a floor PARK (`daylight_unrestorable`) at 01:07:03Z,
not by budget, not by deaths, not by the citizen. See §7.

Ledger: claim line 337 (`day11-relaunch-claim-20261109`); played-day
line 338; census + triple-score line 339.

## 1. ACTION CURVE (the day, first)

Single played block — the span is 7.47 minutes, so the ~10-minute
block IS the day. **No stall block** (the charter's minimum block is
24 acts; the day never had the chance to stall — it was cut at 31
cycles).

**31 commands:** goto 14 (7 ok), dig 10 (5 ok), craft 4 (3 ok),
felltree 2 (1 ok), climb 1 (0 ok).

Bookkeeping flag (filed, not silently resolved): the trace's 32
`density` rows sum to 527 sub-acts (goto 295, dig 104, craft 66,
felltree 60, climb 2), which does not reconcile with 31 commands the
way day 10's density did (day 10: 303 cycles → 2,135 sub-acts ≈ 7 per
command; day 11: ≈17 per command). Both figures are filed; the
command count is the day's measure.

The story the curve tells: he left the hollow under his own power
(the charter's wake order held — no relocation), **felled the
Director's tread log at cycle 4**, crossed home, crafted at his own
table, and dug his stone at home. Then the floor parked the day over
a daylight check that was actually fine (§7). hp 20, food 20 at every
one of the 31 cycles. **Zero deaths. Zero survival-floor
interventions.**

Cycle spine (trace `pulse/direct-drive-trace-day11-20261110.jsonl`):

- c1 — hand-over line delivered (driver copy's scene text); his say
  mirrors it back ("one cobble and a furnace still hungry — home's
  just west along the south shoulder… south of that pit, never
  across it"). `goto 62 67 -89` failed — walker gave up at his start
  position; the hollow exit is walker-taxed from the first command.
- c2 — from the hollow he perceived the tread log (65,66,−88) as "a
  real oak trunk five blocks west of me" and aimed `felltree 65 66
  -88` — failed from range ("no logs dug there").
- c3–c12 — worked north around the hollow rim (gotos through
  (68.9,65.3,−86.7), (67.4,65,−86.7); one failed dig at (68,66,−87),
  x outside the step box).
- **c4 — `felltree 65 66 -88` returned ok:true — "felled 1 logs and
  gathered drops."** The Director's one element, taken as material in
  the day's first five minutes (§9).
- c13 — position (65.1, 67, −89.7): the homeward crossing of the
  shoulder band (x=65, z in −90..−87), on the 12→13 leg.
- c14 — arrived at the table (64.3, 68.5, −92.1).
- c15 — say: "Home at last, table at my elbow."
- c15–c18 — the furnace chain, reordered vs the charter (home/table
  first, stone dug at home — not the chartered hollow pocket): c15
  `craft oak_planks 8` ok; c16 `craft stick 4` ok; c17 `craft
  stone_pickaxe 1` **FAILED — the asset's named dialect** ("missing
  ingredients — cobbled_deepslate — you hold 0 of 3"); c18 `craft
  wooden_pickaxe 1` ok.
- c19–c28 — stone phase at home: digs at (64,66,−92) and (64,67,−93)
  failed (no block at his feet level); he stepped to the pad's west
  edge and dug a shaft at x61–63, z −92: grass, dirt, dirt, **stone
  at (61,63,−92) c25, stone at (62,63,−92) c26** — dug from a
  standing stance at y67, NOT the chartered seam stance (S7 not
  performed as specified). Read-back, his c27 say: "Two cobble."
  Held cobble peaked at **2** (from 1). c27's dig (63,63,−92) found
  open air; c28's dig (60,63,−92) died on a walkTo timeout — he slid
  down into his own diggings.
- c29–c31 — in the dug dip beside his pit ((63.3, 64, −90.4)); gotos
  out failed ("3 blocks below"); c31 `climb 63 -90` failed ("pillar
  failed (nothing placed under you)"). At 01:07:03Z the floor parked
  (§7); the driver hit `gate-park` at the next cycle head, skipped
  its close-exit movement (gate-park-close), exited 01:07:09Z rc=0.

## 2. FURNACE: NO

S10/S11 never attempted; held cobble peaked at 2 of the 8 the furnace
needs. The skill **was used** — named plan, S0–S9 partially run,
reordered — and its second `uses[]` entry is appended
(`skills/furnace-sequence.v1.json`, `uses[0]`, outcome
`ran-reordered-partial`; the array held zero entries before this —
the day-10 replay analysis had been described as its first use in
the skill's filing but never appended; this record notes the gap
rather than back-filling it silently).

Deviations, exactly: S2/S3 ran before S6 (the chartered hollow pocket
was empty — despawn, §3 of the game-report copy /
`FURNACE-SKILL-20261109.md`); stone dug at home, not the hollow
pocket; S7 seam stance not performed (dug downward from a y67
stance); the positive-arm question stays thin (2 foot-level-ish digs
→ read-back 2, but not under the chartered protocol). S7/S8 positive
arm, S10 craft at ≥8 cobble, S11 place + read-back remain UNPROVEN.
The asset's status is unchanged: ADMITTED-WITH-UNPROVEN-TAIL.

Read-back evidence for the peak: wake feed-confirm (food 20, no give;
cobble 1 at wake) → c25/c26 stone ok → c27 say "Two cobble." The
post-day `.dat` reads cobble 1 — see Incident D (§8): the saved
inventory does not reconcile with the day's held counts, and the
read-back peak stands on the trace + his own say, not on the save.

## 3. DEATHS DELTA: 0 (123 → 123)

Derived post-day via `pulse/lib/deaths.js` over the deaths record +
all traces: **total 123; deaths in the played window: 0.** hp/food
20/20 at every cycle; zero survival-floor interventions; the floor's
COUNT_DEATH read 0 all day. Cody left offline at (63.3, 64, −90.4),
unharmed, in the dug dip beside his own pit at home.

## 4. THE FLOOR'S LIVE REPORT

From its own log (`floor/run/day11/state/floor-log.jsonl`), contract
sha `7d817ccd…` on every row:

- FLOOR_OPEN 00:54:43Z → VERIFY_FEED **PASS** (have 30 ≥ need 8, zero
  gives) → LEASE_ISSUE 00:54:44Z, lease `lease-1794272084148` in
  `launch` state → ASSERT_DAYLIGHT attempt 1 landed (Gallery
  00:54:48Z) → driver start 00:59:03Z inside the 300 s window →
  **first heartbeat flipped the lease `launch` → `live`**. The launch
  state survived the full Gate B + cameraman changeover (~4.3 min)
  without parking — the repair doing exactly its job.
- ASSERT_DAYLIGHT ×6 acts: three verified-landed rounds (00:54:48,
  00:58:49, 01:02:49 — each verified attempt 1) + the 01:06 round's
  three attempts (§7).
- COUNT_DEATH 0 all day. Canary moving throughout (age < 60 s bound
  at every read). Sequence integrity held (seq_ok, gapless).
- PARK `daylight_unrestorable` 01:07:03.340Z (park_seq 24) +
  LEASE_REVOKE + NOTIFY (`floor-park-7`, receipted, record-only).
  FLOOR_CLOSE on SIGTERM at close-out (seq 33).
- Verifier quirk (filed in the record): its cross-audit counts
  operator test traffic (Gate B ping/park-notify tests, the close
  `quit`) as floor acts, so its status read `ok:false` at every
  in-day read for that reason alone (final: park-notify=2 PARK=1).
  Do not read the verifier's ok:false as a floor failure.

The lease gate has teeth in production, now proven on both sides:
start refusal (Incident A), launch→live flip on first heartbeat,
park obeyed within one cycle, close-exit skipped under a dead lease.

## 5. BUDGET ACTUALS

- 31 brain calls, **all DeepInfra `deepseek-v4.1-flash`, ZERO
  failovers.** Tokens 418,302 total (prompt 416,906 + completion
  1,396). Provider estimated cost (trace `usage.estimated_cost`,
  summed over cycle rows): **$0.0305**.
- Rate: 31 calls / 7.47 min = **4.15 calls/min** against the
  chartered ceiling **3.976 wc/min** (B ≈ 338 wc for 85 min; hard cap
  675.92 wc). In the ledger gate's vocabulary this is **OVER-TARGET
  on rate** for the played span — filed as budget actuals, as
  chartered; the day consumed 31 of ~338 chartered wc and was cut by
  the park, not by budget. (The rate is a short-span artefact of a
  fast opening — cycles at ~14 s spacing — but the number is the
  number.)

## 6. FRAME VERDICT

Method and table: game-report copy §Frame verdict (10 stills sampled
from Orin `~/capture/segments/2026-11-10/` across 00:59–01:07Z, each
read by eye).

- **Cody-visible: 1/10 fully; 3/10 counting two partials** (one
  edge-clipped bottom-right, one centre-low largely occluded).
- **Clean-frame: 10/10 pass** — no command text in any still
  (Commands Only held, `chatVisibility:1`; three stills carry system
  teleport notices, which are not command text).

**Incident C — the day-11 "framing copy" carries no framing change.**
Orin `~/cameraman/cameraman-day11-framing.py` is **byte-identical to
the original** (md5 `27aaa066…` both). The file actually activated
for the changeover, `~/cameraman/cameraman-day11-live.py` (md5
`8cda2a4f…`), is the original + exactly two `CAM_DAY_REFRESH_OFF`
guards (10 diff lines) — **position-driven subject-keeping (charter
§8/§12 item 10) is NOT in it.** Day 11 therefore ran with day-10
camera logic + refresh OFF. The changeover itself executed as
chartered: STOP placed with Cody offline, old chain exited cleanly
00:57:16Z, day-11 file live as pid 983269 at 00:57:25Z with the
changeover banner; server log shows the last MagnusandMouse `/time
set` at 00:53:53Z (pre-changeover) and none after. The verdict above
prices the camera as it ran. The binding screen deficit from day 10
stands unclosed, now twice-measured; the next camera charter must
verify the activated file's diff before Gate B, not after the day.

## 7. THE PARK — `daylight_unrestorable` (fault_owner: harness)

The floor's daylight assertions landed on cadence all day (Gallery
lines 00:54:48, 00:58:49, 01:02:49, each verified attempt 1). In the
01:06 round the floor issued at 01:06:48.87 / 01:06:53.69 /
01:06:58.51 and **all three commands demonstrably landed** (server
log: Gallery 01:06:49, 01:06:53, 01:06:58; op-bot results ok:true) —
but the floor verified NONE inside its window and parked per its
constitution (3 attempts → PARK), notifying `floor-park-7`.

Root cause, measured post-hoc from the mirror file itself: the
landing lines sit at mirror byte offsets **58832 / 58995 / 59158**,
and the floor's recorded `before` offsets for those attempts were
**58833 / 58996 / 59159 — exactly ONE byte higher in every case.**
`log-mirror.sh` builds the mirror as (log tail) + one trailing echo
newline, so every line's offset in the mirror is the log offset −1
relative to the floor's size-based arithmetic; the floor searched
`slice(before)` and the needle sat at `before − 1`, just outside the
slice. Why the morning assertions passed: the same off-by-one
existed, but the search region then also caught the line via earlier
refresh content/timing — the precise morning mechanism is not fully
derived; the measured fact and the one-byte finding are filed, not a
theory. Contributing: the floor's 2 s verify window opens only after
the op channel responds (~2.7 s), and the rig filing's own warning
stands — the 2 s window held "thinly, ≈0.3 s margin at p90."

The repair owed (next floor charter, not this lane): the floor
should search from a small look-behind (or the mirror should not
append its newline), and/or the landing window widened by filed
amendment BEFORE a day, never during one. The floor behaved exactly
as its constitution requires — it cannot verify, so it parks. The
defect is in the rig around it. fault_owner: **harness**.

## 8. INCIDENTS

**Incident A (fault_owner: harness) — the launch script pointed the
gate at the wrong directory.** `pulse/day11/dd-launch-day11.sh` set
`FLOOR_STATE_DIR=…/floor/run/day11` but the floor's state dir is
`…/floor/run/day11/state` (where lease.json/heartbeat.json live; the
rig's dry-check + gate fixtures all used `<stateDir>` directly). The
stop attempt's leftovers in the run root (`heartbeat.json`, a stale
`lease.json`, `release.json`) made the wrong directory look
inhabited — the precise mismatch. First relaunch driver start
(00:58:10Z) was gate-refused, reason **`lease-absent`** (repair (c)'s
vocabulary working); Cody joined/left the same second, unharmed.
Fix: one line (`FLOOR_STATE_DIR` → `…/state`); original preserved as
`dd-launch-day11.sh.pre-relaunch-fix`. Second start (00:59:03Z)
printed `GATE: live lease confirmed at start`.

**Incident B — the op channel files hold the channel's memory.** The
first op-bot start (pid 1448273) replayed the stop attempt's request
backlog (ping/park-notifies/daylight chat) on boot — harmless
duplicates (one extra, unneeded daylight assertion, Gallery
00:52:50Z). The stop attempt's channel + state were archived
(`floor/run/day11/op-stop-attempt/`, `state-stop-attempt/`), files
truncated, floor state dir reset fresh (the stop attempt's floor had
ended closed via FLOOR_CLOSE), op bot restarted clean (pid 1449566).
Fresh Gate B receipts through the real channel:
`gateb-relaunch-ping-1` (ok, spawned) + `gateb-relaunch-park-test-1`
(park-notify recorded) at 00:54:29Z. The verifier needs the channel
record kept in step with `<stateDir>/op-req.jsonl` by manual copy
(as the stop lane did).

**Incident C — camera framing copy.** See §6: the prepared framing
file is byte-identical to the original; the activated file carries
only the refresh-OFF guards. Subject-keeping was never in the day.

**Incident D — inventory-transfer gap across the day
(fault_owner: harness, unresolved).** The post-day census `.dat`
(fresh snapshot, sha in the census check) reads: oak_planks **4**,
wooden_pickaxe **6**, oak_log **15**, stick **9**, cobblestone **1**,
dirt **3**, cooked_porkchop 30, birch_log 10, egg 3, oak_button 15,
leaf_litter 9, apple 1, oak_sapling 1. Against the wake inventory and
the trace's own read-backs (wake: planks 8, sticks 7, pickaxes 5,
oak_log 18, cobble 1; day: +8 planks crafted, +4 sticks crafted, +1
pickaxe crafted, +1 oak_log felled, cobble peaked 2), the save shows
planks −4 net, oak_log −4 net, sticks +2, dirt −3 — and an
**oak_planks ×9 item drop lies on the ground at his final position**
(63.4, 64.0, −90.4) (entities census, age 3573 ticks), with two
cobble drops and a dirt ×3 drop in his diggings. Somewhere in the
played day, held items became ground drops without a trace row
naming it (a death-free inventory spill — plausibly the c28 slide
into his diggings, or a driver inventory action the trace does not
log). The day record files the discrepancy from both stores; it does
not reconcile it by invention. The furnace read-back peak (cobble 2)
stands on the trace + his c27 say.

## 9. TRIPLE-021 — SCORED: FAIL

Post-day census (fresh read-only copies of Orin region/entities
r.0.-1.mca, md5 `20c15e11…` / `87b7cd32…`, parsed offline with
mcprobe; probe `director/census-s2-postday11/probe_post.py`):

- **Tread cell (65,66,−88): `minecraft:air`** — felled at cycle 4.
- Invariant cells: (65,67,−88) air ✓; (65,66,−89) grass ✓; (64,66,
  −88) dirt ✓; (64,67,−88) grass ✓; (64,68,−88) leaf_litter ✓;
  (65,65,−88) reads **grass_block** — the scenario spec's
  pre-placement value; the placement window's post-placement read
  was dirt (the setblock cover-killed the grass). Under held
  daylight the grass regrew over the day. Filed as a world note,
  not a placement defect.
- His-ground spot reads: all unchanged (crafting table (64,67,−94);
  farmland (67,66,−95..−97); trench water (65,66,−95); pad tops
  (60..62,66,−93) grass; pen gates (64,67,−101)/(65,67,−100)
  oak_fence_gate; hollow steps (71,64,−88) dirt, (71,65,−88)
  oak_planks).
- Furnace blocks in the district (x 54..90, y 55..75, z −106..−70):
  **NONE** — corroborating §2 from the store.
- Step box dump filed in the census probe output; the box's ground
  is otherwise untouched — his digs were all outside it.

Scored through `commons/triples/` as **triple-023** by the filed
rule (PASS requires all three): (i) homeward crossing **PASS**
(trace positions, 12→13 leg); (ii) no dig/place in the step box
**PASS on the rule's literal verbs** — the removal was by
**felltree**, a verb the rule does not name (the gap is argued in
loosening note #3, not in the score); (iii) census clause **FAIL**
(tread gone). **SCORE: FAIL — the element was met as material, not
as ground: the opposite of the prediction.** Perception sub-read
(unscored): his cycle-2 say named it "a real oak trunk" — perceived
as a resource from inside the hollow, before ever standing on the
road.

## 10. GATE B (relaunch) — as run

Claim ledger line 337. Saves verified live 00:52Z: Cody `83dc33af…`
(current baseline, §head), Vega `4b65ff2e…edc6`, Geist `8ecbd230…
4f0` — full shas in the census check. Ops live: Gallery,
MagnusandMouse, MapProbe4 (all lvl 4); Cody not opped. Deaths
baseline **123 re-derived** via `lib/deaths.js`. RELAY-OK PASS at
check (00:51Z) and at launch (00:58:03Z), $0.0000026 per probe.
Floor open sequence live: canary moving, VERIFY_FEED PASS, mirror
loop at 1 s, op-bot ping + test park-notify receipted through the
real channel (Incident B's clean restart). Wake readback (70.3, 64,
−88.6), hp 20, food 20; driver wake feed-confirm passed from his own
read (food 20, no give). Hand-over line delivered verbatim via the
driver copy's scene text.

Also filed from the stop record's errata: the brief's "cameraman
cap-renewal job" does not exist as a cron — renewal checks are a
separate job chain (job h fires 07:53Z; it will evaluate the
restored chain below).

## 11. CLOSE — STANDING POSTURE RESTORED AND VERIFIED

- Day-11 cameraman (pid 983269) STOP-stopped with Cody offline;
  exited cleanly 01:10:39Z (`CAMERAMAN EXIT clean (STOP file) = True`;
  its last log line is a STALL shot naming Cody's final position
  (63.3, 64.0, −90.4)); STOP removed.
- **Original `cameraman.py` relaunched as pid 1027476 at 01:10:51Z;
  start assertion VERIFIED LANDED in the server log at 01:10:52Z,
  refresh ON** — the world is held overnight by the standing chain
  exactly as the repair lane left it. Fresh ~8 h cap from
  01:10:51Z.
- Thor stood down: op bot quit through its channel (Gallery left
  01:11:40Z); floor SIGTERM → FLOOR_CLOSE; writer, verifier, mirror
  loop all stopped; no day-11 process remains on the Thor
  (verified from `ps`); `ddbridge-fwd.service` untouched.
- Cody's `.dat` was rewritten by the played session legitimately;
  the post-day census (§9) reads the final state.
