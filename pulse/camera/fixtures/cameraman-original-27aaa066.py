#!/usr/bin/env python3
"""
cameraman.py -- AI camera operator v2 for the fullscreen Minecraft spectator
client on this box (the Orin). v1 (preserved as cameraman-v1.py) ran a blind
~55 s shot cycle around Cody. v2 makes EVENTS the primary input and demotes
the cycle to a fallback, implementing Synthesis 2 (Camera grammar v2) of
docs/YOUTUBE-FIELD-STUDY.md item by item:

  1. Cut-on-action  -- IMPLEMENTED. An event tail (below) feeds a priority
     queue; a fresh event cuts the camera to its citizen at once. The blind
     cycle runs only when no event has fired for >3 min.
  2. Face-cam on dialogue -- IMPLEMENTED. A citizen chat line cuts to eye
     level: a two-shot on the perpendicular axis when a second citizen is
     within ~40 blocks, else a single face-cam. No lineage publishes yaw
     (and lineage code is off-limits), so heading is estimated from the
     speaker's recent state-feed movement, per the study's own fallback.
  3. Title cards -- CUT. They belong to a film-out/render step that does not
     exist (the "film" is the live screen). The v2 log's CUT lines are the
     machine-readable scene record until a render step exists.
  4. Milestone orbit -- IMPLEMENTED (approximation declared): on a stage
     PASS the camera orbits the citizen at ~5 blocks for ~20 s. Trial scans
     produce artefact coordinates as evidence on the Thor, but they are not
     published into any feed the cameraman may read, so the orbit centres
     on the citizen, who stands at the artefact for S3/S4 verdicts.
  5. Fly-through -- IMPLEMENTED as step-cuts. Every ~30 min of wall time
     (first at +4 min after start, as a day-recap), one aerial traverse of
     the day's changed places in event order (the three anchors seeded at
     start, then event positions >=16 blocks apart, cap 9 stops), ~6 s per
     stop, ending back on the most active citizen. Smooth paths are the
     study's named gap (a): teleports step-cut between stops, as the study
     sanctions until interpolation lands.
  6. Death cam -- IMPLEMENTED. ~3.5 s wide on the death spot (last polled
     position before the death), then FOLLOW the respawned citizen.
  7. Dusk wide / beacon -- CUT for this build: v2 inherits v1's daylight
     hold (/time set 1000), so there is no dusk on camera while v2 runs;
     the night belongs to the Pulse S5 choreography (STOP before dusk,
     dawn still), which this file's STOP semantics serve unchanged.
  8. Buddy-cam default register -- IMPLEMENTED. The fallback cycle's home
     position is eye level near the most recently active citizen; the high
     WIDE survives only as the establishing shot and in fly-throughs.
  9. Log-reveal insert -- CUT, same missing render step as item 3. The
     receipts are published with the footage instead (the study's own
     interim instruction); v2's log is written to be that insert.
 10. POV release discipline -- IMPLEMENTED. /spectate survives only inside
     the fallback cycle; any queued event releases it mid-dwell and cuts
     to the event. Chat never plays over POV.

EVENT TAIL (no lineage code was edited; all sources are read-only):
  * The Orin server log (~/minecraft-server/logs/latest.log), tailed
    locally: citizen chat lines, death messages, joins/leaves, and
    advancement lines (mapped to 'craft'). Cody's base64 BOT_MSG protocol
    lines are ignored for face-cam purposes (machine chatter, not speech).
  * The Thor commons, polled over ssh thor-lan every ~8 s (the feeds tick
    at ~10 s, which sets the reaction floor, as the study notes):
    commons/SCOREBOARD.jsonl (attempt/pass/fail) and the three state
    feeds (pulse/cody-state.json, lineage-b/vega-state.json,
    lineage-c/geist-state.json). Feed diffs add two more event kinds:
    a new inventory item type appearing = 'craft'; a deaths-counter
    increment with no matching log death = 'death' (belt and braces).
  Queue entries: {citizen, kind, pos, ts, detail}; kinds carry priority
  pass>death>craft>chat>attempt/fail, per-(citizen,kind) cooldowns
  (death 75 s -- the night massacres proved why -- chat 75 s, craft 45 s,
  attempt/fail 20 s, pass uncooled), a 12-deep cap, and staleness drops
  (150 s; pass 300 s). A higher-priority event preempts a running
  low-priority shot after a 3 s minimum dwell.

UNCHANGED FROM v1, deliberately, bit-for-bit where it matters:
  * The command channel (xdotool slash/type/Return with human-ish delays)
    and the focus guard: keystrokes are only ever sent after the Minecraft
    window is confirmed active, so the loop can never type into another
    app. If a shot's target is dead/offline the command simply no-ops.
  * The STOP kill switch (~/cameraman/STOP): checked before EVERY shot
    and polled every 0.5 s during every dwell; presence exits the loop
    cleanly with v1's exact log line. The Pulse crew's S5 choreography
    depends on this file behaving exactly as it did in v1.
  * Daylight hold: /time set 1000 + /weather clear at start, /time set
    1000 refreshed every ~5 min (was ~10 min until 2026-11-07 - see DAY_REFRESH_S note), only ever between shots.
CHANGED: the hard self-stop is 8 hours (was 2), per the v2 brief.
Log: ~/cameraman/cameraman.log (same file as v1; v2 lines carry CUT /
EVENT / FLY markers so event->cut decisions can be audited from it).

v3 ADDENDUM (performance lane, 2026-11-09 -- staged file; goes live only
via the renewal procedure, never by editing the running process's file):
Shot intelligence on top of the v2 grammar, driven by the day-3 framing
audit (the camera logging FACE-CAM successes over frames where the
citizen is tiny, clipped or hidden behind the shelf he stands under):
  * LOS-VERIFIED FRAMING: every station (face-cam, working, intent) is
    checked against the citizen's own ground/ring perception before the
    cut; rejections are logged with reasons (the shot log stays the
    curator's correlation source -- v1.1 discipline).
  * THE WORKING SHOT is the default register for craft/attempt/fail and
    idle CLOSE: actor + target block + consequence in one frame.
  * ANTICIPATION: the direct-drive narration (state file) is scanned for
    declared intents; the camera pre-positions at the named place.
  * STALL GRAMMAR: clustered failed results become a shot that frames
    the citizen WITH his obstacle and names it in the log.
  * The Thor poll additionally reads pulse/direct-drive-state.json and
    pulse/direct-drive-places.json when present (absent = v2 behaviour).
Everything else -- STOP semantics, the focus guard, the landing-verified
daylight hold, Cody-only subject discipline -- is v2, unchanged.

BUILD NOTES (2026-11-07, v2 verification): shipped and verified live the
same night. The first build's fly-through sat directly overhead (pitch
90 -- a flat map view); fixed to an oblique (+10,+15,+10, pitch ~47),
and the fly-through's closing FOLLOW now targets the genuinely
most-active citizen by event count, not merely the latest. STOP was
live-tested between builds: file touched 07:24:32 UTC, v1's exact exit
line logged, process gone, file removed, v2 relaunched -- the S5
choreography's contract holds. Verified event->cut decisions in the
log: death (feed-counter) -> DEATH-WIDE + respawn FOLLOW; craft
(new-item feed diffs: stick, oak_log) -> CLOSE orbit x2; chat ->
FACE-CAM and a FACE-2SHOT (perpendicular axis, eye level); scoreboard
stage attempt -> CLOSE. Two fly-throughs ran end-to-end (5 stops each:
the 3 anchors + the day's event places, in event order). Proof frames
v2-proof-event.png / v2-proof-fly.png live in this directory (copies in
the lane workspace, orin-world-live/). Known soft spots: a CLOSE in
cluttered terrain can frame a nameplate through a trunk -- the citizen
is at the shot, the terrain votes too; Geist's feed carries no ts, so
his staleness is judged by file mtime; citizens' greeting loops mean
face-cams recur -- that is the grammar working, not a leak.
"""

