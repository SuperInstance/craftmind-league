# Seat take — MCode (MiniMax, Thor seat): Sage-A1.5 Verification Mode — evidence, decision rule, fleet mapping
Date: 2026-11-08 · Source piece: InferenceKey, "An AI that double-checks its work is not always worth the wait" (Medium) + inferencekey.com full write-up
Note: recovered verbatim via tmux capture-pane from the MCode TUI (seat file writes are operator-gated); pane line-wrapping removed. Front-matter added by the driving lane; the take below is the seat's output untrimmed.

---

Verification Mode: what the evidence actually licenses us to conclude

Bottom line: Verification Mode is not "double-check your work" as a virtue; it is buying more evidence, and it only pays when the first pass is likely wrong and the verification pass can reach a
source the first pass did not. The InferenceKey evidence supports rationing verification by task class. It does not support blanket verification, and it does not support blanket distrust either.
The sharpest reading of the whole thing: a second pass over the same evidence buys nothing; a second pass over new evidence buys whatever the second pass finds. Everything else follows from
that.

1. What Verification Mode mechanically is

One line added to the agent's standing instructions. From the full write-up, the trigger is literally a system-prompt suffix — the InferenceKey example uses:

system = "You are a careful research assistant." + "\n\nVerification protocol: enabled"

Directly against llama-server, the documented switch is chat_template_kwargs={"verification": true}, which requires a non-empty system message and a JSON boolean or it returns HTTP 400. That is
the whole mechanism: no extra tool, no separate model, no scaffolding. The agent re-reviews its own answer before handing it over.

Two details matter and are under-advertised. First, the trigger string is case-sensitive — the authors' project page writes "Verification Protocol" while the template expects lowercase
"protocol"; InferenceKey used the template's string. Second, the OpenAI-compatible endpoint of their own platform silently drops chat_template_kwargs, so {"verification": true} through that
endpoint returns HTTP 200 and does nothing at all — as does the nonsense value {"verification": "maybe"}. InferenceKey worked around it by byte-diffing /apply-template with and without tools to
prove the prompt really changed.

Hold that thought for §6: that is our doctrine's exact failure mode in miniature — a verification instruction that was configured, acknowledged, and was a no-op returning success.

2. The easy-question economics, and what 12 answers can and cannot show

Measured on one RTX 4090, three Wikipedia questions (rhenium, hafnium, technetium), two runs each, six runs per setting:

┌───────────────────────────┬────────┬────────┐
│                           │ Off    │ On     │
├───────────────────────────┼────────┼────────┤
│ Answers right             │ 6/6    │ 6/6    │
├───────────────────────────┼────────┼────────┤
│ Average time              │ 11.2 s │ 25.0 s │
├───────────────────────────┼────────┼────────┤
│ Average tool calls        │ 4.0    │ 6.5    │
├───────────────────────────┼────────┼────────┤
│ Average completion tokens │ 934    │ 1,890  │
├───────────────────────────┼────────┼────────┤
│ Average reasoning chars   │ 2,778  │ 5,662  │
├───────────────────────────┼────────┼────────┤
│ Mean turns                │ 5.0    │ 7.5    │
└───────────────────────────┴────────┴────────┘

Every answer right both ways. Wall time 2.2×, tokens 2.0×, tool calls 1.6×. The extra turns were "Let me verify" moves on facts already pinned down. The key image shows the hafnium question: off
13.6 s / 5 calls / 1,159 tokens; on 24.7 s / 9 calls / 2,320 tokens, with the amber boxes on turns 8–10 labelled already confirmed, still checking again.

Sceptical grading. This test supports a cost claim well and an efficacy claim not at all.

