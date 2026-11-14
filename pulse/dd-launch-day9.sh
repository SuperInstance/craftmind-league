#!/bin/bash
# DIRECT-DRIVE DAY 9 launch (relocation wake + frame checks + the furnace day).
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5400000
export DD_OPENING_EVENT="$(cat pulse/dd-opening-day9.txt)"
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day9.log
echo "=== day9 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake: feed -> OPERATOR RELOCATION to (60.5,67,-92.5) -> day) ===" >> "$LOG"
node bots/runs/cody/resident-cody-dd-day9.js >> "$LOG" 2>&1
echo "=== day9 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
