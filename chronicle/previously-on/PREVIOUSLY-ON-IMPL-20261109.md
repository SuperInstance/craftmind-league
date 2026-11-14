# PREVIOUSLY ON — THE NARRATOR READER OVER THE CHRONICLE (2026-11-09)

Built per the chronicle's own §6 contract (`CHRONICLE-IMPL-20261109.md`),
which specified this step before it was commissioned: Previously On is a
reader over the three chronicle stores — sealed beats only, `fault_owner`
shown, narration verbatim, `aired` derived from the viewing log on read,
tension not presented. Offline throughout; no world contact; no booth
work (the booth's voice forks are Casey's and remain open).

**Reproduce / verify** (on the Thor):
```
cd ~/craftmind-league/chronicle/previously-on
node generate.js   # compiles both editions + manifest.json from the stores
node check.js      # the contract checker -> check-results.json (346 PASS / 0 FAIL)
```
(Node v24.22.2 via the fleet nvm path. `generate.js` carries the curated
plan — line selections and prose; rendering and checking are the
deterministic parts, the same curation/machine split as the chronicle's
build.js / compile.js.)

---

## §1 The contract, as implemented

- **Sealed only.** The generator loads `../beats.jsonl` and
  `../viewings.jsonl` and nothing else for content. Every beat in the
  stores is `status: sealed` (61/61 at build time), and the checker
  re-verifies the status of every cited beat individually. No Director
  filing, day record, or triple is read — see §4.1 for why that is also
  the leak defence.
- **Fault shown, never laundered.** Wherever a cited beat carries a
  non-null `fault_owner`, the renderer appends a mechanical marker —
  `[fault shown: harness — b:D10:006]` — one per fault-carrying beat.
  The checker recomputes the expected marker set per line from the
  stores and requires exact equality with the rendered set (42 markers
  across the two editions: 13 in edition one, 29 in edition two). The
  prose also names the fault in words ("the crew's own camera chain had
  let fall"); the marker is the guarantee, the prose is the craft.
- **Narration verbatim, structurally.** The plan never types the
  citizen's words. It places a token (`⟦NARR:b:…⟧`) and the renderer
  substitutes the beat row's `narration` bytes; a beat without narration
  cannot be tokenised (the renderer throws). The checker locates each
  rendered quote as a quoted substring of its line and byte-compares it
  against the store field (14 quotes across the editions: 5 + 9). The
  same mechanism carries watchers' words (`⟦SAID:w:…:landed|bored:n⟧`,
  byte-checked against the viewing row).
- **`aired` derived on read, never stored.** A viewing row confers
  `aired` on its anchor day iff `watched[]` is non-empty AND at least
  one landed/bored testimony entry exists. Recomputed from the current
  `viewings.jsonl`, the conferred map is: day 3 ← w:PRE:001, day 9 ←
  w:D09:001, day 10 ← w:D10:001 — and nothing else. w:STD:001 confers
  nothing (it watched nothing; it is the standard, not a viewing) and
  w:ARM:001 confers nothing (exposure only; no testimony exists — the
  owed human arm stays visibly owed). Every `[aired: …]` marker in an
  edition must resolve to a conferring row whose anchor day matches
  every beat on its line, and edition two's closing claim ("testified
  to three — day 3, day 9, and day 10") is checked against the
  recomputed map, not asserted.
