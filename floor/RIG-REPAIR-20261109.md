# RIG REPAIR — the floor's daylight verification path (2026-11-09)

**Lane:** rig repair, Craftmind League. **Authorisation:** Casey's "build it all" (2026-11-09 15:05 AKST) + parent sequencing after the day-11 played day. **Scope as chartered and as executed: OFFLINE / FIXTURE ONLY** — no citizen wake, no live day, no changes to the standing cameraman chain, the floor's constitution (ACTS/FORBIDDEN) untouched. The day-11 contracts stand unamended.

**Why:** day 11 played and was parked at 2026-11-10T01:07:03Z by `daylight_unrestorable` although all three 01:06 landing commands demonstrably landed (record: `pulse/DIRECT-DRIVE-DAY11-PLAYED-20261109.md`). Two compounding defects: the mirror's trailing echo newline shifted every line −1 against the floor's size arithmetic (landing lines at mirror offsets 58832 / 58995 / 59158; the floor's `before` offsets exactly +1 in every case — the needle sat just outside the search slice), and a 2 s verify window after a ~2.7 s channel response.

---

## 1. The repairs, as implemented

### 1.1 THE SEARCH — look-behind with a high-water mark (`floor/floor.js`, `daylightCheckInner()`)

The old code searched `fs.readFileSync(logPath, 'utf8').slice(before)` — only bytes after the recorded offset. The repaired search never searches only the slice:

- The search window is `[before − 65536, EOF)` — a 64 KiB look-behind ending at the file's CURRENT end, so a framing shift of a few bytes in either direction can never place a landed line outside the searched region. The fix is robust to the mirror's format, not tuned to the day's +1.
- A hit is accepted only on a line whose start is at or past `daylightVerifiedFloor`, a per-process high-water offset advanced past each verified landing. One landing can therefore never satisfy two assertions, and finding an old line inside the look-behind costs nothing but a poll. (The mark resets on floor open by construction — a fresh process starts at 0; within a run it only advances.)
- A partial line at the region's start is skipped (a snapshot rewrite may begin mid-line).

### 1.2 THE MIRROR — bytes faithful (`floor/run/day11/log-mirror.sh`)

The old remote command was `tail -c $BYTES $REMOTE; echo; stat -c %s $REMOTE`, and the local side recovered the size with `tail -n 1` and stripped it with `head -n -1` — the `echo` appended one newline the real log does not have (the mirror stamp at the time read `bytes: 61449, source_size: 61448` — the +1 in plain sight), and `head -n -1` could eat log content for a log not ending in a newline. The repaired script runs `stat -c %s $REMOTE; tail -c $BYTES $REMOTE`; the capture's first line is the size and the body is the log tail VERBATIM (`tail -n +2`). **Verified live:** a refresh at 2026-11-10T01:49:42Z produced a mirror byte-identical to the Orin's tail (`cmp` passed; bytes 72,795 = source_size 72,795; no extra byte). The look-behind of §1.1 is kept anyway — defence in depth: either fix alone would have saved the day; both together close the class.

### 1.3 THE WINDOW — a contract term (`daylight_verify_window_s`)

`constitution.js` validates `daylight_verify_window_s` as an optional positive number. `floor.js` reads it from the contract; absent the term it falls back to **5000 ms**, reasoned from the measured day-11 channel responses (2.75 / 2.73 / 2.72 s — the landing line was already in the log when each response returned, so the window only has to cover the mirror's ~1 s refresh cadence plus slack), not from the old 2000 ms constant. The old `while (now() - t0 < 2000)` is gone.

**THE CONTRACT TERM THE NEXT CHARTER MUST PIN: `daylight_verify_window_s` — recommended value 5 (seconds).** A charter may widen it; it should not narrow it below the channel response it must outlast.

### 1.4 Two further defects found BY the proof battery, fixed in this lane

The proof battery (§2) caught two defects in this lane's own first patch — both are recorded here because they are the reason the battery exists in its current shape:

1. **The dropped `opId`.** The first rig-repair patch rewrote the issue line as `channel.issue({ cmd: 'chat', id, text: cmdText })` — `id` undefined (the pre-repair code read `id: opId('daylight')`). Evaluating the argument threw a ReferenceError before any request was written; the main loop's `daylightCheck().catch(() => {})` swallowed it; `asserting` stayed latched true forever. Signature: exactly one ASSERT_DAYLIGHT row, zero requests in `op-req.jsonl`, no verify, no retries, no park — a silent permanent wedge of the daylight path. (An earlier run of this lane misread that signature as a fixture op bot dying; the op bot was never the problem — zero requests were ever sent.) **Fix:** the pre-repair call restored exactly (`id: opId('daylight')`). Full diff of `floor.js.pre-rigrepair-20261109` → `floor.js` confirms this was the only unintended change in the patch; everything else in the diff is §1.1/§1.3.
2. **The guard wrapper, and its own race.** To make this failure class loud and non-latching, `daylightCheck()` is now a wrapper: it calls the worker (`daylightCheckInner()`), logs any error to stderr, and releases the `asserting` latch **on throw only**. The first version released the latch in a `finally` — which also fired on the worker's early returns, clearing the latch while another invocation held it and racing concurrent rounds (the battery's RR3 produced a garbled 10-assert sequence: attempts 1,1,1,2,1,2,3,1,2,3). The no-finally form is race-free for the same reason the original design was: the worker sets the latch synchronously before its first await, so a concurrent tick's worker early-returns without touching state. Residual noted, not fixed: the main loop still calls the check with a catch-all; the wrapper's stderr line is now the visible trace.

Battery-side defects fixed in the same pass (all in `floor/test-rigrepair.js`; pre-fix copy kept as `test-rigrepair.js.pre-idfix-20261109`): the fixture daylight interval was 240 s, which made RR1's three rounds impossible inside any case wait (the old floor's three ATTEMPTS had masqueraded as rounds) — now 4 s; RR2/RR2b-old's pass conditions were vacuous against a wedged floor (one assert row + no park passes trivially) — they now require a second round to START (only possible if round 1 completed), attempt pattern [1,1], and a real chat request on the channel file; `runCase` broke on the third assert row although the PARK lands only after that attempt's verify window — it now waits for the park when a park is the expected resolution; replay op bots are liveness-proven through the real req/res files (`opReady()`) before each case and restarted onto a clean slate.

