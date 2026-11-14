#!/usr/bin/env python3
"""feed-snapshot.py — the day-11 feed-snapshot producer (charter §5 /
readiness §12 item 6; floor gap #6: the fixture JSON becomes a live
store).

Takes a READ-ONLY copy of the citizen's playerdata .dat from the
Orin's live server directory (scp file copy only — no game login, no
server command, nothing written on the Orin), parses it OFFLINE on
Thor with the fleet's mcprobe NBT reader (the scenario-#2 census
instrument), and writes the floor's feed snapshot:

    floor/run/day11/snapshot.json   {"inventory": {...}, "ts": ...}

Inventory keys are short ids with the "minecraft:" namespace stripped
(cooked_porkchop, wooden_pickaxe, ...) — the naming the day-11 floor
contract's feed declaration and the state mirror both use. Counts are
stack totals across all slots of the Inventory list (EnderItems are
NOT held items and are excluded). The snapshot also carries the
.dat's sha256 and the parsed Pos/Health/foodLevel under "source" so
a reader can audit the snapshot against the save it came from; the
floor reads only {inventory, ts} and ignores the rest.

The feeder (any op bot) has no write path to this file: it is written
only here, by atomic rename, from a store the feeder cannot write.

usage: feed-snapshot.py [--out PATH] [--uuid UUID] [--host SSH]
       [--remote PATH] [--keep-copy]
exit: 0 ok · 2 copy failed · 3 parse failed
"""
import argparse, gzip, hashlib, json, os, subprocess, sys, tempfile
from datetime import datetime, timezone

sys.path.insert(0, os.environ.get("MCPROBE_LIB",
                                  os.path.expanduser("~/syndicate-gen/lib")))
import mcprobe  # noqa: E402

DEFAULT_UUID = "5b8c9ad2-7ed8-3e01-9441-8023f4aa7d67"  # Cody
DEFAULT_HOST = "casey@192.168.0.50"
DEFAULT_REMOTE = "~/minecraft-server/world/players/data/%s.dat"


def main():
    ap = argparse.ArgumentParser()
    here = os.path.dirname(os.path.abspath(__file__))
    ap.add_argument("--out", default=os.path.join(here, "snapshot.json"))
    ap.add_argument("--uuid", default=DEFAULT_UUID)
    ap.add_argument("--host", default=DEFAULT_HOST)
    ap.add_argument("--remote", default=None)
    ap.add_argument("--keep-copy", action="store_true",
                    help="keep the copied .dat beside the snapshot")
    a = ap.parse_args()

    remote = a.remote or (DEFAULT_REMOTE % a.uuid)
    fd, tmp = tempfile.mkstemp(dir=here, prefix=".datcopy-", suffix=".dat")
    os.close(fd)
    try:
        r = subprocess.run(["scp", "-q", "-o", "ConnectTimeout=8",
                            "-o", "BatchMode=yes",
                            "%s:%s" % (a.host, remote), tmp],
                           capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            print(json.dumps({"ok": False, "stage": "copy",
                              "error": (r.stderr or "").strip()[:300]}))
            return 2
        raw = open(tmp, "rb").read()
        sha = hashlib.sha256(raw).hexdigest()
        try:
            data = gzip.decompress(raw) if raw[:2] == b"\x1f\x8b" else raw
            _name, root, _tag = mcprobe.parse_nbt(data)
        except Exception as e:  # parse failure must be loud, never a guess
            print(json.dumps({"ok": False, "stage": "parse",
                              "error": repr(e)[:300]}))
            return 3
        inv = {}
        for e in root.get("Inventory") or []:
            iid = str(e.get("id") or "")
            if iid.startswith("minecraft:"):
                iid = iid[len("minecraft:"):]
            n = e.get("count", e.get("Count", 0))
            inv[iid] = inv.get(iid, 0) + int(n)
        pos = root.get("Pos") or [None, None, None]
        snap = {
            "inventory": inv,
            "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "source": {
                "dat": remote, "dat_sha256": sha, "dat_bytes": len(raw),
                "pos": [float(p) for p in pos],
                "health": float(root.get("Health")),
                "food": int(root.get("foodLevel")),
            },
        }
        out_tmp = a.out + ".tmp"
        with open(out_tmp, "w") as fh:
            json.dump(snap, fh, indent=1, sort_keys=True)
            fh.write("\n")
        os.rename(out_tmp, a.out)
        if a.keep_copy:
            os.rename(tmp, os.path.join(here, "cody-dat-copy.dat"))
            tmp = None
        print(json.dumps({"ok": True, "out": a.out, "sha256": sha,
                          "inventory": inv}))
        return 0
    finally:
        if tmp and os.path.exists(tmp):
            os.unlink(tmp)


if __name__ == "__main__":
    sys.exit(main())
