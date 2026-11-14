#!/usr/bin/env python3
import sys
sys.path.insert(0, '/home/caseydigennaro/syndicate-gen/lib')
import mcprobe
D = '/home/caseydigennaro/craftmind-league/director/census-s2-20261109'
REG = D + '/region-r.0.-1.mca'

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
    return names, bs.get('data')

def block_at(chunks, x, y, z):
    ch = chunks.get((x // 16, z // 16))
    if ch is None: return 'NOCHUNK'
    for sec in ch.get('sections') or []:
        if int(sec.get('Y', 999)) != y // 16: continue
        names, data = palette_and_data(sec)
        if not names: return 'minecraft:air'
        if len(names) == 1: return names[0]
        bits = max(4, (len(names) - 1).bit_length())
        vpl = 64 // bits
        li = ((y % 16) * 256 + (z % 16) * 16 + (x % 16))
        lv = int(data[li // vpl]) & ((1 << 64) - 1)
        return names[(lv >> ((li % vpl) * bits)) & ((1 << bits) - 1)]
    return 'minecraft:air'

chunks = {}
for cx in range(3, 6):
    for cz in range(-7, -4):
        ch, ts, err = mcprobe.get_chunk(REG, cx, cz)
        chunks[(cx, cz)] = ch

def col(x, z, y0=60, y1=72):
    out = []
    for y in range(y0, y1 + 1):
        b = block_at(chunks, x, y, z)
        if b != 'minecraft:air': out.append('%d:%s' % (y, b.replace('minecraft:', '')))
    return ' '.join(out) if out else '(air 60..72)'

print('=== Shoulder step columns, z=-89 (his named route), walking west x=67..62 ===')
for x in range(67, 61, -1):
    print('  (%d,-89): %s' % (x, col(x, -89)))
print('=== z=-88 same span ===')
for x in range(67, 61, -1):
    print('  (%d,-88): %s' % (x, col(x, -88)))
print('=== z=-90 same span (southern edge of the band) ===')
for x in range(67, 61, -1):
    print('  (%d,-90): %s' % (x, col(x, -90)))
print()
print('=== TREAD CELL CHECK: (65,67,-89) and neighbours ===')
for (x, y, z) in [(65,67,-89),(65,66,-89),(65,68,-89),(64,67,-89),(64,68,-89),(64,69,-89),(66,67,-89)]:
    print('  (%d,%d,%d) = %s' % (x, y, z, block_at(chunks, x, y, z)))
print()
print('=== Pen-gate approach strip: tops x[57..70] z[-99..-94] (skip leaves AND leaf_litter for ground; litter noted) ===')
def top2(x, z):
    litter = None
    for y in range(90, 40, -1):
        b = block_at(chunks, x, y, z)
        base = b.split('[')[0]
        if base in ('minecraft:oak_leaves','minecraft:birch_leaves'): continue
        if base == 'minecraft:leaf_litter':
            if litter is None: litter = y
            continue
        if b != 'minecraft:air':
            return y, b, litter
    return None, 'air', litter
for z in range(-99, -93):
    row = []
    for x in range(57, 71):
        y, b, lit = top2(x, z)
        row.append('%d%s' % (y if y else 0, '+L' if lit else ''))
    print(' z=%d: %s' % (z, ' '.join(row)))
print('  (x runs 57..70; value = ground top y; +L = leaf_litter above ground)')
print()
print('=== His own placed step at the hollow — read-only record ===')
for (x, z) in [(71,-88),(70,-88),(72,-88)]:
    print('  col (%d,%d): %s' % (x, z, col(x, z, 58, 70)))
print()
print('=== Wheat/table/pit reference tops (read-only check, unchanged ground) ===')
for (x, z) in [(64,-94),(67,-96),(67,-95),(65,-95),(60,-93),(62,-93)]:
    y, b, lit = top2(x, z)
    print('  (%d,%d): ground top y=%s %s' % (x, z, y, b))
