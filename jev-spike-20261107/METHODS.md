# JEV-over-play spike — methods, declared before scoring

Date: 2026-11-08 (night of 2026-11-07 AKST). Offline arm. Jev is advisor-only,
never the gate; nothing here touches a live loop.

## Hypothesis under test

A JEPA-style reading over recorded play carries a *momentum* signal — whether
the citizen is making progress or is stuck — that the free transcript (the
digest/state-feed timeline) does not already carry. The candidate earns a
place only if it **beats the transcript baseline** on labelled windows.

Pre-registered kill criterion: if the candidate's window accuracy is less
than or equal to the baseline's, the spike result is a clean NEGATIVE.

## Material

- Footage: the Orin desktop capture archive (GStreamer, 720p, 8 fps,
  120 s segments, `~/capture/segments/` on the Orin), copied read-only to the
  Thor for the windows below. All windows post-date the 05:01:47Z headed-client
  rejoin, so the footage is the cameraman's live view (Cody-only roster,
  spectate-follow) of the windows scored.
- Transcript: `~/craftmind-league/digest/digest.jsonl` (10 s cadence deltas:
  position / health / food / inventoryTotal changes + events), plus
  `pulse/ledger.jsonl` milestones as ground-truth sources.
- Rack: JEV rack on the Thor (:8077). Toolcards read first (GET /cards):
  I-JEPA ViT-H/14 (POST /embed/image, 1280-dim), V-JEPA 2 ViT-L fpc64-256
  (POST /embed/video, 1024-dim), jev-semantic judge (not used here — this
  spike tests the perception arm, not the judge).
  Rack health at spike start: ijepa loaded, judge loaded, **vjepa2
  loaded:false**. A probe call on a real clip decides whether the V-JEPA arm
  runs; its outcome is recorded in RUNLOG.md either way.

## Windows (ground truth from the ledger, fixed before scoring)

Defined in `windows.json` (7 windows x 120 s, UTC 2026-11-08):
W1 walk (progress), W2 shoulder wedge (stuck), W3 route hop-stall jitter
(stuck), W4 fix-2 walk (progress), W5 pickaxe gather chain (progress),
W6 hut work loop (progress), W7 bit-identical freeze (stuck).
Balance: 4 progress / 3 stuck. Ground truth per window is cited from ledger
entries in windows.json.

## Baseline (free transcript) — declared rule

From the digest alone, per window (positions reconstructed from change
deltas, last-known carried forward at tick cadence):

- `net` = distance between first and last known position in the window.
- `path` = sum of step distances across ticks (reported, not decisive:
  jitter inflates it).
- `inv_events` = ticks with an inventoryTotal change; `inv_delta` = last
  minus first known inventoryTotal.
- `milestones` = milestone events in the window.

Label: **PROGRESS** if net >= 3.0 blocks, or milestones >= 1, or
(inv_events >= 2 and inv_delta > 0); **STUCK** if net < 3.0 and
milestones == 0 and inv_events == 0; otherwise **AMBIGUOUS**.
Thresholds are round numbers fixed here, before any scorer is run.
AMBIGUOUS counts as incorrect in accuracy accounting.

## Candidate (JEPA over frames) — declared rule

Per window, frames sampled at 1 per 3 s (40 frames) from the capture
segments; each frame embedded with I-JEPA via the rack.

- Consecutive deltas d_i = e_{i+1} - e_i; **velocity** v = median of
  ||d_i|| (median, not mean: the cameraman's CUT teleports inject a few
  huge frame-to-frame jumps that are camera motion, not citizen momentum).
- **Consistency** c = median cosine between successive deltas d_i, d_{i+1}.

Label: **PROGRESS** if v >= 0.35 AND c >= 0.10; **STUCK** if v <= 0.20;
otherwise **AMBIGUOUS**. (Embedding norms/distances are unit-dependent;
these thresholds are fixed here, before scoring, at round values intended
to separate "scene evolving in a sustained direction" from "scene static".
AMBIGUOUS counts as incorrect.)

If V-JEPA loads: each window is also cut into 4 x 30 s sub-clips
(ffmpeg stream-copy; keyframe snapping may shift a cut by a few seconds),
one embedding per sub-clip, and the same velocity/consistency rule is
applied to the 4-point trajectory as a secondary read (reported alongside,
not pooled with the I-JEPA read).

## Scoring

Per window: truth vs baseline label vs candidate label. Headline numbers:
baseline accuracy, candidate accuracy, and the candidate-minus-baseline
margin. The verdict follows the kill criterion exactly as registered above.
