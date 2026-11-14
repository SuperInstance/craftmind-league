#!/usr/bin/env python3
"""test-subject-keeping.py — DRY TEST of the day-11 cameraman copy's
position-driven subject-keeping (charter S8 / readiness S12 item 10).

Replays the day-10 record through the keeper: the recorded state
mirror is pulse/direct-drive-state.json (the final publication) and
the per-cycle positions are in the day-10 trace; the replay treats
every trace row carrying (ts, pos) as one mirror publication, in
order, and drives keeper_step() with simulated time = the row's own
ts. All camera actuation is stubbed and recorded (tp_abs_logged /
send_command never reach a client; xdotool is never invoked).

Assertions:
  A1 TRACKING   after every fresh publication, framing_target ==
                the position that publication carried.
  A2 REFRAMING  total displacement across the day > 50 blocks (he
                really moved), keeper reframes >= 10 times, and
                every reframe's aim is within 0.01 blocks of the
                position current at that step (aim == his position,
                never a stale one).
  A3 STALENESS  with publications withheld for 120 s mid-replay,
                the keeper enters the stale state, logs SUBJECT-HOLD,
                holds the last target unchanged, issues ZERO reframes
                during the gap, and logs SUBJECT-RESUME on the next
                fresh publication.
  A4 BUSY       while a shot sequence is marked busy, the target
                still tracks but ZERO reframes are issued.
Output: this script's stdout, filed beside the cameraman copy as
test-subject-keeping-output.txt. No world contact of any kind.
"""
import importlib.util
import json
import time
from datetime import datetime, timezone

CAM = "/home/caseydigennaro/craftmind-league/pulse/day11/cameraman-day11-framing.py"
TRACE = "/home/caseydigennaro/craftmind-league/pulse/direct-drive-trace-day10-20261109.jsonl"
STATE = "/home/caseydigennaro/craftmind-league/pulse/direct-drive-state.json"
OUT = "/home/caseydigennaro/craftmind-league/pulse/day11/test-subject-keeping-output.txt"

spec = importlib.util.spec_from_file_location("camday11", CAM)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

lines = []
def say(s):
    lines.append(s)
    print(s)

# --- stub actuation + logging -------------------------------------------
calls = {"tp": [], "cmd": []}
m.log = lambda msg: lines.append("LOG " + msg)
m.tp_abs_logged = lambda name, cam, target: (calls["tp"].append((name, cam, target)), True)[1]
m.send_command = lambda body: (calls["cmd"].append(body), True)[1]

def epoch(ts):
    return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.%fZ").replace(
        tzinfo=timezone.utc).timestamp()

# --- the recorded day, as mirror publications ----------------------------
final_state = json.load(open(STATE))
pubs = []
for raw in open(TRACE):
    raw = raw.strip()
    if not raw:
        continue
    try:
        r = json.loads(raw)
    except ValueError:
        continue
    if r.get("ts") and r.get("pos"):
        pubs.append(r)
say("publications replayed: %d (trace rows with ts+pos)" % len(pubs))

world = m.World()
director = m.Director.__new__(m.Director)   # no __init__: no log-size reads
director.busy = False
director.busy_since = 0.0

def publish(r, now):
    dd = dict(final_state)          # ground/ring/structures of record
    dd["ts"] = r["ts"]
    dd["pos"] = r["pos"]
    dd["citizen"] = "Cody"
    world.ingest_dd("Cody", dd, now)
    return m.keeper_step(world, director, now=now)

# --- pass 1: tracking + reframing over the whole day ---------------------
track_fail = 0
reframes = []
disp = 0.0
prev = None
for r in pubs:
    now = epoch(r["ts"])
    before = len(calls["tp"])
    st = publish(r, now)
    tgt = world.framing_target.get("Cody")
    want = (r["pos"]["x"], r["pos"]["y"], r["pos"]["z"])
    if tgt != want:
        track_fail += 1
    if prev is not None:
        disp += m._dist(want, prev)
    prev = want
    for name, cam, aim in calls["tp"][before:]:
        reframes.append((r["ts"], aim, want))
