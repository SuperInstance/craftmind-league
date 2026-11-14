#!/usr/bin/env python3
"""test-subject-keeper.py -- PROOF SUITE for cameraman-subject-keeper.py.

Offline only: no world contact, no client, no ssh. All actuation in
the module under test is stubbed and recorded (tp_abs_logged / log);
xdotool is never reached because send_command sits behind the stubbed
tp_abs_logged.

ALL INPUTS ARE PINNED FIXTURES in ./fixtures (see fixtures/manifest.json
for source paths + hashes). No arm reads a live file. This is the
property the rig lane's 2026-11-09 dry test lacked: it read the live
pulse/direct-drive-state.json for its perception input, so its PASS
(308/308 tracked, 71 reframes) stopped being reproducible the moment
day 11 overwrote that file. Re-running that test today FAILS at A2
with 0 reframes: fed day-11-close ground/ring (absolute tops y67-y70
from another place), pick_station rejects every station for day-10
positions -- arm P5 below reproduces exactly that, on purpose.

Arms:
  P0 INTEGRITY  ast-level per-function comparison of the deliverable
                against the pinned original cameraman (md5 27aaa066):
                every shared function byte-identical except a named
                differing set; named added set; nothing removed.
  P1 DAY-10     replay of the 308 recorded day-10 publications
    REPLAY      (ts+pos) through keeper_step, neutral perception
                (the traces record positions, not per-cycle ground/
                ring; LOS terrain behaviour is P5's arm, not this
                one's). Asserts tracking exact, every reframe aimed
                at the then-current position (never a stale one).
  P2 DAY-11     same replay over the played day-11 span (36 pubs).
    REPLAY
  P3 SYNTHETIC  a walker on a 108-block path with work pauses,
    CONTRAST    publications every 2 s. Keeper arm = the real
                keeper_step. Original arms = the v3 framing model
                taken from the original code: a shot's aim is fixed
                at the citizen's position when the shot STARTS and
                does not move during the dwell (every v3 shot --
                tp_rel execute-at, WORKING, FACE-CAM, fallback steps
                -- is constructed so); shots restart on (A) the
                fallback dwell cadence 10.5 s (dwells are 9-12 s) and
                (B) a generous 20 s event cadence (the attempt/fail
                cooldown floor). Sampled every 2 s; in-frame =
                subject within 6.0 blocks of the framed position.
  P4 STALE-     publications freeze for 120 s mid-walk while the
    NESS        subject keeps moving (ground truth). Asserts: stale
                state at every probe past the 45 s bound, SUBJECT-
                HOLD logged exactly once, ZERO reframes during the
                freeze, framing target never leaves the last fresh
                position, and on resume a reframe aimed at the true
                current position.
  P5 OCCLUSION  day-10 pubs replayed against the WRONG place's
    HONESTY     perception (day-11 close ground/ring, pinned): the
                keeper must track exactly and must never issue a
                frame whose aim is stale; the occluded count is the
                blindness measure, reported, not asserted away.

Output: stdout + test-subject-keeper-output.txt beside this file.
Exit 0 iff every assertion holds.
"""
import ast
import hashlib
import importlib.util
import json
import math
import os
import sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
CAM = os.environ.get("SK_CAM", os.path.join(HERE, "cameraman-subject-keeper.py"))
FIX = os.path.join(HERE, "fixtures")
OUT = os.path.join(HERE, "test-subject-keeper-output.txt")

lines = []
def say(s):
    lines.append(s)
    print(s, flush=True)

fails = []
def check(cond, label):
    say("  [%s] %s" % ("ok" if cond else "FAIL", label))
    if not cond:
        fails.append(label)

def epoch(ts):
    return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.%fZ").replace(
        tzinfo=timezone.utc).timestamp()

