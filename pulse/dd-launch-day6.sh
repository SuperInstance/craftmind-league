#!/bin/bash
# DIRECT-DRIVE DAY 6 launch (the wake sequence + the furnace day).
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5400000
export DD_OPENING_EVENT="$(cat pulse/dd-opening-day6.txt)"
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day6.log
echo "=== day6 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake sequence: feed -> long-leg exit (62,66,-93) -> day) ===" >> "$LOG"
node bots/runs/cody/resident-cody-dd.js >> "$LOG" 2>&1
echo "=== day6 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
