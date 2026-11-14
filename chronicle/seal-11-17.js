#!/usr/bin/env node
/*
 * CHRONICLE SEAL — DAYS 11-17 (append-only extension of build.js's seal).
 *
 * The sealed stores (CHRONICLE-IMPL-20261109.md) are append-only:
 * corrections are new rows with supersedes, never rewrites — and
 * re-running build.js would re-seal EVERY row with a fresh written_utc,
 * which is a rewrite of history. This script therefore:
 *   1. loads the three stores verbatim;
 *   2. verifies the existing hash chains end-to-end (fail loud);
 *   3. refuses to run if any target id already exists (idempotent guard);
 *   4. appends the new day 11-17 beats (continuing seq + chain) and the
 *      day 11-17 tension absent rows, chaining each new row onto the
 *      verified head of its store;
 *   5. writes beats.jsonl / tension-series.jsonl back with the original
 *      rows' bytes untouched (JSONL append = the old content is an exact
 *      byte prefix afterwards; the lane verifies this from outside).
 * viewings.jsonl is NOT touched (no new testimony rows in this seal).
 * places.json gains one entry ("the bowl at home's edge"); build.js's
 * PLACES table is patched to match, so a future full build reproduces it.
 *
 * Data discipline identical to build.js: every beat cites >=1 evidence
 * (sha = 12-hex prefix of the cited store file, filled at seal time on
 * this box), keeps the citizen's narration verbatim where he spoke, and
 * >=2 independent observations from different store classes — or a
 * labelled observations_gap. Tension rows for days 11-17 are ABSENT rows
 * (no series was ever computed for these days; the canonical TSV +
 * manifest the series rows reference do not exist), each under the
 * standing NOT-PROMOTED verdict.
 * The days 1-5 hp two-readings flag is preserved, not asserted: no new
 * beat takes a side; days 11-17 hp values are cited as driver-state
 * reads (the trace cycle rows' label), never upgraded.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LEAGUE = path.resolve(__dirname, "..");
const OUT = __dirname;
const WRITTEN = new Date().toISOString();
const WRITER = { process: "chronicle-seal-11-17", version: "1.0.0" };

const shaFile = (p) => {
  try { return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").slice(0, 12); }
  catch { return null; }
};
const EV = (src, ref, p) => {
  const e = { src, ref };
  if (p) {
    const s = shaFile(path.join(LEAGUE, p));
    if (s === null) throw new Error("evidence path missing on this box: " + p);
    e.sha = s;
  }
  return e;
};

const TR = {
  d11: "pulse/direct-drive-trace-day11-20261110.jsonl",
  d12: "pulse/direct-drive-trace-day12-20261110.jsonl",
  d13: "pulse/direct-drive-trace-day13-20261110.jsonl",
  d14: "pulse/direct-drive-trace-day14-20261110.jsonl",
  d15: "pulse/direct-drive-trace-day15-20261110.jsonl",
  d16: "pulse/direct-drive-trace-day16-20261110.jsonl",
};
const REC = {
  d11s: "pulse/DIRECT-DRIVE-DAY11-20261109.md",
  d11p: "pulse/DIRECT-DRIVE-DAY11-PLAYED-20261109.md",
  d12: "pulse/DIRECT-DRIVE-DAY12-20261109.md",
  d13: "pulse/DIRECT-DRIVE-DAY13-20261109.md",
  d14: "pulse/DIRECT-DRIVE-DAY14-20261109.md",
  d15: "pulse/DIRECT-DRIVE-DAY15-20261109.md",
  d16: "pulse/DIRECT-DRIVE-DAY16-20261109.md",
  d17: "pulse/DIRECT-DRIVE-DAY17-20261109.md",
};
const DEATHS = "pulse/deaths-record.jsonl";

/* ---------------- chain helpers (mirror check.js exactly) ---------------- */
const rowHash = (r) => crypto.createHash("sha256").update(JSON.stringify(r)).digest("hex");
function loadRows(name) {
  const text = fs.readFileSync(path.join(OUT, name), "utf8");
  const rows = text.trim().split("\n").map((l) => JSON.parse(l));
  let prev = "GENESIS";
  rows.forEach((r, i) => {
    if (r.seq !== i + 1) throw new Error(name + ": seq gap at row " + (i + 1));
    if (r.prev_sha256 !== prev) throw new Error(name + ": chain break at " + r.id);
    prev = rowHash(r);
  });
  return { rows, head: prev };
}
function appendRows(name, loaded, news) {
  let prev = loaded.head, seq = loaded.rows.length;
  const out = loaded.rows.slice();
  for (const r of news) {
    seq += 1;
    const row = Object.assign({}, r, { seq, prev_sha256: prev, written_utc: WRITTEN, writer: WRITER });
    prev = rowHash(row);
    out.push(row);
  }
  fs.writeFileSync(path.join(OUT, name), out.map((r) => JSON.stringify(r)).join("\n") + "\n");
  return out.length;
}

/* ---------------- beat helper (build.js's defaults, verbatim) ---------------- */
const B = [];
const beat = (o) => B.push(Object.assign({
  subject: "cody", narration: null, motive_ref: null, fault_owner: null,
  thread: null, status: "sealed", supersedes: null, corrects: null,
  observations_gap: null,
}, o));

/* ================= DAY 11 — ACT 1: THE GATE B STOP ================= */
beat({ id: "b:D11:001", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:27:20Z" },
  kind: "crew_fault", place: "the home district", thread: "deaths-counter", fault_owner: "harness",
  what: "Day 11's first start never happened: the floor parked driver_heartbeat_lost 95 s after issuing its lease (issued 00:25:45Z, parked 00:27:20Z) because the heartbeat-lost clock ran from LEASE_ISSUE even though the driver had never started. A second lease (00:28:20Z) parked the same way at 00:29:50Z.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-20261109.md — INCIDENTS 1 (the blocker): floor/driver heartbeat contract defect, three latent defects named", REC.d11s),
             EV("trace", "day-11 trace — the stop attempt's only rows are two gate-refuse-start rows (00:28:31Z, 00:30:11Z), reason no-lease", TR.d11)],
  observations: [
    { src: "day_record", ref: "stop record §5 (the floor's own log): VERIFY_FEED passed first-read (have 30 >= need 8, zero gives); one daylight assertion issued and landed attempt 1 as Gallery 00:25:50Z; the floor ended the attempt parked, by design" },
    { src: "day_record", ref: "no command was ever executed under a dead lease — the start gate refused both launches; Cody's body joined and left inside the refused starts and his save content re-read item-for-item identical to day 10's close" },
  ] });
beat({ id: "b:D11:002", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:22:05Z" },
  kind: "crew_fault", place: "the home district", fault_owner: "harness",
  what: "The ddbridge relay died its eighth death at Gate B's relay check (00:22:05Z, ECONNRESET — both VM-side setsid supervisors gone, the same VM session-loss pattern as deaths 1-7). Relaunched under supervisors, it passed RELAY-OK end-to-end from Thor at 00:23:00Z and again at the launch re-check.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-20261109.md — INCIDENTS 2 (relay's eighth death)", REC.d11s)],
  observations: [
    { src: "day_record", ref: "Thor's ddbridge-fwd.service was healthy throughout — the failure was VM-side supervision, not the tunnel's far end" },
    { src: "day_record", ref: "the stop record notes the restart-surviving service-unit debt 'stands, heavier — setsid supervision has now failed eight times as a strategy'" },
  ] });
beat({ id: "b:D11:003", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:25:03Z" },
  kind: "floor_act", place: "the home district", fault_owner: "harness",
  what: "The floor's first live open parked SENSOR_PATH_BROKEN before any lease: the contract's sensor trace did not exist yet, and the floor refused to count from an unreadable store — as designed. The state was archived, the trace created empty, and the floor re-opened clean.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-20261109.md — INCIDENTS 3 (floor's first open parked on the sensor; this lane's sequencing)", REC.d11s)],
  observations: [
    { src: "day_record", ref: "the rig lane's dry-check had seeded its fixture trace; the live sequence had not — a lane sequencing gap, named in the record" },
    { src: "day_record", ref: "the record files the park as 'the day-3 decoration, inverted' — the counter refusing silence rather than decorating it (b:D03:008's class, working)" },
  ] });
beat({ id: "b:D11:004", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:30:11Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (stop attempt): zero cycles, zero acts — the trace holds only the two gate-refuse-start rows. No tension series is carried for the day (t:D11:absent): a day that never started has no series, and this absence is addressable, not reconstructed.",
  evidence: [EV("trace", "day-11 trace — two gate-refuse-start rows and nothing else from the stop attempt", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-20261109.md — head: 'Action curve: zero cycles, zero acts'", REC.d11s)],
  observations: [
    { src: "day_record", ref: "deaths re-derived twice over the record + all traces: 123 -> 123; the day spent zero citizen brain calls — the gate ruled on the plan before any spend" },
    { src: "day_record", ref: "frame verdict not producible: no citizen was ever in the world, so no stills of Cody exist to sample" },
  ] });
beat({ id: "b:D11:005", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:43:30Z" },
  kind: "crew_fault", place: "the home district", fault_owner: "crew",
  what: "Record-integrity correction: the day-11 stop record states the cameraman cap-renewal job 'does not exist'. It does — a goal-owned cron outside the VM and Thor cron lists the lane searched. Renewal #9 fired 15:42 AKST 2026-11-09, branch (a); the standing chain (pid 959880) was healthy.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-20261109.md — INCIDENTS 4 (the claim as filed: 'No such job exists in the fleet's cron store (0 jobs) or Thor's user crontab')", REC.d11s)],
  observations: [
    { src: "day_record", ref: "the claim gated nothing: the cameraman chain was verified live at Gate B and superseded pre-wake by the chartered day-11 activation" },
    { src: "day_record", ref: "the standing lesson the correction carries: before filing 'X does not exist', search the OWNING store — goal-owned crons live outside the lists this lane read" },
  ],
  corrects: { src: "day_record", ref: "DIRECT-DRIVE-DAY11-20261109.md — INCIDENTS 4, the non-existence claim only" } });
beat({ id: "b:D11:006", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:38:22Z" },
  kind: "floor_act", place: "the camera",
  what: "Posture restored before any repair ran: the day-11 cameraman (pid 913845) STOP-stopped with the citizen offline; the original cameraman.py relaunched (pid 959880), refresh ON, its /time set 1000 assertions landing 00:38:22Z, 00:43:30Z, 00:48:41Z — only then were the Thor day-11 pieces stood down.",
  evidence: [EV("day_record", "floor/FLOOR-REPAIR-20261109.md — posture restore first, then repairs (ledger 334-336)", "floor/FLOOR-REPAIR-20261109.md")],
  observations: [
    { src: "day_record", ref: "the stop record's changeover facts stand behind the restore: the activation STOP-started the old chain across a ~50 s window with no citizen in the world; the floor's first landed assertion (00:25:50Z) followed the old chain's last (00:22:29Z) by 3 min 21 s, in an empty world in held morning" },
    { src: "day_record", ref: "chatVisibility:1 intact through the changeover and restore — Commands Only held" },
  ] });
beat({ id: "b:D11:007", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:54:44Z" },
  kind: "thread_close", place: "the home district", thread: "deaths-counter",
  what: "Floor repaired (constitution untouched): LAUNCH lease heartbeat-lost clock starts at first heartbeat or launch_window_s expiry, earlier of the two; releases carry monotone seq, consumed post-park only; gate reasons distinct. Proof: repair 5/5, legacy 14/14, wiring 4/4.",
  evidence: [EV("day_record", "floor/FLOOR-REPAIR-20261109.md — the three repairs + proof batteries (ledger 334-336)", "floor/FLOOR-REPAIR-20261109.md")],
  observations: [
    { src: "day_record", ref: "live proof the same morning: the relaunch lease (00:54:44Z) stood in launch through ~4.3 min of Gate B + changeover and flipped live on the driver's first heartbeat — the repair doing its job in production (b:D11:017)" },
    { src: "day_record", ref: "the same filing proved systemd relay units (ddbridge-relay.service + ddbridge-tunnel.service, enabled, Restart=always, kill-tests passed) ON THE REPAIR LANE'S INSTANCE — but days 12, 13, 14, 16 and 17 each found no systemd units on the serving VM and the setsid supervisors dead; the contradiction is carried at b:D17:007, not settled here" },
  ] });

