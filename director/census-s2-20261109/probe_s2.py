#!/usr/bin/env python3
import sys, math, json
sys.path.insert(0, '/home/caseydigennaro/syndicate-gen/lib')
import mcprobe

D = '/home/caseydigennaro/craftmind-league/director/census-s2-20261109'
REG = D + '/region-r.0.-1.mca'
ENT = D + '/entities-r.0.-1.mca'

# ---------- entities ----------
print('=== ENTITIES in box x[54..90] z[-106..-70] (entities file) ===')
items_in_hollow = []
all_items = []
n_ent = 0
for idx, lx, lz, ts, raw, comp, length, err in mcprobe.mca_chunks(ENT):
    if raw is None: continue
    name, root, rtag = mcprobe.parse_nbt(raw)
    ents = root.get('Entities') or []
    for e in ents:
        n_ent += 1
        pos = e.get('Pos') or [0,0,0]
        x, y, z = float(pos[0]), float(pos[1]), float(pos[2])
        eid = str(e.get('id'))
        if eid == 'minecraft:item':
            it = e.get('Item') or {}
            rec = (eid, x, y, z, str(it.get('id')), int(it.get('count', 0)),
                   int(e.get('Age', 0)), int(e.get('PickupDelay', 0)))
            all_items.append(rec)
            if 68 <= x <= 76 and -92 <= z <= -84:
                items_in_hollow.append(rec)
        if 54 <= x <= 90 and -106 <= z <= -70:
            extra = ''
            if eid == 'minecraft:item':
                it = e.get('Item') or {}
                extra = ' item=%s x%d age=%s' % (it.get('id'), int(it.get('count',0)), e.get('Age'))
            print('  %-28s (%7.2f, %5.1f, %7.2f) hp=%s%s' % (eid, x, y, z, e.get('Health'), extra))
print('total entities in file:', n_ent)
print('--- ITEM entities anywhere near hollow box x[68..76] z[-92..-84]:', len(items_in_hollow))
for r in items_in_hollow: print('   ', r)
print('--- ALL item entities in file:', len(all_items))
for r in all_items: print('   ', r)

# ---------- blocks ----------
def palette_and_data(sec):
    bs = sec.get('block_states') or {}
    pal = bs.get('palette') or []
    names = []
    for p in pal:
        nm = str(p.get('Name'))
        props = p.get('Properties')
        if props:
            nm += '[' + ','.join('%s=%s' % (k, props[k]) for k in sorted(props)) + ']'
        names.append(nm)
    data = bs.get('data')
    return names, data

def block_at(chunks, x, y, z):
    cx, cz = x // 16, z // 16
    ch = chunks.get((cx, cz))
    if ch is None: return 'NOCHUNK'
    sy = y // 16
    for sec in ch.get('sections') or []:
        if int(sec.get('Y', 999)) != sy: continue
        names, data = palette_and_data(sec)
        if not names: return 'minecraft:air'
        if len(names) == 1: return names[0]
        bits = max(4, (len(names) - 1).bit_length())
        vpl = 64 // bits
        li = ((y % 16) * 256 + (z % 16) * 16 + (x % 16))
        lv = int(data[li // vpl]) & ((1 << 64) - 1)
        idx = (lv >> ((li % vpl) * bits)) & ((1 << bits) - 1)
        return names[idx]
    return 'minecraft:air'

chunks = {}
for cx in range(3, 6):
    for cz in range(-7, -4):
        ch, ts, err = mcprobe.get_chunk(REG, cx, cz)
        chunks[(cx, cz)] = ch
        if ch is not None:
            print('chunk (%d,%d): InhabitedTime=%s Status=%s hdr_ts=%s' % (cx, cz, ch.get('InhabitedTime'), ch.get('Status'), ts))

def top(x, z):
    for y in range(90, 40, -1):
        b = block_at(chunks, x, y, z)
        if b != 'minecraft:air' and not b.startswith('minecraft:oak_leaves') and not b.startswith('minecraft:birch_leaves'):
            return y, b
    return None, 'air'

print()
print('=== HOLLOW BOX cell dump x[68..76] y[52..70] z[-92..-84] (non-air, non-stone-family listed; stone-family counted) ===')
from collections import Counter
cnt = Counter()
for x in range(68, 77):
    for z in range(-92, -83):
        for y in range(52, 71):
            b = block_at(chunks, x, y, z)
            if b == 'minecraft:air': continue
            cnt[b.split('[')[0]] += 1
            base = b.split('[')[0]
            if base not in ('minecraft:stone','minecraft:dirt','minecraft:grass_block','minecraft:oak_leaves','minecraft:birch_leaves','minecraft:short_grass','minecraft:air'):
                print('   (%d,%d,%d) %s' % (x, y, z, b))
print('  composition:', dict(cnt))

print()
print('=== Column tops: hollow cross-sections ===')
for z in range(-92, -83):
    row = []
    for x in range(66, 79):
        y, b = top(x, z)
        row.append('%d:%s' % (y if y else 0, b.replace('minecraft:','')[:5]))
    print(' z=%d  %s' % (z, ' | '.join(row)))
print('  (x runs 66..78 left to right)')

print()
print('=== HOMEWARD ROUTE column tops: close (70.3,64,-88.6) -> pad (60,66,-93) ===')
print('-- west along z=-88/-89 (south shoulder line) --')
for zz in (-88, -89):
    row = []
    for x in range(70, 59, -1):
        y, b = top(x, zz)
        row.append('%d@%d' % (x, y if y else 0))
    print(' z=%d: %s' % (zz, ' '.join(row)))
print('-- diagonal via (65..62,-90..-92) and pad approach z=-93 --')
for (x, z) in [(68,-90),(66,-90),(64,-91),(62,-92),(61,-93),(60,-93),(62,-93),(64,-93)]:
    y, b = top(x, z)
    print('   (%d,%d): top y=%s %s' % (x, z, y, b))
print('-- pit columns (driver record: 65..66 x z -93..-91 refused; survey: pit 65..66,-92..-94) full column --')
for x in (65, 66):
    for z in (-94, -93, -92, -91):
        col = []
        for y in range(58, 71):
            b = block_at(chunks, x, y, z)
            if b != 'minecraft:air': col.append('%d:%s' % (y, b.replace('minecraft:','')))
        print('   (%d,%d): %s' % (x, z, ' '.join(col)))

print()
print('=== Blocks on the hollow rim / lip candidates (y 60..66, ring around hollow) ===')
for z in range(-92, -83):
    for x in range(68, 77):
        y, b = top(x, z)
        pass
# west lip of the hollow: columns x=68..70 at z=-88 (his close side)
for (x, z) in [(69,-88),(70,-88),(70,-87),(69,-87),(71,-88),(72,-88),(73,-88),(70,-89),(70,-90)]:
    col = []
    for y in range(56, 69):
        b = block_at(chunks, x, y, z)
        if b != 'minecraft:air': col.append('%d:%s' % (y, b.replace('minecraft:','')[:12]))
    print('   col (%d,%d): %s' % (x, z, ' '.join(col)))
