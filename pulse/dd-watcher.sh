#!/bin/sh
# dd-watcher: appends a compact status block to the run log every 5 min.
LOG=/home/caseydigennaro/craftmind-league/pulse/DIRECT-DRIVE-20261108.md
while :; do
  sleep 300
  {
    echo ""
    echo "- WATCH $(date -u +%FT%TZ): $(tail -1 /home/caseydigennaro/craftmind-league/logs/direct-drive-cody4.log | cut -c1-220)"
    python3 -c "import json; s=json.load(open('/home/caseydigennaro/craftmind-league/pulse/direct-drive-state.json')); print('  state:', s['pos'], 'hp', round(s['hp'],1), 'food', s['food'], 'inv', s['inv'], 'distHome', s['distHome'])" 2>/dev/null || echo "  state: (driver state file stale/absent — process may have ended)"
  } >> "$LOG"
done
