#!/bin/bash
# Day-6 state watcher: appends a block to the day-6 record every 300s.
cd ~/craftmind-league/pulse
REC=DIRECT-DRIVE-DAY6-20261108.md
TRACE=direct-drive-trace-day6-20261109.jsonl
STATE=direct-drive-state.json
for i in $(seq 1 19); do
  sleep 300
  {
    echo ""
    echo "--- watcher $(date -u +%H:%M:%SZ) ---"
    echo -n "cycles: "; grep -c '"kind": "cycle"' "$TRACE" 2>/dev/null || echo 0
    echo -n "deaths: "; grep -c '"kind": "death"' "$TRACE" 2>/dev/null || echo 0
    echo -n "failovers: "; grep -hc '"kind": "failover"' "$TRACE" 2>/dev/null || echo 0
    echo -n "failover-backs: "; grep -hc '"kind": "failover-back"' "$TRACE" 2>/dev/null || echo 0
    node -e "try{const s=require('/home/caseydigennaro/craftmind-league/pulse/direct-drive-state.json');console.log('pos',s.x.toFixed(1),s.y.toFixed(1),s.z.toFixed(1),'| hp',s.hp,'| food',s.food,'| deaths',s.deaths,'| holding',s.holding)}catch(e){console.log('state read failed:',e.message)}" 2>/dev/null
  } >> "$REC"
done
echo "watcher done" >> "$REC"
