#!/usr/bin/env python3
"""Rebuild ONLY the two missing sub-clips (W1-q2, W2-q3) with seeks spaced
1/8 s apart in playback order. The previous run's SHORT results were caused
by read_at() reusing one capture handle across interleaved segments (seek
into segment A after handling segment B). Here each segment gets its own
fresh VideoCapture and reads stay monotonic within the sub-clip."""
import json, os
import cv2
from datetime import datetime, timezone

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
WDIR = f"{SPIKE}/windows"

def ep(s):
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc).timestamp()

seglist = []
for f in sorted(os.listdir(WDIR)):
    if f.startswith("seg-") and f.endswith(".mp4"):
        seglist.append((int(f[4:-4]), os.path.join(WDIR, f)))
seglist.sort()

def build(t_start, out):
    caps = {}
    def read_at(t):
        for (s, p) in seglist:
            if s <= t < s + 121:
                if p not in caps: caps[p] = cv2.VideoCapture(p)
                cap = caps[p]
                fps = cap.get(cv2.CAP_PROP_FPS) or 8.0
                cap.set(cv2.CAP_PROP_POS_FRAMES, int(round((t - s) * fps)))
                ok, fr = cap.read()
                return fr if ok else None
        return None
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    tmp = out + ".tmp.mp4"
    wr = cv2.VideoWriter(tmp, fourcc, 8.0, (1280, 720))
    n = 0; last = None
    for i in range(240):
        fr = read_at(t_start + i / 8.0)
        if fr is None: fr = last
        if fr is None: break
        if fr.shape[1] != 1280 or fr.shape[0] != 720:
            fr = cv2.resize(fr, (1280, 720))
        wr.write(fr); last = fr; n += 1
    wr.release()
    for c in caps.values(): c.release()
    if n >= 200:
        os.replace(tmp, out)
        print(out, "frames", n, "size", os.path.getsize(out), flush=True)
    else:
        print(out, "STILL SHORT", n, flush=True)
        if os.path.exists(tmp): os.remove(tmp)

windows = {w["id"]: w for w in json.load(open(f"{SPIKE}/windows.json"))}
build(ep(windows["W1"]["start"]) + 60, f"{SPIKE}/clips/W1-q2.mp4")
build(ep(windows["W2"]["start"]) + 90, f"{SPIKE}/clips/W2-q3.mp4")
