# Round 2 — Acadia Pines (simulator), 2026-11-07

The league's recorded Round 2. Three citizens, 9 holes, Engine A physics with execution noise on (LEAGUE_NOISE=1) and the league ledger on (LEAGUE_LEDGER=1). Every throw below is a ledger line in `ledger/events.jsonl`; every narration line is a governor receipt in `ledger/mind-calls.jsonl`.

**Calibration (config/discgolf-calibration.json v1):** distanceScale = 0.0455 — one declared parameter maps the card onto Engine A's native units, derived from measurement: a full-power Boss drive carries 7.963 engine units as built (release 29.43 m/s; battery in logs/calibration-battery.json), and the scale is set so that drive is worth 175 card units. Round 1's eyeballed 0.05 implied a 159-unit drive and starved every long hole. Shot selection inverts the measured per-disc carry table — no scale-bound power formulas, no putter floor. The holing circle is 6 card units (capture radius 0.273 engine units at this scale); pick up at 8.

## Standings

| # | Citizen | Bag (D/F/M/P) | Throws taken (before → after) | Strokes | To par |
|---|---|---|---|---|---|
| 1 | Mara Voss — The Bomber | boss/firebird/wasp/luna | 879 → 904 | 25 | -5 |
| 2 | Jules Okafor — The Surgeon | wraith/teebird/buzzz/judge | 648 → 684 | 36 | +6 |
| 3 | Pip Hartley — The Rookie | archangel/leopard3/comet/aviar | 42 → 83 | 41 | +11 |

## Card

| Hole | Par | Card dist | Sim dist | Mara | Jules | Pip |
|---|---|---|---|---|
| 1 The Opener | 3 | 235 | 10.69 | 3 | 2 | 6 |
| 2 Pine Needle Alley | 3 | 195 | 8.87 | 2 | 3 | 3 |
| 3 Elevation Drop | 4 | 300 | 13.65 | 3 | 4 | 4 |
| 4 The Tunnel | 3 | 240 | 10.92 | 4 | 2 | 4 |
| 5 Risk/Reward | 4 | 380 | 17.29 | 3 | 8 | 5 |
| 6 Ace Run | 3 | 155 | 7.05 | 2 | 4 | 3 |
| 7 The Grove | 3 | 240 | 10.92 | 2 | 6 | 4 |
| 8 Water Hazard | 4 | 370 | 16.84 | 3 | 3 | 4 |
| 9 Clubhouse Finish | 3 | 205 | 9.33 | 3 | 4 | 8 |
| **Total** | **30** | | | **25 (-5)** | **36 (+6)** | **41 (+11)** |

## Course mutation — the Round 2 card

Same course identity (holes, names, tees, baskets, obstacles, pars — total par still 30). Only distances moved, each from Round 1's measured per-hole evidence (field = all three citizens; veterans = Mara + Jules):

| Hole | R1 card | R2 card | R1 field vs par | Why |
|---|---|---|---|---|
| 1 The Opener | 180 | 235 | -1.00 | Bunched: all three birdied. Lengthened. |
| 2 Pine Needle Alley | 210 | 195 | +1.33 | The field number is one rookie putting collapse (Pip 8; veterans -0.50). Slightly shorter approach; the putting fix itself is calibration-side (below). |
| 3 Elevation Drop | 320 | 300 | +0.67 | Firmest scoring par 4 for the veterans (+1.00) after H5. Softened. |
| 4 The Tunnel | 195 | 240 | -1.00 | Bunched: all three birdied. Lengthened. |
| 5 Risk/Reward | 380 | 380 | +1.00 | KEPT. The over-par was a scale artefact: Round 1 drives covered ~31% of it; the calibrated drive covers 46%. |
| 6 Ace Run | 155 | 155 | +0.33 | KEPT. The identity ace run; its over-par was putter-floor overshoot (Mara took 4 with three short putts), fixed in the caddy, not the card. |
| 7 The Grove | 240 | 240 | +0.33 | KEPT. The one honest hole (veterans exactly at par). |
| 8 Water Hazard | 350 | 370 | -0.67 | Played soft: both veterans birdied an 'expert' par 4. The water carry lengthens. |
| 9 Clubhouse Finish | 175 | 205 | -0.67 | Gentle, but too gentle. Lengthened. |

