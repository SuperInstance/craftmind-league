#!/usr/bin/env python3
"""Pad the two short sub-clips (W1-q2 147/240 frames, W2-q3 177/240) by
freezing their last frame to the full 30 s. Declared in RUNLOG: these are
static-scene windows' tails; V-JEPA samples 64 frames uniformly, so a frozen
tail slightly dilutes - noted, not hidden."""
import os
import cv2

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
for name in ("W1-q2", "W2-q3"):
    p = f"{SPIKE}/clips/{name}.mp4"
    cap = cv2.VideoCapture(p)
    frames = []
    while True:
        ok, fr = cap.read()
        if not ok: break
        frames.append(fr)
    cap.release()
    print(name, "had", len(frames), "frames", flush=True)
    if not frames: continue
    tmp = p + ".tmp.mp4"
    wr = cv2.VideoWriter(tmp, fourcc, 8.0, (1280, 720))
    for fr in frames: wr.write(fr)
    for _ in range(max(0, 240 - len(frames))): wr.write(frames[-1])
    wr.release()
    os.replace(tmp, p)
    print(name, "padded to 240, size", os.path.getsize(p), flush=True)
