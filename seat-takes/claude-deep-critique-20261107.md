# Craftmind league critique: seams, exam measures, and silent failures

## 1. Architecture audit: where it breaks first at 3 → 30 citizens and months of runtime

**Seam 1: Ensure-predicates over a shared world (reflex loop ↔ world).**
The project predicates were written when one citizen effectively owned the world: "a chest exists within r", "a pad exists", "a pen holds ≥2 animals". At 30 citizens, other citizens' work will satisfy those predicates. A citizen counts a neighbour's chest as its own store and stops building. Or two citizens fight over the same pad site, and each one's `ensure` undoes the other's. Resources near spawn run out, so `relocate` starts firing more often and its cost keeps rising. Over months, chunk unload/reload adds a second problem: predicates get evaluated against chunks that aren't loaded, or that were cached at load time.
- **Earliest ledger symptom:** some citizens mark projects "satisfied" without any block-place events credited to them. Watch the same project flipping satisfied → unsatisfied → satisfied within one in-game day, and the relocate count per citizen per day trending up. A rising satisfied-without-attributed-placement ratio comes first. Oscillation follows.
- **Fix direction:** predicates must be ownership-scoped. "My chest" means a block I placed, according to the server-side block log, not "a chest is nearby." Shared structures need an explicit claim or contribution record.

**Seam 2: Actor throughput and its coupling to the loop.**
A single local Qwen3-0.6B serving 30 loops becomes a queue. The design bounds what the actor may change ("re-rank within bounds"), but not how late it may answer. A late re-rank applies to a world that has already changed. Narration describes ticks that have passed. Fallback-to-default ranking becomes common without anyone noticing. A second, slower failure: one small model given similar prompts converges, so 30 citizens end up with the same project order and the same voice. That quietly ends the character direction.
- **Earliest ledger symptom:** the gap between the state snapshot timestamp an actor call was based on and the tick its result was applied keeps growing. The fallback/default rate per hour goes up. Rank-order entropy across citizens falls (for example, everyone puts `pen` before `chest`).
- **Fix direction:** every actor result carries the state hash it was computed on. The loop drops it if the current state has moved past it. Fallbacks are counted as their own metric, never folded into "actor ok."

**Seam 3: Append-only books over months (library ↔ citizens).**
Append-only is good for provenance and bad for truth over time. Answers are capped at about 200 words and written against a particular world, plugin version, and set of citizens. Nothing supersedes them. By month two, a consult can return a confident, well-stamped answer about coordinates that no longer exist, a mechanic Paper changed, or a citizen who left. The two seats (GLM, MiniMax) will also contradict each other, and nobody resolves it. Retrieval will favour whatever is most heavily cited, which is usually the oldest entry.
- **Earliest ledger symptom:** consults are served by entries whose provenance predates the current world epoch (server restart, Paper version, map reset). Near-duplicate questions get re-asked because earlier answers didn't stick. Consult latency rises with book length.
- **Fix direction:** define a world epoch that increments on restart, reset, or version change. Stamp each entry with the epoch it was written in. Entries from earlier epochs are served only with a visible "prior-epoch" marker. Add a cheap "superseded-by" entry type, which still fits append-only.

**Also watch: identity and persistence.** Tonight's bug lived here. It gets worse with 30 UUIDs, more restarts, and more operator file surgery. It is covered under §3a.

## 2. The exam question: measures for character and town-building

**Principle.** The survival exams measured whether things exist. Town-building needs measures of use, persistence, and interdependence. Each verdict below can be signed using only server-side evidence the citizen's stack cannot write: the block log, a region snapshot diff, server stats, and entity scans.

**Proposed verdicts:**
1. **Persistence:** structure S, attributed to citizen C by the block log, still matches ≥90% of its block hash at T+7 in-game days. Changes made by C count as maintenance, not decay.
2. **Use over existence:** a store passes only if the block log shows container inflow and outflow on ≥3 distinct days in the window. A bed passes only on a sleep event. A pen passes on a breeding event or a live-animal count held over N days. A built object nobody uses scores zero.
3. **Interdependence:** at least one item placed into a container by citizen A is later removed by citizen B. Or one structure has placements from ≥2 citizens. Or a path between two homes is visible as a placed path/route corridor in the region diff. This is the first verdict that actually means "town."
4. **Recovery:** after an operator-injected damage event (a hole knocked in a wall, or a removed door), the owning citizen repairs it within N days without an operator prompt.
5. **Character, measured from the world:** a blind attribution test. Give the checker region diffs with names stripped. If it can identify the builder above chance using palette, footprint, siting, and work hours, the citizens have distinct characters. If it can't, they don't, whatever the narration says. A second check: each citizen's own fingerprint stays stable from week to week.
6. **Narration grounding:** the share of narration claims about the world ("I stocked the chest", "I fenced the pen") that match a block-log event within ±K ticks. This counts as a penalty only, never as a reward. Ungrounded claims are a defect, and talking more earns nothing.

