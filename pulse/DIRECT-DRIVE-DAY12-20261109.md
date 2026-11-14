# DIRECT DRIVE — DAY 12 (2026-11-10): THE COUNT CLOSED; THE SHAFT KEPT THE DAY
## The furnace count was met by cycle 19 and held at 15 — and no furnace was
## crafted, because the descent that made the seam safe made the shaft
## unclimbable: he spent ~300 cycles getting out of the hole the stone came
## from, self-extracted at ~cycle 321, and the window closed mid-return.
## Deaths 123 → 123. Floor: zero parks, zero interventions, 22 verified
## daylight assertions. Triple-024: FAIL (scored as triple-025) — the offer
## stood untouched all day; the grass→dirt cover-kill beneath it landed
## between placement and the post-day census.

Lane: day-12 lane (charter → Gate A → Gate B → live day → close → Director
post-day), under Casey's "build it all" + the parent's sequencing. Charter:
`pulse/DAY12-CHARTER-20261109.md` (29,888 B, tail-verified before Gate A).
Window: wake 2026-11-10T03:12:35Z → driver window-exit 04:37:35Z (trace end
row) / process exit 04:37:39Z rc=0; Cody left the game 04:37:37Z. **329
cycles** (327 cycle rows; numbering runs to 329 — the two model-failure
cycles carry no cycle row; the density discrepancy of day 11 recurs in
reverse, see §9). Trace: `pulse/direct-drive-trace-day12-20261110.jsonl`,
706 rows.

Posture at close: **standing posture restored** — keeper STOP-stopped at
04:38:07Z with Cody offline; original `cameraman.py` relaunched (pid
1351187), its start assertion verified landed issuer-specifically
(MagnusandMouse `/time set 1000` at 04:38:13Z, "VERIFIED LANDED" in its log);
Thor stood down (op bot quit via channel 04:41:17Z; floor SIGTERM →
FLOOR_CLOSE seq 121; mirror loop and verifier stopped).

---

## 1. THE ACTION CURVE (the day's measure, first)

Commands per ~10-minute block (cycle rows; the day ran 85 minutes):

