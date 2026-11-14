# Migration note — triples provenance + verification status (2026-11-08)

ACTIONS item 2 (research-trail repo), from the ZCode Anthropic-memory take
(`seat-takes/zcode-anthropic-memory-20261108.md`): every triple now carries a
**verification status** and a **re-derivable source**, and the library has a
**reconciliation pass** (the Mt. Moon pass) that re-checks entries against
their sources and appends verdicts in the open.

Lane: triples-provenance-reconciliation (claim
`triples-provenance-reconciliation-claim-20261108`, handback
`triples-provenance-reconciliation-handback-20261108` in `pulse/ledger.jsonl`).

## What changed

1. **`triples.jsonl` — every entry gained a `verification` object**
   (additive only; no field removed, renamed or semantically altered).
   Backups: `triples.jsonl.bak-provstatus-20261108` (pre-backfill, 13 lines,
   sha256 d5e058b7…a5876) and `triples.jsonl.bak-provstatus2-20261108`
   (15 lines, pre-supplement, sha256 e8362a13…8838).
2. **NEW `validate.js`** — the library checker + the new-entry gate.
3. **NEW `reconcile.js`** — the Mt. Moon pass; verdicts land in
   **`reconciliation.jsonl`** (new, append-only), never inside
   `triples.jsonl`, so `retrieve.py` is unaffected.
4. **README.md** — gained the "Verification status & reconciliation"
   section (schema, commands, rules).
5. This note.

## The schema addition

```json
"verification": {
  "status": "confirmed | unconfirmed",
  "source": "<pointer a checker re-derives the claim from —
              ledger:<entry-id> or file:<league-relative-path>>",
  "checked": "2026-11-08",
  "basis_method": "provenance-backfill-20261108",
  "basis": "<for confirmed: the world evidence the filing rests on>",
  "unconfirmed_reason": "<for unconfirmed: why it cannot yet be confirmed>"
}
```

- `provenance.evidence` (pre-existing) is unchanged: the filing's pointer
  list. `verification.source` names the single strongest of them.
- A **confirmed** entry must carry `basis`; an **unconfirmed** entry must
  carry `unconfirmed_reason`. The validator enforces both.
- `outcome.status` (pass/fail/unverified) is a different axis and is NOT
  touched by this migration: it grades the run; `verification.status`
  grades whether the filing's evidence re-derives.

### Example — before / after (triple-001, abbreviated)

Before: `{ "id": "triple-001-shoulder-route2", "situation": {…},
"plan": {…}, "outcome": {"status": "pass", …},
"provenance": {"citizen": "Cody", "lane": "pulse (Lineage A)",
"date": "2026-11-08", "evidence": ["ledger:shoulder-wedge-fix-20261107",
…]}, "epoch": "…" }`

After: the same object plus
`"verification": {"status": "confirmed",
"source": "ledger:shoulder-wedge-verdict-20261107",
"checked": "2026-11-08", "basis_method": "provenance-backfill-20261108",
"basis": "Filing verdict rests on live world state: measured displacement
across the shoulder cells + the S1 pass recorded in
commons/SCOREBOARD.jsonl. All 5 provenance pointers re-resolve at
backfill."}`

## Coordination event (read before judging the timeline)

Two lanes claimed `commons/triples/` ten seconds apart
(allocator `triples-allocator-claim-20261108` at 20:41:20Z, this lane at
20:41:30Z) — neither claim was visible to the other at check time. The
allocator lane appended its re-id correction entries (lines 14–15) while
this lane's backfill was in flight. Resolution, per the shared-state
discipline (reconcile by reading live state, never restore over newer
writes): this lane re-read the live file (15 lines), folded the two new
entries into the schema with verification supplements of their own, and
left the allocator's work untouched. Net effect: item 3's fix LANDED
(duplicates renumbered openly: cite `triple-013-dip-escape-route` and
`triple-015-stance-probe` from 2026-11-08 on; original lines stand).

## Backfill table (all 15 entries)

