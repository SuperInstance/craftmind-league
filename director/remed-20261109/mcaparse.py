#!/usr/bin/env python3
"""Minimal stdlib MCA + NBT reader for Minecraft entity region files."""
import struct, zlib, gzip, io, sys, json

class Reader:
    def __init__(self, data):
        self.d = data; self.i = 0
    def read(self, n):
        b = self.d[self.i:self.i+n]; self.i += n; return b
    def u8(self): v = self.d[self.i]; self.i += 1; return v
    def i8(self): return struct.unpack('>b', self.read(1))[0]
    def i16(self): return struct.unpack('>h', self.read(2))[0]
    def u16(self): return struct.unpack('>H', self.read(2))[0]
    def i32(self): return struct.unpack('>i', self.read(4))[0]
    def i64(self): return struct.unpack('>q', self.read(8))[0]
    def f32(self): return struct.unpack('>f', self.read(4))[0]
    def f64(self): return struct.unpack('>d', self.read(8))[0]
    def str(self):
        n = self.u16(); return self.read(n).decode('utf-8', 'replace')

def payload(r, t):
    if t == 1: return r.i8()
    if t == 2: return r.i16()
    if t == 3: return r.i32()
    if t == 4: return r.i64()
    if t == 5: return r.f32()
    if t == 6: return r.f64()
    if t == 7:
        n = r.i32(); return list(r.read(n))
    if t == 8: return r.str()
    if t == 9:
        et = r.u8(); n = r.i32()
        return [payload(r, et) for _ in range(n)]
    if t == 10:
        out = {}
        while True:
            tt = r.u8()
            if tt == 0: break
            name = r.str()
            out[name] = payload(r, tt)
        return out
    if t == 11:
        n = r.i32(); return [r.i32() for _ in range(n)]
    if t == 12:
        n = r.i32(); return [r.i64() for _ in range(n)]
    raise ValueError('bad tag %d' % t)

def parse_nbt(data):
    r = Reader(data)
    t = r.u8()
    if t != 10: raise ValueError('root tag %d' % t)
    r.str()
    return payload(r, 10)

def read_mca_entities(path):
    """Yield every entity compound in an entity-region .mca file."""
    with open(path, 'rb') as f:
        data = f.read()
    ents = []
    for idx in range(1024):
        off = int.from_bytes(data[idx*4:idx*4+3], 'big')
        if off == 0: continue
        start = off * 4096
        length = int.from_bytes(data[start:start+4], 'big')
        comp = data[start+4]
        raw = data[start+5:start+4+length]
        if comp == 1: raw = gzip.decompress(raw)
        elif comp == 2: raw = zlib.decompress(raw)
        elif comp == 3: pass
        else: raise ValueError('compression %d in %s' % (comp, path))
        root = parse_nbt(raw)
        for e in root.get('Entities', []):
            ents.append(e)
    return ents

if __name__ == '__main__':
    # inspection mode: dump full key structure of first zombie + skeleton found
    import glob
    seen = {}
    for p in sorted(glob.glob(sys.argv[1] + '/*.mca')):
        for e in read_mca_entities(p):
            eid = e.get('id', '?').replace('minecraft:', '')
            if eid in ('zombie', 'skeleton', 'creeper') and eid not in seen:
                seen[eid] = e
    for k, e in seen.items():
        print('=====', k)
        print(json.dumps(e, default=str)[:2200])
        print()
