#!/bin/sh
# Start the Lineage B resident (Vega) detached. Idempotent.
LB=/home/caseydigennaro/craftmind-league/lineage-b
PIDFILE=$LB/logs/vega.pid
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "vega already running (pid $(cat "$PIDFILE"))"
  exit 0
fi
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
cd "$LB"
nohup node vega.js >> logs/vega.out 2>&1 &
echo $! > "$PIDFILE"
echo "vega started (pid $!)"
