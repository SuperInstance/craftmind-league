#!/usr/bin/env node
/*
 * PREVIOUSLY ON — the Narrator reader over the chronicle's three stores.
 *
 * Contract (CHRONICLE-IMPL-20261109.md §6, as commissioned):
 *   - Reads `status: sealed` beats ONLY.
 *   - `fault_owner` is SHOWN wherever a cited beat carries one — a crew
 *     fault is never laundered into a citizen story. The renderer appends
 *     a mechanical fault marker per fault-carrying beat; check.js proves
 *     the marker set equals the store's, line by line.
 *   - Narration is carried VERBATIM. The plan never types the citizen's
 *     words: it places a token (⟦NARR:b:…⟧) and the renderer substitutes
 *     the beat row's `narration` bytes. check.js byte-compares.
 *   - `aired` is DERIVED FROM THE VIEWING LOG ON READ, never stored:
 *     a viewing row confers `aired` on its anchor day iff it has a
 *     non-empty `watched[]` AND at least one landed/bored testimony
 *     entry. (w:STD:001 confers nothing — it watched nothing; w:ARM:001
 *     confers nothing — exposure only, no testimony exists.)
 *   - Tension is NOT presented. The series is NOT-PROMOTED; the default
 *     is honoured in full — no `t:` citation appears in any edition, no
 *     day_shape beat is cited (apparatus meta-talk; the chronicle §5
 *     precedent), and the word itself appears only in the meta lines,
 *     carrying its gate label.
 *   - Editions compile ONLY from store rows. No Director filing, no day
 *     record, no triple is read. Scenario #2 has no beat in the stores,
 *     so it cannot leak; check.js additionally scans both editions
 *     against a denylist of scenario-#2 markers.
 *
 * Deterministic: same stores + same plan => same bytes. The plan (the
 * curated line selections and prose) lives in this file; curation is a
 * human act, rendering and checking are the deterministic parts — the
 * same split as the chronicle's build.js / compile.js.
 *
 * Run:  node generate.js          (writes editions/ + manifest.json)
 *       node check.js             (independent verification)
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = __dirname;
const CH = path.join(DIR, "..");
const OUT = path.join(DIR, "editions");
const VERSION = "previously-on-1.0.0";

const load = (n) =>
  fs.readFileSync(path.join(CH, n), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const beats = load("beats.jsonl");
const views = load("viewings.jsonl");
const B = new Map(beats.map((r) => [r.id, r]));
const W = new Map(views.map((r) => [r.id, r]));
const shaFile = (n) =>
  crypto.createHash("sha256").update(fs.readFileSync(path.join(CH, n))).digest("hex");

/* ---- aired, derived on read (never stored) ---- */
function conferredDays() {
  const m = new Map(); // citizen_day -> [viewing ids]
  for (const w of views) {
    const testified = (w.landed || []).length + (w.bored || []).length > 0;
    if ((w.watched || []).length > 0 && testified) {
      const d = w.anchor.citizen_day;
      if (!m.has(d)) m.set(d, []);
      m.get(d).push(w.id);
    }
  }
  return m;
}

/* ---- scenario-#2 denylist (mechanical leak guard for edition one) ---- */
const DENY = [
  "triple-021", "scenario-002", "scenario #2", "SCENARIO-002", "tread",
  "setblock", "axis=z", "prediction", "loosening", "shoulder step",
  "(65, 66", "(65,66", "65 66 -88",
];

/* ================= THE PLAN =================
 * Line kinds:
 *   story     — prose compiled from cited beats; narration tokens and
 *               fault markers are rendered mechanically.
 *   testimony — a watcher's words, verbatim from a viewing row.
 * Meta lines (titles, compile notes) are not claims and carry no
 * citations; they are declared as `meta` strings on the edition.
 * Tokens inside `text`:
 *   ⟦NARR:b:ID⟧            ->  His words: "<beat narration, verbatim>"
 *   ⟦SAID:w:ID:landed:0⟧   ->  "<viewing landed/bored words, verbatim>"
 */
