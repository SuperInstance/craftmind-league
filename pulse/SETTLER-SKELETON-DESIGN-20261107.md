# The Settler Skeleton — RH-4 + RH-1 + RH-5 for Cody

**Status:** design and readiness only. No live code changes; nothing in this document has been run. Written 2026-11-07 (AKST night) against `pulse/character-plugin.js` as read at 2026-11-08T07:49Z (1,140 lines, post-food-run build) and Night Study 2, *The Human Tape* (`~/workspace/studies/human-play-routines-20261107.md`).

**Purpose.** Cody's loop already contains cousins of all three routines: the burrow reflex (`shelter()` / `shelterHold()`) is RH-4's burrow arm, the homestead anchor and surveyed routes are RH-1's centre, and the chest project is RH-5's container. Tonight proved their value — the burrow and a restored daylight hold kept him alive — and their gaps: he left shelter at 1.33 hp to relocate, his eat thresholds (eat ≤14, urgent forage ≤8) cannot reach the food ≥18 regen threshold when hurt, and the pad/hut/chest predicates know nothing of receipts. This design closes those gaps at the owning layer, per routine, in a form a lane can implement from tomorrow without re-deriving the loop.

**Rules that bind all three routines** (from the study and the Watchers Charter):

- World time, like every other fact, is read from the world — `bot.time.timeOfDay` in-process, the same value `pulse-plugin.js` writes into the state feed — never from the cameraman's claim that it sent a command. Sent is not landed; tonight the hold was fictional for ~90 minutes while its log said otherwise.
- A routine's completion is a desired-vs-actual check against a fresh scan, never the routine's own say-so.
- Scaffold obedience never counts as graduation. Every routine event is logged with the scaffold level that produced it and whether the decisive choice was prompted, defaulted, or the citizen's own. Only an unprompted, context-sensitive variation that preserves the outcome is graduation evidence.
- The fade ladder is S3 taught → S2 cued → S1 watched → S0 faded. Demote one level after three clean completions at the current level; reinstate one level after a death, a false verification, or a missing/mismatched receipt.

---

## 1. RH-4 — Dusk Is a Deadline

### 1.1 Where it hooks in

The day loop (`dayLoop(bot, gen)`) already runs a strict precedence: danger leg (`rt.danger` → `flee()` → `shelter()`) → health-critical food leg (`criticalForage()`) → ordinary food legs → project selection. RH-4 inserts **one new leg between the danger leg and the food legs**, plus **one extension to `guard()`**, and changes nothing about `flee()`, `shelter()`, or `shelterHold()` behaviour.

New code lives in a new section immediately after the shelter section:

```
// ── dusk: RH-4 night mode ────────────────────────────────
const DUSK_DECIDE_TOD = 11000;   // stop opening new work; choose the night mode
const DUSK_HARD_TOD   = 12800;   // night state must be VERIFIED by here
worldTod(bot)                    // -> bot.time.timeOfDay | null
nightContext(bot)                // -> ctx object (below)
chooseNightMode(ctx)             // -> 'sleep'|'occupy'|'enclose'|'burrow'|null
enclosureScan(bot)               // -> { enclosed, roofed, openings[] }
burrowVerified(bot)              // -> bool (re-scan, not rt.burrowed alone)
verifyNightState(bot, mode)      // -> { ok, evidence }
duskLeg(bot)                     // async; the dayLoop leg
dawnReleaseDue(bot)              // -> bool
```

State additions:

- `rt.nightState` — `null | { mode, chosenAtTod, verifiedAtTod, sealCell|null, dateKey }`. Set by `duskLeg`, cleared only by the dawn release (§1.5).
- `rt.S` via `loadS()` — add `nightLog: []` (last 21 nights), `duskLevel: 'S3'`, `cleanNights: 0`, `bedPos: null`. `loadS()` currently returns a fixed key set; the extension is additive, same pattern.

### 1.2 The two hooks

**Shallow hook (dayLoop).** After the danger block and before the `criticalForage` block:

