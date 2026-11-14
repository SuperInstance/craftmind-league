#!/bin/bash
# DIRECT-DRIVE DAY 12 launch — charter: pulse/DAY12-CHARTER-20261109.md.
# NOT TO BE RUN until the charter's pre-wake gates are filed PASS:
#   - Gate A filed MET (scenario #3 placement readback under director/);
#   - the floor is already open (floor/run/day12 contract) and has issued
#     a lease into $FLOOR_STATE_DIR (it opens FIRST: self-proof, feed
#     verification from the .dat census snapshot, then LEASE_ISSUE);
#   - the day-12 op bot (park-notify handler) is running;
#   - the subject-keeper is activated per the keeper's SS6 contract
#     (charter SS3.5) with the floor as sole daylight asserter;
#   - RELAY-OK proven end-to-end from Thor at check AND at launch.
# Wake: floor feed-verify -> lease -> driver start-gate -> driver
# feed-confirm -> day. NO relocation: he wakes at home in his dip.
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5100000
export FLOOR_STATE_DIR="$HOME/craftmind-league/floor/run/day12/state"
export FLOOR_DRIVER_ID="cody-driver"
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day12.log
echo "=== day12 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake: floor feed-verify -> lease -> driver feed-confirm -> day, NO relocation) ===" >> "$LOG"
node pulse/day12/direct-drive-day12.js >> "$LOG" 2>&1
echo "=== day12 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
