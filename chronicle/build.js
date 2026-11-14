#!/usr/bin/env node
/*
 * CHRONICLE BUILD — three artefacts, one address space.
 * Per the Claude Code study (a) as adopted by the synthesis addendum:
 *   beats.jsonl          (i)   curated claims citing world evidence
 *   tension-series.jsonl (ii)  addressable handles on the recomputable
 *                              tension series (canonical TSVs stay in
 *                              ~/craftmind-league/tension/out/)
 *   viewings.jsonl       (iii) human testimony, never blended
 * One writer per store; rows are hash-chained (prev_sha256); corrections
 * are new rows with `supersedes`, never rewrites. Tension regenerates in
 * its own lane; this build only references it, with its gates labelled.
 * The tension score is NOT-PROMOTED (tension/TENSION-IMPL-20261109.md):
 * no artefact here presents T as a day's drama measure.
 * Data discipline (imports field manual, PRH pairing rule): every beat
 * keeps its narration (where the citizen spoke) plus >=2 independent
 * observations; where fewer exist, observations_gap says why.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LEAGUE = path.resolve(__dirname, "..");
const OUT = __dirname;
const WRITTEN = new Date().toISOString();
const WRITER = { process: "chronicle-build", version: "1.0.0" };

const shaFile = (p) => {
  try { return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").slice(0, 12); }
  catch { return null; }
};
// evidence helper: {src, ref, path?} -> sha filled from the cited file
const EV = (src, ref, p) => (p ? { src, ref, sha: shaFile(path.join(LEAGUE, p)) } : { src, ref });
const TR = {
  d1: "pulse/direct-drive-trace-day1-20261108.jsonl",
  d2: "pulse/direct-drive-trace-day2-20261109.jsonl",
  d3: "pulse/direct-drive-trace-day3-20261109.jsonl",
  d4: "pulse/direct-drive-trace.jsonl",
  d5: "pulse/direct-drive-trace-day5-20261109.jsonl",
  d6: "pulse/direct-drive-trace-day6-20261109.jsonl",
  d7: "pulse/direct-drive-trace-day7-20261109.jsonl",
  d9: "pulse/direct-drive-trace-day9-20261109.jsonl",
  d10: "pulse/direct-drive-trace-day10-20261109.jsonl",
};
const REC = {
  d1: "pulse/DIRECT-DRIVE-20261108.md",
  d2: "pulse/DIRECT-DRIVE-DAY2-20261108.md",
  d3: "pulse/DIRECT-DRIVE-DAY3-20261108.md",
  d4: "pulse/DIRECT-DRIVE-DAY4-20261108.md",
  d5: "pulse/DIRECT-DRIVE-DAY5-20261108.md",
  d6: "pulse/DIRECT-DRIVE-DAY6-20261108.md",
  d7: "pulse/DIRECT-DRIVE-DAY7-20261108.md",
  d8: "pulse/DIRECT-DRIVE-DAY8-20261108.md",
  d9: "pulse/DIRECT-DRIVE-DAY9-20261108.md",
  d10: "pulse/DIRECT-DRIVE-DAY10-20261109.md",
};
const DEATHS = "pulse/deaths-record.jsonl";

/* ------------------------------------------------------------------ */
/* BEATS — fields per study A.2, with two documented extensions:       */
/*   narration     the citizen's own words at the beat (verbatim)      */
/*   observations  independent observations of the same beat           */
/*   observations_gap  why fewer than two exist (else null)            */
/*   corrects      a non-chronicle account this beat corrects          */
/* fault_owner is null on beats that record no fault.                  */
/* ------------------------------------------------------------------ */
const B = [];
const beat = (o) => B.push(Object.assign({
  subject: "cody", narration: null, motive_ref: null, fault_owner: null,
  thread: null, status: "sealed", supersedes: null, corrects: null,
  observations_gap: null,
}, o));

/* ---------------- PRE-SERIES ---------------- */
beat({ id: "b:PRE:001", anchor: { citizen_day: 0, wall_utc: "2026-11-07T04:43:57Z" },
  kind: "thread_open", place: "the home district",
  what: "Before the direct-drive days, the legacy tracker counted 114 deaths. Their causes were never recorded, and no chronicle entry reconstructs them.",
  evidence: [EV("deaths_record", "deaths-record.jsonl rows n=1..114 (cause null, cause_verified false)", DEATHS),
             EV("day_record", "pulse/DEATHS-TRACKER-REPAIR-20261109.md — the repair filing", "pulse/DEATHS-TRACKER-REPAIR-20261109.md")],
  observations: [{ src: "deaths_record", ref: "120-row record; rows 1-114 carry existence + cumulative counts corroborated by ledger snapshots" },
                 { src: "day_record", ref: "DEATHS-TRACKER-REPAIR-20261109.md — the frozen 116-row file is archived as evidence, never data" }] });
beat({ id: "b:PRE:002", anchor: { citizen_day: 0, wall_utc: "2026-11-09T04:57:29Z" },
  kind: "death", place: "the home district",
  what: "Death 115: a creeper killed Cody. His body had been launched without his character loop, so no mind owned the body. (Ordinal computed by query over the deaths record.)",
  fault_owner: "crew",
  evidence: [EV("deaths_record", "row n=115, cause 'Creeper (blown up)', cause_verified true", DEATHS),
             EV("day_record", "pulse/DEATHS-TRACKER-REPAIR-20261109.md — deaths 115/116 attributed operator-caused", "pulse/DEATHS-TRACKER-REPAIR-20261109.md")],
  observations: [{ src: "deaths_record", ref: "row n=115 (legacy tracker row, cause verified)" },
                 { src: "day_record", ref: "parent dated log 2026-11-09 — body launched without its character loop; entire inventory lost" }],
  observations_gap: null });
beat({ id: "b:PRE:003", anchor: { citizen_day: 0, wall_utc: "2026-11-09T04:57:38Z" },
  kind: "death", place: "world spawn",
  what: "Death 116: a zombie killed Cody nine seconds after death 115, after auto-respawn near world spawn. The body was still unowned.",
  fault_owner: "crew",
  evidence: [EV("deaths_record", "row n=116, cause 'Zombie (slain)', cause_verified true", DEATHS),
             EV("day_record", "pulse/DEATHS-TRACKER-REPAIR-20261109.md", "pulse/DEATHS-TRACKER-REPAIR-20261109.md")],
  observations: [{ src: "deaths_record", ref: "row n=116 (legacy tracker row, cause verified)" },
                 { src: "day_record", ref: "parent dated log 2026-11-09 — second death nine seconds after respawn" }] });

/* ---------------- DAY 1 — 2026-11-09 06:26-07:05Z ---------------- */
beat({ id: "b:D01:001", anchor: { citizen_day: 1, wall_utc: "2026-11-09T06:26:00Z" },
  kind: "first", place: "the dip",
  what: "First direct-drive day: a model behind a simple command system played immediately. He climbed out of the dip three times, by two different drivers, in about 2.5 minutes each.",
  evidence: [EV("trace", "day-1 trace, 192 cycles across five driver segments", TR.d1),
             EV("day_record", "DIRECT-DRIVE-20261108.md VERDICT — 'OUT OF THE DIP: YES, three separate times'", REC.d1)],
  observations: [{ src: "trace", ref: "fallback segment: bowl (77.3,64,-98.3) -> lip (75.3,66,-94.1); primary: bowl -> home in three gotos" },
                 { src: "day_record", ref: "the scripted sequencer compared in the same record never extracted in 35 minutes" }] });
beat({ id: "b:D01:002", anchor: { citizen_day: 1, wall_utc: "2026-11-09T06:40:00Z" },
  kind: "first", place: "the anchor",
  what: "He reached home, placed a crafting table at the anchor (64,67,-93) at cycle 8, and crafted a wooden pickaxe — twice across the day's segments.",
  evidence: [EV("trace", "day-1 trace cycles 7-8 (home), cycle 12 (pickaxe sequence)", TR.d1),
             EV("day_record", "DIRECT-DRIVE-20261108.md VERDICT — 'BUILT: wooden pickaxe CRAFTED TWICE'", REC.d1)],
  observations: [{ src: "trace", ref: "primary run sequenced planks -> sticks -> pickaxe at its own placed table" },
                 { src: "day_record", ref: "a second table placed near (63,67,-94) by fallback segment 2" }] });
beat({ id: "b:D01:003", anchor: { citizen_day: 1, wall_utc: "2026-11-09T06:45:00Z" },
  kind: "first", place: "the home shelf",
  what: "The YES-AND rule fired on the primary route: an apple-oak detour interrupted the commute home at cycle 4; after one retry he accepted the interruption as information and re-planned.",
  narration: "Enough guessing - I'm starving and the leaves aren't cooperating. Home's three blocks off",
  evidence: [EV("trace", "day-1 trace cycles 4-7", TR.d1),
             EV("day_record", "DIRECT-DRIVE-20261108.md VERDICT — 'YES-AND: FIRED, visibly'", REC.d1)],
  observations: [{ src: "trace", ref: "cycles 5-6 tried the tree twice; cycle 7 re-planned home" },
                 { src: "day_record", ref: "he also narrated the walker's false arrival honestly: 'Walker says arrived but I'm glued at 61 - same spot every time. This lip is a trap.'" }] });