- Cost claim: solid. Doubling tokens and roughly doubling wall time is a large effect relative to run-to-run variance, and it is visible in the raw traces, not just the means. If you are paying
per token, Verification Mode on easy work is close to a 2× bill.
- Efficacy claim: unmeasurable, not "zero." A design with a 100% base rate has no discriminating power. To detect a +10-point accuracy gain with n=6 per arm, you would need an error rate above
zero in at least one arm; there is none. The correct statement is "no benefit was detectable," not "no benefit exists."
- The mean is doing a lot of work. Per-question the effect is bimodal, not uniform. The other hafnium run was 15.9 s on vs 15.5 s off — essentially identical, with the mode on making six tool
calls against seven off. The other extreme was a 52.7 s run caused by a Wikipedia timeout, not by verification. So the headline "2.2×" is a mean over a bimodal distribution, not a stable
per-task multiplier.
- Precision fix: the Medium piece says "all 12 answers were correct, six runs per setting." The write-up's table shows 6/6 per setting — 6 answers per mode, 12 total, 3 questions × 2 runs each.
Same total, but the "12/12" framing overstates the sample size if read as 12 per setting.
- Biggest interpretive caveat: InferenceKey states plainly that they did not see the structured "what is established, what failed" review from the authors' demo. The extra turns were plain
re-checks. On a 5-bit quant served by llama.cpp, the trained verification behaviour may be attenuated. So the honest finding is: re-reading the same evidence buys nothing — which is not the
same as verification buys nothing.
- Also unverified: whether the authors' 81.7 BrowseComp headline already includes the gain. InferenceKey says explicitly: "We cannot tell whether the 81.7 already includes that gain." (82.9 with
verification vs 81.7 headline strongly suggests it does not.)

3. The authors' hard-question result, and the reconciliation

Lou and 98 co-authors (arXiv 2610.28578, 20 Oct 2026) report, in a separate on/off test across all 1,266 BrowseComp questions, Verification Mode lifting 72.5% → 82.9%. BrowseComp is built around
facts that are hard to dig up online, where the first search often points the wrong way. Their headline table shows BrowseComp 81.7 (82.8 with orchestration) against Kimi-K3 91.2.

Derive the mechanism: at 72.5%, 918/1,266 correct; at 82.9%, 1,050/1,266. 132 questions rescued. Of the 348 initially-wrong answers, verification recovered 38% and left 216 wrong. That 38%
recovery rate against a doubled search budget is the number that should travel, because it is the parameter any decision rule needs.

The reconciliation the piece offers is right but under-specified: verification pays exactly when the first pass is likely wrong, and is pure cost when it is likely right. What I would add is
why, and it is not about difficulty in the abstract — it is about information reach. On BrowseComp the first search leads somewhere plausible-but-wrong; the verify pass finds a different source
and that is where the correction comes from. On the hafnium question there is no second source worth having, so the second pass re-reads the lunch order.

Which reframes the intervention. If the gain is mostly "more and better search," then the honest label for Verification Mode is a tool-budget multiplier with a reflection prompt attached — and
the derived policy is "search again when your first lead is likely wrong," not "think again." Reflection on the same context is nearly free of value; a second, independent evidence-gathering
path is where the value is.

Sceptical grading of the BrowseComp result. Larger N, so the +10.4 points is not a fluke of sample size. But: BrowseComp is non-deterministic, seed variance on such harnesses is typically ±1–2
points, and the paper (as relayed) does not foreground seeds, tool budgets, or whether the verification arm got more tool calls than the baseline arm. If it did, the comparison is partly "more
compute" versus "more compute" — which is fine, but it means the knob is compute, not checking. And none of it is independently reproduced: the authors' scores come from BF16 with their harness;
InferenceKey ran Q4_K_M on llama.cpp with their own tools and explicitly did not reproduce.

4. Deployment facts, and the launch-flag parable

35B MoE, ~3B active per token (256 experts, 8 per token plus a shared expert), retrained from Qwen3.6-35B-A3B and the lab's earlier Agents-A1. Q4_K_M GGUF is 21,713,463,520 B (~5 bits/param)
plus a 899,282,880 B vision projector ≈ 22.6 GB; BF16 is ~72 GB. Apache-2.0 throughout, not gated.

On one RTX 4090 (24,080 MiB, 203 W cap, llama.cpp b9748): ~136 tok/s decode for a single request (129–139 across workloads), first token ~0.22–0.32 s, a 1,489-token reply in ~11 s. Prefill 2,987
tok/s on a 92,662-token needle prompt (found 7342-ORCHID in 31 s). VRAM: 21,760 MiB at 32K context text-only with 2 slots; 23,684 MiB at 64K with the projector; 23,920 MiB at 128K text-only —
the card is nearly full at 128K. Below 24 GB the model partially spills to system RAM: emulated 16 GB → 14,708 MiB, ~5.6× slower, still right in 98 s; emulated 12 GB → 11,052 MiB, 92.8 s;
emulated 8 GB → 3,048 MiB, one of two runs burned its 12-step limit at 270 s without an answer. Real 16/12 GB cards were never tested.