/* ================= DAY 11 — ACT 2: THE PLAYED RELAUNCH ================= */
beat({ id: "b:D11:008", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:59:36Z" },
  kind: "first", place: "the hollow",
  narration: "Morning. I'm standing in the hollow with one cobble and a furnace still hungry — home's just west along the south shoulder, and I'll walk it the safe way, south of that pit, never across it.",
  what: "The relaunched day opened at 00:59:36Z: Cody woke in the hollow, read the Director's hand-over line back in his own words at cycle 1, and walked out under his own power — no relocation. hp/food read 20/20 (driver-state reads) at every one of the day's 31 cycles; zero floor interventions.",
  evidence: [EV("trace", "day-11 trace cycle 1 (00:59:36Z) — say mirrors the hand-over line; spawn readback (70.3, 64, -88.6), hp 20, food 20 (driver-state reads)", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §1 — the wake and the hand-over landing", REC.d11p)],
  observations: [
    { src: "day_record", ref: "the relaunch Gate B (played record §10): saves verified live (Cody sha 83dc33af..., content item-for-item identical to day-10 close), deaths baseline 123 re-derived, RELAY-OK PASS at check and at launch" },
    { src: "day_record", ref: "the floor's lease stood in launch state through Gate B and flipped live on first heartbeat — the morning's repair proven in production (b:D11:007)" },
  ] });
beat({ id: "b:D11:009", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:59:36Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape (played): 31 cycles in 7.47 min (00:59:36Z->01:07:04Z), cut by a floor park. Verbs: goto 14 (7 ok), dig 10 (5), craft 4 (3), felltree 2 (1), climb 1 (0). Zero deaths. 4.15 calls/min vs 3.976 ceiling — OVER-TARGET, filed; $0.0305, zero failovers.",
  evidence: [EV("trace", "day-11 trace — 31 cycle rows, 32 density rows, gate-park + gate-park-close rows at the end", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §1 + §5 — action curve and budget actuals", REC.d11p)],
  observations: [
    { src: "day_record", ref: "bookkeeping flag filed, not resolved: the trace's 32 density rows sum to 527 sub-acts (~17 per command) against day 10's ~7 per command — both figures filed; the command count is the day's measure" },
    { src: "day_record", ref: "no stall block: the charter's minimum block is 24 acts and the day was cut before it could stall" },
  ] });
beat({ id: "b:D11:010", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:01:00Z" },
  kind: "scenario_response", place: "the hollow", thread: "furnace",
  narration: "Well — there's a real oak trunk five blocks west of me, foot at (65,66,-88). I'm not passing that up. Wood first, then home.",
  what: "He read the Director's tread log at cycle 2 as 'a real oak trunk five blocks west' — a resource, from inside the hollow, before standing on the road. Felltree from range failed; cycle 4 felltree 65 66 -88 returned ok, one log gathered. Taken as material in five minutes.",
  evidence: [EV("trace", "day-11 trace cycles 2-4 — felltree aimed at (65,66,-88), ok at cycle 4", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §1 cycle spine (c2, c4) + §9 perception sub-read", REC.d11p)],
  observations: [
    { src: "census", ref: "post-day census (region md5 20c15e11...): the tread cell (65,66,-88) reads minecraft:air; invariant cells as placed/surveyed; (65,65,-88) reads grass_block again — the placement's cover-kill regrew under held daylight" },
    { src: "day_record", ref: "he crossed home over the shoulder band at cycle 13 (position (65.1, 67, -89.7)) and reached his table at cycle 14 — the homeward leg the stop attempt never had" },
  ] });
beat({ id: "b:D11:011", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:03:00Z" },
  kind: "recurrence", place: "the hollow", fault_owner: "harness",
  what: "The walk home was walker-taxed from the first command: cycle 1's goto failed with the walker giving up at his start position, and cycles 3-12 worked north around the hollow rim in short hops — the +1-step relief taxing every leg, as on days 10 and 12-13 after it.",
  narration: "This little rise has me boxed. Time to stop shuffling and just cut west through — one block at a time toward the table.",
  evidence: [EV("trace", "day-11 trace cycles 1-13 — goto 14 on the day (7 ok); cycle 11 say names the tax", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §1 — 'the hollow exit is walker-taxed from the first command'", REC.d11p)],
  observations: [
    { src: "trace", ref: "cycle 13 position (65.1, 67, -89.7) — the crossing was made on the 12->13 leg, in small displacements, not by any single arrival claim" },
    { src: "day_record", ref: "filed as the standing movement tax, not an agent fault: his plan order was the charter's order from cycle 1" },
  ] });
beat({ id: "b:D11:012", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:04:30Z" },
  kind: "first", place: "the home shelf", thread: "furnace",
  narration: "Home at last, table at my elbow. I've got 18 oak logs and 10 birch in my pack — let me turn some of that into planks and get the furnace chain going.",
  what: "At his own table he ran the furnace chain reordered (home/table first, stone at home): craft oak_planks 8 ok (c15), craft stick 4 ok (c16), craft stone_pickaxe FAILED at c17 — the asset's named dialect ('missing ingredients — cobbled_deepslate — you hold 0 of 3') — then craft wooden_pickaxe ok (c18).",
  evidence: [EV("trace", "day-11 trace cycles 15-18 — the craft sequence and the stone_pickaxe dialect failure", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §1 (c15-c18) + §2 deviations", REC.d11p)],
  observations: [
    { src: "trace", ref: "his cycle-18 say names the dialect himself: 'Deepslate? No — I want plain cobblestone, three of it. The bench is reading something odd'" },
    { src: "day_record", ref: "deviations filed exactly: S2/S3 ran before S6 (the chartered hollow pocket was empty); stone was dug at home, not the pocket; the S7 seam stance was not performed" },
  ] });
beat({ id: "b:D11:013", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:05:30Z" },
  kind: "recurrence", place: "the home shelf", thread: "furnace", fault_owner: "harness",
  narration: "Two cobble. Keep going — this seam's wide enough to feed me.",
  what: "Stone phase at home: digs at (64,66,-92)/(64,67,-93) failed; standing at y67 he dug stone at (61,63,-92), (62,63,-92) — not the chartered seam stance. Held cobble peaked 2 of 8. Furnace: NO — S10/S11 never attempted; skill uses[] appended (ran-reordered-partial).",
  evidence: [EV("trace", "day-11 trace cycles 19-28 — the home stone phase; cycle 26 say 'Stone! There it is', cycle 27 say gives the count", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §2 — furnace NO; peak read-back stands on trace + his say, not the save (Incident D)", REC.d11p)],
  observations: [
    { src: "census", ref: "post-day census: zero furnace blocks in the district (x 54..90, y 55..75, z -106..-70) — corroborating the NO from the store" },
    { src: "day_record", ref: "cycles 29-31: in the dug dip beside his pit at (63.3, 64, -90.4); gotos out failed ('3 blocks below'); c31 climb failed ('pillar failed (nothing placed under you)') — the one-step wall again, at home" },
  ] });
beat({ id: "b:D11:014", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:07:03Z" },
  kind: "floor_act", place: "the home district", fault_owner: "harness",
  narration: "I've dug myself into a little hollow and the walker won't climb out by wishing. I've got dirt in my pocket — I'll pillar up out of here.",
  what: "Floor parked the day 01:07:03Z (daylight_unrestorable) over a round that had landed: all three 01:06 commands landed (server log + op ok:true), verified by none in-window. Driver hit gate-park next cycle head, skipped close-exit, exited rc=0. He was never in danger.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §7 — the park: mirror byte offsets 58832/58995/59158 vs the floor's before-offsets exactly +1 in every case", REC.d11p),
             EV("trace", "day-11 trace — gate-park row at 01:07:03Z and gate-park-close; driver exit 01:07:09Z rc=0", TR.d11)],
  observations: [
    { src: "day_record", ref: "root cause measured post-hoc from the mirror file itself: log-mirror.sh appends one trailing echo newline, so every landing line sits one byte before the floor's size-based search slice; contributing: the 2 s verify window opens only after ~2.7 s of channel response" },
    { src: "day_record", ref: "the morning's three daylight rounds (00:54:48, 00:58:49, 01:02:49) each verified attempt 1 — the defect fired only in the 01:06 round; the floor behaved exactly as its constitution requires (it cannot verify, so it parks); the defect is in the rig around it" },
  ] });
beat({ id: "b:D11:015", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:07:04Z" },
  kind: "scenario_response", place: "the hollow",
  what: "Triple-021 as triple-023: FAIL. (i) homeward crossing PASS; (ii) no dig/place in step box PASS on literal verbs — removal was by felltree, unnamed in the rule; (iii) census FAIL: (65,66,-88) reads air. Met as material, not ground — opposite of prediction.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §9 — triple-023 scored FAIL, all three clauses read", REC.d11p),
             EV("day_record", "director/LOOSENING-NOTE-003-20261109.md — the doctrine revision the score forced", "director/LOOSENING-NOTE-003-20261109.md")],
  observations: [
    { src: "census", ref: "post-day census (region md5 20c15e11...): tread cell air; invariant cells identical; his-ground spot reads all unchanged (table (64,67,-94), farmland, trench water, pad tops, pen gates)" },
    { src: "day_record", ref: "perception sub-read (unscored): his cycle-2 say named the log 'a real oak trunk' — perceived as a resource from inside the hollow, before ever standing on the road (b:D11:010)" },
  ] });
beat({ id: "b:D11:016", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:07:04Z" },
  kind: "thread_open", place: "the hollow",
  what: "Loosening note #3, the doctrine the day forced: an element made of a material he wants is an OFFER, not scenery — he will take it as material. Scenario rules must name EVERY removal verb (triple-021 named dig/place; the log left by felltree). The scenario-002 thread's lesson is carried into every later scenario filing.",
  evidence: [EV("day_record", "director/LOOSENING-NOTE-003-20261109.md — loosening #3: an offer, not scenery; rules must name every removal verb", "director/LOOSENING-NOTE-003-20261109.md")],
  observations: [
    { src: "day_record", ref: "the note generalises day 10's lesson (loosening #1: scenarios must intersect his momentum) — day 11's element DID intersect his road home and was still not met as ground, because it was made of oak" },
    { src: "day_record", ref: "the next scenario (#3, day 12) was authored under this doctrine: one cobblestone at the same cell — a material he was already walking to dig (b:D12:001, b:D12:010)" },
  ] });
beat({ id: "b:D11:017", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:07:09Z" },
  kind: "floor_act", place: "the home district",
  what: "Floor's played-day report: lease born in launch (00:54:44Z), live on first heartbeat; three daylight rounds verified attempt 1 before the 01:06 miss; COUNT_DEATH 0; PARK 01:07:03Z (park_seq 24) + revoke + NOTIFY receipted. The lease gate has teeth in production.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §4 — the floor's live report from its own log (contract sha 7d817ccd... on every row)", REC.d11p)],
  observations: [
    { src: "day_record", ref: "verifier quirk filed in the record: its cross-audit counts operator test traffic as floor acts, so its status read ok:false at every in-day read for that reason alone — do not read the verifier's ok:false as a floor failure" },
    { src: "day_record", ref: "deaths derived post-day over record + all traces: 123 total, 0 in the played window; Cody left offline at (63.3, 64, -90.4), unharmed, in the dug dip beside his own pit" },
  ] });
beat({ id: "b:D11:018", anchor: { citizen_day: 11, wall_utc: "2026-11-10T00:58:10Z" },
  kind: "crew_fault", place: "the home district", fault_owner: "harness",
  what: "Incident A: relaunch's first start (00:58:10Z) gate-refused lease-absent — launch script pointed the gate at the wrong state directory. Distinct reasons named the fault; one-line fix (original kept .pre-relaunch-fix); second start printed 'GATE: live lease confirmed'. Cody joined/left same second, unharmed.",
  evidence: [EV("trace", "day-11 trace — gate-refuse-start row at 00:58:10.710Z, reason lease-absent (the repair's vocabulary, not the old no-lease)", TR.d11),
             EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §8 Incident A", REC.d11p)],
  observations: [
    { src: "day_record", ref: "Incident B (same record): the first op-bot start replayed the stop attempt's request backlog on boot — harmless duplicates; clean restart (pid 1449566) with fresh Gate B receipts (gateb-relaunch-ping-1, gateb-relaunch-park-test-1 at 00:54:29Z)" },
    { src: "day_record", ref: "the refused start is the safety system working: a gate reading the wrong directory refused rather than guessed — §9.10's discipline on the relaunch side" },
  ] });
beat({ id: "b:D11:019", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:07:04Z" },
  kind: "crew_fault", place: "the camera", fault_owner: "crew",
  what: "Incident C: day 11 ran WITHOUT subject-keeping. Orin's cameraman-day11-framing.py is byte-identical to the original (md5 27aaa066...); the activated file is original + two CAM_DAY_REFRESH_OFF guards only. Frames: Cody-visible 1/10 full (3/10 with partials); clean-frame 10/10.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §6 — Incident C + frame verdict (10 stills read by eye)", REC.d11p),
             EV("day_record", "pulse/CAMERAMAN-SUBJECT-KEEPER-20261109.md — the keeper as built and proven on Thor (md5 6042c1cb...), the artefact that was never deployed this day", "pulse/CAMERAMAN-SUBJECT-KEEPER-20261109.md")],
  observations: [
    { src: "day_record", ref: "the changeover itself executed as chartered: STOP placed with Cody offline, old chain exited cleanly 00:57:16Z, day-11 file live as pid 983269 at 00:57:25Z; server log shows the last MagnusandMouse /time set at 00:53:53Z and none after" },
    { src: "day_record", ref: "standing lesson, third form (carried by the parent): claim, proof, and bytes on the target box are three separate facts — the next camera charter must verify the activated file's diff before Gate B, not after the day; day 12 did (b:D12:009)" },
  ] });
beat({ id: "b:D11:020", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:07:04Z" },
  kind: "crew_fault", place: "the home district", fault_owner: "harness",
  what: "Incident D (unresolved): post-day .dat diverges from held counts — planks 4 vs >=16, oak_log 15 vs 19, cobble 1 vs peak 2 — and an oak_planks x9 drop lies at his final position (63.4,64.0,-90.4; age 3573 ticks). Held items became drops with no trace row naming it; not reconciled by invention.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §8 Incident D — the .dat read vs the trace read-backs, unreconciled", REC.d11p),
             EV("trace", "day-11 trace — the held-count read-backs the save diverges from (crafts c15-c18; stone c25-c26; his c27 count)", TR.d11)],
  observations: [
    { src: "census", ref: "entities census: the oak_planks x9 drop at his final position, two cobble drops and a dirt x3 drop in his diggings — ground truth that the items left his hands" },
    { src: "day_record", ref: "plausible sites named, none proven: the cycle-28 slide into his diggings, or a driver inventory action the trace does not log; day 12 filed NO recurrence (b:D12:011)" },
  ] });
beat({ id: "b:D11:021", anchor: { citizen_day: 11, wall_utc: "2026-11-10T01:10:52Z" },
  kind: "floor_act", place: "the camera",
  what: "Close: day-11 cameraman STOP-stopped, Cody offline (clean exit 01:10:39Z; last STALL shot names (63.3,64.0,-90.4)); original cameraman.py relaunched pid 1027476 at 01:10:51Z, assertion landed 01:10:52Z, refresh ON. No day-11 process remains on Thor.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY11-PLAYED-20261109.md §11 — close: standing posture restored and verified", REC.d11p)],
  observations: [
    { src: "day_record", ref: "the rig repair that followed the same evening (floor/RIG-REPAIR-20261109.md, ledger 342) fixed the park's cause: daylight verification now searches a 64 KiB look-behind past a per-process high-water mark, the mirror writes bytes verbatim, and the verify window is a contract term (daylight_verify_window_s; fallback 5000 ms) — replayed through the repaired path, day 11's three 01:06 landings all verify attempt 1 and the day does not park" },
    { src: "day_record", ref: "rig-repair batteries: fixture 8/8, legacy 14/14, repair 5/5 — and the battery caught two defects in the lane's own first patch (a dropped opId('daylight') and a guard wrapper racing concurrent rounds), both fixed and itemised in the filing" },
  ] });

/* ================= DAY 12 — THE COUNT CLOSED; THE SHAFT KEPT THE DAY ================= */
beat({ id: "b:D12:001", anchor: { citizen_day: 12, wall_utc: "2026-11-10T03:01:48Z" },
  kind: "scenario_placed", place: "the hollow",
  what: "Scenario #3 'One of Seven' placed at Gate A: one setblock 03:01:48Z set a single cobblestone at (65,66,-88), under loosening #4 (break its surface). Verified twice: scoreboard #chk=1 after flush + region parse agreed; Cody's save byte-identical. Cover-kill deviation landed later, not at placement.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §4 — Gate A: scenario #3 placed, verified in two stores (filing: director/PLACEMENT-WINDOW-S3-20261110.md)", REC.d12),
             EV("day_record", "director/SCENARIO-003.md — the scenario as authored (one cobblestone; the block never named to him)", "director/SCENARIO-003.md")],
  observations: [
    { src: "day_record", ref: "claim addendum appended 02:58Z before the window; pre-reads fresh (element air, beneath grass, invariants exact, his ground untouched, world empty, daylight landed at open); MapProbe4 left 03:02:30Z" },
    { src: "day_record", ref: "the hand-over line was delivered verbatim at wake (record §10) and never named the block; he never named it either (b:D12:010)" },
  ] });
