# Round 1 — Acadia Pines (simulator), 2026-11-06

The league's first recorded round. Three citizens, 9 holes, Engine A physics with execution noise on (LEAGUE_NOISE=1) and the league ledger on (LEAGUE_LEDGER=1). Every throw below is a ledger line in `ledger/events.jsonl`; every narration line is a governor receipt in `ledger/mind-calls.jsonl`.

**Distance scale:** Engine A flies 3–8 units at full power (its drag term is not course-scale), so the card was played at 0.05× distance — hole shapes, pars, relative lengths, wind and disc trade-offs are the real Acadia Pines ones; absolute distances are compressed 20:1. Recorded as an engine calibration gap, not hidden. Capture radius 0.75 units; pick up at 8.

## Standings

| # | Citizen | Bag (D/F/M/P) | Throws taken (before → after) | Strokes | To par |
|---|---|---|---|---|---|
| 1 | Jules Okafor — The Surgeon | wraith/teebird/buzzz/judge | 620 → 648 | 28 | -2 |
| 2 | Mara Voss — The Bomber | boss/firebird/wasp/luna | 850 → 879 | 29 | -1 |
| 3 | Pip Hartley — The Rookie | archangel/leopard3/comet/aviar | 8 → 42 | 34 | +4 |

## Card

| Hole | Par | Card dist | Sim dist | Mara | Jules | Pip |
|---|---|---|---|---|
| 1 The Opener | 3 | 180 | 9.00 | 2 | 2 | 2 |
| 2 Pine Needle Alley | 3 | 210 | 10.50 | 2 | 3 | 8 |
| 3 Elevation Drop | 4 | 320 | 16.00 | 6 | 4 | 4 |
| 4 The Tunnel | 3 | 195 | 9.75 | 2 | 2 | 2 |
| 5 Risk/Reward | 4 | 380 | 19.00 | 5 | 6 | 4 |
| 6 Ace Run | 3 | 155 | 7.75 | 4 | 2 | 4 |
| 7 The Grove | 3 | 240 | 12.00 | 3 | 3 | 4 |
| 8 Water Hazard | 4 | 350 | 17.50 | 3 | 3 | 4 |
| 9 Clubhouse Finish | 3 | 175 | 8.75 | 2 | 3 | 2 |
| **Total** | **30** | | | **29 (-1)** | **28 (-2)** | **34 (+4)** |

## Did the rookie spray more? (dispersion evidence)

Battery proof (tests/test-execution-noise.js, same seed): rookie dispersion vs veteran dispersion is asserted at <55% — see test output. In this round itself:

| Citizen | Career throws at start | Mean |noise| power | Mean |noise| hyzer° | Mean |noise| aim° | Drive-landing dispersion (RMS, n=9 drives) |
|---|---|---|---|---|---|
| Mara Voss | 850 | 0.0283 | 1.18 | 1.02 | 1.244 |
| Jules Okafor | 620 | 0.0209 | 1.59 | 0.87 | 1.111 |
| Pip Hartley | 8 | 0.0886 | 7.51 | 4.86 | 1.157 |

Pip started with 8 career throws; the veterans with 850 and 620. Pip's mean release noise and drive scatter above do **not** exceed the veterans' — the round does not fully agree with the battery at n=9 drives (small sample; the battery is the controlled evidence, the round is the lived one). Over the round Pip's sigma scale also shrank as throws_taken climbed from 8 to 42 — practice, accruing mid-round.

## Mind spend (System Two narration, via the governor)

| Citizen | Narration calls | Mind-seconds |
|---|---|---|
| Mara Voss | 29 | 13.582 |
| Jules Okafor | 28 | 12.786 |
| Pip Hartley | 34 | 14.067 |
| **Total** | **91** | **40.435** |

