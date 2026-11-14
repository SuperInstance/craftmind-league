#!/usr/bin/env python3
import sys
sys.path.insert(0, "/home/caseydigennaro/syndicate-gen/lib")
import mcprobe
REG = "/home/caseydigennaro/craftmind-league/director/census-d16-20261109/region-r.0.-1.mca"
def palette_and_data(sec):
    bs = sec.get("block_states") or {}
    names=[]
    for p in bs.get("palette") or []:
        nm=str(p.get("Name")); props=p.get("Properties")
        if props: nm+="["+",".join("%s=%s"%(k,props[k]) for k in sorted(props))+"]"
        names.append(nm)
    return names, bs.get("data")
def block_at(chunks,x,y,z):
    ch=chunks.get((x//16,z//16))
    if ch is None: return "NOCHUNK"
    for sec in ch.get("sections") or []:
        if int(sec.get("Y",999))!=y//16: continue
        names,data=palette_and_data(sec)
        if not names: return "minecraft:air"
        if len(names)==1: return names[0]
        bits=max(4,(len(names)-1).bit_length()); vpl=64//bits
        li=((y%16)*256+(z%16)*16+(x%16)); lv=int(data[li//vpl])&((1<<64)-1)
        return names[(lv>>((li%vpl)*bits))&((1<<bits)-1)]
    return "minecraft:air"
chunks={}
for cx in range(3,5):
    for cz in range(-7,-5):
        ch,ts,err=mcprobe.get_chunk(REG,cx,cz); chunks[(cx,cz)]=ch
def short(b): return b.replace("minecraft:","")
print("=== BOWL COLUMNS (y58..70) ===")
for (x,z) in [(61,-91),(62,-91),(61,-90),(60,-91),(61,-92),(62,-90),(62,-92),(60,-90),(63,-91),(61,-89),(62,-89),(60,-92),(63,-90),(63,-92),(59,-91),(61,-93),(64,-91),(62,-93)]:
    cells=[]
    for y in range(58,70):
        b=short(block_at(chunks,x,y,z))
        if b!="air": cells.append("%d:%s"%(y,b))
    print("  (%d,%d): %s" % (x,z," ".join(cells)))
print("=== TOPS grid x58..66, z-94..-87 (top solid incl leaves marked L) ===")
for z in range(-94,-86):
    row=[]
    for x in range(58,67):
        topy=None; topb=None
        for y in range(90,50,-1):
            b=block_at(chunks,x,y,z)
            if b!="minecraft:air": topy=y; topb=short(b); break
        row.append("%d:%s%s"%(x,topy,"L" if topb and "leaves" in topb else ""))
    print("  z=%d  %s" % (z," ".join(row)))
print("=== KEY CELLS ===")
for (x,y,z) in [(64,67,-94),(65,66,-88),(62,70,-87),(62,71,-87),(62,72,-87),(68,64,-91),(68,64,-86)]:
    print("  (%d,%d,%d) = %s" % (x,y,z,short(block_at(chunks,x,y,z))))