import json
import math
import os
import random
import re
import subprocess
import sys
import threading
import time
from datetime import datetime

HOME = os.path.expanduser("~")
BASE = os.path.join(HOME, "cameraman")
STOP_FILE = os.path.join(BASE, "STOP")
LOG_FILE = os.path.join(BASE, "cameraman.log")
SERVER_LOG = os.path.join(HOME, "minecraft-server", "logs", "latest.log")

ENV = dict(os.environ)
ENV["DISPLAY"] = ":0"
ENV.setdefault("XAUTHORITY", os.path.join(HOME, ".Xauthority"))

MAX_RUNTIME_S = 8 * 60 * 60          # hard cap: 8 hours (v1 was 2)
DAY_REFRESH_S = 300                  # re-set morning every ~5 min (tightened 2026-11-07: the ~10 min cycle let timeOfDay reach dusk every cycle and slipped cycles gave minutes of mob night that killed citizens and wiped their inventories - Geist 31->50, Vega 7->20 deaths; 300 s peaks near tod 7000, never near dusk. Real nights remain available on demand by stopping the cameraman - S5/dusk choreography unaffected)
FALLBACK_AFTER_S = 180               # blind cycle only if no event for >3 min
FLY_FIRST_S = 240                    # first fly-through: start + 4 min (day recap)
FLY_EVERY_S = 30 * 60                # then every ~30 min of wall time
THOR_POLL_S = 8                      # commons poll cadence (feeds tick ~10 s)
QUEUE_MAX = 12
STALE_S = 150                        # drop queued events older than this
STALE_PASS_S = 300                   # ...except passes, which keep 5 min

CAMERA = "MagnusandMouse"
CITIZENS = ["Cody"]  # CODY-ONLY subject mode 2026-11-07 (Casey direction: concentrate on one player, camera on Cody; Vega and Geist are being parked by their crews). Full roster was ["Cody", "Vega", "Geist"] - restore this list to bring the rotation back. With the offer() subject filter below, no cut can leave Cody.

PRIORITY = {"pass": 50, "death": 40, "craft": 30, "chat": 25,
            "attempt": 20, "fail": 20, "intent": 35, "stall": 30}
COOLDOWN = {"death": 75, "chat": 75, "craft": 45, "attempt": 20,
            "fail": 20, "pass": 0, "intent": 60, "stall": 240}

FEED_PATHS = {   # relative to ~/craftmind-league on the Thor
    "Cody": "pulse/cody-state.json",
    "Vega": "lineage-b/vega-state.json",
    "Geist": "lineage-c/geist-state.json",
}

# --- v3 (performance lane, 2026-11-09): shot intelligence ------------------
# Day-3 evidence (this lane's framing audit): the v2 FACE-CAM stations the
# camera 2.6 blocks ahead of the citizen at his own eye height with NO
# line-of-sight check. When the citizen works below the camera's shelf --
# Cody in the dip, ~2 blocks down -- the frame is the shelf edge and the
# treetops; sampled day-3 frames show the subject tiny, edge-clipped or
# absent while the shot log records a successful FACE-CAM. Fixes below:
#   LOS-verified framing: at shot time, sample the citizen's live position
#     from his state feed (the direct-drive state file, when present) and
#     try an ordered ring of candidate stations; accept the first whose
#     ray to the citizen's eyes crosses NO named terrain column in the
#     feed's ground/ring survey; log every rejection.
#   Default register: the working shot (hands + target + actor together)
#     replaces bare face-cam as the event default; face-cam survives for
#     genuine dialogue beats.
#   Anticipation: the citizen's own narration (the direct-drive trace's
#     latest `say`, mirrored into the state file) is scanned for intent
#     keywords; a declared intent pre-positions the camera at the named
#     place BEFORE the action lands, instead of cutting on the result.
#   Stall grammar: repeated failed results at near-identical positions
#     (the pin / dip loop) become a shot subject of their own -- the
#     camera frames actor AND obstacle together and says so in the log.
DD_STATE_PATH = "pulse/direct-drive-state.json"   # Thor, when the driver runs
STALL_WINDOW_S = 150          # failures must cluster inside this window
STALL_MIN_FAILS = 3           # ...at least this many...
STALL_RADIUS = 3.0            # ...within this many blocks of each other
STALL_COOLDOWN_S = 240        # one stall shot per citizen per 4 min
INTENT_RULES = [              # (keyword in narration) -> (rule name)
    ("wheat", "wheat"), ("harvest", "wheat"), ("pen", "pen"),
    ("pig", "pen"), ("chicken", "pen"), ("crafting table", "table"),
    ("table", "table"), ("furnace", "furnace"), ("dip", "dip"),
    ("gate", "pen"), ("bread", "table"),
]
LOS_EYE = 1.62                # citizen eye height above feet

ORBIT_OFFSETS = ["~6 ~2 ~0", "~0 ~2 ~6", "~-6 ~2 ~0", "~0 ~2 ~-6"]
CLOSE_RING = ["~-3 ~1 ~3", "~3 ~1 ~-3", "~-3 ~1 ~-3", "~3 ~1 ~3"]
PASS_ORBIT = ["~5 ~2 ~0", "~3.5 ~2 ~3.5", "~0 ~2 ~5", "~-3.5 ~2 ~3.5"]


# --------------------------------------------------------------------------
# v1 plumbing, verbatim: logging, the xdotool channel, the focus guard.
# --------------------------------------------------------------------------

def log(msg):
    line = "%s %s" % (datetime.now().isoformat(timespec="seconds"), msg)
    try:
        with open(LOG_FILE, "a") as fh:
            fh.write(line + "\n")
    except OSError:
        pass
    print(line, flush=True)


def xdotool(*args):
    """Run xdotool; NEVER raise. A hung/failed call reads as empty output,
    which the callers treat as 'window not confirmed' -> shot skipped."""
    try:
        return subprocess.run(
            ["xdotool"] + list(args),
            env=ENV, capture_output=True, text=True, timeout=8,
        )
    except (subprocess.TimeoutExpired, OSError):
        return subprocess.CompletedProcess(args, 1, "", "")


def mc_candidates():
    """Visible 'Minecraft' windows, largest first."""
    res = xdotool("search", "--onlyvisible", "--name", "Minecraft")
    scored = []
    for wid in res.stdout.split():
        geo = xdotool("getwindowgeometry", wid).stdout
        area = 0
        for tok in geo.replace("Geometry:", " ").split():
            if "x" in tok and tok.replace("x", "").isdigit():
                try:
                    w, h = tok.split("x")
                    area = int(w) * int(h)
                except ValueError:
                    pass
        scored.append((area, wid))
    scored.sort(reverse=True)
    return [wid for _, wid in scored]


def mc_window_active():
    """True only if the Minecraft client is the active window. If it is not
    focused, try (non-blocking) to activate it and re-check. This guard is
    what stops the loop typing into any other application: keystrokes are
    only ever sent after this returns True."""
    def active_is_mc():
        wid = xdotool("getactivewindow").stdout.strip()
        if not wid:
            return False
        name = xdotool("getwindowname", wid).stdout
        return "Minecraft" in name

    if active_is_mc():
        return True
    for wid in mc_candidates():
        xdotool("windowactivate", wid)  # no --sync: it can hang on fullscreen
        time.sleep(0.6)
        if active_is_mc():
            return True
    return False


