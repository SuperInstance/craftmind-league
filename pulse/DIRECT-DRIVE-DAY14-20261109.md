# DIRECT-DRIVE DAY 14 — 2026-11-09 (AKST) — THE DAY THE STOP RULE CAME HOME

Charter: `pulse/DAY14-CHARTER-20261109.md`. Lane: day-14. Ledger claim
line 350. Run window (UTC): spawn 2026-11-10T06:57:13.938Z → reflex
abort 07:08:06.253Z → driver exit 07:08:10Z rc=0. The chartered 85
minutes ran 10 minutes 53 seconds: the day ended on its own stop rule,
read live by the repaired reflex layer — the first day in the line's
history where the 3-death rule stopped the body itself, in the same
cycle, mid-flee, with no hand on the stop button.

## INCIDENTS — AT THE HEAD, AS ALWAYS

**I1 (WORLD, deaths 133–135).** Three Zombie deaths: at the login
hilltop during cycle 1's first goto; in the pocket east of home during
cycle 29's craft; mid-flee after the respawn. The respawn country and
the pocket are both canopy shade; the rain the charter named returned
mid-day (frames at 07:06–07:08Z show heavy rain) and the day-13
rain-gloom mechanism repeated at two new addresses. Full account in
the deaths section. fault_owner: world — with the charter's own
premise correction at I3 as the harness share.

**I2 (HARNESS, Gate B refuse-start, recovered).** The first driver
launch was refused at 06:55:55.418Z, `gate-refuse-start`
reason `lease-expired`: the floor issued the lease at 06:54:50.985Z
with a 60 s TTL, and the lane's own verifier-start and relay re-check
steps sat between floor-open and launch, so the driver's start-gate
read landed 4.4 s past expiry. The refusal was correct behaviour.
The refused attempt's heartbeat flipped the lease to `live` and the
floor renewed it; the relaunch passed the gate (`GATE: live lease
confirmed at start`) and the day ran. Cody was untouched by attempt 1
(refusal is pre-spawn; his save was still the provisioned snapshot,
sha 738fb143…). Same class as day-13 G1, second form: the operative
discipline is that the start-gate read must land inside the TTL or
after a heartbeat has flipped the lease live — verification steps
belong BEFORE the floor opens, not between open and launch.

