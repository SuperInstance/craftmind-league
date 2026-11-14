import sys, os, glob
sys.path.insert(0, "/home/caseydigennaro/craftmind-league/pulse/sweep-20261108")
from mcaparse import parse_nbt
d = sys.argv[1]
for p in sorted(glob.glob(os.path.join(d, "*.dat"))):
    try:
        root = parse_nbt(open(p, "rb").read())
    except Exception as e:
        print(os.path.basename(p), "PARSE-FAIL", e); continue
    pos = root.get("Pos")
    print(os.path.basename(p), "Pos=", [round(v,1) for v in pos] if pos else None,
          "Health=", root.get("Health"), "food=", (root.get("foodLevel") if "foodLevel" in root else (root.get("food_level") if "food_level" in root else "?")),
          "keys=", ",".join(sorted(root.keys())[:18]))
