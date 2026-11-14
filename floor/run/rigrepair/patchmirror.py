p = "floor/run/day11/log-mirror.sh"
s = open(p).read()

old_cmd = '"tail -c $BYTES $REMOTE 2>/dev/null; echo; stat -c %s $REMOTE 2>/dev/null"'
new_cmd = '"stat -c %s $REMOTE 2>/dev/null; tail -c $BYTES $REMOTE 2>/dev/null"'
assert old_cmd in s, "mirror ssh command not found"
s = s.replace(old_cmd, new_cmd)

old_tail = """    local srcsize
    srcsize=$(tail -n 1 "$tmp.raw")
    head -n -1 "$tmp.raw" > "$tmp"
    rm -f "$tmp.raw\""""
new_tail = """    # Rig repair (RIG-REPAIR-20261109.md): the FIRST line of the raw
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
    rm -f "$tmp.raw\""""
assert old_tail in s, "mirror tail block not found"
s = s.replace(old_tail, new_tail)

old_hdr = """# Each refresh REPLACES the mirror with the log's last MIRROR_BYTES
# (default 512 KiB \u2014 far more than a daylight cycle appends) and
# stamps mirror-stamp.json {ts, bytes, source_size}. The floor only
# ever reads bytes appended after its own recorded offset; because a
# refresh is a full tail-snapshot, an offset taken before a refresh
# stays valid as long as the window between refreshes appends less
# than MIRROR_BYTES (at the observed append rate, minutes of log)."""
new_hdr = """# Each refresh REPLACES the mirror with the log's last MIRROR_BYTES
# (default 512 KiB \u2014 far more than a daylight cycle appends),
# BYTE-FAITHFUL (rig repair, RIG-REPAIR-20261109.md: no bytes added,
# none removed \u2014 the previous version's framing echo appended one
# newline that shifted every mirror offset -1 vs the true log, which
# is how day 11's floor missed three landed commands), and stamps
# mirror-stamp.json {ts, bytes, source_size}. The floor records file
# offsets and verifies landings with a look-behind search (floor.js),
# so a snapshot rewrite can never place a landed line outside its
# window; offsets taken before a refresh stay meaningful as long as
# the window between refreshes appends less than MIRROR_BYTES."""
assert old_hdr in s, "mirror header not found"
s = s.replace(old_hdr, new_hdr)
open(p, "w").write(s)
print("mirror patched")