Two Round 1 distortions were NOT card problems and were fixed in the calibration instead of the card: (1) the long-hole starvation (H3/H5) traced to the eyeballed 0.05 scale — fixed by the measured distanceScale; (2) the close-putt thrash (H2's collapse, H6's over-par) traced to the runner's putter floor of 0.22 intended power (~2.1 units of forced carry on every short putt — Round 1 close-putt record: Mara 2/6, Pip 2/10 holed from <=2.0 units) — fixed by carry-table shot selection and the 6-card-unit holing circle, both declared in `config/discgolf-calibration.json`. Validation of this card before play (6 simulated rounds, citizens at current career counts): veteran means Mara 30.0 / Jules 30.5 on par 30, every hole's veteran mean within +/-1.1 of par, Pip 41.3. The lived round above will differ — that is what weather and hands are for.

## Did the rookie spray more? (dispersion evidence)

Battery proof (tests/test-execution-noise.js, same seed): rookie dispersion vs veteran dispersion is asserted at <55% — see test output. In this round itself:

| Citizen | Career throws at start | Mean |noise| power | Mean |noise| hyzer° | Mean |noise| aim° | Drive-landing dispersion (RMS, n=9 drives) |
|---|---|---|---|---|---|
| Mara Voss | 879 | 0.0213 | 1.45 | 1 | 1.864 |
| Jules Okafor | 648 | 0.0237 | 1.26 | 1.04 | 1.309 |
| Pip Hartley | 42 | 0.0731 | 4.86 | 4.17 | 1.058 |

Pip started with 42 career throws; the veterans with 879 and 648. Pip's mean release noise and drive scatter above do **not** exceed the veterans' — the round does not fully agree with the battery at n=9 drives (small sample; the battery is the controlled evidence, the round is the lived one). Over the round Pip's sigma scale also shrank as throws_taken climbed from 42 to 83 — practice, accruing mid-round.

## Mind spend (System Two narration, via the governor)

| Citizen | Narration calls | Mind-seconds |
|---|---|---|
| Mara Voss | 25 | 16.419 |
| Jules Okafor | 36 | 15.994 |
| Pip Hartley | 41 | 18.248 |
| **Total** | **102** | **50.661** |

Governor budget state after the round: `{"window_s":3600,"agents":{"geist":{"calls_used":0,"calls_limit":300,"mind_seconds_used":0,"mind_seconds_limit":900},"vega":{"calls_used":26,"calls_limit":300,"mind_seconds_used":403.052,"mind_seconds_limit":600},"[SECURITY_DATA]":{"calls_used":8,"calls_limit":120,"mind_seconds_used":44.054,"mind_seconds_limit":120},"geist-mind":{"calls_used":28,"calls_limit":300,"mind_seconds_used":292.18,"mind_seconds_limit":900},"mara":{"calls_used":25,"calls_limit":120,"mind_seconds_used":16.418,"mind_seconds_limit":120},"jules":{"calls_used":36,"calls_limit":120,"mind_seconds_used":15.996,"mind_seconds_limit":120},"pip":{"calls_used":41,"calls_limit":120,"mind_seconds_used":18.248,"mind_seconds_limit":120}}}`

Narration failures: 0 of 102 throws (failed lines are marked in the shot log, never invented).

## Shot log

### Mara Voss — The Bomber

**Hole 1 — The Opener** (par 3, sim 10.69) — 3 strokes
- #1 boss — intended power 1, executed 0.98, flew 8, 2.69 left. *That Boss was supposed to be a statement, not a shorty.*
- #2 wasp — intended power 0.28, executed 0.304, flew 3.07, 0.38 left. *That Wasp was supposed to be a statement, not a short field goal.*
- #3 luna — intended power 0.05, executed 0.05, flew 0.62, 0.24 left. *That Luna was a statement shot - big hyzer line into wind 3, landed short but still holed out. Power player, full-send drive, trust the big hyzer.*