- **Tension: the default, in full.** The series is NOT-PROMOTED and it
  does not appear. No `t:` citation exists in either edition (checked);
  the word "tension" appears only in the editions' meta lines, each
  carrying the NOT-PROMOTED label, and in the compile footer's
  provenance sentence (the file's sha256 is carried to prove which
  series the chronicle holds; its rows are never read — the generator
  hashes the file's bytes and parses only beats and viewings).
  Corollary, enforced by the checker: **no `day_shape` beat is cited in
  either edition** — a day_shape beat's content is the series and its
  gates, so citing one would present tension by proxy. (The chronicle
  §5 precedent excluded day 3's day_shape from the cold-reader dossier
  on the same reasoning.)
- **Every line cites.** Each non-meta line ends in the beat/viewing ids
  it was compiled from; the checker enforces a citation floor of ≥1 per
  line and resolves every id against the stores.

## §2 The editions

| Edition | File | Size | Words | Lines | Beat citations | Narration quotes | Aired marks | Fault markers |
|---|---|---|---|---|---|---|---|---|
| One — going into day 11 | `editions/edition-one-going-into-day-11.md` | 6,202 B | 1,067 | 19 | 25 (20 unique) | 5 | 6 | 13 |
| Two — the full series | `editions/edition-two-full-series.md` | 10,146 B | 1,731 | 40 | 53 (53 unique) | 9 | 4 | 29 |

Edition sha256: one `91b75fe5…e1`, two `9e528c57…02` (full values in
`manifest.json`, alongside the store shas both were compiled from:
beats `1efc0e68…`, viewings `999c814a…`).

**Edition one** is the recap day 11 opens against: day 9's carried
wake, the three deaths with their owners shown (one `unknown`, filed as
unknown), the counter's first live proof; day 10's clean day, the
harvest, the refusal-by-inaction at the barn, the escaped stock, the
movement tax; then the standing threads — the pit he skirts knowingly,
the furnace open since day 2 and wanting seven more cobble — and the
watcher's two verdicts, day 9's bored against day 10's landed, as the
closing testimony lines. It contains **no scenario-#2 content**: see
§4.1.

**Edition two** is the cold reader's first contact: it opens with the
watcher's own standard (w:STD:001, quoted verbatim), then runs the
series in story order — the 114 unrecorded deaths and the two
body-without-mind deaths, days 1–10 each in one to five lines, the GAP
days 6–8 carried as the crew/instrument days they were (§4.3) — and
closes with the aired colophon: of all these days, a human watcher has
testified to three. It cites 53 of the 61 beats; the 8 uncited are the
7 day_shape rows (excluded by the tension default) and b:D10:009, the
post-day census, which edition one carries instead.

## §3 Checker results

`node check.js` → **346 PASS / 0 FAIL** (`check-results.json`, written
fresh on every run). The checks, grouped:

- **Determinism** (2): each edition's bytes on disk equal a fresh
  re-render from the plan + stores.
- **Sealed-only & resolution** (144): every cited beat exists and is
  sealed; every cited viewing exists.
- **Narration verbatim** (14) and **testimony verbatim** (4): every
  quote byte-equals its store field.
- **Aired** (13): every mark resolves to a conferring row with matching
  anchor day; edition two's aired claim equals the recomputed conferred
  map {3, 9, 10}; w:ARM:001 and w:STD:001 provably confer nothing.
- **Fault shown** (59, one per line): rendered marker sets equal the
  store-recomputed sets exactly — no fault dropped, none invented.
- **Tension absent** (6): no `t:` citation; the word confined to
  gate-labelled meta lines and the provenance-only footer.
- **No day_shape cited** (78, one per cited beat).
- **Denylist** (24: 12 markers × 2 editions): no scenario-#2 marker
  present — see §4.1.
- **Citation floor** (59): every non-meta line carries ≥1 citation.

Both editions were also read by eye after the mechanical check; one
loose figure was caught that way and fixed ("half the time" → "about a
third of the time" for day 10's goto, 49 of 136) — the checker verifies
citations and quotes, not prose arithmetic, and the filing says so.

## §4 What fought the format — labelled, not smoothed

1. **The leak that cannot happen, and its one soft edge.** Scenario #2
   has no beat in the chronicle stores — it exists only in Director
   filings this build never opens — so an edition compiled from store
   rows structurally cannot carry its element or its prediction. The
   denylist scan (element vocabulary, the tread cell, the triple id,
   "prediction", "setblock") is the mechanical backstop, and it passes.
   The soft edge, disclosed rather than hidden: the word **"shoulder"**
   appears once in edition one ("the road home, along the shoulder"),
   as the geography of Cody's own homeward route, per the commissioning
   brief's named contents. It carries no element, cell, or prediction —
   but it is the one word in the edition whose neighbourhood is
   scenario-#2 siting language, and a future editor should know the
   denylist deliberately does not contain it.
2. **His count is not the census, and both stand.** b:D10:003's
   narration says "Twelve logs" while its own beat records 18 oak + 10
   birch held at close. The narration is mid-day speech; the beat is
   the close. Verbatim discipline means the editions print his twelve
   beside the record's twenty-eight, unreconciled — narration is
   testimony, not telemetry, and the chronicle's pairing rule exists
   for exactly this.
3. **Three days with no citizen in them.** Day 6 never reached cycle 1,
   day 7 was a two-minute wake, day 8 he slept by design. A series
   recap cannot skip them (the gap IS the series' shape in that
   stretch) and cannot invent him into them; edition two narrates them
   as crew/instrument days, which is what their beats are. The
   cold-reader dossier precedent (keeping crew_fault beats because the
   mechanism is owed) holds here too.
4. **Aired is day-grained; one mark was withheld by judgement.** The
   derivation confers day 10 wholesale (w:D10:001 watched the live
   day). b:D10:009 — the post-day animal census — is day-10-anchored
   but was read after the day, not watched during it, so edition one
   leaves it unmarked. The checker verifies every mark shown; it does
   not require every permissible mark to be shown. The asymmetry is
   deliberate and recorded here.
5. **Day 3's aired rests on a filed rendering.** w:PRE:001 confers day
   3's aired: Casey watched the episode footage and the verdict is
   real, but the row itself flags that its words are a filed rendering,
   not a transcript. Edition two therefore cites w:PRE:001 only in the
   aired colophon and never quotes it; the one watcher quote it does
   carry from the viewing log's early rows (w:STD:001) is verbatim per
   the dated log.
6. **Death 121's owner is `unknown`, and the format shows it like any
   other.** The marker `[fault shown: unknown — b:D09:004]` reads
   oddly beside `harness` and `crew`; that oddity is the honest shape
   of the record. The prose carries the reason (cause unrecorded in
   every store).
7. **Tooling friction, both fixed in the tools.** The first render
   threw on the testimony token — viewing ids contain colons, and the
   token regex stopped at the first one. The first check run then
   failed on the compile footer: its provenance sentence names the
   tension file in order to say its content was NOT read, and the
   word-confinement check counted it as a presentation. The checker
   was narrowed to that exact footer form (provenance-only, checked
   for the words "hashed for provenance only" + "not read for
   content") rather than the footer being weakened. Final state: 346
   PASS / 0 FAIL.

## §5 What this leaves for later steps

- **The day-11 lane** has its recap: edition one is compiled from
  sealed stores and store shas are pinned in `manifest.json`, so the
  day record can cite the edition's sha (`91b75fe5…`) as the exact
  Previously On the day opened against.
- **The booth** is untouched, as commissioned. Its gating input remains
  the viewing log's empty `duels[]` and the owed human arm (w:ARM:001);
  nothing here pretends otherwise — edition two's colophon is, in
  effect, the public statement of that debt.
- **Future editions** are one plan-edit + one command away, but the
  aired map will not move until a human watches something: that is the
  derivation working as designed, not a backlog.

*Filed 2026-11-09 by the previously-on lane. Generator, checker,
manifest, editions and this filing live in
`~/craftmind-league/chronicle/previously-on/`. The chronicle stores were
read, never edited; no consumer was wired beyond the two editions
themselves.*
