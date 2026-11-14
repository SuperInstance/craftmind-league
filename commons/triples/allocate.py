#!/usr/bin/env python3
"""Triples library id allocation — the single write path for triples.jsonl.

Ids are `triple-NNN-<slug>`: unique, never reused (see README.md). They
used to be allocated by hand — each lane counting the existing entries
itself — which produced duplicate 007 and 008 pairs (renumbered openly by
the correction entries triple-012 / triple-014; README "Id allocation and
re-identification"). The rules now:

  - Draw every id from this allocator. Never count lines yourself.
  - The allocator holds an exclusive flock (triples.jsonl.lock) across
    the whole read-max -> re-check -> append -> verify sequence, so two
    lanes can never be handed the same number.
  - "Used" numbers are the ids on lines in the file PLUS any re-id
    target declared in a correction entry's plan.reids.to — a renumbered
    triple's new number is reserved even though no line bears it.
  - Immediately before appending, the used set is re-read and the
    candidate recomputed if it moved (the 2026-11-08 discipline: max+1,
    then re-check before the write).
  - The entry is appended as ONE os.write() of a complete line on an
    O_APPEND descriptor: a concurrent reader sees the old library or the
    new one, never a torn half-line from this path.
  - After appending, the file is re-read under the same lock and the new
    id must appear exactly once; anything else raises and files nothing
    silently.

Usage — filing a new triple (the entry JSON may omit "id" or carry "";
the allocator stamps it):
  python3 commons/triples/allocate.py --slug my-plan-name --entry /tmp/triple.json

Advisory only (reserves nothing; another lane may take the number first):
  python3 commons/triples/allocate.py --next

Importable:
  from allocate import append_triple, next_number
  new_id = append_triple(entry_dict, slug="my-plan-name")
"""
import argparse, fcntl, json, os, re, sys
from pathlib import Path

ID_RE = re.compile(r"^triple-(\d+)-")
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def _used_numbers(lib: Path):
    """Every number that may never be handed out again: line ids plus
    re-id targets reserved by correction entries (plan.reids.to)."""
    used = set()
    if not lib.exists():
        return used
    for line in lib.read_text().splitlines():
        if not line.strip():
            continue
        try:
            t = json.loads(line)
        except Exception:
            continue  # a torn tail from a non-allocator writer is not an entry
        for cand in (t.get("id"), ((t.get("plan") or {}).get("reids") or {}).get("to")):
            m = ID_RE.match(str(cand or ""))
            if m:
                used.add(int(m.group(1)))
    return used


def _fmt(n, slug):
    return f"triple-{n:03d}-{slug}"


def next_number(library=None):
    """Advisory next number (no reservation, no lock held for the caller)."""
    lib = Path(library) if library else Path(__file__).with_name("triples.jsonl")
    used = _used_numbers(lib)
    return (max(used) + 1) if used else 1


def append_triple(entry, slug, library=None):
    """Allocate the next id and append `entry` stamped with it, atomically.
    Returns the full new id."""
    if not SLUG_RE.match(slug or ""):
        raise ValueError(f"bad slug {slug!r}: lowercase letters, digits, hyphens")
    lib = Path(library) if library else Path(__file__).with_name("triples.jsonl")
    lock_path = lib.with_name(lib.name + ".lock")
    with open(lock_path, "a+") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        try:
            while True:
                used = _used_numbers(lib)
                n = (max(used) + 1) if used else 1
                # RE-CHECK immediately before the append, still locked:
                if _used_numbers(lib) == used:
                    break
            new_id = _fmt(n, slug)
            stamped = dict(entry)
            stamped["id"] = new_id
            payload = (json.dumps(stamped) + "\n").encode()
            fd = os.open(lib, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o660)
            try:
                os.write(fd, payload)  # one write of the whole line: no torn appends
                os.fsync(fd)
            finally:
                os.close(fd)
            hits = 0
            for line in lib.read_text().splitlines():
                try:
                    if json.loads(line).get("id") == new_id:
                        hits += 1
                except Exception:
                    continue
            if hits != 1:
                raise RuntimeError(f"post-append verify failed: {new_id} appears {hits} times")
            return new_id
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)


def main():
    ap = argparse.ArgumentParser(description="Allocate a triples id / file a triple.")
    ap.add_argument("--next", action="store_true",
                    help="print the advisory next id and exit (reserves nothing)")
    ap.add_argument("--slug", default=None, help="slug for the new triple's id")
    ap.add_argument("--entry", default=None,
                    help="path to a JSON file holding the triple (its id is stamped)")
    ap.add_argument("--library", default=None,
                    help="path to triples.jsonl (default: beside this script)")
    args = ap.parse_args()
    lib = Path(args.library) if args.library else Path(__file__).with_name("triples.jsonl")
    if args.next:
        print(_fmt(next_number(lib), args.slug or "<slug>"))
        return 0
    if not args.entry or not args.slug:
        print("filing needs --entry FILE and --slug SLUG (or use --next)", file=sys.stderr)
        return 2
    entry = json.loads(Path(args.entry).read_text())
    print(append_triple(entry, args.slug, lib))
    return 0


if __name__ == "__main__":
    sys.exit(main())