**Hole 2 — Pine Needle Alley** (par 3, sim 8.87) — 2 strokes
- #1 boss — intended power 1, executed 1, flew 5.66, 3.55 left. *My Boss flew like a dream but I'll be damned if I'm not throwing it again, same line, same power, same statement.*
- #2 wasp — intended power 0.4, executed 0.398, flew 3.65, 0.11 left. *That Wasp was supposed to fly 300 feet into an 80 mph headwind, and it did exactly that. The only problem was it was 300 feet too short. I've got to get that thing to fly straighter, not just harder.*

**Hole 3 — Elevation Drop** (par 4, sim 13.65) — 3 strokes
- #1 boss — intended power 1, executed 0.99, flew 5.03, 8.63 left. *That Boss throw was a statement - 140-degree wind, full power, and I'm still mad about that short finish.*
- #2 boss — intended power 1, executed 0.995, flew 3.03, 5.66 left. *That Boss throw was a masterpiece of controlled aggression - the wind couldn't handle that big hyzer line I trusted so completely.*
- #3 firebird — intended power 0.7, executed 0.673, flew 5.66, 0.07 left. *That Firebird screamed through the wind at 140 degrees and landed 0.07 units from the basket - that's a statement throw right there, baby!*

**Hole 4 — The Tunnel** (par 3, sim 10.92) — 4 strokes
- #1 boss — intended power 1, executed 1, flew 8.01, 2.93 left. *That Boss flight was a beautiful statement of intent - the wind couldn't handle that big hyzer line I trusted.*
- #2 wasp — intended power 0.31, executed 0.245, flew 2.63, 0.33 left. *That Wasp was supposed to be a statement, not a shorty.*
- #3 luna — intended power 0.05, executed 0.066, flew 0.78, 0.46 left. *That Luna flight was a masterpiece of controlled chaos - the wind ate it alive and I still managed to put it in the basket!*
- #4 luna — intended power 0.05, executed 0.05, flew 0.64, 0.18 left. *That Luna was a power player's dream, finishing 0.18 units from the basket - that's a statement shot!*

**Hole 5 — Risk/Reward** (par 4, sim 17.29) — 3 strokes
- #1 boss — intended power 1, executed 0.97, flew 6.26, 11.27 left. *That Boss threw me a bone, I was gonna bury that hyzer line but the wind stole it.*
- #2 boss — intended power 1, executed 1, flew 5.34, 6.07 left. *That Boss throw was a statement - 6.07 units from the basket? That's a 100% power shot that finished short, but I'm not feeling it.*
- #3 firebird — intended power 0.81, executed 0.805, flew 6.18, 0.13 left. *That Firebird screamed through the wind at 260 degrees and I was banking on the hyzer to bite - it did, but it was just short. Not my best work, but at least I trust my discs.*

**Hole 6 — Ace Run** (par 3, sim 7.05) — 2 strokes
- #1 firebird — intended power 1, executed 0.977, flew 6.67, 0.39 left. *That Firebird was supposed to be a statement, not a shorty.*
- #2 luna — intended power 0.05, executed 0.05, flew 0.61, 0.22 left. *That Luna was a beautiful statement shot - trust the big hyzer line and let it fly!*

**Hole 7 — The Grove** (par 3, sim 10.92) — 2 strokes
- #1 boss — intended power 1, executed 1, flew 8.02, 2.9 left. *That Boss throw was a beautiful statement of power and precision, banking that big hyzer line right into the wind and landing just 2.90 units from the basket - pure dominance.*
- #2 wasp — intended power 0.3, executed 0.253, flew 2.68, 0.24 left. *That Wasp flight was a masterpiece of intentional misalignment - the wind caught it perfectly on the hyzer, and I'm glad I didn't overthink the angle.*

