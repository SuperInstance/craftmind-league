#!/usr/bin/env python3
"""Append ONE JSON object as ONE line to the league ledger — safely.

WHY THIS EXISTS: pulse/ledger.jsonl line 202 was torn when two lanes'
concurrent appends interleaved (a cameraman renewal verdict fused with
a triples-allocator claim onto one physical line; strict JSONL readers
silently dropped BOTH records). Bare open(path, "a") appends are NOT
atomic across a whole long line. See the correction entry
ledger-line202-correction-20261108 in the ledger itself, and
~/workspace/studies/ingestion-audit-20261108.md fix 1.

USAGE (any language — just shell out):
    ledger-append.py [LEDGER_PATH] < entry.json   # JSON object on stdin
    ledger-append.py --entry '<json object>' [LEDGER_PATH]
Default LEDGER_PATH: the ledger.jsonl next to this script. Library use:
    from importlib import util as _u
    _s = _u.spec_from_file_location("la", "ledger-append.py"); la = _u.module_from_spec(_s); _s.loader.exec_module(la)
    la.append_entry(obj)            # returns the 1-based line number written

HOW IT WORKS: flock(LOCK_EX) on the ledger file serialises appenders;
under the lock: refuse to append to a torn tail (a file not ending in a
newline is reported, never silently compounded); write the line with a
single os.write on an O_APPEND descriptor; fsync; re-read the tail and
byte-verify our own line before releasing the lock.

Single-writer discipline going forward: ALL ledger appends route
through this helper. Verify any time with: ledger-check.py
"""
import fcntl
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_LEDGER = os.path.join(HERE, "ledger.jsonl")


def append_entry(obj, path=DEFAULT_LEDGER):
    """Append dict `obj` as one JSON line; return its 1-based line number."""
    if not isinstance(obj, dict):
        raise ValueError("ledger entries must be JSON objects")
    line = (json.dumps(obj, ensure_ascii=False) + "\n").encode("utf-8")
    fd = os.open(path, os.O_RDWR | os.O_CREAT, 0o644)
    try:
        fcntl.flock(fd, fcntl.LOCK_EX)
        size = os.fstat(fd).st_size
        if size:
            os.lseek(fd, size - 1, os.SEEK_SET)
            if os.read(fd, 1) != b"\n":
                raise IOError(
                    "torn tail: %s does not end in a newline; refusing to "
                    "append (run ledger-check.py)" % path)
        wfd = os.open(path, os.O_WRONLY | os.O_APPEND)
        try:
            n = os.write(wfd, line)
            if n != len(line):
                raise IOError("short write: %d of %d bytes" % (n, len(line)))
            os.fsync(wfd)
        finally:
            os.close(wfd)
        # read-back verify, still under the lock
        os.lseek(fd, 0, os.SEEK_SET)
        data = b""
        while True:
            chunk = os.read(fd, 1 << 20)
            if not chunk:
                break
            data += chunk
        lines = data.split(b"\n")
        if lines and lines[-1] == b"":
            lines.pop()
        if not lines or lines[-1] + b"\n" != line:
            raise IOError("read-back verify failed: tail is not the line just written")
        json.loads(lines[-1].decode("utf-8"))
        return len(lines)
    finally:
        fcntl.flock(fd, fcntl.LOCK_UN)
        os.close(fd)


def main(argv):
    args = list(argv[1:])
    path = DEFAULT_LEDGER
    entry_text = None
    if "--entry" in args:
        i = args.index("--entry")
        entry_text = args[i + 1]
        del args[i:i + 2]
    if args:
        path = args[0]
    if entry_text is None:
        entry_text = sys.stdin.read()
    obj = json.loads(entry_text)
    n = append_entry(obj, path)
    print("appended line %d to %s" % (n, path))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
