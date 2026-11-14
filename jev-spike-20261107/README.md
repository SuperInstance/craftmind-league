# JEV-over-play momentum spike — result

**Verdict: NEGATIVE.** On the richest labelled play the league has produced
(the night Cody was cured, walked home, and passed S1), JEPA readings over
the footage did not beat the free transcript baseline at telling progress
from stuck. The candidate scored below the baseline in both arms, so under
the spike's pre-registered kill criterion the momentum-perception idea, as
operationalised here, does not earn a place. The transcript stays the
momentum instrument. Jev remains advisor-only, never the gate.

## Scores

Seven 120-second windows from 2026-11-08 05:14–05:46Z (four progress,
three stuck; ground truth from the league ledger — see `windows.json`).

| Window | Truth | Transcript baseline | I-JEPA | V-JEPA 2 |
|---|---|---|---|---|
| W1 relocate walk | PROGRESS | PROGRESS ✓ | AMBIGUOUS ✗ | AMBIGUOUS ✗ |
| W2 shoulder wedge | STUCK | STUCK ✓ | AMBIGUOUS ✗ | AMBIGUOUS ✗ |
| W3 hop-stall jitter | STUCK | STUCK ✓ | AMBIGUOUS ✗ | AMBIGUOUS ✗ |
| W4 fix-2 walk | PROGRESS | STUCK ✗ | AMBIGUOUS ✗ | PROGRESS ✓ |
| W5 pickaxe gather chain | PROGRESS | PROGRESS ✓ | AMBIGUOUS ✗ | AMBIGUOUS ✗ |
| W6 hut work loop | PROGRESS | PROGRESS ✓ | AMBIGUOUS ✗ | AMBIGUOUS ✗ |
| W7 bit-identical freeze | STUCK | STUCK ✓ | AMBIGUOUS ✗ | AMBIGUOUS ✗ |
| **Accuracy** | | **6/7** | **0/7** | **1/7** |

## How the reads work

- **Baseline (free).** From the digest timeline alone: net displacement,
  inventory-change events, and milestone events per window, combined by a
  fixed rule (declared in `METHODS.md`). Cost: zero — the digest already
  exists.
- **I-JEPA arm.** Frames at 1 per 3 s (40 per window) embedded with
  I-JEPA ViT-H/14 via the JEV rack; momentum read as median consecutive
  embedding distance (velocity) and median cosine between successive
  embedding deltas (direction consistency).
- **V-JEPA arm.** Each window cut into 4 x 30 s sub-clips, one V-JEPA 2
  embedding each; the same two statistics over the 4-point trajectory.

## What the readings showed

- **Direction consistency does not exist in this material.** Median
  successive-delta cosine was negative on all 7 windows for I-JEPA and on
  6 of 7 for V-JEPA 2. Successive embedding changes point against each
  other; there is no directional flow for a momentum read to ride.
- **The velocity floor is set by the camera, not the citizen.** A window
  in which the citizen's saved position is bit-identical for two minutes
  (W7) still returned median I-JEPA velocity 0.72 — spectate micro-motion,
  camera cuts, and scene animation keep frame embeddings moving. The
  embedding stream measures the filming apparatus first and the citizen
  second.
- **Group medians separate weakly; no window-level rule survives.** I-JEPA
  velocity medians were higher for progress windows (1.40) than stuck
  windows (0.73) as groups, but a stuck jitter window out-scored a genuine
  walk, and the one window the baseline missed (W4, a digest-cadence blind
  spot) was also missed by I-JEPA. These are descriptive statistics from
  the run, not a score; the registered rule's result is the table above.
- **The baseline's single miss is understood.** W4's walk fell between
  digest change records (the digest logs changes, not samples), so the
  transcript saw no motion. A denser state feed would close that hole at
  no model cost.

## Limitations

- Seven windows, one citizen, one night, one camera rig whose operator
  (the cameraman) cuts and reframes — results are about this material and
  this operationalisation, not about JEPA representations in general.
- Both candidate arms used one fixed, pre-declared statistic pair and
  threshold set; no search over statistics was performed, by design.
- V-JEPA 2 was loaded on demand by the rack for this run (health reported
  `loaded: false` at spike start; it served all 28 sub-clips).

## Artefacts and re-running

`windows.json` (window definitions + ground-truth citations), `METHODS.md`
(both methods and the kill criterion, declared before scoring), `RUNLOG.md`
(execution record), `src/` (scorers and material builders), `results/`
(per-window JSON for all three reads + saved embedding arrays), `frames/`
(sampled frames), `clips/` (V-JEPA sub-clips). The copied capture segments
used as source were removed after the run; they are listed in `RUNLOG.md`
and re-copy from the Orin capture archive in seconds.

Re-run: `python3 src/baseline.py`, then `src/candidate.py` and
`src/candidate_vjepa.py` against a live rack on :8077.