def send_command(body):
    """Type one chat command into the client. `body` excludes the leading
    '/': the slash key opens chat with the slash already in place.
    Returns True if the keystrokes were sent, False if the window guard
    refused (command NOT typed anywhere)."""
    if not mc_window_active():
        log("GUARD: Minecraft window not active; shot skipped, nothing typed")
        return False
    time.sleep(random.uniform(0.25, 0.45))
    xdotool("key", "slash")
    time.sleep(random.uniform(0.3, 0.55))
    xdotool("type", "--delay", str(random.randint(10, 16)), body)
    time.sleep(random.uniform(0.25, 0.45))
    xdotool("key", "Return")
    return True


# --------------------------------------------------------------------------
# Shared world state + event queue (written by the tail threads, read by
# the director). One lock; everything in here is small.
# --------------------------------------------------------------------------

class World:
    def __init__(self):
        self.lock = threading.Lock()
        self.pos = {}            # citizen -> (x, y, z) latest from feed
        self.pos_hist = {}       # citizen -> [(t, (x,y,z)), ...] last ~8
        self.heading = {}        # citizen -> (hx, hz) last good, unit-ish
        self.anchor = {}         # citizen -> (x, y, z)
        self.online = {c: True for c in CITIZENS}   # until a leave/stale says no
        self.feed_mtime = {}     # citizen -> epoch of feed file
        self.inv = {}            # citizen -> set(item names) last snapshot
        self.deaths_seen = {}    # citizen -> deaths counter last snapshot
        self.last_death_log = {} # citizen -> epoch of last log death event
        self.queue = []          # event dicts, unordered; director picks max
        self.last_cool = {}      # (citizen, kind) -> epoch last accepted
        self.last_event_at = 0.0 # epoch of last ACCEPTED event
        self.event_count = {c: 0 for c in CITIZENS}
        self.last_active = "Cody"
        self.day_places = []     # [(label, (x,y,z))] chronological, deduped
        self.scoreboard_seen = set()
        self.scoreboard_primed = False  # first poll only baselines the tail
        # v3 fields (performance lane): richer per-citizen perception.
        self.dd = {}             # citizen -> direct-drive state dict (live)
        self.struct_by_label = {}  # citizen -> {label: (pos, extra dict)}
        self.fail_hist = {}      # citizen -> [(t, pos)] recent failed results
        self.last_stall_shot = {}  # citizen -> epoch of last STALL shot
        self.seen_say_ts = {}    # citizen -> ts of last narration handled
        self.intent_fired = {}   # citizen -> (rule, ts) last anticipation

    # -- events ------------------------------------------------------------
    def offer(self, citizen, kind, pos, detail=""):
        """Gate an event through cooldowns and the queue cap. Returns True
        if accepted. Called by tail threads only."""
        if citizen not in CITIZENS:
            # Cody-only subject mode (2026-11-07): events from a
            # non-subject citizen never reach the queue, so no cut
            # can leave Cody.
            log("DROP subject-filter kind=%s citizen=%s" % (kind, citizen))
            return False
        now = time.time()
        with self.lock:
            cool = COOLDOWN.get(kind, 30)
            last = self.last_cool.get((citizen, kind), 0.0)
            if cool and now - last < cool:
                return False
            if len(self.queue) >= QUEUE_MAX:
                # Make room only for something strictly more important.
                worst = min(self.queue,
                            key=lambda e: PRIORITY.get(e["kind"], 0),
                            default=None)
                if worst is None or PRIORITY.get(kind, 0) <= \
                        PRIORITY.get(worst["kind"], 0):
                    return False
                self.queue.remove(worst)
            self.last_cool[(citizen, kind)] = now
            ev = {"citizen": citizen, "kind": kind, "pos": pos,
                  "ts": now, "detail": detail}
            self.queue.append(ev)
            self.last_event_at = now
            self.event_count[citizen] = self.event_count.get(citizen, 0) + 1
            self.last_active = citizen
            if pos:
                self._note_place("%s %s" % (citizen, kind), pos)
            log("EVENT %-7s citizen=%s detail=%s pos=%s"
                % (kind, citizen, detail or "-", _fmt_pos(pos)))
            return True

    def _note_place(self, label, pos):
        for _, p in self.day_places:
            if _dist(p, pos) < 16:
                return
        if len(self.day_places) < 24:
            self.day_places.append((label, pos))

    def pop_event(self):
        """Highest-priority fresh event, or None. Drops stale entries."""
        now = time.time()
        with self.lock:
            keep = []
            for e in self.queue:
                age = now - e["ts"]
                limit = STALE_PASS_S if e["kind"] == "pass" else STALE_S
                if age <= limit:
                    keep.append(e)
                else:
                    log("DROP stale %s citizen=%s age=%.0fs"
                        % (e["kind"], e["citizen"], age))
            self.queue = keep
            if not self.queue:
                return None
            ev = max(self.queue,
                     key=lambda e: (PRIORITY.get(e["kind"], 0), e["ts"]))
            self.queue.remove(ev)
            return ev

    def top_priority(self):
        with self.lock:
            if not self.queue:
                return -1
            return max(PRIORITY.get(e["kind"], 0) for e in self.queue)

    def queue_len(self):
        with self.lock:
            return len(self.queue)

    # -- citizen state -------------------------------------------------------
    def update_citizen(self, name, pos, anchor, inv_items, deaths, mtime):
        with self.lock:
            if pos:
                self.pos[name] = pos
                hist = self.pos_hist.setdefault(name, [])
                if not hist or _dist(hist[-1][1], pos) > 0.05:
                    hist.append((time.time(), pos))
                    del hist[:-8]
                if len(hist) >= 2:
                    (t0, p0), (t1, p1) = hist[0], hist[-1]
                    dx, dz = p1[0] - p0[0], p1[2] - p0[2]
                    if math.hypot(dx, dz) > 0.5:
                        self.heading[name] = (dx, dz)
            if anchor:
                self.anchor[name] = anchor
            if mtime:
                self.feed_mtime[name] = mtime
            new_items, died = [], False
            if inv_items is not None:
                old = self.inv.get(name)
                if old is not None:
                    new_items = [i for i in inv_items if i not in old]
                self.inv[name] = set(inv_items)
            if deaths is not None:
                prev = self.deaths_seen.get(name)
                if prev is not None and deaths > prev:
                    died = True
                self.deaths_seen[name] = deaths
            return new_items, died

    def snapshot(self, name):
        with self.lock:
            return {
                "pos": self.pos.get(name),
                "heading": self.heading.get(name),
                "anchor": self.anchor.get(name),
                "online": self.online.get(name, False),
                "mtime": self.feed_mtime.get(name, 0.0),
            }

    # -- v3: direct-drive perception (performance lane) --------------------
    def ingest_dd(self, name, dd, mtime):
        """Fold one direct-drive state dict into the world model.

        Position: the driver's own state is the freshest position source
        in the fleet (it ticks every cycle) -- the v2 feeds lag it. We
        still route it through update_citizen so heading history and the
        online/staleness logic behave identically."""
        pos = _pos_of(dd)
        if pos:
            self.update_citizen(name, pos, None, None, None,
                                mtime or time.time())
        structs = {}
        for s in dd.get("structures") or []:
            p = s.get("pos") or {}
            try:
                sp = (float(p["x"]), float(p["y"]), float(p["z"]))
            except (KeyError, TypeError, ValueError):
                continue
            structs[s.get("label", "?")] = (sp, s)
        say = dd.get("say") or dd.get("lastSay") or ""
        res = dd.get("result") or dd.get("lastResult") or {}
        with self.lock:
            self.dd[name] = dd
            if structs:
                self.struct_by_label[name] = structs
            say_ts = dd.get("ts") or dd.get("sayTs")
        # Narration-driven anticipation + stall detection ride the same
        # ingest; both only ever OFFER events (the Director decides).
        if say:
            self._scan_intent(name, say, say_ts)
        if isinstance(res, dict) and res.get("ok") is False and pos:
            with self.lock:
                hist = self.fail_hist.setdefault(name, [])
                hist.append((time.time(), pos))
                del hist[:-12]
            self._check_stall(name)

    def ingest_places(self, name, places):
        """The citizen's places-memory becomes fly-through geography:
        named stops ('the pen', 'the wheat patch') the camera can use
        for establishing shots and anticipation targets."""
        if not isinstance(places, list):
            return
        for pl in places:
            try:
                pos = (float(pl["x"]), float(pl["y"]), float(pl["z"]))
            except (KeyError, TypeError, ValueError):
                continue
            label = "%s: %s" % (name, pl.get("name", "place"))
            with self.lock:
                known = [p for _, p in self.day_places]
            if not any(_dist(pos, p) < 16 for p in known):
                self._note_place(label, pos)

    def _scan_intent(self, name, say, say_ts):
        """Anticipation: a declared intent in the citizen's narration
        pre-positions the camera at the named place/structure BEFORE the
        beat lands. Fires at most once per (citizen, rule) per minute,
        and only for narration not already handled."""
        low = say.lower()
        with self.lock:
            if say_ts and self.seen_say_ts.get(name) == say_ts:
                return
            self.seen_say_ts[name] = say_ts
            last = self.intent_fired.get(name)
            structs = dict(self.struct_by_label.get(name, {}))
        rule = None
        for kw, r in INTENT_RULES:
            if kw in low:
                rule = r
                break
        if not rule:
            return
        if last and last[0] == rule and time.time() - last[1] < 60:
            return
        target, tlabel = None, rule
        if rule == "wheat":
            hit = structs.get("wheat patch")
            target = hit[0] if hit else None
        elif rule == "table":
            hit = structs.get("crafting table")
            target = hit[0] if hit else None
        elif rule == "furnace":
            hit = structs.get("furnace")
            target = hit[0] if hit else None
        elif rule == "pen":
            hit = structs.get("fence gate")
            target = hit[0] if hit else None
        if target is None:
            with self.lock:
                for lbl, p in self.day_places:
                    if rule in lbl.lower():
                        target, tlabel = p, lbl
                        break
        snap = self.snapshot(name)
        if target is None or not snap["pos"]:
            return
        if _dist(target, snap["pos"]) < 6:
            return  # already there; the event cuts will cover it
        with self.lock:
            self.intent_fired[name] = (rule, time.time())
        self.offer(name, "intent", target,
                   detail="intent:%s say=\"%s\"" % (tlabel, say[:60]))

    def _check_stall(self, name):
        """Stall grammar trigger: >=STALL_MIN_FAILS failed results inside
        STALL_WINDOW_S, all within STALL_RADIUS of their centroid."""
        now = time.time()
        with self.lock:
            hist = [(t, p) for (t, p) in self.fail_hist.get(name, [])
                    if now - t <= STALL_WINDOW_S]
            self.fail_hist[name] = hist
            last = self.last_stall_shot.get(name, 0.0)
        if len(hist) < STALL_MIN_FAILS or now - last < STALL_COOLDOWN_S:
            return
        cx = sum(p[0] for _, p in hist) / len(hist)
        cy = sum(p[1] for _, p in hist) / len(hist)
        cz = sum(p[2] for _, p in hist) / len(hist)
        if any(_dist(p, (cx, cy, cz)) > STALL_RADIUS for _, p in hist):
            return
        with self.lock:
            self.last_stall_shot[name] = now
        self.offer(name, "stall", (cx, cy, cz),
                   detail="stall: %d failed results within %.0f blocks"
                          % (len(hist), STALL_RADIUS))

    def set_online(self, name, on):
        with self.lock:
            self.online[name] = on

    def most_active(self):
        with self.lock:
            best, best_key = "Cody", (-1, 0.0)
            for c in CITIZENS:
                key = (self.event_count.get(c, 0),
                       self.last_cool.get((c, "chat"), 0.0))
                if self.event_count.get(c, 0) > best_key[0]:
                    best, best_key = c, key
            return self.last_active if self.event_count.get(
                self.last_active, 0) >= best_key[0] else best


