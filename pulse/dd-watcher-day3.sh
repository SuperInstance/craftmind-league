#!/bin/bash
# Day-3 watcher: every 300 s append a state snapshot line to the lane
# record (day-2 pattern). Read-only; exits when the driver log shows
# the run window over or after 20 samples.
REC=/home/caseydigennaro/craftmind-league/pulse/DIRECT-DRIVE-DAY3-20261108.md
STATE=/home/caseydigennaro/craftmind-league/pulse/direct-drive-state.json
for i in $(seq 1 20); do
  sleep 300
  TS=$(date -u +%FT%TZ)
  SNAP=$(python3 -c "
import json
try:
    s=json.load(open('$STATE'))
    p=s['pos']
    print('cycle %s pos (%.1f,%.1f,%.1f) hp %s food %s structs: %s' % (s.get('cycle'), p['x'], p['y'], p['z'], s.get('hp'), s.get('food'), (s.get('structuresText') or '')[:160]))
except Exception as e:
    print('state read failed:', e)
" 2>/dev/null)
  echo "- watcher $TS — $SNAP" >> "$REC"
  grep -q "run window over" /home/caseydigennaro/craftmind-league/bots/runs/cody/logs/direct-drive-cody-day3.log 2>/dev/null && break
done
