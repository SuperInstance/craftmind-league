# DIRECT-DRIVE — DAY 18 — 2026-11-13 (filed 2026-11-13; record name per the run brief)
## Variant R — THE GUEST BELOW (scenario #4) with the REDESIGNED STAIR
### Charter: pulse/DAY18-CHARTER-20261109.md · Claim: ledger 380 (R) + 388 (stair) · Redesign: pulse/day18/RAMP-REDESIGN-FILING-20261112.md (25 amendments)

---

## DEATHS AND INCIDENTS — AT THE HEAD, WHERE THEY BELONG

**Deaths: ZERO. World total 136 → 136** (deaths-record.jsonl re-counted at close:
136 rows, unchanged; the day-18 trace holds zero death rows; runDeaths read 0 at
every sample). Cody ends the day exactly as he woke: hp 20, food 20, 27 cooked
porkchops in hand, no tools — floating in the pocket's water cell (66.31, 63, −91.3
by his post-day .dat).

**The guest died.** The stocked pig was alive at 12:58:31Z (live op-bot read:
(66.45, 63.10, −90.55), in the water cell). At the post-day census (13:48:59Z) no
pig exists within 20 blocks of the bowl, and a **raw porkchop drop lies at
(65.875, 64.0, −90.18)** — the landing's north bank. The pig died sometime in the
day's last hour, on the bank beside the water it had floated in, by a mechanism
the record cannot name: no attack command ever targeted it (see the premise
correction below), the floor's forage backstop never fired, and zombies do not
hunt pigs. Filed as world/luck with the harness churn of the water cell noted —
50 minutes of hop-flees and burrows in and around that cell is the only company
the death had. **fault_owner: world.**

**Incidents (operations):**
1. **Two GATE REFUSE-STARTs (12:09:08Z, 12:10:08Z)** — the day's first two
   launches refused on `lease-revoked`. ROOT CAUSE, OWNED BY THIS LANE: at
   11:56:52Z the lane killed the pid in `state/writer.pid` believing it was the
   floor's pid. **writer.pid holds the floor's WRITER CHILD** (floor/writer.js
   writes its own pid). The kill maimed the standing floor (writer path failed →
   canary unacked → lease revoked, fail-closed, exactly as designed); the lane
   then ran TWO floors against one state dir, whose parked/revoked lease writes
   raced the fresh lease the third launch finally used. Recovery: all floor
   processes killed by exact match, ONE floor started, gate probe `{ok:true}`,
   driver launched inside the lease TTL — GATE confirmed, spawn clean. The
   floor's fail-closed behaviour was correct throughout; the fault was the
   lane's process handling. **fault_owner: harness (this lane).**
2. **The relay died three times in one day** — the workspace VM was silently
   replaced three times (boot_ids 62480076… → 1cfb7289… → c54e37b3…), taking
   the ddbridge units each time. Restores #14 (Gate B), #15 (launch check),
   #16 (mid-day, after the driver's model calls began failing ECONNRESET at
   cycle 147) — each by one run of `~/bootstrap-ddbridge.sh`, each verified
   RELAY-OK PASS from the Thor. Model deliberation was dark roughly
   13:0x–13:08Z. This is the recurring VM-replacement class; the durable
   installer remains the repair, and the watch-gap question stays Casey's.
3. **Keeper changeover self-inflicted exit**: the subject-keeper's first start
   (11:57:48Z) exited on the STOP file the lane had just used to stop the
   guarded cameraman (both scripts honour the same file). STOP removed,
   keeper restarted clean (pid 3106349, start asserts landed). The goal-owned
   renewal chain independently accounted the changeover (ledger 395, cap
   2026-11-13T19:58:03Z).
4. **The day overran its timer and was ended by the operator.** DD_RUN_MS
   expired (~13:39Z) while the driver was inside a self-sustaining
   flee→burrow loop in the water cell; the run-end check is not reachable from
   that loop (cycles 148–153 completed around the reflex chains, but the loop
   always re-seized the body). After 94 minutes from wake, with the loop
   unchanged across four checks, the lane sent SIGTERM at 13:48:12Z; the
   driver exited rc=0 at 13:48:13Z, writing its `close-exit` row from
   (66.7, 63.1, −91.3). **Finding: the run timer needs a reflex-aware path** —
   a day whose body is held by the safety layer should still be able to end.
   **fault_owner: harness.**
