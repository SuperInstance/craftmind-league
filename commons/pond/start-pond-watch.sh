#!/bin/sh
# Start the commons pond-watch (pond v2) detached. Idempotent.
# Sibling to comms/start-daemon.sh; independent process, own pidfile.
CP=/home/caseydigennaro/craftmind-league/commons/pond
PIDFILE=$CP/logs/pond-watch.pid
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "pond-watch already running (pid $(cat "$PIDFILE"))"
  exit 0
fi
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
cd "$CP"
mkdir -p logs
nohup node pond-watch.js >> logs/pond-watch.out 2>&1 &
echo $! > "$PIDFILE"
echo "pond-watch started (pid $!)"
