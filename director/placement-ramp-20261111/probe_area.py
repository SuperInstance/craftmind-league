import sys
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe
BASE = "/home/caseydigennaro/craftmind-league/director/placement-ramp-20261111/post"
REG = BASE + "/region-r.0.-1.mca"
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
for z in range(-94, -87):
    for x in range(60, 69):
        cells = []
        for y in range(58, 75):
            b = short(block_at(chunks, x, y, z))
            if b != "air": cells.append("%d:%s" % (y, b.split("[")[0]))
        if cells: print("(%d,%d): %s" % (x, z, " ".join(cells)))
