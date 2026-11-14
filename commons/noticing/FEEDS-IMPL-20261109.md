# FEEDS IMPLEMENTATION — the deliberation ledger feeds, made current and complete

**Filed:** 2026-11-10. **Lane:** noticing-feeds (parent-sequenced).
**Routed by:** `commons/noticing/report-2026-11-09.md` (after-close final), duty-wearers note 2 and its kill-criterion ledger (note 6): the deliberation-ledger feed requirement, named a second time, with the rider that a third naming, unacted, counts against the criterion's spirit. This filing is the acting. Report #3 can now name feeds that exist, are current, and carry the classes the final named invisible — and can also name, precisely, the one remaining gap (§5: the noticing tool does not yet READ them; the reader change is specced, not patched, per this lane's charter).
**Scope:** `ledger/deliberation/` feeds + one rebuild of its outputs; this filing; one league ledger line. `noticing.py` was NOT patched. No citizen was woken; no world contact.

---

## §1 The adopted design — extracted, and what "no feed exists" actually meant

**ADOPTED (cited).** The four-feed design is specified completely in `ledger/LEDGER-IMPL-20261109.md` §1 and `ledger/deliberation/README.md` ("Feeds"), built per Claude Code study §D (row shape §D.3) under the binding correction of noticing report #2 (the pulse ledger records the adoption in line `ledger-budgets-gate-impl-20261109`: "Four feeds per the noticing #2 correction"):

| Feed | Source (ADOPTED) | Grain (ADOPTED) |
|---|---|---|
| **A. Traces** | `pulse/direct-drive-trace*.jsonl` | One row per driver cycle call: route, model, tokens in/out/cached, provider `estimated_cost`, command result. **The source of every citizen-day driver number.** Failed calls (model-fail / parse-fail) emitted flagged, excluded from wc. Tier weights frozen: capable 1.0, fallback 0.1. |
| **B. Governor** | `ledger/mind-calls.jsonl` | Demoted to one feed among several: reconciliation of governor-routed trace cycles (study D.3, ±5%) + coverage accounting. **Never a source of day numbers.** |
| **C. Commissions** | `ledger/deliberation/feeds/commissions.jsonl` (format: `feeds/commissions.md`) | One entry per commission of model-using work that passes no metered route: seat commissions, Director windows, benches. `calls: null` = UNMETERED, never estimated; a number only when a filing or meter counts the calls (0 for evidenced op-bot windows). Caller classes (study D.3, per commissions.md): driver / judge / director / curator / booth. |
| **D. Consults** | `commons/consults/*.jsonl` | One row per citizen consult call. Counts only; the stores record no token usage, so tokens are GAP and wc is never assumed. Never folded into the driver baseline. |

All four adapters feed ONE call ledger, `ledger/deliberation/out/call-ledger.jsonl`, in the study D.3 row shape, rebuilt by `node build.js`.

**The honest correction to the premise this lane was handed.** The adapters existed and had run once — 2026-11-09 ~15:11 AKST, producing 1,980 call-ledger rows. The noticing final's sentence was nevertheless accurate from where the duty sits, in three separable ways, and this lane's work is exactly those three:
1. **Frozen at build time.** Feed A's file map stopped at day 10; feed C stopped at 12 entries (programme day 2026-11-09 only). Everything after — days 11–16 on DeepInfra primaries, scenarios #3/#4, the booth — was in no feed.
2. **Two classes missing entirely.** Feed C held **zero curator entries** (ledger impl §1, route 3: "Curator class: NO FEED AT ALL") and **zero booth entries** (the booth did not exist at build time; it was built the same evening).
3. **Unread by the duty.** `noticing.py` consults six books (governor, pulse, deaths, scoreboard, consults ×2). The deliberation ledger is not among them (§5 proves this over the live tool and specs the reader change).

