#!/usr/bin/env node
// THE BOOTH — script generator (booth-1.0.0)
// Discipline (inherited from Previously On): the citizen's words are NEVER
// typed in the plan. The plan names trace cycles; this generator substitutes
// the `say` bytes from the trace store itself. Narrator lines ARE booth
// prose (colour about the record) and each carries its citations in the
// script record — citations never enter a spoken line or an on-screen cue.
//
// Source honesty for the sample episode: the chronicle's sealed beats end at
// day 10 (CHRONICLE-IMPL-20261109.md §2). Day 11 has no sealed chronicle
// beats yet; its sealed source is the played day record
// (pulse/DIRECT-DRIVE-DAY11-PLAYED-20261109.md, league ledger line 338) plus
// its trace. This generator therefore reads day-11 facts from that record's
// citation plan and the citizen's words from the trace — the same
// token-substitution discipline, one store closer to the day. When the
// chronicle seals day-11 beats, the plan's citations should be re-pointed at
// b:D11:* ids without changing a single spoken or subtitled byte.
const fs = require('fs');
const path = require('path');

const LEAGUE = process.env.LEAGUE || path.join(process.env.HOME, 'craftmind-league');
const TRACE = path.join(LEAGUE, 'pulse/direct-drive-trace-day11-20261110.jsonl');
const OUT_DIR = __dirname;

// ---- the curated plan: selections and booth prose; rendering is deterministic
// chair rule (filed in BOOTH-IMPL-20261109.md): play-by-play (PBP) carries
// action beats in story order; the couch (COUCH) carries history, stakes and
// feeling, and always takes the day's last reflective beat before the outro.
const PLAN = [
  { scene: 'title', kind: 'screen' },
  { scene: 'S1', chair: 'PBP', cite: ['record §1', 'trace c1'],
    narrator: "Day eleven. Cody wakes in the stone hollow south of home: one cobble in his pocket, a full belly, and a furnace still waiting to be born.",
    cues: [{ cycle: 1 }] },
  { scene: 'S2', chair: 'COUCH', cite: ['previously-on ed.1', 'b:D02:003'],
    narrator: "That furnace is the oldest open tab in this programme. He first named it on day two, at the pen fence — in the same breath as sparing his breeding pigs." },
  { scene: 'S3', chair: 'PBP', cite: ['record §1 c2', 'record §9'],
    narrator: "Before he's taken a step, he spots it. One oak trunk, five blocks west, standing in his road home. The Director placed exactly one thing in his way today. This is it.",
    cues: [{ cycle: 2 }] },
  { scene: 'S4', chair: 'PBP', cite: ['record §1 c2-c4'],
    narrator: "First try from range — nothing. The trunk sits a step up, out of reach. So he hops closer, and on cycle four — down it comes. One log, gathered, in the pack.",
    cues: [{ cycle: 4 }] },
  { scene: 'S4D', chair: 'COUCH', cite: ['record §9', 'director/LOOSENING-NOTE-003'],
    narrator: "For the record, that log was a test, with a prediction attached: that he would climb over it like a step and never touch it. He ate the scenery instead. The Director has already rewritten the doctrine." },
  { scene: 'S5', chair: 'PBP', cite: ['record §1 c5-c13'],
    narrator: "Now the walk home — and the ground taxes him for every block. Ten cycles of sliding east when he means west. Boxed in by leaves, walled in by stone, one short hop at a time.",
    cues: [{ cycle: 11 }] },
  { scene: 'S6', chair: 'PBP', cite: ['record §1 c13-c15'],
    narrator: "Cycle fourteen — he makes the shoulder and comes up on his own table. Home. Pen, wheat, table: everything where he left it.",
    cues: [{ cycle: 15 }] },
  { scene: 'S7', chair: 'PBP', cite: ['record §1 c15-c19'],
    narrator: "Straight to work. The Director's log becomes planks, sticks, a brand-new wooden pickaxe. The stone pickaxe refuses him — the recipe reads a stone he doesn't hold — so he does the honest thing, and goes to dig his own.",
    cues: [{ cycle: 18 }] },
  { scene: 'S8', chair: 'COUCH', cite: ['previously-on ed.1', 'record §2'],
    narrator: "This furnace has been blocked six different ways now, across six days. Today's blocker is plain arithmetic: he needs eight stones, and the ground is stingy." },
  { scene: 'S9', chair: 'PBP', cite: ['record §1 c19-c27'],
    narrator: "Down he goes. Grass, dirt, dirt again — and at cycle twenty-five, the pick finds stone. He widens the seam, and gives us the count himself.",
    cues: [{ cycle: 26 }, { cycle: 27 }] },
  { scene: 'S10', chair: 'COUCH', cite: ['record §7'], narr_delay_s: 4.0,
    narrator: "Two of eight — and that's the day. No death, no disaster. The crew's own safety floor parked him at seven and a half minutes, over a daylight check that had in fact passed. He was never in danger. The instrument was wrong — and it stopped the show anyway.",
    cues: [{ cycle: 31, at_s: 0.2 }] },
  { scene: 'S11', chair: 'PBP', cite: ['record §1', 'record §3', 'record §5'],
    narrator: "Day eleven, then: thirty-one cycles, zero deaths, one log felled, two cobble dug — all for three cents of thinking. The furnace is still waiting. Day twelve owes him a fairer shake." },
  { scene: 'credits', kind: 'screen' },
];