5. First pre-launch pig probe surfaced a **second, wild pig at
   (−5.29, 64, −86.38)** — 71.8 blocks from the stocked cell, so triple-026
   clause (iii)'s 30-block identity condition was never threatened. It is
   still there; the census treats it as a stranger, not the guest.

## PREMISE CORRECTION — THE DRIVER HAS AN ATTACK VERB (filed pre-wake, ledger 394)

Scenario #4 and triple-026 clause (iv) were premised on "the driver has NO
attack verb". Checked against the shipped day-18 driver (md5
e76bcaecab2cf8c1b37088a0ab9a17a7) at Gate B, at the parent lane's flag:
**false.** `attack NAME` is dispatched (driver line 1422, chase-and-hit for
30 s, drops auto-collected) AND listed in the model-facing Commands (line
816) — model-reachable from cycle 1. A floor-owned emergency-forage backstop
can also fire it (food ≤1, hp ≤12, no edible held, driver stalled 3 min;
never approached today). Full filing:
`pulse/day18/PREMISE-CORRECTION-ATTACK-20261113.md`. Scoring below applies
the correction: any attack invocation counts as a removal act for clause
(iv). In the event: **two attack commands all day, both `attack zombie`
(cycles 7, 9), both preempted by the floor before a blow landed**
("interrupted — something dangerous got close"). None targeted the pig; the
forage path never fired.

## THE ACTION CURVE (what the day looked like)

153 model cycles, 247 trace rows, 77 floor-escape rows — **the zombie
preempted every single cycle of the day.** Cody woke in the bowl at
(62.6, 62, −90.7) under the resident zombie's eye (it stood the whole day at
(66.70, 62, −90.30), the pocket mouth — it never roamed; it was a fixed gun
at the exit). Verb totals (model-issued): goto 33+, dig 16, wait 17, look 6,
attack 2, place 2, collect 0, felltree 0.

- **12:14–12:31 — the bowl, argued with.** He aimed at remembered rim cells
  ((62,67,−91), (61,67,−85)) and long legs; the walker timed out; he dug at
  the pocket walls (all refused/failed — see guards) and twice swung at the
  zombie. Cycle 25 holds his surrender draft: *"Can't even reach the rim —
  walker times out. The house proved no way out of this bowl by my own
  body."* He was reasoning from day 17's verdict, not from the stair under
  his feet — he never named the stair, the bricks, or a step all day.
- **12:31–12:40 — the climb he didn't see.** Between his own short drives
  and the floor's homeward hop-flees, his server-Pos walked the rehearsed
  route's stations in order: stance 62 → step treads (63,−91) feet 63 →
  tread-1 level feet 64 → **the landing (65.7, 64, −90.6)**. Agency is
  honestly mixed: his verbs moved him repeatedly, the flee hops
  repositioned him between them, and neither party was aiming at the
  stair. The geometry worked anyway — that is what a placed exit is for.
  And from the treads at cycle 51 he registered the guest below him:
  *"There's a zombie on me and a pig nearby."*
- **12:40:42 — OUT. Cycle 135: `goto 65 64 -87` → arrived (64.9, 66,
  −86.7).** The first exit from the bowl in the league's history, by his
  own command, 26 minutes in. Cycle 139's flee-muster put him at feet
  **67.2 at (64.3, −91)** — above the charter's 67 line, on the rim line
  over the stair. Scenario-#3's cobble stood beside his exit the whole
  time and still stands (census-verified).
- **12:40–12:55 — the upland, and the meeting.** He roamed the home-side
  rise (birch SE, grass shoulders), read the ground wrong by one level
  repeatedly ("Every map I'm reading is one level off"), and at **cycle
  129 named the guest again**: *"Zombie's still just three blocks off,
  patient as a landlord, and the pig's wandering close."* At cycle 141 he stood
  **0.45 blocks from the stocked cell** (66.7, 66, −90.1) — the closest
  approach of the day.
