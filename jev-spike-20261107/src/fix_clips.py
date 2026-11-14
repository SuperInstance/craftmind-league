#!/usr/bin/env python3
"""Remux the 7 boundary-straddling sub-clips with OpenCV (Thor ffmpeg lacks
the concat demuxer). Re-encode at capture spec (720p, 8 fps, libx264 via
cv2's bundled ffmpeg). The 21 single-segment clips stay stream-copies."""
import os
import cv2

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
WDIR = f"{SPIKE}/windows"
TARGETS = [("W3", 1, 1794115431 + 69), ("W4", 1, 1794116149 + 71),
           ("W5", 2, 1794116388 + 57), ("W6", 3, 1794116628 + 82),
           ("W7", 1, 1794115790 + 70), ("W1", 1, 1794114834 + 81),
           ("W2", 0, 1794115073 + 7)]
segs = {}
for f in sorted(os.listdir(WDIR)):
    if f.startswith("seg-") and f.endswith(".mp4"):
        segs[int(f[4:-4])] = os.path.join(WDIR, f)

caps = {}
def read_at(t):
    for s in sorted(segs):
        if s <= t < s + 121:
            p = segs[s]
            if p not in caps:
                caps[p] = cv2.VideoCapture(p)
            cap = caps[p]
            fps = cap.get(cv2.CAP_PROP_FPS) or 8.0
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(round((t - s) * fps)))
            ok, fr = cap.read()
            return fr if ok else None
    return None

fourcc = cv2.VideoWriter_fourcc(*"mp4v")
for wid, q, a in TARGETS:
    out = f"{SPIKE}/clips/{wid}-q{q}.mp4"
    tmp = out + ".tmp.mp4"
    wr = cv2.VideoWriter(tmp, fourcc, 8.0, (1280, 720))
    n = 0
    for i in range(240):
        fr = read_at(a + i / 8.0)
        if fr is None:
            break
        if fr.shape[1] != 1280 or fr.shape[0] != 720:
            fr = cv2.resize(fr, (1280, 720))
        wr.write(fr); n += 1
    wr.release()
    if n >= 200:
        os.replace(tmp, out)
        print(wid, f"q{q}", "frames", n, "size", os.path.getsize(out), flush=True)
    else:
        print(wid, f"q{q}", "SHORT", n, flush=True)
        if os.path.exists(tmp): os.remove(tmp)
for c in caps.values():
    c.release()