Governor budget state after the round: `{"window_s":3600,"agents":{"cody":{"calls_used":0,"calls_limit":240,"mind_seconds_used":0,"mind_seconds_limit":300},"mara":{"calls_used":101,"calls_limit":120,"mind_seconds_used":50.178,"mind_seconds_limit":120},"jules":{"calls_used":100,"calls_limit":120,"mind_seconds_used":43.197,"mind_seconds_limit":120},"pip":{"calls_used":106,"calls_limit":120,"mind_seconds_used":46.118,"mind_seconds_limit":120}}}`

Narration failures: 0 of 91 throws (failed lines are marked in the shot log, never invented).

## Shot log

### Mara Voss — The Bomber

**Hole 1 — The Opener** (par 3, sim 9) — 2 strokes
- #1 firebird — intended power 0.93, executed 0.881, flew 6.4, 2.61 left. *That Firebird was supposed to be a statement, not a short field goal.*
- #2 luna — intended power 0.4, executed 0.391, flew 3.25, 0.64 left. *That Luna flight was a masterpiece of controlled power - the wind couldn't stop that beautiful hyzer turn!*

**Hole 2 — Pine Needle Alley** (par 3, sim 10.5) — 2 strokes
- #1 firebird — intended power 1, executed 0.917, flew 5.42, 5.29 left. *That Firebird was supposed to be a statement, not a surrender to the wind.*
- #2 wasp — intended power 0.66, executed 0.699, flew 5.03, 0.28 left. *That Wasp flight was a goddamn masterpiece, trust the hyzer and let it rip.*

**Hole 3 — Elevation Drop** (par 4, sim 16) — 6 strokes
- #1 boss — intended power 1, executed 0.988, flew 5.69, 10.32 left. *That Boss flight was a statement - 140-degree wind, 10.32 units from basket, but I'm not here for misses.*
- #2 firebird — intended power 0.99, executed 1, flew 2.88, 7.73 left. *That Firebird flight was a masterpiece of intentional overkill - the wind couldn't handle that hyzer angle!*
- #3 firebird — intended power 0.87, executed 0.847, flew 6.29, 1.47 left. *That Firebird threw like it was born for wind 2, but I'm not mad - just needed to trust the hyzer more.*
- #4 luna — intended power 0.24, executed 0.254, flew 2.4, 0.93 left. *That Luna flight was a statement - 140 degrees into 2mph wind, finished 0.93 units from basket, short. Power player, full-send, trust the big hyzer.*
- #5 luna — intended power 0.24, executed 0.269, flew 2.54, 1.61 left. *That Luna throw was a beautiful statement of power and precision - the wind couldn't handle my full-send hyzer line!*
- #6 luna — intended power 0.25, executed 0.223, flew 2.23, 0.61 left. *That Luna was a beautiful statement shot - big hyzer, full power, landed exactly where I wanted it to.*

**Hole 4 — The Tunnel** (par 3, sim 9.75) — 2 strokes
- #1 firebird — intended power 0.96, executed 1, flew 6.68, 3.07 left. *That Firebird was supposed to be a statement, not a shorty.*
- #2 luna — intended power 0.47, executed 0.443, flew 3.5, 0.43 left. *That Luna was a statement piece of art, throwing that big hyzer line right into the wind and still putting it right on the pin.*

**Hole 5 — Risk/Reward** (par 4, sim 19) — 5 strokes
- #1 boss — intended power 1, executed 0.97, flew 6.05, 12.99 left. *That Boss throw was a beautiful statement of power and intention, even if it landed short and wide.*
- #2 boss — intended power 1, executed 0.947, flew 3.8, 9.48 left. *That Boss throw was a beauty, 260 degrees into 6 mph wind, finished 9.48 units short - that's exactly how I like 'em!*
- #3 firebird — intended power 0.95, executed 0.94, flew 3.03, 6.48 left. *That Firebird was supposed to scream through that wind, not dance like a drunk bird.*
- #4 wasp — intended power 0.73, executed 0.713, flew 2.28, 4.81 left. *That Wasp was supposed to be a statement, not a shorty.*
- #5 wasp — intended power 0.64, executed 0.611, flew 4.67, 0.15 left. *That Wasp was a masterpiece of intentional misalignment - beautiful hyzer turn, zero second chances, just pure power and precision.*

