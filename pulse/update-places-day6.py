import json
P = '/home/caseydigennaro/craftmind-league/pulse/direct-drive-places.json'
places = json.load(open(P))
for pl in places:
    if pl['name'] == 'your stone pit':
        pl['note'] = ("YOUR worked pit at home - a VOLUNTARY WORKPLACE WITH A KNOWN DOOR. You dug it on day 4 hunting furnace stone; its floor is where the stone is. Bounds: columns (65..66, -92..-94), floor at y63, a few blocks deep below the pad. THE DOOR IS A LONG LEG: entry and exit alike are a single long goto between the pit floor and the HOME BENCH POINT (60, 63, -92), well WEST past the pit wall - from the bench, goto the pit floor to enter; from the pit, goto (60, 63, -92) to leave, and the long leg carries you over the wall. Day 5 proved the negatives for a full day: the dirt column on the west side is NOT a climbable stair, the rim and the pit mouth are NOT exits, and EVERY short-range step inside the pit reads zero - short-range verbs inside below-grade cells are presumed zero. Never aim a flee or an exit at the rim or the pit mouth. The crew walked you out this way on day 6's waking; the door is yours now: down the long leg to dig stone, back up the long leg to get out.")
        pl['seeded'] = 'day6: pit as voluntary workplace with a known door (spike LOCOMOTION-SPIKE-20261109: hopFlee/gotoNear to bench (60,63,-92) exits 3/3; day-5 falsified the stair)'
        print('pit entry updated')
tmp = P + '.day6tmp'
json.dump(places, open(tmp, 'w'), indent=1)
print('staged:', tmp, 'entries:', len(places))
