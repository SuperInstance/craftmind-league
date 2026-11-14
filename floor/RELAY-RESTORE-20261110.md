# RELAY RESTORE — CROSS-REPLACEMENT DEATH #13, CLOSURE §6 UNITS-ABSENT BRANCH

Filed 2026-11-11 (run window 09:26:26Z–09:27:32Z). Authority: the relay truth
closure's Gate B instruction (RELAY-TRUTH-CLOSURE-20261109.md §6) + noticing
report #3's routed item 1 (commons/noticing/report-2026-11-10.md; league
ledger id `noticing-report-2026-11-10-final`). The restore lane executed the
filed branch; it did not design one.

## 1. The signature, confirmed on this instance BEFORE acting

- Boot: **2026-11-11T07:29:01Z**, boot_id **3ecdfcc4-b755-4ea0-9f27-573915be20dd**
  — exactly the replacement report #3 recorded. (The closure's own instance
  booted 2026-11-10T14:35:19Z, boot_id 29a3936c… — this is a SECOND
  replacement, a new instance again.)
- `systemctl is-active ddbridge-relay ddbridge-tunnel` → **inactive /
  inactive**, and `systemctl status` → **"Unit ddbridge-relay.service could
  not be found"** (both units). The units are ABSENT, not merely stopped.
- /etc is stock: no ddbridge unit files, no `ddbridge-egress.env`, no
  `/etc/cron.d/ddbridge-bootstrap`; `/etc/systemd/system` itself carries the
  boot timestamp (2026-11-11 07:29:10Z).
- Home tree INTACT: `/home/hatch/bootstrap-ddbridge.sh` present (4,665 B,
  mtime 2026-11-10 16:05 — the closure lane's installer, unmodified), and
  `~/workspace/ddbridge.py` present (mtime 2026-11-09).
- Relay down in fact: nothing listening on VM :8911; no ddbridge or tunnel
  processes; report #3's RELAY FAIL (ECONNRESET) from Thor stands as the
  pre-restore end-to-end read.

Signature MATCHES the closure's cross-replacement class in every particular.
Branch taken: **§6 units-absent**.

## 2. The act

ONE run: `sudo /home/hatch/bootstrap-ddbridge.sh`, started **09:26:26Z**,
exit 0, complete by **09:26:28Z** (~2 s wall here; the closure's ≈30 s
measure was its own instance's). No second run was needed. The bootstrap
reinstalled both unit files, the egress env file, and the boot hook, and
started both units (its own log line records units installed/enabled/started).

## 3. The four verifications, in the closure's order

1. **:8911 listening on the VM** — PASS. `ss` reads
   `LISTEN 127.0.0.1:8911`, held by python3 pid 16957 (the relay unit's
   MainPID). A local probe was answered (the bridge's HTTP greeting).
2. **:8913 listening on Oracle** — PASS. Via the established Oracle route
   (pinned host key), `ss` on Oracle reads `LISTEN 127.0.0.1:8913`.
3. **Both units active** — PASS. `systemctl is-active` → active / active;
   ddbridge-relay MainPID 16957, ddbridge-tunnel MainPID 16959, both
   ActiveState=active, NRestarts=0. Installed files verified present:
   both unit files, `ddbridge-egress.env`, `/etc/cron.d/ddbridge-bootstrap`.
4. **RELAY-OK PASS from Thor** — PASS. The Gate B end-to-end check
   (`relay-check-day5.js`, run under the nvm Node — the file is not
   executable, exit 126 on direct invocation, an invocation fact not a
   relay fact) printed at 09:27:32Z: HTTP 200, content "RELAY-OK",
   **RELAY-OK PASS**, exit 0.

## 4. Latency, priced honestly — two different numbers

- **Discovery latency: ~1 h 58 m.** Replacement 07:29:01Z → the outage
  named by noticing report #3 (filed 09:19:00Z; its run began 09:18:27Z).
  Report #3 estimated ~1¾ h; measured against its filing timestamp it is
  1 h 50 m, against the parent's dispatch of this lane ~1 h 57 m. Nothing
  read relay liveness in between — that is report #3's item 2, the
  WATCH-GAP decision, which belongs to the parent/Casey and is NOT closed
  by this filing.
- **Restore latency (the action itself): ~66 seconds**, dispatch-to-PASS:
  bootstrap start 09:26:26Z → RELAY-OK PASS 09:27:32Z. The bootstrap's own
  run was ~2 s; the remainder is verification. Total replacement→restored:
  **1 h 58 m 31 s**, of which all but ~66 s is the discovery gap.

## 5. Series accounting

This is **cross-replacement death #13** in the class as redefined by the
closure (RELAY-TRUTH-CLOSURE-20261109.md): the twelve hand-recovered deaths,
then this one — the FIRST since the closure, and the first the filed
mechanism has restored. Within-instance supervision was never the failure:
the units did not die, they were never on this instance. The restore cost
was exactly what the closure priced: one bootstrap run + RELAY-OK
verification. No kill-test was run in this lane — the closure's kill-proofs
stand on its instance, and a restore filing does not re-litigate them; the
next Gate B reads the units' state as §6 directs.

## 6. Deviations from the closure's prediction

**None of substance.** Every element of the predicted signature was present
and every step of the priced restore behaved as filed. Two incidental
observations, neither a deviation in the mechanism: (a) the bootstrap
completed in ~2 s against the closure's ≈30 s measure — instance variance,
noted so a future lane does not read a fast run as a skipped step (the
four verifications above are the completeness proof, not the clock);
(b) neither of the closure's two measured deviations (ProxyCommand quoting;
HOME pinning) re-presented — the installer as left by the closure lane
already embodies both fixes, and both units came up clean on the first
start (NRestarts=0).

## 7. State at close

Relay UP and verified end-to-end from Thor. Both units enabled + active on
this instance; the installer remains in the persistent home tree; the boot
hook is reinstalled (best-effort, as the closure filed it — no cron daemon
was checked or claimed here). Day 18's Gate B will find the §6 first branch
(units present, check passes) if this instance survives, or this filing's
branch again if it does not. The watch-gap decision (report #3 item 2)
remains open and is the parent's.