**Hole 6 — Ace Run** (par 3, sim 7.75) — 4 strokes
- #1 firebird — intended power 0.87, executed 0.835, flew 6.25, 1.5 left. *That Firebird was supposed to be a statement, not a shorty.*
- #2 luna — intended power 0.24, executed 0.259, flew 2.45, 0.95 left. *That Luna was supposed to be a statement, not a shorty.*
- #3 luna — intended power 0.24, executed 0.263, flew 2.46, 1.51 left. *That Luna was supposed to fly 320 degrees into wind 2, but it landed short and 1.51 units from the basket - that's not how it's supposed to work!*
- #4 luna — intended power 0.24, executed 0.223, flew 2.18, 0.68 left. *That Luna was a statement shot - full-send hyzer right into the wind, landed short but still found the basket.*

**Hole 7 — The Grove** (par 3, sim 12) — 3 strokes
- #1 boss — intended power 0.97, executed 0.957, flew 7.92, 4.08 left. *That hyzer was a masterpiece, threw it like I was painting with wind.*
- #2 wasp — intended power 0.6, executed 0.592, flew 2.79, 2.32 left. *That Wasp was supposed to be a statement, not a short field goal.*
- #3 luna — intended power 0.36, executed 0.332, flew 2.9, 0.59 left. *That Luna flight was a masterpiece of controlled chaos - the wind ate it alive but I trusted the hyzer and it danced into the basket.*

**Hole 8 — Water Hazard** (par 4, sim 17.5) — 3 strokes
- #1 boss — intended power 1, executed 0.985, flew 6.1, 11.64 left. *That Boss throw was a masterpiece of intentional misalignment - the wind ate it clean and left me 11.64 units short, but I'm still hitting my line.*
- #2 boss — intended power 0.96, executed 0.911, flew 7.76, 3.88 left. *That Boss throw was a statement, not a miss - the wind was no match for that hyzer line!*
- #3 luna — intended power 0.6, executed 0.575, flew 4.07, 0.2 left. *That Luna flight was a masterpiece of intentional misalignment - the wind ate my hyzer like a hungry bear.*

**Hole 9 — Clubhouse Finish** (par 3, sim 8.75) — 2 strokes
- #1 firebird — intended power 0.92, executed 0.918, flew 3.51, 5.36 left. *That Firebird was supposed to be a statement, not a short-sided miss.*
- #2 wasp — intended power 0.67, executed 0.694, flew 5.02, 0.34 left. *That Wasp flight was a masterpiece of commitment and courage, statement complete.*

### Jules Okafor — The Surgeon

**Hole 1 — The Opener** (par 3, sim 9) — 2 strokes
- #1 teebird — intended power 0.79, executed 0.764, flew 5.74, 3.26 left. *That wind angle cost me the read, should have played it safe and let it roll.*
- #2 judge — intended power 0.43, executed 0.455, flew 3.45, 0.19 left. *That Judge flighted left and short, but the short game saved me on this par 3.*

**Hole 2 — Pine Needle Alley** (par 3, sim 10.5) — 3 strokes
- #1 teebird — intended power 0.85, executed 0.834, flew 5.94, 4.56 left. *That Teebird was too much power for that 4mph wind, I should have shaped it left instead.*
- #2 buzzz — intended power 0.53, executed 0.548, flew 1.96, 3.34 left. *That Buzzz needed more power and better angle against the wind.*
- #3 judge — intended power 0.44, executed 0.469, flew 3.51, 0.22 left. *That Judge was perfect for the conditions, just needed to shape it left and let it do the work.*

