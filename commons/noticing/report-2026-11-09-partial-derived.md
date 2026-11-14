# ⚠ COVERAGE — PARTIAL-DAY READ (read this first)

**This is report #2 of the noticing duty, filed PARTIAL-DAY, before the programme day closed.** Report #1 was corrected for exactly the opposite sin — a pre-close read filed as if final, its caveat living in another file. Per the correction's standing lesson, the partiality is printed here, in this header, in this file.

- **Chartered window:** 2026-11-09T09:00:00Z → 2026-11-10T09:00:00Z (AKST programme day 2026-11-09). The window is still open at filing.
- **Run at:** 2026-11-09T22:15Z. **Covered:** every event present in the stores at run time — the day's first ~13.25 hours. **Not covered:** the remaining ~10.75 hours of the day.
- **Supersession:** the canonical `report-2026-11-09.md` is reserved for the after-close run, which will supersede this partial (precedent: report #1's `-rerun-derived`). This partial supersedes `report-2026-11-09-interim-derived.md`, an earlier partial read of the same day (whose governor figures match this read because the ledger has not moved since; its deaths total was stale).
- **Contiguity:** report #1's window closed at this window's open. No gap, no overlap.
- **Integrity of what follows:** everything below this block is the verbatim output of `python3 ~/craftmind-league/commons/noticing/noticing.py --day 2026-11-09` (stdlib only), including the duty-wearer's notes the tool appends via its `--notes` channel. No machine-read figure has been edited. This block is the only prepended text.

---
# Noticing report — programme day 2026-11-09 (AKST)

**The noticing duty** (Jameson's hat, Production Charter §4.3; Twelve Lives steal #1). Owner: the noticing duty, worn by the Pull until separately staffed. Window: 2026-11-09T09:00:00+00:00 → 2026-11-10T09:00:00+00:00 UTC. Sources are read, never written, by this report.

## The books consulted

- Governor ledger: ~/craftmind-league/ledger/mind-calls.jsonl (2399 lines)
- Pulse ledger: ~/craftmind-league/pulse/ledger.jsonl (318 lines, 1 unparseable)
- Deaths record (derived): ~/craftmind-league/pulse/deaths-record.jsonl (120 lines)
- Scoreboard: ~/craftmind-league/commons/SCOREBOARD.jsonl (794 lines)
- Consults (glm): ~/craftmind-league/commons/consults/glm.jsonl (12 lines)
- Consults (minimax): ~/craftmind-league/commons/consults/minimax.jsonl (2 lines)
- Governor config: 19 routed identities (cody-actor, cody-driver, syndicate-captain, syndicate-cob, syndicate-mari, syndicate-och, syndicate-verm, town-anka, town-ilya, town-maren, town-roster, town-runa, town-social, town-stian, town-stock, town-theo, town-tomas, town-vera, town-works); explicit budgets: cody, cody-actor, cody-driver, geist, geist-mind, pulse-smith, syndicate-captain, syndicate-cob, syndicate-mari, syndicate-och, syndicate-reflect, syndicate-verm, town-anka, town-ilya, town-maren, town-reflect, town-roster, town-runa, town-smith, town-social, town-stian, town-stock, town-theo, town-tomas, town-vera, town-works, vega; all other keys ride the permissive default.

## Consumption — governor mind-calls

Total: **256 calls, 2524.2 mind-seconds**, 0 denied (429).

| identity | calls | ok | denied | mind-s | share | tokens |
|---|---:|---:|---:|---:|---:|---:|
| cody-driver | 256 | 256 | 0 | 2524.2 | 100.0% | 2487520 |

Routed identities with **no calls** this day: cody-actor, syndicate-captain, syndicate-cob, syndicate-mari, syndicate-och, syndicate-verm, town-anka, town-ilya, town-maren, town-roster, town-runa, town-social, town-stian, town-stock, town-theo, town-tomas, town-vera, town-works.

## Deaths

7 in window (derived record + traces; total all-time: 123):

- #117 — 2026-11-09T09:59:05.967Z — Phantom (slain) (Cody)
- #118 — 2026-11-09T09:59:43.370Z — Skeleton (shot) (Cody)
- #119 — 2026-11-09T10:00:00.065Z — Spider (slain) (Cody)
- #120 — 2026-11-09T10:00:11.415Z — Spider (slain) (Cody)
- #None — 2026-11-09T19:14:42.078Z — cause not recorded (Cody)
- #None — 2026-11-09T19:23:13.182Z — cause not recorded (Cody)
- #None — 2026-11-09T19:23:22.380Z — cause not recorded (Cody)

## Contributions — where the stores support it

- Scoreboard: no events in window.
- Pulse ledger: 30 lines written in window; kinds: verdict 10, claim 8, cameraman-cap-renewal-check 2, correction 2, incident 1, cameraman-cap-renewal-correction 1, incident-fix 1, note 1, cameraman-recovery 1, cameraman-fix-negative 1, cameraman-fix-positive 1, director-remediation 1

Confirmations vs consumption (the TOWN-WANT-1 / D2 ratio) is **not computable from tonight's stores**: no town day has run, so no confirmation store exists yet. The ratio is specified in `~/npc-town/manifest/town-1-drafting-inputs.md`; this section carries it from the first town day.

## Noticed (rule-flagged)

- **Top imbalance:** `cody-driver` consumed 2524.2 of 2524.2 mind-seconds (100.0% of the day) in 256 calls — the day's thinking was mostly one citizen's driver.
- Heaviest single calls: `cody-driver` averaged 9.9 mind-s/call over 256 calls — few calls, long thoughts.
- No budget denials today: every metered call was served (all 200s above).

## Duty-wearer's notes (interpretation, labelled as such)

**Coverage (the short form; the header block above this report carries the full statement).** This is a PARTIAL-DAY read, run 2026-11-09T22:15Z against a chartered window that closes 2026-11-10T09:00Z. It supersedes `report-2026-11-09-interim-derived.md`, an earlier partial read of the same day; the canonical `report-2026-11-09.md` is reserved for the after-close run, which will supersede this file (the precedent set by report #1's `-rerun-derived`). Report #1's window closed at this window's open — the series is contiguous, no gap, no overlap.

1. **What the instruments saw, and what they cannot see.** The consumption table above is complete *for the governor's meter*, and the meter saw almost none of the day. All 256 calls are day 3's governor-fallback traffic from the window's opening hours; the governor ledger stands at 2,399 lines, unchanged since the interim read earlier in this window. Everything after ran off-meter: day 9 (28 DeepInfra cycles, per its record), day 10 (DeepInfra primary; $0.0385 metered by the provider, not by the house), the deliberation (ZCode and MCode seats on subscriptions, a side-agent take, a synthesis; a Claude Code study still running at this read), the Director's build and remediation windows (operator bots, no mind-calls), and the Woof bench (local inference on the Orin). The pulse ledger sees the day's *filings* — 30 lines, and their kinds are the day's skeleton: the cameraman chain's recovery / fix-negative / fix-positive, the director-remediation, the day claims and verdicts — but not the deliberation's *spend*. The consult books read nothing: the day's consultations were commissioned as deliberation seats, not asked through the consult stores, so their silence is a routing fact, not an absence of consultation. The scoreboard's silence is the one clean silence: that instrument has discriminated before (Vega's S2 attempts, report #1), and today holds no scored attempts — day 10 was a playing day, not an exam. **Action named:** the deliberation ledger adopted in the synthesis (§4.4) must take feeds from the non-governor routes — provider call logs and seat commissions — or it inherits a meter that today reads 100% of a fraction that stopped growing in the window's opening hours. First sign it worked: a programme day whose deliberation appears in a consumption table.

2. **Denials: none, again.** This is the second consecutive report with zero budget denials while explicit budgets sit in the governor config. A budget that never denies is a counter that never moves — a decoration of the same class this programme has convicted before. **Action named:** the Claude Code study's open question (d) — where the deliberation ledger's budget numbers come from — should be answered against these two days of evidence; the study is already commissioned with that question, and this report is filed as its evidence. Numbers that cannot bind are not budgets.

3. **Deaths — the derivation agrees.** Deaths here come from the repaired derivation (the rebuilt record merged with trace death rows, deduplicated — this tool's mirror of `pulse/lib/deaths.js`): **total 123, seven in this window, zero in day 10's run** — agreeing exactly with day 10's own verdict, derived independently from the same store. The seven are day 3's four (09:59–10:00Z, the window's first hour: Phantom, Skeleton, two Spiders) and day 9's three (19:14–19:23Z). The trace rows for day 9's three carry no cause field, and the table above prints them as unrecorded; the causes per the day-9 verdict are: drowned in his own pit, then two zombie deaths at world spawn in the unheld night — stated as attribution from that verdict, not as a field read. One display gap, filed for the duty's next repair: this mirror prints the three trace-merged deaths without numbers where the JS derivation numbers them #121–#123; the counts agree exactly, so it is a labelling gap in the mirror, not a counting dispute. And the conjunction worth recording without claiming its causation: day 10 is the first citizen day run under a deaths counter proven to move and verified at close from the citizen's own store — and it is a day with no deaths.

4. **The top imbalance, read honestly.** The rule flags `cody-driver` at 100.0% of the day, and the flag is true of the meter and misleading about the day. Report #1's monopoly finding described the world the meter could see. Today's day was in fact the most plural in the record — three deliberation seats, a Director, a bench, a playing citizen — and the meter saw none of it. The finding of report #2 is not about the citizen. It is about the meter.

5. **Kill-criterion ledger (the accounting this criterion requires).** Report #1 (programme day 2026-11-08, as corrected by its closed-window rerun): named the `cody-driver` monopoly (86.6% of that day, closed-window figures) — **acted on**: the read is cited as evidence in the deliberation synthesis (§5, plurality deferrals) and in the parent take (R3) for deferring the cartridge / attention-market / skill-market machinery ("no market with one buyer"); and report #1's deaths reading, which then came from the frozen tracker, is the direct reason this duty's own deaths instrument was rewired to the repaired derivation before report #2 (repairs filed 2026-11-09; the pre-repair tool is preserved in this directory). Report #2 (this report): names the ledger-feed requirement and the budget-number evidence in notes 1–2, both routed to work already chartered (synthesis §4.4; the Claude Code study). **Consecutive reports naming nothing anyone acts on: 0 of 3.** The criterion is not near firing, and the duty says so in its own report, as chartered.

---
Kill criterion (Twelve Lives steal #1): if three consecutive reports name nothing anyone acts on, this report is theatre and stops — and the stop gets filed here. Lapse rule: if the report lapses twice, the lapse itself is the evidence for staffing the duty separately (Production Charter §9, move 4).
