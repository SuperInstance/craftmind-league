#!/bin/sh
# Start the commons comms daemon (conversation protocol v1) detached. Idempotent.
CC=/home/caseydigennaro/craftmind-league/commons/comms
PIDFILE=$CC/logs/daemon.pid
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "comms daemon already running (pid $(cat "$PIDFILE"))"
  exit 0
fi
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
cd "$CC"
mkdir -p logs
nohup node daemon.js >> logs/daemon.out 2>&1 &
echo $! > "$PIDFILE"
echo "comms daemon started (pid $!)"
