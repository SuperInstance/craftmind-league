#!/usr/bin/env python3
"""Spawn-country surface-hostile census from the Orin saved entity store.
Mob-map method: no-body MCA/NBT parse + league column surveys for layering.
Usage: census.py <entity_dir> <pulse_dir> <out_json> <md5json>"""
import sys, os, json, math, glob

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mcaparse import read_mca_entities

ENT_DIR, PULSE, OUT, MD5JSON = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

HOSTILE = {
    'zombie', 'skeleton', 'creeper', 'spider', 'cave_spider', 'enderman',
    'drowned', 'zombie_villager', 'zombified_piglin', 'husk', 'stray',
    'witch', 'phantom', 'slime', 'magma_cube', 'piglin', 'hoglin', 'zoglin',
    'vindicator', 'evoker', 'pillager', 'ravager', 'vex', 'wither_skeleton',
    'silverfish', 'endermite', 'guardian', 'elder_guardian', 'blaze',
    'ghast', 'warden', 'shulker',
}
BURNABLE = {'zombie', 'skeleton', 'drowned', 'zombie_villager', 'stray',
            'phantom', 'zombie_horse', 'skeleton_horse'}

# ---- merge column surveys (top + leaves per cell) ----
SURVEYS = ['cell-survey.json', 'shoulder-survey.json', 'prep-scan-before.json',
           'prep-scan-night-before.json', 'prep-scan-night-after.json',
           'prep-scan-after.json', 'escape-survey.json']
cols = {}   # (x,z) -> {'top':int,'leaves':[y,...]}
survey_meta = {}
for name in SURVEYS:
    p = os.path.join(PULSE, name)
    if not os.path.exists(p):
        survey_meta[name] = 'absent'; continue
    d = json.load(open(p))
    cells = d.get('cells', {})
    n = 0
    if isinstance(cells, dict):
        items = cells.items()
    else:
        items = [(('%d,%d' % (c['x'], c['z'])), c) for c in cells]
    for k, c in items:
        try:
            x, z = (int(v) for v in k.split(','))
        except Exception:
            continue
        if 'top' in c:
            cols[(x, z)] = {'top': c['top'], 'leaves': c.get('leaves', [])}
            n += 1
    survey_meta[name] = 'merged %d cells (ts %s)' % (n, d.get('ts'))

def col_top(x, z):
    c = cols.get((x, z))
    return c['top'] if c else None

def neighbour_relief(x, z):
    t = col_top(x, z)
    if t is None: return None
    mx = None
    for dx in (-1, 0, 1):
        for dz in (-1, 0, 1):
            if dx == 0 and dz == 0: continue
            nt = col_top(x + dx, z + dz)
            if nt is not None and (mx is None or nt > mx): mx = nt
    return (mx - t) if mx is not None else None

def canopy_above(x, z):
    c = cols.get((x, z))
    if not c: return False
    return any(ly > c['top'] + 1 for ly in c.get('leaves', []))

SPAWN = (32, -96)
ANCHORS = {'spawn': (32, -96), 'cody_homestead': (64, -93),
           'vega_anchor': (63, -72), 'geist_anchor': (7, -85),
           'vega_parked': (55, -55), 'geist_stand': (51, -90)}

def in_box(x, z, x0, x1, z0, z1): return x0 <= x <= x1 and z0 <= z <= z1

def zones_for(x, z):
    zs = []
    if in_box(x, z, 16, 48, -112, -80): zs.append('spawn_protection_square')
    if in_box(x, z, 8, 56, -120, -72): zs.append('spawn_plateau_apron_cheb24')
    if in_box(x, z, 30, 68, -104, -82): zs.append('corridor_spawn_homestead')
    if in_box(x, z, 48, 80, -109, -77): zs.append('homestead_apron_cheb16')
    if in_box(x, z, 56, 84, -112, -84): zs.append('dip_and_rim')
    if in_box(x, z, 38, 70, -62, -44): zs.append('vega_ground')
    if in_box(x, z, 47, 79, -88, -56): zs.append('vega_anchor_apron_cheb16')
    if in_box(x, z, 10, 56, -104, -78): zs.append('geist_e_se_rows')
    if in_box(x, z, -9, 23, -101, -69): zs.append('geist_anchor_apron_cheb16')
    return zs

WG = (-20, 92, -128, -40)  # working geography bbox x0,x1,z0,z1

