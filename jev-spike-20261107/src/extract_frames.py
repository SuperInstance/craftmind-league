#!/usr/bin/env python3
"""Extract frames at 1 per 3 s for each spike window, via OpenCV (the Thor
ffmpeg build has no scale filter and cannot emit JPEG; cv2 is the working
path on this box). Same sampling plan as declared in METHODS.md."""
import json, os
import cv2
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

windows = json.load(open(f"{SPIKE}/windows.json"))
caps = {}
def frame_at(t):
    for (s, p) in segs:
        if s <= t < s + 121:
            if p not in caps:
                caps[p] = cv2.VideoCapture(p)
            cap = caps[p]
            fps = cap.get(cv2.CAP_PROP_FPS) or 8.0
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(round((t - s) * fps)))
            ok, frame = cap.read()
            return frame if ok else None
    return None

for w in windows:
    t0, t1 = ep(w["start"]), ep(w["end"])
    outdir = f"{SPIKE}/frames/{w['id']}"
    os.makedirs(outdir, exist_ok=True)
    n = int((t1 - t0) // 3)
    done = 0
    for k in range(n):
        out = f"{outdir}/f{k:02d}.jpg"
        if os.path.exists(out) and os.path.getsize(out) > 1000:
            done += 1; continue
        fr = frame_at(t0 + 3 * k)
        if fr is None:
            print(w["id"], "k", k, "no frame", flush=True); continue
        if cv2.imwrite(out, fr, [cv2.IMWRITE_JPEG_QUALITY, 88]):
            done += 1
        else:
            print(w["id"], "k", k, "imwrite fail", flush=True)
    print(w["id"], "frames:", done, "/", n, flush=True)
for c in caps.values():
    c.release()