| block | window (Z) | commands | what the block was |
|---|---|---|---|
| 0 | 03:12–03:22 | **71** | wake at home → table (c1) → planks topped up (c2) → east to the hollow → the seam dug down: **count 8 at c19**, 9 by c20 |
| 1 | 03:22–03:32 | 33 | the shaft: first extraction attempts; climb 0-for; pillar attempts begin |
| 2 | 03:32–03:42 | 49 | shaft: dig/place cycles against the walls; "the pit all over again" |
| 3 | 03:42–03:52 | 37 | shaft: notch work; waits lengthen |
| 4 | 03:52–04:02 | 41 | shaft: continued extraction attempts; count read at 15 (c49's say, re-read here) |
| 5 | 04:02–04:12 | 29 | shaft: slowest block of the played day |
| 6 | 04:12–04:22 | 31 | shaft → the notch at (72,62,−87) opens |
| 7 | 04:22–04:32 | 34 | **out of the slot (~c321, open ground y65)**; felltree attempts at a birch; model failover at c324 |
| 8 | 04:32–04:37 | 2 | final gotos toward home country; window closed mid-return |

Cycle-command totals (327 rows): goto 112 (21 ok), dig 86 (45 ok), wait 69
(69), climb 32 (**0 ok**), place 22 (11 ok), look 3 (3), craft 1 (1), eat 1
(0 — one refused eat at full food), felltree 1 (0 — the late birch, out of
reach). hp was **20 at every cycle row**; food 18–20. Density sub-act
totals are NOT used for the curve: the density rows over-count against the
driver's own command rows by ~23× (goto 2,343 sub-acts vs 112 commands) —
the day-11 discrepancy's other face, filed in §9; the command rows are the
count.

**The shape, plainly:** eleven minutes of exactly the day the charter
wanted — then 74 minutes inside one hole. The furnace day was won and lost
in the same seam.

## 2. THE FURNACE — NO (count YES, craft never attempted)

Count-from-state, read at each phase from stores he cannot write:

| phase | read | evidence |
|---|---|---|
| S0 wake | cobble **1** held | pre-day `.dat` `f88a88a2…` (03:55Z copy; sha unchanged at Gate A close) |
| S2 table | arrived (64,67,−94), verified | cycle 1 result "arrived — you stand at (65.4,66.9,−93.3)" |
| S3 top-up | planks 4 → **16** | cycle 2 `craft oak_planks 12` ok, "crafted oak_planks x12" |
| S6/S7 dig | count 1→2→3→4→5→6 (his says c13–c17) → **8 at c19** | his count-from-state says, one per dig; digs at (71,62..58,−89), (72,58..60,−89) from a stance descending y63→y58 — **the seam stance, performed** |
| peak | **15** held | his c49 say ("fifteen cobble in my pocket"); the driver state mirror's final inventory read: cobblestone 15 |
| S10/S11 | **never attempted** | zero `craft furnace` / `craft stone_pickaxe` rows in 327 cycles |
| close | cobble **15**, planks 15, oak_log 11, pickaxes 6, porkchops 29, food 20, hp 20 | post-day `.dat` `8735a654…` at (71.33, 65, −82.69) |

**The scenario unit's provenance (the charter §1 pre-declaration):** the
placed cobblestone at (65,66,−88) was **never taken** — the post-day census
reads it still standing (§7). Of the day's 15 held cobble, **zero** are the
scenario's; all 15+ were dug from the hollow seam (and at least 11 were
re-placed into the pocket walls during extraction attempts — post-day cells
(71,58,−88), (71,62,−88), (72,59,−88), (71,63,−86) read cobblestone). The
pre-declaration's separation held trivially: there is no scenario unit in
the count to separate.

**Verdict:** the furnace sequence's material problem is SOLVED — the count
closed in 8 cycles of digging and never dropped. The day's failure is
extraction: having dug himself to y58 in a 1-wide shaft, no verb on this
stack got him out (climb 0/32; pillar places placed beside/under him but
the walker never mounted them; goto resolution repeatedly "arrived" 1.6
blocks from targets inside the shaft geometry). He got out the way the
skill's R3 warns the seam punishes: by digging a new notch sideways and up
over ~280 cycles. fault_owner: **harness** (the movement stack cannot
climb out of a self-dug shaft — the +4-wall finding of day 8, met from
inside), world contributing (the hollow's relief put the seam 6–8 blocks
below the shoulder). NOT agent: his plan was the charter's plan, executed
in its order, and his own says diagnosed the trap correctly from cycle 17
onward.

## 3. DEATHS — delta 0 (123 → 123)

Derived twice from stores he cannot write: `lib/deaths.js` over
`deaths-record.jsonl` + all 12 traces: **123 total, 0 in the day window**.
The trace end row agrees (`deathsWorld: 123, deathsRun: 0`, floor sub-counts
all zero). hp never left 20 in any cycle row; the shaft was a trap, not a
threat — held daylight the whole day, no hostiles reached him.

## 4. GATE A — scenario #3 placed, verified in two stores

Full filing: `director/PLACEMENT-WINDOW-S3-20261110.md`. Summary: claim
addendum appended 02:58Z before the window; pre-reads fresh (element air,
beneath grass, invariants exact, his ground untouched, save sha unchanged,
world empty, daylight landed at open); ONE setblock 03:01:48Z →
"Changed the block"; scoreboard file read #chk = 1 after `/save-all flush`;
offline region parse agreed (65,66,−88) = cobblestone, invariants
identical; MapProbe4 left 03:02:30Z; Cody's save byte-identical at close.
**Measured deviation from the filing's expectation:** the grass→dirt
cover-kill beneath did NOT occur at placement (post parse read grass) — it
landed later (post-day census reads dirt). §8 carries the window's two
small channel incidents.