**COMPLETED-BY-THIS-LANE (my calls, stated — not adopted text):**
- Feed A's map extended to the day 11–16 trace files as they actually lie at the pulse root (`direct-drive-trace-dayNN-20261110.jsonl`). Days 1–10 handling byte-unchanged (pre-patch source at `/tmp/trace-feed-before.js` on Thor; the map diff is six added lines + two comment lines).
- The feed-C backfill census of §3, entered one by one through the new writer helper (below), every entry citing its evidence file(s).
- Curator enters via **feed C** (commissions.md's caller-class list already names `curator` — that routing is ADOPTED; the entries are this lane's), at the grain its stores support: **one entry per manifest day**.
- A writer helper for feed C: `ledger/deliberation/feeds/commission-append.js` — validates the commissions.md fields and the calls discipline (number ≥ 0, or null), **refuses a duplicate id (exit 3, nothing appended)**, appends exactly one line. Dogfooded: all 14 backfill entries entered through it; a deliberate duplicate submission was refused and the feed verified append-only (the pre-backfill file is a byte-exact prefix of the current file).
- The rebuild (`node build.js`) and the diffs reported in §3 — including the two the rebuild exposed and this lane did NOT fix (§3, findings F1/F2).

Feeds A, B, D need no writer helper of their own, honestly: their stores are written by their producers (the drivers write traces; the governor writes mind-calls; consult callers append to the consult books). Their "writer" is the adapter + `build.js` re-run. A manual writer for them would be a second, divergent source — the failure class this programme keeps convicting.

---

## §2 Schemas (as built, unchanged by this lane)

- **Call-ledger row** (study D.3 shape, `out/call-ledger.jsonl`): `ts, citizen_day, citizen, caller_class, model, route, tier, weight, wc, trigger, tokens_in, tokens_out, tokens_cached, usd_est, decision_key, outcome_ref, outcome_ok, compiled_alt, source` (+ feed-C rows carry `calls` and `note`; failed-call rows carry `flags: [failed-call-no-usage, excluded-from-wc]`).
- **Commission entry** (commissions.md): `id, ts, programme_day, caller_class, agent, model, route, calls, usd_est, evidence, note`. `calls: null` and `usd_est: null` are the UNMETERED markers — a routing fact with evidence, never an estimate and never a zero.

---

## §3 Backfill census — what the feeds carry now

Rebuild output: `node build.js` → **call-ledger 1,980 → 3,139 rows** (trace-feed 3,099; commission-feed 26; consult-feed 14). Baseline untouched: window [2, 4, 10], β₀ 3.976, β_next 3.976 — **the budget does not fall** (see the one budget.json diff below).

**Feed A — days added (all figures from the rebuild; USD cross-checked against the day records and agreeing):**

| Day | Cycles | wc | USD (provider est.) | Governor-routed cycles |
|---|---:|---:|---:|---:|
| 11 | 31 | 31.0 | 0.0305 | 0 |
| 12 | 327 | 321.6 | 0.3604 | 6 |
| 13 | 209 | 209.0 | 0.2317 | 0 |
| 14 | 32 | 32.0 | 0.0315 | 0 |
| 15 | 268 | 196.9 | 0.0776 | 79 |
| 16 | 237 | 183.0 | 0.0839 | 60 |

The DeepInfra primaries the final named invisible ($0.0776 day 15, $0.0839 day 16, from their records) are now feed-A rows with those exact provider figures. Failed-call rows for these days ride flagged and excluded from wc, per the adopted adapter.

**Feed C — 12 → 26 entries** (append-only verified; unmetered 8 → 15):
- **Director 5 → 13:** salience pass #1; scenario #2 placement window (0 calls, op bot); loosening notes #2, #3, #4; scenario #3 authoring; scenario #3 placement window (0 calls, op bot, 03:01:48Z); scenario #4 authoring. (Authoring entries all `calls: null` — **scenario allowance A remains GAP**, unchanged and now stated against 8 unmetered director entries instead of 3.)
- **Booth 0 → 2:** booth build (unmetered lane calls) + the day-11 episode render (0 API calls, local Woof TTS on the Orin, $0 marginal per the booth filing).
- **Curator 0 → 4:** one entry per manifest day — 2026-11-07 (529 rows), 2026-11-08 (316), 2026-11-09 (161), 2026-11-10 (123) — each `calls: 0, usd_est: 0`, evidenced by `~/curator/manifests/manifest-<day>.jsonl` and by `~/curator/curator.py` itself: the curator scores by local heuristics over the digest/scoreboard/pond stores; its source contains no model/API call, and its novelty term is null (`jepa-unverified-resident`). Zero here is an evidenced zero, not an absence of records — the distinction ledger impl route 3 could not make at build time because no commission entries existed.
- **Judge 7 (unchanged):** the 5 deliberation entries (ZCode / MCode / parent / synthesis+addendum / Claude Code study — all UNMETERED, subscription routes) + Woof and Mirage benches (0 API calls, local). The deliberation takes + SEAT-LOG on the studies shelf were re-checked: every take is already entered; no deliberation event with surviving evidence was missing.