const PLAN = [
  {
    file: "edition-one-going-into-day-11.md",
    title: "PREVIOUSLY ON — Cody, going into day 11",
    audience: "the day-11 watch (Casey, the parent, the day lane)",
    range: "sealed beats, pre-series through day 10; weight on days 9-10",
    meta: [
      "Compiled deterministically from the chronicle's sealed beats and viewing log (previously-on/generate.js). His words are verbatim; faults are shown where the beats carry them; aired marks are derived from the viewing log on read, never stored.",
      "The tension series is not presented (verdict: NOT-PROMOTED — an offline instrument with no consumer).",
    ],
    lines: [
      { kind: "story", beats: ["b:D09:001"],
        text: "Day 9 began with the crew's hands, declared in the day's charter: 32 porkchops given, and Cody carried to the pad above his own pit. It was the crew's act, not his walking." },
      { kind: "story", beats: ["b:D09:002"],
        text: "On the surface he moved at once — the first tree of the surface era fell inside a block of 27 acts in seven minutes, the densest stretch of the whole direct-drive line." },
      { kind: "story", beats: ["b:D09:003"],
        text: "His craft chain broke on somebody else's work: his three logs vanished into a phantom plank requirement keyed to another lane's building on the same op name, and the pickaxe was refused three times at the stick step. He diagnosed the interference aloud." },
      { kind: "story", beats: ["b:D09:004"],
        text: "Then the day took its three. The first came in his own pit, mid-dig, four minutes after a return goto dropped him into it. The cause is unrecorded in every store, and it is filed as unknown — not guessed." },
      { kind: "story", beats: ["b:D09:005", "b:D09:006", "b:D09:008"],
        text: "The other two came at world spawn, nine seconds apart, in a night the crew's own camera chain had let fall — the daylight hold had not landed since 19:09:52Z, and the day's camera account does not survive its own recovery addendum." },
      { kind: "story", beats: ["b:D09:007", "b:D03:008"],
        text: "The repaired deaths counter stopped the day at three, exactly as wired — the first live proof that day 3's failure, a counter reading a file its writer never wrote to, did not recur." },
      { kind: "story", beats: ["b:D10:004"], aired: ["w:D10:001"],
        text: "Day 10 was the first clean day since day 4, and the first ever with the survival floor silent: 303 cycles, 303 commands, no stall block anywhere, health and food at 20/20 at every check, no deaths." },
      { kind: "story", beats: ["b:D10:003"], aired: ["w:D10:001"],
        text: "He harvested like a citizen: 18 oak logs and 10 birch logs in hand at close, five wooden pickaxes crafted as they wore, plank steps built in the pen hollow. ⟦NARR:b:D10:003⟧" },
      { kind: "story", beats: ["b:D10:001", "b:D10:002"], aired: ["w:D10:001"],
        text: "The Director had built him a set before the day: a roofless barn with a three-block gap in its top course, a fold stocked with three animals, a sign. His answer was refusal by inaction — in 303 narration lines he never named the barn once, never entered the district, came no closer than 20.7 blocks. ⟦NARR:b:D10:002⟧" },
      { kind: "story", beats: ["b:D10:009"],
        text: "After the day, the census found all three stocked animals alive — and every one out of the fold: the pigs some 24 and 33 blocks off, the chicken 115 blocks away, out of the district entirely. They are residents now, not props." },
      { kind: "story", beats: ["b:D10:005"], aired: ["w:D10:001"],
        text: "The day's tax was the walking itself: his goto arrived 49 times in 136, his climb never once in 13. Three traps in the ground — the spawn bowl, the pen hollow, a pocket lip — each held him for tens of cycles, and he got himself out of all three." },
      { kind: "story", beats: ["b:D04:005", "b:D05:001"],
        text: "The pit at home is his own digging from day 4, and on day 5 it held him for a whole day: 446 cycles, 1.4 blocks of travel, still inside it at close. ⟦NARR:b:D05:001⟧" },
      { kind: "story", beats: ["b:D10:005"], aired: ["w:D10:001"],
        text: "On day 10 he skirted that pit's rim twice, knowingly, without the pit-guard ever firing. ⟦NARR:b:D10:005⟧" },
      { kind: "story", beats: ["b:D02:003"],
        text: "Under everything runs the furnace. He named it on day 2, at the pen fence, in the same breath as sparing his breeding pair — and the thread has been open ever since. ⟦NARR:b:D02:003⟧" },
      { kind: "story", beats: ["b:D10:006"], aired: ["w:D10:001"],
        text: "It is still unbuilt, blocked six different ways. Day 10's stone hunt closed at one cobble held of the eight a furnace needs: 14 stone dug in the final 40 cycles, 13 of the drops never reached his hands — the trace corrects the day record's kinder count." },
      { kind: "story", beats: ["b:D10:007"],
        text: "The crew's own failure rides in the open: on day 10 the day's guard never ran. Its relaunch died with the lane's own restart, and the lane read a dead watcher's last writes as a living one. The clean day happened in spite of its watch, not because of it." },
      { kind: "story", beats: ["b:D10:004", "b:D10:003", "b:D10:006", "b:D10:002"],
        text: "So he goes into day 11 fed and whole, closed in the hollow south of home with the harvest in hand, the furnace still wanting seven more cobble — and the road home, along the shoulder, past the pen gate to his own table, the pit on his west hand, still his to walk." },
      { kind: "testimony", views: ["w:D09:001"],
        text: "The watcher, on day 9: ⟦SAID:w:D09:001:bored:0⟧" },
      { kind: "testimony", views: ["w:D10:001"],
        text: "The watcher, on day 10 — the first positive screen verdict of the programme: ⟦SAID:w:D10:001:landed:0⟧" },
    ],
  },
  {
    file: "edition-two-full-series.md",
    title: "PREVIOUSLY ON — Cody: the story so far",
    audience: "a cold reader meeting Cody for the first time",
    range: "sealed beats, pre-series through day 10, in story order",
    meta: [
      "Compiled deterministically from the chronicle's sealed beats and viewing log (previously-on/generate.js). His words are verbatim; faults are shown where the beats carry them; aired is derived from the viewing log on read, never stored.",
      "The tension series is not presented (verdict: NOT-PROMOTED — an offline instrument with no consumer).",
    ],
    lines: [
      { kind: "testimony", views: ["w:STD:001"],
        text: "The standard, set by the programme's own watcher: ⟦SAID:w:STD:001:landed:0⟧" },
      { kind: "story", beats: ["b:PRE:001"],
        text: "Before the counted days, the old tracker had already counted 114 deaths. Their causes were never recorded, and this chronicle does not invent them." },
      { kind: "story", beats: ["b:PRE:002", "b:PRE:003"],
        text: "Deaths 115 and 116 were the crew's doing: his body was launched with no mind attached to it, and a creeper, then a zombie nine seconds later, killed an unowned body." },
      { kind: "story", beats: ["b:D01:001", "b:D01:002"],
        text: "Day 1: a mind behind a simple set of commands played at once — out of the dip three times, home, a crafting table placed at his anchor, a wooden pickaxe made." },
      { kind: "story", beats: ["b:D01:003"],
        text: "Interrupted on the road home, he argued with the detour once, then took it as information and re-planned. ⟦NARR:b:D01:003⟧" },
      { kind: "story", beats: ["b:D01:004"],
        text: "He also never ate. Food fell from 4 to 0, nothing edible was ever held, and only the hunger floor on this build kept the day deathless." },
      { kind: "story", beats: ["b:D01:005"],
        text: "The day's close was misread — a driver still running when its state file was read — and the next launch inherited a hungrier body than anyone believed." },
      { kind: "story", beats: ["b:D02:001", "b:D02:002"],
        text: "Day 2: the crew staged a fenced pen and a wheat patch on his home ground, and he ate for the first time in the direct-drive era — a pig at the fence, then a chicken. Food peaked at 5, and drained away again." },
      { kind: "story", beats: ["b:D02:003"],
        text: "At the fence he spared his breeding pair in his own words, and named the thing he wanted next: a furnace. That thread is still open. ⟦NARR:b:D02:003⟧" },
      { kind: "story", beats: ["b:D02:004"],
        text: "The pen did not survive its citizen: gate moved, fence dug and patched with his own cobble, and by close every staged animal had dispersed through the breach." },
      { kind: "story", beats: ["b:D03:001", "b:D03:002"],
        text: "Day 3: he walked straight to the wheat patch and the pen from memory, with no searching, and by mid-day the eating held — food at 15 against a goal of 14, a peak of 18." },
      { kind: "story", beats: ["b:D03:003"],
        text: "The first ripe wheat died in the hand-off: dug at the plant, never collected, despawned unheld. A later collect brought the day's whole harvest — one wheat, two seeds." },
      { kind: "story", beats: ["b:D03:004", "b:D03:005", "b:D03:006", "b:D03:007"],
        text: "Then the pocket took him four times in under two minutes — phantom, skeleton, spider, spider — each respawn landing him back among the standing residents with no kit. He left the game at the fourth death, and his day-3 kit lies unrecovered." },
      { kind: "story", beats: ["b:D03:008"],
        text: "The chartered stop at three deaths never came. The counter read a file its writer component never wrote to, so the day ran to four behind a safety instrument that was a decoration." },
      { kind: "story", beats: ["b:D03:009"],
        text: "The pen he came home to had stood open at two corners since it was built — a staging defect, owned by the crew." },
      { kind: "story", beats: ["b:D04:001"],
        text: "Day 4 opened with the counter repaired before the wake — the driver now counts death rows in its own trace — and dry-proven 12 of 12." },
      { kind: "story", beats: ["b:D04:002"],
        text: "He woke in respawn country with empty hands and a full belly, and walked home from recollection across country this body had never walked. ⟦NARR:b:D04:002⟧" },
      { kind: "story", beats: ["b:D04:003"],
        text: "No deaths. The survival floor fired ten times — spiders at the wake country and around home, one creeper at the pit — and every incident ended clear." },
      { kind: "story", beats: ["b:D04:004"],
        text: "He harvested the wheat at the plant cell, not the trench, and later diagnosed the empty cells himself. ⟦NARR:b:D04:004⟧" },
      { kind: "story", beats: ["b:D04:005"],
        text: "The day's second half went into a stone pit he dug beside his own pad, hunting furnace stone, improvising dirt stairs against walls two high." },
      { kind: "story", beats: ["b:D04:006"],
        text: "And the furnace stayed blocked at its first step: his tree attempts aimed at crowns, no log was ever held, and not one craft command was issued all day." },
      { kind: "story", beats: ["b:D05:001"],
        text: "Day 5 he spent where day 4 left him: 446 cycles in the pit for 1.4 blocks of travel, 52 climb attempts, and the one climb marked a success was his feet already standing at the reported height. ⟦NARR:b:D05:001⟧" },
      { kind: "story", beats: ["b:D05:002"],
        text: "His reporting stayed honest even when his legs could not: 57 verdicts of not-arrived, and not one false arrival all day." },
      { kind: "story", beats: ["b:D05:003"],
        text: "Starving in place, food gone to zero under him, he ended the day alive only because starvation floors on this difficulty." },
      { kind: "story", beats: ["b:D05:004"],
        text: "Fifty-nine of the day's cycles quietly ran on a fallback brain after the main route failed — a charter breach, filed late by the lane itself." },
      { kind: "story", beats: ["b:D06:001"],
        text: "Day 6 there was no day: the wake feed failed three different ways across three launches, and the lane stopped by its own stop discipline before he ever reached a first command." },
      { kind: "story", beats: ["b:D06:002"],
        text: "The day-6 record is titled like a triumph. Its own body refutes the title. Read the body, not the title." },
      { kind: "story", beats: ["b:D07:001", "b:D07:002"],
        text: "Day 7, the feeding problem that had run since day 1 closed for good — the delivery channel proven on throwaway bodies first, three for three, then landed on his: 32 porkchops, eaten to food 20, health regenerating, read back from his own body." },
      { kind: "story", beats: ["b:D07:003", "b:D07:004"],
        text: "The exit was spent on a target the geometry broke before it began, and the day stopped at the wake — fed and whole in the pit for the first time since the pit sequence began. ⟦NARR:b:D07:003⟧" },
      { kind: "story", beats: ["b:D08:001"],
        text: "Day 8 he was not woken at all. The crew rehearsed the pit's exit on a replica first, found the real pad is a flat wall four high that no scripted exit on this stack can climb, and let him sleep." },
      { kind: "story", beats: ["b:D09:001", "b:D09:002"],
        text: "Day 9, the crew carried him to the surface by hand, declared in the charter — and he was playing within minutes: the first tree of the surface era, in the densest seven minutes of the line." },
      { kind: "story", beats: ["b:D09:003"],
        text: "Even his crafting was interfered with — another lane's building reached his three logs through a shared op name, the pickaxe was refused three times, and he diagnosed it aloud." },
      { kind: "story", beats: ["b:D09:004", "b:D09:005", "b:D09:006", "b:D09:007"],
        text: "Three deaths followed — one in his own pit with its cause unrecorded, two to a zombie at world spawn in an unheld night — and the repaired counter stopped the day at three, exactly as wired." },
      { kind: "story", beats: ["b:D09:008"],
        text: "The day's camera story did not survive its own addendum: the relaunched client was a third session on the op name, and the citizen camera's save never left Spectator." },
      { kind: "story", beats: ["b:D10:004", "b:D10:003"], aired: ["w:D10:001"],
        text: "Day 10: the first clean day. 303 cycles, no stalls, no floor rescues, no deaths — and a harvest in hand: 18 oak and 10 birch logs, five wooden pickaxes made as they wore. ⟦NARR:b:D10:003⟧" },
      { kind: "story", beats: ["b:D10:001", "b:D10:002"], aired: ["w:D10:001"],
        text: "The Director had built him a barn with a gap in its roof and a stocked fold. He never mentioned it once, never entered the district, and at the pen gate turned for his own table and his own list. ⟦NARR:b:D10:002⟧" },
      { kind: "story", beats: ["b:D10:005"], aired: ["w:D10:001"],
        text: "His walking still taxes him — the goto arriving about a third of the time, the climb never — yet three traps in the ground each let him go by his own efforts, and he skirted his own pit twice, knowingly. ⟦NARR:b:D10:005⟧" },
      { kind: "story", beats: ["b:D10:006"], aired: ["w:D10:001"],
        text: "The furnace still waits: one cobble held of the eight it needs, and thirteen of the fourteen stones he dug on the last hunt never reached his hands." },
      { kind: "story", beats: ["b:D10:007"],
        text: "And the crew's watch failed silently again — the day's guard never ran, and its absence was misread as presence. The clean day happened in spite of its watchers." },
      { kind: "story", beats: [], views: ["w:PRE:001", "w:D09:001", "w:D10:001"], airedClaim: [3, 9, 10],
        text: "Of all these days, a human watcher has testified to three — day 3, day 9, and day 10. The rest are sealed, but not yet aired: no viewing-log row says a human saw them." },
    ],
  },
  {
    file: "edition-three-going-into-day-18.md",
    title: "PREVIOUSLY ON — Cody, going into day 18",
    audience: "the day-18 watch (Casey, the parent, the day lane)",
    range: "sealed beats, days 11-17; the stop, the count, the burst, the repair, the transit, and the bowl",
    meta: [
      "Compiled deterministically from the chronicle's sealed beats and viewing log (previously-on/generate.js). His words are verbatim; faults are shown where the beats carry them; aired marks are derived from the viewing log on read, never stored.",
      "The tension series is not presented (verdict: NOT-PROMOTED — an offline instrument with no consumer).",
      "No human watcher has testified to any of these seven days: the viewing log confers aired on days 3, 9 and 10 only, so this edition carries no aired marks. The owed human arm stays owed.",
    ],
    lines: [
      { kind: "story", beats: ["b:D11:001", "b:D11:003"],
        text: "Day 11's first attempt never started. The floor — the supervisor that counts deaths, holds daylight and leases the driver its day — parked the lease 95 seconds after issuing it, because its lost-heartbeat clock ran from the issue, not from any driver's first heartbeat. A second lease died the same way. Both starts were refused, correctly: no command ever ran under a dead lease." },
      { kind: "story", beats: ["b:D11:006", "b:D11:007"],
        text: "The posture was restored first, then the floor was repaired without touching its constitution: the heartbeat clock now starts at the first heartbeat or the launch window's end, whichever comes first; releases carry sequence numbers a standing park cannot be cleared by; and the gate's refusals now say which kind — absent, expired, revoked. The proof: repair battery 5 of 5, the legacy battery 14 of 14, the wiring battery 4 of 4." },
      { kind: "story", beats: ["b:D11:008"],
        text: "Relaunched, the day opened properly: he woke in the hollow, read the Director's hand-over line back in his own words at the first cycle, and walked out under his own power — no crew hands carried him. ⟦NARR:b:D11:008⟧" },
      { kind: "story", beats: ["b:D11:010", "b:D11:015"],
        text: "The Director's one element — a single log laid across his road home — he read as a resource from inside the hollow, five minutes before he ever stood on the road, and took it as material. The forecast filed before the day said the element would survive his crossing; it failed. The doctrine the day forced: an element made of a material he wants is an offer, not scenery." },
      { kind: "story", beats: ["b:D11:012", "b:D11:013"],
        text: "At his own table he ran the furnace chain in his own order: planks, sticks, a stone pickaxe refused on an ingredient he did not hold, a wooden pickaxe made instead. Then stone at home, dug from standing — not the chartered stance — and held cobble peaked at two of the eight a furnace needs. ⟦NARR:b:D11:013⟧" },
      { kind: "story", beats: ["b:D11:014", "b:D11:017"],
        text: "The floor ended the played day at seven and a half minutes: a daylight round the floor could not verify inside its window had in fact landed — all three commands are in the server log — and the driver obeyed the park at the next cycle head and left clean. He was never in danger; the day was cut by arithmetic, not by the world." },
      { kind: "story", beats: ["b:D12:002"],
        text: "Day 12 he woke at home and executed the chartered order in its order: table first, planks topped up from the logs in his pack, then east for stone. ⟦NARR:b:D12:002⟧" },
      { kind: "story", beats: ["b:D12:003"],
        text: "Then the thing two days of trying had not produced: THE COUNT CLOSED. Working the seam at his own level, counting from state after every dig, he held eight cobble at cycle 19 — the furnace's price, in hand — and peaked at fifteen. ⟦NARR:b:D12:003⟧" },
      { kind: "story", beats: ["b:D12:004", "b:D12:005"],
        text: "What ate the day was the way back up: 74 minutes in the shaft the digging made, the climb verb failing every one of its 32 tries, until he improvised his own exit — notch cuts, long legs, a placed cobble as a step — and walked out onto open ground as the window closed. The count was solved; the blocker had moved to extraction." },
      { kind: "story", beats: ["b:D12:010"],
        text: "The Director's second offer — one cobble of the furnace's own currency, standing on his road — he never registered at all: he crossed two blocks from it, outside the scored band, and in fifty says about cobble he never mentioned the block. An offer identical to what he is walking toward reads as ground. It stands there still." },
      { kind: "story", beats: ["b:D12:007", "b:D12:009"],
        text: "Around him, the machinery had its first fully proven day: the floor's 22 daylight assertions all landed first try, and the position-driven camera kept him in frame in six of eight stills — against none of nine on day 10. Zero deaths, the full 85 minutes, under budget." },
      { kind: "story", beats: ["b:D13:001", "b:D13:002"],
        text: "Day 13 he woke holding the count — fifteen cobble, the kit verified item for item against day 12's close. Nineteen cycles in, a long walk dropped him six blocks through a hole at the roadside: a fall, which no dig-side guard watches for. Sixty-five cycles of notches bought single steps that never composed into an exit." },
      { kind: "story", beats: ["b:D13:003", "b:D13:004"],
        text: "He got out the way rehearsal said a body could: a cobble placed as a step, and a step up onto it. Seconds later, at the exit, a creeper was waiting. The blast dropped everything — the fifteen cobble, 29 porkchops, six pickaxes, all of it — in hole country, and it was never recovered. ⟦NARR:b:D13:004⟧" },
      { kind: "story", beats: ["b:D13:005", "b:D13:006", "b:D13:007"],
        text: "What followed is the line's worst passage. Respawned empty-handed into rain gloom under canopy, he died again in 43 seconds, and a third time minutes later. The floor counted that third death and parked within two seconds — and the driver never heard it: its safety checks live at the head of a cycle, and the cycle he was in sat inside an escape reflex that checks neither the gate nor the count. Six more deaths landed inside that one stuck cycle before the lane stopped the driver by hand — nine in the day, six past the limit the stop rule exists to enforce." },
      { kind: "story", beats: ["b:D14:001"],
        text: "Before any fourteenth day could run, the repair: safety's shortest path to the body. One shared snapshot — the floor's lease state and the trace's death count — is now read at every escape hop and every burrow stage, not only where the cycle begins. The battery ran 40 of 40 against the shipped copy, including a replay of day 13's own burst: replayed, the deaths stop at three." },
      { kind: "story", beats: ["b:D14:003", "b:D14:004"],
        text: "Day 14 opened with a death before the day began: a zombie at the login hilltop, 26 seconds after spawn, in the first walk's opening seconds. The porkchops he had just been given dropped there and were never recovered. He respawned in tree country, felled oak, and had a wooden pickaxe in hand by cycle 12 — the wood chain run in the field, first time. ⟦NARR:b:D14:004⟧" },
      { kind: "story", beats: ["b:D14:006", "b:D14:005"],
        text: "Then a defect with no malice in it: the walker does not stop when a command ends. Between two crafting cycles it carried him some 26 blocks east, into the pocket past home, on a goal nobody had re-issued — and there, mid-craft in the rain gloom, a zombie killed him again. ⟦NARR:b:D14:006⟧" },
      { kind: "story", beats: ["b:D14:008", "b:D14:009"],
        text: "The third death came mid-escape in the respawn country — and this time the repair answered. Half a second after the floor's park, at an escape-hop boundary four and a half seconds after the death, the reflex read the stop and aborted mid-flight: no further commands, no burrow, the day broke in the same cycle. Deaths stopped at exactly three. The failure that cost day 13 six lives is closed, proven live." },
      { kind: "story", beats: ["b:D15:003", "b:D15:001"],
        text: "Day 15's setup cost a life before the day existed: the provisioning body — standing defenceless while the crew stocked it — was killed by a zombie the survey had already named, five and a half seconds after spawn, before the food could be sent. A watch is not a shield. The day itself then opened on re-read facts, 32 porkchops in the pack, and the long northern walk home began." },
      { kind: "story", beats: ["b:D15:002"],
        text: "The transit was survived — the first day ever whose walk home was. Two escapes under skeleton fire both hopped toward home and cleared by their own word; his health bottomed near nine, the eating reflex and daylight brought it back, and he was home by about cycle 10. ⟦NARR:b:D15:002⟧" },
      { kind: "story", beats: ["b:D15:005", "b:D15:006"],
        text: "Eleven cycles in, before the wood chain ever ran, he stepped down into a low cell at his own home's edge — and the day went into the bowl. From three down, every exit face is two or three up; bare-handed digs drop nothing; and his own lawful sideways digging lowered his floor further. The dig guard armed for the first time that day and refused nothing: every dig was legal. He was lost inside the rules, not outside them. ⟦NARR:b:D15:006⟧" },
      { kind: "story", beats: ["b:D16:001", "b:D16:002"],
        text: "Day 16 he woke in the bowl knowing the way out — or believing it: the survey's east step exists as a column of ground, but as a step it needs a stance that does not exist on the pocket floor. The new guard against digging down worked exactly as built — 69 refusals, not one block of descent all day — and because its limit was fixed to the home pad's height and he had woken below it, it also refused the middle heights, the only ledges a climb could use. The guard held the hole shut. ⟦NARR:b:D16:002⟧" },
      { kind: "story", beats: ["b:D16:003"],
        text: "The bowl is also a gloom cell: under held daylight, skeletons and creepers gather at its canopy rim, and 89 escapes burned the day's back half, three digs cut mid-swing. He took no damage at all — health at maximum in every cycle — and crafted nothing: the wood chain never began, because the exit it was keyed to never happened." },
      { kind: "story", beats: ["b:D17:002", "b:D17:003", "b:D17:004"],
        text: "So day 17 did not wake him. First, on a practice body in a copy of the bowl checked cell by cell, every escape the house knows was rehearsed: a placed-block ladder, a notch-cut ladder with a pickaxe in hand, placing at his feet the way that worked once, a dug stair east. Four methods, three tries each — the first step of the ladder gained every time, and no second step ever did. The verdict the rehearsal filed: this machinery grants exactly one step, and no arrangement of steps makes two. No scripted exit from the bowl exists." },
      { kind: "story", beats: ["b:D17:006", "b:D17:008"],
        text: "The gate held, and that is day 17's whole entry: zero cycles, zero acts, his file untouched, no deaths. He slept through it in the bowl — fed, whole, 27 porkchops in the pack — while the rehearsal ran on a body that was not his." },
      { kind: "story", beats: ["b:D17:005", "b:D17:008"],
        text: "Two things were built while he slept. The digging guard now measures from where he wakes, not from the pad: sinking below his own feet stays refused, climbing toward home is allowed. And the counting seam closed — the provisioning death that no counter had read is now a row in the record with its evidence attached, the total re-derived at 136, the earlier counts unmoved." },
      { kind: "story", beats: ["b:D11:016", "b:D12:003", "b:D14:009", "b:D17:004"],
        text: "What seven days actually taught: an offer made of what he wants is material, not scenery — and priced in his own currency, it reads as ground. The count can be closed: fifteen cobble, in hand, by his own stance. A safety order is only as real as its shortest path to the body — proven at both ends now, in a replay and in a live abort. And a hole four deep is a verdict about the machinery, not about him: he has diagnosed every trap he has been put in, in his own words, and climbed out of the ones that had an out." },
      { kind: "story", beats: ["b:D15:008", "b:D16:006"],
        text: "So he goes into day 18 in the bowl at home's edge, fed and whole, the furnace unbuilt for the seventh day, his table standing a few blocks and one unclimbable wall away. In the crew's files sits a prepared option — seven placed blocks, a short stair up the bowl's side — written, checked, and NOT placed: it waits on Casey's word, and nothing in this record makes it likelier or more decided than that. The other door is the one the rehearsal could not open: an exit he performs himself, if the machinery ever learns a second step." },
    ],
  },
];

