#!/bin/sh
# Start the MiniMax consult driver detached (league commons).
# Idempotent: refuses to start a second copy.
LEAGUE=/home/caseydigennaro/craftmind-league
PIDFILE=$LEAGUE/logs/minimax-driver.pid
NODE=/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node
export PATH=/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin:$PATH
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "minimax driver already running (pid $(cat "$PIDFILE"))"
  exit 0
fi
nohup "$NODE" "$LEAGUE/commons/consults/minimax-driver.js" >> "$LEAGUE/logs/minimax-driver.log" 2>&1 &
echo $! > "$PIDFILE"
echo "minimax driver started (pid $!)"
