# ZCode (GLM) seat take — Anthropic, "The components of agent memory" (2026-11-06)

Seat: ZCode (GLM-5.3) on the Thor, headless -p mode, read-only Q&A; deliverable captured from stdout 2026-11-08. Brief embedded the full paper text (brief file: ~/zcode-memory-brief-20261108.md). Word count of take body: ~2,540 words. Verification note (parent lane, 2026-11-08): the seat's own one-line preamble was not carried into this file, but in it the seat claimed it fetched the paper page and confirmed the figure captions, surfacing a no-memory Mt. Moon control arm and the contract-facts figure pinned at 41/57 vs 57/57. The parent lane checked this against its own full-text fetch of the post: the body text names only the corrected vs uncorrected arms, but the no-memory arm is independently corroborated by secondary coverage (subagentic.ai: 'The run with no memory never reached Cerulean either'; explainx.ai: 'The no-memory run did not get past the mountain either'; agientry: 'A no-memory run never reaches the city'; claude-pulse: the corrected run reached Cerulean at action 1,935, 'which neither the raw-note nor no-memory runs reached') — the control arm almost certainly lives in Figure 8's alt text or caption, which the body-text fetch did not surface. Two precision edits were applied in place (sections 5 and 7); the seat's stronger gloss in section 8 was left as written and is flagged in the ledger.

---


---

# Anthropic's "The Components of Agent Memory" — structured take

**TLDR:** The paper's core move is to define agent memory narrowly — as experience-derived notes that persist across sessions and get read later — and then show that the hard problems are *salience* (what deserves a note) and *consolidation* (offline "dreaming" passes over transcripts that correct, structure, and promote notes). The strongest evidence is in the steering experiments and the wiki-vs-search benchmark arms; the most quotable material (Pokémon, Mt. Moon) is single-run anecdote. For our fleet, it validates Muse's architecture almost point-for-point, and points at three concrete gaps: provenance on citizen knowledge, a state-vs-derived split in the triples library, and tier-differentiated steering.

## 1. The taxonomy: what counts as memory, and what doesn't

