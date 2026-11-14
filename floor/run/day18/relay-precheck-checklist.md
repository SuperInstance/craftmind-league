# DAY-18 GATE B — RELAY PRE-CHECK CHECKLIST

The run lane executes this at Gate B, **twice**: at the check and again
at the launch (closure §6: "RELAY-OK at check and launch"). It
implements the branch logic of `pulse/RELAY-TRUTH-CLOSURE-20261110.md`
§6 verbatim; this file is the checklist form of that instruction, not a
new rule. Written at the day-18 rig build (2026-11-10); the build-time
dry verification is recorded at the foot.

## The check

From **Thor**, with the Thor nvm node on PATH:

```
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$PATH"
cd ~/craftmind-league && node pulse/relay-check-day5.js
```

`RELAY-OK PASS` + **both units active** → **proceed**. Anything else →
the branches below, in order.

## Branch logic (closure §6, in its own terms)

- [ ] **PASS + both units active** (`systemctl is-active
      ddbridge-relay ddbridge-tunnel` on the VM both print `active`)
      → proceed. Nothing to restart; nothing to relaunch.
- [ ] **A leg down** (a unit exists but is inactive/failed; or
      relay-check fails while the units exist) → restart **that leg
      only**: `sudo systemctl restart <the failed unit>` — then
      re-verify: relay-check PASS **and** both units active, at the
      check and again at the launch.
- [ ] **Units ABSENT** (a fresh VM replacement has wiped `/etc` again)
      → run the bootstrap **once**: `/home/hatch/bootstrap-ddbridge.sh`
      (idempotent; lives in persistent `~`), then verify: `:8911`,
      `:8913`, and RELAY-OK — at the check and again at the launch.

## Never

- Never relaunch the setsid supervisors: with the units live they
  bind-fight (the units are the supervisors now).
- Never proceed on a failed or skipped check: a launch on a dead relay
  is the day-2/3/5 pattern — Gate B REFUSES.

## Dry verification at rig build (2026-11-10T16:26Z)

- `node pulse/relay-check-day5.js` from Thor: **RELAY-OK PASS**
  (usage reported by the live route).
- VM units: `ddbridge-relay` **active** (MainPID 9797),
  `ddbridge-tunnel` **active** (MainPID 9739).
- **Branch today: PASS + both units active → proceed.** The run lane
  still takes the check at its own Gate B and again at launch —
  this dry run retires nothing about the gate; it proves the
  checklist's first branch is the one the world is currently on.
