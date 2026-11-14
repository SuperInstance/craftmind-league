# The league's brain — launch record

The mind behind the governor (:8642) is the Confluence presence brain:
Qwen3-Coder-30B-A3B-Instruct Q4_K_M served by llama-server on
127.0.0.1:8310 (alias `confluence-presence-brain`). The governor's
upstream is `http://127.0.0.1:8310/v1`; every lineage's planner,
calculator, smith and narration calls land here.

## How it is launched (the only legitimate route on this box)

    cd ~/confluence-play/slice2/app-v3 && ./brain-server.sh start winner 8310
    ./brain-server.sh stop 8310     # stop
    ./brain-server.sh status        # status

The script runs `thor-admit serve Qwen3-Coder-30B-A3B --port 8310
--peak 24G -- llama-server …` as the transient systemd user unit
`presence-brain-8310.service`. Do NOT launch llama-server directly:
thor-admit treats unleased multi-GB processes as runaways and kills
them (three launches died that way on 2026-11-01; see the header
comments in brain-server.sh, which is the authoritative launch config).

## Current launch parameters (2026-11-06)

    llama-server -m ~/models/Qwen3-Coder-30B-A3B-Instruct-GGUF/Qwen3-Coder-30B-A3B-Instruct-Q4_K_M.gguf
      --host 127.0.0.1 --port 8310 -ngl 99 --ctx-size 16384
      --alias confluence-presence-brain     (under thor-admit, --peak 24G)

## Change log

- 2026-11-06: `--ctx-size 4096 → 16384`. Geist's planner prompts
  (4518–4543 tokens and growing, as memory/reflections accumulate)
  were failing with governor HTTP 400 "request exceeds the available
  context size (4096 tokens)"; Lineage B hit the same ceiling earlier
  as HTTP 500s. Relaunched identically except the context value via
  brain-server.sh stop/start; outage ~45 s; presence backend :8330
  and the governor needed no restart. Verified: /health 200; a
  9,940-token prompt through the governor under a league identity
  returned 200 (previously impossible past 4096).

If prompts outgrow 16384, raise the same single value in
app-v3/brain-server.sh and relaunch the same way.

## Governor budgets (config/governor.json, rolling 3600 s window)

Budgets live in ~/craftmind-league/config/governor.json and are loaded
by the governor (proxy/governor.py, :8642) at startup only — restart it
via proxy/start-governor.sh (kill the pid in logs/governor.pid first;
the script refuses to start a second copy) after any budget edit.

- 2026-11-06: geist 120 calls / 120 mind-s → 300 calls / 900 mind-s.
  Reason: the Lineage C deliberator was starving — planner calls were
  refused with HTTP 429 "mind_budget_exhausted" at 124.2/120 mind-s
  used (comms night report; caught live in the ledger again minutes
  before this change). 120 mind-s/hr is structurally too small for a
  planner whose prompts run ~4.5K tokens; the new values match
  geist-mind (300/900). Config backup:
  config/governor.json.bak-20261106-224506. Verified after restart
  (new governor pid 2141516, /healthz ok): a chat completion as
  league-geist returned HTTP 200, ledger status 200 (previously 429).

## Governor identity fix — Geist (2026-11-07)
Diagnosis: lineage-c/minds.js API_KEY literal was the 15-char redaction-marker string itself, baked into the source by redacting tooling at some earlier pass (present in the pre-comms backup too). The governor derives the agent from the token; with no league- prefix it matched no configured identity, so ALL Geist mind calls ran on the DEFAULT budget (120 calls / 120 mind-s) under the raw token as pseudo-agent. The configured geist-mind identity (300/900) was never used; the geist identity (300/900) likewise only ever saw an operator test ping. Fix: minds.js literal rewritten to league-geist-mind (backup minds.js.bak-markerfix-20261107), node --check OK, marker grep 0, league-wide audit found no other live file with the marker literal. geist restarted via start-geist.sh. Lesson: any file that passes through redacting tooling must be grep-audited for the marker before it runs again — a placeholder key fails silently because the governor has a permissive default.