Agentic Orchestration worked: one three-part question (years between the discoveries of hafnium, rhenium, technetium), three sub-agents in parallel, tool calls in exactly the JSON shape their
code could run, right 4/4 including the recorded take — 1923, 1925, 1937, "14 years." One operational lesson: their platform's default max_in_flight of 1 queued the sub-agents, 72.0 s; raising
it to 2 gave 49.7 s and 55.7 s. Parallelism that defaults off is latency you are donating.

The parable. The authors' own llama.cpp command asks for --reasoning-format deepthink. llama.cpp has none|deepseek|deepseek-legacy|auto — no deepthink, not even in b12000 (2026-10-30). The
server quits on start: "Unknown reasoning format: deepthink." InferenceKey fixed their example to deepseek; the authors' card is still wrong.

This is a parable about the difference between an instruction that is written down and a mechanism that is verified to fire. A standing instruction, a documented flag, a passing happy path, and
a green status message are not evidence of execution. InferenceKey found the same class of failure inside their own product: the endpoint accepted {"verification": true} with HTTP 200 while
dropping the kwargs, so verification was "on" and off at the same time. They only caught it because they byte-diffed the rendered template. Two near-misses (a casing-sensitive trigger, a
silently dropped kwarg) and one hard crash, all in the same verification plumbing.

5. A decision rule an agent system can actually implement

Verification pays iff:

P(first pass wrong) × R × C_error  >  C_verify

with R ≈ 0.38 (recovery rate of wrong answers, derived from BrowseComp) and C_verify ≈ 1.0 × C_task (InferenceKey's on-arm wrote 2.02× the tokens of the off-arm, so the incremental cost ≈ the
base task cost; wall time 11.2 → 25.0 s).

Solving for break-even error rate: P(wrong) > C_task / (0.38 × C_error).

- If a wrong answer costs 10× the task → break-even at P(wrong) ≈ 26%.
- If a wrong answer costs 100× the task (operator redoes it manually, or a hallucinated line ships publicly) → break-even at P(wrong) ≈ 2.6%.

Two further gates, both empirically grounded:

Gate A — new-evidence test. Run a verify pass only if there is a named second source, second tool, or falsifying check available. If the verifier can only consult what the first pass already
saw, you will get exactly what InferenceKey observed: "Let me verify" on facts already confirmed. This is the mechanistically correct reading of the BrowseComp gain and the strongest single rule
in this whole take.

Gate B — irreversible-action test. For anything destructive, financial, permission-granting, or public-facing, verification is never a substitute for authorization or human sign-off. Passing a
check does not authorize the action.

A cheap difficulty estimator. Do not spend a model call to estimate difficulty. Use signals already emitted by the running first pass, at zero marginal cost:

- Process signals: failed or empty tool calls; number of distinct sources consulted; whether the agent hedged or expressed uncertainty; whether it cited one source or several; conflicting-source
flags.
- Task-shape signals: multi-hop (the answer requires joining facts from different pages); freshness requirement (recent, eventful, or volatile facts); rarity (obscure entities); ambiguity;
presence of a deterministic oracle.
- Oracle presence: does a script exist that can check this? If yes, that script is both a better verifier and nearly free.
- A cheap model, not the same model: the verification need not be priced at the first pass's rate. A small model with new tools verifies a strong model's answer for a fraction of the cost.
InferenceKey's 2× was 2× of the same model; nothing in the data says it must be.
- Learned classifier: train a logistic regression on your own run history — features above → label "would have been wrong" — and audit it periodically. You already have the labels: your
claimed-but-not-done failures are the training set, and nobody else does.

Keep the trigger cheap in the other direction too: verification must be allowed to terminate in "first pass confirmed, no new evidence sought" at near-zero cost, and must be permitted to abstain
rather than elaborate.

6. Mapping to our fleet

Our doctrine — verify completions against world evidence, never trust self-report — was born from repeated claimed-but-not-done failures. That origin matters, and it should constrain what we
change. The failure mode that produced the doctrine was existence failure: the agent said it happened, it did not happen. The InferenceKey evidence is about content failure: the answer's content
was wrong. Those are different problems with different optimal solutions, and our doctrine currently spends the expensive solution on both.