**Hole 3 — Elevation Drop** (par 4, sim 16) — 4 strokes
- #1 wraith — intended power 0.95, executed 0.999, flew 5.41, 10.61 left. *That Wraith flight was too aggressive for the conditions, ended up short and wide.*
- #2 teebird — intended power 0.86, executed 0.861, flew 2.2, 8.57 left. *That Teebird felt like I was forcing power into wind instead of letting it flow.*
- #3 teebird — intended power 0.77, executed 0.735, flew 5.6, 2.98 left. *That Teebird felt like a mistake from the start, wind 2 had me in a tough spot.*
- #4 judge — intended power 0.39, executed 0.346, flew 2.93, 0.05 left. *That Judge throw was pure luck, I needed that 0.05 unit finish to bail me out.*

**Hole 4 — The Tunnel** (par 3, sim 9.75) — 2 strokes
- #1 teebird — intended power 0.82, executed 0.815, flew 5.87, 3.88 left. *That power 0.82 was too much for that 5mph wind - should've shaped it more.*
- #2 judge — intended power 0.51, executed 0.503, flew 3.67, 0.22 left. *That Judge throw was pure luck, I should have laid up and putted.*

**Hole 5 — Risk/Reward** (par 4, sim 19) — 6 strokes
- #1 wraith — intended power 1, executed 0.998, flew 5.63, 13.41 left. *That Wraith throw was too much power for that 6 mph wind - I should have shaped it left instead of forcing it straight.*
- #2 wraith — intended power 0.87, executed 0.879, flew 3.42, 10.31 left. *That Wraith throw was too much power for that 6mph wind - I should have shaped it left instead of forcing it straight.*
- #3 teebird — intended power 0.85, executed 0.844, flew 3.14, 7.18 left. *That Teebird throw screamed "controlled power" but my shape was off, landing short and 7.18 units from the basket.*
- #4 buzzz — intended power 0.65, executed 0.669, flew 1.29, 7.59 left. *That Buzzz throw was too much power for that 6mph wind - I should have shaped it left instead of forcing it straight.*
- #5 teebird — intended power 0.73, executed 0.749, flew 5.67, 1.93 left. *That wind 6 at 260 degrees was brutal, my Teebird just couldn't handle the crosswind.*
- #6 judge — intended power 0.25, executed 0.254, flew 2.31, 0.39 left. *That Judge throw was perfect for the conditions, controlled power with the right shape.*

**Hole 6 — Ace Run** (par 3, sim 7.75) — 2 strokes
- #1 teebird — intended power 0.74, executed 0.778, flew 5.79, 1.96 left. *That wind 2 throw was too much power, my friend.*
- #2 judge — intended power 0.26, executed 0.241, flew 2.25, 0.29 left. *That Judge throw was perfect control, let it dance in that 2mph wind 20 degrees off target, landed short but within 0.3 units of the basket, that's the kind of precision that makes the short game beautiful.*

**Hole 7 — The Grove** (par 3, sim 12) — 3 strokes
- #1 wraith — intended power 0.83, executed 0.777, flew 6.61, 5.4 left. *That Wraith throw was too much power for that 40-degree wind, I should have shaped it more gently.*
- #2 buzzz — intended power 0.57, executed 0.587, flew 2.8, 3.37 left. *That Buzzz was too much power for that angle and wind - should have been more controlled with a lower flighted disc.*
- #3 judge — intended power 0.44, executed 0.442, flew 3.41, 0.07 left. *That Judge throw was pure luck, the wind carried it right to the basket.*

**Hole 8 — Water Hazard** (par 4, sim 17.5) — 3 strokes
- #1 wraith — intended power 1, executed 1, flew 7.38, 10.12 left. *That Wraith throw was too much power for that wind direction, I should have shaped it more gently.*
- #2 teebird — intended power 0.84, executed 0.803, flew 5.82, 4.3 left. *That Teebird throw was too much power for that wind direction, I should have shaped it more carefully.*
- #3 buzzz — intended power 0.52, executed 0.547, flew 4.37, 0.17 left. *That Buzzz felt perfect off the tee, controlled power with just enough fade to hold the wind.*