**Retire these before they cause Goodhart problems:**
- **Project-completion counts (hut / chest / pen / watchtower placed).** These reward dirt boxes and empty chests. They are the bot's own predicates, so the league would be scoring the citizen's self-report. Replace them with verdicts 1–2.
- **Watchtower as a placed or tall object.** Height-based checks reward 1×1 pillars. If a tower stays at all, it passes only if someone actually goes up it (a dwell event at the top).
- **"Night survived" as a stage pass.** It can be passed by digging into a 1×2 hole. Demote it to a tripwire: a death-rate regression alarm, not a score.
- **Inventory possession (has pickaxe, has N logs).** This rewards hoarding. Tool wear (durability spent) is better evidence than ownership.
- **Consult count or library citations as progress.** This rewards asking questions. Measure the library only by downstream world verdicts: did behaviour change after the consult?
- **Any text-judged narration quality.** The 0.6B model will learn the judge, not the world.

## 3. Silent-failure review: four places the league can be fooled the same way

Tonight's bug, generalised: a layer between the truth and the observer serves a cached copy, every health check is on the serving layer, and none of them checks freshness. "The scoreboard is the dock" needs a corollary: every verdict needs a freshness proof, through a channel the citizen's stack can't write and a cache can't replay.

**a) State feeds (citizen's world view, inventory, playerdata).**
- **Risk:** after reconnect or restart, the bot's world model, inventory, or position comes from a cache, a sample-clone, or an unloaded-chunk default. Predicates evaluate fine against it. This is tonight's bug class, and it will happen again in a new form, for example a reconnect handshake that replays the last known inventory.
- **Cheapest probe:** a nonce challenge at session start and every N minutes. From the server console, `/give` the citizen an item renamed to a random nonce, or set a block at a random offset nearby. Within K ticks, the citizen's state feed must report that exact nonce. If it doesn't, the citizen is quarantined and no verdicts are issued. This costs one console command and one comparison.

**b) Actor outputs.**
- **Risk:** the model returns something unparseable, gets truncated, or times out. The loop falls back to the default ranking and template narration. The process is up, calls return 200, the "actor" panel is green, and no character is coming through. A variant: a server-side prompt/KV cache, or a keep-alive session, keeps serving outputs conditioned on an earlier state.
- **Cheapest probe:** log `(state_hash, output_hash, fallback_flag)` for every call. Alarm when one output hash appears across different state hashes, or when the fallback rate goes over a threshold. Add one known-answer probe per hour: a synthetic state with exactly one in-bounds correct re-rank, such as "pickaxe broken, no other change." The output must move that project to the top.

**c) Consult answers.**
- **Risk:** the provenance stamp records when the answer was appended, not what the seat read when it generated it. A seat can answer from a stale local checkout of the books, a retrieval cache, or its own earlier answer. The stamp still looks fresh, the 200-word cap is respected, and the entry is well-formed.
- **Cheapest probe:** stamp the head hash of every book the seat read. The library rejects entries whose input-head is older than the book head at append time by more than M entries. A periodic canary does the same job at lower cost: post a fresh nonce fact into a book, then ask a question only that fact answers. If the canary fails, that seat's answers since its last pass are marked suspect.

**d) Curator footage.**
- **Risk:** recordings, screenshots, or replays get labelled with the wrong citizen or time, or served from a cache. Footage of a pre-reset save shown as tonight's run is the visual version of tonight's bug. Footage persuades people more than any ledger does, so this one does the most damage.
- **Cheapest probe:** before capture, the operator posts a nonce in-world (a sign placed at the citizen's location, or a chat line). The footage must show it, and the in-game time shown must match the ledger tick within tolerance. Footage without the nonce is anecdote, not evidence.

**Cross-cutting rule for all four:** a verdict can't be signed from the same store the citizen's stack writes to. If the checker reads playerdata, or the bot's own ledger, to grade the bot, it is grading a self-report, and that is exactly how tonight's bug got through twice.