def iso(t):
    dt = datetime.fromtimestamp(t, timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + ("%03dZ" % int(round((t % 1) * 1000)))

def dist(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

# ---------------------------------------------------------------------------
# P0 INTEGRITY -- ast per-function comparison vs the pinned original.
# ---------------------------------------------------------------------------
def func_map(path):
    tree = ast.parse(open(path).read())
    out = {}
    def walk(node, prefix):
        for ch in ast.iter_child_nodes(node):
            if isinstance(ch, (ast.FunctionDef, ast.AsyncFunctionDef)):
                q = prefix + ch.name
                out[q] = ast.get_source_segment(open(path).read(), ch)
                walk(ch, q + ".")
            elif isinstance(ch, ast.ClassDef):
                walk(ch, prefix + ch.name + ".")
    walk(tree, "")
    return out, tree

def module_level(tree):
    assigns, imports = {}, set()
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for t in node.targets:
                if isinstance(t, ast.Name):
                    assigns[t.id] = ast.dump(node.value)
        elif isinstance(node, ast.Import):
            for a in node.names:
                imports.add(a.name)
        elif isinstance(node, ast.ImportFrom):
            imports.add("from " + (node.module or ""))
    return assigns, imports

say("P0 INTEGRITY (deliverable vs pinned original cameraman)")
orig_path = os.path.join(FIX, "cameraman-original-27aaa066.py")
orig_md5 = hashlib.md5(open(orig_path, "rb").read()).hexdigest()
check(orig_md5 == "27aaa066d5549c7390a0ffc4c39a3d93",
      "audit baseline is the live cameraman.py (md5 %s)" % orig_md5[:8])
fo, to_ = func_map(orig_path)
fd, td = func_map(CAM)
DIFFERING = {"World.__init__", "_los_columns", "Director.__init__",
             "Director.run_event", "Director.flythrough",
             "Director.fallback_step", "main"}
ADDED = {"World.dd_snapshot", "_mirror_age_s", "keeper_step",
         "subject_keeper"}
shared = set(fo) & set(fd)
bad = [q for q in sorted(shared)
       if q not in DIFFERING and fo[q] != fd[q]]
check(not bad, "every shared function outside the named differing set "
      "is byte-identical (%d shared functions; differing: %s)"
      % (len(shared), ", ".join(sorted(DIFFERING))))
if bad:
    say("    non-identical, unlisted: %s" % bad)
check(set(fd) - set(fo) == ADDED,
      "added functions are exactly the keeper set (%s)"
      % ", ".join(sorted(ADDED)))
check(not (set(fo) - set(fd)), "no function removed")
ao, io_ = module_level(to_)
ad, id_ = module_level(td)
cshared = set(ao) & set(ad)
cbad = [n for n in sorted(cshared) if ao[n] != ad[n]]
check(not cbad, "every shared module constant identical (%d constants)"
      % len(cshared))
check(set(ad) - set(ao) <= {"SUBJECT_CYCLE_S", "SUBJECT_STALE_S",
                            "SUBJECT_REFRAME_DIST"},
      "added constants are only the SUBJECT_* set")
check(not (set(ao) - set(ad)), "no constant removed")
check(io_ <= id_ and (id_ - io_) <= {"calendar"},
      "imports: original set kept, only 'calendar' added")
CRITICAL = ["Director._attempt_daylight", "Director.daylight",
            "Director.check_stop", "Director.dwell", "send_command",
            "mc_window_active", "thor_poll", "log_tail"]
check(all(fo[q] == fd[q] for q in CRITICAL),
      "daylight / STOP / focus-guard / tails byte-identical: %s"
      % ", ".join(CRITICAL))

# ---------------------------------------------------------------------------
# Load the deliverable with actuation stubbed.
# ---------------------------------------------------------------------------
spec = importlib.util.spec_from_file_location("camkeeper", CAM)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
LOG = []
TP = []
m.log = lambda msg: LOG.append(msg)
m.tp_abs_logged = lambda name, cam, target: (TP.append((name, cam, target)), True)[1]

def fresh_director():
    d = m.Director.__new__(m.Director)
    d.busy = False
    d.busy_since = 0.0
    return d

def replay(pubs, extra_dd=None, label=""):
    """Drive keeper_step over recorded publications (neutral or given
    perception). Returns a metrics dict."""
    world = m.World()
    director = fresh_director()
    del LOG[:]
    del TP[:]
    track_fail = 0
    aim_errs = []
    statuses = {}
    disp = 0.0
    prev = None
    reframes = 0
    for r in pubs:
        dd = {"citizen": "Cody", "ts": r["ts"], "pos": r["pos"]}
        if extra_dd:
            dd.update(extra_dd)
        before = len(TP)
        world.ingest_dd("Cody", dd, epoch(r["ts"]))
        st = m.keeper_step(world, director, now=epoch(r["ts"]))
        want = (r["pos"]["x"], r["pos"]["y"], r["pos"]["z"])
        if world.framing_target.get("Cody") != want:
            track_fail += 1
        if prev is not None:
            disp += dist(want, prev)
        prev = want
        s = st["Cody"]["state"]
        statuses[s] = statuses.get(s, 0) + 1
        for _n, _c, aim in TP[before:]:
            reframes += 1
            aim_errs.append(dist(aim, (want[0], want[1] + 1.2, want[2])))
    return {"track_fail": track_fail, "reframes": reframes,
            "aim_max": max(aim_errs) if aim_errs else 0.0,
            "aim_mean": (sum(aim_errs) / len(aim_errs)) if aim_errs else 0.0,
            "statuses": statuses, "disp": disp, "n": len(pubs)}

# ---------------------------------------------------------------------------
# P1 + P2 -- the recorded days.
# ---------------------------------------------------------------------------
for tag, fname in (("P1 DAY-10 REPLAY", "day10-pubs.json"),
                   ("P2 DAY-11 REPLAY", "day11-pubs.json")):
    pubs = json.load(open(os.path.join(FIX, fname)))
    r = replay(pubs)
    say("%s: publications=%d displacement=%.1f blocks statuses=%s"
        % (tag, r["n"], r["disp"], r["statuses"]))
    say("  tracking mismatches=%d/%d, reframes=%d, aim error max=%.4f "
        "mean=%.4f blocks" % (r["track_fail"], r["n"], r["reframes"],
                              r["aim_max"], r["aim_mean"]))
    check(r["track_fail"] == 0, "%s tracking exact" % tag)
    check(r["aim_max"] < 0.01, "%s no reframe ever aimed at a stale "
          "position" % tag)
    check(r["reframes"] >= 5, "%s keeper reframed (%d times)"
          % (tag, r["reframes"]))

# ---------------------------------------------------------------------------
# P3 SYNTHETIC CONTRAST -- keeper vs the original's fixed-at-shot-start aim.
# ---------------------------------------------------------------------------
say("P3 SYNTHETIC CONTRAST (108-block roam with work pauses)")
KEYS = [(0, (0.0, 0.0)), (30, (0.0, 0.0)), (40, (30.0, 0.0)),
        (70, (30.0, 0.0)), (78, (30.0, -24.0)), (100, (30.0, -24.0)),
        (110, (6.0, -6.0)), (150, (6.0, -6.0)), (158, (-18.0, -6.0)),
        (240, (-18.0, -6.0))]
def walker(t):
    for (t0, p0), (t1, p1) in zip(KEYS, KEYS[1:]):
        if t0 <= t <= t1:
            if t1 == t0:
                return (p1[0], 64.0, p1[1])
            f = (t - t0) / (t1 - t0)
            return (p0[0] + (p1[0] - p0[0]) * f, 64.0,
                    p0[1] + (p1[1] - p0[1]) * f)
    return (KEYS[-1][1][0], 64.0, KEYS[-1][1][1])

T0 = 1760000000.0
TICKS = list(range(0, 241, 2))
world = m.World()
director = fresh_director()
del LOG[:]
del TP[:]
keeper_d, unframed = [], 0
origA_d, origB_d = [], []
moving = []
frameA = frameB = None
nextA = nextB = 0.0
path_len = 0.0
prev_pos = None
for t in TICKS:
    pos = walker(t)
    if prev_pos is not None:
        path_len += dist(pos, prev_pos)
        moving.append(dist(pos, prev_pos) > 0.01)
    else:
        moving.append(False)
    prev_pos = pos
    # original arms: a shot starting at or before this tick (and after
    # the last applied one) fixes the aim at the walker's position AT
    # THE SHOT INSTANT; the aim then does not move during the dwell.
    while nextA <= t:
        frameA = walker(nextA)
        nextA += 10.5
    while nextB <= t:
        frameB = walker(nextB)
        nextB += 20.0
    origA_d.append(dist(pos, frameA))
    origB_d.append(dist(pos, frameB))
    # keeper arm: sample BEFORE this tick's step -- the frame holds
    # what the last processed publication set (one-cycle staleness is
    # priced in, not edited out).
    framed = world.framing_framed.get("Cody")
    if framed is None:
        unframed += 1
        keeper_d.append(None)
    else:
        keeper_d.append(dist(pos, framed))
    dd = {"citizen": "Cody", "ts": iso(T0 + t),
          "pos": {"x": pos[0], "y": pos[1], "z": pos[2]}}
    world.ingest_dd("Cody", dd, T0 + t)
    m.keeper_step(world, director, now=T0 + t)

def in_frame(d):
    # 6.0-block frame radius; the 1e-9 only absorbs float dust (the
    # diagonal leg's true error is exactly 6.0 = one keeper cycle of
    # travel at the fixture's 3 blocks/s -- see the P3 note below).
    return d <= 6.0 + 1e-9

def arm_stats(ds):
    vals = [d for d in ds if d is not None]
    return {"n": len(ds), "in_frame": sum(1 for d in vals if in_frame(d)),
            "of": len(vals), "max": max(vals), "mean": sum(vals) / len(vals)}
ks = arm_stats(keeper_d)
say("  path length %.0f blocks over %d samples (2 s ticks)"
    % (path_len, len(TICKS)))
say("  KEEPER:        in-frame %d/%d sampled (%d unframed at start), "
    "max err %.1f, mean err %.2f, reframes=%d"
    % (ks["in_frame"], ks["of"], unframed, ks["max"], ks["mean"], len(TP)))
for nm, ds in (("ORIGINAL-A (fallback dwell 10.5 s)", origA_d),
               ("ORIGINAL-B (event cadence 20 s)  ", origB_d)):
    s = arm_stats(ds)
    say("  %s: in-frame %d/%d, max err %.1f, mean err %.2f"
        % (nm, s["in_frame"], s["of"], s["max"], s["mean"]))
def moving_stats(ds):
    vals = [d for d, mv in zip(ds, moving) if mv and d is not None]
    return sum(1 for d in vals if in_frame(d)), len(vals)
mk = moving_stats(keeper_d)
say("  WHILE MOVING (the discriminating samples): keeper in-frame "
    "%d/%d; ORIGINAL-A %d/%d; ORIGINAL-B %d/%d"
    % (mk[0], mk[1], moving_stats(origA_d)[0], moving_stats(origA_d)[1],
       moving_stats(origB_d)[0], moving_stats(origB_d)[1]))
say("  NOTE the keeper's bound, stated plainly: sampled before each "
    "step, its worst-case error while the subject moves is ONE keeper "
    "cycle of travel (2 s x speed) -- at the fixture's 3 blocks/s "
    "that is exactly the 6.0-block frame radius (max err above). At "
    "sprint speed the same bound would exceed the radius between "
    "cycles; at the citizens' recorded pace (day-10: 573.9 blocks "
    "over 303 driver cycles, legs walked at ~1-3 blocks per cycle of "
    "~17 s) it is far inside. The original arms have no such bound: "
    "their error grows for the whole dwell (max 25.5 / 30.0 above).")
check(ks["in_frame"] >= 0.9 * ks["of"],
      "keeper keeps the walking subject in-frame (>=90% of samples)")
check(mk[0] == mk[1] and moving_stats(origA_d)[0] < mk[0]
      and moving_stats(origB_d)[0] < mk[0],
      "while the subject is actually moving, the keeper never loses "
      "him and both original arms do")
check(arm_stats(origA_d)["in_frame"] < ks["in_frame"]
      and arm_stats(origB_d)["in_frame"] < ks["in_frame"],
      "both original-cadence arms lose the subject more often")

# ---------------------------------------------------------------------------
# P4 STALENESS -- the mirror freezes mid-walk; the subject does not.
# ---------------------------------------------------------------------------
say("P4 STALENESS (publications freeze 120 s mid-walk)")
world = m.World()
director = fresh_director()
del LOG[:]
del TP[:]
FREEZE_AT, RESUME_AT = 40, 160
stale_probes = 0
stale_ok = True
target_held = True
tp_during_freeze = 0
resume_aim_err = None
for t in range(0, 201, 2):
    truth = (float(t), 64.0, 0.0)          # walks east 1 block/s
    if t <= FREEZE_AT or t >= RESUME_AT:
        dd = {"citizen": "Cody", "ts": iso(T0 + t),
              "pos": {"x": truth[0], "y": truth[1], "z": truth[2]}}
        world.ingest_dd("Cody", dd, T0 + t)
    before = len(TP)
    st = m.keeper_step(world, director, now=T0 + t)
    if FREEZE_AT < t < RESUME_AT:
        tp_during_freeze += len(TP) - before
        if world.framing_target.get("Cody") != (40.0, 64.0, 0.0):
            target_held = False
        if t - FREEZE_AT > m.SUBJECT_STALE_S:
            stale_probes += 1
            if st["Cody"]["state"] != "stale":
                stale_ok = False
    if t == RESUME_AT:
        for _n, _c, aim in TP[before:]:
            resume_aim_err = dist(aim, (truth[0], truth[1] + 1.2, truth[2]))
holds = sum(1 for l in LOG if l.startswith("SUBJECT-HOLD"))
resumes = sum(1 for l in LOG if l.startswith("SUBJECT-RESUME"))
say("  stale probes past the 45 s bound: %d (all stale: %s); "
    "SUBJECT-HOLD lines=%d, SUBJECT-RESUME lines=%d"
    % (stale_probes, stale_ok, holds, resumes))
say("  reframes during the 120 s freeze=%d; target held at last fresh "
    "position=%s; resume reframe aim error=%s"
    % (tp_during_freeze, target_held,
       ("%.4f" % resume_aim_err) if resume_aim_err is not None else "NONE"))
check(stale_ok and stale_probes > 0, "stale at every probe past the bound")
check(holds == 1, "SUBJECT-HOLD logged exactly once per episode")
check(tp_during_freeze == 0, "zero reframes issued during the freeze")
check(target_held, "framing target never left the last fresh position")
check(resumes == 1 and resume_aim_err is not None
      and resume_aim_err < 0.01,
      "on resume: one SUBJECT-RESUME and a reframe aimed at the true "
      "current position")


# ---------------------------------------------------------------------------
# P4B BUSY -- a running shot defers actuation, never tracking.
# ---------------------------------------------------------------------------
say("P4B BUSY (shot running: reframes defer, tracking does not)")
world = m.World()
director = fresh_director()
director.busy = True
del LOG[:]
del TP[:]
pubs = json.load(open(os.path.join(FIX, "day10-pubs.json")))[:40]
busy_track_fail = 0
for r in pubs:
    director.busy_since = epoch(r["ts"])   # a live shot, freshly busy
    dd = {"citizen": "Cody", "ts": r["ts"], "pos": r["pos"]}
    world.ingest_dd("Cody", dd, epoch(r["ts"]))
    m.keeper_step(world, director, now=epoch(r["ts"]))
    if world.framing_target.get("Cody") != (
            r["pos"]["x"], r["pos"]["y"], r["pos"]["z"]):
        busy_track_fail += 1
busy_tp = len(TP)
director.busy = False
nxt = json.load(open(os.path.join(FIX, "day10-pubs.json")))[40]
dd = {"citizen": "Cody", "ts": nxt["ts"], "pos": nxt["pos"]}
world.ingest_dd("Cody", dd, epoch(nxt["ts"]))
m.keeper_step(world, director, now=epoch(nxt["ts"]))
say("  40 publications under a running shot: tracking mismatches=%d, "
    "reframes while busy=%d; first publication after the shot ends: "
    "reframes=%d" % (busy_track_fail, busy_tp, len(TP) - busy_tp))
check(busy_track_fail == 0 and busy_tp == 0,
      "busy: tracking exact, zero reframes issued")
check(len(TP) - busy_tp >= 1,
      "busy released: the deferred reframe fires on the next "
      "publication")

# ---------------------------------------------------------------------------
# P5 OCCLUSION HONESTY -- day-10 pubs, day-11-close perception (wrong place).
# ---------------------------------------------------------------------------
perc = json.load(open(os.path.join(FIX, "perception-day11-close.json")))
extra = {"ground": perc.get("ground"), "ring": perc.get("ring")}
pubs = json.load(open(os.path.join(FIX, "day10-pubs.json")))
r = replay(pubs, extra_dd=extra)
say("P5 OCCLUSION HONESTY (day-10 pubs x wrong-place perception): "
    "statuses=%s" % (r["statuses"],))
say("  tracking mismatches=%d/%d, reframes=%d, aim error max=%.4f"
    % (r["track_fail"], r["n"], r["reframes"], r["aim_max"]))
check(r["track_fail"] == 0, "tracking stays exact even when occluded")
check(r["aim_max"] < 0.01, "no frame issued on a stale aim")
say("  (occluded = every LOS station rejected by the fed perception; "
    "the keeper holds rather than framing blind -- the count above is "
    "the blindness price of wrong-place perception, and the reason "
    "Gate B must verify the live mirror is the citizen's OWN current "
    "perception, which in production it is by construction: the "
    "driver publishes it from his own position every cycle.)")

say("VERDICT: %s (%d failed assertion(s))"
    % ("PASS test-subject-keeper" if not fails else "FAIL test-subject-keeper",
       len(fails)))
open(OUT, "w").write("\n".join(lines) + "\n")
raise SystemExit(0 if not fails else 1)