**Hole 9 — Clubhouse Finish** (par 3, sim 8.75) — 3 strokes
- #1 teebird — intended power 0.78, executed 0.778, flew 3.12, 5.67 left. *That teebird was too aggressive for the wind, I should have shaped it more gently.*
- #2 buzzz — intended power 0.58, executed 0.604, flew 2.15, 4.22 left. *That Buzzz throw was too much power for that 3mph wind - I should have shaped it left instead of forcing it straight.*
- #3 buzzz — intended power 0.52, executed 0.518, flew 4.28, 0.07 left. *That Buzzz flight was pure geometry, letting the wind shape my controlled power into that perfect short landing that found the basket.*

### Pip Hartley — The Rookie

**Hole 1 — The Opener** (par 3, sim 9) — 2 strokes
- #1 leopard3 — intended power 0.83, executed 0.656, flew 5.34, 3.66 left. *That Leopard3 went exactly where I expected, straight and true into the wind.*
- #2 aviar — intended power 0.51, executed 0.688, flew 4.31, 0.66 left. *The Aviar felt perfect in the wind, finishing right on the pin!*

**Hole 2 — Pine Needle Alley** (par 3, sim 10.5) — 8 strokes (picked up at max)
- #1 leopard3 — intended power 0.9, executed 1, flew 6.43, 4.09 left. *That Leopard3 throw was a lesson in wind reading, finishing 4 units short of the basket.*
- #2 comet — intended power 0.54, executed 0.591, flew 4.72, 0.97 left. *My Comet flew straight and true despite the crosswind, landing just short of the basket.*
- #3 aviar — intended power 0.21, executed 0.352, flew 2.91, 1.95 left. *My Aviar went short and right, wind 4 at 80 degrees, 1.95 units from basket.*
- #4 aviar — intended power 0.27, executed 0.355, flew 2.91, 1.05 left. *My Aviar went short and wide into the wind, another lesson in power and angle.*
- #5 aviar — intended power 0.21, executed 0.369, flew 3.01, 1.98 left. *The Aviar screamed through that 4mph wind but I'm still getting the hang of wind direction impact.*
- #6 aviar — intended power 0.27, executed 0.474, flew 3.5, 1.53 left. *My Aviar sailed short and wide into that 4mph wind, landing 1.53 units from the basket.*
- #7 aviar — intended power 0.21, executed 0.305, flew 2.57, 1.04 left. *My Aviar flew beautifully into that 4mph wind, just a touch short of the basket.*
- #8 aviar — intended power 0.21, executed 0.196, flew 1.93, 0.89 left. *My Aviar sailed short and wide into the wind, landing just 0.89 units from the basket.*

**Hole 3 — Elevation Drop** (par 4, sim 16) — 4 strokes
- #1 archangel — intended power 1, executed 0.938, flew 6.59, 9.41 left. *That Archangel felt so good in my hand but I'm still learning how power affects distance.*
- #2 leopard3 — intended power 0.85, executed 0.837, flew 1.61, 9.39 left. *That Leopard3 felt so different in the wind, slicing left when I expected it to hold course.*
- #3 leopard3 — intended power 0.85, executed 0.815, flew 5.76, 3.63 left. *That Leopard3 throw was a lesson in wind resistance and power management.*
- #4 aviar — intended power 0.5, executed 0.524, flew 3.65, 0.46 left. *My Aviar screamed into that 140-degree wind and somehow found the chains!*

**Hole 4 — The Tunnel** (par 3, sim 9.75) — 2 strokes
- #1 leopard3 — intended power 0.87, executed 0.929, flew 6.03, 4.02 left. *My Leopard3 died in the wind, short and wide, time to learn what works in this crosswind.*
- #2 comet — intended power 0.53, executed 0.508, flew 4.27, 0.7 left. *Comet flew straight and true, landing just short but still banking in for the easy par!*