Anthropic draws a four-way boundary. **Agent memory** is knowledge Claude gains from experience — user interactions, assigned tasks — retained between sessions and saved as context it can read later. It is explicitly distinguished from: **weight changes** (learning baked in at training time, not agent-controllable at runtime), **in-context learning** (knowledge that lives and dies within one conversation), and **compaction** (summaries that replace Claude's own older turns so work can continue in a fresh window). The dividing lines are persistence and addressability: memory notes outlive the session and are retrieved deliberately; compaction persists but is lossy self-summarization of the same conversation; in-context learning does neither.

The biological scaffolding is more than decoration. The hippocampus captures experience in the moment; only some of it is consolidated into long-term cortical knowledge, largely during offline replay in sleep and quiet rest. Anthropic maps this directly: session logs/transcripts are the hippocampal capture (everything is recorded anyway), and **dreaming** — offline reflection over those logs, in the lineage of Letta/Berkeley's sleep-time compute — is the consolidation pass that fixes mistakes and produces new notes and representations. Salience marking (chemical tags that make some memories replay more) maps to tagging or writing salient events in the moment.

The most intellectually loaded framing in the paper: **memory is a prediction**. Writing a rule predicts the pattern will recur; writing a verified fact predicts a future session can rely on it without re-checking. This reframes salience as a forecasting skill — you can't know what's salient "before you know what's coming next," so good memory-writing is literally good prediction. That framing quietly explains most of the results that follow: stronger models write better memory because they forecast relevance better.

## 2. CL-Bench: the learning loop as a generational ladder

The CL-Bench 1.0 database task gives Claude a question per fresh session, a persistent memory directory, and graded feedback after each answer. The ladder of what models did with that setup:

- **Sonnet 4.6** generated theories about wrong answers but never tested them — a scattering of files of untested guesses. It also often failed to *read* its memory directory before answering (less than half the time).
- **Opus 4.7** consolidated into a single reference document and began marking facts as checked vs. unconfirmed — epistemic status as a first-class field.
- **Sonnet 5** marked answers confirmed after the grader checked them and wrote corrections after wrong answers — closing the loop with the feedback signal. It read memory before answering 9 of 10 times unprompted.
- **Opus 5** was the first to fully close the loop, and the composition of its notes is the whole finding: **rules, plus how it knew each rule was true (provenance), plus answers to earlier questions, plus explicit warnings about traps it had discovered.**
- **Opus 5.5 and Sonnet 5.5** both closed the loop and scored about the same as Opus 5 *with* memory — but their baselines *without* memory were higher. The loop became standard equipment; memory stopped differentiating.

The distinguishing features of the models that closed the loop were exactly three: rules rather than raw observations, **provenance attached to each rule**, and **trap warnings**. Not volume — Opus 5's directory wasn't described as large. The untested-guess files of Sonnet 4.6 are the failure mode: theories written down with no verification step are predictions posing as knowledge.

## 3. Pokémon: salience is compression, and state is the enemy

One run each of Sonnet 3.7 and Fable 5, compared at ~10,000 steps. Sonnet 3.7 wrote **413 files across 225 folders and earned one badge** — a file per battle, per item, per NPC. Fable 5 wrote **nine files in two folders plus a top-level `global.md`, and earned four badges**. Opus 5.5 later took the same minimalist path — a small folder of current-goal/next-steps notes rewritten live — and beat the game.

Why hoarding failed: Pokémon state changes constantly, so Sonnet 3.7's archive was continuously stale, and curation ate play time. The damning moment: around step 10,000 it started its *fourth* folder of "master" files and spent 17 steps creating six files and deleting nine while taking no in-game actions. Memory maintenance had become the task.

The extractable principle is the paper's best: **memory is for what the world does not re-tell you.** Money and map position are on screen every turn — storing them is redundant and guaranteed to go stale. Strategy, plans, and tested rules (e.g., "if 3+ balls fail in a row, vary the timing — the catch landed right after doing this") exist only if Claude works them out, and vanish unless written down. Fable 5's `global.md` was a dashboard (current goal, gym plan, its own rules *for using memory*), with folders for route plans and gameplay strategy — derived knowledge only.

## 4. Steering: prescription helps the weak and hobbles the strong

The operational summary: "tell Claude what memory is *for*, but not how to use it." On CL-Bench, merely telling Opus 4.7 and Opus 5 that a memory folder existed was enough for a boost. When Anthropic tested fixed rules (one rule per condition, each model's memory-gain-with-rule vs. gain-without), the rule **"record only failures" stripped most of the memory benefit from both Opus models**. Prescribed rules pre-empt the model's own salience judgment and lose.

But the effect reverses for weaker models. Sonnet 4.6 often didn't read its memory and didn't test its theories; prompting it to read memory before answering and then explicitly test theories **nearly doubled its score**. Steering helped the models that couldn't self-organize, and hurt the ones that could. Anthropic's own practice with frontier Claude: simple guidance (write a note when a person asks or when something is clearly worth remembering), judgment left to the model.

## 5. Dreaming as correction: Mt. Moon

The failure chain is worth retelling because it shows how a wrong note corrupts reasoning. Claude wrote (wrongly) that the PokéCenter was east of Mt. Moon's entrance. Acting on the note, it declared "Mt Moon is behind me," marked "Mt Moon DONE," walked off a one-way ledge it couldn't see, and then — because its navigation tool didn't show the drop — confabulated "I overshot far west" and concluded it had been right all along. The environment's feedback was misread to *confirm* the bad note.

The dreaming pass gave Claude the one thing the note lacked: **the session transcript as ground truth**. It checked the note against the transcript, caught the error, rewrote it. With the corrected note, Claude went straight through Mt. Moon to Cerulean City. With the raw note, it dropped off the ledge three times, wrote "I'm going to stop rather than keep looping," was told to continue by the harness, and ended the run back in Pewter. Per Figure 8 (per the coverage cited in the header note), the no-memory control run *also* never got past the mountain — so on that account memory-corrected beat both memory-wrong and memory-none. Note the body text's own framing of the wrong note's harm is wasted loops and a retreat, not a worse endpoint than no-memory.

## 6. Dreaming as construction: wikis, hierarchy, focus, gap-filling

Beyond correction, the paper demonstrates four more dreaming functions:

**Building representations.** Over ~350k internal files (~420M tokens) from Stainless (acquired in May), Opus 5 agents built a wiki across **128 dreaming sessions** — exploring, writing/correcting linked pages, merging duplicates, checking claims against sources, coordinating via a shared log. Performance on a 25-question eval grew **13% → 48%** as sessions scaled 2 → 128. Wiki plus search beat search alone (61% vs 53% as the wiki grew) and saved **~20k tokens per question**. On the Harvey LAB merger corpus, 24 questions (over half requiring cross-document synthesis, many requiring judgment or math): **87% with the wiki vs 73% with search alone**. Two boundary conditions: a task whose criteria were single-document text-searchable showed no wiki gain, and one wiki **grew larger than the source documents** — Borges's map, abstraction failure, the same disease as Sonnet 3.7's 413 files in a different medium.

**Promotion up the hierarchy.** Dreaming can float notes into context injected at session start — but injected context costs tokens, wrong notes get carried everywhere, and longer instruction files reduce adherence (their own Claude Code docs). Hence Claude Code's auto memory loads only the first 200 lines / 25KB of `MEMORY.md` as an index. The top layer must stay small, and dreaming's job includes keeping it that way.

**Focusing memory on a goal.** On a contracts LAB task, generic wiki instructions let several agents write concurrently to one shared table of contract terms; they overwrote each other and only **41 of 57 graded facts (72%)** survived. A reflection loop let Claude rewrite the instructions; the fix was one page per contract, single writer, terms **quoted verbatim** rather than summarized: **57/57**.

**Filling gaps.** A second dreaming pass found nine links pointing to a page that didn't exist, repointed them, and added three pages including an index — cross-session repairs no single session could see.

## 7. Evidence grade — what's controlled vs. what's a story

**Reasonably controlled comparisons:** the steering A/Bs (per-rule vs. no-rule memory gain per model; Sonnet 4.6 with/without read-and-test prompting — Figure 5's two panels); the LAB 24-question wiki-vs-search arm (same items, two retrieval conditions, 87 vs 73); the Stainless wiki+search vs search-alone (61 vs 53, plus the 20k token saving); and the dreaming dose-response (13→48 across 2→128 sessions). The contract-facts 41/57 → 57/57 is before/after on the same grader, but the intervention bundled three changes (single writer, per-page structure, verbatim quoting), so attribution is confounded.

**Single illustrative runs:** the entire Pokémon section — one run each of Sonnet 3.7 and Fable 5 (badge counts are anecdote-grade; the 413-vs-9 file behavior is real but uncontrolled, and Pokémon runs are notoriously high-variance); the Mt. Moon correction (a constructed demonstration on a known-bad note — it proves the mechanism on its two named arms (the coverage-reported no-memory control is consistent but not body-text-confirmed), and says nothing about how often wrong notes occur or how often dreaming catches them); Opus 5.5 beating the game; and the CL-Bench generational ladder, which reads as qualitative folder autopsies rather than scored head-to-heads.

**Global caveats:** no error bars or run counts anywhere; the 25-question eval is small; the 61-vs-53 gap is modest on an unknown N; and even the headline wiki number is 48–61% — memory helps, it doesn't solve. To their credit, the paper doesn't oversell; but readers should weight Figure 5 and Figure 11 far above Figures 4 and 7.

## 8. Mapping to our fleet

**Where we already match.** Muse is nearly a 1:1 instance of the paper's endorsed architecture: curated `MEMORY.md` (the small injected index — as long as it stays an index of links, not content), daily notes (the session log layer), nightly background distillation (literally dreaming/sleep-time compute). The triples library outside any citizen's body matches their definition of memory as external, body-independent context, and prefigures the wiki finding — a shared, linked, persistent representation that survives individual sessions. Consult books match both context-injection/promotion (curated answers surfaced on demand — the *safe* variant, since it doesn't spend tokens every session) and the steering result that weaker models gain most from stronger guidance: a bigger model is a salience oracle for a smaller one. The league's written OPERATIONS doctrine matches the goal-focus finding — instructions are what shape what memory grows.

**Where we likely violate the findings.** Three suspicions, each an audit question rather than a verdict since I'm working from architecture description, not the schemas:

1. **State-triples.** Minecraft is the ultimate re-teller — block state, positions, inventories, and who-is-where are queryable every tick. Any of that in the durable triples library is Sonnet 3.7's disease: continuously stale, costing curation, misleading later sessions. The library should hold the Magikarp-timing kind of knowledge, not the money-and-map-position kind.
2. **Provenance.** Nothing in "triples library" implies provenance. Opus 5's differentiator was rules *with how-it-was-established*, and Opus 4.7's was confirmed/unconfirmed marking. A bare `(subject, predicate, object)` store is a PokéCenter-note generator: a fact written wrong or drifted stale gets trusted forever, and — worse than the paper's case — Minecraft citizens may have no session transcript to reconcile against. A wrong triple is plausibly worse than no triple (the no-memory control also failed to cross the mountain, but the wrong-memory run wasted three loops and a retreat first).
3. **Concurrent writes.** Many citizens writing to a shared knowledge store is exactly the 41/57 condition. The paper's fix was structural: single writer per page, verbatim quoting over summarization.

**The three highest-value changes their evidence supports:**

1. **Provenance + transcript-grounded reconciliation.** Add to every triple: a pointer to the transcript/session that produced it and a verification status (unconfirmed / confirmed / contradicted), Opus 4.7-style. Keep raw session logs immutable, and extend nightly distillation with a Mt.-Moon-style pass that samples the oldest or least-verified triples and checks them against the transcripts that created them. This is the single biggest lever because it converts the library from trust-me to test-me, and it uses an artifact (logs) we already have.
2. **The re-told/derived split with single-writer ownership.** Partition the library: volatile world-state lives in a queryable layer the world itself backs (the world *is* the database); durable memory holds plans, tested rules, traps, and strategy — each with the experiment that established it. Give shared entries one owning writer (per-topic pages, LAB's 57/57 condition) and put a Borges-cap on growth: dreaming merges duplicates and keeps pages as indexes with links, not simulacra of the territory.
3. **Tier-split steering and consult routing.** For strong models (Muse, anything consult-tier), doctrine should say what memory is *for* and stop — "record only failures" shows prescribed rules strip the benefit. For weak citizen models, prescribe the checklist that doubled Sonnet 4.6: read your notes before acting, and test a theory before it becomes a rule. Route consult books by task shape: the wiki result says curated representations win on cross-source synthesis and judgment (87 vs 73) but add nothing over direct search for single-fact lookup — lookup should query the triples directly and save the books for synthesis.

**Bottom line:** the paper's evidence maps remarkably well onto what we've built — we're on the right architecture. The gaps are all in the verification layer (provenance, reconciliation, write ownership), which is exactly the layer their weakest-evidence section (Mt. Moon) but strongest design instinct (Opus 5's rules-with-provenance) says decides whether a memory system compounds knowledge or compounds errors.
