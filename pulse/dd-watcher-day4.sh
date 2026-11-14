#!/bin/bash
# Day-4 watcher: every 300 s append a state snapshot line to the lane
# record. Read-only; exits when the driver log shows the run window
# over or after 20 samples.
REC=/home/caseydigennaro/craftmind-league/pulse/DIRECT-DRIVE-DAY4-20261108.md
STATE=/home/caseydigennaro/craftmind-league/pulse/direct-drive-state.json
for i in $(seq 1 20); do
  sleep 300
  TS=$(date -u +%FT%TZ)
  SNAP=$(python3 -c "
import json
try:
    s=json.load(open('$STATE'))
    p=s['pos']
    print('cycle %s pos (%.1f,%.1f,%.1f) hp %s food %s say: %s structs: %s' % (s.get('cycle'), p['x'], p['y'], p['z'], s.get('hp'), s.get('food'), (s.get('say') or '')[:80], (s.get('structuresText') or '')[:120]))
except Exception as e:
    print('state read failed:', e)
" 2>/dev/null)
  echo "- watcher $TS — $SNAP" >> "$REC"
  grep -q "run window over" /home/caseydigennaro/craftmind-league/bots/runs/cody/logs/direct-drive-cody-day4.log 2>/dev/null && break
done
