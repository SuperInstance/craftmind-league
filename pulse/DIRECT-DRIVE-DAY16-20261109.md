# DIRECT-DRIVE DAY 16 — THE GUARD HELD THE GATE SHUT WITH HIM INSIDE IT (2026-11-10)

*The day-16 lane's record. Charter: `pulse/DAY16-CHARTER-20261109.md`
(md5 `a35013b1…`). Cody ran **328 commands across 237 model cycles,
09:41:36Z→11:06:26Z** (the full chartered 85 minutes; driver exit
rc=0 at window end; the trace's cycle counter runs ahead of the
cycle-row count because reflex-interrupted cycles consume numbers
without writing cycle rows — the same accounting as days 14–15).
**Deaths in the run: ZERO — deaths 136 → 136**, derived three
ways (trace count 0; the driver's own end row `deathsWorld: 136`;
`deriveDeaths` over the record + all 15 traces = 135 + the
documented provisioning seam #136). hp never left 20 in any cycle
row; food 18–20. Furnace: **NO — sixth consecutive day without
S10/S11** (the asset's seventh use). The day's shape, stated
plainly: the charter's new below-grade guard did exactly what it
was built to do — and the bowl exit it was built around did not
exist. He never left the bowl. The wood chain never started. The
count never started. What the day measured instead is the guard's
own completeness: **69 refusals** (50 goto, 19 dig), every one of
them correct against the filed rule, and the exit problem is now
proven to be a MOVEMENT problem, not a discipline problem — see
§2 and incident H1.*

## Incidents (headed, none buried)

- **H1 (HEAD, harness + charter — the day's finding): THE EXIT
  DID NOT EXIST, AND THE GUARD CLOSED THE SEARCH SPACE AROUND
  THE HOLE.** The charter's exit plan rested on the census read
  "east (62, −91) carries a buried step at y66 under a top at 66
  — one +1 step from the band's edge onto pad level." That read
  was WRONG in the way that mattered: the (62, −91) column's top
  y66 is real, but there is **no stance at the bowl floor from
  which it is a +1 step** — his measured positions all day were
  the pocket floor (feet 61–62, under the pad's grass cap at y67;
  cycle 1's goto reported him at feet 63.2 mid-climb-attempt,
  3.8 below the target). Every face out of the pocket is +4/+5
  from where his feet actually stand. The one-step limit (the
  extraction investigation's ONE-RUNG LAW) therefore barred every
  walk out, exactly as it barred day 15's. The charter's spare
  key — dig ONE dirt block bare-handed from the bowl's rim wall,
  place it as a rung — was ALSO closed, by the charter's own
  guard: the rim's dirt stands at (61, 65..66, −90) and
  (60, 65..66, −91), i.e. block tops at 66 and 65 — the (60, −91)
  dirt at y65 (top 66) was diggable under the guard; the dirt he
  actually reached for first (cycle 2: dig (61, 63, −90), a stone
  band block, top 64) was refused, correctly, as below-grade —
  and by the time his search reached permitted dirt he had
  exactly one successful place all day (cycle 48: dirt at
  (62, 65, −89) — placed one level too high to step onto from
  feet 61, the day-15 error repeated verbatim: a tread at top 66
  from feet 61 is a +5 face, not a rung). **The deeper defect is
  the guard's goto bound applied to a citizen who STARTS below
  it:** the guard refuses by TARGET level, so from inside the
  bowl every short hop to a mid-level cell (feet 62–65 — the
  only cells a one-step climb could ever use as stairs) was
  refused as "below pad," leaving only pad-level targets the
  walker cannot climb to. The guard was designed against day
  15's ENTRY (a citizen at pad level stepping down) and is
  correct there; applied to a citizen who WAKES below the bound,
  it converts the bowl from a trap he might climb out of into a
  cell whose every intermediate stair is locked. fault_owner:
  **harness** (the guard's bound is target-absolute; the exit it
  needed to permit is a RELATIVE climb) + **charter** (the census
  step-read was taken as an exit without a stance check — the
  exit was never rehearsed on a throwaway body, the day-15
  rehearsal lesson applied to geometry but not to this plan).
  The named prevention for day 17 is §7.
- **H2 (harness): THE HOSTILE LAYER FOUND THE BOWL.** Held
  daylight did not keep the bowl safe: from ~10:12Z the reflex
  layer fired **89 floor-escape flees** (density blocks 4–8:
  flee 7/30/21/12/17) against creepers and skeletons at the rim
  (his says name a creeper at 23, then 19, then 12 blocks; the
  keeper's frames show a skeleton standing at the rim at
  ~10:20Z). The flees' hop-chains target pad-level points and
  cannot climb the faces either (hop logs: `moved=0.00–0.97`),
  so the reflex layer spent the day hopping him around the
  pocket floor — protective in intent (he took NO damage: hp 20
  in every cycle row; the hostiles never got a shot that landed)
  but it consumed the back half of the day: of 328 commands,
  the final ~90 cycles are flee-dominated, and at least three of
  his own dig attempts were aborted mid-swing by flee pre-empts
  (his cycle-184 say: "My hands won't finish a swing while
  something's on me"). Why hostiles at all under a held morning
  is the day-13/14 lesson recurring in a new place: the bowl and
  its canopy are a gloom pocket — the census's own tops grid
  shows canopy over the whole home approach — and gloom spawns
  at noon. The charter priced weather (§6 of the charter) but
  not gloom-at-home. fault_owner: **world** (the bowl is a
  spawnable gloom cell at home's edge) + **harness** contributing
  (the flee's targets are unreachable from the pocket, so the
  reflex burns cycles without gaining safety margin it can keep).
- **G1 (lane, minor): the frame-stills sampling is thinner than
  the charter's ≥9.** Six stills were read by eye (plus three
  pre-day posture stills), not nine: the Orin's capture retains
  ~2 hours of segments and the sampling ran after close; two
  target epochs had already been pruned/missed. The hygiene
  counts in §6 are over 6 frames and say so. The verdict's
  direction is not in doubt (the panel/receipt zero is consistent
  across all six + the three pre-day stills), but the sample is
  the sample. fault_owner: **harness** (this lane's sampling
  timing; the fix is to sample DURING the day, as the keeper
  §6.5 check intends).

## The action curve first

Blocks of ~10 minutes from the 09:41Z wake (acts = model
commands from the trace's density rows; reflex acts separate):

| Block | Acts | Shape |
|---|---|---|
| 1 (09:41–51) | 38 — goto 26, dig 7, climb 3, felltree 1, look 1 | **THE EXIT ATTEMPT**: cycle 1's goto (63, 67, −91) NOT arrived — he stands at feet 63.2 mid-face, 3.8 below target; cycle 2's dig refused by the new guard (first refusal, 09:41:58Z); the hour's pattern sets in within five cycles: aim at pad level (permitted, unclimbable) or aim at a stair (refused) |
| 2 (09:51–10:01) | 35 — goto 20, dig 11, place 1, collect 1, climb 1, look 1 | Bowl search: digs at permitted levels, the first dirt gathered; he reads the guard's logic correctly in his own words ("The guard reads my target's height, not my feet") |
| 3 (10:01–12) | 60 — goto 23, dig 14, place 15, climb 2, wait 5, look 1 | The densest block: place attempts ×15 (the rung search — **one success**, cycle 48: dirt at (62, 65, −89), too high to use from feet 61); positions y61–62 throughout |
| 4 (10:12–23) | 31 + flee 7 | Hostiles arrive at the rim; the reflex layer wakes; his says track the creeper's approach (23 → 19) |
| 5 (10:23–33) | 58 + flee 30 | Flee-dominated; **model-fail ×2 at cycles 206/208 → FAILOVER to governor:qwen3-coder-30b** (trace-rowed per the day-5 rule), which works the same exit problem for the rest of the day (60 priced cycles of 237 cycle rows) |
| 6 (10:33–45) | 42 + flee 21 | The fallback brain tries the day-13 method by name ("create a step up using the dirt wall of the bowl") — the permitted digs land, the climbs do not |
| 7 (10:45–56) | 24 + flee 12 | Pit-guard refusals accumulate (he keeps proposing the pit route under flee pressure; 8 total) |
| 8 (10:56–11:06) | 34 + flee 17 | Window ends with him in the bowl at (62.6, 62, −90.7), hp 20, food 20, 27 porkchops held |

**Verb totals (attempts, from the density rows): goto 139,
dig 52, place 17, climb 8, wait 12, look 4, felltree 1,
collect 2, craft 0, eat 0 (by command).** The successes that
matter: place 1 (cycle 48), collect 2/2, climb 0/8 (the verb
stays broken-by-construction and was never the plan). **Zero
craft commands all day** — the wood chain never began, because
its first precondition (stand on the pad) never held. His
lateral movement was real (x 60.5..63.6, z −91.7..−89.3 across
the pocket and the south band) and his food held (he ate from
the reflex/state layer: 29 → 27 porkchops, food never below 18).
**Zero-act blocks: NONE** (no STALL; every block ≥ 24 acts).

## 1. Deaths

**136 → 136. Run deaths: ZERO** — the second consecutive
zero-death run day (day 15's run was the first). Under 89 flee
pre-empts and rim hostiles at 12 blocks, the reflex layer and
the daylight hold did the one job that outranks the furnace:
nobody died in a hole the house put a guard around. The count
is derived, not asserted: trace death rows 0; driver end row
`deathsWorld: 136`; `deriveDeaths` over the deaths record + all
15 traces = 135, +1 for day-15's provisioning death #136 (the
documented seam, `pulse/day15/provisioning-evidence.jsonl`) =
136. Baseline at Gate B was re-derived the same way before the
claim.
## 2. The bowl exit — mechanism and cycles

**The exit never happened. Cycles spent on it: the whole day
(237 cycles; every cycle's work was exit work or flee work).**
Mechanism accounting, against the charter's two named forms:

- **The east step (charter form 1): FAILED, and the failure is
  geometric, not behavioural.** Cycle 1's `goto 63 67 -91`
  returned NOT arrived with him at (61.7, 63.2, −91.3) — the
  walker pressed him against the face and stopped 3.8 below the
  target. Every subsequent pad-level goto repeated it (positions
  cycle over cycle: feet 61–62, occasional 62.9/63.2 transients
  mid-face). The census step at (62, −91) exists as a COLUMN; as
  a STEP it requires a stance at feet 66 within one block, and
  no such stance exists on the pocket floor. The charter's
  census read conflated "a column whose top is 66" with "a +1
  step from the floor" — the floor is at 60–61, not 65. H1
  carries the fault.
- **The placed rung (charter form 2): ONE placement, unusable.**
  Cycle 48 placed his dirt at (62, 65, −89) — a tread whose top
  (66) stands +5 over his feet (61). Placing a rung AT his level
  (into the cell at his feet, the day-13 form) was attempted
  across block 3's 15 place commands; the place verb needs a
  supporting face and the pocket's geometry gave it exactly one
  landing, at the wrong height. He gathered the dirt legally —
  the permitted digs (tops ≥ 65) are the guard working as filed.
- **The guard's part**: 69 refusals — and the honest read is
  double-edged. Every refusal was CORRECT against the rule as
  filed (no descent was permitted, none happened: his floor
  never went below y60's top — the post-day census reads the
  bowl floor cell (61, 60, −91) = stone, UNCHANGED from the
  morning census; day 15's stepwise sinking 63→61 did not
  recur). But the rule's goto arm, applied from BELOW the bound,
  refused the mid-level targets (feet 62–65) that are the only
  possible stairs — e.g. cycle ~5: `goto 62 65 -91` refused
  ("goto-below-pad") from feet 62, a +3 climb target that is
  itself unreachable, but the refusal class also covers the +1
  targets at feet 62/63 from the pocket's low cells, which are
  the rungs a real staircase would use. §7 names the repair.
- **The south passage** (the census's "passage, not a climb")
  was walked repeatedly (z −89 band, y61–62) and gained him
  lateral room and the dirt — and no height that held: "up to
  62 then slid back" (cycle 202). The band's rises (tops 66–67
  at z −92 east) are across the pit columns from the pocket,
  and the pit-guard (8 refusals, all correct) kept him out of
  the one shortcut that would have drowned him on day 9.

**Close state (post-day `.dat`, sha `13702eb7…`):** he sleeps at
(62.56, 62, −90.69) — still in the pocket, ~1.5 blocks east of
his wake cell — hp 20.0, food 20, inventory {cooked_porkchop:
27}. Nothing was lost; nothing was gained but information.

## 3. The wood chain — never started; the verification that never fired

The `wood-chain-verified` trace row **does not exist** for day
16: no cycle ever read a pickaxe in hand, because no cycle ever
stood on the pad. The held-state read itself ran all day (the
guard's live re-read is the same instrument; it correctly read
"no pickaxe" 237 times). **The pickaxe cycle the charter asked
this record to report is: NONE — never verified, because never
held, because never out of the bowl.** The named oak at
(62, −87) stands untouched (post-day census: the home chunks'
palettes are unchanged in every particular this record checked;
his one felltree attempt, cycle-block 1, was aimed from inside
the bowl at a trunk he could not reach).

## 4. Furnace — NO (both stores)

- **Store 1 (post-day `.dat`, sha `13702eb7…`, read after his
  clean quit):** inventory {cooked_porkchop: 27} — no furnace,
  no cobblestone, no wood, no pickaxe.
- **Store 2 (fresh post-day region parse,
  `director/census-d16-postday/`, region md5 `124d152a…`):**
  **zero** furnace palette entries across the 64 home chunks.
  Cross-checks: his crafting table still stands at (64, 67, −94);
  scenario #3's cobblestone still stands at (65, 66, −88) —
  unperceived for a fourth day, and day 16 adds the reason the
  others lacked: he was never within sight of it.

S10/S11 were not attempted. The rotating-blocker series
(salience S4) gains its sixth entry, and it is NOT a repeat:
food → pocket/deaths → crown targeting → wall → provisioning →
exit target → **exit geometry under a guard that sealed the
search space (H1)**. The blocker was, for the first time, a
house instrument itself.

## 5. The guards' and reflexes' live accounts

- **BELOW-GRADE GUARD (new; first live day): 69 refusals**
  (50 `goto-below-pad`, 19 `dig-below-pad`), first 09:41:58Z
  (cycle 2), last 11:06:24Z (inside the final minute). Armed
  the entire day (never disarmed — the disarm condition, a held
  pickaxe, never occurred). Its prevention account is REAL:
  zero below-grade descent all day (his floor never sank; the
  bowl's floor cell is byte-identical stone at close). Its
  overreach account is H1: the same rows include refusals of
  mid-level stair targets from below the bound. Both halves are
  the record; neither is rounded.
- **DIG-GUARD (R1/R2): ZERO live rows — third day owed, third
  day silent.** It never armed: arming requires a stone-phase
  entry (a first permitted stone dig), and no stone dig was ever
  permitted to reach it — the below-grade guard refused the
  deep ones and the shallow ones were dirt/grass. The debt is
  now structural, not incidental: while the below-grade guard
  stands in front of it, the dig-guard can only arm on days he
  already holds a pickaxe — i.e. precisely the days it was
  designed for (the count at home). Disposition §8 of the
  amendment note: CARRIED, and the arming path is now understood
  to run THROUGH the pickaxe gate.
- **WALKER FENCE: 0 rows.** No stale goal ever outlived a
  command boundary — displacement during stationary verbs: NONE
  observed (his position changes all trace to gotos, places and
  flee hops). The day-14 I4 invariant held a third day, unfired
  and unforced. Verdict unchanged: shipped, fixture-proven
  18/18, live-unfired.
- **PIT-GUARD: 8 refusals** (re-aims to (62, 67, −92)), all
  under flee pressure in the day's back half — the fallback
  brain and the flee logic both kept proposing the pit route,
  and the guard kept refusing it. Plausibly death-preventing,
  as day 15 read its 13.
- **REFLEX LAYER: 89 floor-escape flees** (end-row floor tally
  {flee: 89, shelter: 0, eat: 0, forage: 0}); **BURROW NEVER
  ENGAGED — the repair gap stands a FOURTH day, not rounded
  up.** hp stayed 20 in every cycle row despite rim hostiles:
  the flees kept range, the daylight hold kept the wider
  district safe, and the bowl's gloom (H2) is a spawn risk the
  house has now measured twice (day 15's frames, day 16's
  flees) without yet pricing into a charter.
- **SAFETY READING PATH:** no park, no abort, no gate event all
  day — correct: no death occurred and the lease never faulted.
  The battery that proves the path (40/40 incl. the day-13
  burst replay) was re-run against the shipped day-16 bytes at
  Gate B (§9 of the charter); the live arm remains day 14's
  proof.

## 6. Frame verdict — FROM CONTENT (6 frames read by eye)

Sampled at ~10-minute cadence across the day from the Orin
capture segments (frames at ~09:52Z, ~10:02Z, ~10:12Z, ~10:22Z,
~10:32Z, ~10:52Z; stills filed in `pulse/day16/stills/`), plus
the three pre-day posture stills. Counts vs the day-15 baseline
(9 frames: visible 1 + 1 partial; chunk voids 2; receipt text 2
incl. one full chat panel; canopy 3; surface-without-him 3):

| Defect | Day 15 | Day 16 (6 frames) |
|---|---|---|
| Cody fully visible | 1/9 | **2/6** (09:52Z in the bowl, clearly; ~10:12Z face-on in the bowl) |
| Cody partial | 1/9 | 0/6 |
| Chunk voids | 2/9 | **1/6** (09:52Z: unrendered wedges at the frame edges) |
| Receipt text | 2/9 | **0/6** |
| FULL CHAT PANEL | 1/9 | **0/6** |
| Canopy occlusion | 3/9 | 2/6 (10:32Z full-canopy frame; 10:52Z canopy-edge) |
| Surface without him | 3/9 | 2/6 (10:02Z, 10:22Z — both framed ON the bowl from above; he is in the cell below the frame's centre, occluded by its rim) |

**The hygiene finding the workstream was chartered to produce:**
the receipt-text and chat-panel defects did NOT recur — 0/9
across the day's six frames and the pre-day three. Combined with
the pre-day evidence (the standing posture produces clean
frames), the day-15 panel frame now reads as what it was: a
TRANSIENT client state (a chat panel opened over the client
during that day's traffic — the panel is a UI state, not a
capture product), not a standing defect of the chain. No fix was
applied and none is claimed: **no client-side change was made,
chatVisibility:1 untouched, the clean-frame toggle still OFF.**
The remaining frame problem is the old one, unchanged: the
camera looks AT the bowl and loses him to its rim and the
canopy — an aim/occlusion problem, not a hygiene problem.
Keeper's own log for the day: SUBJECT-KEEP ×2, SUBJECT-HOLD
×22, STALL ×49 — the keeper held its last frame for long
stretches because he never moved > 3 blocks in open view; it
tracked the position it was given. Aim and content reported as
different facts, per the charter: the keeper did its job; the
bowl hid the citizen.

**Weather in frame (the §6 read): RAIN.** Two of the six frames
(~10:12Z, ~10:22Z) show rain falling and a darkened sky over the
home district. The chartered act was issued ONCE at Gate B
(09:40:24Z) and verified landed — and rain still came inside
the window. `/weather clear` without a duration is a moment,
not a hold; the act as chartered does not hold weather, and the
record says so rather than crediting the clear frames to it.
The gloom H2 names is consistent with these frames.

## 7. The named prevention for day 17 (pre-registered, as day 15's §6 named this day)

1. **THE GUARD'S BOUND MUST BE RELATIVE TO THE CITIZEN, NOT
   ABSOLUTE TO THE PAD, WHEN HE STARTS BELOW IT.** Form: while
   tool-less AND below pad level, the goto arm refuses only
   targets BELOW HIS CURRENT FEET (no descent), and permits any
   target at/above them (the climb is the walker's problem, and
   +1 stairs become legal to attempt); the dig arm likewise
   keys on his stance (never dig the cell he stands on or below
   his feet). At/above pad level, today's absolute bound applies
   unchanged — day 15's entry stays refused. Fixture first,
   including a from-inside-the-bowl group (the group today's
   battery lacked: every fixture stance stood ON the pad).
2. **REHEARSE THE EXIT ON A THROWAWAY BODY before the day**
   (the day-15 rehearsal lesson, applied to the exit itself):
   the exact wake cell, the exact guard, the named mechanism —
   proven 3/3 on prov-scratch before Cody is woken, or the day
   is not chartered around it.
3. **THE RUNG MUST BE PLACEABLE AT HIS FEET.** If the rehearsal
   shows the place verb cannot land a tread at feet level in
   the pocket's geometry, the exit is a DIFFERENT chartered
   mechanism (e.g. dig the permitted rim dirt FIRST, from the
   wake, before any goto — material in hand changes every later
   verb) — sequenced by the rehearsal's evidence, not by hope.
4. **PRICE THE GLOOM.** The bowl/canopy cell spawns under held
   daylight; a day that starts there charters the flee cost (or
   clears the canopy cell's light problem as a named world act)
   instead of discovering it at cycle ~90.

## 8. Floor report

Contract `floor/run/day16/contract-day16.json`, sha
`166afff1…` (pins `launch_window_s: 300`,
`daylight_verify_window_s: 5` — verified in the filed contract).
VERIFY_FEED: **PASS on first read** (need 8, have 29, from the
fresh pre-wake snapshot — no provisioning window, §7 of the
charter not triggered). LEASE_ISSUE 09:41:06Z, born in state
`launch` (the day-11 repair's form). ASSERT_DAYLIGHT: **22
rows**, every 240 s from 09:41:11Z, attempt-1 landings verified
against the verbatim mirror (the last at 11:05:11Z, inside the
window). No PARK, no revoke, no operator alert all day; at
driver exit (11:06:30Z) the lease stood `live`, unexpired in
form, and the floor was stood down by the lane at close
(heartbeat-loss would have parked it ~90 s later, the day-15
pattern). The driver's start log printed `GATE: live lease
confirmed at start` (09:41:21Z) — the H1 Gate B line's live
half, satisfied.

**Gate B, as run** (charter §9, in sequence): ledger claim
FIRST (line 355, verified exactly once) → relay RELAY-OK from
Thor at check AND at launch (found DOWN at pre-check — its
ELEVENTH death, both VM supervisors dead, no systemd units on
the serving instance — relaunched via the setsid supervisors;
the fact is filed here and in the claim) → saves byte-identical
(Cody sha `1b6922ba…` == day-15 close) → baseline 136 re-derived
(135 + the seam) → wake snapshot fresh (29 held, 20/20, in the
bowl) → census filed → op ping PASS + test park-notify
receipted → **weather act issued 09:40:24Z by Gallery,
verified LANDED issuer-specifically** (`Gallery issued server
command: /weather clear` + `[Gallery: Set the weather to
clear]` in the Orin log) → batteries vs shipped md5
`9f87c876…`: safety **40/40**, below-grade **20/20**, walker
fence **18/18**, dig-guard **28/28** → keeper changeover
BEFORE spawn (old cameraman STOP-stopped 09:40:36Z with Cody
offline; activated file md5 `3551b50d…` hashed on the Orin
before it ran; keeper live 09:40:38Z, refresh OFF, floor sole
asserter; Thor↔Orin skew measured ~0.2 s at the repeated
same-second reads — under the 5 s bound) → trace pre-created →
floor open (VERIFY_FEED first-read PASS; lease `launch`) →
NOTHING between floor-open and launch → driver start gate
printed the line. No Gate B incident this day: no refuse-start,
no re-open. Day 15's G1/G2 classes did not recur.

## 9. Budget

**237 cycle rows = 2.788 wc/min** (328 commands incl. reflex-free
model acts; the call rate is the metered quantity) — UNDER the
3.976 ceiling. Trace-metered cost **$0.0839** over the DeepInfra
cycles; the 60 governor cycles after the cycle-210 failover are
accounted at the standing caveat (the governor's per-call dollar
accounting is historically understated — the dollar figure is a
floor; the RATE is exact). Failover ×1 (model-fail at cycles
206 + 208 → governor:qwen3-coder-30b from cycle 210,
trace-rowed per the day-5 rule). B ≈ 338 wc for the window;
spent 237.

## 10. Close

Driver exited rc=0 at window end (11:06:30Z); Cody disconnected
cleanly and sleeps at (62.56, 62, −90.69) — in the bowl, fed
(27 porkchops), whole (hp 20.0). Posture restored and verified:
keeper STOP-stopped with Cody offline (its log's last line:
STOP at 11:07:12Z, final SUBJECT-HOLD on his close position);
the original `cameraman.py` (md5 `27aaa066…`) relaunched
detached (pid 2209183) with refresh ON, and its start assertion
**VERIFIED LANDED** in its own log at 11:07:16Z ("DAYLIGHT /time
set 1000 (start) — VERIFIED LANDED in server log"); floor stood
down by the lane after its clean day; op bot quit receipted
(`{"ok":true,"bye":true}` 11:07:30Z); mirror loop stopped.
Skill: the SEVENTH `uses[]` entry appended to
`skills/furnace-sequence.v1.json` (append-only; the array now
holds 6 entries — days 11–16; day 10's never appended, as
filed); S7.0 + below-grade dispositions updated append-only in
`skills/furnace-sequence-EXTRACTION-AMENDMENT-20261109.md`.
Ledger close line appended via `ledger-append.py` ONLY and
verified exactly once.

*fault_owner summary: the day — **harness** (H1's guard bound +
the un-rehearsed exit) with **world** contributing (H2's gloom
cell) and the **charter** sharing H1 (a census read taken as an
exit). The citizen: no fault found — he diagnosed the guard's
logic correctly in his own words by cycle ~38, attempted every
mechanism the house has ever proven, and kept his food, his
health and his count of the situation for 85 minutes in a cell
the house locked from the outside.*
