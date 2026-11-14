#!/usr/bin/env python3
import sys, math
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe
BASE = "/home/caseydigennaro/craftmind-league/director/census-s4-20261109"
REG = BASE + "/region-r.0.-1.mca"
ENT = BASE + "/entities-r.0.-1.mca"
def palette_and_data(sec):
    bs = sec.get("block_states") or {}
    names = []
    for p in bs.get("palette") or []:
        nm = str(p.get("Name")); props = p.get("Properties")
        if props: nm += "[" + ",".join("%s=%s" % (k, props[k]) for k in sorted(props)) + "]"
        names.append(nm)
    return names, bs.get("data")
def block_at(chunks, x, y, z):
    ch = chunks.get((x // 16, z // 16))
    if ch is None: return "NOCHUNK"
    for sec in ch.get("sections") or []:
        if int(sec.get("Y", 999)) != y // 16: continue
        names, data = palette_and_data(sec)
        if not names: return "minecraft:air"
        if len(names) == 1: return names[0]
        bits = max(4, (len(names) - 1).bit_length()); vpl = 64 // bits
        li = ((y % 16) * 256 + (z % 16) * 16 + (x % 16)); lv = int(data[li // vpl]) & ((1 << 64) - 1)
        return names[(lv >> ((li % vpl) * bits)) & ((1 << bits) - 1)]
    return "minecraft:air"
chunks = {}
for cx in range(3, 6):
    for cz in range(-7, -4):
        ch, ts, err = mcprobe.get_chunk(REG, cx, cz); chunks[(cx, cz)] = ch
def short(b): return b.replace("minecraft:", "")
print("=== BOWL + RAMP + MOUTH COLUMNS (y56..74, non-air) ===")
cols = [(x, z) for z in range(-94, -86) for x in range(58, 69)]
for (x, z) in cols:
    cells = []
    for y in range(56, 75):
        b = short(block_at(chunks, x, y, z))
        if b != "air": cells.append("%d:%s" % (y, b))
    if cells: print("  (%d,%d): %s" % (x, z, " ".join(cells)))
print("=== TOPS grid x56..76, z-100..-84 (top solid; L=leaves) ===")
for z in range(-100, -83):
    row = []
    for x in range(56, 77):
        topy = None; topb = None
        for y in range(90, 50, -1):
            b = block_at(chunks, x, y, z)
            if b != "minecraft:air": topy = y; topb = short(b); break
        row.append("%d:%s%s" % (x, topy, "L" if topb and "leaves" in topb else ""))
    print("  z=%d  %s" % (z, " ".join(row)))
print("=== KEY CELLS ===")
for (x, y, z) in [(65,66,-88),(65,65,-88),(64,67,-94),(64,67,-101),(65,67,-100),(67,66,-95),(67,66,-96),(67,66,-97),(65,66,-95),(60,66,-93),(61,66,-93),(62,66,-93),(63,63,-91),(63,64,-91),(66,62,-90),(66,61,-90),(66,60,-90),(61,61,-92),(61,62,-92)]:
    print("  (%d,%d,%d) = %s" % (x, y, z, short(block_at(chunks, x, y, z))))
print("=== PALETTE SCAN: stone_bricks / furnace / sign / chest / lantern / torch in home chunks ===")
hits = {}
for (cx, cz), ch in chunks.items():
    if ch is None: continue
    for sec in ch.get("sections") or []:
        names, _ = palette_and_data(sec)
        for nm in names:
            for k in ("stone_bricks", "furnace", "sign", "chest", "lantern", "torch"):
                if k in nm: hits[nm] = hits.get(nm, 0) + 1
print(" ", hits if hits else "NONE")
print("=== ENTITIES in r.0.-1: pigs anywhere; anything within r<30 of (62,-91) ===")
for idx, lx, lz, ts, raw, comp, length, err in mcprobe.mca_chunks(ENT):
    if raw is None: continue
    name, root, rtag = mcprobe.parse_nbt(raw)
    for e in root.get("Entities") or []:
        p = e.get("Pos")
        if not p: continue
        ex, ey, ez = float(p[0]), float(p[1]), float(p[2])
        d = math.dist([ex, ez], [62.0, -91.0])
        eid = str(e.get("id"))
        if "pig" in eid or d < 30:
            print("  %s at (%.1f, %.1f, %.1f) d=%.1f health=%s NoAI=%s" % (eid, ex, ey, ez, d, e.get("Health"), e.get("NoAI")))