def _fmt_pos(pos):
    if not pos:
        return "-"
    return "(%.1f,%.1f,%.1f)" % pos


def _dist(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


# --------------------------------------------------------------------------
# Event tail 1: the server log (local file).
# --------------------------------------------------------------------------

DEATH_RE = re.compile(
    r": (Cody|Vega|Geist) (was slain|was shot|was impaled|was blown up|"
    r"was killed|fell from|fell out of|drowned|burned to a crisp|"
    r"was struck by|starved to death|suffocated|hit the ground|"
    r"went up in flames|was frozen to death|was squashed|was pummeled|"
    r"was fireballed|died)\b")
CHAT_RE = re.compile(r"<(Cody|Vega|Geist)> (.*)$")
ADV_RE = re.compile(r": (Cody|Vega|Geist) has made the advancement \[(.+)\]")
JOIN_RE = re.compile(r": (Cody|Vega|Geist) (joined|left) the game")


def log_tail(world):
    """Tail latest.log from EOF; parse citizen lines into events."""
    try:
        fh = open(SERVER_LOG, "r", errors="replace")
        fh.seek(0, os.SEEK_END)
    except OSError:
        log("TAIL: cannot open server log; log events disabled")
        return
    while True:
        try:
            line = fh.readline()
            if not line:
                # Rotation/truncation guard.
                try:
                    if os.path.getsize(SERVER_LOG) < fh.tell():
                        fh.close()
                        fh = open(SERVER_LOG, "r", errors="replace")
                except OSError:
                    pass
                time.sleep(1.0)
                continue
        except OSError:
            time.sleep(1.0)
            continue
        line = line.rstrip("\n")
        m = CHAT_RE.search(line)
        if m and "Chat Thread" in line:
            name, text = m.group(1), m.group(2)
            if text.startswith("BOT_MSG:"):
                continue  # framework protocol chatter, not speech
            snap = world.snapshot(name)
            world.offer(name, "chat", snap["pos"],
                        detail="\"%s\"" % text[:60])
            world.set_online(name, True)
            continue
        m = DEATH_RE.search(line)
        if m:
            name = m.group(1)
            with world.lock:
                world.last_death_log[name] = time.time()
                pos = world.pos.get(name)
            world.offer(name, "death", pos, detail=m.group(2))
            continue
        m = ADV_RE.search(line)
        if m:
            snap = world.snapshot(m.group(1))
            world.offer(m.group(1), "craft", snap["pos"],
                        detail="advancement %s" % m.group(2))
            continue
        m = JOIN_RE.search(line)
        if m:
            world.set_online(m.group(1), m.group(2) == "joined")
            log("TAIL %s %s the game" % (m.group(1), m.group(2)))


# --------------------------------------------------------------------------
# Event tail 2: the Thor commons (scoreboard + state feeds) over ssh.
# --------------------------------------------------------------------------

THOR_CMD = (
    "for f in %s; do echo \"==FILE $f\"; "
    "stat -c %%Y ~/craftmind-league/$f 2>/dev/null; "
    "cat ~/craftmind-league/$f 2>/dev/null; echo; done; "
    "echo '==SCOREBOARD'; "
    "tail -n 40 ~/craftmind-league/commons/SCOREBOARD.jsonl 2>/dev/null; "
    "echo; echo '==DDSTATE'; "
    "stat -c %%Y ~/craftmind-league/pulse/direct-drive-state.json 2>/dev/null; "
    "cat ~/craftmind-league/pulse/direct-drive-state.json 2>/dev/null; "
    "echo; echo '==DDPLACES'; "
    "cat ~/craftmind-league/pulse/direct-drive-places.json 2>/dev/null"
) % " ".join(FEED_PATHS[c] for c in CITIZENS)


def _pos_of(feed):
    p = feed.get("pos") or feed.get("position") or {}
    try:
        return (float(p["x"]), float(p["y"]), float(p["z"]))
    except (KeyError, TypeError, ValueError):
        return None


def _anchor_of(feed):
    a = feed.get("anchor") or {}
    try:
        return (float(a["x"]), float(a["y"]), float(a["z"]))
    except (KeyError, TypeError, ValueError):
        return None


def thor_poll(world):
    """One ssh fetch per cycle: 3 feeds + mtimes + scoreboard tail."""
    while True:
        try:
            res = subprocess.run(
                ["ssh", "-o", "ConnectTimeout=5", "-o", "BatchMode=yes",
                 "thor-lan", THOR_CMD],
                capture_output=True, text=True, timeout=25)
            out = res.stdout or ""
        except (subprocess.TimeoutExpired, OSError):
            out = ""
        if out:
            _thor_parse(world, out)
        time.sleep(THOR_POLL_S)


def _dd_parse(world, sections):
    """v3: fold the direct-drive state + places into the world model.

    sections uses the same split shape as _thor_parse: [pre, tag, name,
    body, ...]. DDSTATE carries the driver's live state (position,
    structures in sight, and -- when the driver mirrors it -- the latest
    narration + last result); DDPLACES carries the citizen's own
    places-memory. Everything here is additive: a missing or stale DD
    section changes nothing, and Cody-only subject discipline is kept
    (only CITIZENS are folded in)."""
    dd_state = None
    dd_mtime = 0.0
    places = None
    for i in range(1, len(sections) - 2, 3):
        tag, body = sections[i], sections[i + 2]
        if tag == "DDSTATE":
            lines = body.strip().split("\n", 1)
            if lines and lines[0].strip().isdigit():
                dd_mtime = float(lines[0].strip())
                body = lines[1] if len(lines) > 1 else ""
            try:
                dd_state = json.loads(body)
            except ValueError:
                dd_state = None
        elif tag == "DDPLACES":
            try:
                places = json.loads(body.strip())
            except ValueError:
                places = None
    if dd_state:
        name = dd_state.get("citizen") or "Cody"
        if name in CITIZENS:
            world.ingest_dd(name, dd_state, dd_mtime)
    if places:
        for name in CITIZENS:
            world.ingest_places(name, places)


def _thor_parse(world, out):
    sections = re.split(r"^==(FILE|SCOREBOARD|DDSTATE|DDPLACES) ?(.*)$",
                        out, flags=re.M)
    # sections: [pre, tag, name, body, tag, name, body, ...]
    feeds = {}
    score_lines = []
    for i in range(1, len(sections) - 2, 3):
        tag, name, body = sections[i], sections[i + 1].strip(), sections[i + 2]
        if tag == "FILE":
            lines = body.strip().split("\n", 1)
            mtime = 0.0
            if lines and lines[0].strip().isdigit():
                mtime = float(lines[0].strip())
                body = lines[1] if len(lines) > 1 else ""
            try:
                feeds[name] = (json.loads(body), mtime)
            except ValueError:
                pass
        elif tag == "SCOREBOARD":
            score_lines = [ln for ln in body.strip().split("\n") if ln.strip()]

    path_to_name = {v: k for k, v in FEED_PATHS.items()}
    for path, (feed, mtime) in feeds.items():
        name = path_to_name.get(path)
        if not name:
            continue
        inv = feed.get("inventory")
        inv_items = list(inv.keys()) if isinstance(inv, dict) else None
        deaths = feed.get("deaths")
        new_items, died = world.update_citizen(
            name, _pos_of(feed), _anchor_of(feed), inv_items,
            deaths if isinstance(deaths, (int, float)) else None, mtime)
        # Staleness: a feed untouched for >4 min means the citizen's
        # process is gone -- treat as offline for shot purposes.
        if mtime and time.time() - mtime > 240:
            world.set_online(name, False)
        elif mtime:
            world.set_online(name, True)
        for item in new_items:
            snap = world.snapshot(name)
            world.offer(name, "craft", snap["pos"],
                        detail="new item %s" % item)
        if died:
            with world.lock:
                recent_log = time.time() - world.last_death_log.get(name, 0)
                pos = world.pos.get(name)
            if recent_log > 20:  # the log tail did not already report it
                world.offer(name, "death", pos, detail="feed deaths counter")

    for ln in score_lines:
        key = ln.strip()
        with world.lock:
            if key in world.scoreboard_seen:
                continue
            world.scoreboard_seen.add(key)
            primed = world.scoreboard_primed
        if not primed:
            continue  # baseline snapshot: history is not news
            if len(world.scoreboard_seen) > 400:
                world.scoreboard_seen = set(list(world.scoreboard_seen)[-200:])
        try:
            rec = json.loads(key)
        except ValueError:
            continue
        name = rec.get("citizen")
        kind = {"attempt": "attempt", "pass": "pass",
                "fail": "fail"}.get(rec.get("event"))
        if name in CITIZENS and kind:
            snap = world.snapshot(name)
            world.offer(name, kind, snap["pos"],
                        detail="stage %s" % rec.get("stage", "?"))
    with world.lock:
        world.scoreboard_primed = True
    _dd_parse(world, sections)


# --------------------------------------------------------------------------
# Shot construction. Relative shots ride v1's proven execute-at form;
# absolute shots use /tp with computed yaw/pitch (look_at).
# --------------------------------------------------------------------------

def look_at(cam, target):
    dx, dy, dz = (target[0] - cam[0], target[1] - cam[1],
                  target[2] - cam[2])
    yaw = math.degrees(math.atan2(-dx, dz))
    pitch = math.degrees(math.atan2(-dy, math.hypot(dx, dz)))
    return round(yaw, 1), round(max(-90.0, min(90.0, pitch)), 1)


def tp_abs(cam_pos, target):
    yaw, pitch = look_at(cam_pos, target)
    body = "tp %s %.1f %.1f %.1f %.1f %.1f" % (
        CAMERA, cam_pos[0], cam_pos[1], cam_pos[2], yaw, pitch)
    return send_command(body), "/" + body


def tp_rel(name, citizen, offset):
    body = ("execute at %s run tp %s %s facing entity %s eyes"
            % (citizen, CAMERA, offset, citizen))
    ok = send_command(body)
    log("CUT -> %-10s /%s -> %s" % (name, body, "sent" if ok else "SKIPPED"))
    return ok


def tp_abs_logged(name, cam_pos, target):
    ok, body = tp_abs(cam_pos, target)
    log("CUT -> %-10s %s -> %s" % (name, body, "sent" if ok else "SKIPPED"))
    return ok


# --- v3: LOS-verified framing (performance lane) ---------------------------
# A shot is only as good as its sightline. The citizen's own perception
# (the direct-drive state) names the terrain columns around him: ground
# heights in 4 directions + an 8-column relief ring. A candidate camera
# station is REJECTED when the straight ray from the camera to the
# citizen's eyes passes over a named column whose top is above the ray
# at that point -- the day-3 dip failure, mechanised: the shelf edge
# between camera and citizen is exactly such a column.

def _los_columns(world, name, spos):
    """Named terrain columns near the citizen, from his own perception:
    [(x, z, top_y)] -- the 4-direction ground survey + the relief ring."""
    cols = []
    with world.lock:
        dd = world.dd.get(name) or {}
    ground = dd.get("ground") or {}
    offs = {"N": (0, -1), "S": (0, 1), "E": (1, 0), "W": (-1, 0)}
    for d, (ox, oz) in offs.items():
        spec = ground.get(d) or ""
        if "@y" in spec:
            try:
                top = float(spec.rsplit("@y", 1)[1])
            except ValueError:
                continue
            cols.append((spos[0] + ox, spos[2] + oz, top))
    ring = dd.get("ring")
    if isinstance(ring, str):
        try:
            vals = [int(v) for v in ring.split(",")]
        except ValueError:
            vals = []
        ring_offs = [(-1, -1), (0, -1), (1, -1), (1, 0),
                     (1, 1), (0, 1), (-1, 1), (-1, 0)]
        for v, (ox, oz) in zip(vals, ring_offs):
            cols.append((spos[0] + ox, spos[2] + oz, spos[1] + v))
    return cols


def _los_clear(cam, eye, cols):
    """True when no named column's top pokes above the cam->eye ray.
    Columns within 1.2 blocks of either endpoint are exempt (the
    citizen's own footing, the camera's own perch)."""
    dx, dy, dz = eye[0] - cam[0], eye[1] - cam[1], eye[2] - cam[2]
    span = math.hypot(dx, dz) or 1e-6
    for (cx, cz, top) in cols:
        px, pz = cx - cam[0], cz - cam[2]
        t = (px * dx + pz * dz) / (span * span)
        if t <= 0.0 or t >= 1.0:
            continue
        qx, qz = cam[0] + dx * t, cam[2] + dz * t
        if math.hypot(cx - qx, cz - qz) > 1.2:
            continue
        if math.hypot(cx - eye[0], cz - eye[2]) < 1.2:
            continue
        if math.hypot(cx - cam[0], cz - cam[2]) < 1.2:
            continue
        ray_y = cam[1] + dy * t
        if top + 1.0 > ray_y:      # column top (standing surface) blocks
            return False
    return True


def pick_station(world, name, spos, target=None, dist=4.5, lift=2.2):
    """First LOS-clear station from an ordered candidate ring around the
    ACTION (target block when known, else the citizen), or None when
    every candidate is occluded -- the caller then falls back to v2
    behaviour and the log says why. Every rejection is logged: the shot
    log is the curator's correlation source, so framing decisions and
    their reasons are first-class records (v1.1 discipline)."""
    anchor = target or spos
    eye = (spos[0], spos[1] + LOS_EYE, spos[2])
    cols = _los_columns(world, name, spos)
    snap = world.snapshot(name)
    hx, hz = snap["heading"] or (0.7, 0.7)
    hl = math.hypot(hx, hz) or 1.0
    hx, hz = hx / hl, hz / hl
    base = math.atan2(hx, hz)          # prefer stations facing his front
    order = [0.0, 0.8, -0.8, 1.6, -1.6, 2.4, -2.4, 3.14]
    for da in order:
        a = base + da
        cam = (anchor[0] + math.sin(a) * dist,
               max(anchor[1], spos[1]) + lift,
               anchor[2] + math.cos(a) * dist)
        if _los_clear(cam, eye, cols):
            log("LOS ok station a=%.1f cam=%s eye=%s"
                % (a, _fmt_pos(cam), _fmt_pos(eye)))
            return cam
        log("LOS reject station a=%.1f cam=%s (occluded)"
            % (a, _fmt_pos(cam)))
    return None


class ExitLoop(Exception):
    pass


class Director:
    def __init__(self, world):
        self.world = world
        self.started = time.time()
        self.last_day_set = 0.0
        self.orbit_idx = 0
        self.close_idx = 0
        self.next_fly = self.started + FLY_FIRST_S
        self._anchors_done = False
        # Hold-guard state (2026-11-08, INCIDENT-HOLD-LOSS): byte offset
        # into the server log already scanned for landing evidence, and
        # the consecutive-unlanded-refresh counter.
        self._srv_offset = 0
        self._daylight_fails = 0
        try:
            self._srv_offset = os.path.getsize(SERVER_LOG)
        except OSError:
            pass

    # -- v1 invariants -------------------------------------------------------
    def check_stop(self):
        if os.path.exists(STOP_FILE):
            log("STOP file present -- exiting cleanly")
            raise ExitLoop()
        if time.time() - self.started > MAX_RUNTIME_S:
            log("8-hour cap reached -- exiting")
            raise ExitLoop()

    def dwell(self, seconds, preempt_above=-1, pov=False):
        """Sleep in 0.5 s slices (v1 STOP promptness). Returns 'done',
        or 'preempted' if a strictly hotter event is waiting (after a
        3 s minimum). POV dwells preempt on ANY event (grammar item 10)."""
        end = time.time() + seconds
        t0 = time.time()
        while time.time() < end:
            self.check_stop()
            if pov and self.world.queue_len() > 0:
                return "preempted"
            if preempt_above >= 0 and time.time() - t0 >= 3.0 \
                    and self.world.top_priority() > preempt_above:
                return "preempted"
            time.sleep(0.5)
        return "done"

    # -- hold guard (2026-11-08): a refresh counts only if it LANDS -------
    # The 2026-11-08 incident: a modal screen (Social Interactions) ate
    # every keystroke for ~90 min while this loop logged DAYLIGHT on
    # keystrokes-sent alone and the world ran real nights. "Sent" is not
    # "landed": landing is proven only by the server log line the command
    # produces. See ~/cameraman/INCIDENT-HOLD-LOSS-2026-11-08.md.
    def _scan_server_log(self):
        """Text appended to the server log since the previous scan."""
        try:
            size = os.path.getsize(SERVER_LOG)
        except OSError:
            return ""
        if size < self._srv_offset:      # rotated / truncated
            self._srv_offset = 0
        try:
            with open(SERVER_LOG, "r", errors="replace") as fh:
                fh.seek(self._srv_offset)
                text = fh.read()
                self._srv_offset = fh.tell()
        except OSError:
            return ""
        return text

    def _attempt_daylight(self, kind, allow_recovery=True):
        """Send /time set 1000 and verify it landed in the server log.
        Two consecutive unlanded attempts: log a HOLD-LOST alarm, try ONE
        documented recovery (Escape modal-dismiss through the focus
        guard -- the diagnosed 2026-11-08 cause), and if that fails park
        via the STOP file instead of typing into the void."""
        self._scan_server_log()          # drain stale lines: check is fresh
        sent = send_command("time set 1000")
        landed = False
        if sent:
            end = time.time() + 8.0
            while time.time() < end:
                self.check_stop()
                if "Set minecraft:overworld to 1000" in self._scan_server_log():
                    landed = True
                    break
                time.sleep(0.5)
        if landed:
            self._daylight_fails = 0
            log("DAYLIGHT /time set 1000 (%s) -- VERIFIED LANDED in server log"
                % kind)
            return True
        self._daylight_fails += 1
        log("HOLD-LOST WARNING: /time set 1000 (%s) did NOT land in server "
            "log (sent=%s, consecutive failures=%d)"
            % (kind, sent, self._daylight_fails))
        if self._daylight_fails >= 2 and allow_recovery:
            log("HOLD-LOST ALARM: two consecutive unlanded refreshes -- "
                "attempting one modal-dismiss recovery, then parking if "
                "it fails")
            if mc_window_active():
                xdotool("key", "Escape")
                time.sleep(1.0)
            if self._attempt_daylight("recovery", allow_recovery=False):
                log("HOLD RECOVERED: refresh landed after modal-dismiss")
                return True
            log("HOLD-LOST ALARM: recovery failed -- parking cameraman "
                "via STOP rather than typing into the void")
            try:
                open(STOP_FILE, "a").close()
            except OSError:
                pass
            raise ExitLoop()
        return False

    def daylight(self):
        if time.time() - self.last_day_set > DAY_REFRESH_S:
            self._attempt_daylight("refresh")
            self.last_day_set = time.time()
            time.sleep(1.0)

    # -- sequences -----------------------------------------------------------
    def seq_close_orbit(self, ev, dwells=2):
        """craft / stage business: CLOSE orbit around the citizen."""
        prio = PRIORITY.get(ev["kind"], 0)
        for i in range(dwells):
            self.check_stop()
            off = CLOSE_RING[self.close_idx % len(CLOSE_RING)]
            self.close_idx += 1
            tp_rel("CLOSE", ev["citizen"], off)
            if self.dwell(9.0, preempt_above=prio) == "preempted":
                log("PREEMPT during %s shot (hotter event queued)"
                    % ev["kind"])
                return

    def seq_pass_orbit(self, ev):
        log("MILESTONE orbit for %s %s" % (ev["citizen"], ev["detail"]))
        for off in PASS_ORBIT:
            self.check_stop()
            tp_rel("ORBIT", ev["citizen"], off)
            self.dwell(5.0)

    def seq_death(self, ev):
        spot = ev["pos"] or self.world.snapshot(ev["citizen"])["pos"]
        if spot:
            cam = (spot[0] + 10, spot[1] + 14, spot[2] + 10)
            self.check_stop()
            tp_abs_logged("DEATH-WIDE", cam, spot)
            self.dwell(3.5)
        # FOLLOW the respawn return: wherever the citizen now stands.
        for _ in range(2):
            self.check_stop()
            off = ORBIT_OFFSETS[self.orbit_idx % len(ORBIT_OFFSETS)]
            self.orbit_idx += 1
            tp_rel("FOLLOW", ev["citizen"], off)
            if self.dwell(9.0, preempt_above=PRIORITY["death"]) == "preempted":
                return

    # -- v3 sequences (performance lane) ------------------------------------
    def seq_working(self, ev):
        """THE WORKING SHOT -- the v3 default register. Frames the actor,
        his hands' target and the consequence together: station picked
        LOS-clear at ~4.5 blocks, aimed at the midpoint of citizen and
        target. Used for craft/attempt/fail and (at longer range) chat
        when no partner is near. Replaces v2's bare CLOSE orbit, whose
        execute-at offsets never checked the sightline."""
        name = ev["citizen"]
        snap = self.world.snapshot(name)
        spos = snap["pos"]
        if not spos:
            log("WORKING skipped: no position for %s" % name)
            return
        target = None
        with self.world.lock:
            structs = dict(self.world.struct_by_label.get(name, {}))
        kind = ev["kind"]
        if kind == "craft":
            hit = structs.get("crafting table") or structs.get("furnace")
            target = hit[0] if hit else None
        cam = pick_station(self.world, name, spos, target=target)
        aim = target or (spos[0], spos[1] + 1.2, spos[2])
        if target:
            aim = ((spos[0] + target[0]) / 2, spos[1] + 1.2,
                   (spos[2] + target[2]) / 2)
        if cam:
            self.check_stop()
            tp_abs_logged("WORKING", cam, aim)
            log("WORKING %s target=%s" % (name, _fmt_pos(target)))
        else:
            log("WORKING fallback to CLOSE orbit (no LOS-clear station)")
            self.seq_close_orbit(ev, dwells=1)
            return
        self.dwell(10.0, preempt_above=PRIORITY.get(kind, 0))

    def seq_intent(self, ev):
        """ANTICIPATION: the citizen declared where he is going (his own
        narration, via the trace). Be there first: a wide establishing
        station at the destination, LOS-checked against HIS position,
        then hold so the arrival and the beat land inside the frame."""
        name = ev["citizen"]
        dest = ev["pos"]
        snap = self.world.snapshot(name)
        spos = snap["pos"]
        if not dest or not spos:
            log("INTENT skipped (no dest/pos)")
            return
        cam = None
        cols = _los_columns(self.world, name, spos)
        eye = (dest[0], dest[1] + LOS_EYE, dest[2])
        for da in (0.6, -0.6, 1.5, -1.5, 3.14):
            cand = (dest[0] + math.sin(da) * 7.0, dest[1] + 3.0,
                    dest[2] + math.cos(da) * 7.0)
            if _los_clear(cand, eye, cols):
                cam = cand
                break
            log("LOS reject INTENT station a=%.1f cam=%s" % (da,
                                                             _fmt_pos(cand)))
        self.check_stop()
        if cam:
            tp_abs_logged("INTENT", cam, eye)
        else:
            tp_abs_logged("INTENT-WIDE",
                          (dest[0] + 10, dest[1] + 14, dest[2] + 10), dest)
        log("INTENT pre-positioned for %s at %s (%s)"
            % (name, _fmt_pos(dest), ev["detail"]))
        self.dwell(12.0, preempt_above=PRIORITY["intent"])

    def seq_stall(self, ev):
        """STALL GRAMMAR: when the citizen is pinned (repeated failed
        results at one spot), stop pretending the frame is about his
        face. Frame actor AND obstacle together from a raised oblique,
        so the viewer can SEE what is beating him; the log line names
        the stall as the shot's subject."""
        name = ev["citizen"]
        c = ev["pos"]
        if not c:
            return
        self.check_stop()
        cam = (c[0] + 8, c[1] + 7, c[2] + 8)
        tp_abs_logged("STALL", cam, (c[0], c[1] + 1.0, c[2]))
        log("STALL shot: %s framed with his obstacle at %s (%s)"
            % (name, _fmt_pos(c), ev["detail"]))
        self.dwell(10.0, preempt_above=PRIORITY["stall"])
        # ...and a closer look at the actor's face in the trap.
        snap = self.world.snapshot(name)
        spos = snap["pos"] or c
        cam2 = pick_station(self.world, name, spos, dist=3.2, lift=1.4)
        if cam2:
            self.check_stop()
            tp_abs_logged("STALL-CLOSE", cam2,
                          (spos[0], spos[1] + LOS_EYE, spos[2]))
            self.dwell(6.0, preempt_above=PRIORITY["stall"])

    def seq_chat(self, ev):
        speaker = ev["citizen"]
        snap = self.world.snapshot(speaker)
        spos = snap["pos"]
        if not spos:
            log("FACE-CAM skipped: no position for %s" % speaker)
            return
        # Nearest other online citizen, for the two-shot test.
        partner, ppos, best = None, None, 1e9
        for c in CITIZENS:
            if c == speaker:
                continue
            s = self.world.snapshot(c)
            if s["pos"] and s["online"]:
                d = _dist(spos, s["pos"])
                if d < best:
                    partner, ppos, best = c, s["pos"], d
        self.check_stop()
        if partner and best <= 40:
            mx, mz = (spos[0] + ppos[0]) / 2, (spos[2] + ppos[2]) / 2
            my = (spos[1] + ppos[1]) / 2 + 1.6
            ax, az = ppos[0] - spos[0], ppos[2] - spos[2]
            alen = math.hypot(ax, az) or 1.0
            px, pz = -az / alen, ax / alen     # perpendicular axis
            cam = (mx + px * 3.2, my, mz + pz * 3.2)
            tp_abs_logged("FACE-2SHOT", cam, (mx, my, mz))
            log("FACE-CAM two-shot: %s + %s (%.0f blocks apart)"
                % (speaker, partner, best))
        else:
            # v3: the face-cam station is LOS-verified like every other
            # station (day-3's occluded face-cams are the defect this
            # replaces). No clear station -> working shot instead.
            cam = pick_station(self.world, speaker, spos,
                               dist=2.8, lift=0.0)
            if cam:
                cam = (cam[0], spos[1] + 1.6, cam[2])
                self.check_stop()
                tp_abs_logged("FACE-CAM", cam,
                              (spos[0], spos[1] + 1.62, spos[2]))
                log("FACE-CAM single (LOS): %s" % speaker)
            else:
                log("FACE-CAM occluded everywhere; WORKING shot instead")
                self.seq_working(ev)
                return
        self.dwell(10.0, preempt_above=PRIORITY["chat"])

    def run_event(self, ev):
        log("CUT reason=%s citizen=%s detail=%s"
            % (ev["kind"], ev["citizen"], ev["detail"] or "-"))
        if ev["kind"] == "pass":
            self.seq_pass_orbit(ev)
        elif ev["kind"] == "death":
            self.seq_death(ev)
        elif ev["kind"] == "intent":
            self.seq_intent(ev)
        elif ev["kind"] == "stall":
            self.seq_stall(ev)
        elif ev["kind"] == "chat":
            self.seq_chat(ev)
        elif ev["kind"] == "craft":
            self.seq_working(ev)          # v3: working shot is the default
        else:  # attempt / fail
            self.seq_working(ev)

    # -- fly-through -----------------------------------------------------------
    def flythrough(self):
        with self.world.lock:
            stops = list(self.world.day_places)
        hero = self.world.most_active()
        if len(stops) < 2:
            log("FLYTHROUGH skipped: only %d place(s) known" % len(stops))
            return
        stops = stops[:9]
        log("FLYTHROUGH start: %d stops, ending on %s"
            % (len(stops), hero))
        for i, (label, pos) in enumerate(stops):
            self.check_stop()
            if self.world.top_priority() >= PRIORITY["death"]:
                log("FLYTHROUGH cut short at stop %d: hot event queued" % i)
                break
            # Oblique aerial, not a map view: offset horizontally as
            # well as up, so builds read in 3D (the first live traverse
            # sat directly overhead at pitch 90 -- a flat map, no depth).
            cam = (pos[0] + 10, pos[1] + 15, pos[2] + 10)
            tp_abs_logged("FLY %d/%d" % (i + 1, len(stops)), cam, pos)
            log("FLY stop %s at %s" % (label, _fmt_pos(pos)))
            self.dwell(6.0)
        self.check_stop()
        off = ORBIT_OFFSETS[self.orbit_idx % len(ORBIT_OFFSETS)]
        self.orbit_idx += 1
        tp_rel("FOLLOW", hero, off)
        log("FLYTHROUGH end -> FOLLOW %s" % hero)
        self.dwell(6.0)

    # -- fallback (the v1 cycle, demoted + buddy-cam register) -----------------
    def fallback_step(self, step_idx):
        subj = self.world.most_active()
        name = ["WIDE", "FOLLOW", "CLOSE", "FOLLOW", "POV"][step_idx % 5]
        self.check_stop()
        if name == "WIDE":
            tp_rel("WIDE", subj, "~10 ~14 ~10")
            self.dwell(random.uniform(9.0, 12.0))
        elif name == "FOLLOW":
            off = ORBIT_OFFSETS[self.orbit_idx % len(ORBIT_OFFSETS)]
            self.orbit_idx += 1
            tp_rel("FOLLOW[%s]" % off, subj, off)
            self.dwell(random.uniform(9.0, 12.0))
        elif name == "CLOSE":
            # v3: idle CLOSE becomes an LOS-checked working shot of
            # whatever the citizen is doing; the blind offset survives
            # only as the no-clear-station fallback.
            snap = self.world.snapshot(subj)
            spos = snap["pos"]
            cam = pick_station(self.world, subj, spos) if spos else None
            if cam:
                tp_abs_logged("WORKING-IDLE", cam,
                              (spos[0], spos[1] + 1.2, spos[2]))
                log("WORKING-IDLE %s" % subj)
            else:
                tp_rel("CLOSE", subj, "~-3 ~1 ~3")
            self.dwell(random.uniform(9.0, 12.0))
        elif name == "POV":
            ok = send_command("spectate %s %s" % (subj, CAMERA))
            log("CUT -> POV        /spectate %s %s -> %s"
                % (subj, CAMERA, "sent" if ok else "SKIPPED"))
            r = self.dwell(random.uniform(10.0, 12.0), pov=True)
            if send_command("spectate"):
                log("POV-END /spectate (release)")
            time.sleep(0.5)
            if r == "preempted":
                log("POV released early: event queued (grammar item 10)")

    # -- main loop ---------------------------------------------------------------
    def run(self):
        log("cameraman v2 starting (pid %d); camera=%s citizens=%s"
            % (os.getpid(), CAMERA, ",".join(CITIZENS)))
        self._attempt_daylight("start")
        time.sleep(1.0)
        if send_command("weather clear"):
            log("WEATHER /weather clear (start)")
        self.last_day_set = time.time()
        # Seed the day's places with the anchors once feeds arrive.
        fb_idx = 0
        in_fallback = False
        while True:
            self.check_stop()
            self.daylight()
            if not self._anchors_done:
                with self.world.lock:
                    have = [p for _, p in self.world.day_places]
                    for c in CITIZENS:
                        a = self.world.anchor.get(c)
                        if a and not any(_dist(a, p) < 16 for p in have):
                            self.world._note_place("%s anchor" % c, a)
                    if len(self.world.anchor) >= 3 or \
                            time.time() - self.started > 90:
                        self._anchors_done = True
            if time.time() >= self.next_fly:
                self.next_fly = time.time() + FLY_EVERY_S
                self.flythrough()
                continue
            ev = self.world.pop_event()
            if ev is not None:
                if in_fallback:
                    log("FALLBACK exit (event)")
                    in_fallback = False
                self.run_event(ev)
                continue
            idle = time.time() - max(self.world.last_event_at,
                                     self.started)
            if idle > FALLBACK_AFTER_S:
                if not in_fallback:
                    log("FALLBACK enter (no event for >%ds)" % FALLBACK_AFTER_S)
                    in_fallback = True
                self.fallback_step(fb_idx)
                fb_idx += 1
            else:
                # Quiet stretch between events: wait in STOP-checked slices.
                end = time.time() + 1.0
                while time.time() < end:
                    self.check_stop()
                    if self.world.queue_len() > 0:
                        break
                    time.sleep(0.5)


def main():
    world = World()
    threading.Thread(target=log_tail, args=(world,), daemon=True).start()
    threading.Thread(target=thor_poll, args=(world,), daemon=True).start()
    Director(world).run()


if __name__ == "__main__":
    try:
        main()
    except ExitLoop:
        sys.exit(0)
    except KeyboardInterrupt:
        log("interrupted -- exiting")
        sys.exit(0)
    except Exception as exc:  # never die noisily in a detached loop
        log("FATAL %r -- exiting" % (exc,))
        sys.exit(1)
