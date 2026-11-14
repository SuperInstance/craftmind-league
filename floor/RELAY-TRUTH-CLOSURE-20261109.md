# RELAY TRUTH CLOSURE (2026-11-10)

*One lane, one contradiction. Authorisation: Casey's "build it all" +
parent sequencing; routed by the noticing final
(`commons/noticing/report-2026-11-09.md`, actionable item 2 — "this
report's most concrete"). The commission: make
`floor/FLOOR-REPAIR-20261109.md` §4 true on the box that serves, or
correct the filing with instance evidence. **Route taken: (A) make it
true — with the (B) correction also appended, because both halves are
facts: the claim WAS false on the serving instance for days 12–17,
and it is true again now, in a form built against the measured cause
of its falseness.***

## §1 — THE CONTRADICTION, AS INHERITED

§4 of the floor-repair filing (2026-11-09) describes both VM legs of
the ddbridge path as systemd system services —
`ddbridge-relay.service` (`ddbridge.py` :8911) and
`ddbridge-tunnel.service` (ssh `-R 127.0.0.1:8913` to Oracle), enabled,
`Restart=always`, sharing `/etc/systemd/system/ddbridge-egress.env` —
installed, cut over from the setsid supervisors, and kill-tested on
the lane's instance (relay SIGKILL 00:47:05Z → restored, `NRestarts=1`;
tunnel SIGKILL 00:47:13Z → restored; RELAY-OK PASS from Thor after
each kill). Every subsequent day lane found the opposite on the box
that serves: day 12 (down at pre-check, unnumbered), day 13 (death
#9), day 14 (death #10), day 16 (death #11), day 17 (death #12) — no
units anywhere, the setsid supervisors dead (day 17's relaunch briefly
bind-fought over :8911 before settling to exactly one pair), a manual
setsid relaunch, RELAY-OK verified from Thor at check and at launch,
5-for-5. Twelve numbered deaths all-time, one shape.

## §2 — CURRENT STATE, AS FOUND ON THIS INSTANCE (2026-11-10 ~16:03Z)

- **The relay was DOWN.** Nothing listened on VM :8911; Oracle
  loopback :8913 was not listening; `relay-check-day5.js` from Thor:
  `RELAY FAIL: read ECONNRESET`. (Thor's own leg, `ddbridge-fwd.service`,
  was active throughout — the break was both VM legs, as always.)
- **No supervision of any kind was running.** `ps`: no ddbridge
  process, no supervisor, no tunnel ssh. `systemctl list-units` and
  `list-unit-files`: no ddbridge units. `/etc/systemd/system/`: no
  ddbridge files, and no `ddbridge-egress.env`.
- **The day-17 pair was dead with its instance.** The pidfiles in
  `~/workspace` (`ddbridge-supervisor.pid` 5963,
  `ddbridge-tunnel-supervisor.pid` 5965, `ddbridge-relay.pid` 5967 —
  the exact pids of day 17's record) all pointed at dead processes.
  Their logs end 2026-11-10T11:20Z (supervisor respawn loop against a
  bind fight) and 09:34Z (tunnel: `remote port forwarding failed for
  listen port 8913` loop, then `client_loop: send disconnect: Broken
  pipe`).
- **The instance itself is new.** Hostname `htch-runtime`, booted
  **2026-11-10T14:35:19Z** (`btime 1794321319`; boot_id
  `29a3936c-4bf4-4c3b-a705-dd5f4aa0ed1e`; uptime 1 h 28 m at first
  check). The whole `/etc/systemd/system` directory is stamped
  14:35 — created at this boot — and holds only stock distro units.
  systemd IS PID 1; passwordless sudo works; `systemctl
  is-system-running` = running.
- **The home tree survived the replacement intact.**
  `~/workspace/ddbridge.py` still carries mtime 2026-11-09T06:31Z;
  every supervisor script, log, pidfile and the dedicated key
  (`~/.ssh/ddbridge-key`) are present. `/etc/profile.d/hatch-egress.sh`
  — a platform file, not one of ours — is present on this instance
  with the same values §4 mirrored.

**The cause, measured rather than inferred:** the VM is replaced
between lanes, and replacement restores a stock `/etc` while
preserving `~`. The §4 units lived only in `/etc`; they were true on
the 2026-11-09 instance and were never carried to any later one. The
setsid supervisors died the same deaths for the same reason in the
other direction (they live in `~` but are started by hand, and a
replaced instance starts nothing). This is the night-learn SSH
lesson in its second form: **state outside `~` does not survive; and
state inside `~` that nothing starts does not run.**

## §3 — ROUTE (A): WHAT WAS INSTALLED, AND WHY THIS FORM

The reason for disturbing the path at all: it was already down
(§2) — the install restored a dead relay, it did not interrupt a
live one.

**`/home/hatch/bootstrap-ddbridge.sh`** (new; in the persistent home
tree; idempotent) writes the §4 artefacts verbatim-in-substance and
starts them:

- `/etc/systemd/system/ddbridge-egress.env` — the profile's egress
  values (proxy `hatch-egress-proxy:3128`, CA bundle paths).
- `/etc/systemd/system/ddbridge-relay.service` — `ExecStart=
  /usr/bin/python3 /home/hatch/workspace/ddbridge.py`, `Restart=
  always`, `RestartSec=3`, output appended to the existing
  `ddbridge-relay.log`. Enabled.
- `/etc/systemd/system/ddbridge-tunnel.service` — `Restart=always`,
  enabled; see the two deviations below.
- `/etc/cron.d/ddbridge-bootstrap` — `@reboot root
  /home/hatch/bootstrap-ddbridge.sh`, so the *next* replacement
  self-heals at boot if the platform's cron runs (best effort —
  no cron daemon was active on this instance at install time, so
  this hook is a hope, not a mechanism; the real mechanism is the
  installer living in `~` plus the Gate B instruction in §5).
- Before starting the units, the installer retires any setsid
  supervisors by pidfile and by exact script name (§4's standing
  warning: a second relay cannot take :8911, a second `-R 8913`
  bind fails). Retirement notes were also appended to
  `~/workspace/ddbridge.log` and `~/workspace/ddbridge-tunnel.log`,
  where the next lane looks.

**Two deviations from §4's unit text, both measured on this
instance, both recorded here rather than smoothed:**

1. **The tunnel unit runs the supervisor script, not a direct ssh.**
   A verbatim-flags `ExecStart=/usr/bin/ssh … -o
   ProxyCommand="nc -X connect -x hatch-egress-proxy:3128 %h %p" …`
   failed in a restart loop: systemd word-splits `ExecStart` and
   passes the embedded quotes *literally* to `execvp`, so `nc`
   received the service's own name as its port argument (`nc: port
   number invalid: ddbridge-tunnel`, ssh rc=255, restart counter
   reached 10 during diagnosis). §4's instance evidently carried a
   form that worked; on this one, the robust equivalent is
   `ExecStart=/bin/sh /home/hatch/workspace/
   ddbridge-tunnel-supervise.sh` — the identical ssh invocation,
   parsed by a real shell, with the supervisor's own 3 s respawn
   loop inside the unit's `Restart=always` as a second net.
2. **The tunnel unit sets `HOME=/home/hatch` explicitly.** systemd
   does not set `HOME` for a `User=root` service here (root's home
   is `/root`); the supervisor script's `$HOME/.ssh/ddbridge-key`
   and `$HOME/workspace/ssh/oracle-known_hosts` resolved to
   `/root/…` and ssh failed host-key verification in a loop
   (`Identity file /root/.ssh/ddbridge-key not accessible` /
   `Host key verification failed`, tunnel log 16:05:28–16:05:35Z)
   until the unit pinned `HOME`. The pinned host key file itself
   is the workspace copy, per the standing rule — trust never
   moved to `/root/.ssh`.

(The relay unit needs neither fix: absolute paths throughout, no
`$HOME` in `ddbridge.py`'s own references.)

## §4 — KILL-TEST, ON THIS INSTANCE (no human in the loop)

- **Cutover verified first:** both units `enabled` + `active`;
  :8911 listening (relay MainPID 9737); Oracle :8913 `LISTEN
  127.0.0.1:8913`; **RELAY-OK PASS from Thor** (HTTP 200, real
  DeepInfra completion, content `RELAY-OK`) at 16:05:39Z.
- **Relay: MainPID 9737 SIGKILLed at 2026-11-10T16:05:56Z.**
  systemd restored the unit — new MainPID **9797**, `NRestarts=1`,
  :8911 listening again inside the 6 s observation window.
  **RELAY-OK PASS from Thor** after the kill.
- **Tunnel: ssh child pid 9741 SIGKILLed at 2026-11-10T16:06:11Z.**
  The supervisor inside the unit respawned it (new ssh pid 9831,
  unit MainPID 9739 unchanged, unit `active` throughout); Oracle
  :8913 verified re-listening. **RELAY-OK PASS from Thor** after
  the kill.
- **At close:** both units enabled + active (relay MainPID 9797,
  `NRestarts=1`; tunnel MainPID 9739), :8911 and :8913 listening,
  **RELAY-OK PASS from Thor** — the fourth PASS of the lane.

Death #13, when a process dies inside this instance's life, is a
restart counter incrementing. Across a replacement, it is one
bootstrap run (§5).

## §5 — THE (B) HALF: CORRECTION APPENDED, AND THE STANDING COST

A correction was appended to `floor/FLOOR-REPAIR-20261109.md`
(append-only; §4's original text untouched; file now 21,128 B,
tail-verified) stating: §4's claim was true only on the instance
that wrote it and false on the serving instance for days 12–17,
with every day lane's manual setsid relaunch (5-for-5 at check and
launch) as the period's actual mechanism; the measured cause (VM
replacement restores stock `/etc`, preserves `~`); the claim's
restoration on the current instance in bootstrap form (§3–§4
above); and the standing cost, restated: **within an instance, a
dead relay is a restart counter; across a replacement, one
bootstrap run plus RELAY-OK verification is the re-establishment
cost, until the runtime grows a persistent-`/etc` or home-hook
mechanism.**

## §6 — GATE B INSTRUCTION FOR DAY 18'S RUN LANE (exact)

At the Gate B relay pre-check, run `relay-check-day5.js` from Thor
as before. If it passes, also read the units' state once
(`systemctl is-active ddbridge-relay ddbridge-tunnel` on the VM):
PASS + both active = proceed, no relaunch, no supervisor pids to
hunt. If the check fails, first look for the units: units present
but a leg down → `sudo systemctl restart` the down leg only, then
re-verify RELAY-OK from Thor at check and again at launch, exactly
as before. Units ABSENT (the signature of a fresh VM replacement —
stock `/etc`, home intact) → run `sudo
/home/hatch/bootstrap-ddbridge.sh` once on the VM (≈30 s; it
reinstalls both units, the egress env and the boot hook, retires
any setsid stragglers), then verify :8911 on the VM, :8913 on
Oracle, and RELAY-OK from Thor at check and at launch. Do not
relaunch the setsid supervisors on any branch: under the units
they can only bind-fight. Record which branch the pre-check took
in the day record — a numbered relay death is now only the
cross-replacement case, and the record should say so when it is
one.
