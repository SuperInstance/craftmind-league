# THE BOOTH — NARRATION OVER THE RECORD (2026-11-09)

Built under Casey's ruling of 2026-11-09 17:23 AKST, which closed the two
forks the deliberation left open. This lane built the booth, produced the
first sample episode from day 11 as played, and files it for Casey's cold
watch. **The lane does not certify entertainment** — that judgement is the
watcher's, and §6 frames the watch honestly, weaknesses first.

**Reproduce / verify** (on the Thor):
```
cd ~/craftmind-league/booth
~/.nvm/versions/node/v24.22.2/bin/node generate-script.js   # script-day11.json/.md from the plan + trace
python3 assemble.py        # (in ~/booth-work/; timings + ASS + mux — paths inside the file)
```
Artefacts in this directory: `generate-script.js` (the script generator),
`script-day11.json` / `script-day11.md` (the three-channel script record),
`assemble.py` (the episode assembly), `episode-day11.mp4` (the sample).
Phone copy: **`~/curator/episodes/cody-day11-episode.mp4`** — the same
shelf as the day-3 episode, byte-identical to the booth copy.

---

## §1 The ruling, as received

1. **Narrator only.** Cody never speaks aloud. His own words stay on screen
   as text — the designed-subtitles render: his words only, no system text,
   no nameplates, no command lines in the subtitle channel.
2. **Both personas, if entertaining.** Two narrator chairs alternate:
   (a) a sports-desk play-by-play voice; (b) a friend-on-the-couch voice —
   warm, dry, knows the history. Entertainment is the acceptance gate; the
   deliverable is judged by whether it is entertaining to watch. Coverage
   and correctness are floors, not the bar.