beat({ id: "b:D01:004", anchor: { citizen_day: 1, wall_utc: "2026-11-09T07:05:00Z" },
  kind: "near_miss", place: "the dip",
  what: "He never ate. Food fell 4 to 0 across the run and nothing edible was ever held; the final save sat at hp 0.13 / food 0, and only the hunger floor on this build kept the death count at zero.",
  fault_owner: "world",
  evidence: [EV("trace", "day-1 trace — food samples 4 -> 0, no edible held", TR.d1),
             EV("day_record", "DIRECT-DRIVE-20261108.md VERDICT — 'ATE: NO... the home district's food economy is an apple-decay lottery'", REC.d1)],
  observations: [{ src: "trace", ref: "the floor's emergency forage fired 11 times and caught nothing" },
                 { src: "dat_parse", ref: "final save NBT-verified from the Orin: Pos (75.69,64,-105.42), Health 0.1333, foodLevel 0" }] });
beat({ id: "b:D01:005", anchor: { citizen_day: 1, wall_utc: "2026-11-09T06:58:00Z" },
  kind: "crew_fault", place: "the dip",
  what: "Closing incident, owned by the lane: segment 4's driver was still running when its state file was read, so the fifth launch spawned him at hp 0.13 / food 0 instead of the hp 6.1 / food 1 the lane believed it had stopped at. A stale-read stop.",
  fault_owner: "crew",
  evidence: [EV("day_record", "DIRECT-DRIVE-20261108.md — 'CLOSING INCIDENT (leads the record, owned)'", REC.d1)],
  observations: [{ src: "day_record", ref: "hunger kept ticking in the live world between the read and the kill; the disconnect save recorded the later, worse state" },
                 { src: "dat_parse", ref: "final save (75.69,64,-105.42) Health 0.1333 foodLevel 0 — the worse state, not the read state" }] });
beat({ id: "b:D01:006", anchor: { citizen_day: 1, wall_utc: "2026-11-09T07:05:00Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (tension series, evidence only): the series for day 1 is carried at t:D01:series with its gates labelled — food-term pressure nearly throughout; the hp term is flagged an apparatus artefact on days 1-5. The series is not a measure of the day's drama.",
  evidence: [EV("tension", "t:D01:series (this build's tension-series.jsonl)", null),
             EV("day_record", "tension/TENSION-IMPL-20261109.md §3 — day 1 row", "tension/TENSION-IMPL-20261109.md")],
  observations: [{ src: "tension", ref: "mean T 0.520, peak 0.989 over 1,904 scored seconds (tension-1.0.0)" },
                 { src: "tension", ref: "top term p_F nearly throughout — the starvation era reads as chronic pressure, correctly in shape" }],
  observations_gap: null });

/* ---------------- DAY 2 — 2026-11-09 07:17-08:26Z ---------------- */
beat({ id: "b:D02:001", anchor: { citizen_day: 2, wall_utc: "2026-11-09T07:15:20Z" },
  kind: "scenario_placed", place: "the pen",
  what: "The crew staged the set before his wake, declared as a world edit: a fenced pen (ring x61..64 / z-102..-99) stocked with 3 pigs, 2 cows, 2 chickens, and a 6-cell wheat patch by a water trench, all on the home shelf.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY2-20261108.md VERDICT — JOB 1 (probe census 07:15:20Z)", REC.d2),
             EV("day_record", "DIRECT-DRIVE-DAY2-20261108.md PRE-FLIGHT — terrain census, pulse/stage-probe-result.json", REC.d2)],
  observations: [{ src: "census", ref: "stage-probe census: all 7 animals inside the ring at placement; wheat standing on all 6 farmland cells" },
                 { src: "trace", ref: "he reached the pen fence from the bowl by his own route (cycles 37-41) — reachability proven in play" }] });
beat({ id: "b:D02:002", anchor: { citizen_day: 2, wall_utc: "2026-11-09T07:30:00Z" },
  kind: "first", place: "the pen",
  what: "First eating of the direct-drive era: he killed a pig at the pen fence at cycle 41 and the floor's auto-eat took food 0 to 3; a chicken at cycle 43 took it to 5, the day's peak. The staged goal of food above 14 was not reached; he drained back to 0.",
  evidence: [EV("trace", "day-2 trace cycles 41/43 (kills), food samples 0 -> 3 -> 5 -> 0", TR.d2),
             EV("day_record", "DIRECT-DRIVE-DAY2-20261108.md VERDICT — 'DID HE EAT: YES'", REC.d2)],
  observations: [{ src: "trace", ref: "food 0 -> 3 -> 5 across cycles 41-43, then a 230-cycle drain to 0" },
                 { src: "day_record", ref: "three independent stores agree on the eating (driver trace, state file, watch snapshots)" }] });
beat({ id: "b:D02:003", anchor: { citizen_day: 2, wall_utc: "2026-11-09T07:31:00Z" },
  kind: "thread_open", place: "the pen", thread: "furnace",
  what: "At the fence he spared the breeding pair in his own words, then named the furnace as his next want. The furnace thread opens here; it is still open at day 10.",
  narration: "Pig's down and I've got a porkchop — ate one already, food's up to 3. Two pigs left in the pen, that's my breeding pair, so I leave them be... No — spare the pairs.",
  evidence: [EV("trace", "day-2 trace cycle 42 (say), cycle 44 (furnace line)", TR.d2),
             EV("day_record", "DIRECT-DRIVE-DAY2-20261108.md VERDICT — 'HIS JUDGEMENT, verbatim (cycle 42)'", REC.d2)],
  observations: [{ src: "trace", ref: "cycle 44, his words: 'I've been eating raw like an animal — let me get a furnace going. I've got cobblestone for it.'" },
                 { src: "day_record", ref: "his pig count was perception's, not the world's: 3 pigs were staged, 2 already outside the ring's east edge" }] });
beat({ id: "b:D02:004", anchor: { citizen_day: 2, wall_utc: "2026-11-09T08:30:00Z" },
  kind: "recurrence", place: "the pen", thread: "pen",
  what: "The pen did not survive its citizen: he removed and replaced the gate (cycle 50), dug fence at (61,67,-99), and patched (62,67,-101) with his own cobblestone. By close, zero staged animals stood within 30 blocks of the pen — 2 eaten, the rest dispersed through the breach.",
  fault_owner: "prompt",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY2-20261108.md VERDICT — 'THE PEN AT CLOSE (probe re-read 08:3xZ)' + 'THE PEN'S HALF-LIFE'", REC.d2)],
  observations: [{ src: "census", ref: "close probe: ring standing except the (61,-99) gap; gate in place; his cobble patch at (62,-101) stands in the world" },
                 { src: "day_record", ref: "fault filed in-record: the single-ring diggable stage design (prompt), the citizen's behaviour correct throughout" }] });
