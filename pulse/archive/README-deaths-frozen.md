# ARCHIVED — deaths.jsonl, frozen at 116 (the day-3 defective artefact)

This file is EVIDENCE, not data. Do not read it as a death record.

- Original path: `pulse/deaths.jsonl`; sha256 (byte-preserved on the move):
  `bbc4ec6b00b9f79e93795b632f622b5d5d413b462877f463520089c997f368c5`, 116 lines.
- What it is: the death log written by `pulse/pulse-plugin.js` during the
  resident-cody era. Its rows 1–116 are genuine (see the rebuilt record).
- The defect: the direct-drive drivers (day 3 onward) never loaded that
  plugin, so nothing appended to this file while Cody died four more times
  on day 3 (deaths 117–120, 2026-11-09T09:59–10:00Z). Day 3's 3-death abort
  read this file, saw the stale 116 all day, and never fired.
- The successor record is `pulse/deaths-record.jsonl`, built by
  `pulse/lib/build-deaths-record.js` from this archive + the run traces.
  Counting lives in `pulse/lib/deaths.js`; the noticing report reads the
  derived record + traces, never this file.
- Archived 2026-11-09 by the deaths-tracker repair lane. Byte-preserved:
  the move was verified by sha256 before and after.
