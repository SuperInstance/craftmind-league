#!/usr/bin/env python3
"""Triples library retrieval.

Query the league's (situation -> plan -> verified outcome) library with a
situation sketch and get matching triples back. Matching rules are declared
in commons/triples/README.md and printed with every result — no hidden
ranking, no embeddings, nothing invented.

Usage:
  retrieve.py --situation relocate wedge canopy --position 29.5 -101.5 --goal 64 -93
  retrieve.py --kind craft-chain-false-block
  retrieve.py --terms recipe-variant --include-unverified
"""
import argparse, json, sys
from pathlib import Path

SPAWN = (32, -96)
PROTECTION = (16, 48, -112, -80)  # x0, x1, z0, z1 — this world's square

def cheb(x, z):
    return max(abs(x - SPAWN[0]), abs(z - SPAWN[1]))

def in_protection(x, z):
    x0, x1, z0, z1 = PROTECTION
    return x0 <= x <= x1 and z0 <= z <= z1

def pos_class(x, z):
    return ("inside" if in_protection(x, z) else "outside") + \
           f" protection square, Chebyshev {cheb(x, z)} from spawn"

def main():
    ap = argparse.ArgumentParser(description="Query the triples library.")
    ap.add_argument("--situation", nargs="*", default=[],
                    help="situation terms, matched any-of against signature_terms")
    ap.add_argument("--terms", nargs="*", default=[],
                    help="alias of --situation")
    ap.add_argument("--kind", default=None, help="match situation.kind verbatim")
    ap.add_argument("--position", nargs=2, type=float, metavar=("X", "Z"),
                    help="the body's current position")
    ap.add_argument("--goal", nargs=2, type=float, metavar=("X", "Z"),
                    help="the goal position (used with --position)")
    ap.add_argument("--include-unverified", action="store_true",
                    help="also return triples whose outcome is unverified")
    ap.add_argument("--library", default=None,
                    help="path to triples.jsonl (default: beside this script)")
    args = ap.parse_args()

    lib = Path(args.library) if args.library else Path(__file__).with_name("triples.jsonl")
    if not lib.exists():
        print(f"no library at {lib}", file=sys.stderr); return 2
    raw_lines = lib.read_text().splitlines()
    triples = []
    for i, l in enumerate(raw_lines):
        if not l.strip():
            continue
        try:
            triples.append(json.loads(l))
        except json.JSONDecodeError:
            if i == len(raw_lines) - 1:
                # Torn tail: a non-allocator append was mid-write when we
                # read. The partial line is not an entry; the completed
                # append reads whole next time. (allocate.py appends in a
                # single write under flock, so this only guards legacy
                # manual appends.) A bad line anywhere else still raises.
                print("warning: ignored torn final line (concurrent append mid-write)",
                      file=sys.stderr)
                break
            raise

    terms = {t.lower() for t in (args.situation + args.terms)}
    query_class = pos_class(*args.position) if args.position else None
    goal_class = pos_class(*args.goal) if args.goal else None

    hits = []
    for t in triples:
        status = t["outcome"]["status"]
        if status == "unverified" and not args.include_unverified:
            continue
        reasons = []
        sit = t["situation"]
        if args.kind and sit.get("kind") == args.kind:
            reasons.append(f"kind == {args.kind!r}")
        sig = {s.lower() for s in sit.get("signature_terms", [])}
        shared = terms & sig
        if shared:
            reasons.append(f"signature_terms match: {sorted(shared)}")
        if args.position:
            blob = json.dumps(t).lower()
            if sit.get("kind") in ("relocate-wedge", "collect-silently-cancelled",
                                   "survival-under-mob-pressure"):
                if in_protection(*args.position) and "protection" in blob:
                    reasons.append(f"position {tuple(args.position)} is {query_class} "
                                   "and the triple turns on the protection square")
                if args.goal and not in_protection(*args.goal) and "protection" in blob:
                    reasons.append(f"goal {tuple(args.goal)} is {goal_class} "
                                   "and the triple turns on the protection square")
        if reasons:
            hits.append((t, reasons))

    if args.position:
        print(f"position class: body {query_class}" + (f"; goal {goal_class}" if goal_class else ""))
    if terms:
        print(f"situation terms: {sorted(terms)}")
    if not hits:
        print("no matching triples."); return 0
    for t, reasons in hits:
        mark = "" if t["outcome"]["status"] != "unverified" else "  [UNVERIFIED — not a pass]"
        print(f"\n=== {t['id']}  (outcome: {t['outcome']['status']}){mark}")
        for r in reasons:
            print(f"  match rule: {r}")
        print(f"  plan: {t['plan']['artefact']}")
        print(f"  verdict: {t['outcome']['verdict']}")
        print(f"  deaths_cost: {t['outcome']['deaths_cost']}")
        print(f"  evidence: {', '.join(t['provenance']['evidence'])}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
