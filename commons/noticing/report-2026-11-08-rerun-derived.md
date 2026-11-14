# Noticing report — programme day 2026-11-08 (AKST)

**The noticing duty** (Jameson's hat, Production Charter §4.3; Twelve Lives steal #1). Owner: the noticing duty, worn by the Pull until separately staffed. Window: 2026-11-08T09:00:00+00:00 → 2026-11-09T09:00:00+00:00 UTC. Sources are read, never written, by this report.

## The books consulted

- Governor ledger: ~/craftmind-league/ledger/mind-calls.jsonl (2399 lines)
- Pulse ledger: ~/craftmind-league/pulse/ledger.jsonl (305 lines, 1 unparseable)
- Deaths record (derived): ~/craftmind-league/pulse/deaths-record.jsonl (120 lines)
- Scoreboard: ~/craftmind-league/commons/SCOREBOARD.jsonl (794 lines)
- Consults (glm): ~/craftmind-league/commons/consults/glm.jsonl (12 lines)
- Consults (minimax): ~/craftmind-league/commons/consults/minimax.jsonl (2 lines)
- Governor config: 19 routed identities (cody-actor, cody-driver, syndicate-captain, syndicate-cob, syndicate-mari, syndicate-och, syndicate-verm, town-anka, town-ilya, town-maren, town-roster, town-runa, town-social, town-stian, town-stock, town-theo, town-tomas, town-vera, town-works); explicit budgets: cody, cody-actor, cody-driver, geist, geist-mind, pulse-smith, syndicate-captain, syndicate-cob, syndicate-mari, syndicate-och, syndicate-reflect, syndicate-verm, town-anka, town-ilya, town-maren, town-reflect, town-roster, town-runa, town-smith, town-social, town-stian, town-stock, town-theo, town-tomas, town-vera, town-works, vega; all other keys ride the permissive default.

## Consumption — governor mind-calls

Total: **273 calls, 604.2 mind-seconds**, 0 denied (429).

| identity | calls | ok | denied | mind-s | share | tokens |
|---|---:|---:|---:|---:|---:|---:|
| cody-driver | 137 | 137 | 0 | 523.5 | 86.6% | 679641 |
| vega | 6 | 6 | 0 | 41.1 | 6.8% | 11768 |
| town-reflect | 8 | 8 | 0 | 5.5 | 0.9% | 815 |
| town-roster | 18 | 18 | 0 | 5.4 | 0.9% | 2277 |
| town-smith | 4 | 4 | 0 | 4.9 | 0.8% | 515 |
| cody-actor | 29 | 29 | 0 | 4.9 | 0.8% | 16425 |
| town-maren | 9 | 9 | 0 | 3.4 | 0.6% | 1031 |
| town-anka | 7 | 7 | 0 | 3.1 | 0.5% | 869 |
| town-stian | 7 | 7 | 0 | 2.9 | 0.5% | 864 |
| town-tomas | 7 | 7 | 0 | 2.6 | 0.4% | 888 |
| town-works | 10 | 10 | 0 | 2.1 | 0.3% | 1009 |
| town-social | 7 | 7 | 0 | 1.8 | 0.3% | 846 |
| town-stock | 6 | 6 | 0 | 1.3 | 0.2% | 752 |
| town-ilya | 3 | 3 | 0 | 0.4 | 0.1% | 264 |
| town-vera | 3 | 3 | 0 | 0.4 | 0.1% | 261 |
| town-runa | 3 | 3 | 0 | 0.4 | 0.1% | 261 |
| town-theo | 3 | 3 | 0 | 0.4 | 0.1% | 261 |
| syndicate-reflect | 1 | 1 | 0 | 0.0 | 0.0% | 48 |
| syndicate-mari | 1 | 1 | 0 | 0.0 | 0.0% | 89 |
| syndicate-cob | 1 | 1 | 0 | 0.0 | 0.0% | 89 |
| syndicate-och | 1 | 1 | 0 | 0.0 | 0.0% | 89 |
| syndicate-verm | 1 | 1 | 0 | 0.0 | 0.0% | 89 |
| syndicate-captain | 1 | 1 | 0 | 0.0 | 0.0% | 89 |

## Deaths

2 in window (derived record + traces; total all-time: 120):

- #115 — 2026-11-09T04:57:29.686Z — Creeper (blown up) (Cody)
- #116 — 2026-11-09T04:57:38.916Z — Zombie (slain) (Cody)

## Contributions — where the stores support it

- Scoreboard: Vega, S2, attempt × 5
- Consults asked via glm: cody × 2
- Pulse ledger: 102 lines written in window; kinds: verdict 16, claim 14, handback 10, correction 10, preregistration 10, ? 6, declaration 4, amendment 4, incident 3, note 3, seat-take 2, census 2, lane-handback 1, lane-takeover 1, food-preflight 1, survey 1, build 1, announcement 1, preregistration-amendment 1, replication-filed 1, verdict-note 1, approval 1, world 1, grading-verdict 1, halt-and-restoration 1, charter-commit 1, actor-consult-filed 1, stage-setting 1, incident-fix 1, stage 1

Confirmations vs consumption (the TOWN-WANT-1 / D2 ratio) is **not computable from tonight's stores**: no town day has run, so no confirmation store exists yet. The ratio is specified in `~/npc-town/manifest/town-1-drafting-inputs.md`; this section carries it from the first town day.

## Noticed (rule-flagged)

- **Top imbalance:** `cody-driver` consumed 523.5 of 604.2 mind-seconds (86.6% of the day) in 137 calls — the day's thinking was mostly one citizen's driver.
- Heaviest single calls: `vega` averaged 6.8 mind-s/call over 6 calls — few calls, long thoughts.
- **Identity integrity:** spend under town cast body keys (town-anka 7 calls/3.1 mind-s, town-ilya 3 calls/0.4 mind-s, town-maren 9 calls/3.4 mind-s, town-runa 3 calls/0.4 mind-s, town-stian 7 calls/2.9 mind-s, town-theo 3 calls/0.4 mind-s, town-tomas 7 calls/2.6 mind-s, town-vera 3 calls/0.4 mind-s) on a day when the cast itself had not joined (cast manifest: 0 of 8 cast .dat cells still PENDING, which is the join record of truth — players/data listings also count operator test bodies and prove nothing). Spend under a citizen's key by anyone but that citizen is the seam incident class ruled on in TOWN-0 claim Amendment 7.
- No budget denials today: every metered call was served (all 200s above).

---
Kill criterion (Twelve Lives steal #1): if three consecutive reports name nothing anyone acts on, this report is theatre and stops — and the stop gets filed here. Lapse rule: if the report lapses twice, the lapse itself is the evidence for staffing the duty separately (Production Charter §9, move 4).