**Feed B:** reads the live governor ledger at rebuild: 2,399 → **2,614 rows** (coverage accounting current to the rebuild minute).
**Feed D:** 14 consult rows, **unchanged** — no consult has been written to the consult books since the build; the feed is current by construction, and its silence is a routing fact (the period's consultations were commissioned as deliberation seats, feed C), exactly as the partial read it.

**The one budget.json diff (complete list):** `assets[0]` (furnace-sequence) — `live_uses 0 → 7` (its `uses[]` as the skills store now stands), `proven false → true` under build.js's own bar (≥5 uses); `retired_share` stays 0, credit stays 0, **β_next stays 3.976 and the budget does not fall**. Every other budget field is byte-identical to the pre-rebuild file. This lane reports the diff; it does not rule on it — the budget-numbers question (the study's (d)) is not this lane's.

**Findings the rebuild exposed (named, NOT fixed by this lane):**
- **F1 — Feed B reconciliation now breaches its tolerance.** Rebuilt: trace governor cycles 524 vs governor `cody-driver` receipts 608 → **deviation +84 = +16.0%, `within_tolerance_5pct: false`** (at build time: +3.7%, within). The adapter compares ALL receipts against span-matched trace cycles; receipts outside every trace span (failover probes, wake checks, the failover-era traffic of days 12/15/16) grew the numerator after the original build. Owner: the ledger lane, at its next build — the honest choices are span-matching the receipt total or re-deriving the tolerance; silently absorbing it here would have hidden exactly the class of drift study D.3 exists to catch.
- **F2 — Days 11–16 carry no validity ruling.** `build.js`'s VALIDITY table stops at day 10, so `out/per-day.json` now carries day 11–16 stats with **no validity field**. This lane did not invent rulings: validity is ruled by study D.4 inspection against the day records, and it is the ledger lane's call. Until ruled, days 11–16 are coverage, not baseline candidates — the baseline window is unmoved either way.