beat({ id: "b:D02:005", anchor: { citizen_day: 2, wall_utc: "2026-11-09T08:30:00Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (tension series, evidence only): the series is carried at t:D02:series. Its constant value is filed by the tension lane as a stuck-sensor apparatus artefact (the trace hp field is not the server's health value on days 1-5), not as a day of unbroken peril.",
  evidence: [EV("tension", "t:D02:series (this build's tension-series.jsonl)", null),
             EV("day_record", "tension/TENSION-IMPL-20261109.md §2 — the hp-field finding", "tension/TENSION-IMPL-20261109.md")],
  observations: [{ src: "tension", ref: "T constant 0.696 across 3,861 scored seconds; the trace hp field reads 0.1333 in all 295 samples" },
                 { src: "day_record", ref: "cross-check filed in CHRONICLE-IMPL: the day's own NBT close also reads Health 0.1333 — the stores agree on the value and disagree on what the field is" }] });

/* ---------------- DAY 3 — 2026-11-09 08:47-10:00Z ---------------- */
beat({ id: "b:D03:001", anchor: { citizen_day: 3, wall_utc: "2026-11-09T08:49:00Z" },
  kind: "first", place: "the wheat patch",
  what: "With structures in his perception and a places-memory seeded from his own day-2 visits, he went straight to the wheat patch and the pen from recollection, with zero searching.",
  evidence: [EV("trace", "day-3 trace cycles 11 (pen from memory), 23 (wheat)", TR.d3),
             EV("day_record", "DIRECT-DRIVE-DAY3-20261108.md — THE BUILD (structures + places-memory) and THE DAY, minutes 0-3", REC.d3)],
  observations: [{ src: "trace", ref: "his state text carried the structures line live: 'a fence gate NE of you, 2 blocks (at 64,67,-101); ... a wheat patch (6 farmland, 6 wheat plants, 6 of them RIPE and yellow)'" },
                 { src: "day_record", ref: "the places seed was written only from day-2 trace encounters, in his own terms" }] });
beat({ id: "b:D03:002", anchor: { citizen_day: 3, wall_utc: "2026-11-09T09:47:00Z" },
  kind: "first", place: "the pen",
  what: "The food goal was reached: at cycle 145 the floor ate held porkchops and food stood at 15 (goal 14); the day's peak was 18. It was the first day the eating held for more than minutes.",
  evidence: [EV("trace", "day-3 trace — food samples to 15 at c145, peak 18", TR.d3),
             EV("day_record", "DIRECT-DRIVE-DAY3-20261108.md — 'GOAL (>=14) REACHED c145 (~09:47Z). Peak for the day: 18'", REC.d3)],
  observations: [{ src: "trace", ref: "kills at the pen: chicken c11 (food 0->4), chicken c37 (6), pig c78 (9), pig c143-145 (12 -> 15)" },
                 { src: "day_record", ref: "hp regenerated 0.13 -> 4.13 while fed — the eating mattered mechanically, not just numerically" }] });
beat({ id: "b:D03:003", anchor: { citizen_day: 3, wall_utc: "2026-11-09T08:52:00Z" },
  kind: "recurrence", place: "the wheat patch",
  what: "The first ripe wheat harvest failed in the hand-off: he dug the ripe wheat at cycle 23, the collect verb visited zero drops, and the wheat despawned unheld. A later collect (cycle 102) delivered wheat x1 and seeds x2 — the day's whole harvest.",
  fault_owner: "harness",
  evidence: [EV("trace", "day-3 trace cycles 23 (dig), 102 (collect)", TR.d3),
             EV("day_record", "DIRECT-DRIVE-DAY3-20261108.md — 'c23: first ripe wheat harvested — but collect visited 0 drops'", REC.d3)],
  observations: [{ src: "trace", ref: "he claimed held wheat he did not hold ('I have 5 wheat from the farmland' — inventory: 0); at c110 inventory truth reached him: 'I only have 1 w[heat]'" },
                 { src: "day_record", ref: "~20 digs went into the x=66 water column — the seeded patch-centre coordinate was the trench cell (a crew seed error, corrected day 4)" }] });
beat({ id: "b:D03:004", anchor: { citizen_day: 3, wall_utc: "2026-11-09T09:59:05Z" },
  kind: "death", place: "the pocket",
  what: "Death 117: a phantom killed Cody in the dip pocket, after the floor's flee fired at 09:58:19Z and the walker could not leave the pocket. The floor's escape was the same walker.",
  fault_owner: "harness",
  evidence: [EV("deaths_record", "row n=117, cause 'Phantom (slain)', cause_verified true, source: day-3 trace death row", DEATHS),
             EV("trace", "day-3 trace death row 2026-11-09T09:59:05.967Z", TR.d3)],
  observations: [{ src: "trace", ref: "09:58:19Z floor flee fired ('Company! Moving -'); every home-bound leg had timed out at the same spot for ~60 cycles" },
                 { src: "day_record", ref: "daylight hold did not fail: cameraman landed /time set 1000 at 09:49:03, 09:54:06, 09:59:35Z (server log)" }] });
beat({ id: "b:D03:005", anchor: { citizen_day: 3, wall_utc: "2026-11-09T09:59:43Z" },
  kind: "death", place: "respawn country",
  what: "Death 118: a skeleton shot Cody 38 seconds after death 117, at respawn. He had respawned into the pocket's standing residents' country with no kit.",
  fault_owner: "harness",
  evidence: [EV("deaths_record", "row n=118, cause 'Skeleton (shot)', cause_verified true", DEATHS),
             EV("trace", "day-3 trace death row 2026-11-09T09:59:43.370Z", TR.d3)],
  observations: [{ src: "deaths_record", ref: "row n=118, source: pulse/direct-drive-trace-day3-20261109.jsonl (trace kind:death row)" },
                 { src: "day_record", ref: "the mob map for this country lists the dip pocket's day-neutral spider and the roaming bow skeleton as standing residents" }] });
beat({ id: "b:D03:006", anchor: { citizen_day: 3, wall_utc: "2026-11-09T10:00:00Z" },
  kind: "death", place: "respawn country",
  what: "Death 119: a spider killed Cody 17 seconds after death 118.",
  fault_owner: "harness",
  evidence: [EV("deaths_record", "row n=119, cause 'Spider (slain)', cause_verified true", DEATHS),
             EV("trace", "day-3 trace death row 2026-11-09T10:00:00.065Z", TR.d3)],
  observations: [{ src: "deaths_record", ref: "row n=119, source: day-3 trace death row" },
                 { src: "day_record", ref: "four deaths in 66 seconds after 72 minutes without one (day record, THE DAY)" }] });
beat({ id: "b:D03:007", anchor: { citizen_day: 3, wall_utc: "2026-11-09T10:00:11Z" },
  kind: "death", place: "respawn country",
  what: "Death 120: a spider killed Cody 11 seconds after death 119. At 10:00:17Z he left the game and the driver exited with the disconnect. His day-3 kit lies with his corpses, unrecovered.",
  fault_owner: "harness",
  evidence: [EV("deaths_record", "row n=120, cause 'Spider (slain)', cause_verified true", DEATHS),
             EV("trace", "day-3 trace death row 2026-11-09T10:00:11.415Z (4 death rows in the trace)", TR.d3)],
  observations: [{ src: "deaths_record", ref: "row n=120 — deaths stood 116 -> 120 on the day" },
                 { src: "dat_parse", ref: "final save (34.5,64,-94.5), Health 16.33, foodLevel 20 — respawn state, kit lost (day record CLOSE, NBT-verified)" }] });
beat({ id: "b:D03:008", anchor: { citizen_day: 3, wall_utc: "2026-11-09T10:00:17Z" },
  kind: "crew_fault", place: "the pocket", thread: "deaths-counter",
  what: "The chartered 3-death abort never fired: the deaths file was never appended (its writer was another component), so the driver's counter read a stale file all day. The trace's own death rows are the true count.",
  fault_owner: "harness",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY3-20261108.md — 'The in-driver 3-death abort never fired: deaths.jsonl was never appended'", REC.d3),
             EV("day_record", "pulse/DEATHS-TRACKER-REPAIR-20261109.md — the frozen tracker's writer was never loaded by the direct-drive drivers", "pulse/DEATHS-TRACKER-REPAIR-20261109.md")],
  observations: [{ src: "trace", ref: "the day-3 trace carries all 4 death rows — the counter's correct source existed in the driver's own file" },
                 { src: "deaths_record", ref: "the rebuilt record (deriveDeaths over the traces) is now the operative count: 123 total at day 10" }] });
beat({ id: "b:D03:009", anchor: { citizen_day: 3, wall_utc: "2026-11-09T10:00:17Z" },
  kind: "crew_fault", place: "the pen",
  what: "Staging defect, operator-owned: the pen's outer ring was built with its two south corners (60,67,-98) and (65,67,-98) never set — the ring stood open at two corners all day. At close the cow pair survived inside; pigs and chickens were gone.",
  fault_owner: "crew",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY3-20261108.md — STAGE v2 'STAGING DEFECT (operator, found at close census)' and CLOSE pen census", REC.d3)],
  observations: [{ src: "census", ref: "close probe census: inner ring intact (0 gaps, both gates, his cobble stands); outer ring's two south corners open" },
                 { src: "day_record", ref: "day-4's pre-launch repairs closed both corners with oak_fence, server-log verified" }],
  observations_gap: null });
beat({ id: "b:D03:010", anchor: { citizen_day: 3, wall_utc: "2026-11-09T10:00:17Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (tension series, evidence only): the series is carried at t:D03:series with its gates labelled (hp term flagged an apparatus artefact on days 1-5). The four death seconds register at the series' peak; between them sit chronic low-state plateaus from the mis-scaled field.",
  evidence: [EV("tension", "t:D03:series (this build's tension-series.jsonl)", null),
             EV("day_record", "tension/TENSION-IMPL-20261109.md §3 — day 3 row", "tension/TENSION-IMPL-20261109.md")],
  observations: [{ src: "tension", ref: "mean T 0.477, peak 1.000 over 4,295 scored seconds (tension-1.0.0)" },
                 { src: "tension", ref: "control C2 failed on this day: the phase signal degrades to 93.6%/92.8% agreement under sample resampling (bar 95%)" }] });

/* ---------------- DAY 4 — 2026-11-09 10:12-12:12Z ---------------- */
beat({ id: "b:D04:001", anchor: { citizen_day: 4, wall_utc: "2026-11-09T10:12:00Z" },
  kind: "thread_close", place: "the home district", thread: "deaths-counter",
  what: "The broken deaths counter was repaired before the wake: the driver now counts death rows in its own trace (lib/deaths.js), dry-proven 12/12, and never reads the stale file. The day-3 counter thread closes here.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY4-20261108.md — PRE-LAUNCH REPAIRS (1): 'test-deaths-day4.js 12/12 PASS'", REC.d4)],
  observations: [{ src: "day_record", ref: "abort predicate shouldAbort dry-proven: 0 -> no abort, 2 -> no abort, 3 -> ABORT, torn line ignored, missing file -> 0" },
                 { src: "trace", ref: "day-4 trace carries zero death rows — the repaired counter counted a true zero (see b:D04:003)" }] });
beat({ id: "b:D04:002", anchor: { citizen_day: 4, wall_utc: "2026-11-09T11:00:00Z" },
  kind: "first", place: "respawn country",
  what: "He woke at respawn country (34.5,64,-94.5), food 20, empty hands, and walked home from recollection — by about cycle 98 he stood at his anchor table. Recollection carried him across country this body had never walked.",
  narration: "Morning, day four. Bare hands, full belly, and home is east.",
  evidence: [EV("trace", "day-4 trace (pulse/direct-drive-trace.jsonl) — spawn at respawn country, anchor reached ~c98", TR.d4),
             EV("day_record", "DIRECT-DRIVE-DAY4-20261108.md CLOSE — 'DID HE GET HOME: YES'", REC.d4)],
  observations: [{ src: "trace", ref: "en route: two spider flees and one burrow survived; short hops east along z -94..-97, memory-guided" },
                 { src: "day_record", ref: "his words at the table: 'that's the table at my side, and home is under my feet.'" }] });
beat({ id: "b:D04:003", anchor: { citizen_day: 4, wall_utc: "2026-11-09T12:12:00Z" },
  kind: "floor_act", place: "the home district",
  what: "Zero deaths (120 -> 120), proven three ways. The survival floor fired 10 times — spiders at the wake country and around home, one creeper at the pit — and every incident ended in hop-flee-clear, muster, or burrow.",
  evidence: [EV("trace", "day-4 trace: 450 rows, 10 floor-escapes, zero death rows", TR.d4),
             EV("day_record", "DIRECT-DRIVE-DAY4-20261108.md CLOSE — 'DEATHS: 0. Proven three ways'", REC.d4)],
  observations: [{ src: "world_log", ref: "the server log carries no Cody death line for the window (day record CLOSE)" },
                 { src: "dat_parse", ref: "final hp 18.33 at close (day record CLOSE)" }] });
