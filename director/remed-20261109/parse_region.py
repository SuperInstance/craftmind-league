import sys, os, struct, zlib, gzip
sys.path.insert(0, "/home/caseydigennaro/craftmind-league/pulse/sweep-20261108")
from mcaparse import parse_nbt
WANT = {}
for a in sys.argv[2:]:
    xs, ys, zs = a.split(",")
    WANT[(int(xs), int(ys), int(zs))] = None

def read_chunk(data, cx, cz):
    idx = cx + cz * 32
    off = int.from_bytes(data[idx*4:idx*4+3], 'big')
    if off == 0: return None
    start = off * 4096
    length = int.from_bytes(data[start:start+4], 'big')
    comp = data[start+4]
    raw = data[start+5:start+4+length]
    if comp == 1: raw = gzip.decompress(raw)
    elif comp == 2: raw = zlib.decompress(raw)
    return parse_nbt(raw)

root = read_chunk(open(sys.argv[1], 'rb').read(), 2, 28)  # chunk (2,-4) -> local (2,28)
secs = {}
for s in root.get('sections', []):
    secs[s.get('Y')] = s
def block_at(x, y, z):
    sy = y >> 4
    s = secs.get(sy)
    if not s: return 'NO-SECTION'
    bs = s.get('block_states', {})
    pal = [p.get('Name', '?') for p in bs.get('palette', [])]
    if len(pal) == 1: return pal[0]
    data = bs.get('data', [])
    bits = max(4, (len(pal) - 1).bit_length())
    ly, lz, lx = y & 15, z & 15, x & 15
    i = ly * 256 + lz * 16 + lx
    per = 64 // bits
    word = data[i // per]
    shift = (i % per) * bits
    v = (word >> shift) & ((1 << bits) - 1)
    return pal[v] if v < len(pal) else 'PAL-OVERFLOW'
for (x, y, z) in WANT:
    print(f"{x},{y},{z} = {block_at(x & 15, y, z & 15)}  (want cell {x},{y},{z})")
bes = root.get('block_entities', [])
print("block_entities in chunk (2,-4):", len(bes))
for be in bes:
    print("BE:", be.get('id'), "at", be.get('x'), be.get('y'), be.get('z'))
