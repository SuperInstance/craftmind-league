#!/usr/bin/env python3
"""Roaming verification watch for the wander-watchdog repair.
Polls pulse/cody-state.json every 10 s; also scans the resident log for
watchdog / goal events by byte offset. Writes pulse/roam-watch.jsonl.
Exits early with event ROAM-VERIFIED when the brief's success criteria
are met (>=2 goals resolved: reached or watchdog-abandoned, cumulative
path >= 15 blocks from the pin cell, max Chebyshev > 18) and prints a
final SUMMARY json either way. Duration via argv[1] seconds (default
2700 = 45 min)."""
import json, time, math, os, sys

PULSE = "/home/caseydigennaro/craftmind-league/pulse"
LOG = "/home/caseydigennaro/craftmind-league/logs/resident-cody.log"
OUT = os.path.join(PULSE, "roam-watch.jsonl")
DUR = int(sys.argv[1]) if len(sys.argv) > 1 else 2700
PIN = (39.6, -94.3)  # pin cell x,z (y=67)
SPAWN = (32, -96)

out = open(OUT, "a", buffering=1)
log_off = os.path.getsize(LOG)
reached = 0
abandoned = 0
targets = 0
path_len = 0.0
max_disp_pin = 0.0
max_cheb = 0.0
xcells = {}
prev = None
deaths0 = None
deaths = None
start = time.time()
out.write(json.dumps({"event": "ROAM-WATCH-START", "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "durS": DUR}) + "\n")

def scan_log():
    global log_off, reached, abandoned, targets
    try:
        with open(LOG, "rb") as f:
            f.seek(log_off)
            data = f.read().decode("utf-8", "replace")
            log_off = f.tell()
    except OSError:
        return
    for line in data.splitlines():
        if "wander goal reached" in line:
            reached += 1
            out.write(json.dumps({"event": "GOAL-REACHED", "line": line.strip()}) + "\n")
        elif "wander watchdog: goal" in line:
            abandoned += 1
            out.write(json.dumps({"event": "GOAL-WEDGED", "line": line.strip()}) + "\n")
        elif "wandering toward" in line:
            targets += 1

exit_reason = "TIMEOUT"
while time.time() - start < DUR:
    scan_log()
    try:
        st = json.load(open(os.path.join(PULSE, "cody-state.json")))
        p = st["pos"]; x, z = p["x"], p["z"]
        if deaths0 is None:
            deaths0 = st.get("deaths")
        deaths = st.get("deaths")
        if prev is not None:
            path_len += math.hypot(x - prev[0], z - prev[1])
        prev = (x, z)
        disp_pin = math.hypot(x - PIN[0], z - PIN[1])
        max_disp_pin = max(max_disp_pin, disp_pin)
        cheb = max(abs(x - SPAWN[0]), abs(z - SPAWN[1]))
        max_cheb = max(max_cheb, cheb)
        cell = f"{math.floor(x*2)/2:.1f},{math.floor(z*2)/2:.1f}"
        xcells[cell] = xcells.get(cell, 0) + 1
        out.write(json.dumps({"ts": st["ts"], "pos": p, "hp": st.get("health"),
                              "deaths": deaths, "dispPin": round(disp_pin, 2),
                              "pathLen": round(path_len, 2), "cheb": round(cheb, 1)}) + "\n")
        resolved = reached + abandoned
        if resolved >= 2 and path_len >= 15 and max_cheb > 18:
            exit_reason = "ROAM-VERIFIED"
            break
    except Exception as e:
        out.write(json.dumps({"error": str(e)}) + "\n")
    time.sleep(10)

scan_log()
summary = {"event": "SUMMARY", "reason": exit_reason,
           "elapsedS": round(time.time() - start),
           "goalsReached": reached, "goalsWedged": abandoned, "targetsDrawn": targets,
           "pathLen": round(path_len, 2), "maxDispFromPin": round(max_disp_pin, 2),
           "maxCheb": round(max_cheb, 1), "deathsStart": deaths0, "deathsEnd": deaths,
           "topCells": sorted(xcells.items(), key=lambda kv: -kv[1])[:6]}
out.write(json.dumps(summary) + "\n")
print(json.dumps(summary))