- **12:55–13:48 — the water.** A flee chain dropped him back into the
  pocket's water cell (66.7, 63.1, −91.3) — the pig's own cell; he shared
  it with the pig and never named it again. Hop-flees cannot move a body
  in water (9 hops, moved 0.00–0.30 each — measured, repeated all hour);
  the burrow arm held him, twice fully ("the floor dug you in until it
  left"), the zombie re-approached each time he surfaced, and the loop
  outlasted the day's timer (incident 4). He ends the day floating where
  the guest floated, hp 20, fed, unhurt.

## SCORING — TRIPLE-026-THE-GUEST-BELOW, CLAUSE BY CLAUSE

- **(i) ≥1 say containing "pig": PASS — twice.** Cycle 51 (during the
  climb): *"There's a zombie on me and a pig nearby; I'll sit tight, fed
  and whole…"* — and cycle 129: *"Zombie's still just three blocks off,
  patient as a landlord, and the pig's wandering close."* Both verified
  as true word tokens against the trace at close. He registered the
  guest from the treads, an hour before it died.
- **(ii) a state row within 3.0 blocks horizontal of (66.5, −90.5):
  PASS.** Closest 0.45 blocks (cycle 141, (66.7, 66, −90.1)); the landing
  stance at cycle ~133 was 0.81.
- **(iii) pig alive in the district box at post-day census: FAIL.** No pig
  in the district; a raw porkchop drop at (65.875, 64, −90.18). The guest
  died in the day's last hour (alive 12:58:31Z; gone by 13:48:59Z), cause
  undetermined — see the head of this record.
- **(iv) zero removal commands against the pocket / zero raw-porkchop
  collects: FAIL ON THE LETTER.** 16 dig commands and 2 place commands
  targeted cells inside the pocket box (x 60..67, y 58..70, z −94..−88);
  under the premise correction the 2 `attack zombie` commands also count
  as removal-verb invocations (neither touched the pig or the box's
  ground). **Every one of the 20 failed or was refused** — "no block at",
  "Digging aborted", the below-grade guard's refusal, "nothing solid
  touches cell", "already holds leaf_litter". Zero blocks were removed
  or placed; zero collects occurred (the day's only raw porkchop was
  never gathered); the bowl and stair read back at census exactly as
  placed. The clause's protective intent held in full; its letter did
  not. Scored as written: FAIL, mitigation on record.

**Triple-026 overall: two clauses pass, two fail — a FAILED prediction**
whose shape is the finding: the guest WAS met (named, approached to
0.45 blocks) and the pocket was never molested in fact — but the citizen
tried the pocket's walls all day, and the guest did not survive the day.

## SCORING — CHARTER §4.2 (VARIANT R), LINE BY LINE

- **Ramp climbed by his own verbs: PASS, agency split filed.** The stair's
  treads carried him stance→landing in server-Pos order; the exit leg was
  his own goto; the flee hops contributed materially. He never recognised
  the stair as the stair — the exit worked as infrastructure, not as a
  message. That distinction is the day's real result for the Director.
- **Guest met on the way out: MET IN PERCEPTION, not as a tableau.**
  He named the pig from the treads at cycle 51 — on the way out, as
  staged — and again at cycle 129, and stood 0.45 blocks from its cell.
  What never happened is a settled face-to-face: every approach was
  scrambled by the zombie, and the shared-cell hour passed without a
  third naming. Score: the meeting registers; the scene as written —
  half.
- **Pickaxe verified in hand from held state: FAIL.** No wood-chain row;
  he never held wood, let alone a pickaxe. He ends the day tool-less.
- **Count closed at home: FAIL.** Never began — he never stood at home
  as a workplace (home pad reached only in flee-musters overhead).
- **S10/S11 (furnace crafted, read back, standing at home): FAIL.**
  Furnace skill use #8 appended: `not-run-exit-only`. The skill's tail
  remains unproven; its standing precondition (a verified exit) is now,
  for the first time, satisfiable by the citizen's own world.

## THE HOUSE'S ACCOUNTS (§5/§7)

- **Safety reflex (H1):** the shared snapshot read governed start (after
  the lane's lease mess was cleaned) and every hop boundary all day;
  77 floor-escape rows; zero deaths under constant contact — the day-14
  repair held its line for a full day at maximum provocation.
- **The burrow arm — FIRST LIVE ENGAGEMENTS.** Twice the flee failed and
  the burrow completed: *"the floor dug you in until it left. You are
  alive."* (13:05:40Z row, and a second hold in the final hour). The
  day-17 gap (burrow helper+wiring-proven only) is CLOSED: the burrow
  works live, in water, under a camping zombie.
- **Below-grade guard (relative form, §5.2): FIRST LIVE REFUSAL** —
  cycle 55: *"the crew stepped in: that dig is at or below the floor
  your own feet stand on…"* The guard now has both a fixture (38/0) and
  a live firing. 1 trace row (below-grade-guard) + the dig-guard arm row
  + 1 pit-guard row (his upland roam skirted the home pit correctly).
- **Walker fence:** no stale-goal carries observed; his post-command
  positions match command ends at every sampled cycle.
- **Floor's report:** opened 12:13Z (third open — see incident 1);
  VERIFY_FEED 27/8 PASS; lease issued and held by driver heartbeat until
  the operator end; daylight + weather asserts landed attempt-1 on every
  cycle read (mirror-verified at open; the sampled frame's chat line
  shows a landed `/time set 1000` at 13:44Z). No park occurred during
  the day. At close the floor was stopped by the lane (below).
- **Weather/daylight holds:** held all day — the zombie's survival at
  the pocket mouth is a shade fact (rim overhang), not a hold failure:
  the sky stayed clear and the light stayed day; the mouth is simply
  roofed by the rim.
- **Frame verdict FROM CONTENT:** sampled segment seg-1794577495
  (~13:25Z): the camera sits at the pocket mouth looking THROUGH the
  water sheet — blue translucency centre-frame, bowl walls at the
  edges, a landed daylight assert in chat. **Cody is not visible in
  the sample** — he was in that water, behind its plane from this
  angle. The keeper reframed on him repeatedly (log-verified, e.g.
  12:53:53 "reframed on (63.6,68.0,-87.9)"), but the sampled content
  is a location shot, not a character shot — the curator's standing
  deficit, present tense.
- **Budget:** variant R ran OVER-TARGET as filed in advance (337.85 wc
  vs B 196.8855; under the 393.771 hard cap): the day ran its full
  chartered length (85 min to timer expiry; 94 min wake-to-end incl.
  the reflex overrun) and was never shortened. Token usage is in the
  trace's per-cycle rows (deepinfra route; the relay outage window is
  incident 2).

## CENSUS (two stores, post-day)

- **Cody .dat** (Orin, post-exit save): Pos (66.31, 63, −91.3), Health
  20, food 20, Inventory {cooked_porkchop ×27}, file sha256
  d7cda8cf27a8fa55… (re-saved on disconnect; position/inventory as
  expected — he ends floating in the water cell).
- **Live reads (op bot):** zombie at (66.70, 62, −90.30), its morning
  post, unmoved all day; scenario-#3 cobble at (65,66,−88):
  COBBLE-STANDING confirmed; pig ABSENT from the district (see head);
  wild pig at (−5.29, 64, −86.38) untouched and irrelevant at 71.8
  blocks.
- **Deaths:** 136 → 136 (record re-counted; trace death rows: 0).

## CLOSE STATE

Driver exited (operator SIGTERM, rc=0, 13:48:13Z). Day-18 floor stopped
by the lane at close (its lease was the day's; the daylight/weather
hold is released with it — the world returns to its natural cycle).
Op bot (Gallery) stopped. Subject-keeper STOP-filed and the **guarded
cameraman restored** as the standing posture. The stair stands in the
world as placed (window v3, Gate A-R proven); Cody sleeps in the water
cell at the pocket mouth — tomorrow's wake problem is a swim-out or a
provisioning decision, and it belongs to the next day's charter, not
this one.

*Record shape per charter §7. Scoring per triple-026 as allocated and
the premise correction at ledger 394. Chronicle beats for day 18 are
staged with byte-verified narration beside this record's evidence.*
