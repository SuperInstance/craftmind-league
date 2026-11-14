#!/usr/bin/env python3
# watch-launch.py — Litter Lab clearance watcher (Amendment 6).
# Polls the three citizen state feeds every 60 s; when all three
# citizens are >=30 blocks (horizontal, point-to-course-segment)
# clear AND all feeds are fresh (mtime <150 s) AND no runner is
# live, it launches the staged Amendment 3 resumption
# (run-ab2.js, fresh probe name, LITTER_START_RUN=2) and exits.
# Stands down after 90 minutes. Every check is appended to
# results/watch.log.
import json, math, os, random, subprocess, sys, time

LAB = os.path.expanduser("~/craftmind-league/litter-lab")
LEAGUE = os.path.expanduser("~/craftmind-league")
LOG = os.path.join(LAB, "results", "watch.log")
FEEDS = [
    ("Cody", os.path.join(LEAGUE, "pulse", "cody-state.json"), "pos"),
    ("Vega", os.path.join(LEAGUE, "lineage-b", "vega-state.json"), "position"),
    ("Geist", os.path.join(LEAGUE, "lineage-c", "geist-state.json"), "position"),
]
NODE = os.path.expanduser("~/.nvm/versions/node/v22.23.4/bin/node")


def log(msg):
    line = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()) + " " + msg
    with open(LOG, "a") as f:
        f.write(line + "\n")
    print(line, flush=True)


def seg_dist(px, pz, a, b):
    ax, az = a
    bx, bz = b
    dx, dz = bx - ax, bz - az
    t = max(0.0, min(1.0, ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz)))
    return math.hypot(px - (ax + t * dx), pz - (az + t * dz))


def main():
    course = json.load(open(os.path.join(LAB, "course.json")))
    a = (course["start"]["x"], course["start"]["z"])
    b = (course["end"]["x"], course["end"]["z"])
    deadline = time.time() + 90 * 60
    log("watcher start; gate: all citizens >=30.0 clear, feeds <150 s old")
    while time.time() < deadline:
        readings = []
        ok = True
        for name, path, key in FEEDS:
            try:
                age = time.time() - os.path.getmtime(path)
                d = json.load(open(path))
                p = d[key]
                c = seg_dist(p["x"], p["z"], a, b)
                readings.append("%s %.1f (feed %.0fs)" % (name, c, age))
                if age > 150 or c < 30.0:
                    ok = False
            except Exception as e:
                readings.append("%s ERR %s" % (name, e))
                ok = False
        running = subprocess.run(["pgrep", "-f", "node run-ab2.js"],
                                 capture_output=True).returncode == 0
        log("check: " + "; ".join(readings) + ("; runner live" if running else ""))
        if ok and not running:
            name = "LitterRun%d" % random.randint(1000, 9999)
            env = dict(os.environ, LITTER_USER=name, LITTER_START_RUN="2")
            out = open(os.path.join(LAB, "results", "ab2e.log"), "a")
            subprocess.Popen([NODE, "run-ab2.js"], cwd=LAB, env=env,
                             stdout=out, stderr=subprocess.STDOUT,
                             stdin=subprocess.DEVNULL, start_new_session=True)
            log("WINDOW OPEN - launched resumption as %s (log results/ab2e.log)" % name)
            return 0
        time.sleep(60)
    log("WINDOW NEVER OPENED in 90 min - standing down; runs 2-10 unrun")
    return 0


if __name__ == "__main__":
    sys.exit(main())