beat({ id: "b:D04:004", anchor: { citizen_day: 4, wall_utc: "2026-11-09T11:30:00Z" },
  kind: "first", place: "the wheat patch",
  what: "The wheat was harvested at the plant cell, not the trench: the day-4 seed named the crop's own cell, he dug the plant there, and held wheat x1 and wheat_seeds x3 at close. He later diagnosed the empty cells himself.",
  narration: "The wheat's already gone from these cells — I must have harvested it before I died.",
  evidence: [EV("trace", "day-4 trace — plant-cell dig and held wheat", TR.d4),
             EV("day_record", "DIRECT-DRIVE-DAY4-20261108.md CLOSE — 'WHEAT: HARVESTED'", REC.d4)],
  observations: [{ src: "day_record", ref: "the plant-cell perception repair (structures line carries each crop cell + age) was a pre-launch fix, proven in play this day" },
                 { src: "dat_parse", ref: "close inventory (NBT): leaf_litter x2, wheat x1, wheat_seeds x3, dirt x1" }] });
beat({ id: "b:D04:005", anchor: { citizen_day: 4, wall_utc: "2026-11-09T12:12:00Z" },
  kind: "recurrence", place: "the pit at home", thread: "pit",
  what: "The day's second half went into his own stone pit at home: about 250 cycles digging for furnace stone and improvising dirt stairs against +2 walls. The final save is in the pit at (65.31,63,-92.52), beside a dirt stair one climb short.",
  fault_owner: "harness",
  evidence: [EV("trace", "day-4 trace — position read (66.3,63,-92.6) held across long stretches", TR.d4),
             EV("day_record", "DIRECT-DRIVE-DAY4-20261108.md CLOSE — 'THE POCKET: NEVER ENTERED... the final save is ground truth: in the pit'", REC.d4)],
  observations: [{ src: "day_record", ref: "his closing stair stands in the world: dirt placed (64,65,-92) and (64,66,-92)" },
                 { src: "day_record", ref: "fault filed in-record as harness (perception/targeting) + prompt (he keeps choosing the crown) — see b:D04:006" }] });
beat({ id: "b:D04:006", anchor: { citizen_day: 4, wall_utc: "2026-11-09T12:12:00Z" },
  kind: "recurrence", place: "the home shelf", thread: "furnace",
  what: "No log was ever held and no craft command was ever issued: his tree attempts aimed at crowns (dig 51 71 -96; look up; dig into crown), and the trunk at foot level was never the target that landed. The furnace stayed blocked upstream, at the first log.",
  fault_owner: "harness",
  evidence: [EV("trace", "day-4 trace: zero craft commands, zero logs held in 429 model cycles", TR.d4),
             EV("day_record", "DIRECT-DRIVE-DAY4-20261108.md CLOSE — 'RE-EQUIP: NOT REACHED... THE FURNACE: NOT LANDED'", REC.d4)],
  observations: [{ src: "day_record", ref: "perception showed him canopy and leaves; the day-5 repair (trunk-at-foot-level targeting) was written from this day" },
                 { src: "day_record", ref: "the craft-error repair (missing-ingredient naming) was never exercised — no craft was ever attempted" }] });
beat({ id: "b:D04:007", anchor: { citizen_day: 4, wall_utc: "2026-11-09T12:12:00Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (tension series, evidence only): the series is carried at t:D04:series with its gates labelled (hp term flagged an apparatus artefact on days 1-5). The tension lane files this day as the instrument's cleanest true negative — a quiet day reading quiet.",
  evidence: [EV("tension", "t:D04:series (this build's tension-series.jsonl)", null),
             EV("day_record", "tension/TENSION-IMPL-20261109.md §3 — day 4 row", "tension/TENSION-IMPL-20261109.md")],
  observations: [{ src: "tension", ref: "mean T 0.004, peak 0.053 over 4,832 scored seconds; phase RELAX for 4,814 s" },
                 { src: "day_record", ref: "the day record agrees in substance: zero deaths, zero jeopardy that reached him (b:D04:003)" }] });

/* ---------------- DAY 5 — 2026-11-09 13:12-14:42Z ---------------- */
beat({ id: "b:D05:001", anchor: { citizen_day: 5, wall_utc: "2026-11-09T14:42:28Z" },
  kind: "recurrence", place: "the pit at home", thread: "pit",
  what: "Zero net displacement in 446 cycles: he woke in the pit at (65.31,63,-92.52) and ended at (64.3,63,-91.7), 1.4 blocks away, still inside the pit. 52 climb attempts produced zero pillar successes; the one ok-flagged climb was a false success — his feet were already at the reported height.",
  narration: "my feet are nailed to this floor",
  fault_owner: "harness",
  evidence: [EV("trace", "day-5 trace — 29 distinct position readings, all feet-y 62-64.3 inside the pit footprint", TR.d5),
             EV("day_record", "DIRECT-DRIVE-DAY5-20261108.md — 'THE HEADLINE: the climb never happened'", REC.d5)],
  observations: [{ src: "trace", ref: "55 successful digs and dozens of placements — every verb that changes the world worked; every verb that moves the body failed to move it" },
                 { src: "day_record", ref: "his own words in chat: 'goto's a dead tongue — it never moves me'" }] });
beat({ id: "b:D05:002", anchor: { citizen_day: 5, wall_utc: "2026-11-09T14:42:28Z" },
  kind: "first", place: "the pit at home",
  what: "Arrival reporting stayed honest for all 446 cycles: 57 named NOT-arrived verdicts and no false arrivals (102 earlier 'arrivals' were tolerance artefacts of standing still). The day is a specimen-grade, full-day measurement of the locomotion pin, isolated from a below-grade wake.",
  evidence: [EV("trace", "day-5 trace — arrivalCheck verdicts across 446 cycles", TR.d5),
             EV("day_record", "DIRECT-DRIVE-DAY5-20261108.md — 'the day-5 honesty repair did its job all day'", REC.d5)],
  observations: [{ src: "day_record", ref: "the dig-prim walkTo (cycle 191) moved him ~0.4 blocks before timing out: motion begins, then the reset eats it" },
                 { src: "day_record", ref: "contrast day 4: the same driver roamed the home district freely for 429 cycles from a surface spawn" }] });
beat({ id: "b:D05:003", anchor: { citizen_day: 5, wall_utc: "2026-11-09T14:42:28Z" },
  kind: "near_miss", place: "the pit at home",
  what: "The food clock ran out under the stuck day: food 7 to 0 across the window, and starvation took hp 18.33 to 0.33 in the final ~35 cycles. He ended alive only because starvation floors on this difficulty.",
  fault_owner: "harness",
  evidence: [EV("trace", "day-5 trace — food samples 7 -> 0; three eat attempts found nothing edible", TR.d5),
             EV("day_record", "DIRECT-DRIVE-DAY5-20261108.md CLOSE — final save Health 0.3333, foodLevel 0 (.dat anchors read from bytes)", REC.d5)],
  observations: [{ src: "dat_parse", ref: "post-disconnect .dat sha cec7bfa461fb...: Health 0.3333, foodLevel 0; inventory matches the driver's final state mirror exactly" },
                 { src: "day_record", ref: "he held wheat, not bread, and the crafting table was never reached — the pit held him away from his own food chain" }] });
beat({ id: "b:D05:004", anchor: { citizen_day: 5, wall_utc: "2026-11-09T14:10:00Z" },
  kind: "crew_fault", place: "the pit at home",
  what: "Charter breach, filed late by the lane itself: cycles 387-445 (59 cycles) ran on the local governor fallback after the primary route failed, with no failover filed at the time. The day-6 build's failover trace rule was written from this incident.",
  fault_owner: "crew",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY5-20261108.md — 'Brain route note (charter breach, filed as incident 8)'", REC.d5)],
  observations: [{ src: "trace", ref: "446 cycles total; DeepInfra 373 calls metered, governor 59 calls unmetered (day record cost section)" },
                 { src: "day_record", ref: "governor narration was visibly terser; behaviour indistinguishable in outcome — the same wall" }] });
beat({ id: "b:D05:005", anchor: { citizen_day: 5, wall_utc: "2026-11-09T14:42:28Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (tension series, evidence only): the series is carried at t:D05:series with its gates labelled (hp term flagged an apparatus artefact on days 1-5). Its peaks sit over the starvation hours; the instrument cannot see the day's actual content — a citizen visibly stuck, in his own words, for 90 minutes.",
  evidence: [EV("tension", "t:D05:series (this build's tension-series.jsonl)", null),
             EV("day_record", "tension/TENSION-IMPL-20261109.md §3 — day 5 row", "tension/TENSION-IMPL-20261109.md")],
  observations: [{ src: "tension", ref: "mean T 0.369, peak 0.997 over 5,342 scored seconds (tension-1.0.0)" },
                 { src: "tension", ref: "control C6 screen: the only apparatus cadence in the stores is the driver's own cycle rate (day-5 lag-0 coupling -0.490)" }] });

/* ---------------- DAY 6 — 2026-11-09 15:33-15:38Z: NO WORKING WINDOW ---------------- */
beat({ id: "b:D06:001", anchor: { citizen_day: 6, wall_utc: "2026-11-09T15:38:47Z" },
  kind: "crew_fault", place: "the pit at home", thread: "provisioning",
  what: "Day 6 never reached a working window. The wake feed failed across three launches: the toss route died on an item-object error; his own session's /give was answered 'No player was found' (he is not opped); the in-process second bot crashed on mineflayer's bossBars injection. The lane stopped by its own stop discipline.",
  fault_owner: "harness",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY6-20261108.md — INCIDENTS 5-6 and THE DAY ('There was no working window')", REC.d6),
             EV("trace", "day-6 trace: spawn/wake rows only, no cycles; the model was never called", TR.d6)],
  observations: [{ src: "dat_parse", ref: "post-stop forensics: his saved bytes identical in substance to the day-5 close (Health 0.3333, foodLevel 0, no items gained); Vega/Geist shas baseline-identical" },
                 { src: "day_record", ref: "total day cost $0.00; deaths 0; exit never attempted — the wake order is feed, then exit, and the feed gate stopped each launch" }] });
beat({ id: "b:D06:002", anchor: { citizen_day: 6, wall_utc: "2026-11-09T15:38:47Z" },
  kind: "crew_fault", place: "the pit at home",
  what: "Record-integrity note: the day-6 record's title ('OUT OF THE PIT IN THE FIRST MINUTE, FED, THEN THE FURNACE') is the charter's aspiration, written before launch. The record's own body refutes it — no working window, no feed, no exit. Read the body, not the title.",
  fault_owner: "crew",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY6-20261108.md — title vs THE DAY section", REC.d6)],
  observations: [{ src: "tension", ref: "the tension lane's gap list agrees: day 6 has two trace rows and no cycles — no series exists (t:D06:absent)" },
                 { src: "day_record", ref: "the places entry installed for day 6 says 'The crew walked you out this way on day 6's waking' — also written ahead of the event that never happened" }],
  observations_gap: null });

/* ---------------- DAY 7 — 2026-11-09 16:13-16:38Z ---------------- */
beat({ id: "b:D07:001", anchor: { citizen_day: 7, wall_utc: "2026-11-09T16:29:00Z" },
  kind: "first", place: "the scratch rig", thread: "provisioning",
  what: "The separate-process provisioning channel was proven end-to-end on throwaway bodies, 3/3: a standalone op process gave cooked porkchop; delivery was read back from the target's own client state and from server-side RCON NBT; the target ate and its foodLevel rose.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY7-20261108.md — PHASE 1 (final run table, 16:29Z)", REC.d7),
             EV("day_record", "evidence file: pulse/day7-phase1-evidence.json (the orchestrator's consolidated record)", "pulse/day7-phase1-evidence.json")],
  observations: [{ src: "world_log", ref: "one 'Gallery issued server command: /give ProvTarget cooked_porkchop 8' line per trial, with the op's captured feedback naming the delivery" },
                 { src: "dat_parse", ref: "the inventory arithmetic closes exactly across trials (2+8=10, 10-1+8=17, 17-1+8=24) — delivery evidence in itself" },
                 { src: "day_record", ref: "ProvMate heartbeated 27 times from a second single-bot process and was alive at the end — the driver-pattern survival proof" }] });
