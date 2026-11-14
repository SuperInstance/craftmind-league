#!/usr/bin/env python3
# Scenario #2 placement window: cell reads from a region copy (offline parse).
# Usage: probe_cells.py <region.mca> — reads the tread cell, invariant cells,
# and his-ground spot reads per SCENARIO-002.md manifest. Read-only.
import sys
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe

REG = sys.argv[1]

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
for cx in range(3, 6):
    for cz in range(-7, -4):
        ch, ts, err = mcprobe.get_chunk(REG, cx, cz)
        chunks[(cx, cz)] = ch

def read(label, x, y, z, expect=None):
    b = block_at(chunks, x, y, z)
    mark = ""
    if expect is not None:
        mark = "  EXPECT %s -> %s" % (expect, "OK" if b.split(chr(91))[0] == expect else "**MISMATCH**")
    print("%-28s (%d,%d,%d) %s%s" % (label, x, y, z, b, mark))
    return b

print("== TREAD CELL ==")
read("tread", 65, 66, -88, "minecraft:air")
print("== INVARIANT CELLS (SCENARIO-002) ==")
read("inv below-tread", 65, 65, -88, "minecraft:grass_block")
read("inv above-tread", 65, 67, -88, "minecraft:air")
read("inv south-shoulder", 65, 66, -89, "minecraft:grass_block")
read("inv face-low", 64, 66, -88, "minecraft:dirt")
read("inv face-top", 64, 67, -88, "minecraft:grass_block")
read("inv face-litter", 64, 68, -88, "minecraft:leaf_litter")
print("== HIS GROUND — SPOT READS ==")
read("crafting table", 64, 67, -94, "minecraft:crafting_table")
read("farmland 1", 67, 66, -95, "minecraft:farmland")
read("farmland 2", 67, 66, -96, "minecraft:farmland")
read("farmland 3", 67, 66, -97, "minecraft:farmland")
read("trench", 65, 66, -95, "minecraft:water")
for x in (60, 61, 62):
    read("pad top x=%d" % x, x, 66, -93, "minecraft:grass_block")
read("pen gate 1", 64, 67, -101, "minecraft:oak_fence_gate")
read("pen gate 2", 65, 67, -100, "minecraft:oak_fence_gate")
read("hollow step dirt", 71, 64, -88, "minecraft:dirt")
read("hollow step planks", 71, 65, -88, "minecraft:oak_planks")
