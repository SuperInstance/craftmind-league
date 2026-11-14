import sys
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe

D = "/home/caseydigennaro/craftmind-league/director/census-s2-postday11"
REG = D + "/region-r.0.-1.mca"
ENT = D + "/entities-r.0.-1.mca"

def palette_and_data(sec):
    bs = sec.get("block_states") or {}
    pal = bs.get("palette") or []
    names = []
    for p in pal:
        nm = str(p.get("Name"))
        props = p.get("Properties")
        if props:
            nm += "[" + ",".join("%s=%s" % (k, props[k]) for k in sorted(props)) + "]"
        names.append(nm)
    return names, bs.get("data")

def block_at(chunks, x, y, z):
    cx, cz = x // 16, z // 16
    ch = chunks.get((cx, cz))
    if ch is None: return "NOCHUNK"
    sy = y // 16
    for sec in ch.get("sections") or []:
        if int(sec.get("Y", 999)) != sy: continue
        names, data = palette_and_data(sec)
        if not names: return "minecraft:air"
        if len(names) == 1: return names[0]
        bits = max(4, (len(names) - 1).bit_length())
        vpl = 64 // bits
        li = ((y % 16) * 256 + (z % 16) * 16 + (x % 16))
        lv = int(data[li // vpl]) & ((1 << 64) - 1)
        idx = (lv >> ((li % vpl) * bits)) & ((1 << bits) - 1)
        return names[idx]
    return "minecraft:air"

chunks = {}
for cx in range(2, 7):
    for cz in range(-8, -3):
        ch, ts, err = mcprobe.get_chunk(REG, cx, cz)
        chunks[(cx, cz)] = ch

print("=== TREAD + INVARIANT CELLS (post-day-11) ===")
for (x, y, z, label) in [
    (65, 66, -88, "TREAD"), (65, 65, -88, "inv: below tread (was dirt post-placement)"),
    (65, 67, -88, "inv: above tread air"), (65, 66, -89, "inv"),
    (64, 66, -88, "inv"), (64, 67, -88, "inv"), (64, 68, -88, "inv leaf_litter"),
]:
    print("  (%d,%d,%d) %-42s %s" % (x, y, z, label, block_at(chunks, x, y, z)))

print("=== STEP BOX x[63..66] y[60..70] z[-90..-87] non-air dump ===")
for x in range(63, 67):
    for z in range(-90, -86):
        col = []
        for y in range(60, 71):
            b = block_at(chunks, x, y, z)
            if b != "minecraft:air": col.append("%d:%s" % (y, b.replace("minecraft:", "")))
        print("  (%d,%d): %s" % (x, z, " ".join(col)))

print("=== HIS-GROUND SPOT READS ===")
for (x, y, z, label) in [
    (64, 67, -94, "crafting table"), (67, 66, -95, "farmland"), (67, 66, -96, "farmland"),
    (67, 66, -97, "farmland"), (65, 66, -95, "trench water"),
    (60, 66, -93, "pad top"), (61, 66, -93, "pad top"), (62, 66, -93, "pad top"),
    (64, 67, -101, "pen gate"), (65, 67, -100, "pen gate"),
    (71, 64, -88, "hollow step dirt"), (71, 65, -88, "hollow step planks"),
]:
    print("  (%d,%d,%d) %-18s %s" % (x, y, z, label, block_at(chunks, x, y, z)))

print("=== PAD-TOP Y AT (60..62, -93): actual tops ===")
for x in (60, 61, 62):
    for y in range(70, 60, -1):
        b = block_at(chunks, x, y, -93)
        if b != "minecraft:air":
            print("  (%d,-93) top y=%d %s" % (x, y, b)); break

print("=== FURNACE SEARCH x[54..90] y[55..75] z[-106..-70] ===")
found = []
for x in range(54, 91):
    for z in range(-106, -69):
        for y in range(55, 76):
            b = block_at(chunks, x, y, z)
            if "furnace" in b: found.append((x, y, z, b))
print("  furnace blocks:", found if found else "NONE")

print("=== HIS DIG SITE (61..63, 63..67, -92) ===")
for x in range(60, 65):
    for z in (-92,):
        col = []
        for y in range(60, 70):
            b = block_at(chunks, x, y, z)
            if b != "minecraft:air": col.append("%d:%s" % (y, b.replace("minecraft:", "")))
        print("  (%d,%d): %s" % (x, z, " ".join(col)))

print("=== ITEM ENTITIES in step box + hollow + dig site ===")
n = 0
for idx, lx, lz, ts, raw, comp, length, err in mcprobe.mca_chunks(ENT):
    if raw is None: continue
    name, root, rtag = mcprobe.parse_nbt(raw)
    for e in root.get("Entities") or []:
        if str(e.get("id")) != "minecraft:item": continue
        pos = e.get("Pos") or [0, 0, 0]
        x, y, z = float(pos[0]), float(pos[1]), float(pos[2])
        if (60 <= x <= 80 and -95 <= z <= -84) or (58 <= x <= 66 and -93 <= z <= -90):
            it = e.get("Item") or {}
            print("   item %s x%d at (%.1f, %.1f, %.1f) age=%s" % (it.get("id"), int(it.get("count", 0)), x, y, z, e.get("Age")))
            n += 1
print("  item entities in checked boxes:", n)
