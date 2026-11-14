# World Digest v0 — the game-master's perception feed

This directory is the first build of the digest specified in
`docs/ARCH-AGENT-COMMUNITY.md` §3 (Layer 1 — rolling perception: one percept
of the moment) in the parent repo (github.com/SI-Thor/rolling-perception).
§3's contract: a service on the Thor maintains the continuously updated
state of the world and the community — positions, movements, events,
completions, utterances, scores — as choreography, not raw sensation, so
the slow minds (a game-master first) can tap one rolling percept instead of
re-scanning every feed and ledger themselves.

Status: **v0, live 2026-11-07.** One Node process (stdlib only), ~10 s tick.

## What it publishes

- `digest.json` — the current full digest, atomically replaced each tick.
  This is the file a game-master (or any slow mind) reads.
- `digest.jsonl` — the ledger form, append-only. Each tick appends one
  record: a **delta** (notes, newly seen events, changed citizen fields),
  or a **full snapshot** — snapshots are written only on bootstrap and when
  citizen presence changes (a feed going live/stale/missing: the membership
  of the digest changed). Deltas are the point; the ledger is the digest's
  memory of what changed, in order.
- `state.json` — service-internal rolling state (input cursors, last-live
  snapshots, event buffer, weather). Persisted so a restart resumes the
  roll instead of re-seeding.
- `logs/digest.out`, `logs/digest.pid` — run log and pidfile.

## Schema of digest.json

```
{ kind: "world-digest", version: 0, ts, tick,
  timeOfDay,            // from the freshest live citizen feed
  phase,                // day | sunset | night | sunrise (derived)
  timeSource,           // which citizen's feed the time came from
  weather: { state,     // clear | rain | thunder | unknown
             source,    // provenance, e.g. "server-log weather command"
             since },
  citizens: { <Name>: {
      lineage, pos {x,y,z}, health, food, deaths, stage,
      inventory: { total, items: {name: count} },
      anchor,
      feed: { status,   // live | stale | missing  (+ ageSec, feedTs)
      lastEvent,        // newest merged event naming this citizen, or null
      extra? } },       // lineage bits: Cody behaviour, Vega standingOn/stuck, Geist oxygen
  recentEvents: [ {ts, source, kind, citizen, summary} ],   // last ~20, merged
  worldNotes: [ "derived delta strings" ] }
```

`worldNotes` are computed per tick against each citizen's **last live**
snapshot: movement > 5 blocks, deaths (with the server-log cause when one
arrived), item types gained/lost, health drops ≥ 3, stage changes, and feed
presence transitions.

## Inputs (all read-only)

| Input | What the digest takes from it |
|---|---|
| `~/craftmind-league/pulse/cody-state.json` | Cody's position/health/food/deaths/stage/inventory |
| `~/craftmind-league/lineage-b/vega-state.json` | Vega's same |
| `~/craftmind-league/lineage-c/geist-state.json` | Geist's same |
| `~/craftmind-league/commons/SCOREBOARD.jsonl` | exam events (attempt/pass/fail) |
| `~/craftmind-league/pulse/ledger.jsonl` | trials and gates (Lineage A's verdicts) |
| `~/craftmind-league/commons/comms/chat.jsonl` | utterances + comms delivery events |
| Orin `~/minecraft-server/logs/latest.log` | tailed over `ssh orin-lan` (the comms daemon's pattern, an independent second tail): joins/leaves, death messages (causes), weather commands |

The three JSONL ledgers are read through **byte cursors**: a tick consumes
only the bytes appended since the previous tick and merges them into a
rolling 20-event buffer. History is never re-scanned — on a cold boot the
cursors seed once at each file's tail (last 64 KB) so `recentEvents` starts
populated, and every later tick and restart is purely incremental.

## Silence semantics

Inherited from §3/telltape and load-bearing: a feed whose file has not
changed within 90 s receipts as `stale`, an unreadable feed as `missing`,
and the transition is written into `worldNotes` as **state UNKNOWN, not
calm**. A quiet digest region means "nothing happened" only while the feeds
demonstrably update. Deltas are computed against the last *live* snapshot,
so changes that happened during a feed gap are reported on recovery without
inventing a time for them.

## Known blindnesses (v0)

- **No block-level world state.** The digest cannot see shelters, doors,
  chests or any structure except as exam verdicts on the scoreboard. A
  citizen standing next to a finished house is indistinguishable from one
  standing in a field.
- **No non-citizen entities.** Mobs, other players, dropped items and
  projectiles are invisible, except when a mob writes a citizen's death
  message into the server log.
- **Weather has no sensor.** It is known only when an operator (or the
  cameraman) issues a `/weather` command that lands in the server log;
  natural weather changes between commands are missed, and the entry
  carries its provenance and age for exactly that reason.
- **Feeds are bot-reported, not server-truth.** §3 names server state the
  authority; v0 reads the bots' own state files. A stale feed is caught
  (above), but a live feed that is wrong would be believed.
- **Only ledgered acts exist.** An in-world act that leaves no trace in the
  three ledgers, the server log, or a state-feed delta (a block quietly
  placed and removed between ticks) never happened as far as the digest
  knows. Movement between ticks is seen only as net displacement.
- **Chat arrives via the comms daemon's ledger** (chat.jsonl), not from the
  raw log; if the daemon is down, utterances stop appearing even though the
  digest's own tail still sees joins, deaths and weather.
- **Time comes from the citizens' feeds** (bot-side clocks). If all three
  feeds are stale, `timeOfDay` freezes at the last live value and
  `timeSource` says whose it was.

## What a v1 needs

- **An Orin-side probe feed**: a small server-side tap on the Orin
  publishing what only the server knows — the player/entity census near
  each citizen, true weather, block-change events, and server-side
  positions — as one more state file the digest can roll in. That single
  feed closes the first four blindnesses.
- **Subscription tiers** (§3/§4): per-reader cadence and granularity, and
  the novelty check ("has anything changed near this reader since its last
  slot?") that makes a quiet slot cost almost nothing.
- A digest for the pond and the smiths' ledgers, once the game-master is a
  real consumer and its reading pattern is measured rather than guessed.

## Operations

- Start: `./start-digest.sh` (idempotent; nohup + pidfile, the
  governor/comms pattern). Stop: `kill $(cat logs/digest.pid)`.
- The service touches nothing outside this directory; every input is a
  read. It never speaks in chat and never grades the exam.