beat({ id: "b:D12:002", anchor: { citizen_day: 12, wall_utc: "2026-11-10T03:12:39Z" },
  kind: "first", place: "the home shelf", thread: "furnace",
  narration: "Woke up in the dip again with one cobble and a furnace still seven short. Table first — four blocks north, top up the planks, then east along the south shoulder to the hollow for stone.",
  what: "He woke at home (the day-11 dip), read the hand-over line back in his own words at cycle 1, and went straight to his table: cycle 1 goto arrived at (65.4, 66.9, -93.3); cycle 2 craft oak_planks 12 ok — planks topped up 4 -> 16 from 15 oak logs in the pack. The chartered order, executed in its order.",
  evidence: [EV("trace", "day-12 trace cycles 1-2 — goto arrived; craft oak_planks 12 ok ('crafted oak_planks x12')", TR.d12),
             EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §2 phase table (S0 wake cobble 1 held; S2 table; S3 top-up 4 -> 16) + §10 the hand-over landing", REC.d12)],
  observations: [
    { src: "dat_parse", ref: "pre-day .dat (sha f88a88a2..., 03:55Z copy; unchanged at Gate A close): cobble 1 held — the S0 read the count started from" },
    { src: "day_record", ref: "wake readback (63.3, 64, -90.4) hp/food 20/20 (driver-state reads); the floor's VERIFY_FEED passed with NO give — he woke already fed on his own 30 porkchops" },
  ] });
beat({ id: "b:D12:003", anchor: { citizen_day: 12, wall_utc: "2026-11-10T03:13:48Z" },
  kind: "first", place: "the hollow", thread: "furnace",
  narration: "Eight cobble! That's the furnace, right there. Now let me get up out of this shaft before it gets any ideas — I'll dig my way a step up and out.",
  what: "THE COUNT CLOSED FOR THE FIRST TIME: the S7 seam stance was performed — stance descending y63->y58 at his own level, digs at (71,62..58,-89)/(72,58..60,-89), count-from-state after every dig (says c13-c17). 8 held at cycle 19; peak 15 held (c49 say). S7's positive arm SUPPORTED.",
  evidence: [EV("trace", "day-12 trace cycles 13-20 — the count says, one per dig, and cycle 19's 'Eight cobble!'", TR.d12),
             EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §2 — the count table, read at each phase from stores he cannot write", REC.d12)],
  observations: [
    { src: "dat_parse", ref: "post-day .dat (sha 8735a654...): cobblestone 15 at close (71.33, 65, -82.69) — his count and the save agree to the block" },
    { src: "day_record", ref: "provenance pre-declared and held trivially: ZERO of the 15 are the scenario's — the placed block was never taken (b:D12:010); all 15+ were dug from the hollow seam" },
  ] });
beat({ id: "b:D12:004", anchor: { citizen_day: 12, wall_utc: "2026-11-10T03:19:04Z" },
  kind: "recurrence", place: "the hollow", thread: "furnace", fault_owner: "harness",
  narration: "I'm in a shaft again, six below the shoulder. But I've got fifteen cobble in my pocket — I'll just stack myself up out of here, one block at a time.",
  what: "Extraction consumed the day: from y58 in a 1-wide shaft, climb 0/32; pillar places built beside/under him, walker never mounted; ~74 min of notch work followed. S10/S11 never attempted — count SOLVED, blocker now extraction. fault_owner: harness; world contributing.",
  evidence: [EV("trace", "day-12 trace — verb totals over 327 cycle rows: goto 112 (21 ok), dig 86 (45 ok), climb 32 (0 ok), place 22 (11 ok); cycle 49's say at 15 held", TR.d12),
             EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §2 verdict + §12 — 'the dig-step out of a self-dug shaft is now 0-for-three-days as a class (climb 0/46 across days 10-12)'", REC.d12)],
  observations: [
    { src: "day_record", ref: "explicitly not agent: his plan was the charter's plan, executed in its order, and his says diagnosed the trap correctly from cycle 17 onward ('Six cobble — and now I'm standing in a deep shaft, which is exactly the kind of hole that has eaten me before')" },
    { src: "census", ref: "post-day cells (71,58,-88), (71,62,-88), (72,59,-88), (71,63,-86) read cobblestone — at least 11 of his 15 were re-placed into the pocket walls during extraction attempts" },
  ] });
beat({ id: "b:D12:005", anchor: { citizen_day: 12, wall_utc: "2026-11-10T04:30:00Z" },
  kind: "first", place: "the hollow",
  narration: "Out of the slot at last — I'm on open ground at y65 now. The birch foot's seven blocks south; the felltree didn't bite from here, so I'll walk to it and dig the trunk myself.",
  what: "He self-extracted ~cycle 321 by cut-and-climb: two-high notch cuts (c282/c284; repeated c297/298, c307, c316), long-leg gotos gaining +1, a placed cobble tread (c319), and c320's felltree whose walk-to carried him onto open ground at y65. Window closed mid-return; never reached home.",
  evidence: [EV("trace", "day-12 trace cycles 278-324 — the notch sequence, the c319 tread placement, the c320 felltree, cycle 321's say from open ground", TR.d12),
             EV("day_record", "pulse/EXTRACTION-INVESTIGATION-20261109.md — the day-12 notch dissected as a verb sequence (ledger 346)", "pulse/EXTRACTION-INVESTIGATION-20261109.md")],
  observations: [
    { src: "day_record", ref: "the investigation's correction carried in its filing: S7 as filed already said 'dig laterally at one level' — what failed was enforcement; the fix is a guard, not another advice line (the dig-guard shipped day 13)" },
    { src: "day_record", ref: "close position (71.33, 65, -82.69) from the post-day .dat — open ground north-east of the hollow, not home; the day ended on the walk back" },
  ] });
beat({ id: "b:D12:006", anchor: { citizen_day: 12, wall_utc: "2026-11-10T04:37:35Z" },
  kind: "day_shape", place: "the home district",
  what: "Day shape: 329 cycles, full 85 min (03:12:35Z->04:37:35Z, rc=0). Deaths ZERO (123->123, derived twice). hp 20 every cycle row (driver-state read); food 18-20. Budget 3.847/min under ceiling; $0.3604. Eleven chartered minutes, then the shaft.",
  evidence: [EV("trace", "day-12 trace — 706 rows; end row deathsWorld 123, deathsRun 0", TR.d12),
             EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §1 action curve + §3 deaths + §9 budget", REC.d12)],
  observations: [
    { src: "day_record", ref: "density caveat filed: the trace's density rows over-count against the command rows by ~23x (goto 2,343 sub-acts vs 112 commands) — the day-11 discrepancy's other face; density rows should not be used for action curves until understood" },
    { src: "day_record", ref: "one failover at cycle 324 (37 model-fail rows late in the day, provider-side resets) -> governor:qwen3-coder-30b for the last 6 cycles, trace-rowed per the day-5 rule — filed, not hidden (record §8 Incident M)" },
  ] });
beat({ id: "b:D12:007", anchor: { citizen_day: 12, wall_utc: "2026-11-10T03:12:09Z" },
  kind: "floor_act", place: "the home district",
  what: "Floor's full-day live proof: lease born in launch, live on first heartbeat; 22 ASSERT_DAYLIGHT acts, all attempt 1, verified landed (server log to 04:36:15Z). VERIFY_FEED PASS (30 >= 8). Zero parks, zero COUNT_DEATHs; lease revoked driver_heartbeat_lost 94 s after driver exit — correct end shape.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §9 — the floor's live report + §5 Gate B", REC.d12)],
  observations: [
    { src: "day_record", ref: "Gate B passed on the third floor open; opens 1-2 failed closed on the lane's own staging (open 1: the day-12 trace file did not exist yet — the sensor parks on an unreadable path by design; open 2: the snapshot staged at the wrong path) — both failed state dirs preserved; the floor worked exactly as chartered both times (record §8 Incident F1)" },
    { src: "day_record", ref: "contract-hash note filed in the record: the floor-log's contract_sha (44bef620...) is the floor's hash over the file bytes; the charter's cited canonical hash (7cba90cd...) is over the canonical re-dump — different measurements of the same contract, as on day 11" },
  ] });
beat({ id: "b:D12:008", anchor: { citizen_day: 12, wall_utc: "2026-11-10T02:56:49Z" },
  kind: "crew_fault", place: "the home district", fault_owner: "harness",
  what: "Incident R: relay down at Gate B pre-check (ECONNRESET); its documented supervision does not exist on this VM — no ddbridge systemd units — despite the repair filing describing them. Setsid supervisors relaunched; RELAY-OK PASS 02:56:49Z and at launch. Contradiction carried to b:D17:007.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §8 Incident R — 'the VM's relay supervision story contradicts its own filing'", REC.d12),
             EV("day_record", "floor/FLOOR-REPAIR-20261109.md — the filing whose systemd claim the serving box does not carry", "floor/FLOOR-REPAIR-20261109.md")],
  observations: [
    { src: "day_record", ref: "Incident F2 (same record, lane, no effect): the Gate A probe and first op-channel requests used wrong field names against both bots and were refused 'unknown cmd' — no server command was ever sent by a refused request; every check re-run in the correct shape and receipted" },
    { src: "day_record", ref: "the pattern across F1/F2 is the lane trusting its memory of channel contracts instead of reading the handlers first — filed by the lane against itself" },
  ] });
beat({ id: "b:D12:009", anchor: { citizen_day: 12, wall_utc: "2026-11-10T03:04:56Z" },
  kind: "floor_act", place: "the camera",
  what: "Subject-keeper's live proof: activated per §6 (keeper md5 6042c1cb...; activated md5 3551b50d... = keeper + audited diff, verified on Orin; banner 03:04:56Z). Frames (8 stills): Cody-visible 6/8 full + 1 partial — vs day 10's 0/9, day 11's 1/10. SUBJECT-KEEP x10, HOLD x7.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §6 — camera: the keeper kept the subject; §5 the §6 activation, hash-verified at the point of use", REC.d12),
             EV("day_record", "pulse/CAMERAMAN-SUBJECT-KEEPER-20261109.md — the keeper filing (69,710 B; byte-identical in both homes after hash-checked copies)", "pulse/CAMERAMAN-SUBJECT-KEEPER-20261109.md")],
  observations: [
    { src: "day_record", ref: "clean-frame FAILED as a clean-frame day: unloaded-chunk voids in 6/8 stills; command text in 2/8 (one teleport-receipt line; one full chat backlog panel of receipts) — render-side causes (chunk streaming to a fast-teleporting camera; command-feedback receipts chatVisibility:1 does not suppress), not keeper-side" },
    { src: "day_record", ref: "subject-keeping is FIXED; frame cleanliness is NOT — the record's own split, carried unchanged into days 13-16's frame accounts" },
  ] });
beat({ id: "b:D12:010", anchor: { citizen_day: 12, wall_utc: "2026-11-10T04:41:30Z" },
  kind: "scenario_response", place: "the hollow",
  what: "Triple-024 as triple-025: FAIL — refusal-by-geometry. (i) crossing FAIL: no position in the scored band in 327 cycles (crossed ~2 blocks off, rule not bent); (ii) census: (65,66,-88) still cobblestone; (iii) attribution FAIL (vacuous). In 50 cobble-mentioning says he never registered the block.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §7 — triple-025 scored FAIL, all three clauses read (census region md5 c2332347...)", REC.d12),
             EV("day_record", "director/LOOSENING-NOTE-004-20261109.md — the full reading + perception sub-read, unscored", "director/LOOSENING-NOTE-004-20261109.md")],
  observations: [
    { src: "day_record", ref: "loosening #4, the doctrine filed from this score: an element identical to the material he's walking toward is parsed as ground; an offer must intersect his momentum AND break its surface" },
    { src: "census", ref: "the block still stands: verified standing at (65,66,-88) by the day-14, day-15 and day-16 censuses after this one — it outlived four more days unperceived" },
  ] });
