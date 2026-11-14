#!/bin/sh
# Watcher's Charter runner — one invocation does one full pass:
#   1. heartbeat emitter (effects -> commons/heartbeats/)
#   2. meta-watcher (staleness -> commons/alarms/)
# Driven by league-meta-watcher.timer (5 min) on whichever host runs it.
# Thor copy: host=thor. Orin copy: host=orin (its emitter ships the
# cameraman/capture heartbeats to the Thor, rule 3 cross-host).
set -u
HOST_KIND="${1:-thor}"
DIR="$(cd "$(dirname "$0")" && pwd)"
PY=/usr/bin/python3
"$PY" "$DIR/heartbeat_emitter.py" "$HOST_KIND"
"$PY" "$DIR/meta_watcher.py"
# meta-watcher exit 3 (stale watchers) is an alarm, not a runner failure;
# the alarm artefact + log are the record. Only real errors fail the unit.
rc=$?
[ "$rc" -eq 3 ] && exit 0
exit "$rc"