---

## 2. Proof

### (a) REPLAY OF THE ACTUAL FAILURE — `floor/test-rigrepair.js`, RR1

The fixture preserves the day's mirror (`floor/run/rigrepair/mirror-day11-closeout.log`, snapshotted by this lane; bytes 0..59159+line are the day's own — the live mirror loop had extended the tail past the day's end before the snapshot) and byte-verifies the three landing lines at 58832 / 58995 / 59158 before running. The fixture primes the mirror to the recorded size, sanitises the day's five earlier landing lines with an equal-length issuer rename (offsets untouched), and appends the day's own lines at the day's cadence against a replay channel carrying the day's real response delays (2750 / 2730 / 2720 ms).

- **RR1-old (pre-rigrepair floor):** 3 asserts, attempts 1,2,3, PARK `daylight_unrestorable`; attempt-1 `before` = **58833 — byte-equal the day's recorded value** (attempts 2/3 run on fixture time: 58912 / 58991; the relation lineStart = before − 1 holds in every attempt). The old code misses the day, exactly as the day happened.
- **RR1-new (repaired floor):** 3 asserts, attempts **1,1,1**, NO park; befores 58833 / 58912 / 58991 — **all three of the day's landings verify on attempt 1.** The day, replayed through the repaired path, does not park.

### (b) THE STANDING BATTERIES against the patched floor — no changes to either battery

- **Floor legacy battery (`floor/test-floor.js`): 14/14 PASS** (output `floor/test-floor-output-rigrepair.txt`), including the required reproductions over real stores (deaths total 123; day-9 window 3; day-10 window 0).
- **Repair battery (`floor/test-repair.js`): 5/5 PASS** (output `floor/repair-fixture-output.txt`) — R1 the day-11 launch sequence rehearsed (lease stands through the Gate B pause; late driver reaches cycle 1, 6/6 cycles), R2 no zombie lease, R3 heartbeat-lost park at 2.98 s, R4 release stream, R5 the three distinct gate reasons.

