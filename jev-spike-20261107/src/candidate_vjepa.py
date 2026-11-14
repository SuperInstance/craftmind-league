#!/usr/bin/env python3
"""Candidate scorer, V-JEPA arm (secondary read, reported alongside I-JEPA).
Embeds clips/<WID>-q0..3.mp4 via the rack POST /embed/video, applies the
same declared velocity/consistency rule to the 4-point trajectory.
Writes results/candidate_vjepa.json. If the model will not load (error on
every clip), records loaded:false and exits cleanly."""
import glob, json, subprocess, time
import numpy as np

SPIKE = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
RACK = "http://127.0.0.1:8077/embed/video"

def embed(path, tries=2):
    for a in range(tries):
        r = subprocess.run(["curl", "-s", "-F", f"file=@{path}", RACK],
                           capture_output=True, text=True, timeout=300)
        try:
            d = json.loads(r.stdout)
            v = np.array(d["embedding"], dtype=np.float64)
            if np.linalg.norm(v) > 0:
                return v
        except Exception:
            pass
        time.sleep(3)
    return None

windows = json.load(open(f"{SPIKE}/windows.json"))
out = []
any_ok = False
for w in windows:
    files = sorted(glob.glob(f"{SPIKE}/clips/{w['id']}-q*.mp4"))
    embs = []
    for f in files:
        v = embed(f)
        if v is not None:
            embs.append(v); any_ok = True
    if len(embs) >= 2:
        E = np.stack(embs)
        np.save(f"{SPIKE}/results/emb-vjepa-{w['id']}.npy", E)
        D = np.diff(E, axis=0)
        norms = np.linalg.norm(D, axis=1)
        vel = float(np.median(norms))
        cos = [float(np.dot(D[i], D[i + 1]) / (norms[i] * norms[i + 1]))
               for i in range(len(D) - 1) if norms[i] > 1e-9 and norms[i + 1] > 1e-9]
        cons = float(np.median(cos)) if cos else 0.0
        if vel >= 0.35 and cons >= 0.10:
            label = "PROGRESS"
        elif vel <= 0.20:
            label = "STUCK"
        else:
            label = "AMBIGUOUS"
    else:
        vel, cons, label = None, None, "NO-DATA"
    row = {"id": w["id"], "truth": w["truth"], "label": label,
           "velocity_median": None if vel is None else round(vel, 4),
           "consistency_median": None if cons is None else round(cons, 4),
           "n_clips": len(files), "n_embedded": len(embs),
           "correct": label == w["truth"]}
    out.append(row)
    print(row, flush=True)

acc = sum(o["correct"] for o in out)
json.dump({"loaded": any_ok, "windows": out,
           "accuracy": f"{acc}/{len(out)}" if any_ok else None},
          open(f"{SPIKE}/results/candidate_vjepa.json", "w"), indent=1)
print("VJEPA LOADED:", any_ok, "ACCURACY", f"{acc}/{len(out)}" if any_ok else "n/a")
