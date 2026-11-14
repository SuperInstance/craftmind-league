#!/bin/bash
# log-mirror.sh — Thor-local mirror of the Orin server-log tail
# (charter §5 / readiness §12 item 5). The floor's daylight
# verification reads rig.server_log_path; live, that path is THIS
# mirror: a read-only tail of the Orin's latest.log, refreshed over
# ssh. Read-only toward the Orin: one `tail -c` per refresh, nothing
# written there, no game login, no server command.
#
# Each refresh REPLACES the mirror with the log's last MIRROR_BYTES
# (default 512 KiB — far more than a daylight cycle appends),
# BYTE-FAITHFUL (rig repair, RIG-REPAIR-20261109.md: no bytes added,
# none removed — the previous version's framing echo appended one
# newline that shifted every mirror offset -1 vs the true log, which
# is how day 11's floor missed three landed commands), and stamps
# mirror-stamp.json {ts, bytes, source_size}. The floor records file
# offsets and verifies landings with a look-behind search (floor.js),
# so a snapshot rewrite can never place a landed line outside its
# window; offsets taken before a refresh stay meaningful as long as
# the window between refreshes appends less than MIRROR_BYTES.
#
# usage: log-mirror.sh once          one refresh, prints stamp json
#        log-mirror.sh loop [secs]   refresh every secs (default 1)
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
MIRROR="$DIR/server-log-mirror.log"
STAMP="$DIR/mirror-stamp.json"
HOST="${ORIN_SSH:-casey@192.168.0.50}"
REMOTE="${ORIN_LOG:-~/minecraft-server/logs/latest.log}"
BYTES="${MIRROR_BYTES:-524288}"

refresh() {
  local tmp="$MIRROR.tmp.$$"
  if ssh -o ConnectTimeout=5 -o BatchMode=yes "$HOST" \
       "stat -c %s $REMOTE 2>/dev/null; tail -c $BYTES $REMOTE 2>/dev/null" \
       > "$tmp.raw" 2>/dev/null; then
    # Rig repair (RIG-REPAIR-20261109.md): the FIRST line of the raw
    # capture is the stat size; the body is the log tail VERBATIM.
    # The old form appended `echo` AFTER the tail and stripped the last
    # line -- which added exactly one newline byte the real log does not
    # have (every line offset in the mirror shifted -1 against the true
    # log; the day-11 park), and could eat log content for a log not
    # ending in a newline. The mirror is now byte-faithful: its size
    # equals the stat size whenever the log is smaller than MIRROR_BYTES.
    local srcsize
    srcsize=$(head -n 1 "$tmp.raw")
    tail -n +2 "$tmp.raw" > "$tmp"
    rm -f "$tmp.raw"
    mv "$tmp" "$MIRROR"
    printf '{"ts": "%s", "bytes": %s, "source_size": %s, "source": "%s:%s"}\n' \
      "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$(stat -c %s "$MIRROR")" "${srcsize:-0}" "$HOST" "$REMOTE" > "$STAMP"
    cat "$STAMP"
  else
    rm -f "$tmp" "$tmp.raw"
    echo '{"ok": false, "stage": "ssh"}' >&2
    return 1
  fi
}

case "${1:-once}" in
  once) refresh ;;
  loop) while true; do refresh >/dev/null 2>&1 || true; sleep "${2:-1}"; done ;;
  *) echo "usage: log-mirror.sh once|loop [secs]" >&2; exit 2 ;;
esac
