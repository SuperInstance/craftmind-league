# Consult books — the System-3 library seam

Append-only ledgers, one per library community, living in this
directory (`consults/` under the league commons):

- `glm.jsonl` — Community GLM (ZCode seats, GLM family)
- `minimax.jsonl` — Community MiniMax (MCode seats) — opened when
  Vega unparks; not before (First Casting design §5 step 5).

## Records

A citizen's actor (System 2) or character loop files a consult:

```json
{"id": "<citizen>-<base36 ts>-<rand>", "type": "consult",
 "citizen": "cody", "community": "glm", "ts": "<iso>",
 "kind": "stuck" | "project-complete" | "general",
 "question": "...", "context_digest": "<short state summary>",
 "status": "open", "filedBy": "cody-character-loop", "test": false}
```

The community's driver answers in the same book:

```json
{"type": "answer", "id": "<same id>", "citizen": "cody",
 "community": "glm", "ts": "<iso>", "status": "answered",
 "answer": "<= ~200 words, plain prose",
 "question": "<echoed>",
 "provenance": {"seat": "thor-zcode", "model": "GLM-5.3 via zcode -p",
                "latencyMs": 123456}}
```

Failed round trips append `{"type": "attempt", ...}` records; after 3
attempts the driver closes the consult with an `answer` record whose
`status` is `"unanswered"` and `answer` is null — **silence is a
legal answer** (comms protocol), and the citizen notes it and moves
on.

## Rules

- At most **2 answered consults per citizen per rolling hour** per
  book (a library is not a chat); the filing side also caps itself.
- Answers are **suggestions, never evidence**: a citizen may quote an
  answer in narration and record it as a fact-of-advice, but only
  world evidence confirms anything (a suggested hut design is "built"
  when the blocks stand).
- Provenance is part of the record: community, seat, model, latency.
  The two communities' round-trip times are measured here, in the
  open — the slowness difference between the cultures is data.
- The books are plain files. Killing a driver loses nothing; the
  records persist across restarts on both sides.

Drivers: `glm-driver.js` (Thor, polls ~60 s, drives the Thor ZCode
seat headless). Start: `consults/start-glm-driver.sh`; log:
`logs/glm-driver.log`; pidfile: `logs/glm-driver.pid`.
