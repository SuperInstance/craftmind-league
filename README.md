# craftmind-league — the agent-community host (Thor side)

The Thor half of the Craftmind league topology (see
`docs/CRAFTMIND-MAP.md` in the rolling-perception repo, §5–§6):
the **world** lives on the Orin (Paper server, 192.168.0.50:25565,
offline mode); the **community** lives here on the Thor — bot
processes, local models, the mind-seconds governor, and the league
ledger. Human players join the Orin world from their laptops.

## Layout

```
~/craftmind-league/
  bots/
    craftmind/            working copy of Lucineer/craftmind (MIT) — the bodies
    craftmind-discgolf/   working copy of Lucineer/craftmind-discgolf — the league sport
    runs/<agent>/         per-agent run dirs (config + memory live here)
      cody/               craftmind.config.js + join-test.js
  proxy/
    governor.py           the mind-seconds governor (stdlib python3)
    start-governor.sh     detached start (pidfile in logs/)
  config/
    governor.json         governor config: upstream, budgets, ledger path
  ledger/
    mind-calls.jsonl      governor receipts (one line per model call)
    events.jsonl          league ledger: throws recorded as decisions
  logs/                   governor log, npm/clone logs, harness evidence
```

Working copies are *ours to change*; upstream repos are never
touched. Local changes vs upstream are enumerated at the bottom.

## The model endpoint (what the bots think with)

Inventory of what was actually serving on the Thor (2026-11-05):

| Endpoint | What it is | Chat? |
|---|---|---|
| `127.0.0.1:8310/v1` | llama-server, **Qwen3-Coder-30B-A3B** (alias `confluence-presence-brain`), GPU, warm | ✅ chosen |
| `127.0.0.1:8094/v1` | llama-server, d1-2B (+mmproj) under thor-admit | ❌ decision model — refuses chat completions (501, wants `/v1/systemone`) |
| `192.168.0.78:8181/v1` | llama-server, Qwen3-VL-8B, CPU-only (ngl 0) | ✅ but slow; usable as a per-agent override |
| `:8077` | jev-rack (I-JEPA / V-JEPA 2 / judge) | not a chat endpoint |

**Default upstream: `http://127.0.0.1:8310/v1`.** It is the presence
stack's brain — a shared tenant. The governor (below) is precisely
what keeps the league a polite one: every league call is budgeted
and receipted, and the presence stack is never touched directly.
To change the endpoint: edit `config/governor.json` `upstream.base`
(or set a per-agent override in `agentUpstreams`), restart the
governor. If the upstream is down, bots degrade to craftmind's
canned fallback replies and keep playing on the reflex tier —
by design (CRAFTMIND-MAP §1.3).

Node runtime: league bot processes use the nvm Node **v22.23.4**
(`~/.nvm/versions/node/v22.23.4/bin`) — the system node 18 has no
npm. Prefix PATH accordingly in every bot command below.

## The governor (attention budget → mind-seconds)

`proxy/governor.py` is the promotion CRAFTMIND-MAP §5.3 specifies:
craftmind's `AttentionBudget` counts *calls*; the governor counts
*cost*, per agent, with a durable receipt.

- Bots point `llm.apiUrl` at the governor
  (`http://127.0.0.1:8642/v1/chat/completions`) — never at a model.
- **Identity = the bot's apiKey**: `league-<agentname>` (set in
  `bots/runs/<agent>/craftmind.config.js`). The governor strips the
  prefix and meters that agent.
- **Mind-second** = wall latency of the upstream call — the seconds
  of model attention actually spent. Tokens are recorded too.
- **Budgets** (rolling 3600 s window, chat completions only):
  `config/governor.json` → `budgets.default` (120 calls/h,
  120 mind-s/h) and per-agent overrides (`budgets.agents.<name>`;
  cody: 240 calls/h, 300 mind-s/h). Over budget → **429** with an
  OpenAI-shaped error (`code: mind_budget_exhausted`); craftmind's
  brain reads that as an API failure and falls back to canned
  replies. The refusal itself is receipted.
- **Receipts** — one JSON line per call in `ledger/mind-calls.jsonl`:

```json
{"ts":"2026-11-05T22:25:23.731+00:00","agent":"cody","model":"confluence-presence-brain","status":200,"mind_seconds":0.189,"prompt_tokens":14,"completion_tokens":9,"total_tokens":23}
```

  Refusals carry `"refused":"mind_budget_exhausted"` and the budget
  snapshot. Streamed/non-JSON responses meter seconds with tokens
  null. The window is in-memory: a governor restart resets the
  hour (receipts remain the durable record).
- Introspection: `GET /healthz`, `GET /budget` (per-agent usage).

