#!/bin/bash
# holdkeeper-loop.sh — op-channel daylight hold-keeper (parent dispatch 2026-11-09)
# Issues /time set 1000 via the standalone Gallery op process (op-day9.js)
# every ~300s; verifies EACH landing in the Orin server log (independent store).
set -u
BASE=/home/caseydigennaro/craftmind-league/pulse
NODE=/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node
REQ=$BASE/holdkeeper-op-req.jsonl
RES=$BASE/holdkeeper-op-res.jsonl
OPLOG=$BASE/holdkeeper-op-console.log
CKPT=$BASE/HOLD-KEEPER-20261109.md
LOOPLOG=$BASE/holdkeeper-loop.log
SSH="ssh -o StrictHostKeyChecking=no -o ConnectTimeout=8 casey@192.168.0.50"
PATTERN='Gallery issued server command: /time set 1000'

log(){ echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" >> "$LOOPLOG"; }

count_landings(){ $SSH "grep -c \"$PATTERN\" ~/minecraft-server/logs/latest.log" 2>/dev/null || echo -1; }
last_landing_line(){ $SSH "grep \"$PATTERN\" ~/minecraft-server/logs/latest.log | tail -1" 2>/dev/null; }
magnus_leave_count(){ $SSH "grep -cE 'MagnusandMouse (left the game|lost connection)' ~/minecraft-server/logs/latest.log" 2>/dev/null || echo -1; }
gallery_collision_count(){ $SSH "grep -c 'Gallery lost connection: You logged in from another location' ~/minecraft-server/logs/latest.log" 2>/dev/null || echo -1; }

ISSUES=0; LANDED=0; LAST_LANDING="none"; OP_PID=""

checkpoint(){
  local status="$1"
  {
    echo "# HOLD-KEEPER — op-channel daylight hold (2026-11-09)"
    echo ""
    echo "- status: $status"
    echo "- loop_pid: $$"
    echo "- op_pid: $OP_PID"
    echo "- issues: $ISSUES"
    echo "- landed_verified: $LANDED"
    echo "- last_landing_utc: $LAST_LANDING"
    echo "- last_checkpoint_utc: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "- server_log_last_landing_line: $(last_landing_line)"
    echo "- cameraman: PARKED (STOP present, not relaunched by this lane)"
    echo "- client: MagnusandMouse headed client left alone by this lane"
  } > "$CKPT.tmp" && mv "$CKPT.tmp" "$CKPT"
}

stop_and_exit(){
  local reason="$1"
  log "STOP: $reason"
  checkpoint "STOPPED — $reason"
  if [ -n "$OP_PID" ] && kill -0 "$OP_PID" 2>/dev/null; then
    printf '{"cmd":"quit","id":"holdkeeper-final-quit"}\n' >> "$REQ"
    sleep 3
    kill "$OP_PID" 2>/dev/null || true
  fi
  exit 0
}

# --- fresh req/res (never replay stale queues) ---
: > "$REQ"; : > "$RES"; : > "$OPLOG"
log "hold-keeper starting; loop pid $$"
# --- launch op bot ---
cd "$BASE" || exit 1
"$NODE" op-day9.js "$REQ" "$RES" >> "$OPLOG" 2>&1 &
OP_PID=$!
log "op bot launched pid $OP_PID"
# wait for spawn
for i in $(seq 1 30); do
  if grep -q "OP spawned as Gallery" "$OPLOG" 2>/dev/null; then break; fi
  if ! kill -0 "$OP_PID" 2>/dev/null; then stop_and_exit "op bot died at launch (see holdkeeper-op-console.log)"; fi
  sleep 1
done
grep -q "OP spawned as Gallery" "$OPLOG" || stop_and_exit "op bot did not spawn within 30s"
log "op spawned verified in console log"

BASE_MAGNUS_LEAVES=$(magnus_leave_count)
BASE_COLLISIONS=$(gallery_collision_count)
log "baselines: magnus_leave_count=$BASE_MAGNUS_LEAVES gallery_collision_count=$BASE_COLLISIONS"
checkpoint "RUNNING — op spawned, first issue imminent"

attempt_issue(){
  # returns 0 if landing verified in server log, 1 otherwise
  local before after tries id
  before=$(count_landings)
  id="hold-$(date -u +%Y%m%dT%H%M%SZ)-$ISSUES"
  printf '{"cmd":"chat","text":"/time set 1000","id":"%s"}\n' "$id" >> "$REQ"
  ISSUES=$((ISSUES+1))
  log "issued $id (before_count=$before)"
  # wait for res entry
  for tries in $(seq 1 20); do
    grep -q "\"id\":\"$id\"" "$RES" 2>/dev/null && break
    sleep 1
  done
  # verify landing in the Orin server log (independent store)
  for tries in $(seq 1 25); do
    after=$(count_landings)
    if [ "$after" != "-1" ] && [ "$before" != "-1" ] && [ "$after" -gt "$before" ]; then
      LANDED=$((LANDED+1))
      LAST_LANDING=$(date -u +%Y-%m-%dT%H:%M:%SZ)
      log "LANDED verified: $id count $before -> $after"
      return 0
    fi
    sleep 1
  done
  log "MISS: $id did not land in server log within window (before=$before after=${after:-?})"
  return 1
}

while true; do
  # safety checks before each cycle
  ML=$(magnus_leave_count)
  if [ "$ML" != "-1" ] && [ "$BASE_MAGNUS_LEAVES" != "-1" ] && [ "$ML" -gt "$BASE_MAGNUS_LEAVES" ]; then
    stop_and_exit "MagnusandMouse disconnected (leave count $BASE_MAGNUS_LEAVES -> $ML)"
  fi
  GC=$(gallery_collision_count)
  if [ "$GC" != "-1" ] && [ "$BASE_COLLISIONS" != "-1" ] && [ "$GC" -gt "$BASE_COLLISIONS" ]; then
    stop_and_exit "Gallery login collision detected (collision count $BASE_COLLISIONS -> $GC)"
  fi
  if ! kill -0 "$OP_PID" 2>/dev/null; then
    stop_and_exit "op bot process died (pid $OP_PID)"
  fi
  if attempt_issue; then
    checkpoint "RUNNING — hold landing-verified"
  else
    log "first attempt missed; retrying once immediately"
    if attempt_issue; then
      checkpoint "RUNNING — hold landing-verified (on retry)"
    else
      stop_and_exit "two consecutive missed landings (issue+retry) — per charter, no third mechanism improvised"
    fi
  fi
  sleep 290
done