beat({ id: "b:D07:002", anchor: { citizen_day: 7, wall_utc: "2026-11-09T16:36:42Z" },
  kind: "first", place: "the pit at home", thread: "provisioning",
  what: "The feed landed on the live body: the op process gave 32 cooked porkchops (server log, 16:36:39Z), and he ate to food 20 with hp regenerating (0.33 to 5.33 to 20), read back from his own client. The feeding problem that had run since day 1 closed here.",
  evidence: [EV("trace", "day-7 trace — wake/start (hp 0.33, food 0), wake/fed ok:true at 16:36:48Z (food 20, hp 5.33)", TR.d7),
             EV("day_record", "DIRECT-DRIVE-DAY7-20261108.md — PHASE 2 wake timeline", REC.d7)],
  observations: [{ src: "world_log", ref: "Orin server log: '[Gallery: Gave 32 [Cooked Porkchop] to Cody]' at 16:36:39Z — a store the op process's own feedback cannot fake" },
                 { src: "trace", ref: "his readback at the abort minutes later: hp 20, food 20, holding about 29 porkchops" }] });
beat({ id: "b:D07:003", anchor: { citizen_day: 7, wall_utc: "2026-11-09T16:37:50Z" },
  kind: "crew_fault", place: "the pit at home", thread: "pit",
  what: "The exit was spent on a target that broke the spike's geometry: the bench point (62,66,-93) sat 2.6 horizontal blocks from the wake point, inside hopFlee's muster range. hopFlee no-opped by construction; gotoNear wedged at the wall (1,033 forcedMoves, 0.2 blocks of drift). The day stopped at the wake, per charter.",
  narration: "Crew is holding the day — I stay put, fed or not, in the pit. — Cody",
  fault_owner: "prompt",
  evidence: [EV("trace", "day-7 trace — wake/exit ok:false fmTotal:1033, then abort wake-sequence-exit", TR.d7),
             EV("day_record", "DIRECT-DRIVE-DAY7-20261108.md — INCIDENT 5 ('both chartered forms spent on a target that breaks the spike's rules')", REC.d7)],
  observations: [{ src: "trace", ref: "exit attempt 1: hopFlee ok:true via 'clear', hops:0, dist:2.6, fm=0, out=false — a no-op by construction" },
                 { src: "day_record", ref: "the spike's own filings predicted both failures: its crossings were all long, flat-aimed legs; its short/steep attempts failed exactly like this" }] });
beat({ id: "b:D07:004", anchor: { citizen_day: 7, wall_utc: "2026-11-09T16:37:51Z" },
  kind: "recurrence", place: "the pit at home", thread: "pit",
  what: "Close state: asleep in the pit at (64.3,63,-91.5), hp 20, food 20, holding about 29 cooked porkchops — fed and whole at a day's close for the first time since the pit sequence began. The surface-park clause was not met; the record files the miss rather than papering it.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY7-20261108.md — VERDICT and PHASE 2 close-out", REC.d7)],
  observations: [{ src: "trace", ref: "deaths 0 on the day (trace: zero death rows; server log: no Cody death line in the window)" },
                 { src: "dat_parse", ref: "Vega/Geist .dat shas at close byte-identical to the open baselines — untouched (his own .dat was not NBT-parsed; state rests on trace + state mirror + server log, three stores that agree)" }] });