**Dark spans (not backfilled, by the evidence rule):**
- **Day 17 (feed A): no trace exists** — the day never launched (the rehearsal gate held). There is nothing to feed; the absence is the record.
- **Day 8 (feed A): no trace exists** — the citizen was not woken. Same standing note as the original build.
- **Seat-subscription calls (feed C, 15 unmetered entries): dark in call units permanently, until a seat/provider usage export is adopted as a metered adapter** (commissions.md's own supersession rule). The entries evidence that the work happened and what it produced; no number exists in any house store, so none is carried.
- **Director authoring calls: dark in call units** (8 unmetered director entries) — the direct cause of A = GAP, restated with its current census.
- **Curator before 2026-11-07: no manifests exist** (the curator's first manifest day is 2026-11-07); nothing precedes it to backfill.

---

## §4 Forward discipline — who writes, and how the duty verifies liveness

| Feed | Who writes new rows | When | How report #3 verifies liveness |
|---|---|---|---|
| A. Traces | The citizen-day driver itself (its trace file at the pulse root); the day lane adds the new file to `trace-feed.js`'s map in its close checklist | Every citizen day | Rebuild, then: `out/per-day.json` must carry the latest citizen day, and `out/call-ledger.jsonl` must contain `source: trace-feed` rows with that day's number. A citizen day with a filed record but no per-day entry = the feed is stale, and the report names it. |
| B. Governor | The governor, live, as it routes | Continuous | Coverage block in `out/per-day.json`: `governor_feed_coverage.total_rows` must equal the live line count of `ledger/mind-calls.jsonl` at rebuild; a mismatch is a stale rebuild, named as such. |
| C. Commissions | **The commissioning lane itself, at its close, via `feeds/commission-append.js`** — no entry, no invisible work: a lane that consumed model calls on an unmetered route and files no commission entry has spent off-book, and its handoff check (parent) verifies the entry exists | At lane close | Entries with `ts` inside the window, printed by class with the unmetered count beside any sum (commissions.md's rule). A window whose pulse ledger shows director/booth/curator/deliberation filings but whose feed C shows no entries = stale feed, named. |
| D. Consults | The consult caller, appending to `commons/consults/*.jsonl` at call time (existing discipline) | At call time | Row count and in-window rows are read directly; feed D adds nothing to hide behind. An honest zero in-window is printed as a routing fact, not an absence of consultation (the partial's reading, kept). |

**Rebuild rule:** after any feed change (a new trace day, a commission append, a consult), the owning lane re-runs `node build.js` in `ledger/deliberation/` and the rebuild's console summary (window, β₀, rows) is quoted in its filing. The call ledger's maximum `ts` / latest `citizen_day` is the feeds' liveness timestamp.

---

## §5 Step 3 — can the noticing duty read them today? NO. Evidence, then the spec.

**The run.** After the rebuild: `python3 ~/craftmind-league/commons/noticing/noticing.py --day 2026-11-09 --out /tmp/feeds-impl-scratch-2026-11-09.md` → `window calls=397 mind_s=3005.8 denied=0 deaths=20` (scratch path only; the canonical filed final was never a destination — the housekeeping guard would refuse it regardless). The scratch output, checked mechanically:
- Its **books consulted are the same six** as the filed final's — the deliberation ledger, the call ledger, and the commissions feed appear **nowhere** in the output (the strings `deliberation`, `commission`, `call-ledger` do not occur in the scratch file outside this sentence's subject: they do not occur at all).
- Its governor consumption table is **identical** to the filed final's (397 calls, 327 ok, 3,005.8 mind-s, 3,121,175 tokens) — correct, and unchanged by anything this lane built.
- The window's feed-C entries that a reader COULD have shown for 2026-11-09 (programme_day) — 5 deliberation (all UNMETERED), 8 director, 2 booth, 1 curator (161 cycles) — and feed A's in-window trace rows for citizen days 11–14, appear **nowhere**.

**Verdict: NOT PICKED UP.** The feeds exist and are current; the duty's instrument does not read them. This is the same gap the final named ("UNMET at this run in every book this duty reads"), now reduced to a single, exactly-shaped reader change:

**READER SPEC — for the noticing duty's next housekeeping slot (the housekeeping lane's discipline applies: flag logic verified over the real store, the filed reports never edited):**
1. **Books consulted:** add two entries — `Deliberation ledger (feeds A–D): ~/craftmind-league/ledger/deliberation/out/call-ledger.jsonl (N lines)` and `Commission feed: ~/craftmind-league/ledger/deliberation/feeds/commissions.jsonl (N lines)`.
2. **New section**, immediately after "Consumption — governor mind-calls", titled `## Consumption — non-governor routes (deliberation ledger)`, built ONLY from `out/call-ledger.jsonl` rows with `ts` inside the window:
   - `source = trace-feed`: print rows, wc sum, and USD sum, grouped by `citizen_day` (label: driver class, provider-metered).
   - `source = commission-feed`: print entries grouped by `caller_class`; sum `calls`/`usd_est` over numeric entries only; print the count of `calls: null` entries beside any sum as **UNMETERED ×n** (commissions.md's printing rule). Never a class total without its unmetered count.
   - `source = consult-feed`: **skip in this section** — the tool already reads `commons/consults/*.jsonl` directly; printing feed-D rows here would double-count the judge class. State the skip in one line.
   - `source = governor` rows do not exist in the call ledger by construction; the governor section remains the only governor numbers (feed B is reconciliation, never a source — the spec must not let the call ledger become one).
3. **Stale-feed flag (rule-flagged section):** if the call ledger's maximum `ts` precedes the window's close while the pulse ledger carries in-window filings, print: "**Deliberation feeds stale:** the call ledger's last row is ⟨ts⟩, before this window closed, while the pulse ledger filed ⟨n⟩ lines in-window — the non-governor routes above are a floor, not the day." (The F1/F2 findings of §3 are the worked example of why this flag exists.)
4. **Do not change:** the governor table, the deaths derivation, the contributions section, the flag logic as repaired by the housekeeping lane. The new section is additive; report #3 is its first live use.

With that one change, report #3 names the feed requirement **acted on and read** — the kill-criterion ledger can close the item instead of naming it a third time.

---

## §6 What this lane did not do

Patch `noticing.py` (specced in §5 instead); rule validity for days 11–16 (F2); repair feed B's reconciliation (F1); answer the budget-numbers question (d) beyond the budget.json diff reported in §3; estimate any unmetered route; wake any citizen; touch any world.

Filed by the noticing-feeds lane, 2026-11-10. Every figure above reproduces from the stores cited: `node build.js` in `ledger/deliberation/`, the feed files themselves, and the scratch run at `/tmp/feeds-impl-scratch-2026-11-09.md`.
