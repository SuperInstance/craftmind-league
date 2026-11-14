#!/usr/bin/env python3
"""Heartbeat emitter — Watcher's Charter rule 2, wrapper-side.

Reads each watcher's OUTPUT ARTEFACTS (never just a pid: a live pid with a
frozen artefact is a dead watcher — the curator-crash lesson) and writes a
content-bearing heartbeat JSON per watcher into the league commons
heartbeats/ dir, which no watcher owns or writes to itself.

One emitter runs per host (Thor here; an Orin copy handles cameraman +
capture and ships its heartbeats to the Thor over the LAN ssh alias
thor-lan, rule 3 cross-host). The emitters share no code with the watchers;
this file is stdlib-only by charter (rule 8 boringness, applied early).

Effect sources (what "last verified effect" means per watcher):
  curator          newest manifest line ts / state.json offsets in ~/curator
  digest           digest/digest.jsonl last line ts + tick
  governor         ledger/mind-calls.jsonl last receipt ts + agent
  glm-driver       newest answer entry ts in commons/consults/glm.jsonl
  minimax-driver   newest answer entry ts in commons/consults/minimax.jsonl
  cameraman        last "VERIFIED LANDED" line ts in cameraman.log (Orin)
  capture          newest segment start in ~/capture/segments.jsonl (Orin)

Usage:
  heartbeat_emitter.py thor   [--out DIR]
  heartbeat_emitter.py orin   [--out DIR] [--ship]
"""
import json, os, subprocess, sys, time
from datetime import datetime, timezone

HOME = os.path.expanduser("~")
LEAGUE = os.path.join(HOME, "craftmind-league")
DEFAULT_OUT = os.path.join(LEAGUE, "commons", "heartbeats")


def now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def tail_lines(path, n=60, chunk=65536):
    """Last n lines of a file without loading it whole."""
    try:
        with open(path, "rb") as f:
            f.seek(0, os.SEEK_END)
            size = f.tell()
            f.seek(max(0, size - chunk))
            data = f.read().decode("utf-8", "replace")
        return data.splitlines()[-n:]
    except OSError:
        return []


def last_jsonl_effect(path, want_types=None):
    """(ts_string, summary_dict) of the newest parseable JSONL entry,
    optionally restricted to entries whose type is in want_types."""
    for line in reversed(tail_lines(path, 400)):
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            e = json.loads(line)
        except ValueError:
            continue
        if want_types and e.get("type") not in want_types:
            continue
        return e.get("ts"), e
    return None, None


def file_probe(path):
    try:
        st = os.stat(path)
        return st.st_mtime, st.st_size
    except OSError:
        return None, None


def hb(name, host, period_s, effect, effect_ts, detail=""):
    return {
        "watcher": name,
        "host": host,
        "emitted_at": now_iso(),
        "declared_period_s": period_s,
        "last_effect": effect,
        "last_effect_ts": effect_ts,
        "detail": detail,
    }


# ---------------- Thor watchers ----------------

def curator_beat():
    mpath = os.path.join(HOME, "curator", "manifests", "manifest-2026-11-08.jsonl")
    ts, e = last_jsonl_effect(mpath)
    if e is None:  # fall back to newest manifest file present
        mdir = os.path.join(HOME, "curator", "manifests")
        try:
            files = sorted(f for f in os.listdir(mdir) if f.endswith(".jsonl"))
            if files:
                ts, e = last_jsonl_effect(os.path.join(mdir, files[-1]))
        except OSError:
            pass
    if e is not None:
        effect = "moment %s citizen=%s kind=%s" % (
            e.get("id", "?"), e.get("event_citizen", e.get("citizen", "?")),
            e.get("kind", e.get("type", "?")))
        return hb("curator", "thor", 600, effect, ts)
    mtime, _ = file_probe(os.path.join(HOME, "curator", "state.json"))
    eff_ts = datetime.fromtimestamp(mtime, timezone.utc).isoformat().replace("+00:00", "Z") if mtime else None
    return hb("curator", "thor", 600, "no manifest entries readable", eff_ts,
              "state.json mtime used; manifest probe failed")


def digest_beat():
    ts, e = last_jsonl_effect(os.path.join(LEAGUE, "digest", "digest.jsonl"))
    if e is not None:
        return hb("digest", "thor", 30, "digest tick %s tod=%s" % (e.get("tick"), e.get("timeOfDay")), ts)
    return hb("digest", "thor", 30, "no digest entries readable", None)


