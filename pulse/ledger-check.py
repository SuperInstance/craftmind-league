#!/usr/bin/env python3
"""Tolerant-reader sweep for a JSONL ledger — makes torn lines LOUD.

Scans the ledger line by line. Well-formed lines pass. Torn or
unparseable lines are SPLIT-RECOVERED where possible (concatenated JSON
objects are decoded one after another) and reported, never silently
dropped. A torn line whose records are restated by a later
kind:"correction" entry (its `restated` list) counts as SUPERSEDED —
reported as covered, not as damage.

USAGE: ledger-check.py [LEDGER_PATH]
Default: the ledger.jsonl next to this script.
EXIT: 0 = clean, or every torn line is superseded by a correction entry
      1 = an unsuperseded torn/unparseable line exists (or a correction
          is itself malformed)
      2 = usage / IO error
"""
import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_LEDGER = os.path.join(HERE, "ledger.jsonl")


def split_records(text):
    """Decode back-to-back JSON values; return (objects, error_or_None)."""
    dec = json.JSONDecoder()
    objs, idx, n = [], 0, len(text)
    while idx < n:
        while idx < n and text[idx] in " \t\r\n":
            idx += 1
        if idx >= n:
            break
        try:
            obj, end = dec.raw_decode(text, idx)
        except Exception as e:
            return objs, str(e)
        objs.append(obj)
        idx = end
    return objs, None


def main(argv):
    path = argv[1] if len(argv) > 1 else DEFAULT_LEDGER
    try:
        raw = open(path, "rb").read()
    except OSError as e:
        print("ledger-check: cannot read %s: %s" % (path, e))
        return 2
    lines = raw.split(b"\n")
    trailing = b""
    if lines and lines[-1] == b"":
        lines.pop()
    elif lines:
        trailing = lines[-1]
    torn, clean, other_bad = [], 0, []
    entries = []
    for i, b in enumerate(lines, 1):
        try:
            text = b.decode("utf-8")
        except UnicodeDecodeError as e:
            other_bad.append((i, "utf-8 decode: %s" % e))
            continue
        try:
            obj = json.loads(text)
            clean += 1
            entries.append((i, obj))
            continue
        except Exception:
            pass
        objs, err = split_records(text)
        if objs and err is None:
            torn.append((i, b, objs))
        else:
            other_bad.append((i, err or "unparseable"))
    corrections = {}
    for ln, obj in entries:
        if isinstance(obj, dict) and obj.get("kind") == "correction":
            for r in obj.get("restated") or []:
                if isinstance(r, dict) and r.get("id"):
                    corrections[r["id"]] = obj.get("id")
    print("ledger-check: %s" % path)
    print("  physical lines: %d | clean: %d | torn: %d | unparseable: %d"
          % (len(lines), clean, len(torn), len(other_bad)))
    exitcode = 0
    for i, b, objs in torn:
        ids = [o.get("id") if isinstance(o, dict) else None for o in objs]
        covered = [x for x in ids if x in corrections]
        sha = hashlib.sha256(b).hexdigest()[:16]
        if len(covered) == len([x for x in ids if x]):
            print("  line %d: TORN (sha256 %s...) %d fused records %s — SUPERSEDED by correction %s"
                  % (i, sha, len(objs), ids, [corrections[x] for x in covered]))
        else:
            exitcode = 1
            print("  line %d: TORN (sha256 %s...) %d fused records %s — NOT fully superseded (covered: %s) — READERS LOSE THE REST"
                  % (i, sha, len(objs), ids, covered))
    for i, err in other_bad:
        exitcode = 1
        print("  line %d: UNPARSEABLE — %s" % (i, err))
    if trailing:
        print("  WARNING: file does not end in a newline (torn tail risk)")
    print("  verdict:", "OK — every torn line is superseded" if exitcode == 0
          else "DAMAGE — unsuperseded corruption present")
    return exitcode


if __name__ == "__main__":
    sys.exit(main(sys.argv))
