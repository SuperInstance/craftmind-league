#!/bin/sh
# Start the world digest v0 (ARCH-AGENT-COMMUNITY §3) detached. Idempotent.
D=/home/caseydigennaro/craftmind-league/digest
PIDFILE=$D/logs/digest.pid
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "digest already running (pid $(cat "$PIDFILE"))"
  exit 0
fi
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
cd "$D"
mkdir -p logs
nohup node digest.js >> logs/digest.out 2>&1 &
echo $! > "$PIDFILE"
echo "digest started (pid $!)"