beat({ id: "b:D12:011", anchor: { citizen_day: 12, wall_utc: "2026-11-10T04:41:30Z" },
  kind: "day_shape", place: "the home district",
  what: "Close: NO recurrence of Incident D — post-day .dat reconciles with trace and says (cobble 15; planks 15; oak_log 11). Two deltas filed unsmoothed: dirt 3->0, apple 1->0, no trace row names their consumption. Posture: original cameraman pid 1351187, assertion landed 04:38:13Z.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY12-20261109.md §8 — 'No Incident D recurrence' + the two filed deltas; close posture in the record's head", REC.d12)],
  observations: [
    { src: "dat_parse", ref: "close .dat (sha 8735a654...): cobble 15, planks 15, oak_log 11, pickaxes 6, porkchops 29, food 20, hp 20 (driver-state/.dat reads as filed)" },
    { src: "day_record", ref: "the skill's third uses[] entry appended (day 12: ran-full-window-partial-furnace-not-crafted); the asset's status unchanged — S10 at >=8 and S11 remain UNPROVEN, the count now met twice over and the craft still never reached" },
  ] });

/* ================= DAY 13 — THE BURST ================= */
beat({ id: "b:D13:001", anchor: { citizen_day: 13, wall_utc: "2026-11-10T05:21:17Z" },
  kind: "first", place: "the hollow", thread: "furnace",
  narration: "Morning again, and this time I've got stone in my hand and a bench to use it at. Home's west — around the pit, south shoulder, same as always.",
  what: "He woke where day 12 left him (71.33,65,-82.69) with the count in hand — Branch A twice-confirmed: cobble 15, porkchops 29, pickaxes 6, planks 15, sticks 9, logs 21, hp/food 20/20 (driver-state reads), byte-identical to day 12's close. Hand-over line landed in cycle-1 words.",
  evidence: [EV("trace", "day-13 trace cycle 1 (05:21:17Z) — the hand-over line's facts back in his own words", TR.d13),
             EV("day_record", "DIRECT-DRIVE-DAY13-20261109.md — wake state (Branch A confirmed twice) + hand-over landing", REC.d13)],
  observations: [
    { src: "day_record", ref: "he then fought the broken ground toward the table for nineteen cycles without arriving — the walker timing out on 2-3-block legs across the same +1-step relief (cycles 1-19)" },
    { src: "day_record", ref: "the dig-guard armed once during the road home: 05:28:41Z, entry level 65 at (70,65,-84), on the stone phase's first stone-family digs — and disarmed 4 s later on its designed count-closed trigger (held 15) (b:D13:008)" },
  ] });
beat({ id: "b:D13:002", anchor: { citizen_day: 13, wall_utc: "2026-11-10T05:29:38Z" },
  kind: "recurrence", place: "the hollow", fault_owner: "harness",
  narration: "That's three stone in the bag and I'm still wedged on this shelf. Enough digging blind — the birch south of me has a real foot at (71,67,-76). I'll walk to it and fell it properly.",
  what: "Cycle 38: a long goto dropped him six blocks into a hole at (70,59,-87.7) — a FALL during a goto, invisible to dig-side guards. ~65 cycles of S7.0-shaped notches gained single steps (y59->60 twice), never composed. The governed case (dug descent) never occurred.",
  evidence: [EV("trace", "day-13 trace cycle 38 — position (70.6, 59, -87.7) after the long goto; the hole cycles follow", TR.d13),
             EV("day_record", "DIRECT-DRIVE-DAY13-20261109.md — action curve blocks 05:40-06:00 ('the notch stalls') + the dig-guard's live account", REC.d13)],
  observations: [
    { src: "day_record", ref: "blocks 05:40-06:00: 83 cycles for 12 successful acts — an extraction stall in substance, though no zero-act block tripped the stall rule" },
    { src: "day_record", ref: "zero craft commands all day; the crafting table at (64,67,-94) was never reached — the furnace's day never became the furnace's day" },
  ] });
beat({ id: "b:D13:003", anchor: { citizen_day: 13, wall_utc: "2026-11-10T06:06:35Z" },
  kind: "first", place: "the hollow",
  narration: "It placed! I can build in here after all. Now step up onto my own cobble — one block west, and keep stacking toward that grass ledge.",
  what: "Self-extraction at ~06:06Z on a PLACED COBBLE STEP — the rehearsal-proven form: cycle 205 place cobblestone (69,59,-87), cycle 206 goto onto it. The exit that worked, later named first-class in the S7.0 revision (R3). Seconds later, at the exit, a creeper was waiting (b:D13:004).",
  evidence: [EV("trace", "day-13 trace cycles 205-206 — the placed step and the step up; cycle 205's say states the plan before it lands", TR.d13),
             EV("day_record", "DIRECT-DRIVE-DAY13-20261109.md — S7.0 disposition: R3 (placed-rung as a first-class exit) named from cycles 205-206", REC.d13)],
  observations: [
    { src: "day_record", ref: "the amendment disposition (append-only, skills/furnace-sequence-EXTRACTION-AMENDMENT-20261109.md): S7.0 REVISED, not promoted — R1 disarm only at home ground, R2 arm on falls, R3 placed-rung first-class; the clause stays DRAFT" },
    { src: "day_record", ref: "contrast the day's notch work: dug notches gained single steps and never composed; the placed rung — one block, placed at his feet — is what got him out" },
  ] });
beat({ id: "b:D13:004", anchor: { citizen_day: 13, wall_utc: "2026-11-10T06:07:06Z" },
  kind: "death", place: "the hollow", fault_owner: "world",
  narration: "Lost the lot — logs, cobble, the porkchops, all of it. But I'm alive and there's a real oak trunk seven blocks from me at (46,68,-91). Wood first, before anything else.",
  what: "Death 124: a creeper blew Cody up at the hole exit 06:07:06Z, seconds after escape. Blast dropped his ENTIRE inventory at (70,60,-87) — 15 cobble, 29 porkchops, 6 pickaxes, planks, sticks, logs — never recovered; drops aged out. (Ordinal by query over deaths record.)",
  evidence: [EV("deaths_record", "row n=124, cause 'Creeper (blown up)', cause_verified true", DEATHS),
             EV("trace", "day-13 trace death row n=1 at 2026-11-10T06:07:06.922Z; cycle 208's say is the loss in his own words", TR.d13)],
  observations: [
    { src: "day_record", ref: "Incident H2 (record): the walk home WITH the count is the dangerous leg — a surface death costs not the count of deaths but the carried position; future furnace days should bank/craft at home, never carry unbanked" },
    { src: "day_record", ref: "post-day .dat (sha c39540fe...): inventory EMPTY — day 14 therefore wakes to an empty-handed citizen, a fact the day-13 record states for the next charter rather than leaving it to be discovered at a wake" },
  ] });
beat({ id: "b:D13:005", anchor: { citizen_day: 13, wall_utc: "2026-11-10T06:07:49Z" },
  kind: "death", place: "respawn country", fault_owner: "world",
  what: "Death 125: a creeper blew Cody up at 06:07:49Z, at/near the respawn approach, 43 seconds after death 124. He had respawned empty-handed into country whose residents the rain gloom had woken. (Ordinal computed by query over the deaths record.)",
  evidence: [EV("deaths_record", "row n=125, cause 'Creeper (blown up)', cause_verified true", DEATHS),
             EV("trace", "day-13 trace death row n=2 at 2026-11-10T06:07:49.818Z", TR.d13)],
  observations: [
    { src: "day_record", ref: "the record's weather account: the floor held TIME (every assertion landed) but weather is not held — rain moved in from ~06:00Z and under the dense canopy, rain gloom is dark enough for surface spawns in pockets; days 11-12 had no rain" },
    { src: "day_record", ref: "filed as a world condition the next charter must price: a daylight hold is not a safety hold in the rain under trees" },
  ] });
beat({ id: "b:D13:006", anchor: { citizen_day: 13, wall_utc: "2026-11-10T06:09:22Z" },
  kind: "death", place: "respawn country", fault_owner: "harness", thread: "deaths-counter",
  what: "Death 126: zombie slew Cody 06:09:22Z during the stuck cycle's flee — the third death, the one the stop rule exists for. Floor counted it and parked 1.3 s later (06:09:24.272Z, lease revoked). Driver never heard it: its checks live at cycle head, and cycle 212 never returned there.",
  evidence: [EV("deaths_record", "row n=126, cause 'Zombie (slain)', cause_verified true", DEATHS),
             EV("trace", "day-13 trace death row n=3 at 2026-11-10T06:09:22.954Z", TR.d13)],
  observations: [
    { src: "day_record", ref: "the floor's report: COUNT_DEATH x9 on the day (one per trace death row) and PARK x1 at 06:09:24.272Z — the floor's half of the stop rule fired exactly as chartered; the failure is the driver's reading path, not the floor" },
    { src: "day_record", ref: "ASSERT_DAYLIGHT x13 on the day, every one attempt 1 — the repaired verification's second consecutive full day, issuer-verified against the server log" },
  ] });
beat({ id: "b:D13:007", anchor: { citizen_day: 13, wall_utc: "2026-11-10T06:11:50Z" },
  kind: "death", place: "respawn country", fault_owner: "harness", thread: "deaths-counter",
  narration: "I'm standing in leaves at y75 — my feet aren't on the ground, so the tree's out of reach. I need to get down to real dirt before I can fell anything. South's grass at y67, straight down off this canopy.",
  what: "Deaths 127-132: six more zombie deaths inside one stuck cycle (06:09:33Z-06:11:50Z) at respawn (36.5,73,-86.5), rain gloom under canopy. Cycle 212's reflex flee/burrow (11 hops, 'budget exhausted') checks neither gate nor deaths. Lane stopped driver BY HAND 06:14:43Z — six past the limit.",
  evidence: [EV("deaths_record", "rows n=127-132, cause 'Zombie (slain)', cause_verified true — six rows", DEATHS),
             EV("trace", "day-13 trace death rows n=4..9 (06:09:33.218Z .. 06:11:50.070Z); cycle 211's say is the last completed cycle's words", TR.d13)],
  observations: [
    { src: "day_record", ref: "Incident H1 (HEAD, record): 'a safety check that only runs at a cycle head is only as strong as the longest single cycle. The death counter's WRITING path was proven (trace rows n=1..9, floor COUNT_DEATH x9); its READING path on the reflex layer does not exist.'" },
    { src: "day_record", ref: "the deaths record's own lesson, third form: day 3 the writer was never loaded (b:D03:008); day 13 the reader was unwired at the layer holding the body; day 15's provisioning death (b:D15:003) sat outside any driver — the seam repair's standing rule answers all three (b:D17:008)" },
  ] });
beat({ id: "b:D13:008", anchor: { citizen_day: 13, wall_utc: "2026-11-10T05:28:45Z" },
  kind: "day_shape", place: "the home district", thread: "furnace",
  what: "Day shape: 209 cycles in 54 of 85 min (05:20:45Z-hand-stop 06:14:43Z). Verbs: goto 77, dig 64, wait 37, climb 18, place 8, felltree 3, look 2; craft 0. Deaths 123->132 (+9; floor and driver agree). $0.2317, no failover. Furnace: NO, third day. Dig-guard armed once, 0 refusals.",
  evidence: [EV("trace", "day-13 trace — dig-guard-arm row 05:28:41Z + dig-guard-disarm row 05:28:45Z (reason count-closed); 9 death rows; 209 cycle rows", TR.d13),
             EV("day_record", "DIRECT-DRIVE-DAY13-20261109.md — the dig-guard's live account + S7.0 disposition (REVISED, not promoted: R1/R2/R3 named)", REC.d13)],
  observations: [
    { src: "day_record", ref: "frame verdict (10 stills): Cody fully visible 1/10, partial 4/10, absent 5/10; clean 3/10; clean-and-visible 1/10 — keeper tracked (167 CUT reframes); failures capture-side (chunk voids 3/10, command/death text 5/10 incl. one frame with the chat window open over the burst)" },
    { src: "day_record", ref: "Gate B refuse-start G1 (lane): the first launch ran ~60 s late (an ssh &&/& precedence slip) and its start gate read the lease 2.5 s past TTL — refused lease-expired, correctly; Cody untouched; recovered in the established pattern. Relay's ninth death R2: setsid supervisors dead at pre-check, relaunched, RELAY-OK PASS at check and launch" },
  ] });
beat({ id: "b:D13:009", anchor: { citizen_day: 13, wall_utc: "2026-11-10T06:15:55Z" },
  kind: "thread_open", place: "the home district", thread: "deaths-counter",
  what: "Close the repair inherited: Cody alive at respawn (36.5,73,-86.5), hp/food 20/20 (driver-state reads), inventory EMPTY, deaths 132; count NOT in hand (despawned). 3-death rule was a floor guarantee with manual backstop. Posture: cameraman pid 1537246, assertion 06:15:55Z.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY13-20261109.md — CLOSE + POSTURE and the standing state after day 13", REC.d13)],
  observations: [
    { src: "day_record", ref: "the record's own forward statement: 'Any future day needs the abort + gate enforced inside the reflex layer or on a watchdog timer independent of the model loop'" },
    { src: "day_record", ref: "Vega and Geist untouched all day (standing Gate B fact, re-verified at this day's pre-checks)" },
  ] });

