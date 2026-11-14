#!/usr/bin/env python3
"""Day-14 post-day block scan of region r.0.-1 (the only region day 14 touched).
Written by the day-14 lane at close-out, against the proven mcaparse NBT lib.
Questions: (1) any furnace block anywhere in the region? (2) the named home
cells: crafting table (64,67,-94), scenario-#3 cobble (65,66,-88), pad
(60,66,-93); (3) any chest? (4) block-entity list per chunk for the home nine.
"""
import sys, zlib, gzip
sys.path.insert(0, "/home/caseydigennaro/craftmind-league/pulse/sweep-20261108")
from mcaparse import parse_nbt

PATH = "/home/caseydigennaro/craftmind-league/director/census-d14-postday/r.0.-1.mca"
data = open(PATH, "rb").read()

def read_chunk(cx, cz):
    idx = (cx % 32) + (cz % 32) * 32
    off = int.from_bytes(data[idx * 4:idx * 4 + 3], "big")
    if off == 0:
        return None
    start = off * 4096
    length = int.from_bytes(data[start:start + 4], "big")
    comp = data[start + 4]
    raw = data[start + 5:start + 4 + length]
    if comp == 1:
        raw = gzip.decompress(raw)
    elif comp == 2:
        raw = zlib.decompress(raw)
    return parse_nbt(raw)

def block_at(root, x, y, z):
    secs = {s.get("Y"): s for s in root.get("sections", [])}
    s = secs.get(y >> 4)
    if not s:
        return "NO-SECTION"
    bs = s.get("block_states", {})
    pal = [p.get("Name", "?") for p in bs.get("palette", [])]
    if len(pal) == 1:
        return pal[0]
    packed = bs.get("data", [])
    bits = max(4, (len(pal) - 1).bit_length())
    per = 64 // bits
    lx, ly, lz = x % 16, y % 16, z % 16
    i = (ly * 16 + lz) * 16 + lx
    word = packed[i // per]
    shift = (i % per) * bits
    idx = (word >> shift) & ((1 << bits) - 1)
    return pal[idx] if idx < len(pal) else f"BADIDX{idx}"

furnaces, chests, tables = [], [], []
chunks_read = 0
home_chunks = {(2, -4), (3, -4), (4, -4), (2, -5), (3, -5), (4, -5), (2, -6), (3, -6), (4, -6)}
for cx in range(0, 8):
    for cz in range(-8, 0):
        root = read_chunk(cx, cz)
        if root is None:
            continue
        chunks_read += 1
        for s in root.get("sections", []):
            pal = [p.get("Name", "") for p in s.get("block_states", {}).get("palette", [])]
            for name in pal:
                if "furnace" in name:
                    furnaces.append((cx, cz, s.get("Y"), name))
                if name == "minecraft:chest":
                    chests.append((cx, cz, s.get("Y"), name))
                if name == "minecraft:crafting_table":
                    tables.append((cx, cz, s.get("Y"), name))

print(f"chunks read (x 0..7, z -8..-1 of r.0.-1): {chunks_read}")
print(f"FURNACE palette hits: {furnaces}")
print(f"CHEST palette hits: {chests}")
print(f"CRAFTING_TABLE palette hits: {tables}")

for (cx, cz) in sorted(home_chunks):
    root = read_chunk(cx, cz)
    if root is None:
        print(f"chunk ({cx},{cz}): ABSENT")
        continue
    bes = [(b.get("id"), b.get("x"), b.get("y"), b.get("z")) for b in root.get("block_entities", [])]
    print(f"chunk ({cx},{cz}): block_entities={bes}")

for (x, y, z, label) in [
    (64, 67, -94, "crafting table cell"),
    (65, 66, -88, "scenario-#3 cobble cell"),
    (60, 66, -93, "home pad cell"),
    (63, 67, -94, "his placed step"),
]:
    root = read_chunk(x >> 4, z >> 4)
    print(f"cell ({x},{y},{z}) {label}: {block_at(root, x, y, z) if root else 'NO CHUNK'}")