**Hole 8 — Water Hazard** (par 4, sim 16.84) — 3 strokes
- #1 boss — intended power 1, executed 0.98, flew 8.01, 8.83 left. *That Boss threw me right into the wind's grip, but I trust my hyzer line and that big release.*
- #2 boss — intended power 1, executed 1, flew 8.02, 0.84 left. *That Boss throw was a beautiful statement of power and precision, carving that big hyzer line right into the wind and landing just 0.84 units from the basket - pure dominance.*
- #3 luna — intended power 0.08, executed 0.075, flew 0.9, 0.08 left. *That Luna flight was a masterpiece of wind defiance - 110 degrees into 5-mph gusts, landed 0.08 units from the basket, and I'm already planning my next power play.*

**Hole 9 — Clubhouse Finish** (par 3, sim 9.33) — 3 strokes
- #1 boss — intended power 1, executed 0.993, flew 2.55, 6.81 left. *That Boss throw was a beautiful statement of power and precision, baby!*
- #2 firebird — intended power 1, executed 0.973, flew 2.9, 4.18 left. *That Firebird was supposed to be a statement, not a short throw.*
- #3 wasp — intended power 0.52, executed 0.522, flew 4.33, 0.22 left. *That Wasp was a masterpiece of intentional misalignment - beautiful hyzer turn, full power release, and the wind was no match for that precision.*

### Jules Okafor — The Surgeon

**Hole 1 — The Opener** (par 3, sim 10.69) — 2 strokes
- #1 wraith — intended power 0.92, executed 0.953, flew 7.24, 3.47 left. *That Wraith throw was too much power for that 20-degree wind.*
- #2 buzzz — intended power 0.34, executed 0.332, flew 3.23, 0.25 left. *That Buzzz played perfectly in the wind, the controlled release and precise angle got it to finish just 0.25 units from the basket.*

**Hole 2 — Pine Needle Alley** (par 3, sim 8.87) — 3 strokes
- #1 wraith — intended power 0.92, executed 0.921, flew 5.2, 3.99 left. *That Wraith flight was too much power for that 4mph wind and 80-degree angle - I should have shaped it more gently.*
- #2 buzzz — intended power 0.41, executed 0.361, flew 3.41, 0.6 left. *That Buzzz throw was too much power for that 4mph wind, I should have shaped it more.*
- #3 judge — intended power 0.05, executed 0.05, flew 0.58, 0.02 left. *That Judge throw was pure luck, I needed that 0.02 unit landing to hole out.*

**Hole 3 — Elevation Drop** (par 4, sim 13.65) — 4 strokes
- #1 wraith — intended power 0.92, executed 0.934, flew 4.77, 8.9 left. *That Wraith throw was too much power for that 2 mph wind - I should have shaped it left instead of forcing it straight.*
- #2 wraith — intended power 0.92, executed 0.915, flew 2.89, 6.16 left. *That Wraith throw was too much power for that 2mph wind, I should have shaped it left instead.*
- #3 teebird — intended power 0.78, executed 0.791, flew 5.82, 0.34 left. *That Teebird was too much power for that wind, I should have shaped it straighter.*
- #4 judge — intended power 0.05, executed 0.05, flew 0.58, 0.24 left. *That Judge throw was pure control, letting the wind shape my shot perfectly.*

**Hole 4 — The Tunnel** (par 3, sim 10.92) — 2 strokes
- #1 wraith — intended power 0.92, executed 0.922, flew 7.12, 3.8 left. *That Wraith throw was too much power for that wind direction, I should have shaped it more gently.*
- #2 buzzz — intended power 0.39, executed 0.383, flew 3.54, 0.26 left. *That buzzz stayed true and landed soft, letting wind guide it to the hole.*