def classify(e):
    eid = e.get('id', '?').replace('minecraft:', '')
    x, y, z = e['Pos']
    cx, cz = math.floor(x), math.floor(z)
    top = col_top(cx, cz)
    rec = {'type': eid, 'x': round(x, 1), 'y': round(y, 1), 'z': round(z, 1),
           'cell': [cx, cz], 'hp': e.get('Health'),
           'burnInDay': e.get('Paper.ShouldBurnInDay'),
           'spawnReason': e.get('Paper.SpawnReason'),
           'persist': e.get('PersistenceRequired')}
    eq = e.get('equipment') or {}
    rec['equipment'] = {slot: it.get('id', '').replace('minecraft:', '')
                        for slot, it in eq.items() if isinstance(it, dict)}
    if eid == 'zombie':
        rec['baby'] = e.get('IsBaby')
    # layer (mob-map method)
    if top is not None:
        dy = y - top
        rec['columnTop'] = top
        if -1.5 <= dy <= 1.2: layer = 'surface'
        elif dy > 1.2: layer = 'airborne-above-surface'
        elif dy >= -3.5: layer = 'pocket'
        elif dy >= -12: layer = 'shallow-underground'
        else: layer = 'deep-underground'
    else:
        layer = 'surface-assumed(outside-survey)' if y >= 62 else 'underground?(outside-survey)'
    rec['layer'] = layer
    # containment class
    if layer == 'surface':
        relief = neighbour_relief(cx, cz)
        rec['neighbourRelief'] = relief
        if relief is not None and relief >= 3:
            containment = 'pit-contained'
        elif canopy_above(cx, cz):
            containment = 'walking-surface-canopy'
        else:
            containment = 'walking-surface'
    elif layer == 'pocket':
        containment = 'pocket-below-grade'
    elif layer == 'airborne-above-surface':
        containment = 'airborne'
    elif layer == 'surface-assumed(outside-survey)':
        containment = 'walking-surface-assumed'
    else:
        containment = 'underground'
    rec['containment'] = containment
    # daylight class
    if eid in BURNABLE:
        if 'head' in rec['equipment']:
            dl = 'daylight-permanent (helmeted: %s)' % rec['equipment']['head']
        elif rec['burnInDay'] == 0:
            dl = 'daylight-permanent (ShouldBurnInDay=0)'
        elif containment == 'walking-surface-canopy':
            dl = 'shelter-dependent (canopy shade) - burns only if it leaves cover'
        elif containment == 'pit-contained':
            dl = 'shelter-dependent (pit) - may burn at pit rim; treat as persistent'
        elif containment == 'pocket-below-grade':
            dl = 'shelter-dependent (pocket shade) - treat as persistent'
        else:
            dl = 'burns at dawn (exposed)'
    elif eid == 'creeper':
        dl = 'daylight-permanent (creepers never burn)'
    elif eid in ('spider', 'cave_spider'):
        dl = 'daylight-permanent (neutral by day unless provoked)'
    elif eid == 'enderman':
        dl = 'daylight-permanent (neutral unless looked at/provoked)'
    elif eid == 'zombified_piglin':
        dl = 'daylight-permanent (neutral unless provoked)'
    else:
        dl = 'daylight-permanent'
    rec['daylightClass'] = dl
    rec['zones'] = zones_for(cx, cz)
    rec['inWorkingGeography'] = in_box(cx, cz, WG[0], WG[1], WG[2], WG[3])
    rec['chebSpawn'] = max(abs(cx - SPAWN[0]), abs(cz - SPAWN[1]))
    nearest = min(ANCHORS.items(),
                  key=lambda kv: max(abs(cx - kv[1][0]), abs(cz - kv[1][1])))
    rec['nearestAnchor'] = {'name': nearest[0],
                            'cheb': max(abs(cx - nearest[1][0]), abs(cz - nearest[1][1]))}
    return rec

def main():
    all_ents = []
    for p in sorted(glob.glob(os.path.join(ENT_DIR, '*.mca'))):
        all_ents.extend(read_mca_entities(p))
    hostiles = [classify(e) for e in all_ents
                if e.get('id', '').replace('minecraft:', '') in HOSTILE]
    wg = [h for h in hostiles if h['inWorkingGeography']]
    wg_surface = [h for h in wg if h['containment'] not in ('underground',)
                  and h['layer'] not in ('deep-underground', 'shallow-underground',
                                         'underground?(outside-survey)')]
    from collections import Counter
    out = {
        'census': 'spawn-country surface-hostile census',
        'method': ('NO-BODY read-only parse of the Orin server saved entity store '
                   '(world/dimensions/minecraft/overworld/entities/*.mca x4, '
                   'md5-verified copies) - no login, no bot, no op command, no '
                   'world edit. Layering per the mob-map method against merged '
                   'league column surveys (%d columns). Saved-position snapshot: '
                   'mobs in chunks unloaded since the autosave keep their last '
                   'saved position.' % len(cols)),
        'source_md5': json.load(open(MD5JSON)),
        'surveys_merged': survey_meta,
        'survey_columns': len(cols),
        'totals': {
            'all_entities': len(all_ents),
            'hostiles_all': len(hostiles),
            'hostiles_by_type': dict(Counter(h['type'] for h in hostiles)),
            'hostiles_by_layer': dict(Counter(h['layer'] for h in hostiles)),
            'working_geography_hostiles_all_layers': len(wg),
            'working_geography_surface_band': len(wg_surface),
            'wg_by_containment': dict(Counter(h['containment'] for h in wg_surface)),
            'wg_by_type': dict(Counter(h['type'] for h in wg_surface)),
            'wg_by_daylight': dict(Counter(h['daylightClass'] for h in wg_surface)),
        },
        'working_geography_bbox': {'x': [WG[0], WG[1]], 'z': [WG[2], WG[3]]},
        'anchors': {k: list(v) for k, v in ANCHORS.items()},
        'working_geography_surface_hostiles': sorted(
            wg_surface, key=lambda h: (h['chebSpawn'], h['type'])),
        'working_geography_below_surface_hostiles': sorted(
            [h for h in wg if h not in wg_surface],
            key=lambda h: (h['chebSpawn'], h['type'])),
    }
    json.dump(out, open(OUT, 'w'), indent=1)
    print(json.dumps(out['totals'], indent=1))
    print('wg surface hostiles:', len(wg_surface))

if __name__ == '__main__':
    main()