| Entry | verification | Ground |
|---|---|---|
| triple-001-shoulder-route2 | confirmed | Live world state (displacement + SCOREBOARD S1); 5/5 pointers resolve |
| triple-002-sample-clone-cure | confirmed | Cure demonstrated on live bodies/store across the verdict chain; 5/5 |
| triple-003-burrow-reflex-v1 | confirmed | FAIL from the live night record (lane chain + stabilise escalation); 7/7 |
| triple-004-protection-square-collect | **unconfirmed** | Diagnosis proven, plan never run at filing; superseded by 008-geist for the collect claim |
| triple-005-craft-variant-discipline | confirmed | Vega S1 pass (SCOREBOARD 08:33:54Z); 9/9 |
| triple-006-arrival-mark-survey | **unconfirmed** | Design artefact only, never run; its 4 file pointers resolve (the design exists; the plan is unproven) |
| triple-007-dig-face-travel | confirmed | [ctl]/[dig] world-evidence tests in vega.out + mechanism ledger pair; format defect noted in `basis` (free-text pointers; one source off-box on the Orin) |
| triple-007-dip-escape-route → cite as **triple-013** | confirmed | FAIL from 3 measured runs + survey artefacts; anchors/files resolve; format defect noted in `basis` |
| triple-008-geist-collect-verified-chain-outcome | confirmed | Collect live-verified 08:08:44Z; precision: PASS grades the collect step only — the chain did not complete |
| triple-008-stance-probe → cite as **triple-015** | confirmed | Pre-registered probe; verdict from measured displacement data; 10/10 |
| triple-009-operator-latch-craft-close | confirmed | S1 pass it closed; 7/7 |
| triple-010-long-leg-hunt-veto-floor | confirmed | Incident record + floor-park artefact; 7/7 |
| triple-011-east-meat-run-margin-spent | confirmed | FAIL from server-verified .dat reads; precision: runs 2–3 died on operator contract errors — FAIL grades the food outcome, not the frozen v3 |
| triple-012-reid-dip-escape-route | confirmed | Reassignment verified against the file itself (lines 7–8) |
| triple-014-reid-stance-probe | confirmed | Reassignment verified against the file itself (lines 9–10) |

Rule applied throughout: entries whose evidence was live world-state at
filing = confirmed-with-source; anything resting on design or a lane's
say-so alone = unconfirmed; **when in doubt, unconfirmed** (004, 006).

## The tools

```sh
cd ~/craftmind-league/commons/triples
node validate.js                      # whole library: schema + pointer resolution
node validate.js --file cand.json     # pre-check ONE candidate entry before appending
node validate.js --entry '<json>'     # same, inline
node reconcile.js                     # Mt. Moon pass: oldest 5 unconfirmed
node reconcile.js --all               # every entry not yet confirmed
node reconcile.js --n 3 --dry-run     # print verdicts, append nothing
```

- The validator fails loudly (exit 1, named defects) on a candidate entry
  missing `verification`, `verification.source`, a `basis` for a confirmed
  status, or with any evidence pointer that does not resolve. Pointers to
  **off-box (Orin)** sources are reported as warnings, flagged as resting
  on the filing lane's attestation — never silently passed, never failed
  for being off-box.
- `reconcile.js` appends one verdict per sampled entry to
  `reconciliation.jsonl`: `confirmed` (all pointers re-resolve),
  `still-unconfirmed` (a pointer no longer resolves — defect named), or
  `refuted` (**never assigned by the script** — refutation is a lane's
  judgement that the cited evidence contradicts the claim, appended by
  hand in the same format: the Mt. Moon case, a wrong note killed in the
  open). An entry's effective status = its `verification.status`
  overridden by its latest reconciliation verdict.
- Reconciliation verdicts grade **provenance** (the sources exist and are
  what the entry rests on), not the plan's merit; scope notes ride with
  verdicts wherever a bare "confirmed" could be misread (see the first
  run, below).

## First reconciliation run (2026-11-08T20:44:42Z, `--all`)

Backfilled-confirmed entries carry their confirmation in the backfill
itself (every pointer re-resolved at backfill time), so the pass's sample
was the two unconfirmed entries:

| Entry | Verdict | Evidence |
|---|---|---|
| triple-004-protection-square-collect | confirmed (provenance) | 3/3 pointers re-resolve (ledger:geist-unpark-datacheck-20261107; file:commons/SCOREBOARD.jsonl; source pointer) + scope note: outcome stays `unverified`; collect claim superseded by 008-geist |
| triple-006-arrival-mark-survey | confirmed (provenance) | 5/5 pointers re-resolve (4 design files + source) + scope note: the plan has never been run; outcome stays `unverified` |

No entry was refuted: every pointer in the library re-resolves, and no
cited source contradicts its claim. The residual risks are named, not
hidden: two entries carry free-text pointer format defects (007 pair),
one pointer is off-box (Orin server log, triple-007-dig-face-travel), and
three entries carry precision caveats in their `basis` (003, 008-geist,
011) where a bare status would overclaim.

## Repeating the pass

A future lane runs exactly:

```sh
ssh -F ~/workspace/ssh/thor.config thor \
  'cd ~/craftmind-league/commons/triples && node validate.js && node reconcile.js --all'
```

No standing cron was created (none was ordered). Suggested cadence when
one is wanted: nightly, after the day's lanes hand back.