**Hole 5 — Risk/Reward** (par 4, sim 17.29) — 8 strokes
- #1 wraith — intended power 0.92, executed 0.959, flew 5.2, 12.09 left. *That Wraith throw was too much power for that 6 mph wind - I should have shaped it left instead of forcing it straight.*
- #2 wraith — intended power 0.92, executed 0.912, flew 1.72, 11.4 left. *That Wraith throw was too much power for that 6mph wind - I should have shaped it left instead of forcing it straight.*
- #3 wraith — intended power 0.92, executed 0.878, flew 4.84, 6.63 left. *That Wraith throw was too much power for that 6 mph wind, I should have shaped it left instead.*
- #4 teebird — intended power 0.92, executed 0.96, flew 6.29, 0.34 left. *That Teebird was too aggressive for the wind and distance.*
- #5 judge — intended power 0.05, executed 0.066, flew 0.76, 0.41 left. *That Judge throw was too much power for that wind direction, I should have shaped it more gently.*
- #6 judge — intended power 0.05, executed 0.061, flew 0.69, 0.27 left. *That Judge throw was too much power for that wind direction.*
- #7 judge — intended power 0.05, executed 0.095, flew 1.06, 0.78 left. *That Judge throw was too much power for that wind direction, I should have shaped it left instead.*
- #8 judge — intended power 0.07, executed 0.05, flew 0.56, 0.23 left. *That Judge flight was pure poetry in motion, landing just 0.23 units from the basket.*

**Hole 6 — Ace Run** (par 3, sim 7.05) — 4 strokes
- #1 teebird — intended power 0.92, executed 0.869, flew 6.08, 0.97 left. *That teebird was too aggressive for the conditions, I should have shaped it more gently into the wind.*
- #2 judge — intended power 0.08, executed 0.05, flew 0.59, 0.38 left. *That Judge throw was too much power for that windy pin location.*
- #3 judge — intended power 0.05, executed 0.088, flew 0.97, 0.59 left. *That Judge throw was too much power for that wind direction.*
- #4 judge — intended power 0.05, executed 0.05, flew 0.59, 0.01 left. *Perfect touch shot, controlled power, let the disc do the work.*

**Hole 7 — The Grove** (par 3, sim 10.92) — 6 strokes
- #1 wraith — intended power 0.92, executed 0.904, flew 7.05, 3.87 left. *My Wraith danced in that 40-degree wind but I lost control on the short side.*
- #2 buzzz — intended power 0.4, executed 0.389, flew 1.92, 2.97 left. *That Buzzz was too much power for that wind angle, ended up short and way too far from the basket.*
- #3 buzzz — intended power 0.27, executed 0.259, flew 2.71, 0.27 left. *That Buzzz throw was too much power for that 40-degree headwind - I should have shaped it more gently.*
- #4 judge — intended power 0.05, executed 0.05, flew 0.58, 0.31 left. *That Judge throw was too much power for that wind angle, just needed to shape it more gently.*
- #5 judge — intended power 0.05, executed 0.055, flew 0.63, 0.32 left. *That Judge throw was too much power for that wind angle, just needed to shape it more carefully.*
- #6 judge — intended power 0.05, executed 0.05, flew 0.58, 0.26 left. *That Judge throw was pure luck, the wind carried it perfectly short and it found the basket.*

**Hole 8 — Water Hazard** (par 4, sim 16.84) — 3 strokes
- #1 wraith — intended power 0.92, executed 0.918, flew 5.35, 11.74 left. *That Wraith throw was too much power for that 5 mph wind - I should have shaped it left instead of forcing it straight.*
- #2 wraith — intended power 0.92, executed 0.986, flew 7.34, 4.41 left. *That Wraith throw was too much power for that 5 mph wind - I should have shaped it left instead of forcing it straight.*
- #3 buzzz — intended power 0.49, executed 0.496, flew 4.16, 0.25 left. *That Buzzz felt perfect off the tee, just a touch short of the basket but that's exactly where I want it to land.*

**Hole 9 — Clubhouse Finish** (par 3, sim 9.33) — 4 strokes
- #1 wraith — intended power 0.92, executed 0.885, flew 3.66, 5.68 left. *That Wraith throw was too much power for that wind direction, ended up short and way off target.*
- #2 teebird — intended power 0.66, executed 0.696, flew 2.08, 4.09 left. *That Teebird felt like it was fighting the wind the whole way.*
- #3 buzzz — intended power 0.43, executed 0.367, flew 3.43, 0.66 left. *That Buzzz flight was too much power for that wind direction - should have shaped it more gently.*
- #4 judge — intended power 0.05, executed 0.07, flew 0.81, 0.15 left. *My controlled Judge shaped perfectly into that 3mph wind 290° crosser, finishing just 0.15 units from the basket.*