```js
if (rt.nightState || (worldTod(bot) !== null && worldTod(bot) >= DUSK_DECIDE_TOD)) {
  const held = await duskLeg(bot);
  writeCharState(bot);
  if (held) continue;            // night owns the body until dawn release
}
```

**Deep hook (`guard()`).** Project work functions already call `guard()` inside their long loops (`hunt`, `ensureBuildPlanks`, `smeltCharcoal`, `criticalForage`). Extend `guard()` to also throw a `DuskInterrupt` when `worldTod(bot) >= DUSK_HARD_TOD && !rt.nightState?.verifiedAtTod`. `dayLoop`'s project-work catch treats `DuskInterrupt` like `Interrupt` except it routes to `duskLeg` instead of `flee`. This is what stops a work step opened at tod 10900 from running past the deadline: the shallow hook alone only fires between work steps.

**Precedence, stated once:** if the danger leg engaged this iteration, it owns the body — `flee()`/`shelter()` already produce a survivable state, and `duskLeg` does not run. If danger engages *during* a dusk return (§1.3 occupy), the existing `Interrupt` path owns the body and the dusk leg re-evaluates next iteration. The dusk leg never fights the survival leg; it schedules around it.

**Interaction with the daylight hold.** Under a working hold the cameraman resets tod to 1000 every ~300 s and tod never approaches 11000 (measured peak ~7000). The dusk check therefore correctly never fires on held days, and logs nothing — silence under the hold is the designed behaviour, not a missed check. RH-4 exists for the two cases where tod is real: a hold failure (tonight: tod ran past 11511 into a full night) and a deliberate night (the S5 exam, run with the cameraman stopped). The seatbelt is citizen-side precisely because the hold is someone else's promise.

### 1.3 Choosing the mode

`nightContext(bot)` computes, all from feed/scan state:

| Fact | Source |
|---|---|
| `tod` | `bot.time.timeOfDay` |
| `hutComplete`, `doorOrSealable` | `hutScan(bot)`; door from the scan, seal via `sealMaterial(bot)` |
| `distHome` | `distHome(bot)` |
| `returnFeasible` | `(DUSK_HARD_TOD - tod) / 20` seconds remaining ≥ `distHome × 2.5 + 120` (2.5 s/block is the conservative relocate grind rate measured on the surveyed routes; 120 s is verify buffer) |
| `bedKnown` | `rt.S.bedPos` set **and** a fresh scan confirms a bed block there |
| `here` | `enclosureScan(bot)` at the body's current cell |
| `danger` | `rt.danger` / `nearestHostile(bot, 16)` |
| `diggableHere` | the `shelter()` site rule: a `columnTop` within its offset rings whose name matches its diggable set, preferring Chebyshev-to-spawn > 17 |

`chooseNightMode(ctx)` is a pure function over that context, in this order:

