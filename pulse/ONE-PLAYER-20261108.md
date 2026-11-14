# ONE PLAYER PLAYS — first-principles reset (Casey ruling 2026-11-08 20:00 AKST)

## INCIDENT RECORD (leads this log; source: ledger line 269 + Orin server log, first-hand)

The charter relaunch attempt killed Cody twice in 40 seconds. Both deaths were
operator-caused. fault_owner: agent (the relaunch lane's launch configuration).

- Death 115 — 2026-11-09T04:57:29Z "Cody was blown up by Creeper" at his park
  (71.685, 63, -102.313), 30 s after joining. A LIVE creeper at no census cell:
  the Step 2 census reads the SAVED entity store, and live mobs are invisible
  to it. The daylight hold was landed (creepers do not burn); the exposure was
  an unowned body standing at hp 1.3333 in blast range. Probable provenance
  (inference, evidence-backed): mobs spawned around the park while its chunks
  were loaded in the dark during the 03:53-04:07Z cameraman-STOP / grading
  window persist indefinitely under the closed canopy's shade; the saved-store
  census snapshot did not hold this one.
- Death 116 — 2026-11-09T04:57:38Z "Cody was slain by Zombie" near world
  spawn, 9 s after AutoRespawn: with no character loop owning the body, the
  framework's wander/state-machine plugins moved the respawned body
  defencelessly around spawn country.
- ROOT CAUSE: the resident was launched with PULSE_SKILLS=ne-herd-run.js but
  WITHOUT CODY_CHARACTER=1 — no character loop owned the body and the operator
  skill never took control.
- Containment HELD: resident stopped via codyctl 04:57:57Z; exactly one join
  in the server log; no respawn grind; deaths.jsonl = 116, matching the log.
- POST-INCIDENT BASELINE (NBT-verified by the closed lane): .dat sha256
  11023833c110b82aefe5f21cab209ea5376df0aaf1ddd3b62c5ed948775483fc; saved pos
  (38.68, 74.0, -89.19) near world spawn; hp 20 / food 20; INVENTORY EMPTY —
  the whole S1-era inventory (oak_planks 18, birch_log 10, stick 2,
  crafting_table 1, bone 1, lead 2, birch_sapling 1, dirt 1) dropped at death
  115 and is LOST. Vega .dat 4b65ff2e...edc6 and Geist .dat 8ecbd230...94f0
  verified untouched; they stay untouched under this shape.

## THE SHAPE (Casey, 20:00 AKST — the whole design)

One citizen — CODY — in the live Orin world, on the resident body WITH his
character loop loaded (CODY_CHARACTER=1: voice + tastes ride it). Survival
first AS CODE; then his project list in order, resuming after interruptions:
relocate to the anchor (64, 67, -93) -> wooden pickaxe -> cleared pad -> hut
(furnace, torch) -> chest -> pen. No exams, no gates beyond survival, no
sequencing with other citizens. The cameraman follows Cody continuously.
Supervision: 3-death abort from THIS lane's launch (baseline deaths 116);
daylight hold landing-verified (two misses = park + alarm); every death
incident-filed in the ledger and at the head of this log's phase entries.

Start state consequences, filed plainly: he joins barehanded at spawn
country (38.68, 74, -89.19), hp 20 / food 20. The chartered
sword-at-his-carried-table food plan is impossible as written (no table) —
his start is a bare-hands start: punch wood, make a table, then tools. That
fits his project list (pickaxe precedes everything anyway) and his own
character machinery (monitor/guard/flee + shelter() burrow reflex inside
character-plugin.js, criticalForage/hunt/eatToFull) is the survival layer.
The burrow reflex loads as part of the character loop — it IS the honest
implementation of the damage/hostile -> dig-in rule (monitor cancels work at
hostile <= 8.5 blocks; guard throws at <= 12; flee runs home; shelter()
digs in and seals when running does not clear danger). No operator
movement skill is used in this shape: the player plays.

## LAUNCH GATES (evidence required before / at launch)

G1 seam claimed — ledger line 270 (one-player-claim-20261109). DONE.
G2 daylight hold landed-verified in the server log within the current
   cameraman cycle before join, and continuously thereafter.
G3 LIVE hostile sweep + operator clearing of the join country: /kill by
   type (zombie/creeper/skeleton/spider) in r=16 spheres around the join
   point (38.68, 74, -89.19), world spawn (32, 70, -96), the anchor
   (64, 67, -93) and the park (71, 63, -102) via the opped headed client
   (server-log-verified issue lines), then /save-all and a fresh
   saved-store hostile read (mcprobe) over r=20 around the same centres;
   any remaining hostile type gets a second clearing pass.
G4 BODY OWNERSHIP (the incident's lesson, a launch gate in its own right):
   resident launched with CODY_CHARACTER=1 and NO PULSE_SKILLS; proof from
   the resident log before he takes a step that the character loop owns
   the body — [CHARACTER] activity + global.__codyCharacterActive set by
   the plugin, characterMode skip-list in force (wanderer/flee-on-danger/
   combat/behavior-script/npc-system/onboarding/game-hub skipped), and
   ZERO [RESIDENT] wander lines. If ownership cannot be proven: no launch.
G5 camera: cameraman (citizens=Cody) FOLLOW/CUT lines track Cody after
   join; screenshot of the headed client view filed as evidence.

## PHASE LOG

- 2026-11-09T05:0xZ — lane opened; claim filed (ledger 270); pre-join prep
  under way (sweep + clearing per G3, hold check per G2).
- 2026-11-09T05:08:48Z — G2 PASS: cameraman relaunched (pid 644570,
  citizens=Cody); start refresh VERIFIED LANDED in the server log.
- 2026-11-09T05:07-05:08Z — G3 PASS: cameraman STOPped 05:06:04Z (clean
  exit); 16 /kill commands (zombie/creeper/skeleton/spider x r16 around
  join/spawn/anchor/park) issued via the opped client (all server-log
  verified, issued-command count 1610 -> 1627) + /save-all flushed
  05:08:00Z; post-save mcprobe read: ZERO hostiles within 20 blocks of
  all four centres. Also recorded: zero food animals within 45 blocks
  of the anchor in the store — his food phase rests on his own forage
  machinery (oak apples via felling, local hunt when prey wanders in,
  criticalForage); trend under watch.
- 2026-11-09T05:09:5xZ — LAUNCH: resident pid 335674 via codyctl with
  CODY_CHARACTER=1, NO PULSE_SKILLS. G4 OWNERSHIP PASS (resident log):
  "[CHARACTER] character loop armed (gen 1)", "day loop started",
  actor armed; npc-system/onboarding skipped by the registry;
  wander lines this session: 0. Spawned at his saved (38.7, 74, -89.2),
  landed onGround, hp 20 / food 20, deaths 116 (no new death).
- FIRST FRICTION (filed, under watch): relocate route 2 hop to
  (39, 68, -94) timed out 17.8 s; the body is at (36.4, 74, -89.7) —
  it has NOT descended from its elevated saved position; y=74 plateau
  edge country is pin-cluster-adjacent ((36,-83)/(41,-85) clusters).
  His loop is working the failure (hop-skip/route machinery). If he
  cannot get down and east under his own machinery, that is a movement
  finding, not something to paper over.
- 2026-11-09T05:12:46Z — RELOCATE DONE + PICKAXE PROJECT UNDER WAY
  (character-state: intent "Felling a tree", project pickaxe, step
  gather-wood). The walk in: route 2 from his elevated spawn-save
  plateau failed 4 hops — note the fourth hop attempt DISPLACED him
  (36.4,74,-89.7) -> (45.6,74,-89.7) during its timeout, and route 0
  (ridge top) then walked him via (45.7,69,-89.7) [descended] to the
  anchor country; at the state read he stands at (72.7, 68, -93.3),
  hp 20 / food 20, deaths still 116. Tastes layer live in the log
  ("[taste] place resolved: the shoulder at 60,-96"). His loop routed
  around its own failures by its filed machinery (hop-skip, route
  switch) — no operator hand touched his movement.
- 2026-11-09T05:19-05:21Z — ZOMBIE ATTACK AT THE DIP (no death): a zombie
  closed to 6.3 blocks of Cody at the dip (~74, 64, -99) in held
  daylight; his monitor cancelled work, FLEE fired, danger cleared
  ("flee done; danger now null", flees=1). Cost: hp 20 -> 9.13, food
  20 -> 16 (chewed during the flee latency while his walkTo timeouts
  unwound). Deaths still 116. The survival machinery did its job —
  this is the burrow/flee layer earning its keep, and it is also the
  second live mob in his home country inside 25 minutes: the dip sits
  under the closed canopy; the G3 kill sphere (r16 around the park)
  covered this ground at 05:07Z, so this zombie either spawned in
  deep shade since, or climbed out of cave country below the r16
  spheres vertical reach. Filed as the home districts live ecology,
  NOT sterilised by operator hand: one clearing was the join repair;
  repeated clearing would be the operator playing, not the citizen.
- STATE OF PLAY 05:21Z: he is wedge-pinned in the dip bowl ~12 blocks
  from home ((76.3, 64, -98.3); displacement over 6 min is ~+/-3
  blocks across three route rotations), hp 9.13 (cannot regen below
  food 18; he holds NO food items), food 16 and draining slowly,
  inventory 6 oak logs + 2 saplings from his pickaxe-project felling.
  The pickaxe project drifted him into the dip on a taste-led felling
  excursion; the day loop re-invoked relocate (distHome > 4.5) and
  the final approach out of the dip is the triple-020 relief problem
  in live form. Under watch; his route machinery + forage triggers
  (hunt at food <= 8, criticalForage at hp < 4) are the next actors.
- 2026-11-09T05:32Z — CAMERA EVIDENCE (G5): Orin client screenshot taken
  via PIL ImageGrab on DISPLAY :0 (ffmpeg x11grab form rejected by
  this build: rc 234 — the PIL route is the working one) at
  /tmp/orin_screen_oneplayer.png on the Orin; viewed first-hand by
  this lane: FACE-CAM frame with Codys nameplate centred over his
  head at the dip, dense oak canopy country, held-daylight sky. The
  cameraman CUT/FACE-CAM lines track Cody continuously (05:10:01Z
  join cut through 05:31:37Z latest check); refresh cadence verified
  landed 05:08:48 start, 05:13:xx and 05:18:xx cycle lines in the log.

## VERDICT — filed 2026-11-09T06:15Z (one-player run, ~65 min live)

WHAT WORKED, in world evidence:
- Body ownership: the character loop owned the body from the first
  tick (gen 1 armed; zero wander lines; framework plugins skipped).
  The 115/116 failure class did not recur. Deaths this run: 0.
- He played: walked himself from the spawn save to the home country
  (route machinery absorbed 5 failed hops incl. the elevated-plateau
  start), felled three oak columns for the pickaxe project
  (+6 oak logs), narrated from his actual state, tastes layer live.
- He survived contact: a zombie closed to 6.3 blocks at the dip in
  held daylight; monitor -> flee -> danger cleared; hp 20 -> 9.13.
- The camera stayed on him (FACE-CAM/CUT lines join -> 05:40Z+;
  screenshot evidence filed). One HOLD-LOST alarm 05:19:11Z recovered
  by modal-dismiss 3 s later; cadence otherwise unbroken (257
  VERIFIED LANDED lines by 05:47Z).

THE FINDING (fault_owner: world, with a harness corollary):
- He never got home. A taste-led felling excursion for the pickaxe
  project drifted him into the dip at (74,-99) — inside the
  triple-020 relief mosaic — and relocate, the day loops top project
  while distHome > 4.5, could not extract him: ~35 min of route
  rotations (0/1/2), every hop timing out at 13-18 s, net displacement
  ~zero. His own stuck-detector fired (library consult) and changed
  nothing — no fallback in relocate engages the tools built for
  exactly this ground: escapeRoute(bot) is wired only inside
  criticalForage (hp < 4 gate) and returnHomeHops(bot) is dead code,
  called nowhere. The dip-escape machinery exists and the project
  loop cannot reach it.
- Food followed movement: with relocate consuming every cycle, the
  food machinery never engaged above its thresholds (hunt <= 8 fired
  into a relocate-owned body mid-hop; critical forage waits for
  hp < 4). Food drained 20 -> 4 across the run with zero food items
  ever held: forage was designed for home ground, and he never got
  home. Starvation floors at 1 hp on NORMAL, so this is a slow
  decline, not a death spiral — but there is no path in his current
  wiring from a food crisis in the dip to food.
- Net: the character layer, the survival reflexes and the camera all
  work. The citizen cannot cross his own front yard: known rough
  ground + a project sequencer that lets a gathering excursion strand
  him + an extraction tool the sequencer cannot call. That is the
  blocker, plainly, and it outranks the project list — the hut, chest
  and pen were never reached; the pickaxe was started (wood gathered)
  but not crafted.

CLOSING STATE: per the stop-and-file condition, the resident was
stopped cleanly at food 4 / hp 9.13 / deaths 116 (no death this run),
body left in the dip at ~(76, 64, -98.3); his save writes on
disconnect. The world stays held (cameraman renewal continues);
Vega/Geist saves untouched; nothing else launched.

## CLOSING VERIFICATION (2026-11-09T06:15-06:2xZ)
- Resident stopped cleanly (codyctl SIGTERM, pid 335674 gone); server
  log: "Cody lost connection: Disconnected" / "Cody left the game"
  06:15:23Z — exactly one join and one leave this run, no respawn.
- Saved state verified from his .dat with a full NBT parse (Orin):
  Pos (77.34, 64.0, -98.3) — the dip, as left; Health 9.1333 (matches
  the live feed exactly); foodLevel 4; Inventory: oak_log x6,
  oak_sapling x2 — nothing lost in the stop.
- Vega save untouched: sha256 4b65ff2e...edc6, byte-identical to the
  pre-run baseline. (Geist baseline was not re-read this session; no
  lane touched it and no Geist process ran.)
- Ledger: verdict appended as line 272 (one-player-run-verdict-20261109);
  the actors own stuck-consult from this run stands at line 271.
- Note (06:18Z): the cameraman still issues FOLLOW cuts addressed to
  Cody after his disconnect (its follow logic retries against the
  last citizen target); harmless server-side, filed for the renewal
  lane — the world stays held and daylight-verified regardless.
