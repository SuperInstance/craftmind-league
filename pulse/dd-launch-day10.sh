#!/bin/bash
# DIRECT-DRIVE DAY 10 launch (no relocation; wake: feed -> verify -> day;
# opening event from pulse/dd-opening-day10.txt ONLY if that file exists -
# it is written solely when GATE 3 is filed MET, carrying the Director
# hand-over narration line appended to the true wake text).
set -u
cd ~/craftmind-league
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
export MC_HOST=192.168.0.50
export DD_RUN_MS=5100000
if [ -f pulse/dd-opening-day10.txt ]; then
  export DD_OPENING_EVENT="$(cat pulse/dd-opening-day10.txt)"
fi
mkdir -p bots/runs/cody/logs
LOG=bots/runs/cody/logs/direct-drive-cody-day10.log
echo "=== day10 launch $(date -u +%Y-%m-%dT%H:%M:%SZ) (RUN_MS=$DD_RUN_MS, wake: feed -> verify -> day, NO relocation) ===" >> "$LOG"
node bots/runs/cody/resident-cody-dd-day10.js >> "$LOG" 2>&1
echo "=== day10 driver exited $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$? ===" >> "$LOG"