1. **`sleep`** — if `bedKnown` and the bed is reachable within the return budget. *Declared but unavailable tonight:* no bed exists at the homestead and no project builds one. The mode is in the ladder so the choice record can show it being correctly skipped, and so a future bed project slots in without redesign. It falls through today, by design, not by accident.
2. **`occupy`** — if `hutComplete && doorOrSealable && returnFeasible`: return by the known route (relocate's route machinery, goal `HOME`) and be inside the hut.
3. **`enclose`** — if `here.enclosed` already, or can be made true with ≤2 placements using a carried seal material: seal the openings where he stands.
4. **`burrow`** — otherwise: the existing `shelter(bot)`, called unchanged.

Hostile pressure modifies only the ordering of 3 vs 4: if `danger` is present but outside the survival leg's 12-block trigger, prefer `burrow` over a fiddly `enclose` — sealing two gaps under pressure is how a citizen dies holding planks.

### 1.4 Verifying the night state before the deadline

Mode execution is followed, always, by `verifyNightState(bot, mode)` — a fresh scan, not the executor's report:

- **sleep:** body within 2 blocks of `bedPos`, bed block still present, hostiles none within 16.
- **occupy:** body inside the pad footprint (x∈[62,66], z∈[−95,−91]), `hutScan(bot).complete`, and the door cell occupied by a door or a seal block.
- **enclose:** `enclosureScan(bot)` returns `enclosed && roofed` at the body's cell.
- **burrow:** `burrowVerified(bot)`: `rt.burrowed` **and** the block at (floor(x), floor(y)+2, floor(z)) is non-air **and** the body's y is below `columnTop(x, z).top`. The runtime flag alone is not evidence; the re-scan is.

`enclosureScan(bot)` samples the 8 neighbouring columns at body level and body+1: a column counts solid if both sampled blocks are non-air; it returns the openings by name so an `enclose` attempt knows which gaps it is sealing, and `roofed` from the block at body+2.

If verification fails and `tod < DUSK_HARD_TOD`, escalate one rung down the ladder (occupy → enclose → burrow) and verify again. If verification fails at or after `DUSK_HARD_TOD`, go directly to `burrow` — `shelter()` is the proven floor. A mode that cannot verify is recorded as chosen-and-failed, never as the night's mode; the night's mode is the one that verified.

### 1.5 The mode-choice record and the dawn release

Every night the check fires, one ledger entry (the existing `ledger()` shape, structured facts in `data`):

```
{ ts, kind: 'character-night-mode', id: 'character-night-<yyyymmdd>', class: 'character',
  what: 'RH-4 night mode <mode> chosen at tod <n>, verified at tod <m>',
  data: { mode, chosenAtTod, verifiedAtTod, ctx: { hutComplete, distHome, returnFeasible,
          bedKnown, danger, hereEnclosed }, scaffold: { level, prompted, defaulted },
          verify: { ok, evidence } } }
```

`writeCharState(bot, { night: rt.nightState })` — the `extra` parameter already exists — carries the live night state into `character-state.json` so the feed shows it.

**Dawn release.** When `rt.nightState` is set and tod has wrapped (`tod < 2000`), release requires **both**:

- the all-clear the burrow already uses — no hostile within 16 for 60 continuous seconds (the `shelterHold` constants), and
- a **vitals gate**: `health >= 10 || food >= 18`. Below that, the release does not clear into project selection; the iteration falls through to the food legs, and `criticalForage()` (which fires at `health < 4 && food < 18`) gets its chance first. This gate is the direct answer to tonight's failure: `shelterHold` exits on all-clear regardless of vitals, and a citizen at 1.33 hp with no food in inventory walked out to relocate because nothing in the loop priced his health into the exit. The gate adds no new behaviour — it reorders existing legs — and it does not touch `shelterHold` itself.

On release: clear `rt.nightState`, append the night to `rt.S.nightLog` (`{ dateKey, mode, verified, deaths, promptedChoice }`), ledger a `character-night-release` entry naming the seal cell if one was recorded and whether a fresh scan still finds the seal material there (restoring a seal that blocks a shared route is a lane follow-up in v1; the loop's duty is to record it, not to silently leave it unrecorded), and resume. If the body is still below its column top 60 s after release, log a release-stall event for the lane rather than improvising an exit dig.

**Burrow instrumentation (additive only).** `shelter()` currently returns `shelterHold`'s boolean. The design asks the implementing lane to *also* record the seal cell it computed (`(floor(p3.x), sealY, floor(p3.z))` in the existing code) into `rt.nightState.sealCell` when the dusk leg invoked it. This changes no dig, placement, or hold behaviour; it writes down a fact the function already knows.

### 1.6 Fade instrumentation (RH-4)

- **S3:** at `DUSK_DECIDE_TOD` the loop announces the mode it will take (the `say()` pattern) and takes it — `prompted: true, defaulted: true`.
- **S2:** the dusk leg fires with the checklist in the log (context facts printed) but no chat prompt; the citizen's own project state chooses among reachable modes — `prompted: false`.
- **S1:** no prompt or checklist; an alert is logged only on a verification failure or a mode escalation.
- **S0:** the leg is silent availability; only the mode-choice record is written.
- **Graduation:** a night where `chooseNightMode`'s *default* (the first available rung) differs from the mode that verified, and the deviation was not scaffold-named — e.g. at S1/S0 he burrows on a failed return instead of gambling on occupy, or occupies a peer's/village shelter — with `deaths: 0` and verification evidence attached. A night survived by obeying the S3 prompt is a clean night, not a graduation.

---

## 2. RH-1 — Mark Before You Move

Cody's anchor already exists (`anchor.json` = `HOME` (64, 67, −93), restaged 2026-11-07). RH-1 here is therefore not for Cody's body; it is the **arrival routine for a new citizen body**, packaged so the unpark lanes can hand it to Vega and Geist — both of whom need it: Vega's parked position (24.2, 68, −86.5) sits inside the spawn-protection square with undiggable trees in view, and Geist's known collecting grounds were inside the same square (Chebyshev 6–11 from spawn). Both bodies' first problem is the one RH-1 solves: they do not have a surveyed, marked, provable origin.

### 2.1 The arrival card

The routine produces one artefact per body, filed in the citizen's lane directory as `arrival-card.json`, and one physical marker in the world:

```json
{ "citizen": "Vega", "filedAt": "<iso>", "routine": "RH-1 arrival-card v1",
  "spawn": { "x": 0, "y": 0, "z": 0, "chebToSpawn": 0, "protection": "inside|outside" },
  "datGuard": { "ownDatPresent": true, "checkedBeforeJoin": true },
  "marker": { "x": 0, "y": 0, "z": 0, "kind": "pillar|sign|exit-marker", "name": "SPAWN-EXIT" },
  "surveyRef": "<lane-relative path to the survey artefact>",
  "surveyFacts": { "treesByType": {}, "water": null, "passives": [], "exposedStone": null,
                   "caveMouths": [], "hazards": [] },
  "routes": [ { "id": "exit", "goal": {}, "hopsRef": "<path>" },
              { "id": "to-anchor", "goal": {}, "hopsRef": "<path>" } ],
  "announced": "<the chat line sent>" }
```

### 2.2 The steps

0. **The .dat guard (before the first join).** Tonight's sample-clone lesson is part of spawn context now: the lane verifies the body's own `.dat` exists in `world/players/data/` and is loadable *before* the first join, or the body arrives as a clone of a random sample. No marker fixes a wrong body. (Standing rule, OPERATIONS §1: a citizen's `.dat` must never be absent while the pool is populated.)
1. **Freeze and record.** On spawn, before any project: record position, `spawnPoint`, Chebyshev-to-spawn, and inside/outside the protection square (x∈[16,48], z∈[−112,−80]) into the card. The state feed's first frame is the evidence.
2. **Mark.** Place a visible marker of local replaceable material at the spawn cell — **unless the spawn is inside the protection square**, where placement is server-cancelled. In that case the marker goes at the first cell outside the square on the exit bearing (Chebyshev > 17, the same margin `shelter()`'s site rule uses) and is named `SPAWN-EXIT`; the card records both the spawn and the marker coordinates. A sign names it when signs exist; a pillar is acceptable on day one.
3. **Survey once.** A `columnTop` grid over ~24 blocks around the origin — the proven pattern of `pulse/cell-survey.js` and `pulse/shoulder-survey.js` (817 cells, standable = top exists, no trunk, leaf headroom ≥ 3) — written as a survey artefact in the lane directory. From it, the card's survey facts: nearest trees **by type**, water, passives, exposed stone/coal, cave mouths, hazards (cross-checked against `pulse/mob-map-20261107.json`), and the safest return line.
4. **Derive routes.** Two hop chains with per-cell feet-y, built from the survey exactly as relocate's Route 2 was: an **exit route** (spawn → marker, if they differ) and a **to-anchor route** (origin → the citizen's chosen anchor). Filed as route artefacts the citizen's own navigation can consume; the hop-consumption rule applies (a waypoint within 2.2 blocks of the body, not the goal, counts as consumed — triple-001's rule).
5. **Announce.** One chat line: the marker name and one survey fact. Then — and only then — the first project.

### 2.3 Evidence and fade

- **Evidence:** marker blocks present in a world scan at the recorded coordinates; the survey artefact exists and a rescan agrees with it; a completed walk-back whose path terminates at the marker; the card and the scan agree (desired-vs-actual). A card whose marker is not in the world is a failed routine, however tidy the JSON.
- **Fade:** S3 for the first three arrivals in a new area → S2 when origin is reliably recorded before travel → S1 after three returns that use the marker with no rescue or consult → S0 when named-place navigation is normal.
- **Graduation:** an unprompted *secondary* marker at a decision point (trail junction, cave mouth, cache), or upgrading the provisional marker into a named place because the place acquired a use — logged with `prompted: false` in the lane's ledger.
- **Anti-pattern (named for the lanes):** a decorative pillar at a place the body never returns to; coordinates in chat with no physical marker; a marker placed after wandering and backdated as the origin.

### 2.4 The library entry

This routine is filed in the triples library as **triple-006-arrival-mark-survey** with `outcome.status: unverified`: every component is proven separately (surveys, hop chains, the protection-margin rule, the .dat guard), but no lane has yet run the composed routine end-to-end for a fresh body. It is served only with `--include-unverified` and is never counted as a pass. The first unpark lane to run it owes the library its verdict — pass or fail — as a new triple citing this one.

---

## 3. RH-5 — Dump, Count, Leave a Receipt

### 3.1 What the chest project does today, and the three gaps

The `chest` project (`PROJECTS`, id `'chest'`) places a chest at `CHEST_POS` (65, 67, −94) and deposits with a flat keep-list (tools, sticks, torches, door, **all** edibles, the dominant plank stack), reading the container before and after via `prims.openChestContents()` and latching `rt.S.milestones.chest = true` when the after-total reaches 3 items. The before/after reads exist; everything RH-5 adds is built on them. The gaps:

1. **No reserve quantities.** The keep-list is by item *name*, not by amount: all food is kept forever (nothing is ever surplus), and a plank stack of 60 is as "kept" as a stack of 6.
2. **No reconciliation.** The deposit result is logged to console; the before/after contents are never compared per-item against what the deposit claimed to move, and no ledger entry is written. A phantom deposit would pass silently — the exact failure class this league keeps re-meeting.
3. **No commons.** The deposit goes to his personal chest and stops there. Tonight the commons acquired a physical container — the CommonsWarden chest at (63, 68, −82) with a standing sign — but no citizen loop knows it exists, and no receipt anywhere records a transfer another lane could read.

### 3.2 Two containers, two jobs

| Container | Position | Job |
|---|---|---|
| Personal chest | `CHEST_POS` (65, 67, −94) | His store: next project's declared inputs + the emergency return bundle. Receipted, but it is *his*. |
| Commons chest | (63, 68, −82), sign-marked | The shared ground: surplus above reserve goes here, where any citizen may draw against a receipt. This is the embryonic commons economy. |

RH-5's trigger is a **return**, not a project: arrival at the anchor after an expedition or gather, completion of any project (the `dayLoop` milestone block is the hook), or the moment before a dangerous step or a new project with a cluttered inventory. The deposit function leaves the `chest` project's `work()` and becomes a routine the loop calls; the project's `done` predicate keeps its current meaning for scoring (chest placed, first reconciled deposit ≥ 3 items — see §3.5).

### 3.3 The reserve rule — surplus above carry reserve, by item class

Reserve is computed per item type from the live inventory (`prims.inv(bot)`), in this class order. Anything held above reserve is surplus and eligible for the commons deposit.

| Class | Contents | Reserve (kept on body / in personal chest) |
|---|---|---|
| **T — tools in use** | pickaxes, axes, swords, torches in hand | 1 of each tool type in use; duplicates are surplus |
| **F — food** | `EDIBLES` | 6 items, cooked preferred (raw counts toward the 6 but is cooked first when a furnace cycle is already running); the return-trip portion is untouchable |
| **B — build bundle** | planks **by type**, sticks | the next open project's next-step input, read from the project stack (hut steps consume planks in lots of 6; chest costs 8; fence 4 + 2 sticks), capped at 16 of the dominant type; other plank types above 4 are surplus. *By type, never by total* — the recipe-variant discipline of triple-005 |
| **M — materials** | logs, cobblestone/stone, dirt | logs 4 (conversion stock), cobblestone 8 (one furnace), dirt 8 (pad fill + burrow seal), sticks counted under B |
| **E — emergency bundle** | 4 edibles + 8 dirt-or-cobble + 1 spare wooden pickaxe | lives in the **personal** chest, never deposited to commons, verified present by scan before any commons deposit is written |
| **X — everything else** | bones, apples beyond F, saplings, seeds, spare doors, string, … | reserve 0 — surplus by default |

Worked example, tonight's actual inventory (`oak_planks 8, bone 1, crafting_table 1`, food 15, health 1.33): the table is a placed-tool duplicate — surplus, commons. The bone is class X — surplus, commons. The 8 planks sit inside the build bundle for the next open project — kept. A lane implementing this should unit-check the function against that inventory; it is the smallest honest test case the night provided.

### 3.4 The receipt and the reconciliation

New function, in the chest section's neighbourhood:

```
async function dumpAndCount(bot, trigger)   // trigger: 'return'|'project-complete'|'pre-danger'|'pre-project'
```

1. Read personal + commons state: `prims.openChestContents()` at both positions (before).
2. Verify class E is present in the personal chest (scan). If it is not, restock E from the body *before* any commons deposit; if it cannot be restocked, the deposit still happens but the receipt is written with `emergencyBundle: false` — a visible deficit, not a silent one.
3. Deposit surplus to the commons chest (`prims.depositInChest` pattern, as the chest project already uses at `CHEST_POS`), capturing the deposit call's own report of what it moved (`expectedDelta`).
4. Re-read the commons chest (`after`) and compute `actualDelta` per item type.
5. **Reconciliation (desired-vs-actual):** the receipt is written as *confirmed* only if `actualDelta` equals `expectedDelta` for every item type. On any mismatch, write the receipt as `reconciled: false` with both deltas attached, ledger a `character-deposit-mismatch` entry in `pulse/ledger.jsonl`, and do not count the return as clean for fade purposes. A mismatch is a finding, not a rounding error.

The receipt itself is one JSON line appended to **`commons/commons-ledger.jsonl`** (new file, created by the first receipt; the pond ledger proves the append-only cross-lane pattern, and `commons/SCOREBOARD.jsonl` proves lanes will read a commons file they did not write):

```json
{ "ts": "<iso>", "kind": "commons-deposit", "citizen": "Cody",
  "container": { "role": "commons", "pos": { "x": 63, "y": 68, "z": -82 } },
  "trigger": "project-complete:pickaxe", "delta": { "crafting_table": 1, "bone": 1 },
  "reserveSnapshot": { "food": 6, "dominantPlanks": 8, "logs": 0 },
  "emergencyBundle": true, "reconciled": true,
  "evidence": { "beforeTotal": 0, "afterTotal": 2, "scanTs": "<iso>" },
  "scaffold": { "level": "S3", "prompted": true, "initiatedBy": "loop" } }
```

Withdrawals are the mirror image (`kind: 'commons-withdraw'`, naming the project the stock is for). Personal-chest movements that never touch the commons are logged in `pulse/ledger.jsonl` only (`kind: 'character-deposit'`). The actor's consult path may *cite* receipt lines as provenance — a receipt id is evidence about a past transfer, never about present stock; present stock is a scan.

**Why this is the substrate and not just bookkeeping.** A reconciled, cross-lane-readable receipt stream is the first artefact in the league that one citizen's lane can check against another's without trusting either's narration. It is what a future Seeded Word, a shop (RH-8), or a recovery etiquette (RH-5's human ground: a killed player's gear chested for them) would all have to stand on: transfers that count because a container delta confirmed them, in a file that survives every body's death.

### 3.5 Hook points and predicate changes

- `dayLoop`, milestone block (where `character-milestone` is ledgered today): after a milestone fires, `await dumpAndCount(bot, 'project-complete:' + p.id)` before the next project is selected.
- `dayLoop`, relocate completion and `idleAtHome` entry: `dumpAndCount(bot, 'return')` — the homestead idle is a return by definition.
- The `chest` project: `work()` keeps placing the chest; its deposit block is replaced by a call to `dumpAndCount`. The milestone latch moves: `rt.S.milestones.chest = true` is set by `dumpAndCount` the first time a **reconciled** deposit with total ≥ 3 lands — same threshold as today, now behind reconciliation. `done(bot)` is unchanged (block present + milestone), so S-scoring semantics do not move.
- Safety override, inherited: the danger and dusk legs outrank a deposit. A return that arrives with `rt.danger` set does not stop to count bones.

### 3.6 Fade instrumentation (RH-5)

Every return writes its receipt with `scaffold` filled, at these levels: **S3** fixed categories, loop-initiated, `prompted: true`; **S2** citizen-set reserve within the class caps, exception prompts only; **S1** alerts only on mismatch or a missing emergency bundle; **S0** deposit folded into project closure, receipts still written (the receipt is not scaffold — it is the commons' memory, and it never fades). Three reconciled returns demote; one mismatch reinstates.

**Graduation:** an unprompted anticipation recorded with `initiatedBy: 'citizen'` or `'actor-rank'` and confirmed by delta — pre-staging inputs at the commons for a peer's announced next step, splitting the emergency bundle to a second cache before a risky expedition, or refusing a deposit that would swamp the commons chest and routing it to the personal chest with the reason in the receipt. A loop-forced dump at project closure, however tidy, is obedience.

---

## 4. Common instrumentation — what gets logged so graduation is judgable

For all three routines, the implementing lane keeps one rule: **the choice, its context, the scaffold that framed it, and the world evidence that judged it, in one record.** Concretely:

- RH-4: the `character-night-mode` + `character-night-release` ledger entries and the `night` field in `character-state.json` (§1.5).
- RH-1: the arrival card + the lane's ledger entry per arrival, with `prompted` and any secondary-marker events (§2.3).
- RH-5: the commons receipt + the pulse-ledger mirror, with `scaffold.initiatedBy` distinguishing `loop | actor-rank | citizen | consult` (§3.4, §3.6).

A graduation claim by any lane must cite records in which `prompted: false` and the variation is visible in the context fields — not a narrative summary. If the record cannot show the scaffold *not* naming the choice, the claim does not stand.

## 5. The NOT-tonight list

Explicitly out of scope for the implementing lane's first pass, and not done by this design:

- No changes to `shelter()` / `shelterHold()` dig, seal, or hold behaviour (RH-4 extends around them; §1.5's seal-cell recording is additive instrumentation only).
- No bed project, and no change to the project stack's membership or order — `sleep` ships as a declared, unavailable mode.
- No changes to the cameraman, the daylight hold, or any watcher; RH-4 reads world time, it does not ask for it.
- No changes to the actor's prompts, ranks, or consult hooks; `initiatedBy` is a log field, not a new actor power.
- No relocation of either chest, no new container, no CommonsWarden changes; the commons chest is used where tonight left it.
- No edits to existing triples; triple-006 is appended, marked unverified, and nothing else in the library is touched.
- Dig-step stays off. No `/give`, no teleports, no world edits, no process restarts are part of any routine above.
- The eat thresholds themselves (≤14 / ≤8) are not retuned here — `criticalForage()` and the §1.5 vitals gate already own that problem; a threshold retune is a separate, separately-verified change.

## 6. Implementation order for tomorrow's lane

1. **RH-4 first** (safety gate for everything else): the `guard()` extension, the dayLoop leg, mode choice + verification, the release vitals gate. Verify across one deliberate unheld night (cameraman stopped by the lane coordinator, S5-style) before trusting it on held days.
2. **RH-5 second**: `dumpAndCount` + the reserve function (unit-checked against tonight's inventory), the commons ledger's first receipt, one forced mismatch test (deposit with a hand-emptied slot) to prove reconciliation can fail loudly.
3. **RH-1 third**, at the unpark lanes' pace: triple-006 is already filed; the first lane to run an arrival owes the library the verdict triple.

*End of design.*
