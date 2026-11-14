# The Triples Library

Memory that survives death, stored as proven plans.

A citizen's body, inventory and process state reset when it dies or is
restarted. This library does not: it is an append-only store of
**(situation → plan → verified outcome)** triples, kept in the league commons
outside every citizen's body and process. When a loop or a lane hits a
situation — a wedged relocate, a craft failure, a collect that does nothing —
the lane consults the matching triples *before* inventing a new attempt. A
triple is not advice. It is a plan that was run in the world, and the world
evidence that judged it.

The pattern is JARVIS-1's episodic memory (store the situation signature with
the plan that worked, retrieve the nearest proven plan at planning time) and
Voyager's verified skill library (only verified artefacts are admitted),
with the league's stricter verifier: outcomes are judged from world state —
inventory deltas, block scans, state feeds, server log lines — never from a
citizen's or a model's self-report.

## Files

- `triples.jsonl` — the library. One JSON object per line, append-only.
- `retrieve.py` — the retrieval tool (see below).
- `allocate.py` — the id allocator and the library's single write path (see "Id allocation" below).
- `validate.js` — the library checker and the new-entry gate (see "Verification status & reconciliation" below).
- `reconcile.js` + `reconciliation.jsonl` — the Mt. Moon pass and its appended verdicts (same section).
- `PROVENANCE-MIGRATION-20261108.md` — the migration record for the verification layer: schema, backfill table, first reconciliation run.
- `README.md` — this format definition.

## The triple format

Every triple carries five fields:

| Field | Contents |
|---|---|
| `id` | `triple-NNN-<slug>`, unique, never reused. |
| `situation` | The situation signature (rules below) plus the facts that make it recognisable. Always includes `kind` and `signature_terms`. |
| `plan` | The artefact that was run: a route id, a skill/script reference, a consult answer's id — plus the `rules` the run established and file `refs`. A plan that cannot be re-run from this field does not belong in the library. |
| `outcome` | `status` — exactly one of `pass`, `fail`, `unverified` — plus a `verdict` naming the judging evidence, and `deaths_cost` (integer; what the run cost in citizen deaths). |
| `provenance` | `citizen`, `lane`, `date`, and `evidence`: a list of pointers (`ledger:<entry-id>` or `file:<league-relative-path>`) that must resolve. An evidence pointer that does not resolve is a defect in the triple, not a detail. |

Plus `epoch`: the world/build context the outcome was earned in (server
build, world state). A triple from a prior epoch may still be served, but it
is served *as* prior-epoch knowledge — coordinates and mechanics can die with
their epoch.

## Situation signatures

A signature is a set of facts **computable from feed, survey or server
state** — never from impression. The computable core:

- **Position class.** Chebyshev distance from world spawn (32, −96) and
  inside/outside the spawn-protection square (x∈[16,48], z∈[−112,−80] on
  this world). Computable from the state feed's position alone.
- **Survey facts.** Column tops, canopy headroom, trunk cells, route
  geometry — from the league's survey artefacts (`pulse/shoulder-survey.json`,
  `pulse/cell-survey.json`) or a fresh scan.
- **Inventory facts.** Per-type counts (planks counted *by type*, never by
  total), presence of table/pickaxe/food.