def governor_beat():
    ts, e = last_jsonl_effect(os.path.join(LEAGUE, "ledger", "mind-calls.jsonl"))
    if e is not None:
        return hb("governor", "thor", 900,
                  "mind-call receipt agent=%s status=%s" % (e.get("agent"), e.get("status")), ts,
                  "effect = receipt flow; governor is demand-driven, staleness means no calls flowed OR governor down — alarm text says which cannot be distinguished from receipts alone")
    return hb("governor", "thor", 900, "no receipts readable", None)


def _driver_beat(name, book):
    path = os.path.join(LEAGUE, "commons", "consults", book)
    ts, e = last_jsonl_effect(path, want_types={"answer"})
    if e is not None:
        return hb(name, "thor", 3600, "answer id=%s citizen=%s" % (e.get("id"), e.get("citizen")), ts,
                  "effect = answers, not polls. Demand-driven: the driver polls the book every ~60 s but an answer only exists when a citizen files a consult, so the declared period is 3600 s (one answer per active hour expected) with 2x grace on top. A filed-but-unanswered consult aging past the driver's own poll cycle is the sharper alarm and is read directly from the book by anyone auditing; this beat proves the seat path end-to-end when answers flow.")
    return hb(name, "thor", 3600, "no answers in book yet", None,
              "driver may be healthy-but-idle; staleness of this beat means no answer has EVER landed or the book is unreadable")


def glm_beat():
    return _driver_beat("glm-driver", "glm.jsonl")


def minimax_beat():
    return _driver_beat("minimax-driver", "minimax.jsonl")


# ---------------- Orin watchers ----------------

def cameraman_beat():
    log = os.path.join(HOME, "cameraman", "cameraman.log")
    landed = [l for l in tail_lines(log, 3000) if "VERIFIED LANDED" in l]
    if landed:
        line = landed[-1]
        ts = line.split(" ", 1)[0]
        return hb("cameraman", "orin", 300, "daylight refresh VERIFIED LANDED in server log", ts,
                  "rule-1 reference instance; emitter reads the cameraman's own landing-verification records (an independent-store effect it cannot fabricate)")
    return hb("cameraman", "orin", 300, "no VERIFIED LANDED line found", None)


def capture_beat():
    ts_epoch, e = None, None
    for line in reversed(tail_lines(os.path.join(HOME, "capture", "segments.jsonl"), 50)):
        try:
            e = json.loads(line)
            ts_epoch = e.get("start")
            break
        except ValueError:
            continue
    if e is not None and ts_epoch:
        eff_ts = datetime.fromtimestamp(ts_epoch, timezone.utc).isoformat().replace("+00:00", "Z")
        return hb("capture", "orin", 300, "segment %s started" % e.get("segment"), eff_ts)
    return hb("capture", "orin", 300, "no segments readable", None)


THOR_BEATS = [curator_beat, digest_beat, governor_beat, glm_beat, minimax_beat]
ORIN_BEATS = [cameraman_beat, capture_beat]


def write_beats(beats, outdir):
    os.makedirs(outdir, exist_ok=True)
    written = []
    for fn in beats:
        try:
            beat = fn()
        except Exception as exc:  # an emitter failure must still leave a trace
            beat = {"watcher": fn.__name__.replace("_beat", ""), "host": "?",
                    "emitted_at": now_iso(), "declared_period_s": 0,
                    "last_effect": "EMITTER ERROR: %s" % exc, "last_effect_ts": None}
        path = os.path.join(outdir, beat["watcher"] + ".json")
        tmp = path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(beat, f, indent=1, sort_keys=True)
        os.replace(tmp, path)
        written.append(path)
    return written


def ship_to_thor(local_paths):
    """Copy Orin heartbeats to the Thor commons via the fleet's LAN alias."""
    dest = "thor-lan:craftmind-league/commons/heartbeats/"
    cmd = ["scp", "-q", "-o", "ConnectTimeout=10"] + local_paths + [dest]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    return r.returncode == 0, (r.stderr or r.stdout).strip()


def main():
    args = sys.argv[1:]
    if not args or args[0] not in ("thor", "orin"):
        print(__doc__)
        return 2
    host = args[0]
    outdir = DEFAULT_OUT
    ship = False
    if "--out" in args:
        outdir = args[args.index("--out") + 1]
    if "--ship" in args:
        ship = True
    beats = THOR_BEATS if host == "thor" else ORIN_BEATS
    if host == "orin" and not ship:
        outdir = "/tmp/heartbeats-orin" if outdir == DEFAULT_OUT else outdir
    written = write_beats(beats, outdir)
    for p in written:
        print("wrote", p)
    if host == "orin":
        # The Orin capture/cameraman heartbeats must LAND ON THE THOR (rule 3).
        ok, msg = ship_to_thor(written)
        print("ship to thor:", "OK" if ok else "FAILED: " + msg)
        return 0 if ok else 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
