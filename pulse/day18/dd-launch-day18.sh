#!/bin/bash
# DIRECT-DRIVE DAY 18 launch — charter: pulse/DAY18-CHARTER-20261109.md.
# NOT TO BE RUN until the run lane has claimed the day (charter sec.0:
# the claim DECLARES the variant — R or N — before Gate A opens) and
# the charter's pre-wake gates are filed PASS:
#   - Gate A complete (claim + Director claim; the live sweep of the
#     bowl country filed; the guest stocked and verified twice, its
#     live cell recorded; [R only] sec.1 re-verified: the placement
#     read-back + the Gate A-R rehearsal 3/3 against the ramp AS READ
#     BACK);
#   - the H1 gate (charter sec.5.4): the safety-reading-path fixture
#     battery re-run against the shipped day-18 copy is filed at
#     pulse/day18/safety-reflex-fixture-output.txt — 40 PASS / 0 FAIL;
#   - the below-grade guard fixture filed at
#     pulse/day18/below-grade-fixture-output.txt — 38 PASS / 0 FAIL;
#   - the walker-fence fixture 18 PASS / 0 FAIL and the dig-guard
#     fixture 28 PASS / 0 FAIL, both against the shipped copy;
#   - NO provisioning window: he wakes fed (27 cooked porkchops in
#     hand, re-read at Gate B from the live .dat); the floor's
#     VERIFY_FEED reads the fresh pre-wake snapshot;
#   - the floor is already open (floor/run/day18 contract — ITS
#     day_window RE-DATED to the run's actual programme day at the
#     run lane's Gate B; the drafted window is the drafting round's)
#     and has issued a lease into $FLOOR_STATE_DIR (it opens FIRST:
#     self-proof, feed verification from the fresh snapshot, then
#     LEASE_ISSUE);
#   - the day-18 op bot (park-notify handler) is running;
#   - the subject-keeper is activated per the keeper's sec.6 contract
#     with the floor as sole daylight asserter, changeover BEFORE
#     spawn (day-15 G2 lesson);
#   - the relay pre-check taken per RELAY-TRUTH-CLOSURE sec.6 (the
#     checklist at floor/run/day18/relay-precheck-checklist.md):
#     RELAY-OK proven end-to-end from Thor at check AND at launch.
# DD_OPENING_EVENT MUST carry the declared variant's hand-over line
# VERBATIM (charter sec.4.1) — this script refuses to launch without
# it: neither variant's line is baked into the driver copy (rig
# filing pulse/day18/DAY18-RIG-20261109.md).
# Wake: floor feed-verify -> lease -> driver start-gate -> driver
# feed-confirm -> day. NO relocation: he wakes IN THE BOWL at
# (62.559, 62, -90.692), fed and tool-less.
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5100000
export FLOOR_STATE_DIR="$HOME/craftmind-league/floor/run/day18/state"
export FLOOR_DRIVER_ID="cody-driver"
if [ -z "${DD_OPENING_EVENT:-}" ]; then
  echo "REFUSED: DD_OPENING_EVENT is not set — the declared variant's hand-over line (charter sec.4.1) is a launch-time input; neither variant's line is baked into the driver. Set it verbatim from director/SCENARIO-004.md for the variant declared in the claim, or do not launch." >&2
  exit 2
fi
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day18.log
echo "=== day18 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake: floor feed-verify -> lease -> driver feed-confirm -> day, NO relocation — he wakes in the bowl) ===" >> "$LOG"
node pulse/day18/direct-drive-day18.js >> "$LOG" 2>&1
echo "=== day18 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