/* ================= RENDERING ================= */
function renderLine(line) {
  let text = line.text;
  text = text.replace(/⟦NARR:(b:[^⟧]+)⟧/g, (_, id) => {
    const b = B.get(id);
    if (!b) throw new Error("narration token for missing beat " + id);
    if (!b.narration) throw new Error("narration token for beat without narration " + id);
    return `His words: "${b.narration}"`;
  });
  text = text.replace(/⟦SAID:(w:[^⟧]+?):(landed|bored):(\d+)⟧/g, (_, id, field, idx) => {
    const w = W.get(id);
    if (!w) throw new Error("said token for missing viewing " + id);
    const entry = (w[field] || [])[Number(idx)];
    if (!entry) throw new Error(`said token out of range ${id}.${field}[${idx}]`);
    return `"${entry.words}"`;
  });
  if (/⟦/.test(text)) throw new Error("unresolved token in line: " + line.text.slice(0, 60));
  const cites = [];
  for (const id of line.beats || []) cites.push(`[${id}]`);
  for (const id of line.views || []) cites.push(`[${id}]`);
  const suffix = [...cites];
  for (const id of line.beats || []) {
    const b = B.get(id);
    if (!b) throw new Error("plan cites missing beat " + id);
    if (b.fault_owner !== null && b.fault_owner !== undefined)
      suffix.push(`[fault shown: ${b.fault_owner} — ${id}]`);
  }
  for (const id of line.aired || []) suffix.push(`[aired: ${id}]`);
  return suffix.length ? `${text} ${suffix.join(" ")}` : text;
}

