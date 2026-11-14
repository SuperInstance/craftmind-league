#!/usr/bin/env python3
"""Transcript-baseline scorer for the JEV-over-play spike.
Implements the rule declared in METHODS.md exactly. Reads digest.jsonl,
writes results/baseline.json."""
import json, math, sys
from datetime import datetime, timezone

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
DIGEST = "/home/caseydigennaro/craftmind-league/digest/digest.jsonl"

def parse_ts(s):
    s = s.strip()
    fmt = "%Y-%m-%dT%H:%M:%S.%fZ" if "." in s else "%Y-%m-%dT%H:%M:%SZ"
    return datetime.strptime(s, fmt).replace(tzinfo=timezone.utc).timestamp()

def dist(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

windows = json.load(open(f"{SPIKE}/windows.json"))
ticks = []
for line in open(DIGEST):
    if line.strip():
        r = json.loads(line)
        ticks.append(r)
ticks.sort(key=lambda r: r["ts"])

out = []
for w in windows:
    t0, t1 = parse_ts(w["start"]), parse_ts(w["end"])
    pos = None; inv = None
    samples = []; inv_events = 0; inv_first = None; milestones = 0
    for r in ticks:
        ts = parse_ts(r["ts"])
        ch = (r.get("changes") or {}).get("Cody") or {}
        if ts < t0:
            if "pos" in ch: pos = (ch["pos"]["x"], ch["pos"]["y"], ch["pos"]["z"])
            if ch.get("inventoryTotal") is not None: inv = ch["inventoryTotal"]
            continue
        if ts > t1: break
        if "pos" in ch: pos = (ch["pos"]["x"], ch["pos"]["y"], ch["pos"]["z"])
        if ch.get("inventoryTotal") is not None:
            if inv_first is None: inv_first = inv
            inv = ch["inventoryTotal"]; inv_events += 1
        for e in r.get("newEvents") or []:
            if "milestone" in (e.get("summary") or ""): milestones += 1
        if pos is not None: samples.append(pos)
    if len(samples) >= 2:
        net = dist(samples[0], samples[-1])
        path = sum(dist(samples[i], samples[i + 1]) for i in range(len(samples) - 1))
    else:
        net = 0.0; path = 0.0
    inv_delta = (inv - inv_first) if (inv is not None and inv_first is not None) else 0
    if net >= 3.0 or milestones >= 1 or (inv_events >= 2 and inv_delta > 0):
        label = "PROGRESS"
    elif net < 3.0 and milestones == 0 and inv_events == 0:
        label = "STUCK"
    else:
        label = "AMBIGUOUS"
    out.append({"id": w["id"], "truth": w["truth"], "label": label,
                "net": round(net, 2), "path": round(path, 2),
                "inv_events": inv_events, "inv_delta": inv_delta,
                "milestones": milestones, "n_samples": len(samples),
                "correct": label == w["truth"]})
    print(out[-1])

acc = sum(o["correct"] for o in out)
json.dump({"windows": out, "accuracy": f"{acc}/{len(out)}"}, open(f"{SPIKE}/results/baseline.json", "w"), indent=1)
print(f"BASELINE ACCURACY {acc}/{len(out)}")