## 5. GATE B — passed on the third floor open; the two fails were the lane's

- Relay: FAILED at the 02:55Z pre-check (ECONNRESET) — the VM-side
  ddbridge units did not exist on this VM instance and the setsid
  supervisors were dead. Recovered by relaunching the retired supervisors
  (their own log note says retired; the systemd route it points to is not
  present on this instance). **RELAY-OK PASS 02:56:49Z** (check) and
  **03:12:3xZ** (launch). Filed as Incident R in §8.
- Saves: Cody LIVE `.dat` present, sha = day-11 close, pos/hp/food and
  inventory exactly the charter's S0. Vega `0e029227…` = `4b65ff2e…edc6`;
  Geist `00096e79…` = `8ecbd230…94f0` — both byte-identical (matched by
  content hash over the live directory).
- Deaths baseline re-derived: **123** (lib over record + 11 traces).
- Keeper activation, literally per §6: Orin copy md5 `6042c1cb…` == Thor
  master before it ran; the ACTIVATED file is the audited changeover diff
  (keeper + `CAM_DAY_REFRESH_OFF` guard at exactly the two daylight sites;
  diff md5 `9b5b2a28…`; activated md5 `3551b50d…`, md5-verified on the Orin
  before launch); banner line in its log 03:04:56Z: "DAY-12 CHANGEOVER
  ACTIVE: cameraman /time set refresh OFF … daylight is asserted by the
  floor"; **zero** MagnusandMouse `/time set` lines after the changeover
  (last 03:01:48Z, before it) — the floor was the day's sole asserter,
  verified from the server log. Live mirror parses; pos = his day-11 close;
  ground/ring co-location: the keeper framed the day-11-close ground
  unprompted (LOS rejects at his dip coordinates 03:05:26Z). Clock skew
  Thor↔Orin **0.285 s** (< 5 s). First-hour content check: §6.
