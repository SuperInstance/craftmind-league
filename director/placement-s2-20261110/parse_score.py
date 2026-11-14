import sys, gzip
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe

raw = open("scoreboard-post.dat","rb").read()
if raw[:2] == b"\x1f\x8b": raw = gzip.decompress(raw)
name, root, rtag = mcprobe.parse_nbt(raw)
data = root.get("data") or root
for s in (data.get("PlayerScores") or []):
    if str(s.get("Name")) == "#chk":
        print("#chk objective=%s score=%s" % (s.get("Objective"), s.get("Score")))