Start / stop:

```sh
~/craftmind-league/proxy/start-governor.sh     # detached, pidfile logs/governor.pid
kill $(cat ~/craftmind-league/logs/governor.pid)
```

Config override for testing: `GOVERNOR_CONFIG=/path/to.json python3 proxy/governor.py`.

## Running a bot

Each agent runs from its own run dir so `craftmind.config.js`
(per-agent brain wiring) and bot memory stay isolated:

```sh
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
~/craftmind-league/proxy/start-governor.sh          # if not running
cd ~/craftmind-league/bots/runs/<agent>
node ../../craftmind/src/bot.js --host 192.168.0.50 --port 25565 --username <Name>
```

(Personality defaults to the lowercased username — `PERSONALITIES`
in craftmind's `src/brain.js`; `cody` ships upstream.)

**Join test** (`bots/runs/cody/join-test.js`): connects one bot,
says hello in chat on spawn, stands still ~9 s, quits cleanly.

```sh
cd ~/craftmind-league/bots/runs/cody
MC_VERSION=<server version> node join-test.js
```

Status 2026-11-05: the Orin server answers and pings fine
(**Paper, MC version "26.3", protocol 777**, MOTD "Sitka —
Craftmind League (dev)"), but the join is **PENDING — blocked
upstream of us**: the newest published `minecraft-data` (3.119.0)
indexes 26.3 in its version list but does not yet ship loadable
data for it, so `minecraft-protocol` throws
`unsupported protocol version: 26.3`. Newest joinable today is
26.1. Retry the moment minecraft-data catches up:

```sh
cd ~/craftmind-league/bots/craftmind && npm install minecraft-data@latest
cd ~/craftmind-league/bots/runs/cody && MC_VERSION=26.3 node join-test.js
```

(Alternative, a server-side decision for the parent: run the Orin
world at MC ≤ 26.1 and the community joins today, unmodified.)

## The league ledger (disc golf)

`ledger/events.jsonl` — append-only, one JSON line per throw,
recorded **as a decision** (CRAFTMIND-MAP §5.5 item 1):

```json
{"ts":"2026-11-05T22:29:21.514Z","kind":"throw","agent":"LedgerBot","script":"veteran_hole","hole":1,"par":3,"disc":"proxy","shot":{"power":0.53,"hyzer":5,"aimYaw":null,"aimPitch":null},"wind":{"speed":3,"direction":45},"outcome":{"landing":"short","distance":4,"strokes":1}}
```

- Writer: `bots/craftmind-discgolf/src/league-ledger.js`
  (`recordThrow`), called from the `throw_disc` step in
  `src/scripts/script-engine.js` — the exact point where the runner
  has disc, shot params, wind, and the outcome. Read-only hook:
  it does not touch the result, the context, or the physics.
- **Flag-gated**: active only with `LEAGUE_LEDGER=1` (path override
  `LEAGUE_LEDGER_PATH`). Flag off = zero writes, behaviour
  byte-identical to upstream (verified against the repo's own
  test suite: 45/45 pass both ways; flag on, the suite's throws
  land in the ledger).
- Offline proof harness: `bots/craftmind-discgolf/golf-harness.mjs`
  runs a real v1 golfer script against `simulateThrow`;
  its ledger output is preserved in `logs/harness-events.jsonl`.
  (`events.jsonl` itself starts empty — the harness line was moved
  to logs so the league record begins with real rounds.)

## Local changes vs upstream (all in the Thor working copies)

**craftmind**
1. `src/utils/rcon-helper.cjs` — **upstream bug**: required
   `rcon-client` by an absolute path on the author's machine
   (`/home/lucineer/projects/craftmind/node_modules/rcon-client`);
   changed to the bare package name. Without this, `bot.js` cannot
   even be required on any other machine.
2. Dependencies refreshed within declared ranges for current
   Minecraft support (`mineflayer` 4.39.0, `minecraft-data`
   3.119.0; lockfile updated).

**craftmind-discgolf**
1. `src/engine/disc-physics.js` — **upstream bug**: `hitObstacle`
   was `let`-declared *inside* the integration loop but read by the
   landing classification *after* it — `simulateThrow` threw a
   ReferenceError on every completed throw (upstream's tests stub
   the throw, so never caught it). Hoisted the declaration; no
   force, trajectory, or classification logic changed.
2. `src/scripts/script-engine.js` — the ledger hook (above) +
   `options.agentName` threaded into the runner context.
3. New files: `src/league-ledger.js`, `golf-harness.mjs`.

## Gaps / not yet done

- **Join test pending** on minecraft-data 26.3 support (above) —
  the only unproven link, and it is upstream of the league.
- Governor budgets are admit-then-meter (a call already in flight
  can carry an agent slightly over); token caps per call are
  recorded, not clamped — a future rung if the league gets rowdy.
- One agent (`cody`) has a run dir; adding an agent = copy the dir,
  change username + `league-<name>` key, add a budget line.
- Disc golf in-Minecraft line (Engine B, snowball flight) is not
  wired to the ledger — only the simulator line is; Engine B needs
  a server to throw in, which waits on the same join unblock.
- Nothing here auto-starts at boot (no systemd units yet), and
  nothing has been pushed anywhere. This is a lab skeleton.

## Round 1 + execution noise (2026-11-06)

- **Execution noise** (`bots/craftmind-discgolf/src/engine/execution-noise.js`):
  the missing half of Engine A (CRAFTMIND-MAP §2.2 — the upstream
  thrower is deterministic). Behind `LEAGUE_NOISE=1` + a per-agent
  skill state `{throwsTaken}`: intended power/hyzer/aim are perturbed
  by Gaussian release noise scaled by
  `0.18 + 0.82 * exp(-throwsTaken / 180)` (rookie power σ 0.13,
  hyzer σ 9°, aim σ 6.5°; floor 18%). Constants and reasoning are
  documented in the module header. `simulateThrow` returns the
  executed shot; the ledger records what the hand did. Flag off =
  byte-identical (tests: 45 upstream + 4 noise tests, all passing;
  battery dispersion rookie 0.731 vs veteran 0.158 RMS blocks).
- **Citizens**: `bots/runs/{mara,jules,pip}/` — craftmind.config.js
  (governor identity league-<name>), citizen.json (personality, bag,
  style), skill-state.json (career throws, persisted per hole).
- **Round 1** (`bots/craftmind-discgolf/round-runner.mjs`): Acadia
  Pines, 9 holes, 3 citizens, 91 throws — Jules 28 (−2), Mara 29
  (−1), Pip 34 (+4). Played at 0.05× card distance because Engine A
  flies 3–8 units at any power (calibration gap, recorded in
  logs/round-1.md). Every throw ledgered; every throw narrated
  through the governor (91 calls, 40.435 mind-seconds, 0 failures).
  Full record: `logs/round-1.md` + `logs/round-1.json`. A first
  attempt was invalidated by a runner bug (onThrow never attached)
  and quarantined in `logs/round-0-failed-attempt.md` — the league
  ledgers were restored so the record begins with this round.

## Calibration + Round 2 (2026-11-07)

- **Distance calibration** (): Engine As

## Calibration + Round 2 (2026-11-07)

- **Distance calibration** (`config/discgolf-calibration.json`): Engine A's
  distance defect is fixed league-side, physics untouched (the suite still
  passes 49/49 and flag-off behaviour is unchanged). One declared parameter,
  `distanceScale = 0.0455`, maps card units onto the engine's native units,
  derived from a measured carry battery (`bots/craftmind-discgolf/calibration-battery.mjs`
  → `logs/calibration-battery.json`): as built, release speed
  v0 = (22 + 8·speed/14)·power saturates hard against drag (a full-power Boss
  at 29.4 m/s carries 7.963 units; the whole bag spans 5.05–7.96), and the
  scale sets that reference drive at 175 card units. The card maps to the
  engine rather than the engine scaling to the card because the noise model's
  constants (and the capture/obstacle geometry) are only meaningful in
  engine-native units — the two transforms are mathematically identical and
  this side keeps Magnus's thrower pristine. Companion rules in the same
  config: the holing circle is 6 card units (Round 1's flat 0.75 engine units
  was a 15-unit gimme circle, masked by underthrowing), and shot selection in
  `round-runner-2.mjs` inverts the measured per-disc carry table (Round 1's
  scale-bound power formulas and their 0.22 putter floor — the measured cause
  of the close-putt overshoot — are gone). Validation before play, 6 simulated
  rounds per card: on the Round 1 card at full distances, veteran means
  24.8/32.8 (par reachable, not trivial); on the Round 2 card, 30.0/30.5.
- **Round 2** (`round-runner-2.mjs`, `logs/round-2.md` + `round-2.json`):
  Acadia Pines mutated against Round 1's evidence (distances only, pars and
  identity unchanged — per-hole rationale in round-2.md). Mara 25 (−5),
  Jules 36 (+6), Pip 41 (+11); 102 throws, all ledgered; 102 narration calls,
  50.7 mind-seconds, 0 failures. Single-round variance around the validated
  means ran both ways (Mara hot, Jules cold: an 8 on H5, a 6 on H7).
