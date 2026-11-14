#!/bin/bash
# DIRECT-DRIVE DAY 11 launch — DRAFT (charter: pulse/DAY11-CHARTER-DRAFT-20261109.md).
# NOT TO BE RUN until the charter's pre-wake gates are filed PASS:
#   - the floor is already open (floor/ process, contract-day11) and has
#     issued a live lease into $FLOOR_STATE_DIR (it opens FIRST: self-proof,
#     feed verification from the .dat census snapshot, then LEASE_ISSUE);
#   - the op bot for day 11 (with the park-notify handler) is running;
#   - RELAY-OK proven end-to-end from Thor;
#   - if the scenario-#2 hand-over line is to be live, the placement
#     window's two-store readback is filed (else the day runs clean on
#     Cody's own list and the line is simply not owed — see charter §2).
# Day 11 changes vs day 10: NO wrapper process (the driver chdirs
# internally); the gate env below is what turns the floor gate ON —
# without FLOOR_STATE_DIR the driver copy degrades to day-10 behaviour,
# which is exactly why the lease check at start is a launch gate, not
# a hope.
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5100000
export FLOOR_STATE_DIR="$HOME/craftmind-league/floor/run/day11/state"
export FLOOR_DRIVER_ID="cody-driver"
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day11.log
echo "=== day11 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake: floor feed-verify -> lease -> driver feed-confirm -> day, NO relocation) ===" >> "$LOG"
node pulse/day11/direct-drive-day11.js >> "$LOG" 2>&1
echo "=== day11 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
