#!/bin/sh
# Start the league governor (mind-seconds proxy) detached.
# Idempotent: refuses to start a second copy.
LEAGUE=/home/caseydigennaro/craftmind-league
PIDFILE=$LEAGUE/logs/governor.pid
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "governor already running (pid $(cat "$PIDFILE"))"
  exit 0
fi
nohup python3 "$LEAGUE/proxy/governor.py" >> "$LEAGUE/logs/governor.log" 2>&1 &
echo $! > "$PIDFILE"
echo "governor started (pid $!)"