### Pip Hartley — The Rookie

**Hole 1 — The Opener** (par 3, sim 10.69) — 6 strokes
- #1 leopard3 — intended power 0.97, executed 0.951, flew 6.23, 4.57 left. *That Leopard3 felt amazing in the wind, definitely more control than I expected.*
- #2 comet — intended power 0.55, executed 0.639, flew 4.74, 0.49 left. *My Comet threw a perfect par 3, just a little short of the basket.*
- #3 aviar — intended power 0.05, executed 0.14, flew 1.43, 0.94 left. *My Aviar danced beautifully in that 3mph crosswind, finishing just .94 units from the basket - wind 3 at 20 degrees was perfect for this throw!*
- #4 aviar — intended power 0.08, executed 0.05, flew 0.59, 0.35 left. *That Aviar soared beautifully into that 20-degree headwind, finishing just 0.35 units from the basket - a perfect demonstration of how power and angle work together!*
- #5 aviar — intended power 0.05, executed 0.08, flew 0.91, 0.56 left. *My Aviar flew beautifully into that 3mph wind, just a little too much power for this throw.*
- #6 aviar — intended power 0.05, executed 0.05, flew 0.59, 0.02 left. *The Aviar danced in that crosswind, barely missing the basket but finding the chains!*

**Hole 2 — Pine Needle Alley** (par 3, sim 8.87) — 3 strokes
- #1 archangel — intended power 0.97, executed 0.97, flew 6.51, 2.42 left. *The Archangel screamed through that 80-degree wind throw, landing short but showing real power!*
- #2 comet — intended power 0.23, executed 0.32, flew 3.15, 0.75 left. *Comet felt great in the wind, just a bit too much power for this angle.*
- #3 aviar — intended power 0.06, executed 0.09, flew 1, 0.27 left. *That Aviar flighted perfectly into the 4mph wind and finished 0.27 units from the basket!*

**Hole 3 — Elevation Drop** (par 4, sim 13.65) — 4 strokes
- #1 leopard3 — intended power 0.97, executed 1, flew 4.75, 9.12 left. *That Leopard3 throw was a wake-up call for sure.*
- #2 archangel — intended power 0.97, executed 0.913, flew 6.35, 2.78 left. *The Archangel curled right into the wind, landing short and wide.*
- #3 comet — intended power 0.27, executed 0.197, flew 2.16, 0.64 left. *My Comet threw a perfect fade but I needed more distance into that 20 mph wind.*
- #4 aviar — intended power 0.05, executed 0.056, flew 0.68, 0.06 left. *The Aviar danced in that crosswind, landed short but holy, just 0.06 units from paradise!*

**Hole 4 — The Tunnel** (par 3, sim 10.92) — 4 strokes
- #1 leopard3 — intended power 0.97, executed 0.905, flew 3.82, 7.14 left. *That Leopard3 felt like it was fighting the wind the whole way!*
- #2 leopard3 — intended power 0.97, executed 0.917, flew 6.07, 1.08 left. *That Leopard3 throw was a wild ride, I can't believe how much wind it took to get it to finish that close!*
- #3 aviar — intended power 0.1, executed 0.05, flew 0.6, 0.49 left. *The Aviar's gentle turn into the wind was exactly what I needed for this tight par 3.*
- #4 aviar — intended power 0.05, executed 0.05, flew 0.53, 0.06 left. *My Aviar danced in that crosswind and found the basket perfectly!*

**Hole 5 — Risk/Reward** (par 4, sim 17.29) — 5 strokes
- #1 archangel — intended power 0.97, executed 0.984, flew 6.49, 10.82 left. *The Archangel buried short into the wind, learning how it responds to headwinds.*
- #2 archangel — intended power 0.97, executed 1, flew 3.3, 8.26 left. *That Archangel really danced in that 6 mph wind, finishing short and 8.26 units from the basket.*
- #3 archangel — intended power 0.97, executed 0.938, flew 6.5, 1.82 left. *My Archangel blew past the basket in the wind, landing short and 1.82 units away.*
- #4 aviar — intended power 0.18, executed 0.112, flew 1.19, 0.65 left. *Aviar sailed far short into 6mph wind, learned how to adjust for headwind distance.*
- #5 aviar — intended power 0.06, executed 0.05, flew 0.58, 0.08 left. *The Aviar danced in that crosswind, landed short but holy, banking into the basket!*