**Hole 5 — Risk/Reward** (par 4, sim 19) — 4 strokes
- #1 archangel — intended power 1, executed 0.901, flew 6.27, 12.73 left. *The Archangel flew straight and true, landing short but close to the basket.*
- #2 archangel — intended power 0.9, executed 0.836, flew 2.21, 10.79 left. *My Archangel flew straight into the wind but landed ten units short of the basket.*
- #3 leopard3 — intended power 0.91, executed 1, flew 6.27, 4.8 left. *My Leopard3 sailed too far left into the 6mph wind, landing 4.8 units short of the basket.*
- #4 comet — intended power 0.57, executed 0.618, flew 4.66, 0.33 left. *Comet flew straight and true despite the wind, finishing just 0.33 units from the basket in the short landing zone.*

**Hole 6 — Ace Run** (par 3, sim 7.75) — 4 strokes
- #1 leopard3 — intended power 0.78, executed 0.699, flew 5.47, 2.56 left. *My Leopard3 sailed way short into the wind, guess I need more power for this angle.*
- #2 aviar — intended power 0.36, executed 0.435, flew 3.43, 0.87 left. *The Aviar's gentle fade was no match for this headwind, landing short and wide.*
- #3 aviar — intended power 0.21, executed 0.409, flew 3.19, 2.32 left. *Aviar went exactly where I expected, straight and true into the wind.*
- #4 aviar — intended power 0.32, executed 0.27, flew 2.39, 0.24 left. *The Aviar danced in that crosswind, came in low and fast, and found the chain!*

**Hole 7 — The Grove** (par 3, sim 12) — 4 strokes
- #1 archangel — intended power 0.87, executed 0.954, flew 6.36, 5.69 left. *My Archangel soared but the wind pushed it left and short, another lesson in power and angle.*
- #2 comet — intended power 0.62, executed 0.66, flew 4.88, 0.87 left. *My Comet threw a perfect fade but I needed more distance to clear the trees.*
- #3 aviar — intended power 0.21, executed 0.265, flew 2.41, 1.56 left. *My Aviar flew short and left, wind really effected this one.*
- #4 aviar — intended power 0.22, executed 0.123, flew 1.35, 0.25 left. *My Aviar danced in that crosswind perfectly, dancing short but finding the basket!*

**Hole 8 — Water Hazard** (par 4, sim 17.5) — 4 strokes
- #1 archangel — intended power 1, executed 1, flew 6.67, 10.96 left. *My Archangel screamed through that 5mph wind but I topped it big, way short of the basket.*
- #2 leopard3 — intended power 0.92, executed 0.764, flew 5.73, 5.23 left. *That Leopard3 felt like it was fighting the wind the whole way.*
- #3 comet — intended power 0.59, executed 0.54, flew 4.29, 1 left. *Comet flew too far left into wind, short of basket, need to adjust power and angle.*
- #4 aviar — intended power 0.21, executed 0.05, flew 0.57, 0.43 left. *That Aviar flighted perfectly into the wind and holy cow did it finish short!*

**Hole 9 — Clubhouse Finish** (par 3, sim 8.75) — 2 strokes
- #1 leopard3 — intended power 0.82, executed 0.927, flew 3.86, 5.31 left. *My Leopard3 cried wolf on the wind, finishing 5.31 units short of the basket.*
- #2 comet — intended power 0.6, executed 0.638, flew 4.79, 0.53 left. *Comet flew straight and true, landing just short but still banking in perfectly.*

> **Budget-window note:** the governor state printed above is its rolling 3600 s in-memory window, which still contained the quarantined Round 0 attempt (72 calls per citizen, 99.06 mind-seconds total — see logs/round-0-failed-attempt.md). The authoritative spend for Round 1 itself is the receipt sum in the table: 91 calls, 40.435 mind-seconds. Per-citizen window usage minus 72 calls / ~33 mind-seconds recovers the same figures.