What the evidence says about blanket verification: on low-error classes it is not merely wasteful, it is actively counterproductive — 2.2× latency and 2× tokens for zero measured accuracy
change, on every single completion, forever. The operator's waiting time is the scarcest resource in our fleet, and blanket verification donates a fixed fraction of it on every task regardless
of whether the task was ever at risk. Worse, it trains us to ignore verification output: a check that fires on 100% of traffic and almost never says anything is a check nobody will read.

What is still non-negotiable: existence verification where the answer determines whether something happened. If a daylight command did not land in the server log, the log is the truth and the
agent's report is worthless. That is not a lint, it is the entire point of the doctrine, and nothing in this evidence touches it.

### Three sharpest adjustments

1. Split the doctrine in two, and re-price each half. Class A = existence verification (did the command land? did the file get written? is the deploy up?). Class B = content verification (is the
answer right?). Class A must be unconditional and must become deterministic — a scripted assertion with a boolean exit, not a second model pass. A grep of the log for the request ID costs
milliseconds and is near-perfect; a model re-reading the same log costs a model call and might still say "Let me verify." Class B is where rationing belongs. Every daylight command's log check
should end up as a script, and the LLM second pass should run only when the script is inconclusive (log shows the command started but not completed). This is where our largest, most defensible
waste is: we are paying a probabilistic verifier to answer a question a deterministic one answers better.

2. Replace blanket content-verification with a per-class error ledger and an explicit break-even. Our doctrine was never empirically calibrated — it was a response to a specific and memorable
failure mode, then generalized to everything. So: use the claimed-but-not-done incident history as labelled data. Split task classes by measured first-pass error rate and by cost-of-error, and
apply the formula from §5 literally. Internal drafts and routine lookups with low error rates and low cost-of-error → sample-audited at 10–20%, with audit results feeding the ledger.
Public-facing text and irreversible claims → always verified, and verified with a different evidence source (Gate A). Tier boundaries get re-derived every quarter from the ledger, not defended
from the doctrine. And the ledger's headline metric should be "verifications that changed the answer per operator-minute spent" — if that number is near zero for a class, verification in that
class is theatre, and theatre costs the thing we can least afford.

3. Change the shape of the verify pass and keep it off the operator's critical path. Two clauses. (a) Verification must demand new evidence, not a re-read. Our verification instruction should
specify the mechanism: consult this named second source, run this falsifying check, output a verdict with citations, and return "no additional check needed" at near-zero cost when the first pass
holds. The InferenceKey failure mode is what unspecified verification looks like — doubled tokens of restating settled facts. Specify the source, not the mood. (b) Asynchrony. For Class B tasks
where the operator is not about to act on the result within seconds, the verify pass runs after delivery, its result landing as a correction when it exists. Only tasks the operator will act on
immediately get the synchronous double-check. This is the single largest available reclaim: 2.2× latency on every completion becomes 2.2× latency on the small minority of completions that
warranted it.

And one ritual, borrowed directly from the launch-flag parable: periodically prove that your verification triggers still fire. InferenceKey found an HTTP-200 no-op verification flag and a
casing-sensitive trigger in the same subsystem, and only caught them by byte-diffing the rendered template. Our "verification is on" flag is the same shape of claim — a configuration, not a
fact. Verify it by observing a behaviour change (a rendered-prompt hash, a distinct verdict token, a changed tool-call pattern), never by the fact that the request returned 200. Our doctrine
says never trust self-report; the strictest application of that doctrine is that we do not trust our own verification switches until we have watched them visibly change what the agent does.

Sources: Medium piece (https://medium.com/@inferencekey/an-ai-that-double-checks-its-work-is-not-always-worth-the-wait-5e76ba189f13) · InferenceKey write-up (https://inferencekey.com/research/sage-a1-5-agent-one-gpu) · arXiv paper (https://arxiv.org/abs/2610.28578) · project page (https://alpha-innovator.github.io/Sage-A1.5/) · Q4_K_M GGUF (https://huggingface.co/InternScience/Sage-A1.5-Q4_K_M-GGUF)
