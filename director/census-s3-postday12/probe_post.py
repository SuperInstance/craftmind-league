#!/usr/bin/env python3
import sys
sys.path.insert(0, '/home/caseydigennaro/syndicate-gen/lib')
import mcprobe
D = '/home/caseydigennaro/craftmind-league/director/census-s3-postday12'
REG = D + '/region-r.0.-1.mca'; ENT = D + '/entities-r.0.-1.mca'

print('=== ITEM entities in file (all) ===')
n=0
for idx, lx, lz, ts, raw, comp, length, err in mcprobe.mca_chunks(ENT):
    if raw is None: continue
    name, root, rtag = mcprobe.parse_nbt(raw)
    for e in root.get('Entities') or []:
        if str(e.get('id'))=='minecraft:item':
            p=e.get('Pos'); it=e.get('Item') or {}
            print('  item %s x%d at (%.1f, %.1f, %.1f) age=%s' % (it.get('id'), int(it.get('count',0)), float(p[0]), float(p[1]), float(p[2]), e.get('Age'))); n+=1
print('total item entities:', n)

def palette_and_data(sec):
    bs = sec.get('block_states') or {}
    names=[]
    for p in bs.get('palette') or []:
        nm=str(p.get('Name')); props=p.get('Properties')
        if props: nm+='['+','.join('%s=%s'%(k,props[k]) for k in sorted(props))+']'
        names.append(nm)
    return names, bs.get('data')

def block_at(chunks,x,y,z):
    ch=chunks.get((x//16,z//16))
    if ch is None: return 'NOCHUNK'
    for sec in ch.get('sections') or []:
        if int(sec.get('Y',999))!=y//16: continue
        names,data=palette_and_data(sec)
        if not names: return 'minecraft:air'
        if len(names)==1: return names[0]
        bits=max(4,(len(names)-1).bit_length()); vpl=64//bits
        li=((y%16)*256+(z%16)*16+(x%16)); lv=int(data[li//vpl])&((1<<64)-1)
        return names[(lv>>((li%vpl)*bits))&((1<<bits)-1)]
    return 'minecraft:air'

chunks={}
for cx in range(3,6):
    for cz in range(-7,-4):
        ch,ts,err=mcprobe.get_chunk(REG,cx,cz); chunks[(cx,cz)]=ch

def top(chunks,x,z):
    for y in range(90,50,-1):
        b=block_at(chunks,x,y,z)
        if b!='minecraft:air' and 'leaves' not in b: return y,b
    return None,None

print('=== KEY CELLS ===')
for (x,y,z) in [(65,66,-88),(65,65,-88),(65,67,-88),(64,66,-88),(64,67,-88),(66,66,-88),(63,64,-90),(63,65,-90),(71,64,-88),(71,65,-88),(64,67,-94)]:
    print('  (%d,%d,%d) = %s' % (x,y,z,block_at(chunks,x,y,z)))
print('=== SHOULDER TOPS x60..72 ===')
for z in (-90,-89,-88,-87):
    row=[]
    for x in range(60,73):
        y,b=top(chunks,x,z); row.append('%d:%s'%(x,y))
    print('  z=%d  %s' % (z,' '.join(row)))
print('=== HOLLOW floor tops x69..73 z-90..-85 ===')
for z in range(-90,-84):
    row=[]
    for x in range(69,74):
        y,b=top(chunks,x,z); row.append('%d:%s/%s'%(x,y,b.split(':')[-1].split('[')[0]))
    print('  z=%d  %s' % (z,' '.join(row)))

print('=== GATE A CELLS (scenario-003 spec) ===')
for (x,y,z,exp) in [(65,66,-88,'air ELEMENT'),(65,65,-88,'grass beneath'),(65,67,-88,'air inv-above'),(65,66,-89,'grass inv'),(64,66,-88,'dirt inv'),(64,67,-88,'grass inv'),(66,66,-88,'air inv'),(64,68,-88,'leaf inv')]:
    print('  (%d,%d,%d) expect %-16s read %s' % (x,y,z,exp,block_at(chunks,x,y,z)))
print('=== HIS-GROUND SPOT READS ===')
for (x,y,z,label) in [(64,67,-94,'crafting table'),(67,66,-95,'farmland'),(67,66,-96,'farmland'),(67,66,-97,'farmland'),(65,66,-95,'trench water'),(60,66,-93,'pad top'),(61,66,-93,'pad top'),(62,66,-93,'pad top'),(64,67,-101,'pen gate'),(65,67,-100,'pen gate'),(71,64,-88,'hollow step dirt'),(71,65,-88,'hollow step planks'),(63,64,-90,'sleep dip stone'),(63,65,-90,'sleep dip dirt')]:
    print('  (%d,%d,%d) %-18s %s' % (x,y,z,label,block_at(chunks,x,y,z)))