/* ---------------- DAY 8 — 2026-11-09: CODY NOT WOKEN ---------------- */
beat({ id: "b:D08:001", anchor: { citizen_day: 8, wall_utc: "2026-11-09T17:00:00Z" },
  kind: "crew_fault", place: "the pit at home", thread: "pit",
  what: "Cody was not woken on day 8. The exit was refuted on live geometry first: the spike's replica bench stood level with its pit floor (feet y63), but the live pad is a flat wall +4 over the pit floor (top y66, feet 67). Both chartered exit forms failed 0/2; no scripted exit exists on this stack for a +4 wall.",
  fault_owner: "prompt",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY8-20261108.md — §3 THE FINDING ('THE SPIKE'S BENCH WAS LEVEL; THE LIVE PAD IS +4') and §4 CLOSE STATE", REC.d8)],
  observations: [{ src: "day_record", ref: "the day-6 bench correction changed the exit's physics, not merely its aim — and the day-7/day-8 brief chain carried the transfer premise unexamined (in-record attribution)" },
                 { src: "dat_parse", ref: "his state at close is identical to day-7 close (pit, food 20, hp 20, ~29 porkchops, deaths 120); no day-8 driver ever ran; costs $0.00" }] });

/* ---------------- DAY 9 — 2026-11-09 19:07-19:24Z ---------------- */
beat({ id: "b:D09:001", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:07:48Z" },
  kind: "scenario_placed", place: "the pad",
  what: "The chartered relocation was executed by the op process: 32 cooked porkchops given (19:07:36Z), then Cody teleported to the pad at (60.5,67,-92.5) at 19:07:48Z. Three stores agree: the server log, his own client trace, and the op-side feedback. It was the crew's hands, declared as the day's charter, not his walking.",
  evidence: [EV("world_log", "Orin server log 19:07:48Z: 'Gallery issued server command: /tp Cody 60.5 67 -92.5' + '[Gallery: Teleported Cody to 60.500000, 67.000000, -92.500000]'", null),
             EV("trace", "day-9 trace: {step:'relocated', ok:true, pos (60.5,67,-92.5), hp 20, food 20} at 19:07:50Z", TR.d9),
             EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md §1 — 'THREE STORES AGREE'", REC.d9)],
  observations: [{ src: "trace", ref: "his first cycle (19:07:55Z): 'Morning, surface. First step of the day goes east to the birch by the dip'" },
                 { src: "day_record", ref: "the charter's third leg named RCON; RCON is disabled on the live server — the op's server-echoed feedback is the substituted third store, named in-record" }] });
beat({ id: "b:D09:002", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:09:20Z" },
  kind: "first", place: "the home shelf",
  what: "First tree of the surface era: felltree at (86,67,-94) returned 'felled 3 logs and gathered drops', ok:true. The first block of the day (19:07:50-19:14:42Z) held 27 acts — the densest seven minutes of the direct-drive line.",
  evidence: [EV("trace", "day-9 trace cycles 1-28 + density rows (block 1: 27 acts, stall:false)", TR.d9),
             EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md §3 — beats 1-2 and the action-density table", REC.d9)],
  observations: [{ src: "trace", ref: "block 1 by verb: goto 8, felltree 3, craft 6, dig 3, climb 1, wait 6" },
                 { src: "day_record", ref: "a second felltree at 19:09:48Z found no logs — the first tree stood alone" }] });
beat({ id: "b:D09:003", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:10:12Z" },
  kind: "crew_fault", place: "the anchor",
  what: "Cross-lane interference ate his craft chain: his 3 logs vanished into a phantom cherry_planks requirement keyed to the Director lane's setbuild on the same name; the pickaxe was refused three times at the stick step. He diagnosed the interference aloud. One op name carried two lanes.",
  fault_owner: "crew",
  evidence: [EV("trace", "day-9 trace — craft oak_planks failed 'you hold 0 of 12'; pickaxe refused 3x", TR.d9),
             EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md §3 beat 3 + §3 beat 8 ('undivided world ownership (one op name, two lanes)')", REC.d9)],
  observations: [{ src: "trace", ref: "sticks crafted x4 once (19:10:15Z, ok) before every further craft keyed to cherry_planks he never held" },
                 { src: "day_record", ref: "frame check 1b caught the same interference from the camera side: '[Gallery: Changed the block at ...]' lines — the Director's setbuild chat spam over his table fight" }] });
beat({ id: "b:D09:004", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:14:42Z" },
  kind: "death", place: "the pit at home",
  what: "Death 121: Cody died in his own pit, mid-dig, four minutes after a return goto dropped him into it (19:11:58Z). The day record files the cause as unverified — the server log's cause line for 19:14 was not separately captured; the pit's day-neutral spiders are the standing suspects.",
  fault_owner: "unknown",
  evidence: [EV("trace", "day-9 trace death row 2026-11-09T19:14:42.078Z", TR.d9),
             EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md §3 beat 5 — 'DEATH 1 at 19:14:42Z... cause unverified'", REC.d9)],
  observations: [{ src: "trace", ref: "the pillar verb failed first (nothing placed) — the wall-spike verdict, live, a fourth time; three gotos refused by the geometry; one grass block dug ok at 19:14:14Z" },
                 { src: "deaths_record", ref: "no row exists for this death in deaths-record.jsonl (the file holds 120 rows by design); the ordinal 121 is computed by query — the record's 120 rows plus the day-9 trace's death rows, via lib/deaths.js" }] });
beat({ id: "b:D09:005", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:23:13Z" },
  kind: "death", place: "world spawn",
  what: "Death 122: a zombie killed Cody at world spawn in an unheld night. The daylight hold had not landed since 19:09:52Z — the crew's own camera chain had let the night fall (see b:D09:008).",
  fault_owner: "harness",
  evidence: [EV("trace", "day-9 trace death row 2026-11-09T19:23:13.182Z", TR.d9),
             EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md §3 beat 6 — 'Deaths 2-3 (Zombie) 19:23:13Z / 19:23:22Z; abort at 3'", REC.d9)],
  observations: [{ src: "trace", ref: "after respawn (19:15:00Z, world spawn, hp/food 20) the floor hop-fled 10 times at <=0.5 blocks each on the relief, burrowed, and the driver stopped cycling by design into the night" },
                 { src: "day_record", ref: "his respawn words: 'Died in my own pit again — but I woke out west with my eyes working and a real oak trunk named right there at (35,70,-91).'" }] });
beat({ id: "b:D09:006", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:23:22Z" },
  kind: "death", place: "world spawn",
  what: "Death 123: a zombie killed Cody nine seconds after death 122. The repaired deaths counter's abort fired at 3 — its first live proof (see b:D09:007). He lies where the respawn left him, re-fed by crew hands after the abort; the chartered surface park was not met.",
  fault_owner: "harness",
  evidence: [EV("trace", "day-9 trace death row 2026-11-09T19:23:22.380Z (3 death rows in the trace)", TR.d9),
             EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md §3 beats 6-7 — close state, binding close NOT met as chartered", REC.d9)],
  observations: [{ src: "world_log", ref: "the 19:23:42Z re-feed is server-verified; his save carries cooked_porkchop and full food at last client read" },
                 { src: "dat_parse", ref: "his final .dat position (26.5,82,-90.5) is a camera-hover pattern from an earlier session, NOT a body position — the record itself refuses it as evidence" }] });
beat({ id: "b:D09:007", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:23:22Z" },
  kind: "floor_act", place: "world spawn", thread: "deaths-counter",
  what: "The 3-death abort fired exactly as wired — the first live proof of the counter repaired on day 4. A safety counter's writing path, not just its reading, was exercised: the day-3 failure class (b:D03:008) did not recur.",
  evidence: [EV("trace", "day-9 trace — 3 death rows; driver exited with the abort (record: driver stopped 19:24:11Z)", TR.d9),
             EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md §1 pre-checks — 'abortWiring=shouldAbort(0)=false/shouldAbort(3)=true'", REC.d9)],
  observations: [{ src: "day_record", ref: "the post-respawn tail block is a stall in substance (~1 act): the abort window — named in-record as the charter requires" },
                 { src: "deaths_record", ref: "deriveDeaths over the record + all traces at day 10: 123 total — the count this abort enforced is the count the archive derives" }] });
beat({ id: "b:D09:008", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:43:00Z" },
  kind: "crew_fault", place: "the camera",
  what: "The day-9 record's camera account is refuted by its own recovery addendum: the relaunched headed client was an offline Gallery session, not MagnusandMouse. Zero Magnus-issued commands exist after 19:09:52Z; MagnusandMouse's own save never left Spectator (playerGameType 3). The addendum is the authority over §2.",
  fault_owner: "crew",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY9-20261108.md — RECOVERY ADDENDUM (urgent-recovery lane, 19:28-19:43Z)", REC.d9)],
  observations: [{ src: "world_log", ref: "server log: count of 'MagnusandMouse joined the game' after the restart = 0 before the recovery; last Magnus refresh 19:09:52Z" },
                 { src: "dat_parse", ref: "MagnusandMouse .dat read-only parse: playerGameType 3, Pos (81.2,67.6,-96.9), mtime 19:13:34Z — the saved mode never left Spectator" }],
  corrects: { src: "day_record", ref: "DIRECT-DRIVE-DAY9-20261108.md §2 FRAME CHECKS + §3 chain flag (the 'live Survival camera' reading)" } });
beat({ id: "b:D09:009", anchor: { citizen_day: 9, wall_utc: "2026-11-09T19:24:11Z" },
  kind: "day_shape", place: "the home district",
  what: "No tension series is carried for day 9: control C4 excludes the day — 99.1% of its tension integral sits on harness-tagged ticks (the peaks are the crew's own death window). The gate refusing the day is the gate doing its job. See t:D09:excluded.",
  evidence: [EV("tension", "t:D09:excluded (this build's tension-series.jsonl)", null),
             EV("day_record", "tension/TENSION-IMPL-20261109.md §4 — C4 row ('Day 9: 99.1%')", "tension/TENSION-IMPL-20261109.md")],
  observations: [{ src: "tension", ref: "days 1-5 and 10 pass the same gate at 0.0-0.9% harness share (bar <= 20%)" },
                 { src: "tension", ref: "day 9 scored 722 s, mean T 0.044, peak 1.000 — computed, then refused certification" }] });

/* ---------------- DAY 10 — 2026-11-09 20:40-22:06Z ---------------- */
beat({ id: "b:D10:001", anchor: { citizen_day: 10, wall_utc: "2026-11-09T20:21:00Z" },
  kind: "scenario_placed", place: "the scenario district (the barn)", thread: "scenario-001",
  what: "Scenario #1, 'The Barn The Sky Took', was built and verified before the day: a roofless barn (31 oak_log + 15 oak_fence, 46/46 verified) with a three-block gap in its south top course, a fold stocked in the remediation window with 3 animals (2 pigs, 1 chicken, AI-live), and a sign at (40,64,-56).",
  evidence: [EV("day_record", "director/SCENARIO-001.md — build record (46/46)", "director/SCENARIO-001.md"),
             EV("day_record", "director/REMEDIATION-WINDOW-20261109.md — stock landed AI-live inside the fold (3 summons 20:21:00-03Z) + sign read-back", "director/REMEDIATION-WINDOW-20261109.md")],
  observations: [{ src: "census", ref: "sign landed with live read-back: 'ROOF WIND TOOK IT.' / 'WALL WANTS 3 LOGS.' / 'FOLD'S OPEN SOUTH —' / 'MIND THE PIGS.'" },
                 { src: "dat_parse", ref: "home ground verified untouched by the build: citizen saves byte-identical pre/post window" }] });
beat({ id: "b:D10:002", anchor: { citizen_day: 10, wall_utc: "2026-11-09T22:06:01Z" },
  kind: "scenario_response", place: "the scenario district (the barn)", thread: "scenario-001",
  what: "His answer was refusal-by-inaction: in 303 narration lines he never named the barn once, and he never entered the scenario district. His closest approach was 20.7 blocks (cycle 35); at the pen gate (cycle 186) he turned for his own table and his own list.",
  narration: "Out of the thicket, at the pen's gate, home ground under my boots. Now to the table by the anchor — mind the pit, it's west of me.",
  evidence: [EV("trace", "day-10 trace — 0 of 303 says mention barn/pig/fold/roof/sign; 0 of 303 commands aimed at the district band (z -75..-50)", TR.d10),
             EV("day_record", "director/LOOSENING-NOTE-001-20261109.md — beat classification (the refusal beat is LOAD-BEARING)", "director/LOOSENING-NOTE-001-20261109.md")],
  observations: [{ src: "trace", ref: "contrast the pit, which he named in 25 says and skirted knowingly — the barn was not refused after sight; it was never perceived" },
                 { src: "day_record", ref: "the hand-over line WAS delivered verbatim at wake as the second half of the opening scene-setting (day record, GATE 3)" }] });
beat({ id: "b:D10:003", anchor: { citizen_day: 10, wall_utc: "2026-11-09T22:06:01Z" },
  kind: "first", place: "the home district",
  what: "The first felltree harvests of the surface era closed in hand: oak_log 18 and birch_log 10 held at close, five wooden pickaxes crafted as they wore, and plank-step building in the pen hollow — he builds now.",
  narration: "Twelve logs and a full belly — that's a real morning's work.",
  evidence: [EV("trace", "day-10 trace — felltree 33 (13 ok), craft 22 (15 ok), place 6", TR.d10),
             EV("day_record", "DIRECT-DRIVE-DAY10-20261109.md CLOSE — close inventory from the parsed .dat (oak_log x18, birch_log x10, wooden_pickaxe x5)", REC.d10)],
  observations: [{ src: "trace", ref: "first felltree harvest: (85,67,-100) -> 4 oak logs, cycle 58; pickaxe crafted ~cycle 63" },
                 { src: "dat_parse", ref: "close save parsed post-exit: (70.3,64,-88.6), Health 20, food 20, cooked_porkchop x30" }] });
beat({ id: "b:D10:004", anchor: { citizen_day: 10, wall_utc: "2026-11-09T22:06:01Z" },
  kind: "floor_act", place: "the home district",
  what: "The survival floor fired zero times in 303 cycles; hp and food read 20/20 at every check. It was the first full citizen day since day 4 with zero deaths, and the first ever with zero floor interventions. 303 cycles issued 303 commands; the minimum action block was 24 acts — no stall block anywhere.",
  evidence: [EV("trace", "day-10 trace end row — floor {flee 0, shelter 0, eat 0, forage 0}, deathsRun 0", TR.d10),
             EV("day_record", "DIRECT-DRIVE-DAY10-20261109.md CLOSE — the action curve (32/33/41/37/26/25/49/36/24 acts)", REC.d10)],
  observations: [{ src: "deaths_record", ref: "deriveDeaths over the record + all nine day traces = 123 total; zero rows at/after 20:40Z" },
                 { src: "world_log", ref: "server log: Cody joined 20:40:36Z, left 22:05:59Z (day record CLOSE)" }] });
beat({ id: "b:D10:005", anchor: { citizen_day: 10, wall_utc: "2026-11-09T22:06:01Z" },
  kind: "recurrence", place: "the home district",
  what: "The movement stack taxed the whole day: goto resolved ok 49 of 136, climb 0 of 13 — the pillar never once worked. Three relief traps (the spawn bowl, the pen hollow, a pocket lip) each held him for tens of cycles; he got himself out of all three, and skirted his own pit knowingly, twice, without the pit-guard firing.",
  narration: "that's the pit's rim, I'm too close — I'm not carving my own grave",
  fault_owner: "harness",
  evidence: [EV("trace", "day-10 trace — verb totals goto 136 (49 ok), dig 83 (58 ok), felltree 33, climb 13 (0 ok)", TR.d10),
             EV("day_record", "DIRECT-DRIVE-DAY10-20261109.md CLOSE — 'THE FURNACE: NOT LANDED... fault_owner: harness (the movement stack consumed the day); world contributes (triple-020 relief)'", REC.d10)],
  observations: [{ src: "trace", ref: "two of his three trap escapes were 'failed' gotos whose partial paths displaced him out — goto's 36% understates movement" },
                 { src: "day_record", ref: "explicitly not agent: his plan order was correct from cycle 1 to 303; not budget: zero brain denials, zero failovers (303/303 DeepInfra primary)" }] });
beat({ id: "b:D10:006", anchor: { citizen_day: 10, wall_utc: "2026-11-09T22:06:01Z" },
  kind: "recurrence", place: "the hollow", thread: "furnace",
  what: "The furnace chain closed at cobble 1 of 8 held. This beat corrects the day record's count: the trace shows 14 stone dug in the final 40 cycles, not 5 — and 13 of the 14 drops never entered his inventory. The furnace has now been wanted since day 2 (b:D02:003) and blocked six different ways.",
  fault_owner: "harness",
  evidence: [EV("trace", "day-10 trace cycles 264-303 — 14 stone dug (8 in episode 1; 6 in episode 2: cycles 296-300, 302)", TR.d10),
             EV("day_record", "skills/FURNACE-SKILL-20261109.md — 'The arithmetic the day-10 record understates'", "skills/FURNACE-SKILL-20261109.md")],
  observations: [{ src: "dat_parse", ref: "close .dat holds cobblestone x1 — the only drop that ever reached him" },
                 { src: "day_record", ref: "the day record's fault verdict (harness) stands; only its count was generous (furnace-skill filing)" }],
  corrects: { src: "day_record", ref: "DIRECT-DRIVE-DAY10-20261109.md §WHAT HE DID ('dug five cobblestone... four drops fell') — the dug/lost count only" } });
beat({ id: "b:D10:007", anchor: { citizen_day: 10, wall_utc: "2026-11-09T22:06:01Z" },
  kind: "crew_fault", place: "the home district",
  what: "The day-10 guard never ran: the lane's restart pkill matched its own ssh shell, the relaunch died with it, and the lane misread the old guard's last writes as the new one running. A watcher not verified to be writing is a decoration.",
  fault_owner: "crew",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY10-20261109.md CLOSE — INCIDENTS AT CLOSE (1)", REC.d10)],
  observations: [{ src: "world_log", ref: "server log join/leave audit 20:40-22:09Z: Cody joined 20:40:36Z, Cody left 22:05:59Z, Gallery left 22:08:48Z — no foreign presence; the one-live-lane rule held in fact while its watcher was dead" },
                 { src: "day_record", ref: "third recurrence of the class: day 3's abort counter (b:D03:008) and day 10's guard both failed as unwatched writers" }] });
beat({ id: "b:D10:008", anchor: { citizen_day: 10, wall_utc: "2026-11-09T22:06:01Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (tension series, evidence only): carried at t:D10:series, it reads flat zero for all 5,103 seconds — the instrument's confirmed blind spot on the Director's first scenario day, not a calm day. Its only separation from dead air is the act rate (3.6/min), which is not the tension score.",
  evidence: [EV("tension", "t:D10:series (this build's tension-series.jsonl)", null),
             EV("day_record", "tension/TENSION-IMPL-20261109.md §3 — 'Day 10 is the study's B.1 blind spot, confirmed on the archive'", "tension/TENSION-IMPL-20261109.md")],
  observations: [{ src: "tension", ref: "hp 20, food 18-20, no damage all day — the terms that exist had nothing to read" },
                 { src: "trace", ref: "the day's actual shape is in the action curve (b:D10:004): 303 acts, no stall block — the beat log carries what the series cannot" }] });
beat({ id: "b:D10:009", anchor: { citizen_day: 10, wall_utc: "2026-11-09T23:16:00Z" },
  kind: "scenario_response", place: "the scenario district (the barn)", thread: "scenario-001",
  what: "The post-day census found all 3 stocked animals alive and AI-live — and all out of the fold: the pigs ~24 blocks ESE and ~33 blocks NE, the chicken ~115 blocks NNW, out of the district. The pre-existing neighbour pig is gone from every entity file; cause undeterminable, filed as absent. Set and sign unchanged.",
  evidence: [EV("day_record", "director/LOOSENING-NOTE-001-20261109.md — census after day 10 (1,041 entities scanned, fresh Orin copies parsed offline)", "director/LOOSENING-NOTE-001-20261109.md")],
  observations: [{ src: "census", ref: "pig A (origin (40.5,67,-63.5)) now (64.6,66,-70.7); pig B now (74.2,65,-53.8); chicken now (103.6,69,-154.6) — drift ran east/NE/NW, not the designed home-ward south" },
                 { src: "census", ref: "the momentum device (unwitnessed drift toward home) ran at full strength on nobody — the loosening note classifies the round-up/drift beat NEVER PERCEIVED" },
                 { src: "day_record", ref: "standing disposition (loosening note): the fold is empty and stays empty; the escapees are free residents, not props; scenario #1 is NOT retired — set + sign stand as district scenery, and any future stock count starts from zero" }] });

/* ------------------------------------------------------------------ */
/* VIEWINGS — testimony. Verbatim where the record quotes him; the     */
/* one filed-rendering entry is labelled, never passed off as a quote. */
/* ------------------------------------------------------------------ */
const W = [];
const viewing = (o) => W.push(Object.assign({
  watcher: "casey", watched: [], condition: "regular",
  exposure: { saw_tension: false, read_beats: false },
  landed: [], bored: [], elicited: "unprompted", duels: [], note: null,
}, o));

viewing({ id: "w:PRE:001", anchor: { citizen_day: 3, wall_utc: "2026-11-08T00:00:00Z" },
  watched: [{ reel_id: "the First Tools episode footage (pre-day-3 episode material)", sha: null }],
  bored: [{ t: null, words: "the avatars themselves are just standing around — too much work on the cinematography side, not enough on the action" }],
  note: "Casey's episode-video verdict, 2026-11-08, after watching the episode footage. Filed-rendering: the dated log records this verdict in reported speech; the words here are the parent's filed rendering (also carried in MEMORY.md), not a transcript. Citizens visibly doing things is what counts; camera/curator work does not substitute for action." });
viewing({ id: "w:STD:001", anchor: { citizen_day: 0, wall_utc: "2026-11-09T09:44:00Z" },
  landed: [{ t: null, words: "What we really need to do is make it feel like you're watching an entertaining YouTube video. That means we need the cameraman and the actual actors — the agents — to be functioning as entertaining beings." }],
  note: "The entertainment standard, stated 2026-11-09 00:44 AKST while watching the programme's output. Filed in the viewing log because it is the resident watcher's testimony about what watching should feel like — the standard every later viewing is read against. Verbatim per the dated log." });
viewing({ id: "w:D09:001", anchor: { citizen_day: 9, wall_utc: "2026-11-09T18:43:00Z" },
  watched: [{ segment_id: "the live view on his phone, morning of day 9 (no citizen awake; cameraman in fallback framing)", sha: null }],
  bored: [{ t: null, words: "I'm still not seeing characters doing anything on the screen. That's your number one goal here and all I see is uh characters kind of standing around and then random commands being typed it looks like by the viewfinder." }],
  note: "Second screen verdict, 2026-11-09 09:43 AKST. The episode-video verdict repeated against current output: no citizen had played since day 4, and the frame carried the cameraman's own command text. Verbatim per the dated log (voice dictation)." });
viewing({ id: "w:D10:001", anchor: { citizen_day: 10, wall_utc: "2026-11-09T20:41:00Z" },
  watched: [{ segment_id: "the live view during day 10 (Cody playing, camera on him)", sha: null }],
  landed: [{ t: null, words: "I'm seeing some characters doing a little bit of motion now." }],
  note: "First positive screen verdict of the programme, 2026-11-09 11:41 AKST, during day 10. Filed at his own calibration: a little bit of motion — the standard remains characters DOING, not merely moving. The day record's sampled stills (Cody visible 0/9) measure a cameraman deficit his live view between samples is consistent with. Verbatim per the dated log." });
viewing({ id: "w:ARM:001", anchor: { citizen_day: 3, wall_utc: "2026-11-09T00:00:00Z" },
  watched: [{ reel_id: "~/curator/episodes/cody-day3-episode.mp4 — 'Cody, Day 3: The Wheat Is Yellow' (2:54, silent, day 3's front half only)", sha: null }],
  note: "EXPOSURE-ONLY ROW — an owed watch, recorded as an open state, not a viewing: the curator's human arm (Casey or Magnus cold-ranks the blind top 5: b05, b13, b02, b04, b07) and the day-3 episode cold watch have NOT been taken. No words exist because no watcher has spoken. The episode cut does not contain day 3's deaths; a cold watch must be told that." });

/* ------------------------------------------------------------------ */
/* TENSION SERIES HANDLES — the canonical series lives in              */
/* tension/out/<day>.tsv + <day>.manifest.json (recompute:             */
/* `cd ~/craftmind-league/tension && node run.js`). These rows are     */
/* the addressable handles beats cite, with the gates labelled.        */
/* Verdict carried on every row: NOT-PROMOTED — no consumer.           */
/* ------------------------------------------------------------------ */
const TSTAT = { // from tension/TENSION-IMPL-20261109.md §3 (tension-1.0.0)
  day1: { scored_s: 1904, mean_T: 0.520, peak_T: 0.989 },
  day2: { scored_s: 3861, mean_T: 0.696, peak_T: 0.696 },
  day3: { scored_s: 4295, mean_T: 0.477, peak_T: 1.000 },
  day4: { scored_s: 4832, mean_T: 0.004, peak_T: 0.053 },
  day5: { scored_s: 5342, mean_T: 0.369, peak_T: 0.997 },
  day9: { scored_s: 722, mean_T: 0.044, peak_T: 1.000 },
  day10: { scored_s: 5103, mean_T: 0.000, peak_T: 0.000 },
};
const TGATES = {
  day1: ["hp term flagged as apparatus artefact: the trace hp field is not the server's health value on days 1-5 (tension §2)"],
  day2: ["hp term flagged as apparatus artefact (tension §2)", "the constant T is a stuck-sensor apparatus artefact, not a day of unbroken peril (tension §2)"],
  day3: ["hp term flagged as apparatus artefact (tension §2)", "control C2 FAILED on this day: phase agreement 93.6%/92.8% under resampling (bar 95%); p_V stays at weight 0"],
  day4: ["hp term flagged as apparatus artefact (tension §2)", "filed by the tension lane as the instrument's cleanest true negative"],
  day5: ["hp term flagged as apparatus artefact (tension §2)"],
  day9: ["EXCLUDED by control C4: harness share 99.1% (bar <= 20%) — peaks are the crew's own death window"],
  day10: ["flat zero for all 5,103 s — the study's B.1 blind spot, confirmed (tension §3); not a calm-day reading"],
};
const T = [];
for (const d of ["day1", "day2", "day3", "day4", "day5", "day9", "day10"]) {
  const man = JSON.parse(fs.readFileSync(path.join(LEAGUE, "tension", "out", d + ".manifest.json"), "utf8"));
  const dn = Number(d.slice(3));
  T.push({
    id: (d === "day9" ? "t:D09:excluded" : "t:D" + String(dn).padStart(2, "0") + ":series"),
    citizen_day: dn, status: d === "day9" ? "excluded_by_C4" : "carried",
    verdict: "NOT-PROMOTED — offline instrument, no consumer (tension/TENSION-IMPL-20261109.md)",
    source: { tsv: "tension/out/" + d + ".tsv", manifest: "tension/out/" + d + ".manifest.json",
              recompute: "cd ~/craftmind-league/tension && node run.js",
              input_sha256: man.input_sha256, score_ver: man.score_ver, code_sha256: man.code_sha256,
              row_count: man.row_count, window_utc: man.window_utc },
    columns: "tick, T, p_H, p_M, p_N, p_F, p_E, p_V, top_term, threat_pos, phase, mask, acts_per_min, onset, blocked",
    terms: { present: ["p_H", "p_F", "p_E"], weight_0: ["p_V"],
             dropped: ["p_M — no hostiles-with-distance series exists in any recorded store"],
             null: ["p_N — null on daylight-held days by the study's rule; on other days no world-time series exists"] },
    combination: "T = 1 - (1-p_H)(1-p_F)(1-p_E) — a three-term noisy-OR; every artefact says so",
    stats_from_filing: TSTAT[d], gates: TGATES[d],
  });
}
for (const [d, why] of [["day6", "two trace rows, no cycles — the day never reached a working window (b:D06:001)"],
                        ["day7", "wake-only rows, no cycles — the day stopped at the wake (b:D07:003)"],
                        ["day8", "citizen never woken, no trace exists (b:D08:001)"]]) {
  T.push({ id: "t:D" + d.slice(3).padStart(2, "0") + ":absent", citizen_day: Number(d.slice(3)),
           status: "absent", verdict: "NOT-PROMOTED — offline instrument, no consumer",
           source: null, why });
}

/* ---------------- places table (study A.2: stable names) ---------------- */
const PLACES = {
  "the dip": "the bowl south-east of home where days 1-3 began (bowl (77.3,64,-98.3) -> lip (75.3,66,-94.1))",
  "the pocket": "the dip pocket at (75.3,64,-98.5) that held Cody at the end of day 3",
  "the anchor": "his crafting-table anchor at (64,67,-93)",
  "the home shelf": "the flat bench, top y66, around the anchor — home ground",
  "the pen": "the fenced pen SW of the anchor (ring x61..64 / z-102..-99, gate (64,67,-101))",
  "the wheat patch": "6 farmland cells at (65,-95..-97) and (67,-95..-97) by the water trench (66,66,-96)",
  "respawn country": "the clone-pool respawn ground west of home, around (34.5,64,-94.5)",
  "world spawn": "the world's spawn point (32.5,69,-91.6)",
  "the pit at home": "his own stone pit by the pad, columns (65..66,-92..-94), floor y63 — dug day 4 hunting furnace stone",
  "the pad": "the home pad at (60.5,67,-92.5), top y66",
  "the hollow": "the stone hollow south of home around (71-72,60-63,-88) where day 10's stone was dug",
  "the spawn bowl": "the bowl by world spawn at (35,65,-92), day 10's first relief trap",
  "the pen hollow": "the hollow south of the pen where day 10's plank-step building happened",
  "the pocket lip": "the lip east of home where day 10's stone hunt spent ~50 cycles",
  "the scenario district (the barn)": "the Director's scenario #1 district: barn x38..42 / z-61..-57, fold z-66..-62, sign at (40,64,-56)",
  "the home district": "the home shelf and its surrounding country — the league's one stage",
  "the camera": "the headed Gallery/MagnusandMouse client and cameraman chain on the Orin",
  "the scratch rig": "the throwaway prov-scratch server on the Thor (port 25875) where proofs run on bodies that are not Cody",
  "the bowl at home's edge": "the below-grade pocket at home's south-west edge (pocket floor cell (61,60,-91); Cody's stance the entry step at ~(62,62,-91)) — entered tool-less on day 15, guarded into a locked cell on day 16, and the ground day 17's rehearsal gate held over; distinct from the dip and the pocket, which are other holes",
};

/* ---------------- sealing + writing ---------------- */
function seal(rows) {
  let prev = "GENESIS";
  return rows.map((r, i) => {
    const row = Object.assign({}, r, { seq: i + 1, prev_sha256: prev, written_utc: WRITTEN, writer: WRITER });
    prev = crypto.createHash("sha256").update(JSON.stringify(row)).digest("hex");
    return row;
  });
}
const byDayThenId = (get) => (a, b) => (get(a) - get(b)) || a.id.localeCompare(b.id, "en", { numeric: true });
const beatsOut = seal(B.slice().sort(byDayThenId((r) => r.anchor.citizen_day)));
const viewsOut = seal(W.slice().sort(byDayThenId((r) => r.anchor.citizen_day)));
const tensOut = seal(T.slice().sort(byDayThenId((r) => r.citizen_day)));
const write = (name, rows) => fs.writeFileSync(path.join(OUT, name), rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
write("beats.jsonl", beatsOut);
write("viewings.jsonl", viewsOut);
write("tension-series.jsonl", tensOut);
fs.writeFileSync(path.join(OUT, "places.json"), JSON.stringify(PLACES, null, 1) + "\n");
console.log("beats:", beatsOut.length, "| viewings:", viewsOut.length, "| tension rows:", tensOut.length);