**Hole 6 — Ace Run** (par 3, sim 7.05) — 3 strokes
- #1 leopard3 — intended power 0.97, executed 0.969, flew 6.25, 1.25 left. *My Leopard3 soared but the wind pushed it left and short, gotta adjust my angle next time.*
- #2 aviar — intended power 0.11, executed 0.21, flew 2.01, 0.76 left. *My Aviar flew straight and true despite the headwind, finishing just short of the basket.*
- #3 aviar — intended power 0.07, executed 0.05, flew 0.58, 0.18 left. *The Aviar danced in that crosswind, barely missing the pin!*

**Hole 7 — The Grove** (par 3, sim 10.92) — 4 strokes
- #1 archangel — intended power 0.97, executed 0.952, flew 6.73, 4.2 left. *My Archangel flew too far left, I need to aim more right.*
- #2 comet — intended power 0.47, executed 0.535, flew 2.21, 2.89 left. *My Comet threw it short and left, wind made it drift back but still 2.89 units from basket.*
- #3 comet — intended power 0.28, executed 0.258, flew 2.68, 0.37 left. *That Comet throw was a lesson in patience, wind reading, and finding my disc's sweet spot.*
- #4 aviar — intended power 0.05, executed 0.05, flew 0.56, 0.2 left. *That Aviar throw was a perfect little daisy cutter that stayed true to the basket!*

**Hole 8 — Water Hazard** (par 4, sim 16.84) — 4 strokes
- #1 archangel — intended power 0.97, executed 0.821, flew 6.17, 10.69 left. *My Archangel blew past the basket in the wind, landing short and wide.*
- #2 archangel — intended power 0.97, executed 0.883, flew 6.14, 4.55 left. *My Archangel flew too far left into the wind, landing short and wide.*
- #3 comet — intended power 0.54, executed 0.434, flew 3.76, 0.79 left. *Comet went exactly where I expected, straight and true into the wind.*
- #4 aviar — intended power 0.07, executed 0.085, flew 0.93, 0.18 left. *That Aviar flighted perfectly into the breeze and found the basket!*

**Hole 9 — Clubhouse Finish** (par 3, sim 9.33) — 8 strokes
- #1 archangel — intended power 0.97, executed 0.985, flew 6.6, 2.86 left. *My Archangel flew straight and true, just a bit too much power for this windy par 3.*
- #2 comet — intended power 0.27, executed 0.55, flew 4.44, 1.58 left. *Comet flew too far left into the wind, landing short and wide.*
- #3 aviar — intended power 0.15, executed 0.21, flew 2.01, 0.43 left. *That Aviar sailed too far left into the stiff wind, landing short and close to the basket.*
- #4 aviar — intended power 0.05, executed 0.185, flew 1.79, 1.35 left. *My Aviar cried out in protest at that 290-degree wind, finishing 1.35 units short with a powerful 0.05 disc.*
- #5 aviar — intended power 0.12, executed 0.201, flew 1.96, 0.6 left. *My Aviar danced in that crosswind like a leaf, finishing just short of the basket.*
- #6 aviar — intended power 0.05, executed 0.09, flew 1.02, 0.43 left. *My Aviar flew short and right, wind 3 at 290 degrees, 0.43 units from basket, good learning experience!*
- #7 aviar — intended power 0.05, executed 0.12, flew 1.25, 0.81 left. *My Aviar flew beautifully into the 3mph wind, finishing just 0.81 units from the basket - that's a perfect throw!*
- #8 aviar — intended power 0.07, executed 0.05, flew 0.59, 0.23 left. *The Aviar's flight path was perfect, just a touch too much left bias and I missed the basket by a hair!*
