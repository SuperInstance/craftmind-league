# PREVIOUSLY ON — EDITION THREE: CODY, GOING INTO DAY 18 (2026-11-09)

Lane: previously-on edition three, the chronicle-seal filing's named next step
(CHRONICLE-SEAL-11-17-20261109.md §6: "one PLAN edit in
`chronicle/previously-on/generate.js` + `node generate.js`").
Authorisation: Casey's "build it all" + parent sequencing. Offline throughout;
no live citizen work; the world, the day-17 ramp filing, and the chronicle
stores were not touched — beats and viewings were read-only inputs.

## §1 The edition

| | |
|---|---|
| File | `editions/edition-three-going-into-day-18.md` |
| Size | 14,228 B |
| Words | 2,503 |
| Lines | 28 story/testimony lines (file: 28 content lines under the title block; manifest `lines: 28`) |
| sha256 | `80471291ebe3b69b6da3860333081ead357a28057d89f17dd09505ce5914ccbd` |
| Beat citations | 53 (49 unique) |
| Narration quotes | 10 (all tokens `⟦NARR:b:…⟧`, substituted from beat rows, never typed) |
| Fault markers | 22 |
| Aired marks | 0 — by derivation, see §3 |
| Viewing citations | 0 |

Compiled from the sealed stores at: beats.jsonl sha256 `d1b248e2…`
(136 rows), viewings.jsonl sha256 `999c814a…` (5 rows, unchanged),
tension-series.jsonl sha256 `e4305e5c…` (provenance hash only, not read).

Form: edition one's — the recap the next day opens against — carrying days
11–17 as its material: day 11's stop and repair, the played relaunch and the
offer doctrine, day 12's closed count and its extraction tax, day 13's fall,
the total loss and the burst past the stop rule, the safety-reading-path
repair, day 14's live proof at exactly three, day 15's provisioning death and
survived transit, the bowl (days 15–16), day 17's rehearsal and held gate,
then a themes line and the standing-threads close in edition one's shape.

## §2 The generate.js diff — one plan edit, additive only

Pre-edit generate.js sha256 `bc0e7eac…` (preserved at the lane's start).
The diff is a pure insertion of 69 lines after the former line 230 (the end
of edition two's plan object, before the PLAN array's closing `];`): one new
edition object — file/title/audience/range, three meta lines, 28 plan lines.
No existing line was modified or removed; editions one and two re-render
byte-identical in body (their only change is the compile footer's store-sha
prefixes, which legitimately moved with the seal: beats `1efc0e68…` →
`d1b248e2…`, tension `57ad57a9…` → `e4305e5c…`; viewings unchanged. Edition
one's sha is now `6ca4f21f…`, edition two's `6ae3f2b1…` — both changed by
that footer line alone, verified by diff.) `check.js` was not edited.

Two plan-level fixes were needed during the build, both inside the new
edition object only, both caught by the checker battery (§4):

1. **day_shape citations (5 checks).** The first render cited five
   `day_shape` beats (b:D15:007, b:D16:004, b:D17:001, b:D17:009 ×2). The
   no-day_shape rule is the tension-by-proxy exclusion and it binds edition
   three exactly as it bound one and two — the close facts those beats held
   (hp/food, porkchops held, save state, the gate-held day shape) are
   carried instead by non-day_shape beats stating the same facts:
   b:D15:008 (day-15 close), b:D16:006 (day-16 close), b:D17:006 (the
   corrected census — stance, pocket geometry), b:D17:008 (the deaths-seam
   close, Cody's offline state at close). No fact was dropped; its citation
   moved to a citable row.
2. **The word "prediction" (1 check).** The scenario-#2 denylist scans every
   edition for the vocabulary of the pre-filed prediction; edition three's
   day-11 line used the word for triple-021's filed forecast. Reworded to
   "the forecast filed before the day" — same fact, outside the denylist's
   vocabulary. The denylist itself was not touched.

## §3 The aired map — derived on read, unchanged

Recomputed from viewings.jsonl by the generator's `conferredDays()` at
render time and re-verified by the checker: **day 3 ← w:PRE:001, day 9 ←
w:D09:001, day 10 ← w:D10:001 — and nothing else.** Viewings is byte-
identical to the pre-seal store (sha `999c814a…`), so the map cannot have
moved. w:STD:001 confers nothing (it watched nothing); **w:ARM:001 confers
nothing** (exposure only, no testimony — the owed human arm stays visibly
owed; checker lines `aired:w:ARM:001-confers-nothing` and
`aired:w:STD:001-confers-nothing` PASS).

Consequence for edition three, carried in its third meta line rather than
hidden: **no line of days 11–17 may carry an `[aired: …]` mark**, and none
does (0 aired marks). No testimony lines were available for these days
either — the viewing log holds no day 11–17 row — so the edition carries no
`⟦SAID:⟧` quotes and cites no viewing. Any "since you last saw him" framing
would have had to come from the beats; the edition instead opens on the
story, which needs no such frame.

## §4 Checker verdict — IN FULL

`node check.js` (Node v24.22.2, fleet nvm path) over all three editions:
**536 PASS / 0 FAIL** (`check-results.json`, written fresh by the run).
Edition three accounts for 190 of those checks:

- **Determinism** — edition three's disk bytes equal a fresh re-render
  from plan + stores (and editions one/two likewise).
- **Sealed-only & resolution** — 53 checks: every cited beat exists and is
  `status: sealed`; there are no cited viewings to resolve.
- **Narration verbatim** — 10 checks: every rendered quote byte-equals its
  beat row's `narration` field. The plan typed none of his words.
- **Testimony verbatim** — 0 in edition three (no viewing rows for these
  days); editions one/two's 18 testimony+narration checks pass as before.
- **Aired** — edition three carries no marks to resolve; the two
  non-conferring-row proofs (w:ARM:001, w:STD:001) pass globally; edition
  two's aired claim still equals the recomputed map {3, 9, 10}.
- **Fault shown** — 28 per-line checks (citation floor + fault set on each
  line): every line's rendered `[fault shown: …]` set equals the
  store-recomputed set exactly — 22 markers, none dropped, none invented.
- **Citation floor** — every non-meta line carries ≥1 citation (28 lines).
- **No day_shape cited** — 53 checks, one per cited beat (after the §2 fix).
- **Tension absent** — no `[t:` citation; the word appears only in the
  NOT-PROMOTED meta line and the provenance footer ("hashed for provenance
  only … not read for content"); every meta mention carries the label.
- **Denylist** — 13 markers scanned, all absent (after the §2 fix).

First run of the battery over the first render read **532 PASS / 6 FAIL**
(the five day_shape checks + the one denylist check of §2). The failures
are filed here, not smoothed: the plan was corrected, the stores were not,
and the final battery is the 536/0 above. Editions one and two pass the
same battery unchanged in substance (346 checks at their build; the growth
to 536 is edition three's 190).

Also read by eye after the mechanical check (the checker verifies
citations and quotes, not prose arithmetic — the PREVIOUSLY-ON-IMPL's own
caveat, honoured here): the figures carried are the beats' own — 95 s,
5/5 + 14/14 + 4/4, cycle 19 / peak 15, climb 0/32, 22 assertions, 43 s,
40/40, 26 s, 26 blocks, 0.54 s / 4.54 s, 5.5 s, 32 porkchops, ~cycle 10,
69 refusals, 89 flees, 136 total, 27 porkchops, seven blocks.

## §5 The no-leak discipline, edition three's form

- **The ramp (b:D17:009, PREPARED-not-executed).** The beat is `day_shape`,
  so it is not cited at all (tension-by-proxy rule, §2) — but its *status*
  is the close's subject, and the close states it exactly as the filing
  leaves it: a prepared option in the crew's files — seven placed blocks, a
  short stair — **written, checked, and NOT placed; it waits on Casey's
  word**, with the added sentence "nothing in this record makes it likelier
  or more decided than that." The words "placed blocks" describe the
  filing's contents (blocks to be placed), and the same sentence negates
  the placing. No line presents the ramp as placed, decided, or
  forthcoming.
- **Day 17 narration absence.** Verified from the store, not assumed: a
  scan of all nine b:D17:* rows finds **zero `narration` fields** (he never
  woke). Edition three places no `⟦NARR:⟧` token on any day-17 line; had
  it tried, the renderer throws on a beat without narration. The day's
  entry in the edition is narration-free by construction and by scan.
- **Scenario vocabulary.** Edition three discusses scenarios #2 and #3
  only through their sealed beats' outcomes (b:D11:010/015, b:D12:001/010)
  — what he did with the elements, never the elements' siting language;
  the denylist scan passes on the final bytes.
- **Meta honesty.** Edition three's extra meta line (§3) is a claim about
  the viewing log, and it is exactly as strong as the derivation: conferred
  days {3, 9, 10}, recomputed at render.

## §6 Stores at close (sha256)

- beats.jsonl: d1b248e285589809bce04c13be65d9db73ffb24f2e6b6b38cb0006f6d06c23e9 (136 rows, read-only)
- viewings.jsonl: 999c814a49e75885baa8c2142093d3cb354abb3c8090e53e027cf42118cd409e (5 rows, read-only)
- tension-series.jsonl: e4305e5cfd0b091439dd02ecd7539fb381f00f114c374ec8ba5a98d9a5cdfd07 (17 rows, provenance only)
- manifest.json: regenerated by generate.js — stores as above, aired map
  {3, 9, 10}, three editions with their shas (§1; editions one/two at
  `6ca4f21f…` / `6ae3f2b1…`).

*Filed 2026-11-09 by the previously-on edition-three lane. Generator (one
additive plan edit), checker (unedited), manifest, editions and this filing
live in `~/craftmind-league/chronicle/previously-on/`. The chronicle stores
were read, never edited; no consumer was wired beyond the edition itself.*
