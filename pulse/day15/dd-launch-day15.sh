#!/bin/bash
# DIRECT-DRIVE DAY 14 launch — charter: pulse/DAY15-CHARTER-20261109.md.
# NOT TO BE RUN until the charter's pre-wake gates are filed PASS:
#   - the H1 gate (charter item 9): the safety-reading-path fixture
#     battery re-run against the shipped day-14 copy is filed at
#     pulse/day15/safety-reflex-fixture-output.txt — 40 PASS / 0 FAIL;
#   - the dig-guard day-14 fixture (R1/R2) filed 28 PASS / 0 FAIL;
#   - the Gate B provisioning window has landed: Cody holds 32 cooked
#     porkchops, verified from the post-quit .dat snapshot;
#   - the floor is already open (floor/run/day15 contract) and has
#     issued a lease into $FLOOR_STATE_DIR (it opens FIRST: self-proof,
#     feed verification from the provisioned snapshot, then LEASE_ISSUE);
#   - the day-14 op bot (park-notify handler) is running;
#   - the subject-keeper is activated per the keeper's §6 contract
#     with the floor as sole daylight asserter;
#   - RELAY-OK proven end-to-end from Thor at check AND at launch.
# Wake: floor feed-verify -> lease -> driver start-gate -> driver
# feed-confirm -> day. NO relocation: he wakes at his respawn point
# (36.5,73,-86.5), empty-handed but provisioned, and walks home himself.
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5100000
export FLOOR_STATE_DIR="$HOME/craftmind-league/floor/run/day15/state"
export FLOOR_DRIVER_ID="cody-driver"
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day15.log
echo "=== day15 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake: floor feed-verify -> lease -> driver feed-confirm -> day, NO relocation) ===" >> "$LOG"
node pulse/day15/direct-drive-day15.js >> "$LOG" 2>&1
echo "=== day15 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
