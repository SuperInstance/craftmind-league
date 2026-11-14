#!/bin/bash
# DIRECT-DRIVE DAY 16 launch — charter: pulse/DAY17-CHARTER-20261109.md.
# NOT TO BE RUN until the charter's pre-wake gates are filed PASS:
#   - the H1 gate (charter sec.7): the safety-reading-path fixture
#     battery re-run against the shipped day-17 copy is filed at
#     pulse/day17/safety-reflex-fixture-output.txt — 40 PASS / 0 FAIL;
#   - the below-grade guard fixture (charter sec.1) filed at
#     pulse/day17/below-grade-fixture-output.txt — 38 PASS / 0 FAIL;
#   - the walker-fence fixture 18 PASS / 0 FAIL and the dig-guard
#     fixture (R1/R2) 28 PASS / 0 FAIL, both against the shipped copy;
#   - NO provisioning window: he wakes fed (29 cooked porkchops in
#     hand at the day-15 close, re-read at Gate B from the live .dat);
#     the floor's VERIFY_FEED reads the fresh pre-wake snapshot;
#   - the floor is already open (floor/run/day17 contract) and has
#     issued a lease into $FLOOR_STATE_DIR (it opens FIRST: self-proof,
#     feed verification from the fresh snapshot, then LEASE_ISSUE);
#   - the day-17 op bot (park-notify handler) is running;
#   - the subject-keeper is activated per the keeper's §6 contract
#     with the floor as sole daylight asserter, changeover BEFORE
#     spawn (day-15 G2 lesson);
#   - RELAY-OK proven end-to-end from Thor at check AND at launch.
# Wake: floor feed-verify -> lease -> driver start-gate -> driver
# feed-confirm -> day. NO relocation: he wakes IN THE BOWL at
# (61.7,62,-91.3), fed and tool-less; the bowl exit is the day's
# first act and the wood chain runs before any stone.
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5100000
export FLOOR_STATE_DIR="$HOME/craftmind-league/floor/run/day17/state"
export FLOOR_DRIVER_ID="cody-driver"
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day17.log
echo "=== day17 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake: floor feed-verify -> lease -> driver feed-confirm -> day, NO relocation — he wakes in the bowl) ===" >> "$LOG"
node pulse/day17/direct-drive-day17.js >> "$LOG" 2>&1
echo "=== day17 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