- Op channel: ping ok (spawned, Gallery (30.5, 82, −87.5)); test
  park-notify receipted ok/recorded with its log row. (The lane's first
  two requests used the wrong field name and were refused "unknown cmd
  undefined" — §8.)
- Floor opens 1–2 FAILED CLOSED, correctly: open 1 (03:10:35Z) parked
  `sensor_path_broken` — the day-12 trace file did not exist yet and the
  sensor treats an unreadable path as a broken counter, not as silence
  (the day-3 lesson working as designed); open 2 (03:11:32Z) parked
  `feed_unverified` — the snapshot had been staged at the wrong path
  (rig reads `floor/run/day12/snapshot.json`). Both state dirs preserved
  (`state-failed-open-0310/`, `state-failed-open2-0311/`). Open 3
  (03:12:09Z): canary SELF_PROVE acking → **VERIFY_FEED PASS (30 ≥ 8, zero
  gives)** → **LEASE_ISSUE `lease-1794280329864` in state `launch`** →
  ASSERT_DAYLIGHT attempt 1. RELAY-OK re-run PASS at launch.
- Contract as-run: the floor-log's `contract_sha` is
  `44bef6204100f66052a0e5895b522226f7fec03cf513d94a38399fbe4175f47a` — the
  floor's own hash over the file bytes; the charter's cited canonical hash
  `7cba90cd…` is over the canonical re-dump. Both are filed; they are
  different measurements of the same contract (the day-11 pair showed the
  same split). Terms as chartered incl. `launch_window_s: 300`,
  `daylight_verify_window_s: 5`.
- Driver start gate: the start log prints **"GATE: live lease confirmed at
  start"**; spawn readback (63.3, 64, −90.4) hp/food 20/20; wake feed
  external-confirm fedOk=true with NO give (he woke already fed — the
  floor's VERIFY_FEED had read the same 30 from the snapshot).

## 6. CAMERA — the keeper kept the subject; the render kept its wounds

Keeper live all day: **SUBJECT-KEEP lines: 10** in the cameraman log
(day-aggregate count, incl. the 03:13:02Z and 03:13:12Z reframes on
(68.8,66,−88.2) and (71.7,63,−88.4) — his actual descent, tracked as it
happened), **SUBJECT-HOLD: 7** (mirror-stale holds, no blind frames), last
MagnusandMouse time-set 03:01:48Z (pre-changeover). The floor asserted
daylight 22 times, every assertion attempt 1, all landed (Gallery lines in
the server log through 04:36:15Z).

**Frame verdict FROM CONTENT** — nine segments sampled at ~10-minute
cadence across the window (seg-1794280387 … seg-1794285053), one still
read by eye per segment (480×270, `pulse/day12/stills/frames-*/`):

- **Cody-visible: 6/8 fully + 1 partial (7/8 counting the partial); 1/8
  absent** (a leaf-canopy frame at ~03:35Z — the camera above the canopy
  while he was in the shaft below it). The ninth pick (seg-1794285771,
  ~04:36Z) is a truncated file (moov atom missing — the segment was still
  being written at capture close) and is excluded, not counted as a miss.
- Against the baselines this is the keeper's proof: day 10 scored 0/9,
  day 11 scored 1/10. Today the camera was ON him — small in frame,
  frequently at the frame's edge or half behind a wall (he was inside a
  stone shaft for most of the day, and the keeper framed the shaft mouth
  and his head/shoulders at its lip), but present.
- **Clean-frame: FAILED as a clean-frame day.** The render-path wounds of
  day 11 are unchanged: unloaded-chunk void (black/white polygon tears)
  in **6/8** stills, and **command text on screen in 2/8** — one carries
  the client feedback line "Teleported MagnusandMouse to 74.200000,
  60.600000, −89.100000" (a teleport receipt — the long-standing
  command-feedback gap, not typed input), and one (~04:0xZ) carries the
  full chat backlog panel of teleport receipts plus "Chat is restricted"
  — the chat panel stretched across the frame, the day-11 booth cut's
  exact defect. Commands Only held (no citizen chat text in any still);
  the receipts are the client's own command feedback, which
  chatVisibility:1 does not suppress. Filed plainly: subject-keeping is
  FIXED; frame cleanliness is NOT, and its two causes (chunk streaming to
  a fast-teleporting camera; command-feedback receipts) are render-side,
  not keeper-side.

## 7. SCENARIO #3 / TRIPLE-024 — FAIL (scored as triple-025)

Post-day census (fresh copies 04:41–04:42Z, `director/census-s3-postday12/`,
region md5 `c2332347…`, entities md5 `e756720f…`): **(65,66,−88) still
reads minecraft:cobblestone**; invariants all identical; his-ground spot
reads all identical; (65,65,−88) now reads **dirt** (the cover-kill, landed
late — §4). Scored mechanically by the filed rule via
`commons/triples/allocate.py` as **triple-025-scenario-003-one-of-seven-score**:
(i) crossing **FAIL** — no cycle position falls in the scored band/step box
at any point in 327 cycles; (ii) cell changed **FAIL** — it reads
cobblestone; (iii) attribution **FAIL (vacuous)** — no dig/felltree
targeted the cell or the box, no collect inside it; all 45 ok digs were in
the hollow pocket. **Verdict: FAIL — refusal-by-geometry.** The full
reading (he crossed the shoulder at the tread's own latitude in cycles
1–3, within ~2 blocks, and never registered the block in 50
cobble-mentioning says; the shaft then consumed the day) is in
`director/LOOSENING-NOTE-004-20261109.md`, with the perception sub-read
filed unscored per the scenario filing.

## 8. INCIDENTS

