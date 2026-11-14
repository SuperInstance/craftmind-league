#!/bin/bash
# DIRECT-DRIVE DAY 5 launch (day-4 shape): driver = pulse/direct-drive.js
# (day-5 build installed there at launch: trunk-at-foot-level
# perception, pit-as-known-place, arrival honesty; deaths/hop-flee/
# mirror carried over proven).
cd /home/caseydigennaro/craftmind-league/bots/runs/cody || exit 1
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
export DD_OPENING_EVENT="$(cat /home/caseydigennaro/craftmind-league/pulse/dd-opening-day5.txt)"
export DD_RUN_MS=5400000
exec node resident-cody-dd.js >> /home/caseydigennaro/craftmind-league/bots/runs/cody/logs/direct-drive-cody-day5.log 2>&1
