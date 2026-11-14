#!/usr/bin/env python3
import json
p = "/home/caseydigennaro/craftmind-league/pulse/spawn-country-census-20261108.json"
d = json.load(open(p))
d["generated"] = "2026-11-08T09:24Z (entity store as last written 09:21-09:23Z)"
d["headline"] = [
    "Working-geography saved surface band is FIVE hostiles: 4 day-neutral spiders + 1 unhelmeted bow skeleton (20.5, 67, -81.2). No zombies, no creepers, no helmeted anything, nothing pit-contained.",
    "Every named daylight-permanent threat from the 07:20Z mob map is absent from the saved store except the canopy spider, which persists verbatim at (41.7, 71.1, -87.8).",
    "Tonight's killer geography is currently empty in the saved store: pond cell, spawn plateau, Geist saved cell, homestead pad, Cody stance and Vega parked position all have a day-neutral spider as nearest surface hostile (cheb 4-29).",
    "The one live ranged threat in the working geography is new since the mob map: bow skeleton at (20.5, 67, -81.2), unhelmeted, ShouldBurnInDay 1, outside survey span (cover unknown).",
    "Sweep decision (ledger spawn-country-sweep-design-20261108): HONEST DEFERRAL - sunlight under the guarded hold plus despawn churn already did the sweep; containment has no targets; a combat body would be spent against day-neutral spiders. Converted to a standing warning + kill/verify list in OPERATIONS.md and a census gate before any fresh-body experiment.",
]
d["mob_map_named_threat_recheck"] = [
    {"threat": "golden-helmet skeleton", "mob_map_pos": [0.5, 67, -93.5], "status_0924Z": "ABSENT - no hostile within cheb 3 at any layer"},
    {"threat": "creeper, Geist west line", "mob_map_pos": [20.5, 69, -93.8], "status_0924Z": "ABSENT"},
    {"threat": "creeper, NE homestead rim", "mob_map_pos": [70.2, 67, -80.5], "status_0924Z": "ABSENT"},
    {"threat": "creeper, SE homestead rim", "mob_map_pos": [69.6, 67, -107.5], "status_0924Z": "ABSENT"},
    {"threat": "pocket skeleton", "mob_map_pos": [36.6, 64.9, -92.9], "status_0924Z": "ABSENT - a spider now stands at (33.7, 68.1, -91.7) nearby"},
    {"threat": "plateau zombie", "mob_map_pos": [32.5, 67, -88.2], "status_0924Z": "ABSENT"},
    {"threat": "apron-edge zombie", "mob_map_pos": [63.2, 68, -88.8], "status_0924Z": "ABSENT"},
    {"threat": "canopy spider", "mob_map_pos": [41.7, 71.1, -87.8], "status_0924Z": "PRESENT verbatim (airborne, day-neutral)"},
]
d["nearest_surface_hostile_to_critical_points"] = {
    "world_spawn (32,-96)": {"hostile": "spider (33.7, 68.1, -91.7)", "cheb": 4},
    "geist_saved_cell (34.5,-98.5)": {"hostile": "spider (33.7, 68.1, -91.7)", "cheb": 7},
    "pond_cell_geist_death (22.5,-100.5)": {"hostile": "spider (33.7, 68.1, -91.7)", "cheb": 11},
    "vega_parked (55.7,-55.5)": {"hostile": "spider (44.5, 68.0, -71.9)", "cheb": 16},
    "commons_chest_site (63,-82)": {"hostile": "spider (44.5, 68.0, -71.9)", "cheb": 19},
    "homestead_pad (64,-93)": {"hostile": "spider (44.5, 68.0, -71.9)", "cheb": 21},
    "cody_stance (72,-101)": {"hostile": "spider (44.5, 68.0, -71.9)", "cheb": 29},
}
d["comparison_to_mob_map_0720Z"] = {
    "all_entities": {"0720Z": 1261, "0924Z": 1031},
    "hostiles": {"0720Z": 294, "0924Z": 253},
    "note": "Same instrument, same store, two hours apart. The thinning is concentrated in the surface band and is consistent with burn cycles under the restored hold, gradual despawn in repeatedly loaded chunks, and tonight's kills - stated as inference; the census measures the saved population, not the mechanism.",
}
json.dump(d, open(p, "w"), indent=1)
print("census json updated:", p)
