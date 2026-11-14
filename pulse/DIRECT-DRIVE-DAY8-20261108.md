# DIRECT-DRIVE DAY 8 — CODY NOT WOKEN: THE EXIT IS REFUTED ON LIVE GEOMETRY (both chartered forms, 0/2 each)

Filed by the day-8 lane, 2026-11-09 ~17:05Z. Deaths: **0** — no citizen was woken.
Cody's state is EXACTLY the day-7 close: in his pit at (64.3, 63, −91.5), food 20,
hp 20, holding ~29 cooked porkchops, deaths 120, under a landing-verified daylight
hold (cameraman v3, cap 18:08:29Z Nov 9; refreshes landing in the Orin server log —
"(minecraft-server) issued server command: /time set 1000" most recent 16:41:19Z
at gate check, cameraman LOS-ok on station).

## INCIDENTS (at the head, per charter)

1. **Relay false alarm — instrument pointed at the wrong store (lane-owned).**
   The lane's first relay check ran the day-5 check script ON THE LOCAL VM; it
   probed the VM's own :8912, got an unparseable llama.cpp-flavoured body, and
   reported the relay down. Re-run from the THOR (the relay's actual leg) returned
   **RELAY-OK** (real DeepInfra completion) on the first attempt. The VM-side
   ddbridge supervisors were in fact alive (pids 2979/2980/2982, started 16:32Z by
   the day-7 lane). Lesson restated: a health check is only as good as its vantage
   point; verify from the store that matters.
2. **The spike scratch tree is dead (migration).** Booting `~/pin-scratch/spike/server`
   (port 25874) hit the WorldFolderMigration and crashed "Overworld settings
   missing" — the failure the day-7 rig-setup script documented for that
   pre-migration tree. The replica was therefore built on day 7's proven
   prov-scratch rig (town-tree copy, port 25875, RCON 25876), which boots clean.
   No live world was touched by either scratch server.
3. **Correction to the day-7 record (parent's diagnosis, and the day-8 brief's,
   was incomplete).** Day 7's exit attempt 1 (hopFlee → via "clear", hops 0) was
   attributed to the muster-range trap alone (target 2.6 blocks horizontal <
   3.5 musterRange). Reading `lib/hopflee.js` shows a second, independent
   guarantee of the same no-op: **hopFlee tests `isClear()` before anything
   else**, and the day driver's wake call passes `isClear = () => !nearestHostile(bot, 13)`.
   In a mob-quiet pit that is true at hop 0 — the flee declares "clear" without
   moving, at ANY target distance. The spike's proven crossings all used the
   caller form `isClear: () => false`. The day-8 driver (prepared, never run)
   would have needed `isClear: () => false` at the wake and close call sites —
   a caller fix, library unchanged. `fault_owner: prompt` (the brief chain
   specified the wake sequence as "hopFlee (unchanged)" without the caller form).

## §1 SURVEY — LIVE GEOMETRY (from the live region bytes, the discriminating store)

Source: Orin `world/dimensions/minecraft/overworld/region/r.0.-1.mca`, copied
16:44Z, parsed locally (`~/workspace/day8-lane/survey.py`) with the Y-major
section layout. Column tops (highest solid block) around the pit:

- **Cody's wake**: (64.3, 63, −91.5), in the hollow at the pit's west edge.
  Column (64,−91): stone at y63 with air above (his dug-out). Pit interior
  columns (65..66, −92): floor grass top ≈ y61–62, stand ≈ 62–63.
- **Pit walls**: east columns carry canopy (birch/oak leaves y70–74 over
  z −88..−92); the pit is a 3–4-block-deep hole in the home plateau.
- **THE PAD (west)**: grass tops y66 across (59..63, −90..−97) — feet stand y67.
  Neighbouring clean cells: (61,−93), (62,−93), (60,−94) all top y66.
- **EXIT TARGET CHOSEN: (60, 66, −93)** — grass_block top y66 (stand y67),
  NO canopy in its column. The other brief candidate (59,66,−92) was
  **rejected**: oak_leaves at y71–72 in its column.
- Target geometry vs wake: **4.55 blocks horizontal** (≥4.5 spike rule ✓),
  outside hopFlee's ~3.5 muster range, **+4 vertical** (feet 63 → 67).
  That last number is the one that decided the day — see §3.

## §2 AIM PROOF — THROWAWAY BODY, LIVE-GEOMETRY REPLICA (prov-scratch rig)

Replica built by RCON fills to the surveyed live geometry: pit floor top y62
(stand 63) at x64..66 / z−93..−91; pad plane top y66 (stand 67) around it;
wake (64.3, 63, −91.5); target (60, 66, −93). Throwaway `AimWalker8`, survival,
woken at the exact wake point (server-verified Pos), fed by server-console give
(the feed channel itself was proven day 7 phase 1 and on Cody's own body; it was
not the mechanism under test here). Evidence: `~/pin-scratch/aim-day8-results.jsonl`.

**Form 1 — hopFlee (library unchanged, spike caller form `isClear: () => false`, maxMs 110000): 0/2**
- Run 1: 9 hops, **fm 643**, 113.8 s, budget exhausted; end server-side
  (64.31, 63, −92.48). Every hop's inner gotoNear returned ok=false; the body
  rose ~1 block up the pad wall face and slid back (moved 0.00–0.97 per hop).
- Run 2: 9 hops, **fm 650**, 114.1 s; end (64.31, 63, −92.59). Deterministic —
  near-identical hop sequence to run 1.

**Form 2 — plain gotoNear long leg to (60,66,−93), range 1.6, 60 s: 0/2**
- Run 1: **fm 840**, walkTo timeout at 52.4 s, wedge-release arbiter exhausted
  (5 grants), end (64.32, 63, −92.57).
- Run 2: **fm 828**, walkTo timeout at 52.4 s, end (64.31, 63, −92.57).

Per the brief's step-2 rule, the STOP fired: **neither form passes on the
correctly-aimed target, so Cody was not woken.** No third mechanism was tried.

## §3 THE FINDING — THE SPIKE'S BENCH WAS LEVEL; THE LIVE PAD IS +4

The locomotion spike proved exits from a replica pit whose bench slab stood at
**feet y63 — the same level as the pit floor** (crossing = +0; the body transited
the wall column mid-flight at y64.0). Day 6's bench correction established that
no such slab exists live: the live pad west of the wall is the home plateau at
**top y66, feet 67 — a flat wall +4 over the pit floor**. A 2-block hop targets a
cell whose feet level sits 4 above the body (hopFlee's own scoring penalises a
≥2 step +6 and still picks it, every alternative being worse); a single gotoNear
cannot jump-climb a flat 4-high face, and the pathfinder's wedge machinery
grinds at its base (fm 828–840). **The exit mechanism was never refuted in the
spike — and never proven for this geometry either. The day-6 correction changed
the exit's physics, not merely its aim, and the day-7/day-8 brief chain carried
the transfer premise unexamined.** `fault_owner: prompt`. Secondary geometry
note: the whole home plateau is y66–68; the only near-level ground is 20+ blocks
east/south-east (tops y62–65 around (70..72, −87..−100)) — beyond any chartered
form's honest reach from inside the pit.

## §4 CLOSE STATE

- Cody: **never woken**; state identical to day-7 close (pit, food 20, hp 20,
  ~29 cooked porkchops, deaths 120). The binding close clause (park on surface)
  is NOT met — it cannot be met without an exit; it remains the standing debt,
  now with its cause measured rather than presumed.
- Scratch rigs stopped (prov-scratch via RCON stop; spike server dead at boot).
  AimWalker8 quit after each proof. The unpatched day-8 driver copy prepared
  during the lane was deleted unused — no day-8 driver ever ran.
- Vega/Geist: untouched (no live process ran); .dat shas verified against the
  day-7 baselines at filing time (see lane handoff).
- Costs: **$0.00** brain spend (no citizen, no driver; one real DeepInfra
  completion for the RELAY-OK probe, sub-cent).
- Relay: RELAY-OK from Thor; VM supervisors alive at filing. The
  restart-surviving service-unit debt stands (not this lane's to fix today).

## §5 NEXT BINDING CONSTRAINT (from evidence)

An exit for a **+4 flat wall** needs its own spike before any further citizen
wake. Candidates with precedent: (a) **dug-tread stair** — spike T10 landed
single +1 treads one at a time under the dig-step allowance (chains under the
helm did not compose; a tread-then-step sequence scripted at the driver level
is untested); (b) **dig-then-pillar** — he can dig in the pit today (world-verbs
all work; day 5: 55 digs); pillaring on dug blocks needs no goto to start, the
exact point where day 5's climb verb died; (c) operator relocation remains
Casey's call only. Until one is proven on the replica, Cody's furnace waits on
the wall, not on the aim.