aim_fail = sum(1 for _ts, aim, want in reframes
               if m._dist((aim[0], aim[1] - 1.2, aim[2]), want) > 0.01)
say("A1 tracking: mismatches=%d of %d" % (track_fail, len(pubs)))
say("A2 reframing: total displacement=%.1f blocks, reframes=%d, "
    "aim-off-target=%d" % (disp, len(reframes), aim_fail))

# --- pass 2: staleness gap ------------------------------------------------
world2 = m.World()
calls["tp"].clear()
lines2_mark = len(lines)
mid = pubs[len(pubs) // 2]
now0 = epoch(mid["ts"])

def publish2(r, now):
    dd = dict(final_state)
    dd["ts"] = r["ts"]
    dd["pos"] = r["pos"]
    dd["citizen"] = "Cody"
    world2.ingest_dd("Cody", dd, now)
    return m.keeper_step(world2, director, now=now)

publish2(mid, now0)
held_target = world2.framing_target.get("Cody")
tp_before_gap = len(calls["tp"])
gap_states = []
held_ok = True
for dt in (60, 90, 120):
    # The keeper is stepped at each simulated instant against the
    # SAME, now-ageing publication. At +30 s the publication is
    # still inside the 45 s freshness bound by design (a mirror is
    # only stale once it is older than SUBJECT_STALE_S), so the gap
    # is probed at 60/90/120 s: unambiguously stale throughout.
    st = publish2(mid, now0 + dt)   # same (now-old) publication re-read
    gap_states.append(st["Cody"]["state"])
    if world2.framing_target.get("Cody") != held_target:
        held_ok = False             # the hold must not move the target
tp_after_gap = len(calls["tp"])
nxt = pubs[len(pubs) // 2 + 1]
st = publish2(nxt, epoch(nxt["ts"]))
logtext = "\n".join(lines[lines2_mark:])
say("A3 staleness: states during 120 s gap=%s, target held "
    "unchanged=%s, reframes during gap=%d, SUBJECT-HOLD logged=%s, "
    "SUBJECT-RESUME logged=%s"
    % (gap_states, held_ok, tp_after_gap - tp_before_gap,
       "SUBJECT-HOLD" in logtext, "SUBJECT-RESUME" in logtext))

# --- pass 3: busy defers actuation, not tracking --------------------------
world3 = m.World()
director.busy = True
director.busy_since = epoch(pubs[0]["ts"])
calls["tp"].clear()
busy_track_fail = 0
for r in pubs[:40]:
    now = epoch(r["ts"])
    director.busy_since = now      # a live shot, freshly busy
    dd = dict(final_state)
    dd["ts"] = r["ts"]; dd["pos"] = r["pos"]; dd["citizen"] = "Cody"
    world3.ingest_dd("Cody", dd, now)
    m.keeper_step(world3, director, now=now)
    if world3.framing_target.get("Cody") != (r["pos"]["x"], r["pos"]["y"], r["pos"]["z"]):
        busy_track_fail += 1
say("A4 busy: publications=%d, tracking mismatches=%d, reframes "
    "while busy=%d" % (min(40, len(pubs)), busy_track_fail, len(calls["tp"])))
director.busy = False

ok = (track_fail == 0 and disp > 50 and len(reframes) >= 10
      and aim_fail == 0 and gap_states == ["stale", "stale", "stale"]
      and held_ok and tp_after_gap - tp_before_gap == 0
      and "SUBJECT-HOLD" in logtext and "SUBJECT-RESUME" in logtext
      and busy_track_fail == 0 and len(calls["tp"]) == 0)
say("VERDICT: %s" % ("PASS test-subject-keeping" if ok else "FAIL test-subject-keeping"))
open(OUT, "w").write("\n".join(lines) + "\n")
raise SystemExit(0 if ok else 1)