// ---- load the trace; index says by cycle
const says = {};
for (const line of fs.readFileSync(TRACE, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  let row; try { row = JSON.parse(line); } catch { continue; }
  if (row && typeof row.say === 'string' && Number.isInteger(row.cycle)) says[row.cycle] = row.say;
}

// ---- render the three channels
const script = {
  episode: 'cody-day11',
  generator: 'booth-1.0.0',
  source_trace: 'pulse/direct-drive-trace-day11-20261110.jsonl',
  channels: { narrator: [], subtitles: [], screen: [] },
};
script.channels.screen.push(
  { scene: 'title', text: 'CODY — DAY ELEVEN\nThe Log on the Road Home' },
  { scene: 'credits', text: 'Narration written by the Booth, from the sealed day record.\nCody\u2019s words are his own, shown verbatim as subtitles; he is never voiced.\nVoices: Underdog Woof (Juno — play-by-play; Mira — the couch), used under the Underdog Non-Commercial Licence 1.0, with credit.\nFootage: the Orin capture, day 11 as played. The day\u2019s record: pulse/DIRECT-DRIVE-DAY11-PLAYED-20261109.md' },
);
let cueCount = 0;
for (const beat of PLAN) {
  if (beat.kind === 'screen') continue;
  script.channels.narrator.push({ scene: beat.scene, chair: beat.chair, text: beat.narrator, cite: beat.cite, narr_delay_s: beat.narr_delay_s || 0 });
  for (const cue of beat.cues || []) {
    const text = says[cue.cycle];
    if (typeof text !== 'string') throw new Error(`no say in trace for cycle ${cue.cycle}`);
    script.channels.subtitles.push({ scene: beat.scene, cycle: cue.cycle, text, at_s: cue.at_s ?? null });
    cueCount++;
  }
}

// ---- self-check: every subtitle byte-equals the trace field it came from
for (const cue of script.channels.subtitles) {
  if (cue.text !== says[cue.cycle]) throw new Error(`subtitle for cycle ${cue.cycle} diverges from trace`);
}
const split = { PBP: 0, COUCH: 0 };
for (const n of script.channels.narrator) split[n.chair]++;

fs.writeFileSync(path.join(OUT_DIR, 'script-day11.json'), JSON.stringify(script, null, 2) + '\n');
const md = ['# BOOTH SCRIPT — Cody, Day Eleven ("The Log on the Road Home")', '',
  'Three channels, kept separate by construction. NARRATOR lines are spoken (Juno engine; chairs below).',
  'SUBTITLE cues are the citizen\u2019s own words, substituted byte-for-byte from the day-11 trace — never retyped, never voiced.',
  'SCREEN text is title and credits only. Citations live in this record only.', '',
  `Chair split: play-by-play ${split.PBP} lines, couch ${split.COUCH} lines. Subtitle cues: ${cueCount}.`, ''];
for (const beat of PLAN) {
  if (beat.kind === 'screen') { md.push(`## ${beat.scene.toUpperCase()} (screen)`, ''); continue; }
  const n = script.channels.narrator.find(x => x.scene === beat.scene);
  md.push(`## ${beat.scene} — ${n.chair}`, `NARRATOR: ${n.text}`, `  cites: ${n.cite.join('; ')}`);
  for (const cue of script.channels.subtitles.filter(c => c.scene === beat.scene)) md.push(`  SUBTITLE [trace c${cue.cycle}]: "${cue.text}"`);
  md.push('');
}
fs.writeFileSync(path.join(OUT_DIR, 'script-day11.md'), md.join('\n'));
console.log(JSON.stringify({ ok: true, narrator_lines: script.channels.narrator.length, split, subtitle_cues: cueCount }));