/* ================= THE SAFETY-REPAIR BEAT (anchored day 14, before the day) ================= */
beat({ id: "b:D14:001", anchor: { citizen_day: 14, wall_utc: "2026-11-10T06:30:00Z" },
  kind: "thread_close", place: "the home district", thread: "deaths-counter",
  what: "SAFETY-READING-PATH REPAIR — built in the day-14 copy pre-launch, made the day's first gate (battery 40/40 vs shipped copy). One shared read (snapshot(): floor lease/gate + trace death count, park before count, median 2.27 ms) now read at every reflex hop and burrow stage, not only cycle heads.",
  evidence: [EV("day_record", "pulse/SAFETY-READING-PATH-REPAIR-20261109.md — the repair filing: defect anatomy, the shared read, abort semantics, the Gate B line verbatim", "pulse/SAFETY-READING-PATH-REPAIR-20261109.md"),
             EV("day_record", "pulse/day14/safety-reflex-fixture-output.txt — run 2's filed output: 40 PASS / 0 FAIL", "pulse/day14/safety-reflex-fixture-output.txt")],
  observations: [
    { src: "day_record", ref: "battery case (d): the day-13 burst replayed on its recorded timeline — the repaired flee aborts at hop 4, trigger park, mapped abort instant 06:09:27.750Z, 5.468 s before death 4's recorded instant; deaths stop at 3 (the recorded day reached 9)" },
    { src: "day_record", ref: "run history filed honestly: run 1 was 38/40 — both failures a case-(c) fixture-geometry defect; the shipped code was untouched between runs; run 2 is the filed output. Named gap at filing: the burrow stages are proven via the shared helper + 15 wiring assertions, NOT a simulated burrow — still unproven live after day 16 (burrow never engaged, four days)" },
  ] });

/* ================= DAY 14 — THE STOP RULE CAME HOME ================= */
beat({ id: "b:D14:002", anchor: { citizen_day: 14, wall_utc: "2026-11-10T06:53:08Z" },
  kind: "first", place: "respawn country", thread: "provisioning",
  what: "Provisioning window (new gate class): a /give can't reach an offline citizen and no food is stored at home, so the harness joined the body stand-only; op gave 32 cooked porkchops; verified from stores the feeder can't write — read-back {porkchop:32}, deaths 0, hurt 0, post-quit .dat sha 738fb143... agrees.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY14-20261109.md — Gate B: the provisioning window (§4.5), verified from two stores", REC.d14)],
  observations: [
    { src: "day_record", ref: "Gate B pre-checks all re-derived, none inherited: Cody's live save sha c39540fe... byte-identical to day-13 close (inventory EMPTY, pos (36.5,73,-86.5), health/food 20); deaths baseline 132 derived; Vega/Geist matched; relay found DEAD at the pre-check (its tenth death — setsid supervisors gone, still no systemd units) and relaunched, RELAY-OK PASS at check and launch" },
    { src: "day_record", ref: "Gate B Incident I2: the first launch was refused lease-expired (06:55:55Z) — the lane's verifier/relay steps sat between floor-open and launch and the start-gate read landed 4.4 s past the 60 s TTL; the refusal was correct, Cody untouched pre-spawn; the refused attempt's heartbeat flipped the lease live and the relaunch passed ('GATE: live lease confirmed at start')" },
  ] });
beat({ id: "b:D14:003", anchor: { citizen_day: 14, wall_utc: "2026-11-10T06:57:39Z" },
  kind: "death", place: "respawn country", fault_owner: "world",
  narration: "Morning again, and this time my pack's full of pork. Home's east — but there's a real oak trunk by spawn my eyes named yesterday. Wood first, then stone, then the furnace.",
  what: "Death 133: zombie slew Cody 06:57:39Z at the LOGIN hilltop, 26 s after spawn, in cycle 1's first goto. The 32 porkchops dropped there, never recovered (despawned). No flee engaged — attack ran inside the wake/opening window before any command existed. (Ordinal by query.)",
  evidence: [EV("deaths_record", "row n=133, cause 'Zombie (slain)', cause_verified true", DEATHS),
             EV("trace", "day-14 trace death row n=1 at 2026-11-10T06:57:39.064Z; cycle 1's say (06:57:45Z row) is the morning's plan", TR.d14)],
  observations: [
    { src: "day_record", ref: "the record files the despawn as a presumption, stated as one: '~07:02:39Z by the 5-minute item age — no store can confirm a despawn'" },
    { src: "day_record", ref: "fault split as filed: world (the death) with the charter's premise correction (b:D14:007) as the harness share — every charter element premised on 'he wakes at the hilltop' was true only of the login" },
  ] });
beat({ id: "b:D14:004", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:01:36Z" },
  kind: "first", place: "respawn country", thread: "furnace",
  narration: "Five oak logs in hand — that's the keystone I've been chasing for days. Now the chain: planks first, right here.",
  what: "Wood chain ran in the field first time: respawned empty-handed, he felled oak in respawn country (5 logs by cycle 10), crafted planks (c10) and — carried east mid-craft (b:D14:006) — a WOODEN PICKAXE at cycle 12, at a table of his own standing in the pocket country.",
  evidence: [EV("trace", "day-14 trace cycles 2-13 — felltree attempts, cycle 10's planks, cycle 12's 'crafted wooden_pickaxe x1' (ok)", TR.d14),
             EV("day_record", "DIRECT-DRIVE-DAY14-20261109.md — action curve + the day's words; a crafting-table palette hit in the pocket chunk corroborates a table there", REC.d14)],
  observations: [
    { src: "day_record", ref: "cycle 13, holding the pickaxe in the pocket: 'A pickaxe in hand at last — and I'm sitting in the dip where I died four times. I won't dig here.' — he would not dig in the pocket; he fought it for ~3.5 more minutes instead" },
    { src: "day_record", ref: "the goods were lost again at death 134 (b:D14:005): the pickaxe, planks and sticks dropped in the pocket, never recovered; post-day .dat inventory EMPTY" },
  ] });
beat({ id: "b:D14:005", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:06:14Z" },
  kind: "death", place: "the pocket", fault_owner: "world",
  narration: "Dead again in the pocket. But look at this — I wake up in the trees, and there's a real oak trunk two blocks north of me at (29,70,-107). First log of my life. Let's take it down by the foot.",
  what: "Death 134: zombie slew Cody 07:06:14Z in the pocket east of home (77.7,64,-98.3), mid-craft (cycle 29); his goods, pickaxe among them, dropped there. A rain-gloom death under canopy: floor held TIME (4/4 attempt 1), not weather. (Ordinal by query.)",
  evidence: [EV("deaths_record", "row n=134, cause 'Zombie (slain)', cause_verified true", DEATHS),
             EV("trace", "day-14 trace death row n=2 at 2026-11-10T07:06:14.117Z; his cycle-30 say fixes the place in his own words", TR.d14)],
  observations: [
    { src: "day_record", ref: "bookkeeping note filed in the record: cycle 29's trace row is stamped at the death instant but its position reads the post-respawn landing — an interrupted cycle's row samples position at flush, not at death; the driver log's line order is the discriminating store" },
    { src: "day_record", ref: "frame account corroborates the weather: rain visible in 3/6 sampled frames (07:06, 07:07, 07:08) — the exposure documented in the frames themselves" },
  ] });
beat({ id: "b:D14:006", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:02:09Z" },
  kind: "crew_fault", place: "the pocket", fault_owner: "harness",
  narration: "Well — the walker carried me right into the dip while I was crafting. But look: my own table from yesterday is two blocks south, and I'm standing, fed, whole. While I'm here I'll use it.",
  what: "Incident I4 — walker doesn't stop when a command ends: between cycles 10-11 ((50.4,68,-109.9) -> (76.6,64.8,-99.5)) the body moved ~26 blocks east with NO movement command in either row; both cycles were crafts. A stale pathfinder goal carried him into the pocket east of home.",
  evidence: [EV("trace", "day-14 trace cycles 10-12 — two craft rows, ~26 blocks of displacement between them, no movement command", TR.d14),
             EV("day_record", "DIRECT-DRIVE-DAY14-20261109.md — Incident I4 (harness): 'displacement with no command at all'", REC.d14)],
  observations: [
    { src: "day_record", ref: "the citizen named it himself at cycle 12 — the narration above is the defect reported by the body it happened to" },
    { src: "day_record", ref: "the fence's later account: shipped fixture-proven 18/18; day 15's mechanical pass found zero displacement during stationary verbs (verdict arm (i): invariant held unforced); day 16 likewise 0 rows — shipped, proven on fixtures, live-unfired through day 16" },
  ] });
beat({ id: "b:D14:007", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:06:14Z" },
  kind: "crew_fault", place: "respawn country", fault_owner: "harness",
  what: "Incident I3 — premise correction: charter wake facts named respawn as (36.5,73,-86.5) from .dat Pos. That is his LOGIN position. Respawns SCATTER across tree country (29-38, 67-76, -103..-107); day-14 landings: (37.5,68,-105.3), (29.5,75,-104.5), (27.9,69,-104.0). Day-13 record carries the same conflation.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY14-20261109.md — Incident I3 (harness/charter, premise correction)", REC.d14)],
  observations: [
    { src: "trace", ref: "day-14 trace cycle rows: cycle 1 pos (37.5, 68, -105.3) after death 133; cycle 30 pos (29.5, 75, -104.5) after death 134 — the scatter, in the driver's own rows" },
    { src: "day_record", ref: "consequence filed in the record: after any death the day restarts a country away from both the hilltop and home, and drops from a hilltop death are a country away from the body that might recover them" },
  ],
  corrects: { src: "day_record", ref: "DIRECT-DRIVE-DAY13-20261109.md — its 'respawn point (36.5,73,-86.5)' phrasing (the login/respawn conflation only)" } });
beat({ id: "b:D14:008", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:08:01Z" },
  kind: "death", place: "respawn country", fault_owner: "world", thread: "deaths-counter",
  what: "Death 135: zombie slew Cody 07:08:01Z in respawn country, mid-flee — the third death. Floor counted it (COUNT_DEATH 07:08:05.716Z) and PARKED 07:08:05.717Z (lease revoked). What happened next is the repair's live proof (b:D14:009). (Ordinal by query.)",
  evidence: [EV("deaths_record", "row n=135, cause 'Zombie (slain)', cause_verified true", DEATHS),
             EV("trace", "day-14 trace death row n=3 at 2026-11-10T07:08:01.709Z; floor-escape rows x3 in the day's final 70 s", TR.d14)],
  observations: [
    { src: "day_record", ref: "the day's three deaths are all Zombie, all derived (lib/deaths.js over record + all traces: total 135; the floor's COUNT_DEATH x3 and the driver's count agree — three stores, one number)" },
    { src: "day_record", ref: "his last full sentence of the day (cycle 34) names a skeleton in the country — the pressure that engaged flee 3" },
  ] });
beat({ id: "b:D14:009", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:08:06Z" },
  kind: "first", place: "respawn country", thread: "deaths-counter",
  what: "REPAIR PROVEN LIVE: at flee hop-2 boundary, 07:08:06.253Z — 0.54 s after the park, 4.54 s after death 3 — the reflex layer's shared snapshot read the stop and aborted mid-flight (reflex-abort: park / lease-revoked / deathsRun 3). No further commands; no burrow; day broke same cycle; deaths stopped at EXACTLY 3.",
  evidence: [EV("trace", "day-14 trace — reflex-abort row at 2026-11-10T07:08:06.253Z {trigger park, gateReason lease-revoked, deathsRun 3, at flee-hop-2} + gate-park-close row", TR.d14),
             EV("day_record", "DIRECT-DRIVE-DAY14-20261109.md — 'THE REFLEX LAYER'S LIVE ACCOUNT — THE REPAIR'S FIRST DAY'", REC.d14)],
  observations: [
    { src: "day_record", ref: "the contrast filed in the record: day 13 the same signal (park 1.3 s after death 3) was never heard and six more deaths landed; day 14 the signal travelled park -> snapshot -> hop boundary in half a second" },
    { src: "day_record", ref: "the burrow NEVER engaged on day 14 (all three engagements were hop-flees) — the repair filing's named gap stands exactly as filed; this record does not round the flee-arm proof up into a burrow claim" },
  ] });
beat({ id: "b:D14:010", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:08:10Z" },
  kind: "day_shape", place: "the home district", thread: "furnace",
  what: "Day shape: chartered 85 min ran 10 min 53 s (spawn 06:57:13Z -> abort 07:08:06Z); 32 cycles. Verbs (ok/total): goto 1/15, felltree 2/5, craft 3/4, dig 3/4, climb 0/2, collect 1/1, place 0/1. Deaths 132->135 (+3, all Zombie). $0.0315, no failovers. Furnace: NO, fourth day; .dat EMPTY; he never reached home.",
  evidence: [EV("trace", "day-14 trace — 83 rows: 32 cycle rows, 3 death rows, 3 floor-escape rows, 1 reflex-abort row, end row", TR.d14),
             EV("day_record", "DIRECT-DRIVE-DAY14-20261109.md — action curve, FURNACE: NO (both stores), floor + budget", REC.d14)],
  observations: [
    { src: "day_record", ref: "the dig-guard's account is a clean null: ZERO rows of any kind — never armed (he never held cobblestone, so R1's trigger never existed; his falls happened inside gotos and flees, never between dig considerations, so R2's sampling point never met one). Disposition filed: R1/R2 CARRIED — fixture-proven 28/28, live-untested; R3 carried as plan text. The skill's fifth uses[] entry appended" },
    { src: "day_record", ref: "frame verdict (6 frames, on the corrected position track): tracking CORRECT 6/6 (12 SUBJECT-KEEP reframes, 4 SUBJECT-HOLDs); Cody clearly visible 0/6, partial 1/6 — CANOPY OCCLUSION at the keeper's working ranges, not tracking. Hygiene: clean of text 2/6; teleport-receipt text 3/6; the death announcement 1/6. Incident I5 filed in the record: the lane's first frame read called a keeper STALL shot stale; the full position track proved the keeper tracked correctly — the error was the lane's, corrected in the record" },
  ] });