- **Threat facts.** Daylight state verified server-side (world time-of-day
  from the server log or feed — never from a sender's claim), hostile
  proximity from the feed, standing threats from the mob map.
- **Error surface.** The exact thrown error or the exact absence: a dig that
  returns without a block change, a join that places identically across a
  restart. Absences are signatures too, when they are measured.

`signature_terms` is the retrieval vocabulary: short normalised phrases
drawn from the facts above (`relocate`, `canopy`, `spawn-protection`,
`recipe-variant`, …). Terms are added when a triple is seeded; a lane
querying in the same vocabulary finds it.

## Outcome discipline

- **pass** — the plan ran and world evidence confirms the intended result.
- **fail** — the plan ran and world evidence confirms it did not work.
  Failures are first-class entries: a fail triple with its bug named is
  worth more than a pass, because it retires a whole family of retries.
  A plan that failed is never re-run identically; a revised plan is a new
  triple that cites the fail it supersedes.
- **unverified** — the diagnosis is proven and the plan is built, but no
  lane has yet recorded the plan working (or failing) in the world. An
  unverified triple is served clearly marked as such. It is never cited,
  summarised or counted as a pass — by any lane, in any report.

Deaths are part of the outcome, always: a pass that cost 40 deaths and a
pass that cost 0 are different plans.

## Id allocation and re-identification

Ids come from one place only: `allocate.py`. **Never allocate an id by
counting lines or eyeballing the current maximum** — that is how the
library got duplicate 007s and 008s. Filing a triple:

```sh
python3 commons/triples/allocate.py --slug <slug> --entry <triple.json>
```

The allocator holds an exclusive lock across read-max → re-check →
append → verify, appends the entry as a single write (no torn lines),
and confirms the new id appears exactly once before releasing the lock.
`allocate.py --next` prints the advisory next id; it reserves nothing.

**Re-identification.** Existing lines are never rewritten. When two
entries share a number, the first in file order keeps it; each later
duplicate is renumbered by an appended **correction entry**
(`situation.kind` = `library-id-reassignment`) whose `plan.reids` names
`from` → `to`. The `to` number is reserved — no line bears it, the
allocator counts it as used — and citations resolve through the
correction entry to the original line. A renumbered triple keeps its
slug, so slug-based references stay stable; citations written before a
re-id resolve through the correction entry.

Filed instances (2026-11-08, ACTIONS item 3):

- `triple-007-dip-escape-route` (line 8; line 7's `triple-007-dig-face-travel`
  keeps 007) → **`triple-013-dip-escape-route`**, per correction entry
  `triple-012-reid-dip-escape-route`.
- `triple-008-stance-probe` (line 10; line 9's
  `triple-008-geist-collect-verified-chain-outcome` keeps 008) →
  **`triple-015-stance-probe`**, per correction entry
  `triple-014-reid-stance-probe`.

## Retrieval

```sh
python3 commons/triples/retrieve.py --situation relocate wedge canopy \
    --position 29.5 -101.5 --goal 64 -93
python3 commons/triples/retrieve.py --kind craft-chain-false-block
python3 commons/triples/retrieve.py --terms recipe-variant --include-unverified
```

Matching is declared, not magic — the tool prints the exact rule that
matched each returned triple:

- `--kind` matches `situation.kind` verbatim.
- `--situation` terms match against `signature_terms` (any-of).
- `--position x z` (with optional `--goal x z`) computes the position
  class (Chebyshev to spawn, inside/outside the protection square) for the
  body and the goal, and matches triples whose geometry or rules turn on
  that class.
- Passes and fails are returned by default; `unverified` triples are
  returned only with `--include-unverified`, and are printed marked.

## Adoption

The lanes adopt this library voluntarily, at the moment of need:

1. Before a lane's first attempt at a wedged relocate, a failed craft
  chain, a silent collect, or a join anomaly, it queries the library with
  the situation's terms and position.
2. A returned **pass** is the default plan. Deviating from it is the
  lane's right — the deviation and its reason go in the lane's ledger
  entry, so the library learns either way.
3. A returned **fail** is a fence: do not re-run that plan identically.
4. After the attempt, the lane files the new triple (or the outcome
  update) — the lane that used the library owes the library its verdict.
  Filing goes through `allocate.py` (see "Id allocation" above); the id
  in the entry is stamped by the allocator, never chosen by hand.
5. Nothing here rewires a live citizen loop. The actor's consult path and
  the seat libraries may read triples as provenance-stamped reference,
  under the same rule as the consult books: a triple is evidence about
  the past, never evidence about the present world.


## Verification status & reconciliation (added 2026-11-08, ACTIONS item 2)

Every triple now also carries a **`verification`** object — the
provenance layer the Anthropic memory paper's loop-closers had and this
library lacked (full record: `PROVENANCE-MIGRATION-20261108.md`):

| Field | Contents |
|---|---|
| `verification.status` | Exactly one of `confirmed`, `unconfirmed`. Grades whether the filing's evidence re-derives — a different axis from `outcome.status`, which grades the run. |
| `verification.source` | The single strongest provenance pointer (`ledger:<entry-id>` or `file:<league-relative-path>`) — the source a checker re-derives the claim from. Must resolve. |
| `verification.basis` | Required when `confirmed`: the world evidence the filing rests on, in words. |
| `verification.unconfirmed_reason` | Required when `unconfirmed`: why it cannot yet be confirmed. When in doubt, file `unconfirmed`. |

Rules:

- **New entries must carry `verification`** (plus the pre-existing
  `provenance.evidence`, which must resolve). Pre-check before appending:
  `node validate.js --file <candidate.json>` — it fails loudly, with the
  defects named, on a missing status, source or basis.
- **The reconciliation pass (the Mt. Moon pass)** re-checks the oldest /
  least-verified unconfirmed entries against their sources:
  `node reconcile.js` (oldest 5), `node reconcile.js --all`,
  `node reconcile.js --dry-run`. Verdicts are appended to
  **`reconciliation.jsonl`** — never into `triples.jsonl`, so retrieval is
  unaffected. A verdict is `confirmed` (every pointer re-resolves),
  `still-unconfirmed` (a pointer no longer resolves; the defect is
  named), or `refuted` — never assigned by the script: refutation is a
  lane's judgement that the cited evidence *contradicts* the claim,
  appended by hand in the same format, the wrong note killed in the open.
- An entry's **effective status** is its `verification.status` overridden
  by its latest reconciliation verdict. Reconciliation grades
  *provenance* (the sources exist and are what the entry rests on), not
  the plan's merit — read any scope note riding with a verdict before
  citing it.
- Pointers to off-box (Orin) sources are flagged as warnings by the
  validator: they rest on the filing lane's attestation, and are neither
  silently passed nor failed for being off-box.
- Whole-library check, any time: `node validate.js` (exit 0 = clean;
  warnings name the known, openly-carried defects).
