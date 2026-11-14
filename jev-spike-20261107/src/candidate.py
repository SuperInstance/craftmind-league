#!/usr/bin/env python3
"""Candidate scorer for the JEV-over-play spike (I-JEPA arm).
Embeds frames/<WID>/f*.jpg via the rack POST /embed/image, computes the
declared velocity/consistency statistics, applies the declared label rule,
writes results/candidate_ijepa.json. Probe-frame calls (zero vector /
HTTP error) are retried once, then recorded as missing."""
import glob, json, subprocess, sys, time
import numpy as np

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
RACK = "http://127.0.0.1:8077/embed/image"

def embed(path, tries=2):
    for a in range(tries):
        r = subprocess.run(["curl", "-s", "-F", f"file=@{path}", RACK],
                           capture_output=True, text=True, timeout=120)
        try:
            d = json.loads(r.stdout)
            v = np.array(d["embedding"], dtype=np.float64)
            if np.linalg.norm(v) > 0:
                return v
        except Exception:
            pass
        time.sleep(2)
    return None

windows = json.load(open(f"{SPIKE}/windows.json"))
out = []
for w in windows:
    files = sorted(glob.glob(f"{SPIKE}/frames/{w['id']}/f*.jpg"))
    embs = []
    missing = 0
    for f in files:
        v = embed(f)
        if v is None:
            missing += 1
        else:
            embs.append(v)
    E = np.stack(embs)
    np.save(f"{SPIKE}/results/emb-{w['id']}.npy", E)
    D = np.diff(E, axis=0)
    norms = np.linalg.norm(D, axis=1)
    vel = float(np.median(norms))
    cos = []
    for i in range(len(D) - 1):
        na, nb = norms[i], norms[i + 1]
        if na > 1e-9 and nb > 1e-9:
            cos.append(float(np.dot(D[i], D[i + 1]) / (na * nb)))
    cons = float(np.median(cos)) if cos else 0.0
    if vel >= 0.35 and cons >= 0.10:
        label = "PROGRESS"
    elif vel <= 0.20:
        label = "STUCK"
    else:
        label = "AMBIGUOUS"
    row = {"id": w["id"], "truth": w["truth"], "label": label,
           "velocity_median": round(vel, 4), "consistency_median": round(cons, 4),
           "n_frames": len(files), "n_embedded": len(embs), "n_missing": missing,
           "mean_norm": round(float(np.mean(norms)), 4),
           "correct": label == w["truth"]}
    out.append(row)
    print(row, flush=True)

acc = sum(o["correct"] for o in out)
json.dump({"windows": out, "accuracy": f"{acc}/{len(out)}"},
          open(f"{SPIKE}/results/candidate_ijepa.json", "w"), indent=1)
print(f"IJEPA ACCURACY {acc}/{len(out)}")