**I3 (HARNESS/CHARTER, premise correction — the respawn is not the
login point).** The charter's verified wake facts named the respawn
as (36.5, 73, −86.5), read from his `.dat` Pos. That is his LOGIN
position (where day 13's hand-stop left the body). Where a death
returns him is somewhere else: a SCATTER across the tree country
(29–38, 67–76, −103..−107), ~19–28 blocks south-west of the
hilltop — day 14's three landings read (37.5, 68, −105.3),
(29.5, 75, −104.5), and the (27.9, 69, −104.0) country after the
third. Every charter element premised on "he wakes
at the hilltop" was true only of the login; after any death the day
restarts a country away from both the hilltop and home, and drops
from a hilltop death are a country away from the body that might
recover them. Future charters must establish the respawn point
independently (world spawn / bed mechanics), never from the `.dat`
Pos. The day-13 record's "respawn (36.5,73,−86.5)" phrasing carries
the same conflation and should be read with this correction.

**I4 (HARNESS, the walker does not stop when the command ends).**
Between cycle 10 (07:01:36Z, at (50.4, 68, −109.9)) and cycle 11
(07:02:05Z, at (76.6, 64.8, −99.5)) the body moved ~26 blocks east
with NO movement command in either cycle's row — both cycles were
crafts. A pathfinder goal from an earlier cycle kept the body moving
through the craft cycles and set him down in the pocket east of
home. The citizen named it himself at cycle 12: "Well — the walker
carried me right into the dip while I was crafting." Which stale
goal it was is not derivable from the trace; the displacement and
its absence from the command record are. The movement tax has a new
member: displacement with no command at all.

**I5 (CAPTURE, the lane's own misread, corrected in this record).**
The lane's first frame sampling read the keeper's 07:04 STALL shot
at (77.6, 64.6, −98.3) as a stale position. It was not: the full
position track (pulled for this record) puts Cody in that pocket
from cycle 11 to his death there at cycle 29. The keeper tracked
him correctly all day; the frame verdict below is written on the
corrected track. Filed because the error was the lane's, and the
record is where it gets corrected.

## THE ACTION CURVE — FIRST, PER THE STANDING RULE

32 cycle rows (cycles 1–30, 32, 34; cycles 31 and 33 were
interrupted by deaths mid-execution and wrote no cycle row; cycle 35
is the abort cycle, density-final only). ~10-minute blocks:

| Block (UTC) | Cycle rows | Acts (density sub-acts) | Shape |
|---|---|---|---|
| 06:57–07:07 | 30 (c1–c30) | goto 14, felltree 5, craft 4, dig 4, climb 2, collect 1, place 1 | Death 1 at 0:26; tree work at the respawn country; the walker's silent carry east; the pickaxe crafted in the pocket; 3.5 minutes fighting the pocket; death 2 at 9:01 |
| 07:07–07:08 | 2 (c32, c34) + abort cycle | goto 1, felltree 1 (+ flee 3 engagements, floor rows) | Respawn country again; death 3 mid-flee; the park read at flee-hop-2; the day stops inside the cycle |

Verbs (attempts / ok, cycle rows): **goto 15/1, felltree 5/2,
craft 4/3, dig 4/3, climb 2/0, collect 1/1, place 1/0.** Reflex acts
counted separately, as always: 3 flee engagements (below). hp 20 at
every completed cycle row except the death rows; food 20 throughout
(he never ate; hunger never fell — the day was too short and too
violent for hunger to matter).

The day in his own words, compressed: cycle 1 — "my pack's full of
pork. Home's east… Wood first"; cycle 2, post-respawn — "Woke up a
different place and empty-handed"; cycle 10 — "Five oak logs in
hand — that's the keystone I've been chasing for days"; cycle 12 —
"the walker carried me right into the dip while I was crafting";
cycle 13, holding the wooden pickaxe in the pocket — "I'm sitting
in the dip where I died four times. I won't dig here"; cycle 29 —
"Pillar won't place either — this pocket's got me proper, same as
yesterday"; cycle 30 — "Dead again in the pocket. But look at
this — I wake up in the trees"; cycle 34, naming a skeleton in the
country — the last full sentence the day got.

## FURNACE: NO

S10/S11 were never attempted — for the fourth consecutive day the
tail is unproven, and for the second consecutive day the cause is
that the day was lost before the count could start: no cobblestone
was ever held on day 14, at any address. Both stores, per the
promotion rule:

- **Parsed .dat** (post-day snapshot, `floor/run/day14/
  postday-snapshot.json`, save sha d91fb084…): inventory EMPTY —
  his tree-work goods (5 oak logs' worth of planks, sticks, the
  wooden pickaxe) dropped at the pocket on death 2 and at the
  respawn country on death 3, never recovered.
- **Fresh region read** (lane scanner over the post-day copy of
  r.0.-1, md5 54b03780…, 64 chunks — the only region day 14
  touched): ZERO furnace palette hits anywhere. Home cells
  verified unchanged: crafting table standing at (64, 67, −94),
  his placed step (63, 67, −94) oak_planks, pad (60, 66, −93)
  grass, the scenario-#3 cobblestone STILL standing at
  (65, 66, −88). He never reached home on day 14; home is the
  place he left it.

## DEATHS: 132 → 135 (+3, ALL ZOMBIE, DERIVED)

Derived via `pulse/lib/deaths.js` over the record + all traces:
total 135; the day-14 window holds exactly #133–135. The floor's
COUNT_DEATH rows (×3, trace-anchored) and the driver's own count
agree — three stores, one number.

- **#133 — 06:57:39.064Z, Zombie, the login hilltop.** 26 seconds
  after spawn, during cycle 1's first goto (toward home). The
  provisioning had put 32 porkchops in his pack; they dropped at
  the death site, within a few blocks of the login point. He
  respawned 19 blocks south (I3); he never went back north; the
  pork despawned unrecovered (~07:02:39Z by the 5-minute item age
  — a presumption, stated as one; no store can confirm a despawn).
  No flee engaged before this death: no floor-escape row and no
  flee line precede it in trace or driver log — the attack ran
  inside the wake/opening/first-model-call window, before any
  command existed for the reflex layer to guard.
- **#134 — 07:06:14.117Z, Zombie, the pocket east of home
  (77.7, 64, −98.3).** He had been fighting the pocket for ~3.5
  minutes (gotos at its lips, 2 climbs, digs at its face, a failed
  place) with a zombie already named at cycle 28 ("a zombie's out
  there at 22") when it reached him mid-craft. His own cycle-30
  words fix the place: "Dead again in the pocket. But look at
  this — I wake up in the trees." (Bookkeeping note for future
  lanes: cycle 29's trace row is stamped at the death instant but
  its position reads the post-respawn landing — an interrupted
  cycle's row samples position at flush, not at death. The driver
  log's line order — DEATH → AutoRespawn → cycle 30 — is the
  discriminating store.) His goods — the wooden pickaxe among
  them — dropped in the pocket.
- **#135 — 07:08:01.709Z, Zombie, the respawn country, mid-flee.**
  After #134 he respawned in the trees; pressure found him twice
  (flees 1 and 2 cleared); flee 3 engaged and death 3 landed
  during its first hop. The park and the abort followed inside
  five seconds (next section).

Weather's share, named as the charter required: the floor held
TIME (4 ASSERT_DAYLIGHT rows, all attempt 1, all landed and
verified). It does not hold weather. The Gate B `/weather clear`
covered the provisioning and the wake; by 07:06Z the frames show
heavy rain, and deaths 2–3 are rain-gloom deaths under canopy —
the day-13 mechanism at new addresses. The mitigation the charter
could offer (feed + a short home leg) was spent by death 1 and
the walker's carry; from the pocket onward he was exactly as
exposed as the charter's §9 said he would be.

## THE REFLEX LAYER'S LIVE ACCOUNT — THE REPAIR'S FIRST DAY

Three flee engagements, all in the day's final 70 seconds, all
against zombies at the respawn country (driver log + trace
`floor-escape` rows ×3 agree):

1. **Flee 1 — COMPLETED BY ITS OWN CLEAR.** Hop 1 → (31.4, 75,
   −105.2), ok=false, moved 0.01; hop 2 → (29.5, 75, −102.7),
   ok=true, moved 1.63; done {ok:true, via:"clear", hops:2,
   dist:35.8}. Scene row filed 07:06:57.469Z.
2. **Flee 2 — COMPLETED BY ITS OWN CLEAR.** Hop 1 → (31.1, 77,
   −103.4), ok=false, moved 2.10 (position after: (31.2, 68,
   −103.4)); done {ok:true, via:"clear", hops:1, dist:34.2}.
   Scene row filed 07:07:35.404Z.
3. **Flee 3 — ABORTED BY THE SAFETY READ.** The flee engaged on
   the pressure; death 3 landed after the engagement and before
   hop 1 completed; the body respawned in the same country and
   hop 1 executed on the respawned body (→ (32.2, 76, −104.6),
   ok=false, moved 2.71; position after (27.9, 69, −104.0)).
   The floor counted the death
   (COUNT_DEATH 07:08:05.716Z) and PARKED (07:08:05.717Z, trigger
   deaths_today>=max_deaths, lease revoked in the same instant).
   **At the hop-2 boundary, 07:08:06.253Z — 0.54 s after the park,
   4.54 s after the death — the reflex layer's shared snapshot
   read the stop and aborted the sequence**: trace row
   `reflex-abort` {trigger:"park", gateReason:"lease-revoked",
   deathsRun:3, at:"flee-hop-2"}; no further movement or dig
   command was issued; no burrow was entered ("no burrow: the
   stop rule owns the body now"); the main loop broke the day
   inside the same cycle; the close-exit's movement was SKIPPED
   under the stop (trace row `gate-park-close`) and the driver
   disconnected cleanly, rc=0, at 07:08:10Z.

Day 13's H1, restated against today: the floor parked 1.3 s after
death 3 and the driver never heard it; six more deaths landed
inside the stuck cycle before a hand stopped it. Today the same
signal travelled park → snapshot → hop boundary in half a second
and deaths stopped at EXACTLY 3. The counter's writing path was
proven on day 3, its reading path on the model loop on day 9; the
reading path ON THE REFLEX LAYER — the layer the body actually
lives in when it is dying — is now proven live, on the flee arm.

**The burrow: NEVER ENGAGED.** No hostile ever cornered him into
the dig-in path on day 14 — all three engagements were hop-flees.
The repair filing's named gap stands exactly as filed: the burrow
stages are proven by the shared helper plus 15 wiring assertions,
not by a simulated burrow and now not by a live one either. The
first live burrow remains owed evidence, and this record does not
round the flee-arm proof up into a burrow claim.

## THE GUARD'S ACCOUNT — A CLEAN NULL

The revised dig-guard (R1: disarm only at home ground; R2: arm on
falls > 2 between dig considerations) produced ZERO rows of any
kind on day 14: never armed, never refused, never deferred, never
disarmed. He never held cobblestone and never dug stone, so R1's
trigger never existed; his falls happened inside gotos and flees,
never between dig considerations, so R2's sampling point — at dig
considerations BY DESIGN, per the charter — never met one. That is
the design's own boundary, not a defect: a per-cycle sampler
cannot tell a walked hillside descent from a fall and would have
armed on the spawn-hill road. Disposition (appended to the
amendment note): **R1/R2 CARRIED — implemented and fixture-proven
(28/28), live-untested; R3 (placed-rung a first-class exit)
carried as plan text** — it rode in the scene's operating note
verbatim, and his one place attempt failed inside the pocket
fight. The clause stays DRAFT. The skill's fifth `uses[]` entry
is appended (fourth physical entry; day 10's first use was never
appended and is not back-filled).

## GATE B — THE FULL ACCOUNT

- **Pre-checks (all re-derived, none inherited):** Cody's live
  save sha c39540fe… byte-identical to day-13 close; inventory
  EMPTY; pos (36.5, 73, −86.5); health 20; foodLevel 20; held
  food 0; deaths baseline 132 derived; Vega 4b65ff2e… / Geist
  8ecbd230… matched; Cody not opped; Thor↔Orin skew < 1 s.
- **Relay:** found DEAD at the pre-check (both setsid supervisors'
  pids gone — the tenth death; there are still no ddbridge
  systemd units on the serving VM). Relaunched under setsid;
  RELAY-OK PASS from Thor at the check and again at launch
  (06:55:50Z).
- **Provisioning window (§4.5, the day's new gate class):** a
  vanilla `/give` cannot land on an offline citizen, and the
  fresh census proves no stored food exists at home — so: op bot
  `/weather clear` (server: "Set the weather to clear",
  06:53:02Z) → the provisioning harness joined Cody's body
  (spawned 06:53:08.633Z, inventory {}) → op `/give Cody
  cooked_porkchop 32` (server: "Gave 32 [Cooked Porkchop] to
  Cody") → harness read-back: cooked_porkchop 32, hp 20, food
  20, **deaths 0, hurt 0** → clean quit → post-quit `.dat`
  snapshot sha 738fb143… reading {cooked_porkchop: 32}. Two
  stores the feeder cannot write agree. The floor then verified
  the same snapshot itself: VERIFY_FEED PASS first-read
  (need 8, have 32, zero floor gives), and the driver's own wake
  feed-confirm passed with fmTotal 0 — the feed step ran end to
  end without a single floor intervention.
- **Keeper changeover (§6, literal):** Orin hashes verified
  before anything moved (activated variant 3551b50d…, keeper
  base 6042c1cb…, original 27aaa066…); standing cameraman
  STOP-stopped (exited cleanly 06:54:18Z); variant launched with
  CAM_DAY_REFRESH_OFF=1, banner "DAY-12 CHANGEOVER ACTIVE"
  06:54:25Z; no MagnusandMouse `/time set` appears in the server
  log after the changeover (last 06:51:14Z, pre-changeover) —
  the floor was sole asserter from its open.
- **Floor:** opened 06:54:50.984Z on contract sha 45dae2b5…;
  writer canary self-proof passed; VERIFY_FEED seq 4; LEASE_ISSUE
  seq 5 (born in `launch`); ASSERT_DAYLIGHT ×4, all attempt 1;
  COUNT_DEATH ×3; PARK + LEASE_REVOKE + NOTIFY 07:08:05.717Z
  (seq 29); FLOOR_CLOSE seq 42 at 07:17:18.618Z on the lane's
  SIGTERM at close-out. One refused start (I2) between open and
  the day; the lease the day ran on is the same lease, flipped
  live by the refused attempt's heartbeat and renewed by the
  floor thereafter.
- **The hand-over line** was delivered as drafted (it names only
  what the verified wake facts supported; no clause was
  contradicted, so no re-derivation was needed): "You wake on
  the hill where the world puts you, empty-handed — yesterday
  took the count and the pork with it. Home is yours still:
  table, pen, wheat. Stone first, at home this time — and the
  furnace built where it stands." The operating note's provision
  sentence named the 32 porkchops as the crew's act. His cycle-1
  say — "my pack's full of pork" — is the line landing. (I3's
  correction stands alongside: "the hill where the world puts
  you" was the login hill; the world also puts him in the tree
  country, and neither the line nor the charter knew it yet.)

## FLOOR + BUDGET

Floor report is in Gate B above (assertions 4/4 attempt 1; one
park, correctly triggered, correctly read — by BOTH consumers
now: the floor's own log and, for the first time, the body it
was protecting). Budget: 32 model calls, ALL DeepInfra
deepseek-v4.1-flash primary, ZERO governor failovers, $0.0315
total. Rate: 3.17 calls/min over the cycled span (06:57:45→
07:07:51Z), 2.94/min over the full live window — UNDER the
3.976 wc/min ceiling both ways. The day did not end for budget
reasons; it ended because the country killed him three times
in eleven minutes.

## FRAME VERDICT — FROM CONTENT (6 FRAMES)

Sampled from the capture segments at 06:57:39 / 07:01:02 /
07:03:42 / 07:06:01 / 07:07:11 / 07:08:05Z (filed at
`pulse/day14/stills/`), judged against the corrected position
track (I5):

- **Tracking: CORRECT IN 6/6.** The camera was in his country
  every time — the login hilltop at the death-1 second (camera
  receipt (32.2, 75, −85.2), Cody ~5 blocks away), the tree
  country at 07:01 (receipt (48.3, 71.2, −113.2), Cody ~7
  blocks), the pocket rim at 07:03–07:06 (receipt (76.3, 66.6,
  −95.8) at 07:06:01, Cody in the pocket below it), the respawn
  country in the rain at 07:07, and an aerial between countries
  at the abort second carrying the death-3 text. 12 SUBJECT-KEEP
  reframes and 4 SUBJECT-HOLDs in the keeper's activation log.
- **Cody clearly visible: 0/6.** Partial: 1/6 (07:01 — a figure
  behind leaves at his tree-work position, plausibly him, not
  provable); a speck under the death text at 07:08:05 is not
  attributable. The deficit is CANOPY OCCLUSION at the keeper's
  working ranges — the subject is under or behind leaves in
  every frame — not tracking, not stale state.
- **Hygiene:** clean of text 2/6; teleport-receipt text in 3/6;
  the death announcement in 1/6. Rain visible in 3/6 (07:06,
  07:07, 07:08) — the weather exposure documented in the frames
  themselves. Third day running that frame quality fails on the
  capture side; the mechanism this time is occlusion, after day
  12's chunk voids and day 13's mixed bag. The keeper is
  exonerated on tracking for the second consecutive day; what
  it cannot do is see through leaves.

## CLOSE STATE + POSTURE

Cody is offline at (28.8, 67, −104.1), hp 16.67 — he was under
attack at the disconnect second and the park froze him there;
offline, he cannot be harmed — food 20, inventory empty, save
sha d91fb084…. Vega and Geist: no joins in the server log today;
untouched. Standing posture restored and verified: keeper
STOP-stopped (exited cleanly 07:16:30Z); original cameraman
relaunched on the Orin, pid 1635891, its start assertion VERIFIED
LANDED in the server log at 07:16:49Z, refresh ON; floor closed
(FLOOR_CLOSE seq 42); op bot, verifier, writer and mirror loop
stood down; Thor stood down. The cameraman-renewal job (-h,
07:53Z) did not intersect the day — the day had closed and the
posture was restored before its window; it will find the
restored original cameraman when it fires.

What day 15 inherits: a citizen whose respawn country is mapped
(I3), whose login pocket and home-side pocket are both proven
killers in rain, whose wood chain ran in the field on day 14 —
logs felled and gathered, planks and sticks crafted, and the
wooden pickaxe crafted at a table of his own from an earlier day
standing in the pocket country (his cycle-12 words; a
crafting-table palette hit in the pocket chunk corroborates a
table there) — and a stop rule that now provably reaches the
body.
The furnace is still an extraction-and-survival problem, not a
knowledge problem. He has known the recipe since day 3.
