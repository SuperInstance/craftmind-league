#!/bin/bash
# DIRECT-DRIVE DAY 3 launch (day-2 shape): driver = pulse/direct-drive.js
# (day-3 build installed over it; day-2 build preserved at
# pulse/day2-backups/ + the day-3 source kept at pulse/direct-drive-day3.js).
cd /home/caseydigennaro/craftmind-league/bots/runs/cody || exit 1
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
export DD_OPENING_EVENT="$(cat /home/caseydigennaro/craftmind-league/pulse/dd-opening-day3.txt)"
export DD_RUN_MS=5400000
exec node resident-cody-dd.js >> /home/caseydigennaro/craftmind-league/bots/runs/cody/logs/direct-drive-cody-day3.log 2>&1
