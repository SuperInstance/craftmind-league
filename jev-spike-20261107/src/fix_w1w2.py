#!/usr/bin/env python3
"""Two repairs: (1) W1/W2 mislabelled sub-clips from the first make_clips run
(W1-q0 actually contains W2-q3 content etc.) - rebuild the full W1 and W2
sets cleanly; (2) fill the two missing frames (W3, W5) from neighbours."""
import json, os, shutil
import cv2
from datetime import datetime, timezone

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
WDIR = f"{SPIKE}/windows"

def ep(s):
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc).timestamp()

segs = {}
for f in sorted(os.listdir(WDIR)):
    if f.startswith("seg-") and f.endswith(".mp4"):
        segs[int(f[4:-4])] = os.path.join(WDIR, f)
caps = {}
def read_at(t):
    for s in sorted(segs):
        if s <= t < s + 121:
            p = segs[s]
            if p not in caps: caps[p] = cv2.VideoCapture(p)
            cap = caps[p]
            fps = cap.get(cv2.CAP_PROP_FPS) or 8.0
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(round((t - s) * fps)))
            ok, fr = cap.read()
            return fr if ok else None
    return None

fourcc = cv2.VideoWriter_fourcc(*"mp4v")
windows = {w["id"]: w for w in json.load(open(f"{SPIKE}/windows.json"))}
for wid in ("W1", "W2"):
    t0 = ep(windows[wid]["start"])
    for q in range(4):
        out = f"{SPIKE}/clips/{wid}-q{q}.mp4"
        tmp = out + ".tmp.mp4"
        wr = cv2.VideoWriter(tmp, fourcc, 8.0, (1280, 720))
        n = 0
        for i in range(240):
            fr = read_at(t0 + 30 * q + i / 8.0)
            if fr is None: break
            if fr.shape[1] != 1280 or fr.shape[0] != 720:
                fr = cv2.resize(fr, (1280, 720))
            wr.write(fr); n += 1
        wr.release()
        if n >= 200:
            os.replace(tmp, out)
            print(wid, f"q{q}", "rebuilt frames", n, "size", os.path.getsize(out), flush=True)
        else:
            print(wid, f"q{q}", "SHORT", n, flush=True)
            if os.path.exists(tmp): os.remove(tmp)

# missing frames: copy nearest existing neighbour in the same window dir
for wid in ("W3", "W5"):
    d = f"{SPIKE}/frames/{wid}"
    have = sorted(f for f in os.listdir(d) if f.endswith(".jpg"))
    idx = sorted(int(f[1:3]) for f in have)
    missing = [k for k in range(40) if k not in idx]
    for k in missing:
        src = f"{d}/f{min(idx, key=lambda j: abs(j - k)):02d}.jpg"
        dst = f"{d}/f{k:02d}.jpg"
        shutil.copyfile(src, dst)
        print(wid, "frame", k, "filled from", os.path.basename(src), flush=True)
for c in caps.values():
    c.release()
