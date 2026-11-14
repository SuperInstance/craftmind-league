#!/usr/bin/env python3
"""Cut each window into 4 x 30 s sub-clips for the V-JEPA arm (stream copy;
cuts snap to keyframes, a few seconds of drift is expected and declared).
Output: clips/<WID>-q<0..3>.mp4, each built from the one or two source
segments the sub-window spans (concat demuxer on matching encodes)."""
import json, os, subprocess
from datetime import datetime, timezone

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
WDIR = f"{SPIKE}/windows"

def ep(s):
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc).timestamp()

segs = []
for f in sorted(os.listdir(WDIR)):
    if f.startswith("seg-") and f.endswith(".mp4"):
        segs.append((int(f[4:-4]), os.path.join(WDIR, f)))
segs.sort()

def covering(a, b):
    return [(s, p) for (s, p) in segs if s < b and s + 121 > a]

windows = json.load(open(f"{SPIKE}/windows.json"))
for w in windows:
    t0 = ep(w["start"])
    for q in range(4):
        a, b = t0 + 30 * q, t0 + 30 * (q + 1)
        out = f"{SPIKE}/clips/{w['id']}-q{q}.mp4"
        if os.path.exists(out) and os.path.getsize(out) > 10000:
            print(out, "exists"); continue
        cov = covering(a, b)
        if len(cov) == 1:
            s, p = cov[0]
            r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a - s:.2f}", "-i", p,
                                "-t", "30", "-c", "copy", out], capture_output=True, text=True)
        elif len(cov) == 2:
            (s1, p1), (s2, p2) = cov
            lst = f"{SPIKE}/clips/{w['id']}-q{q}.txt"
            open(lst, "w").write(f"file '{p1}'\nfile '{p2}'\n")
            r = subprocess.run(["ffmpeg", "-v", "error", "-f", "concat",
                                "-i", lst, "-ss", f"{a - s1:.2f}", "-t", "30",
                                "-c", "copy", out], capture_output=True, text=True)
            os.remove(lst)
        else:
            print(w["id"], q, "covering segments:", len(cov)); continue
        ok = os.path.exists(out) and os.path.getsize(out) > 10000
        print(w["id"], f"q{q}", "ok" if ok else f"FAIL {r.stderr[:160]}")