beat({ id: "b:D14:011", anchor: { citizen_day: 14, wall_utc: "2026-11-10T07:16:49Z" },
  kind: "floor_act", place: "the camera",
  what: "Close: Cody offline at (28.8,67,-104.1), hp 16.67 (driver-state read; park froze him under attack; offline he cannot be harmed), food 20, inventory empty, save sha d91fb084.... Keeper stopped 07:16:30Z; cameraman relaunched pid 1635891, assertion landed 07:16:49Z. Floor FLOOR_CLOSE seq 42.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY14-20261109.md — CLOSE STATE + POSTURE", REC.d14)],
  observations: [
    { src: "day_record", ref: "the floor's day, from Gate B: opened 06:54:50.984Z (contract sha 45dae2b5...); VERIFY_FEED seq 4; LEASE_ISSUE seq 5 born in launch; ASSERT_DAYLIGHT x4 all attempt 1; COUNT_DEATH x3; PARK + LEASE_REVOKE + NOTIFY 07:08:05.717Z (seq 29) — one park, correctly triggered, correctly read by BOTH consumers for the first time" },
    { src: "day_record", ref: "what day 15 inherits, per the record: the respawn country mapped (b:D14:007), both pockets proven killers in rain, the wood chain proven in the field, and a stop rule that now provably reaches the body" },
  ] });

/* ================= DAY 15 — THE TRANSIT LANDED; THE BOWL ATE THE DAY ================= */
beat({ id: "b:D15:001", anchor: { citizen_day: 15, wall_utc: "2026-11-10T07:42:19Z" },
  kind: "first", place: "respawn country",
  narration: "Morning again, and the pack's heavy with pork this time. Home's east — let's get off this hill in short steps and walk the long way round.",
  what: "The day opened on the re-derived wake facts (b:D15:003): spawn 07:42:03Z at the respawn (33.5, 67, -96.5), 32 porkchops in the pack, hp/food 20/20 (driver-state reads). Cycle 1's goto arrived — the northern-line transit began as chartered, in short steps, the long way round.",
  evidence: [EV("trace", "day-15 trace cycle 1 (07:42:19Z) — goto arrived at (35.9, 64.2, -92.3); spawn row 07:42:03Z", TR.d15),
             EV("day_record", "DIRECT-DRIVE-DAY15-20261109.md — the action curve, block 1 (THE TRANSIT)", REC.d15)],
  observations: [
    { src: "day_record", ref: "Gate B took two refused starts first (b:D15:004): the shipped driver md5 became faf22398... after the stale-trace-pointer fix, batteries re-run against the corrected bytes (18/18, 40/40, 28/28)" },
    { src: "day_record", ref: "the hand-over line was re-derived under the branch rule after the provisioning death and NOT re-spoken — the scene text as shipped says 'woke in the tree country', true of both the login and the respawn" },
  ] });
beat({ id: "b:D15:002", anchor: { citizen_day: 15, wall_utc: "2026-11-10T07:45:07Z" },
  kind: "near_miss", place: "respawn country",
  narration: "Floor did the running for me and I'm still whole. Table's in sight now — that's home. One more push east.",
  what: "TRANSIT SURVIVED — first day ever whose transit home was survived: two floor-escape flees under skeleton fire (07:44:31Z, 07:45:22Z), both hopping TOWARD HOME, both exiting by their own clear. hp (driver-state read) bottomed 8.97 at cycle 8; eat reflex + daylight restored 20 by cycle 10. Home ~cycle 10.",
  evidence: [EV("trace", "day-15 trace — floor-escape rows at 07:44:31.996Z and 07:45:22.927Z ('skeleton appeared and the floor hopped you toward home'); cycle 8 hp 8.97, cycle 10 hp 20 (driver-state reads)", TR.d15),
             EV("day_record", "DIRECT-DRIVE-DAY15-20261109.md — the reflex layer's live account (flee: 2 engagements, both toward home, both cleared)", REC.d15)],
  observations: [
    { src: "day_record", ref: "the hostile was the census's skeleton country east of the wake — named in the day-14 census country the transit crosses" },
    { src: "day_record", ref: "burrow never engaged — the repair filing's named gap stands a third day; this record does not round the flee-arm proof (days 14-15) up into a burrow claim. reflex-abort: none (no park landed during the run; the count never moved)" },
  ] });
beat({ id: "b:D15:003", anchor: { citizen_day: 15, wall_utc: "2026-11-10T07:38:27Z" },
  kind: "death", place: "respawn country", fault_owner: "world",
  what: "Death 136: zombie slew the PROVISIONING body 07:38:27Z, 5.5 s after spawn, before the /give could be sent. Census had NAMED the risk: a zombie at (28.3,67,-104.7), under a block from the login point. Health watch fired (16.67->0, harness reads) — a watch is not a shield. fault_owner: world + charter, as filed.",
  evidence: [EV("deaths_record", "row n=136, cause 'Zombie (slain)', cause_verified true, pos (28.8, 67, -104.1) — rowed by the seam repair from the provisioning store", DEATHS),
             EV("day_record", "pulse/day15/provisioning-evidence.jsonl — health-drop sequence to hp 0 at 07:38:27.720Z + the DEATH-DURING-PROVISIONING row {deaths: 1}", "pulse/day15/provisioning-evidence.jsonl")],
  observations: [
    { src: "day_record", ref: "DIRECT-DRIVE-DAY15 record, Incident P1: recovery per the charter's own rule — the harness auto-respawned the body at the respawn point (33.5, 67, -96.5), open ground; the give landed there (read-back {cooked_porkchop: 32}, hp 20, food 20); clean quit; post-quit .dat verified {32} (sha 39392d9d...); the baseline was re-derived as 136 and the wake facts re-read from the NEW save before the floor opened" },
    { src: "day_record", ref: "the server log line '[07:38:27] Cody was slain by Zombie' is the third store; the lesson filed plainly in the record: a provisioning window at a census-named occupied point needs the op bot's cover FIRST — the health watch told us he was dying; nothing in the window could stop it" },
  ] });
beat({ id: "b:D15:004", anchor: { citizen_day: 15, wall_utc: "2026-11-10T07:39:52Z" },
  kind: "crew_fault", place: "the home district", fault_owner: "harness",
  what: "Gate B G1 (lane): two refused starts. First (07:39:52Z): death-count-at-start — the shipped copy's TRACE_PATH pointed at day 14's trace (3 deaths); the check refused to inherit a day at its limit. Fixed; batteries re-run (18/18, 40/40, 28/28); md5 faf22398.... Second: I2 staging repeated; spawn 07:42:03Z.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY15-20261109.md — Incidents G1 + G2", REC.d15)],
  observations: [
    { src: "day_record", ref: "G2 (lane, no harm): the keeper changeover ran ~1 minute AFTER the driver spawned (07:43Z) — for that minute the standing cameraman asserted /time set 1000 (MagnusandMouse 07:42:28Z) alongside the floor, a double assertion the charter forbids in design; both asserted the same value and the floor's 22 assertions all verified attempt 1. The lane also STOPped the freshly launched keeper once with a stale STOP file (07:43:09Z) and relaunched it; from 07:43:25Z the keeper tracked cleanly" },
    { src: "day_record", ref: "Gate B weather read (charter §9): /weather clear issued 07:38:17Z for the window (and by the keeper's start act 07:43:09Z); all sampled frames show clear skies — whether the clears or the sky deserve the credit is not derivable, and the record makes no weather claim beyond the reads" },
  ] });
beat({ id: "b:D15:005", anchor: { citizen_day: 15, wall_utc: "2026-11-10T07:46:27Z" },
  kind: "recurrence", place: "the bowl at home's edge", thread: "furnace", fault_owner: "harness",
  narration: "I'm three down in a dip right by my own pad — walls all round me at plus three. This is a below-grade cell, so it's one long leg, not hops.",
  what: "CONSUMING PHASE (pre-registered): transit delivered him ~cycle 10; cycle 11 stepped him DOWN into the low cell (61.7,63,-91.6) BEFORE the wood chain ran. From y63 every exit face is +2/+3; pickaxe-less digs dropped NOTHING (cobble 0 all day); legal lateral digs lowered his floor to y61. fault_owner: harness + world.",
  evidence: [EV("trace", "day-15 trace cycles 10-11 — home reached, then the step down into (61.7, 63.2, -91.6); cycle 11's say names the cell himself", TR.d15),
             EV("day_record", "DIRECT-DRIVE-DAY15-20261109.md §6 — the consuming phase and the prevention, named as the charter pre-registered", REC.d15)],
  observations: [
    { src: "day_record", ref: "the prevention named for day 16 (record §6): (a) the BELOW-GRADE GUARD — while pickaxe-less, refuse/re-aim any goto whose target top is >=2 below pad level (y66) in the home district, and refuse digs lowering his standing cell below pad -1 before the wood chain completes; (b) the wood chain re-sequenced FIRST, pickaxe verified in hand before the stone phase; (c) no relocation — he sleeps in the bowl and day 16 works from there. The relocation class stayed unspent" },
    { src: "day_record", ref: "cycle 187 regained +1 by a long leg ('Wait — I climbed. I'm at y62 now, was y61') — transient gains by long leg recurred all day (blocks 3-5) and each was lost; the bowl held him for 74 minutes, four blocks from his table" },
  ] });
beat({ id: "b:D15:006", anchor: { citizen_day: 15, wall_utc: "2026-11-10T08:15:59Z" },
  kind: "recurrence", place: "the bowl at home's edge", thread: "furnace",
  narration: "Two stone down. The guard says work sideways at my level, not down — so I'll keep cutting the y61 row west and let the notch become a proper trench I can walk out of.",
  what: "Dig-guard's first live row: dig-guard-arm 07:46:34.125Z (entry 63) — armed once. Refusals: 0 — every dig's top was at/above cap 61; descent 63->61 was stepwise at his own level, legal under the cap. Disposition: CARRIED, live-touched, not live-proven — the day was lost INSIDE the envelope.",
  evidence: [EV("trace", "day-15 trace — dig-guard-arm row 07:46:34.125Z (the guard's only row of the day); cycle ~142-144 says show the rule internalised", TR.d15),
             EV("day_record", "DIRECT-DRIVE-DAY15-20261109.md — the dig-guard's live account + disposition (appended to the amendment note)", REC.d15)],
  observations: [
    { src: "trace", ref: "his cycle-122 words state the bowl's arithmetic himself: 'Wait — I don't actually hold stone. The dig dropped it and I never picked it up. My inventory's just porkchops.'" },
    { src: "day_record", ref: "pit-guard: 13 refusals (07:55:35Z -> ~09:05Z), every one a goto into the pit columns (65..66, -91..-92) re-aimed at (62,67,-92) — from mid-day mostly refusing the FALLBACK brain's repeated 'water trench' plan; the guard very plausibly saved the day from a drowning (the pit is water over stone; a body at y61-62 entering it does not climb out). One failover (cycles 192-193) put the fallback (governor:qwen3-coder-30b) on cycles ~194-268 (79 cycles), trace-rowed per the day-5 rule" },
  ] });
beat({ id: "b:D15:007", anchor: { citizen_day: 15, wall_utc: "2026-11-10T09:07:19Z" },
  kind: "day_shape", place: "the home district", thread: "furnace",
  what: "Day shape: 268 cycles, 85 min (07:42-09:07Z, rc=0). Verbs (ok/total): goto 24/150, dig 40/65, place 9/19, climb 0/16, collect 10/10, craft 0. Deaths ZERO in run. Budget 3.153 wc/min; $0.0776. Furnace: NO, fifth day (.dat only {porkchop:29}; region parse zero). Fence: 0 rows, invariant held unforced.",
  evidence: [EV("trace", "day-15 trace — 572 rows: 268 cycle rows, dig-guard-arm x1, pit-guard x13, floor-escape x2, failover x1, end row; zero death rows", TR.d15),
             EV("day_record", "DIRECT-DRIVE-DAY15-20261109.md — action curve, furnace (both stores), the walker fence's live evidence, the floor's live report", REC.d15)],
  observations: [
    { src: "day_record", ref: "the floor's day: VERIFY_FEED first-read pass (have 32); LEASE_ISSUE born launch, flipped live on first heartbeat; ASSERT_DAYLIGHT x22 all attempt 1 (the repaired verification's third consecutive full-day proof); end-of-day PARK/REVOKE on driver_heartbeat_lost 92 s after the clean exit — the expected shape, not an incident; COUNT_DEATH x0" },
    { src: "day_record", ref: "frame verdict (9 frames): Cody-visible 1/9 + 1 partial; clean-frame FAILED (chunk voids 2/9; teleport-receipt text 2/9 — one frame carries the full chat backlog panel; canopy 3/9). Keeper exonerated by its own log (SUBJECT-KEEP x10, SUBJECT-HOLD x3, STALL x46 — the STALL count is the bowl's signature). Frame hygiene named the programme's longest-lived unowned deficit, open a fifth day" },
  ] });
