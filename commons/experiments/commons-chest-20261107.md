# Experiment: The Commons Chest (Night Study 3, experiment #2)

- **Declared:** 2026-11-08T07:46:44Z (ledger `commons-chest-experiment-prep-20261107`, filed BEFORE any placement attempt)
- **Status at this writing (2026-11-08T08:57Z): PREPPED, NOT PLACED.** Placement is blocked on substrate, not design — see "Placement attempts" below. The experiment begins when the chest exists in the world; nothing about the citizens' side has been touched, seeded, or announced.

## Design (from the study)

One chest on neutral ground between the two communities, announced ONLY as a world fact: a sign at the chest. No citizen is told anything — no loop changes, no consult seeding, no actor prompt changes. The citizens discover it or they don't.

## Site

- **Chest cell: (63, 68, −82)**, standing on grass_block top 67. **Sign cell: (64, 68, −82)** (standing sign, east face of the chest). Temporary crafting-table cell (64, 68, −83), to be removed by the placing bot's own accounting if used.
- **Why this cell:** ~11.1 blocks from Cody's anchor (64, 67, −93), ~10.0 blocks from Vega's anchor (63, 67, −72) — near-equidistant. Flat 67-top plateau (survey `pulse/prep-scan-before.json`, box x58..84, z−100..−74; the z−82/−83 rows at x62–65 are clear, no litter cap, no logs). Outside Cody's pad footprint (x62..66, z−95..−91; 9 blocks clear of the pad edge) and outside Vega's planned Index footprint (NE x 60–84, z −74…−52; the site is 8 blocks south of its southern edge). No shift toward either side was needed — equidistant ground did not conflict with her footprint.
- **Sign text (decided, factual, short):** line 1 `COMMONS CHEST` / line 2 `take what you need,` / line 3 `leave what you can` / line 4 blank.
- **Baseline:** the chest, when placed, is born EMPTY. Site re-verified empty by independent scan at 2026-11-08T08:56Z: (63,68,−82)=air, (64,68,−82)=air, (64,68,−83)=air, (63,67,−82)=grass_block.
- **Materials rule:** the chest and sign are crafted by the work bot from wood it gathers itself. Nothing is taken from any citizen's stores — the commons must not start as someone's property.

## Judging rule (as written in the study, league-conformant)

- Evidence is **server-side chest inventory deltas** (scan reads of the chest's contents) attributed by proximity/log evidence, plus **receiver-confirmed transfers** — per league rule, a transfer counts only on receiver confirmation, never on a bot's self-report.
- **Success:** voluntary deposits AND withdrawals by citizens of BOTH communities, sustained over days.
- **Failure modes are findings too:** untouched (never discovered / no commons behaviour), one-way drain (taken, never replenished), or adopted-as-personal (one citizen treats it as their own chest — the Claude Code critique's warning applies: Cody's chest-project predicate must not be allowed to count the commons chest as "my chest" when judging this; if his loop adopts it, that IS the finding, recorded as such, not corrected mid-experiment).
- No judging tonight; prep only. The observation window opens at placement.

## Observation cadence (no new watcher)

- The **curator/digest** read the world on their normal cycles; chest-content deltas surface there.
- **Citizen state feeds** (positions/inventories) provide the proximity attribution.
- **Periodic manual scan reads** of the chest cell (the `commons-scan`/`commons-verify` stationary-reader pattern in `pulse/`) as needed.
- Explicitly NO new watcher process was built for this experiment.

## Known confounds (recorded at prep)

1. **Cody's chest project:** his character loop's project list includes building his own chest, and the site is ~11 blocks from his anchor — discovery is likely; adoption-as-personal is a live possibility and is a finding, not a bug to patch mid-run.
2. **Vega's anchor proximity:** her anchor is ~10 blocks away (the anchors themselves are only ~21 blocks apart), so "between the communities" is a tight geography; her Index build may bring her past the chest routinely.
3. **Work-bot disturbance:** placement work happens in spawn country and the corridor's west end, away from both citizens' active work areas; neither citizen's apron was crossed during prep (Cody was far west under his stabilisation crew; Vega near spawn).

## Placement attempts (2026-11-08, all honest failures — the blocker)

Seven work-bot versions (CommonsWarden ×5, CommonsSmith ×2) plus nine diagnostic probes, 07:47–08:55Z. **No chest placed, nothing dug at the site, no citizen disturbed. Work-bot deaths: 13** (Warden 9 across v1–v6 — pit falls and night-mob kills during the hold-loss window's aftermath; Smith 4, slain by Zombie ×3 and Drowned ×1 within 35 s at 08:54Z while stationary in the pits).

Measured substrate facts (each from world evidence, not bot self-report):

- **Clone-spawn freeze is real and per-body/per-cell:** fresh bots land via the sample-clone at scattered Pos offsets (Warden (38.7, 66, −100.77); Smith (36.5, 73, −85.5), then (27.5, 74, −97.5) *inside a tree canopy*, velocity y = −0.0784 = the vanilla first-fall constant, OnGround true — a frozen mid-air clone state). Bodies pin at bit-identical micro-positions; movement succeeds only in unpredictable bursts between pin cells (walk E and S from one pin; sprint-jump W from another; E-sprint-jump 14.9 blocks in 3.5 s after one fall). Pathfinder goto reports arrival while pinned — its reports are fictions on these bodies. This corroborates the trial-ground lane's night finding: the freeze is a property of body/cell/time, not of any driver stack.
- **The server enforces dig reach (~4.5):** a dig "completed" by mineflayer at 7.95 blocks left the world block intact on independent re-scan (phantom dig). Adjacent digs (≤3.5) verified real.
- **Spawn country is pitted shelf terrain** (ground tops 63–69 within a few blocks), so a pinned body often faces 1–2 block rises in every direction; and **remnant hostiles from the unheld-night window** (zombie/drowned at ground level in the pits; five phantoms circling at y 83–97) make a slow, unarmed work bot a target.
- Net: the ~25-block journey from clone-spawn to the site, plus harvest, exceeds what a disposable clone body can currently do in one session. The citizens' resident loops cross this country only by retrying through wedge cycles for tens of minutes under their own survival legs — machinery a prep work bot does not have.

**Next route for placement (named, not attempted tonight):** (a) place via a citizen-grade driver — the Cody-pattern resident loop (retry-through-wedge + survival leg) carrying a one-off placement script; or (b) wait for the substrate work (the lanes' movement/freeze investigation) to land a reliable bare-bot mover, then re-run prep v1's original simple plan. Either way: re-verify the site cells empty immediately before placing, and the placement timestamp + contents-at-birth ([] expected) get appended to this file when it happens.

## Files

- Bots/diagnostics: `pulse/commons-bot{,2,3,4,5,6,7}.js`, `pulse/commons-diag{,2..9}.js`, results `pulse/commons-chest-result{,2,3,4,5,6,7}.json`, scans `pulse/commons-scan*.js/json`, `pulse/commons-verify*.js/json`, `pulse/commons-census.js`.
- Ledger: `pulse/ledger.jsonl` — declaration `commons-chest-experiment-prep-20261107` (07:46:44Z) and the prep verdict entry that closes this file's writing.