**Incident R (harness, recovered pre-launch) — the relay was down and its
documented supervision does not exist on this VM.** RELAY FAIL
(ECONNRESET) at the Gate B pre-check. On the VM: no ddbridge systemd
units (the floor-repair filing's §4 describes them; `systemctl` finds
nothing), supervisor pidfiles pointing at dead pids. The path was restored
by relaunching the setsid supervisors the same filing marked RETIRED —
they are what this instance actually has. RELAY-OK PASS at check and at
launch, and the path carried 321 primary-route cycles (37 model-fail rows
and one failover, §9, are provider-side resets, not relay deaths — the
relay answered throughout). Standing gap, named for the parent: the VM's
relay supervision story contradicts its own filing; whichever is true
should be made true on the box, not in the note.

**Incident F1 (lane, recovered in Gate B) — two floor opens failed on the
lane's own staging.** Open 1: the trace file did not exist (the floor's
sensor parks on an unreadable path BY DESIGN — the counter-decoration
defence; the lane should have pre-created it). Open 2: the snapshot was
staged under `snapshots/` while the rig reads the run root. Both parks
were the floor working exactly as chartered; both fixes were one line;
both failed state dirs are preserved. The day was not delayed past its
window (open 3 at 03:12:09Z, wake 03:12:35Z).

**Incident F2 (lane, in-window, no effect) — wrong field names, twice.**
The Gate A probe requests and the first op-channel requests were written
with `verb`/`cmd`/`text` field mismatches against the bots' actual channel
shapes and were refused "unknown cmd". No server command was ever sent by
a refused request; every check was re-run in the correct shape and
receipted. The pattern is the same as Incident F1: the lane trusted its
memory of two channel contracts instead of reading the handlers first.

**Incident M (provider, absorbed) — 37 model-fail rows and ONE silent
failover.** From ~04:28Z the primary route (DeepInfra via relay) returned
read ECONNRESET / empty replies repeatedly; at cycle 324 the driver
failed over to `governor:qwen3-coder-30b` for the day's last 6 cycles
(routes: primary 321, governor 6). Per the day-5 charter-breach rule this
is filed, not hidden: the failover is IN the trace as a `failover` row
with its reason ("primary failed 3x consecutively"), and the day was
already decided by then (he was out of the shaft and walking). No charter
term governed the route; the breach class is noted for the parent's
charter template, not charged against this day.

