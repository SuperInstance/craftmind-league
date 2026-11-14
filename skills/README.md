# skills/ — the league skill library

Compiled assets in the Voyager/Gene shape: a skill is written rarely,
reused forever, and needs no market and no second citizen. It is DATA
(an executable plan over the driver's existing verb set) that a citizen
day's charter may adopt — never a driver patch.

## Admission rule (the write gate)

Nothing enters this library on filing discipline alone. An asset is
admitted only when ALL of the following hold:

1. **Provenance record, complete.** Every asset carries
   `derived_from` / `composed_of` / `created_by` / `trace_hash`
   (the SchematicProvenance shape): exactly which days, traces and
   records it was compiled from, with hashes a checker can resolve.
2. **Every step evidenced or marked.** Each plan step cites the held
   trace rows that evidence it, or is marked `UNPROVEN` in the asset
   itself. Smoothing an unevidenced step into the plan is the one
   unforgivable filing act here.
3. **An outcome-changing replay.** Before admission, the asset is
   replayed offline against at least one held day: step by step, where
   would it have diverged, and would the divergence have changed that
   day's outcome? An asset that would not have changed the day is
   filed as **NOT YET AN ASSET**, with the reason — not admitted.
4. **Verification from a store the actor cannot write.** The asset's
   completion test must read state the citizen cannot author (saved
   .dat parse, region-file block read, server log) — never the
   citizen's own says or the driver's result strings alone.

## Capital rule

A skill is capital only when reused. Each reuse is appended to the
asset's `uses[]` with its trace pointer and outcome. First use =
compiled hypothesis; second use = evidence; a use that fails files its
failure mode INTO the asset (new version), not around it.

## Assets

| Asset | Status | File |
|---|---|---|
| furnace-sequence v1.0.0 | ADMITTED-WITH-UNPROVEN-TAIL (S10–S11 never executed with full materials) | `furnace-sequence.v1.json`; compilation record `FURNACE-SKILL-20261109.md` |

*Library founded 2026-11-09, per the wave-2 study's headline: the
deliberation ledger is a thermometer; the skill library is the
compilation mechanism that produces the capital it measures.*
