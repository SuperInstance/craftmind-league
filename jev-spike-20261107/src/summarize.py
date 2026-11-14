#!/usr/bin/env python3
import json
S = "/home/caseydigennaro/craftmind-league/jev-spike-20261107"
b = {w["id"]: w for w in json.load(open(f"{S}/results/baseline.json"))["windows"]}
i = {w["id"]: w for w in json.load(open(f"{S}/results/candidate_ijepa.json"))["windows"]}
v = {w["id"]: w for w in json.load(open(f"{S}/results/candidate_vjepa.json"))["windows"]}
rows = []
for wid in sorted(b):
    rows.append({"id": wid, "truth": b[wid]["truth"],
                 "baseline_label": b[wid]["label"], "baseline_correct": b[wid]["correct"],
                 "baseline_net": b[wid]["net"], "baseline_path": b[wid]["path"],
                 "ijepa_label": i[wid]["label"], "ijepa_correct": i[wid]["correct"],
                 "ijepa_velocity": i[wid]["velocity_median"], "ijepa_consistency": i[wid]["consistency_median"],
                 "vjepa_label": v[wid]["label"], "vjepa_correct": v[wid]["correct"],
                 "vjepa_velocity": v[wid]["velocity_median"], "vjepa_consistency": v[wid]["consistency_median"]})
summary = {"windows": rows,
           "baseline_accuracy": "6/7", "ijepa_accuracy": "0/7", "vjepa_accuracy": "1/7",
           "kill_criterion": "candidate accuracy <= baseline accuracy => clean NEGATIVE",
           "verdict": "NEGATIVE — the JEPA reads did not beat the free transcript baseline."}
json.dump(summary, open(f"{S}/results/summary.json", "w"), indent=1)
for r in rows: print(r)
print(summary["verdict"])