**No Incident D recurrence.** The post-day `.dat` reconciles with the
trace and his says (cobble 15; planks 15 = 4+12−1 placed; oak_log 11 = 15
−4 consumed by the plank craft). Two small unexplained deltas are filed,
not smoothed: dirt 3→0 and apple 1→0 have no trace row naming their
consumption (the place rows account for cobble only; a dirt place or an
eaten/discarded apple leaves no row in this trace shape). Post-day item
entities near him: one oak_planks ×1 at (74.8, 64, −84.9) (age 2982 — an
old drop, not today's) and eggs; **no drops at his final position** — the
day-11 pattern (held items becoming ground drops at stand-down) did NOT
recur.

## 9. THE FLOOR'S LIVE REPORT + BUDGET

Floor: opened 03:12:09Z (third open, §5); lease `lease-1794280329864`
born in `launch`, flipped `live` on first heartbeat, held live the whole
day; **22 ASSERT_DAYLIGHT acts, every one attempt 1 and verified landed**
(Gallery-issued lines in the server log at the matching offsets — the
repaired verification's first full-day live proof, claimed now on this
evidence); VERIFY_FEED PASS once (30 ≥ 8, zero gives, zero feed parks);
**zero PARKs, zero COUNT_DEATHs, zero NOTIFYs after FLOOR_OPEN** until the
close: at 04:39:09Z (94 s after the driver's exit) the floor revoked the
lease `driver_heartbeat_lost` — the correct end-of-day shape for a lease
whose driver has gone — and SIGTERM closed it at 04:41:21Z (FLOOR_CLOSE
seq 121). The verifier's watch ran all day; its `ok:false` over the op
channel's preflight test traffic is the known cross-audit artefact (day
11), filed as such. No preventive act was taken or needed; the park was
never released because it never latched.

Budget (ledger gate terms: ceiling 3.976 wc/min; B ≈ 338 wc for 85 min;
hard cap 675.92 wc): **actuals — 327 brain calls in 85 min = 3.847
calls/min, UNDER the ceiling** (day 11's played span ran 4.15, over);
4,634,611 trace-metered tokens; trace-estimated cost **$0.3604** (vs day
10's $0.3588 for 303 calls — the same day, priced the same). The relay's
own call log meters 322 DeepInfra rows in the window (the difference to
327 is the 6 governor cycles plus boundary rows; the governor route is
metered by its own service, not the relay log — the unmetered-routes gap
in the ledger filing stands). 37 failed calls are inside the token total
above only where the trace recorded usage for them; failed-call cost
remains partially a GAP, as filed in the ledger.

## 10. THE HAND-OVER LINE — delivered verbatim

"You wake in the dip beside your own pit at home, one cobble in hand and
the furnace still wanting seven more. Your stone ground is the hollow
east along the south shoulder — your table, your pen and your wheat as
you left them." — carried in the driver's post-wake lastEvent, unmodified
from SCENARIO-003.md. His cycle-1 say answers it in his own words
("Woke up in the dip again with one cobble and a furnace still seven
short. Table first — four blocks north, top up the planks, then east
along the south shoulder to the hollow for stone."). The block was never
named to him, before or after; he never named it either.

**Scene-text state as-run (filed per the charter):** the day-12 driver's
inherited SYSTEM scene text still narrates the day-9/10-era frame
("Today you start at WORLD SPAWN…") — inherited unchanged from the day-11
copy, as day 11 ran under it too. The operative wake text (spawn chat +
post-wake lastEvent) was day-12's own and truthful. The stale system text
is a prompt-debt item for the next charter, not a day-12 incident: his
cycle-1 say shows the wake text, not the system text, is what he answered.

## 11. SKILL — third use appended

`skills/furnace-sequence.v1.json` `uses[]` now carries 2 entries (day
11's, then day 12's — day 10's first use was never appended and remains
un-backfilled, as noted on day 11). Day 12's entry: outcome
`ran-full-window-partial-furnace-not-crafted`; **S7's positive arm
SUPPORTED** (the count closed 8/8 held from a descending at-his-level
stance, read back dig by dig, against day 10's 13-of-14 lost); the new
rule candidate filed in the entry: a downward seam must be capped or its
exit pre-cut, because the descent is the trap. The asset's status line is
unchanged (ADMITTED-WITH-UNPROVEN-TAIL): S10 at ≥8 and S11 remain
UNPROVEN — the count has now been met twice over and the craft has still
never been reached.

## 12. WHAT THE DAY PROVED / DIDN'T

Proved live, first time: the repaired floor over a full day (22/22
daylight verifications landed at attempt 1; launch-state lease born,
lived, and revoked in the right order); the keeper's subject-keeping in
real frames (6/8 fully + 1 partial vs 0/9 and 1/10 baselines); the seam
stance's positive arm; count-from-state as a discipline (his count and
the `.dat` agree to the block at close).
Not proved / still open: furnace craft and placement (S10/S11) — now
blocked TWICE by extraction, not by materials; frame cleanliness
(render-side: chunk voids + command-feedback receipts); the relay's
supervision story on the VM (Incident R); the density sub-act counter's
~23× divergence from command rows (§1/§9) — the trace's density rows
should not be used for action curves until that is understood; the
dig-step out of a self-dug shaft, which is now 0-for-three-days as a
class (climb 0/46 across days 10–12) and wants a harness answer, not
another citizen day spent in a hole.