function renderEdition(ed) {
  const out = [];
  out.push(`# ${ed.title}`);
  out.push("");
  out.push(`Audience: ${ed.audience}. Range: ${ed.range}.`);
  out.push("");
  for (const m of ed.meta) { out.push(m); out.push(""); }
  const rendered = ed.lines.map(renderLine);
  for (const r of rendered) { out.push(r); out.push(""); }
  out.push("---");
  out.push(`Compiled by ${VERSION} from beats.jsonl sha256 ${shaFile("beats.jsonl").slice(0, 16)}…, viewings.jsonl sha256 ${shaFile("viewings.jsonl").slice(0, 16)}…. The tension series file was hashed for provenance only (sha256 ${shaFile("tension-series.jsonl").slice(0, 16)}…) and not read for content. Reproduce: node generate.js, then node check.js.`);
  out.push("");
  return { text: out.join("\n"), rendered };
}

function statsFor(ed, rendered) {
  const beatCites = [], viewCites = [];
  let narr = 0, aired = 0, faults = 0;
  ed.lines.forEach((l, i) => {
    beatCites.push(...(l.beats || []));
    viewCites.push(...(l.views || []));
    narr += (l.text.match(/⟦NARR:/g) || []).length;
    aired += (l.aired || []).length;
    faults += rendered[i].match(/\[fault shown:/g)?.length || 0;
  });
  return {
    file: ed.file,
    lines: ed.lines.length,
    beat_citations: beatCites.length,
    beat_citations_unique: [...new Set(beatCites)].length,
    viewing_citations: [...new Set(viewCites)].length,
    narration_quotes: narr,
    aired_marks: aired,
    fault_markers: faults,
  };
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = {
    generator: VERSION,
    stores: {
      beats_sha256: shaFile("beats.jsonl"),
      viewings_sha256: shaFile("viewings.jsonl"),
      tension_sha256_provenance_only: shaFile("tension-series.jsonl"),
    },
    aired_conferred_days: Object.fromEntries(conferredDays()),
    editions: [],
  };
  for (const ed of PLAN) {
    const { text, rendered } = renderEdition(ed);
    fs.writeFileSync(path.join(OUT, ed.file), text);
    const st = statsFor(ed, rendered);
    st.bytes = Buffer.byteLength(text, "utf8");
    st.words = text.split(/\s+/).filter(Boolean).length;
    st.sha256 = crypto.createHash("sha256").update(text).digest("hex");
    manifest.editions.push(st);
    console.log(`wrote editions/${ed.file} — ${st.bytes} B, ${st.words} words, ${st.lines} lines, ${st.beat_citations} beat citations (${st.beat_citations_unique} unique), ${st.narration_quotes} narration quotes, ${st.aired_marks} aired marks, ${st.fault_markers} fault markers`);
  }
  fs.writeFileSync(path.join(DIR, "manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
  console.log("wrote manifest.json; aired conferred days:", JSON.stringify(manifest.aired_conferred_days));
}

if (require.main === module) main();
module.exports = { PLAN, B, W, beats, views, conferredDays, renderEdition, DENY, VERSION };