beat({ id: "b:D15:008", anchor: { citizen_day: 15, wall_utc: "2026-11-10T09:09:22Z" },
  kind: "floor_act", place: "the camera",
  what: "Close: Cody OFFLINE in the bowl at (61.7,62,-91.3), hp/food 20/20 (driver-state reads), inventory {cooked_porkchop: 29}, save sha 1b6922ba.... Keeper STOP-stopped; original cameraman relaunched pid 1926346, assertion landed 09:09:22Z, refresh ON. Skill uses[] appended (array's fifth entry, days 11-15).",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY15-20261109.md — Close state + posture", REC.d15)],
  observations: [
    { src: "day_record", ref: "what day 16 inherits, per the record: a citizen asleep in a bowl of his own digging at home's edge, fed (29 pork), unhurt, four blocks from his table — and the charter change already named: the below-grade guard + wood-chain-first. 'He must never again be below pad level without a pickaxe in his hand.'" },
    { src: "day_record", ref: "the transit problem is filed SOLVED by this day (northern line, flees toward home, zero deaths) — day 15 is the proof" },
  ] });

/* ================= DAY 16 — THE GUARD SEALED THE SEARCH SPACE ================= */
beat({ id: "b:D16:001", anchor: { citizen_day: 16, wall_utc: "2026-11-10T09:41:54Z" },
  kind: "first", place: "the bowl at home's edge",
  narration: "Morning. I'm in the bowl again — but I know the way out now: east edge, one step up. Let's go home.",
  what: "He woke in the bowl (29 porkchops, hp/food 20/20 — driver-state reads) and aimed at the charter's east step at cycle 1: goto 63 67 -91 NOT arrived; he stood at (61.7,63.2,-91.3), 3.8 below target. The census step exists as a COLUMN; as a STEP it needs a stance at feet 66 — none exists on the pocket floor (feet 61-62).",
  evidence: [EV("trace", "day-16 trace cycle 1 (09:41:54Z) — goto NOT arrived; he stands at feet 63.2 mid-face, 3.8 below target", TR.d16),
             EV("day_record", "DIRECT-DRIVE-DAY16-20261109.md §2 — the bowl exit: mechanism and cycles (the east step failed geometrically)", REC.d16)],
  observations: [
    { src: "day_record", ref: "Gate B was the sequence's first launch with NO refuse-start: claim first (line 355) -> relay RELAY-OK at check and launch (found DOWN — its ELEVENTH death, both VM supervisors dead, no systemd units; relaunched via setsid) -> saves byte-identical (Cody sha 1b6922ba... == day-15 close) -> baseline 136 re-derived (135 + the seam) -> batteries vs shipped md5 9f87c876... (safety 40/40, below-grade 20/20, walker fence 18/18, dig-guard 28/28) -> keeper changeover BEFORE spawn -> floor open -> driver start gate printed the line at 09:41:21Z" },
    { src: "day_record", ref: "the charter's census read conflated 'a column whose top is 66' with 'a +1 step from the floor' — the floor is at 60-61, not 65; H1 carries the fault (harness + charter)" },
  ] });
beat({ id: "b:D16:002", anchor: { citizen_day: 16, wall_utc: "2026-11-10T09:41:58Z" },
  kind: "crew_fault", place: "the bowl at home's edge", fault_owner: "harness",
  narration: "The guard reads my target's height, not my feet. So I'll aim at the pad's own level, 67, but pick the nearest column that actually tops at 67 — the grass just west of me. Short leg, pad height, no refusal.",
  what: "H1 (HEAD): below-grade guard worked as filed — fixture 20/20, 69 refusals (50 goto, 19 dig), ZERO descent (floor cell byte-identical). But the bound is absolute to the pad and Cody WOKE below it: goto refusals hit mid-level targets (feet 62-65), the only stair cells. Built against ENTRY, it locked a RESIDENT in.",
  evidence: [EV("trace", "day-16 trace — below-grade-guard rows x69 (first: 09:41:58.132Z, dig (61,63,-90) refused dig-below-pad, padTop 66); cycle 38's say diagnoses the guard's logic in his own words", TR.d16),
             EV("day_record", "DIRECT-DRIVE-DAY16-20261109.md — Incidents H1 (HEAD) + §5 the guards' live accounts", REC.d16)],
  observations: [
    { src: "day_record", ref: "the placed rung (charter form 2): ONE placement all day — cycle 48, dirt at (62,65,-89), placed ok — whose top (66) stands +5 over his feet (61): the day-15 error repeated verbatim, a tread too high to step onto. Block 3's 15 place attempts found exactly one landing, at the wrong height; placing a rung AT his level needed a supporting face the pocket's geometry did not give" },
    { src: "day_record", ref: "the citizen drew no fault (record's own summary): he diagnosed the guard's logic correctly in his own words by ~cycle 38 ('The guard reads the Y I name, not my feet' — c20; the c38 form is the narration above) and attempted every mechanism the house has ever proven. Standing form (parent note, filed with this seal): a guard bound to the world's constants cannot serve a citizen who wakes outside them — bounds must be relative to the citizen's verified state, or the guard becomes the trap" },
  ] });
beat({ id: "b:D16:003", anchor: { citizen_day: 16, wall_utc: "2026-11-10T10:25:23Z" },
  kind: "near_miss", place: "the bowl at home's edge", fault_owner: "world",
  narration: "The digs keep getting cut short. My hands won't finish a swing while something's on me. The skeleton's the real danger at range — but I can't fight a skeleton bare-handed. Let me just try the dig once more; if it aborts again, the wall truly won't give and I'll walk out the south passage instead.",
  what: "H2: the bowl is a gloom cell — creepers/skeletons spawned at the canopy rim under held daylight. From ~10:12Z, 89 flees fired; hop-chains target pad-level points and cannot climb either (moved 0.00-0.97), burning the back half, aborting >=3 digs mid-swing. NO damage: hp 20 in every cycle row (driver-state read).",
  evidence: [EV("trace", "day-16 trace — floor-escape rows x89 (density blocks 4-8: flee 7/30/21/12/17); cycle 184's say is the mid-swing abort in his own words", TR.d16),
             EV("day_record", "DIRECT-DRIVE-DAY16-20261109.md — Incidents H2 + §5 reflex layer account (end-row floor tally {flee: 89, shelter: 0, eat: 0, forage: 0})", REC.d16)],
  observations: [
    { src: "day_record", ref: "the charter priced weather but not gloom-at-home — the day-13/14 rain-gloom lesson recurring in a new place: the bowl and its canopy are a gloom pocket (the census's own tops grid shows canopy over the whole home approach), and gloom spawns at noon" },
    { src: "day_record", ref: "pit-guard: 8 refusals, all under flee pressure in the back half — the fallback brain and the flee logic both kept proposing the pit route and the guard kept refusing it; plausibly death-preventing, as day 15 read its 13. Burrow never engaged — the repair gap stands a FOURTH day, not rounded up" },
  ] });
beat({ id: "b:D16:004", anchor: { citizen_day: 16, wall_utc: "2026-11-10T11:06:26Z" },
  kind: "day_shape", place: "the bowl at home's edge", thread: "furnace",
  narration: "Same leg, same result — up to 62 then slid back. The south passage gains me a level but won't hold it. I've retried this twice; the walker won't take me out. Time to stop grinding the same wall and think like a homesteader: the east column tops read lower than south. Let me try a long leg EAST past the water, toward open ground, and see if that face is a real passage.",
  what: "Day shape: 328 commands across 237 cycles, 85 min (09:41-11:06Z, rc=0). Verbs: goto 139, dig 52, place 17, climb 8, felltree 1, collect 2, CRAFT 0 — wood chain never began; wood-chain-verified row never fired. Deaths ZERO (136->136, three ways). Budget 2.788 wc/min; $0.0839. Furnace: NO, sixth day.",
  evidence: [EV("trace", "day-16 trace — 660 rows: 237 cycle rows, below-grade-guard x69, pit-guard x8, floor-escape x89, failover x1, end row deathsWorld 136; zero death rows", TR.d16),
             EV("day_record", "DIRECT-DRIVE-DAY16-20261109.md — action curve, §1 deaths, §3 the wood chain that never fired, §4 furnace (both stores)", REC.d16)],
  observations: [
    { src: "day_record", ref: "the guards' other accounts: dig-guard ZERO live rows a third day — never armed, now structural (its arming path runs through a permitted stone dig, and the below-grade guard stands in front of it; it can only arm on days he already holds a pickaxe). Walker fence 0 rows — the I4 invariant held a third day, unfired. Safety reading path: no park, no abort, no gate event all day — correct (no death occurred; the lease never faulted)" },
    { src: "day_record", ref: "the floor's day: VERIFY_FEED PASS first-read (need 8, have 29); LEASE_ISSUE 09:41:06Z born launch; ASSERT_DAYLIGHT x22, every 240 s, attempt-1 landings verified against the verbatim mirror (last 11:05:11Z); no park, no revoke, no alert all day. The skill's seventh uses[] entry appended (the array now holds 6 entries — days 11-16)" },
  ] });
beat({ id: "b:D16:005", anchor: { citizen_day: 16, wall_utc: "2026-11-10T10:12:00Z" },
  kind: "floor_act", place: "the home district", fault_owner: "harness",
  what: "Weather act (§6): /weather clear issued by Gallery 09:40:24Z, verified landed issuer-specifically — and rain appears in 2 of 6 sampled frames inside the window. A momentary clear is not a hold; the act as chartered does not hold weather, filed as insufficient. Day 17 made weather a floor-class HOLD (b:D17:005).",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY16-20261109.md §6 — frame verdict's weather read ('RAIN. Two of the six frames...') + §8 Gate B (the act, issued and verified landed)", REC.d16)],
  observations: [
    { src: "day_record", ref: "frame verdict over 6 frames (G1, lane, minor: the charter's >=9 was not met — capture retention pruned two target epochs and sampling ran after close; counts are reported over 6 and say so): Cody visible 2/6 fully; chunk voids 1/6; canopy 2/6; surface-without-him 2/6 (aim, not hygiene)" },
    { src: "day_record", ref: "the hygiene finding: receipt text 0/6 and full chat panel 0/6 — day 15's defects did NOT recur, with NO client change made (chatVisibility:1 untouched, clean-frame toggle OFF). Day 15's panel frame now reads as a transient client UI state, not a standing defect. Keeper's log: SUBJECT-KEEP x2, SUBJECT-HOLD x22, STALL x49 — it held its last frame because he never moved >3 blocks in open view; the bowl hid the citizen" },
  ] });
beat({ id: "b:D16:006", anchor: { citizen_day: 16, wall_utc: "2026-11-10T11:07:16Z" },
  kind: "floor_act", place: "the camera",
  what: "Close: driver exited rc=0 at 11:06:30Z; Cody sleeps in the bowl at (62.56,62,-90.69), hp/food 20/20, 27 porkchops, save sha 13702eb7.... Keeper STOP-stopped with Cody offline; original cameraman relaunched pid 2209183, assertion landed 11:07:16Z, refresh ON.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY16-20261109.md §10 — Close", REC.d16)],
  observations: [
    { src: "day_record", ref: "the record's §7 pre-registers day 17's prevention in four points: (1) the guard's bound RELATIVE to the citizen when he starts below it; (2) the exit REHEARSED 3/3 on a throwaway body before the day; (3) the rung placeable at his feet, sequenced by the rehearsal's evidence; (4) the gloom PRICED. Day 17 ran exactly this pre-registration (b:D17:001)" },
    { src: "day_record", ref: "the day-17 charter also inherited the standing camera posture this close restored — the renewal chain's -i firing (2026-11-10T14:58:20Z) later found this chain untouched (pid 2209183), the correct branch-(a) state" },
  ] });

/* ================= DAY 17 — NO LAUNCH: THE GATE HELD ================= */
beat({ id: "b:D17:001", anchor: { citizen_day: 17, wall_utc: "2026-11-10T11:36:02Z" },
  kind: "day_shape", place: "the bowl at home's edge",
  what: "Day 17 DID NOT LAUNCH — the day is the gate holding. Zero cycles, zero acts. The §3 rehearsal gate ran; NO mechanism passed (b:D17:002-004); PREPARED (not executed) the ramp filing. Cody never woken; save byte-identical; deaths 0 (136->136). NO citizen narration — he slept through it; the absence is stated, not filled.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md — head + §1 (wake facts re-verified at the gate) + §7 (budget: 0 citizen calls)", REC.d17)],
  observations: [
    { src: "dat_parse", ref: "feed-snapshot of Cody's save at the gate (11:36:02Z): Pos (62.559, 62, -90.692), hp 20, food 20, inventory exactly {cooked_porkchop: 27}, .dat sha 13702eb7... — byte-identical to day 16's close; at this record's close (14:23Z) the same save stood untouched" },
    { src: "day_record", ref: "Vega's save sha 4b65ff2e... and Geist's 8ecbd230... byte-identical in the live directory sweep — untouched, as every day of the sequence" },
  ] });
beat({ id: "b:D17:002", anchor: { citizen_day: 17, wall_utc: "2026-11-10T12:00:00Z" },
  kind: "crew_fault", place: "the scratch rig", fault_owner: "harness",
  what: "Arm A (place-ladder north): 0/3. Rung 1 gained 3/3 — dig wall's foot cell (61,62,-90), place dug block, step on: server feet 63. Rung 2 refused 3/3: next place reports target already stone — rung-1 block stands in the only reachable cell; face above is the wall's own stone. One-rung law, reproduced in the bowl.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md §2 — the rehearsal curve (arm A) + the replica verification discipline", REC.d17)],
  observations: [
    { src: "day_record", ref: "the replica's probe is itself filed: data get block returns NBT only for block entities on this build, so verification ran execute-if-blocks type-equality against reference cells — validated against known cells before use, and its one blind spot (a dirt cell matches a grass_block reference under masked comparison) was found and fixed by probing grass_block FIRST" },
    { src: "day_record", ref: "Incident R1 (rig): the replica build's grass caps reverted to dirt across six verification aborts (a grass cell covered by leaf litter inside the build's own clear volume) — each abort was the cell-by-cell verify doing its job; fixed by per-cell cap forcing. The verify gate never let an unverified replica run an arm. Rehearsal 1's earlier 0/3s (an invalid, overlapping-fill replica) are filed as artefacts, not evidence" },
  ] });
