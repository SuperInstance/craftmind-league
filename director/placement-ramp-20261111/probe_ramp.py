import sys
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe
BASE = "/home/caseydigennaro/craftmind-league/director/placement-ramp-20261111/post"
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
print("=== RAMP COLUMN (64,-91) y56..74 ALL cells ===")
for y in range(56, 75):
    print("  (64,%d,-91): %s" % (y, short(block_at(chunks, 64, y, -91))))
print("=== INVARIANT COLUMNS (61,-91) and (62,-91) y56..74 non-air ===")
for (x, z) in [(61, -91), (62, -91)]:
    cells = []
    for y in range(56, 75):
        b = short(block_at(chunks, x, y, z))
        if b != "air": cells.append("%d:%s" % (y, b))
    print("  (%d,%d): %s" % (x, z, " ".join(cells)))
print("=== SPOT INVARIANTS ===")
spots = [(61,60,-91),(64,67,-94),(65,66,-88),(65,65,-88)]
for (x,y,z) in spots:
    print("  (%d,%d,%d): %s" % (x,y,z, short(block_at(chunks,x,y,z))))
print("=== PAD TOPS (60..63, y67, -90..-93) ===")
for x in range(60, 64):
    row = []
    for z in range(-93, -89):
        row.append("(%d,67,%d)=%s" % (x, z, short(block_at(chunks, x, 67, z))))
    print("  " + " ".join(row))
print("=== ENTITIES in bowl country (x 50..80, z -110..-75) ===")
try:
    ents = mcprobe.get_entities(ENT) if hasattr(mcprobe, "get_entities") else None
    print("  mcprobe.get_entities:", "available" if ents is not None else "unavailable")
except Exception as e:
    print("  entities err:", e)
