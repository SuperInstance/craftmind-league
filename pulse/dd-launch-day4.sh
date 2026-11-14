#!/bin/bash
# DIRECT-DRIVE DAY 4 launch (day-3 shape): driver = pulse/direct-drive.js
# (day-4 build: deaths-from-trace, hop-flee v2, plant-cell perception,
# craft errors, state mirror for cameraman v3).
cd /home/caseydigennaro/craftmind-league/bots/runs/cody || exit 1
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
export DD_OPENING_EVENT="$(cat /home/caseydigennaro/craftmind-league/pulse/dd-opening-day4.txt)"
export DD_RUN_MS=5400000
exec node resident-cody-dd.js >> /home/caseydigennaro/craftmind-league/bots/runs/cody/logs/direct-drive-cody-day4.log 2>&1
