#!/usr/bin/env python3
"""Meta-watcher — Watcher's Charter rule 8, first pass.

The league's simplest code: Python stdlib only, no shared libraries with
the watchers, no imports beyond the standard library. It does exactly
three things:

  1. Read every heartbeat JSON in the commons heartbeats/ dir.
  2. Compare each heartbeat's EFFECT timestamp (not the file mtime, not
     the emission time — the age of the last verified effect) against
     the watcher's declared period + grace (grace = 2x period, charter
     rule 2). A heartbeat file that stops being refreshed is itself
     caught: its effect ages in real time.
  3. On staleness: write a loud ALARM artefact
     (commons/alarms/alarm-<watcher>-<epoch>.json) and append a line to
     commons/alarms/alarm.log. When everything is fresh: write/refresh
     commons/alarms/ALL-CLEAR.json. Its own heartbeat
     (commons/heartbeats/meta-watcher.json) is refreshed each run so a
     future external dead-man's-switch expecter can watch the watcher
     (rule 8c — NOT yet registered with any external service; that gap
     is stated in OPERATIONS.md, not smoothed over).

A test watcher (watcher name starting with "test-") may carry an
explicit "force_stale": true in its heartbeat file, used by the
rule-7 end-to-end drill; real watchers never set it.

Exit code: 0 = all clear, 3 = at least one stale watcher, 2 = the
heartbeats store itself is unreadable (which is also an alarm).
"""
import json, os, sys, time
from datetime import datetime, timezone

HOME = os.path.expanduser("~")
COMMONS = os.path.join(HOME, "craftmind-league", "commons")
HB_DIR = os.path.join(COMMONS, "heartbeats")
ALARM_DIR = os.path.join(COMMONS, "alarms")
ALARM_LOG = os.path.join(ALARM_DIR, "alarm.log")
GRACE_FACTOR = 2  # charter rule 2: grace ~ 2x period


def iso_now():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def parse_ts(s):
    if not s:
        return None
    try:
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return None
    if dt.tzinfo is None:  # fleet logs use naive UTC in places (cameraman)
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def append_alarm_log(line):
    os.makedirs(ALARM_DIR, exist_ok=True)
    with open(ALARM_LOG, "a") as f:
        f.write(line + "\n")


def main():
    if not os.path.isdir(HB_DIR):
        append_alarm_log("%s ALARM meta-watcher: heartbeat store %s missing" % (iso_now(), HB_DIR))
        print("ALARM: heartbeat store missing")
        return 2
    now = datetime.now(timezone.utc)
    stale, fresh = [], []
    seen = set()
    for fname in sorted(os.listdir(HB_DIR)):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(HB_DIR, fname)
        try:
            with open(path) as f:
                beat = json.load(f)
        except (OSError, ValueError) as exc:
            stale.append({"watcher": fname[:-5], "reason": "heartbeat unreadable: %s" % exc,
                          "last_effect": None, "last_effect_ts": None})
            continue
        name = beat.get("watcher", fname[:-5])
        if name == "meta-watcher":
            continue  # own heartbeat is refreshed below, never judged by itself
        seen.add(name)
        period = beat.get("declared_period_s") or 0
        limit = period * (1 + GRACE_FACTOR)
        eff_dt = parse_ts(beat.get("last_effect_ts"))
        if beat.get("force_stale"):
            stale.append({"watcher": name, "reason": "FORCED STALE (rule-7 drill)",
                          "last_effect": beat.get("last_effect"),
                          "last_effect_ts": beat.get("last_effect_ts")})
        elif eff_dt is None:
            stale.append({"watcher": name, "reason": "no verified effect on record",
                          "last_effect": beat.get("last_effect"),
                          "last_effect_ts": None})
        else:
            age = (now - eff_dt).total_seconds()
            if age > limit:
                stale.append({"watcher": name,
                              "reason": "effect age %.0fs exceeds period %ss + grace (limit %.0fs)" % (age, period, limit),
                              "last_effect": beat.get("last_effect"),
                              "last_effect_ts": beat.get("last_effect_ts"),
                              "age_s": round(age)})
            else:
                fresh.append(name)
    os.makedirs(ALARM_DIR, exist_ok=True)
    if stale:
        for s in stale:
            artefact = {"kind": "watcher-alarm", "ts": iso_now(),
                        "watcher": s["watcher"], "reason": s["reason"],
                        "last_effect": s.get("last_effect"),
                        "last_effect_ts": s.get("last_effect_ts"),
                        "raised_by": "meta-watcher (charter rule 8, first pass)"}
            apath = os.path.join(ALARM_DIR, "alarm-%s-%d.json" % (s["watcher"], int(time.time())))
            with open(apath, "w") as f:
                json.dump(artefact, f, indent=1, sort_keys=True)
            append_alarm_log("%s ALARM %s: %s (last effect: %s @ %s) artefact=%s" % (
                iso_now(), s["watcher"], s["reason"], s.get("last_effect"),
                s.get("last_effect_ts"), os.path.basename(apath)))
            print("ALARM %s: %s" % (s["watcher"], s["reason"]))
        # all-clear artefact must not claim health during an alarm
        clear_path = os.path.join(ALARM_DIR, "ALL-CLEAR.json")
        if os.path.exists(clear_path):
            os.remove(clear_path)
    else:
        clear = {"kind": "all-clear", "ts": iso_now(), "fresh_watchers": sorted(fresh),
                 "raised_by": "meta-watcher (charter rule 8, first pass)"}
        with open(os.path.join(ALARM_DIR, "ALL-CLEAR.json"), "w") as f:
            json.dump(clear, f, indent=1, sort_keys=True)
        print("ALL CLEAR:", ", ".join(sorted(fresh)) or "(none)")
    # own heartbeat (rule 8c hook; external expecter not yet registered)
    own = {"watcher": "meta-watcher", "host": "thor", "emitted_at": iso_now(),
           "declared_period_s": 300,
           "last_effect": "staleness sweep: %d fresh, %d stale" % (len(fresh), len(stale)),
           "last_effect_ts": iso_now(),
           "detail": "external dead-man's-switch expecter NOT registered yet (rule 8c gap, declared)"}
    tmp = os.path.join(HB_DIR, "meta-watcher.json.tmp")
    with open(tmp, "w") as f:
        json.dump(own, f, indent=1, sort_keys=True)
    os.replace(tmp, os.path.join(HB_DIR, "meta-watcher.json"))
    return 3 if stale else 0


if __name__ == "__main__":
    sys.exit(main())
