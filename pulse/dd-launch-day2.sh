#!/bin/sh
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
cd /home/caseydigennaro/craftmind-league/bots/runs/cody
export DD_OPENING_EVENT="$(cat /home/caseydigennaro/craftmind-league/pulse/dd-opening-day2.txt)"
export DD_RUN_MS=5400000
exec node resident-cody-dd.js >> /home/caseydigennaro/craftmind-league/logs/direct-drive-cody-day2.log 2>&1