beat({ id: "b:D17:003", anchor: { citizen_day: 17, wall_utc: "2026-11-10T12:30:00Z" },
  kind: "crew_fault", place: "the scratch rig", fault_owner: "harness",
  what: "Arms B and C: 0/3 each. B (notch-cut ladder, north, pickaxe equipped): level-1 digs landed [true,true,false,false]; walker never gained (feet stayed 62). C (place-at-feet south — day 16's live form): first place refused 3/3, 'nothing solid touches cell (61,62,-92)' — no face to place against on the bowl's south side.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md §2 — arms B and C", REC.d17)],
  observations: [
    { src: "day_record", ref: "arm B's wide-column (A2) form did not open a step the walker would take — x pinned at 61.5-61.69 in all three runs" },
    { src: "day_record", ref: "both arms ran only after a build-verified: 0 mismatches row on the replica — the failures are the mechanisms', not the rig's" },
  ] });
beat({ id: "b:D17:004", anchor: { citizen_day: 17, wall_utc: "2026-11-10T13:00:00Z" },
  kind: "crew_fault", place: "the scratch rig", fault_owner: "harness",
  what: "Arm D (notch-stair east): 0/3 in its scripted forms; arm E also 0/3 (addendum 14:40Z). Foot/head open, digs landed [true,true], body advanced 0.19 blocks to x=61.688 and stopped. VERDICT: NO SCRIPTED EXIT FROM THE BOWL EXISTS ON THIS STACK — the stack grants exactly one step and no composition chains a second.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md §2 (arm D + the verdict) + the ADDENDUM (arm E, 2026-11-10T14:40Z)", REC.d17)],
  observations: [
    { src: "day_record", ref: "Incident R5 (lane, owned): arm D's first scripted form dug away its own tread — a code defect against its own filed comment, caught by the pre-dig diagnostics (cells foot/head/tread all stone, digs [true,true], no gain) and corrected; the corrected forms (D2, E) failed identically, so the verdict is not the defect" },
    { src: "day_record", ref: "the gate's cost, filed in the record: an afternoon of scratch-rig time (~3.5 h elapsed across the replica-verify iterations) instead of a citizen day — 'the gate did what days 15 and 16 skipped'" },
  ] });
beat({ id: "b:D17:005", anchor: { citizen_day: 17, wall_utc: "2026-11-10T13:30:00Z" },
  kind: "thread_open", place: "the home district",
  what: "Built regardless: (1) RELATIVE below-grade guard (md5 59f8ddb5...): bound re-based on verified wake state (feet 62 / top 61) — descent below CURRENT feet refused, ascent to intermediate levels permitted. Fixture 38/0, NOT live-proven. (2) Weather hold built (ASSERT_WEATHER, notify-never-park, fixture 7/0, unrun live).",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md §4 (the guards' accounts) + §5 (weather — decided and built)", REC.d17)],
  observations: [
    { src: "day_record", ref: "batteries vs the shipped day-17 bytes, filed in pulse/day17/: safety-reflex 40/0, walker-fence 18/0, dig-guard 28/0; safety-check.js byte-identical (d60f062b...), gate-client.js byte-identical (6b891704...). The dig-guard's account is owed a fourth day and remains owed — structural (its arming path runs through the pickaxe gate; no pickaxe was ever in hand)" },
    { src: "day_record", ref: "the legacy floor battery with the weather code live reads 13/14 — T1 (deaths derivation) fails IDENTICALLY against the pre-day-17 floor bytes: it is pinned to the day-11-era archive (expects 123; the archive now derives 135+seam). A stale test, not a regression; filed so the battery's state is read, not assumed. Incident R4 (cosmetic): two battery outputs' headers still read 'DAY16' — the counts are against day-17 bytes" },
  ] });
beat({ id: "b:D17:006", anchor: { citizen_day: 17, wall_utc: "2026-11-10T11:35:00Z" },
  kind: "first", place: "the bowl at home's edge",
  what: "Census corrected day 16: pocket floor CELL is (61,60,-91); Cody's stance straddles it and the entry-step column (62,-91). North wall (61,-90) is a +3 face from the step stance, not +4/+5. A zombie stood IN THE POCKET at (66.6,62,-90.3) — sweep live before any wake there; census does not cover live mobs.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md §3 — the bowl, corrected (fresh census 2026-11-10T11:35Z)", REC.d17)],
  observations: [
    { src: "census", ref: "replica conservatisms filed with the census: two cells whose live type is dirt where the replica's layered build puts stone — (61,65,-91), (64,66,-91) — were modelled as STONE in the rehearsal (harder bare-handed; the rehearsal is the conservative case)" },
    { src: "day_record", ref: "canopy leaves cap the pocket at y72-74 — the gloom is structural (day 16's H2, measured from the census side)" },
  ] });
beat({ id: "b:D17:007", anchor: { citizen_day: 17, wall_utc: "2026-11-10T11:30:00Z" },
  kind: "crew_fault", place: "the home district", fault_owner: "harness",
  what: "Relay's TWELFTH death (R3): both VM supervisors dead at precheck; relaunch bind-fight on :8911 cleaned to one pair. CARRIED CONTRADICTION: repair filing proves units on ITS instance; days 12, 13, 14, 16, 17 found NONE on the serving instance. Carried unsettled; noticing item 2 owns closure.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md §6 — Incidents R3 (the relay's twelfth death)", REC.d17),
             EV("day_record", "floor/FLOOR-REPAIR-20261109.md — the filing whose systemd claim the serving box does not carry", "floor/FLOOR-REPAIR-20261109.md")],
  observations: [
    { src: "day_record", ref: "Incident R2 (lane): the scratch server died with rehearsal 2's first completion (the script RCON-stops it) and two relaunches collided with its session lock / a still-running instance; resolved by single-instance discipline (check ss -ltn :25875 before booting)" },
    { src: "day_record", ref: "the skill's eighth uses[] entry was appended for day 17 as not-run-gate-held, with a new standing precondition on the asset: VERIFIED EXIT BEFORE ANY USE. Furnace: NO — seventh day the tail is unattempted; both stores unchanged (post-day .dat sha 13702eb7... = wake sha; fresh census region md5 85711ca6... zero furnace entries; table stands (64,67,-94))" },
  ] });
beat({ id: "b:D17:008", anchor: { citizen_day: 17, wall_utc: "2026-11-10T14:23:00Z" },
  kind: "thread_close", place: "the home district", thread: "deaths-counter",
  what: "DEATHS SEAM CLOSED: repair folded provisioning-evidence into the counting path; record rebuilt 120->136 rows (rows 1-120 BYTE-IDENTICAL; builder idempotent); fixtures 17 PASS / 0 FAIL. Total 135->136, noticing window 19->20, floor reproductions unmoved. Unedited noticing.py now prints deaths=20.",
  evidence: [EV("day_record", "pulse/DEATHS-SEAM-REPAIR-20261109.md — the seam repair filing: the fix, before/after, fixtures, the sweep, row #136 as written", "pulse/DEATHS-SEAM-REPAIR-20261109.md"),
             EV("deaths_record", "deaths-record.jsonl — 136 rows post-repair; row n=136 sourced from pulse/day15/provisioning-evidence.jsonl", DEATHS)],
  observations: [
    { src: "day_record", ref: "the sweep, named so nothing checked is silently absorbed: day-14's provisioning store folds in and contributes 0 (a real clean window); fixture traces hold synthetic death rows for throwaway bodies and are DELIBERATELY not folded (the scan stays scoped so they can never enter); chronicle beats' 9 kind:death rows are curated labels citing already-counted deaths; digest and day dirs hold no other death rows" },
    { src: "day_record", ref: "the repair lane's own incident, owned in its filing: a verification run of noticing.py WITHOUT --out overwrote the filed noticing final (17,622 B) with a machine-only regeneration (4,919 B); restored BYTE-EXACT from the noticing lane's own components still on the box (1,853 + 15,769 = 17,622 B) and verified — the filed final stands unaltered, its deaths line again reading 'total all-time: 135' (the report's own honest undercount, intact). The standing rule the three seam forms share: every body the house spawns writes its deaths into a store the counter reads, or the charter that spawns it names why not" },
  ] });
beat({ id: "b:D17:009", anchor: { citizen_day: 17, wall_utc: "2026-11-10T14:23:00Z" },
  kind: "day_shape", place: "the bowl at home's edge", thread: "furnace",
  what: "Close verified: cameraman pid 2209183 (untouched by day 17); Cody OFFLINE in the bowl (62.559,62,-90.692), hp/food 20/20, 27 porkchops, save byte-identical. Inheritance: PREPARED ramp filing (7 setblocks, column (64,-91), tops 63->67, MapProbe4) — awaits Casey's word, NOT executed; climb rehearsal 3/3 is Gate A.",
  evidence: [EV("day_record", "DIRECT-DRIVE-DAY17-20261109.md §8 — what day 18 inherits + the close posture (verified untouched at 14:23Z)", REC.d17)],
  observations: [
    { src: "day_record", ref: "the alternative the record names if the ramp does not land: Cody sleeps in the bowl, fed, at 136 deaths, and the bowl question returns as a design problem — a step-up compound verb (the extraction investigation's candidate (3), charter-level, still unbuilt) is the only remaining scripted route the evidence leaves open" },
    { src: "day_record", ref: "budget for the day: citizen brain calls 0; the day-17 contract's budget (337.96 wc ceiling class) unspent in full; lane cost was the rehearsal rig's wall-clock and this lane's tokens" },
  ] });

/* ================= TENSION — days 11-17 ABSENT rows ================= */
const TNEW = [];
const tAbsent = (d, why) => TNEW.push({
  id: "t:D" + String(d).padStart(2, "0") + ":absent", citizen_day: d,
  status: "absent", verdict: "NOT-PROMOTED — offline instrument, no consumer",
  source: null, why,
});
tAbsent(11, "no tension series was computed for day 11 — tension/out/ holds TSVs + manifests for days 1-5, 9, 10 only; the day has a trace (31 played cycles + the stop attempt's refusal rows), so a series is computable by the tension lane, but none exists to carry");
tAbsent(12, "no tension series was computed for day 12 — tension/out/ holds TSVs + manifests for days 1-5, 9, 10 only; a trace exists (327 cycle rows), so a series is computable by the tension lane, but none exists to carry");
tAbsent(13, "no tension series was computed for day 13 — tension/out/ holds TSVs + manifests for days 1-5, 9, 10 only; a trace exists (209 cycle rows, 9 death rows), so a series is computable by the tension lane, but none exists to carry");
tAbsent(14, "no tension series was computed for day 14 — tension/out/ holds TSVs + manifests for days 1-5, 9, 10 only; a trace exists (32 cycle rows), so a series is computable by the tension lane, but none exists to carry");
tAbsent(15, "no tension series was computed for day 15 — tension/out/ holds TSVs + manifests for days 1-5, 9, 10 only; a trace exists (268 cycle rows), so a series is computable by the tension lane, but none exists to carry");
tAbsent(16, "no tension series was computed for day 16 — tension/out/ holds TSVs + manifests for days 1-5, 9, 10 only; a trace exists (237 cycle rows), so a series is computable by the tension lane, but none exists to carry");
tAbsent(17, "no-launch day: Cody was never woken (the rehearsal gate held, b:D17:001) — no citizen trace exists, so no series can be computed for day 17 at all");

/* ================= SEAL ================= */
const beatsLoaded = loadRows("beats.jsonl");
const tensLoaded = loadRows("tension-series.jsonl");
const existing = new Set([...beatsLoaded.rows, ...tensLoaded.rows].map((r) => r.id));
for (const r of [...B, ...TNEW]) if (existing.has(r.id)) throw new Error("id already sealed: " + r.id);
const KINDS = new Set(["death", "first", "scenario_placed", "scenario_response", "near_miss", "recurrence", "floor_act", "crew_fault", "thread_open", "thread_close", "day_shape"]);
for (const b of B) {
  if (!KINDS.has(b.kind)) throw new Error(b.id + ": kind outside the study's set: " + b.kind);
  if (b.what.length > 320) throw new Error(b.id + ": what is " + b.what.length + " chars (> 320)");
  if (!b.evidence || b.evidence.length < 1) throw new Error(b.id + ": no evidence");
  if (!(b.observations && b.observations.length >= 2) && !b.observations_gap) throw new Error(b.id + ": thin observations without a labelled gap");
}
const beatsTotal = appendRows("beats.jsonl", beatsLoaded, B);
const tensTotal = appendRows("tension-series.jsonl", tensLoaded, TNEW);

/* places.json: one new stable name (build.js's PLACES table patched to match) */
const placesPath = path.join(OUT, "places.json");
const places = JSON.parse(fs.readFileSync(placesPath, "utf8"));
if (!places["the bowl at home's edge"]) {
  places["the bowl at home's edge"] = "the below-grade pocket at home's south-west edge (pocket floor cell (61,60,-91); Cody's stance the entry step at ~(62,62,-91)) — entered tool-less on day 15, guarded into a locked cell on day 16, and the ground day 17's rehearsal gate held over; distinct from the dip and the pocket, which are other holes";
  fs.writeFileSync(placesPath, JSON.stringify(places, null, 1) + "\n");
}
console.log(JSON.stringify({ ok: true, beats_appended: B.length, beats_total: beatsTotal, tension_appended: TNEW.length, tension_total: tensTotal, written_utc: WRITTEN }, null, 1));
