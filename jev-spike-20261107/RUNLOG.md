# Run log — JEV-over-play spike, 2026-11-08 (offline arm)

- Rack toolcards read first (GET :8077/cards). Health at start:
  ijepa loaded, judge loaded, vjepa2 loaded:false. Probe call
  (POST /embed/video, curator clip m0531-ritual.mp4): V-JEPA 2 **loaded on
  demand** and returned a 1024-dim embedding in 56.8 s (load included);
  steady-state per the toolcard is ~7.8 s/call. The V-JEPA arm therefore ran.
- Material: Orin capture segments (720p, 8 fps, ~120 s each) copied
  read-only to the Thor: seg-1794114834, 1794114953, 1794115073, 1794115192,
  1794115431, 1794115551, 1794115790, 1794115909, 1794116149, 1794116269,
  1794116388, 1794116508, 1794116628, 1794116748 (all 2026-11-08). All
  windows post-date the 05:01:47Z client rejoin (Cody-only cameraman).
  Segment copies deleted from the spike dir after scoring (bench rule);
  frames/ and clips/ retained.
- Tooling on this box (recorded because it cost three restarts): the Thor
  ffmpeg build has no scale filter and no concat demuxer, so JPEG frame
  extraction and boundary-straddling sub-clips were built with OpenCV
  (cv2 4.8.0) instead; single-segment sub-clips are ffmpeg stream copies.
  One make_clips pass assigned two W1/W2 sub-clips from a stale list file;
  the full W1/W2 clip sets were rebuilt with OpenCV and verified by size
  and frame count (240/240). Two sampled frames (W3 f17, W5 f21) failed
  to decode and were filled with the nearest neighbour frame (one
  duplicated frame each in a 40-frame sequence; noted, immaterial to a
  median statistic). W1-q2/W2-q3 were rebuilt last with per-segment
  capture handles after an interleaved-seek bug truncated them.
- Baseline scored first: 6/7. Its miss (W4) is a digest blind spot — the
  digest records changes only, and that walk produced no in-window change
  record; confirmed against the ledger's walk timeline.
- I-JEPA arm: 280 frames, 280 embeddings, 0 missing. All windows AMBIGUOUS
  under the declared rule (velocity 0.72–1.86, consistency -0.40..-0.18).
- V-JEPA arm: 28 sub-clips, 28 embeddings. 1/7 (W4 only). Velocity scale
  (4.7–21.7) is not comparable to the I-JEPA arm's — embedding geometry is
  model-specific; the declared rule was applied identically anyway.
- No live system was touched: rack reads only, footage copies only, no
  loop or citizen changes, no pushes.