3. **Juno is the narrator engine** (Underdog Woof, on the Orin — the show's
   last mile runs there, per Casey's placement ruling). It speaks only the
   booth's lines, never Cody's — so the deliberation's voice-collision
   blocker (Juno was benched on Cody's own narration lines) is dissolved by
   the ruling, not engineered around. The couch chair is rendered in Woof's
   second voice, Mira (see §4 for why that is safe here and was not live).
   Licence credit for Woof rides in the episode's credits and metadata.

## §2 The three-channel script format

`generate-script.js` renders three channels that are separate **by
construction**, not by convention:

- **NARRATOR** — booth prose, spoken. Each line carries `scene`, `chair`
  (PBP | COUCH) and `cite[]` — the record sections the line's facts stand
  on. Citations exist only in the script record; no citation, id, or marker
  ever enters a spoken line or an on-screen cue.
- **SUBTITLE** — the citizen's words only. The plan never types them: it
  names a trace cycle, and the generator substitutes the `say` bytes from
  the trace store itself (the Previously On token discipline), then
  self-checks that every cue byte-equals its trace field. A cycle with no
  `say` cannot be cued — the generator throws.
- **SCREEN** — title and credits text only. Nothing else is ever written on
  the picture by the booth. (The footage itself still carries whatever the
  capture carried — see §5's honesty note on teleport notices.)

**The alternation rule** (written here, applied by the plan, not improvised
per line): play-by-play carries action beats in story order — anything Cody
*does* in the present tense of the day. The couch carries history, stakes
and feeling — anything whose meaning comes from an earlier day — and always
takes the day's last reflective beat before the play-by-play outro. A beat
is assigned by asking one question: *would this line make sense to a viewer
who had never seen a previous day?* If yes, it is play-by-play; if its
weight comes from the archive, it is the couch's.

**Sample script** (`script-day11.md`): 12 narrator lines — **play-by-play
8, couch 4** — and **9 subtitle cues** (trace cycles 1, 2, 4, 11, 15, 18,
26, 27, 31).

## §3 A source-honesty note the build owes

The commission says "sealed chronicle beats only." The chronicle's sealed
beats end at **day 10** (CHRONICLE-IMPL §2) — day 11 has no `b:D11:*` rows
yet, and this lane did not write any (the stores were read, never edited).
Day 11's sealed source is its played record
(`pulse/DIRECT-DRIVE-DAY11-PLAYED-20261109.md`, league ledger line 338) plus
its trace. The generator therefore takes the script's facts from that
record's cited sections and the citizen's words from the trace — the same
token-substitution discipline, one store closer to the day. When the
chronicle seals day-11 beats, the plan's citations should be re-pointed at
`b:D11:*` ids without changing a single spoken or subtitled byte. The
Previously On gating item also stands where it stood: the viewing log's
`duels[]` is still empty and the human arm (w:ARM:001) still owed; nothing
in this build pretends the booth's audience instrument exists yet — the
cold watch in §6 is a first arm, not that instrument.

## §4 Production record — the sample episode

**Episode:** "Cody — Day Eleven: The Log on the Road Home."
**Length: 3:06** (186.1 s) — the day honestly supports a short piece:
31 cycles, 7.47 played minutes. It was not padded; the title card is 4 s
and the credits 8 s of the total.

**Narration (TTS, on the Orin, the bench's proven route):** the Woof bench's
own runner (`~/woof-bench/scripts/runner.py`, real `underdog_woof` API),
`taskset -c 2` + `nice -n 10` — one A78AE core beside the live world, the
production shape. Play-by-play = **Juno**; the couch = **Mira**. Mira was
unusable *live* (her seeded redraw tail makes some lines take ~70 s);
offline, latency is not the constraint and her takes here were ordinary —
worst line 24.2 s wall for the 21.0 s closing couch line (RTF 1.149), every
other line RTF 0.59–0.89. Two voices loaded in one process: peak RSS
457,688 KB. Totals: **155.7 s of speech rendered in 114.4 s of render wall**
(+ ~21 s engine loads). Listening check (faster-whisper base on Thor, the
bench's directional method, applied to one line per chair): the Juno opener
and the Mira closer both transcribe essentially word-perfect — no doubled
digits, no garbling; the numbers in the spoken lines survived.

**Picture:** the Orin capture segments for the played window
(2026-11-10T00:59:36Z → 01:07:04Z), fetched to Thor and cut there with a
full ffmpeg 7.0.2 (the imageio-ffmpeg static binary — both boxes' system
ffmpeg builds lack the scale/ASS filters; that detour is filed here so the
next lane doesn't rediscover it). The window plays at **2.36×** under the
narration. One stretch of the window carrying an open chat panel (sampled
at ~01:03:01Z) was cut out of the source (window t 195–230 s). Subtitles
are burned in from the generated ASS (the SUBTITLE channel, verbatim);
title and credits are black cards from the SCREEN channel.

**What the picture honestly is:** day 11's frame verdict stands — Cody
fully visible in 1 of 10 sampled stills. The footage is his *country* —
the hollow, the shoulder, the pen, the table — with Cody in frame for a
minority of it, exactly as the day record measured. The booth did not fix
the camera (the subject-keeper is a separate, built-but-unactivated lane);
this episode is carried by voice and by his subtitled words, and §6 says
so to the watcher in advance. Three source stills also carry system
teleport notices in the capture itself — not command text, and not the
booth's channel; they were left as the capture made them rather than
cropped or hidden.

**Cost:** $0 marginal. All rendering local (Orin TTS, Thor assembly);
no provider calls. The day's own brain cost ($0.0305) is the record's, and
the outro line cites it as "three cents of thinking."

**Files:** episode 18 MB, h264 1280×720 + AAC mono. Metadata carries the
title and the Woof credit (Underdog Non-Commercial Licence 1.0).

## §5 The honesty floor — method

- Every factual claim in a narrator line traces to its `cite[]`: the day
  record's sections, the trace cycles, or Previously On edition one (for
  the day-2 furnace naming and the "blocked six different ways" count).
  The generator's script record is the audit surface — a line whose facts
  aren't in its citations is a filing defect, findable by reading two files.
- Colour is about the record, never in it: "a furnace still waiting to be
  born," "he ate the scenery," "day twelve owes him a fairer shake" are
  the booth's voice about filed facts (the unbuilt furnace; triple-021's
  FAIL; the park). No invented events, no invented dialogue, no drama the
  beats don't carry — the day's real beats are the felled log, the road
  fight, the two-cobble peak, and the park, and those are the episode's
  four movements.
- His words are never voiced, never retyped, never trimmed inside a cue:
  each subtitle is the full `say` of its cycle, byte-equal to the trace
  (generator self-check; the same discipline Previously On's checker
  enforces with byte-compare).
- The episode says its own ending plainly: the day was parked by the
  crew's instrument over a check that had passed. The couch chair carries
  it, in words, because it is the day's truth and the watcher is owed it
  in the piece, not only in the paperwork.

## §6 For the cold watch — read this after, or before, as you like

**Known weaknesses, stated first.**
1. **You will often not see Cody.** The camera that filmed day 11 loses
   him (1/10 fully visible is the measured figure). Long stretches are
   leaves, dirt and sky with a voice over them. This is the programme's
   standing deficit, not the booth's — but you will feel it here first.
2. **The two chairs are two Woof voices, not two people.** Juno (brighter,
   desk) and Mira (warmer, couch) read differently, but a listener may
   hear one synthetic family resemblance across both chairs.
3. **The story is small because the day was small** — 3:06 for a day that
   was cut at 7.5 minutes. The furnace does not get built. The climax is
   a man felling one log and digging two stones, and the booth has bet
   that the telling can carry what the day couldn't finish.

**What to listen for.** The play-by-play chair calls the day like a match
— present tense, momentum, the count ("two of eight"). The couch chair is
the one who has been watching since day 2: it knows the furnace's history,
it knows the log was a test, and it delivers the park verdict at the end.
His own lines — subtitled, never spoken — are the driest comedy in the
piece ("Down you come, trunk first"; "Two cobble."). If the episode works,
it works because there are three voices in it and only two of them are ours.

**The question the watch answers:** not "was it accurate" (the floors are
checked) but Casey's standard — *does it feel like watching an entertaining
video?* A bored verdict kills this format as surely as a falsified one;
both chairs, the pacing, and the bet in weakness 3 stand or fall on it.

*Filed 2026-11-09 by the booth lane. Generator, script record, assembly and
episode live in `~/craftmind-league/booth/`; render scratch (segments,
wavs, ASS, contact sheets) in Thor `~/booth-work/` and Orin `~/booth-work/`.
The chronicle stores and the day record were read, never edited.*
