#!/usr/bin/env python3
import sys, hashlib, json
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe
REG = "/home/caseydigennaro/craftmind-league/director/census-d17-20261109/region-r.0.-1.mca"
ENT = "/home/caseydigennaro/craftmind-league/director/census-d17-20261109/entities-r.0.-1.mca"
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
print("=== BOWL COLUMNS (y58..70, non-air) ===")
for (x, z) in [(61,-91),(62,-91),(61,-90),(60,-91),(61,-92),(62,-90),(62,-92),(60,-90),(63,-91),(61,-89),(62,-89),(60,-92),(63,-90),(63,-92),(59,-91),(61,-93),(64,-91),(62,-93)]:
    cells = []
    for y in range(58, 71):
        b = short(block_at(chunks, x, y, z))
        if b != "air": cells.append("%d:%s" % (y, b))
    print("  (%d,%d): %s" % (x, z, " ".join(cells)))
print("=== HOLLOW (count ground) tops x67..74 ===")
for z in range(-89, -83):
    row = []
    for x in range(67, 75):
        topy = None
        for y in range(80, 50, -1):
            b = block_at(chunks, x, y, z)
            if b != "minecraft:air" and "leaves" not in b: topy = y; break
        row.append("%d:%s" % (x, topy))
    print("  z=%d  %s" % (z, " ".join(row)))
print("=== FURNACE SCAN home chunks ===")
n = 0
for (cx, cz), ch in chunks.items():
    if ch is None: continue
    for sec in ch.get("sections") or []:
        names, _ = palette_and_data(sec)
        for nm in names:
            if "furnace" in nm: n += 1; print("  palette hit:", nm, "chunk", (cx, cz), "Y", sec.get("Y"))
print("  furnace palette entries:", n)
print("=== KEY CELLS ===")
for (x, y, z) in [(64,67,-94),(65,66,-88),(62,70,-87),(62,71,-87),(62,72,-87)]:
    print("  (%d,%d,%d) = %s" % (x, y, z, short(block_at(chunks, x, y, z))))
print("=== ENTITIES near bowl (r<25 of (62,-91)) ===")
for idx, lx, lz, ts, raw, comp, length, err in mcprobe.mca_chunks(ENT):
    if raw is None: continue
    name, root, rtag = mcprobe.parse_nbt(raw)
    for e in root.get("Entities") or []:
        p = e.get("Pos")
        if not p: continue
        import math
        d = math.dist([float(p[0]), float(p[2])], [62.0, -91.0])
        if d < 25:
            print("  %s at (%.1f, %.1f, %.1f) d=%.1f" % (e.get("id"), float(p[0]), float(p[1]), float(p[2]), d))