### (c) SHIFTED-MIRROR SWEEP + COUNTER-ARMS (same battery run)

- **RR2 at −1 / −2 / −5 bytes:** landing lines starting at before−1 (39999), before−2 (39998), before−5 (39995) against `before` = 40000 — **all verify**, non-vacuously (second round starts; channel request on file).
- **RR2b-old:** the old floor verifies the UNSHIFTED landing — it was never broken everywhere, only against the shifted mirror.
- **RR2b-new:** a mirror with no landing line at all → exactly 3 attempts, then PARK `daylight_unrestorable`. The repaired floor does not verify silence.
- **RR3 (high-water discipline):** one landing satisfies exactly one round (attempts 1, then 1,2,3) and round 2 parks — the look-behind cannot re-spend a consumed landing.

**Rig-repair fixture total (`floor/rigrepair-fixture-output.txt`): 8/8 PASS.**

---

## 3. Record corrections filed with this repair

Appended to `pulse/DAY11-RIG-20261109.md` (append-only, dated, this lane): (i) the "2 s window holds with ≈0.3 s margin" conclusion is withdrawn — the margin was an artefact of the same off-by-one arithmetic; (ii) the "cameraman position-driven framing PREPARED + DRY-PROVEN" claim is corrected in scope — measured this lane on 2026-11-10 (~02:45Z): the keeper exists only in the Thor working copy (`pulse/day11/cameraman-day11-framing.py`, md5 `7d683ce8f150717049cdb9e108f0a13f`); the Orin copy of the same name is byte-identical to the original cameraman (md5 `27aaa066d5549c7390a0ffc4c39a3d93`, 0 keeper symbols); the activated `cameraman-day11-live.py` (md5 `8cda2a4f…`) is the original plus the refresh-OFF guards only. What the rig lane delivered that worked: those changeover guards. The keeper has since been built as a separate deliverable by the camera lane (`pulse/CAMERAMAN-SUBJECT-KEEPER-20261109.md`).

## 4. Open question carried, stated not invented

The exact provenance of the mirror's framing byte — the day's attempt-1 `before` (58833) sat exactly one byte past the end of the 01:02:49 line, a byte belonging to no line in the preserved file — is still not derived. The fixture reproduces it as one 0x0A byte. The repairs do not depend on the answer: the look-behind is indifferent to ±few-byte framing shifts and the mirror no longer adds bytes.

## 5. Files

- `floor/floor.js` (md5 `8ce0756292a5d9c5a624dc0051bc314e`; pre-rig-repair copy `floor.js.pre-rigrepair-20261109`; pre-idfix copy `floor.js.pre-idfix-20261109`)
- `floor/constitution.js` (md5 `ff1af204ca37186c51098628abd51bcd`; pre-rig-repair copy kept)
- `floor/run/day11/log-mirror.sh` (md5 `7d859c0cc6460b6593646da87c79435f`; pre-rig-repair copy kept)
- `floor/test-rigrepair.js` (md5 `34795126ddf87b5f614f67719bf5ffa6`; pre-idfix copy kept) + outputs `floor/rigrepair-fixture-output.txt` (8/8), `floor/test-floor-output-rigrepair.txt` (14/14), `floor/repair-fixture-output.txt` (5/5)
- Preserved evidence: `floor/run/rigrepair/mirror-day11-closeout.log`; the day's op results `floor/run/day11/op/op-res-day11.jsonl`

**Next charter owes:** pin `daylight_verify_window_s` (recommended 5). Nothing in this repair needs a live day to be true; day 12's charter is where the term gets pinned and the path gets its first live use.

*— Rig-repair lane, 2026-11-09. The world was not touched: no wake, no placement, no server commands; the standing cameraman chain was never restarted or edited.*
